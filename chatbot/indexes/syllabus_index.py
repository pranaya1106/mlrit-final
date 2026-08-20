"""
Fast (O(1) at each level) syllabus index — program -> regulation ->
semester(1-8) -> course list, built once at startup from
lib/syllabus-data.ts. Never embedded into ChromaDB.
"""
import logging
from typing import Any, Dict, List

from ingest.syllabus_ingest import ingest_syllabus

logger = logging.getLogger(__name__)


class SyllabusIndex:
    def __init__(self, ts_file_path: str = "lib/syllabus-data.ts"):
        self.data: Dict[str, Dict[str, Dict[int, List[Dict[str, str]]]]] = ingest_syllabus(ts_file_path)
        total = sum(len(sems) for regs in self.data.values() for sems in regs.values())
        logger.info(f"SyllabusIndex: built {len(self.data)} programs, {total} regulation-semester entries")

    def is_empty(self) -> bool:
        return not self.data

    def get_programs(self) -> List[str]:
        return list(self.data.keys())

    def get_regulations(self, program: str) -> List[str]:
        return list(self.data.get(program.lower(), {}).keys())

    def get_courses(self, program: str, regulation: str, sem: int) -> List[Dict[str, str]]:
        return self.data.get(program.lower(), {}).get(regulation.lower(), {}).get(sem, [])

    def find_course_by_code(self, code: str) -> List[Dict[str, Any]]:
        """Searches the small, fully in-memory structure for a matching
        course code — still no external I/O or vector search involved."""
        code_norm = code.strip().lower()
        matches: List[Dict[str, Any]] = []
        for program, regs in self.data.items():
            for regulation, sems in regs.items():
                for sem_num, courses in sems.items():
                    for course in courses:
                        if course["code"].strip().lower() == code_norm:
                            matches.append({**course, "program": program, "regulation": regulation, "sem": sem_num})
        return matches
