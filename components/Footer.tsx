'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp } from './icons';

type FooterLink = { label: string; href: string; external?: boolean; ext?: boolean };
type FooterCol  = { head: string; links: FooterLink[] };

const COLS: FooterCol[] = [
  {
    head: 'About',
    links: [
      { label: 'Our Story', href: 'https://mlrit.ac.in/about-us/', external: true },
      { label: 'Leadership', href: 'https://mlrit.ac.in/about-us/governing-body/', external: true },
      { label: 'Accreditations', href: '/iqac' },
      { label: 'Careers at MLRIT', href: 'https://mlrit.ac.in/careers/', external: true },
    ],
  },
  {
    head: 'Academics',
    links: [
      { label: 'Undergraduate', href: '/departments/ug' },
      { label: 'Postgraduate', href: '/departments/pg' },
      { label: 'Research', href: '/research' },
      { label: 'Faculty', href: '/departments/faculty-profile' },
    ],
  },
  {
    head: 'Admissions',
    links: [
      { label: 'Apply Now', href: 'https://mlrit.ac.in/admissions/', external: true },
      { label: 'Fee Structure', href: 'https://mlrit.ac.in/admissions/', external: true },
      { label: 'Scholarships', href: 'https://mlrit.ac.in/scholarships/', external: true },
      { label: 'FAQs', href: 'https://mlrit.ac.in/admissions/', external: true },
    ],
  },
  {
    head: 'Follow',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/school/mlr-institute-of-technology/', external: true, ext: true },
      { label: 'Instagram', href: 'https://www.instagram.com/mlritofficial/', external: true, ext: true },
      { label: 'Facebook', href: 'https://www.facebook.com/Mlrit/', external: true, ext: true },
      { label: 'X.com', href: 'https://x.com/mlritin', external: true, ext: true },
      { label: 'YouTube', href: 'https://www.youtube.com/channel/UCAfZfemyTCM-965RZy6QiGA', external: true, ext: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-warm-light border-t border-border relative isolate">
      {/* 4-column links */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14">
          {COLS.map((c) => (
            <div key={c.head}>
              <h5 className="text-primary font-bold text-[0.72rem] tracking-[0.2em] uppercase mb-4">
                {c.head}
              </h5>
              <ul className="space-y-1">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={l.external ? '_blank' : undefined}
                      rel={l.external ? 'noopener' : undefined}
                      className="inline-flex items-center gap-1.5 py-1.5 text-[0.95rem] font-normal text-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                      {l.ext && (
                        <span className="text-[0.72rem] text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Accredited row */}
      <div className="border-y border-border">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-5 flex flex-wrap items-center gap-7">
          <span className="font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase text-muted flex-shrink-0">
            Accredited by
          </span>
          <div className="flex items-center gap-7 flex-1 min-w-0">
            <img src="/legacy/nirf/naac.svg"  alt="NAAC"  className="h-9 w-auto opacity-90" />
            <img src="/legacy/nirf/aicte.svg" alt="AICTE" className="h-9 w-auto opacity-90" />
            <img src="/legacy/nirf/nba.svg"   alt="NBA"   className="h-9 w-auto opacity-90" />
          </div>
          <BackToTop />
        </div>
      </div>

      {/* Big watermark + crafted line */}
      <div className="text-center overflow-hidden pt-5">
        <div
          className="font-sans font-black uppercase leading-[0.92] tracking-tighter-3 select-none"
          style={{
            fontSize: 'clamp(8rem, 28vw, 24rem)',
            backgroundImage:
              'linear-gradient(180deg, #161616 0%, #2b1605 25%, #6a2f00 45%, #e85d04 62%, #ffb27a 82%, rgba(245,239,229,0) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          MLRIT
        </div>
        {/* Crafted line — sits just below the watermark */}
        <p className="mt-2 mb-6 font-sans text-[0.72rem] tracking-[0.18em] text-muted uppercase italic">
          Crafted with passion by{' '}
          <strong className="font-extrabold not-italic text-foreground tracking-[0.1em]">The Students</strong>
          {' '}of MLRIT
        </p>
      </div>

      {/* Bottom legal */}
      <div className="border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-5 flex flex-wrap items-center justify-between gap-3 text-[0.8rem] text-muted font-sans">
          <div className="flex flex-wrap gap-4 items-center">
            <span>© 2026 KMR Educational Society</span>
            <span className="text-subtle">·</span>
            <span>Affiliated to JNTUH</span>
            <span className="text-subtle">·</span>
            <span>Approved by AICTE</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="ml-auto inline-flex items-center gap-3.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors group"
      aria-label="Back to top"
    >
      Back to top
      <span className="w-10 h-10 rounded-full border-[1.4px] border-foreground inline-flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:-translate-y-0.5">
        <ArrowUp className="w-4 h-4" />
      </span>
    </button>
  );
}
