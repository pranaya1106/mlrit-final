'use client';

import Link from 'next/link';
import { useHideOnScroll } from '@/lib/useHideOnScroll';

const ABOUT_NAV = [
  {
    label: 'Overview',
    href: '/about',
    sections: [
      { id: 'story',   label: 'Our Story'   },
      { id: 'pillars', label: 'Six Pillars' },
    ],
  },
  {
    label: 'Vision & Mission',
    href: '/about/vision-mission/vision-mission',
    sections: [
      { id: 'vision',  label: 'Vision'      },
      { id: 'mission', label: 'Mission'     },
      { id: 'values',  label: 'Core Values' },
    ],
  },
  { label: 'Legacy',              href: '/about/legacy',              sections: [] },
  { label: 'Timeline',            href: '/about/timeline',            sections: [] },
  {
    label: 'Rankings & Awards',
    href: '/about/rankings-awards',
    sections: [
      { id: 'stats',  label: 'Accreditations' },
      { id: 'awards', label: 'Awards'         },
    ],
  },
  { label: 'Internal Governance', href: '/about/internal-governance', sections: [] },
];

export default function AboutQuickNav({ active }: { active: string }) {
  const hidden = useHideOnScroll();
  const activeItem = ABOUT_NAV.find((l) => l.href === active);
  const activeSections = activeItem?.sections ?? [];

  return (
    <nav
      className={`relative bg-white/95 backdrop-blur-md border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top,transform] duration-300 ease-out-quart lg:translate-y-0 ${
        hidden ? 'lg:-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="About sub-navigation"
    >
      <span aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="w-full px-4 md:px-10 lg:px-12">
        {/* Mobile / tablet — compact pills, wraps so every option is visible without scrolling */}
        <div className="flex flex-wrap gap-1 py-1.5 lg:hidden">
          {ABOUT_NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-2.5 py-1 rounded-full text-[0.7rem] leading-tight font-medium border transition-colors whitespace-nowrap ${
                l.href === active
                  ? 'bg-primary text-white border-primary font-semibold'
                  : 'bg-white text-muted border-border hover:border-primary hover:text-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        {activeSections.length > 0 && (
          <div className="flex flex-wrap gap-1 pb-1.5 border-t border-border/50 pt-1 lg:hidden">
            {activeSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-2 py-0.5 rounded-full text-[0.65rem] leading-tight font-medium bg-orange-50 text-primary border border-primary/20 hover:bg-primary/10 transition-colors whitespace-nowrap"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}

        {/* Desktop — premium underline tabs with pulsing dot */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {ABOUT_NAV.map((l) => {
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

        {/* Desktop — sections sub-row for active tab */}
        {activeSections.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 pb-2 border-t border-border/40 pt-1.5">
            <span className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-muted/60 mr-2 shrink-0">
              On this page
            </span>
            {activeSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 px-3 py-1 rounded-full text-[0.78rem] font-medium text-muted hover:text-primary hover:bg-orange-50 border border-transparent hover:border-primary/20 transition-all duration-200 whitespace-nowrap"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
