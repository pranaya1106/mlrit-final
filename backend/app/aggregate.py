def group_achievements(items: list[dict], per_category_limit: int = 15) -> dict[str, list[dict]]:
    """Group already newest-first items by category, capping each bucket.
    Pure/list-based so both the sqlite-backed local backend (db.get_achievements)
    and the stateless CI export path (scripts/export_snapshot.py) share one
    grouping rule instead of drifting apart."""
    grouped: dict[str, list[dict]] = {}
    for item in items:
        bucket = grouped.setdefault(item.get("category") or "Campus News", [])
        if len(bucket) < per_category_limit:
            bucket.append(item)
    return grouped
