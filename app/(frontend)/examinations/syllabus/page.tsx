import { getSection } from '@/lib/content/client';

import SyllabusPageView from './SyllabusPageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function SyllabusPage() {
  const row = await getSection('examinations', 'syllabus').catch(() => null);
  return <SyllabusPageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
