// Lead, Recent Stories, More from this issue and Archive are all live, fed
// from one fetch of the scraped news feed (newest first) sliced into windows
// so nothing repeats. Most Read and In Brief stay static — see lib/chronicles.ts
// (Most Read is popularity-ranked, which the scrape pipeline has no signal
// for; In Brief is a hand-picked "notices" list, a different kind of content).

import type { NewsItem } from './newsApi';
import { formatNewsDate } from './newsApi';
import { LEAD as STATIC_LEAD, LEAD_BODY as STATIC_LEAD_BODY, MID_STORIES as STATIC_MID_STORIES, TIER_STORIES as STATIC_TIER_STORIES, ARCHIVE as STATIC_ARCHIVE, type Story } from './chronicles';

export const LEAD_SIZE = 1;
export const RECENT_SIZE = 3;
// The worker keeps a rolling window of 30 "current" items before rotating the
// rest into the archive (CURRENT_ISSUE_SIZE in mlrit-news-worker/src/config.ts
// — no shared package between the two deployables, so this is a manually kept
// invariant: TIER_SIZE + LEAD_SIZE + RECENT_SIZE should equal that 30). Was
// fixed at 8, which meant only 12 of the worker's 30 current items ever
// reached the page — the other 18 sat in D1, un-archived, genuinely current,
// and simply never fetched.
export const TIER_SIZE = 26;
export const ARCHIVE_SIZE = 8;
// Total items to pull from the live feed in one request: enough to fill the
// lead, the Recent Stories cards, and the More From This Issue grid, each a
// disjoint window, so no story appears twice on the page.
export const LIVE_FEED_SIZE = LEAD_SIZE + RECENT_SIZE + TIER_SIZE;

export function toStory(item: NewsItem): Story {
  return {
    section: item.category,
    title: item.title,
    dek: item.summary,
    href: item.link,
    img: item.image_url || undefined,
    meta: `${item.source} • ${formatNewsDate(item.published_at)}`,
  };
}

// The single newest scraped item — the front page's cover story. The scraped
// feed only ever gives one summary string, already shown as the dek right
// under the headline — repeating it again as a "body paragraph" reads as a
// copy-paste error, so a live lead has no body block; "Continue reading"
// points at the real article for more. Falls back to the static cover story
// (with its real multi-paragraph body) only when the feed is genuinely empty.
export function buildLeadStory(liveNews: NewsItem[]): { story: Story; body: string[] } {
  if (liveNews.length === 0) return { story: STATIC_LEAD, body: STATIC_LEAD_BODY };
  return { story: toStory(liveNews[0]), body: [] };
}

// The RECENT_SIZE items right after the lead — the freshest remaining scraped
// stories, shown as the big cards under it.
export function buildRecentStories(liveNews: NewsItem[]): Story[] {
  if (liveNews.length === 0) return STATIC_MID_STORIES;
  return liveNews.slice(LEAD_SIZE, LEAD_SIZE + RECENT_SIZE).map(toStory);
}

// liveNews already arrives newest-first (DB query is ORDER BY published_at DESC).
// Takes the window right after buildRecentStories' slice, so no section ever
// shows the same story twice.
export function buildTierStories(liveNews: NewsItem[]): Story[] {
  if (liveNews.length === 0) return STATIC_TIER_STORIES;
  return liveNews.slice(LEAD_SIZE + RECENT_SIZE, LEAD_SIZE + RECENT_SIZE + TIER_SIZE).map(toStory);
}

// The worker rolls anything older than its current-issue window into the
// archive automatically (see mlrit-news-worker's rotateArchive()) — this is
// that feed, newest-first, capped for the grid.
export function buildArchiveStories(archivedNews: NewsItem[]): Story[] {
  if (archivedNews.length === 0) return STATIC_ARCHIVE;
  return archivedNews.slice(0, ARCHIVE_SIZE).map(toStory);
}
