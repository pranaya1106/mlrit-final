import PageHeader from '@/components/PageHeader';
import AboutQuickNav from '@/components/AboutQuickNav';
import LeadershipCards from '@/components/LeadershipCards';

export default function LegacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legacy"
        title="Founding"
        italic="voices."
        dek="Messages from the Founder and Chairman of MLRIT — the vision and values that have guided the institution since 2005."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Legacy' }]}
        variant="green"
      />
      <AboutQuickNav active="/about/legacy" />

      {/* Founder & Chairman messages */}
      <LeadershipCards />
    </>
  );
}
