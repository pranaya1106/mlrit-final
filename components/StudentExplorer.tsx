'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const ITEMS = [
  {
    label: 'ERP',
    description: 'Student information and services',
    href: 'https://portal.vmedulife.com/public/auth/#/login/mlrit-hyderabad',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    label: 'LMS',
    description: 'Learning resources and courses',
    href: 'https://lms.mlrit.ac.in/',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M3 5h14M3 10h14M3 15h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="16" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    label: 'Edmit',
    description: 'Course registration platform',
    href: 'https://edmit.mlrit.ac.in/',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 2L3 6v4c0 4 3.5 7 7 8 3.5-1 7-4 7-8V6l-7-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Exam Portal',
    description: 'Results, timetables and exam updates',
    href: 'https://exams.mlrinstitutions.ac.in/',
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 7h6M7 10.5h6M7 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Syllabus Explorer',
    description: 'Browse syllabus by department',
    href: '/examinations/syllabus',
    external: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Academic Calendar',
    description: 'Important academic dates',
    href: '/examinations#calendars',
    external: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
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
      {/* Floating side tab — mirrors BrochureTab but on left side */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Student Explorer"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group focus:outline-none"
        style={{ marginTop: '48px' }}
      >
        <div
          className="flex items-center justify-center font-sans font-bold text-white text-[0.72rem] tracking-[0.16em] uppercase"
          style={{
            background: '#e8600a',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            padding: '14px 10px',
            borderRadius: '8px 0 0 8px',
            boxShadow: '2px 0 12px rgba(232,96,10,0.28)',
            gap: '8px',
            transition: 'padding 0.25s',
          }}
        >
          {/* compass icon */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            style={{ transform: 'rotate(90deg)', marginBottom: '4px' }}
            aria-hidden
          >
            <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.6"/>
            <path d="M9 5L7.5 8.5 5 9l1.5-3.5L9 5z" fill="white"/>
          </svg>
          Student Explorer
        </div>
      </button>

      {/* Backdrop + drawer */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-start"
          onClick={e => { if (e.target === e.currentTarget) close(); }}
        >
          {/* dim backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={close}
          />

          {/* drawer panel */}
          <div
            className="relative w-full sm:w-[400px] sm:h-full sm:max-h-screen overflow-y-auto
              rounded-t-3xl sm:rounded-none sm:rounded-r-3xl border-t sm:border-t-0 sm:border-r border-border/40"
            style={{
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(16px)',
              maxHeight: '90vh',
              boxShadow: '4px 0 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-border/50 bg-white/95">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: '#e8600a' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.6"/>
                      <path d="M9 5L7.5 8.5 5 9l1.5-3.5L9 5z" fill="white"/>
                    </svg>
                  </div>
                  <h2 className="font-sans font-extrabold text-foreground text-[1.05rem]">
                    Student Explorer
                  </h2>
                </div>
                <p className="font-mono text-muted text-[0.68rem] mt-1 tracking-wide">
                  Quick access to essential student portals
                </p>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 rounded-full bg-black/6 hover:bg-black/10 flex items-center justify-center transition-colors"
                aria-label="Close Student Explorer"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* items */}
            <div className="p-4 flex flex-col gap-2.5">
              {ITEMS.map((item) => {
                const shared = {
                  className: `flex items-center gap-4 rounded-2xl border border-border/60 p-4
                    hover:border-primary/40 hover:bg-orange-50/50 transition-all group cursor-pointer`,
                };
                const inner = (
                  <>
                    <div
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[#e8600a] transition-colors group-hover:bg-[#e8600a] group-hover:text-white"
                      style={{ background: 'rgba(232,96,10,0.08)' }}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-foreground text-[0.9rem]">{item.label}</p>
                      <p className="font-mono text-muted text-[0.68rem] mt-0.5 truncate">{item.description}</p>
                    </div>
                    <div className="ml-auto shrink-0 text-muted group-hover:text-primary transition-colors">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        {item.external
                          ? <><path d="M6 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8M8 2h4m0 0v4m0-4L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>
                          : <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        }
                      </svg>
                    </div>
                  </>
                );

                return item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    {...shared}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={close}
                    {...shared}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>

            <div className="px-6 pb-6 pt-2">
              <p className="font-mono text-[0.62rem] text-muted/60 text-center tracking-wide">
                MLRIT Student Services · mlrit.ac.in
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
