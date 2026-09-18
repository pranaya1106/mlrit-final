'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Instagram, Linkedin, Youtube, Twitter, Mail } from 'lucide-react';

// ─── Data (from https://mlritcie.in) ─────────────────────────────────────────

const OBJECTIVES = [
  { n: '01', t: 'Foster innovation',   b: 'Innovation and entrepreneurial thinking as everyday habits — not one-week competitions.' },
  { n: '02', t: 'Build the room',      b: 'Facilities and resources that let the ambitious go from idea to working prototype.' },
  { n: '03', t: 'Open the door',       b: 'Direct connections to industry mentors and founders who reply, review and open the next door.' },
  { n: '04', t: 'Back the founders',   b: 'Support student-led startups — from the deck to DPIIT registration and the first customer.' },
  { n: '05', t: 'Bring the stage',     b: 'Hackathons, workshops and speaker series that give every good idea an audience.' },
  { n: '06', t: 'Bridge two worlds',   b: 'Sit at the intersection of academia and industry — turn coursework into launched product.' },
];

const VALUES = ['Innovation', 'Leadership', 'Collaboration', 'Creativity', 'Integrity', 'Impact', 'Continuous Learning', 'Inclusivity'];

const VERTICALS = [
  { code: 'MP', logo: '/images/clubs/cie/verticals/mp.svg', name: 'Microprojects',       body: 'Small teams. 8-week sprints. First place a raw idea meets a whiteboard, a deadline and teammates.' },
  { code: 'CS', logo: '/images/clubs/cie/verticals/cs.svg', name: 'CIE Studios',         body: 'Six studios capturing campus stories through photography, video and digital content.' },
  { code: 'PD', logo: '/images/clubs/cie/verticals/pd.svg', name: 'Product Development', body: 'Promising projects taken from prototype to real deployment. 15 currently live with real users.' },
  { code: 'SC', logo: '/images/clubs/cie/verticals/sc.svg', name: 'Startup Cohort',      body: 'Founders in training — problem understanding, user interviews, unit economics. The parts people skip.' },
];

const EVENTS = [
  { name: 'Workshop Carnival 2.0', date: 'Apr 10–11, 2026', kind: 'Workshop',              body: 'UI/UX, IoT, content and product design — expert mentors, real-time reviews on every table.', poster: '/images/clubs/cie/events/wc-2.png' },
  { name: 'Business to Brand',     date: 'Apr 3–4, 2025',   kind: 'Innovation Challenge',  body: '48 hours to build branding, visual identity, logo and an ad-film — judged by an industry panel that arrives with opinions.', poster: '/images/clubs/cie/events/b2b.png' },
  { name: 'Equinox E-Summit',      date: 'Nov 28–30, 2024', kind: 'Startup Summit',        body: 'A three-day summit — student pitches, investor connections, speaker series and an innovation showcase.', poster: '/images/clubs/cie/events/equinox.png' },
  { name: 'GI Mahotsav 2024',      date: 'Mar 26–28, 2024', kind: 'Culture · Marketplace', body: 'A Geographical Indications mela — India\'s protected regional crafts and MSME connectivity, on campus.', poster: '/images/clubs/cie/events/gi.png' },
  { name: 'Workshop Carnival',     date: 'Mar 11–16, 2024', kind: 'Workshop · 6 days',     body: 'Six-day hands-on run across UI/UX, IoT prototyping and WordPress, with domain contests every night.', poster: '/images/clubs/cie/events/wc.png' },
  { name: 'MetaLoop',              date: 'Oct 6–7, 2023',   kind: 'Hackathon · Flagship',  body: '36-hour flagship hackathon — AR/VR, blockchain and virtual-world tracks. ₹75,000 prize pool.', poster: '/images/clubs/cie/events/metaloop.png' },
  { name: 'Hustle Mania',          date: 'Apr 24, 2023',    kind: 'Innovation Challenge',  body: 'Five competitive domains — sales sprints, negotiation duels, ad-blitz and strategy — under one roof.', poster: '/images/clubs/cie/events/hustle-mania.png' },
];

const FACILITIES = [
  { title: 'Innovation Hub / EPICS Lab', meta: 'Flagship',                body: 'Where cohort projects live and Friday demos happen.' },
  { title: 'Makerspace',                 meta: '3D · Laser · CNC',        body: '3D printers, laser cutters, CNC routers.' },
  { title: 'Prototype Lab',              meta: 'Bench · Test · Iterate',  body: 'Benches and instruments for the second and third builds.' },
  { title: 'Internet of Things Lab',     meta: 'Sensors · MCUs · Radios', body: 'Dev kits, radios and MCUs — sensor to cloud.' },
  { title: 'Social Square',              meta: 'Community · Events',      body: 'Cohort meets, speakers, the after-parties.' },
  { title: 'Meeting Room',               meta: 'Investors · Mentors',     body: 'The quiet room for the harder conversations.' },
];

const STATS = [
  { value: 500, label: 'Students engaged',  suffix: '+' },
  { value: 80,  label: 'Microprojects',     suffix: '+' },
  { value: 40,  label: 'Products built',    suffix: '+' },
  { value: 25,  label: 'Startups mentored', suffix: '+' },
];

const GALLERY = [
  { src: '/images/clubs/cie/gallery/cie.jpg',                caption: 'The CIE floor',        span: 8 },
  { src: '/images/clubs/cie/gallery/makerspace.jpg',         caption: 'Makerspace',           span: 4 },
  { src: '/images/clubs/cie/gallery/3d-printing.jpg',        caption: '3D printing',          span: 4 },
  { src: '/images/clubs/cie/gallery/epicslab.jpg',           caption: 'EPICS Lab',            span: 4 },
  { src: '/images/clubs/cie/gallery/laser-engraver.jpg',     caption: 'Laser engraver',       span: 4 },
  { src: '/images/clubs/cie/gallery/wooden-graver.jpg',      caption: 'Wooden graver',        span: 6 },
  { src: '/images/clubs/cie/gallery/u-table.jpg',            caption: 'The U-table',          span: 6 },
  { src: '/images/clubs/cie/gallery/efest-auditorium.jpg',   caption: 'E-Summit stage',       span: 8 },
  { src: '/images/clubs/cie/gallery/innovation-challenge.jpg', caption: 'Innovation challenge', span: 4 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useCountUp(target: number, ms = 1400) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30% 0px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (t: number) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, ms]);
  return { ref, n };
}

function StatItem({ value, label, suffix, showDivider, index }: { value: number; label: string; suffix: string; showDivider: boolean; index: number }) {
  const { ref, n } = useCountUp(value);
  return (
    <motion.div
      className="group relative px-4 md:px-8 lg:px-10 py-2 md:py-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-30% 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Vertical hairline divider — grows from centre outward on enter */}
      {showDivider && (
        <motion.span
          aria-hidden
          className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 w-px bg-white/10 origin-center"
          style={{ height: '100%' }}
          variants={{
            hidden: { scaleY: 0 },
            show:   { scaleY: 1, transition: { duration: 0.9, ease: EASE } },
          }}
        />
      )}
      {/* Tiny counter on top — for editorial rhythm */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -6 },
          show:   { opacity: 0.5, x: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        className="font-mono text-[0.58rem] font-bold tracking-[0.28em] uppercase text-white/40 mb-4"
      >
        № 0{index + 1}
      </motion.div>
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 28 },
          show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
        }}
        className="font-sans font-black text-white leading-[0.85] tracking-tighter-3 tabular-nums group-hover:text-primary transition-colors duration-700"
        style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)' }}
      >
        {n.toLocaleString('en-IN')}
        <span className="text-primary">{suffix}</span>
      </motion.div>
      <motion.div
        aria-hidden
        variants={{
          hidden: { scaleX: 0 },
          show:   { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
        }}
        className="mt-6 h-px bg-white/15 origin-left w-[70%] group-hover:bg-primary transition-colors duration-500"
      />
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        }}
        className="mt-4 font-mono text-[0.66rem] font-bold tracking-[0.24em] uppercase text-white/60"
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

// ─── Motion primitives ───────────────────────────────────────────────────────
// One set of easing curves and reveal patterns reused across every section so
// the whole page reads as one deliberately-timed piece.

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeUpTight = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const stagger = (childDelay = 0.06, initial = 0.02) => ({
  hidden: {},
  show: { transition: { staggerChildren: childDelay, delayChildren: initial } },
});

const IN_VIEW = { once: true, margin: '-80px' } as const;

// Eyebrow — rule draws left→right, then label fades in with a small x-shift.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW}
      variants={stagger(0.15, 0)}
    >
      <motion.span
        aria-hidden
        className="h-px w-8 bg-primary origin-left"
        variants={{
          hidden: { scaleX: 0 },
          show:   { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
        }}
      />
      <motion.span
        className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-primary"
        variants={{
          hidden: { opacity: 0, x: -6 },
          show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

// Word-split heading — splits by whitespace, staggers each word's opacity+y.
function WordStagger({ text, className, style, as = 'h2' }: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const Tag = as as any;
  const words = text.split(' ');
  return (
    <Tag className={className} style={style}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
        variants={stagger(0.07, 0.05)}
        style={{ display: 'inline-block' }}
      >
        {words.map((w, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: '0.4em' },
              show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
            style={{ display: 'inline-block', marginRight: '0.28em' }}
          >
            {w}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

// Ledger row — the horizontal hairline draws in, then the number and body
// stagger up together. Used by the Pillars and Facilities sections.
function LedgerRow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW}
      variants={stagger(0.08, 0)}
      className="relative grid grid-cols-[auto_1fr] gap-6 py-7"
    >
      <motion.span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-left"
        variants={{
          hidden: { scaleX: 0 },
          show:   { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CIEClubPage() {
  return (
    <main className="bg-black text-white">
      {/* ═════════ HERO — CIE editorial poster ═════════ */}
      <section className="relative bg-black overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-6 md:pt-8 relative z-[2]">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/campus/clubs"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.24em] uppercase text-white/50 hover:text-primary transition-colors"
            >
              ← Clubs &amp; Societies
            </Link>
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.24em] uppercase text-white/45 hidden md:inline">
              MLRIT · Centre for Innovation &amp; Entrepreneurship
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full mt-2 md:mt-4 flex justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/clubs/cie-hero.svg"
            alt="CIE — Centre for Innovation and Entrepreneurship"
            className="block w-full max-w-[1440px] h-auto max-h-[880px] object-contain"
          />
        </motion.div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-8 pb-20 md:pb-28 relative z-[2]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
          >
            <div className="max-w-[720px]">
              <Eyebrow>Ideate · Build · Innovate</Eyebrow>
              <h1 className="mt-6 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2.4rem,4.6vw,4rem)]">
                Where ideas become real ventures.
              </h1>
              <p className="mt-5 text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[600px]">
                A student-driven community of builders, designers, writers and
                first-time founders — turning curiosity into shipped work
                through projects, workshops, hackathons and mentorship.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:flex-shrink-0">
              <Link
                href="https://mlritcie.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#e85d04', color: '#fff' }}
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-primary-glow transition-all duration-300"
              >
                Visit mlritcie.in
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
              >
                Read on
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═════════ ABOUT — split spread with chapter mark ═════════ */}
      <section id="about" className="relative bg-black py-24 md:py-36 overflow-hidden">
        {/* Signature move — a huge ghost "02" chapter numeral bleeding off the left edge */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute -left-6 md:left-4 lg:left-8 top-[10%] hidden lg:block z-[0]"
        >
          <div className="font-mono text-[0.68rem] font-bold tracking-[0.36em] uppercase text-white/25 mb-2 ml-2">
            § Chapter Two
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 1, ease: EASE }}
            className="font-sans font-black text-white/[0.06] leading-[0.8] tracking-tighter-3"
            style={{ fontSize: 'clamp(12rem, 22vw, 26rem)' }}
          >
            02
          </motion.div>
        </div>

        {/* Signature top-right corner bracket */}
        <div aria-hidden className="absolute top-8 right-8 w-8 h-8 pointer-events-none hidden md:block z-[1]">
          <span className="absolute top-0 right-0 w-full h-px bg-primary" />
          <span className="absolute top-0 right-0 w-px h-full bg-primary" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 z-[1]">
          <div className="grid lg:grid-cols-12 gap-y-14 lg:gap-x-10">
            {/* LEFT — meta rail */}
            <div className="lg:col-span-4 lg:pt-4">
              <Eyebrow>About · The room</Eyebrow>
              <div className="mt-10 space-y-6 border-l border-white/10 pl-6">
                {[
                  ['Location',  'Dundigal, Hyderabad'],
                  ['Model',     'Student-run'],
                  ['Verticals', 'MP · CS · PD · SC'],
                  ['Home',      'Innovation Hub / EPICS'],
                ].map(([k, v], i) => (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={IN_VIEW}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: EASE }}
                    className="relative"
                  >
                    <span
                      aria-hidden
                      className="absolute -left-[26px] top-2 w-1.5 h-1.5 rounded-full bg-primary"
                      style={{ boxShadow: '0 0 8px rgba(232,93,4,0.6)' }}
                    />
                    <div className="font-mono text-[0.6rem] font-bold tracking-[0.24em] uppercase text-white/40">
                      {k}
                    </div>
                    <div className="mt-1 text-white text-[0.98rem] leading-snug font-medium">
                      {v}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT — display heading + prose with drop cap */}
            <div className="lg:col-span-8 lg:pl-8 lg:border-l lg:border-white/10">
              <WordStagger
                text="A student-run incubator, built for building."
                className="font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.4rem,5.6vw,5rem)] mb-10 md:mb-14 max-w-[16ch]"
              />

              <motion.div
                className="max-w-[62ch] space-y-6 text-white/75 leading-[1.8] text-[1.05rem] md:text-[1.12rem]"
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            variants={stagger(0.14, 0.05)}
          >
            <motion.p variants={fadeUp}>
              <span className="float-left text-white font-sans font-black text-[3.6rem] leading-[0.85] mr-3 pt-1 tracking-tighter-2">
                C
              </span>
              IE is MLRIT&apos;s Centre for Innovation and Entrepreneurship — a
              student-run incubator on the Dundigal campus. It exists to give
              students a place to actually build the things they&apos;d otherwise
              only talk about.
            </motion.p>
            <motion.p variants={fadeUp}>
              The room is open. First years and final years show up, from every
              branch. Some come to ship games or products; others come to run
              tournaments, film the events, or handle the media desk for the
              club that shipped last week.
            </motion.p>
            <motion.p variants={fadeUp}>
              Failure is treated as part of the learning, not the outcome.
              Ideas get argued with, not dismissed. Everyone here is either
              building something or helping someone else build something.
            </motion.p>
          </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ PHOTO BAND — full-bleed between About and V/M ═════════ */}
      <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/clubs/cie/gallery/cie.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span aria-hidden className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full flex items-center justify-between gap-6">
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/70">
              § Field notes · The floor
            </div>
            <div className="font-sans text-white/90 text-[clamp(1rem,1.8vw,1.6rem)] max-w-[38ch] text-right hidden md:block italic leading-snug">
              &ldquo;Every idea starts somewhere.&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* ═════════ VISION + MISSION — two blocks, one rule ═════════ */}
      <section className="relative bg-black py-20 md:py-24 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Vision &amp; Mission</Eyebrow>

          <motion.div
            className="mt-10 grid lg:grid-cols-2 lg:divide-x lg:divide-white/10"
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            variants={stagger(0.16, 0.1)}
          >
            {[
              { n: '01', label: 'Vision',  body: 'Create a student culture where innovation is not limited to competitions or special occasions.' },
              { n: '02', label: 'Mission', body: 'Make learning more practical, collaborative and student-driven.' },
            ].map((v, i) => (
              <motion.div
                key={v.n}
                variants={stagger(0.1, 0)}
                className={i === 0 ? 'lg:pr-14' : 'mt-12 lg:mt-0 lg:pl-14'}
              >
                <div className="flex items-baseline gap-4">
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show:   { opacity: 0.25, y: 0, transition: { duration: 0.8, ease: EASE } },
                    }}
                    className="font-sans font-black text-white text-[3rem] leading-none tracking-tighter-2 tabular-nums"
                    style={{ display: 'inline-block' }}
                  >
                    {v.n}
                  </motion.span>
                  <motion.span
                    variants={fadeUpTight}
                    className="font-mono text-[0.66rem] font-bold tracking-[0.24em] uppercase text-white/55"
                  >
                    {v.label}
                  </motion.span>
                </div>
                <motion.p
                  variants={fadeUp}
                  className="mt-5 text-white text-[clamp(1.15rem,1.55vw,1.4rem)] leading-[1.5] font-medium max-w-[42ch]"
                >
                  {v.body}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═════════ PILLARS — vertical ledger, no cards ═════════ */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          {/* Header row with 03 / 06 counter as editorial mark */}
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>Six pillars · How we work</Eyebrow>
              <WordStagger
                text="Six ways of moving."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]"
              />
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">
              § 01 → 06
            </div>
          </div>

          {/* Off-grid staggered stack — alternating rows slide in from left/right,
              with the numeral bleeding out into the margin. Each row's own
              hairline draws in on view. */}
          <div className="space-y-2">
            {OBJECTIVES.map((o, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={o.n}
                  initial="hidden"
                  whileInView="show"
                  viewport={IN_VIEW}
                  variants={stagger(0.1, 0)}
                  whileHover="hover"
                  className={`group relative py-8 md:py-10 lg:py-12 ${isEven ? '' : 'lg:pl-[8%]'}`}
                >
                  {/* Row hairline — top */}
                  <motion.span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-white/15 origin-left"
                    variants={{
                      hidden: { scaleX: 0 },
                      show:   { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
                      hover:  { backgroundColor: 'rgba(232,93,4,0.7)', transition: { duration: 0.35 } },
                    }}
                  />

                  <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start">
                    {/* Big numeral — bleeds toward margin, gets orange glow on hover */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 32, x: -8 },
                        show:   { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, ease: EASE } },
                      }}
                      className="relative"
                    >
                      <div
                        className="font-sans font-black leading-[0.85] tracking-tighter-3 tabular-nums text-white/40 group-hover:text-primary transition-colors duration-500"
                        style={{ fontSize: 'clamp(3.8rem, 8vw, 7rem)' }}
                      >
                        {o.n}
                      </div>
                    </motion.div>

                    {/* Title + body */}
                    <motion.div
                      variants={fadeUpTight}
                      className="pt-2 md:pt-4 max-w-[62ch]"
                    >
                      <h3 className="font-sans font-black text-white text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.1] tracking-tight">
                        {o.t}
                      </h3>
                      <p className="mt-3 md:mt-4 text-white/55 text-[0.98rem] md:text-[1.02rem] leading-[1.7]">
                        {o.b}
                      </p>
                    </motion.div>

                    {/* Right side — small mono counter and hover arrow */}
                    <motion.div
                      variants={fadeUpTight}
                      className="hidden md:flex flex-col items-end gap-3 pt-3 min-w-[3rem]"
                    >
                      <span className="font-mono text-[0.6rem] font-bold tracking-[0.24em] uppercase text-white/30">
                        Pillar
                      </span>
                      <span
                        aria-hidden
                        className="w-8 h-px bg-white/15 group-hover:bg-primary group-hover:w-14 transition-all duration-500 ease-out-quart"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
            {/* Final hairline to close the ledger */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.9, ease: EASE }}
              className="block h-px bg-white/15 origin-left"
            />
          </div>
        </div>
      </section>

      {/* ═════════ VERTICALS — logo-first cards, no chrome ═════════ */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        {/* Faint beam decor, blends into the top */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/clubs/cie/decor/beam.svg"
          alt=""
          aria-hidden
          className="hidden lg:block absolute -top-12 -right-32 w-[520px] h-auto pointer-events-none select-none z-0"
          style={{ opacity: 0.35, mixBlendMode: 'screen' }}
        />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap max-w-[1200px]">
            <div>
              <Eyebrow>What&apos;s inside</Eyebrow>
              <WordStagger
                text="Four rooms. Four teams."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]"
              />
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">
              § 04 / MP · CS · PD · SC
            </div>
          </div>

          {/* Full-width alternating bands — logo left OR right, big display code letters as graphic */}
          <div className="space-y-2">
            {VERTICALS.map((v, i) => {
              const flipped = i % 2 === 1;
              return (
                <motion.article
                  key={v.code}
                  initial="hidden"
                  whileInView="show"
                  viewport={IN_VIEW}
                  variants={stagger(0.08, 0)}
                  whileHover="hover"
                  className="group relative py-10 md:py-14 lg:py-16"
                >
                  {/* Row hairline */}
                  <motion.span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-white/15 origin-left"
                    variants={{
                      hidden: { scaleX: 0 },
                      show:   { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
                      hover:  { backgroundColor: 'rgba(232,93,4,0.7)', transition: { duration: 0.35 } },
                    }}
                  />

                  {/* Ambient hover glow */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl ${flipped ? 'right-0 md:-right-20' : 'left-0 md:-left-20'}`}
                    style={{ backgroundColor: 'rgba(232,93,4,0.12)' }}
                  />

                  <div className={`relative grid gap-8 md:gap-14 items-center ${flipped ? 'md:grid-cols-[1fr_auto]' : 'md:grid-cols-[auto_1fr]'}`}>
                    {/* LOGO (with big display code letters behind it) */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, scale: 0.85, y: 20 },
                        show:   { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
                      }}
                      className={`relative flex-shrink-0 mx-auto md:mx-0 ${flipped ? 'md:order-2' : ''}`}
                    >
                      {/* Big display code letters — the graphic anchor */}
                      <div
                        aria-hidden
                        className={`absolute inset-0 flex items-center pointer-events-none select-none ${flipped ? 'justify-end -mr-8' : 'justify-start -ml-8'}`}
                      >
                        <span
                          className="font-sans font-black leading-[0.75] tracking-tighter-3 text-white/[0.05] group-hover:text-white/[0.08] transition-colors duration-700"
                          style={{ fontSize: 'clamp(9rem, 18vw, 20rem)' }}
                        >
                          {v.code}
                        </span>
                      </div>

                      {/* The logo itself, sitting above the display letters */}
                      <motion.div
                        className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] lg:w-[340px] lg:h-[340px] flex items-center justify-center"
                        whileHover={{ rotate: [-1.5, 1.5, -1, 0] }}
                        transition={{ duration: 0.7, ease: EASE }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.logo}
                          alt={`${v.name} logo`}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      </motion.div>
                    </motion.div>

                    {/* TEXT */}
                    <motion.div
                      variants={fadeUpTight}
                      className={`max-w-[52ch] ${flipped ? 'md:order-1 md:text-right md:ml-auto' : ''}`}
                    >
                      <div className={`flex items-center gap-3 mb-4 ${flipped ? 'md:justify-end' : ''}`}>
                        <span className="font-mono text-[0.62rem] font-bold tracking-[0.28em] uppercase text-primary">
                          Vertical · {String(i + 1).padStart(2, '0')}
                        </span>
                        <span aria-hidden className="h-px w-8 bg-primary" />
                      </div>
                      <h3 className="font-sans font-black text-white text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.98] tracking-tighter-2">
                        {v.name}
                      </h3>
                      <p className={`mt-5 text-white/60 text-[1rem] md:text-[1.05rem] leading-[1.75] ${flipped ? 'md:ml-auto' : ''}`}>
                        {v.body}
                      </p>
                    </motion.div>
                  </div>
                </motion.article>
              );
            })}
            {/* Closing hairline */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.9, ease: EASE }}
              className="block h-px bg-white/15 origin-left"
            />
          </div>
        </div>
      </section>

      {/* ═════════ EVENTS — infinite marquee (posters only) ═════════ */}
      <section id="events" className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-12">
          <Eyebrow>Events</Eyebrow>
          <WordStagger
            text="The record."
            className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)]"
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="mt-3 text-white/50 text-[0.92rem] max-w-[52ch]"
          >
            Hover any poster to read what it was.
          </motion.p>
        </div>

        <div
          className="relative overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
            maskImage:
              'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)',
          }}
        >
          <div className="flex w-max gap-5 md:gap-6 py-2 cie-events-marquee">
            {[...EVENTS, ...EVENTS].map((e, i) => (
              <article
                key={`${e.name}-${i}`}
                className="group relative flex-shrink-0 w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.poster}
                  alt={e.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 z-[1] transition-opacity duration-300 group-hover:opacity-0">
                  <div className="font-sans font-black text-white text-[1rem] leading-tight tracking-tight">
                    {e.name}
                  </div>
                </div>
                <div
                  className="absolute inset-0 z-[2] p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(6,6,6,0.35) 0%, rgba(6,6,6,0.9) 100%)',
                  }}
                >
                  <div className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary">
                    {e.kind}
                  </div>
                  <h3 className="mt-2 font-sans font-black text-white text-[1.15rem] leading-tight tracking-tight">
                    {e.name}
                  </h3>
                  <div className="mt-1 font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase text-white/50">
                    {e.date}
                  </div>
                  <p className="mt-3 text-white/75 text-[0.78rem] leading-[1.5]">
                    {e.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <style jsx>{`
          .cie-events-marquee {
            animation: cie-events-scroll 60s linear infinite;
          }
          .cie-events-marquee:hover {
            animation-play-state: paused;
          }
          @keyframes cie-events-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .cie-events-marquee { animation: none; }
          }
        `}</style>
      </section>

      {/* ═════════ FACILITIES — vertical ledger ═════════ */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Facilities</Eyebrow>
          <WordStagger
            text="Rooms we use."
            className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-14"
          />

          <div className="grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20">
            {FACILITIES.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="show"
                viewport={IN_VIEW}
                variants={stagger(0.08, 0)}
                whileHover="hover"
                className="relative grid grid-cols-[auto_1fr] gap-6 py-6"
              >
                <motion.span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-left"
                  variants={{
                    hidden: { scaleX: 0 },
                    show:   { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
                    hover:  { backgroundColor: 'rgba(232,93,4,0.55)', transition: { duration: 0.4 } },
                  }}
                />
                <motion.span
                  variants={fadeUpTight}
                  className="font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase text-primary pt-1 min-w-[2rem] tabular-nums"
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>
                <motion.div variants={fadeUpTight}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-sans font-extrabold text-white text-[1.05rem] md:text-[1.15rem] leading-tight">
                      {f.title}
                    </h3>
                    <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white/40">
                      {f.meta}
                    </span>
                  </div>
                  <p className="mt-2 text-white/55 text-[0.88rem] leading-[1.65]">
                    {f.body}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ NUMBERS — dramatic display treatment ═════════ */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        {/* Background ambient — big "07" chapter marker in the corner */}
        <div aria-hidden className="absolute top-8 right-8 hidden md:block z-[1]">
          <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 text-right">
            § Chapter Seven
          </div>
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 z-[1]">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>By the numbers</Eyebrow>
              <WordStagger
                text="In practice."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-14 md:gap-y-0">
            {STATS.map((s, i) => (
              <StatItem
                key={s.label}
                value={s.value}
                label={s.label}
                suffix={s.suffix}
                showDivider={i < STATS.length - 1}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ VALUES — quiet marquee ribbon ═════════ */}
      <section className="relative bg-black py-14 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-6">
          <Eyebrow>Core values</Eyebrow>
        </div>
        <div
          className="relative overflow-hidden py-2"
          style={{
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)',
            maskImage:
              'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)',
          }}
        >
          <div className="flex w-max gap-10 items-center cie-values-marquee">
            {[...VALUES, ...VALUES, ...VALUES].map((v, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-10 whitespace-nowrap font-sans font-black text-white/85 text-[clamp(1.4rem,2vw,1.8rem)] tracking-tight"
              >
                {v}
                <span aria-hidden className="text-primary text-[0.6em]">■</span>
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          .cie-values-marquee {
            animation: cie-values-scroll 45s linear infinite;
          }
          .cie-values-marquee:hover {
            animation-play-state: paused;
          }
          @keyframes cie-values-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .cie-values-marquee { animation: none; }
          }
        `}</style>
      </section>

      {/* ═════════ GALLERY — varied bento ═════════ */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1200px] mx-auto mb-12">
            <Eyebrow>Gallery</Eyebrow>
            <WordStagger
              text="Living document."
              className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)]"
            />
          </div>

          <motion.div
            className="grid grid-cols-12 gap-3 md:gap-4"
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            variants={stagger(0.06, 0.05)}
          >
            {GALLERY.map((g) => (
              <motion.figure
                key={g.src}
                variants={{
                  hidden: { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
                  show:   {
                    opacity: 1,
                    y: 0,
                    clipPath: 'inset(0 0 0% 0)',
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
                className="relative group overflow-hidden rounded-xl bg-white/[0.03] aspect-[4/3]"
                style={{ gridColumn: `span ${g.span} / span ${g.span}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.caption}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)',
                  }}
                />
                {/* Caption slides up on hover with a hairline accent */}
                <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out-quart">
                  <span
                    aria-hidden
                    className="block h-px w-0 group-hover:w-8 bg-primary transition-all duration-500 ease-out-quart mb-2"
                  />
                  <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white/85">
                    {g.caption}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>

          <div className="mt-10 flex justify-center">
            <Link
              href="https://mlritcie.in/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-11 px-5 rounded-full font-sans font-semibold text-[0.9rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 transition-all"
            >
              Full archive on mlritcie.in
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════ CONTACT — plain, no card ═════════ */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Get involved</Eyebrow>
          <WordStagger
            text="Bring the idea."
            className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2rem,3.6vw,3rem)] mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[52ch]"
          >
            Any branch, any year. Walk in during club hours, or reach out on
            any channel below.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="https://mlritcie.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#e85d04', color: '#fff' }}
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-primary-glow transition-all duration-300"
            >
              Visit mlritcie.in
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="mailto:ciemlrit@mlrit.ac.in"
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              Email us
            </Link>
          </motion.div>

          <div className="mt-14 border-t border-white/10 pt-8 grid md:grid-cols-3 gap-y-8 gap-x-10">
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Address
              </div>
              <div className="mt-2 text-white/85 text-[0.95rem] leading-snug">
                MLRIT, Dundigal,<br />
                Hyderabad, Telangana 500043
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Email
              </div>
              <div className="mt-2 space-y-1">
                <Link href="mailto:ciemlrit@mlrit.ac.in" className="block text-white/85 hover:text-primary text-[0.95rem]">
                  ciemlrit@mlrit.ac.in
                </Link>
                <Link href="mailto:cie@mlrinstitutions.ac.in" className="block text-white/85 hover:text-primary text-[0.95rem]">
                  cie@mlrinstitutions.ac.in
                </Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Follow
              </div>
              <div className="mt-3 flex items-center gap-2">
                {[
                  { Icon: Instagram, href: 'https://mlritcie.in', label: 'Instagram' },
                  { Icon: Linkedin,  href: 'https://mlritcie.in', label: 'LinkedIn' },
                  { Icon: Youtube,   href: 'https://mlritcie.in', label: 'YouTube' },
                  { Icon: Twitter,   href: 'https://mlritcie.in', label: 'X' },
                ].map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/15 text-white/70 grid place-items-center hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
