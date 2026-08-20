import re
from typing import Dict, Optional

from config import WEBSITE_ROUTES, COLLEGE_INFO
from text_normalize import normalize_query_for_matching, normalize_phrase

# ─── Structured Knowledge Layer ─────────────────────────────────────────────
# High-level, college-wide topics that should NOT depend on PDF retrieval.
# The indexed PDFs are per-department syllabus documents — they have no
# "college-wide placements" or "how to enroll" chapter, so a department-blind
# similarity search on these queries silently returns whichever department's
# PDF happens to score highest (e.g. Mechanical's placement section) instead
# of an actual answer. These hand-authored summaries are returned directly,
# BEFORE hybrid retrieval ever runs, for exactly the queries that ask about
# the topic in general.
#
# `department_overridable=True` means: if the query names a specific
# department (e.g. "CSE placements"), this structured answer is skipped and
# the query instead flows through the existing classify_query -> department
# RAG path, which already retrieves and filters by that department correctly.
STRUCTURED_TOPICS: Dict[str, dict] = {
    # NOTE: placements, admissions (process/enrollment), hostel, research,
    # IQAC, scholarships, campus_life (clubs), transportation, cafeteria,
    # sports, and fee were REMOVED from this file — the website already has
    # real, maintained pages for all of them, so they're now handled earlier
    # in the pipeline by website_content.py's WEBSITE_CONTENT_TOPICS, which
    # extracts and summarizes the actual page content instead of duplicating
    # it here as hand-typed prose. See chatbot.py's "Website Content
    # Summaries" stage. Only topics with NO real page/content anywhere on the
    # site remain below (library and alumni are external-only; wifi, medical,
    # and attendance have no dedicated page; academics/facilities/events are
    # generic listings without a single page to summarize).
    "academics": {
        "keywords": [
            "education in mlrit", "education at mlrit", "courses", "course",
            "programs", "program", "programmes", "programme",
            "study at mlrit", "studying at mlrit", "academic programs",
            "what can i study", "degrees offered", "programmes offered",
            "programs offered", "academics", "academic", "education", "degree",
            "branch", "department", "curriculum",
        ],
        "department_overridable": True,
        "nav_target": "departments",
        "answer": (
            "**Academics at MLRIT**\n\n"
            "- MLRIT offers **B.Tech, M.Tech, MBA,** and **Ph.D** programs, affiliated to **JNTUH**.\n"
            "- **UG (B.Tech) departments**: CSE, ECE, EEE, IT, CSIT, Mechanical, Aeronautical, AIML, CSE (Cyber Security), CSE (Data Science).\n"
            "- **PG programs**: M.Tech (multiple specializations) and MBA.\n"
            "- Curriculum follows JNTUH/autonomous regulations (e.g. R22, MLR20, MLR18), updated periodically with labs, projects, and internships built in.\n\n"
            "Which department would you like to explore, or ask about a specific one (e.g. \"CSE courses\")?"
        ),
    },
    "library": {
        "keywords": [
            "library facilities", "library services", "about the library",
            "tell me about the library", "central library", "library timings",
            "library hours",
        ],
        "department_overridable": False,
        "nav_target": "library",
        "answer": (
            "**MLRIT Central Library**\n\n"
            "- Well-stocked central library with textbooks, reference books, national/international journals, and e-resources (IEEE, Springer, etc.).\n"
            "- Digital library access with e-books and online journal subscriptions for students and faculty.\n"
            "- Separate reading halls for focused study and a dedicated section for competitive-exam and placement preparation material.\n\n"
            "Visit the Library page for exact timings and catalogue access."
        ),
    },
    "facilities": {
        "keywords": [
            "campus facilities", "college facilities", "facilities available",
            "amenities", "facility", "campus", "infrastructure",
        ],
        "department_overridable": False,
        "nav_target": "departments",
        "answer": (
            "**Campus Facilities at MLRIT**\n\n"
            "- Modern classrooms, well-equipped laboratories, central library, and Wi-Fi-enabled campus.\n"
            "- Hostel accommodation, cafeteria, sports facilities, transport, and medical/first-aid support.\n"
            "- Auditoriums and seminar halls for technical and cultural events.\n\n"
            "Ask about a specific facility (e.g. \"hostel\", \"library\", \"transport\") for more detail."
        ),
    },
    # Note: "principal" is intentionally NOT a structured topic here — it is
    # now handled earlier in the pipeline by AdministrationDirectory
    # (chatbot/administration_directory.py), which sources the real Principal
    # name from lib/info-pages.ts instead of a generic hardcoded blurb.
    "campus_life": {
        "keywords": [
            "campus life", "student life", "extracurricular activities",
        ],
        "department_overridable": False,
        "nav_target": "departments",
        "answer": (
            "**Campus Life at MLRIT**\n\n"
            "- Active clubs, fests, sports, hostel, and cafeteria life for resident and day-scholar students alike.\n"
            "- Regular workshops, hackathons, and cultural events throughout the year.\n\n"
            "Ask about a specific part of campus life (e.g. \"clubs\", \"hostel\", \"sports\") for more detail."
        ),
    },
    "attendance": {
        "keywords": [
            "attendance requirement", "attendance rules", "attendance policy",
            "condonation", "attendance shortage", "minimum attendance", "attendance",
        ],
        "department_overridable": False,
        "nav_target": "examinations",
        "answer": (
            "**Attendance Policy at MLRIT**\n\n"
            "- Minimum **75% attendance** is required per semester to be eligible for semester examinations (JNTUH norm).\n"
            "- **65-74%**: eligible for condonation (subject to a fee and valid reason).\n"
            "- **Below 65%**: generally detained for that semester, with exceptions considered for approved medical leave.\n\n"
            "Visit the Examinations page for the full academic regulations."
        ),
    },
    "wifi": {
        "keywords": ["wifi", "wi-fi", "internet facility", "internet access on campus", "internet"],
        "department_overridable": False,
        "nav_target": None,
        "answer": (
            "**Campus Connectivity**\n\nMLRIT provides Wi-Fi-enabled classrooms, labs, and library access for students and faculty across campus."
        ),
    },
    "medical": {
        "keywords": ["medical facility", "first aid", "health center", "ambulance", "campus doctor", "medical"],
        "department_overridable": False,
        "nav_target": None,
        "answer": (
            "**Medical Support at MLRIT**\n\nOn-campus first-aid and basic medical support is available, with tie-ups for "
            "emergency referral to nearby hospitals. Hostel students have access to a resident warden for urgent needs."
        ),
    },
    "alumni": {
        "keywords": ["alumni network", "alumni association", "former students"],
        "department_overridable": False,
        "nav_target": "alumni",
        "answer": (
            "**MLRIT Alumni Network**\n\nMLRIT maintains an active alumni association connecting graduates for mentorship, "
            "networking, and campus recruitment referrals.\n\nVisit the Alumni page to connect."
        ),
    },
    "institution_stats": {
        "keywords": [
            "how many students", "number of students", "total students", "student strength",
            "how many departments", "number of departments", "total departments",
            "how many departments exist",
        ],
        "department_overridable": False,
        "nav_target": "about",
        "answer": (
            f"MLRIT has **{COLLEGE_INFO['students']} students** across "
            f"**{len(COLLEGE_INFO['departments'])} departments** ({', '.join(COLLEGE_INFO['departments'])}), "
            f"offering {', '.join(COLLEGE_INFO['programs'])} programs.\n\n"
            "Visit the About page for more on our campus and community."
        ),
    },
    # Hand-authored, zero-LLM-call answer — MLRIT's published YEAR_STATS data
    # (see website_content.py's _extract_placements_statistics) only tracks
    # highest package, offers, and companies per year; there is no published
    # average. Kept out of the LLM-summarized website_content.py pipeline
    # entirely so there is no chance of the model computing/estimating a
    # number that was never actually published (never estimate, never infer).
    "average_package": {
        "keywords": [
            "average package", "what is the average package", "avg package",
            "average salary package", "average ctc",
        ],
        "department_overridable": False,
        "nav_target": "placements",
        "answer": (
            "MLRIT's official Placement Statistics don't publish an overall **average package** — what's "
            "officially tracked and published year by year is the **highest package**, along with the number "
            "of offers and recruiting companies.\n\n"
            "For the most accurate current figure, I'd recommend checking the Placement Statistics page for "
            "the latest published numbers, or contacting the **Training & Placement Cell** directly — they'll "
            "have the most up-to-date average for your batch."
        ),
    },
    # Answered as a hand-authored institutional fact, never via RAG — the indexed
    # PDFs are per-department syllabus documents with no chapter on affiliation
    # or accreditation status, and getting this specific fact wrong (autonomous
    # vs. affiliated) would be a worse failure than a generic non-answer.
    "accreditation": {
        "keywords": [
            "is mlrit autonomous", "autonomous", "autonomous status",
            "is mlrit affiliated", "affiliation", "affiliated", "jntuh", "naac", "nba",
            "accreditation", "accredited", "recognition", "recognized", "ugc", "aicte",
            "ranking", "rankings", "nirf rank", "college ranking",
        ],
        "department_overridable": False,
        "nav_target": "iqac",
        "answer": (
            f"**MLRIT is an autonomous institution** — affiliated to **{COLLEGE_INFO['affiliation']}**, and approved "
            f"by {', '.join(COLLEGE_INFO['approvals'])}. Its NIRF ranking is in the {COLLEGE_INFO['nirf_rank']}.\n\n"
            "Visit the IQAC page for detailed accreditation documents and reports."
        ),
    },
}


def detect_structured_topic(query: str, department: Optional[str] = None) -> Optional[str]:
    """
    Returns the STRUCTURED_TOPICS key matching this query, or None. If the
    query already resolved to an explicit department (e.g. "CSE placements")
    and the matched topic is department_overridable, returns None so the
    caller falls through to the existing department-scoped RAG path instead.

    Uses longest-matching-keyword-wins (same convention as
    website_content.detect_website_topic) rather than first-topic-in-dict-
    wins, now that several topics carry short, generic single-word keywords
    that could otherwise shadow a more specific one purely by dict order.
    Both the query and each keyword phrase are run through the shared
    normalizer (singularized, punctuation-stripped, conversational lead-ins
    like "tell me about" stripped).
    """
    query_norm = normalize_query_for_matching(query)
    best_key = None
    best_len = 0
    best_data = None
    for topic_key, data in STRUCTURED_TOPICS.items():
        for phrase in data["keywords"]:
            phrase_norm = normalize_phrase(phrase)
            if len(phrase_norm) > best_len and re.search(r'\b' + re.escape(phrase_norm) + r'\b', query_norm):
                best_key = topic_key
                best_len = len(phrase_norm)
                best_data = data

    if best_key and department and best_data.get("department_overridable"):
        return None
    return best_key


def build_structured_response(topic_key: str) -> dict:
    """Builds the standard chatbot response dict for a structured topic."""
    data = STRUCTURED_TOPICS[topic_key]
    nav_target = data.get("nav_target")
    nav_url = WEBSITE_ROUTES.get(nav_target) if nav_target else None

    return {
        "answer": data["answer"],
        "sources": [],
        "navigation_target": nav_target,
        "navigation_url": nav_url,
        "confidence": 1.0,
        "query_type": "general",
    }
