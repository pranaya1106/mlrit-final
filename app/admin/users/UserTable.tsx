'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type AdminRow = {
  userId: string;
  email: string;
  role: 'owner' | 'editor';
  sections: string[];
};

type Status = { kind: 'idle' } | { kind: 'saving'; id: string } | { kind: 'error'; message: string };

/**
 * Editing surface for admin_users.
 *
 * Every change goes through /api/admin/users, which re-checks that the caller
 * is an owner. Nothing here is trusted — this component only decides what to
 * offer, never what is allowed.
 */
export default function UserTable({
  rows,
  sections,
  currentUserId,
}: {
  rows: AdminRow[];
  sections: { key: string; label: string }[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [email, setEmail] = useState('');

  async function send(body: Record<string, unknown>, id: string) {
    setStatus({ kind: 'saving', id });
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({ kind: 'error', message: data?.error ?? 'Save failed.' });
        return;
      }
      setStatus({ kind: 'idle' });
      router.refresh();
    } catch {
      setStatus({ kind: 'error', message: 'Network error. Nothing was changed.' });
    }
  }

  const toggleSection = (row: AdminRow, key: string) => {
    const next = row.sections.includes(key)
      ? row.sections.filter((s) => s !== key)
      : [...row.sections, key];
    return send({ action: 'update', userId: row.userId, sections: next }, row.userId);
  };

  return (
    <div className="mt-8">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) send({ action: 'add', email: email.trim() }, 'new');
        }}
      >
        <label className="min-w-[280px] flex-1">
          <span className="font-mono text-xs uppercase tracking-wider text-subtle">
            Add an existing account by email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@mlrit.ac.in"
            className="mt-1.5 w-full rounded-md border border-neutral-700 bg-ink-2 px-3 py-2 text-sm text-neutral-0 outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          disabled={status.kind === 'saving'}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status.kind === 'saving' && status.id === 'new' ? 'Adding…' : 'Add as editor'}
        </button>
      </form>
      <p className="mt-1.5 font-mono text-[0.7rem] text-subtle">
        The person must have signed in at least once — this grants rights to an existing
        account, it does not create one.
      </p>

      {status.kind === 'error' && (
        <p role="alert" className="mt-4 text-sm text-orange-400">
          {status.message}
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {rows.length === 0 && (
          <li className="font-mono text-xs uppercase tracking-wider text-subtle">
            No one listed yet.
          </li>
        )}

        {rows.map((row) => {
          const busy = status.kind === 'saving' && status.id === row.userId;
          const self = row.userId === currentUserId;

          return (
            <li key={row.userId} className="rounded-lg bg-ink-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block truncate text-sm text-neutral-0">{row.email}</span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle">
                    {row.role}
                    {self && ' · you'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* An owner cannot demote or remove themselves: doing so from
                      the only owner account would leave the site with no one
                      able to restore access. */}
                  {!self && (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          send(
                            {
                              action: 'update',
                              userId: row.userId,
                              role: row.role === 'owner' ? 'editor' : 'owner',
                            },
                            row.userId
                          )
                        }
                        className="font-mono text-[0.7rem] uppercase tracking-wider text-muted underline underline-offset-4 hover:text-neutral-0 disabled:opacity-40"
                      >
                        Make {row.role === 'owner' ? 'editor' : 'owner'}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => send({ action: 'remove', userId: row.userId }, row.userId)}
                        className="font-mono text-[0.7rem] uppercase tracking-wider text-muted underline underline-offset-4 hover:text-orange-400 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>

              {row.role === 'editor' && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {sections.map((section) => (
                    <label
                      key={section.key}
                      className="flex items-center gap-2 text-[0.78rem] text-subtle"
                    >
                      <input
                        type="checkbox"
                        checked={row.sections.includes(section.key)}
                        disabled={busy}
                        onChange={() => toggleSection(row, section.key)}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      {section.label}
                    </label>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
