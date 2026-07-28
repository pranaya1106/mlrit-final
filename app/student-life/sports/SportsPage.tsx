'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Download, Eye, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Data ─────────────────────────────────────────────────────────────────────

const INDOOR_FACILITIES = [
  { name: 'Indoor Stadium', detail: '26,000+ sq ft across 2 floors, gallery for 1,000' },
  { name: '10 Badminton Courts', detail: 'Professional-grade courts inside the stadium' },
  { name: 'Table Tennis Hall', detail: '20 tables with international-standard surface' },
  { name: 'Fully-Equipped Gym', detail: 'Modern strength and conditioning equipment' },
  { name: '4 Snooker Tables', detail: 'Full-size tables in a dedicated room' },
  { name: 'Carom Boards', detail: 'Space for 6+ boards for recreational play' },
  { name: 'Squash Court', detail: 'Regulation singles squash court' },
  { name: 'Fencing Hall', detail: 'Dedicated space for fencing training' },
  { name: 'Zumba & Meditation', detail: 'Dedicated wellness and fitness halls' },
  { name: 'Guest Accommodation', detail: '32 rooms within the stadium complex' },
];

const OUTDOOR_FACILITIES = [
  { name: 'Cricket Ground', detail: 'Floodlit ground with 4 lights delivering 77,000W' },
  { name: '2 Volleyball Courts', detail: 'Outdoor courts with regulation dimensions' },
  { name: 'Basketball Court', detail: 'Full-size outdoor basketball court' },
  { name: 'Football Field', detail: 'Full grass field for training and matches' },
  { name: '2 Kabaddi Courts', detail: 'Dedicated kabaddi playing surfaces' },
  { name: 'Throwball Court', detail: 'Regulation outdoor throwball court' },
  { name: 'Kho-Kho Field', detail: 'Traditional field game surface' },
  { name: 'Athletic Track', detail: 'Running and field athletics training area' },
];

const SPORTS_DISCIPLINES = [
  'Cricket',
  'Volleyball',
  'Football',
  'Basketball',
  'Badminton',
  'Table Tennis',
  'Kabaddi',
  'Gym & Fitness',
  'Squash',
  'Fencing',
  'Snooker',
  'Athletics',
];

const TRAINERS = [
  {
    name: 'Sardar Inderpal Singh',
    role: 'HOD, Physical Education',
    photo: '/images/sports/trainers/sardar-inderpal-singh.jpg',
  },
  {
    name: 'P. Srinivas',
    role: 'Senior Physical Director',
    photo: '/images/sports/trainers/p-srinivas.jpg',
  },
  {
    name: 'Ch. Ramesh',
    role: 'Asst. Physical Director',
    photo: '/images/sports/trainers/ch-ramesh.jpg',
  },
  {
    name: 'K. Srinivas',
    role: 'Physical Director',
    photo: '/images/sports/trainers/k-srinivas.jpg',
  },
];

const ACCOLADES = [
  { name: 'Harikishore',      sport: 'Gymnastics',   level: 'All India University', photo: '/images/sports/accolades/harikishore.jpg' },
  { name: 'Sindhu',           sport: 'Weight Lifting',level: 'All India University', photo: '/images/sports/accolades/sindhu.jpg' },
  { name: 'A. Nithin',        sport: 'Cricket',       level: 'State U-25',           photo: '/images/sports/accolades/a-nithin.jpg' },
  { name: 'N. Surya Teja',    sport: 'Cricket',       level: 'Ranji Trophy',         photo: '/images/sports/accolades/n-surya-teja.jpg' },
  { name: 'A. Vinay',         sport: 'Cricket',       level: 'Ranji Trophy',         photo: '/images/sports/accolades/a-vinay.jpg' },
  { name: 'A. Prudhvi Reddy', sport: 'Basketball',    level: 'International',        photo: '/images/sports/accolades/a-prudhvi-reddy.jpg' },
  { name: 'K. Tarun Reddy',   sport: 'Badminton',     level: 'International',        photo: '/images/sports/accolades/k-tarun-reddy.jpg' },
  { name: 'Sanskruthi',       sport: 'Softball',      level: 'National',             photo: null },
];

const QUOTA_DOCS = [
  { year: '2026–27', label: 'Sports Quota List 2026–27', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
  { year: '2025–26', label: 'Sports Quota List 2025–26', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
  { year: '2024–25', label: 'Sports Quota List 2024–25', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
  { year: '2023–24', label: 'Sports Quota List 2023–24', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
  { year: '2022–23', label: 'Sports Quota List 2022–23', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
  { year: '2021–22', label: 'Sports Quota List 2021–22', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
  { year: '2020–21', label: 'Sports Quota List 2020–21', href: 'https://mlrit.ac.in/wp-content/uploads/2022/12/Sports-Quota-Students-List-2022-23.pdf' },
];

// ── Video Text Hero ───────────────────────────────────────────────────────────

function VideoTextHero() {
  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReduced) return;
    v.play().catch(() => {});
  }, [prefersReduced]);

  return (
    <section
      aria-labelledby="sports-hero-heading"
      className="relative w-full overflow-hidden bg-foreground"
      style={{ minHeight: 'clamp(340px, 52vw, 700px)' }}
    >
      {/* ── Video-masked title ─────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center" style={{ minHeight: 'clamp(340px, 52vw, 700px)' }}>
        {/* Static fallback text shown to screen readers / reduced-motion */}
        <h1
          id="sports-hero-heading"
          className="sr-only"
        >
          Sports at MLRIT
        </h1>

        {/* Video-text mask container */}
        <div
          aria-hidden="true"
          className="relative select-none px-4 w-full flex items-center justify-center"
          style={{ minHeight: 'clamp(340px, 52vw, 700px)' }}
        >
          {/* The SVG mask technique: video clipped to text shape */}
          <svg
            width="0"
            height="0"
            className="absolute"
            style={{ position: 'absolute', width: 0, height: 0 }}
          >
            <defs>
              <clipPath id="text-clip" clipPathUnits="objectBoundingBox">
                {/* This approach uses a foreignObject + text SVG for video masking */}
              </clipPath>
            </defs>
          </svg>

          {/* Canvas approach: large text with background-clip */}
          <div className="relative w-full max-w-[1400px] mx-auto">
            <div
              className="font-sans font-black text-center leading-none tracking-tighter-2 uppercase"
              style={{
                fontSize: 'clamp(5rem, 18vw, 18rem)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                backgroundImage: 'url(/videos/sports.mp4)',
                position: 'relative',
              }}
            >
              {/* Text with video fill via mix-blend-mode isolation */}
              <div className="relative isolate">
                {/* White text on dark bg */}
                <span
                  className="relative z-10 block"
                  style={{
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '0px',
                    backgroundImage: 'none',
                    color: 'transparent',
                  }}
                >
                  {/* We use a simpler, reliable approach: the video plays UNDER text with mix-blend-mode */}
                </span>
              </div>
            </div>

            {/* ── Reliable cross-browser video-text implementation ──────── */}
            {/*
              Approach: Large text in "screen" blend-mode over a video.
              The text is white, the background is black, the video shows through
              where the text is (via mix-blend-mode: multiply on a dark-bg container).
              This works reliably on all modern browsers.
            */}
            <div
              className="relative overflow-hidden"
              style={{
                background: '#0c0c0e',
                minHeight: 'clamp(200px, 36vw, 520px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Video layer */}
              {!prefersReduced && (
                <video
                  ref={videoRef}
                  src="/videos/sports.mp4"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/images/sports/accolades/harikishore.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-hidden="true"
                />
              )}

              {/* Poster fallback for reduced-motion */}
              {prefersReduced && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/images/sports/accolades/harikishore.jpg)' }}
                  aria-hidden="true"
                />
              )}

              {/* Dark overlay to control contrast */}
              <div
                className="absolute inset-0"
                style={{ background: 'rgba(0,0,0,0.35)', mixBlendMode: 'multiply' }}
                aria-hidden="true"
              />

              {/* Text — mix-blend-mode: overlay punches through to video */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, ease: EASE }}
                className="relative z-10 w-full text-center px-4"
              >
                <p
                  className="font-sans font-black uppercase leading-none tracking-tighter-2"
                  style={{
                    fontSize: 'clamp(4.5rem, 16vw, 16rem)',
                    color: 'white',
                    mixBlendMode: 'overlay',
                    lineHeight: 0.9,
                  }}
                >
                  PLAY
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Subtitle strip ────────────────────────────────────────────── */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
        className="absolute bottom-0 inset-x-0 px-5 md:px-12 pb-8 md:pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-white/50 mb-1">
            Sports at MLRIT
          </p>
          <p className="font-sans font-semibold text-white/90 text-[0.95rem] max-w-xs leading-snug">
            26,000 sq ft stadium. Floodlit cricket. Resident coaches. Champions since 2005.
          </p>
        </div>
        <Link
          href="/student-life/discover-mlr"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-[0.84rem] font-sans font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white flex-none"
        >
          Virtual Tour <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </section>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
      {children}
    </span>
  );
}

// ── Sports Overview ───────────────────────────────────────────────────────────

function SportsOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="overview-heading"
      className="bg-white"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <SectionLabel>Overview</SectionLabel>
            <h2
              id="overview-heading"
              className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
            >
              Built for champions.{' '}
              <span className="font-display italic font-medium text-secondary">
                Every day.
              </span>
            </h2>
            <p className="mt-6 text-muted leading-[1.8] text-[1.02rem]">
              Sports play an important role in shaping the personality and fitness of every MLRIT
              student. Since its founding in 2005, the institute has fielded undisputed champions in
              volleyball, badminton, kabaddi, basketball and cricket — backed by sporting
              environments built to global standards.
            </p>
            <p className="mt-5 text-muted leading-[1.8] text-[1.02rem]">
              Every academic year, MLRIT publishes a consolidated sports-achievements record spanning
              inter-university, state, national and international-level results across every sport
              the institute fields teams in.
            </p>
          </motion.div>

          {/* Stats block */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { num: '26,000+', label: 'Sq ft indoor stadium, 2 floors' },
              { num: '1,000', label: 'Stadium gallery seating' },
              { num: '10', label: 'Badminton courts' },
              { num: '20', label: 'Table-tennis tables' },
              { num: '4', label: 'Cricket-ground floodlights' },
              { num: '32', label: 'Stadium guest rooms' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-cream p-6 hover:-translate-y-1 hover:shadow-card-soft transition-all duration-300"
              >
                <div className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none">
                  {s.num}
                </div>
                <div className="mt-2.5 font-mono text-[0.62rem] tracking-[0.18em] uppercase text-muted leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Indoor / Outdoor tabs ─────────────────────────────────────────────────────

type Venue = 'indoor' | 'outdoor';

function FacilitiesSection() {
  const [active, setActive] = useState<Venue>('indoor');
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const items = active === 'indoor' ? INDOOR_FACILITIES : OUTDOOR_FACILITIES;

  const handleKey = (e: React.KeyboardEvent, which: Venue) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive(which === 'indoor' ? 'outdoor' : 'indoor');
      (e.currentTarget.parentElement?.querySelector<HTMLButtonElement>(
        `[data-tab="${which === 'indoor' ? 'outdoor' : 'indoor'}"]`
      ))?.focus();
    }
  };

  return (
    <section
      aria-labelledby="facilities-heading"
      className="bg-cream"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionLabel>Facilities</SectionLabel>
          <h2
            id="facilities-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            Every sport.{' '}
            <span className="font-display italic font-medium text-secondary">
              Every setting.
            </span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Facility type"
          className="mt-10 inline-flex gap-1 p-1 rounded-xl bg-white border border-border"
        >
          {(['indoor', 'outdoor'] as Venue[]).map((v) => (
            <button
              key={v}
              role="tab"
              data-tab={v}
              aria-selected={active === v}
              aria-controls={`facilities-panel-${v}`}
              tabIndex={active === v ? 0 : -1}
              onClick={() => setActive(v)}
              onKeyDown={(e) => handleKey(e, v)}
              className={`px-6 py-2.5 rounded-lg font-sans font-semibold text-[0.9rem] capitalize transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                active === v
                  ? 'bg-foreground text-white'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {v === 'indoor' ? 'Indoor' : 'Outdoor'}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div
          role="tabpanel"
          id={`facilities-panel-${active}`}
          aria-label={active === 'indoor' ? 'Indoor facilities' : 'Outdoor facilities'}
          className="mt-8"
        >
          <motion.div
            key={active}
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
                className="group rounded-2xl border border-border bg-white p-6 hover:-translate-y-1 hover:border-primary hover:shadow-card-soft transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full bg-secondary flex-shrink-0 group-hover:bg-primary transition-colors"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-sans font-bold text-foreground text-[0.98rem]">{item.name}</p>
                    <p className="mt-1 text-muted text-[0.84rem] leading-snug">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Sports Discipline Index ───────────────────────────────────────────────────

function SportsDisciplineIndex() {
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="disciplines-heading"
      className="bg-foreground overflow-hidden"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          className="mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
            Sports Offered
          </span>
          <h2
            id="disciplines-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-white text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            12 disciplines.{' '}
            <span className="font-display italic font-medium text-primary">
              One campus.
            </span>
          </h2>
        </motion.div>

        {/* Editorial discipline list */}
        <div role="list" className="divide-y divide-white/8">
          {SPORTS_DISCIPLINES.map((sport, i) => {
            const isHovered = hovered === sport;
            return (
              <motion.div
                key={sport}
                role="listitem"
                initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
                onMouseEnter={() => !prefersReduced && setHovered(sport)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => !prefersReduced && setHovered(sport)}
                onBlur={() => setHovered(null)}
                className="group flex items-center justify-between py-4 md:py-5 cursor-default"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[0.6rem] text-white/30 tabular-nums w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <motion.span
                    animate={prefersReduced ? {} : { x: isHovered ? 8 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="font-sans font-black tracking-tighter-2 text-white text-[clamp(1.4rem,2.6vw,2.2rem)] leading-none"
                  >
                    {sport}
                  </motion.span>
                </div>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="w-2 h-2 rounded-full bg-primary flex-none"
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Goal & Motto ──────────────────────────────────────────────────────────────

function GoalMotto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="motto-heading"
      className="bg-white"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Goal */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
            className="rounded-3xl bg-secondary p-10 md:p-12 text-white"
          >
            <span className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-white/60">
              Goal
            </span>
            <h2
              id="motto-heading"
              className="mt-5 font-sans font-black tracking-tighter-2 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15]"
            >
              Sportsmanship &amp; Teamwork
            </h2>
            <p className="mt-4 text-white/80 leading-[1.75] text-[1rem]">
              To inculcate the spirit of sportsmanship and teamwork among the students of
              MLR Institute of Technology.
            </p>
          </motion.div>

          {/* Motto */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="rounded-3xl border border-border bg-cream p-10 md:p-12"
          >
            <span className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-primary">
              Motto
            </span>
            <blockquote className="mt-5">
              <p className="font-display italic font-bold text-foreground text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.2] tracking-tight">
                &ldquo;Win if you can.
              </p>
              <p className="font-display italic font-bold text-foreground text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.2] tracking-tight">
                Lose if you must.
              </p>
              <p className="font-display italic font-bold text-primary text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.2] tracking-tight">
                But never quit.&rdquo;
              </p>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Trainers ──────────────────────────────────────────────────────────────────

function TrainersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="trainers-heading"
      className="bg-cream"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          className="mb-12 md:mb-16"
        >
          <SectionLabel>Coaching Staff</SectionLabel>
          <h2
            id="trainers-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            The people who{' '}
            <span className="font-display italic font-medium text-secondary">
              build champions.
            </span>
          </h2>
        </motion.div>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" delay={0.07}>
          {TRAINERS.map((t) => (
            <StaggerItem key={t.name}>
              <div className="group rounded-2xl bg-white border border-border overflow-hidden hover:-translate-y-1 hover:shadow-card-soft transition-all duration-300">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={t.photo}
                    alt={`Portrait of ${t.name}`}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="font-sans font-bold text-foreground text-[1rem] leading-snug">{t.name}</p>
                  <p className="mt-1 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted">{t.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

// ── Athlete Accolades ─────────────────────────────────────────────────────────

function AccoladesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="accolades-heading"
      className="bg-white"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          className="mb-12 md:mb-16"
        >
          <SectionLabel>Sports Accolades</SectionLabel>
          <h2
            id="accolades-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            Our athletes.{' '}
            <span className="font-display italic font-medium text-secondary">
              Our pride.
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ACCOLADES.map((a, i) => (
            <motion.div
              key={a.name}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              className="group rounded-2xl border border-border bg-white overflow-hidden hover:-translate-y-1 hover:border-secondary hover:shadow-card-soft transition-all duration-300"
            >
              {/* Photo or initials */}
              <div className="aspect-square overflow-hidden bg-neutral-100 relative">
                {a.photo ? (
                  <img
                    src={a.photo}
                    alt={`${a.name} — ${a.sport} athlete`}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.025] transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                    <Trophy className="w-10 h-10 text-secondary/40" aria-hidden="true" />
                  </div>
                )}
                {/* Level badge */}
                <div className="absolute bottom-0 inset-x-0 px-3 pb-2 pt-8 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="font-mono text-[0.58rem] font-bold tracking-[0.15em] uppercase text-white/90">
                    {a.level}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p className="font-sans font-bold text-foreground text-[0.95rem] leading-snug">{a.name}</p>
                <p className="mt-0.5 text-muted text-[0.82rem]">{a.sport}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Sports Quota ──────────────────────────────────────────────────────────────

function QuotaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="quota-heading"
      className="bg-cream"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          className="mb-10 md:mb-14"
        >
          <SectionLabel>Sports Quota</SectionLabel>
          <h2
            id="quota-heading"
            className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05]"
          >
            Seats reserved for{' '}
            <span className="font-display italic font-medium text-secondary">
              athletes.
            </span>
          </h2>

          {/* Stat strip */}
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

        {/* Document list */}
        <div className="space-y-3" role="list" aria-label="Sports quota documents">
          {QUOTA_DOCS.map((doc, i) => (
            <motion.div
              key={doc.year}
              role="listitem"
              initial={prefersReduced ? false : { opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-5 py-4 hover:border-primary hover:shadow-card-soft transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-[0.6rem] font-bold tracking-[0.14em] uppercase text-primary flex-none">
                  {doc.year}
                </span>
                <span className="font-sans font-medium text-foreground text-[0.92rem] truncate">
                  {doc.label}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-none">
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${doc.label} (PDF, opens in new tab)`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] font-sans font-semibold text-muted hover:text-foreground border border-border hover:border-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" /> View
                </a>
                <a
                  href={doc.href}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download ${doc.label} (PDF)`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.78rem] font-sans font-semibold bg-foreground text-white hover:bg-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" /> PDF
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Closing statement ─────────────────────────────────────────────────────────

function ClosingStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-label="Closing"
      className="bg-foreground"
      ref={ref}
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28 text-center">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <p className="font-display italic font-bold text-white text-[clamp(2rem,4vw,3.6rem)] leading-[1.2] tracking-tight max-w-[840px] mx-auto">
            &ldquo;The discipline, focus, and resilience you build on the field
            follow you into every career you choose.&rdquo;
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page composition ──────────────────────────────────────────────────────────

export default function SportsPage() {
  return (
    <>
      <VideoTextHero />
      <SportsOverview />
      <FacilitiesSection />
      <SportsDisciplineIndex />
      <GoalMotto />
      <TrainersSection />
      <AccoladesSection />
      <QuotaSection />
      <ClosingStatement />
    </>
  );
}
