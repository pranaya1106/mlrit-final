import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import FacilitiesGrid from './FacilitiesGrid';

export const metadata: Metadata = {
  title: 'Facilities & Amenities | Life at MLR Institute of Technology',
  description:
    'Solar-powered 31-acre green campus with cafeteria, STI Hub, hospital, stationery store, and ATM — everything you need within walking distance.',
};

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        tone="light"
        eyebrow="Campus · Life"
        title="Facilities &"
        italic="Amenities"
        dek="A solar-powered, 31-acre green campus built around student life — with every daily need within walking distance."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Life at MLR', href: '/student-life' },
          { label: 'Facilities & Amenities' },
        ]}
      />
      <FacilitiesGrid />
    </>
  );
}
