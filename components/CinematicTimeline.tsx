'use client';

/**
 * CinematicTimeline — scroll-pinned, full-viewport timeline.
 *
 * Visual model:
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  ▍ progress rail              ┌──────── year jumpbar ─┐  │
 *   │  ▍                            │ 2005                  │  │
 *   │  ▍                            │ 2008                  │  │
 *   │  ▍                            │ 2011 ●                │  │
 *   │  ▍   ┌──────────┐    ┌────────│ 2017                  │  │
 *   │  ▍   │          │    │ MILE-  │ 2019                  │  │
 *   │  ▍   │   2011   │    │ STONE  │ ...                   │  │
 *   │  ▍   │          │    │  card  │                       │  │
 *   │  ▍   └──────────┘    └────────│                       │  │
 *   │  ▍                            └───────────────────────┘  │
 *   └──────────────────────────────────────────────────────────┘
 *
 * As you scroll a section that's `N × 100vh` tall:
 *   • the year on the left cross-fades from 2005 → 2026
 *   • milestone cards slide in from the right + scale, exit up
 *   • the left progress rail fills downward
 *   • the year jumpbar highlights the active year and lets you jump
 *   • the background subtly shifts through cream → primary → secondary tints
 */

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';

type Step = { y: string; t: string; d: string };

const STEPS: Step[] = [
  { y: '2005', t: 'Foundation Stone',     d: 'MLR Institute of Technology established under KMR Educational Society at Dundigal, Hyderabad with an inaugural intake of 240 students across CSE, ECE, MECH and EEE.' },
  { y: '2008', t: 'First Graduation',     d: 'First B.Tech batch graduates — placed across Wipro, Infosys and TCS. CSE earns the first National Board of Accreditation (NBA) cycle.' },
  { y: '2011', t: 'M.Tech Programmes',    d: 'Postgraduate programmes launched in CSE, ECE, MECH and EEE. JNTUH-recognised research centres set up across four disciplines.' },
  { y: '2017', t: 'IPFC Established',     d: 'Intellectual Property Facilitation Centre opens — anchoring patent filings, IPR workshops and a culture of student-led invention.' },
  { y: '2019', t: 'NAAC Accreditation',   d: 'Institutional NAAC accreditation granted — formal recognition of institutional quality, governance and learning outcomes.' },
  { y: '2022', t: 'Autonomous Status',    d: 'UGC grants autonomous status. MLRIT now designs its own curriculum, regulations and assessment systems — agile to industry needs.' },
  { y: '2024', t: 'New Programmes',       d: 'AIML, CSE-CS, CSE-DS, CSIT and IT launched. Combined intake crosses 1,000+ across UG programmes. New campus blocks open.' },
  { y: '2025', t: 'Twenty Years',         d: 'MLRIT crosses 20 years — 11,000+ students, 7,000+ alumni placed worldwide, 25+ doctoral faculty, 3 active research centres.' },
  { y: '2026', t: 'Trishna 2K26',         d: '21st Annual Day — 621 placement offers, ₹51 LPA highest package, and the strongest training-and-placement season in MLRIT history.' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CinematicTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // The whole section is N × 100vh tall. As we scroll through it,
  // scrollYProgress moves from 0 → 1.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track which milestone is "active" based on scroll progress.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    setActive(idx);
  });

  // The progress rail fill (top → bottom)
  const railFill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Background hue subtly shifts through the journey
  const bgShift = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(circle at 20% 30%, rgba(232,93,4,0.05) 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #fbfbfa 100%)',
      'radial-gradient(circle at 80% 50%, rgba(45,139,85,0.08) 0%, transparent 60%), linear-gradient(180deg, #fbfbfa 0%, #faf7f0 100%)',
      'radial-gradient(circle at 30% 70%, rgba(232,93,4,0.10) 0%, transparent 60%), linear-gradient(180deg, #faf7f0 0%, #f1ece1 100%)',
    ]
  );

  // Allow click-to-jump on the year jumpbar
  const handleJump = (i: number) => {
    if (!containerRef.current) return;
    const sectionTop = containerRef.current.offsetTop;
    const sectionHeight = containerRef.current.offsetHeight;
    const stepHeight = sectionHeight / STEPS.length;
    const targetY = sectionTop + i * stepHeight + stepHeight * 0.4;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <motion.section
      ref={containerRef}
      style={{ background: bgShift, height: `${STEPS.length * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── Top header bar (only visible at start) ────────────── */}
        <Header />

        {/* ── Progress rail (far left) ──────────────────────────── */}
        <div className="absolute top-0 bottom-0 left-4 md:left-8 w-px bg-border z-10">
          <motion.span
            aria-hidden
            style={{ height: railFill }}
            className="absolute top-0 left-0 w-px bg-primary origin-top"
          />
          {/* Moving rail dot */}
          <motion.span
            aria-hidden
            style={{ top: railFill }}
            className="absolute -translate-y-1/2 -left-[5px] w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white"
          />
        </div>

        {/* ── Center stage ──────────────────────────────────────── */}
        <div className="relative h-full grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] items-center gap-8 px-10 md:px-20 lg:pl-28 lg:pr-40">
          <LeftYear active={active} />
          <RightCard step={STEPS[active]} index={active} />
        </div>

        {/* ── Year jumpbar (far right, lg+ only) ────────────────── */}
        <YearJumpBar active={active} onJump={handleJump} />

        {/* ── Bottom hint bar ───────────────────────────────────── */}
        <BottomBar active={active} />
      </div>
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════════
   Header — eyebrow + heading shown at the very start of the section
   ════════════════════════════════════════════════════════════════ */

function Header() {
  return (
    <div className="absolute top-8 md:top-12 left-16 md:left-24 lg:left-32 right-8 md:right-16 z-20 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true }}
      >
        <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
          Our Story · A Cinematic Reel
        </span>
        <h2 className="mt-2 font-sans font-black tracking-tighter-2 text-foreground leading-[0.96] text-[clamp(1.8rem,3.2vw,2.6rem)]">
          Twenty years,{' '}
          <span className="font-display italic font-medium text-secondary">scroll to play.</span>
        </h2>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LeftYear — massive year that cross-fades on change
   ════════════════════════════════════════════════════════════════ */

function LeftYear({ active }: { active: number }) {
  const year = STEPS[active].y;
  return (
    <div className="relative h-full flex items-center pointer-events-none">
      <div className="relative w-full">
        {/* Ghost previous year — gives the page a sense of motion */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={year}
            initial={{ y: 80, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -100, opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-sans font-black tracking-tighter-3 text-foreground leading-[0.85] text-[clamp(8rem,18vw,18rem)]"
            style={{
              backgroundImage:
                'linear-gradient(180deg, #0f0f0f 0%, #0f0f0f 55%, #e85d04 130%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            {year}
          </motion.div>
        </AnimatePresence>

        {/* Stepper indicator below the year */}
        <div className="mt-6 flex items-center gap-3 pointer-events-auto">
          <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-muted">
            Chapter {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </span>
          <span className="h-px flex-1 max-w-[200px] bg-border" />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   RightCard — milestone card that flies in from the right
   ════════════════════════════════════════════════════════════════ */

function RightCard({ step, index }: { step: Step; index: number }) {
  return (
    <div className="relative h-full flex items-center">
      <AnimatePresence mode="wait">
        <motion.article
          key={step.y}
          initial={{ x: 120, opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
          animate={{ x: 0,   opacity: 1, scale: 1,    filter: 'blur(0px)' }}
          exit={{    x: -80, opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
          transition={{ duration: 0.75, ease: EASE }}
          className="w-full max-w-[560px]"
        >
          {/* Chapter chip */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-border shadow-card-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[0.66rem] font-extrabold tracking-[0.22em] uppercase text-secondary">
              {step.y} · Milestone {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-6 font-sans font-black tracking-tighter-2 leading-[1.02] text-foreground text-[clamp(2rem,3.4vw,3.2rem)]">
            {step.t}
          </h3>

          {/* Body */}
          <p className="mt-6 text-foreground/80 leading-[1.7] text-[clamp(1rem,1.2vw,1.15rem)] max-w-[520px]">
            {step.d}
          </p>

          {/* Decorative ascent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="mt-8 h-px bg-gradient-to-r from-primary via-primary/40 to-transparent origin-left"
          />
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   YearJumpBar — vertical year list on the right (lg+ only)
   Each year is clickable; active year scales and turns primary.
   ════════════════════════════════════════════════════════════════ */

function YearJumpBar({
  active,
  onJump,
}: {
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="hidden lg:flex absolute right-6 top-0 bottom-0 z-20 flex-col items-end justify-center gap-1 pr-1">
      <div className="font-mono text-[0.6rem] font-extrabold tracking-[0.24em] uppercase text-subtle mb-3 -rotate-90 origin-right translate-x-[14px]">
        Years
      </div>
      <div className="flex flex-col gap-2.5">
        {STEPS.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.y}
              type="button"
              onClick={() => onJump(i)}
              className="group flex items-center justify-end gap-3 font-mono font-bold tracking-[0.04em] text-right transition-all"
              style={{
                color: isActive ? '#e85d04' : '#9d9b94',
                fontSize: isActive ? '1.05rem' : '0.78rem',
              }}
            >
              <motion.span
                animate={{
                  width: isActive ? 30 : 12,
                  backgroundColor: isActive ? '#e85d04' : '#dad7cf',
                }}
                transition={{ duration: 0.4, ease: EASE }}
                className="h-px"
                style={{ display: 'inline-block' }}
              />
              <motion.span
                animate={{
                  scale: isActive ? 1.1 : 1,
                  fontWeight: isActive ? 900 : 600,
                }}
                transition={{ duration: 0.35, ease: EASE }}
                className="origin-right"
              >
                {s.y}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   BottomBar — subtle progress meter at the bottom
   ════════════════════════════════════════════════════════════════ */

function BottomBar({ active }: { active: number }) {
  const pct = ((active + 1) / STEPS.length) * 100;
  return (
    <div className="absolute left-16 md:left-24 right-6 lg:right-32 bottom-8 z-10 pointer-events-none">
      <div className="flex items-center justify-between gap-6 max-w-[1280px] mx-auto">
        <div className="flex-1 max-w-[340px] h-px bg-border relative">
          <motion.span
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute left-0 top-0 h-px bg-primary"
          />
        </div>
        <div className="hidden md:flex items-center gap-3 font-mono text-[0.66rem] tracking-[0.18em] uppercase text-muted">
          <span className="text-primary font-extrabold">{STEPS[active].y}</span>
          <span className="opacity-50">·</span>
          <span>{Math.round(pct)}%</span>
          <span className="opacity-50">·</span>
          <span>Scroll to advance ↓</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   Page-load fix: jump back to top so users start at 2005,
   not mid-section if browser restored scroll
   ════════════════════════════════════════════════════════════════ */

export function useScrollResetOnMount() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
}
