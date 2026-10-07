import { CONTENT_SECTIONS, type SectionKey } from '@/lib/content/sections';

export const SECTION_KEYS = Object.keys(CONTENT_SECTIONS) as SectionKey[];

/**
 * Payload slugs cannot contain `/`, so `home/hero` is addressed as `home-hero`.
 *
 * The reverse is an exact lookup rather than a split, because page slugs are
 * not dash-free: `student-life/overview` and a hypothetical
 * `student/life-overview` both render as `student-life-overview`, and splitting
 * at the first dash would silently route one to the other. Building the map
 * from CONTENT_SECTIONS makes such a collision a startup error instead.
 */
export const toGlobalSlug = (sectionKey: string): string => sectionKey.replace('/', '-');

const BY_SLUG = new Map<string, { page: string; section: string }>();

for (const key of SECTION_KEYS) {
  const slug = toGlobalSlug(key);
  const existing = BY_SLUG.get(slug);
  if (existing) {
    throw new Error(
      `Section keys "${existing.page}/${existing.section}" and "${key}" both produce the ` +
        `Payload global slug "${slug}". Rename one of them.`
    );
  }
  const [page, ...rest] = key.split('/');
  BY_SLUG.set(slug, { page, section: rest.join('/') });
}

export const fromGlobalSlug = (globalSlug: string): { page: string; section: string } => {
  const found = BY_SLUG.get(globalSlug);
  if (!found) throw new Error(`Not a section global slug: ${globalSlug}`);
  return found;
};
