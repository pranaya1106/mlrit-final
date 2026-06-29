import Link from 'next/link';

const PLACEMENTS_NAV = [
  { label: 'Overview',         href: '/placements/overview' },
  { label: 'Training & Statistics', href: '/placements/training' },
  { label: 'Recruiters & MoUs',href: '/placements/recruiters' },
  { label: 'Placement Drives',  href: '/placements/statistics' },
  { label: 'Alumni',           href: '/placements/alumni' },
  { label: 'Support',          href: '/placements/support' },
];

export default function PlacementsQuickNav({ active }: { active: string }) {
  return (
    <nav className="bg-white border-b border-border sticky top-[var(--header-h)] z-30">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {PLACEMENTS_NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                l.href === active
                  ? 'text-foreground border-primary font-semibold'
                  : 'text-muted hover:text-foreground border-transparent hover:border-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
