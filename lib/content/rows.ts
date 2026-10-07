import { asRepeaterItems, type RepeaterItem } from '@/lib/content/sections';

/**
 * One list field from any section, for server components.
 *
 * Same contract the homepage has used since the repeater landed: an empty
 * array means nothing is saved, and every caller reads that as "use my
 * bundled fallback". Imported dynamically because lib/supabase.ts throws at
 * module scope without its env vars, which a top-level import could not catch.
 */
export async function getRows(
  page: string,
  section: string,
  field: string
): Promise<RepeaterItem[]> {
  try {
    const { getSection } = await import('@/lib/content/client');
    const row = await getSection(page, section);
    return asRepeaterItems((row?.content as Record<string, unknown> | undefined)?.[field]);
  } catch {
    return [];
  }
}
