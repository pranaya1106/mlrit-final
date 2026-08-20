'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useHideOnScroll } from '@/lib/useHideOnScroll';
import { EXAMS_NAV } from '@/lib/examinations';

const EXAMS_SECTIONS: Record<string, { id: string; label: string }[]> = {
  '/examinations/coe':                    [],
  '/examinations/circulars':              [],
  '/examinations/notifications':          [],
  '/examinations/timetable/internal':     [],
  '/examinations/timetable/external':     [],
  '/examinations/fee-results':            [],
  '/examinations/student-verifications':  [],
  '/examinations/citizen-charter':        [],
  '/examinations/certificates':           [],
  '/examinations/downloads':              [],
  '/examinations/pyqs':                   [],
  '/examinations/annual-reports':         [],
  '/examinations/contact':                [],
};

export default function ExaminationsQuickNav({ active }: { active: string }) {
  const hidden = useHideOnScroll();
  const activeSections = EXAMS_SECTIONS[active] ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect(); };
  }, [checkScroll]);

  function scrollLeft()  { scrollRef.current?.scrollBy({ left: -220 }); }
  function scrollRight() { scrollRef.current?.scrollBy({ left:  220 }); }

  function isActive(item: (typeof EXAMS_NAV)[number]) {
    return item.href === active || (item.children?.some((c) => c.href === active) ?? false);
  }

  function itemHref(item: (typeof EXAMS_NAV)[number]) {
    return item.children ? item.children[0].href : item.href;
  }

  return (
    <nav
      className={`relative bg-white/95 backdrop-blur-md border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top,transform] duration-300 ease-out-quart lg:translate-y-0 ${
        hidden ? 'lg:-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Examinations sections"
    >
      <span aria-hidden className="pointer-events-none absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="w-full px-6 md:px-10 lg:px-12 relative">

        {/* Mobile / tablet — pill wrap */}
        <div className="flex flex-wrap gap-2 py-3 lg:hidden">
          {EXAMS_NAV.map((item) => (
            <Link
              key={item.href}
              href={itemHref(item)}
              aria-current={isActive(item) ? 'page' : undefined}
              className={`px-3.5 py-2 rounded-full text-[0.82rem] font-medium border transition-colors whitespace-nowrap ${
                isActive(item)
                  ? 'bg-primary text-white border-primary font-semibold'
                  : 'bg-white text-muted border-border hover:border-primary hover:text-foreground'
              }`}
            >
              {item.label}
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

        {/* Desktop scroll strip with arrows */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll tabs left"
          className={`hidden lg:flex absolute left-0 top-0 bottom-0 z-10 items-center pl-1 pr-3
            bg-gradient-to-r from-white via-white/90 to-transparent
            text-muted hover:text-foreground transition-all duration-200
            ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M11 5l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="hidden lg:flex items-center gap-1 overflow-x-auto"
          style={{ scrollbarWidth: 'none', scrollBehavior: 'smooth' }}
        >
          {EXAMS_NAV.map((item) => {
            const activeHere = isActive(item);
            return (
              <Link
                key={item.href}
                href={itemHref(item)}
                aria-current={activeHere ? 'page' : undefined}
                className={`group relative shrink-0 px-4 py-4 font-sans text-[0.9rem] whitespace-nowrap transition-all duration-300 ${
                  activeHere ? 'text-primary font-bold' : 'text-muted hover:text-foreground font-medium'
                }`}
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {activeHere && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className={`absolute left-3 right-3 bottom-0 h-[3px] rounded-full transition-all duration-300 ${
                    activeHere ? 'bg-primary opacity-100' : 'bg-primary opacity-0 group-hover:opacity-40'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          aria-label="Scroll tabs right"
          className={`hidden lg:flex absolute right-0 top-0 bottom-0 z-10 items-center pr-1 pl-3
            bg-gradient-to-l from-white via-white/90 to-transparent
            text-muted hover:text-foreground transition-all duration-200
            ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

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
