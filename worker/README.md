# MLRIT Chronicles — news API (Cloudflare Worker)

Thin read-only layer over Workers KV. It doesn't scrape anything — GitHub Actions
(`.github/workflows/scrape-news.yml`) runs `backend/scripts/export_snapshot.py` on
a cron and writes the `news_items` / `achievements` KV keys this Worker serves.

## One-time setup

1. `cd worker && npx wrangler login`
2. `npx wrangler kv namespace create NEWS_KV` — copy the `id` it prints into
   `wrangler.toml` (replaces `REPLACE_WITH_KV_NAMESPACE_ID`).
3. `npx wrangler deploy` — first deploy, prints the `*.workers.dev` URL.
4. In the GitHub repo settings → Secrets and variables → Actions, add:
   - `CLOUDFLARE_API_TOKEN` — a token with "Workers KV Storage: Edit" +
     "Workers Scripts: Edit" permissions (dash.cloudflare.com → My Profile →
     API Tokens → Create Token).
   - `CLOUDFLARE_ACCOUNT_ID` — dash.cloudflare.com sidebar, Workers & Pages.
   - `CLOUDFLARE_KV_NAMESPACE_ID` — the same id you put in `wrangler.toml` in step 2.
   - `NEWS_API_URL` — the `*.workers.dev` URL from step 3 (lets the scraper
     bootstrap its dedup state from what's already published instead of
     re-scraping everything each run).
5. In Vercel (frontend project) → Settings → Environment Variables, add
   `NEWS_API_URL` = the same Worker URL. Redeploy the frontend once so it
   picks it up.

After that, pushes to `worker/**` on `main` auto-deploy the Worker
(`.github/workflows/deploy-worker.yml`), and the scraper runs on its own
schedule — nothing else to babysit.
