// Client for the FastAPI news-scraper service (see /backend).
// Fails soft — the Chronicles page renders fine even if the API is offline.

const NEWS_API_BASE = process.env.NEWS_API_URL || 'http://localhost:8000';

export type NewsItem = {
  id: number;
  title: string;
  link: string;
  summary: string;
  source: string;
  category: string;
  image_url: string | null;
  published_at: string;
};

async function safeFetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${NEWS_API_BASE}${path}`, { cache: 'no-store' });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getLiveNews(limit = 12): Promise<NewsItem[]> {
  const data = await safeFetchJson<{ items: NewsItem[] }>(`/api/news?limit=${limit}`, { items: [] });
  return data.items ?? [];
}

export async function getAchievements(): Promise<Record<string, NewsItem[]>> {
  const data = await safeFetchJson<{ categories: Record<string, NewsItem[]> }>('/api/achievements', { categories: {} });
  return data.categories ?? {};
}

export function formatNewsDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}
