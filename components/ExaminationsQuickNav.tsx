'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { EXAMS_NAV } from '@/lib/examinations';

export default function ExaminationsQuickNav({ active }: { active: string }) {
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

  return (
    <nav
      className="bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top] duration-300 ease-out-quart"
      aria-label="Examinations sections"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 relative">

        {/* ← Left arrow */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll tabs left"
          className={`absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 pr-3
            bg-gradient-to-r from-white via-white/90 to-transparent
            text-muted hover:text-foreground transition-all duration-200
            ${canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M11 5l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Tab strip */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto"
          style={{ scrollbarWidth: 'none', scrollBehavior: 'smooth' }}
        >
          {EXAMS_NAV.map((item) => {
            const isActive =
              item.href === active ||
              (item.children?.some((c) => c.href === active) ?? false);

            /* ── Timetables: single tab linking to first child ─────── */
            if (item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.children[0].href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-foreground border-primary font-semibold'
                      : 'text-muted hover:text-foreground border-transparent hover:border-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            /* ── Regular tab ─────────────────────────────────────────── */
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.href === active ? 'page' : undefined}
                className={`shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                  item.href === active
                    ? 'text-foreground border-primary font-semibold'
                    : 'text-muted hover:text-foreground border-transparent hover:border-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* → Right arrow */}
        <button
          onClick={scrollRight}
          aria-label="Scroll tabs right"
          className={`absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 pl-3
            bg-gradient-to-l from-white via-white/90 to-transparent
            text-muted hover:text-foreground transition-all duration-200
            ${canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

      </div>
    </nav>
  );
}
