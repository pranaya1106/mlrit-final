import { asText } from '@/lib/content/sections';

/** Bundled prospectus, used until one is uploaded. */
export const DEFAULT_BROCHURE = '/admissions/mlrit-brochure.pdf';

/**
 * The brochure URL, resolved once on the server.
 *
 * It is linked from the admissions page, the floating side button and the
 * chatbot, each of which hardcoded the same path — so replacing the PDF meant
 * finding all three. They now read this.
 */
export async function getBrochureUrl(): Promise<string> {
  try {
    const [{ getSection }, { resolveAssetUrl }] = await Promise.all([
      import('@/lib/content/client'),
      import('@/lib/cdn/url'),
    ]);
    const row = await getSection('site', 'documents');
    const key = asText((row?.content as Record<string, unknown> | undefined)?.brochure);
    return (key && resolveAssetUrl(key)) || DEFAULT_BROCHURE;
  } catch {
    return DEFAULT_BROCHURE;
  }
}
