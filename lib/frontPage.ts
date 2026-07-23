// "More from this issue" is the one live section on the front page — a stack of
// the newest scraped news, capped to TIER_SIZE. Everything else on the page
// (Lead, Mid stories, Most Read, In Brief, Archive, Photo essay) stays static —
// see lib/chronicles.ts.

import type { NewsItem } from './newsApi';
import { formatNewsDate } from './newsApi';
import { TIER_STORIES as STATIC_TIER_STORIES, type Story } from './chronicles';

export const TIER_SIZE = 8;

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

// liveNews already arrives newest-first (DB query is ORDER BY published_at DESC),
// so taking the head of the list is the "stack" — each new scrape pushes older
// items past the TIER_SIZE cutoff without any extra bookkeeping here.
export function buildTierStories(liveNews: NewsItem[]): Story[] {
  if (liveNews.length === 0) return STATIC_TIER_STORIES;
  return liveNews.slice(0, TIER_SIZE).map(toStory);
}
