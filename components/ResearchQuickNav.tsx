import Link from 'next/link';

const RESEARCH_NAV = [
  { label: 'Overview',           href: '/research' },
  { label: 'Research Centres',   href: '/research/centers' },
  { label: 'Sponsored Projects', href: '/research/sponsored-projects' },
  { label: 'Research Scholars',  href: '/research/scholars' },
  { label: 'Doctoral Faculty',   href: '/research/doctoral-faculty' },
  { label: 'IPFC Centre',        href: '/research/ipfc' },
  { label: 'Publications',       href: '/research/publications' },
  { label: 'Patents (IPRs)',      href: '/research/patents' },
  { label: 'Consultancy',        href: '/research/consultancy' },
  { label: 'Entrepreneurship',   href: '/research/entrepreneurship' },
  { label: 'Policies & Forms',   href: '/research/policies' },
  { label: 'Support',            href: '/research/support' },
];

export default function ResearchQuickNav({ active }: { active: string }) {
  return (
    <nav className="bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top] duration-300 ease-out-quart">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {RESEARCH_NAV.map((l) => (
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
