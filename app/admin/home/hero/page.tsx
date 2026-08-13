import { getSection } from '@/lib/content/client';

import HeroEditor from './HeroEditor';

// Always read the row at request time — an editor must never be handed a
// cached version number, or its first save would look like a conflict.
export const dynamic = 'force-dynamic';

// force-dynamic re-runs the render but does NOT bypass the Data Cache: supabase-js
// issues selects as GET fetches, which Next caches, so a re-render would happily
// serve a stale row set. Doubly important here — a cached `version` would make the
// editor's next save collide with itself and report a phantom conflict.
export const fetchCache = 'force-no-store';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

export default async function HeroAdminPage() {
  const section = await getSection('home', 'hero');
  const content = (section?.content ?? {}) as Record<string, unknown>;

  return (
    <HeroEditor
      initialFields={{
        headlineLead: asString(content.headlineLead),
        headlineAccent: asString(content.headlineAccent),
        body: asString(content.body),
      }}
      initialVersion={section?.version ?? 1}
    />
  );
}
