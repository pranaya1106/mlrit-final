import type { Metadata } from 'next';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { Downloads } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'Downloads — MLRIT Research' };

export default function ResearchDownloadsPage() {
  return (
    <>
      <ResearchQuickNav active="/research/downloads" />
      <Downloads />
    </>
  );
}
