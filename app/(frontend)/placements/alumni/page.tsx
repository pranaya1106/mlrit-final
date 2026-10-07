import { getSection } from '@/lib/content/client';

import PlacementsAlumniPageView from './PlacementsAlumniPageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function PlacementsAlumniPage() {
  const row = await getSection('placements', 'alumni').catch(() => null);
  return <PlacementsAlumniPageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
