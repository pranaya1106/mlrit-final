import type { Metadata } from 'next';
import CODEClubPage from './CODEClubPage';

export const metadata: Metadata = {
  title: 'CODE Club — Department Programming Home | MLRIT',
  description:
    'CODE Club MLRIT — the department-level programming home for every year, from a first "Hello, World" to final-year system design interviews. Weekly problem sets, peer debugging, and placement prep.',
};

export default function Page() {
  return <CODEClubPage />;
}
