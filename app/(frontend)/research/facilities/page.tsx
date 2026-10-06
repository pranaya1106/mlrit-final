import type { Metadata } from 'next';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { ResearchFacilities } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Research Facilities — MLRIT Research' };

export default function ResearchFacilitiesPage() {
  return (
    <>
      <ResearchQuickNav active="/research/facilities" />
      <ResearchFacilities />
    </>
  );
}
