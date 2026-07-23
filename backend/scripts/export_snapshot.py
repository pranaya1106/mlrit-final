"""Stateless CI entry point — no sqlite involved.

A GitHub Actions runner has no persistent disk between runs, so this fetches the
snapshot the Worker is currently serving (NEWS_API_URL) to know what's already
been published, scrapes for anything new via app.scraper.fetch_candidates(),
merges, and writes news_items.json + achievements.json for the workflow to push
into Cloudflare Workers KV. If the Worker isn't reachable yet (first-ever run,
cold start), it just treats the snapshot as empty and backfills everything.
"""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.aggregate import group_achievements  # noqa: E402
from app.db import _normalize_published  # noqa: E402
from app.scraper import fetch_candidates  # noqa: E402

WORKER_URL = os.environ.get("NEWS_API_URL", "").rstrip("/")
MAX_ITEMS = int(os.environ.get("MAX_ITEMS", "300"))
OUT_DIR = Path(os.environ.get("EXPORT_DIR", "."))


def _fetch_existing() -> list[dict]:
    if not WORKER_URL:
        print("[export] NEWS_API_URL not set — starting from an empty snapshot")
        return []
    try:
        resp = httpx.get(f"{WORKER_URL}/api/news", params={"limit": MAX_ITEMS}, timeout=15)
        resp.raise_for_status()
        return resp.json().get("items", [])
    except Exception as exc:  # noqa: BLE001 - unreachable/cold Worker just means starting fresh
        print(f"[export] couldn't fetch existing snapshot from {WORKER_URL} -> {exc}")
        return []


def main() -> None:
    existing = _fetch_existing()
    known_links = {item["link"] for item in existing}

    candidates = fetch_candidates(known_links)
    print(f"[export] {len(candidates)} new item(s) found (existing snapshot had {len(existing)})")

    scraped_at = datetime.now(timezone.utc).isoformat()
    fresh_items = [
        {
            "id": None,  # replaced with a stable synthetic id below, after sort
            "title": c["title"],
            "link": c["link"],
            "summary": c["summary"],
            "source": c["source"],
            "category": c["category"],
            "image_url": c["image_url"],
            "published_at": _normalize_published(c["published"]),
            "scraped_at": scraped_at,
        }
        for c in candidates
    ]

    merged = fresh_items + existing
    merged.sort(key=lambda item: item["published_at"], reverse=True)
    merged = merged[:MAX_ITEMS]
    for idx, item in enumerate(merged):
        item["id"] = idx + 1  # only used as a React key on the frontend

    achievements = group_achievements(merged)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "news_items.json").write_text(
        json.dumps({"items": merged}, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (OUT_DIR / "achievements.json").write_text(
        json.dumps({"categories": achievements}, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[export] wrote {len(merged)} total item(s) to {OUT_DIR}")


if __name__ == "__main__":
    main()
