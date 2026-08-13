"""
Merges lib/departments.ts (index/summary: slug, name, tagline, vision,
mission, hod) with lib/dept-data.ts (deep detail: history, introduction,
hodMessage, labs, achievements) into one descriptive record per department
slug, for DepartmentIndex. This is descriptive content — it feeds the same
website-content-summary LLM path as the rest of website_content.py's topics,
NOT a new set of ChromaDB embeddings.
"""
import re
import logging
from typing import Any, Dict

from website_content import _read_file, _generic_block_text
from ingest.ts_utils import extract_const, split_top_level_objects, split_top_level_keys, str_field, str_array_field

logger = logging.getLogger(__name__)

DEPARTMENTS_TS_PATH = "lib/departments.ts"
DEPT_DATA_TS_PATH = "lib/dept-data.ts"


def _ingest_departments_index(path: str = DEPARTMENTS_TS_PATH) -> Dict[str, Dict[str, Any]]:
    content = _read_file(path)
    if not content:
        return {}
    arr_text = extract_const(content, "DEPARTMENTS")
    if not arr_text:
        return {}

    result: Dict[str, Dict[str, Any]] = {}
    for obj_src in split_top_level_objects(arr_text):
        slug = str_field(obj_src, "slug")
        if not slug:
            continue
        record = {
            "slug": slug,
            "code": str_field(obj_src, "code"),
            "name": str_field(obj_src, "name"),
            "tagline": str_field(obj_src, "tagline"),
            "vision": str_field(obj_src, "vision"),
            "mission": str_array_field(obj_src, "mission"),
            "hod_name": None,
            "hod_title": None,
        }
        hod_match = re.search(r"hod\s*:\s*\{(.*?)\}", obj_src, re.DOTALL)
        if hod_match:
            hod_src = hod_match.group(1)
            record["hod_name"] = str_field(hod_src, "name")
            record["hod_title"] = str_field(hod_src, "title")
        result[slug] = record
    return result


def _ingest_dept_data(path: str = DEPT_DATA_TS_PATH) -> Dict[str, Dict[str, Any]]:
    content = _read_file(path)
    if not content:
        return {}
    record_text = extract_const(content, "DEPT_DATA")
    if not record_text:
        return {}

    inner = record_text.strip()
    if inner.startswith("{") and inner.endswith("}"):
        inner = inner[1:-1]

    result: Dict[str, Dict[str, Any]] = {}
    for slug, block in split_top_level_keys(inner):
        # Same regex technique as the existing labs_directory.py — kept
        # identical so both stay in sync if the source shape ever changes.
        labs = []
        labs_match = re.search(r"labs\s*:\s*\[(.*?)\]\s*,", block, re.DOTALL)
        if labs_match:
            items = re.findall(
                r"\{\s*name:\s*['\"](.*?)['\"]\s*,\s*desc:\s*['\"](.*?)['\"]\s*\}",
                labs_match.group(1),
            )
            labs = [{"name": n, "description": d} for n, d in items]

        result[slug] = {
            "history": str_field(block, "history"),
            "introduction": str_field(block, "introduction"),
            "hodMessage": str_field(block, "hodMessage"),
            "labs": labs,
            "achievements_text": _generic_block_text(block, max_chars=1500),
        }
    return result


def ingest_departments() -> Dict[str, Dict[str, Any]]:
    """Merges the two frontend sources into one record per department slug."""
    index_data = _ingest_departments_index()
    detail_data = _ingest_dept_data()

    merged: Dict[str, Dict[str, Any]] = {}
    for slug, idx in index_data.items():
        merged[slug] = {**idx, **detail_data.get(slug, {})}
    for slug, det in detail_data.items():
        if slug not in merged:
            merged[slug] = det

    logger.info(f"department_ingest: merged {len(merged)} department records")
    return merged
