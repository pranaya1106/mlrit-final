import type { Metadata } from 'next';
import ClubsPage from './ClubsPage';

export const metadata: Metadata = {
  title: 'Clubs & Societies | MLR Institute of Technology',
  description:
    'Explore 30+ student-led clubs at MLRIT — technical, cultural, social, sports, literary, innovation, and entrepreneurship communities that celebrate campus life.',
};

export default function Page() {
  return <ClubsPage />;
}
