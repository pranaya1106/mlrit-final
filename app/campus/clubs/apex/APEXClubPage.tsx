'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Instagram, Linkedin, Youtube, Globe, MessageCircle, Gamepad2 } from 'lucide-react';

// APEX palette (single red accent, matching the hero SVG)
const APEX_RED = '#D80000';

// ─── Data (from apexmlrit.vercel.app + PDF) ──────────────────────────────────

const PILLARS = [
  { n: '01', t: 'Who we are',    b: 'A student-led club uniting gamers, creators and competitors at MLRIT. Built by gamers, for gamers.' },
  { n: '02', t: 'What we do',    b: 'Host Valorant, BGMI, FIFA and multi-title events. Bootcamps, casting, production and content collabs.' },
  { n: '03', t: 'Compete & grow', b: 'Build teams, scrim regularly and climb leaderboards. Mentorship from campus top-fraggers.' },
  { n: '04', t: 'Community',     b: 'Inclusive, respectful and hype. We celebrate wins, share highlights and make friends for life.' },
];

const DOMAINS = [
  { n: '01', t: 'Game development',       b: 'Real games on real engines — for mobile, PC and VR.' },
  { n: '02', t: 'E-sports',               b: 'Competitive gaming — teams, tournaments and the community around them.' },
  { n: '03', t: 'UI/UX · game design',    b: 'Interfaces, feedback and game feel — the design work that makes a build worth playing.' },
  { n: '04', t: 'Storytelling & narrative', b: 'Worlds and characters — writing that gives every mechanic a reason to exist.' },
  { n: '05', t: 'Emerging tech',          b: 'The frontier — AR/VR, procedural generation and new engines meeting play.' },
];

const FOUNDERS = ['Sri Nikhil', 'J Kevin', 'M Prajith Balaji', 'G Vignesh'];

const ENGINES = ['Unity', 'Unreal Engine', 'Godot'];

const TITLES = ['Valorant', 'BGMI', 'FIFA', 'Multi-title'];

const EVENTS = [
  {
    slug: 'genesis',
    name: 'GENESIS',
    kind: 'Workshop · Gameathon',
    date: '2 days',
    partner: 'w/ Backstage Pass Institute of Gaming',
    body: 'A two-day Unity intensive turned hackathon. Day one — industry mentors from Backstage Pass walking students through Unity fundamentals: interface, scripting, workflow. Day two — teams of four conceptualised and built full games from scratch. Winners and runners-up took home cash prizes.',
  },
  {
    slug: 'vcc',
    name: 'VCC · Valorant Campus Championship',
    kind: 'Tournament · Valorant',
    date: 'Wild Gaming Cafe',
    partner: 'Sponsored by Wild Gaming Cafe',
    body: 'MLRIT\'s first Valorant Campus Championship — hosted at Wild Gaming Cafe, cash-prize sponsored by the venue. Out of the tournament came the MLRIT Valorant roster that now represents the campus at external tournaments.',
  },
  {
    slug: 'interdept',
    name: 'Interdepartmental Esports',
    kind: 'Championship · BGMI + Valorant',
    date: '180+ players · 17 departments',
    partner: 'Including Arundathi Institute of Medical Sciences',
    body: 'The first-ever Interdepartmental Esports Championship at MLRIT — BGMI and Valorant, 180+ gamers across 17 departments. Guest participants from Arundathi Institute of Medical Sciences turned the campus into a real competitive arena.',
  },
];

const STATS = [
  { value: 180, label: 'Players · interdept',      suffix: '+' },
  { value: 17,  label: 'Departments represented',  suffix: '' },
  { value: 4,   label: 'Founders',                 suffix: '' },
  { value: 3,   label: 'Major events',             suffix: '+' },
];

const SHOWCASE = [
  { src: '/images/clubs/apex/gallery/1.jpg', span: 8 },
  { src: '/images/clubs/apex/gallery/2.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/3.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/4.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/5.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/6.jpg', span: 12 },
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
    <div className={`px-3 md:px-6 ${showDivider ? 'md:border-r md:border-white/10' : ''}`}>
      <div ref={ref} className="font-sans font-black text-white text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none tracking-tighter-2 tabular-nums">
        {n.toLocaleString('en-IN')}
        <span style={{ color: APEX_RED }}>{suffix}</span>
      </div>
      <div className="mt-2 md:mt-4 font-mono text-[0.64rem] font-bold tracking-[0.24em] uppercase text-white/50">
        {label}
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
      <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
        {children}
      </span>
    </div>
  );
}

// Faux poster placeholder — swaps to real artwork once you drop
// /public/images/clubs/apex/events/<slug>.{jpg,png} in. Tries jpg first,
// then falls back to png, then to a styled placeholder.
function EventPosterPlaceholder({ label, slug }: { label: string; slug: string }) {
  const [step, setStep] = useState<'jpg' | 'png' | 'none'>('jpg');
  const src =
    step === 'jpg' ? `/images/clubs/apex/events/${slug}.jpg`
    : step === 'png' ? `/images/clubs/apex/events/${slug}.png`
    : '';
  const imgOk = step !== 'none';
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {imgOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          onError={() => setStep(step === 'jpg' ? 'png' : 'none')}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {!imgOk && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4"
          style={{
            background:
              `radial-gradient(circle at 30% 30%, rgba(216,0,0,0.30) 0%, transparent 55%),` +
              'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(rgba(216,0,0,0.30) 1px, transparent 1px),' +
                'linear-gradient(90deg, rgba(216,0,0,0.30) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 70% at 50% 50%, #000 0%, transparent 100%)',
              maskImage:
                'radial-gradient(ellipse 80% 70% at 50% 50%, #000 0%, transparent 100%)',
            }}
          />
          <Gamepad2 className="relative w-8 h-8" style={{ color: APEX_RED }} />
          <div className="relative">
            <div className="font-sans font-black text-white text-[1.05rem] tracking-tight leading-tight">
              {label}
            </div>
            <div className="mt-2 font-mono text-[0.58rem] font-bold tracking-[0.22em] uppercase text-white/40">
              Poster placeholder
            </div>
          </div>
        </div>
      )}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function APEXClubPage() {
  return (
    <main className="bg-black text-white">
      {/* ═════════ HERO ═════════ */}
      <section className="relative bg-black overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-4 md:pt-8 relative z-[2]">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/campus/clubs"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.24em] uppercase text-white/50 hover:text-white transition-colors"
            >
              ← Clubs &amp; Societies
            </Link>
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.24em] uppercase text-white/45 hidden md:inline">
              MLRIT · APEX · Esports &amp; Game Development
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
            src="/images/clubs/apex-hero.svg"
            alt="APEX — Esports and Game Development"
            className="block w-full max-w-[1440px] h-auto max-h-[880px] object-contain"
          />
        </motion.div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-5 md:pt-8 pb-12 md:pb-28 relative z-[2]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 md:gap-8"
          >
            <div className="max-w-[720px]">
              <Eyebrow>Play · Build · Compete</Eyebrow>
              <h1 className="mt-4 md:mt-6 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2.4rem,4.6vw,4rem)]">
                Not here to take part.<br />Here to take over.
              </h1>
              <p className="mt-3 md:mt-5 text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[600px]">
                APEX — MLRIT&apos;s premier gaming community. Campus tournaments,
                esports scrims, LAN nights, and workshops on strategy,
                streaming and production. Casual player or competitive
                grinder — you&apos;ll find your squad here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:flex-shrink-0">
              <Link
                href="https://apexmlrit.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: APEX_RED, color: '#fff' }}
                className="inline-flex items-center gap-2.5 h-12 px-5 md:px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-[0_18px_36px_-14px_rgba(216,0,0,0.55)] transition-all duration-300"
              >
                Visit apexmlrit.vercel.app
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center gap-2.5 h-12 px-5 md:px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
              >
                Read on
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═════════ ABOUT ═════════ */}
      <section id="about" className="relative bg-black py-12 md:py-28 overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>About</Eyebrow>
          <h2 className="mt-3 md:mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2rem,3.6vw,3rem)] mb-6 md:mb-12">
            About APEX.
          </h2>

          <div className="max-w-[64ch] space-y-3 md:space-y-5 text-white/75 leading-[1.8] text-[1.02rem] md:text-[1.08rem]">
            <p>
              APEX MLRIT is a student-led esports and game development
              community. Established March 2024, it brings players,
              developers, designers and storytellers into one active gaming
              culture on the Dundigal campus.
            </p>
            <p>
              The club runs Valorant, BGMI, FIFA and multi-title events —
              bootcamps, casting, production and content collabs. Members
              ship real mobile, PC and VR games on Unity, Unreal Engine and
              Godot. Others film, cast or run the media desk for the
              tournament next week.
            </p>
            <p>
              We build teams, scrim regularly and climb leaderboards.
              Inclusive, respectful and hype — we celebrate wins, share
              highlights and make friends for life.
            </p>
          </div>

          {/* Fact strip — hairline row */}
          <div className="mt-7 md:mt-12 border-t border-white/10 pt-4 md:pt-6 grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-y-6 gap-x-4 md:gap-x-8">
            {[
              ['Established', 'March 2024'],
              ['Location',    'MLRIT · Dundigal'],
              ['Titles',      'Valorant · BGMI · FIFA'],
              ['Engines',     'Unity · Unreal · Godot'],
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

      {/* ═════════ FOUR PILLARS ═════════ */}
      <section className="relative bg-black py-12 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>The four</Eyebrow>
          <h2 className="mt-3 md:mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-14">
            What APEX is about.
          </h2>

          <div className="grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20">
            {PILLARS.map((p) => (
              <div
                key={p.n}
                className="grid grid-cols-[auto_1fr] gap-4 md:gap-6 py-5 md:py-7 border-t border-white/10"
              >
                <span className="font-sans font-black text-white/30 text-[1.8rem] md:text-[3rem] leading-none tracking-tighter-2 tabular-nums">
                  {p.n}
                </span>
                <div className="pt-1">
                  <h3 className="font-sans font-extrabold text-white text-[1.1rem] md:text-[1.2rem] leading-tight">
                    {p.t}
                  </h3>
                  <p className="mt-2 text-white/55 text-[0.9rem] md:text-[0.95rem] leading-[1.65] max-w-[44ch]">
                    {p.b}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Titles + engines chip rows */}
          <div className="mt-8 md:mt-16 pt-5 md:pt-8 border-t border-white/10 grid md:grid-cols-2 gap-y-5 md:gap-y-8 gap-x-6 md:gap-x-12">
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45 mb-4">
                Titles we run
              </div>
              <div className="flex flex-wrap gap-2">
                {TITLES.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center h-9 px-4 rounded-full border font-sans text-[0.86rem] font-medium"
                    style={{ borderColor: `${APEX_RED}55`, backgroundColor: `${APEX_RED}18`, color: '#fff' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45 mb-4">
                Engines &amp; tools
              </div>
              <div className="flex flex-wrap gap-2">
                {ENGINES.map((e) => (
                  <span
                    key={e}
                    className="inline-flex items-center h-9 px-4 rounded-full border border-white/15 bg-white/[0.04] text-white/85 font-sans text-[0.86rem] font-medium"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ DOMAINS ═════════ */}
      <section className="relative bg-black py-12 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Five domains</Eyebrow>
          <h2 className="mt-3 md:mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-14">
            The talents in the room.
          </h2>

          <div className="grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20">
            {DOMAINS.map((d) => (
              <div
                key={d.n}
                className="grid grid-cols-[auto_1fr] gap-4 md:gap-6 py-5 md:py-7 border-t border-white/10"
              >
                <span className="font-sans font-black text-white/30 text-[1.8rem] md:text-[3rem] leading-none tracking-tighter-2 tabular-nums">
                  {d.n}
                </span>
                <div className="pt-1">
                  <h3 className="font-sans font-extrabold text-white text-[1.1rem] md:text-[1.2rem] leading-tight">
                    {d.t}
                  </h3>
                  <p className="mt-2 text-white/55 text-[0.9rem] md:text-[0.95rem] leading-[1.65] max-w-[44ch]">
                    {d.b}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ EVENTS ═════════ */}
      <section id="events" className="relative bg-black py-12 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Events</Eyebrow>
          <h2 className="mt-3 md:mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-12">
            The record.
          </h2>

          <div className="space-y-3 md:space-y-6">
            {EVENTS.map((e) => (
              <article
                key={e.slug}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-[280px] flex-shrink-0 h-[220px] md:h-auto overflow-hidden">
                    <EventPosterPlaceholder label={e.name} slug={e.slug} />
                  </div>
                  <div className="flex-1 p-5 md:p-9 flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center h-6 px-2.5 rounded-full font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase"
                        style={{ backgroundColor: `${APEX_RED}22`, border: `1px solid ${APEX_RED}55`, color: APEX_RED }}
                      >
                        {e.kind}
                      </span>
                      <span className="font-mono text-[0.66rem] font-bold tracking-[0.18em] uppercase text-white/45">
                        {e.date}
                      </span>
                    </div>
                    <h3 className="mt-3 font-sans font-black text-white text-[1.4rem] md:text-[1.55rem] leading-tight tracking-tight">
                      {e.name}
                    </h3>
                    <div className="mt-1 font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-white/40">
                      {e.partner}
                    </div>
                    <p className="mt-2 md:mt-4 text-white/60 text-[0.92rem] leading-[1.65] flex-1">
                      {e.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-5 md:mt-8 font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/35">
            Drop posters at /images/clubs/apex/events/&lt;slug&gt;.png · slugs: genesis · vcc · interdept
          </p>
        </div>
      </section>

      {/* ═════════ NUMBERS ═════════ */}
      <section className="relative bg-black py-12 md:py-24 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>By the numbers</Eyebrow>
          <div className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-10">
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

      {/* ═════════ SHOWCASE ═════════ */}
      <section className="relative bg-black py-12 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1200px] mx-auto mb-7 md:mb-12">
            <Eyebrow>Showcase</Eyebrow>
            <h2 className="mt-3 md:mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)]">
              From the events room.
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-3 md:gap-4">
            {SHOWCASE.map((g, i) => (
              <figure
                key={g.src}
                className="relative group overflow-hidden rounded-xl bg-white/[0.03] aspect-[4/3]"
                style={{ gridColumn: `span ${g.span} / span ${g.span}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={`APEX showcase ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)',
                  }}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ TEAM ═════════ */}
      <section className="relative bg-black py-12 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Our team</Eyebrow>
          <h2 className="mt-3 md:mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-8">
            Behind APEX.
          </h2>
          <p className="text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[52ch] mb-7 md:mb-12">
            The passionate gamers and creators building a thriving gaming
            community on campus.
          </p>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/clubs/apex/team.png"
              alt="APEX team"
              className="block w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ═════════ CONTACT ═════════ */}
      <section className="relative bg-black py-12 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Get involved</Eyebrow>
          <h2 className="mt-3 md:mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2rem,3.6vw,3rem)] mb-8">
            Ready to level up?
          </h2>
          <p className="text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[52ch]">
            Any year, any branch. Turn up for a scrim, pitch a game idea, or
            run the media desk for the next tournament. The door is open.
          </p>

          <div className="mt-6 md:mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="https://apexmlrit.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: APEX_RED, color: '#fff' }}
              className="inline-flex items-center gap-2.5 h-12 px-5 md:px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-[0_18px_36px_-14px_rgba(216,0,0,0.55)] transition-all duration-300"
            >
              Visit the site
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="https://discord.gg/TsBDQKPNe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-12 px-5 md:px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Join Discord
            </Link>
          </div>

          <div className="mt-8 md:mt-14 border-t border-white/10 pt-5 md:pt-8 grid md:grid-cols-3 gap-y-5 md:gap-y-8 gap-x-6 md:gap-x-10">
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Home base
              </div>
              <div className="mt-2 text-white/85 text-[0.95rem] leading-snug">
                MLRIT, Dundigal,<br />
                Hyderabad, Telangana 500043
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Live site
              </div>
              <div className="mt-2">
                <Link href="https://apexmlrit.vercel.app" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white text-[0.95rem]" style={{ textUnderlineOffset: 4 }}>
                  apexmlrit.vercel.app
                </Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Follow
              </div>
              <div className="mt-3 flex items-center gap-2">
                {[
                  { Icon: Instagram,     href: 'https://www.instagram.com/apexmlrit/',           label: 'Instagram' },
                  { Icon: Linkedin,      href: 'https://www.linkedin.com/company/apex-mlrit',    label: 'LinkedIn' },
                  { Icon: Youtube,       href: 'https://www.youtube.com/@APEXMLRIT',             label: 'YouTube' },
                  { Icon: MessageCircle, href: 'https://discord.gg/TsBDQKPNe',                    label: 'Discord' },
                  { Icon: Globe,         href: 'https://apexmlrit.vercel.app',                    label: 'Website' },
                ].map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/15 text-white/70 grid place-items-center hover:text-white transition-colors"
                    style={{ ['--h' as any]: APEX_RED }}
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
