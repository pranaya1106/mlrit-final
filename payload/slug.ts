import { CONTENT_SECTIONS, type SectionKey } from '@/lib/content/sections';

/**
 * Payload slugs cannot contain `/`, so `home/hero` is addressed as `home-hero`.
 *
 * The round trip splits at the FIRST dash, which is only unambiguous while no
 * page slug contains one. Every current page slug (home, placements, iqac,
 * site, info, examinations) is a single word; the assertion below fails the
 * build rather than silently routing `a-b/c` to the wrong global if someone
 * later adds a hyphenated page.
 */
export const toGlobalSlug = (sectionKey: string): string => sectionKey.replace('/', '-');

export const fromGlobalSlug = (globalSlug: string): { page: string; section: string } => {
  const dash = globalSlug.indexOf('-');
  if (dash === -1) throw new Error(`Not a section global slug: ${globalSlug}`);
  return { page: globalSlug.slice(0, dash), section: globalSlug.slice(dash + 1) };
};

export const SECTION_KEYS = Object.keys(CONTENT_SECTIONS) as SectionKey[];

for (const key of SECTION_KEYS) {
  const page = key.split('/')[0];
  if (page.includes('-')) {
    throw new Error(
      `Page slug "${page}" contains a dash, which makes the Payload global slug ` +
        `"${toGlobalSlug(key)}" ambiguous. Give fromGlobalSlug an explicit map first.`
    );
  }
}
