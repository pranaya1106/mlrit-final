'use client';

import { useEffect, useState } from 'react';

export type BannerRow = {
  id: string;
  title: string;
  asset_key: string;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
};

const formatWindow = (start: string | null, end: string | null): string => {
  if (!start && !end) return 'always';
  const from = start ? new Date(start).toISOString().slice(0, 10) : '—';
  const to = end ? new Date(end).toISOString().slice(0, 10) : '—';
  return `${from} → ${to}`;
};

/**
 * Rows are held in local state and patched in place after a successful request,
 * rather than re-fetching the list. Instant, and it keeps this list off the
 * server-render path where the Data Cache previously served stale rows.
 */
export default function BannerList({ initialBanners }: { initialBanners: BannerRow[] }) {
  const [rows, setRows] = useState(initialBanners);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // A new banner created by the form above triggers router.refresh(), which
  // re-renders the server component and hands down fresh props.
  useEffect(() => {
    setRows(initialBanners);
  }, [initialBanners]);

  async function toggleActive(row: BannerRow) {
    setBusyId(row.id);
    setError(null);

    try {
      const response = await fetch('/api/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id, active: !row.active }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? 'Could not update that banner.');
        return;
      }

      setRows((current) => current.map((r) => (r.id === row.id ? { ...r, active: data.active } : r)));
    } catch {
      setError('Network error. The banner was not updated.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(row: BannerRow) {
    if (!window.confirm(`Delete “${row.title}”? This cannot be undone.`)) return;

    setBusyId(row.id);
    setError(null);

    try {
      const response = await fetch(`/api/banners?id=${encodeURIComponent(row.id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? 'Could not delete that banner.');
        return;
      }

      setRows((current) => current.filter((r) => r.id !== row.id));
    } catch {
      setError('Network error. The banner was not deleted.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
        All banners ({rows.length})
      </h2>

      {error && (
        <p role="alert" className="mt-3 text-sm text-orange-600">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="mt-3 font-mono text-xs text-subtle">None yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-neutral-800 rounded-lg bg-ink-2 px-4">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-neutral-0">{row.title}</p>
                <p className="mt-0.5 font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                  {formatWindow(row.start_date, row.end_date)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={row.active}
                    disabled={busyId === row.id}
                    onChange={() => toggleActive(row)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                    {row.active ? 'active' : 'draft'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => remove(row)}
                  disabled={busyId === row.id}
                  className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle underline underline-offset-4 hover:text-orange-300 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
