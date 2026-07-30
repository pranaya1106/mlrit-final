'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

// ─── Shared constants ────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const SP = { stiffness: 120, damping: 28, mass: 0.6 } as const;

// Arrow link — the ↗ style contextual nav arrow requested
function ArrowLink({
  href,
  children,
  dark = false,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
  external?: boolean;
}) {
  const cls = dark
    ? 'text-white/90 hover:text-white border-white/30 hover:border-white'
    : 'text-foreground hover:text-primary border-border hover:border-primary';

  const inner = (
    <span
      className={`group inline-flex items-center gap-2 text-[0.85rem] font-bold font-sans tracking-wide border-b pb-0.5 transition-colors duration-200 ${cls}`}
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        <path
          d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}

// Scroll-reveal wrapper — uses IntersectionObserver to avoid mounting a new
// MotionValue per element; reduced-motion renders children immediately.
function Reveal({
  children,
  className,
  delay = 0,
  preset = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  preset?: 'up' | 'right' | 'left' | 'fade';
}) {
  const prefersReduced = useReducedMotion();
  const hidden = {
    opacity: 0,
    y: preset === 'up' ? 28 : 0,
    x: preset === 'right' ? -24 : preset === 'left' ? 24 : 0,
  };
  const show = { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? show : hidden}
      whileInView={show}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Section label pill
function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <span className="font-mono text-[0.68rem] tracking-[0.22em] uppercase font-bold text-secondary">
      {n} — {label}
    </span>
  );
}

// ─── 1. GREEN CAMPUS ─────────────────────────────────────────────────────────

function GreenCampusStory() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const rawY2 = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);
  const y = useSpring(rawY, SP);
  const y2 = useSpring(rawY2, SP);

  const CAMPUS_IMGS = [
    '/images/facilities/campus/campus-7P5A2397.jpg',
    '/images/facilities/campus/campus-7P5A1225.jpg',
    '/images/facilities/campus/campus-7P5A1958.jpg',
    '/images/facilities/campus/campus-7P5A1967.jpg',
    '/images/facilities/campus/campus-7P5A2322.jpg',
  ];

  return (
    <section
      ref={ref}
      className="relative bg-[#f7f5f0] overflow-hidden py-0"
      aria-label="Green Campus"
    >
      {/* Oversized number watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 font-sans font-black leading-none text-[#e8e3da] select-none"
        style={{ fontSize: 'clamp(180px, 28vw, 340px)', lineHeight: 0.85, zIndex: 0 }}
      >
        01
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-0">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Text column */}
          <div className="lg:w-[44%] shrink-0">
            <Reveal>
              <SectionLabel n="01" label="Green Campus" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] text-foreground">
                31{' '}
                <span className="font-display italic font-medium text-secondary">acres</span>
                <br />
                of open sky.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-muted text-[0.97rem] leading-relaxed max-w-[44ch]">
                A solar-powered, lush green campus in Dundigal — tree-lined walkways, open
                sports grounds, and natural ventilation across every building. Life at MLRIT
                happens outdoors as much as it does inside classrooms.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-8">
                <ArrowLink href="/student-life/discover-mlr">
                  Explore Life at MLR
                </ArrowLink>
              </div>
            </Reveal>

            {/* Stat chips */}
            <Reveal delay={0.28}>
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { val: '31', unit: 'Acres', sub: 'Solar-powered campus' },
                  { val: '1,200', unit: 'Seats', sub: 'State-of-the-art auditorium' },
                  { val: '15+', unit: '', sub: 'Sports facilities' },
                ].map((s) => (
                  <div
                    key={s.sub}
                    className="bg-white border border-border rounded-2xl px-5 py-4 shadow-card-soft"
                  >
                    <div className="font-sans font-black tracking-tighter-2 text-[1.4rem] leading-none text-secondary">
                      {s.val}
                      {s.unit && (
                        <span className="text-[0.75rem] font-bold ml-1 text-secondary/70">
                          {s.unit}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 font-mono text-[0.62rem] tracking-wide text-muted leading-tight">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Image column — parallax stack */}
          <div className="flex-1 relative min-h-[480px] md:min-h-[580px] overflow-hidden">
            <Reveal preset="left" delay={0.1}>
              <motion.div
                className="relative w-full rounded-3xl overflow-hidden shadow-card-strong"
                style={{
                  height: 'clamp(320px, 40vw, 520px)',
                  y: prefersReduced ? 0 : y,
                }}
              >
                <img
                  src={CAMPUS_IMGS[0]}
                  alt="MLRIT green campus aerial view — tree-lined pathways and open grounds"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="font-mono text-[0.65rem] text-white/80 tracking-widest uppercase bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    MLRIT Campus · Dundigal
                  </span>
                </div>
              </motion.div>
            </Reveal>

            {/* Floating secondary image */}
            <Reveal preset="left" delay={0.2}>
              <motion.div
                className="absolute bottom-[-40px] right-[-16px] w-[44%] rounded-2xl overflow-hidden border-4 border-white shadow-card-strong"
                style={{
                  height: 'clamp(160px, 18vw, 220px)',
                  y: prefersReduced ? 0 : y2,
                }}
              >
                <img
                  src={CAMPUS_IMGS[2]}
                  alt="MLRIT campus walkway with greenery"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Mosaic strip */}
      <div className="mt-12 md:mt-16 flex gap-2 overflow-hidden h-[140px] md:h-[180px]">
        {CAMPUS_IMGS.slice(1).map((src, i) => (
          <div key={i} className="flex-1 min-w-[18%] overflow-hidden">
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 2. PLACEMENTS ───────────────────────────────────────────────────────────

function PlacementStory() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], ['-8%', '8%']), SP);

  const PLACEMENT_IMGS = [
    '/placements/p1.jpg',
    '/placements/p3.jpg',
    '/placements/p5.jpg',
    '/placements/p7.png',
    '/placements/p9.png',
    '/placements/p11.png',
    '/placements/p13.png',
    '/placements/p15.png',
  ];

  return (
    <section
      ref={ref}
      className="relative bg-foreground overflow-hidden py-20 md:py-28"
      aria-label="Placements that secure futures"
    >
      {/* Decorative watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 font-sans font-black leading-none select-none"
        style={{
          fontSize: 'clamp(180px, 28vw, 340px)',
          lineHeight: 0.85,
          color: 'rgba(255,255,255,0.03)',
          zIndex: 0,
        }}
      >
        02
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="lg:w-[46%] shrink-0">
            <Reveal>
              <SectionLabel n="02" label="Placements" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] text-white">
                Futures that{' '}
                <span className="font-display italic font-medium text-primary">
                  begin here.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-white/65 text-[0.97rem] leading-relaxed max-w-[44ch]">
                21 years of consistent placement success — 81% of students placed annually.
                200+ companies visit campus each year, from global MNCs to high-growth startups.
                The highest package recorded: ₹58 LPA from Microsoft.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-8">
                <ArrowLink href="/placements/overview" dark>
                  Discover Placements
                </ArrowLink>
              </div>
            </Reveal>

            {/* Stats row */}
            <Reveal delay={0.28}>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  { val: '81%', sub: 'Students placed annually' },
                  { val: '₹58 LPA', sub: 'Highest package · Microsoft' },
                  { val: '200+', sub: 'Campus recruiting partners' },
                ].map((s) => (
                  <div
                    key={s.sub}
                    className="bg-white/[0.06] border border-white/10 rounded-2xl p-4 text-center"
                  >
                    <div className="font-sans font-black tracking-tighter-2 text-[1.3rem] leading-none text-primary">
                      {s.val}
                    </div>
                    <div className="mt-2 font-mono text-[0.6rem] tracking-wide text-white/45 leading-tight">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Image — parallax */}
          <div className="flex-1">
            <Reveal preset="right" delay={0.1}>
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-card-strong"
                style={{
                  height: 'clamp(320px, 38vw, 500px)',
                  y: prefersReduced ? 0 : imgY,
                }}
              >
                <img
                  src="/placements/p2.jpg"
                  alt="MLRIT students during campus placement — professional interview session"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="font-mono text-[0.65rem] text-white/80 tracking-widest uppercase bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    21 Years · 7,000+ Alumni Placed
                  </span>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* Company logo rail */}
        <Reveal delay={0.1}>
          <div className="mt-14 pt-10 border-t border-white/10">
            <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-white/30 mb-6 text-center">
              Companies that hire from MLRIT
            </p>
            <div className="overflow-hidden">
              <div
                aria-label="Placement company logos"
                className="flex gap-4 flex-wrap justify-center"
              >
                {PLACEMENT_IMGS.map((src, i) => (
                  <div
                    key={i}
                    className="h-12 w-24 rounded-lg overflow-hidden bg-white/[0.06] border border-white/10 flex items-center justify-center p-2"
                  >
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 3. STUDENT SAFETY ───────────────────────────────────────────────────────

function StudentSafetyStory() {
  return (
    <section
      className="relative bg-[#f1f8f4] overflow-hidden py-20 md:py-28"
      aria-label="Student safety and support"
    >
      {/* Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 font-sans font-black leading-none text-[#d7eedd] select-none"
        style={{ fontSize: 'clamp(180px, 28vw, 340px)', lineHeight: 0.85, zIndex: 0 }}
      >
        03
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <SectionLabel n="03" label="Student Safety &amp; Support" />
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.97] text-foreground max-w-[14ch]">
            A campus where every student{' '}
            <span className="font-display italic font-medium text-secondary">belongs safely.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Anti-Ragging Card */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-3xl border border-border shadow-card-soft overflow-hidden h-full flex flex-col">
              {/* Policy editorial header */}
              <div className="bg-secondary px-8 py-7">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M11 2L13.5 8H20L14.5 12L16.5 18L11 14.5L5.5 18L7.5 12L2 8H8.5L11 2Z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/70 font-bold">
                      Zero Tolerance Policy
                    </p>
                    <h3 className="mt-1 font-sans font-black tracking-tighter-2 text-[1.4rem] text-white leading-tight">
                      Anti-Ragging Commitment
                    </h3>
                  </div>
                </div>
              </div>

              {/* Policy content */}
              <div className="px-8 py-7 flex-1 flex flex-col">
                <p className="text-muted text-[0.93rem] leading-relaxed">
                  MLRIT enforces a strict zero-tolerance stance against ragging in any form
                  — physical, verbal, psychological, or online. All students sign an
                  anti-ragging undertaking at admission, and a 24×7 helpline and committee
                  is operational year-round.
                </p>

                <ul className="mt-5 space-y-3">
                  {[
                    'Anti-ragging undertaking mandatory at admission',
                    'Parent and guardian declaration required',
                    '24×7 anti-ragging helpline operational',
                    'Immediate suspension and criminal prosecution for violations',
                    'National helpline: 1800-180-5522',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.87rem] text-foreground">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                        <circle cx="8" cy="8" r="7" stroke="#01741f" strokeWidth="1.5"/>
                        <path d="M5 8l2 2 4-4" stroke="#01741f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <ArrowLink href="/admissions/policies">
                    Read Our Anti-Ragging Policy
                  </ArrowLink>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Women's Grievance Cell Card */}
          <Reveal delay={0.18}>
            <div className="bg-white rounded-3xl border border-border shadow-card-soft overflow-hidden h-full flex flex-col">
              {/* Policy editorial header */}
              <div className="bg-primary px-8 py-7">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <circle cx="11" cy="8" r="4" stroke="white" strokeWidth="1.8"/>
                      <path d="M5 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/70 font-bold">
                      Inclusive Campus
                    </p>
                    <h3 className="mt-1 font-sans font-black tracking-tighter-2 text-[1.4rem] text-white leading-tight">
                      Women Grievance Cell
                    </h3>
                  </div>
                </div>
              </div>

              <div className="px-8 py-7 flex-1 flex flex-col">
                <p className="text-muted text-[0.93rem] leading-relaxed">
                  The Women Grievance Cell at MLRIT provides a safe, confidential channel
                  for addressing gender-related concerns on campus. The cell is supported by
                  the Women Empowerment Cell and an Internal Complaints Committee for
                  POSH-compliant redressal.
                </p>

                <ul className="mt-5 space-y-3">
                  {[
                    'Confidential grievance filing available',
                    'Internal Complaints Committee (ICC) constituted',
                    'POSH Act compliant process',
                    'Women Empowerment Cell provides mentoring and support',
                    'Grievance email: grievance@mlrit.ac.in',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.87rem] text-foreground">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                        <circle cx="8" cy="8" r="7" stroke="#e85d04" strokeWidth="1.5"/>
                        <path d="M5 8l2 2 4-4" stroke="#e85d04" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7 flex flex-wrap gap-6">
                  <ArrowLink href="/admissions/policies">
                    Visit Grievance Cell
                  </ArrowLink>
                  <a
                    href="https://mlrit.edugrievance.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[0.85rem] font-bold font-sans tracking-wide border-b border-border hover:border-primary text-foreground hover:text-primary pb-0.5 transition-colors duration-200"
                  >
                    Grievance Portal
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Official Anti-Ragging Poster — integrated editorial layout */}
        <Reveal delay={0.25}>
          <div className="mt-10 bg-white rounded-3xl border border-border shadow-card-soft overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Poster image — readable at all sizes */}
              <div className="lg:w-[300px] xl:w-[340px] shrink-0 bg-[#1a1a2e] flex items-center justify-center p-6">
                <img
                  src="/images/anti-ragging-poster.jpg"
                  alt="MLRIT official Anti-Ragging poster — illustrates three figures representing the anti-ragging commitment. Text reads: Anti-Ragging Act: Undisciplined activities by students which causes or is likely to cause annoyance, hardship, physical or psychological harm or to raise fear or apprehension in any fresher or any other student. MLRIT enforces a zero-tolerance policy."
                  className="w-full max-w-[260px] lg:max-w-full rounded-xl shadow-card-strong object-contain"
                  loading="lazy"
                  style={{ maxHeight: '420px' }}
                />
              </div>

              {/* Contextual caption — never overlap poster text */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-secondary font-bold mb-3">
                    Official Institutional Poster
                  </p>
                  <h3 className="font-sans font-black tracking-tighter-2 text-[1.5rem] leading-tight text-foreground">
                    Anti-Ragging Act
                  </h3>
                  <p className="mt-4 text-muted text-[0.93rem] leading-relaxed max-w-[52ch]">
                    This poster is displayed at all MLRIT campus entry points and notice boards.
                    Ragging — including physical, verbal, psychological, or online harassment
                    — is a criminal offence under UGC Regulations (2009). MLRIT enforces
                    zero tolerance.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div>
                      <div className="font-mono text-[0.62rem] tracking-widest uppercase text-muted mb-1">National Helpline</div>
                      <div className="font-sans font-black text-[1.1rem] tracking-tighter-2 text-foreground">1800-180-5522</div>
                    </div>
                    <div>
                      <div className="font-mono text-[0.62rem] tracking-widest uppercase text-muted mb-1">MLRIT Helpline</div>
                      <div className="font-sans font-black text-[1.1rem] tracking-tighter-2 text-foreground">+91 40 2398 8101</div>
                    </div>
                    <div>
                      <div className="font-mono text-[0.62rem] tracking-widest uppercase text-muted mb-1">Policy Reference</div>
                      <div className="font-sans font-black text-[1.1rem] tracking-tighter-2 text-foreground">UGC 2009</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-7 border-t border-border">
                  <ArrowLink href="/admissions/policies">
                    Read the Full Anti-Ragging Policy
                  </ArrowLink>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 4. INNOVATION & RESEARCH ────────────────────────────────────────────────

function InnovationResearchStory() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], ['-6%', '6%']), SP);
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-3%']), SP);

  const STI_IMGS = [
    '/images/facilities/campus/sti-hub-1.jpg',
    '/images/facilities/campus/sti-hub-2.jpg',
    '/images/facilities/campus/sti-hub-3.jpg',
    '/images/facilities/campus/sti-hub-4.jpg',
  ];

  return (
    <section
      ref={ref}
      className="relative bg-[#0c0c0e] overflow-hidden py-20 md:py-28"
      aria-label="Innovation, entrepreneurship and research"
    >
      {/* Background mosaic — parallaxed */}
      <motion.div
        className="absolute inset-0 opacity-[0.12]"
        style={{ y: prefersReduced ? 0 : bgY }}
        aria-hidden="true"
      >
        <div className="grid grid-cols-4 h-full">
          {STI_IMGS.map((src, i) => (
            <div key={i} className="overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 font-sans font-black leading-none select-none"
        style={{
          fontSize: 'clamp(180px, 28vw, 340px)',
          lineHeight: 0.85,
          color: 'rgba(255,255,255,0.02)',
          zIndex: 1,
        }}
      >
        04
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="flex-1">
            <Reveal preset="right" delay={0.1}>
              <motion.div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  height: 'clamp(300px, 38vw, 480px)',
                  y: prefersReduced ? 0 : imgY,
                }}
              >
                <img
                  src={STI_IMGS[0]}
                  alt="Student Technology and Innovation Hub at MLRIT — co-working and prototyping space"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="font-mono text-[0.62rem] text-white/80 tracking-widest uppercase bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    STI Hub — Atal Innovation Mission supported
                  </span>
                </div>
              </motion.div>
            </Reveal>

            {/* Sub-image row */}
            <Reveal delay={0.2}>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {STI_IMGS.slice(1).map((src, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ height: 'clamp(80px, 10vw, 120px)' }}>
                    <img src={src} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Text */}
          <div className="lg:w-[44%] shrink-0">
            <Reveal>
              <SectionLabel n="04" label="Innovation &amp; Research" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.97] text-white">
                Ideas don&apos;t wait.{' '}
                <span className="font-display italic font-medium text-primary">
                  Neither do we.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-white/60 text-[0.97rem] leading-relaxed max-w-[44ch]">
                The Student Technology and Innovation Hub — supported by AIM (Atal Innovation Mission)
                — gives students co-working space, prototyping labs, and mentorship to turn ideas
                into products. Three JNTUH-recognised research centres, 42+ patents, and 1,200+
                publications make research a living part of campus life.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { val: 'STI Hub', sub: 'AIM supported innovation space' },
                  { val: '3', sub: 'JNTUH research centres' },
                  { val: '42+', sub: 'Patents filed' },
                  { val: '1,200+', sub: 'Publications (2016–2025)' },
                ].map((s) => (
                  <div
                    key={s.sub}
                    className="bg-white/[0.06] border border-white/10 rounded-2xl px-5 py-4"
                  >
                    <div className="font-sans font-black tracking-tighter-2 text-[1.2rem] leading-none text-primary">
                      {s.val}
                    </div>
                    <div className="mt-1.5 font-mono text-[0.62rem] tracking-wide text-white/40 leading-tight">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-6">
                <ArrowLink href="/research/centers" dark>
                  Explore Research &amp; Innovation
                </ArrowLink>
                <ArrowLink href="/student-life/facilities" dark>
                  Visit the STI Hub
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. FACILITIES ───────────────────────────────────────────────────────────

function FacilitiesStory() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const mosaic1Y = useSpring(useTransform(scrollYProgress, [0, 1], ['-5%', '5%']), SP);
  const mosaic2Y = useSpring(useTransform(scrollYProgress, [0, 1], ['5%', '-5%']), SP);

  const FACILITY_ITEMS = [
    { img: '/images/facilities/campus/library-wide-1.jpg', label: 'Marri Balreddy Library', sub: '50,000+ volumes' },
    { img: '/images/facilities/campus/cafeteria-1.jpg', label: 'Campus Cafeteria', sub: 'Multi-cuisine · 8AM–8PM' },
    { img: '/images/facilities/campus/hospital-1.jpg', label: 'On-Campus Hospital', sub: '24/7 medical care' },
    { img: '/images/facilities/campus/sti-hub-2.jpg', label: 'STI Hub', sub: 'Innovation & startups' },
    { img: '/images/facilities/campus/library-reading-1.jpg', label: 'Reading Spaces', sub: 'IEEE & Springer access' },
    { img: '/images/facilities/campus/cafeteria-3.jpg', label: 'Dining Hall', sub: 'Open-air seating' },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-[#faf7f0] overflow-hidden py-20 md:py-28"
      aria-label="Facilities and amenities"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 font-sans font-black leading-none text-[#e8e2d4] select-none"
        style={{ fontSize: 'clamp(180px, 28vw, 340px)', lineHeight: 0.85, zIndex: 0 }}
      >
        05
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">
          {/* Text */}
          <div className="lg:w-[38%] shrink-0 lg:sticky lg:top-32">
            <Reveal>
              <SectionLabel n="05" label="Facilities &amp; Amenities" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.97] text-foreground">
                Everything you need,{' '}
                <span className="font-display italic font-medium text-secondary">
                  within walking distance.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-muted text-[0.97rem] leading-relaxed max-w-[42ch]">
                Library, cafeteria, on-campus hospital, sports complex, ATM, and stationery store
                — a solar-powered campus designed so students focus on learning, not logistics.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-8">
                <ArrowLink href="/student-life/facilities">
                  View Facilities &amp; Amenities
                </ArrowLink>
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-10 space-y-2">
                {['Library & Digital Resources', 'Multi-cuisine Cafeteria', '24/7 On-campus Hospital', 'Sports Complex & Courts', 'Campus ATM & Banking', 'Stationery & Supply Store'].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-[0.9rem] text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Image mosaic — two parallax columns */}
          <div className="flex-1 grid grid-cols-2 gap-3 md:gap-4">
            <motion.div
              className="flex flex-col gap-3 md:gap-4"
              style={{ y: prefersReduced ? 0 : mosaic1Y }}
            >
              {FACILITY_ITEMS.slice(0, 3).map((item) => (
                <Reveal key={item.label} preset="fade">
                  <div className="relative rounded-2xl overflow-hidden group" style={{ height: 'clamp(160px, 18vw, 240px)' }}>
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="font-sans font-bold text-white text-[0.8rem] leading-tight">{item.label}</div>
                      <div className="font-mono text-[0.58rem] text-white/65 tracking-wide">{item.sub}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </motion.div>
            <motion.div
              className="flex flex-col gap-3 md:gap-4 mt-8 md:mt-12"
              style={{ y: prefersReduced ? 0 : mosaic2Y }}
            >
              {FACILITY_ITEMS.slice(3).map((item) => (
                <Reveal key={item.label} preset="fade" delay={0.1}>
                  <div className="relative rounded-2xl overflow-hidden group" style={{ height: 'clamp(160px, 18vw, 240px)' }}>
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="font-sans font-bold text-white text-[0.8rem] leading-tight">{item.label}</div>
                      <div className="font-mono text-[0.58rem] text-white/65 tracking-wide">{item.sub}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. STUDENT CLUBS ────────────────────────────────────────────────────────

// Marquee — reduced motion shows static list instead
function ClubsMarquee({ prefersReduced }: { prefersReduced: boolean | null }) {
  const CLUBS = [
    'INVENTE Tech Fest', 'Coding Club', 'IEEE Student Branch', 'Robotics Team',
    'Photography Club', 'NSS', 'NCC', 'Drama Society', 'Music Club', 'AI & ML Club',
    'E-Cell', 'Environmental Club', 'Dance Troupe', 'Literary Society', 'Quizzing Club',
    'Zignasa Cultural Fest', 'Equinox Events', 'Blockchain Enthusiasts', 'Gaming Guild',
  ];

  if (prefersReduced) {
    return (
      <div className="flex flex-wrap gap-2 mt-8" aria-label="Student clubs and societies">
        {CLUBS.map((c) => (
          <span key={c} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 font-mono text-[0.7rem] tracking-wide">
            {c}
          </span>
        ))}
      </div>
    );
  }

  const strip = [...CLUBS, ...CLUBS];
  return (
    <div className="mt-8 overflow-hidden" aria-label="Student clubs and societies">
      <div
        className="flex gap-3 w-max animate-marquee"
        style={{ animationDuration: '32s' }}
      >
        {strip.map((c, i) => (
          <span
            key={i}
            aria-hidden={i >= CLUBS.length}
            className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 font-mono text-[0.7rem] tracking-wide whitespace-nowrap"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function StudentCommunitiesStory() {
  const prefersReduced = useReducedMotion();

  const STUDENT_IMGS = [
    '/images/students/s1.jpg',
    '/images/students/s2.jpg',
    '/images/students/s4.jpg',
  ];

  return (
    <section
      className="relative bg-foreground overflow-hidden py-20 md:py-28"
      aria-label="Student clubs and communities"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 font-sans font-black leading-none select-none"
        style={{
          fontSize: 'clamp(180px, 28vw, 340px)',
          lineHeight: 0.85,
          color: 'rgba(255,255,255,0.025)',
          zIndex: 0,
        }}
      >
        06
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="lg:w-[44%] shrink-0">
            <Reveal>
              <SectionLabel n="06" label="Clubs &amp; Communities" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.97] text-white">
                30+ clubs.{' '}
                <span className="font-display italic font-medium text-primary">
                  One community.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 text-white/60 text-[0.97rem] leading-relaxed max-w-[44ch]">
                Technical clubs, cultural societies, NSS, NCC, and inter-collegiate competitions —
                student life at MLRIT is as vibrant outside the classroom as it is within. Every
                student finds their people here.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <ClubsMarquee prefersReduced={prefersReduced} />
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10">
                <ArrowLink href="/campus/clubs" dark>
                  Explore Clubs &amp; Societies
                </ArrowLink>
              </div>
            </Reveal>
          </div>

          {/* Image stack */}
          <div className="flex-1">
            <Reveal preset="left" delay={0.1}>
              <div className="relative">
                {/* Primary image */}
                <div className="rounded-3xl overflow-hidden shadow-card-strong" style={{ height: 'clamp(280px, 36vw, 460px)' }}>
                  <img
                    src={STUDENT_IMGS[0]}
                    alt="MLRIT students at campus cultural event"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating accent cards */}
                <div className="absolute bottom-[-16px] left-[-16px] bg-primary text-white rounded-2xl px-5 py-4 shadow-primary-glow">
                  <div className="font-sans font-black text-[1.4rem] tracking-tighter-2 leading-none">30+</div>
                  <div className="font-mono text-[0.6rem] tracking-wide text-white/75 mt-1">Student clubs</div>
                </div>

                <div className="absolute top-[-16px] right-[-16px] bg-white rounded-2xl px-5 py-4 shadow-card-strong">
                  <div className="font-sans font-black text-[1.4rem] tracking-tighter-2 leading-none text-secondary">INVENTE</div>
                  <div className="font-mono text-[0.6rem] tracking-wide text-muted mt-1">Annual Tech &amp; Cultural Fest</div>
                </div>
              </div>
            </Reveal>

            {/* Secondary image strip */}
            <Reveal delay={0.2}>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {STUDENT_IMGS.slice(1).map((src, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ height: 'clamp(100px, 12vw, 150px)' }}>
                    <img
                      src={src}
                      alt={i === 0 ? 'MLRIT students at technical event' : 'MLRIT student at campus activity'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. CLOSING ──────────────────────────────────────────────────────────────

function WhyMLRITClosing() {
  return (
    <section
      className="relative bg-green-hero py-24 md:py-32 overflow-hidden"
      aria-label="Admissions invitation"
    >
      {/* Decorative letter echo — visual continuity with MLRITStory */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-sans font-black tracking-tighter-2 leading-none text-white/[0.04]"
          style={{ fontSize: 'clamp(200px, 40vw, 600px)' }}
        >
          MLRIT
        </span>
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <p className="font-mono text-[0.68rem] tracking-[0.22em] uppercase text-white/50 font-bold mb-5">
            The next chapter is yours
          </p>
          <h2 className="font-sans font-black tracking-tighter-2 text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.0] text-white">
            Ready to be part of<br />
            <span className="font-display italic font-medium" style={{ color: '#f5c842' }}>
              the MLRIT story?
            </span>
          </h2>
          <p className="mt-6 text-white/65 text-[1rem] max-w-[52ch] mx-auto leading-relaxed">
            Admissions are open. Join a campus that takes merit seriously, places students
            consistently, and builds engineers who are ready for the world.
          </p>

          {/* Arrow-style CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="https://qr-mlr.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-[1rem] font-black font-sans text-white tracking-wide"
            >
              <span className="border-b-2 border-white/40 pb-0.5 group-hover:border-white transition-colors">
                Apply Now
              </span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M3.5 14.5L14.5 3.5M14.5 3.5H7M14.5 3.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <span className="text-white/25 hidden sm:block">·</span>
            <Link
              href="/admissions"
              className="group inline-flex items-center gap-3 text-[1rem] font-black font-sans text-white/70 hover:text-white tracking-wide transition-colors"
            >
              <span className="border-b-2 border-white/20 pb-0.5 group-hover:border-white/60 transition-colors">
                Admissions Overview
              </span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M3.5 14.5L14.5 3.5M14.5 3.5H7M14.5 3.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <span className="text-white/25 hidden sm:block">·</span>
            <Link
              href="/departments/ug"
              className="group inline-flex items-center gap-3 text-[1rem] font-black font-sans text-white/70 hover:text-white tracking-wide transition-colors"
            >
              <span className="border-b-2 border-white/20 pb-0.5 group-hover:border-white/60 transition-colors">
                Explore Programmes
              </span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M3.5 14.5L14.5 3.5M14.5 3.5H7M14.5 3.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Page composition ─────────────────────────────────────────────────────────

export default function WhyMLRITSections() {
  return (
    <main id="why-mlrit-content">
      <GreenCampusStory />
      <PlacementStory />
      <StudentSafetyStory />
      <InnovationResearchStory />
      <FacilitiesStory />
      <StudentCommunitiesStory />
      <WhyMLRITClosing />
    </main>
  );
}
