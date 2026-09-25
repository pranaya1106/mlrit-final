import type { Metadata } from 'next';
import CAMEClubPage from './CAMEClubPage';

export const metadata: Metadata = {
  title: 'CAME — Creating Aspirations for Meeting Elevation | MLRIT',
  description:
    'CAME Club MLRIT — the cultural and student engagement platform of MLR Institute of Technology. Dance, music, drama, and event coordination across Hellenic, Navrat Naveli, Ecstacy, Kite Fest, and Annual Day.',
};

export default function Page() {
  return <CAMEClubPage />;
}
