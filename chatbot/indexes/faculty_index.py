"""
Fast (O(1)/dict-lookup) faculty index — built once at startup from
lib/faculty.ts (209 real records). This supersedes chatbot/faculty_directory.py,
which parsed lib/dept-data.ts's `faculty` arrays; those are empty in every
department, so that module was silently returning zero results in production.
"""
import difflib
import logging
import re
from typing import Any, Dict, List, Optional, Tuple

from ingest.faculty_ingest import ingest_faculty

logger = logging.getLogger(__name__)


def _normalize_name(name: str) -> str:
    return (
        name.lower()
        .replace("dr. ", "").replace("dr.", "")
        .replace("mr. ", "").replace("mrs. ", "").replace("ms. ", "")
        .replace(".", "").strip()
    )


class FacultyIndex:
    def __init__(self, ts_file_path: str = "lib/faculty.ts"):
        self.records: List[Dict[str, Any]] = ingest_faculty(ts_file_path)
        self.by_slug: Dict[str, Dict[str, Any]] = {}
        self.by_department: Dict[str, List[Dict[str, Any]]] = {}
        self.subject_index: Dict[str, List[Dict[str, Any]]] = {}
        self._name_index: List[Tuple[str, Dict[str, Any]]] = []
        # Every individual name token (e.g. "devananda", "rao") across all
        # records — lets a single-token partial query ("devananda", "banda")
        # resolve via fuzzy match even when it isn't a contiguous substring
        # hit in _name_index (case/spacing drift, transliteration variants).
        self._all_tokens: List[str] = []
        self._build()

    def _build(self) -> None:
        for rec in self.records:
            self.by_slug[rec["slug"]] = rec
            dept = rec.get("department") or ""
            self.by_department.setdefault(dept, []).append(rec)
            name_clean = _normalize_name(rec["name"])
            self._name_index.append((name_clean, rec))
            self._all_tokens.extend(t for t in name_clean.split() if len(t) >= 3)
            for subject in rec.get("subjects_taught", []):
                key = subject.strip().lower()
                if key:
                    self.subject_index.setdefault(key, []).append(rec)
        logger.info(
            f"FacultyIndex: built {len(self.records)} records across "
            f"{len(self.by_department)} departments, {len(self.subject_index)} distinct subjects"
        )

    def is_empty(self) -> bool:
        return not self.records

    def get_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        return self.by_slug.get(slug)

    def get_by_department(self, dept_key: str) -> List[Dict[str, Any]]:
        return self.by_department.get((dept_key or "").lower(), [])

    def get_hod(self, dept_key: str) -> Optional[Dict[str, Any]]:
        for rec in self.get_by_department(dept_key):
            if rec.get("is_hod"):
                return rec
        return None

    def lookup_by_name(self, query: str) -> List[Dict[str, Any]]:
        """Bidirectional substring match against normalized names — same
        technique as the previous faculty_directory.py's lookup_person().
        Falls back to a fuzzy per-token match (e.g. a typo'd or transliterated
        partial name like "devanand"/"banda") when the exact substring check
        finds nothing, so a slightly-off spelling still resolves to a real
        entity lookup instead of falling through to general/off-topic routing."""
        q_clean = _normalize_name(query)
        if len(q_clean) < 3:
            return []
        results = []
        for name_clean, rec in self._name_index:
            if q_clean in name_clean or (len(name_clean) >= 3 and name_clean in q_clean):
                results.append(rec)
        if results:
            return results

        # Fuzzy fallback — only for short, single/two-token queries (a bare name
        # guess), not full sentences, so this never hijacks unrelated questions.
        q_tokens = q_clean.split()
        if not q_tokens or len(q_tokens) > 3:
            return []
        close = difflib.get_close_matches(q_clean, self._all_tokens, n=5, cutoff=0.75)
        if not close:
            return []
        matched_names = set()
        for name_clean, rec in self._name_index:
            if any(token in name_clean.split() for token in close):
                key = rec.get("slug") or name_clean
                if key not in matched_names:
                    matched_names.add(key)
                    results.append(rec)
        return results

    def matches_any_name(self, query: str) -> bool:
        """Cheap probe — True if `query` plausibly names a faculty member,
        even loosely (substring or fuzzy token match). Used as a Scope Gate
        safety net so a person-name query is never declined as off-topic
        purely because it didn't hit any earlier fast-path exactly."""
        return bool(self.lookup_by_name(query))

    def lookup_by_subject(self, subject_query: str) -> List[Dict[str, Any]]:
        """O(1) dict lookup for 'who teaches DBMS'-style queries — exact key
        match first, then a small substring fallback across the in-memory
        subject key set (at most a few hundred distinct subjects)."""
        key = subject_query.strip().lower()
        if not key:
            return []
        if key in self.subject_index:
            return self.subject_index[key]
        results: List[Dict[str, Any]] = []
        for subj_key, recs in self.subject_index.items():
            if key in subj_key or subj_key in key:
                for r in recs:
                    if r not in results:
                        results.append(r)
        return results
