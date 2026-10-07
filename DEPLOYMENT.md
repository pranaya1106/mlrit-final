# Deploying mlrit-final to EC2

The site is a Next.js app whose content comes from Payload, and Payload stores
everything in Postgres. That means **the database is a build-time dependency,
not just a runtime one** — the single most important thing on this page, and
the first section below explains why.

Target assumed here: one EC2 instance running `next start` behind nginx.

---

## 1. The failure mode to avoid

Every CMS-driven page reads its section like this:

```ts
const row = await getSection('about', 'overview').catch(() => null);
```

The `.catch` is deliberate — a section nobody has saved yet falls back to the
copy bundled in the component, so the page still renders. But it cannot tell
"nobody saved this" apart from "the database was unreachable".

So if `DATABASE_URI` is missing or wrong **when you run `npm run build`**:

- the build succeeds,
- all 103 routes render,
- every page shows its hardcoded fallback text,
- nothing is logged.

You get a site that looks finished and silently ignores the CMS. Set the
environment before building, and check a known edited value after deploying
(§7).

---

## 2. What you are deploying

| | |
|---|---|
| Next.js | 15.4.11 (App Router, ESM — `"type": "module"`) |
| React | 19.3.0 |
| Payload | 3.90.2 (`@payloadcms/db-postgres`, `sharp` for image resizing) |
| Routes | 103 — 97 static with ISR, 6 dynamic |
| Shared JS | 101 kB first load |
| `.next` after build | ~800 MB |
| `public/` | ~1.3 GB of images and video, committed to the repo |

Routes are grouped, which does **not** affect URLs:

- `app/(frontend)/` — the public site
- `app/(payload)/` — Payload's admin at `/admin` and its REST/GraphQL API at `/api`

Pages revalidate every 60 s (`export const revalidate = 60`), and publishing in
Payload triggers an immediate `revalidatePath`, so an edit does not wait out the
window.

---

## 3. Payload

- **Admin:** `/admin` · **API:** `/api`
- **74 globals**, one per entry in `lib/content/sections.ts`. The schema is
  generated from that file — never hand-written — so adding a section is one
  edit there plus a migration.
- **Users:** role is `owner` or `editor`; editors are limited to a named list of
  sections. The first account ever created is forced to `owner`, otherwise
  nobody could grant that role.
- **Drafts and versions** are on, capped at 20 versions per global.
- **Media** uploads to `public/uploads` on local disk unless `S3_BUCKET` is set
  (§6).

### Database layout

Payload owns a dedicated `payload` schema — **240 tables** — beside the
`public` schema. `public.content_blocks` still holds the 7 rows from the
previous CMS. Nothing reads it; it is the rollback path, so leave it alone.

Schema changes go through migrations only. `push` is disabled in
`payload.config.ts`: with it on, `next dev` quietly syncs the schema and writes
a `dev` marker that makes `payload migrate` refuse to run.

Two migrations exist:

```
migrations/20261006_083430_initial.ts        # 240 tables + the payload schema
migrations/20261006_084423_gallery_columns.ts
```

---

## 4. Environment

Create `.env.local` in the project root **before building**. It is gitignored,
so it will not arrive with the clone.

```bash
# Postgres. Currently Supabase's database (session pooler, ap-northeast-1).
# Payload speaks plain Postgres — moving to RDS is a change to this line alone.
DATABASE_URI=postgresql://USER:PASSWORD@HOST:5432/postgres

# Signs the admin session JWTs. Carry the EXISTING value across, or every
# logged-in session is invalidated and everyone has to sign in again.
PAYLOAD_SECRET=

# Supabase Storage, used by the /cdn route for existing media. Unrelated to the CMS.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional, see §6
S3_BUCKET=
AWS_REGION=ap-northeast-1
```

If the password contains `@`, `/`, `:`, `#` or `?` it must be percent-encoded,
or the URI parses wrong and you get an unhelpful auth error.

> The database is in **ap-northeast-1 (Tokyo)**. Put the instance in the same
> region, or every cold render pays a cross-region round trip. ISR hides most of
> it, but not the first hit on each page.

---

## 5. Instance setup

Node 24 is what this was built and tested on. Pin it — a Next 15 / React 19
build against an older Node fails in ways that read like unrelated type errors.

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# The repo is large (~1.3 GB of assets); skip the history.
git clone --depth 1 https://github.com/pranaya1106/mlrit-final.git
cd mlrit-final

# Write .env.local now — see §4. Before the build, not after.
npm ci
npm run build          # needs the database reachable
```

`npm run build` is memory-hungry. On a t3.small or smaller, add swap first or
it will be OOM-killed partway through prerendering:

```bash
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
```

### Migrations

Only if you point at a **new** database. The existing one already has all 240
tables, so an instance pointed at it needs nothing:

```bash
npx payload migrate
npx payload run scripts/payload-migrate.ts   # copies content_blocks across, then verifies
```

That second script reads every row back and compares it to the source, so a
silent truncation fails the run instead of reporting success.

### systemd

```ini
# /etc/systemd/system/mlrit.service
[Unit]
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/mlrit-final
ExecStart=/usr/bin/npm run start
Environment=NODE_ENV=production
Restart=always
User=ubuntu

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now mlrit
```

### nginx

The forwarded headers are not optional. Without them Payload sees the origin as
`http://localhost:3000`, so live preview loads the wrong host and redirects can
drop you back to plain http.

```nginx
server {
  server_name YOUR_DOMAIN;

  # Several videos are tens of MB, and admin uploads go through this too.
  client_max_body_size 100M;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        'upgrade';
    proxy_set_header Host              $host;
    proxy_set_header X-Forwarded-Host  $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Then TLS — the admin sends session cookies, so this is not optional either:

```bash
sudo certbot --nginx -d YOUR_DOMAIN
```

---

## 6. Media

Uploads currently land in `public/uploads` on the instance disk. That survives a
restart but **not** an instance replacement, and a second instance behind a load
balancer never sees the first one's files.

Setting `S3_BUCKET` switches Payload to S3 with no code change. Credentials come
from the default AWS provider chain, so an instance role is enough and no
long-lived key has to exist on the host.

The 9 media values already in the CMS are plain URLs — `/legacy/...` paths and
external links — so they are unaffected either way.

---

## 7. Verifying a deploy

Do not stop at "the site loads". It loads fine with no database (§1).

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://YOUR_DOMAIN/          # 200
curl -s -o /dev/null -w '%{http_code}\n' https://YOUR_DOMAIN/admin     # 307 -> /admin/login
curl -sL https://YOUR_DOMAIN/admin/login | grep -o '<title>[^<]*</title>'
```

The one that actually proves the CMS is wired: edit a heading in `/admin`,
publish, and reload the page it belongs to. If the old text persists past a few
seconds, the site built without a database and is serving fallbacks.

Checklist:

- [ ] `.env.local` written **before** `npm run build`
- [ ] `PAYLOAD_SECRET` is the existing value, not a new one
- [ ] nginx forwards `Host` / `X-Forwarded-Proto`
- [ ] TLS issued, `/admin` reachable over https
- [ ] An edit made in `/admin` appears on the public page
- [ ] `public.content_blocks` untouched — the rollback path

---

## 8. Rollback

The previous CMS is still intact: `public.content_blocks` has all 7 rows with
their original version numbers, and nothing has written to it since the
migration. Reverting the commit that switched `getSection()` to Payload puts the
old editor back, reading exactly the data it last saw.

## 9. Known gaps

- Media is URL text fields, not an upload picker. Uploading works; browsing
  uploads from a section field does not yet.
- 11 hardcoded strings remain on the live site, in nested components that
  `copy()` cannot reach without restructuring.
- `next-env.d.ts` is tracked but regenerated by every build, so it shows up dirty
  and blocks `git pull`. Worth gitignoring.
- `public/` is ~1.3 GB in git. Moving it to S3/CloudFront would cut clone and
  build time substantially.
