import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import AboutQuickNav from '@/components/AboutQuickNav';
import MilestonesTimeline from '@/components/MilestonesTimeline';

export const metadata: Metadata = {
  title: 'Timeline — MLRIT',
  description: 'Two decades of MLRIT in milestones — from the foundation stone in 2005 to a nationally accredited institution.',
};

export default function TimelinePage() {
  return (
    <>
      <PageHeader
        eyebrow="Timeline"
        title="Two decades in"
        italic="eight moments."
        dek="From the foundation stone in 2005 to a nationally accredited institution — the institutional milestones that shaped MLRIT."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Timeline' }]}
        variant="green"
      />
      <AboutQuickNav active="/about/timeline" />
      <MilestonesTimeline />
    </>
  );
}
