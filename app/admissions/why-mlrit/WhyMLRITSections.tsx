'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
} from 'framer-motion';

// ─── Shared constants ────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const SP   = { stiffness: 110, damping: 26, mass: 0.7 } as const;

// ─── ArrowLink ────────────────────────────────────────────────────────────────

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
    <span className={`group inline-flex items-center gap-2 text-[0.85rem] font-bold font-sans tracking-wide border-b pb-0.5 transition-colors duration-200 ${cls}`}>
      {children}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );

  if (external) return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>;
  return <Link href={href}>{inner}</Link>;
}

// ─── Reveal — scroll-triggered entrance ──────────────────────────────────────

function Reveal({
  children,
  className,
  delay = 0,
  preset = 'up',
  duration = 0.72,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  preset?: 'up' | 'right' | 'left' | 'fade' | 'scale';
  duration?: number;
}) {
  const prefersReduced = useReducedMotion();
  const hidden = {
    opacity: 0,
    y:     preset === 'up'    ? 32 : 0,
    x:     preset === 'right' ? -28 : preset === 'left' ? 28 : 0,
    scale: preset === 'scale' ? 0.94 : 1,
  };
  const show = { opacity: 1, y: 0, x: 0, scale: 1 };

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? show : hidden}
      whileInView={show}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger container ────────────────────────────────────────────────────────

function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: prefersReduced ? 0 : stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
        show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref   = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || prefersReduced) { setVal(to); return; }
    let start: number | null = null;
    const dur = 1400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setVal(Math.floor(eased * to));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, prefersReduced]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ n, label, dark = false }: { n: string; label: string; dark?: boolean }) {
  return (
    <span className={`font-mono text-[0.68rem] tracking-[0.22em] uppercase font-bold ${dark ? 'text-white/50' : 'text-secondary'}`}>
      {n} — {label}
    </span>
  );
}

// ─── Clip-path image reveal ───────────────────────────────────────────────────

function ImageReveal({
  src,
  alt,
  className,
  delay = 0,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ''}`}
      style={style}
      initial={prefersReduced ? {} : { clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    </motion.div>
  );
}

// ─── 1. GREEN CAMPUS ─────────────────────────────────────────────────────────

function GreenCampusStory() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const rawY     = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 0.97]);
  const y        = useSpring(rawY, SP);
  const scale    = useSpring(rawScale, SP);

  // [0] hero · [1-3] mosaic strip
  const IMGS = [
    '/images/facilities/campus/campus-7P5A1967.jpg',  // wide campus aerial — hero
    '/images/facilities/campus/campus-7P5A2397.jpg',  // mosaic 1
    '/images/facilities/campus/campus-7P5A1225.jpg',  // mosaic 2
    '/images/facilities/campus/campus-7P5A1958.jpg',  // mosaic 3
  ];

  const STATS = [
    { val: 31,  suffix: '',     unit: 'Acres',   sub: 'Solar-powered campus' },
    { val: 1200, suffix: '',    unit: 'Seats',   sub: 'State-of-the-art auditorium' },
    { val: 15,  suffix: '+',    unit: '',        sub: 'Sports facilities' },
  ];

  return (
    <section ref={ref} className="relative bg-[#f7f5f0] overflow-hidden" aria-label="Green Campus">
      {/* Oversized watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 font-sans font-black leading-none text-[#e8e3da] select-none"
        style={{ fontSize: 'clamp(180px, 26vw, 320px)', lineHeight: 0.82, zIndex: 0 }}
      >
        01
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Text column */}
          <div className="lg:w-[44%] shrink-0">
            <Reveal><SectionLabel n="01" label="Green Campus" /></Reveal>

            <Reveal delay={0.07}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.6rem,5.5vw,4.6rem)] leading-[0.92] text-foreground">
                31{' '}
                <span className="font-display italic font-medium text-secondary">acres</span>
                <br />of open sky.
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 text-muted text-[0.97rem] leading-relaxed max-w-[42ch]">
                A solar-powered, lush green campus in Dundigal — tree-lined walkways,
                open sports grounds, and natural ventilation across every building.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8"><ArrowLink href="/student-life/discover-mlr">Explore Life at MLR</ArrowLink></div>
            </Reveal>

            {/* Animated stat chips */}
            <StaggerGroup className="mt-10 flex flex-wrap gap-3" delayChildren={0.25} stagger={0.1}>
              {STATS.map((s) => (
                <StaggerItem key={s.sub}>
                  <div className="bg-white border border-border rounded-2xl px-5 py-4 shadow-card-soft">
                    <div className="font-sans font-black tracking-tighter-2 text-[1.5rem] leading-none text-secondary">
                      <Counter to={s.val} suffix={s.suffix} />
                      {s.unit && <span className="text-[0.72rem] font-bold ml-1 text-secondary/65">{s.unit}</span>}
                    </div>
                    <div className="mt-1.5 font-mono text-[0.6rem] tracking-wide text-muted">{s.sub}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Image column */}
          <div className="flex-1 relative">
            {/* Primary image — clip-path reveal + parallax scale */}
            <motion.div
              className="relative w-full rounded-3xl overflow-hidden shadow-card-strong"
              style={{ height: 'clamp(420px, 52vw, 640px)', y: prefersReduced ? 0 : y, scale: prefersReduced ? 1 : scale }}
            >
              <ImageReveal
                src={IMGS[0]}
                alt="MLRIT green campus — wide view of tree-lined grounds and buildings"
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="font-mono text-[0.62rem] text-white/80 tracking-widest uppercase bg-black/35 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  MLRIT Campus · Dundigal
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mosaic strip — uses imgs[1-3], distinct from hero */}
      <div className="mt-3 flex gap-1.5 overflow-hidden" style={{ height: 'clamp(100px, 14vw, 170px)' }}>
        {IMGS.slice(1).map((src, i) => (
          <motion.div
            key={i}
            className="flex-1 min-w-0 overflow-hidden"
            initial={prefersReduced ? {} : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08 * i, ease: EASE }}
          >
            <img src={src} alt="" aria-hidden="true" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
          </motion.div>
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

  const rawOverlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.35, 0.55]);
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], ['5%', '-5%']), SP);
  const overlayOpacity = useSpring(rawOverlay, SP);

  const STATS = [
    { val: 81,  suffix: '%',  sub: 'Students placed annually' },
    { val: 58,  suffix: ' LPA', sub: 'Highest package · Microsoft' },
    { val: 200, suffix: '+',  sub: 'Campus recruiting partners' },
  ];

  const LOGO_IMGS = [
    '/placements/p1.jpg', '/placements/p3.jpg', '/placements/p5.jpg',
    '/placements/p7.png', '/placements/p8.png', '/placements/p9.png',
    '/placements/p10.png', '/placements/p11.png', '/placements/p12.png',
    '/placements/p13.png', '/placements/p14.png', '/placements/p15.png',
  ];

  return (
    <section ref={ref} className="relative bg-foreground overflow-hidden" aria-label="Placements that secure futures">

      {/* Cinematic video background */}
      <div className="absolute inset-0 z-0">
        {prefersReduced ? (
          <div className="absolute inset-0 bg-foreground" />
        ) : (
          <video
            src="/videos/placements.mp4"
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        )}
        <motion.div
          className="absolute inset-0 bg-foreground"
          style={{ opacity: prefersReduced ? 0.88 : overlayOpacity }}
        />
      </div>

      <div className="relative z-10 py-24 md:py-32 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Watermark */}
        <div aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 font-sans font-black leading-none select-none"
          style={{ fontSize: 'clamp(180px, 26vw, 320px)', lineHeight: 0.82, color: 'rgba(255,255,255,0.025)', zIndex: 1 }}>
          02
        </div>

        <motion.div className="relative z-10" style={{ y: prefersReduced ? 0 : textY }}>
          <div className="flex flex-col lg:flex-row-reverse gap-14 lg:gap-20 items-center">

            {/* Text */}
            <div className="lg:w-[50%] shrink-0">
              <Reveal><SectionLabel n="02" label="Placements" dark /></Reveal>

              <Reveal delay={0.07}>
                <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.6rem,5.5vw,4.6rem)] leading-[0.92] text-white">
                  Futures that{' '}
                  <span className="font-display italic font-medium text-primary">begin here.</span>
                </h2>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="mt-6 text-white/60 text-[0.97rem] leading-relaxed max-w-[42ch]">
                  21 years of consistent placement success. The highest package recorded:
                  ₹58 LPA from Microsoft. 200+ companies visit campus each year.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8"><ArrowLink href="/placements/overview" dark>Discover Placements</ArrowLink></div>
              </Reveal>

              {/* Animated stat grid */}
              <StaggerGroup className="mt-10 grid grid-cols-3 gap-3" delayChildren={0.3} stagger={0.1}>
                {STATS.map((s) => (
                  <StaggerItem key={s.sub}>
                    <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4 text-center">
                      <div className="font-sans font-black tracking-tighter-2 text-[1.35rem] leading-none text-primary">
                        <Counter to={s.val} suffix={s.suffix} />
                      </div>
                      <div className="mt-2 font-mono text-[0.58rem] tracking-wide text-white/40 leading-tight">{s.sub}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>

            {/* Side visual — year stat card */}
            <Reveal preset="right" delay={0.1} className="flex-1 w-full">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-10">
                <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-white/35 mb-6">2025–26 Batch</p>
                <div className="space-y-5">
                  {[
                    { company: 'ServiceNow', role: 'Software Engineer', pkg: '₹33 LPA', count: 4 },
                    { company: 'EPAM Systems', role: 'Fullstack Developer', pkg: '₹8 LPA', count: 38 },
                    { company: 'TCS', role: 'Systems Engineer', pkg: '₹4 LPA', count: 72 },
                    { company: 'Infosys', role: 'Systems Engineer', pkg: '₹4 LPA', count: 65 },
                    { company: 'Capgemini', role: 'Assoc. Consultant', pkg: '₹4.5 LPA', count: 58 },
                  ].map((r, i) => (
                    <motion.div
                      key={r.company}
                      className="flex items-center justify-between gap-4 py-3 border-b border-white/[0.08] last:border-0"
                      initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.35 + i * 0.07, ease: EASE }}
                    >
                      <div>
                        <div className="font-sans font-bold text-white text-[0.88rem] leading-tight">{r.company}</div>
                        <div className="font-mono text-[0.6rem] text-white/40 tracking-wide mt-0.5">{r.role}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-sans font-black text-primary text-[0.95rem]">{r.pkg}</div>
                        <div className="font-mono text-[0.58rem] text-white/35">{r.count} offers</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Company logo strip */}
          <Reveal delay={0.15}>
            <div className="mt-14 pt-10 border-t border-white/10">
              <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-white/25 mb-6 text-center">
                Companies that hire from MLRIT
              </p>
              <StaggerGroup className="flex flex-wrap gap-3 justify-center" stagger={0.04} delayChildren={0.05}>
                {LOGO_IMGS.map((src, i) => (
                  <StaggerItem key={i}>
                    <div className="h-11 w-20 rounded-lg overflow-hidden bg-white/[0.06] border border-white/10 flex items-center justify-center p-2">
                      <img src={src} alt="" aria-hidden="true"
                        className="max-h-full max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                        loading="lazy" />
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 3. STUDENT SAFETY ───────────────────────────────────────────────────────

function StudentSafetyStory() {
  return (
    <section className="relative bg-[#f1f8f4] overflow-hidden py-20 md:py-28" aria-label="Student safety and support">

      <div aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 font-sans font-black leading-none text-[#d4ead9] select-none"
        style={{ fontSize: 'clamp(180px, 26vw, 320px)', lineHeight: 0.82, zIndex: 0 }}>
        03
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal><SectionLabel n="03" label="Student Safety &amp; Support" /></Reveal>

        <Reveal delay={0.07}>
          <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95] text-foreground max-w-[16ch]">
            A campus where every student{' '}
            <span className="font-display italic font-medium text-secondary">belongs safely.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Anti-Ragging card */}
          <Reveal delay={0.1} preset="scale">
            <div className="bg-white rounded-3xl border border-border shadow-card-soft overflow-hidden h-full flex flex-col">
              <div className="bg-secondary px-8 py-7">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M11 2L13.5 8H20L14.5 12L16.5 18L11 14.5L5.5 18L7.5 12L2 8H8.5L11 2Z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/70 font-bold">Zero Tolerance Policy</p>
                    <h3 className="mt-1 font-sans font-black tracking-tighter-2 text-[1.4rem] text-white leading-tight">Anti-Ragging Commitment</h3>
                  </div>
                </div>
              </div>
              <div className="px-8 py-7 flex-1 flex flex-col">
                <p className="text-muted text-[0.93rem] leading-relaxed">
                  MLRIT enforces a strict zero-tolerance stance against ragging in any form —
                  physical, verbal, psychological, or online. All students sign an anti-ragging
                  undertaking at admission, and a 24×7 helpline operates year-round.
                </p>
                <StaggerGroup className="mt-5 space-y-3" stagger={0.07} delayChildren={0.1}>
                  {[
                    'Anti-ragging undertaking mandatory at admission',
                    'Parent and guardian declaration required',
                    '24×7 anti-ragging helpline operational',
                    'Immediate suspension and criminal prosecution for violations',
                    'National helpline: 1800-180-5522',
                  ].map((item) => (
                    <StaggerItem key={item}>
                      <div className="flex items-start gap-3 text-[0.87rem] text-foreground">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                          <circle cx="8" cy="8" r="7" stroke="#01741f" strokeWidth="1.5"/>
                          <path d="M5 8l2 2 4-4" stroke="#01741f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
                <div className="mt-auto pt-7">
                  <ArrowLink href="/admissions/policies">Read Our Anti-Ragging Policy</ArrowLink>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Women Grievance Cell card */}
          <Reveal delay={0.18} preset="scale">
            <div className="bg-white rounded-3xl border border-border shadow-card-soft overflow-hidden h-full flex flex-col">
              <div className="bg-primary px-8 py-7">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <circle cx="11" cy="8" r="4" stroke="white" strokeWidth="1.8"/>
                      <path d="M5 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/70 font-bold">Inclusive Campus</p>
                    <h3 className="mt-1 font-sans font-black tracking-tighter-2 text-[1.4rem] text-white leading-tight">Women Grievance Cell</h3>
                  </div>
                </div>
              </div>
              <div className="px-8 py-7 flex-1 flex flex-col">
                <p className="text-muted text-[0.93rem] leading-relaxed">
                  The Women Grievance Cell provides a safe, confidential channel for addressing
                  gender-related concerns on campus, supported by the Women Empowerment Cell and
                  an Internal Complaints Committee for POSH-compliant redressal.
                </p>
                <StaggerGroup className="mt-5 space-y-3" stagger={0.07} delayChildren={0.1}>
                  {[
                    'Confidential grievance filing available',
                    'Internal Complaints Committee (ICC) constituted',
                    'POSH Act compliant process',
                    'Women Empowerment Cell provides mentoring and support',
                    'Grievance email: grievance@mlrit.ac.in',
                  ].map((item) => (
                    <StaggerItem key={item}>
                      <div className="flex items-start gap-3 text-[0.87rem] text-foreground">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                          <circle cx="8" cy="8" r="7" stroke="#e85d04" strokeWidth="1.5"/>
                          <path d="M5 8l2 2 4-4" stroke="#e85d04" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
                <div className="mt-auto pt-7 flex flex-wrap gap-6">
                  <ArrowLink href="/admissions/policies">Visit Grievance Cell</ArrowLink>
                  <a href="https://mlrit.edugrievance.com/" target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[0.85rem] font-bold font-sans tracking-wide border-b border-border hover:border-primary text-foreground hover:text-primary pb-0.5 transition-colors duration-200">
                    Grievance Portal
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Official Anti-Ragging Poster — full editorial panel */}
        <Reveal delay={0.25} preset="up">
          <div className="mt-10 bg-white rounded-3xl border border-border shadow-card-soft overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* Poster */}
              <div className="lg:w-[280px] xl:w-[320px] shrink-0 bg-[#1a1a2e] flex items-center justify-center p-6">
                <img
                  src="/images/anti-ragging-poster.jpg"
                  alt="MLRIT official Anti-Ragging poster displaying three figures with the Anti-Ragging Act definition: undisciplined activities causing annoyance, hardship, or fear in any fresher or student. MLRIT enforces zero tolerance."
                  className="w-full rounded-xl shadow-card-strong object-contain"
                  loading="lazy"
                  style={{ maxHeight: '400px' }}
                />
              </div>
              {/* Caption */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-secondary font-bold mb-3">Official Institutional Poster</p>
                  <h3 className="font-sans font-black tracking-tighter-2 text-[1.5rem] leading-tight text-foreground">Anti-Ragging Act</h3>
                  <p className="mt-4 text-muted text-[0.93rem] leading-relaxed max-w-[50ch]">
                    Displayed at all MLRIT campus entry points and notice boards. Ragging in any
                    form is a criminal offence under UGC Regulations (2009). MLRIT enforces zero tolerance.
                  </p>
                  <StaggerGroup className="mt-6 flex flex-col sm:flex-row gap-6" stagger={0.08} delayChildren={0.1}>
                    {[
                      { label: 'National Helpline', val: '1800-180-5522' },
                      { label: 'MLRIT Helpline',    val: '+91 40 2398 8101' },
                      { label: 'Policy Reference',  val: 'UGC 2009' },
                    ].map((h) => (
                      <StaggerItem key={h.label}>
                        <div className="font-mono text-[0.6rem] tracking-widest uppercase text-muted mb-1">{h.label}</div>
                        <div className="font-sans font-black text-[1rem] tracking-tighter-2 text-foreground">{h.val}</div>
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </div>
                <div className="mt-8 pt-7 border-t border-border">
                  <ArrowLink href="/admissions/policies">Read the Full Anti-Ragging Policy</ArrowLink>
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
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], ['-7%', '7%']), SP);
  const bgY  = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-4%']), SP);

  const STI = [
    '/images/facilities/campus/sti-hub-1.jpg',
    '/images/facilities/campus/sti-hub-2.jpg',
    '/images/facilities/campus/sti-hub-3.jpg',
    '/images/facilities/campus/sti-hub-4.jpg',
  ];

  const STATS = [
    { val: 42, suffix: '+', sub: 'Patents filed' },
    { val: 3,  suffix: '',  sub: 'JNTUH research centres' },
    { val: 25, suffix: '+', sub: 'Doctoral faculty' },
  ];

  return (
    <section ref={ref} className="relative bg-[#0c0c0e] overflow-hidden py-20 md:py-28" aria-label="Innovation, entrepreneurship and research">

      {/* Background mosaic */}
      <motion.div className="absolute inset-0 opacity-[0.10]" style={{ y: prefersReduced ? 0 : bgY }} aria-hidden="true">
        <div className="grid grid-cols-4 h-full">
          {STI.map((src, i) => (
            <div key={i} className="overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </motion.div>

      <div aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 font-sans font-black leading-none select-none"
        style={{ fontSize: 'clamp(180px, 26vw, 320px)', lineHeight: 0.82, color: 'rgba(255,255,255,0.02)', zIndex: 1 }}>
        04
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-center">

          {/* Images */}
          <div className="flex-1">
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-card-strong"
              style={{ height: 'clamp(300px, 40vw, 500px)', y: prefersReduced ? 0 : imgY }}
            >
              <ImageReveal src={STI[0]} alt="Student Technology and Innovation Hub at MLRIT — co-working and prototyping space" className="absolute inset-0 w-full h-full" delay={0.1} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono text-[0.6rem] text-white/80 tracking-widest uppercase bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  STI Hub — Atal Innovation Mission supported
                </span>
              </div>
            </motion.div>

            <StaggerGroup className="mt-3 grid grid-cols-3 gap-3" stagger={0.08} delayChildren={0.15}>
              {STI.slice(1).map((src, i) => (
                <StaggerItem key={i}>
                  <div className="rounded-2xl overflow-hidden" style={{ height: 'clamp(80px, 9vw, 115px)' }}>
                    <img src={src} alt="" aria-hidden="true" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Text */}
          <div className="lg:w-[44%] shrink-0">
            <Reveal><SectionLabel n="04" label="Innovation &amp; Research" dark /></Reveal>

            <Reveal delay={0.07}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.93] text-white">
                Ideas don&apos;t wait.{' '}
                <span className="font-display italic font-medium text-primary">Neither do we.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 text-white/55 text-[0.97rem] leading-relaxed max-w-[42ch]">
                The Student Technology and Innovation Hub — supported by AIM (Atal Innovation Mission)
                — provides co-working space, prototyping labs, and mentorship to turn ideas into products.
              </p>
            </Reveal>

            <StaggerGroup className="mt-8 flex flex-wrap gap-3" delayChildren={0.25} stagger={0.09}>
              {STATS.map((s) => (
                <StaggerItem key={s.sub}>
                  <div className="bg-white/[0.06] border border-white/10 rounded-2xl px-5 py-4">
                    <div className="font-sans font-black tracking-tighter-2 text-[1.4rem] leading-none text-primary">
                      <Counter to={s.val} suffix={s.suffix} />
                    </div>
                    <div className="mt-1.5 font-mono text-[0.6rem] tracking-wide text-white/38 leading-tight">{s.sub}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal delay={0.32}>
              <div className="mt-10 flex flex-wrap gap-6">
                <ArrowLink href="/research/centers" dark>Explore Research &amp; Innovation</ArrowLink>
                <ArrowLink href="/student-life/facilities" dark>Visit the STI Hub</ArrowLink>
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
  const col1Y = useSpring(useTransform(scrollYProgress, [0, 1], ['-6%', '6%']), SP);
  const col2Y = useSpring(useTransform(scrollYProgress, [0, 1], ['6%', '-6%']), SP);

  const ITEMS = [
    { img: '/images/facilities/campus/library-wide-1.jpg',   label: 'Marri Balreddy Library', sub: '50,000+ volumes' },
    { img: '/images/facilities/campus/cafeteria-2.jpg',      label: 'Campus Cafeteria',        sub: 'Multi-cuisine · 8AM–8PM' },
    { img: '/images/facilities/campus/hospital-1.jpg',       label: 'On-Campus Hospital',      sub: '24/7 medical care' },
    { img: '/images/facilities/campus/sti-hub-2.jpg',        label: 'STI Hub',                 sub: 'Innovation & startups' },
    { img: '/images/facilities/campus/library-stacks-1.jpg', label: 'Reading Stacks',          sub: 'IEEE & Springer access' },
    { img: '/images/facilities/campus/cafeteria-4.jpg',      label: 'Dining Hall',             sub: 'Open-air seating' },
  ];

  return (
    <section ref={ref} className="relative bg-[#faf7f0] overflow-hidden py-20 md:py-28" aria-label="Facilities and amenities">

      <div aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 font-sans font-black leading-none text-[#e5dfd5] select-none"
        style={{ fontSize: 'clamp(180px, 26vw, 320px)', lineHeight: 0.82, zIndex: 0 }}>
        05
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">

          {/* Sticky text */}
          <div className="lg:w-[36%] shrink-0 lg:sticky lg:top-32">
            <Reveal><SectionLabel n="05" label="Facilities &amp; Amenities" /></Reveal>

            <Reveal delay={0.07}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95] text-foreground">
                Everything you need,{' '}
                <span className="font-display italic font-medium text-secondary">within walking distance.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 text-muted text-[0.97rem] leading-relaxed max-w-[40ch]">
                Library, cafeteria, on-campus hospital, sports complex, ATM, and stationery store
                — a solar-powered campus designed so students focus on learning, not logistics.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8"><ArrowLink href="/student-life/facilities">View Facilities &amp; Amenities</ArrowLink></div>
            </Reveal>

            <StaggerGroup className="mt-10 space-y-2" stagger={0.06} delayChildren={0.25}>
              {['Library & Digital Resources', 'Multi-cuisine Cafeteria', '24/7 On-campus Hospital', 'Sports Complex & Courts', 'Campus ATM & Banking', 'Stationery & Supply Store'].map((f) => (
                <StaggerItem key={f}>
                  <div className="flex items-center gap-3 text-[0.88rem] text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    {f}
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Parallax mosaic — two offset columns */}
          <div className="flex-1 min-w-0 grid grid-cols-2 gap-3 md:gap-4">
            <motion.div className="flex flex-col gap-3 md:gap-4" style={{ y: prefersReduced ? 0 : col1Y }}>
              {ITEMS.slice(0, 3).map((item, i) => (
                <div key={item.label} className="relative rounded-2xl overflow-hidden shadow-card-soft group" style={{ height: 'clamp(150px, 17vw, 230px)' }}>
                  <ImageReveal src={item.img} alt={item.label} delay={0.08 * i} className="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-sans font-bold text-white text-[0.78rem] leading-tight truncate">{item.label}</p>
                    <p className="font-mono text-[0.58rem] text-white/60 tracking-wide mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div className="flex flex-col gap-3 md:gap-4 mt-10" style={{ y: prefersReduced ? 0 : col2Y }}>
              {ITEMS.slice(3).map((item, i) => (
                <div key={item.label} className="relative rounded-2xl overflow-hidden shadow-card-soft group" style={{ height: 'clamp(150px, 17vw, 230px)' }}>
                  <ImageReveal src={item.img} alt={item.label} delay={0.12 + 0.08 * i} className="absolute inset-0 w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-sans font-bold text-white text-[0.78rem] leading-tight truncate">{item.label}</p>
                    <p className="font-mono text-[0.58rem] text-white/60 tracking-wide mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. STUDENT CLUBS ────────────────────────────────────────────────────────

function StudentCommunitiesStory() {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const col1Y = useSpring(useTransform(scrollYProgress, [0, 1], ['-5%', '5%']), SP);
  const col2Y = useSpring(useTransform(scrollYProgress, [0, 1], ['5%', '-5%']), SP);
  const col3Y = useSpring(useTransform(scrollYProgress, [0, 1], ['-3%', '3%']), SP);

  const PHOTOS = [
    { src: '/images/about/milestone-2022.jpg',           alt: 'MLRIT campus milestone 2022' },
    { src: '/images/sports/accolades/a-nithin.jpg',      alt: 'MLRIT sports achiever A Nithin' },
    { src: '/images/about/milestone-2019.jpg',           alt: 'MLRIT campus milestone 2019' },
    { src: '/images/sports/accolades/sindhu.jpg',        alt: 'MLRIT sports achiever Sindhu' },
    { src: '/images/about/milestone-2025.jpg',           alt: 'MLRIT campus milestone 2025' },
    { src: '/images/sports/accolades/k-tarun-reddy.jpg', alt: 'MLRIT sports achiever K Tarun Reddy' },
  ];

  const CLUBS = [
    'INVENTE Tech Fest', 'IEEE Student Branch', 'Coding Club', 'Robotics Team',
    'Photography Club', 'NSS', 'NCC', 'Drama Society', 'Music Club', 'AI & ML Club',
    'E-Cell', 'Environmental Club', 'Dance Troupe', 'Literary Society', 'Quizzing Club',
    'Zignasa Cultural Fest', 'Equinox Events', 'Blockchain Enthusiasts', 'Gaming Guild',
  ];

  return (
    <section ref={ref} className="relative bg-foreground overflow-hidden py-20 md:py-28" aria-label="Student clubs and communities">

      <div aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 font-sans font-black leading-none select-none z-[1]"
        style={{ fontSize: 'clamp(180px, 26vw, 320px)', lineHeight: 0.82, color: 'rgba(255,255,255,0.025)' }}>
        06
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">

          {/* Text col */}
          <div className="lg:w-[40%] shrink-0 lg:sticky lg:top-32">
            <Reveal><SectionLabel n="06" label="Clubs &amp; Communities" dark /></Reveal>

            <Reveal delay={0.07}>
              <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.93] text-white">
                30+ clubs.{' '}
                <span className="font-display italic font-medium text-primary">One community.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 text-white/55 text-[0.97rem] leading-relaxed max-w-[40ch]">
                Technical clubs, cultural societies, NSS, NCC, and inter-collegiate competitions —
                every student finds their people here.
              </p>
            </Reveal>

            {/* Stat row */}
            <StaggerGroup className="mt-8 flex gap-4" stagger={0.1} delayChildren={0.2}>
              {[
                { val: 30, suffix: '+', sub: 'Student clubs' },
                { val: 5000, suffix: '+', sub: 'Members' },
              ].map((s) => (
                <StaggerItem key={s.sub}>
                  <div className="bg-white/[0.07] border border-white/10 rounded-2xl px-5 py-4">
                    <div className="font-sans font-black tracking-tighter-2 text-[1.8rem] leading-none text-primary">
                      <Counter to={s.val} suffix={s.suffix} />
                    </div>
                    <div className="mt-1.5 font-mono text-[0.6rem] tracking-wide text-white/40">{s.sub}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>

            {/* Club chips */}
            <Reveal delay={0.25}>
              <div className="mt-8">
                <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-white/30 mb-4">Active clubs &amp; societies</p>
                <div className="flex flex-wrap gap-2">
                  {CLUBS.map((c) => (
                    <span key={c}
                      className="px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-white/65 font-mono text-[0.65rem] tracking-wide">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-10"><ArrowLink href="/campus/clubs" dark>Explore Clubs &amp; Societies</ArrowLink></div>
            </Reveal>
          </div>

          {/* Photo mosaic — 3 parallax columns */}
          <div className="flex-1 min-w-0 grid grid-cols-3 gap-2.5">
            <motion.div className="flex flex-col gap-2.5" style={{ y: prefersReduced ? 0 : col1Y }}>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(160px, 18vw, 240px)' }}>
                <img src={PHOTOS[0].src} alt={PHOTOS[0].alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(110px, 12vw, 160px)' }}>
                <img src={PHOTOS[3].src} alt={PHOTOS[3].alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </motion.div>
            <motion.div className="flex flex-col gap-2.5 mt-8" style={{ y: prefersReduced ? 0 : col2Y }}>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(110px, 12vw, 160px)' }}>
                <img src={PHOTOS[1].src} alt={PHOTOS[1].alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(160px, 18vw, 240px)' }}>
                <img src={PHOTOS[4].src} alt={PHOTOS[4].alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </motion.div>
            <motion.div className="flex flex-col gap-2.5 mt-4" style={{ y: prefersReduced ? 0 : col3Y }}>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(130px, 15vw, 200px)' }}>
                <img src={PHOTOS[2].src} alt={PHOTOS[2].alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 'clamp(130px, 15vw, 200px)' }}>
                <img src={PHOTOS[5].src} alt={PHOTOS[5].alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. CLOSING ──────────────────────────────────────────────────────────────

function WhyMLRITClosing() {
  const prefersReduced = useReducedMotion();
  return (
    <section className="relative bg-green-hero py-24 md:py-32 overflow-hidden" aria-label="Admissions invitation">

      <div className="relative z-10 max-w-[800px] mx-auto px-6 md:px-12 text-center">
        <Reveal>
          <p className="font-mono text-[0.68rem] tracking-[0.22em] uppercase text-white/50 font-bold mb-6">
            Admissions Open
          </p>
          <p className="font-sans font-black tracking-tighter-2 text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] text-white max-w-[18ch] mx-auto">
            Your four years start{' '}
            <span className="font-display italic font-medium" style={{ color: '#f5c842' }}>here.</span>
          </p>
          <p className="mt-6 text-white/60 text-[1rem] max-w-[46ch] mx-auto leading-relaxed">
            A campus that places 81% of its graduates, keeps them safe, and gives them
            space to grow — in every direction.
          </p>

          <StaggerGroup className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8" stagger={0.1} delayChildren={0.15}>
            <StaggerItem>
              <a href="https://qr-mlr.vercel.app" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-[1rem] font-black font-sans text-white tracking-wide">
                <span className="border-b-2 border-white/45 pb-0.5 group-hover:border-white transition-colors">Apply Now</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M3.5 14.5L14.5 3.5M14.5 3.5H7M14.5 3.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </StaggerItem>
            <StaggerItem>
              <span className="text-white/25 hidden sm:block" aria-hidden="true">·</span>
            </StaggerItem>
            <StaggerItem>
              <Link href="/admissions"
                className="group inline-flex items-center gap-2.5 text-[1rem] font-black font-sans text-white/65 hover:text-white tracking-wide transition-colors">
                <span className="border-b-2 border-white/20 pb-0.5 group-hover:border-white/55 transition-colors">Admissions Overview</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M3.5 14.5L14.5 3.5M14.5 3.5H7M14.5 3.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <span className="text-white/25 hidden sm:block" aria-hidden="true">·</span>
            </StaggerItem>
            <StaggerItem>
              <Link href="/departments/ug"
                className="group inline-flex items-center gap-2.5 text-[1rem] font-black font-sans text-white/65 hover:text-white tracking-wide transition-colors">
                <span className="border-b-2 border-white/20 pb-0.5 group-hover:border-white/55 transition-colors">Explore Programmes</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M3.5 14.5L14.5 3.5M14.5 3.5H7M14.5 3.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </StaggerItem>
          </StaggerGroup>
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
