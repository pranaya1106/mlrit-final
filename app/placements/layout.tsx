'use client';

import { usePathname } from 'next/navigation';
import PlacementsWall from '@/components/placements/PlacementsWall';

export default function PlacementsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOverview = pathname === '/placements/overview';

  return (
    <div className="bg-white">
      {isOverview && <PlacementsWall />}
      {children}
    </div>
  );
}
