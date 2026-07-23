import Link from 'next/link';
import { PLACEMENTS_NAV } from '@/lib/placements';

export default function PlacementsQuickNav({ active }: { active: string }) {
  return (
    <nav
      className="bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top] duration-300 ease-out-quart"
      aria-label="Placements sections"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {PLACEMENTS_NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.href === active ? 'page' : undefined}
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
