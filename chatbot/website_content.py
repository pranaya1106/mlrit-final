import os
import re
import logging
from typing import Any, Dict, Optional

from config import WEBSITE_ROUTES
from text_normalize import normalize_query_for_matching, normalize_phrase
from data_paths import read_text as _resolved_read_text
from profiler import get_noop_profiler
from groq_metrics import call_groq

logger = logging.getLogger(__name__)

# ─── Website Content Summarizer ─────────────────────────────────────────────
# Per this turn's directive: for topics where the Next.js website already
# carries real, maintained content, the chatbot must summarize THAT content
# instead of carrying a second, hand-typed copy in a Python dict. This module
# extracts the actual text out of the website's own source files (the same
# pattern as FacultyDirectory/AdministrationDirectory, generalized to full
# page content) and hands it to the LLM for a short conversational summary —
# a single direct LLM call, NOT a hybrid-retrieval/Chroma/BM25/CrossEncoder
# query, so this never touches the vector pipeline.
#
# Only topics with a genuine, extractable real-content source are listed here.
# Topics with no local page (library, alumni prose) are intentionally left out
# — they remain handled by structured_topics.py's honest external-link
# fallback rather than being force-fit into this summarizer.

# Ignore these keys when generically scanning InfoBlock-shaped objects —
# they're structural/styling, not prose content.
_IGNORE_KEYS = {
    "kind", "href", "variant", "icon", "external", "accent", "badge", "badgeColor",
    "src", "alt", "img", "color", "headerBg", "current", "status",
}
_CONTENT_KEY_PATTERN = re.compile(
    r"\b(" + "|".join([
        "text", "title", "body", "label", "eyebrow", "italic", "sub", "dek",
        "desc", "description", "detail", "quote", "attribution", "role",
        "num", "val", "y", "t", "d", "tag", "meta", "subtitle", "caption",
        "heading", "purpose", "name", "summary",
    ]) + r")\s*:\s*(['\"`])((?:(?!\2)[^\\]|\\.)*)\2",
    re.IGNORECASE,
)


def _read_file(path: str) -> Optional[str]:
    """Reads a frontend source file. `path` is repo-root-relative (e.g.
    'lib/research.ts', 'app/iqac/page.tsx') — resolved via data_paths.py's
    shared FRONTEND_ROOT logic, not a literal relative-to-cwd path. Kept as a
    thin wrapper (same name/signature) since ingest/*.py modules already
    import this function directly."""
    return _resolved_read_text(path, feature="Website content summary")


_LONG_STRING_PATTERN = re.compile(r"""(['"`])((?:(?!\1)[^\\]|\\.){15,})\1""")


def _generic_block_text(content: str, max_chars: int = 3000) -> str:
    """Pulls every content-bearing string literal out of a JS/TS object/array
    literal (InfoBlock[]-shaped or ad-hoc), skipping structural keys, and
    joins them into a flat text blob suitable as LLM context. Falls back to
    grabbing any long standalone string literal (e.g. a plain array of
    strings like `['800+ networked systems...', ...]` with no keys at all)."""
    seen = []
    for m in _CONTENT_KEY_PATTERN.finditer(content):
        value = m.group(3).strip()
        if len(value) < 3:
            continue
        if value.startswith("/") or value.startswith("http") or value.startswith("#"):
            continue
        seen.append(value)

    for m in _LONG_STRING_PATTERN.finditer(content):
        value = m.group(2).strip()
        if value.startswith("/") or value.startswith("http"):
            continue
        seen.append(value)
        if sum(len(s) for s in seen) > max_chars:
            break

    return "\n".join(dict.fromkeys(seen))  # de-dup while preserving order


def _slice_top_level_entry(content: str, slug: str) -> Optional[str]:
    """Isolates one `'<slug>': { ... }` (or bare `slug: { ... }`) entry out of
    a larger Record<string, T> object literal (e.g. lib/info-pages.ts,
    lib/research.ts's RESEARCH_PAGES), by finding the slug key and scanning to
    the next same-indentation key."""
    idx = content.find(f"'{slug}':")
    if idx == -1:
        idx = content.find(f'"{slug}":')
    if idx == -1:
        # Bare/unquoted identifier key, e.g. `entrepreneurship: {`
        m = re.search(r'(?<![\w.\'"])' + re.escape(slug) + r':\s*\{', content)
        idx = m.start() if m else -1
    if idx == -1:
        return None
    next_idx = content.find("\n  '", idx + 1)
    if next_idx == -1:
        next_idx = content.find('\n  "', idx + 1)
    if next_idx == -1:
        # Next bare-identifier top-level key at 2-space indent, e.g. "\n  centers: {"
        m = re.search(r"\n  [a-zA-Z_][\w-]*:\s*\{", content[idx + 1:])
        next_idx = idx + 1 + m.start() if m else -1
    return content[idx:next_idx] if next_idx != -1 else content[idx:idx + 6000]


def _extract_const(content: str, const_name: str) -> Optional[str]:
    """Extracts the full `[export] const NAME = ...;` statement's source text."""
    m = re.search(r"(?:export\s+)?const\s+" + re.escape(const_name) + r"\b.*?=", content, re.DOTALL)
    if not m:
        return None
    start = m.end()
    # Find the matching top-level terminator: a `;` at bracket-depth 0.
    depth = 0
    i = start
    in_string = None
    while i < len(content):
        ch = content[i]
        if in_string:
            if ch == "\\":
                i += 2
                continue
            if ch == in_string:
                in_string = None
        elif ch in "'\"`":
            in_string = ch
        elif ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
        elif ch == ";" and depth <= 0:
            return content[start:i]
        i += 1
    return content[start:start + 4000]


# ─── Per-source extractors ──────────────────────────────────────────────────

def _extract_info_pages_slug(slug: str) -> Optional[str]:
    content = _read_file("lib/info-pages.ts")
    if not content:
        return None
    block = _slice_top_level_entry(content, slug)
    return _generic_block_text(block) if block else None


def _extract_research_overview() -> Optional[str]:
    content = _read_file("lib/research.ts")
    if not content:
        return None
    const_text = _extract_const(content, "RESEARCH_OVERVIEW")
    return _generic_block_text(const_text) if const_text else None


def _extract_research_slug(slug: str) -> Optional[str]:
    content = _read_file("lib/research.ts")
    if not content:
        return None
    block = _slice_top_level_entry(content, slug)
    return _generic_block_text(block) if block else None


def _extract_plain_string_literal(text: str) -> Optional[str]:
    """Extracts a bare `"..."` / `'...'` string value (as opposed to a
    key:value object literal) — used for consts that are just a string,
    e.g. `export const PLACEMENT_OVERVIEW = "...";`."""
    m = re.search(r"""(['"`])((?:(?!\1)[^\\]|\\.)*)\1""", text, re.DOTALL)
    return m.group(2).strip() if m else None


def _extract_placements_overview() -> Optional[str]:
    content = _read_file("lib/placements.ts")
    if not content:
        return None
    parts = []
    overview_text = _extract_const(content, "PLACEMENT_OVERVIEW")
    if overview_text:
        plain = _extract_plain_string_literal(overview_text)
        if plain:
            parts.append(plain)
    for name in ("INFRASTRUCTURE_LIST", "TRAINING"):
        const_text = _extract_const(content, name)
        if const_text:
            parts.append(_generic_block_text(const_text))
    return "\n".join(p for p in parts if p) or None


# A clearly-labeled GENERIC framework (not MLRIT-specific data) describing the
# typical steps most campus placement drives follow. Fed to the LLM alongside
# the real MLRIT placements content below, with an explicit instruction (see
# the system prompt) to present it as typical practice — not an invented
# institute rule — and to note that the exact process varies by recruiter.
_GENERIC_PLACEMENT_PROCESS_FRAMEWORK = (
    "GENERAL PLACEMENT PROCESS FRAMEWORK (this is a typical industry-wide flow, NOT an MLRIT-specific "
    "policy — present it as general practice and explicitly note the exact process varies by recruiter):\n"
    "1. Pre-placement training (aptitude, communication, and technical skill-building)\n"
    "2. Company registration — the recruiter shares role details and eligibility criteria for that drive\n"
    "3. Aptitude / screening round\n"
    "4. Technical or coding round, where applicable to the role\n"
    "5. Technical interview\n"
    "6. HR interview\n"
    "7. Offer letter to selected candidates\n"
)


def _extract_placement_process_content() -> Optional[str]:
    """Combines the generic funnel framework above with MLRIT's real placements
    overview content, so the LLM can explain the typical process conversationally
    while still grounding MLRIT-specific claims (training, infrastructure) in
    real page content rather than inventing them."""
    parts = [_GENERIC_PLACEMENT_PROCESS_FRAMEWORK]
    real_content = _extract_placements_overview()
    if real_content:
        parts.append("OFFICIAL MLRIT PLACEMENTS PAGE CONTENT:\n" + real_content)
    return "\n\n".join(parts)


def _extract_placements_statistics() -> Optional[str]:
    content = _read_file("lib/placements.ts")
    if not content:
        return None
    const_text = _extract_const(content, "YEAR_STATS")
    if not const_text:
        return None
    # YEAR_STATS is a flat typed array — parse it precisely instead of the
    # generic key scan, since these are real published numbers.
    rows = re.findall(
        r"year:\s*'([^']*)'.*?offers:\s*(\d+).*?companies:\s*(\d+).*?highest:\s*([\d.]+)",
        const_text,
    )
    lines = [f"{y}: {o} offers from {c} companies, highest package {h} LPA" for y, o, c, h in rows]
    return "Year-by-year placement statistics:\n" + "\n".join(lines) if lines else None


def _extract_recruiters() -> Optional[str]:
    content = _read_file("lib/placements.ts")
    if not content:
        return None
    parts = []
    recruiters_text = _extract_const(content, "RECRUITERS")
    if recruiters_text:
        names = re.findall(r"'([^']+)'", recruiters_text)
        if names:
            parts.append("Recruiting companies: " + ", ".join(names))
    mous_text = _extract_const(content, "MOUS")
    if mous_text:
        parts.append(_generic_block_text(mous_text))
    return "\n".join(parts) if parts else None


def _extract_fees() -> Optional[str]:
    content = _read_file("app/admissions/fees/page.tsx")
    if not content:
        return None
    const_text = _extract_const(content, "FEE_DATA")
    return _generic_block_text(const_text) if const_text else None


def _extract_whole_file(path: str) -> Optional[str]:
    content = _read_file(path)
    return _generic_block_text(content) if content else None


# The IQAC PDF ("IQAC web content.pdf", copied into chatbot/pdfs/IQAC.pdf so
# it's also picked up by the incremental PDF sync into Chroma/BM25 as a
# fallback path) is the PRIMARY source for IQAC prose content — vision,
# mission, core functions, quality framework, process flow, composition,
# member roles, etc. Read directly with pypdf here (same library
# pdf_processor.py already uses) rather than the generic TS-string-literal
# extractors above, since this is a PDF, not a frontend source file.
_IQAC_PDF_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pdfs", "IQAC.pdf")


def _extract_iqac_content() -> Optional[str]:
    try:
        from pypdf import PdfReader
        reader = PdfReader(_IQAC_PDF_PATH)
        pages = [page.extract_text() or "" for page in reader.pages]
        text = "\n".join(p.strip() for p in pages if p.strip())
    except Exception as e:
        logger.warning(f"WebsiteContent: failed to read IQAC PDF at {_IQAC_PDF_PATH}: {e}")
        text = None

    if text and text.strip():
        return text

    # Fall back to the live website page if the PDF is ever missing/unreadable.
    return _extract_whole_file("app/iqac/page.tsx")


# Generic verb-phrases that, taken alone, sound admissions-related ("can I
# join?", "how do I join?") but are equally plausible about joining a club,
# society, or event. Scored at a fixed low priority so a query naming an
# actual topic noun ("what clubs can I join") always wins on that noun
# instead of accidentally matching the longer, but less specific, verb
# phrase. A bare, contextless use of these phrases still resolves to
# admissions, since nothing else would outscore them in that case.
AMBIGUOUS_LOW_PRIORITY_KEYWORDS = {
    "can i join", "how can i join", "how do i join", "how to join", "apply", "application",
    "eligibility",
}

# ─── Topic Registry ─────────────────────────────────────────────────────────
# `department_overridable=True`: if the query names a specific department,
# this topic is skipped so the query flows to the existing department RAG
# path instead (same convention as structured_topics.py).
WEBSITE_CONTENT_TOPICS: Dict[str, dict] = {
    "why_mlrit": {
        "keywords": ["why mlrit", "why choose mlrit", "why join mlrit"],
        "department_overridable": False,
        "nav_url": "/admissions/why-mlrit",
        "nav_target": None,
        "extractor": lambda: _extract_whole_file("app/admissions/why-mlrit/page.tsx"),
        "label": "MLRIT's Why-MLRIT page",
        # Fixed, deterministic closing line (not LLM-invented) — replaces
        # whatever free-form question the model would otherwise add, so the
        # ending never drifts into marketing language ("that's just the
        # beginning") and always reads the same measured way.
        "custom_closing": "If you'd like, I can also tell you about placements, campus facilities, or student life at MLRIT.",
    },
    "admissions_overview": {
        "keywords": [
            "admission", "admission process", "how to apply", "how do i apply", "admissions overview",
            "how to enroll", "how to join", "join mlrit", "enroll in mlrit",
            "enrolling in mlrit", "enrollment", "enrolment", "how can i join",
            "how do i enroll", "how do i join", "apply", "application",
            "application process", "eligibility", "can i join",
            "how to get admission", "how do i get admission",
            "ts eapcet", "eapcet", "ts ecet", "ecet", "management quota", "quota",
            "lateral entry", "documents required", "required documents",
            "document", "counselling", "counseling", "important dates",
        ],
        "department_overridable": False,
        "nav_url": "/admissions",
        "nav_target": "admissions",
        "extractor": lambda: _extract_whole_file("app/admissions/page.tsx"),
        "label": "the Admissions page",
    },
    "examinations_overview": {
        "keywords": [
            "exam", "examination", "semester exam", "end exam", "mid exam",
            "exam schedule", "exam rules", "exam timetable", "examination schedule",
            "academic calendar",
        ],
        "department_overridable": False,
        "nav_url": "/examinations",
        "nav_target": "examinations",
        "extractor": lambda: _extract_whole_file("app/examinations/page.tsx"),
        "label": "the Examinations page",
    },
    "scholarships": {
        "keywords": [
            "scholarship", "scholarships", "financial aid", "fee concession", "fee waiver",
            "fee reimbursement", "ts epass", "epass",
        ],
        "department_overridable": False,
        "nav_url": "/admissions/scholarships",
        "nav_target": "scholarships",
        "extractor": lambda: _extract_info_pages_slug("admissions/scholarships"),
        "label": "the Scholarships page",
    },
    "fee_structure": {
        "keywords": [
            "fee structure", "tuition fee", "college fee", "annual fee", "b.tech fee",
            "btech fee", "how much does it cost", "fee", "tuition", "cost", "how much",
        ],
        "department_overridable": False,
        "nav_url": "/admissions/fees",
        "nav_target": "fees",
        "extractor": _extract_fees,
        "label": "the Fee Structure page",
    },
    "placements_overview": {
        "keywords": [
            "placement", "placements", "placement cell", "placement office",
            "training and placement", "training & placement", "career cell",
            "career services", "placement process", "training before placement",
            "job", "career", "career opportunities", "internship", "training program",
            "placement calendar", "training",
        ],
        "department_overridable": True,
        "nav_url": "/placements/overview",
        "nav_target": "placements",
        "extractor": _extract_placements_overview,
        "label": "the Placements page",
    },
    "placement_statistics": {
        "keywords": [
            "placement statistics", "placement stats", "placement record",
            "highest package", "median package",
            "companies visiting", "companies visit",
        ],
        "department_overridable": True,
        "nav_url": "/placements/statistics",
        "nav_target": "placements",
        "extractor": _extract_placements_statistics,
        "label": "the Placement Statistics page",
    },
    # "average package" is deliberately NOT a keyword here — MLRIT's published
    # YEAR_STATS only tracks highest package/offers/companies per year, no
    # average. Handled instead by structured_topics.py's "average_package"
    # topic, a hand-authored answer with zero LLM involvement, so there is no
    # chance of the model computing/estimating a number that was never
    # actually published (see items 2 and 10 of the trustworthiness pass).
    "placement_process": {
        "keywords": [
            "placement process", "how does the placement process work",
            "how does placement process work", "how are placements conducted",
            "how do placements happen", "explain placements",
            "explain the placement process", "placement procedure",
            "placement drive process", "how placements work", "how does placement work",
        ],
        "department_overridable": False,
        "nav_url": "/placements/overview",
        "nav_target": "placements",
        "extractor": _extract_placement_process_content,
        "label": "the Placements page",
    },
    "recruiters": {
        "keywords": [
            "recruiters", "recruiting companies", "which companies visit",
            "which companies come", "recruitment", "recruiting", "companies list",
            "company", "mou", "mous", "centre of excellence", "center of excellence",
            "centers of excellence", "centres of excellence",
        ],
        "department_overridable": False,
        "nav_url": "/placements/recruiters",
        "nav_target": "placements",
        "extractor": _extract_recruiters,
        "label": "the Recruiters page",
    },
    "clubs": {
        "keywords": [
            "clubs", "club", "student clubs", "clubs and activities", "society",
            "societies", "fest", "fests", "activity", "activities", "student life",
            "campus life", "coding club", "robotics",
        ],
        "department_overridable": False,
        "nav_url": "/campus/clubs",
        "nav_target": "clubs",
        "extractor": lambda: _extract_info_pages_slug("campus/clubs"),
        "label": "the Clubs page",
    },
    "hostel": {
        "keywords": ["hostel", "hostels", "hostel facilities", "hostel accommodation", "boys hostel", "girls hostel"],
        "department_overridable": False,
        "nav_url": "/campus/hostels",
        "nav_target": "hostel",
        "extractor": lambda: _extract_info_pages_slug("campus/hostels"),
        "label": "the Hostel page",
    },
    "cafeteria": {
        "keywords": ["cafeteria", "canteen", "food court", "mess", "campus food"],
        "department_overridable": False,
        "nav_url": "/campus/cafeteria",
        "nav_target": "cafeteria",
        "extractor": lambda: _extract_info_pages_slug("campus/cafeteria"),
        "label": "the Cafeteria page",
    },
    "sports": {
        "keywords": ["sports", "sports facilities", "gymnasium", "gym", "indoor games", "outdoor games"],
        "department_overridable": False,
        "nav_url": "/campus/sports",
        "nav_target": "sports",
        "extractor": lambda: _extract_info_pages_slug("campus/sports"),
        "label": "the Sports page",
    },
    "transport": {
        "keywords": ["transport", "transportation", "bus facility", "bus routes", "college bus", "bus"],
        "department_overridable": False,
        "nav_url": "/campus/transport",
        "nav_target": "transport",
        "extractor": lambda: _extract_info_pages_slug("campus/transport"),
        "label": "the Transport page",
    },
    "research": {
        "keywords": [
            "research", "research activities", "research at mlrit", "research work",
            # Note: "research center/centre", "patent", "consultancy" deliberately removed
            # from here — they now have their own dedicated, more specific topics below
            # (research_centers, research_patents, research_consultancy) which would
            # otherwise tie on keyword length and lose to this earlier-defined generic topic.
        ],
        "department_overridable": True,
        "nav_url": "/research",
        "nav_target": "research",
        "extractor": _extract_research_overview,
        "label": "the Research page",
    },
    "innovation": {
        "keywords": [
            "innovation", "incubation", "startup support", "entrepreneurship", "ipfc",
            "start a company", "start my own company", "start a startup", "start a business",
            "starting a business", "become an entrepreneur", "launch a startup",
            "want to start a company", "my own startup",
        ],
        "department_overridable": False,
        "nav_url": "/research/entrepreneurship",
        "nav_target": "innovation",
        "extractor": lambda: _extract_research_slug("entrepreneurship"),
        "label": "the Innovation & Entrepreneurship page",
    },
    # Phase 2 additions — remaining lib/research.ts RESEARCH_PAGES slugs that
    # previously had no dedicated topic (research coverage was limited to the
    # single overview blurb above). Same _extract_research_slug() extractor,
    # generic over any slug, reused as-is — no new parsing logic needed.
    "research_centers": {
        # Note: named corporate Centres of Excellence ("Cisco CoE", etc.) are deliberately
        # left to the existing "recruiters" topic's "centre/center(s) of excellence"
        # keywords, which already point at the MoU/recruiters page for those — this topic
        # only owns the generic "research center(s)" phrasing.
        "keywords": ["research center", "research centre", "research centers"],
        "department_overridable": False,
        "nav_url": "/research/centers",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("centers"),
        "label": "the Research Centers page",
    },
    "sponsored_projects": {
        "keywords": ["sponsored project", "sponsored projects", "funded project", "funded research", "research grant", "research grants"],
        "department_overridable": False,
        "nav_url": "/research/sponsored-projects",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("sponsored-projects"),
        "label": "the Sponsored Projects page",
    },
    "research_scholars": {
        "keywords": ["research scholar", "research scholars", "phd scholar", "phd scholars", "doctoral students"],
        "department_overridable": False,
        "nav_url": "/research/scholars",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("scholars"),
        "label": "the Research Scholars page",
    },
    "doctoral_faculty": {
        "keywords": ["doctoral faculty", "phd faculty", "faculty with phd", "phd guides", "research guides"],
        "department_overridable": False,
        "nav_url": "/research/doctoral-faculty",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("doctoral-faculty"),
        "label": "the Doctoral Faculty page",
    },
    "research_patents": {
        "keywords": ["patent", "patents", "patent filed", "patents filed"],
        "department_overridable": False,
        "nav_url": "/research/patents",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("patents"),
        "label": "the Patents page",
    },
    "research_consultancy": {
        "keywords": ["consultancy", "consultancy project", "consultancy projects", "industry consultancy"],
        "department_overridable": False,
        "nav_url": "/research/consultancy",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("consultancy"),
        "label": "the Consultancy page",
    },
    "research_publications": {
        "keywords": ["faculty publication", "faculty publications", "research publication", "research publications", "research paper", "research papers", "journal publications"],
        "department_overridable": False,
        "nav_url": "/research/publications",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("publications"),
        "label": "the Publications page",
    },
    "research_policies": {
        "keywords": ["research policy", "research policies", "ipr policy", "research incentive"],
        "department_overridable": False,
        "nav_url": "/research/policies",
        "nav_target": "research",
        "extractor": lambda: _extract_research_slug("policies"),
        "label": "the Research Policies page",
    },
    "iqac": {
        "keywords": [
            "iqac", "internal quality assurance", "quality assurance cell",
            "quality policy", "iqac vision", "iqac mission", "iqac process flow",
            "iqac composition", "iqac members", "iqac functions", "iqac objectives",
            "quality framework", "quality initiatives",
        ],
        "department_overridable": False,
        "nav_url": "/iqac",
        "nav_target": "iqac",
        "extractor": _extract_iqac_content,
        "label": "the IQAC page",
    },
    "regulations": {
        "keywords": ["regulations", "academic regulations", "r22 regulations", "credit system", "obe", "credit"],
        "department_overridable": False,
        "nav_url": "/examinations/regulations",
        "nav_target": "examinations",
        "extractor": lambda: _extract_whole_file("app/examinations/regulations/page.tsx"),
        "label": "the Regulations page",
    },
}


def detect_website_topic(query: str, department: Optional[str] = None) -> Optional[str]:
    """
    Returns the WEBSITE_CONTENT_TOPICS key matching this query, or None.
    Uses longest-matching-keyword-wins (not first-topic-in-dict-wins), so a
    more specific phrase like "placement statistics" correctly beats the
    broader "placement" keyword on the generic placements_overview topic.

    Both the query and each keyword phrase are run through the shared
    lightweight normalizer (lowercase, punctuation-stripped, whitespace-
    collapsed, singularized, conversational lead-ins like "tell me about"
    stripped) so "admissions", "Tell me about admissions.", and "admission"
    all resolve to the same topic without needing every form spelled out.
    """
    query_norm = normalize_query_for_matching(query)
    best_key = None
    best_len = 0
    for topic_key, data in WEBSITE_CONTENT_TOPICS.items():
        for phrase in data["keywords"]:
            phrase_norm = normalize_phrase(phrase)
            score = 1 if phrase in AMBIGUOUS_LOW_PRIORITY_KEYWORDS else len(phrase_norm)
            if score > best_len and re.search(r'\b' + re.escape(phrase_norm) + r'\b', query_norm):
                best_key = topic_key
                best_len = score

    if best_key and department and WEBSITE_CONTENT_TOPICS[best_key].get("department_overridable"):
        return None
    return best_key


_WEBSITE_SUMMARY_SYSTEM_PROMPT = (
    "You are a friendly, knowledgeable MLRIT admission counselor and student mentor talking to a "
    "prospective or current student. Summarize the OFFICIAL WEBSITE CONTENT below conversationally in "
    "3-6 short lines or bullets — like a counselor explaining it in person, not a page of documentation "
    "or an advertisement. Prefer plain, warm sentences over terse fact-dumps (e.g. \"If you're joining "
    "after Intermediate, admissions are mainly through TS EAPCET counselling\" rather than \"Admissions: "
    "TS EAPCET.\"). Never use sales or marketing language (hype, exclamation-heavy phrasing, lines like "
    "\"that's just the beginning\") — stay factual and measured. Never start a sentence with filler words "
    "like \"So,\", \"Actually,\", \"Basically,\", or \"Unfortunately,\".\n\n"
    "Trustworthiness rules — follow these strictly:\n"
    "- Only state facts explicitly present in the content below. Never invent numbers, company names, "
    "dates, or step-by-step procedures that are not written there.\n"
    "- Never calculate, average, or estimate a figure (e.g. an \"average package\") from other numbers in "
    "the content. If the student asks for a specific figure or detail that isn't explicitly present, say "
    "plainly that it isn't officially published here, mention what related information IS available, and "
    "recommend the right MLRIT office (Admissions, or the Training & Placement Cell) for the latest "
    "information.\n"
    "- Never say or imply you will \"check\", \"verify\", \"look into\", or \"find out\" something — you "
    "already have everything you will ever have on this topic, right now, in the content below.\n"
    "- If the content explicitly labels something as a general/typical framework rather than an "
    "MLRIT-specific rule, present it as typical practice and note that specifics can vary — never state "
    "it as an official institute policy.\n\n"
    "Do not mention 'the website' or 'the content below' — just answer naturally, as if you already knew "
    "this. Do not end with your own follow-up question — the system appends relevant follow-up "
    "suggestions separately."
)


def get_page_text(topic_key: str) -> Optional[str]:
    """
    Phase 3 (multi-question batching): the extraction half of
    `summarize_website_content`, split out so a multi-part message with 2+
    website-content sub-questions can extract every topic's text (cheap, no
    LLM) before deciding whether to batch them into one Groq call — see
    `summarize_website_topics_batch` below. Returns None on the same
    "can't answer this" conditions `summarize_website_content` already handles.
    """
    data = WEBSITE_CONTENT_TOPICS.get(topic_key)
    if not data:
        return None
    try:
        page_text = data["extractor"]()
    except Exception as e:
        logger.warning(f"WebsiteContent: extractor failed for {topic_key}: {e}")
        return None
    if not page_text or not page_text.strip():
        return None
    return page_text


def finalize_topic_answer(topic_key: str, answer: str) -> Dict[str, Any]:
    """Applies the same custom_closing/nav_target/sources/confidence shaping
    `summarize_website_content` normally applies inline, given an already-
    generated answer string — used by both the single-topic path (indirectly,
    via `summarize_website_content`) and the Phase 3 batched path."""
    data = WEBSITE_CONTENT_TOPICS[topic_key]
    if data.get("custom_closing"):
        answer = f"{answer}\n\n{data['custom_closing']}"
    nav_target = data.get("nav_target")
    nav_url = data.get("nav_url") or (WEBSITE_ROUTES.get(nav_target) if nav_target else None)
    return {
        "answer": answer,
        "sources": [{"file": data["label"], "page": 1, "department": "General", "snippet": ""}],
        "navigation_target": nav_target,
        "navigation_url": nav_url,
        "confidence": 1.0,
        "query_type": "general",
    }


_BATCH_ANSWER_RE = re.compile(r"ANSWER\s*(\d+)\s*:\s*", re.IGNORECASE)


def _note_token_usage(response, profiler) -> None:
    """Best-effort token-usage capture for the profiler (Phase 3 item 8)."""
    try:
        usage = (getattr(response, "response_metadata", None) or {}).get("token_usage") or {}
        if usage:
            profiler.note(
                f"Groq tokens: prompt={usage.get('prompt_tokens')} "
                f"completion={usage.get('completion_tokens')} total={usage.get('total_tokens')}"
            )
    except Exception:
        pass


async def summarize_website_topics_batch(
    entries: "list[tuple[str, str, str]]",
    llm,
    profiler=None,
) -> "list[Optional[Dict[str, Any]]]":
    """
    Phase 3 optimization: answers 2+ website-content sub-questions (from one
    multi-part user message) with a SINGLE Groq call instead of one call per
    topic. `entries` is a list of (topic_key, user_query, page_text) tuples —
    page_text must already be extracted (via `get_page_text`) by the caller.

    Builds one combined prompt (same system prompt as the single-topic path,
    sent once) listing every topic's content and question, asks the model to
    reply with one "ANSWER N:" block per entry, then splits the response back
    apart. Falls back to one `summarize_website_content` call per entry
    (exactly the pre-batch behavior) if the model doesn't follow that format —
    this keeps correctness guaranteed even if the merge attempt misfires, at
    the cost of losing the batching savings for that one request.
    """
    from langchain_core.messages import HumanMessage, SystemMessage

    profiler = profiler or get_noop_profiler()

    if len(entries) == 1:
        topic_key, user_query, _ = entries[0]
        return [await summarize_website_content(topic_key, user_query, llm, profiler=profiler)]

    blocks = []
    for i, (topic_key, user_query, page_text) in enumerate(entries, start=1):
        label = WEBSITE_CONTENT_TOPICS[topic_key]["label"]
        blocks.append(
            f"### Topic {i}: {label}\nOfficial content:\n---\n{page_text}\n---\nStudent's question: {user_query}"
        )
    combined_user_message = (
        "Answer EACH of the following topics separately, using ONLY that topic's own content. "
        "Reply with exactly one \"ANSWER N:\" block per topic below, in the same order, and nothing else "
        "before the first one.\n\n" + "\n\n".join(blocks)
    )

    async def _fallback() -> "list[Optional[Dict[str, Any]]]":
        return [await summarize_website_content(topic_key, user_query, llm, profiler=profiler) for topic_key, user_query, _ in entries]

    try:
        profiler.count("Groq API Calls")
        with profiler.stage("Groq API"):
            response = await call_groq(
                llm.invoke,
                [
                    SystemMessage(content=_WEBSITE_SUMMARY_SYSTEM_PROMPT),
                    HumanMessage(content=combined_user_message),
                ],
                profiler=profiler,
                label="summarize_website_topics_batch",
            )
        raw = response.content.strip()
        _note_token_usage(response, profiler)
    except Exception as e:
        logger.error(f"WebsiteContent: batched summarization failed, falling back to per-topic calls: {e}")
        return await _fallback()

    matches = list(_BATCH_ANSWER_RE.finditer(raw))
    if len(matches) != len(entries):
        logger.warning(
            f"WebsiteContent: batched response had {len(matches)} ANSWER blocks, expected {len(entries)} — "
            "falling back to per-topic calls"
        )
        return await _fallback()

    results = []
    for idx, (topic_key, _, _) in enumerate(entries):
        start = matches[idx].end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(raw)
        answer_text = raw[start:end].strip()
        results.append(finalize_topic_answer(topic_key, answer_text))
    return results


async def summarize_website_content(topic_key: str, user_query: str, llm, profiler=None) -> Optional[Dict[str, Any]]:
    """
    Extracts real page text for topic_key and asks the LLM (the SAME ChatGroq
    instance already used by RAGEngine — no new model, no retrieval) for a
    short, conversational summary grounded in that text. Returns None if the
    source file couldn't be read/parsed, so the caller can fall back safely.

    `profiler` is optional (Phase 1.75 audit found this call site wasn't wrapped
    in a "Groq API" stage at all, so its cost was invisible/mislabeled as
    "Website Lookup" — fixed here) and defaults to a no-op.
    """
    profiler = profiler or get_noop_profiler()
    data = WEBSITE_CONTENT_TOPICS.get(topic_key)
    if not data:
        return None

    try:
        page_text = data["extractor"]()
    except Exception as e:
        logger.warning(f"WebsiteContent: extractor failed for {topic_key}: {e}")
        page_text = None

    if not page_text or not page_text.strip():
        logger.warning(f"WebsiteContent: no text extracted for {topic_key}, caller should fall back")
        return None

    from langchain_core.messages import HumanMessage, SystemMessage

    user_message = f"Official content ({data['label']}):\n---\n{page_text}\n---\n\nStudent's question: {user_query}"

    try:
        profiler.count("Groq API Calls")
        with profiler.stage("Groq API"):
            response = await call_groq(
                llm.invoke,
                [SystemMessage(content=_WEBSITE_SUMMARY_SYSTEM_PROMPT), HumanMessage(content=user_message)],
                profiler=profiler,
                label="summarize_website_content",
            )
        answer = response.content.strip()
        _note_token_usage(response, profiler)
    except Exception as e:
        error_str = str(e)
        logger.error(f"WebsiteContent: LLM summarization failed for {topic_key}: {e}")
        # Phase 2 optimization: EVERY exception here now returns a graceful
        # message instead of only rate-limit errors doing so. Previously any
        # OTHER exception (a network blip, a malformed response, ...) returned
        # None, which falls through the rest of the pipeline (Structured
        # Knowledge -> Labs -> ... -> department RAG) — and that fallback chain
        # ends in a SECOND real Groq call (RAG's own generate_answer) for the
        # same user turn, doubling both latency and Groq spend for one answer.
        # The audit (Phase 1.75) flagged this exact cascade as a duplication
        # source. Trade-off: on a genuinely transient, non-rate-limit failure
        # that a later pipeline stage might have recovered from with a correct
        # answer, the user now gets an apology instead — traded deliberately for
        # never paying for two LLM calls on one answer. The topic's own nav
        # target is preserved either way so the button still points somewhere
        # useful.
        nav_target = data.get("nav_target")
        nav_url = data.get("nav_url") or (WEBSITE_ROUTES.get(nav_target) if nav_target else None)
        if "429" in error_str or "rate_limit" in error_str.lower() or "RESOURCE_EXHAUSTED" in error_str:
            message_text = "I'm currently experiencing high demand. Please try again in a moment, or contact MLRIT directly at +91 96522 26061."
        else:
            message_text = "I'm having trouble putting that together right now. Please try again in a moment, or contact MLRIT directly at +91 96522 26061."
        return {
            "answer": message_text,
            "sources": [],
            "navigation_target": nav_target,
            "navigation_url": nav_url,
            "confidence": 0.0,
            "query_type": "general",
        }

    if data.get("custom_closing"):
        answer = f"{answer}\n\n{data['custom_closing']}"

    nav_target = data.get("nav_target")
    nav_url = data.get("nav_url") or (WEBSITE_ROUTES.get(nav_target) if nav_target else None)

    return {
        "answer": answer,
        "sources": [{"file": data["label"], "page": 1, "department": "General", "snippet": page_text[:150]}],
        "navigation_target": nav_target,
        "navigation_url": nav_url,
        "confidence": 1.0,
        "query_type": "general",
    }
