import type { Metadata } from 'next';
import EWBClubPage from './EWBClubPage';

export const metadata: Metadata = {
  title: 'EWB-IUCEE-IEEE — Engineering Ideas, Empowering Communities | MLRIT',
  description:
    'EWB-IUCEE-IEEE MLRIT Student Chapter — engineering ideas into community impact through sustainability projects, design thinking, global collaboration, and technical innovation since 2016.',
};

export default function Page() {
  return <EWBClubPage />;
}
