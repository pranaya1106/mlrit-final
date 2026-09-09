import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { ResearchFacilities } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Research Facilities — MLRIT Research' };

export default function ResearchFacilitiesPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Research"
        title="Research Facilities"
        italic="labs & resources."
        dek="Purpose-built laboratories backed by industry-grade tooling. Faculty and scholars get day-to-day access to the resources they need."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }, { label: 'Facilities' }]}
      />
      <ResearchQuickNav active="/research/facilities" />
      <ResearchFacilities />
    </>
  );
}
