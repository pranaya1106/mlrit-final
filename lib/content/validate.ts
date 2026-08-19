import { getSectionConfig, isMediaField } from './sections';

export type FieldError = { error: string; field: string };

/**
 * Rejects transient media values before they can be persisted.
 *
 * A blob:/data: URL is a handle into one document's memory. Persisted, it
 * renders as a permanently broken <video>/<img> for every visitor — this
 * happened once already, reaching content_blocks and the live homepage.
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
  const mediaFields = getSectionConfig(page, section)?.fields.filter(isMediaField) ?? [];

  for (const field of mediaFields) {
    const value = record[field.name];
    if (typeof value === 'string' && /^(blob|data):/i.test(value)) {
      const scheme = value.slice(0, value.indexOf(':'));
      return {
        error: `${field.label} must be an uploaded asset, not a ${scheme}: URL. Wait for the upload to finish, then save.`,
        field: field.name,
      };
    }
  }

  return null;
}
