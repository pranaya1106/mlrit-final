import Link from 'next/link';

import { getSection } from '@/lib/content/client';
import { CONTENT_SECTIONS } from '@/lib/content/sections';
import { getServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Same Data Cache reasoning as the editor pages: supabase-js selects are GET
// fetches that Next caches, so a re-render would show stale previews and
// timestamps even though the route itself re-ran.
export const fetchCache = 'force-no-store';

const PREVIEW_LENGTH = 80;

type SectionSummary = {
  key: string;
  label: string;
  preview: string;
  updatedAt: string | null;
  editedBy: string | null;
};

/** "2 hours ago" / "just now". Null timestamps render as an em dash upstream. */
function relativeTime(iso: string | null): string | null {
  if (!iso) return null;

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (seconds >= size) return formatter.format(-Math.floor(seconds / size), unit);
  }
  return 'just now';
}

const truncate = (text: string): string =>
  text.length > PREVIEW_LENGTH ? `${text.slice(0, PREVIEW_LENGTH).trimEnd()}…` : text;

/**
 * One row per configured section. A failed lookup degrades to an empty preview
 * rather than taking the whole dashboard down — the link still works.
 */
async function loadSections(): Promise<SectionSummary[]> {
  const entries = Object.entries(CONTENT_SECTIONS);

  return Promise.all(
    entries.map(async ([key, config]) => {
      const [page, section] = key.split('/');
      const base = { key, label: config.label };

      try {
        const row = await getSection(page, section);
        const firstField = config.fields[0]?.name;
        const value = firstField ? row?.content?.[firstField] : undefined;

        return {
          ...base,
          preview: typeof value === 'string' ? truncate(value.trim()) : '',
          updatedAt: row?.updatedAt ?? null,
          editedBy: row?.editedBy ?? null,
        };
      } catch (err) {
        console.error(`[admin] failed to load ${key}:`, err);
        return { ...base, preview: '', updatedAt: null, editedBy: null };
      }
    })
  );
}

type BannerCounts = { live: number; scheduled: number; draft: number; expired: number };

/**
 * Banner counts. Service-role so drafts and expired rows are visible — the anon
 * policy deliberately hides exactly the rows an editor most needs to see.
 *
 * The four buckets partition the table, so every row is accounted for. `expired`
 * exists because an active banner whose end_date has passed is none of the other
 * three, and silently dropping it would make the totals lie.
 */
async function loadBannerCounts(): Promise<BannerCounts | null> {
  try {
    const { data, error } = await getServiceClient()
      .from('banners')
      .select('active, start_date, end_date');

    if (error) throw error;

    const now = Date.now();
    const counts: BannerCounts = { live: 0, scheduled: 0, draft: 0, expired: 0 };

    for (const row of data ?? []) {
      // An editor switching a banner off outranks any date maths — that is a
      // deliberate act, not a queue state.
      if (!row.active) {
        counts.draft += 1;
        continue;
      }

      const started = !row.start_date || new Date(row.start_date).getTime() <= now;
      const notEnded = !row.end_date || new Date(row.end_date).getTime() >= now;

      // "Live" mirrors the banners_public_read policy exactly.
      if (started && notEnded) counts.live += 1;
      else if (!started) counts.scheduled += 1;
      else counts.expired += 1;
    }

    return counts;
  } catch (err) {
    console.error('[admin] failed to count banners:', err);
    return null;
  }
}

/** "2 live, 1 draft" — zero buckets are dropped so the common case stays quiet. */
function formatBannerCounts(counts: BannerCounts): string {
  const parts = (['live', 'scheduled', 'draft', 'expired'] as const)
    .filter((bucket) => counts[bucket] > 0)
    .map((bucket) => `${counts[bucket]} ${bucket}`);

  return parts.length > 0 ? parts.join(', ') : 'none yet';
}

const rowClass =
  'flex items-baseline justify-between gap-6 py-3.5 transition-colors hover:text-primary';
const metaClass = 'font-mono text-[0.7rem] uppercase tracking-wider text-subtle';

export default async function AdminDashboardPage() {
  const [sections, bannerCounts] = await Promise.all([loadSections(), loadBannerCounts()]);

  // Grouped by the page slug ahead of the slash, so a future "about/…" or
  // "placements/…" section gets its own group with no code change here.
  const groups = new Map<string, SectionSummary[]>();
  for (const section of sections) {
    const page = section.key.split('/')[0];
    groups.set(page, [...(groups.get(page) ?? []), section]);
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-12">
      <div className="mx-auto w-full max-w-[720px]">
        <header>
          <p className={metaClass}>MLRIT CMS</p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-0">Control room</h1>
        </header>

        {[...groups.entries()].map(([page, rows]) => (
          <section key={page} className="mt-10">
            <h2 className={metaClass}>
              {page} · {rows.length} {rows.length === 1 ? 'section' : 'sections'}
            </h2>

            <ul className="mt-3 divide-y divide-neutral-800 rounded-lg bg-ink-2 px-4">
              {rows.map((row) => {
                const edited = relativeTime(row.updatedAt);

                return (
                  <li key={row.key}>
                    <Link href={`/admin/${row.key}`} className={`${rowClass} text-neutral-0`}>
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{row.label}</span>
                        <span className="mt-0.5 block truncate text-xs text-subtle">
                          {row.preview || 'No content yet'}
                        </span>
                      </span>
                      <span className={`${metaClass} shrink-0 text-right`}>
                        <span className="block">{edited ?? '—'}</span>
                        <span className="mt-0.5 block normal-case tracking-normal">
                          {row.editedBy ?? '—'}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="mt-10">
          <h2 className={metaClass}>Media</h2>
          <ul className="mt-3 divide-y divide-neutral-800 rounded-lg bg-ink-2 px-4">
            <li>
              <Link href="/admin/banners" className={`${rowClass} text-neutral-0`}>
                <span className="min-w-0">
                  <span className="block truncate text-sm">Banners</span>
                  <span className="mt-0.5 block truncate text-xs text-subtle">
                    Upload, schedule and retire promotional slots
                  </span>
                </span>
                <span className={`${metaClass} shrink-0 text-right`}>
                  {bannerCounts ? formatBannerCounts(bannerCounts) : 'unavailable'}
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
