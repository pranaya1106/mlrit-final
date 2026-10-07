import { getSection } from '@/lib/content/client';

import InternalGovernancePageView from './InternalGovernancePageView';

/**
 * Server half of page.tsx: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function InternalGovernancePage() {
  const row = await getSection('about', 'internal-governance').catch(() => null);
  return <InternalGovernancePageView content={(row?.content ?? {}) as Record<string, unknown>} />;
}
