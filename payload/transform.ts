import {
  fieldType,
  getSectionConfig,
  type FieldConfig,
} from '@/lib/content/sections';

/**
 * Translation between the shape content_blocks stores and the shape Payload
 * stores. The two differ in exactly one way, so this stays small: list items
 * carry a content-level `id` that must survive reordering, while Payload mints
 * its own row `id`. The content one travels as `itemId`.
 *
 * Everything else — field names, strings, numbers, media values — is identical
 * on both sides, which is what makes the migration lossless and reversible.
 */

const PAYLOAD_ONLY = new Set(['id', 'createdAt', 'updatedAt', 'globalType', '_status']);

const isList = (field: FieldConfig): boolean => {
  const type = fieldType(field);
  return type === 'gallery' || type === 'repeater';
};

type Row = Record<string, unknown>;

/** content_blocks item -> Payload array row. */
const toPayloadRow = (item: Row): Row => {
  const { id, ...rest } = item;
  return { ...rest, itemId: typeof id === 'string' ? id : undefined };
};

/** Payload array row -> content_blocks item, restoring the stable id. */
const toContentItem = (row: Row): Row => {
  const item: Row = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === 'itemId' || PAYLOAD_ONLY.has(key)) continue;
    if (value !== null) item[key] = value;
  }
  // Fall back to Payload's row id only when itemId is missing — a row added in
  // the Payload admin before a save has populated itemId.
  item.id = typeof row.itemId === 'string' && row.itemId ? row.itemId : String(row.id ?? '');
  return item;
};

/**
 * Only fields the section actually declares cross over. A stored blob can
 * carry keys from a since-renamed or deleted field; Payload would reject or
 * silently drop them, and carrying them would make the verification pass
 * report a false mismatch.
 */
export function toPayloadData(
  pageSlug: string,
  sectionKey: string,
  content: Record<string, unknown>
): { data: Record<string, unknown>; dropped: string[] } {
  const config = getSectionConfig(pageSlug, sectionKey);
  if (!config) throw new Error(`No section config for ${pageSlug}/${sectionKey}`);

  const known = new Set(config.fields.map((field) => field.name));
  const dropped = Object.keys(content).filter((key) => !known.has(key));
  const data: Record<string, unknown> = {};

  for (const field of config.fields) {
    const value = content[field.name];
    if (value === undefined) continue;

    if (isList(field)) {
      data[field.name] = Array.isArray(value) ? value.map((item) => toPayloadRow(item as Row)) : [];
    } else {
      data[field.name] = value;
    }
  }

  return { data, dropped };
}

/**
 * Payload global -> the content blob every component already reads. This is
 * what lets the site keep its existing call sites: <Copy k="..."> and
 * asRepeaterItems() see exactly what they saw when Supabase served them.
 */
export function toContent(
  pageSlug: string,
  sectionKey: string,
  global: Record<string, unknown>
): Record<string, unknown> {
  const config = getSectionConfig(pageSlug, sectionKey);
  if (!config) throw new Error(`No section config for ${pageSlug}/${sectionKey}`);

  const content: Record<string, unknown> = {};

  for (const field of config.fields) {
    const value = global[field.name];
    if (value === undefined || value === null) continue;

    if (isList(field)) {
      content[field.name] = Array.isArray(value) ? value.map((row) => toContentItem(row as Row)) : [];
    } else {
      content[field.name] = value;
    }
  }

  return content;
}
