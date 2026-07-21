from .config import (
    REQUIRE_TERMS,
    EXCLUDE_COLLEGE_TERMS,
    POSITIVE_KEYWORDS,
    NEGATIVE_KEYWORDS,
    CATEGORY_KEYWORDS,
    DEFAULT_CATEGORY,
)


def is_target_college(text: str) -> bool:
    """True only for MLR Institute of Technology, Dundigal — excludes the
    similarly-named Malla Reddy Institute of Technology & Management (MLRITM)."""
    lower = text.lower()
    if any(term in lower for term in EXCLUDE_COLLEGE_TERMS):
        return False
    return any(term in lower for term in REQUIRE_TERMS)


def is_positive(text: str) -> bool:
    """Require an explicit achievement/positive signal; hard-reject on any
    negative signal even if a positive keyword also matches."""
    lower = text.lower()
    if any(term in lower for term in NEGATIVE_KEYWORDS):
        return False
    return any(term in lower for term in POSITIVE_KEYWORDS)


def classify_category(text: str) -> str:
    lower = text.lower()
    for category, keywords in CATEGORY_KEYWORDS:
        if any(kw in lower for kw in keywords):
            return category
    return DEFAULT_CATEGORY
