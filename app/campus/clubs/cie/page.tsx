import type { Metadata } from 'next';
import CIEClubPage from './CIEClubPage';

export const metadata: Metadata = {
  title: 'CIE — Centre for Innovation & Entrepreneurship | MLRIT',
  description:
    'CIE is MLRIT’s student-run innovation and entrepreneurship centre — five verticals, hackathons, workshops, mentorship and incubation. Ideate. Build. Innovate.',
};

export default function Page() {
  return <CIEClubPage />;
}
