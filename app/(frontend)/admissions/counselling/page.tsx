import { getSection } from '@/lib/content/client';

import CounsellingPageView from './CounsellingPageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function CounsellingPage() {
  const row = await getSection('admissions', 'counselling').catch(() => null);
  return <CounsellingPageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
