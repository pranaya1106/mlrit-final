'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Instagram, Linkedin, Youtube, Globe, MessageCircle, Gamepad2, Mail } from 'lucide-react';

// APEX palette — a single red accent, matching the hero SVG.
const APEX_RED = '#D80000';
const APEX_RED_SOFT = 'rgba(216,0,0,';

// ─── Data (from apexmlrit.vercel.app + PDF) ──────────────────────────────────

const PILLARS = [
  { n: '01', t: 'Who we are',     b: 'A student-led club uniting gamers, creators and competitors at MLRIT. Built by gamers, for gamers.' },
  { n: '02', t: 'What we do',     b: 'Host Valorant, BGMI, FIFA and multi-title events. Bootcamps, casting, production and content collabs.' },
  { n: '03', t: 'Compete & grow', b: 'Build teams, scrim regularly and climb leaderboards. Mentorship from campus top-fraggers.' },
  { n: '04', t: 'Community',      b: 'Inclusive, respectful and hype. We celebrate wins, share highlights and make friends for life.' },
];

const DOMAINS = [
  { n: '01', t: 'Game development',         b: 'Real games on real engines — for mobile, PC and VR.' },
  { n: '02', t: 'E-sports',                 b: 'Competitive gaming — teams, tournaments and the community around them.' },
  { n: '03', t: 'UI/UX · game design',      b: 'Interfaces, feedback and game feel — the design work that makes a build worth playing.' },
  { n: '04', t: 'Storytelling & narrative', b: 'Worlds and characters — writing that gives every mechanic a reason to exist.' },
  { n: '05', t: 'Emerging tech',            b: 'The frontier — AR/VR, procedural generation and new engines meeting play.' },
];

const ENGINES = ['Unity', 'Unreal Engine', 'Godot'];
const TITLES  = ['Valorant', 'BGMI', 'FIFA', 'Multi-title'];

const EVENTS = [
  { slug: 'genesis',   name: 'GENESIS',                              kind: 'Workshop · Gameathon',        date: '2 days',                       partner: 'w/ Backstage Pass Institute of Gaming', body: 'A two-day Unity intensive turned hackathon. Day one — industry mentors from Backstage Pass walking students through Unity fundamentals: interface, scripting, workflow. Day two — teams of four conceptualised and built full games from scratch. Winners and runners-up took home cash prizes.' },
  { slug: 'vcc',       name: 'VCC · Valorant Campus Championship',   kind: 'Tournament · Valorant',       date: 'Wild Gaming Cafe',              partner: 'Sponsored by Wild Gaming Cafe',          body: "MLRIT's first Valorant Campus Championship — hosted at Wild Gaming Cafe, cash-prize sponsored by the venue. Out of the tournament came the MLRIT Valorant roster that now represents the campus at external tournaments." },
  { slug: 'interdept', name: 'Interdepartmental Esports',            kind: 'Championship · BGMI + Valorant', date: '180+ players · 17 departments', partner: 'Including Arundathi Institute of Medical Sciences', body: 'The first-ever Interdepartmental Esports Championship at MLRIT — BGMI and Valorant, 180+ gamers across 17 departments. Guest participants from Arundathi Institute of Medical Sciences turned the campus into a real competitive arena.' },
];

const STATS = [
  { value: 180, label: 'Players · interdept',     suffix: '+' },
  { value: 17,  label: 'Departments represented', suffix: ''  },
  { value: 4,   label: 'Founders',                suffix: ''  },
  { value: 3,   label: 'Major events',            suffix: '+' },
];

const SHOWCASE = [
  { src: '/images/clubs/apex/gallery/1.jpg', span: 8 },
  { src: '/images/clubs/apex/gallery/2.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/3.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/4.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/5.jpg', span: 4 },
  { src: '/images/clubs/apex/gallery/6.jpg', span: 12 },
];

// ─── Motion primitives ───────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: '-80px' } as const;

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

// Eyebrow — rule draws in, then label fades right with small x-shift.
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
        className="h-px w-8 origin-left"
        style={{ backgroundColor: APEX_RED }}
        variants={{
          hidden: { scaleX: 0 },
          show:   { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
        }}
      />
      <motion.span
        className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase"
        style={{ color: APEX_RED }}
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

// Word-stagger heading — each word rises from y:0.4em with a small stagger.
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

// Count-up hook — animates 0 → target when in view.
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

function StatItem({ value, label, suffix, showDivider, index }: {
  value: number; label: string; suffix: string; showDivider: boolean; index: number;
}) {
  const { ref, n } = useCountUp(value);
  return (
    <motion.div
      className="group relative px-4 md:px-8 lg:px-10 py-2 md:py-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-30% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
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
        className="font-sans font-black text-white leading-[0.85] tracking-tighter-3 tabular-nums transition-colors duration-700"
        style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)' }}
      >
        <span
          className="group-hover:text-current transition-colors duration-500"
          style={{ transition: 'color .5s' }}
        >
          {n.toLocaleString('en-IN')}
        </span>
        <span style={{ color: APEX_RED }}>{suffix}</span>
      </motion.div>
      <motion.div
        aria-hidden
        variants={{
          hidden: { scaleX: 0 },
          show:   { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
        }}
        className="mt-6 h-px bg-white/15 origin-left w-[70%] transition-colors duration-500 group-hover:bg-white"
        style={{ ['--h' as any]: APEX_RED }}
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

// Faux event poster — tries jpg then png, falls back to a styled placeholder.
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
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      )}
      {!imgOk && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4"
          style={{
            background:
              `radial-gradient(circle at 30% 30%, ${APEX_RED_SOFT}0.30) 0%, transparent 55%),` +
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
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function APEXClubPage() {
  return (
    <main className="bg-black text-white">
      {/* ═════════ HERO — APEX poster ═════════ */}
      <section className="relative bg-black overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-6 md:pt-8 relative z-[2]">
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
          transition={{ duration: 1, ease: EASE }}
          className="relative w-full mt-2 md:mt-4 flex justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/clubs/apex-hero.svg"
            alt="APEX — Esports and Game Development"
            className="block w-full max-w-[1440px] h-auto max-h-[880px] object-contain"
          />
        </motion.div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-8 pb-20 md:pb-28 relative z-[2]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
          >
            <div className="max-w-[720px]">
              <Eyebrow>Play · Build · Compete</Eyebrow>
              <h1 className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]">
                Not here to take part.<br />Here to take over.
              </h1>
              <p className="mt-6 text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[600px]">
                APEX — MLRIT&apos;s premier gaming community. Campus
                tournaments, esports scrims, LAN nights, and workshops on
                strategy, streaming and production. Casual player or
                competitive grinder — you&apos;ll find your squad here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:flex-shrink-0">
              <Link
                href="https://apexmlrit.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: APEX_RED, color: '#fff' }}
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-[0_18px_36px_-14px_rgba(216,0,0,0.55)] transition-all duration-300"
              >
                Visit apexmlrit.vercel.app
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
        {/* Ghost chapter numeral bleeding from the left edge */}
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
            className="font-sans font-black leading-[0.8] tracking-tighter-3"
            style={{ fontSize: 'clamp(12rem, 22vw, 26rem)', color: 'rgba(255,255,255,0.06)' }}
          >
            02
          </motion.div>
        </div>

        {/* Corner bracket top-right — signature mark */}
        <div aria-hidden className="absolute top-8 right-8 w-8 h-8 pointer-events-none hidden md:block z-[1]">
          <span className="absolute top-0 right-0 w-full h-px" style={{ backgroundColor: APEX_RED }} />
          <span className="absolute top-0 right-0 w-px h-full" style={{ backgroundColor: APEX_RED }} />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 z-[1]">
          <div className="grid lg:grid-cols-12 gap-y-14 lg:gap-x-10">
            {/* LEFT — meta rail */}
            <div className="lg:col-span-4 lg:pt-4">
              <Eyebrow>About · The squad</Eyebrow>
              <div className="mt-10 space-y-6 border-l border-white/10 pl-6">
                {[
                  ['Established', 'March 2024'],
                  ['Location',    'MLRIT · Dundigal'],
                  ['Titles',      'Valorant · BGMI · FIFA'],
                  ['Engines',     'Unity · Unreal · Godot'],
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
                      className="absolute -left-[26px] top-2 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: APEX_RED, boxShadow: `0 0 8px ${APEX_RED_SOFT}0.6)` }}
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
                text="Built by gamers, for gamers."
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
                  <span
                    className="float-left font-sans font-black text-[3.6rem] leading-[0.85] mr-3 pt-1 tracking-tighter-2"
                    style={{ color: APEX_RED }}
                  >
                    A
                  </span>
                  PEX MLRIT is a student-led esports and game development
                  community. Established March 2024, it brings players,
                  developers, designers and storytellers into one active
                  gaming culture on the Dundigal campus.
                </motion.p>
                <motion.p variants={fadeUp}>
                  The club runs Valorant, BGMI, FIFA and multi-title events —
                  bootcamps, casting, production and content collabs. Members
                  ship real mobile, PC and VR games on Unity, Unreal Engine
                  and Godot. Others film, cast or run the media desk for the
                  tournament next week.
                </motion.p>
                <motion.p variants={fadeUp}>
                  We build teams, scrim regularly and climb leaderboards.
                  Inclusive, respectful and hype — we celebrate wins, share
                  highlights and make friends for life.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ PHOTO BAND — full-bleed between sections ═════════ */}
      <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/clubs/apex/gallery/2.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span aria-hidden className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full flex items-center justify-between gap-6">
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/70">
              § Field notes · The arena
            </div>
            <div className="font-sans text-white/90 text-[clamp(1rem,1.8vw,1.6rem)] max-w-[38ch] text-right hidden md:block italic leading-snug">
              &ldquo;Not here to take part.&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* ═════════ PILLARS — off-grid staggered ledger ═════════ */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>The four · What APEX is about</Eyebrow>
              <WordStagger
                text="Four moves."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)]"
              />
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">
              § 01 → 04
            </div>
          </div>

          <div className="space-y-2">
            {PILLARS.map((p, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={p.n}
                  initial="hidden"
                  whileInView="show"
                  viewport={IN_VIEW}
                  variants={stagger(0.1, 0)}
                  whileHover="hover"
                  className={`group relative py-8 md:py-10 lg:py-12 ${isEven ? '' : 'lg:pl-[8%]'}`}
                >
                  <motion.span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-white/15 origin-left"
                    variants={{
                      hidden: { scaleX: 0 },
                      show:   { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
                      hover:  { backgroundColor: APEX_RED, transition: { duration: 0.35 } },
                    }}
                  />

                  <div className="grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 32, x: -8 },
                        show:   { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, ease: EASE } },
                      }}
                    >
                      <div
                        className="font-sans font-black leading-[0.85] tracking-tighter-3 tabular-nums text-white/40 transition-colors duration-500 group-hover:text-white"
                        style={{ fontSize: 'clamp(3.8rem, 8vw, 7rem)' }}
                      >
                        <span
                          className="group-hover:opacity-0 opacity-100 transition-opacity duration-300"
                          style={{ display: 'inline-block' }}
                        >
                          {p.n}
                        </span>
                        <span
                          className="group-hover:opacity-100 opacity-0 transition-opacity duration-300"
                          style={{ display: 'inline-block', color: APEX_RED, marginLeft: '-1em' }}
                        >
                          {p.n}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeUpTight} className="pt-2 md:pt-4 max-w-[62ch]">
                      <h3 className="font-sans font-black text-white text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.1] tracking-tight">
                        {p.t}
                      </h3>
                      <p className="mt-3 md:mt-4 text-white/55 text-[0.98rem] md:text-[1.02rem] leading-[1.7]">
                        {p.b}
                      </p>
                    </motion.div>

                    <motion.div
                      variants={fadeUpTight}
                      className="hidden md:flex flex-col items-end gap-3 pt-3 min-w-[3rem]"
                    >
                      <span className="font-mono text-[0.6rem] font-bold tracking-[0.24em] uppercase text-white/30">
                        Move
                      </span>
                      <span
                        aria-hidden
                        className="w-8 h-px bg-white/15 group-hover:w-14 transition-all duration-500 ease-out-quart"
                        style={{ ['--h' as any]: APEX_RED }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.9, ease: EASE }}
              className="block h-px bg-white/15 origin-left"
            />
          </div>

          {/* Titles + engines — chip rows below the ledger */}
          <div className="mt-16 md:mt-20 pt-8 border-t border-white/10 grid md:grid-cols-2 gap-y-8 gap-x-12">
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

      {/* ═════════ DOMAINS — off-grid ledger ═════════ */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>Five domains</Eyebrow>
              <WordStagger
                text="Talents in the room."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]"
              />
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">
              § 01 → 05
            </div>
          </div>

          <div className="space-y-2">
            {DOMAINS.map((d, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={d.n}
                  initial="hidden"
                  whileInView="show"
                  viewport={IN_VIEW}
                  variants={stagger(0.1, 0)}
                  whileHover="hover"
                  className={`group relative py-8 md:py-10 lg:py-12 ${isEven ? '' : 'lg:pl-[8%]'}`}
                >
                  <motion.span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-white/15 origin-left"
                    variants={{
                      hidden: { scaleX: 0 },
                      show:   { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
                      hover:  { backgroundColor: APEX_RED, transition: { duration: 0.35 } },
                    }}
                  />

                  <div className="grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 32 },
                        show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                      }}
                    >
                      <div
                        className="font-sans font-black leading-[0.85] tracking-tighter-3 tabular-nums text-white/40 transition-colors duration-500 group-hover:text-white"
                        style={{ fontSize: 'clamp(3.8rem, 8vw, 7rem)' }}
                      >
                        {d.n}
                      </div>
                    </motion.div>
                    <motion.div variants={fadeUpTight} className="pt-2 md:pt-4 max-w-[58ch]">
                      <h3 className="font-sans font-black text-white text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.1] tracking-tight">
                        {d.t}
                      </h3>
                      <p className="mt-3 text-white/55 text-[0.98rem] md:text-[1.02rem] leading-[1.7]">
                        {d.b}
                      </p>
                    </motion.div>
                    <motion.div
                      variants={fadeUpTight}
                      className="hidden md:flex flex-col items-end gap-3 pt-3 min-w-[3rem]"
                    >
                      <span
                        className="font-mono text-[0.6rem] font-bold tracking-[0.24em] uppercase text-white/30"
                      >
                        Domain
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
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

      {/* ═════════ EVENTS ═════════ */}
      <section id="events" className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-90 pointer-events-none"
          style={{
            background:
              `radial-gradient(700px 400px at 15% 20%, ${APEX_RED_SOFT}0.12) 0%, transparent 60%),` +
              `radial-gradient(600px 400px at 85% 80%, ${APEX_RED_SOFT}0.09) 0%, transparent 60%)`,
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>Events · The record</Eyebrow>
              <WordStagger
                text="Star events APEX ran."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[16ch]"
              />
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">
              § Chapter Five
            </div>
          </div>

          <motion.div
            className="space-y-5 md:space-y-6"
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            variants={stagger(0.1, 0.05)}
          >
            {EVENTS.map((e) => (
              <motion.article
                key={e.slug}
                variants={{
                  hidden: { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
                  show:   {
                    opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-[300px] flex-shrink-0 h-[240px] md:h-auto overflow-hidden">
                    <EventPosterPlaceholder label={e.name} slug={e.slug} />
                  </div>
                  <div className="flex-1 p-7 md:p-9 flex flex-col">
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
                    <h3 className="mt-3 font-sans font-black text-white text-[clamp(1.4rem,2.4vw,2rem)] leading-tight tracking-tight">
                      {e.name}
                    </h3>
                    <div className="mt-1 font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-white/40">
                      {e.partner}
                    </div>
                    <p className="mt-4 text-white/60 text-[0.95rem] leading-[1.7] flex-1">
                      {e.body}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═════════ NUMBERS — dramatic display treatment ═════════ */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div aria-hidden className="absolute top-8 right-8 hidden md:block z-[1]">
          <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 text-right">
            § Chapter Six
          </div>
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 z-[1]">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>By the numbers</Eyebrow>
              <WordStagger
                text="On the board."
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

      {/* ═════════ SHOWCASE — bento with mask reveal ═════════ */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>Showcase</Eyebrow>
              <WordStagger
                text="From the events room."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]"
              />
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">
              § Chapter Seven
            </div>
          </div>

          <motion.div
            className="grid grid-cols-12 gap-3 md:gap-4"
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            variants={stagger(0.06, 0.05)}
          >
            {SHOWCASE.map((g, i) => (
              <motion.figure
                key={g.src}
                variants={{
                  hidden: { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
                  show:   {
                    opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
                className="relative group overflow-hidden rounded-xl bg-white/[0.03] aspect-[4/3]"
                style={{ gridColumn: `span ${g.span} / span ${g.span}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={`APEX showcase ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)',
                  }}
                />
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═════════ TEAM — editorial band ═════════ */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-y-10 lg:gap-x-10">
            <div className="lg:col-span-4">
              <Eyebrow>Our team</Eyebrow>
              <WordStagger
                text="Behind APEX."
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.4rem,5vw,4.5rem)]"
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={IN_VIEW}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                className="mt-8 text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[42ch]"
              >
                The passionate gamers and creators building a thriving gaming
                community on campus.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              viewport={IN_VIEW}
              transition={{ duration: 1, ease: EASE }}
              className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/clubs/apex/team.png"
                alt="APEX team"
                className="block w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════ CONTACT ═════════ */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div aria-hidden className="absolute top-8 right-8 hidden md:block z-[1]">
          <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 text-right">
            § Chapter Nine
          </div>
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Get involved</Eyebrow>
          <WordStagger
            text="Ready to level up?"
            className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch] mb-10"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[52ch]"
          >
            Any year, any branch. Turn up for a scrim, pitch a game idea, or
            run the media desk for the next tournament. The door is open.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="https://apexmlrit.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: APEX_RED, color: '#fff' }}
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-[0_18px_36px_-14px_rgba(216,0,0,0.55)] transition-all duration-300"
            >
              Visit the site
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="https://discord.gg/TsBDQKPNe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Join Discord
            </Link>
          </motion.div>

          <div className="mt-16 border-t border-white/10 pt-10 grid md:grid-cols-3 gap-y-10 gap-x-10">
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Home base
              </div>
              <div className="mt-3 text-white/85 text-[0.95rem] leading-snug">
                MLRIT, Dundigal,<br />
                Hyderabad, Telangana 500043
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Live site
              </div>
              <div className="mt-3">
                <Link
                  href="https://apexmlrit.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/85 hover:text-white text-[0.95rem]"
                >
                  apexmlrit.vercel.app
                </Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">
                Follow
              </div>
              <div className="mt-4 flex items-center gap-2">
                {[
                  { Icon: Instagram,     href: 'https://www.instagram.com/apexmlrit/',            label: 'Instagram' },
                  { Icon: Linkedin,      href: 'https://www.linkedin.com/company/apex-mlrit',     label: 'LinkedIn' },
                  { Icon: Youtube,       href: 'https://www.youtube.com/@APEXMLRIT',              label: 'YouTube' },
                  { Icon: MessageCircle, href: 'https://discord.gg/TsBDQKPNe',                     label: 'Discord' },
                  { Icon: Globe,         href: 'https://apexmlrit.vercel.app',                     label: 'Website' },
                ].map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full border border-white/15 text-white/70 grid place-items-center hover:text-white transition-colors"
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
