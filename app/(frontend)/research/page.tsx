import type { Metadata } from 'next';
import ResearchHero from '@/components/ResearchHero';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import ResearchOverviewSections from '@/components/ResearchOverviewSections';

export const metadata: Metadata = {
  title: 'Research & Development — MLRIT',
  description:
    'Research and innovation at MLR Institute of Technology — R&D Cell, research areas, committees, sponsored projects, centres, facilities, publications and contact.',
};

export default function ResearchPage() {
  return (
    <>
      <ResearchHero
        title="Research and Development"
        italic="at MLR Institute of Technology."
        dek="MLR Institute of Technology drives research through an independent R&D Cell — promoting, monitoring and elevating the research culture across faculty, scholars and student innovators."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }, { label: 'Overview' }]}
      />
      <ResearchQuickNav active="/research" />
      <ResearchOverviewSections />
    </>
  );
}
