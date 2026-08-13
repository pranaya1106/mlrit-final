import re
from typing import Dict, List, Optional, Tuple

# ─── TG EAMCET 2025-26 Final Phase Cutoff Data ──────────────────────────────
# Source: TG EAMCET Final Phase 2025-26 admission cycle, MLR Institute of
# Technology, Dundigal, Hyderabad-500043. Hand-authored structured facts
# (same convention as config.HOD_INFO) — NOT sourced from RAG/PDF, since this
# is tabular numeric data, not prose. Values preserved exactly as supplied,
# including unusual-looking ones (e.g. ECE Male BC-E closing < opening, AERO
# Male SC opening 400167) — do not "correct" these without a new official
# source; a missing rank is `None`, never guessed.
#
# CRITICAL: this is ONE historical admission cycle's closing-rank data. It is
# NOT a permanent or guaranteed cutoff for any other year. Every caller that
# surfaces this data to a user MUST pair it with DISCLAIMER_SHORT/LONG below.

INSTITUTION = "MLR Institute of Technology, Dundigal, Hyderabad-500043"
EXAM_LABEL = "TG EAMCET"
YEAR_LABEL = "2025-26"
PHASE_LABEL = "Final Phase"

CATEGORIES = ["OC", "EWS", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E", "SC", "ST"]

DEPT_DISPLAY = {
    "CSE": "CSE",
    "CSE-DS": "CSE (Data Science)",
    "CSE-AIML": "CSE (AIML)",
    "ECE": "ECE",
    "EEE": "EEE",
    "MECH": "Mechanical",
    "AERO": "Aeronautical",
}

# branch -> gender -> category -> (opening_rank, closing_rank); either may be None
CUTOFF_DATA: Dict[str, Dict[str, Dict[str, Tuple[Optional[int], Optional[int]]]]] = {
    "CSE": {
        "Male": {
            "OC": (14025, 18136), "EWS": (18131, 19216), "BC-A": (19452, 43063),
            "BC-B": (19143, 25773), "BC-C": (50175, 61368), "BC-D": (16762, 25993),
            "BC-E": (27241, 38177), "SC": (31058, 137398), "ST": (32124, 99952),
        },
        "Female": {
            "OC": (13201, 17701), "EWS": (18209, 20582), "BC-A": (23431, 43954),
            "BC-B": (18010, 28465), "BC-C": (129311, None), "BC-D": (19179, 24980),
            "BC-E": (25809, 58925), "SC": (35308, 84265), "ST": (61857, 78990),
        },
    },
    "CSE-DS": {
        "Male": {
            "OC": (17004, 19872), "EWS": (20079, 21464), "BC-A": (37125, 44151),
            "BC-B": (20263, 25646), "BC-C": (123129, None), "BC-D": (17968, 27197),
            "BC-E": (25374, 39935), "SC": (38149, 74571), "ST": (58605, 80983),
        },
        "Female": {
            "OC": (18671, 19701), "EWS": (20351, 23868), "BC-A": (39184, 44303),
            "BC-B": (21146, 25980), "BC-C": (None, None), "BC-D": (24145, 30179),
            "BC-E": (52683, None), "SC": (51151, 129852), "ST": (81989, 99404),
        },
    },
    "CSE-AIML": {
        "Male": {
            "OC": (11892, 17729), "EWS": (18866, 19937), "BC-A": (29913, 38309),
            "BC-B": (20263, 25464), "BC-C": (43474, 103478), "BC-D": (18201, 23173),
            "BC-E": (33965, 35580), "SC": (35977, 140258), "ST": (24611, 76392),
        },
        "Female": {
            "OC": (11808, 17561), "EWS": (18610, 19687), "BC-A": (25896, 35860),
            "BC-B": (21146, 25980), "BC-C": (None, None), "BC-D": (18927, 25954),
            "BC-E": (42807, 43189), "SC": (26093, 138129), "ST": (77067, 85858),
        },
    },
    "ECE": {
        "Male": {
            "OC": (20998, 26276), "EWS": (21212, 38872), "BC-A": (51889, 62888),
            "BC-B": (29323, 37975), "BC-C": (None, None), "BC-D": (26178, 34712),
            # Preserved exactly as supplied — closing (17395) is lower than
            # opening (57980) in the source table.
            "BC-E": (57980, 17395), "SC": (40333, 137320), "ST": (96893, 110379),
        },
        "Female": {
            "OC": (13403, 31788), "EWS": (23610, 31006), "BC-A": (50451, 83574),
            "BC-B": (31463, 42466), "BC-C": (None, None), "BC-D": (34759, 44064),
            "BC-E": (94053, None), "SC": (61757, 86529), "ST": (36725, 149432),
        },
    },
    "EEE": {
        "Male": {
            "OC": (34434, 40339), "EWS": (43375, None), "BC-A": (78266, None),
            "BC-B": (71878, None), "BC-C": (None, None), "BC-D": (None, None),
            "BC-E": (101194, 101194), "SC": (140031, None), "ST": (96964, 110294),
        },
        "Female": {
            "OC": (None, None), "EWS": (None, None), "BC-A": (None, None),
            "BC-B": (48896, 50991), "BC-C": (81808, None), "BC-D": (65478, 74647),
            "BC-E": (None, None), "SC": (135701, None), "ST": (None, None),
        },
    },
    "MECH": {
        "Male": {
            "OC": (48872, None), "EWS": (56369, None), "BC-A": (80627, 106636),
            "BC-B": (51372, 71584), "BC-C": (None, None), "BC-D": (79490, None),
            "BC-E": (82177, None), "SC": (81472, 135495), "ST": (122842, 131266),
        },
        "Female": {
            "OC": (66704, None), "EWS": (79028, None), "BC-A": (None, None),
            "BC-B": (80916, 161389), "BC-C": (None, None), "BC-D": (None, None),
            "BC-E": (None, None), "SC": (None, None), "ST": (None, None),
        },
    },
    "AERO": {
        "Male": {
            "OC": (17976, 26818), "EWS": (32938, 37216), "BC-A": (66984, 98960),
            "BC-B": (37796, 81732), "BC-C": (None, None), "BC-D": (41587, None),
            "BC-E": (39743, 42141),
            # Preserved exactly as supplied — opening (400167) is far above
            # closing (76014) in the source table.
            "SC": (400167, 76014), "ST": (44581, 131840),
        },
        "Female": {
            "OC": (21670, None), "EWS": (37221, None), "BC-A": (84730, None),
            "BC-B": (32658, 58951), "BC-C": (None, None), "BC-D": (29214, 42516),
            "BC-E": (100883, None), "SC": (37618, 129749), "ST": (None, None),
        },
    },
}

DISCLAIMER_SHORT = (
    "*Based on TG EAMCET 2025-26 Final Phase historical data — cutoffs vary every year and this is not a "
    "guarantee of admission.*"
)

DISCLAIMER_LONG = (
    f"These are **{EXAM_LABEL} {YEAR_LABEL} {PHASE_LABEL}** cutoff ranks for **{INSTITUTION}** — historical "
    "reference data, not a guarantee for any future year. TG EAMCET cutoff ranks can change every year "
    "depending on applicant ranks, seat availability, category, gender, competition, and admission trends. "
    "A rank that fell within the 2025-26 closing rank is not guaranteed to do so in 2026-27 or any later "
    "admission cycle."
)

# ─── Extraction helpers ─────────────────────────────────────────────────────

_BRANCH_ALIASES = [
    ("cse-aiml", "CSE-AIML"), ("cse aiml", "CSE-AIML"), ("cse (aiml)", "CSE-AIML"),
    ("cse-ds", "CSE-DS"), ("cse ds", "CSE-DS"), ("cse (data science)", "CSE-DS"),
    ("data science", "CSE-DS"), ("csd", "CSE-DS"),
    ("artificial intelligence", "CSE-AIML"), ("machine learning", "CSE-AIML"),
    ("aiml", "CSE-AIML"), ("csm", "CSE-AIML"),
    ("computer science", "CSE"), ("cse", "CSE"),
    ("electronics and communication", "ECE"), ("ece", "ECE"),
    ("electrical", "EEE"), ("eee", "EEE"),
    ("mechanical", "MECH"), ("mech", "MECH"),
    ("aeronautical", "AERO"), ("aero", "AERO"),
]

_CATEGORY_PATTERNS = [
    (r"\bbc[\s\-]?a\b", "BC-A"), (r"\bbc[\s\-]?b\b", "BC-B"), (r"\bbc[\s\-]?c\b", "BC-C"),
    (r"\bbc[\s\-]?d\b", "BC-D"), (r"\bbc[\s\-]?e\b", "BC-E"),
    (r"\bews\b", "EWS"), (r"\boc\b", "OC"), (r"\bsc\b", "SC"), (r"\bst\b", "ST"),
]


def extract_branch(query: str) -> Optional[str]:
    q = query.lower()
    best_key, best_len = None, 0
    for alias, key in _BRANCH_ALIASES:
        if len(alias) > best_len and re.search(r'\b' + re.escape(alias) + r'\b', q):
            best_key, best_len = key, len(alias)
    return best_key


def extract_gender(query: str) -> Optional[str]:
    q = query.lower()
    if re.search(r'\bfemale\b', q):
        return "Female"
    if re.search(r'\bmale\b', q):
        return "Male"
    return None


def extract_category(query: str) -> Optional[str]:
    q = query.lower()
    for pattern, cat in _CATEGORY_PATTERNS:
        if re.search(pattern, q):
            return cat
    return None


def extract_rank(query: str) -> Optional[int]:
    """Pulls the first plausible EAMCET rank out of free text: strips
    thousand-separator commas (e.g. "25,000 rank" -> 25000), expands "20k"-
    style shorthand (-> 20000), then falls back to a bare 3-6 digit number."""
    q = re.sub(r'(\d),(\d{3}\b)', r'\1\2', query)
    m = re.search(r'\b(\d{1,3}(?:\.\d+)?)\s*k\b', q, re.IGNORECASE)
    if m:
        return int(float(m.group(1)) * 1000)
    m = re.search(r'\b(\d{3,6})\b', q)
    return int(m.group(1)) if m else None


# ─── Lookup / comparison ────────────────────────────────────────────────────

def get_cutoff(branch: str, gender: str, category: str) -> Optional[Tuple[Optional[int], Optional[int]]]:
    return CUTOFF_DATA.get(branch, {}).get(gender, {}).get(category)


def _branch_label(branch: str) -> str:
    return DEPT_DISPLAY.get(branch, branch)


def format_single(branch: str, gender: str, category: str) -> str:
    pair = get_cutoff(branch, gender, category)
    label = _branch_label(branch)
    if pair is None:
        return f"I don't have {label} — {category} {gender} in the supplied {YEAR_LABEL} {PHASE_LABEL} dataset."
    opening, closing = pair
    if opening is None and closing is None:
        return (
            f"Cutoff data for **{label} — {category} {gender}** isn't available in the supplied "
            f"{YEAR_LABEL} {PHASE_LABEL} dataset."
        )
    if closing is None:
        return (
            f"For **{label} — {category} {gender}**, the {YEAR_LABEL} {PHASE_LABEL} opening rank was "
            f"**{opening}**; the closing rank isn't available in the supplied data."
        )
    if opening is None:
        return (
            f"For **{label} — {category} {gender}**, the {YEAR_LABEL} {PHASE_LABEL} closing rank was "
            f"**{closing}**; the opening rank isn't available in the supplied data."
        )
    return (
        f"For **{label} — {category} {gender}**, the {YEAR_LABEL} {PHASE_LABEL} cutoff opened at "
        f"**{opening}** and closed at **{closing}**."
    )


def format_branch_table(branch: str, gender: Optional[str] = None, category: Optional[str] = None) -> str:
    """Markdown table of opening/closing ranks for a branch, optionally
    filtered to one gender and/or one category."""
    label = _branch_label(branch)
    genders = [gender] if gender else ["Male", "Female"]
    cats = [category] if category else CATEGORIES
    lines = [f"**{label} — {YEAR_LABEL} {PHASE_LABEL} cutoff ranks:**", "", "| Category | Gender | Opening | Closing |", "|---|---|---|---|"]
    any_row = False
    for g in genders:
        for c in cats:
            pair = get_cutoff(branch, g, c)
            if not pair:
                continue
            opening, closing = pair
            o_str = str(opening) if opening is not None else "—"
            c_str = str(closing) if closing is not None else "not available"
            if opening is None and closing is None:
                o_str = c_str = "not available"
            lines.append(f"| {c} | {g} | {o_str} | {c_str} |")
            any_row = True
    if not any_row:
        return f"Cutoff data for **{label}** isn't available in the supplied {YEAR_LABEL} {PHASE_LABEL} dataset."
    return "\n".join(lines)


def compare_rank(rank: int, branch: str, gender: str, category: str) -> str:
    """Section 5 rank-comparison logic: never guarantees admission, never
    invents missing values, never computes a probability."""
    label = _branch_label(branch)
    pair = get_cutoff(branch, gender, category)
    if pair is None:
        return f"I don't have {label} — {category} {gender} in the supplied {YEAR_LABEL} {PHASE_LABEL} dataset."
    opening, closing = pair
    if opening is None and closing is None:
        return f"Cutoff data is unavailable in the supplied data for **{label} — {category} {gender}**."
    if closing is None:
        return (
            f"For **{label} — {category} {gender}**, the {YEAR_LABEL} {PHASE_LABEL} opening rank was "
            f"**{opening}**, but a closing rank isn't available in the supplied data — I can't determine "
            f"whether rank **{rank}** falls inside or outside that range."
        )
    if rank <= closing:
        return (
            f"A rank of **{rank}** falls within the historical **{label} — {category} {gender}** closing-rank "
            f"range, which closed at **{closing}** in {YEAR_LABEL} {PHASE_LABEL}."
        )
    return (
        f"A rank of **{rank}** was **outside** the historical **{label} — {category} {gender}** closing-rank "
        f"range, which closed at **{closing}** in {YEAR_LABEL} {PHASE_LABEL}."
    )


def branches_for_rank(rank: int, gender: str, category: str) -> Dict[str, List[Tuple[str, Optional[int]]]]:
    """Buckets every known branch into within-range / outside-range /
    insufficient-data for a given rank+gender+category, per Section 4/5
    scenario rules. Never computes a probability or ranking of branches."""
    within, outside, insufficient = [], [], []
    for branch in CUTOFF_DATA:
        pair = get_cutoff(branch, gender, category)
        if not pair or (pair[0] is None and pair[1] is None):
            insufficient.append((branch, None))
            continue
        opening, closing = pair
        if closing is None:
            insufficient.append((branch, opening))
            continue
        if rank <= closing:
            within.append((branch, closing))
        else:
            outside.append((branch, closing))
    return {"within": within, "outside": outside, "insufficient": insufficient}


def general_possibility(branch: str, rank: int, gender: Optional[str] = None, category: Optional[str] = None) -> str:
    """Broad, category/gender-agnostic (or partially-known) indication for
    when a student hasn't given full category+gender detail. Never assumes a
    specific category/gender — filters CUTOFF_DATA to whatever IS known (both,
    one, or neither) and compares the rank against the most lenient (highest)
    closing rank among the remaining combinations. This never produces a false
    "outside" for a student whose actual (unstated) category/gender would
    have put them within range — it only rules a branch out when NO known
    category/gender combination would have worked. Returns "within",
    "outside", or "insufficient" (no closing-rank data at all in scope)."""
    closings = []
    for g, cats in CUTOFF_DATA.get(branch, {}).items():
        if gender and g != gender:
            continue
        for c, pair in cats.items():
            if category and c != category:
                continue
            if pair[1] is not None:
                closings.append(pair[1])
    if not closings:
        return "insufficient"
    return "within" if rank <= max(closings) else "outside"


def branches_general_possibility(rank: int, gender: Optional[str] = None, category: Optional[str] = None) -> Dict[str, List[str]]:
    """Same broad/partial-knowledge indication as general_possibility(), across
    every branch — used for "which departments can I get?" when the student
    hasn't given full category+gender detail."""
    within, outside, insufficient = [], [], []
    for branch in CUTOFF_DATA:
        verdict = general_possibility(branch, rank, gender, category)
        {"within": within, "outside": outside, "insufficient": insufficient}[verdict].append(branch)
    return {"within": within, "outside": outside, "insufficient": insufficient}
