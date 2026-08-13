"""
Splits placement data into fast structured facts (year stats, recruiters,
contacts — zero-LLM dict/list lookups) vs. descriptive content (overview,
already routed through website_content.py's existing placements_overview
topic). Sourced from lib/placements.ts.
"""
import logging
from typing import Any, Dict, List, Optional

from ingest.placement_ingest import ingest_placements

logger = logging.getLogger(__name__)


class PlacementIndex:
    def __init__(self, ts_file_path: str = "lib/placements.ts"):
        data = ingest_placements(ts_file_path)
        self.year_stats: List[Dict[str, Any]] = data.get("year_stats", [])
        self.recruiters: List[str] = data.get("recruiters", [])
        self.contacts: List[Dict[str, Any]] = data.get("contacts", [])
        self.overview: Optional[str] = data.get("overview")
        self.placement_rate: Optional[str] = data.get("placement_rate")
        logger.info(
            f"PlacementIndex: built {len(self.year_stats)} year stats, "
            f"{len(self.recruiters)} recruiters, {len(self.contacts)} contacts"
        )

    def is_empty(self) -> bool:
        return not self.year_stats and not self.recruiters and not self.contacts

    def latest_year_stat(self) -> Optional[Dict[str, Any]]:
        # lib/placements.ts's YEAR_STATS is authored newest-first (2026, 2025, ...) —
        # index 0, not -1, is the most recent year.
        return self.year_stats[0] if self.year_stats else None

    def highest_package(self) -> Optional[float]:
        if not self.year_stats:
            return None
        return max(row["highest"] for row in self.year_stats)

    def highest_package_stat(self) -> Optional[Dict[str, Any]]:
        """Returns the full year_stats row that actually achieved the highest
        package — use this (not highest_package() + latest_year_stat()) when
        reporting offers/companies alongside the LPA figure, so the numbers
        never get attributed to the wrong year."""
        if not self.year_stats:
            return None
        return max(self.year_stats, key=lambda row: row["highest"])

    def get_contacts(self) -> List[Dict[str, Any]]:
        return self.contacts
