import Link from 'next/link';

import { getAdminUser, isOwner } from '@/lib/content/permissions';
import { getServiceClient } from '@/lib/supabase';

import BannerForm from './BannerForm';
import BannerList, { type BannerRow } from './BannerList';

// Read at request time so a newly created banner shows up on router.refresh().
export const dynamic = 'force-dynamic';

// force-dynamic re-runs the render but does NOT bypass the Data Cache: supabase-js
// issues selects as GET fetches, which Next caches, so a re-render would happily
// serve a stale row set (measured: 4ms "query" vs ~250ms for a real round-trip).
// Opt this route's fetches out entirely — an editor must see their own writes.
export const fetchCache = 'force-no-store';

/**
 * Lists every banner, including drafts and expired ones — the anon policy hides
 * those, so this uses the service-role client. The page is owner-gated above
 * this call; the middleware gate only proves the caller is signed in.
 */
async function listAllBanners(): Promise<BannerRow[]> {
  try {
    const { data, error } = await getServiceClient()
      .from('banners')
      .select('id, title, asset_key, active, start_date, end_date')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as BannerRow[];
  } catch (err) {
    // Surfaced in the server log rather than swallowed — an empty list and a
    // failed query look identical in the UI otherwise.
    console.error('[banners] failed to list:', err);
    return [];
  }
}

export default async function BannersAdminPage() {
  // Banners publish to every visitor and are not section-scoped, so they are
  // owner-only. The matching check lives in /api/banners — this one keeps a
  // non-owner from being shown a form whose every submission would 403.
  const admin = await getAdminUser();

  if (!isOwner(admin)) {
    return (
      <main className="min-h-screen bg-ink px-6 py-12">
        <div className="mx-auto w-full max-w-[720px]">
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-neutral-0"
          >
            ← all sections
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-neutral-0">Owners only</h1>
          <p className="mt-4 max-w-[52ch] text-sm text-subtle">
            Only an owner can manage banners.
          </p>
        </div>
      </main>
    );
  }

  const banners = await listAllBanners();

  return (
    <main className="min-h-screen bg-ink px-6 py-12">
      <div className="mx-auto w-full max-w-[720px]">
        <header>
          <p className="font-mono text-xs uppercase tracking-widest text-subtle">banners</p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-0">Add a banner</h1>
        </header>

        <div className="mt-8">
          <BannerForm />
        </div>

        <BannerList initialBanners={banners} />
      </div>
    </main>
  );
}
