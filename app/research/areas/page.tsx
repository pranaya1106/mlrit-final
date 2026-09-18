import type { Metadata } from 'next';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { ResearchAreas } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Research Areas & Thrust Areas — MLRIT Research' };

export default function ResearchAreasPage() {
  return (
    <>
      <ResearchQuickNav active="/research/areas" />
      <ResearchAreas />
    </>
  );
}
