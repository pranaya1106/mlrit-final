import { getSection } from '@/lib/content/client';

import ByDegreePageView from './ByDegreePageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function ByDegreePage() {
  const row = await getSection('admissions', 'by-degree').catch(() => null);
  return <ByDegreePageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
