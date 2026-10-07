import { revalidatePath } from 'next/cache';
import type { GlobalConfig } from 'payload';

import { CONTENT_SECTIONS, type SectionConfig, type SectionKey } from '@/lib/content/sections';

import { canEditSection } from './access';
import { toPayloadField } from './fields';
import { SECTION_KEYS, toGlobalSlug } from './slug';

/**
 * Admin sidebar grouping. Section labels read "Homepage — Hero", so the part
 * before the em dash is already the human name for the page; fall back to the
 * slug for any section that does not follow the convention.
 */
const PAGE_LABEL: Record<string, string> = {
  home: 'Homepage',
  placements: 'Placements',
  iqac: 'IQAC',
  site: 'Site-wide',
  info: 'Information pages',
  examinations: 'Examinations',
};

const groupFor = (key: SectionKey, config: SectionConfig): string => {
  const page = key.split('/')[0];
  if (PAGE_LABEL[page]) return PAGE_LABEL[page];
  const [prefix] = config.label.split('—');
  return prefix.trim() || page;
};

/** The section title as shown inside its group, without the redundant page prefix. */
const titleFor = (config: SectionConfig): string => {
  const parts = config.label.split('—');
  return (parts[1] ?? parts[0]).trim();
};

export const sectionGlobal = (key: SectionKey): GlobalConfig => {
  // CONTENT_SECTIONS is a plain object literal, so each key's type is its own
  // narrow shape rather than SectionConfig; widening here is what gives access
  // to the optional members (previewPath, liveDraft) the union drops.
  const config = CONTENT_SECTIONS[key] as SectionConfig;
  return {
    slug: toGlobalSlug(key),
    label: titleFor(config),
    admin: {
      group: groupFor(key, config),
      // Live Preview replaces the hand-rolled postMessage draft store: Payload
      // reloads the iframe itself, so it works on every section rather than
      // only the homepage ones that subscribed to the old store.
      livePreview: { url: ({ req }) => new URL(config.previewPath ?? '/', req.origin ?? '').href },
    },
    hooks: {
      afterChange: [
        () => {
          // Without this a publish only shows up when the page's 60s ISR
          // window lapses, which reads as "nothing happened" to whoever just
          // clicked Publish. Both paths are purged: the section's own page and
          // the homepage, since several sections render in both places.
          //
          // Wrapped because this config is also loaded outside a request —
          // `payload migrate`, the data migration script — where
          // revalidatePath has no store to act on and throws.
          try {
            revalidatePath('/');
            const path = config.previewPath;
            if (path && path !== '/') revalidatePath(path);
          } catch {
            // Not in a Next request context (CLI). Nothing to revalidate.
          }
        },
      ],
    },
    versions: { drafts: true, max: 20 },
    access: { read: () => true, update: canEditSection(key) },
    fields: config.fields.map(toPayloadField),
  };
};

export const sectionGlobals: GlobalConfig[] = SECTION_KEYS.map(sectionGlobal);
