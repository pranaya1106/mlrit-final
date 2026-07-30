'use client';

import Link from 'next/link';
import { useHideOnScroll } from '@/lib/useHideOnScroll';

const RESEARCH_NAV = [
  { label: 'Overview',           href: '/research' },
  { label: 'Research Centres',   href: '/research/centers' },
  { label: 'Sponsored Projects', href: '/research/sponsored-projects' },
  { label: 'Research Scholars',  href: '/research/scholars' },
  { label: 'Doctoral Faculty',   href: '/research/doctoral-faculty' },
  { label: 'IPFC Centre',        href: '/research/ipfc' },
  { label: 'Publications',       href: '/research/publications' },
  { label: 'Patents (IPRs)',     href: '/research/patents' },
  { label: 'Consultancy',        href: '/research/consultancy' },
  { label: 'Entrepreneurship',   href: '/research/entrepreneurship' },
  { label: 'Policies & Forms',   href: '/research/policies' },
  { label: 'Support',            href: '/research/support' },
];

export default function ResearchQuickNav({ active }: { active: string }) {
  const hidden = useHideOnScroll();
  return (
    <nav
      className={`relative bg-white/95 backdrop-blur-md border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top,transform] duration-300 ease-out-quart lg:translate-y-0 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Research sub-navigation"
    >
      <span aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="flex flex-wrap gap-2 py-3 lg:hidden">
          {RESEARCH_NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3.5 py-2 rounded-full text-[0.82rem] font-medium border transition-colors whitespace-nowrap ${
                l.href === active
                  ? 'bg-primary text-white border-primary font-semibold'
                  : 'bg-white text-muted border-border hover:border-primary hover:text-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {RESEARCH_NAV.map((l) => {
            const isActive = l.href === active;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative shrink-0 px-4 py-4 font-sans text-[0.9rem] whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'text-primary font-bold' : 'text-muted hover:text-foreground font-medium'
                }`}
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                  {l.label}
                </span>
                <span
                  aria-hidden
                  className={`absolute left-3 right-3 bottom-0 h-[3px] rounded-full transition-all duration-300 ${
                    isActive ? 'bg-primary opacity-100' : 'bg-primary opacity-0 group-hover:opacity-40'
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
