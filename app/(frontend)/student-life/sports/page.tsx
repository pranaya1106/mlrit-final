import type { Metadata } from 'next';
import SportsPage from './SportsPage';

export const metadata: Metadata = {
  title: 'Sports at MLRIT — Champions in the Making',
  description:
    'World-class indoor stadium, floodlit cricket ground, resident coaching staff, and a legacy of national and international champions. Explore sports life at MLR Institute of Technology.',
};

export default function Page() {
  return <SportsPage />;
}
