import sqlite3
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

from .aggregate import group_achievements
from .config import DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS news_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    summary TEXT,
    source TEXT,
    category TEXT,
    image_url TEXT,
    published_raw TEXT,
    published_at TEXT,
    scraped_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_items(category);
"""


def get_conn() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_conn()
    try:
        conn.executescript(SCHEMA)
        existing_cols = {row["name"] for row in conn.execute("PRAGMA table_info(news_items)")}
        if "image_url" not in existing_cols:
            conn.execute("ALTER TABLE news_items ADD COLUMN image_url TEXT")
        conn.commit()
    finally:
        conn.close()


def link_exists(link: str) -> bool:
    conn = get_conn()
    try:
        row = conn.execute("SELECT 1 FROM news_items WHERE link = ?", (link,)).fetchone()
        return row is not None
    finally:
        conn.close()


def get_all_links() -> set[str]:
    """One roundtrip dedup set for a whole scrape run, instead of a link_exists()
    query per candidate — also what run_scrape() hands to scraper.fetch_candidates()."""
    conn = get_conn()
    try:
        return {row["link"] for row in conn.execute("SELECT link FROM news_items")}
    finally:
        conn.close()


def get_items_missing_image() -> list[dict]:
    conn = get_conn()
    try:
        rows = conn.execute(
            "SELECT id, link FROM news_items WHERE image_url IS NULL OR image_url = ''",
        ).fetchall()
        return [{"id": r["id"], "link": r["link"]} for r in rows]
    finally:
        conn.close()


def update_image(item_id: int, image_url: str) -> None:
    conn = get_conn()
    try:
        conn.execute("UPDATE news_items SET image_url = ? WHERE id = ?", (image_url, item_id))
        conn.commit()
    finally:
        conn.close()


def _normalize_published(published_raw: str) -> str:
    if not published_raw:
        return datetime.now(timezone.utc).isoformat()
    try:
        return parsedate_to_datetime(published_raw).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError):
        pass
    # MLRIT's own newsroom (app/scraper.py's _scrape_official_site) gives dates
    # as "13-07-2026", not RFC-822 — parsedate_to_datetime can't touch that.
    for fmt in ("%d-%m-%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(published_raw, fmt).replace(tzinfo=timezone.utc).isoformat()
        except ValueError:
            continue
    return datetime.now(timezone.utc).isoformat()


def upsert_news_item(
    title: str,
    link: str,
    summary: str,
    source: str,
    published: str,
    category: str,
    image_url: str | None = None,
) -> bool:
    """Insert a news item if its link isn't already stored. Returns True if a new row was inserted."""
    conn = get_conn()
    try:
        cur = conn.execute(
            """
            INSERT OR IGNORE INTO news_items
                (title, link, summary, source, category, image_url, published_raw, published_at, scraped_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                title,
                link,
                summary,
                source,
                category,
                image_url,
                published,
                _normalize_published(published),
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        conn.commit()
        return cur.rowcount > 0
    finally:
        conn.close()


def _row_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "title": row["title"],
        "link": row["link"],
        "summary": row["summary"],
        "source": row["source"],
        "category": row["category"],
        "image_url": row["image_url"],
        "published_at": row["published_at"],
    }


def get_news(limit: int = 30) -> list[dict]:
    conn = get_conn()
    try:
        rows = conn.execute(
            "SELECT * FROM news_items ORDER BY published_at DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [_row_to_dict(r) for r in rows]
    finally:
        conn.close()


def get_achievements(per_category_limit: int = 15) -> dict[str, list[dict]]:
    conn = get_conn()
    try:
        rows = conn.execute(
            "SELECT * FROM news_items ORDER BY published_at DESC",
        ).fetchall()
    finally:
        conn.close()

    return group_achievements([_row_to_dict(r) for r in rows], per_category_limit)
