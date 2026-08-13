import re
import logging
from typing import Optional, Tuple

from config import WEBSITE_ROUTES

logger = logging.getLogger(__name__)

# Keywords that indicate the user wants to navigate somewhere
NAVIGATION_KEYWORDS = [
    "go to",
    "take me",
    "navigate",
    "open",
    "show me",
    "where is",
    "find",
    "visit",
    "link to",
    "redirect",
    "bring me",
    "take me to",
    "go to the",
    "open the",
    "show the",
    "page",
]

# Keywords mapping to department names
DEPARTMENT_KEYWORDS = {
    "cse": "CSE",
    "computer science": "CSE",
    "computer engineering": "CSE",
    "ece": "ECE",
    "electronics": "ECE",
    "electronics and communication": "ECE",
    "eee": "EEE",
    "electrical": "EEE",
    "electrical engineering": "EEE",
    "it": "IT",
    "information technology": "IT",
    "csit": "CSIT",
    "mechanical": "Mechanical",
    "mech": "Mechanical",
    "aeronautical": "Aeronautical",
    "aero": "Aeronautical",
    "aerospace": "Aeronautical",
    "aiml": "AIML",
    "artificial intelligence": "AIML",
    "machine learning": "AIML",
    "deep learning": "AIML",
    "ai ml": "AIML",
    "ai": "AIML",
    "cse-cs": "CSE-CS",
    "cyber security": "CSE-CS",
    "cybersecurity": "CSE-CS",
    "cse-ds": "CSE-DS",
    "data science": "CSE-DS",
    "csd": "CSE-DS",
    "ai & ml": "AIML",
    "csm": "AIML",
    "mba": "MBA",
    "management": "MBA",
    "business administration": "MBA",
    "freshman": "Freshman",
    "first year": "Freshman",
}

# Standalone greetings — the ENTIRE message (after stripping punctuation) must match one
# of these, so a real question like "Hi, tell me about admissions" is not treated as a bare greeting.
GREETING_PATTERNS = {
    "hi", "hii", "hiii", "hello", "helo", "hey", "heya", "yo",
    "good morning", "good afternoon", "good evening", "good day",
    "greetings", "namaste",
}

# Canonical website-section synonyms, checked before generic substring matching so that
# phrases like "eligibility" or "how do I apply" reliably resolve to the right overview page
# instead of falling back to weaker, less-reliable department/source-derived guesses.
CANONICAL_ROUTE_SYNONYMS = {
    "admissions": ["admission", "admissions", "apply", "eligibility", "admission process", "how do i apply", "how to apply"],
    "placements": ["placement", "placements", "recruiter", "recruiters", "company", "companies"],
    "academics": ["academics", "academic", "curriculum", "regulations", "regulation"],
    "examinations": ["examination", "examinations", "exam", "exams", "result", "results"],
    "departments": ["departments"],
    "hostel": ["hostel", "hostels"],
    "library": ["library"],
    "transport": ["transport"],
    "research": ["research"],
    "contact": ["contact"],
    "naac": ["naac"],
    "iqac": ["iqac"],
    "nirf": ["nirf"],
    "chronicles": ["chronicles"],
    "events": ["events", "event"],
}


def match_canonical_route(query_lower: str) -> Optional[str]:
    """Return the canonical WEBSITE_ROUTES key for a query, or None if no canonical topic matches."""
    for route_key, phrases in CANONICAL_ROUTE_SYNONYMS.items():
        for phrase in phrases:
            if re.search(r'\b' + re.escape(phrase) + r'\b', query_lower):
                return route_key
    return None


# ─── Navigation-First Router ────────────────────────────────────────────────
# Bare page-name queries (e.g. "placements", "csd", "training and placement")
# should navigate immediately, without ever touching hybrid retrieval. Each
# entry maps a WEBSITE_ROUTES key to the exact whole-query phrases that mean
# "take me to this page". This is intentionally an EXACT, whole-string match
# (see detect_pure_navigation) rather than a substring/keyword match — that is
# what distinguishes "placements" (navigate) from "Tell me about placements."
# or "Placement statistics" (information requests, must go through RAG).
PURE_NAVIGATION_SYNONYMS = {
    "placements": [
        "placement", "placements", "placement cell", "placement office",
        "training and placement", "training & placement", "career cell",
        "career services",
    ],
    "admissions": ["admission", "admissions"],
    "departments": ["departments", "department"],
    # NOTE: bare department names/abbreviations (cse, ece, eee, mech, mba, csd,
    # csm, aero, ...) are intentionally NOT in this map. Unlike "placements" or
    # "library", a department name is ambiguous — most users typing "cse" want
    # information about the department, not to be dropped straight onto its
    # page. Department routing is instead handled by classify_query() /
    # extract_department() below: a bare department name gets an informational
    # overview (see CollegeAssistant._handle_department_overview), while an
    # explicit navigation verb ("go to cse", "open cse", "cse page") still
    # navigates immediately via the existing NAVIGATION_KEYWORDS path.
    "library": ["library"],
    "hostel": ["hostel"],
    "principal": ["principal"],
    "faculty": ["faculty"],
    "academics": ["academics", "academic"],
    "research": ["research"],
    "iqac": ["iqac"],
    "nirf": ["nirf"],
    "chronicles": ["news"],
    "events": ["events", "event"],
    "clubs": ["clubs", "club"],
    "contact": ["contact"],
    "about": ["about"],
}


def detect_pure_navigation(query: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Navigation-first check — runs before intent classification, department
    detection, and retrieval. Returns (route_key, url) only when the ENTIRE
    normalized query is one of the known page-name synonyms (e.g. "placements",
    "training and placement", "csd"). Any additional wording ("tell me about
    placements", "placement statistics", "compare cse and ece placements")
    fails the exact-match check and falls through to the existing intent
    router / RAG pipeline, so information requests are never short-circuited.
    """
    normalized = re.sub(r"[^\w\s&]", "", query.lower()).strip()
    normalized = re.sub(r"\s+", " ", normalized)
    if not normalized:
        return None, None

    for route_key, phrases in PURE_NAVIGATION_SYNONYMS.items():
        if normalized in phrases and route_key in WEBSITE_ROUTES:
            return route_key, WEBSITE_ROUTES[route_key]

    return None, None


# Keywords for general college information queries
GENERAL_INFO_KEYWORDS = [
    "admission",
    "fee",
    "fees",
    "scholarship",
    "placement",
    "package",
    "salary",
    "recruiter",
    "recruitment",
    "recruiting",
    "company",
    "hostel",
    "library",
    "sports",
    "transport",
    "bus",
    "campus",
    "facility",
    "facilities",
    "rank",
    "ranking",
    "naac",
    "nirf",
    "accreditation",
    "affiliation",
    "jntuh",
    "aicte",
    "research",
    "lab",
    "laboratory",
    "contact",
    "phone",
    "email",
    "address",
    "location",
    "established",
    "founded",
    "history",
    "program",
    "course",
    "curriculum",
    "syllabus",
    "faculty",
    "professor",
    "staff",
    "alumni",
    "event",
    "fest",
    "cultural",
    "technical",
    "internship",
    "project",
    "club",
    "activity",
    "publication",
    "publications",
    "credit",
    "timetable",
    "document",
    "documents",
    "hod",
]

# Self-references that always mean the query is about MLRIT, regardless of topic.
MLRIT_SELF_REFERENCES = ["mlrit", "mlr institute", "the college", "this college", "the institute"]

# Clearly off-topic request shapes that must be declined even when they happen to
# contain a generic scope keyword (e.g. "write a python program" contains "program",
# which is otherwise a legitimate keyword for "what programs does MLRIT offer").
# Checked before the general keyword allow-list, but after MLRIT_SELF_REFERENCES —
# an explicit MLRIT mention always still wins.
OFF_TOPIC_PATTERNS = [
    r"write (me |us )?(a |an )?(python|java|c\+\+|c#|javascript|html|css|sql)\b",
    r"write (me |us )?(a |an )?(program|code|script|function|algorithm)\b",
    r"\bipl\b", r"cricket (score|match)", r"\bweather\b(?! app)", r"\bmovie(s)?\b",
    r"\brecipe(s)?\b", r"\bpolitics\b", r"\belection(s)?\b", r"stock (price|market)",
    r"\bjoke(s)?\b", r"song lyrics", r"who (is|was) the (president|prime minister)",
]

# Words a *generic* follow-up ("What documents are required?", "How much does it
# cost?") is built from — used only to decide whether a short, otherwise-unmatched
# message may inherit the previous turn's topic. A message naming any other content
# word (e.g. "bitcoin") is treated as a fresh, self-contained question instead, so a
# genuinely off-topic question is never let through just for landing mid-conversation.
_FOLLOWUP_STOPWORDS = {
    "is", "are", "the", "a", "an", "of", "for", "to", "do", "does", "did",
    "what", "which", "who", "how", "when", "where", "why", "i", "you", "we",
    "they", "it", "this", "that", "these", "those", "and", "or", "in", "on",
    "at", "be", "can", "could", "would", "should", "will", "my", "me",
}
_GENERIC_FOLLOWUP_WORDS = {
    "document", "documents", "detail", "details", "process", "steps", "step",
    "criteria", "requirement", "requirements", "required", "more", "else",
    "fee", "fees", "cost", "deadline", "need", "needed", "available",
    "list", "info", "information", "date", "dates", "time", "duration",
}


def _is_generic_followup(query: str) -> bool:
    """True if every content word in the query is a generic continuation word
    rather than a new, specific topic (e.g. "bitcoin", "quantum physics")."""
    words = re.findall(r"[a-z]+", query.lower())
    content_words = [w for w in words if w not in _FOLLOWUP_STOPWORDS]
    return bool(content_words) and all(w in _GENERIC_FOLLOWUP_WORDS for w in content_words)


# Ultra-short conversational affirmations (e.g. "yes" in reply to the assistant's
# own follow-up question, "Want to know more about placements?"). These carry no
# topic of their own, so on their own they fail every scope-gate check above and
# get incorrectly declined. See `enrich_short_affirmation`.
AFFIRMATION_KEYWORDS = {
    "yes", "yeah", "yep", "yup", "sure", "ok", "okay", "okie", "fine",
    "alright", "correct", "please", "continue", "proceed", "go", "ahead",
}
AFFIRMATION_PHRASES = {
    "go ahead", "yes please", "sure thing", "sounds good", "please do",
    "yes tell me", "tell me more", "tell me",
}


def is_short_affirmation(query: str) -> bool:
    """
    True for ultra-short, topic-less affirmations ("yes", "sure", "go ahead")
    that are only meaningful in reply to the assistant's preceding question.
    Requires BOTH a short message (<= 3 words) AND at least one recognized
    affirmation word/phrase, so an unrelated short off-topic message (e.g.
    "tell me joke") is never mistaken for an affirmation.
    """
    normalized = re.sub(r"[^\w\s]", "", query.lower()).strip()
    normalized = re.sub(r"\s+", " ", normalized)
    if not normalized:
        return False
    if normalized in AFFIRMATION_PHRASES:
        return True
    words = normalized.split()
    if len(words) > 3:
        return False
    return any(w in AFFIRMATION_KEYWORDS for w in words)


def extract_topic_anchor(text: str) -> Optional[str]:
    """
    Pulls a human-readable MLRIT topic (e.g. "placements", "hostel", "AIML")
    out of a piece of text — used to recover the active topic from the
    assistant's own previous message. Tries the canonical route synonyms
    first (most specific), then the general keyword list, then department
    names.
    """
    text_lower = text.lower()

    canonical = match_canonical_route(text_lower)
    if canonical:
        return canonical

    for keyword in GENERAL_INFO_KEYWORDS:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
            return keyword

    for keyword, dept_name in DEPARTMENT_KEYWORDS.items():
        if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
            return dept_name

    return None


class QueryRouter:
    """Routes user queries to the appropriate handler: navigation, department RAG, or general."""

    def enrich_short_affirmation(self, query: str, conversation_history: Optional[list] = None) -> str:
        """
        Contextual Intent Enrichment — runs BEFORE the Scope Gate / classifier.

        A bare "yes" typed in reply to the assistant's own follow-up question
        ("Want to know more about the placement process?") carries no keyword
        of its own, so every scope check above evaluates it in isolation and
        declines it. This looks at the immediate last assistant turn, pulls
        out its topic anchor (e.g. "placements"), and appends it to the query
        as inline context so the Scope Gate and downstream classifier see a
        query that plausibly relates to MLRIT and route it correctly.

        No-ops (returns the query unchanged) unless the query is a short
        affirmation AND the last turn in history is from the assistant AND
        that turn names a recognizable topic.
        """
        if not conversation_history or not is_short_affirmation(query):
            return query

        last_turn = conversation_history[-1]
        if last_turn.get("role") != "assistant":
            return query

        anchor = extract_topic_anchor(last_turn.get("content", ""))
        if not anchor:
            return query

        enriched = f"{query} (context: MLRIT {anchor})"
        logger.info(f"Enriched short affirmation '{query}' -> '{enriched}'")
        return enriched

    def is_in_scope(self, query: str, conversation_history: Optional[list] = None) -> bool:
        """
        Lightweight allow-list gate — True if the query plausibly relates to MLRIT
        (a department, admissions/placements/etc. topic, a facility, or an explicit
        self-reference). Reuses the existing keyword/synonym lists already defined
        above rather than introducing new classification logic. Queries that match
        nothing here are declined before ever reaching the RAG pipeline, instead of
        letting the LLM free-answer general trivia from its own training knowledge.

        A *generic* follow-up that doesn't independently match anything (e.g. "What
        documents are required?" right after "Admissions") is still let through when
        the immediately preceding user turn was itself in-scope — the actual topic is
        then resolved from that same history downstream. This only applies when every
        content word in the message is a generic continuation word (see
        `_is_generic_followup`), so a fully-formed, self-contained off-topic question
        naming its own topic (e.g. "What is Bitcoin?") is still declined regardless of
        where it lands in the conversation.
        """
        query_lower = query.lower()

        if any(ref in query_lower for ref in MLRIT_SELF_REFERENCES):
            return True
        if any(re.search(p, query_lower) for p in OFF_TOPIC_PATTERNS):
            return False
        if match_canonical_route(query_lower):
            return True
        if any(re.search(r'\b' + re.escape(k) + r'\b', query_lower) for k in GENERAL_INFO_KEYWORDS):
            return True
        if any(re.search(r'\b' + re.escape(k) + r'\b', query_lower) for k in DEPARTMENT_KEYWORDS):
            return True

        if conversation_history and _is_generic_followup(query):
            for turn in reversed(conversation_history):
                if turn.get("role") != "user":
                    continue
                return self.is_in_scope(turn.get("content", ""))

        return False

    def is_greeting(self, query: str) -> bool:
        """True only if the whole message is a bare greeting (e.g. 'Hi', 'Good morning')."""
        cleaned = re.sub(r"[^a-z\s]", "", query.lower()).strip()
        cleaned = re.sub(r"\s+", " ", cleaned)
        return cleaned in GREETING_PATTERNS

    def classify_query(self, query: str) -> str:
        """
        Classify the query into one of three types:
        - 'navigation': user wants to go to a page
        - 'department': user is asking about a specific department
        - 'general': general college information query
        """
        query_lower = query.lower().strip()

        # Check for navigation intent first
        for keyword in NAVIGATION_KEYWORDS:
            if keyword in query_lower:
                logger.info(f"Query classified as 'navigation': matched keyword '{keyword}'")
                return "navigation"

        # A query naming "departments" (plural) is asking about departments in general
        # ("which departments have AI courses?"), even if it also contains a short,
        # ambiguous DEPARTMENT_KEYWORDS entry (e.g. "ai" inside "AI courses", "it" inside
        # "IT courses") — that keyword must not hijack it into a single-department query.
        if match_canonical_route(query_lower) == "departments":
            return "general"

        # Check for department-specific queries — use word-boundary match to avoid false positives
        # e.g. "it" substring in "what is it" should not trigger IT department
        for keyword in DEPARTMENT_KEYWORDS:
            if re.search(r'\b' + re.escape(keyword) + r'\b', query_lower):
                logger.info(f"Query classified as 'department': matched keyword '{keyword}'")
                return "department"

        # Default to general
        logger.info("Query classified as 'general'")
        return "general"

    def extract_navigation_target(self, query: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Extract the navigation target from a navigation query.
        Returns (page_name, url) tuple. Both may be None if not found.
        """
        query_lower = query.lower().strip()

        # Canonical topic synonyms take priority — reliable word-boundary matches for
        # phrases (e.g. "eligibility", "recruiters") that plain substring checks below miss.
        canonical_key = match_canonical_route(query_lower)
        if canonical_key and canonical_key in WEBSITE_ROUTES:
            url = WEBSITE_ROUTES[canonical_key]
            logger.info(f"Navigation target via canonical synonym: {canonical_key} -> {url}")
            return canonical_key, url

        # Try to match route keys in the query
        best_match_key = None
        best_match_len = 0

        for route_key in WEBSITE_ROUTES:
            if route_key in query_lower and len(route_key) > best_match_len:
                best_match_key = route_key
                best_match_len = len(route_key)

        if best_match_key:
            url = WEBSITE_ROUTES[best_match_key]
            logger.info(f"Navigation target found: {best_match_key} -> {url}")
            return best_match_key, url

        # Try department keywords as navigation targets
        for keyword, dept_name in DEPARTMENT_KEYWORDS.items():
            if re.search(r'\b' + re.escape(keyword) + r'\b', query_lower):
                dept_key = dept_name.lower().replace(" ", "-")
                if dept_key in WEBSITE_ROUTES:
                    url = WEBSITE_ROUTES[dept_key]
                    logger.info(f"Navigation target via department: {dept_key} -> {url}")
                    return dept_key, url

        # Try common synonyms
        synonym_map = {
            "home page": "home",
            "homepage": "home",
            "main page": "home",
            "admission page": "admissions",
            "apply": "admissions",
            "placement page": "placements",
            "placement record": "placements",
            "contact page": "contact",
            "contact us": "contact",
            "fee structure": "fees",
            "fee details": "fees",
            "scholarship page": "scholarships",
            "naac page": "naac",
            "nirf page": "nirf",
            "research page": "research",
            "sports page": "sports",
            "hostel page": "hostel",
            "library page": "library",
            "transport page": "transport",
            "events page": "events",
            "alumni page": "alumni",
            "careers page": "careers",
        }

        for synonym, route_key in synonym_map.items():
            if synonym in query_lower and route_key in WEBSITE_ROUTES:
                url = WEBSITE_ROUTES[route_key]
                logger.info(f"Navigation target via synonym '{synonym}': {route_key} -> {url}")
                return route_key, url

        logger.info("No navigation target found in query.")
        return None, None

    def extract_department(self, query: str) -> Optional[str]:
        """
        Extract the department name from a department-type query.
        Returns the department name string or None.
        """
        query_lower = query.lower().strip()

        best_match_dept = None
        best_match_len = 0

        for keyword, dept_name in DEPARTMENT_KEYWORDS.items():
            if re.search(r'\b' + re.escape(keyword) + r'\b', query_lower) and len(keyword) > best_match_len:
                best_match_dept = dept_name
                best_match_len = len(keyword)

        if best_match_dept:
            logger.info(f"Department extracted: {best_match_dept}")
        else:
            logger.info("No specific department found in query.")

        return best_match_dept

    def is_bare_department_query(self, query: str) -> bool:
        """
        True when the ENTIRE normalized query is just a department name/
        abbreviation on its own (e.g. "cse", "Mech", "aero!") with no other
        wording. This is the confidence rule that resolves department-name
        ambiguity: a bare department name is informational-by-default (see
        CollegeAssistant._handle_department_overview), while anything with
        extra words ("CSE placements", "CSE HOD", "go to cse") is NOT bare
        and is handled by the existing, more specific routes.
        """
        normalized = re.sub(r"[^\w\s&-]", "", query.lower()).strip()
        normalized = re.sub(r"\s+", " ", normalized)
        return normalized in DEPARTMENT_KEYWORDS
