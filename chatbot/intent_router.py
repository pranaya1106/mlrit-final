"""
Intelligent Intent Router — classifies a message into a single coarse intent
label BEFORE any retrieval/LLM work happens, purely from cheap regex/keyword
checks (no ML, no embeddings). This does not replace the existing, carefully
tuned per-category handlers in chatbot.py (HOD lookup, faculty lookup,
navigation-first, structured topics, ...) — those still own the actual
response for the categories they already cover. IntentRouter instead:

  1. Gives every request a labelled `intent` for telemetry / query_type, and
  2. Drives the dynamic-retrieval decisions in rag_engine.py / hybrid_retriever.py
     (top_k, candidate_k, which retrieval channels to run, whether to force
     the cross-encoder) for the minority of messages that DO fall through to
     hybrid RAG — see INTENT_RETRIEVAL_PROFILE below.

Classification is intentionally conservative: only messages that clearly ask
for one of these more expensive categories fall out of "general_rag"/
"comparison". Ambiguous or already-otherwise-handled fast paths (entity
lookups, navigation, structured topics) still run through their own existing
logic first; if they claim the message, IntentRouter's classification is
never even used to answer it — the label is just carried along for logging.
"""
import re
from typing import List, Optional, Dict

from query_router import DEPARTMENT_KEYWORDS, GREETING_PATTERNS, CANONICAL_ROUTE_SYNONYMS

COMPARISON_MARKERS = re.compile(
    r"\b(compare|comparison|versus|vs\.?|difference between|better than|"
    r"pros and cons|advantages and disadvantages)\b"
)

INTENT_KEYWORDS: Dict[str, List[str]] = {
    "faculty": ["faculty", "professor", "lecturer", "teaches", "teacher", "staff"],
    "hod": ["hod", "head of department", "head of the department"],
    "admissions": ["admission", "admissions", "apply", "eligibility", "eamcet", "eapcet", "counselling", "counseling"],
    "placements": ["placement", "placements", "recruiter", "recruiters", "package", "salary", "internship"],
    "fees": ["fee", "fees", "scholarship", "scholarships"],
    "hostel": ["hostel", "hostels", "mess", "warden"],
    "transport": ["transport", "bus", "bus route", "route number"],
    "labs": ["lab", "labs", "laboratory", "laboratories", "equipment"],
    "clubs": ["club", "clubs", "society", "chapter"],
    "news": ["news", "chronicle", "chronicles", "announcement", "notification"],
    "search": ["search for", "find page", "look up"],
}

NAVIGATION_VERBS = re.compile(r"\b(go to|take me|navigate|open|show me|visit|redirect|bring me)\b")


class IntentRouter:
    """Cheap, regex-only intent classifier — see module docstring."""

    def classify(self, message: str, conversation_history: Optional[List[dict]] = None) -> str:
        text = (message or "").strip()
        if not text:
            return "general_rag"
        q = text.lower()

        cleaned = re.sub(r"[^a-z\s]", "", q).strip()
        cleaned = re.sub(r"\s+", " ", cleaned)
        if cleaned in GREETING_PATTERNS:
            return "greeting"

        if text.count("?") >= 2:
            return "multi_part"

        if COMPARISON_MARKERS.search(q):
            return "comparison"

        if NAVIGATION_VERBS.search(q):
            return "navigation"

        for phrase in INTENT_KEYWORDS["search"]:
            if phrase in q:
                return "search"

        if any(re.search(r'\b' + re.escape(k) + r'\b', q) for k in INTENT_KEYWORDS["hod"]):
            return "hod"

        if any(re.search(r'\b' + re.escape(k) + r'\b', q) for k in INTENT_KEYWORDS["faculty"]):
            return "faculty"

        # Department mention without any more-specific topic keyword above -> department intent.
        has_dept = any(re.search(r'\b' + re.escape(k) + r'\b', q) for k in DEPARTMENT_KEYWORDS)

        for intent in ("admissions", "placements", "fees", "hostel", "transport", "labs", "clubs", "news"):
            if any(re.search(r'\b' + re.escape(k) + r'\b', q) for k in INTENT_KEYWORDS[intent]):
                return intent

        # A canonical topic word ("research", "examinations", "library", ...)
        # names a content TOPIC, not a request to navigate there — actual
        # navigation intent was already decided above via NAVIGATION_VERBS.
        # Only fall through to one of our own more specific labels when the
        # topic maps to one; otherwise it's an ordinary informational question.
        for route_key, phrases in CANONICAL_ROUTE_SYNONYMS.items():
            if route_key not in INTENT_KEYWORDS:
                continue
            for phrase in phrases:
                if re.search(r'\b' + re.escape(phrase) + r'\b', q):
                    return route_key

        if has_dept:
            return "department"

        return "general_rag"


# Dynamic retrieval profile per intent — consumed by rag_engine.answer_with_rag.
# top_k: how many chunks to hand to the LLM as context.
# candidate_k: how many fused candidates to pull before ranking (bounded by
# HYBRID_CANDIDATE_K — this is a ceiling, not an override upward).
# force_rerank: always run the cross-encoder regardless of the simple-intent bypass.
INTENT_RETRIEVAL_PROFILE: Dict[str, Dict] = {
    "faculty": {"top_k": 1, "candidate_k": 4, "force_rerank": False},
    "hod": {"top_k": 1, "candidate_k": 4, "force_rerank": False},
    "department": {"top_k": 2, "candidate_k": 6, "force_rerank": False},
    "comparison": {"top_k": 8, "candidate_k": 15, "force_rerank": True},
    "multi_part": {"top_k": 6, "candidate_k": 12, "force_rerank": False},
}
DEFAULT_RETRIEVAL_PROFILE = {"top_k": 4, "candidate_k": 8, "force_rerank": False}


def get_retrieval_profile(intent: Optional[str]) -> Dict:
    return INTENT_RETRIEVAL_PROFILE.get(intent, DEFAULT_RETRIEVAL_PROFILE)
