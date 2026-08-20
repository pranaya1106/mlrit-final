'use client';

import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { resolveAssetUrl } from '@/lib/cdn/url';
import {
  asGalleryItems,
  fieldType,
  type FieldConfig,
  type GalleryItem,
} from '@/lib/content/sections';
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
 * The section editor for every CMS-editable section, including the hero.
 *
 * Save / conflict / error handling originated in the hero-specific editor that
 * this replaced, and is unchanged; the field list now comes from
 * CONTENT_SECTIONS rather than being hardcoded per section.
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
  initialContent: Record<string, unknown>;
  initialVersion: number;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initialContent);
  const [version, setVersion] = useState(initialVersion);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  // A list, not a single slot: selecting several files starts several uploads
  // at once and each finishes independently.
  const [uploading, setUploading] = useState<string[]>([]);
  const [fullScreen, setFullScreen] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Read inside callbacks without making them depend on every keystroke.
  const valuesRef = useRef(values);
  valuesRef.current = values;
  // Object URLs created for instant media preview, revoked once uploaded.
  // These are scoped to THIS document — the iframe cannot resolve them, so it
  // receives the File itself and mints its own.
  // Keyed by upload slot: the field name for a single image/video, or
  // `field::itemId` for one gallery entry.
  const objectUrlsRef = useRef<Record<string, string>>({});
  const pendingFilesRef = useRef<Record<string, File>>({});

  const postToPreview = useCallback(
    (type: string, payload: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage({ type, payload }, window.location.origin);
    },
    []
  );

  const pushDraft = useCallback(() => {
    // Files replace their field's string value: a parent-document blob: URL is
    // meaningless inside the iframe, but a File survives structured clone. For
    // galleries the File has to sit on the individual item, not the array.
    const content: Record<string, unknown> = {};

    for (const [name, value] of Object.entries(valuesRef.current)) {
      if (Array.isArray(value)) {
        content[name] = (value as GalleryItem[]).map((item) => {
          const pending = pendingFilesRef.current[`${name}::${item.id}`];
          return pending ? { ...item, key: pending } : item;
        });
        continue;
      }
      content[name] = pendingFilesRef.current[name] ?? value;
    }

    postToPreview(MESSAGE.update, { sectionKey: `${page}/${section}`, content });
  }, [postToPreview, page, section]);

  // Debounced so typing does not flood the iframe with a message per keystroke.
  useEffect(() => {
    const id = window.setTimeout(pushDraft, 150);
    return () => window.clearTimeout(id);
  }, [values, pushDraft]);

  // The iframe announces itself once mounted; seed it and scroll to this section.
  // It also forwards Escape, which would otherwise be swallowed by the iframe.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const type = (event.data as { type?: string } | null)?.type;

      if (type === MESSAGE.ready) {
        pushDraft();
        postToPreview(MESSAGE.scroll, { sectionKey: `${page}/${section}` });
        return;
      }

      if (type === MESSAGE.exitFullscreen) setFullScreen(false);
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [pushDraft, postToPreview, page, section]);

  // Escape while focus is in the form pane.
  useEffect(() => {
    if (!fullScreen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setFullScreen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fullScreen]);

  // Release any object URLs still outstanding when the editor unmounts.
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  /**
   * Shared upload for a single media field and for one gallery item.
   *
   * `slot` identifies what is being uploaded — a field name, or
   * `field::itemId` — and keys both the pending File (sent to the preview) and
   * the local object URL (shown in this document). `write` applies a value to
   * wherever it belongs; `revert` puts the previous value back on failure so a
   * blob: placeholder is never left behind for Save to persist.
   */
  async function runUpload(
    slot: string,
    file: File,
    write: (value: string) => void,
    revert: () => void
  ) {
    setUploading((current) => [...current, slot]);
    setStatus({ kind: 'idle' });

    // Show the chosen file straight away; the upload continues in the
    // background and replaces this with the real storage key.
    const objectUrl = URL.createObjectURL(file);
    URL.revokeObjectURL(objectUrlsRef.current[slot] ?? '');
    objectUrlsRef.current[slot] = objectUrl;
    // The iframe gets the File; this parent-scoped URL is only for local UI.
    pendingFilesRef.current[slot] = file;
    write(objectUrl);

    try {
      const body = new FormData();
      body.set('file', file);
      body.set('prefix', `${page}-${section}`);

      const response = await fetch('/api/content/upload', { method: 'POST', body });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: 'error', message: data?.error ?? 'Upload failed.' });
        revert();
        return;
      }

      write(data.key);
    } catch {
      setStatus({ kind: 'error', message: 'Network error. The file was not uploaded.' });
      revert();
    } finally {
      // Swap done (or failed) — the blob is no longer what anything points at,
      // and dropping the File lets the real storage key reach the preview.
      const stale = objectUrlsRef.current[slot];
      if (stale) {
        URL.revokeObjectURL(stale);
        delete objectUrlsRef.current[slot];
      }
      delete pendingFilesRef.current[slot];
      setUploading((current) => current.filter((s) => s !== slot));
    }
  }

  /** Single image/video field. */
  function handleUpload(fieldName: string, file: File) {
    const previous = (valuesRef.current[fieldName] as string) ?? '';
    return runUpload(
      fieldName,
      file,
      (value) => setValues((current) => ({ ...current, [fieldName]: value })),
      () => setValues((current) => ({ ...current, [fieldName]: previous }))
    );
  }

  // ---- gallery helpers ------------------------------------------------------
  //
  // Every mutation derives its next state from the updater's `current`, never
  // from valuesRef. The ref only syncs during render, but adding an image
  // queues two updates in one tick (append the item, then write its blob URL) —
  // reading the ref for the second one used a pre-append snapshot and silently
  // discarded the new item, so no thumbnail ever appeared. The same defect was
  // latent in remove/reorder/revert whenever two updates landed in one tick.

  /** Applies a transform to one gallery field, computed from live state. */
  const updateGallery = (
    fieldName: string,
    transform: (items: GalleryItem[]) => GalleryItem[]
  ) =>
    setValues((current) => ({
      ...current,
      [fieldName]: transform(asGalleryItems(current[fieldName])),
    }));

  const patchItem = (fieldName: string, id: string, patch: Partial<GalleryItem>) =>
    updateGallery(fieldName, (items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );

  /** Appends an item, then uploads into it. The id is stable across reorders. */
  function addGalleryImage(fieldName: string, file: File) {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    updateGallery(fieldName, (items) => [...items, { id, key: '' }]);

    return runUpload(
      `${fieldName}::${id}`,
      file,
      (value) => patchItem(fieldName, id, { key: value }),
      // A failed upload leaves no half-made row behind.
      () => updateGallery(fieldName, (items) => items.filter((item) => item.id !== id))
    );
  }

  /** Swaps one item's image. Its id, name and position are untouched. */
  function replaceGalleryImage(fieldName: string, id: string, file: File) {
    const previousKey =
      asGalleryItems(valuesRef.current[fieldName]).find((item) => item.id === id)?.key ?? '';

    return runUpload(
      `${fieldName}::${id}`,
      file,
      (value) => patchItem(fieldName, id, { key: value }),
      // Put the old image back rather than leaving the row broken.
      () => patchItem(fieldName, id, { key: previousKey })
    );
  }

  function removeGalleryItem(fieldName: string, id: string) {
    updateGallery(fieldName, (items) => items.filter((item) => item.id !== id));
  }

  function moveGalleryItem(fieldName: string, id: string, delta: -1 | 1) {
    updateGallery(fieldName, (items) => {
      const from = items.findIndex((item) => item.id === id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= items.length) return items;

      const next = [...items];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
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
      {/* Left: the form. Scrolls independently of the preview. Hidden rather
          than unmounted in full-screen, so the iframe keeps its position in the
          tree and is never remounted — scroll position and draft survive. */}
      <div
        className={
          fullScreen ? 'hidden' : 'w-[420px] shrink-0 overflow-y-auto px-6 py-10'
        }
      >
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
            // Values are unknown now that galleries hold arrays; text inputs
            // need a definite string.
            const text = typeof values[name] === 'string' ? (values[name] as string) : '';

            return (
              <label key={name} className="mt-5 block first:mt-0">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {fieldLabel}
                </span>

                {type === 'multiline' && (
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                    className={`${INPUT_CLASS} resize-y leading-relaxed`}
                  />
                )}

                {type === 'text' && (
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                    className={INPUT_CLASS}
                  />
                )}


                {type === 'gallery' && (
                  <div className="mt-1.5">
                    {asGalleryItems(values[name]).length === 0 && (
                      <p className="font-mono text-[0.7rem] text-subtle">No images yet.</p>
                    )}

                    {/* The consuming component renders a fixed number of slots;
                        anything beyond that is stored but never displayed, so
                        say so rather than letting it vanish silently. */}
                    {typeof field.maxItems === 'number' &&
                      asGalleryItems(values[name]).length > field.maxItems && (
                        <p
                          role="alert"
                          className="mb-3 rounded border border-orange-200 bg-orange-50 px-3 py-2 text-[0.78rem] text-orange-700"
                        >
                          Only the first {field.maxItems} images will be shown —{' '}
                          {asGalleryItems(values[name]).length - field.maxItems} extra uploaded
                          won&apos;t appear.
                        </p>
                      )}

                    <ul className="space-y-3">
                      {asGalleryItems(values[name]).map((item, index, all) => {
                        const slot = `${name}::${item.id}`;
                        const busy = uploading.includes(slot);
                        // Use the shared resolver, not a local /cdn/ prefix:
                        // defaultItems point at bundled assets already rooted
                        // at / (e.g. /placements/p1.jpg), and prefixing those
                        // produced /cdn/placements/p1.jpg — a 404 for every
                        // seeded thumbnail.
                        const src = resolveAssetUrl(item.key, { allowTransient: true }) ?? '';

                        return (
                          <li
                            key={item.id}
                            className="flex gap-3 rounded-md border border-border bg-neutral-0 p-3"
                          >
                            <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-neutral-100">
                              {src ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={src}
                                  alt={item.title ?? ''}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="grid h-full place-items-center font-mono text-[0.6rem] uppercase text-subtle">
                                  {busy ? 'up…' : '—'}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-2">
                              {(field.itemFields ?? []).map((itemField) => {
                                if (itemField === 'active') {
                                  return (
                                    <label
                                      key={itemField}
                                      className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={item.active ?? false}
                                        onChange={(e) =>
                                          patchItem(name, item.id, { active: e.target.checked })
                                        }
                                        className="h-4 w-4 accent-primary"
                                      />
                                      Active
                                    </label>
                                  );
                                }

                                const isDate = itemField === 'startDate' || itemField === 'endDate';
                                return (
                                  <input
                                    key={itemField}
                                    type={isDate ? 'date' : itemField === 'linkUrl' ? 'url' : 'text'}
                                    placeholder={itemField}
                                    value={(item[itemField] as string | undefined) ?? ''}
                                    onChange={(e) =>
                                      patchItem(name, item.id, { [itemField]: e.target.value })
                                    }
                                    className="w-full rounded border border-border bg-neutral-0 px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                                  />
                                );
                              })}
                            </div>

                            <div className="flex shrink-0 flex-col items-end justify-between">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  aria-label="Move up"
                                  disabled={index === 0}
                                  onClick={() => moveGalleryItem(name, item.id, -1)}
                                  className="rounded px-1.5 font-mono text-xs text-muted hover:text-foreground disabled:opacity-30"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  aria-label="Move down"
                                  disabled={index === all.length - 1}
                                  onClick={() => moveGalleryItem(name, item.id, 1)}
                                  className="rounded px-1.5 font-mono text-xs text-muted hover:text-foreground disabled:opacity-30"
                                >
                                  ↓
                                </button>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {/* Swaps this item's image only — id, name and
                                    position survive, so the constellation slot
                                    it occupies does not move. */}
                                <label className="cursor-pointer font-mono text-[0.65rem] uppercase tracking-wider text-muted underline underline-offset-4 hover:text-foreground">
                                  {busy ? 'Uploading…' : 'Replace image'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    disabled={busy}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) replaceGalleryImage(name, item.id, file);
                                      e.target.value = '';
                                    }}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeGalleryItem(name, item.id)}
                                  className="font-mono text-[0.65rem] uppercase tracking-wider text-muted underline underline-offset-4 hover:text-orange-600"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        // One upload per file, appended in selection order and
                        // each with its own in-flight state.
                        Array.from(e.target.files ?? []).forEach((file) =>
                          addGalleryImage(name, file)
                        );
                        // Allow picking the same file again after a remove.
                        e.target.value = '';
                      }}
                      className={`${INPUT_CLASS} file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm`}
                    />
                    <span className="mt-1 block font-mono text-[0.7rem] text-subtle">
                      Add images — several can be picked at once
                    </span>
                  </div>
                )}

                {(type === 'image' || type === 'video') && (
                  <>
                    <input
                      type="file"
                      accept={type === 'image' ? 'image/*' : 'video/*'}
                      disabled={uploading.includes(name)}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(name, file);
                      }}
                      className={`${INPUT_CLASS} file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm`}
                    />
                    <span className="mt-1 block font-mono text-[0.7rem] text-subtle">
                      {uploading.includes(name)
                        ? 'Uploading…'
                        : text || `No ${type} uploaded — the built-in one is used.`}
                    </span>
                    {text && (
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
              disabled={status.kind === 'saving' || uploading.length > 0}
              className="rounded-md bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {status.kind === 'saving'
                ? 'Saving…'
                : uploading.length > 0
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
        <div className="pointer-events-none absolute left-4 right-4 top-3 z-10 flex items-center justify-between gap-3">
          <span className="rounded bg-ink/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-subtle">
            Live preview · unsaved
          </span>
          <button
            type="button"
            onClick={() => setFullScreen((on) => !on)}
            className="pointer-events-auto rounded bg-ink/80 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-subtle transition-colors hover:text-neutral-0"
          >
            {fullScreen ? 'Exit full screen · Esc' : 'Full screen'}
          </button>
        </div>
        {/* Rendered at native size with its own scrollbar — no scale(), so the
            page inside scrolls exactly like an ordinary tab. */}
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
