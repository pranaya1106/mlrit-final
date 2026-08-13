import Link from 'next/link';

import ContentEditor from '@/app/admin/ContentEditor';
import { getSection } from '@/lib/content/client';
import { getSectionConfig } from '@/lib/content/sections';

// Always read the row at request time — an editor must never be handed a
// cached version number, or its first save would look like a conflict.
export const dynamic = 'force-dynamic';

// force-dynamic re-runs the render but does NOT bypass the Data Cache: supabase-js
// issues selects as GET fetches, which Next caches, so a re-render would happily
// serve a stale row set. A cached `version` would make the editor's next save
// collide with itself and report a phantom conflict.
export const fetchCache = 'force-no-store';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

export default async function SectionAdminPage({
  params,
}: {
  params: { page: string; section: string };
}) {
  const config = getSectionConfig(params.page, params.section);

  if (!config) {
    return (
      <main className="min-h-screen bg-ink px-6 py-12">
        <div className="mx-auto w-full max-w-[720px]">
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-neutral-0"
          >
            ← all sections
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-neutral-0">Unknown section</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-subtle">
            {params.page} / {params.section} is not editable.
          </p>
        </div>
      </main>
    );
  }

  const row = await getSection(params.page, params.section);
  const content = (row?.content ?? {}) as Record<string, unknown>;

  const initialContent: Record<string, string> = {};
  for (const field of config.fields) {
    initialContent[field.name] = asString(content[field.name]);
  }

  return (
    <ContentEditor
      page={params.page}
      section={params.section}
      label={config.label}
      fields={config.fields}
      initialContent={initialContent}
      initialVersion={row?.version ?? 1}
    />
  );
}
