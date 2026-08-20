'use client';

import Link from 'next/link';
import { useHideOnScroll } from '@/lib/useHideOnScroll';

const ACADEMICS_NAV = [
  {
    label: 'Overview',
    href: '/academics',
    sections: [
      { id: 'framework', label: 'Framework' },
      { id: 'explore',   label: 'Explore'   },
    ],
  },
  { label: 'Undergraduate',  href: '/departments/ug',          sections: [] },
  { label: 'Postgraduate',   href: '/departments/pg',          sections: [] },
  { label: 'CSE',            href: '/departments/cse',         sections: [] },
  { label: 'CSE (DS)',       href: '/departments/cse-ds',      sections: [] },
  { label: 'CSE (AI & ML)', href: '/departments/aiml',        sections: [] },
  { label: 'ECE',            href: '/departments/ece',         sections: [] },
  { label: 'EEE',            href: '/departments/eee',         sections: [] },
  { label: 'Mechanical',     href: '/departments/mechanical',  sections: [] },
  { label: 'Aeronautical',   href: '/departments/aeronautical',sections: [] },
  { label: 'MBA',            href: '/departments/mba',         sections: [] },
];

export default function AcademicsQuickNav({ active }: { active: string }) {
  const hidden = useHideOnScroll();
  const activeItem = ACADEMICS_NAV.find((l) => l.href === active);
  const activeSections = activeItem?.sections ?? [];

  return (
    <nav
      className={`relative bg-white/95 backdrop-blur-md border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top,transform] duration-300 ease-out-quart lg:translate-y-0 ${
        hidden ? 'lg:-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Academics sub-navigation"
    >
      <span aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="flex flex-wrap gap-2 py-3 lg:hidden">
          {ACADEMICS_NAV.map((l) => (
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
          {activeSections.length > 0 && (
            <div className="w-full flex flex-wrap gap-2 pt-1 border-t border-border/50 mt-1">
              {activeSections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="px-3 py-1.5 rounded-full text-[0.78rem] font-medium bg-orange-50 text-primary border border-primary/20 hover:bg-primary/10 transition-colors whitespace-nowrap">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {ACADEMICS_NAV.map((l) => {
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

        {activeSections.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 pb-2 border-t border-border/40 pt-1.5">
            <span className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-muted/60 mr-2 shrink-0">On this page</span>
            {activeSections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="shrink-0 px-3 py-1 rounded-full text-[0.78rem] font-medium text-muted hover:text-primary hover:bg-orange-50 border border-transparent hover:border-primary/20 transition-all duration-200 whitespace-nowrap">
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
