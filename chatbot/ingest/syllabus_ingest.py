"""
Parses lib/syllabus-data.ts's SYLLABUS_DATA const — a nested
program -> regulation -> semester(1-8) -> course[] structure — into plain
Python dicts for SyllabusIndex. The semester level is a flat integer key;
the frontend's [year]/[sem] URL segments (e.g. year1/sem1) are purely a
routing convenience over this same flat 1-8 numbering, confirmed against
app/departments/syllabus/[program]/[regulation]/[year]/[sem]/page.tsx, which
parses `sem` into an int and looks it up directly with no year concept.
"""
import logging
from typing import Dict, List

from website_content import _read_file
from ingest.ts_utils import extract_const, split_top_level_keys, split_top_level_objects, str_field

logger = logging.getLogger(__name__)

SYLLABUS_TS_PATH = "lib/syllabus-data.ts"


def _strip_outer_braces(text: str) -> str:
    text = text.strip()
    if text.startswith("{") and text.endswith("}"):
        return text[1:-1]
    if text.startswith("[") and text.endswith("]"):
        return text[1:-1]
    return text


def ingest_syllabus(ts_file_path: str = SYLLABUS_TS_PATH) -> Dict[str, Dict[str, Dict[int, List[Dict[str, str]]]]]:
    content = _read_file(ts_file_path)
    if not content:
        logger.warning(f"syllabus_ingest: could not read {ts_file_path}")
        return {}

    data_text = extract_const(content, "SYLLABUS_DATA")
    if not data_text:
        logger.warning("syllabus_ingest: SYLLABUS_DATA const not found")
        return {}

    result: Dict[str, Dict[str, Dict[int, List[Dict[str, str]]]]] = {}
    outer = _strip_outer_braces(data_text)

    for program_key, program_body in split_top_level_keys(outer):
        prog_inner = _strip_outer_braces(program_body)
        result[program_key] = {}
        for reg_key, reg_body in split_top_level_keys(prog_inner):
            reg_inner = _strip_outer_braces(reg_body)
            result[program_key][reg_key] = {}
            for sem_key, sem_body in split_top_level_keys(reg_inner):
                try:
                    sem_num = int(sem_key)
                except ValueError:
                    continue
                arr_inner = _strip_outer_braces(sem_body)
                courses = []
                for course_src in split_top_level_objects(arr_inner):
                    code = str_field(course_src, "code")
                    title = str_field(course_src, "title")
                    if code and title:
                        courses.append({
                            "code": code,
                            "title": title,
                            "pdf": str_field(course_src, "pdf") or "",
                        })
                result[program_key][reg_key][sem_num] = courses

    total_courses = sum(
        len(courses)
        for regs in result.values()
        for sems in regs.values()
        for courses in sems.values()
    )
    logger.info(f"syllabus_ingest: parsed {len(result)} programs, {total_courses} total course entries")
    return result
