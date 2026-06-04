import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import AboutQuickNav from '@/components/AboutQuickNav';
import MilestonesTimeline from '@/components/MilestonesTimeline';
import LeadershipCards from '@/components/LeadershipCards';

export default function LegacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legacy"
        title="Two decades of"
        italic="building futures."
        dek="From a foundation stone in 2005 to a nationally accredited institution — the story of MLRIT in milestones, leadership and enduring commitment."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Legacy' }]}
        variant="green"
      />
      <AboutQuickNav active="/about/legacy" />

      {/* Institutional Timeline */}
      <MilestonesTimeline />

      {/* Leadership & Governance */}
      <LeadershipCards />
    </>
  );
}
