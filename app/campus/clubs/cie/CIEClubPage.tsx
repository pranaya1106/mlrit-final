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

function StatItem({ value, label, suffix, showDivider }: { value: number; label: string; suffix: string; showDivider: boolean }) {
  const { ref, n } = useCountUp(value);
  return (
    <div className={`px-4 md:px-6 ${showDivider ? 'md:border-r md:border-white/10' : ''}`}>
      <div ref={ref} className="font-sans font-black text-white text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none tracking-tighter-2 tabular-nums">
        {n.toLocaleString('en-IN')}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-4 font-mono text-[0.64rem] font-bold tracking-[0.24em] uppercase text-white/50">
        {label}
      </div>
    </div>
  );
}

// Tiny mono-caps eyebrow — reused across the page so every section shares the
// same rail.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px w-6 bg-primary" />
      <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-primary">
        {children}
      </span>
    </div>
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

      {/* ═════════ ABOUT — plain editorial spread ═════════ */}
      <section id="about" className="relative bg-black py-20 md:py-28 overflow-hidden">
        {/* Decorative photo strip tucked into the section — echoes the hero's
            photo-cutout language. Hidden on small screens. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/clubs/cie/decor/photo-strip.svg"
          alt=""
          aria-hidden
          className="hidden lg:block absolute right-6 top-16 w-[240px] h-auto pointer-events-none select-none rounded-lg"
          style={{ opacity: 0.45, transform: 'rotate(4deg)' }}
        />

        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>About</Eyebrow>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2rem,3.6vw,3rem)] mb-10 md:mb-12">
            About CIE.
          </h2>

          <div className="max-w-[64ch] space-y-5 text-white/75 leading-[1.8] text-[1.02rem] md:text-[1.08rem]">
            <p>
              CIE is MLRIT&apos;s Centre for Innovation and Entrepreneurship — a
              student-run incubator on the Dundigal campus. It exists to give
              students a place to actually build the things they&apos;d otherwise
              only talk about.
            </p>
            <p>
              The room is open. First years and final years show up, from every
              branch. Some come to ship games or products; others come to run
              tournaments, film the events, or handle the media desk for the
              club that shipped last week.
            </p>
            <p>
              Failure is treated as part of the learning, not the outcome.
              Ideas get argued with, not dismissed. Everyone here is either
              building something or helping someone else build something.
            </p>
          </div>

          {/* Fact strip — inline, hairline-separated */}
          <div className="mt-12 border-t border-white/10 pt-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
            {[
              ['Location',  'Dundigal, Hyderabad'],
              ['Model',     'Student-run'],
              ['Verticals', 'MP · CS · PD · SC'],
              ['Home',      'Innovation Hub / EPICS'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/40">
                  {k}
                </div>
                <div className="mt-1.5 text-white text-[0.92rem] leading-snug">
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ VISION + MISSION — two blocks, one rule ═════════ */}
      <section className="relative bg-black py-20 md:py-24 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Vision &amp; Mission</Eyebrow>

          <div className="mt-10 grid lg:grid-cols-2 lg:divide-x lg:divide-white/10">
            <div className="lg:pr-14">
              <div className="flex items-baseline gap-4">
                <span className="font-sans font-black text-white/25 text-[3rem] leading-none tracking-tighter-2">
                  01
                </span>
                <span className="font-mono text-[0.66rem] font-bold tracking-[0.24em] uppercase text-white/55">
                  Vision
                </span>
              </div>
              <p className="mt-5 text-white text-[clamp(1.15rem,1.55vw,1.4rem)] leading-[1.5] font-medium max-w-[42ch]">
                Create a student culture where innovation is not limited to
                competitions or special occasions.
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:pl-14">
              <div className="flex items-baseline gap-4">
                <span className="font-sans font-black text-white/25 text-[3rem] leading-none tracking-tighter-2">
                  02
                </span>
                <span className="font-mono text-[0.66rem] font-bold tracking-[0.24em] uppercase text-white/55">
                  Mission
                </span>
              </div>
              <p className="mt-5 text-white text-[clamp(1.15rem,1.55vw,1.4rem)] leading-[1.5] font-medium max-w-[42ch]">
                Make learning more practical, collaborative and student-driven.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ PILLARS — vertical ledger, no cards ═════════ */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Six pillars</Eyebrow>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-14">
            How we work.
          </h2>

          <div className="grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20">
            {OBJECTIVES.map((o, i) => (
              <div
                key={o.n}
                className="grid grid-cols-[auto_1fr] gap-6 py-7 border-t border-white/10"
              >
                <span className="font-sans font-black text-white/30 text-[2.4rem] md:text-[3rem] leading-none tracking-tighter-2 tabular-nums">
                  {o.n}
                </span>
                <div className="pt-1">
                  <h3 className="font-sans font-extrabold text-white text-[1.1rem] md:text-[1.2rem] leading-tight">
                    {o.t}
                  </h3>
                  <p className="mt-2 text-white/55 text-[0.9rem] md:text-[0.95rem] leading-[1.65] max-w-[44ch]">
                    {o.b}
                  </p>
                </div>
              </div>
            ))}
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

        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>What&apos;s inside</Eyebrow>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-14">
            Four verticals.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {VERTICALS.map((v) => (
              <div
                key={v.code}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-500 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
              >
                <div className="w-[220px] h-[220px] md:w-[240px] md:h-[240px] flex-shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.logo}
                    alt={`${v.name} logo`}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="text-center md:text-left md:pt-4">
                  <h3 className="font-sans font-black text-white text-[1.35rem] md:text-[1.5rem] leading-tight tracking-tight">
                    {v.name}
                  </h3>
                  <p className="mt-3 text-white/60 text-[0.92rem] md:text-[0.96rem] leading-[1.65] max-w-[38ch]">
                    {v.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ EVENTS — infinite marquee (posters only) ═════════ */}
      <section id="events" className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-12">
          <Eyebrow>Events</Eyebrow>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)]">
            The record.
          </h2>
          <p className="mt-3 text-white/50 text-[0.92rem] max-w-[52ch]">
            Hover any poster to read what it was.
          </p>
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
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-14">
            Rooms we use.
          </h2>

          <div className="grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20">
            {FACILITIES.map((f, i) => (
              <div
                key={f.title}
                className="grid grid-cols-[auto_1fr] gap-6 py-6 border-t border-white/10"
              >
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase text-primary pt-1 min-w-[2rem] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ NUMBERS ═════════ */}
      <section className="relative bg-black py-20 md:py-24 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>By the numbers</Eyebrow>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-10">
            {STATS.map((s, i) => (
              <StatItem
                key={s.label}
                value={s.value}
                label={s.label}
                suffix={s.suffix}
                showDivider={i < STATS.length - 1}
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
            <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)]">
              Living document.
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-3 md:gap-4">
            {GALLERY.map((g) => (
              <figure
                key={g.src}
                className="relative group overflow-hidden rounded-xl bg-white/[0.03] aspect-[4/3]"
                style={{ gridColumn: `span ${g.span} / span ${g.span}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.caption}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)',
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4 font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white/85">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>

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
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2rem,3.6vw,3rem)] mb-8">
            Bring the idea.
          </h2>
          <p className="text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[52ch]">
            Any branch, any year. Walk in during club hours, or reach out on
            any channel below.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
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
          </div>

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
