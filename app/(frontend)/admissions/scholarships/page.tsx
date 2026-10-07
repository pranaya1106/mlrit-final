import { getSection } from '@/lib/content/client';

import ScholarshipsPageView from './ScholarshipsPageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function ScholarshipsPage() {
  const row = await getSection('admissions', 'scholarships').catch(() => null);
  return <ScholarshipsPageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
