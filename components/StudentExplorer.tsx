'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const ITEMS = [
  {
    label: 'ERP',
    href: 'https://portal.vmedulife.com/public/auth/#/login/mlrit-hyderabad',
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    label: 'LMS',
    href: 'https://lms.mlrit.ac.in/',
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M3 5h14M3 10h14M3 15h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="16" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    label: 'Edmit',
    href: 'https://edmit.mlrit.ac.in/',
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 2L3 6v4c0 4 3.5 7 7 8 3.5-1 7-4 7-8V6l-7-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Exam Portal',
    href: 'https://exams.mlrinstitutions.ac.in/',
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 7h6M7 10.5h6M7 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Syllabus',
    href: '/examinations/syllabus',
    external: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Calendar',
    href: '/examinations#calendars',
    external: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 2v4M14 2v4M2 9h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="7" cy="13" r="1" fill="currentColor"/>
        <circle cx="10" cy="13" r="1" fill="currentColor"/>
        <circle cx="13" cy="13" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function StudentExplorer() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      {/* Icon-only floating tab — right side, below Brochure */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Student Explorer"
        className="fixed right-0 z-50 focus:outline-none group"
        style={{ top: 'calc(50% + 10px)' }}
      >
        <div
          style={{
            background: '#e8600a',
            padding: '10px 8px',
            borderRadius: '0 6px 6px 0',
            boxShadow: '-2px 0 10px rgba(232,96,10,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {/* compass icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.6"/>
            <path d="M9 5L7.5 8.5 5 9l1.5-3.5L9 5z" fill="white"/>
          </svg>
          {/* vertical label */}
          <span
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'white',
              fontFamily: 'var(--font-manrope, sans-serif)',
              lineHeight: 1,
            }}
          >
            Explorer
          </span>
        </div>
      </button>

      {/* Popup */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-end"
          onClick={e => { if (e.target === e.currentTarget) close(); }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(3px)' }}
            onClick={close}
          />

          {/* compact popup anchored to right */}
          <div
            className="relative mr-12 rounded-2xl border border-border/50"
            style={{
              background: 'rgba(255,255,255,0.99)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
              width: '292px',
            }}
          >
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: '#e8600a' }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.6"/>
                    <path d="M9 5L7.5 8.5 5 9l1.5-3.5L9 5z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="font-sans font-extrabold text-foreground text-[0.88rem] leading-tight">Student Explorer</p>
                  <p className="font-mono text-muted text-[0.6rem] tracking-wide">Quick access to portals</p>
                </div>
              </div>
              <button
                onClick={close}
                className="w-7 h-7 rounded-full bg-black/6 hover:bg-black/10 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* 2-col icon grid */}
            <div className="p-3 grid grid-cols-2 gap-2">
              {ITEMS.map((item) => {
                const cls = `flex flex-col items-center gap-2 rounded-xl border border-border/50 py-4 px-2
                  hover:border-primary/50 hover:bg-orange-50/60 transition-all group cursor-pointer`;
                const inner = (
                  <>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#e8600a]
                        group-hover:bg-[#e8600a] group-hover:text-white transition-colors"
                      style={{ background: 'rgba(232,96,10,0.09)' }}
                    >
                      {item.icon}
                    </div>
                    <span className="font-sans font-semibold text-foreground text-[0.78rem] text-center leading-tight">
                      {item.label}
                    </span>
                  </>
                );

                return item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className={cls}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    className={cls}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
