'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Instagram, Linkedin, Youtube, Twitter, Mail } from 'lucide-react';
import CieHero from './components/CieHero';
import CieVision from './components/CieVision';
import CieVerticals from './components/CieVerticals';
import CiePillars from './components/CiePillars';
import CieEvents from './components/CieEvents';
import CieFacilities from './components/CieFacilities';
import CieNumbers from './components/CieNumbers';
import CieGallery from './components/CieGallery';
import CieContact from './components/CieContact';

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
  const ref = useRef<HTMLDivElement>(null);
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

// Kinetic heading — per-character flip-up reveal with a blur-in, scroll-
// triggered. Each letter rotates up from its baseline and sharpens into place,
// staggered tightly so the whole line resolves like a title sequence.
function KineticHeading({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return <h2 className={className}>{text}</h2>;
  }

  return (
    <h2 className={className} aria-label={text}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-15%' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.026, delayChildren: 0.05 } } }}
        style={{ display: 'inline-block', perspective: 900 }}
      >
        {words.map((word, wi) => (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((ch, ci) => (
              <motion.span
                key={ci}
                variants={{
                  hidden: { opacity: 0, y: '0.6em', rotateX: -80, filter: 'blur(6px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, ease: EASE },
                  },
                }}
                style={{ display: 'inline-block', transformOrigin: 'bottom center', willChange: 'transform, filter' }}
              >
                {ch}
              </motion.span>
            ))}
            {wi < words.length - 1 && (
              <span aria-hidden style={{ display: 'inline-block', width: '0.26em' }}>
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </motion.span>
    </h2>
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
      {/* ═════════ HERO — signature immersive stage ═════════ */}
      <CieHero />

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
              <KineticHeading
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

      {/* ═════════ VISION + MISSION — scroll-driven manifesto ═════════ */}
      <CieVision />

      {/* ═════════ PILLARS — cursor-spotlight cards ═════════ */}
      <CiePillars />

      {/* ═════════ VERTICALS — interactive expanding accordion ═════════ */}
      <CieVerticals />

      {/* ═════════ EVENTS — draggable 3D-tilt reel ═════════ */}
      <CieEvents />

      {/* ═════════ FACILITIES — interactive ledger ═════════ */}
      <CieFacilities />

      {/* ═════════ NUMBERS — count-up band ═════════ */}
      <CieNumbers />

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

      {/* ═════════ GALLERY — clip-reveal bento ═════════ */}
      <CieGallery />

      {/* ═════════ CONTACT — get involved finale ═════════ */}
      <CieContact />

    </main>
  );
}
