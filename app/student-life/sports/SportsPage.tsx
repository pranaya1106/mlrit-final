'use client';

import {
  useRef, useEffect, useState, useId, useCallback,
} from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { Download, Eye, Trophy, ArrowRight, ChevronDown, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import Link from 'next/link';

const EASE = [0.22, 1, 0.36, 1] as const;
// Tighter springs → no perceptible lag
const SPRING_SLOW = { stiffness: 120, damping: 28, mass: 0.6 };
const SPRING_FAST = { stiffness: 220, damping: 32, mass: 0.5 };
// Ultra-snappy spring for cursor follower
const SPRING_CURSOR = { stiffness: 380, damping: 34, mass: 0.3 };

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { num: '26,000+', label: 'Sq ft indoor stadium' },
  { num: '1,000',   label: 'Gallery seating' },
  { num: '10',      label: 'Badminton courts' },
  { num: '20',      label: 'Table-tennis tables' },
  { num: '4',       label: 'Floodlit cricket ground' },
  { num: '32',      label: 'Stadium guest rooms' },
];

const SPORTS_DISCIPLINES = [
  {
    name: 'Cricket',
    facility: 'Floodlit ground · 4 × 77,000 W lights · full grass outfield',
    color: '#166534',
    thumb: '/images/sports/cricket-match.png',
    images: ['/images/sports/cricket-match.png'],
  },
  {
    name: 'Volleyball',
    facility: '2 outdoor regulation courts · sand & hard surface',
    color: '#b45309',
    thumb: '/images/sports/volleyball-match.png',
    images: ['/images/sports/volleyball-match.png'],
  },
  {
    name: 'Football',
    facility: 'Full grass field · training and competitive matches',
    color: '#15803d',
    thumb: '/images/sports/football-team.png',
    images: ['/images/sports/football-team.png'],
  },
  {
    name: 'Basketball',
    facility: 'Full-size outdoor court · marked and lit',
    color: '#c2410c',
    thumb: '/images/sports/basketball-court.png',
    images: ['/images/sports/basketball-court.png'],
  },
  {
    name: 'Badminton',
    facility: '10 professional indoor courts · tournament-grade surface',
    color: '#0369a1',
    thumb: '/images/sports/badminton-courts.png',
    images: ['/images/sports/badminton-courts.png'],
  },
  {
    name: 'Table Tennis',
    facility: '20 tables in dedicated indoor hall · international standard',
    color: '#0f766e',
    thumb: '/images/sports/table-tennis.png',
    images: ['/images/sports/table-tennis.png'],
  },
  {
    name: 'Kabaddi',
    facility: '2 dedicated kabaddi courts · grass surface',
    color: '#7c3aed',
    thumb: '/images/sports/kabaddi.png',
    images: ['/images/sports/kabaddi.png'],
  },
  {
    name: 'Chess',
    facility: 'Dedicated chess hall · national-standard boards · coaching sessions',
    color: '#1e3a5f',
    thumb: '/images/sports/chess.png',
    images: ['/images/sports/chess.png'],
  },
  {
    name: 'Carroms',
    facility: 'Indoor carrom room · multiple boards · inter-college tournaments',
    color: '#78350f',
    thumb: '/images/sports/carrom-tables.png',
    images: ['/images/sports/carrom-tables.png'],
  },
  {
    name: 'Gym & Fitness',
    facility: 'Modern strength & conditioning gym · cardio + free weights',
    color: '#be185d',
    thumb: '/images/sports/gym.png',
    images: ['/images/sports/gym.png'],
  },
  {
    name: 'Squash',
    facility: 'Regulation singles court · glass-back wall',
    color: '#0891b2',
    thumb: '/images/sports/squash-court.png',
    images: ['/images/sports/squash-court.png'],
  },
  {
    name: 'Fencing',
    facility: 'Dedicated fencing training hall · full piste length',
    color: '#374151',
    thumb: '/images/sports/fencing.png',
    images: ['/images/sports/fencing.png'],
  },
  {
    name: 'Snooker',
    facility: '4 full-size tables · climate-controlled room',
    color: '#065f46',
    thumb: '/images/sports/snooker-room.png',
    images: ['/images/sports/snooker-room.png', '/images/sports/snooker-action.png'],
  },
  {
    name: 'Athletics',
    facility: 'Running track · field events area · all-weather surface',
    color: '#b91c1c',
    thumb: '/images/sports/marathon-runner.png',
    images: ['/images/sports/marathon-runner.png'],
  },
];

const TRAINERS = [
  { name: 'Sardar Inderpal Singh', role: 'HOD, Physical Education',  photo: '/images/sports/trainers/sardar-inderpal-singh.jpg' },
  { name: 'P. Srinivas',           role: 'Senior Physical Director',  photo: '/images/sports/trainers/p-srinivas.jpg' },
  { name: 'Ch. Ramesh',            role: 'Asst. Physical Director',   photo: '/images/sports/trainers/ch-ramesh.jpg' },
  { name: 'K. Srinivas',           role: 'Physical Director',         photo: '/images/sports/trainers/k-srinivas.jpg' },
];

const ACCOLADES = [
  { name: 'Harikishore',      sport: 'Gymnastics',     level: 'All India University', photo: '/images/sports/accolades/harikishore.jpg' },
  { name: 'Sindhu',           sport: 'Weight Lifting',  level: 'All India University', photo: '/images/sports/accolades/sindhu.jpg' },
  { name: 'A. Nithin',        sport: 'Cricket',         level: 'State U-25',           photo: '/images/sports/accolades/a-nithin.jpg' },
  { name: 'N. Surya Teja',    sport: 'Cricket',         level: 'Ranji Trophy',         photo: '/images/sports/accolades/n-surya-teja.jpg' },
  { name: 'A. Vinay',         sport: 'Cricket',         level: 'Ranji Trophy',         photo: '/images/sports/accolades/a-vinay.jpg' },
  { name: 'A. Prudhvi Reddy', sport: 'Basketball',      level: 'International',        photo: '/images/sports/accolades/a-prudhvi-reddy.jpg' },
  { name: 'K. Tarun Reddy',   sport: 'Badminton',       level: 'International',        photo: '/images/sports/accolades/k-tarun-reddy.jpg' },
  { name: 'Sanskruthi',       sport: 'Softball',        level: 'National',             photo: null },
];

// Sports quota lists — only 2022-23 document is publicly available from the official site.
// Later years require updated PDFs from the Sports office.
const QUOTA_DOCS = [
  { year: '2022–23', label: 'Sports Quota List 2022–23', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HERO TEXT — three bold words; video plays inside letterforms via SVG mask
// ─────────────────────────────────────────────────────────────────────────────

const HERO_WORDS = ['DREAM.', 'WORK.', 'ACHIEVE.'];

// ─────────────────────────────────────────────────────────────────────────────
// 1. VIDEO-TEXT HERO — SVG mask (Magic UI approach)
//    Motto text: "Win if you can. / Lose if you must. / But never quit."
//    Video plays INSIDE the letterforms via SVG <mask> + <foreignObject>
// ─────────────────────────────────────────────────────────────────────────────

function VideoTextHero() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const maskId     = useId().replace(/:/g, '');
  const [svgSize, setSvgSize] = useState({ w: 1440, h: 900 });

  // Phase: 'mask' → video plays inside text letters
  //        'video' → mask fades out, full video shows
  //        'mask' again when section re-enters viewport after scrolling back
  const [phase, setPhase] = useState<'mask' | 'video'>('mask');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function update() { setSvgSize({ w: window.innerWidth, h: window.innerHeight }); }
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // IntersectionObserver: re-show mask whenever section enters viewport,
  // then kick off the 2s countdown to dissolve to full video.
  useEffect(() => {
    if (prefersReduced) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Section visible → reset to mask phase and start timer
          setPhase('mask');
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setPhase('video'), 3000);
        } else {
          // Section gone → cancel pending timer
          if (timerRef.current) clearTimeout(timerRef.current);
        }
      },
      { threshold: 0.4 }, // trigger when ≥40% of section is visible
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prefersReduced]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const fadeOut   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scaleDown = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const fontSize = Math.min(Math.max(svgSize.w * 0.148, 60), 200);
  const lineH    = fontSize * 1.05;
  const totalH   = HERO_WORDS.length * lineH;
  const startY   = (svgSize.h - totalH) / 2 + fontSize * 0.82;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="sports-hero-heading"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '100svh', minHeight: 520 }}
    >
      <h1 id="sports-hero-heading" className="sr-only">Sports at MLRIT</h1>

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 select-none"
        style={{ scale: scaleDown }}
      >
        {/* Full video always playing underneath */}
        {!prefersReduced && (
          <video
            src="/videos/sports.mp4"
            muted loop playsInline autoPlay preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* ── MASK PHASE ──────────────────────────────────────────────────────
             SVG with a <mask>:
             • White background rect  → everything visible (black overlay)
             • White text shapes      → also visible inside mask
             The mask is applied to the black full-screen rect, INVERTED:
             black text on white mask = transparent letters (video shows through)
             white background = opaque black fill (hides video everywhere else)

             Correct SVG mask logic:
             mask fill="white"  → show the masked element (black rect = visible)
             mask fill="black"  → hide the masked element (black rect = transparent = video visible)
             So: white bg-rect makes the black overlay opaque everywhere,
                 black text punches holes so video shows through the letters.
        ────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {(prefersReduced || phase === 'mask') && (
            <motion.div
              key="mask-overlay"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {prefersReduced ? (
                <>
                  <div className="absolute inset-0 bg-black" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <p
                      className="font-sans font-black uppercase text-white/90 leading-[1.0]"
                      style={{ fontSize: 'clamp(3rem,12vw,10rem)', letterSpacing: '-0.04em' }}
                    >
                      DREAM.<br />WORK.<br />ACHIEVE.
                    </p>
                  </div>
                </>
              ) : (
                <svg
                  width={svgSize.w}
                  height={svgSize.h}
                  viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
                  className="absolute inset-0"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <mask id={maskId}>
                      {/* White = keep black overlay opaque (hides video) */}
                      <rect width={svgSize.w} height={svgSize.h} fill="white" />
                      {/* Black text = punch holes → video shows through here */}
                      {HERO_WORDS.map((word, i) => (
                        <text
                          key={i}
                          x={svgSize.w / 2}
                          y={startY + i * lineH}
                          textAnchor="middle"
                          dominantBaseline="auto"
                          fill="black"
                          fontFamily="var(--font-manrope), system-ui, sans-serif"
                          fontWeight="900"
                          fontSize={fontSize}
                          letterSpacing="-0.04em"
                        >
                          {word}
                        </text>
                      ))}
                    </mask>
                  </defs>
                  {/* Black overlay covering entire screen, masked so letters are cut out */}
                  <rect
                    width={svgSize.w}
                    height={svgSize.h}
                    fill="black"
                    mask={`url(#${maskId})`}
                  />
                </svg>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle vignette always on top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.5) 100%)' }}
        />
      </motion.div>

      {/* Bottom strip */}
      <motion.div
        style={{ opacity: fadeOut }}
        className="absolute bottom-0 inset-x-0 px-6 md:px-12 pb-8 md:pb-10 z-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
        >
          <p className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-white/40 mb-1">Sports at MLRIT</p>
          <p className="font-sans font-medium text-white/70 text-[0.9rem] max-w-[300px] leading-snug">
            12 disciplines · Floodlit cricket · Champions since 2005
          </p>
        </motion.div>
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
        >
          <Link
            href="/student-life/discover-mlr"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-[0.82rem] font-sans font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Virtual Tour <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        animate={prefersReduced ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/30"
        aria-hidden="true"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. STAT TICKER — orange band after hero
// ─────────────────────────────────────────────────────────────────────────────

function StatTicker() {
  const doubled = [...STATS, ...STATS];
  return (
    <div className="bg-primary overflow-hidden py-4" aria-hidden="true">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="flex gap-0 whitespace-nowrap"
      >
        {doubled.map((s, i) => (
          <div key={i} className="flex items-center gap-6 px-8 border-r border-white/20 last:border-0">
            <span className="font-sans font-black text-white text-[1.6rem] leading-none tracking-tighter-2">{s.num}</span>
            <span className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-white/70">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GOAL — shown right after the stat ticker band
// ─────────────────────────────────────────────────────────────────────────────

// Goal + Motto cards animate in using the SECTION as the scroll target,
// not the card itself — avoids overflow-hidden clipping the ref observation.
function GoalCard({ sectionProgress }: { sectionProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const prefersReduced = useReducedMotion();
  const y  = useSpring(useTransform(sectionProgress, [0, 0.5], [72, 0]), SPRING_SLOW);
  const op = useSpring(useTransform(sectionProgress, [0, 0.45], [0, 1]), SPRING_FAST);
  return (
    <motion.div
      style={prefersReduced ? {} : { y, opacity: op }}
      className="rounded-3xl bg-primary p-10 md:p-12 text-white"
    >
      <span className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-white/60">Goal</span>
      <h2
        id="goal-heading"
        className="mt-5 font-sans font-black tracking-tighter-2 text-white text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15]"
      >
        Sportsmanship &amp; Teamwork
      </h2>
      <p className="mt-4 text-white/80 leading-[1.75] text-[1rem]">
        To inculcate the spirit of sportsmanship and teamwork among the students of
        MLR Institute of Technology.
      </p>
    </motion.div>
  );
}

function MottoCard({ sectionProgress }: { sectionProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const prefersReduced = useReducedMotion();
  const y  = useSpring(useTransform(sectionProgress, [0.05, 0.55], [90, 0]), SPRING_SLOW);
  const op = useSpring(useTransform(sectionProgress, [0.05, 0.5], [0, 1]), SPRING_FAST);
  return (
    <motion.div
      style={prefersReduced ? {} : { y, opacity: op }}
      className="rounded-3xl border border-white/10 bg-white/5 p-10 md:p-12"
    >
      <span className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-white/40">Motto</span>
      <blockquote className="mt-5">
        <p className="font-display italic font-bold text-white text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.2] tracking-tight">&ldquo;Win if you can.</p>
        <p className="font-display italic font-bold text-white text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.2] tracking-tight">Lose if you must.</p>
        <p className="font-display italic font-bold text-primary text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.2] tracking-tight">But never quit.&rdquo;</p>
      </blockquote>
    </motion.div>
  );
}

function GoalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // Track the section entering the viewport — wider range so animation is visible
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'start 15%'],
  });
  return (
    <section ref={sectionRef} aria-labelledby="goal-heading" className="bg-foreground">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-6">
          <GoalCard sectionProgress={scrollYProgress} />
          <MottoCard sectionProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SCROLL OVERVIEW — pinned sticky section
//    Phase 1 (0–55%): TWO paragraphs reveal word-by-word in sequence
//      Para A — "Our Legacy" label as a full sentence (large, coloured)
//      Para B — the actual history sentence
//    Phase 2 (55–100%): stats float up beneath
// ─────────────────────────────────────────────────────────────────────────────

// Three real paragraphs — each word transitions from light/thin → bold/dark on scroll
const PARA_A = [
  'Sports', 'shape', 'the', 'whole', 'person,',
  'and', 'at', 'MLRIT,', 'that', 'truth', 'has', 'driven',
  'everything', 'we', 'build.', 'Since', '2005,', 'our',
  'athletes', 'have', 'competed,', 'trained,', 'and', 'won',
  'on', 'national', 'and', 'international', 'stages', 'across',
  'twelve', 'disciplines', '—', 'cricket,', 'volleyball,',
  'badminton,', 'kabaddi,', 'basketball,', 'and', 'more.',
];

const PARA_B = [
  'Our', 'infrastructure', 'rivals', 'dedicated', 'sports',
  'institutes.', 'A', 'floodlit', 'cricket', 'ground,',
  'twelve', 'professional', 'indoor', 'courts,', 'a',
  'world-class', 'gym,', 'and', 'specialist', 'coaching',
  '—', 'every', 'facility', 'built', 'with', 'one',
  'purpose:', 'to', 'give', 'our', 'students', 'every', 'advantage.',
];

const PARA_C = [
  'Across', 'twelve', 'sports,', 'sports-quota', 'seats', 'are',
  'reserved', 'every', 'year', 'for', 'those', 'who', 'earn', 'them',
  '—', 'because', 'we', 'believe', 'champions', 'deserve', 'an',
  'education', 'that', 'matches', 'their', 'ambition.',
];

const ALL_PARAS = [PARA_A, PARA_B, PARA_C];
const TOTAL_WORDS = PARA_A.length + PARA_B.length + PARA_C.length;

// Framer-style text reveal: each word starts dim (#3a3a3a) and lights up to white
// as the scroll progress sweeps past it — exactly like a spotlight on dark bg.
function BoldWord({
  word,
  globalIdx,
  progress,
}: {
  word: string;
  globalIdx: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const scrollBand = 0.82;
  const half   = scrollBand / TOTAL_WORDS;
  const center = (globalIdx / TOTAL_WORDS) * scrollBand + half * 0.5;
  const lo = Math.max(0, center - half * 2);
  const hi = Math.min(1, center + half * 0.5);

  const lit = useTransform(progress, [lo, hi], [0, 1]);

  // dim grey (#3a3a3a) → white (#ffffff)
  const color = useTransform(lit, (v) => {
    const c = Math.round(58 + (255 - 58) * v);
    return `rgb(${c},${c},${c})`;
  });

  return (
    <motion.span style={{ color }} className="inline mr-[0.22em]">
      {word}
    </motion.span>
  );
}

function ScrollOverview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // Track running word index across paragraphs
  let runningIdx = 0;

  return (
    <section
      aria-labelledby="overview-heading"
      ref={containerRef}
      className="relative bg-foreground"
      style={{ height: prefersReduced ? 'auto' : '500vh' }}
    >
      <div className={`${prefersReduced ? 'relative' : 'sticky'} top-0 h-screen flex flex-col justify-center overflow-hidden`}>
        <div className="w-full max-w-[720px] mx-auto px-5 md:px-10 lg:px-16 py-16 flex flex-col gap-8">

          {/* Section label */}
          <p className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-primary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" aria-hidden="true" />
            Our Legacy
          </p>

          <h2 id="overview-heading" className="sr-only">Sports at MLRIT — Our Legacy</h2>

          {/* Three editorial paragraphs — each word lights up white as it scrolls into focus */}
          <div className="space-y-5">
            {ALL_PARAS.map((para, pIdx) => {
              const startIdx = runningIdx;
              runningIdx += para.length;
              return (
                <p
                  key={pIdx}
                  className="font-sans font-semibold text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.75] tracking-[-0.005em] break-words"
                >
                  {prefersReduced
                    ? <span className="text-white">{para.join(' ')}</span>
                    : para.map((word, wIdx) => (
                        <BoldWord
                          key={wIdx}
                          word={word}
                          globalIdx={startIdx + wIdx}
                          progress={scrollYProgress}
                        />
                      ))
                  }
                </p>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PHOTO LIGHTBOX — opens on "View photos" click per sport
// ─────────────────────────────────────────────────────────────────────────────

function PhotoLightbox({
  sport,
  images,
  onClose,
}: {
  sport: string;
  images: string[];
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex flex-col items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${sport} photos`}
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="absolute top-0 inset-x-0 px-6 py-4 flex items-center justify-between z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-white/40">{sport}</p>
          <p className="font-sans font-black text-white text-[1.1rem] leading-tight">{sport} — Facilities</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.7rem] text-white/40 tabular-nums">
            {idx + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        className="relative w-full max-w-5xl px-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-full"
          >
            <img
              src={images[idx]}
              alt={`${sport} facility — image ${idx + 1}`}
              className="w-full max-h-[72vh] object-contain rounded-2xl"
              onError={(e) => {
                // Fallback gradient when image 404s
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = 'none';
                (el.nextSibling as HTMLElement)?.style && ((el.nextSibling as HTMLElement).style.display = 'flex');
              }}
            />
            {/* Gradient placeholder shown if img fails */}
            <div
              className="w-full aspect-video rounded-2xl items-center justify-center hidden"
              style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}
            >
              <p className="font-sans text-white/30 text-sm">{sport}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Dot strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-6" aria-hidden="true" onClick={(e) => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-200 ${i === idx ? 'bg-white w-6 h-1.5' : 'bg-white/30 w-1.5 h-1.5'}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// 6. SPORTS DISCIPLINE INDEX
//    • Each row slides in from left on scroll
//    • Hovering a row: fixed-position image card follows the real cursor
//    • Clicking card / row opens the lightbox
// ─────────────────────────────────────────────────────────────────────────────

// Single global cursor tracker — one listener on window, read by the card
function useCursorPos() {
  const x = useSpring(0, SPRING_CURSOR);
  const y = useSpring(0, SPRING_CURSOR);
  useEffect(() => {
    function move(e: MouseEvent) { x.set(e.clientX); y.set(e.clientY); }
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);
  return { x, y };
}

// Fixed cursor-following image card (portal-style, sits above everything)
function CursorCard({
  sport,
  visible,
  cursorX,
  cursorY,
  onOpen,
}: {
  sport: typeof SPORTS_DISCIPLINES[number] | null;
  visible: boolean;
  cursorX: ReturnType<typeof useSpring>;
  cursorY: ReturnType<typeof useSpring>;
  onOpen: () => void;
}) {
  const scale   = useSpring(visible ? 1 : 0.78, { stiffness: 260, damping: 28 });
  const opacity = useSpring(visible ? 1 : 0,    { stiffness: 260, damping: 28 });

  useEffect(() => {
    scale.set(visible ? 1 : 0.78);
    opacity.set(visible ? 1 : 0);
  }, [visible, scale, opacity]);

  if (!sport) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed pointer-events-none select-none z-[120] top-0 left-0"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: 20,    // offset right of cursor tip
        translateY: '-45%',
        scale,
        opacity,
      }}
    >
      <div
        className="w-[240px] overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: sport.color }}
      >
        <div className="relative h-[155px] overflow-hidden">
          <img
            src={sport.thumb}
            alt={sport.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <p className="absolute bottom-3 left-4 font-sans font-black text-white text-[1rem] leading-none tracking-tight">
            {sport.name}
          </p>
        </div>
        <div className="px-4 py-3 pointer-events-auto cursor-pointer" onClick={onOpen}>
          <p className="font-mono text-[0.56rem] tracking-[0.1em] uppercase text-white/65 leading-relaxed line-clamp-2">
            {sport.facility}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 font-sans font-semibold text-white text-[0.72rem]">
            <Images className="w-3 h-3" aria-hidden="true" /> View photos
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function DisciplineRow({
  sport,
  index,
  isHovered,
  onHover,
  onLeave,
  onViewPhotos,
}: {
  sport: typeof SPORTS_DISCIPLINES[number];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onViewPhotos: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start 96%', 'start 48%'] });
  const x   = useTransform(scrollYProgress, [0, 1], [-28, 0]);
  const op  = useTransform(scrollYProgress, [0, 0.65], [0, 1]);
  const xSp = useSpring(x, SPRING_SLOW);
  const oSp = useSpring(op, SPRING_FAST);

  return (
    <motion.div
      ref={rowRef}
      style={prefersReduced ? {} : { x: xSp, opacity: oSp }}
      onMouseEnter={() => !prefersReduced && onHover()}
      onMouseLeave={() => onLeave()}
      onClick={onViewPhotos}
      className="relative flex items-center gap-5 py-5 border-b border-border cursor-pointer"
      role="listitem"
    >
      <span className="font-mono text-[0.55rem] text-muted tabular-nums w-6 flex-none">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        <motion.span
          animate={prefersReduced ? {} : { x: isHovered ? 8 : 0, color: isHovered ? 'var(--color-primary)' : 'var(--color-foreground)' }}
          transition={{ duration: 0.18, ease: EASE }}
          className="font-sans font-black tracking-tighter-2 text-[clamp(1.35rem,2.4vw,2.1rem)] leading-none block"
        >
          {sport.name}
        </motion.span>
        <p className="mt-1 font-mono text-[0.57rem] tracking-[0.09em] uppercase text-muted leading-relaxed">
          {sport.facility}
        </p>
      </div>

      <motion.span
        animate={prefersReduced ? {} : { opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 6 }}
        transition={{ duration: 0.15, ease: EASE }}
        className="font-mono text-[0.7rem] text-primary flex-none"
        aria-hidden="true"
      >
        ↗
      </motion.span>
    </motion.div>
  );
}

function SportsDisciplineIndex() {
  const [lightbox, setLightbox]       = useState<typeof SPORTS_DISCIPLINES[number] | null>(null);
  const [hoveredSport, setHoveredSport] = useState<typeof SPORTS_DISCIPLINES[number] | null>(null);
  const sectionRef    = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { x: cursorX, y: cursorY } = useCursorPos();

  const { scrollYProgress: headP } = useScroll({ target: sectionRef, offset: ['start end', 'start 60%'] });
  const headY  = useSpring(useTransform(headP, [0, 1], [32, 0]), SPRING_SLOW);
  const headOp = useSpring(useTransform(headP, [0, 0.7], [0, 1]), SPRING_FAST);

  return (
    <section ref={sectionRef} aria-labelledby="disciplines-heading" className="bg-cream relative">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          style={prefersReduced ? {} : { y: headY, opacity: headOp }}
          className="mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            Sports Offered
          </span>
          <h2
            id="disciplines-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            12 disciplines.{' '}
            <span className="font-display italic font-medium text-secondary">One campus.</span>
          </h2>
        </motion.div>

        <div role="list">
          {SPORTS_DISCIPLINES.map((sport, i) => (
            <DisciplineRow
              key={sport.name}
              sport={sport}
              index={i}
              isHovered={hoveredSport?.name === sport.name}
              onHover={() => setHoveredSport(sport)}
              onLeave={() => setHoveredSport(null)}
              onViewPhotos={() => setLightbox(sport)}
            />
          ))}
        </div>
      </div>

      {/* Fixed cursor card — rendered outside the list, above everything */}
      {!prefersReduced && (
        <CursorCard
          sport={hoveredSport}
          visible={!!hoveredSport}
          cursorX={cursorX}
          cursorY={cursorY}
          onOpen={() => hoveredSport && setLightbox(hoveredSport)}
        />
      )}

      <AnimatePresence>
        {lightbox && (
          <PhotoLightbox
            sport={lightbox.name}
            images={lightbox.images}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. SPORTS QUOTA — scroll entry
// ─────────────────────────────────────────────────────────────────────────────

function QuotaDocRow({ doc }: { doc: (typeof QUOTA_DOCS)[number] }) {
  const prefersReduced = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rp } = useScroll({ target: rowRef, offset: ['start 96%', 'start 70%'] });
  const rx = useTransform(rp, [0, 1], [-20, 0]);
  const ro = useTransform(rp, [0, 0.7], [0, 1]);
  const springX = useSpring(rx, SPRING_SLOW);
  const springO = useSpring(ro, SPRING_FAST);
  return (
    <motion.div
      ref={rowRef}
      role="listitem"
      style={prefersReduced ? {} : { x: springX, opacity: springO }}
      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-5 py-4 hover:border-primary hover:shadow-card-soft transition-all duration-200"
    >
      <div className="flex items-center gap-4 min-w-0">
        <span className="font-mono text-[0.6rem] font-bold tracking-[0.14em] uppercase text-primary flex-none">{doc.year}</span>
        <span className="font-sans font-medium text-foreground text-[0.92rem] truncate">{doc.label}</span>
      </div>
      <div className="flex items-center gap-2 flex-none">
        <a href={doc.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${doc.label}`}
           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] font-sans font-semibold text-muted hover:text-foreground border border-border hover:border-foreground transition-colors">
          <Eye className="w-3.5 h-3.5" aria-hidden="true" /> View
        </a>
        <a href={doc.href} download target="_blank" rel="noopener noreferrer" aria-label={`Download ${doc.label}`}
           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] font-sans font-semibold bg-foreground text-white hover:bg-primary transition-colors">
          <Download className="w-3.5 h-3.5" aria-hidden="true" /> PDF
        </a>
      </div>
    </motion.div>
  );
}

function QuotaSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 55%'] });
  const y  = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const op = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const springY = useSpring(y, SPRING_SLOW);
  const springO = useSpring(op, SPRING_FAST);

  return (
    <section ref={sectionRef} aria-labelledby="quota-heading" className="bg-white">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          style={prefersReduced ? {} : { y: springY, opacity: springO }}
          className="mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            Sports Quota
          </span>
          <h2
            id="quota-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            Seats reserved for{' '}
            <span className="font-display italic font-medium text-secondary">athletes.</span>
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-secondary text-white">
            <div className="flex-1 px-8 py-7 border-b sm:border-b-0 sm:border-r border-white/10">
              <div className="font-sans font-black tracking-tighter-2 text-[clamp(2rem,3vw,2.8rem)] leading-none">10</div>
              <div className="mt-2 font-mono text-[0.62rem] tracking-[0.18em] uppercase text-white/55">Free sports-quota seats every year</div>
            </div>
            <div className="flex-1 px-8 py-7">
              <div className="font-sans font-black tracking-tighter-2 text-[clamp(2rem,3vw,2.8rem)] leading-none">2020–26</div>
              <div className="mt-2 font-mono text-[0.62rem] tracking-[0.18em] uppercase text-white/55">Continuous intake, year on year</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3" role="list" aria-label="Sports quota documents">
          {QUOTA_DOCS.map((doc) => (
            <QuotaDocRow key={doc.year} doc={doc} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. TRAINERS
// ─────────────────────────────────────────────────────────────────────────────

function TrainerCard({ t }: { t: (typeof TRAINERS)[number] }) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cp } = useScroll({ target: cardRef, offset: ['start 95%', 'start 60%'] });
  const cy = useTransform(cp, [0, 1], [40, 0]);
  const co = useTransform(cp, [0, 0.8], [0, 1]);
  const springY = useSpring(cy, SPRING_SLOW);
  const springO = useSpring(co, SPRING_FAST);
  return (
    <motion.div
      ref={cardRef}
      style={prefersReduced ? {} : { y: springY, opacity: springO }}
      className="group rounded-2xl bg-white border border-border overflow-hidden hover:-translate-y-1.5 hover:shadow-card-strong transition-all duration-300"
    >
      <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
        <img src={t.photo} alt={`Portrait of ${t.name}`}
          className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700" loading="lazy" />
      </div>
      <div className="p-5">
        <p className="font-sans font-bold text-foreground text-[1rem] leading-snug">{t.name}</p>
        <p className="mt-1 font-mono text-[0.6rem] tracking-[0.14em] uppercase text-muted">{t.role}</p>
      </div>
    </motion.div>
  );
}

function TrainersSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 60%'] });
  const headY  = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const headOp = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const springHeadY = useSpring(headY, SPRING_SLOW);
  const springHeadO = useSpring(headOp, SPRING_FAST);

  return (
    <section ref={sectionRef} aria-labelledby="trainers-heading" className="bg-white overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          style={prefersReduced ? {} : { y: springHeadY, opacity: springHeadO }}
          className="mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            Coaching Staff
          </span>
          <h2
            id="trainers-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            The people who{' '}
            <span className="font-display italic font-medium text-secondary">build champions.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRAINERS.map((t) => (
            <TrainerCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. ACCOLADES
// ─────────────────────────────────────────────────────────────────────────────

function AccoladeCard({ a, idx }: { a: (typeof ACCOLADES)[number]; idx: number }) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cp } = useScroll({ target: cardRef, offset: ['start 95%', 'start 65%'] });
  const cy  = useTransform(cp, [0, 1], [48, 0]);
  const co  = useTransform(cp, [0, 0.8], [0, 1]);
  const crz = useTransform(cp, [0, 1], [idx % 2 === 0 ? -2 : 2, 0]);
  const springY = useSpring(cy, SPRING_SLOW);
  const springO = useSpring(co, SPRING_FAST);
  const springRZ = useSpring(crz, SPRING_SLOW);
  return (
    <motion.div
      ref={cardRef}
      style={prefersReduced ? {} : { y: springY, opacity: springO, rotateZ: springRZ }}
      whileHover={prefersReduced ? {} : { y: -6, rotateZ: 0.5 }}
      className="group rounded-2xl border border-border bg-white overflow-hidden shadow-card-soft hover:shadow-card-strong transition-shadow duration-300"
    >
      <div className="aspect-square overflow-hidden bg-neutral-100 relative">
        {a.photo ? (
          <img src={a.photo} alt={`${a.name} — ${a.sport}`}
            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/10">
            <Trophy className="w-10 h-10 text-secondary/30" aria-hidden="true" />
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 px-3 pb-2 pt-10 bg-gradient-to-t from-black/70 to-transparent">
          <span className="font-mono text-[0.56rem] font-bold tracking-[0.15em] uppercase text-white/90">{a.level}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="font-sans font-bold text-foreground text-[0.95rem]">{a.name}</p>
        <p className="mt-0.5 text-muted text-[0.8rem]">{a.sport}</p>
      </div>
    </motion.div>
  );
}

function AccoladesSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 60%'] });
  const headY  = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const headOp = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const springHeadY = useSpring(headY, SPRING_SLOW);
  const springHeadO = useSpring(headOp, SPRING_FAST);

  return (
    <section ref={sectionRef} aria-labelledby="accolades-heading" className="bg-cream">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start mb-12 md:mb-16">
          <motion.div
            style={prefersReduced ? {} : { y: springHeadY, opacity: springHeadO }}
            className="md:w-[45%] shrink-0"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              Sports Accolades
            </span>
            <h2
              id="accolades-heading"
              className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
            >
              Our athletes.{' '}
              <span className="font-display italic font-medium text-secondary">Our pride.</span>
            </h2>
          </motion.div>
          <div className="flex-1 rounded-2xl overflow-hidden" style={{ height: 'clamp(160px,18vw,240px)' }}>
            <img
              src="/images/sports/trophy-cabinet.png"
              alt="MLRIT trophy cabinet — decades of sports achievements"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ACCOLADES.map((a, i) => (
            <AccoladeCard key={a.name} a={a} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLOSING
// ─────────────────────────────────────────────────────────────────────────────

function ClosingStatement() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] });
  const y  = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const op = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const op2 = useTransform(scrollYProgress, [0.2, 0.9], [0, 1]);
  const springY  = useSpring(y, SPRING_SLOW);
  const springO  = useSpring(op, SPRING_FAST);
  const springY2 = useSpring(y2, SPRING_SLOW);
  const springO2 = useSpring(op2, SPRING_FAST);

  return (
    <section ref={sectionRef} aria-label="Closing" className="bg-foreground overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-24 md:py-32 text-center">
        <motion.p
          style={prefersReduced ? {} : { y: springY, opacity: springO }}
          className="font-display italic font-bold text-white text-[clamp(2rem,4.5vw,4rem)] leading-[1.18] tracking-tight max-w-[860px] mx-auto"
        >
          &ldquo;The discipline, focus, and resilience you build on the field
          follow you into every career you choose.&rdquo;
        </motion.p>

        <motion.div
          style={prefersReduced ? {} : { y: springY2, opacity: springO2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/student-life/discover-mlr"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-sans font-bold text-[0.92rem] hover:bg-primary-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Take a virtual tour <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/campus/clubs"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white font-sans font-bold text-[0.92rem] hover:border-white/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Explore student clubs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// Order: Hero → StatTicker → Goal → ScrollOverview → Disciplines
//        → Quota → Trainers → Accolades → Closing
// ─────────────────────────────────────────────────────────────────────────────

export default function SportsPage() {
  return (
    <>
      <VideoTextHero />
      <StatTicker />
      <GoalSection />
      <ScrollOverview />
      <SportsDisciplineIndex />
      <QuotaSection />
      <TrainersSection />
      <AccoladesSection />
      <ClosingStatement />
    </>
  );
}
