'use client';

import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';

// ─── Asset config ─────────────────────────────────────────────────────────────
const MEMORIES = [
  { src: '/images/clubs/apex/gallery/1.jpg', label: 'Genesis 2024',      caption: 'Game jam day two — builds flying.',        category: 'Gameathon',    rotation: -3,   oy: 8  },
  { src: '/images/clubs/apex/gallery/2.jpg', label: 'VCC · Round 1',     caption: 'The first campus Valorant clash.',          category: 'Tournament',   rotation: 2.5,  oy: -6 },
  { src: '/images/clubs/apex/gallery/3.jpg', label: 'Interdept Esports', caption: '180+ players. 17 departments.',             category: 'Championship', rotation: -1.5, oy: 10 },
  { src: '/images/clubs/apex/gallery/4.jpg', label: 'LAN Night',         caption: 'Side by side, every Friday.',               category: 'Community',    rotation: 3,    oy: -4 },
  { src: '/images/clubs/apex/gallery/5.jpg', label: 'Build Session',     caption: 'Unity and deadlines in equal measure.',     category: 'Game Dev',     rotation: -2,   oy: 6  },
  { src: '/images/clubs/apex/gallery/6.jpg', label: 'APEX · Founded',    caption: 'March 2024. The beginning.',                category: 'Origins',      rotation: 1.5,  oy: -10 },
] as const;

// ─── DNA Carousel constants ───────────────────────────────────────────────────
// Reference: horizontal fan, two prominent front cards, cards spread like
// physical cards on a table with rotateZ fan effect.
const CARD_W         = 220;
const CARD_H_RATIO   = 4 / 3; // portrait polaroid
const GAP            = 30;
const PERSPECTIVE    = 1200;

// Fan physics — drives the reference-accurate spread
const CURVE_Y        = 55;   // sine wave amplitude in Y (vertical arc)
const CURVE_Z        = 140;  // cosine Z depth
const ROT_Z          = 22;   // max rotateZ for outer cards
const ROT_Y          = 18;   // max rotateY
const SCALE_MIN      = 0.72;
const OPACITY_MIN    = 0.38;
const BLUR_MAX       = 6;    // px

const DRAG_SENS      = 1.4;
const VEL_CLAMP      = 2.8;
const MOMENTUM_DECAY = 0.92; // per frame at 60fps
const SNAP_THRESH    = 0.028;
const SNAP_STRENGTH  = 0.20;
const AUTO_INTERVAL  = 3800; // ms

function easeOut(t: number) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }

// Shortest path distance with wrapping
function shortDist(i: number, pos: number, count: number) {
  let d = i - pos;
  while (d >  count / 2) d -= count;
  while (d < -count / 2) d += count;
  return d;
}

// ─── Per-card 3D transform ────────────────────────────────────────────────────
// Reference: cards spread in a fan. The function maps distance from active
// to all transform properties. Phase drives the sine/cosine arc.
function cardTransform(dist: number) {
  const absDist = Math.abs(dist);
  const n       = Math.min(absDist / 2.5, 1); // normalized 0→1
  const phase   = dist * Math.PI * 0.52;

  const x       = dist * (CARD_W + GAP) * 0.76;
  const y       = Math.sin(phase) * CURVE_Y;
  const z       = Math.cos(phase) * CURVE_Z;
  const rotZ    = Math.sin(phase) * ROT_Z;  // fan spread
  const rotY    = Math.cos(phase) * ROT_Y;
  const active  = Math.max(0, 1 - absDist);
  const scale   = SCALE_MIN + (1 - SCALE_MIN) * easeOut(active);
  const opacity = OPACITY_MIN + (1 - OPACITY_MIN) * easeOut(active);
  const blurRaw = BLUR_MAX * n * (1 - easeOut(active));
  const blur    = blurRaw < 0.05 ? 0 : blurRaw;
  const zIndex  = Math.round(100 - absDist * 12);
  const shadow  = `0 ${10 + easeOut(active) * 14}px ${22 + easeOut(active) * 18}px rgba(0,0,0,0.45)`;

  return { x, y, z, rotZ, rotY, scale, opacity, blur, zIndex, shadow };
}

// ─── Polaroid card ────────────────────────────────────────────────────────────
function PolaroidCard({
  memory,
  dist,
  onClick,
  reduced,
}: {
  memory: typeof MEMORIES[number];
  dist: number;
  onClick: () => void;
  reduced: boolean | null;
}) {
  const t       = cardTransform(dist);
  const isActive = Math.abs(dist) < 0.5;
  const spring  = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 280, damping: 32, mass: 0.9 };

  return (
    <motion.div
      animate={{
        x:       t.x,
        y:       t.y + (isActive ? memory.oy * 0.45 : memory.oy * 0.12),
        z:       t.z,
        rotateY: t.rotY,
        rotateZ: t.rotZ + memory.rotation * 0.15,
        scale:   t.scale,
        opacity: t.opacity,
        filter:  `blur(${t.blur}px)`,
      }}
      transition={spring}
      style={{
        zIndex:           t.zIndex,
        position:         'absolute',
        transformStyle:   'preserve-3d',
        cursor:           isActive ? 'default' : 'pointer',
        transformOrigin:  'center bottom',
      }}
      onClick={!isActive ? onClick : undefined}
      role={isActive ? undefined : 'button'}
      tabIndex={isActive ? -1 : 0}
      aria-hidden={!isActive}
      onKeyDown={!isActive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {/* Polaroid frame — off-white physical card */}
      <div
        style={{
          width:        CARD_W,
          background:   '#f4efe6',
          padding:      '10px 10px 44px',
          borderRadius: 2,
          boxShadow:    t.shadow,
          userSelect:   'none',
        }}
      >
        {/* Photo area */}
        <div style={{ width: '100%', aspectRatio: String(CARD_W / (CARD_W * CARD_H_RATIO)), background: '#d4cbbf', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={memory.src}
            alt={memory.caption}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ aspectRatio: '3/4' }}
          />
          {/* Light leak overlay for physicality */}
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.06) 100%)' }} />
        </div>

        {/* Caption area */}
        <div className="mt-2 px-1">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9e886a', marginBottom: 3 }}>
            {memory.category}
          </div>
          <div style={{ fontFamily: 'var(--font-manrope)', fontSize: '0.74rem', fontWeight: 600, lineHeight: 1.35, color: '#2e2318' }}>
            {memory.caption}
          </div>
        </div>
      </div>

      {/* Handwritten label below active card */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position:   'absolute',
            bottom:     -30,
            left: 0, right: 0,
            textAlign:  'center',
            fontFamily: 'var(--font-playfair)',
            fontStyle:  'italic',
            fontSize:   '0.78rem',
            color:      'rgba(255,255,255,0.42)',
            pointerEvents: 'none',
          }}
        >
          {memory.label}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ApexMemoryLane() {
  const count       = MEMORIES.length;
  const reduced     = useReducedMotion();

  const posRef      = useRef(0);
  const velRef      = useRef(0);
  const rafRef      = useRef<number>(0);
  const lastTRef    = useRef<number>(0);
  const lastAutoRef = useRef<number>(0);
  const dragging    = useRef(false);
  const [displayPos, setDisplayPos] = useState(0);

  // Single always-running rAF loop — handles momentum, snap, and auto-advance
  const tick = useCallback((now: number) => {
    const dt = Math.min((now - lastTRef.current) / 1000, 0.05);
    lastTRef.current = now;

    if (!dragging.current) {
      // Auto-advance: every AUTO_INTERVAL ms when settled
      if (Math.abs(velRef.current) < SNAP_THRESH && now - lastAutoRef.current > AUTO_INTERVAL) {
        velRef.current   = 0.85;
        lastAutoRef.current = now;
      }

      velRef.current *= Math.pow(MOMENTUM_DECAY, dt * 60);

      if (Math.abs(velRef.current) < SNAP_THRESH) {
        const target = Math.round(posRef.current);
        const snapF  = 1 - Math.exp(-SNAP_STRENGTH * 60 * dt);
        posRef.current += (target - posRef.current) * snapF;
        if (Math.abs(posRef.current - target) < 0.001) {
          posRef.current = target;
          velRef.current = 0;
        }
      } else {
        posRef.current += velRef.current * dt;
      }

      posRef.current = ((posRef.current % count) + count) % count;
      setDisplayPos(posRef.current);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [count]);

  const startLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    lastTRef.current    = performance.now();
    lastAutoRef.current = performance.now();
    rafRef.current      = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    startLoop();
    return () => cancelAnimationFrame(rafRef.current);
  }, [startLoop]);

  const resetAuto = useCallback(() => {
    lastAutoRef.current = performance.now();
  }, []);

  // Drag
  const onDragStart = useCallback(() => {
    dragging.current = true;
    velRef.current   = 0;
  }, []);

  const onDrag = useCallback((_: unknown, info: PanInfo) => {
    const delta = -(info.delta.x / (CARD_W + GAP)) * DRAG_SENS;
    posRef.current = ((posRef.current + delta) % count + count) % count;
    setDisplayPos(posRef.current);
  }, [count]);

  const onDragEnd = useCallback((_: unknown, info: PanInfo) => {
    dragging.current = false;
    const rawVel = -(info.velocity.x / (CARD_W + GAP)) * DRAG_SENS;
    velRef.current = Math.max(-VEL_CLAMP, Math.min(VEL_CLAMP, rawVel));
    resetAuto();
  }, [resetAuto]);

  const go = useCallback((dir: 1 | -1) => {
    velRef.current = dir * 1.1;
    resetAuto();
  }, [resetAuto]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [go]);

  const activeIdx = Math.round(displayPos) % count;

  return (
    <section className="relative z-10 py-24 md:py-40 overflow-hidden" aria-label="Memory Lane">

      {/* Heading */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-20">
        <div className="flex items-center gap-3 mb-5">
          <span aria-hidden className="h-px w-6 bg-white/20" />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-white/35">Memory Lane</span>
        </div>
        <h2 className="font-sans font-black text-white leading-[1.05] mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}>
          Moments from APEX
        </h2>
        <p className="font-sans italic text-white/40" style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}>
          Every moment, a story.
        </p>
      </div>

      {/* Carousel stage — perspective applied here */}
      <div
        style={{ perspective: PERSPECTIVE, perspectiveOrigin: '50% 50%' }}
        aria-live="polite"
        aria-label={`Memory ${activeIdx + 1} of ${count}: ${MEMORIES[activeIdx].caption}`}
      >
        <motion.div
          drag="x"
          dragElastic={0}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ height: CARD_W * CARD_H_RATIO + 80, touchAction: 'pan-y' }}
        >
          {MEMORIES.map((memory, i) => {
            const dist = shortDist(i, displayPos, count);
            if (Math.abs(dist) > 3.5) return null;
            return (
              <PolaroidCard
                key={memory.label}
                memory={memory}
                dist={dist}
                reduced={!!reduced}
                onClick={() => {
                  const d = shortDist(i, displayPos, count);
                  velRef.current = d * 1.4;
                  resetAuto();
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-16 flex flex-col items-center gap-5">
        {/* Dots */}
        <div className="flex items-center gap-2" role="tablist">
          {MEMORIES.map((m, i) => {
            const isA = i === activeIdx;
            return (
              <button
                key={m.label}
                role="tab"
                aria-selected={isA}
                aria-label={m.label}
                onClick={() => {
                  const d = shortDist(i, displayPos, count);
                  velRef.current = d * 1.4;
                  resetAuto();
                }}
              >
                <motion.div
                  animate={{ width: isA ? 22 : 6, opacity: isA ? 1 : 0.28, backgroundColor: isA ? '#f7f2ea' : '#ffffff' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="h-[3px] rounded-full"
                />
              </button>
            );
          })}
        </div>

        {/* Arrows + counter */}
        <div className="flex items-center gap-3">
          <button onClick={() => go(-1)} aria-label="Previous memory"
            className="w-11 h-11 rounded-full border border-white/15 text-white/45 hover:text-white hover:border-white/35 grid place-items-center transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/25 w-16 text-center">
            {String(activeIdx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <button onClick={() => go(1)} aria-label="Next memory"
            className="w-11 h-11 rounded-full border border-white/15 text-white/45 hover:text-white hover:border-white/35 grid place-items-center transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </section>
  );
}
