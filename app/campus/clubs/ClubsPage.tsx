'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/motion/Reveal';
import {
  CLUBS,
  CLUB_CATEGORIES,
  CATEGORY_ACCENT,
  type Club,
  type ClubCategory,
} from '@/lib/clubs';

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const ALL_CATS: (ClubCategory | 'All')[] = ['All', ...CLUB_CATEGORIES];

// ─── HERO — the roster ───────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative bg-paper overflow-hidden pt-24 md:pt-32 pb-14 md:pb-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal preset="right" className="flex items-center gap-3 mb-6">
          <span aria-hidden className="h-px w-8 bg-primary" />
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.3em] uppercase text-primary">
            Chapter 04 · Campus
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="font-sans font-black tracking-tighter-3 leading-[0.94] text-foreground text-[clamp(3rem,9vw,9rem)]">
            The clubs of<br />
            <span className="text-foreground/25">MLRIT.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-10 md:mt-14">
            <p className="text-muted leading-[1.75] text-[1.05rem] max-w-[520px]">
              Fifteen student-led communities on the Dundigal campus.
              Technical, cultural, sport, department, service — every branch
              and every corner has a room to walk into.
            </p>
            <div className="grid grid-cols-3 gap-6 md:justify-self-end self-end">
              <StatBlock value="15" label="Clubs" />
              <StatBlock value="05" label="Categories" />
              <StatBlock value="04" label="Chapter" muted />
            </div>
          </div>
        </Reveal>
      </div>

      {/* Massive club-names marquee — the atmospheric layer */}
      <div
        className="mt-16 md:mt-20 border-y border-border/70 py-6 overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)',
          maskImage: 'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)',
        }}
      >
        <div className="flex w-max gap-12 md:gap-16 items-center clubs-marquee">
          {[...CLUBS, ...CLUBS].map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 md:gap-12 font-sans font-black tracking-tighter-2 whitespace-nowrap text-foreground text-[clamp(1.8rem,3.4vw,2.8rem)]"
            >
              {c.name}
              <span aria-hidden className="text-primary text-[0.5em] align-middle">◆</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .clubs-marquee {
          animation: clubs-marquee-scroll 70s linear infinite;
        }
        .clubs-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes clubs-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .clubs-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}

function StatBlock({ value, label, muted }: { value: string; label: string; muted?: boolean }) {
  return (
    <div>
      <div
        className={cn(
          'font-sans font-black text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none tracking-tighter-2 tabular-nums',
          muted ? 'text-foreground/25' : 'text-foreground',
        )}
      >
        {value}
      </div>
      <div className="mt-2 font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-muted">
        {label}
      </div>
    </div>
  );
}

// ─── THE WALL — bento grid ───────────────────────────────────────────────────

type Size = { col: 3 | 6; row: 1 | 2 };

// Explicit size pattern per club index. Grid packs with dense auto-flow so
// gaps from filter changes fill naturally.
const WALL_PATTERN: Size[] = [
  { col: 6, row: 2 },  // 0 — hero landscape (2×2)
  { col: 3, row: 1 },  // 1
  { col: 3, row: 1 },  // 2
  { col: 3, row: 2 },  // 3 — portrait
  { col: 3, row: 1 },  // 4
  { col: 3, row: 1 },  // 5
  { col: 6, row: 2 },  // 6 — hero landscape
  { col: 3, row: 1 },  // 7
  { col: 3, row: 1 },  // 8
  { col: 3, row: 1 },  // 9
  { col: 3, row: 2 },  // 10 — portrait
  { col: 3, row: 1 },  // 11
  { col: 3, row: 1 },  // 12
  { col: 3, row: 1 },  // 13
  { col: 3, row: 1 },  // 14
];

function TheWall() {
  const [filter, setFilter] = useState<ClubCategory | 'All'>('All');

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: CLUBS.length };
    for (const club of CLUBS) c[club.category] = (c[club.category] ?? 0) + 1;
    return c;
  }, []);

  const filtered = filter === 'All' ? CLUBS : CLUBS.filter((c) => c.category === filter);

  return (
    <section id="wall" className="relative bg-paper py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header + filter chips */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-10 mb-10 md:mb-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span aria-hidden className="h-px w-8 bg-primary" />
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.3em] uppercase text-primary">
                The wall · {filtered.length} of {CLUBS.length}
              </span>
            </div>
            <h2 className="font-sans font-black tracking-tighter-2 leading-[1.02] text-foreground text-[clamp(1.8rem,3.2vw,2.8rem)]">
              Pick a room to walk into.
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-wrap gap-2">
            {ALL_CATS.map((cat) => {
              const isActive = cat === filter;
              const accent = cat === 'All' ? '#0f0f0f' : CATEGORY_ACCENT[cat as ClubCategory];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={cn(
                    'inline-flex items-center gap-2 h-10 pl-4 pr-3 rounded-full font-sans font-semibold text-[0.85rem] tracking-tight border transition-all duration-300',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isActive
                      ? 'bg-foreground text-white border-foreground shadow-md'
                      : 'bg-white text-muted border-border hover:bg-foreground hover:text-white hover:border-foreground',
                  )}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                  )}
                  {cat}
                  <span
                    className={cn(
                      'font-mono text-[0.72rem] px-1.5 py-0.5 rounded-full',
                      isActive ? 'bg-white/15 text-white/85' : 'bg-foreground/[0.06] text-foreground/50',
                    )}
                  >
                    {counts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </Reveal>
        </div>

        {/* Bento grid */}
        <motion.div
          layout
          className="grid grid-cols-6 md:grid-cols-12 gap-3 md:gap-4"
          style={{ gridAutoRows: '220px', gridAutoFlow: 'dense' }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((club, i) => (
              <WallCard
                key={club.id}
                club={club}
                size={WALL_PATTERN[i % WALL_PATTERN.length]}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function WallCard({ club, size }: { club: Club; size: Size }) {
  const accent = CATEGORY_ACCENT[club.category];
  const href = club.hasDetailPage ? `/campus/clubs/${club.id}` : '#wall';
  const isHero = size.col >= 6;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-200 focus-within:outline focus-within:outline-2 focus-within:outline-primary"
      style={{
        gridColumn: `span ${size.col} / span ${size.col}`,
        gridRow: `span ${size.row} / span ${size.row}`,
      }}
    >
      <Link href={href} className="block absolute inset-0" aria-label={club.name}>
        <Image
          src={club.image}
          alt=""
          fill
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          sizes={isHero ? '(min-width: 1024px) 720px, 100vw' : '(min-width: 1024px) 340px, 50vw'}
          quality={72}
        />

        {/* Base bottom gradient — always visible so name/chip stay legible */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* Accent bar top — reveals on hover */}
        <span
          aria-hidden
          className="absolute top-0 left-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out-quart"
          style={{ backgroundColor: accent, width: '45%' }}
        />

        {/* Category chip top-left */}
        <div className="absolute top-4 left-4 z-[2]">
          <span
            className="inline-flex items-center h-7 px-3 rounded-full font-mono text-[0.58rem] font-bold tracking-[0.18em] uppercase text-white backdrop-blur-sm border border-white/15"
            style={{ backgroundColor: `${accent}d9` }}
          >
            {club.category}
          </span>
        </div>

        {/* Arrow top-right — appears on hover */}
        <div className="absolute top-4 right-4 z-[2] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out-quart">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-foreground shadow-md">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Bottom stack — name + description that slides open on hover */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-[2]">
          <h3
            className={cn(
              'font-sans font-black text-white tracking-tighter-2 leading-[1.02]',
              isHero
                ? 'text-[clamp(1.5rem,2.4vw,2rem)]'
                : size.row === 2
                ? 'text-[clamp(1.15rem,1.4vw,1.35rem)]'
                : 'text-[clamp(1.05rem,1.2vw,1.2rem)]',
            )}
          >
            {club.name}
          </h3>

          {/* CSS-grid trick: 0fr → 1fr on hover for smooth height reveal */}
          <div
            className={cn(
              'grid transition-all duration-500 ease-out-quart',
              'grid-rows-[0fr] group-hover:grid-rows-[1fr] group-hover:mt-2',
            )}
          >
            <p
              className={cn(
                'overflow-hidden text-white/85 leading-[1.5]',
                isHero ? 'text-[0.94rem] md:text-[1rem] line-clamp-3' : 'text-[0.82rem] line-clamp-2',
              )}
            >
              {club.description}
            </p>
          </div>

          {club.hasDetailPage && (
            <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-bold tracking-[0.22em] uppercase text-white/70">
              <span
                aria-hidden
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: '#e85d04',
                  boxShadow: '0 0 8px rgba(232,93,4,0.6)',
                }}
              />
              Explore club
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

// ─── CLOSING — editorial CTA ─────────────────────────────────────────────────

function Closing() {
  return (
    <section className="relative bg-paper-2 py-24 md:py-32" style={{ backgroundColor: '#f1ece1' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1.4fr_auto] gap-10 lg:gap-16 items-end">
          <div>
            <Reveal className="flex items-center gap-3 mb-5">
              <span aria-hidden className="h-px w-8 bg-primary" />
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.3em] uppercase text-primary">
                Your turn
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-sans font-black tracking-tighter-2 leading-[1.02] text-foreground text-[clamp(2.4rem,5.6vw,5rem)]">
                Find your people.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 text-muted leading-[1.75] text-[1.05rem] max-w-[540px]">
                Walk into any meeting. Bring your curiosity. First year or
                final year, any branch — the door is open.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.18}>
            <Link
              href="/student-life"
              className="inline-flex items-center gap-2.5 h-14 px-7 rounded-full font-sans font-bold text-[0.95rem] bg-foreground text-white hover:-translate-y-[1px] transition-all duration-300 ease-out-quart shadow-md"
            >
              Explore student life
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function ClubsPage() {
  return (
    <>
      <Hero />
      <TheWall />
      <Closing />
    </>
  );
}
