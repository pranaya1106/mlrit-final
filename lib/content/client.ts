import config from '@payload-config';
import { getPayload } from 'payload';

import { getSectionConfig } from '@/lib/content/sections';
import { toContent } from '@/payload/transform';
import { toGlobalSlug } from '@/payload/slug';

export type SectionRow = {
  content: Record<string, unknown>;
  version: number;
  updatedAt: string | null;
  editedBy: string | null;
};

/**
 * Fetch a single content block, now served by Payload rather than Supabase.
 *
 * The return shape is unchanged on purpose: toContent() rebuilds exactly what
 * content_blocks used to hand back, down to restoring each list item's stable
 * `id`. That is what let the CMS move without touching any of the 66 call
 * sites — every copy(), <Copy> and asRepeaterItems() reads what it always did.
 *
 * One behavioural difference, and it is deliberate. Supabase returned null for
 * a section nobody had saved, and callers read that as "use the component's
 * hardcoded fallback". Payload instead returns the field defaults, which are
 * those same fallbacks — CONTENT_SECTIONS is where both come from. So the
 * rendered page is identical either way, which the visible-text diff across
 * every affected route is there to prove.
 *
 * Still returns null for a key that is not in CONTENT_SECTIONS at all, since
 * no global exists for it.
 */
export async function getSection(
  pageSlug: string,
  sectionKey: string
): Promise<SectionRow | null> {
  if (!getSectionConfig(pageSlug, sectionKey)) return null;

  const payload = await getPayload({ config });
  const slug = toGlobalSlug(`${pageSlug}/${sectionKey}`) as Parameters<
    typeof payload.findGlobal
  >[0]['slug'];

  const global = (await payload.findGlobal({
    slug,
    depth: 0,
    overrideAccess: true,
  })) as unknown as Record<string, unknown>;

  if (!global) return null;

  return {
    content: toContent(pageSlug, sectionKey, global),
    // Payload tracks its own document versions; this field exists for the
    // outgoing admin's optimistic-concurrency check and is not used to gate
    // Payload writes.
    version: typeof global._version === 'number' ? global._version : 1,
    updatedAt: (global.updatedAt as string) ?? null,
    editedBy: null,
  };
}

/** Thrown when the write cannot proceed; `code` tells the route what to say. */
