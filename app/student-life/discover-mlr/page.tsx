import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import VirtualTourSection from './VirtualTourSection';

export const metadata: Metadata = {
  title: 'Discover MLR — Virtual Campus Tour | MLRIT',
  description:
    'Step inside MLRIT through official 360° panoramas. Explore classrooms, labs, sports facilities, the library, cafeteria, and every corner of our Hyderabad campus.',
};

export default function DiscoverMLRPage() {
  return (
    <>
      <PageHeader
        tone="light"
        eyebrow="Life at MLR · Explore"
        title="Discover MLR"
        italic="in 360°."
        dek="Step inside every corner of our campus through official Google Street View panoramas — no flight required."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Life at MLR', href: '/student-life' },
          { label: 'Discover MLR' },
        ]}
      />
      <VirtualTourSection />
    </>
  );
}
