'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Tabs that scroll to a section on the /research overview page use anchor hrefs.
// Tabs that have their own sub-page use the full path.
const TABS = [
  { label: 'Overview',           href: '/research',                    anchor: true  },
  { label: 'About R&D Cell',     href: '/research#about-rdc',          anchor: true  },
  { label: 'Research Areas',     href: '/research#areas',              anchor: true  },
  { label: 'Committees',         href: '/research#committees',         anchor: true  },
  { label: 'Sponsored Projects', href: '/research/sponsored-projects', anchor: false },
  { label: 'Research Centres',   href: '/research/centers',            anchor: false },
  { label: 'Facilities',         href: '/research#facilities',         anchor: true  },
  { label: 'Policies',           href: '/research/policies',           anchor: false },
  { label: 'Publications',       href: '/research/publications',       anchor: false },
  { label: 'Downloads',          href: '/research#downloads',          anchor: true  },
  { label: 'Contact Us',         href: '/research/support',            anchor: false },
];

export default function ResearchQuickNav({ active }: { active: string }) {
  const pathname = usePathname();
  const onOverview = pathname === '/research';

  return (
    <nav
      className="relative bg-white border-b border-border sticky top-[var(--subnav-top)] z-30"
      aria-label="Research sub-navigation"
    >
      {/* Mobile — wrapping pill buttons */}
      <div className="lg:hidden w-full px-4 py-3 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const isActive = t.href === active || (!t.anchor && t.href === active);
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
          // On the overview page, anchor tabs are all "part of" the active page.
          // On sub-pages, only the exact path match is active.
          const isActive = onOverview
            ? t.anchor
              ? active === '/research' && t.href === '/research'
                ? true
                : false
              : t.href === active
            : t.href === active;

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
