"""
Parses lib/placements.ts into fast structured facts (YEAR_STATS, RECRUITERS,
PLACEMENT_CONTACTS) and descriptive text (PLACEMENT_OVERVIEW), for
PlacementIndex. Reuses website_content.py's existing _extract_const /
_read_file helpers and the same precise YEAR_STATS-row regex already proven
in website_content.py's _extract_placements_statistics (real published
numbers, parsed exactly rather than via the generic block-text scanner).
"""
import re
import logging
from typing import Any, Dict

from website_content import _read_file, _extract_const
from ingest.ts_utils import split_top_level_objects, str_field, str_array_field

logger = logging.getLogger(__name__)

PLACEMENTS_TS_PATH = "lib/placements.ts"


def ingest_placements(ts_file_path: str = PLACEMENTS_TS_PATH) -> Dict[str, Any]:
    content = _read_file(ts_file_path)
    if not content:
        logger.warning(f"placement_ingest: could not read {ts_file_path}")
        return {}

    result: Dict[str, Any] = {"year_stats": [], "recruiters": [], "contacts": [], "overview": None, "placement_rate": None}

    highlights_text = _extract_const(content, "PLACEMENT_HIGHLIGHTS")
    if highlights_text:
        # e.g. { value: '81%', label: 'Students getting placed', sub: '...' } — the
        # single authoritative placement-rate figure, so config.py's COLLEGE_INFO
        # can be kept in sync with it instead of carrying its own separate copy.
        m = re.search(r"value:\s*'([^']*)'\s*,\s*label:\s*'Students getting placed'", highlights_text)
        if m:
            result["placement_rate"] = m.group(1)

    year_stats_text = _extract_const(content, "YEAR_STATS")
    if year_stats_text:
        rows = re.findall(
            r"year:\s*'([^']*)'.*?offers:\s*(\d+).*?companies:\s*(\d+).*?highest:\s*([\d.]+)",
            year_stats_text, re.DOTALL,
        )
        result["year_stats"] = [
            {"year": y, "offers": int(o), "companies": int(c), "highest": float(h)}
            for y, o, c, h in rows
        ]

    recruiters_text = _extract_const(content, "RECRUITERS")
    if recruiters_text:
        result["recruiters"] = re.findall(r"'([^']+)'", recruiters_text)

    contacts_text = _extract_const(content, "PLACEMENT_CONTACTS")
    if contacts_text:
        for obj_src in split_top_level_objects(contacts_text):
            name = str_field(obj_src, "name")
            if not name:
                continue
            result["contacts"].append({
                "name": name,
                "designation": str_field(obj_src, "designation"),
                "phones": str_array_field(obj_src, "phones"),
                "email": str_field(obj_src, "email"),
                "purpose": str_field(obj_src, "purpose"),
            })

    overview_text = _extract_const(content, "PLACEMENT_OVERVIEW")
    if overview_text:
        m = re.search(r"""(['"`])((?:(?!\1)[^\\]|\\.)*)\1""", overview_text, re.DOTALL)
        if m:
            result["overview"] = m.group(2).strip()

    logger.info(
        f"placement_ingest: parsed {len(result['year_stats'])} year stats, "
        f"{len(result['recruiters'])} recruiters, {len(result['contacts'])} contacts"
    )
    return result
