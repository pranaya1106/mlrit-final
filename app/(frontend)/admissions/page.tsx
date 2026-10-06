import { getSection } from '@/lib/content/client';

import AdmissionsPageView from './AdmissionsPageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function AdmissionsPage() {
  const row = await getSection('admissions', 'overview').catch(() => null);
  return <AdmissionsPageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
