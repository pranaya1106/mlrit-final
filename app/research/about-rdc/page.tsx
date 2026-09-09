import type { Metadata } from 'next';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { AboutRDCell } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'About R&D Cell — MLRIT Research' };

export default function AboutRDCPage() {
  return (
    <>
      <ResearchQuickNav active="/research/about-rdc" />
      <AboutRDCell />
    </>
  );
}
