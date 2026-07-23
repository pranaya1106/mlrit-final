// Thin read-only API in front of Workers KV. It has no scraping logic of its own —
// GitHub Actions (backend/scripts/export_snapshot.py) does the actual scraping on
// a cron and writes the two keys this reads (news_items, achievements). Mirrors
// the shape backend/app/main.py used to serve so the Next.js frontend
// (lib/newsApi.ts) needs zero code changes — only NEWS_API_URL has to point here.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/health') {
      return json({ status: 'ok' });
    }

    if (url.pathname === '/api/news') {
      const limit = Number(url.searchParams.get('limit') || '30');
      const raw = await env.NEWS_KV.get('news_items');
      const items = raw ? JSON.parse(raw).items ?? [] : [];
      return json({ items: items.slice(0, limit) });
    }

    if (url.pathname === '/api/achievements') {
      const raw = await env.NEWS_KV.get('achievements');
      const categories = raw ? JSON.parse(raw).categories ?? {} : {};
      return json({ categories });
    }

    return json({ error: 'not found' }, 404);
  },
};
