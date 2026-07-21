import json
import re
from urllib.parse import quote

import feedparser
import httpx

from .config import LANGUAGE_EDITIONS, QUERIES
from .db import get_items_missing_image, link_exists, update_image, upsert_news_item
from .filters import classify_category, is_positive, is_target_college

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}

TAG_RE = re.compile(r"<[^>]+>")
OG_IMAGE_RE = re.compile(
    r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
    re.IGNORECASE,
)
OG_IMAGE_RE_REVERSED = re.compile(
    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
    re.IGNORECASE,
)
TWITTER_IMAGE_RE = re.compile(
    r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']',
    re.IGNORECASE,
)

# Google News RSS links are a client-rendered redirect app (news.google.com), not
# the publisher's page — a plain GET never reaches the real article. Google embeds
# a signed decode request in the page; this reproduces it (same technique used by
# open-source google-news-url-decoder tools) to recover the true publisher URL.
GN_ID_RE = re.compile(r'data-n-a-id="([^"]+)"')
GN_TS_RE = re.compile(r'data-n-a-ts="([^"]+)"')
GN_SIG_RE = re.compile(r'data-n-a-sg="([^"]+)"')


def _strip_html(html: str) -> str:
    return TAG_RE.sub("", html or "").replace("&nbsp;", " ").strip()


def _decode_google_news_link(google_url: str) -> str | None:
    """Resolve a news.google.com/rss/articles/... redirect to the real publisher URL."""
    try:
        resp = httpx.get(google_url, headers=HEADERS, timeout=8, follow_redirects=True)
        resp.raise_for_status()
        html = resp.text
    except Exception:
        return None

    id_match, ts_match, sig_match = GN_ID_RE.search(html), GN_TS_RE.search(html), GN_SIG_RE.search(html)
    if not (id_match and ts_match and sig_match):
        return None

    gn_art_id, timestamp, signature = id_match.group(1), ts_match.group(1), sig_match.group(1)
    inner_req = json.dumps(
        [
            "garturlreq",
            [["X", "X", ["X", "X"], None, None, 1, 1, "US:en", None, 1, None, None, None, None, None, 0, 1],
             "X", "X", 1, [1, 1, 1], 1, 1, None, 0, 0, None, 0],
            gn_art_id,
            int(timestamp),
            signature,
        ]
    )
    f_req = json.dumps([[["Fbv4je", inner_req]]])

    try:
        resp = httpx.post(
            "https://news.google.com/_/DotsSplashUi/data/batchexecute",
            headers={**HEADERS, "content-type": "application/x-www-form-urlencoded;charset=UTF-8"},
            data=f"f.req={quote(f_req)}",
            timeout=8,
        )
        resp.raise_for_status()
        body = resp.text.split("\n\n", 1)[1]
        outer = json.loads(body)
        inner_result = json.loads(outer[0][2])
        return inner_result[1]
    except Exception:
        return None


def _extract_og_image(google_news_url: str) -> str | None:
    """Best-effort: resolve the real publisher URL, then pull its og:image.
    Returns None on any failure — no image is better than a wrong/duplicate one."""
    real_url = _decode_google_news_link(google_news_url)
    if not real_url:
        return None

    try:
        resp = httpx.get(real_url, headers=HEADERS, timeout=8, follow_redirects=True)
        resp.raise_for_status()
        html = resp.text
    except Exception:
        return None

    for pattern in (OG_IMAGE_RE, OG_IMAGE_RE_REVERSED, TWITTER_IMAGE_RE):
        match = pattern.search(html)
        if match:
            return match.group(1)
    return None


def _build_url(query: str, lang_params: str) -> str:
    return f"https://news.google.com/rss/search?q={quote(query)}&{lang_params}"


def _fetch_feed(query: str, lang_params: str):
    url = _build_url(query, lang_params)
    resp = httpx.get(url, headers=HEADERS, timeout=15, follow_redirects=True)
    resp.raise_for_status()
    return feedparser.parse(resp.content)


def _parse_entry(entry) -> dict:
    title_raw = (entry.get("title") or "").strip()
    if " - " in title_raw:
        title, source = title_raw.rsplit(" - ", 1)
    else:
        title, source = title_raw, "Unknown"

    return {
        "title": title.strip(),
        "link": (entry.get("link") or "").strip(),
        "source": source.strip() or "Unknown",
        "published": entry.get("published", ""),
        "summary": _strip_html(entry.get("summary", "")),
    }


def run_scrape() -> int:
    """Scrape all configured queries, filter for relevance/positivity, store new items.
    Returns the count of newly inserted rows."""
    new_count = 0
    for query in QUERIES:
        for lang_params in LANGUAGE_EDITIONS:
            try:
                feed = _fetch_feed(query, lang_params)
            except Exception as exc:  # noqa: BLE001 - log and keep going
                print(f"[scraper] query failed: {query!r} ({lang_params}) -> {exc}")
                continue

            for entry in feed.entries:
                parsed = _parse_entry(entry)
                if not parsed["link"] or not parsed["title"]:
                    continue

                blob = f"{parsed['title']} {parsed['summary']}"
                if not is_target_college(blob):
                    continue
                if not is_positive(blob):
                    continue
                if link_exists(parsed["link"]):
                    continue

                category = classify_category(blob)
                image_url = _extract_og_image(parsed["link"])
                inserted = upsert_news_item(
                    title=parsed["title"],
                    link=parsed["link"],
                    summary=parsed["summary"],
                    source=parsed["source"],
                    published=parsed["published"],
                    category=category,
                    image_url=image_url,
                )
                if inserted:
                    new_count += 1

    return new_count


def backfill_images() -> int:
    """Fetch og:image for any already-stored rows that predate the image_url column
    or whose image fetch previously failed. Returns count of rows updated."""
    updated = 0
    for item in get_items_missing_image():
        image_url = _extract_og_image(item["link"])
        if image_url:
            update_image(item["id"], image_url)
            updated += 1
    return updated
