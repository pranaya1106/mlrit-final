import { getInfoPage, type InfoPage } from '@/lib/info-pages';

/**
 * An info page with its CMS overrides applied.
 *
 * The bundled INFO_PAGES entry is the fallback, exactly like every section
 * component on the homepage: an empty or missing CMS value leaves the shipped
 * copy in place, so an unsaved page renders as before.
 *
 * Only the header fields are editable for now. `blocks` is a 20-kind
 * discriminated union and needs a real block editor, which is a separate
 * build — see the note on info/pages in CONTENT_SECTIONS.
 */
export async function getInfoPageContent(slug: string): Promise<InfoPage | null> {
  const base = getInfoPage(slug);
  if (!base) return null;

  try {
    const [{ getSection }, { asRepeaterItems, asText }] = await Promise.all([
      import('@/lib/content/client'),
      import('@/lib/content/sections'),
    ]);

    const row = await getSection('info', 'pages');
    const rows = asRepeaterItems((row?.content as Record<string, unknown> | undefined)?.pages);
    const match = rows.find((r) => asText(r.slug) === slug);
    if (!match) return base;

    return {
      ...base,
      eyebrow: asText(match.eyebrow, base.eyebrow),
      title: asText(match.title, base.title),
      italic: asText(match.italic, base.italic ?? '') || undefined,
      dek: asText(match.dek, base.dek),
    };
  } catch {
    // A CMS lookup must never take a public page down.
    return base;
  }
}
