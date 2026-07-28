import type { Metadata } from 'next';
import VirtualTourSection from './VirtualTourSection';

export const metadata: Metadata = {
  title: 'Discover MLR — Virtual Campus Tour | MLRIT',
  description:
    'Step inside MLRIT through official 360° panoramas. Explore classrooms, labs, sports facilities, the library, cafeteria, and every corner of our Hyderabad campus.',
};

export default function DiscoverMLRPage() {
  return <VirtualTourSection />;
}
