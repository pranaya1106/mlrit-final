'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Status =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved'; title: string }
  | { kind: 'error'; message: string };

export default function BannerForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: 'saving' });

    const form = event.currentTarget;
    const body = new FormData(form);
    // An unchecked checkbox is absent from FormData; send it explicitly so the
    // route does not have to distinguish "unchecked" from "field missing".
    const activeInput = form.elements.namedItem('active') as HTMLInputElement | null;
    body.set('active', activeInput?.checked ? 'true' : 'false');

    try {
      const response = await fetch('/api/banners', { method: 'POST', body });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: 'error', message: data?.error ?? 'Upload failed.' });
        return;
      }

      setStatus({ kind: 'saved', title: data.title });
      form.reset();
      // Pull the freshly inserted row into the list rendered by the server
      // component above this form.
      router.refresh();
    } catch {
      setStatus({ kind: 'error', message: 'Network error. The banner was not created.' });
    }
  }

  const labelClass = 'font-mono text-xs uppercase tracking-wider text-muted';
  const inputClass =
    'mt-1.5 w-full rounded-md border border-border bg-neutral-0 px-3 py-2 text-base text-foreground outline-none focus:border-primary';

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-snow p-6 shadow-card-soft">
      <label className="block">
        <span className={labelClass}>Title</span>
        <input type="text" name="title" required className={inputClass} />
      </label>

      <label className="mt-5 block">
        <span className={labelClass}>Image</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm`}
        />
        <span className="mt-1 block font-mono text-[0.7rem] text-subtle">
          Images only, 5MB max.
        </span>
      </label>

      <label className="mt-5 block">
        <span className={labelClass}>Link URL (optional)</span>
        <input type="url" name="link_url" placeholder="https://…" className={inputClass} />
      </label>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Start date (optional)</span>
          <input type="datetime-local" name="start_date" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>End date (optional)</span>
          <input type="datetime-local" name="end_date" className={inputClass} />
        </label>
      </div>

      <label className="mt-5 flex items-center gap-2.5">
        <input type="checkbox" name="active" className="h-4 w-4 accent-primary" />
        <span className={labelClass}>Active</span>
      </label>

      <div className="mt-7 flex items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === 'saving'}
          className="rounded-md bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {status.kind === 'saving' ? 'Uploading…' : 'Create banner'}
        </button>

        {status.kind === 'saved' && (
          <span role="status" className="font-mono text-xs text-secondary">
            Created “{status.title}”.
          </span>
        )}
      </div>

      {status.kind === 'error' && (
        <p role="alert" className="mt-4 text-sm text-orange-600">
          {status.message}
        </p>
      )}
    </form>
  );
}
