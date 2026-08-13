"""
Fast-fact wrapper for campus services. Bus routes are sourced from
lib/transport-routes.ts (the only campus domain with its own dedicated typed
lib/*.ts file). Hostel/clubs/sports/cafeteria descriptive content already
flows through website_content.py's existing lib/info-pages.ts extractors —
this index only adds the fast/structured transport-route half described in
the Phase 2 plan.
"""
import logging
from typing import Any, Dict, List

from ingest.campus_ingest import ingest_bus_routes

logger = logging.getLogger(__name__)


class CampusIndex:
    def __init__(self, ts_file_path: str = "lib/transport-routes.ts"):
        self.routes: List[Dict[str, Any]] = ingest_bus_routes(ts_file_path)
        logger.info(f"CampusIndex: loaded {len(self.routes)} bus routes")

    def is_empty(self) -> bool:
        return not self.routes

    def get_route(self, route_number: int) -> List[Dict[str, Any]]:
        return [r for r in self.routes if r["route_number"] == route_number]

    def search_routes(self, query: str) -> List[Dict[str, Any]]:
        """Substring match against every route's stop list — same intent as
        transport-routes.ts's own searchRoutes() helper, re-implemented here
        in Python since that TS module isn't importable from the backend."""
        q = query.strip().lower()
        if not q:
            return []
        matches = []
        for route in self.routes:
            stops_lower = [s.lower() for s in route.get("stops", [])]
            if any(q in s for s in stops_lower):
                matches.append(route)
        return matches
