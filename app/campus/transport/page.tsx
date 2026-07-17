import type { Metadata } from 'next';
import TransportHero from './TransportHero';
import TransportRoutes from './TransportRoutes';
import { BUS_ROUTES } from '@/lib/transport-routes';

export const metadata: Metadata = {
  title: 'Transport — MLRIT',
  description:
    'Institute-operated bus services connecting Hyderabad to the MLRIT campus at Dundigal. Find your route, stops and timings.',
};

export default function TransportPage() {
  return (
    <>
      <TransportHero />
      <TransportRoutes routes={BUS_ROUTES} />
    </>
  );
}
