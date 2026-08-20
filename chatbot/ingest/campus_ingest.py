"""
Parses lib/transport-routes.ts's BUS_ROUTES const (the only campus domain
with its own dedicated typed lib/*.ts file — hostels/clubs/sports/cafeteria
are lib/info-pages.ts slugs, already handled by website_content.py's
existing extractors) into fast, structured route records for CampusIndex.
"""
import logging
from typing import Any, Dict, List

from website_content import _read_file
from ingest.ts_utils import extract_const, split_top_level_objects, str_field, num_field, str_array_field

logger = logging.getLogger(__name__)

TRANSPORT_TS_PATH = "lib/transport-routes.ts"


def ingest_bus_routes(ts_file_path: str = TRANSPORT_TS_PATH) -> List[Dict[str, Any]]:
    content = _read_file(ts_file_path)
    if not content:
        logger.warning(f"campus_ingest: could not read {ts_file_path}")
        return []

    arr_text = extract_const(content, "BUS_ROUTES")
    if not arr_text:
        logger.warning("campus_ingest: BUS_ROUTES const not found")
        return []

    routes = []
    for obj_src in split_top_level_objects(arr_text):
        route_number = num_field(obj_src, "routeNumber")
        if route_number is None:
            continue
        routes.append({
            "id": str_field(obj_src, "id"),
            "route_number": int(route_number),
            "stops": str_array_field(obj_src, "stops"),
            "incharge_name": str_field(obj_src, "inchargeName"),
            "incharge_contact": str_field(obj_src, "inchargeContact"),
            "driver_name": str_field(obj_src, "driverName"),
            "driver_contact": str_field(obj_src, "driverContact"),
        })

    logger.info(f"campus_ingest: parsed {len(routes)} bus routes")
    return routes
