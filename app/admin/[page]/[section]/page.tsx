import Link from 'next/link';

import ContentEditor from '@/app/admin/ContentEditor';
import { getSection } from '@/lib/content/client';
import { canEditSection, getAdminUser } from '@/lib/content/permissions';
import {
  asGalleryItems,
  asRepeaterItems,
  getSectionConfig,
  isListField,
  isRepeaterField,
} from '@/lib/content/sections';

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

  // Presentation only — the write route enforces this independently. Someone
  // who reaches this URL without rights sees the notice; someone who POSTs
  // past it gets a 403.
  const admin = await getAdminUser();
  if (config && !canEditSection(admin, params.page, params.section)) {
    return (
      <main className="min-h-screen bg-ink px-6 py-12">
        <div className="mx-auto w-full max-w-[720px]">
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-neutral-0"
          >
            ← all sections
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-neutral-0">Not your section</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-subtle">
            {params.page} / {params.section}
          </p>
          <p className="mt-4 max-w-[52ch] text-sm text-subtle">
            Your account does not have access to this section. Ask an owner to grant it.
          </p>
        </div>
      </main>
    );
  }

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

  const initialContent: Record<string, unknown> = {};
  for (const field of config.fields) {
    if (!isListField(field)) {
      // Seed from defaultValue only when nothing is stored, mirroring the
      // defaultItems rule below: the form shows the component's current copy,
      // and content_blocks stays untouched until Save.
      const stored = asString(content[field.name]);
      initialContent[field.name] = stored || (field.defaultValue ?? '');
      continue;
    }

    // List fields hold an array; coercing one through asString() would silently
    // wipe it. When nothing is stored yet, seed the FORM ONLY from defaultItems
    // so the editor opens with the component's bundled values as editable rows.
    // This is not a write: content_blocks is untouched until Save, which
    // preserves "empty stored list => component uses its own fallback" for the
    // public site.
    const stored = isRepeaterField(field)
      ? asRepeaterItems(content[field.name])
      : asGalleryItems(content[field.name]);
    initialContent[field.name] = stored.length > 0 ? stored : (field.defaultItems ?? []);
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
