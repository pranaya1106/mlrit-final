import Link from 'next/link';

import { getSection } from '@/lib/content/client';
import {
  asGalleryItems,
  asRepeaterItems,
  CONTENT_SECTIONS,
  fieldType,
  isListField,
  isRepeaterField,
} from '@/lib/content/sections';
import { canEditSection, getAdminUser, isOwner, type AdminUser } from '@/lib/content/permissions';
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
  /** False when no row exists — the section still renders its bundled copy. */
  saved: boolean;
  updatedAt: string | null;
  editedBy: string | null;
};

/**
 * One line describing what a section actually holds.
 *
 * The old version printed the first field verbatim, which gave "Engineering,"
 * for a split headline and nothing at all for a section whose first field is a
 * list — so every counter and gallery section read "No content yet" while
 * holding rows. This summarises text and counts lists instead.
 */
function snapshot(config: { fields: readonly { name: string; label: string }[] }, content: Record<string, unknown>): string {
  const parts: string[] = [];

  for (const field of config.fields) {
    const value = content[field.name];

    if (isListField(field)) {
      const items = isRepeaterField(field)
        ? asRepeaterItems(value)
        : asGalleryItems(value);
      if (items.length > 0) {
        parts.push(`${items.length} ${field.label.toLowerCase()}`);
      }
      continue;
    }

    if (fieldType(field) === 'image' || fieldType(field) === 'video') continue;
    if (typeof value === 'string' && value.trim()) parts.push(value.trim());
  }

  return truncate(parts.join(' · '));
}

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
async function loadSections(admin: AdminUser | null): Promise<SectionSummary[]> {
  // An editor sees only what they can change. The write route enforces the
  // same rule, so this is about not offering a door that will not open.
  const entries = Object.entries(CONTENT_SECTIONS).filter(([key]) => {
    const [page, section] = key.split('/');
    return canEditSection(admin, page, section);
  });

  return Promise.all(
    entries.map(async ([key, config]) => {
      const [page, section] = key.split('/');
      const base = { key, label: config.label };

      try {
        const row = await getSection(page, section);
        const content = (row?.content ?? {}) as Record<string, unknown>;

        return {
          ...base,
          preview: row ? snapshot(config, content) : '',
          saved: Boolean(row),
          updatedAt: row?.updatedAt ?? null,
          editedBy: row?.editedBy ?? null,
        };
      } catch (err) {
        console.error(`[admin] failed to load ${key}:`, err);
        return { ...base, preview: '', saved: false, updatedAt: null, editedBy: null };
      }
    })
  );
}

/**
 * Rows in content_blocks with no matching entry in CONTENT_SECTIONS.
 *
 * A section removed from the config leaves its row behind — invisible to this
 * dashboard, since it iterates the config, but still occupying the key. That
 * happened with the gallery sandbox and went unnoticed for weeks. Surfacing
 * them turns a silent orphan into a visible one.
 *
 * Service client: this is about rows the config does not know, so it must not
 * be filtered by what the config knows.
 */
async function loadOrphans(): Promise<string[]> {
  try {
    const { data, error } = await getServiceClient()
      .from('content_blocks')
      .select('page_slug, section_key');

    if (error) throw error;

    return (data ?? [])
      .map((r) => `${r.page_slug}/${r.section_key}`)
      .filter((key) => !Object.prototype.hasOwnProperty.call(CONTENT_SECTIONS, key))
      .sort();
  } catch (err) {
    console.error('[admin] failed to check for orphaned rows:', err);
    return [];
  }
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

/**
 * Readable names for the page slug each section is keyed under, and the order
 * the groups appear in. Anything unlisted sorts last, alphabetically, under
 * its raw slug — so a new area shows up without a code change here, just
 * without a pretty name until someone adds one.
 */
const GROUPS: { slug: string; label: string }[] = [
  { slug: 'home', label: 'Homepage' },
  { slug: 'site', label: 'Site-wide' },
  { slug: 'info', label: 'Info pages' },
  { slug: 'iqac', label: 'IQAC' },
  { slug: 'placements', label: 'Placements' },
];

const groupLabel = (slug: string) =>
  GROUPS.find((g) => g.slug === slug)?.label ?? slug;

const groupRank = (slug: string) => {
  const i = GROUPS.findIndex((g) => g.slug === slug);
  return i === -1 ? GROUPS.length : i;
};

const rowClass =
  'flex items-baseline justify-between gap-6 py-3.5 transition-colors hover:text-primary';
const metaClass = 'font-mono text-[0.7rem] uppercase tracking-wider text-subtle';

export default async function AdminDashboardPage() {
  const admin = await getAdminUser();
  const owner = isOwner(admin);
  const [sections, bannerCounts, orphans] = await Promise.all([
    loadSections(admin),
    owner ? loadBannerCounts() : Promise.resolve(null),
    owner ? loadOrphans() : Promise.resolve([]),
  ]);

  // Grouped by the page slug ahead of the slash, so a new area gets its own
  // group with no code change here. Sorted by GROUPS, then alphabetically
  // within a group, so the list does not reshuffle as sections are added to
  // CONTENT_SECTIONS.
  const groups = new Map<string, SectionSummary[]>();
  for (const section of sections) {
    const page = section.key.split('/')[0];
    groups.set(page, [...(groups.get(page) ?? []), section]);
  }
  for (const rows of groups.values()) rows.sort((a, b) => a.label.localeCompare(b.label));

  const ordered = [...groups.entries()].sort(
    ([a], [b]) => groupRank(a) - groupRank(b) || a.localeCompare(b)
  );

  return (
    <main className="min-h-screen bg-ink px-6 py-12">
      <div className="mx-auto w-full max-w-[720px]">
        <header>
          <p className={metaClass}>MLRIT CMS</p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-0">Control room</h1>
        </header>

        {orphans.length > 0 && (
          <p
            role="alert"
            className="mt-8 rounded border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm text-orange-200"
          >
            {orphans.length} saved {orphans.length === 1 ? 'row has' : 'rows have'} no section in
            the code and {orphans.length === 1 ? 'is' : 'are'} no longer read:{' '}
            <span className="font-mono text-[0.8em]">{orphans.join(', ')}</span>. Safe to delete
            once you are sure the section is gone for good.
          </p>
        )}

        {ordered.map(([page, rows]) => (
          <section key={page} className="mt-10">
            <h2 className={metaClass}>
              {groupLabel(page)} · {rows.length} {rows.length === 1 ? 'section' : 'sections'}
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
                          {row.preview || (row.saved ? 'Saved, no text' : 'Built-in copy')}
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

        {owner && (
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
            <li>
              <Link href="/admin/users" className={`${rowClass} text-neutral-0`}>
                <span className="min-w-0">
                  <span className="block truncate text-sm">People</span>
                  <span className="mt-0.5 block truncate text-xs text-subtle">
                    Who can sign in, and which sections they may edit
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        </section>
        )}
      </div>
    </main>
  );
}
