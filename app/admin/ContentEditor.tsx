'use client';

import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { fieldType, type FieldConfig } from '@/lib/content/sections';

type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved' }
  | { kind: 'conflict' }
  | { kind: 'error'; message: string };

const INPUT_CLASS =
  'mt-1.5 w-full rounded-md border border-border bg-neutral-0 px-3 py-2 text-base text-foreground outline-none focus:border-primary';

const CONFLICT_MESSAGE =
  'Someone else saved changes. Refresh to see the latest version before saving again.';

/**
 * Generic section editor. Save / conflict / error handling is ported verbatim
 * from HeroEditor, which is proven against the live API; the only change is
 * that the field list comes from CONTENT_SECTIONS instead of being hardcoded.
 */
export default function ContentEditor({
  page,
  section,
  label,
  fields,
  initialContent,
  initialVersion,
}: {
  page: string;
  section: string;
  label: string;
  fields: readonly FieldConfig[];
  initialContent: Record<string, string>;
  initialVersion: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initialContent);
  const [version, setVersion] = useState(initialVersion);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [uploading, setUploading] = useState<string | null>(null);

  /**
   * Uploads immediately on file select and stores the returned key as the
   * field's value. From the save path's point of view the result is just
   * another string, so nothing downstream needs to know it came from a file.
   */
  async function handleUpload(fieldName: string, file: File) {
    setUploading(fieldName);
    setStatus({ kind: 'idle' });

    try {
      const body = new FormData();
      body.set('file', file);
      body.set('prefix', `${page}-${section}`);

      const response = await fetch('/api/content/upload', { method: 'POST', body });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: 'error', message: data?.error ?? 'Upload failed.' });
        return;
      }

      setValues((current) => ({ ...current, [fieldName]: data.key }));
    } catch {
      setStatus({ kind: 'error', message: 'Network error. The file was not uploaded.' });
    } finally {
      setUploading(null);
    }
  }

  async function handleSave() {
    setStatus({ kind: 'saving' });

    try {
      const response = await fetch(`/api/content/${page}/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: values, expectedVersion: version }),
      });

      if (response.status === 409) {
        // Deliberately does not refresh or overwrite — the editor decides.
        setStatus({ kind: 'conflict' });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: 'error', message: data?.error ?? 'Save failed.' });
        return;
      }

      // Track the new version so a second save in this session is not treated
      // as a stale write.
      setVersion(data.version);
      setStatus({ kind: 'saved' });
    } catch {
      setStatus({ kind: 'error', message: 'Network error. Changes were not saved.' });
    }
  }

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-12">
      <div className="mx-auto w-full max-w-[720px]">
        <header className="flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/admin"
              className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-neutral-0"
            >
              ← all sections
            </Link>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-subtle">
              {page} / {section}
            </p>
            <h1 className="mt-1 truncate text-2xl font-semibold text-neutral-0">{label}</h1>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="shrink-0 font-mono text-xs uppercase tracking-wider text-subtle underline underline-offset-4 hover:text-neutral-0"
          >
            Sign out
          </button>
        </header>

        <section className="mt-8 rounded-lg bg-snow p-6 shadow-card-soft">
          {fields.map((field) => {
            const { name, label: fieldLabel } = field;
            const type = fieldType(field);
            const isMedia = type === 'image' || type === 'video';

            return (
              <label key={name} className="mt-5 block first:mt-0">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {fieldLabel}
                </span>

                {type === 'multiline' && (
                  <textarea
                    rows={4}
                    value={values[name] ?? ''}
                    onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                    className={`${INPUT_CLASS} resize-y leading-relaxed`}
                  />
                )}

                {type === 'text' && (
                  <input
                    type="text"
                    value={values[name] ?? ''}
                    onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                    className={INPUT_CLASS}
                  />
                )}

                {isMedia && (
                  <>
                    <input
                      type="file"
                      accept={type === 'image' ? 'image/*' : 'video/*'}
                      disabled={uploading === name}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(name, file);
                      }}
                      className={`${INPUT_CLASS} file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm`}
                    />
                    <span className="mt-1 block font-mono text-[0.7rem] text-subtle">
                      {uploading === name
                        ? 'Uploading…'
                        : values[name]
                          ? values[name]
                          : `No ${type} uploaded — the built-in one is used.`}
                    </span>
                    {values[name] && (
                      <button
                        type="button"
                        onClick={() => setValues({ ...values, [name]: '' })}
                        className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted underline underline-offset-4 hover:text-foreground"
                      >
                        Clear
                      </button>
                    )}
                  </>
                )}
              </label>
            );
          })}

          <div className="mt-7 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={status.kind === 'saving'}
              className="rounded-md bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {status.kind === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
            <span className="font-mono text-xs uppercase tracking-wider text-subtle">
              version {version}
            </span>
          </div>

          {status.kind === 'saved' && (
            <p role="status" className="mt-4 font-mono text-xs text-secondary">
              Saved.
            </p>
          )}

          {status.kind === 'conflict' && (
            <p role="alert" className="mt-4 text-sm text-orange-600">
              {CONFLICT_MESSAGE}
            </p>
          )}

          {status.kind === 'error' && (
            <p role="alert" className="mt-4 text-sm text-orange-600">
              {status.message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
