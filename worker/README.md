# MLRIT Chronicles — news API (Cloudflare Worker)

Thin read-only layer over Workers KV. It doesn't scrape anything — GitHub Actions
(`.github/workflows/scrape-news.yml`) runs `backend/scripts/export_snapshot.py` on
a cron and writes the `news_items` / `achievements` KV keys this Worker serves.

## Status

Done (2026-07-23): KV namespace created, Worker deployed with the real code +
KV binding, seeded with an initial scrape (62 items). Live at
https://mlrit-chronicles-api.lingamaditya3669.workers.dev — confirmed serving
real data via `/api/news` and `/api/achievements`.

GitHub Actions secrets `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_KV_NAMESPACE_ID`,
`NEWS_API_URL` are set. **Only `CLOUDFLARE_API_TOKEN` is still missing** — the
dashboard's "Create Token" button wouldn't open under browser automation
(client-side modal that didn't respond to simulated clicks), so this one step
needs a human:

1. dash.cloudflare.com → My Profile → API Tokens → Create Token → custom token
   with **Workers KV Storage: Edit** + **Workers Scripts: Edit** permissions,
   scoped to account `b35bb5b89c3e4b787ee81256cf6c6f99`.
2. `gh secret set CLOUDFLARE_API_TOKEN` (paste the token), or add it via the
   GitHub repo's Settings → Secrets and variables → Actions.

Once that's set, `.github/workflows/scrape-news.yml` (cron, twice daily) and
`.github/workflows/deploy-worker.yml` (on push to `worker/**`) both work
end-to-end with no further setup.

Also still needed: in Vercel (frontend project) → Settings → Environment
Variables, add `NEWS_API_URL` = `https://mlrit-chronicles-api.lingamaditya3669.workers.dev`,
then redeploy the frontend once so it picks it up.

## Reference — how this was set up

1. `cd worker && npx wrangler login`
2. `npx wrangler kv namespace create NEWS_KV` — copy the `id` it prints into
   `wrangler.toml` (replaces `REPLACE_WITH_KV_NAMESPACE_ID`).
3. `npx wrangler deploy` — first deploy, prints the `*.workers.dev` URL.
4. In the GitHub repo settings → Secrets and variables → Actions, add
   `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_KV_NAMESPACE_ID`,
   `NEWS_API_URL`.
5. In Vercel (frontend project) → Settings → Environment Variables, add
   `NEWS_API_URL` = the same Worker URL. Redeploy the frontend once so it
   picks it up.
