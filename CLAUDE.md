# MLRIT site — working notes

Next.js 14 (App Router) + Supabase CMS. Architecture and status:
`docs/CMS_ARCHITECTURE.md`.

## Never touch `.next` while a server is running

**Check the port before starting anything:**

```bash
lsof -ti:3000            # must be empty before `npm run dev` or `npm run start`
```

**Both `next dev` and `next build` rewrite `.next`.** A running `next start`
holds its manifests in memory and keeps serving hashed filenames from the build
it started with. Replace those files underneath it and every asset 404/500s.

Two ways to cause it, equally destructive:

- `next dev` while `next start` holds :3000 — dev compiles into `.next` *before*
  binding, so it wipes the prod build, then exits with `EADDRINUSE`.
- **`next build` while `next start` is running** — no port conflict, no error,
  no warning. The build succeeds and silently breaks the live server. This one
  has bitten this project too; it looks completely safe at the command line.

**Safe sequence — stop the server first, always:**

```bash
pkill -f "next-server"; pkill -f "next start"
lsof -ti:3000 | xargs kill -9 2>/dev/null    # confirm it is really gone
npm run build                                 # only with nothing running
npm run start
```

Verify the ordering afterward — BUILD_ID must predate the server:

```bash
stat -f "BUILD_ID %Sm" -t "%H:%M:%S" .next/BUILD_ID
ps -p $(pgrep -f next-server) -o lstart=
```

Symptom: the HTML document returns **200**, but every CSS/JS bundle returns
**500**, and the browser logs a wall of
`Refused to apply style … MIME type ('text/html')`. The page loads unstyled and
unhydrated. It looks like a CSP or application bug; it is neither.

This has bitten this project twice. Diagnose with:

```bash
test -f .next/BUILD_ID && echo prod || echo "dev build (or wiped)"
ls .next/static/development 2>/dev/null && echo "dev artifacts present"
```

Recovery: kill every Next process, `npm run build`, then `npm run start`.

**Use separate ports so they cannot collide:**

```bash
npm run dev                  # :3000 — day-to-day work
npm run build && npx next start -p 3001   # :3001 — prod smoke tests
```

Anything that must be checked against a production build (ISR, `○ Static` vs
`ƒ Dynamic`, the Data Cache) belongs on :3001.

## Caching gotcha

`export const dynamic = 'force-dynamic'` does **not** bypass Next's Data Cache.
supabase-js issues selects as GET fetches, which Next caches, so a page can
re-render every request and still serve stale rows. Admin pages therefore set
both `dynamic` and `fetchCache = 'force-no-store'`.

Do **not** add `fetchCache` to `app/page.tsx` — it flips `/` from `○ Static` to
`ƒ Dynamic` and kills ISR. Fetches inside a route with `revalidate` already
expire with the route.
