"""
Descriptive department data (vision/mission/HOD/labs/history), merged from
lib/departments.ts + lib/dept-data.ts. Feeds the existing website-content-
summary LLM path (same as website_content.py's other topics) — NOT a new set
of ChromaDB embeddings.
"""
import logging
from typing import Any, Dict

from ingest.department_ingest import ingest_departments

logger = logging.getLogger(__name__)


class DepartmentIndex:
    def __init__(self):
        self.by_slug: Dict[str, Dict[str, Any]] = ingest_departments()
        logger.info(f"DepartmentIndex: built {len(self.by_slug)} department records")

    def is_empty(self) -> bool:
        return not self.by_slug

    def get(self, slug: str) -> Dict[str, Any]:
        return self.by_slug.get((slug or "").lower(), {})

    def has(self, slug: str) -> bool:
        return (slug or "").lower() in self.by_slug

    def to_context_text(self, slug: str) -> str:
        """Flattens one department's descriptive fields into an LLM-context
        string, in the same shape as website_content.py's extractors."""
        rec = self.get(slug)
        if not rec:
            return ""
        parts = []
        if rec.get("tagline"):
            parts.append(rec["tagline"])
        if rec.get("vision"):
            parts.append(f"Vision: {rec['vision']}")
        if rec.get("mission"):
            parts.append("Mission: " + " ".join(rec["mission"]))
        if rec.get("introduction"):
            parts.append(rec["introduction"])
        if rec.get("history"):
            parts.append(rec["history"])
        if rec.get("labs"):
            lab_names = ", ".join(l["name"] for l in rec["labs"][:15])
            parts.append(f"Laboratories: {lab_names}")
        if rec.get("hod_name"):
            parts.append(f"HOD: {rec['hod_name']} ({rec.get('hod_title', '')})")
        if rec.get("achievements_text"):
            parts.append(rec["achievements_text"])
        return "\n".join(p for p in parts if p)
