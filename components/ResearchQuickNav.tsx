'use client';

import Link from 'next/link';
import { useHideOnScroll } from '@/lib/useHideOnScroll';

type NavItem = { label: string; href: string };

const TABS: NavItem[] = [
  { label: 'Overview',            href: '/research' },
  { label: 'About R&D Cell',      href: '/research/about-rdc' },
  { label: 'Research Areas',      href: '/research/areas' },
  { label: 'Committees',          href: '/research/committees' },
  { label: 'Sponsored Projects',  href: '/research/sponsored-projects' },
  { label: 'Research Centres',    href: '/research/centers' },
  { label: 'Facilities',          href: '/research/facilities' },
  { label: 'Policies',            href: '/research/policies' },
  { label: 'Publications',        href: '/research/publications' },
  { label: 'Downloads',           href: '/research/downloads' },
  { label: 'Contact Us',          href: '/research/support' },
];

export default function ResearchQuickNav({ active }: { active: string }) {
  const hidden = useHideOnScroll();

  return (
    <nav
      className={`relative bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[transform] duration-300 ease-out-quart ${
        hidden ? 'lg:-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Research sub-navigation"
    >
      {/* Mobile — wrapping pill buttons */}
      <div className="lg:hidden w-full px-4 py-3 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const isActive = t.href === active;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-3.5 py-1.5 rounded-full text-[0.8rem] font-medium border transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white border-primary font-semibold'
                  : 'bg-white text-muted border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop — horizontal tab strip */}
      <div
        className="hidden lg:flex items-stretch w-full px-6 md:px-10 lg:px-12 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {TABS.map((t) => {
          const isActive = t.href === active;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative shrink-0 flex items-center px-4 py-0 h-12 font-sans text-[0.875rem] whitespace-nowrap transition-colors duration-200 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted hover:text-foreground font-medium'
              }`}
            >
              {t.label}
              {/* Active underline */}
              <span
                aria-hidden
                className={`absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-primary opacity-100'
                    : 'bg-primary opacity-0 group-hover:opacity-30'
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
