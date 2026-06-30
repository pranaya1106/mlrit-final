import Link from 'next/link';

const ABOUT_NAV = [
  { label: 'Introduction',        href: '/about/vision-mission/introduction' },
  { label: 'Vision & Mission',    href: '/about/vision-mission/vision-mission' },
  { label: 'Legacy',              href: '/about/legacy' },
  { label: 'Timeline',            href: '/about/timeline' },
  { label: 'Rankings & Awards',   href: '/about/rankings-awards' },
  { label: 'Internal Governance', href: '/about/internal-governance' },
];

export default function AboutQuickNav({ active }: { active: string }) {
  return (
    <nav className="bg-white border-b border-border sticky top-[var(--header-h)] z-30">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {ABOUT_NAV.map((l) => (
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
