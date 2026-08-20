"""
Universal Entity Registry — a single fuzzy/abbreviation/partial-name resolver
spanning every navigable entity type on the site: departments, HODs, faculty
(delegated to FacultyIndex, which already has its own fuzzy matcher), labs,
office/administration roles, and every top-level page (admissions,
placements, hostel, transport, scholarships, facilities, examinations, news/
chronicles, clubs, ...).

This does NOT replace the existing, already-tuned exact-match stages in
chatbot.py (Navigation-First Router, HOD/Faculty intercepts, Administration
Directory, Structured Knowledge, Website Content Summaries) — those still
run first and own their categories' response quality. EntityRegistry is the
catch-all net run right before the query would otherwise be declined as
out-of-scope or handed to the general RAG/LLM path, so a fuzzy/partial/
abbreviated entity reference ("iet lab", "tpo", "csm", "aiml club") never
falls through to "general conversation" just because it didn't hit an exact
substring earlier.
"""
import difflib
import logging
import re
from typing import Any, Dict, List, Optional, Tuple

from config import WEBSITE_ROUTES

logger = logging.getLogger(__name__)

# Abbreviations not already covered by DEPARTMENT_KEYWORDS / WEBSITE_ROUTES'
# own acronym keys (iqac, naac, nirf, nba) — office roles and common shorthand
# students actually type.
EXTRA_ABBREVIATIONS = {
    "tpo": "placements",
    "coe": "examinations",
    "admissions cell": "admissions",
    "t&p": "placements",
    "tnp": "placements",
    "lib": "library",
}


def _normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s&-]", "", text)
    return re.sub(r"\s+", " ", text)


class EntityRegistry:
    """Fuzzy/partial/abbreviation resolver over the combined label->url map
    already built by CollegeAssistant (departments, topic pages, faculty,
    HODs, labs), plus office/administration roles and manual abbreviations."""

    def __init__(self, label_url_map: Dict[str, str], administration_directory=None):
        self.label_url_map = label_url_map
        self.administration_directory = administration_directory

        self._entries: List[Tuple[str, str, str]] = []  # (normalized_label, label, url)
        for label, url in label_url_map.items():
            self._entries.append((_normalize(label), label, url))

        # Token index for fuzzy matching — every word (>=3 chars) across every
        # label, so a single mistyped/partial token ("laborotory", "plcements")
        # still resolves via difflib against the closest known token.
        self._tokens: List[str] = sorted({
            tok for norm, _, _ in self._entries for tok in norm.split() if len(tok) >= 3
        })
        self._token_to_entries: Dict[str, List[int]] = {}
        for idx, (norm, _, _) in enumerate(self._entries):
            for tok in norm.split():
                if len(tok) >= 3:
                    self._token_to_entries.setdefault(tok, []).append(idx)

        # Advanced caching — entity/navigation resolutions are static for the
        # lifetime of the process (the registry never changes at runtime), so
        # a resolved query is memoized indefinitely rather than on a TTL.
        self._resolve_cache: Dict[str, Optional[Dict[str, Any]]] = {}
        self._CACHE_MAX_ENTRIES = 1000

        logger.info(
            f"EntityRegistry built: {len(self._entries)} labels, "
            f"{len(self._tokens)} distinct tokens"
        )

    def _cache_get(self, key: str):
        return self._resolve_cache.get(key, "__miss__")

    def _cache_set(self, key: str, value):
        if len(self._resolve_cache) >= self._CACHE_MAX_ENTRIES:
            self._resolve_cache.clear()
        self._resolve_cache[key] = value

    def resolve(self, query: str) -> Optional[Dict[str, Any]]:
        """Returns a chatbot-shaped response dict for a fuzzy/partial/
        abbreviation entity match, or None. Memoized — repeated identical
        queries never re-run the fuzzy scan."""
        q_norm = _normalize(query)
        if not q_norm:
            return None

        cached = self._cache_get(q_norm)
        if cached != "__miss__":
            return cached

        result = self._resolve_uncached(q_norm)
        self._cache_set(q_norm, result)
        return result

    def _resolve_uncached(self, q_norm: str) -> Optional[Dict[str, Any]]:
        route_key = EXTRA_ABBREVIATIONS.get(q_norm)
        if route_key:
            for norm, label, url in self._entries:
                if norm == route_key or label.lower() == route_key:
                    return self._nav_response(label, url)

        # Only treat this as an entity-lookup candidate for short, name-shaped
        # queries (<=5 words) — longer natural-language questions ("what
        # documents are required for admission") are informational asks that
        # belong to Structured Knowledge / Website Content / RAG, not a bare
        # entity reference, even if they happen to contain an entity word.
        word_count = len(q_norm.split())
        if word_count == 0 or word_count > 5:
            return None

        # Administration/office roles — fuzzy alias match.
        if self.administration_directory:
            role_key = self.administration_directory.detect_role(q_norm)
            if role_key:
                info = self.administration_directory.get_role(role_key)
                return self._admin_response(info)

        # Exact/substring match against every known label.
        hits = {}
        for norm, label, url in self._entries:
            if q_norm == norm or (len(norm) >= 3 and (q_norm in norm or norm in q_norm)):
                hits.setdefault(label, url)
        if len(hits) == 1:
            label, url = next(iter(hits.items()))
            return self._nav_response(label, url)
        if len(hits) > 1:
            return self._multi_response(hits)

        # Fuzzy fallback — only for very short queries (a bare/partial name
        # guess), matched against the token index.
        if word_count > 3:
            return None
        close_tokens = difflib.get_close_matches(q_norm, self._tokens, n=5, cutoff=0.8)
        if not close_tokens:
            for tok in q_norm.split():
                close_tokens.extend(difflib.get_close_matches(tok, self._tokens, n=3, cutoff=0.8))
        if not close_tokens:
            return None

        fuzzy_hits = {}
        for tok in close_tokens:
            for idx in self._token_to_entries.get(tok, []):
                _, label, url = self._entries[idx]
                fuzzy_hits.setdefault(label, url)
        if len(fuzzy_hits) == 1:
            label, url = next(iter(fuzzy_hits.items()))
            return self._nav_response(label, url)
        if len(fuzzy_hits) > 1:
            return self._multi_response(fuzzy_hits)
        return None

    @staticmethod
    def _nav_response(label: str, url: str) -> Dict[str, Any]:
        return {
            "answer": f"**{label}** — click below to open it.",
            "sources": [],
            "navigation_target": label.lower().replace(" ", "-"),
            "navigation_url": url,
            "confidence": 0.85,
            "query_type": "navigation",
        }

    @staticmethod
    def _multi_response(hits: Dict[str, str]) -> Dict[str, Any]:
        lines = "\n".join(f"- **{label}**" for label in list(hits.keys())[:10])
        return {
            "answer": f"I found a few matching entities:\n\n{lines}\n\nClick one to open it.",
            "sources": [],
            "navigation_target": None,
            "navigation_url": None,
            "entities": [{"label": label, "url": url} for label, url in hits.items()][:10],
            "confidence": 0.7,
            "query_type": "navigation",
        }

    @staticmethod
    def _admin_response(info: Dict[str, Any]) -> Dict[str, Any]:
        nav_target = info.get("nav_target")
        nav_url = info.get("nav_url_override") or WEBSITE_ROUTES.get(nav_target)
        answer = f"**{info['designation']}**"
        if info.get("name"):
            answer = f"**{info['name']}** — {info['designation']}"
        if info.get("description"):
            answer += f"\n\n{info['description']}"
        return {
            "answer": answer,
            "sources": [],
            "navigation_target": nav_target,
            "navigation_url": nav_url,
            "confidence": 0.85,
            "query_type": "general",
        }
