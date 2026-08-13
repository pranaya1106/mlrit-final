import asyncio
import os
import logging
import re
import time
import difflib
from collections import OrderedDict
from typing import List, Dict, Any, Optional, Tuple

from config import (
    CHROMA_PERSIST_DIR,
    PDF_DIR,
    EMBEDDING_MODEL,
    WEBSITE_ROUTES,
    COLLEGE_INFO,
    HOD_INFO,
    BM25_INDEX_PATH,
    INDEX_MANIFEST_PATH,
    HYBRID_CANDIDATE_K,
)
from vector_store import VectorStore
from rag_engine import RAGEngine
from query_router import (
    QueryRouter,
    match_canonical_route,
    detect_pure_navigation,
    DEPARTMENT_KEYWORDS,
    MLRIT_SELF_REFERENCES,
    OFF_TOPIC_PATTERNS,
)
from structured_topics import detect_structured_topic, build_structured_response
from website_content import detect_website_topic, summarize_website_content, get_page_text, summarize_website_topics_batch
from administration_directory import AdministrationDirectory
from scenario_intent import ScenarioIntentDetector, is_prediction_trigger
import eamcet_cutoffs
from hybrid_retriever import BM25Index, HybridRetriever
from index_manifest import compute_file_hash, save_manifest
from pdf_processor import scan_pdfs
from entity_registry import EntityRegistry
from intent_router import IntentRouter, get_retrieval_profile
from indexes.faculty_index import FacultyIndex
from indexes.syllabus_index import SyllabusIndex
from indexes.department_index import DepartmentIndex
from indexes.placement_index import PlacementIndex
from indexes.campus_index import CampusIndex
from data_paths import validate_data_files
from profiler import RequestProfiler, get_noop_profiler, REQUEST_PIPELINE_STAGES

logger = logging.getLogger(__name__)

NAVIGATION_FRIENDLY_NAMES = {
    "home": "Home Page",
    "admissions": "Admissions Page",
    "placements": "Placements Page",
    "faculty": "Faculty Page",
    "contact": "Contact Us Page",
    "fees": "Fee Structure Page",
    "scholarships": "Scholarships Page",
    "cse": "CSE Department",
    "ece": "ECE Department",
    "eee": "EEE Department",
    "it": "IT Department",
    "csit": "CSIT Department",
    "mechanical": "Mechanical Engineering Department",
    "aeronautical": "Aeronautical Engineering Department",
    "aiml": "AIML Department",
    "cse-cs": "CSE (Cyber Security) Department",
    "cse-ds": "CSE (Data Science) Department",
    "mba": "MBA Department",
    "freshman": "Freshman Department",
    "naac": "NAAC Accreditation Page",
    "nirf": "NIRF Rankings Page",
    "research": "Research Page",
    "sports": "Sports Facilities Page",
    "hostel": "Hostel Facilities Page",
    "library": "Library Page",
    "transport": "Transport Facility Page",
    "events": "Events Page",
    "alumni": "Alumni Page",
    "careers": "Careers Page",
    "chronicles": "Chronicles Page",
    "academics": "Academics Page",
    "iqac": "IQAC Page",
    "clubs": "Clubs Page",
    "about": "About Page",
    "principal": "Principal's Message Page",
    "departments": "Departments Page",
}

# ─── Context-Aware Department Topic Follow-up ──────────────────────────────
# Bare topic words that, right after a department was established in the
# conversation, should resolve to THAT department's RAG-backed content
# instead of a generic MLRIT-wide answer or nothing at all. See the
# "Context-Aware Department Topic Follow-up" block in _route_message.
CONTEXT_DEPT_RAG_TOPICS = {
    "placement": "placements", "placements": "placements",
    "curriculum": "curriculum",
    "research": "research achievements",
    "achievement": "achievements", "achievements": "achievements",
}

# ─── Contextual Follow-up Suggestions ───────────────────────────────────────
# Applied once, centrally, in chat() — never duplicated per-handler. The
# LLM-backed website-content summaries are explicitly instructed NOT to write
# their own closing question (see website_content.py's system prompt), so
# this is the single place that decides what to suggest next, topic by topic,
# instead of a generic/repetitive/sales-y LLM-invented line.
FOLLOWUP_SUGGESTIONS = {
    "placements": ["recruiters", "placement statistics", "internships", "training"],
    "admissions": ["scholarships", "fees", "eligibility", "documents required"],
    "fees": ["scholarships", "the admission process"],
    "scholarships": ["eligibility criteria", "the fee structure"],
    "research": ["ongoing research projects", "innovation and incubation support", "faculty publications"],
    "innovation": ["research at MLRIT", "the incubation cell", "startup support"],
    "hostel": ["mess", "transport", "campus life"],
    "library": ["library timings", "digital and e-resource access"],
    "cafeteria": ["hostel dining", "campus facilities", "student life"],
    "sports": ["sports facilities", "student clubs", "annual events"],
    "clubs": ["how to join a club", "upcoming events", "the coding or robotics club"],
    "transport": ["bus routes", "tracking", "transport facilities", "hostel"],
    "examinations": ["academic regulations", "the exam schedule", "attendance requirements"],
    "iqac": ["accreditation details", "current rankings", "research at MLRIT", "placements"],
}
DEPARTMENT_ROUTE_KEYS = {
    "cse", "ece", "eee", "it", "csit", "mechanical", "aeronautical",
    "aiml", "cse-cs", "cse-ds", "mba",
}
DEPARTMENT_FOLLOWUPS = ["faculty", "laboratories", "curriculum", "placements", "research"]

CAPABILITIES_ANSWER = (
    "I can help you with:\n\n"
    "- **Admissions** — eligibility, EAMCET/ECET, management quota, documents, counselling\n"
    "- **Placements** — statistics, recruiters, training, eligibility\n"
    "- **Departments** — CSE, ECE, EEE, Mechanical, Aeronautical, AIML, MBA, and more\n"
    "- **Faculty & HODs** — department faculty, specializations\n"
    "- **Research** — labs, publications, IQAC/NAAC/NBA/NIRF\n"
    "- **Scholarships & Fees**\n"
    "- **Campus Life** — hostel, library, transport, clubs, events, sports\n"
    "- **Academic Calendar & Examinations**\n"
    "- **Navigation** — I can take you directly to any page on the website\n"
    "- **Course Recommendation & Branch Selection** — tell me what interests you and I'll suggest a department\n"
    "- **Career Guidance** — placement trends, package expectations\n\n"
    "Just ask naturally — e.g. \"Which department should I choose?\" or \"Tell me about placements.\""
)


class CollegeAssistant:
    """Main orchestrator for the MLRIT College AI Assistant."""

    def __init__(self):
        logger.info("Initializing CollegeAssistant...")
        # Deployment-safety check: reports any known frontend data file (lib/*.ts,
        # select app/*/page.tsx) that's missing under FRONTEND_ROOT, and which
        # feature it powers, before any index/directory below tries to read one.
        validate_data_files()
        self.vector_store = None
        self.rag_engine = None
        self.query_router = QueryRouter()
        from labs_directory import LabsDirectory
        self.labs_directory = LabsDirectory()
        self.administration_directory = AdministrationDirectory()
        self.scenario_intent = ScenarioIntentDetector()

        # ─── Phase 2: fast (O(1)/dict-lookup) knowledge indexes ────────────
        # Built once, entirely in-memory, from the real frontend data files —
        # never embedded into ChromaDB. Supersedes the old faculty_directory.py,
        # which parsed lib/dept-data.ts's `faculty` arrays; those are empty in
        # every department, so that module silently returned zero results.
        self.faculty_index = FacultyIndex()
        self.syllabus_index = SyllabusIndex()
        self.department_index = DepartmentIndex()
        self.placement_index = PlacementIndex()
        self.campus_index = CampusIndex()

        # COLLEGE_INFO is a shared dict imported by config.py, scenario_intent.py,
        # rag_engine.py, and this module — previously each carried its own
        # hardcoded placement_rate/highest_package figures that could (and did)
        # drift out of sync with the real lib/placements.ts data. Mutating it
        # once here, from PlacementIndex (the actual source of truth), makes
        # every one of those readers report the same figures without needing
        # to touch each of them individually.
        if self.placement_index.placement_rate:
            COLLEGE_INFO["placement_rate"] = self.placement_index.placement_rate
        _highest = self.placement_index.highest_package()
        if _highest is not None:
            COLLEGE_INFO["highest_package"] = f"{_highest:g} LPA"

        self.entity_registry, self.entity_regex = self._build_entity_registry()
        # Universal Entity Registry — fuzzy/partial/abbreviation resolution over
        # every navigable entity (departments, HODs, faculty, labs, office roles,
        # topic pages), reusing the same label->url map built above. Sits as a
        # catch-all safety net right before the Scope Gate decline / general RAG
        # path — see _route_message.
        self.universal_entity_registry = EntityRegistry(self.entity_registry, self.administration_directory)
        self.intent_router = IntentRouter()

        # ─── Response Cache ─────────────────────────────────────────────────
        # Stateless (no-conversation-history) questions are cached in-memory,
        # keyed by the normalized message. Frequently repeated factual/entity
        # questions ("placements", "who is the CSE HOD") are then answered
        # without re-running routing, retrieval, or any LLM call at all.
        self._response_cache: "OrderedDict[str, Tuple[Dict[str, Any], float]]" = OrderedDict()
        self._CACHE_TTL_SECONDS = 600
        self._CACHE_MAX_ENTRIES = 500

        self._initialize_components()

    def _build_entity_registry(self):
        """
        Builds a single label -> URL lookup of every navigable entity the assistant
        already knows a real destination for — departments and topic pages (from
        WEBSITE_ROUTES), faculty/HODs (from HOD_INFO and the faculty directory) and
        laboratories (from the labs directory, linked to their owning department's
        labs section).

        This is the ONLY place entity navigation data is assembled. There is no
        per-category ("if faculty do X, if department do Y") branching anywhere
        else — any answer that happens to mention 2+ of these labels gets them
        linkified automatically by `_attach_entities`, and any current or future
        entity type becomes navigable just by adding its data source here.
        """
        registry: Dict[str, str] = {}

        # Route keys that are too generic/ambiguous as standalone words to safely
        # auto-link (e.g. "home", "search") — everything else in WEBSITE_ROUTES is
        # a real, specific destination and fair game.
        skip_keys = {"home", "search", "ug", "pg", "departments", "faculty"}
        acronyms = {"iqac", "naac", "nirf", "nba"}
        for key, url in WEBSITE_ROUTES.items():
            if key in skip_keys:
                continue
            if key in acronyms:
                label = key.upper()
            elif "-" in key or key in {"cse", "ece", "eee", "aiml", "mba"}:
                label = key.upper()
            else:
                label = key.capitalize()
            registry.setdefault(label, url)

        # Faculty & HODs — reuse the same name/url data used for direct lookups.
        for info in HOD_INFO.values():
            if info.get("name") and info.get("url"):
                registry.setdefault(info["name"], f"{info['url']}#all-faculty")
        for person in self.faculty_index.records:
            if person.get("name") and person.get("slug"):
                registry.setdefault(person["name"], f"/faculty/{person['slug']}")

        # Laboratories — link to the owning department's labs section, but only
        # for departments that already have a live route.
        for dept_key, labs in self.labs_directory.directory.items():
            if dept_key not in WEBSITE_ROUTES:
                continue
            lab_url = f"{WEBSITE_ROUTES[dept_key]}#labs"
            for lab in labs:
                if lab.get("name"):
                    registry.setdefault(lab["name"], lab_url)

        if not registry:
            return registry, None

        # Longest-label-first so overlapping labels (e.g. "CSE" vs "CSE-DS") match correctly.
        # Boundaries also exclude '-' (not just \w) so "CSE" doesn't falsely match inside an
        # unrelated hyphenated token like "CSE-CS".
        labels = sorted(registry.keys(), key=len, reverse=True)
        pattern = r"(?<![\w-])(?:" + "|".join(re.escape(l) for l in labels) + r")(?![\w-])"
        return registry, re.compile(pattern)

    @staticmethod
    def _build_faculty_answer(matches: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Shared formatter for a faculty-name match — a single confident hit
        gets a full profile card, multiple hits get a pickable list. Used by
        both the direct Faculty Lookup intercept and the Scope Gate fuzzy
        safety net so both paths render identically."""
        if len(matches) == 1:
            person = matches[0]
            answer = f"**{person['name']}** is a **{person['designation']}** in the **{person['department'].upper()} Department** at MLRIT.\n\n"
            if person.get("specialization"):
                answer += f"- **Specialization**: {', '.join(person['specialization'])}\n"
            if person.get("qualifications"):
                answer += f"- **Qualifications**: {', '.join(person['qualifications'])}\n"
            if person.get("email"):
                answer += f"- **Email**: {person['email']}\n"
            answer += "\nClick below to view their full faculty profile."

            return {
                "answer": answer,
                "sources": [{
                    "file": "Faculty Index",
                    "page": 1,
                    "department": person["department"].upper(),
                    "snippet": f"{person['name']} - {person['designation']}"
                }],
                "navigation_target": None,
                "navigation_url": f"/faculty/{person['slug']}",
                "confidence": 1.0,
                "query_type": "department",
            }

        answer = "I found multiple faculty members matching your search:\n\n"
        for person in matches[:10]:
            answer += f"- **{person['name']}** — {person['designation']} (**{person['department'].upper()}**)\n"
        answer += "\nClick a name above to open their full profile."

        first_person = matches[0]
        return {
            "answer": answer,
            "sources": [],
            "navigation_target": None,
            "navigation_url": f"/faculty/{first_person['slug']}",
            "confidence": 1.0,
            "query_type": "department",
        }

    def _find_department_entities(self, text: str) -> List[Dict[str, str]]:
        """
        Finds mentions of department *overview pages* (not faculty/labs anchors) in
        plain text, reusing the existing entity registry — for responses that already
        name specific departments (e.g. "Which departments have AI courses?" -> CSE,
        AIML) so they can be made clickable via the existing Universal Entity
        Navigation instead of showing the generic UG/PG picker.
        """
        if not text or not self.entity_regex:
            return []
        found = {}
        for m in self.entity_regex.finditer(text):
            label = m.group(0)
            url = self.entity_registry.get(label)
            if url and url.startswith("/departments/") and "#" not in url:
                found.setdefault(label, url)
        return [{"label": label, "url": url} for label, url in found.items()]

    def _infer_context_department(
        self, conversation_history: List[Dict[str, str]], profiler=None
    ) -> Optional[str]:
        """
        Looks back through the most recent user turns for a department the
        conversation was already about, so an ambiguous one-word follow-up (e.g.
        "What laboratories are available?" right after "Tell me about CSE.") can
        inherit it. Only ever consulted when the current message alone doesn't name
        a department — an explicit department in the current message always wins.
        """
        profiler = profiler or get_noop_profiler()
        with profiler.stage("Context"):
            for turn in reversed(conversation_history):
                if turn.get("role") != "user":
                    continue
                dept = self.query_router.extract_department(turn.get("content", ""))
                if dept:
                    return dept.lower().replace(" ", "-")
            return None

    def _infer_context_route(
        self, conversation_history: List[Dict[str, str]], profiler=None
    ) -> Tuple[Optional[str], Optional[str]]:
        """
        Looks back through the most recent user turns for a topic (admissions,
        placements, research, examinations, a department, ...) the conversation was
        already about, so an ambiguous follow-up can inherit its navigation target.
        Returns (nav_target, nav_url) — both None if nothing is found. Only ever
        consulted when the current message resolves nothing on its own.
        """
        profiler = profiler or get_noop_profiler()
        with profiler.stage("Context"):
            for turn in reversed(conversation_history):
                if turn.get("role") != "user":
                    continue
                text = turn.get("content", "")
                text_lower = text.lower()
                canonical = match_canonical_route(text_lower)
                if canonical and canonical != "departments" and canonical in WEBSITE_ROUTES:
                    return canonical, WEBSITE_ROUTES[canonical]
                dept = self.query_router.extract_department(text)
                if dept:
                    dept_key = dept.lower().replace(" ", "-")
                    if dept_key in WEBSITE_ROUTES:
                        return dept_key, WEBSITE_ROUTES[dept_key]
            return None, None

    def _attach_entities(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scans the final answer text for mentions of known navigable entities
        (see `_build_entity_registry`). When 2+ distinct entities are mentioned,
        replaces the single navigation button with individually clickable entity
        links — otherwise the response (and its existing single-entity Smart
        Action navigation) is left untouched.
        """
        if result.get("_skip_entity_scan"):
            return result

        answer = result.get("answer")
        if not answer or not self.entity_regex:
            return result

        # Only bullet-list lines count as an enumerated entity — this is the shape
        # every genuine list response takes (HOD lists, faculty matches, department
        # lists, lab lists, ...) regardless of category. An entity mentioned once in
        # passing inside ordinary prose (e.g. a single-department answer that refers
        # to a related facility) must never downgrade a normal single-entity answer,
        # so free-flowing text is intentionally not scanned here.
        seen = {}
        for line in answer.splitlines():
            stripped = line.strip()
            if not (stripped.startswith("- ") or stripped.startswith("* ")):
                continue
            match = self.entity_regex.search(stripped)
            if match:
                seen.setdefault(match.group(0), self.entity_registry[match.group(0)])

        if len(seen) > 1:
            result = dict(result)
            result["entities"] = [{"label": label, "url": url} for label, url in seen.items()]
            result["navigation_target"] = None
            result["navigation_url"] = None

        return result

    async def chat(
        self,
        message: str,
        session_id: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        profiler: Optional[RequestProfiler] = None,
    ) -> Dict[str, Any]:
        """
        Public entry point — splits genuinely multi-part questions (e.g. "I got 25000
        rank. Can I get CSE? What is the fee?") into independently-routed sub-answers,
        merges them, then applies universal entity linkification and contextual
        follow-up suggestions. Single-part messages take the exact same path as before
        (one _route_message call), so this adds no overhead for the common case.

        Stateless questions (no conversation_history — a fresh ask with no prior
        context to disambiguate against) are served from an in-memory response
        cache when an identical question was answered recently, skipping routing,
        retrieval and any LLM call entirely.

        `profiler` (see profiler.py, Phase 1 instrumentation) is optional — callers
        that don't pass one (e.g. existing tests, direct callers) get a no-op that
        costs nothing and changes nothing about the response. When ENABLE_PROFILING
        is set, main.py passes a real RequestProfiler here and this method prints
        its report once routing completes.
        """
        profiler = profiler or RequestProfiler(query=message)

        cache_key = None
        if not conversation_history:
            cache_key = re.sub(r"\s+", " ", message.strip().lower())
            cached = self._cache_get(cache_key)
            if cached is not None:
                logger.info(f"[Session: {session_id}] Response cache hit for '{message[:60]}'")
                profiler.finalize(REQUEST_PIPELINE_STAGES)
                profiler.report()
                return dict(cached)

        # ─── EAMCET/Admission-Rank Priority ─────────────────────────────────────────
        # Rank + category + gender + branch are frequently spread across separate
        # sentences ("I got 18000 rank in EAMCET. I am male OC. Can I get CSE?").
        # The generic multi-part splitter below treats each sentence as an
        # independently-routed sub-question, which would scatter that context and
        # either produce three disconnected "please tell me X" prompts or let an
        # unrelated fragment ("Which departments can I get?") fall through to
        # generic RAG/Groq, which has no cutoff data and would have to invent an
        # eligibility claim to answer at all. So: if the WHOLE message reads as a
        # rank-prediction query, hand it to scenario_intent as one unsplit string
        # (regex .search finds rank/branch/category/gender anywhere in it, not
        # just in one sentence) and skip splitting/RAG entirely for this message.
        sub_queries = None
        if is_prediction_trigger(message):
            with profiler.stage("Scenario Advisory"):
                priority_result = self.scenario_intent.detect(message, conversation_history)
            if priority_result:
                priority_result.pop("scenario_category", None)
                result = priority_result
                with profiler.stage("Response Format"):
                    result = self._attach_entities(result)
                    result = self._append_followups(result, message)
                if cache_key is not None:
                    self._cache_set(cache_key, result)
                profiler.finalize(REQUEST_PIPELINE_STAGES)
                profiler.report()
                return result

        sub_queries = self._split_into_subquestions(message)
        if sub_queries:
            logger.info(f"[Session: {session_id}] Multi-part question split into {len(sub_queries)} parts: {sub_queries}")
            # Each part needs a department/topic named in an EARLIER part of this
            # same message (e.g. "Tell me about AIML." in "Tell me about AIML. Who
            # is the HOD? What labs?") visible via _infer_context_department /
            # _infer_context_route — otherwise "Who is the HOD?" and "What labs?"
            # would see no department and fall back to the full HOD list / wrong
            # department. Both of those only ever scan `role == "user"` turns (see
            # their definitions above), so every part's user-history slice can be
            # built eagerly, up front, without waiting for any other part's answer
            # — which lets all parts route (and hit Groq, if they do) concurrently
            # instead of strictly one-after-another. Only user turns are threaded
            # through: a later part no longer sees an EARLIER part's *assistant*
            # answer as prior chat turns (it did when this ran sequentially) — see
            # docs/CHATBOT_AND_SEARCH_README.md / Phase 2 optimization notes for
            # that trade-off.
            base_history = list(conversation_history or [])
            per_part_history = []
            for i in range(len(sub_queries)):
                per_part_history.append(base_history + [{"role": "user", "content": q} for q in sub_queries[:i]])

            profiler.count("Sub-Questions Detected", len(sub_queries))

            # Phase 3 (multi-question batching): every part still routes/retrieves
            # independently (routing logic, retrieval quality unchanged), but
            # `defer_llm=True` means a part that would need a Website Content
            # summary or department-scoped RAG answer comes back as a
            # "_deferred_kind" marker (context/sources already fetched, answer
            # text withheld) instead of making its own Groq call. Everything else
            # (deterministic fast paths, general/navigation/overview RAG, which
            # stay ungrouped — see _route_message's docstring) resolves fully here,
            # same as Phase 2.
            raw_results = await asyncio.gather(*(
                self._route_message(q, session_id, per_part_history[i], profiler=profiler, defer_llm=True)
                for i, q in enumerate(sub_queries)
            ))

            finished: List[Optional[Dict[str, Any]]] = [None] * len(raw_results)
            website_group: List[int] = []
            dept_groups: Dict[Optional[str], List[int]] = {}
            for i, r in enumerate(raw_results):
                kind = r.get("_deferred_kind")
                if kind == "website":
                    website_group.append(i)
                elif kind == "dept_rag":
                    dept_groups.setdefault(r["_department_key"], []).append(i)
                else:
                    finished[i] = r

            # One Groq call for every website-content sub-question in this
            # message combined (regardless of topic — this is exactly the
            # "placements? fee structure?" example from the Phase 3 brief).
            if website_group:
                entries = [
                    (raw_results[i]["_topic_key"], raw_results[i]["_query"], raw_results[i]["_page_text"])
                    for i in website_group
                ]
                web_answers = await summarize_website_topics_batch(entries, self.rag_engine.llm, profiler=profiler)
                for i, ans in zip(website_group, web_answers):
                    finished[i] = ans if ans is not None else {
                        "answer": "I'm having trouble finding that information right now. Please try again in a moment.",
                        "sources": [], "navigation_target": None, "navigation_url": None,
                        "confidence": 0.0, "query_type": "general",
                    }

            # One Groq call per DISTINCT department shared by 2+ department-scoped
            # sub-questions (e.g. "Tell me about ECE. Who are the faculty?" — both
            # resolve to department=ECE and merge; a question about a DIFFERENT
            # department never merges with this one, since that would mean
            # combining genuinely different retrieval contexts).
            for dept_key, idxs in dept_groups.items():
                items = [{"query": raw_results[i]["_query"], "context": raw_results[i]["_context"]} for i in idxs]
                conv_hist = per_part_history[idxs[0]]
                answers = await self.rag_engine.generate_batched_answers(items, conv_hist, profiler=profiler)
                for i, ans in zip(idxs, answers):
                    r = raw_results[i]
                    finished[i] = {
                        "answer": ans,
                        "sources": r["sources"],
                        "navigation_target": r["navigation_target"],
                        "navigation_url": r["navigation_url"],
                        "confidence": r["confidence"],
                        "query_type": r["query_type"],
                    }

            result = self._merge_multi_part_results(finished)
        else:
            result = await self._route_message(message, session_id, conversation_history, profiler=profiler)

        with profiler.stage("Response Format"):
            result = self._attach_entities(result)
            # For a multi-part message, judge "what was just asked" from its LAST part —
            # that's what the appended navigation/follow-ups are actually keyed off of.
            followup_context = sub_queries[-1] if sub_queries else message
            result = self._append_followups(result, followup_context)

        if cache_key is not None:
            self._cache_set(cache_key, result)

        profiler.finalize(REQUEST_PIPELINE_STAGES)
        profiler.report()
        return result

    def chat_stream(
        self,
        message: str,
        session_id: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        profiler: Optional[RequestProfiler] = None,
    ):
        """
        Streaming Responses — a plain (synchronous) generator consumed by the
        /chat/stream endpoint via Starlette's iterate_in_threadpool. Runs the
        exact same routing as chat() (_route_message, unchanged), but wherever
        that hits a real LLM call it forwards tokens through `on_token` as they
        arrive instead of blocking until the full answer is ready — fast paths
        (entity/structured/navigation/cached answers) are already instant and
        emit no token events, only the final "done" payload.

        Not wired into the multi-part-question split or the response cache
        (chat()'s two extra layers) — a streamed answer is inherently a live,
        single-shot generation, and multi-part questions are conversational
        edge cases; both still work correctly through the regular non-streaming
        chat() endpoint.

        Yields dicts:
          {"type": "token", "text": "..."}                          — zero or more
          {"type": "done", "answer": ..., "sources": ..., "navigation_target": ...,
           "navigation_url": ..., "confidence": ..., "query_type": ..., "entities": [...]}
        """
        import asyncio
        import queue as queue_mod
        import threading

        conversation_history = conversation_history or []
        profiler = profiler or RequestProfiler(query=message)
        q: "queue_mod.Queue" = queue_mod.Queue()
        SENTINEL = object()
        final_result: Dict[str, Any] = {}

        def on_token(piece: str) -> None:
            q.put({"type": "token", "text": piece})

        def worker() -> None:
            try:
                result = asyncio.run(
                    self._route_message(message, session_id, conversation_history, on_token=on_token, profiler=profiler)
                )
                with profiler.stage("Response Format"):
                    result = self._attach_entities(result)
                    result = self._append_followups(result, message)
                final_result.update(result)
            except Exception as e:
                logger.error(f"[Session: {session_id}] chat_stream worker failed: {e}", exc_info=True)
                final_result.update({
                    "answer": "I'm sorry, something went wrong while generating a response. Please try again.",
                    "sources": [], "navigation_target": None, "navigation_url": None,
                    "confidence": 0.0, "query_type": "general",
                })
            finally:
                profiler.finalize(REQUEST_PIPELINE_STAGES)
                profiler.report()
                q.put(SENTINEL)

        threading.Thread(target=worker, daemon=True, name=f"chat-stream-{session_id}").start()

        while True:
            item = q.get()
            if item is SENTINEL:
                break
            yield item

        yield {
            "type": "done",
            "answer": final_result.get("answer", ""),
            "sources": final_result.get("sources", []),
            "navigation_target": final_result.get("navigation_target"),
            "navigation_url": final_result.get("navigation_url"),
            "entities": final_result.get("entities", []),
            "confidence": final_result.get("confidence", 1.0),
            "query_type": final_result.get("query_type", "general"),
        }

    def _cache_get(self, key: str) -> Optional[Dict[str, Any]]:
        entry = self._response_cache.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if time.monotonic() > expires_at:
            self._response_cache.pop(key, None)
            return None
        # Refresh recency for the simple FIFO/LRU-ish eviction below.
        self._response_cache.move_to_end(key)
        return value

    def _cache_set(self, key: str, value: Dict[str, Any]) -> None:
        self._response_cache[key] = (value, time.monotonic() + self._CACHE_TTL_SECONDS)
        self._response_cache.move_to_end(key)
        while len(self._response_cache) > self._CACHE_MAX_ENTRIES:
            self._response_cache.popitem(last=False)

    @staticmethod
    def _split_into_subquestions(message: str) -> Optional[List[str]]:
        """
        Conservatively detects a genuinely multi-part message and splits it into
        independent sub-questions. Deliberately narrow — requires at least one '?' in
        the message (a strong multi-intent signal) so ordinary run-on single-intent
        sentences are never split. Returns None (no split) for anything else, so the
        normal single-message path is unaffected.
        """
        if message.count("?") < 1:
            return None
        parts = [p.strip() for p in re.split(r"(?<=[.?!])\s+", message) if p.strip()]
        meaningful = [p for p in parts if len(p.split()) >= 2]
        if len(meaningful) < 2 or len(meaningful) > 4:
            return None
        return meaningful

    @staticmethod
    def _merge_multi_part_results(results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Combines independently-routed sub-answers into one response. Navigation
        target/url is taken from the LAST part that resolved one — usually the most
        specific/actionable ask in a multi-part question.

        Sub-questions can independently trigger the same handler (e.g. "I got 25000
        rank." and "Can I get CSE?" both match the rank-prediction scenario), which
        would otherwise duplicate the same closing paragraph twice in the merged
        answer. Near-duplicate answers are collapsed here, keeping whichever
        version is longer/more specific (e.g. the one naming an actual department).
        """
        raw_answers = [r["answer"] for r in results if r.get("answer")]
        answers: List[str] = []
        for ans in raw_answers:
            dup_index = next(
                (i for i, kept in enumerate(answers) if difflib.SequenceMatcher(None, ans, kept).ratio() > 0.5),
                None,
            )
            if dup_index is None:
                answers.append(ans)
            elif len(ans) > len(answers[dup_index]):
                answers[dup_index] = ans

        merged_sources = []
        for r in results:
            merged_sources.extend(r.get("sources") or [])

        nav_target, nav_url = None, None
        for r in reversed(results):
            if r.get("navigation_target"):
                nav_target, nav_url = r["navigation_target"], r.get("navigation_url")
                break

        confidences = [r.get("confidence", 1.0) for r in results]
        return {
            "answer": "\n\n".join(answers),
            "sources": merged_sources,
            "navigation_target": nav_target,
            "navigation_url": nav_url,
            "confidence": min(confidences) if confidences else 1.0,
            "query_type": "general",
        }

    def _append_followups(self, result: Dict[str, Any], message: str = "") -> Dict[str, Any]:
        """
        Appends topic-specific follow-up suggestions to responses that don't already
        end with a question — hardcoded/navigation answers have no natural follow-up
        of their own, unlike the LLM-backed website-content summaries (which are
        explicitly prompted to end with one). Never fires for out-of-scope declines.

        Never re-suggests the topic the user just asked about (item 16: "Faculty" ->
        "Would you like to know: Faculty?" is useless) — filtered by checking whether
        the suggestion's own keyword already appears in the triggering message.
        """
        answer = result.get("answer")
        if not answer or answer.rstrip().endswith("?"):
            return result
        if result.get("query_type") not in ("general", "department", "navigation"):
            return result

        nav = result.get("navigation_target")
        if not nav:
            return result

        suggestions = DEPARTMENT_FOLLOWUPS if nav in DEPARTMENT_ROUTE_KEYS else FOLLOWUP_SUGGESTIONS.get(nav)
        if not suggestions:
            return result

        message_lower = message.lower()
        suggestions = [s for s in suggestions if s.split()[0].lower() not in message_lower] or suggestions
        if not suggestions:
            return result

        bullets = "\n".join(f"- {s[0].upper()}{s[1:]}?" for s in suggestions[:4])
        result = dict(result)
        result["answer"] = f"{answer}\n\nWould you like to know:\n\n{bullets}"
        return result

    def _initialize_components(self):
        """Initialize vector store, hybrid retriever and RAG engine; sync PDFs if needed."""
        try:
            # Initialize vector store
            self.vector_store = VectorStore(
                persist_dir=CHROMA_PERSIST_DIR,
                embedding_model=EMBEDDING_MODEL,
            )

            # Incrementally sync the vector store with PDFs on disk — only new or
            # modified files are re-processed and re-embedded; unchanged files are
            # left untouched so embeddings are never regenerated needlessly.
            sync_result = self.vector_store.sync_index(PDF_DIR, INDEX_MANIFEST_PATH)
            count = self.vector_store.get_collection_count()
            logger.info(f"Vector store ready with {count} chunks. Sync result: {sync_result}")

            # Build/reuse the BM25 keyword index for hybrid retrieval
            self.bm25_index = BM25Index(BM25_INDEX_PATH)
            if self.bm25_index.is_empty() or sync_result["changed_files"] or sync_result["removed_files"]:
                self.bm25_index.rebuild(self.vector_store.get_all_documents())

            self.hybrid_retriever = HybridRetriever(
                vector_store=self.vector_store,
                bm25_index=self.bm25_index,
                candidate_k=HYBRID_CANDIDATE_K,
            )

            # Preload the cross-encoder re-ranker now, at startup, so the first
            # user request that needs re-ranking doesn't pay its download/init
            # cost. Kept as a singleton on the retriever (_cross_encoder) and
            # never reloaded per request.
            self.hybrid_retriever.preload()

            # Initialize RAG engine
            self.rag_engine = RAGEngine(retriever=self.hybrid_retriever)
            logger.info("CollegeAssistant initialized successfully.")

        except Exception as e:
            logger.error(f"Failed to initialize CollegeAssistant: {e}")
            raise

    async def _route_message(
        self,
        message: str,
        session_id: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        on_token: Optional[Any] = None,
        profiler: Optional[RequestProfiler] = None,
        defer_llm: bool = False,
    ) -> Dict[str, Any]:
        """
        Routes the query and returns a structured response.

        `defer_llm` (Phase 3, multi-question batching — only ever passed as True
        by `chat()`'s multi-part-question branch): when a sub-question would
        otherwise trigger a real Groq call for Website Content summarization or
        department-scoped RAG, the corresponding branch below returns a
        "_deferred_kind" marker (answer=None + enough state to finish later)
        instead of calling Groq immediately, so `chat()` can combine 2+ deferred
        sub-questions that share a topic/department into ONE Groq call. Every
        OTHER branch (deterministic fast paths, `_handle_general_query`,
        `_handle_navigation`, `_handle_department_overview`) ignores this flag
        entirely and resolves exactly as before — batching is intentionally
        scoped to the two call sites where it's safe to defer, per Phase 3.

        `on_token`, when provided, is a callback(str) invoked with each token as
        it streams from the LLM (see chat_stream / Streaming Responses) — only
        consulted by the RAG-calling handlers (_handle_general_query,
        _handle_department_query, _handle_department_overview, _handle_navigation's
        RAG fallback); every other fast-path/entity/structured branch below is a
        single already-instant string and ignores it entirely, so passing it
        changes nothing about the normal non-streaming call path.

        `profiler` (see profiler.py) is optional instrumentation — every branch
        below either times itself against it or leaves it untouched; nothing in
        this method's control flow or return values depends on it.

        Returns:
            {
                "answer": str,
                "sources": list,
                "navigation_target": str | None,
                "navigation_url": str | None,
                "confidence": float,
                "query_type": str,
            }
        """
        profiler = profiler or get_noop_profiler()
        if not message or not message.strip():
            return {
                "answer": "Please ask me something about MLRIT! I'm here to help with admissions, departments, placements, facilities, and more.",
                "sources": [],
                "navigation_target": None,
                "navigation_url": None,
                "confidence": 1.0,
                "query_type": "general",
            }

        message = message.strip()
        conversation_history = conversation_history or []

        logger.info(f"[Session: {session_id}] Processing message: '{message[:80]}'")

        # ─── Intent Pipeline (top-level order) ──────────────────────────────────────────
        # Greeting -> Capabilities -> Scenario/Advisory -> Navigation -> everything else.
        # The first three stages below are new: they catch conversational input
        # ("hi", "what can you do?", "which department should I choose?") that has no
        # business reaching hybrid retrieval, before the existing, already-tuned
        # Navigation-First / Bare-Department / HOD / Admin / Structured-Topic / RAG chain
        # runs unchanged beneath them.

        # ─── Greeting Intercept ─────────────────────────────────────────────────────────
        # Bare greetings never go through the RAG pipeline.
        if self.query_router.is_greeting(message):
            return {
                "answer": "Hello! Welcome to MLRIT Assistant. How can I help you today?",
                "sources": [],
                "navigation_target": None,
                "navigation_url": None,
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Capabilities Intercept ─────────────────────────────────────────────────────
        # "What can you do?" / "help" — answered directly, never sent to RAG.
        if re.search(r"what can you (do|help)|what do you do|how can you help|your capabilities|^help( me)?\??$", message.lower().strip()):
            return {
                "answer": CAPABILITIES_ANSWER,
                "sources": [],
                "navigation_target": None,
                "navigation_url": None,
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Off-Topic Guard ────────────────────────────────────────────────────────────
        # Clearly non-MLRIT request shapes (coding tasks, sports/weather/movie trivia)
        # must be declined immediately, before ANY keyword-matching stage below runs —
        # otherwise a coincidental word (e.g. "program" in "write a python program")
        # can still match a legitimate MLRIT keyword (Academics' "program" keyword) and
        # slip through despite being obviously off-topic. Placed here, at the very top
        # of the pipeline, rather than only in the later Scope Gate, which several
        # earlier stages (Website Content, Structured Knowledge) bypass entirely. An
        # explicit MLRIT mention always overrides this.
        message_lower_check = message.lower()
        if not any(ref in message_lower_check for ref in MLRIT_SELF_REFERENCES) and any(
            re.search(p, message_lower_check) for p in OFF_TOPIC_PATTERNS
        ):
            return {
                "answer": self.rag_engine.generate_off_topic_response(message, conversation_history),
                "sources": [],
                "navigation_target": None,
                "navigation_url": None,
                "confidence": 1.0,
                "query_type": "out_of_scope",
            }

        # ─── Scenario / Advisory Layer ──────────────────────────────────────────────────
        # Open-ended student questions ("which department should I choose?", "I like
        # coding", "should I join MLRIT?", "my rank is 25000") have no PDF chapter and no
        # single factual answer — hybrid retrieval either returns nothing or a misleading
        # nearest-neighbour chunk. Handled here with structured conversational guidance
        # instead. Runs before Navigation-First so a full sentence like "should I choose
        # CSE?" is never mistaken for the bare word "cse".
        with profiler.stage("Scenario Advisory"):
            scenario_result = self.scenario_intent.detect(message, conversation_history)
        if scenario_result:
            logger.info(f"[Session: {session_id}] Scenario match: '{message}' -> {scenario_result.get('scenario_category')}")
            scenario_result.pop("scenario_category", None)
            return scenario_result

        # ─── Context-Aware Faculty Follow-up ───────────────────────────────────────────
        # A bare "Faculty" follow-up right after discussing a specific department (e.g.
        # "Tell me about ECE" -> "Faculty") should resolve to THAT department's faculty,
        # not the hardcoded default (WEBSITE_ROUTES["faculty"] always points at CSE).
        # Only overrides when the current message names no department of its own — an
        # explicit department in the current message still wins via the normal pipeline.
        if re.sub(r"[^\w\s]", "", message.lower()).strip() == "faculty" and conversation_history:
            context_dept_key = self._infer_context_department(conversation_history, profiler=profiler)
            if context_dept_key and context_dept_key in WEBSITE_ROUTES:
                nav_url_ctx = f"{WEBSITE_ROUTES[context_dept_key]}#all-faculty"
                return {
                    "answer": f"Sure! I'll take you to the **{context_dept_key.upper()} Faculty**. Click the button below to navigate there.",
                    "sources": [],
                    "navigation_target": context_dept_key,
                    "navigation_url": nav_url_ctx,
                    "confidence": 1.0,
                    "query_type": "navigation",
                }

        # ─── Context-Aware Department Topic Follow-up (RAG-backed topics) ──────────────
        # Generalizes the Faculty follow-up above to topics whose real content lives in
        # the per-department PDF syllabus (placements, curriculum, research, achievements)
        # rather than a hardcoded page. A bare follow-up right after discussing a specific
        # department (e.g. "Tell me about CSE." -> "Placements") should answer for THAT
        # department via the existing department-scoped RAG path, not the generic
        # MLRIT-wide Placements page. Only fires when the current message names no
        # department of its own — an explicit department ("CSE placements") still wins
        # via the normal pipeline further down.
        normalized_topic = re.sub(r"[^\w\s]", "", message.lower()).strip()
        if (
            normalized_topic in CONTEXT_DEPT_RAG_TOPICS
            and conversation_history
            and not self.query_router.extract_department(message)
        ):
            context_dept_key = self._infer_context_department(conversation_history, profiler=profiler)
            if context_dept_key:
                topic_phrase = CONTEXT_DEPT_RAG_TOPICS[normalized_topic]
                dept_message = f"{context_dept_key.upper()} {topic_phrase}"
                logger.info(f"[Session: {session_id}] Context department follow-up: '{message}' -> {dept_message}")
                return await self._handle_department_query(dept_message, session_id, conversation_history, on_token=on_token, profiler=profiler, defer_llm=defer_llm)

        # ─── Navigation-First Router ────────────────────────────────────────────────────
        # Runs before intent classification, department detection, and hybrid retrieval
        # (Chroma + BM25 + CrossEncoder + Groq). Only fires on an exact whole-query match
        # against a known page-name synonym (e.g. "placements", "csd", "training and
        # placement"), so information requests ("Tell me about placements.", "Placement
        # statistics") are left untouched and continue through the normal pipeline below.
        nav_page, nav_url = detect_pure_navigation(message)
        if nav_page:
            logger.info(f"[Session: {session_id}] Navigation-first match: '{message}' -> {nav_page}")
            return self._build_navigation_response(nav_page, nav_url)

        # ─── Generic "departments" Listing Query ───────────────────────────────────────
        # Phrased variants of the bare word above ("what departments are available?",
        # "list departments", "show departments") fail detect_pure_navigation's exact
        # whole-query match, and would otherwise fall through to the Website Content /
        # Structured Knowledge layers below — where structured_topics.py's "academics"
        # topic has a generic "department"/"branch" keyword that wins the match and
        # returns its long academics blurb instead of the UG/PG picker. Catch the
        # generic case here, before any of those layers run, so every phrasing gets the
        # exact same short guiding question + buttons. "which departments ..." queries
        # name specific departments in their answer, so they're excluded here and still
        # flow through to RAG + entity linking in _handle_general_query.
        query_lower_early = message.lower()
        if (
            match_canonical_route(query_lower_early) == "departments"
            and "which" not in query_lower_early
        ):
            return self._build_navigation_response("departments", None)

        # ─── Bare Department Overview ───────────────────────────────────────────────────
        # Runs immediately after navigation-first, before any other intercept (HOD/faculty
        # lookup, admin directory, etc.) — a bare department name/abbreviation ("cse",
        # "mba", "csd") is informational-by-default and must win decisively. Placed this
        # early because short abbreviations like "mba" can otherwise false-positive as a
        # substring match inside an unrelated faculty surname in the lookups further down.
        if self.query_router.is_bare_department_query(message):
            return await self._handle_department_overview(message, session_id, conversation_history, on_token=on_token, profiler=profiler)

        # ─── Admission Rank / Cutoff Intercept ─────────────────────────────────────────
        # Runs before department/HOD classification so a query like "EAMCET ranking
        # required for CSE" isn't captured by the "cse" department keyword and routed
        # into a CSE-only RAG search — which has no admissions-cutoff data and instead
        # surfaces unrelated internal CGPA/merit-rank academic-regulation content.
        query_lower = message.lower()
        ADMISSION_RANK_TERMS = [
            "eamcet", "eapcet", "cutoff", "cutoffs", "cutoff rank", "cutoff ranks",
            "closing rank", "closing ranks", "opening rank", "opening ranks",
            "rank required", "last rank", "admission rank", "counselling", "counseling",
            "seat allotment", "category rank", "oc", "bc", "sc", "st",
        ]
        MERIT_EXCLUDE_TERMS = ["cgpa", "internal merit", "class rank", "academic merit", "gpa"]
        is_admission_rank_query = (
            any(re.search(r'\b' + re.escape(t) + r'\b', query_lower) for t in ADMISSION_RANK_TERMS)
            and not any(t in query_lower for t in MERIT_EXCLUDE_TERMS)
        )
        if is_admission_rank_query:
            branch = eamcet_cutoffs.extract_branch(query_lower)
            gender = eamcet_cutoffs.extract_gender(query_lower)
            category = eamcet_cutoffs.extract_category(query_lower)
            GUARANTEE_TERMS = [
                "guarantee", "guaranteed", "same every year", "permanent", "next year",
                "2026", "2027", "this year", "current year", "will i get",
            ]
            is_guarantee_query = any(t in query_lower for t in GUARANTEE_TERMS)

            if branch and gender and category:
                answer = eamcet_cutoffs.format_single(branch, gender, category) + "\n\n" + eamcet_cutoffs.DISCLAIMER_SHORT
            elif branch:
                answer = eamcet_cutoffs.format_branch_table(branch, gender=gender, category=category) + "\n\n" + eamcet_cutoffs.DISCLAIMER_SHORT
            elif is_guarantee_query:
                answer = eamcet_cutoffs.DISCLAIMER_LONG
            else:
                answer = (
                    "I have TG EAMCET **2025-26 Final Phase** closing-rank data for MLRIT's CSE, CSE (Data Science), "
                    "CSE (AIML), ECE, EEE, Mechanical, and Aeronautical branches, broken down by category and gender.\n\n"
                    "Tell me the branch, your category (OC/EWS/BC-A to BC-E/SC/ST), and gender, and I'll compare it "
                    "against the 2025-26 closing rank.\n\n" + eamcet_cutoffs.DISCLAIMER_SHORT
                )
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "admissions",
                "navigation_url": WEBSITE_ROUTES["admissions"],
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── HOD & Faculty Quick Lookup Intercept ──────────────────────────────────────
        is_hod_query = any(k in query_lower for k in ["hod", "head of department", "head of the department"])
        
        # Check if the query matches an HOD name directly
        matched_hod_dept = None
        with profiler.stage("HOD Lookup"):
            for dept_key, info in HOD_INFO.items():
                name_lower = info["name"].lower()
                clean_name = name_lower.replace("dr. ", "")
                if clean_name in query_lower or name_lower in query_lower:
                    matched_hod_dept = dept_key
                    break
                
        if is_hod_query or matched_hod_dept:
            # An explicit request for the whole directory always wins, even when a
            # department is already active in the conversation (item 7: "who is the
            # HOD?" after "Tell me about AIML" should show only AIML's HOD, but "all
            # HODs"/"HOD list"/"list of HODs" should always show everyone).
            wants_full_directory = bool(re.search(r"\ball hods?\b|\bhod list\b|\blist of hods?\b", query_lower))

            dept_key = matched_hod_dept
            if not dept_key and not wants_full_directory:
                extracted_dept = self.query_router.extract_department(message)
                if extracted_dept:
                    dept_key = extracted_dept.lower().replace(" ", "-")
                elif conversation_history:
                    dept_key = self._infer_context_department(conversation_history, profiler=profiler)

            if dept_key and dept_key in HOD_INFO and not wants_full_directory:
                info = HOD_INFO[dept_key]
                dept_name = dept_key.upper()
                answer = f"**{info['name']}** is the **{info['role']}** of the **{dept_name} Department** at MLRIT.\n\n"
                if info.get("specialization"):
                    answer += f"**Specialization**: {info['specialization']}\n\n"
                if info.get("url"):
                    answer += f"Would you like to navigate to the official {dept_name} page? Click the button below."

                return {
                    "answer": answer,
                    "sources": [{
                        "file": "Faculty Directory",
                        "page": 1,
                        "department": dept_name,
                        "snippet": f"{info['name']} - {info['role']} ({info['specialization']})"
                    }],
                    "navigation_target": dept_key if info.get("url") else None,
                    "navigation_url": f"{info['url']}#all-faculty" if info.get("url") else None,
                    "confidence": 1.0,
                    "query_type": "department",
                }
            elif is_hod_query:
                # General list of HODs. No per-category entity handling here —
                # _attach_entities() detects the multiple names mentioned below
                # and turns them into clickable links automatically.
                answer = "Here is the directory of **Head of Departments (HODs)** at MLRIT:\n\n"
                for d_key, info in HOD_INFO.items():
                    answer += f"- **{info['name']}** — {info['role']} (**{d_key.upper()}**)\n"
                answer += "\nClick a name above to open their department's faculty page."

                return {
                    "answer": answer,
                    "sources": [],
                    "navigation_target": "faculty",
                    "navigation_url": "/departments/cse#all-faculty",
                    "confidence": 1.0,
                    "query_type": "general",
                }

        # ─── Faculty Lookup (Phase 2 fast index) ───────────────────────────────────────
        # Supersedes the old faculty_directory.py-backed lookup, which sourced from
        # lib/dept-data.ts's `faculty` arrays — those are empty in every department, so
        # that path was silently returning zero results in production. All three
        # sub-checks below are pure dict/list lookups against FacultyIndex, built once
        # at startup from the real 209-record lib/faculty.ts dataset. Zero LLM, zero
        # retrieval — same performance class as the HOD intercept above.

        # 1. Subject-taught lookup: "who teaches DBMS?", "which faculty teaches AI?"
        subject_match = re.search(
            r"who (?:teaches|takes|handles)\s+(.+?)\??$|which faculty teaches\s+(.+?)\??$|"
            r"faculty (?:for|teaching)\s+(.+?)\??$",
            query_lower,
        )
        if subject_match:
            subject_query = next(g for g in subject_match.groups() if g).strip()
            with profiler.stage("Faculty Lookup"):
                subject_hits = self.faculty_index.lookup_by_subject(subject_query)
            if subject_hits:
                answer = f"Faculty teaching **{subject_query.title()}**:\n\n"
                for person in subject_hits[:10]:
                    answer += f"- **{person['name']}** — {person['designation']} ({person['department'].upper()})\n"
                answer += "\nClick a name above for their full profile."
                first = subject_hits[0]
                return {
                    "answer": answer,
                    "sources": [],
                    "navigation_target": None,
                    "navigation_url": f"/faculty/{first['slug']}",
                    "confidence": 1.0,
                    "query_type": "department",
                }
            return {
                "answer": f"I couldn't find a faculty member specifically listed as teaching \"{subject_query}\" in our records.",
                "sources": [],
                "navigation_target": None,
                "navigation_url": None,
                "confidence": 0.0,
                "query_type": "department",
            }

        # 2. Direct name lookup, e.g. "Tell me about Dr. Ajmeera Kiran"
        with profiler.stage("Faculty Lookup"):
            matched_faculty = self.faculty_index.lookup_by_name(message)
        if matched_faculty:
            return self._build_faculty_answer(matched_faculty)

        # 3. Department faculty listing: "Show AIML faculty", "List ECE professors"
        # (skipped for HOD-shaped queries, already fully handled above).
        if re.search(r"\b(faculty|professors?|staff)\b", query_lower) and not is_hod_query:
            dept_for_list = self.query_router.extract_department(message)
            dept_key_for_list = dept_for_list.lower().replace(" ", "-") if dept_for_list else None
            if not dept_key_for_list and conversation_history:
                dept_key_for_list = self._infer_context_department(conversation_history, profiler=profiler)
            if dept_key_for_list:
                with profiler.stage("Faculty Lookup"):
                    dept_faculty = self.faculty_index.get_by_department(dept_key_for_list)
                if dept_faculty:
                    answer = f"**{dept_key_for_list.upper()} Department Faculty**:\n\n"
                    for person in dept_faculty[:20]:
                        tag = " (HOD)" if person.get("is_hod") else ""
                        answer += f"- **{person['name']}**{tag} — {person['designation']}\n"
                    if len(dept_faculty) > 20:
                        answer += f"\n*And {len(dept_faculty) - 20} more faculty members...*"
                    nav_target = dept_key_for_list if dept_key_for_list in WEBSITE_ROUTES else None
                    return {
                        "answer": answer,
                        "sources": [],
                        "navigation_target": nav_target,
                        "navigation_url": f"{WEBSITE_ROUTES[dept_key_for_list]}#all-faculty" if nav_target else None,
                        "confidence": 1.0,
                        "query_type": "department",
                    }
                return {
                    "answer": f"I couldn't find official faculty information for the {dept_key_for_list.upper()} department.",
                    "sources": [],
                    "navigation_target": dept_key_for_list if dept_key_for_list in WEBSITE_ROUTES else None,
                    "navigation_url": WEBSITE_ROUTES.get(dept_key_for_list),
                    "confidence": 0.0,
                    "query_type": "department",
                }

        # ─── Administration Directory Intercept ────────────────────────────────────────
        # Administrative/leadership roles (Principal, Dean Academics, Vice Principal,
        # Registrar, Controller of Examinations, Placement Officer, Admission Officer,
        # IQAC Coordinator, NIRF Coordinator) are answered directly from
        # self.administration_directory — populated at startup from the website's own
        # source files (see administration_directory.py) — never from hybrid retrieval.
        # The PDFs are department syllabus documents; they don't mention the Principal
        # or Dean, so RAG previously had nothing to retrieve and answered "context does
        # not mention Dean." Runs BEFORE Chroma/BM25/CrossEncoder/Groq are ever touched.
        with profiler.stage("Admin Lookup"):
            admin_role_key = self.administration_directory.detect_role(message)
        if admin_role_key:
            info = self.administration_directory.get_role(admin_role_key)
            nav_target = info["nav_target"]
            nav_url = info.get("nav_url_override") or WEBSITE_ROUTES.get(nav_target)

            if info["name"] and admin_role_key == "iqac_coordinator":
                answer = f"The **Head of IQAC** at MLR Institute of Technology is **{info['name']}**."
                if info.get("description"):
                    answer += f"\n\n{info['description']}"
            elif info["name"]:
                answer = f"**{info['name']}** is the **{info['designation']}** at MLRIT."
                if info.get("description"):
                    answer += f"\n\n{info['description']}"
                if info.get("email") or info.get("phone"):
                    contact_bits = []
                    if info.get("phone") and info["phone"] != "To be updated":
                        contact_bits.append(f"Phone: {info['phone']}")
                    if info.get("email"):
                        contact_bits.append(f"Email: {info['email']}")
                    if contact_bits:
                        answer += "\n\n" + " | ".join(contact_bits)
            else:
                answer = f"**{info['designation']}** — {info['description']}"

            logger.info(f"[Session: {session_id}] Administration directory match: '{message}' -> {admin_role_key}")
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": nav_target,
                "navigation_url": nav_url,
                "confidence": 1.0,
                "query_type": "general",
            }

        with profiler.stage("Admin Lookup"):
            is_general_admin_query = self.administration_directory.is_general_administration_query(message)
        if is_general_admin_query:
            lines = []
            for role_key, info in self.administration_directory.get_all().items():
                label = f"**{info['name']}**" if info["name"] else "*Not publicly listed*"
                lines.append(f"- {label} — {info['designation']}")
            answer = "**MLRIT Administration:**\n\n" + "\n".join(lines)
            logger.info(f"[Session: {session_id}] General administration directory listing")
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "about",
                "navigation_url": WEBSITE_ROUTES.get("about"),
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Syllabus Lookup (Phase 2 fast index) ──────────────────────────────────────
        # "R22 CSE 3-1 syllabus", "subjects in AIML 2-2", course-code lookup — all pure
        # dict lookups against SyllabusIndex (lib/syllabus-data.ts), built once at
        # startup. Zero LLM, zero retrieval, never embedded into ChromaDB. Runs before
        # Website Content / Structured Knowledge since neither has any syllabus data.
        # Real MLRIT course codes interleave a letter/digit pair then a 2-letter/2-digit
        # pair (e.g. "A6BS01", "A6CS15") — confirmed against all 1,796 codes in
        # lib/syllabus-data.ts (1,777 match this shape exactly). The previous
        # `[a-zA-Z]{2,4}\d{3,4}` pattern required a contiguous letter-run then a
        # digit-run and matched zero of them, so this lookup never fired for any
        # real code.
        code_match = re.search(r"\b([a-zA-Z]\d[a-zA-Z]{2}\d{2})\b", message)
        if code_match and ("course code" in query_lower or " code" in query_lower or query_lower.startswith("code")):
            code_hits = self.syllabus_index.find_course_by_code(code_match.group(1))
            if code_hits:
                answer = f"**{code_match.group(1).upper()}** matches:\n\n"
                for hit in code_hits[:10]:
                    answer += f"- **{hit['title']}** — {hit['program'].upper()}, {hit['regulation'].upper()}, Semester {hit['sem']}\n"
                return {
                    "answer": answer,
                    "sources": [],
                    "navigation_target": "examinations",
                    "navigation_url": WEBSITE_ROUTES.get("examinations"),
                    "confidence": 1.0,
                    "query_type": "general",
                }
            return {
                "answer": f"I couldn't find a course with the code \"{code_match.group(1).upper()}\" in our syllabus records.",
                "sources": [],
                "navigation_target": "examinations",
                "navigation_url": WEBSITE_ROUTES.get("examinations"),
                "confidence": 0.0,
                "query_type": "general",
            }

        is_syllabus_query = (
            any(k in query_lower for k in ["syllabus", "subjects in", "subjects for", "semester subjects", "which subjects", "curriculum for semester"])
            or re.search(r"\b\d\s*-\s*\d\b", query_lower)
        )
        if is_syllabus_query:
            program = self.query_router.extract_department(message)
            program_key = program.lower().replace(" ", "-") if program else None
            if not program_key and conversation_history:
                program_key = self._infer_context_department(conversation_history, profiler=profiler)
            reg_match = re.search(r"\b(r\d{2}|mlr\d{2})\b", query_lower)
            regulation_key = reg_match.group(1) if reg_match else None

            sem_num = None
            year_sem_match = re.search(r"\b(\d)\s*-\s*(\d)\b", query_lower)
            if year_sem_match:
                year_num, sem_in_year = int(year_sem_match.group(1)), int(year_sem_match.group(2))
                sem_num = (year_num - 1) * 2 + sem_in_year
            else:
                sem_match = re.search(r"sem(?:ester)?\s*(\d)\b", query_lower)
                if sem_match:
                    sem_num = int(sem_match.group(1))

            if program_key and program_key in self.syllabus_index.get_programs():
                available_regs = self.syllabus_index.get_regulations(program_key)
                if not regulation_key and available_regs:
                    regulation_key = available_regs[-1]  # most recent regulation as a sensible default

                if regulation_key and sem_num:
                    courses = self.syllabus_index.get_courses(program_key, regulation_key, sem_num)
                    if courses:
                        answer = f"**{program_key.upper()} — {regulation_key.upper()} — Semester {sem_num}** subjects:\n\n"
                        for course in courses:
                            answer += f"- **{course['code']}** — {course['title']}\n"
                        return {
                            "answer": answer,
                            "sources": [],
                            "navigation_target": "examinations",
                            "navigation_url": f"/departments/syllabus/{program_key}/{regulation_key}",
                            "confidence": 1.0,
                            "query_type": "department",
                        }
                    return {
                        "answer": f"I couldn't find syllabus information for {program_key.upper()} under {regulation_key.upper()}, Semester {sem_num}.",
                        "sources": [],
                        "navigation_target": "examinations",
                        "navigation_url": WEBSITE_ROUTES.get("examinations"),
                        "confidence": 0.0,
                        "query_type": "department",
                    }
                if regulation_key:
                    return {
                        "answer": f"Which semester of {program_key.upper()} ({regulation_key.upper()}) would you like the syllabus for? For example, \"{program_key.upper()} {regulation_key.upper()} 3-1\".",
                        "sources": [],
                        "navigation_target": "examinations",
                        "navigation_url": f"/departments/syllabus/{program_key}/{regulation_key}",
                        "confidence": 0.5,
                        "query_type": "department",
                    }
            elif program_key:
                return {
                    "answer": f"I couldn't find syllabus information for the {program_key.upper()} department.",
                    "sources": [],
                    "navigation_target": "examinations",
                    "navigation_url": WEBSITE_ROUTES.get("examinations"),
                    "confidence": 0.0,
                    "query_type": "department",
                }
            # No program identified at all — fall through to the rest of the pipeline
            # rather than a hard failure (same "no silent dead end" convention as Labs).

        # ─── Placements Fast Facts (Phase 2 fast index) ────────────────────────────────
        # Narrow, unambiguous phrasings resolve as zero-LLM dict/list lookups against
        # PlacementIndex (lib/placements.ts). Broader/conversational phrasing ("tell me
        # about placements") is intentionally left to the existing Website Content
        # Summaries stage below, which still gives a fuller LLM-summarized answer.
        if re.search(r"\bhighest package\b", query_lower) and self.placement_index.highest_package() is not None:
            # Report the year that actually achieved this figure — not the most
            # recent year's offers/companies alongside a different year's LPA.
            record_year = self.placement_index.highest_package_stat()
            answer = f"The highest package MLRIT has recorded is **{self.placement_index.highest_package()} LPA**"
            if record_year:
                answer += f" (in {record_year['year']}, with {record_year['offers']} offers from {record_year['companies']} companies)."
            else:
                answer += "."
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "placements",
                "navigation_url": WEBSITE_ROUTES.get("placements"),
                "confidence": 1.0,
                "query_type": "general",
            }

        if re.search(r"\bplacement (officer|contact)s?\b|\bwho is the placement officer\b", query_lower) and self.placement_index.get_contacts():
            answer = "**Placements Cell Contacts**:\n\n"
            for c in self.placement_index.get_contacts():
                answer += f"- **{c['name']}** — {c['designation']}"
                if c.get("phones"):
                    answer += f" | Phone: {', '.join(c['phones'])}"
                if c.get("email"):
                    answer += f" | Email: {c['email']}"
                answer += "\n"
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "placements",
                "navigation_url": "/placements/support",
                "confidence": 1.0,
                "query_type": "general",
            }

        if re.search(r"\blist of recruiters\b|\brecruiters list\b|\bwhich companies (recruit|hire)\b", query_lower) and self.placement_index.recruiters:
            answer = "**Recruiting companies at MLRIT** include:\n\n" + ", ".join(self.placement_index.recruiters)
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "placements",
                "navigation_url": "/placements/recruiters",
                "confidence": 1.0,
                "query_type": "general",
            }

        if re.search(r"\blatest placement (statistics|stats)\b|\bplacement statistics for\b", query_lower) and self.placement_index.year_stats:
            answer = "**Year-by-year placement statistics**:\n\n"
            for row in self.placement_index.year_stats:
                answer += f"- **{row['year']}**: {row['offers']} offers, {row['companies']} companies, highest package {row['highest']} LPA\n"
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "placements",
                "navigation_url": "/placements/statistics",
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Campus Fast Facts: Transport (Phase 2 fast index) ─────────────────────────
        # Specific route-number / stop-name queries resolve as zero-LLM dict/list lookups
        # against CampusIndex (lib/transport-routes.ts). Must run BEFORE Website Content
        # Summaries below — its "transport" topic's broader "bus"/"transport" keywords
        # would otherwise catch these first and give a generic LLM-summarized answer
        # instead of the specific route actually asked for.
        route_num_match = re.search(r"\broute\s*(?:number|no\.?)?\s*(\d+)\b", query_lower)
        route_hits = []
        if route_num_match:
            route_hits = self.campus_index.get_route(int(route_num_match.group(1)))
        elif any(k in query_lower for k in ["bus", "route", "transport"]):
            area_match = re.search(r"\b(?:to|for|near)\s+(.+?)\??$", query_lower)
            if area_match:
                route_hits = self.campus_index.search_routes(area_match.group(1).strip())
        if route_hits:
            answer = "Here's the matching bus route information:\n\n"
            for r in route_hits[:3]:
                answer += (
                    f"- **Route {r['route_number']}** — stops: {', '.join(r['stops'][:8])}"
                    + (f", +{len(r['stops']) - 8} more" if len(r['stops']) > 8 else "") + "\n"
                    f"  Incharge: {r.get('incharge_name') or 'N/A'} ({r.get('incharge_contact') or 'N/A'}) | "
                    f"Driver: {r.get('driver_name') or 'N/A'} ({r.get('driver_contact') or 'N/A'})\n"
                )
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "transport",
                "navigation_url": WEBSITE_ROUTES["transport"],
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Website Content Summaries ──────────────────────────────────────────────────
        # Knowledge-hierarchy stage: "does an official website page already contain the
        # answer?" — checked BEFORE the hand-authored Structured Knowledge fallback and
        # BEFORE hybrid retrieval. Topics like placements, placement statistics,
        # recruiters, admissions, scholarships, fees, hostel, cafeteria, sports,
        # transport, research, innovation, IQAC, and regulations already have real,
        # maintained content on the Next.js site (lib/placements.ts, lib/info-pages.ts,
        # lib/research.ts, or the page itself) — website_content.py extracts that real
        # text and asks the LLM for a short conversational summary of it (one direct LLM
        # call, NOT a Chroma/BM25/CrossEncoder retrieval). If the query names an explicit
        # department (e.g. "CSE placements"), detect_website_topic() defers so it falls
        # through to the existing department-scoped RAG path below. If extraction or
        # summarization fails for any reason, falls through to Structured Knowledge.
        web_dept = self.query_router.extract_department(message)
        with profiler.stage("Website Lookup"):
            web_topic = detect_website_topic(message, department=web_dept)
        if web_topic:
            # Phase 3 (multi-question batching): when this sub-question is part of
            # a multi-part message, defer the actual Groq summarization call so
            # `chat()` can combine it with any OTHER website-content sub-questions
            # from the same message into one call (see chat()'s grouping logic).
            # Text extraction (cheap, no LLM) still happens eagerly so a failed
            # extraction falls through to the normal single-question path below
            # exactly as before.
            if defer_llm:
                page_text = get_page_text(web_topic)
                if page_text:
                    return {
                        "answer": None, "sources": [], "navigation_target": None, "navigation_url": None,
                        "confidence": 1.0, "query_type": "general",
                        "_deferred_kind": "website", "_topic_key": web_topic, "_query": message, "_page_text": page_text,
                    }
                # No extractable text — fall through exactly like the non-deferred path.
            with profiler.stage("Website Lookup"):
                web_result = await summarize_website_content(web_topic, message, self.rag_engine.llm, profiler=profiler)
            if web_result:
                logger.info(f"[Session: {session_id}] Website content match: '{message}' -> {web_topic}")
                return web_result
            logger.warning(f"[Session: {session_id}] Website content summarization failed for '{web_topic}', falling back")

        # ─── Structured Knowledge Layer ─────────────────────────────────────────────────
        # Fallback hand-authored knowledge for topics with NO real page/content anywhere
        # on the site (library and alumni are external-only; wifi, medical, attendance
        # have no dedicated page; academics/facilities/campus_life are generic listings
        # without one page to summarize) — see structured_topics.py's module docstring
        # for the full list of what moved to Website Content Summaries above.
        with profiler.stage("Structured Lookup"):
            structured_topic = detect_structured_topic(message, department=web_dept)
        # "academics" carries generic keywords ("department", "branch", "curriculum")
        # that also match "which departments have AI courses?"-style queries — those
        # belong to the dedicated departments picker/entity-linking flow above and
        # below, not this hand-authored blurb, so defer to that flow instead.
        if structured_topic == "academics" and match_canonical_route(query_lower) == "departments":
            structured_topic = None
        if structured_topic:
            logger.info(f"[Session: {session_id}] Structured topic match: '{message}' -> {structured_topic}")
            return build_structured_response(structured_topic)

        # ─── Labs & Equipment Query Intercept ────────────────────────────────────────
        is_system_query = any(phrase in query_lower for phrase in ["how many systems", "how many computer", "number of systems", "number of computer", "system count", "computer count"])
        # Word-boundary match — a plain substring check would false-positive on words like
        # "available" or "collaborate", which contain "lab" without meaning "laboratory".
        is_lab_query = any(re.search(r'\b' + k + r'\b', query_lower) for k in ["lab", "labs", "laboratory", "laboratories", "equipment"]) or is_system_query
        
        if is_lab_query:
            # 1. Determine if the user is asking specifically about system count/computers
            is_asking_about_system_count = is_system_query or any(
                phrase in query_lower 
                for phrase in [
                    "how many systems", "how many computer", "how many pc", "how many workstation",
                    "number of systems", "number of computer", "number of pc", "number of workstation",
                    "system count", "computer count", "pc count", "workstation count",
                    "count of systems", "count of computer", "count of pc",
                    "quantity of systems", "quantity of computer", "quantity of pc",
                    "systems count", "computers count", "pcs count"
                ]
            ) or (
                ("how many" in query_lower or "number of" in query_lower or "count" in query_lower) and 
                ("system" in query_lower or "computer" in query_lower or "pc" in query_lower or "pcs" in query_lower)
            )

            # 2. Check if the user is asking about a specific lab by name
            specific_labs = {}
            for dept, labs_list in self.labs_directory.directory.items():
                for lab in labs_list:
                    # Clean the lab name to allow flexible matching (e.g. "Java Programming Lab" -> "java programming")
                    lab_name_clean = lab["name"].lower()
                    # Remove common suffixes like "lab", "laboratory"
                    lab_name_clean = re.sub(r"\s+labs?\b|\s+laborator(y|ies)\b", "", lab_name_clean).strip()
                    
                    # If the lab name (or cleaned lab name) is mentioned in the query
                    if lab_name_clean in query_lower:
                        if dept.upper() not in specific_labs:
                            specific_labs[dept.upper()] = []
                        # Avoid duplicates
                        if lab not in specific_labs[dept.upper()]:
                            specific_labs[dept.upper()].append(lab)

            # If they matched specific labs, answer specifically for those labs
            if specific_labs:
                answer = "Here is the information about the specific laboratory you requested:\n\n"
                nav_target = None
                nav_url = None
                for dept_name, labs in specific_labs.items():
                    nav_target = dept_name.lower()
                    nav_url = f"/departments/{nav_target}"
                    answer += f"**In the {dept_name} Department**:\n"
                    for lab in labs:
                        # Extract or clean the system count based on the query type
                        match_count = re.search(r"(\d+\s+systems?)", lab["description"], re.IGNORECASE)
                        if is_asking_about_system_count:
                            if match_count:
                                answer += f"- **{lab['name']}**: Equipped with **{match_count.group(1)}**.\n"
                            else:
                                answer += f"- **{lab['name']}**: Specific system count is not specified (Focus: {lab['description']}).\n"
                        else:
                            clean_desc = re.sub(r"^\s*\d+\s+systems?\s*[\u2014\u2013-]\s*", "", lab["description"], flags=re.IGNORECASE)
                            answer += f"- **{lab['name']}**\n  *Equipment/Focus*: {clean_desc}\n"
                
                first_dept = list(specific_labs.keys())[0]
                answer += f"\nWould you like to navigate to the official {first_dept} page for more details?"
                return {
                    "answer": answer,
                    "sources": [{"file": "Department Directory", "page": 1, "department": first_dept, "snippet": "Specific Lab Query"}],
                    "navigation_target": nav_target,
                    "navigation_url": nav_url,
                    "confidence": 1.0,
                    "query_type": "department",
                }

            # 3. Fall back to department labs if a department is specified — or, when
            # the current message is ambiguous on its own (no department named),
            # inherit whatever department the conversation was already about (e.g.
            # "Tell me about CSE." followed by "What laboratories are available?").
            # An explicit department in THIS message always wins over history.
            extracted_dept = self.query_router.extract_department(message)
            dept_key = None
            if extracted_dept:
                dept_key = extracted_dept.lower().replace(" ", "-")
            elif conversation_history:
                dept_key = self._infer_context_department(conversation_history, profiler=profiler)

            if dept_key:
                with profiler.stage("Labs Lookup"):
                    labs = self.labs_directory.get_labs_for_department(dept_key)
                dept_name = dept_key.upper()
                
                if labs:
                    if is_asking_about_system_count:
                        answer = f"Here is the system count for the laboratories in the **{dept_name} Department**:\n\n"
                        has_counts = False
                        for lab in labs[:12]:
                            match_count = re.search(r"(\d+\s+systems?)", lab["description"], re.IGNORECASE)
                            if match_count:
                                answer += f"- **{lab['name']}**: {match_count.group(1)}\n"
                                has_counts = True
                            else:
                                answer += f"- **{lab['name']}**: Count not specified (Focus: {lab['description']})\n"
                        if len(labs) > 12:
                            answer += f"\n*And {len(labs) - 12} more labs...*"
                        if not has_counts:
                            answer += f"\nNote: The official syllabus/directory for the **{dept_name} Department** labs does not list individual computer system numbers."
                    else:
                        answer = f"The **{dept_name} Department** offers the following specialized laboratories and course-specific equipment:\n\n"
                        for lab in labs[:10]:
                            # Strip systems count
                            clean_desc = re.sub(r"^\s*\d+\s+systems?\s*[\u2014\u2013-]\s*", "", lab["description"], flags=re.IGNORECASE)
                            answer += f"- **{lab['name']}**\n  *Equipment/Focus*: {clean_desc}\n"
                        if len(labs) > 10:
                            answer += f"\n*And {len(labs) - 10} more advanced labs...*"
                    
                    answer += f"\n\nWould you like to navigate to the official {dept_name} page for complete details?"
                    return {
                        "answer": answer,
                        "sources": [{"file": "Department Directory", "page": 1, "department": dept_name, "snippet": f"Labs list for {dept_name}"}],
                        "navigation_target": dept_key,
                        "navigation_url": f"/departments/{dept_key}",
                        "confidence": 1.0,
                        "query_type": "department",
                    }

                # A specific department WAS named/inherited, but labs_directory has no
                # entry for it (e.g. CSE-DS, CSE-CS, IT, CSIT aren't in lib/dept-data.ts
                # yet) — say so honestly rather than silently falling through to the
                # generic campus-wide labs overview below, which would answer a
                # question about a specific department with unrelated department data.
                return {
                    "answer": f"I couldn't find official lab information for the {dept_name} department.",
                    "sources": [],
                    "navigation_target": dept_key if dept_key in WEBSITE_ROUTES else None,
                    "navigation_url": WEBSITE_ROUTES.get(dept_key),
                    "confidence": 0.0,
                    "query_type": "department",
                }

            # 4. General labs query (no specific department or specific lab was matched)
            if is_asking_about_system_count:
                answer = "**MLRIT Laboratory System Infrastructure Overview:**\n\n"
                answer += "Across all laboratories, MLRIT maintains over **800+ high-speed networked computer systems** equipped with webcams, headphones, and 1 Gbps high-speed internet connectivity.\n\n"
                answer += "- For example, the **CSE Department** labs alone operate over **497+ systems** across 12 specialized labs, with system counts ranging from 30 to 69 workstations per lab.\n"
                answer += "- Other department labs are equipped with specialized computing workstations (such as DSP labs and VLSI simulation systems) or heavy engineering setups (such as aeronautical flight simulators and CNC machinery).\n\n"
                answer += "To see the systems count for a specific lab, please specify the lab name (e.g. \"how many systems in Operating Systems Lab?\")."
            else:
                answer = "**MLRIT Laboratory Infrastructure Overview:**\n\n"
                answer += "MLRIT features world-class laboratory infrastructure, maintaining state-of-the-art computer systems alongside specialized aeronautical wind tunnels and advanced mechanical workshops.\n\n"
                answer += "**Specialized Equipment Highlights:**\n\n"
                answer += "- **Computing & AI**: NVIDIA A100/T4 GPUs, Apache Kafka data pipelines, and a simulated SOC (Security Operations Centre) running Splunk and IBM QRadar.\n"
                answer += "- **Electronics & Embedded Systems**: Advanced Cadence design suites, Xilinx FPGA development boards, and digital signal processors.\n"
                answer += "- **Aero & Mechanical Engineering**: ANSYS Fluent simulation servers, subsonic wind tunnel, and CNC milling and lathe centers.\n\n"
                answer += "For the complete list of lab courses offered by a specific branch, please query about that department (e.g. \"CSE labs\")."
            
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "research",
                "navigation_url": "/research",
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Location / Address Intercept ───────────────────────────────────────────────
        # Canonical location intent — covers the bare word, common misspellings
        # ("loaction", "locaton"), and full-sentence phrasings ("where is MLRIT
        # located?", "college location") so every variant returns the same campus
        # location first, with Maps/Contact action buttons (navigation_target=
        # "location", rendered by the frontend's dedicated button case for that
        # target) instead of falling into the generic Contact intercept below (whose
        # answer is about phone/email, not where the campus is) or the RAG/navigation
        # fallback (which appends a raw mlrit.ac.in link to the answer text).
        LOCATION_PATTERNS = [
            r'\blocation\b', r'\baddress\b', r'\bwhere is mlrit\b', r'\bwhere is mlrit located\b',
            r'\bwhere is the college\b', r'\bwhere is the campus\b', r'\bcollege location\b',
            r'\bcampus location\b', r'\bhow to reach mlrit\b', r'\bdirections to mlrit\b',
        ]
        is_location_query = any(re.search(p, query_lower) for p in LOCATION_PATTERNS)
        if not is_location_query:
            # Typo tolerance — a single close match against "location"/"address" is
            # enough; the 0.8 ratio cutoff is strict enough that unrelated words
            # ("vacation", "education") never false-positive.
            words = re.findall(r"[a-z]+", query_lower)
            is_location_query = any(
                difflib.get_close_matches(w, ["location", "address"], n=1, cutoff=0.8) for w in words
            )
        if is_location_query:
            answer = (
                f"MLRIT is located in **{COLLEGE_INFO['location']}**.\n\n"
                "You can view the campus on Google Maps or contact MLRIT using the buttons below."
            )
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "location",
                "navigation_url": None,
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Campus Contact & Services Intercept ───────────────────────────────────────
        # Short, generic keyword queries like "Phone number" or "Transport" would
        # otherwise retrieve unrelated syllabus content from RAG (e.g. Python
        # phone-validation exercises, the OSI Transport Layer). These have a single,
        # unambiguous known destination, so answer from that known data directly —
        # never let syllabus PDFs override obvious campus-service intent. "address"/
        # "location" are excluded here — they're claimed by the dedicated Location
        # Intercept immediately above.
        contact_exclude = ["ip address", "mac address", "memory address", "validate", "validation", "program", "course", "syllabus", "lab", "app", "api"]
        is_contact_query = (
            any(re.search(r'\b' + re.escape(k) + r'\b', query_lower) for k in
                ["phone number", "contact number", "phone", "email", "contact"])
            and not any(k in query_lower for k in contact_exclude)
        )
        if is_contact_query:
            answer = (
                "You can reach MLR Institute of Technology at:\n\n"
                "- **Phone**: +91 96522 26061\n"
                "- **Email**: info@mlrinstitutions.ac.in\n"
                "- **Address**: Dundigal, Hyderabad, Telangana\n"
                "- **Website**: https://mlrit.ac.in\n\n"
                "Click the button below for the official contact page."
            )
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "contact",
                "navigation_url": WEBSITE_ROUTES["contact"],
                "confidence": 1.0,
                "query_type": "general",
            }

        # Note: specific route-number/stop-name queries are already handled by the
        # "Campus Fast Facts: Transport" stage above (Phase 2), which runs before
        # Website Content Summaries. Anything reaching this point is either a broader
        # transport query that stage didn't claim, or one that skipped it for some
        # other reason — this generic pointer message is the final fallback.
        transport_exclude = ["protocol", "layer", "tcp", "udp", "osi", "network layer"]
        is_transport_query = (
            any(re.search(r'\b' + re.escape(k) + r'\b', query_lower) for k in ["transport", "bus", "bus facility", "bus route"])
            and not any(k in query_lower for k in transport_exclude)
        )
        if is_transport_query:
            answer = (
                "MLRIT provides bus transport facilities connecting the campus to various parts of Hyderabad. "
                "For routes, timings and fare details, please check the official Transport page or contact the administration."
            )
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "transport",
                "navigation_url": WEBSITE_ROUTES["transport"],
                "confidence": 1.0,
                "query_type": "general",
            }

        is_publications_query = any(
            k in query_lower for k in ["publication", "publications", "faculty publications", "research publications"]
        )
        if is_publications_query:
            answer = (
                "MLRIT faculty publish research across domains including AI, VLSI, communications and more. "
                "For the detailed list of faculty and research publications, please visit the Research & Publications page."
            )
            return {
                "answer": answer,
                "sources": [],
                "navigation_target": "publications",
                "navigation_url": WEBSITE_ROUTES["publications"],
                "confidence": 1.0,
                "query_type": "general",
            }

        # ─── Contextual Intent Enrichment ──────────────────────────────────────────────
        # A bare "yes"/"sure"/"go ahead" typed in reply to the assistant's own follow-up
        # question ("Want to know more about placements?") has no topic keyword of its
        # own and would otherwise fail the Scope Gate below. If the immediate last turn
        # was the assistant asking about a recognizable MLRIT topic, fold that topic into
        # the message before the gate runs, so the affirmation is correctly recognized as
        # in-scope and routed (department/general/navigation) using that same context.
        enriched_message = self.query_router.enrich_short_affirmation(message, conversation_history)
        if enriched_message != message:
            logger.info(f"[Session: {session_id}] Short affirmation enriched: '{message}' -> '{enriched_message}'")
            message = enriched_message

        # ─── MLRIT Scope Gate ───────────────────────────────────────────────────────────
        # A lightweight allow-list check — queries that don't plausibly relate to MLRIT
        # (general trivia, coding requests, unrelated topics) are declined here, before
        # ever reaching the RAG pipeline, instead of letting the LLM free-answer from
        # its own general knowledge.
        if not self.query_router.is_in_scope(message, conversation_history):
            # Entity safety net — a query naming ANY entity (person, department,
            # lab, office role, or topic page) — typo'd, abbreviated, or otherwise
            # not an exact substring hit earlier — must never be declined as
            # off-topic. Re-checked here, once, right before the decline, rather
            # than earlier in the pipeline, so it costs nothing on the vastly more
            # common path where an earlier fast-path intercept already resolved it.
            with profiler.stage("Faculty Lookup"):
                fuzzy_hits = self.faculty_index.lookup_by_name(message)
            if fuzzy_hits:
                logger.info(f"[Session: {session_id}] Scope Gate safety net: fuzzy faculty match for '{message}'")
                return self._build_faculty_answer(fuzzy_hits)
            entity_hit = self.universal_entity_registry.resolve(message)
            if entity_hit:
                logger.info(f"[Session: {session_id}] Scope Gate safety net: universal entity match for '{message}'")
                return entity_hit
            return {
                "answer": self.rag_engine.generate_off_topic_response(message, conversation_history),
                "sources": [],
                "navigation_target": None,
                "navigation_url": None,
                "confidence": 1.0,
                "query_type": "out_of_scope",
            }

        # Classify the query
        query_type = self.query_router.classify_query(message)
        # Finer-grained intent (comparison, multi_part, faculty, hod, ...) — only
        # used from here down to pick the RAG retrieval profile (top_k,
        # candidate_k, force_rerank; see intent_router.INTENT_RETRIEVAL_PROFILE).
        # Everything ABOVE this point in the pipeline is unaffected by it.
        with profiler.stage("Intent Router"):
            intent = self.intent_router.classify(message, conversation_history)
        logger.info(f"[Session: {session_id}] Query type: {query_type}, intent: {intent}")

        # Handle navigation queries
        if query_type == "navigation":
            return await self._handle_navigation(message, session_id, conversation_history, on_token=on_token, profiler=profiler)

        # Handle department-specific queries (bare department names are
        # already intercepted earlier in _route_message — see "Bare
        # Department Overview" — so anything reaching here has extra wording,
        # e.g. "CSE placements", "CSE HOD", and keeps its specific handling).
        elif query_type == "department":
            return await self._handle_department_query(message, session_id, conversation_history, intent=intent, on_token=on_token, profiler=profiler, defer_llm=defer_llm)

        # Handle general queries
        else:
            return await self._handle_general_query(message, session_id, conversation_history, intent=intent, on_token=on_token, profiler=profiler)

    def _build_navigation_response(self, page_name: str, url: Optional[str]) -> Dict[str, Any]:
        """
        Shared navigation response builder — the single place that formats a
        "take me to X" answer. Used by both the navigation-first router (bare
        page names like "placements") and the existing verb-based navigation
        handler (e.g. "take me to the placements page"), so both paths return
        the exact same response shape.
        """
        # "departments" is a generic query (no specific department named) — don't
        # auto-navigate to UG; let the frontend show UG/PG choice buttons instead.
        if page_name == "departments":
            return {
                "answer": "MLRIT offers both Undergraduate and Postgraduate departments. Which would you like to explore?",
                "sources": [],
                "navigation_target": "departments",
                "navigation_url": None,
                "confidence": 1.0,
                "query_type": "navigation",
            }

        display_name = NAVIGATION_FRIENDLY_NAMES.get(page_name, page_name.replace("-", " ").title())
        answer = f"Sure! I'll take you to the **{display_name}**. Click the button below to navigate there."

        return {
            "answer": answer,
            "sources": [],
            "navigation_target": page_name,
            "navigation_url": url,
            "confidence": 1.0,
            "query_type": "navigation",
        }

    async def _answer_with_rag(
        self,
        query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        department: Optional[str] = None,
        intent: Optional[str] = None,
        on_token: Optional[Any] = None,
        profiler: Optional[RequestProfiler] = None,
    ) -> Dict[str, Any]:
        """
        Shared entry point for every RAG call site — non-streaming (on_token is
        None) delegates straight to rag_engine.answer_with_rag exactly as before.
        Streaming (on_token given) instead drains rag_engine.answer_with_rag_stream,
        forwarding each token as it's produced and assembling the same
        {"answer", "sources", "confidence"} shape once the stream ends, so every
        caller downstream (nav_target logic, entity linkification, follow-ups)
        works identically either way.
        """
        profiler = profiler or get_noop_profiler()
        if on_token is None:
            return await self.rag_engine.answer_with_rag(
                query, conversation_history=conversation_history, department=department, intent=intent,
                profiler=profiler,
            )

        chunks: List[str] = []
        sources: List[Dict[str, Any]] = []
        confidence = 0.5
        for event in self.rag_engine.answer_with_rag_stream(
            query, conversation_history=conversation_history, department=department, intent=intent,
            profiler=profiler,
        ):
            if event["type"] == "token":
                chunks.append(event["text"])
                on_token(event["text"])
            else:
                sources = event["sources"]
                confidence = event["confidence"]
        return {"answer": "".join(chunks), "sources": sources, "confidence": confidence}

    async def _handle_navigation(
        self,
        message: str,
        session_id: str,
        conversation_history: List[Dict[str, str]],
        on_token: Optional[Any] = None,
        profiler: Optional[RequestProfiler] = None,
    ) -> Dict[str, Any]:
        """Handle navigation-type queries."""
        page_name, url = self.query_router.extract_navigation_target(message)

        if page_name and (url or page_name == "departments"):
            return self._build_navigation_response(page_name, url)

        # Could not find a specific route — use RAG to answer
        rag_result = await self._answer_with_rag(message, conversation_history, on_token=on_token, profiler=profiler)

        # Same rule as the department handlers (item 8): no retrieved context means
        # no trustworthy basis for an answer — say so instead of letting the LLM
        # free-answer from an empty context.
        if not rag_result["sources"]:
            return {
                "answer": "I couldn't find official information regarding that. You can also visit the [MLRIT website](https://mlrit.ac.in) directly.",
                "sources": [],
                "navigation_target": None,
                "navigation_url": None,
                "confidence": 0.0,
                "query_type": "navigation",
            }

        answer = rag_result["answer"] + "\n\nFor navigation, you can also visit the [MLRIT website](https://mlrit.ac.in) directly."
        return {
            "answer": answer,
            "sources": rag_result["sources"],
            "navigation_target": None,
            "navigation_url": None,
            "confidence": rag_result["confidence"],
            "query_type": "navigation",
        }

    async def _handle_department_query(
        self,
        message: str,
        session_id: str,
        conversation_history: List[Dict[str, str]],
        intent: Optional[str] = None,
        on_token: Optional[Any] = None,
        profiler: Optional[RequestProfiler] = None,
        defer_llm: bool = False,
    ) -> Dict[str, Any]:
        """Handle department-specific queries using RAG."""
        profiler = profiler or get_noop_profiler()
        department = self.query_router.extract_department(message)

        # Check if there's also a navigation target for the department — needed
        # either way (deferred or not), so compute it once up front.
        nav_target = None
        nav_url = None
        if department:
            dept_key = department.lower().replace(" ", "-")
            if dept_key in WEBSITE_ROUTES:
                nav_target = dept_key
                nav_url = WEBSITE_ROUTES[dept_key]

        # Phase 3 (multi-question batching): when part of a multi-part message,
        # retrieve now (retrieval quality/logic unchanged — this sub-question
        # still gets its own real retrieval) but defer the Groq generation call
        # so `chat()` can combine it with any OTHER department-scoped
        # sub-question that shares this same department into ONE Groq call.
        # Never used with streaming (on_token is always None for a deferred
        # sub-question — multi-part questions aren't wired to /chat/stream).
        if defer_llm and on_token is None:
            retrieved = self.rag_engine.retrieve_context(
                message, department=department, intent=intent or "department", profiler=profiler,
            )
            if department and not retrieved["sources"]:
                return {
                    "answer": f"I couldn't find official information for the {department} department.",
                    "sources": [], "navigation_target": nav_target, "navigation_url": nav_url,
                    "confidence": 0.0, "query_type": "department",
                }
            return {
                "answer": None, "sources": retrieved["sources"], "navigation_target": nav_target,
                "navigation_url": nav_url, "confidence": retrieved["confidence"], "query_type": "department",
                "_deferred_kind": "dept_rag", "_query": message, "_context": retrieved["context"],
                "_department_key": department,
            }

        rag_result = await self._answer_with_rag(
            message,
            conversation_history=conversation_history,
            department=department,
            intent=intent or "department",
            on_token=on_token,
            profiler=profiler,
        )

        # No chunks matched this specific department — never let the LLM answer from
        # an empty/cross-department context. Say so plainly instead (see item 1: the
        # retrieval layer no longer falls back to other departments on a miss, so an
        # empty result here means "no official content for this department", full stop).
        if department and not rag_result["sources"]:
            return {
                "answer": f"I couldn't find official information for the {department} department.",
                "sources": [],
                "navigation_target": nav_target,
                "navigation_url": nav_url,
                "confidence": 0.0,
                "query_type": "department",
            }

        return {
            "answer": rag_result["answer"],
            "sources": rag_result["sources"],
            "navigation_target": nav_target,
            "navigation_url": nav_url,
            "confidence": rag_result["confidence"],
            "query_type": "department",
        }

    async def _handle_department_overview(
        self,
        message: str,
        session_id: str,
        conversation_history: List[Dict[str, str]],
        on_token: Optional[Any] = None,
        profiler: Optional[RequestProfiler] = None,
    ) -> Dict[str, Any]:
        """
        Handle a BARE department name/abbreviation ("cse", "mech", "csd") —
        composes an overview entirely from data already in the system (no new
        hardcoded content): the existing hybrid-retrieval RAG pipeline for
        programs/research, HOD_INFO for the department head, labs_directory
        for lab count, and COLLEGE_INFO for the college-wide placement
        headline. Attaches the department as the navigation target, which the
        (unmodified) frontend already renders as View Department + Faculty +
        Laboratories quick-action buttons.
        """
        profiler = profiler or get_noop_profiler()
        department = self.query_router.extract_department(message)
        dept_key = department.lower().replace(" ", "-") if department else None

        rag_result = await self._answer_with_rag(
            f"Give a brief academic overview of the {department} department at MLRIT, "
            f"including its degree programs and research focus.",
            conversation_history=conversation_history,
            department=department,
            intent="department",
            profiler=profiler,
            on_token=on_token,
        )

        # No indexed chunks for THIS specific department — never substitute another
        # department's syllabus content. Say so plainly, but still surface whatever
        # trustworthy non-RAG facts exist (HOD, lab count below) rather than going
        # completely blank, since those come from a separate, verified data source.
        if department and not rag_result["sources"]:
            parts = [f"I couldn't find detailed official curriculum information for the {department} department in our indexed documents, but here's what I can confirm:"]
            # Phase 2: DepartmentIndex (lib/departments.ts + lib/dept-data.ts) descriptive
            # data — vision/mission/history — as a verified fallback when the PDF-backed
            # RAG path has nothing for this department. Zero LLM, plain data lookup.
            if dept_key and self.department_index.has(dept_key):
                dept_rec = self.department_index.get(dept_key)
                if dept_rec.get("vision"):
                    parts.append(f"**Vision**: {dept_rec['vision']}")
                if dept_rec.get("mission"):
                    parts.append(f"**Mission**: {' '.join(dept_rec['mission'][:2])}")
        else:
            parts = [rag_result["answer"]]

        hod = HOD_INFO.get(dept_key) if dept_key else None
        if hod:
            parts.append(f"**HOD**: {hod['name']} ({hod['role']})")

        with profiler.stage("Labs Lookup"):
            labs = self.labs_directory.get_labs_for_department(dept_key) if dept_key else None
        if labs:
            parts.append(f"**Laboratories**: {len(labs)} specialized labs in the department.")

        parts.append(
            f"**Placements**: MLRIT's overall placement rate is {COLLEGE_INFO['placement_rate']}, "
            f"with packages up to {COLLEGE_INFO['highest_package']}."
        )

        nav_target = None
        nav_url = None
        if dept_key and dept_key in WEBSITE_ROUTES:
            nav_target = dept_key
            nav_url = WEBSITE_ROUTES[dept_key]

        return {
            "answer": "\n\n".join(parts),
            "sources": rag_result["sources"],
            "navigation_target": nav_target,
            "navigation_url": nav_url,
            "confidence": rag_result["confidence"],
            "query_type": "department",
        }

    async def _handle_general_query(
        self,
        message: str,
        session_id: str,
        conversation_history: List[Dict[str, str]],
        intent: Optional[str] = None,
        on_token: Optional[Any] = None,
        profiler: Optional[RequestProfiler] = None,
    ) -> Dict[str, Any]:
        """Handle general college information queries using RAG and detect department navigation."""
        profiler = profiler or get_noop_profiler()
        query_lower = message.lower()

        # Canonical topic synonyms take priority (e.g. "eligibility", "recruiters", "curriculum")
        matched_route = match_canonical_route(query_lower)

        # Fall back to a plain route-key substring check for routes not covered above
        # (e.g. "iqac", "naac", "nba", "sports", "fees", "scholarships", "cafeteria", "clubs")
        if not matched_route:
            for route_key in WEBSITE_ROUTES:
                if route_key in ["home", "pg", "ug"]:
                    continue
                if route_key in query_lower:
                    matched_route = route_key
                    break

        # Generic "departments" phrasing ("departments", "what departments are
        # available?", "list of departments", "show all departments") must give
        # the exact same short guiding question + UG/PG buttons as the bare-word
        # navigation path (_handle_navigation / detect_pure_navigation), instead
        # of running RAG and dumping a long paragraph. "which departments ..."
        # queries name specific departments in the answer, so they skip this and
        # fall through to RAG + entity linking below.
        if matched_route == "departments" and "which" not in query_lower:
            return self._build_navigation_response("departments", None)

        # Only navigate based on an explicit department keyword in the query itself.
        # We deliberately do NOT fall back to guessing a department from the top RAG
        # source's metadata — that guess is based on semantic similarity, not the
        # user's actual intent, and can point to an unrelated department page.
        #
        # Skip this for "which departments ..." queries (matched_route == "departments"):
        # DEPARTMENT_KEYWORDS' short, ambiguous entries (e.g. "ai" inside "AI courses")
        # would otherwise wrongly scope retrieval to a single department, when the
        # query is actually asking which departments qualify — the answer should name
        # whichever ones are actually relevant, found via entity linking below.
        dept = self.query_router.extract_department(message) if matched_route != "departments" else None

        # The current message is genuinely ambiguous on its own — inherit whatever
        # topic/department the conversation was already about (e.g. "Admissions"
        # then "What documents are required?"). An explicit topic in THIS message
        # always takes precedence over history.
        inferred_department = None
        if not matched_route and not dept and conversation_history:
            inferred_target, inferred_url = self._infer_context_route(conversation_history, profiler=profiler)
            if inferred_target:
                if inferred_url and inferred_url.startswith("/departments/") and "#" not in inferred_url:
                    inferred_department = inferred_target
                else:
                    matched_route = inferred_target

        # Bias retrieval toward the relevant department's syllabus when one is known
        # (explicit or inherited) — reuses the retriever's existing department filter.
        # Metadata on indexed chunks is Title Case (e.g. "AIML", "CSE-DS" — see
        # pdf_processor.get_department_from_path), so the filter value passed to RAG
        # must match that exact casing, NOT the lowercase-hyphenated route-key form
        # (e.g. "aiml") used for nav_target/nav_url elsewhere in this function.
        inferred_department_title = None
        if inferred_department:
            inferred_department_title = next(
                (v for v in DEPARTMENT_KEYWORDS.values() if v.lower().replace(" ", "-") == inferred_department),
                None,
            )
        rag_department = dept or inferred_department_title

        rag_result = await self._answer_with_rag(
            message,
            conversation_history=conversation_history,
            department=rag_department,
            intent=intent,
            on_token=on_token,
            profiler=profiler,
        )

        if rag_department and not rag_result["sources"]:
            dept_label = dept or inferred_department_title
            fallback_nav = (dept.lower().replace(" ", "-") if dept else inferred_department)
            return {
                "answer": f"I couldn't find official information for the {dept_label} department.",
                "sources": [],
                "navigation_target": fallback_nav if fallback_nav in WEBSITE_ROUTES else None,
                "navigation_url": WEBSITE_ROUTES.get(fallback_nav),
                "confidence": 0.0,
                "query_type": "general",
            }

        nav_target = None
        nav_url = None
        entities = None
        skip_entity_scan = False

        if matched_route:
            nav_target = matched_route
            if matched_route == "departments":
                # Only reachable here for "which departments ..." queries — the
                # generic case already returned early above. Link the specific
                # departments named in the answer (e.g. "Which departments have
                # AI courses?" -> CSE, AIML) via the existing entity registry
                # instead of the generic UG/PG picker.
                dept_entities = self._find_department_entities(rag_result["answer"])
                if dept_entities:
                    nav_target = None
                    entities = dept_entities
                else:
                    skip_entity_scan = True
            else:
                nav_url = WEBSITE_ROUTES[matched_route]
        elif inferred_department:
            nav_target = inferred_department
            nav_url = WEBSITE_ROUTES.get(inferred_department)
        elif dept:
            dept_key = dept.lower().replace(" ", "-")
            if dept_key in WEBSITE_ROUTES:
                nav_target = dept_key
                nav_url = WEBSITE_ROUTES[dept_key]

        result = {
            "answer": rag_result["answer"],
            "sources": rag_result["sources"],
            "navigation_target": nav_target,
            "navigation_url": nav_url,
            "confidence": rag_result["confidence"],
            "query_type": "general",
        }
        if entities is not None:
            result["entities"] = entities
        if skip_entity_scan:
            result["_skip_entity_scan"] = True
        return result

    def reindex_pdfs(self) -> Dict[str, Any]:
        """Trigger a full reindex of all PDFs, rebuilding both the vector store and BM25 index."""
        try:
            count = self.vector_store.reindex(PDF_DIR)

            self.bm25_index.rebuild(self.vector_store.get_all_documents())

            # Full rebuild re-indexed everything fresh, so refresh the manifest to match.
            manifest = {os.path.basename(p): compute_file_hash(p) for p in scan_pdfs(PDF_DIR)}
            save_manifest(INDEX_MANIFEST_PATH, manifest)

            return {
                "success": True,
                "message": f"Successfully reindexed {count} document chunks.",
                "chunk_count": count,
            }
        except Exception as e:
            logger.error(f"Reindex failed: {e}")
            return {
                "success": False,
                "message": f"Reindex failed: {str(e)}",
                "chunk_count": 0,
            }

    def get_health_info(self) -> Dict[str, Any]:
        """Return health and status information."""
        try:
            vector_count = self.vector_store.get_collection_count()
            from pdf_processor import scan_pdfs
            pdf_list = scan_pdfs(PDF_DIR)
            return {
                "status": "healthy",
                "vector_count": vector_count,
                "pdf_count": len(pdf_list),
                "pdf_dir": PDF_DIR,
                "chroma_dir": CHROMA_PERSIST_DIR,
            }
        except Exception as e:
            return {
                "status": "degraded",
                "error": str(e),
                "vector_count": 0,
                "pdf_count": 0,
            }
