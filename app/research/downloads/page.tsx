import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { Downloads } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Downloads — MLRIT Research' };

export default function ResearchDownloadsPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Research"
        title="Downloads"
        italic="forms & documents."
        dek="Research-related forms and policy documents available from the R&D Cell. Request any document by writing to deanresearch@mlrit.ac.in."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }, { label: 'Downloads' }]}
      />
      <ResearchQuickNav active="/research/downloads" />
      <Downloads />
    </>
  );
}
