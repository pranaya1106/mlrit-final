import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { Committees } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Research Committees — MLRIT Research' };

export default function CommitteesPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Research"
        title="Research Committees"
        italic="RAC & REC."
        dek="The Research Advisory Committee and Research Ethics Committee guide direction, review quality, and uphold standards for all research at MLRIT."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }, { label: 'Committees' }]}
      />
      <ResearchQuickNav active="/research/committees" />
      <Committees />
    </>
  );
}
