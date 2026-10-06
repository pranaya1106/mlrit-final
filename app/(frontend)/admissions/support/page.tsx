import { getSection } from '@/lib/content/client';

import SupportPageView from './SupportPageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function SupportPage() {
  const row = await getSection('admissions', 'support').catch(() => null);
  return <SupportPageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
