'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useHideOnScroll } from '@/lib/useHideOnScroll';
import { EXAMS_NAV } from '@/lib/examinations';

export default function ExaminationsQuickNav({ active }: { active: string }) {
  const hidden = useHideOnScroll();
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
      className={`bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top,transform] duration-300 ease-out-quart lg:translate-y-0 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Examinations sections"
    >
      <div className="max-w-[1280px] mx-auto pl-6 pr-11 md:pl-12 md:pr-11 lg:px-20 relative">

        {/* Mobile / tablet — all items visible at once, wrapping instead of scrolling off-screen.
            The whole bar slides away on scroll-down and back on scroll-up, same as the main
            navbar — but only below lg (the lg:translate-y-0 override keeps desktop static). */}
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
        </div>

        {/* Desktop — original horizontal scroll strip with left/right arrows, unchanged */}
        {/* ← Left arrow */}
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
          {EXAMS_NAV.map((item) => (
            <Link
              key={item.href}
              href={itemHref(item)}
              aria-current={isActive(item) ? 'page' : undefined}
              className={`shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                isActive(item)
                  ? 'text-foreground border-primary font-semibold'
                  : 'text-muted hover:text-foreground border-transparent hover:border-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* → Right arrow */}
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

      </div>
    </nav>
  );
}
