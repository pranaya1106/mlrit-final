"""
Parses lib/faculty.ts — the real 209-record faculty dataset — into plain
Python dicts for FacultyIndex. NOTE: this deliberately does NOT read
lib/dept-data.ts (the old faculty_directory.py's source); every department's
`faculty` array there is empty, so that module was silently returning zero
results in production. lib/faculty.ts is the actual source of truth the
`/faculty/[slug]` frontend pages render from.
"""
import logging
from typing import Any, Dict, List

from website_content import _read_file
from ingest.ts_utils import (
    extract_const,
    split_top_level_objects,
    str_field,
    bool_field,
    str_array_field,
)

logger = logging.getLogger(__name__)

FACULTY_TS_PATH = "lib/faculty.ts"


def ingest_faculty(ts_file_path: str = FACULTY_TS_PATH) -> List[Dict[str, Any]]:
    content = _read_file(ts_file_path)
    if not content:
        logger.warning(f"faculty_ingest: could not read {ts_file_path}")
        return []

    array_text = extract_const(content, "FACULTY")
    if not array_text:
        logger.warning("faculty_ingest: FACULTY const not found")
        return []

    records: List[Dict[str, Any]] = []
    for obj_src in split_top_level_objects(array_text):
        name = str_field(obj_src, "name")
        slug = str_field(obj_src, "slug")
        if not name or not slug:
            continue
        records.append({
            "id": str_field(obj_src, "id") or slug,
            "slug": slug,
            "name": name,
            "designation": str_field(obj_src, "designation") or "",
            "is_hod": bool_field(obj_src, "isHod") or False,
            "department": (str_field(obj_src, "department") or "").lower(),
            "qualifications": str_array_field(obj_src, "qualifications"),
            "specialization": str_array_field(obj_src, "specialization"),
            "experience": str_field(obj_src, "experience"),
            "subjects_taught": str_array_field(obj_src, "subjectsTaught"),
            "publications": str_array_field(obj_src, "publications"),
            "patents": str_array_field(obj_src, "patents"),
            "books": str_array_field(obj_src, "books"),
            "description": str_field(obj_src, "description"),
            "email": str_field(obj_src, "email"),
        })

    logger.info(f"faculty_ingest: parsed {len(records)} faculty records from {ts_file_path}")
    return records
