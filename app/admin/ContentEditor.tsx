'use client';

import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fieldType, type FieldConfig } from '@/lib/content/sections';
import { MESSAGE, PREVIEW_PARAM } from '@/lib/preview/context';

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

  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Read inside callbacks without making them depend on every keystroke.
  const valuesRef = useRef(values);
  valuesRef.current = values;
  // Object URLs created for instant media preview, revoked once uploaded.
  // These are scoped to THIS document — the iframe cannot resolve them, so it
  // receives the File itself and mints its own.
  const objectUrlsRef = useRef<Record<string, string>>({});
  const pendingFilesRef = useRef<Record<string, File>>({});

  const postToPreview = useCallback(
    (type: string, payload: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage({ type, payload }, window.location.origin);
    },
    []
  );

  const pushDraft = useCallback(() => {
    // Files override their field's string value: a parent-document blob: URL
    // is meaningless inside the iframe, but a File survives structured clone.
    const content: Record<string, unknown> = {
      ...valuesRef.current,
      ...pendingFilesRef.current,
    };
    postToPreview(MESSAGE.update, { sectionKey: `${page}/${section}`, content });
  }, [postToPreview, page, section]);

  // Debounced so typing does not flood the iframe with a message per keystroke.
  useEffect(() => {
    const id = window.setTimeout(pushDraft, 150);
    return () => window.clearTimeout(id);
  }, [values, pushDraft]);

  // The iframe announces itself once mounted; seed it and scroll to this section.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if ((event.data as { type?: string } | null)?.type !== MESSAGE.ready) return;
      pushDraft();
      postToPreview(MESSAGE.scroll, { sectionKey: `${page}/${section}` });
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [pushDraft, postToPreview, page, section]);

  // Release any object URLs still outstanding when the editor unmounts.
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  /**
   * Uploads immediately on file select and stores the returned key as the
   * field's value. From the save path's point of view the result is just
   * another string, so nothing downstream needs to know it came from a file.
   */
  async function handleUpload(fieldName: string, file: File) {
    setUploading(fieldName);
    setStatus({ kind: 'idle' });

    // Kept so a failed upload can put the field back rather than leaving a
    // blob: placeholder that Save would try to persist.
    const previousValue = valuesRef.current[fieldName] ?? '';

    // Show the chosen file in the preview straight away; the upload continues
    // in the background and replaces this with the real storage key.
    const objectUrl = URL.createObjectURL(file);
    URL.revokeObjectURL(objectUrlsRef.current[fieldName] ?? '');
    objectUrlsRef.current[fieldName] = objectUrl;
    // The iframe gets the File; this parent-scoped URL is only for local UI.
    pendingFilesRef.current[fieldName] = file;
    setValues((current) => ({ ...current, [fieldName]: objectUrl }));

    try {
      const body = new FormData();
      body.set('file', file);
      body.set('prefix', `${page}-${section}`);

      const response = await fetch('/api/content/upload', { method: 'POST', body });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: 'error', message: data?.error ?? 'Upload failed.' });
        setValues((current) => ({ ...current, [fieldName]: previousValue }));
        return;
      }

      setValues((current) => ({ ...current, [fieldName]: data.key }));
    } catch {
      setStatus({ kind: 'error', message: 'Network error. The file was not uploaded.' });
      setValues((current) => ({ ...current, [fieldName]: previousValue }));
    } finally {
      // Swap done (or failed) — the blob is no longer what the field points at,
      // and dropping the File lets the real storage key reach the preview.
      const stale = objectUrlsRef.current[fieldName];
      if (stale) {
        URL.revokeObjectURL(stale);
        delete objectUrlsRef.current[fieldName];
      }
      delete pendingFilesRef.current[fieldName];
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
    <main className="flex h-screen overflow-hidden bg-ink">
      {/* Left: the form. Scrolls independently of the preview. */}
      <div className="w-[420px] shrink-0 overflow-y-auto px-6 py-10">
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
            {/* Saving mid-upload would persist the blob: placeholder rather
                than the uploaded key — the exact bug that poisoned a row. */}
            <button
              type="button"
              onClick={handleSave}
              disabled={status.kind === 'saving' || uploading !== null}
              className="rounded-md bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {status.kind === 'saving'
                ? 'Saving…'
                : uploading !== null
                  ? 'Waiting for upload…'
                  : 'Save changes'}
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

      {/* Right: the real homepage, driven by postMessage. Nothing here writes
          to the database — the draft lives in the iframe's React state until
          Save is pressed. */}
      <div className="relative flex-1 border-l border-neutral-800 bg-neutral-900">
        <span className="pointer-events-none absolute left-4 top-3 z-10 rounded bg-ink/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
          Live preview · unsaved
        </span>
        <iframe
          ref={iframeRef}
          src={`/?${PREVIEW_PARAM}=1`}
          title="Live preview"
          className="h-full w-full border-0"
        />
      </div>
    </main>
  );
}
