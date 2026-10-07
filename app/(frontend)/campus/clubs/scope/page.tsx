import type { Metadata } from 'next';
import SCOPEClubPage from './SCOPEClubPage';

export const metadata: Metadata = {
  title: 'SCOPE — School of Programming Excellence | MLRIT',
  description:
    'SCOPE Club MLRIT — a student-led technical community built around coding, curiosity, and learning by doing. Workshops, hackathons, open source, and CodeStats — the platform SCOPE built and maintains for MLRIT.',
};

export default function Page() {
  return <SCOPEClubPage />;
}
