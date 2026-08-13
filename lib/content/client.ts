import { supabase, getServiceClient } from '@/lib/supabase';

export type SectionRow = {
  content: Record<string, unknown>;
  version: number;
  updatedAt: string | null;
  editedBy: string | null;
};

/**
 * Fetch a single content block. Returns null when no row exists for the
 * (page_slug, section_key) pair.
 */
export async function getSection(
  pageSlug: string,
  sectionKey: string
): Promise<SectionRow | null> {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('content, version, updated_at, edited_by')
    .eq('page_slug', pageSlug)
    .eq('section_key', sectionKey)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    content: data.content as Record<string, unknown>,
    version: data.version as number,
    updatedAt: (data.updated_at as string) ?? null,
    editedBy: (data.edited_by as string) ?? null,
  };
}

/**
 * Optimistic-concurrency write. Updates only if the stored version still
 * matches `expectedVersion`, bumping it by one. Throws Error('CONFLICT') when
 * the row moved on (or vanished) since it was read.
 */
export async function saveSection(
  pageSlug: string,
  sectionKey: string,
  content: object,
  expectedVersion: number,
  editedBy: string | null = null
): Promise<SectionRow> {
  const { data, error } = await getServiceClient()
    .from('content_blocks')
    .update({ content, version: expectedVersion + 1, edited_by: editedBy })
    .eq('page_slug', pageSlug)
    .eq('section_key', sectionKey)
    .eq('version', expectedVersion)
    .select('content, version, updated_at, edited_by');

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('CONFLICT');

  return {
    content: data[0].content as Record<string, unknown>,
    version: data[0].version as number,
    updatedAt: (data[0].updated_at as string) ?? null,
    editedBy: (data[0].edited_by as string) ?? null,
  };
}
