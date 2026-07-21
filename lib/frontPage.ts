// Partitions live scraped news into the Chronicles front-page slots (Lead, Mid,
// Most Read, In Brief, Tier grid, Archive, Photo Essay). Falls back to the static
// lib/chronicles.ts content when the news API returns nothing (cold start / API down).

import type { NewsItem } from './newsApi';
import { formatNewsDate } from './newsApi';
import {
  LEAD as STATIC_LEAD,
  LEAD_BODY as STATIC_LEAD_BODY,
  MID_STORIES as STATIC_MID_STORIES,
  MOST_READ as STATIC_MOST_READ,
  IN_BRIEF as STATIC_IN_BRIEF,
  TIER_STORIES as STATIC_TIER_STORIES,
  ARCHIVE as STATIC_ARCHIVE,
  PHOTO_ESSAY as STATIC_PHOTO_ESSAY,
  type Story,
} from './chronicles';

const ARCHIVE_CUTOFF_DAYS = 300;

function toStory(item: NewsItem): Story {
  return {
    section: item.category,
    title: item.title,
    dek: item.summary,
    href: item.link,
    img: item.image_url || undefined,
    meta: `${item.source} • ${formatNewsDate(item.published_at)}`,
  };
}

function isOlderThan(item: NewsItem, days: number): boolean {
  const ageMs = Date.now() - new Date(item.published_at).getTime();
  return ageMs > days * 24 * 60 * 60 * 1000;
}

type PhotoEssayItem = { tag: string; title: string; href: string; img: string };

export type FrontPageData = {
  lead: Story;
  leadBody: string[];
  midStories: Story[];
  mostRead: Story[];
  inBrief: { date: string; body: string }[];
  tierStories: Story[];
  archive: Story[];
  photoEssay: PhotoEssayItem[];
};

export function buildFrontPage(liveNews: NewsItem[]): FrontPageData {
  if (liveNews.length === 0) {
    return {
      lead: STATIC_LEAD,
      leadBody: STATIC_LEAD_BODY,
      midStories: STATIC_MID_STORIES,
      mostRead: STATIC_MOST_READ,
      inBrief: STATIC_IN_BRIEF,
      tierStories: STATIC_TIER_STORIES,
      archive: STATIC_ARCHIVE,
      photoEssay: STATIC_PHOTO_ESSAY,
    };
  }

  // Lead/Mid/Most Read/In Brief sit together on screen — items are mutually
  // exclusive there so nothing visibly repeats in one glance.
  const used = new Set<string>();
  const take = (pred: (item: NewsItem) => boolean, count: number): NewsItem[] => {
    const picked: NewsItem[] = [];
    for (const item of liveNews) {
      if (picked.length >= count) break;
      if (used.has(item.link) || !pred(item)) continue;
      picked.push(item);
      used.add(item.link);
    }
    return picked;
  };

  const hasImage = (item: NewsItem) => Boolean(item.image_url);
  const any = () => true;

  const imageLeadCandidate = take(hasImage, 1);
  const [leadItem] = imageLeadCandidate.length ? imageLeadCandidate : take(any, 1);
  const lead = leadItem ? toStory(leadItem) : STATIC_LEAD;
  const leadBody = leadItem ? [leadItem.summary] : STATIC_LEAD_BODY;

  const midStories = take(any, 3).map(toStory);
  const mostRead = take(any, 5).map(toStory);
  const inBrief = take(any, 6).map((item) => ({
    date: formatNewsDate(item.published_at).toUpperCase(),
    body: `${item.category} — ${item.title}`,
  }));

  // Tier grid / Archive / Photo Essay live further down the page, in their own
  // sections — real newspapers reuse the same story across widgets like this
  // all the time. They draw from the FULL live pool (only excluding the exact
  // Lead item) so they stay populated with live content even when the total
  // scraped count is small, instead of running dry and falling back to static.
  const fullPoolExcludingLead = liveNews.filter((item) => item.link !== leadItem?.link);

  const tierStories = fullPoolExcludingLead.slice(0, 4).map(toStory);
  const archive = fullPoolExcludingLead.filter((item) => isOlderThan(item, ARCHIVE_CUTOFF_DAYS)).slice(0, 8).map(toStory);
  const photoEssay: PhotoEssayItem[] = fullPoolExcludingLead
    .filter(hasImage)
    .slice(0, 3)
    .map((item) => ({
      tag: `${formatNewsDate(item.published_at)} · ${item.category}`,
      title: item.title,
      href: item.link,
      img: item.image_url as string,
    }));

  return {
    lead,
    leadBody,
    midStories: midStories.length ? midStories : STATIC_MID_STORIES.slice(0, Math.max(0, 3 - midStories.length)),
    mostRead: mostRead.length ? mostRead : STATIC_MOST_READ,
    inBrief: inBrief.length ? inBrief : STATIC_IN_BRIEF,
    tierStories: tierStories.length ? tierStories : STATIC_TIER_STORIES,
    archive: archive.length ? archive : STATIC_ARCHIVE,
    photoEssay: photoEssay.length ? photoEssay : STATIC_PHOTO_ESSAY,
  };
}
