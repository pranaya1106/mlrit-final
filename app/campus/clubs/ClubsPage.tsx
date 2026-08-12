'use client';

import { useRef, useState, useCallback, useId, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import {
  CLUBS,
  CLUB_CATEGORIES,
  type Club,
  type ClubCategory,
} from '@/lib/clubs';

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING_SLOW = { stiffness: 40, damping: 18, mass: 1.6 };
const SPRING_MED  = { stiffness: 75, damping: 22, mass: 0.9 };

const CATEGORY_ACCENT: Record<ClubCategory, string> = {
  Technical:        '#01741f',
  Department:       '#1e3a5f',
  Cultural:         '#b45309',
  'Social Service': '#0369a1',
  Society:          '#6b3fa0',
};

// ─── Trionn-exact card data ────────────────────────────────────────────────────
// 21 cards — each 170×114px (4:3 ratio, matching Trionn's w-43 = 172px class)
// Initial positions: scattered around the full viewport, each with a unique
//   translate3d(tx, ty, 0), scale(s), perspective(600px) rotateY(ry) rotateX(rx)
// Final positions: converge toward center in a stacked pile
//
// Coordinates sourced from the live Trionn DOM dump, mapped to MLRIT images.
// tx/ty are in px relative to 0,0 viewport origin (same as Trionn's left:0 top:0 anchor).

const W = 220;  // card width px  (Trionn base 170, bumped ~30%)
const H = 148;  // card height px (maintains 4:3 ratio)

type CardDef = {
  src: string;
  alt: string;
  // initial state
  itx: number; ity: number; is: number; irY: number; irX: number;
  // final (converged) state
  ftx: number; fty: number; fs: number; frY: number; frX: number;
  z: number;
};

// Exact Trionn initial positions extracted from live DOM at 1448×732 viewport.
// All 21 cards converge to the same center point (639, 309) and shrink to ~0.
// Cards are spread across the full viewport — many partially off-screen at edges.
// The convergence point is expressed as a percentage of viewport so it scales.
// CX/CY in px at 1448×732 → 44.1vw, 42.2vh
const CX = 639; // convergence x (px at 1448w) — all cards collapse here
const CY = 309; // convergence y (px at 1448w)

// Positions use vw/vh percentages baked into px at 1448×732.
// Cards that were off-screen (ty<0 or tx>1300) are nudged to be partially visible.
// rotateY/X kept small (≤6deg) — large rotations on big-scale cards look wrong.
// 21 cards spread across the viewport (0–1200px x, 30–640px y).
// tx/ty = top-left of the 170×114 card before scale is applied.
// All cards stay within [80, vw-80] x and [20, vh-80] y so none are fully clipped.
const CARDS: CardDef[] = [
  { src:'/images/students/club-event.png',               alt:'Cultural club event',
    itx:1050, ity:  60,  is:0.46, irY:-4.0, irX:-3.0,  ftx:CX, fty:CY, fs:0.04, frY:0, frX:0, z: 8 },
  { src:'/images/students/students-laughing.png',        alt:'Students bonding',
    itx: 850, ity: 300,  is:0.66, irY:-3.0, irX: 1.5,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z:11 },
  { src:'/images/facilities/campus/sti-hub-1.jpg',       alt:'STI Hub innovation',
    itx: 180, ity: 460,  is:0.41, irY: 5.0, irX: 4.0,  ftx:CX, fty:CY, fs:0.04, frY:0, frX:0, z: 7 },
  { src:'/images/students/reel-aiml.png',                alt:'AI ML club',
    itx: 490, ity:  40,  is:0.55, irY: 0.0, irX:-4.0,  ftx:CX, fty:CY, fs:0.04, frY:0, frX:0, z: 9 },
  { src:'/images/students/classroom-chat.png',           alt:'Technical discussion',
    itx: 190, ity:  90,  is:0.45, irY: 5.0, irX:-3.0,  ftx:CX, fty:CY, fs:0.03, frY:0, frX:0, z: 8 },
  { src:'/images/sports/marathon-runner.png',            alt:'Student marathon',
    itx: 390, ity: 590,  is:0.65, irY: 1.5, irX: 5.0,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z:11 },
  { src:'/images/facilities/campus/library-wide-1.jpg',  alt:'Campus library',
    itx: 800, ity: 480,  is:0.75, irY:-3.0, irX: 3.0,  ftx:CX, fty:CY, fs:0.06, frY:0, frX:0, z:14 },
  { src:'/images/students/campus-steps.png',             alt:'Students on campus steps',
    itx: 100, ity: 350,  is:0.56, irY: 5.0, irX: 1.5,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z: 9 },
  { src:'/images/students/campus-group.png',             alt:'Campus group',
    itx: 100, ity:  50,  is:0.37, irY: 4.0, irX:-4.0,  ftx:CX, fty:CY, fs:0.03, frY:0, frX:0, z: 7 },
  { src:'/images/students/faculty-seminar.png',          alt:'Faculty seminar',
    itx:  90, ity: 200,  is:0.42, irY: 5.0, irX:-2.0,  ftx:CX, fty:CY, fs:0.03, frY:0, frX:0, z: 7 },
  { src:'/images/students/p1.png',                       alt:'Students',
    itx: 940, ity: 330,  is:0.87, irY:-2.0, irX: 2.0,  ftx:CX, fty:CY, fs:0.06, frY:0, frX:0, z:15 },
  { src:'/images/students/p2.png',                       alt:'Campus life',
    itx:1150, ity: 500,  is:0.45, irY:-4.0, irX: 4.0,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z: 8 },
  { src:'/images/facilities/campus/sti-hub-2.jpg',       alt:'STI Hub workspace',
    itx: 520, ity: 560,  is:0.67, irY: 1.0, irX: 5.0,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z:11 },
  { src:'/images/facilities/campus/sti-hub-3.jpg',       alt:'STI Hub event',
    itx:1100, ity:  30,  is:0.65, irY:-4.0, irX:-4.0,  ftx:CX, fty:CY, fs:0.04, frY:0, frX:0, z:12 },
  { src:'/images/sports/trophy-cabinet.png',             alt:'Sports trophies',
    itx:1000, ity: 560,  is:0.58, irY:-3.0, irX: 5.0,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z:10 },
  { src:'/images/students/s1.jpg',                       alt:'Student life',
    itx: 330, ity: 340,  is:0.89, irY: 3.0, irX:-1.0,  ftx:CX, fty:CY, fs:0.06, frY:0, frX:0, z:16 },
  { src:'/images/students/s2.jpg',                       alt:'Campus activities',
    itx: 540, ity: 210,  is:0.62, irY: 1.0, irX:-1.0,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z:10 },
  { src:'/images/students/s3.jpg',                       alt:'Student event',
    itx: 660, ity:  50,  is:0.60, irY: 2.0, irX:-4.0,  ftx:CX, fty:CY, fs:0.04, frY:0, frX:0, z:10 },
  { src:'/images/campus/campus-aerial.png',              alt:'MLR campus aerial',
    itx: 290, ity: 600,  is:0.52, irY: 1.0, irX: 5.0,  ftx:CX, fty:CY, fs:0.05, frY:0, frX:0, z: 9 },
  { src:'/images/students/s4.jpg',                       alt:'Student activity',
    itx: 760, ity: 390,  is:0.47, irY:-1.0, irX: 3.0,  ftx:CX, fty:CY, fs:0.04, frY:0, frX:0, z: 8 },
  { src:'/images/sports/basketball-court.png',           alt:'Sports court',
    itx: 710, ity: 540,  is:0.38, irY:-1.0, irX: 3.0,  ftx:CX, fty:CY, fs:0.04, frY:0, frX:0, z: 7 },
];

// ─── Single floating card ─────────────────────────────────────────────────────

function FloatingCard({
  card,
  index,
  progress,
  visible,
}: {
  card: CardDef;
  index: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  visible: boolean;
}) {
  // Scroll convergence: all start together, stagger by 4ms per card
  const start = 0.0 + index * 0.004;
  const end   = 0.65;

  const txRaw = useTransform(progress, [start, end], [card.itx as number, card.ftx as number]);
  const tyRaw = useTransform(progress, [start, end], [card.ity as number, card.fty as number]);
  const sRaw  = useTransform(progress, [start, end], [card.is  as number, card.fs  as number]);
  const rYRaw = useTransform(progress, [start, end], [card.irY as number, card.frY as number]);
  const rXRaw = useTransform(progress, [start, end], [card.irX as number, card.frX as number]);

  const tx = useSpring(txRaw, SPRING_SLOW);
  const ty = useSpring(tyRaw, SPRING_SLOW);
  const s  = useSpring(sRaw,  SPRING_MED);
  const rY = useSpring(rYRaw, SPRING_MED);
  const rX = useSpring(rXRaw, SPRING_MED);

  // Fade out only when section exits; controlled by parent for initial appear
  const opScroll = useTransform(progress, [0.75, 0.92], [1, 0]);
  const opSpring = useSpring(opScroll, SPRING_MED);

  // Drift offset — rAF loop gives organic slow movement exactly like Trionn
  // Each card has a unique direction vector and speed
  const driftRef = useRef({ x: 0, y: 0 });
  const divRef   = useRef<HTMLDivElement>(null);

  // Trionn drifts ~1.3px/s = ~0.022px/frame @ 60fps
  // Each card gets a unique slow speed + direction so they never sync
  const drift = useMemo(() => ({
    vy: (0.016 + (index % 7) * 0.004) * (index % 2 === 0 ? 1 : -1),  // ±0.016–0.040 px/frame
    vx: (0.008 + (index % 5) * 0.003) * (index % 3 === 0 ? 1 : -1),  // ±0.008–0.020 px/frame
    rangeY: 14 + (index % 4) * 5,   // 14–29 px vertical travel
    rangeX: 8  + (index % 3) * 4,   // 8–16  px horizontal travel
  }), [index]);

  useEffect(() => {
    let rafId: number;
    let dirY = 1, dirX = 1;
    const pos = driftRef.current;

    const tick = () => {
      pos.y += drift.vy * dirY;
      pos.x += drift.vx * dirX;
      if (Math.abs(pos.y) >= drift.rangeY) dirY *= -1;
      if (Math.abs(pos.x) >= drift.rangeX) dirX *= -1;

      if (divRef.current) {
        divRef.current.style.transform = `translate(${pos.x.toFixed(2)}px,${pos.y.toFixed(2)}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [drift]);

  // Composed scroll transform on the outer wrapper
  const transform = useTransform(
    [tx, ty, s, rY, rX] as const,
    ([tvx, tvy, sv, rvY, rvX]: number[]) =>
      `translate3d(${tvx}px,${tvy}px,0px) scale(${sv}) perspective(600px) rotateY(${rvY}deg) rotateX(${rvX}deg)`,
  );

  // Layer 1: motion.div — scroll position/scale/rotate (style MotionValues, no animate)
  // Layer 2: motion.div — scroll exit fade (style opacity MotionValue only)
  // Layer 3: plain div  — appear transition via CSS + rAF drift
  return (
    <motion.div
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        width: W,
        height: H,
        left: 0,
        top: 0,
        zIndex: card.z,
        transformOrigin: 'center center',
        willChange: 'transform',
        transform,
      }}
    >
      <motion.div className="w-full h-full" style={{ opacity: opSpring }}>
        <div
          className="w-full h-full"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.65s ease',
          }}
        >
          <div
            ref={divRef}
            className="w-full h-full overflow-hidden"
            style={{ borderRadius: 8, willChange: 'transform' }}
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              className="object-cover"
              quality={70}
              loading="eager"
              sizes={`${W}px`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
// Exact Trionn structure:
//   - Pure black #000 background
//   - Outer div 200vh (pin-spacer equivalent)
//   - Sticky inner 100vh panel
//   - 21 absolute .ft cards starting at scattered positions, converging on scroll
//   - Center title: large light-grey display font, below middle of viewport
//   - Subtitle: small grey text under title
//   - Title fades out at ~65-80% scroll progress

function Hero() {
  const prefersReduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  // Cards start hidden, appear together after ~700ms (exact Trionn timing)
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setCardsVisible(true), 700);
    return () => clearTimeout(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end start'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.62, 0.82], [1, 0]);
  const titleY = useSpring(
    useTransform(scrollYProgress, [0.62, 0.82], [0, prefersReduced ? 0 : -28]),
    SPRING_MED,
  );

  return (
    // Outer: 200vh scroll track (matches Trionn's pin-spacer = 2 × viewport)
    <div ref={outerRef} style={{ height: '200vh' }} className="relative">
      {/* Sticky inner panel — pure black, full viewport, clips card overflow */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh', backgroundColor: '#000' }}
        role="region"
        aria-label="Clubs and Societies hero"
      >
        {/* Cards layer */}
        {!prefersReduced && CARDS.map((card, i) => (
          <FloatingCard key={card.src} card={card} index={i} progress={scrollYProgress} visible={cardsVisible} />
        ))}

        {/* Reduced-motion: 4 static cards at final positions */}
        {prefersReduced && (
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            {[0, 3, 4, 17].map((i) => {
              const c = CARDS[i];
              return (
                <div
                  key={c.src}
                  className="absolute overflow-hidden"
                  style={{
                    width: W, height: H,
                    left: c.ftx, top: c.fty,
                    borderRadius: 8,
                    zIndex: c.z,
                    opacity: 0.7,
                    transform: `scale(${c.fs}) perspective(600px) rotateY(${c.frY}deg) rotateX(${c.frX}deg)`,
                  }}
                >
                  <Image src={c.src} alt="" fill className="object-cover" quality={65} />
                </div>
              );
            })}
          </div>
        )}

        {/* Centre title — Trionn style: large, light-grey, bottom-center of viewport */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none select-none z-20"
          style={{ paddingBottom: 'clamp(80px, 14vh, 140px)', opacity: titleOpacity, y: titleY }}
        >
          {/* Big display heading — Trionn uses ~77px, 400 weight, tight letter-spacing */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: EASE }}
            className="font-sans font-black tracking-tighter-2 text-center leading-none"
            style={{
              fontSize: 'clamp(4.5rem, 9vw, 9rem)',
              color: '#d8d8d8',
              letterSpacing: '-0.04em',
            }}
            aria-label="Clubs and Societies"
          >
            Clubs &amp;{' '}
            <span className="font-display italic font-medium" style={{ color: '#ecdec1' }}>
              Societies
            </span>
          </motion.h1>

          {/* Subtitle — matches Trionn's small descriptor */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
            className="font-sans text-center mt-4"
            style={{
              fontSize: 'clamp(0.82rem, 1.1vw, 1rem)',
              color: 'rgba(216,216,216,0.52)',
              letterSpacing: '0.01em',
              maxWidth: 480,
            }}
          >
            Fifteen student-led clubs — from robotics labs at
            midnight to stages lit for a thousand.
          </motion.p>

          {/* Scroll nudge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            aria-hidden
            className="flex flex-col items-center gap-2 mt-10"
          >
            <span
              className="font-mono text-[0.5rem] tracking-[0.26em] uppercase"
              style={{ color: 'rgba(216,216,216,0.22)' }}
            >
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(216,216,216,0.2), transparent)' }}
            />
          </motion.div>
        </motion.div>

        {/* Bottom fade — black → ink so the directory section flows in */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-30 pointer-events-none"
          style={{
            height: 120,
            background: 'linear-gradient(to bottom, transparent 0%, #0c0c0e 100%)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Masters Union–style clubs directory ──────────────────────────────────────
// Layout:
//   Left panel (sticky sidebar, ~240px):
//     - Section heading
//     - Category tabs (All + each category)
//     - Vertical list of club names; active item highlighted with accent dot + bold
//   Right panel (scrollable horizontal strip):
//     - Each club = a tall card (~340px wide, ~420px tall on desktop)
//     - Card: full-bleed image top-half, name + category + description bottom-half
//     - Clicking a sidebar item smooth-scrolls the right panel to that club card
//     - Scrolling right panel updates active sidebar item

const ALL_FILTER_CATS: Array<ClubCategory | 'All'> = ['All', ...CLUB_CATEGORIES];

function ClubsDirectory() {
  const [activeFilter, setActiveFilter] = useState<ClubCategory | 'All'>('All');
  const [activeClubId, setActiveClubId] = useState<string>(CLUBS[0].id);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const filteredClubs =
    activeFilter === 'All' ? CLUBS : CLUBS.filter((c) => c.category === activeFilter);

  // Keep activeClubId valid when filter changes
  const handleFilterChange = useCallback((cat: ClubCategory | 'All') => {
    setActiveFilter(cat);
    const firstInCat = cat === 'All' ? CLUBS[0] : CLUBS.find((c) => c.category === cat);
    if (firstInCat) setActiveClubId(firstInCat.id);
  }, []);

  // Scroll right panel to the card for the given club id
  const scrollToClub = useCallback((id: string) => {
    const panel = panelRef.current;
    if (!panel) return;
    const card = panel.querySelector<HTMLElement>(`[data-club-id="${id}"]`);
    if (!card) return;
    const panelW = panel.offsetWidth;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    panel.scrollTo({ left: cardCenter - panelW / 2, behavior: 'smooth' });
  }, []);

  const handleSidebarClick = useCallback((id: string) => {
    setActiveClubId(id);
    scrollToClub(id);
  }, [scrollToClub]);

  // Mouse drag-to-scroll on the right panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onDown = (e: MouseEvent) => {
      dragging = true;
      moved = false;
      startX = e.pageX;
      startScroll = panel.scrollLeft;
      panel.style.cursor = 'grabbing';
      panel.style.userSelect = 'none';
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      panel.scrollLeft = startScroll - dx;
    };
    const onUp = () => {
      dragging = false;
      panel.style.cursor = 'grab';
      panel.style.userSelect = '';
    };
    // Suppress click on cards after a drag
    const onClickCapture = (e: MouseEvent) => {
      if (moved) { e.stopPropagation(); moved = false; }
    };

    panel.style.cursor = 'grab';
    panel.addEventListener('mousedown', onDown);
    panel.addEventListener('click', onClickCapture, true);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      panel.removeEventListener('mousedown', onDown);
      panel.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Update active sidebar item as user scrolls the right panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onScroll = () => {
      const cards = [...panel.querySelectorAll<HTMLElement>('[data-club-id]')];
      const panelCenter = panel.scrollLeft + panel.offsetWidth / 2;
      let closest: HTMLElement | null = null;
      let minDist = Infinity;
      for (const card of cards) {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - panelCenter);
        if (dist < minDist) { minDist = dist; closest = card; }
      }
      if (closest) {
        const id = closest.getAttribute('data-club-id');
        if (id) setActiveClubId(id);
      }
    };

    panel.addEventListener('scroll', onScroll, { passive: true });
    return () => panel.removeEventListener('scroll', onScroll);
  }, [filteredClubs]);

  // Scroll to first club whenever filter changes
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.scrollTo({ left: 0, behavior: 'instant' });
  }, [activeFilter]);

  const counts: Record<string, number> = { All: CLUBS.length };
  for (const c of CLUBS) counts[c.category] = (counts[c.category] ?? 0) + 1;

  return (
    <section
      id="directory"
      className="bg-ink"
      aria-labelledby={headingId}
    >
      {/* ── Section header ── */}
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1320px] mx-auto pt-20 md:pt-28 pb-10 md:pb-12">
        <Reveal preset="right" className="mb-3">
          <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-bold tracking-[0.26em] uppercase text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden />
            15 Clubs &amp; Societies
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            id={headingId}
            className="font-sans font-black tracking-tighter-2 leading-[1.04] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)' }}
          >
            Clubs &amp; Committees{' '}
            <span className="font-display italic font-medium text-warm">@MLRIT</span>
          </h2>
        </Reveal>

        {/* Category filter tabs — same pill style as MU's Undergraduate/Postgraduate */}
        <Reveal delay={0.1} className="mt-8">
          <div
            role="tablist"
            aria-label="Filter clubs by category"
            className="flex flex-wrap gap-2"
          >
            {ALL_FILTER_CATS.map((cat) => {
              const isActive = cat === activeFilter;
              const accent = cat === 'All' ? 'rgba(255,255,255,0.9)' : CATEGORY_ACCENT[cat as ClubCategory];
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleFilterChange(cat)}
                  className={[
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.76rem] font-sans font-bold tracking-tight transition-all duration-300',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isActive
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'border border-white/10 text-white/45 hover:border-white/25 hover:text-white/75',
                  ].join(' ')}
                >
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: accent }}
                      aria-hidden
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* ── Main: sidebar + horizontal panel — fixed height, no dead space below ── */}
      <div className="flex items-stretch w-full" style={{ height: 420 }}>

        {/* LEFT SIDEBAR — sticky, scrolls independently */}
        <div
          className="hidden md:flex flex-col flex-shrink-0"
          style={{
            width: 240,
            height: '100%',
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 'clamp(24px, 2.5vw, 64px)',
            overflowY: 'auto',
          }}
        >
          {/* "Clubs" label */}
          <span
            className="font-mono text-[0.58rem] font-bold tracking-[0.22em] uppercase mb-4 block"
            style={{ color: CATEGORY_ACCENT[activeFilter !== 'All' ? activeFilter as ClubCategory : 'Technical'] || '#01741f' }}
          >
            {activeFilter === 'All' ? 'All Clubs' : activeFilter}
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {filteredClubs.map((club) => {
                const isActive = club.id === activeClubId;
                return (
                  <button
                    key={club.id}
                    onClick={() => handleSidebarClick(club.id)}
                    className="w-full text-left flex items-center gap-2.5 py-2.5 border-b border-white/06 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary hover:border-white/12"
                    aria-pressed={isActive}
                  >
                    {/* Orange dot for active, hollow ring otherwise */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? '#e85d04' : 'transparent',
                        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.22)',
                        boxShadow: isActive ? '0 0 6px #e85d04aa' : 'none',
                      }}
                      aria-hidden
                    />
                    <span
                      className="font-sans text-[0.85rem] leading-snug transition-all duration-200"
                      style={{
                        color: isActive ? '#e85d04' : 'rgba(255,255,255,0.42)',
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {club.name}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL — horizontally scrollable club cards */}
        <div
          ref={panelRef}
          className="flex-1 flex gap-4 overflow-x-auto"
          style={{
            paddingLeft: 16,
            paddingRight: 32,
            paddingTop: 8,
            paddingBottom: 16,
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          aria-live="polite"
          aria-label={`${filteredClubs.length} clubs${activeFilter !== 'All' ? ` in ${activeFilter}` : ''}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                isActive={club.id === activeClubId}
                onClick={() => handleSidebarClick(club.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}

// ─── Club card (right-panel) ──────────────────────────────────────────────────

function ClubCard({
  club,
  isActive,
  onClick,
}: {
  club: Club;
  isActive: boolean;
  onClick: () => void;
}) {
  const accent = CATEGORY_ACCENT[club.category];

  return (
    <motion.article
      data-club-id={club.id}
      onClick={onClick}
      className="group relative flex-shrink-0 flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ width: 300, borderRadius: 12 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ scale: isActive ? 1 : 0.97, opacity: isActive ? 1 : 0.72 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: EASE }}
      whileHover={{ scale: 1, opacity: 1 }}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={club.name}
    >
      {/* Image — top 60% */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: 200, borderRadius: '12px 12px 0 0' }}
      >
        <Image
          src={club.image}
          alt={`${club.name}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          sizes="300px"
          quality={72}
          loading="lazy"
        />
        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[0.54rem] font-bold tracking-[0.14em] uppercase text-white"
            style={{ backgroundColor: accent + 'cc', backdropFilter: 'blur(8px)' }}
          >
            {club.category}
          </span>
        </div>
      </div>

      {/* Info — bottom portion */}
      <div
        className="flex flex-col flex-1 p-5"
        style={{
          backgroundColor: '#16161a',
          borderRadius: '0 0 12px 12px',
          borderTop: `2px solid ${accent}`,
        }}
      >
        <h3
          className="font-sans font-extrabold tracking-tight leading-snug text-white mb-2"
          style={{ fontSize: '1.02rem' }}
        >
          {club.name}
        </h3>
        <p className="text-white/50 text-[0.82rem] leading-relaxed line-clamp-3 flex-1">
          {club.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {club.members && (
            <span className="font-mono text-[0.56rem] font-bold tracking-[0.12em] uppercase text-white/30">
              {club.members} members
            </span>
          )}
          {club.facultyCoordinator && (
            <span className="font-mono text-[0.56rem] font-bold tracking-[0.12em] uppercase text-white/25 truncate">
              {club.facultyCoordinator}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Closing ──────────────────────────────────────────────────────────────────

function Closing() {
  return (
    <section className="bg-ink" aria-label="Join a club at MLRIT">
      {/* Hairline separator */}
      <div className="w-full" style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />

      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1320px] mx-auto py-28 md:py-44">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-14 lg:gap-20 items-end">
          <div>
            <Reveal preset="right" className="mb-4">
              <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-bold tracking-[0.26em] uppercase text-white/30">
                <span className="w-1.5 h-1.5 rounded-full bg-warm" aria-hidden />
                Your turn
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="font-sans font-black tracking-tighter-2 leading-[1.04] text-white"
                style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5.5rem)' }}
              >
                Find your people.{' '}
                <br className="hidden md:block" />
                <span className="font-display italic font-medium text-warm">
                  Build something that stays with you.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.16} className="mt-7">
              <p
                className="leading-relaxed max-w-[520px]"
                style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)', color: 'rgba(255,255,255,0.42)' }}
              >
                Walk into any club meeting. Bring your curiosity. The door is
                open — first year or final year, any branch, any background.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.22} className="flex-shrink-0">
            <Link
              href="/student-life"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border font-sans font-bold text-[0.9rem] text-white hover:bg-white/06 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              style={{ borderColor: 'rgba(255,255,255,0.14)' }}
            >
              Explore student life
              <ArrowUpRight className="w-4 h-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function ClubsPage() {
  return (
    <>
      <Hero />
      <ClubsDirectory />
      <Closing />
    </>
  );
}
