import re

# ─── Lightweight Query Normalization ────────────────────────────────────────
# Shared by website_content.py and structured_topics.py so a topic's keyword
# list only needs ONE form of a word (e.g. "admission") to also match its
# plural ("admissions"), and a conversational lead-in ("tell me about X",
# "what is X") doesn't need to be duplicated onto every topic's keyword list.
# Deterministic suffix-stripping only — no fuzzy/edit-distance matching, so it
# can't introduce false positives beyond ordinary singular/plural confusion.

_PREFIX_PATTERNS = [
    re.compile(r"^tell me (more )?about\s+"),
    re.compile(r"^what about\s+"),
    re.compile(r"^what is\s+"),
    re.compile(r"^what are\s+"),
    re.compile(r"^know about\s+"),
    re.compile(r"^i want to know about\s+"),
    re.compile(r"^information about\s+"),
    re.compile(r"^info (on|about)\s+"),
    re.compile(r"^details about\s+"),
    re.compile(r"^give me (info|information|details) (on|about)\s+"),
    re.compile(r"^explain\s+"),
    re.compile(r"^can you tell me about\s+"),
]


def strip_conversational_prefix(text: str) -> str:
    """Removes one leading conversational lead-in phrase, if present."""
    for pattern in _PREFIX_PATTERNS:
        stripped = pattern.sub("", text, count=1)
        if stripped != text:
            return stripped
    return text


def normalize_text(text: str) -> str:
    """Lowercase, strip punctuation, collapse whitespace."""
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def singularize_word(word: str) -> str:
    """Deterministic, conservative singularization for keyword matching only
    (not a general-purpose stemmer): "admissions" -> "admission", "exams" ->
    "exam", "facilities" -> "facility". Leaves short/ambiguous words (e.g.
    "bus", "campus") untouched to avoid mangling them."""
    if len(word) > 4 and word.endswith("ies"):
        return word[:-3] + "y"
    if len(word) > 4 and word.endswith(("ches", "shes", "xes", "zes", "ses")):
        return word[:-2]
    if len(word) > 3 and word.endswith("s") and not word.endswith("ss") and not word.endswith("us"):
        return word[:-1]
    return word


def normalize_phrase(phrase: str) -> str:
    """Singularizes each word in a keyword phrase so it matches both forms."""
    return " ".join(singularize_word(w) for w in phrase.split())


def normalize_query_for_matching(text: str) -> str:
    """Full pipeline applied to an incoming user query before topic matching."""
    text = normalize_text(text)
    text = strip_conversational_prefix(text)
    words = text.split()
    return " ".join(singularize_word(w) for w in words)
