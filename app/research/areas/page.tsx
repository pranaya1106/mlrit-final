import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { ResearchAreas } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Research Areas & Thrust Areas — MLRIT Research' };

export default function ResearchAreasPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Research"
        title="Research Areas"
        italic="& Thrust Areas."
        dek="Six departments, each with defined thrust areas aligned to industry need, national priority programmes, and doctoral supervisor expertise."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }, { label: 'Research Areas' }]}
      />
      <ResearchQuickNav active="/research/areas" />
      <ResearchAreas />
    </>
  );
}
