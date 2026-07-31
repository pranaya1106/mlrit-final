'use client';

import Link from 'next/link';
import { useHideOnScroll } from '@/lib/useHideOnScroll';

const ABOUT_NAV = [
  { label: 'Overview',            href: '/about' },
  { label: 'Vision & Mission',    href: '/about/vision-mission/vision-mission' },
  { label: 'Legacy',              href: '/about/legacy' },
  { label: 'Timeline',            href: '/about/timeline' },
  { label: 'Rankings & Awards',   href: '/about/rankings-awards' },
  { label: 'Internal Governance', href: '/about/internal-governance' },
];

export default function AboutQuickNav({ active }: { active: string }) {
  const hidden = useHideOnScroll();
  return (
    <nav
      className={`bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top,transform] duration-300 ease-out-quart lg:translate-y-0 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-[1280px] mx-auto pl-6 pr-11 md:pl-12 md:pr-11 lg:px-20">
        {/* Mobile / tablet — all items visible at once, wrapping instead of scrolling off-screen.
            The whole bar slides away on scroll-down and back on scroll-up, same as the main
            navbar — but only below lg (the lg:translate-y-0 override keeps desktop static). */}
        <div className="flex flex-wrap gap-2 py-3 lg:hidden">
          {ABOUT_NAV.map((l) => (
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

        {/* Desktop — original horizontal underline tabs, unchanged */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
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
