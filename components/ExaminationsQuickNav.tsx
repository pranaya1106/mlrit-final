'use client';

import Link from 'next/link';
import { EXAMS_NAV } from '@/lib/examinations';

export default function ExaminationsQuickNav({ active }: { active: string }) {
  return (
    <nav
      className="bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top] duration-300 ease-out-quart"
      aria-label="Examinations sections"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {EXAMS_NAV.map((item) => {
            const isActive =
              item.href === active ||
              (item.children?.some((c) => c.href === active) ?? false);

            if (item.children) {
              return (
                <div key={item.href} className="relative group shrink-0">
                  {/* Parent tab button — acts as a visual anchor, not a link */}
                  <button
                    aria-current={isActive ? 'page' : undefined}
                    aria-haspopup="true"
                    className={`inline-flex items-center gap-1 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-foreground border-primary font-semibold'
                        : 'text-muted hover:text-foreground border-transparent hover:border-primary'
                    }`}
                  >
                    {item.label}
                    {/* chevron */}
                    <svg
                      width="10" height="10" viewBox="0 0 10 10" fill="none"
                      className="opacity-50 mt-0.5" aria-hidden
                    >
                      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Sub-menu dropdown */}
                  <div
                    className="absolute left-0 top-full pt-1 z-40 opacity-0 pointer-events-none
                      group-hover:opacity-100 group-hover:pointer-events-auto
                      group-focus-within:opacity-100 group-focus-within:pointer-events-auto
                      transition-opacity duration-150"
                  >
                    <div className="bg-white border border-border rounded-xl shadow-card-soft py-1.5 min-w-[160px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          aria-current={child.href === active ? 'page' : undefined}
                          className={`block px-4 py-2.5 font-sans text-[0.85rem] whitespace-nowrap transition-colors ${
                            child.href === active
                              ? 'text-primary font-semibold bg-orange-50/60'
                              : 'text-muted hover:text-foreground hover:bg-warm-light'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

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
      </div>
    </nav>
  );
}
