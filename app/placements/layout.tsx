'use client';

import { usePathname } from 'next/navigation';
import PlacementsWall from '@/components/placements/PlacementsWall';
import PlacementsQuickNav from '@/components/PlacementsQuickNav';

export default function PlacementsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="bg-white">
      <PlacementsWall />
      <PlacementsQuickNav active={pathname} />
      {children}
    </div>
  );
}
