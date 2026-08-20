import type { Metadata } from 'next';
import RoboticsClubPage from './RoboticsClubPage';

export const metadata: Metadata = {
  title: 'Robotics Club | MLR Institute of Technology',
  description:
    'The Robotics Club at MLRIT — a technical student community exploring robotics, AI, embedded systems, and automation through hands-on projects, competitions, and workshops.',
};

export default function Page() {
  return <RoboticsClubPage />;
}
