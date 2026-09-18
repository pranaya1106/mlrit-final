import type { Metadata } from 'next';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { Committees } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Research Committees — MLRIT Research' };

export default function CommitteesPage() {
  return (
    <>
      <ResearchQuickNav active="/research/committees" />
      <Committees />
    </>
  );
}
