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

/** Thrown when the write cannot proceed; `code` tells the route what to say. */
export class SectionWriteError extends Error {
  constructor(public code: 'CONFLICT' | 'MISSING') {
    super(code);
    this.name = 'SectionWriteError';
  }
}

/**
 * Optimistic-concurrency write, creating the row on a section's first save.
 *
 * Updates only if the stored version still matches `expectedVersion`. When no
 * row matches and this is the first save (`expectedVersion === 1`), the row is
 * INSERTed instead — a section added to CONTENT_SECTIONS has no row until
 * someone saves it, and before this it was permanently unsavable with a
 * misleading "someone else saved changes" conflict.
 *
 * The insert relies on the (page_slug, section_key) unique constraint rather
 * than a check-then-write: two simultaneous first saves both attempt the
 * insert, the database rejects the loser, and it surfaces as a real conflict
 * instead of one silently overwriting the other.
 *
 * Throws SectionWriteError('CONFLICT') when the row moved on, and
 * ('MISSING') when it expected an existing row and found none.
 */
export async function saveSection(
  pageSlug: string,
  sectionKey: string,
  content: object,
  expectedVersion: number,
  editedBy: string | null = null
): Promise<SectionRow> {
  const client = getServiceClient();
  const SELECT = 'content, version, updated_at, edited_by';

  const toRow = (row: Record<string, unknown>): SectionRow => ({
    content: row.content as Record<string, unknown>,
    version: row.version as number,
    updatedAt: (row.updated_at as string) ?? null,
    editedBy: (row.edited_by as string) ?? null,
  });

  const { data, error } = await client
    .from('content_blocks')
    .update({ content, version: expectedVersion + 1, edited_by: editedBy })
    .eq('page_slug', pageSlug)
    .eq('section_key', sectionKey)
    .eq('version', expectedVersion)
    .select(SELECT);

  if (error) throw error;
  if (data && data.length > 0) return toRow(data[0]);

  // Nothing matched. Either the row exists at a different version (a genuine
  // conflict), or it does not exist at all.
  if (expectedVersion !== 1) {
    const existing = await client
      .from('content_blocks')
      .select('version')
      .eq('page_slug', pageSlug)
      .eq('section_key', sectionKey)
      .maybeSingle();

    throw new SectionWriteError(existing.data ? 'CONFLICT' : 'MISSING');
  }

  // First save of a new section: create it. Version starts at 2 so that every
  // save increments, matching what the editor already displays.
  const created = await client
    .from('content_blocks')
    .insert({
      page_slug: pageSlug,
      section_key: sectionKey,
      content,
      version: expectedVersion + 1,
      edited_by: editedBy,
    })
    .select(SELECT)
    .single();

  if (created.error) {
    // 23505 = unique_violation: the row appeared between our update and insert,
    // or already existed at a version other than 1. Either way it is a conflict.
    if (created.error.code === '23505') throw new SectionWriteError('CONFLICT');
    throw created.error;
  }

  return toRow(created.data as Record<string, unknown>);
}
