# MLRIT CMS — Architecture & Status

Branch: `feat/cms-content-backend` · Supabase project `lkfrcvxdpfpgosogvvvg`
Last updated: 2026-08-19

A minimal CMS bolted onto the existing Next.js 14 site. Editors change homepage
copy and promo banners through `/admin`; the public site reads that content at
request time and falls back to hardcoded copy whenever anything is missing.

---

## 1. Data flow

```
                         ┌──────────────────────────┐
  editor ──login──▶      │  /admin  (middleware-gated)
                         │   ├── /admin/[page]/[section]   every section editor
                         │   │      home/hero · home/achievements
                         │   │      home/programs · home/why-mlrit
                         │   └── /admin/banners            upload + list
                         └────────────┬─────────────┘
                                      │ PUT / POST / PATCH / DELETE
                                      ▼
                         ┌──────────────────────────┐
                         │  /api/content/[page]/[section]
                         │  /api/content/upload   (media, auth-gated)
                         │  /api/banners
                         │   · auth checked per-route (getUser)
                         │   · field validation + trim
                         │   · service-role write (bypasses RLS)
                         │   · revalidatePath('/') on content save
                         └────────────┬─────────────┘
                                      ▼
        ┌───────────────── Supabase ──────────────────┐
        │  content_blocks   banners   assets          │
        │  storage bucket "assets" (public)           │
        │  RLS: anon SELECT only; no anon writes      │
        └────────────┬────────────────────────────────┘
                     │ anon read
                     ▼
        ┌──────────────────────────────┐
        │  app/page.tsx (ISR, 60s)     │
        │   getSectionCopy() ×4        │──▶ <Hero> <Achievements>
        │   assetUrl() key → /cdn/…    │    <WhyMLRIT> <Programs>
        └──────────────────────────────┘    <Banners> (client fetch)
                     │
                     ▼
        /cdn/[...path] → proxies Supabase Storage, immutable cache
```

---

## 2. Database

### `content_blocks`
| column | type | notes |
|---|---|---|
| id | uuid PK | `gen_random_uuid()` |
| page_slug | text | unique with `section_key` |
| section_key | text | |
| content | jsonb | shape defined by `CONTENT_SECTIONS` |
| version | integer | optimistic concurrency |
| created_at / updated_at | timestamptz | `updated_at` maintained by trigger |
| edited_by | text NULL | admin email, populated on write |

### `banners`
`id, title, asset_key, link_url, active, start_date, end_date, created_at, updated_at, edited_by`

### `assets`
`id, key (unique), content_type, size_bytes, width, height, created_at, updated_at`
Currently **unused** — no code writes to it.

### Storage
Bucket `assets`, public. Keys are content-addressed:
`${prefix}/${sha256(bytes).slice(0,16)}.${ext}`

### RLS
| table | anon read | anon write |
|---|---|---|
| content_blocks | all rows | none |
| assets | all rows | none |
| banners | **live rows only** — `active AND within date window` | none |

All writes go through the service-role key, which bypasses RLS. Verified: an
anon `PATCH` returns HTTP 204 but changes nothing (PostgREST reports "0 rows
matched" that way — the 204 is not a successful write).

### Migrations
```
0001_init.sql               content_blocks, assets, triggers, RLS, bucket
0002_assets_dimensions.sql  assets.width/height, banners table
0003_banners_scoped_read.sql  narrow banners read policy to live rows
0004_edited_by.sql          edited_by on content_blocks + banners
```

---

## 3. Caching model

The single largest source of bugs in this build. Three separate layers:

| Layer | Controlled by | Where it applies |
|---|---|---|
| Full Route Cache | `revalidate` / `dynamic` | `/` is ISR at 60s |
| Data Cache | `fetchCache` | supabase-js selects are GET fetches → cached |
| Router Cache | client-side | cleared by `router.refresh()` |

**`force-dynamic` does NOT bypass the Data Cache.** A page can re-render every
request and still read a cached fetch. Measured: 4 ms "query" (cached) vs 200 ms
(real). Every admin page therefore sets **both**:

```ts
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
```

**`app/page.tsx` deliberately does NOT set `fetchCache`.** Adding it flips the
route from `○ Static` to `ƒ Dynamic` (verified in build output), destroying ISR
and costing a DB round-trip per visitor. It isn't needed: fetches inside a route
with `revalidate` expire with the route. Verified — an out-of-band DB change
appeared at ~65 s with no `revalidatePath`.

Content saves call `revalidatePath('/')` so edits are live immediately rather
than after the 60 s window. Verified: new text served 39 s after save.

---

## 3b. Live preview

`/admin/[page]/[section]` renders the real homepage in an iframe beside the
form and pushes drafts over `postMessage`. **Nothing is written until Save** —
overrides live in the iframe's React state.

- `lib/preview/context.tsx` — `PreviewProvider`, `usePreviewOverride`,
  `useMergedSection`, `sectionDomId`
- Hero / Achievements / WhyMLRIT / Programs merge an override over their props;
  existing fallback logic is untouched
- Preview mode is detected **client-side** from `?__preview=1`. Reading
  `searchParams` server-side would make `/` dynamic and lose its ISR — verified
  in the build output (`○ Static` → `ƒ Dynamic`)
- Achievements and Programs carry a wrapper div so their `#achievements` /
  `#programs` anchors survive
- CSP needs `frame-src 'self'` (same-origin iframe) and `media-src … blob:`

**Media fields.** A field may declare `type: 'image' | 'video'`. The editor
uploads on select via `/api/content/upload` and stores the returned
content-addressed key. Media fields are optional on save — empty means "use the
component's bundled asset".

**Transient values never persist.** A `blob:`/`data:` URL is scoped to one
document; persisted, it is a permanently broken element for every visitor.
Four layers prevent it: Save disabled mid-upload, failed uploads restore the
prior value, `findTransientMediaError` rejects with 400 server-side, and
`resolveAssetUrl` requires an explicit `allowTransient` opt-in. See the
incident note in commit `f51c1b1`.

## 4. Auth

- `middleware.ts` gates `/admin/:path*`, excluding `/admin/login`. Fails closed
  if env vars are missing.
- Every API route repeats the check independently — routes are reachable without
  passing through middleware.
- Uses **`getUser()`, never `getSession()`**: `getSession` only decodes the
  cookie's claims; `getUser` revalidates against the auth server.
- Sessions live in **cookies** via `@supabase/ssr` (`createBrowserClient`).
  `lib/supabase.ts`'s plain client uses localStorage and is invisible to
  middleware — do not use it for auth.

---

## 5. File map

| Path | Role |
|---|---|
| `lib/supabase.ts` | anon client + lazy service-role client |
| `lib/content/client.ts` | `getSection` / `saveSection` (optimistic concurrency) |
| `lib/content/sections.ts` | `CONTENT_SECTIONS` config — single source of truth |
| `lib/cdn/client.ts` | `getAssetUrl`, `uploadAsset` (content hashing) |
| `middleware.ts` | `/admin` gate |
| `app/admin/page.tsx` | dashboard: previews, timestamps, editors, banner counts |
| `app/admin/ContentEditor.tsx` | generic editor (text/multiline/image/video) |
| `app/admin/[page]/[section]/page.tsx` | dynamic editor route |
| `app/admin/banners/*` | upload form + list with toggle/delete |
| `app/api/content/[page]/[section]/route.ts` | PUT: validate, trim, save, revalidate |
| `app/api/content/upload/route.ts` | POST: authenticated media upload |
| `app/api/banners/route.ts` | GET (public) / POST / PATCH / DELETE |
| `app/cdn/[...path]/route.ts` | Storage proxy, `immutable` cache |
| `components/sections/Banners.tsx` | public banner strip (client fetch) |

Adding a section = one entry in `CONTENT_SECTIONS` + props on the component.
The editor route, dashboard row, and write-API validation all derive from it.

---

## 6. Status

### Verified working (tested against live infrastructure)
- Schema, triggers, RLS on all three tables — including all four branches of the
  banner date/active policy, tested with throwaway rows
- Login → cookie session → middleware gate (unauth `/admin/*` → 307, no content leak)
- API auth: unauthenticated PUT/POST/PATCH/DELETE → 401
- Hero content save, version increment, blank-field rejection
- Whitespace trimming (confirmed: `"Engineering "` → `"Engineering"` on save)
- `revalidatePath('/')` instant cache bust
- Banner upload → content-hash key → Storage → row; **dedup proven** (two rows,
  identical bytes, one object)
- `/cdn/<key>` serves correct bytes, type, and size; 404s for missing keys
- Banner toggle + delete through the UI; RLS hides inactive rows from the public
- `edited_by` populated on banner toggle (`mlritwebsite@gmail.com` recorded)
- Homepage renders CMS copy for hero / achievements / programmes / why-mlrit
- Media upload end to end: file → `/api/content/upload` → content-addressed key
  → `content_blocks` → `/cdn` → public `<video>` (verified against a real
  upload: `home-why-mlrit/5ba4c5a1af40d9ec.mp4`, 200, 2,108,689 B)
- Server-side `blob:`/`data:` rejection — 8 unit tests, `npm test`
- Live preview builds and serves; `/` and `/?__preview=1` return byte-identical
  HTML and `/` remains `○ Static`
- **All four homepage sections — Hero, Achievements, Programs, WhyMLRIT — now
  share one editor.** There is no per-section editor code left: each resolves
  through `/admin/[page]/[section]` → `ContentEditor`, and each therefore gets
  the live preview, the full-screen toggle, the per-section subscription that
  stopped every keystroke re-rendering all four, and the 1:1 preview scrolling.
  Adding a section is still just a `CONTENT_SECTIONS` entry plus props on the
  component.

### Built but NOT yet verified
- 409 conflict path (two-tab concurrent save) — never exercised
- The three *visual* preview behaviours: instant playback from the iframe's
  blob URL, the "Waiting for upload…" Save state, and a swap with no black
  frame. These leave no trace in the DB, so they need a human eye.
- Dashboard render — previews, relative timestamps, banner counts
- Upload validation rejects: non-image, oversized, `javascript:` link
- Sign-out

---

## 7. Tasks left

### Blocking release
1. ~~Finish the merge.~~ Done — merge commit `586e59f`, 0 behind `origin/main`.
2. **Push.** All five CMS commits are local only — `Abhiram-pro` has no write
   access to `pranaya1106/mlrit-final` (403). Needs collaborator access, a fork
   + PR, or a different remote.
3. **`SUPABASE_SERVICE_ROLE_KEY` on Vercel.** Absent today. Reads work without
   it; every write 500s. Must never be a `NEXT_PUBLIC_` var.

### Known issues
4. **CSP hardcodes the project ref.** `next.config.js` names
   `lkfrcvxdpfpgosogvvvg.supabase.co` literally in `connect-src`. Switching
   Supabase projects silently breaks auth.
5. **Commit `6dec013` is mislabelled** — contains the banner UI and generic
   editor, but its message describes only `edited_by` + dashboard. Amend or
   split while still unpushed.
6. **No orphan cleanup for Storage.** Deleting a banner leaves its object. Safe
   (content-addressed keys can be shared), but unbounded. Needs a sweep that
   checks for remaining references before deleting.
7. **`assets` table is dead.** Nothing writes to it, so `width`/`height` are
   never populated — which is why `Banners.tsx` uses `<img>` rather than
   `next/image`.
8. **`Hero.tsx` on main has dead code** — `StudentReelSlider` import and
   `HERO_REELS` remain after the component was removed in `1525ab6`. Pre-existing
   on main, not introduced here.

### Nice to have
9. ~~Migrate `/admin/home/hero` onto `ContentEditor` and delete
   `HeroEditor.tsx`.~~ Done — the static route was removed so the URL now falls
   through to `/admin/[page]/[section]`; the path is unchanged for editors.
10. Banner edit (currently create/toggle/delete only — no way to change a title).
11. `next/image` for banners once `assets.width/height` are populated.
12. Video cap is 25 MB; two existing site videos are ~29 MB. Raise if those ever
    become CMS-managed.
13. Section-aware `revalidatePath` — currently always `/`, wrong once non-home
    pages become editable.
14. Asset preloading on media swap: `preload="metadata"` means `load()`
    discards the buffer and refetches, so a large file can blank briefly when
    the preview swaps blob → uploaded key. Deferred deliberately.
15. Tighten the transient-URL guard to *all* fields, not just configured media
    fields — an unconfigured section currently has no media fields known, so a
    `blob:` value there would still persist. Not reachable today.
