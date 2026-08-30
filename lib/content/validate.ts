import {
  asGalleryItems,
  asRepeaterItems,
  getSectionConfig,
  isGalleryField,
  isListField,
  isMediaField,
  isRepeaterField,
} from './sections';

export type FieldError = { error: string; field: string };

/** blob:/data: are document-scoped handles that must never reach the database. */
const TRANSIENT = /^(blob|data):/i;

const schemeOf = (value: string): string => value.slice(0, value.indexOf(':'));

/**
 * Rejects transient media values before they can be persisted.
 *
 * A blob:/data: URL is a handle into one document's memory. Persisted, it
 * renders as a permanently broken <video>/<img> for every visitor — this
 * happened once already, reaching content_blocks and the live homepage.
 *
 * Covers single image/video fields, every item inside a gallery, and every
 * column of every repeater row: an upload still in flight when Save is pressed
 * would otherwise write its placeholder. Repeaters hold no uploads today, but
 * they are walked anyway — a pasted blob: URL in a text column is the same
 * broken value, and the guard should not depend on a field type never gaining
 * media later.
 *
 * Returns null when the record is acceptable, or the error to send back.
 * Pure and dependency-free so it can be unit-tested without the auth layer or
 * an HTTP request in front of it.
 */
export function findTransientMediaError(
  page: string,
  section: string,
  record: Record<string, unknown>
): FieldError | null {
  const checkedFields =
    getSectionConfig(page, section)?.fields.filter(
      (field) => isMediaField(field) || isListField(field)
    ) ?? [];

  for (const field of checkedFields) {
    const value = record[field.name];

    if (isRepeaterField(field)) {
      // Row index is 1-based to match the position shown beside each row in
      // the editor; the column name locates it within that row.
      const rows = asRepeaterItems(value);
      for (let i = 0; i < rows.length; i += 1) {
        for (const [column, cell] of Object.entries(rows[i])) {
          if (column === 'id') continue;
          if (typeof cell === 'string' && TRANSIENT.test(cell)) {
            return {
              error: `${field.label}: row ${i + 1} (${column}) holds a ${schemeOf(cell)}: URL, which cannot be saved.`,
              field: field.name,
            };
          }
        }
      }
      continue;
    }

    if (isGalleryField(field)) {
      // Index is 1-based in the message: editors count items, not offsets.
      const items = asGalleryItems(value);
      for (let i = 0; i < items.length; i += 1) {
        const key = items[i].key;
        if (typeof key === 'string' && TRANSIENT.test(key)) {
          return {
            error: `${field.label}: image ${i + 1} is still uploading (${schemeOf(key)}: URL). Wait for it to finish, then save.`,
            field: field.name,
          };
        }
      }
      continue;
    }

    if (typeof value === 'string' && TRANSIENT.test(value)) {
      return {
        error: `${field.label} must be an uploaded asset, not a ${schemeOf(value)}: URL. Wait for the upload to finish, then save.`,
        field: field.name,
      };
    }
  }

  return null;
}
