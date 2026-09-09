import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { AboutRDCell } from '@/components/ResearchOverviewSections';

export const metadata: Metadata = { title: 'About R&D Cell — MLRIT Research' };

export default function AboutRDCPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Research"
        title="About the R&D Cell"
        italic="at MLR Institute of Technology."
        dek="The independent R&D Cell promotes, monitors and elevates the research culture across faculty, scholars and student innovators."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }, { label: 'About R&D Cell' }]}
      />
      <ResearchQuickNav active="/research/about-rdc" />
      <AboutRDCell />
    </>
  );
}
