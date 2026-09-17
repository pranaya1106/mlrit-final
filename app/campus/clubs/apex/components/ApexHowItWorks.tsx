'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

const APEX_RED = '#D80000';

// ─── APEX verticals ───────────────────────────────────────────────────────────
const DOMAINS = [
  { n: '01', title: 'Game Development',         sub: 'Unity · Unreal · Godot',               body: 'Real games on real engines — mobile, PC and VR. Members ship playable projects every semester, guided by peers who have shipped before.' },
  { n: '02', title: 'E-Sports',                 sub: 'Valorant · BGMI · FIFA · Multi-title',  body: 'Competitive gaming from the ground up — team formation, scrims, coaching, casting, and the community that makes every match worth playing.' },
  { n: '03', title: 'UI/UX & Game Design',      sub: 'Interface · Feedback · Game Feel',      body: "The design work that makes a build worth playing — interfaces, feedback loops, visual language and the invisible craft players feel but can't name." },
  { n: '04', title: 'Storytelling & Narrative', sub: 'World-building · Characters · Writing', body: 'Worlds and characters that give every mechanic a reason to exist. Writing workshops, narrative design and the craft of making players care.' },
  { n: '05', title: 'Emerging Tech',            sub: 'AR/VR · Procedural · New Engines',      body: 'The frontier — AR/VR, procedural generation and experimental engines where the next genre is being invented right now.' },
] as const;

const COUNT = DOMAINS.length;

// ─── Kinetic Text Slider mechanics ───────────────────────────────────────────
// Reference: vertical list, active item = largest + most x-indented (rightmost).
// Items above/below shrink and lose x-indent — Gaussian bell on size & x.
// The list auto-cycles upward. Spring-powered position transitions.

// Gaussian bell — peak 1 at dist=0, approaches 0 as |dist| grows
function gaussian(dist: number, sigma = 1.8) {
  return Math.exp(-0.5 * Math.pow(dist / sigma, 2));
}

// Per-item style derived from distance to active
function itemStyle(dist: number) {
  const g         = gaussian(dist);
  // Font size: 1rem (far) → clamp(2rem, 4vw, 4rem) (active)
  const minSize   = 1.05;
  const maxSize   = 3.8;
  const fontSize  = minSize + g * (maxSize - minSize); // rem
  // x-indent: 0 (far) → 48px (active) — matches reference's rightward shift
  const x         = g * 48;
  // Opacity: 0.18 (far) → 1 (active)
  const opacity   = 0.18 + g * 0.82;
  // Color: dim → white
  const colorVal  = Math.round(40 + g * 215);
  const color     = `rgb(${colorVal},${colorVal},${colorVal})`;
  return { fontSize, x, opacity, color };
}

const ROW_H = 72; // px — vertical spacing between items in the wheel

// ─── Single row item ──────────────────────────────────────────────────────────
function DomainRow({
  domain,
  dist,
  isActive,
}: {
  domain: typeof DOMAINS[number];
  dist: number;
  isActive: boolean;
}) {
  const s = itemStyle(dist);

  return (
    <motion.div
      animate={{
        x:       s.x,
        opacity: s.opacity,
      }}
      transition={{ type: 'spring', stiffness: 160, damping: 22, mass: 1 }}
      className="flex items-baseline gap-3 select-none"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Number — red when active */}
      <motion.span
        animate={{ color: isActive ? APEX_RED : 'rgba(255,255,255,0.25)' }}
        transition={{ duration: 0.25 }}
        className="font-sans font-black tabular-nums flex-shrink-0"
        style={{ fontSize: `${Math.max(0.75, s.fontSize * 0.42)}rem`, lineHeight: 1 }}
      >
        {domain.n}
      </motion.span>

      {/* Title — size and color driven by dist */}
      <motion.span
        animate={{ color: s.color, fontSize: `${s.fontSize}rem` }}
        transition={{ type: 'spring', stiffness: 160, damping: 22, mass: 1 }}
        className="font-sans font-black leading-none whitespace-nowrap"
        style={{ lineHeight: 1 }}
      >
        {domain.title}
      </motion.span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ApexHowItWorks({
  sectionRef: externalRef,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef  = (externalRef ?? internalRef) as React.RefObject<HTMLElement>;
  const reduced     = !!useReducedMotion();

  // Floating-point active index — drives all item positions
  const [activeFloat, setActiveFloat] = useState(0);
  const floatRef = useRef(0);
  const rafRef   = useRef<number>(0);
  const lastRef  = useRef<number>(0);

  // Auto-cycle: advances ~0.6 items per second
  const SPEED = 0.55; // items per second

  const tick = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    if (!reduced) {
      floatRef.current = (floatRef.current + SPEED * dt + COUNT) % COUNT;
      setActiveFloat(floatRef.current);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [reduced]);

  // Visibility-aware: pause when tab is hidden to avoid drift
  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) lastRef.current = performance.now();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    lastRef.current = performance.now();
    rafRef.current  = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // Active index (snapped) for body copy
  const activeIdx = Math.round(activeFloat) % COUNT;

  // Compute dist for each item (shortest path wrapping)
  function getDist(i: number) {
    let d = i - activeFloat;
    while (d >  COUNT / 2) d -= COUNT;
    while (d < -COUNT / 2) d += COUNT;
    return d;
  }

  // Sort items by |dist| descending so closest renders on top
  const sorted = [...DOMAINS.keys()].sort((a, b) => Math.abs(getDist(b)) - Math.abs(getDist(a)));

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-screen flex items-center"
      aria-label="How the club works"
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-20 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

        {/* Left — Kinetic Text Wheel */}
        <div className="flex-1 w-full">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              How it works
            </span>
          </div>
          <h2
            className="font-sans font-black text-white leading-[1.02] mb-10"
            style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}
          >
            Five domains. One community.
          </h2>

          {/* The kinetic wheel — fixed height, items absolutely positioned */}
          <div
            className="relative overflow-hidden"
            style={{ height: ROW_H * 5.5 }}
            aria-live="polite"
            aria-label={`Active domain: ${DOMAINS[activeIdx].title}`}
          >
            {/* Center highlight line */}
            <div
              aria-hidden
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top:          ROW_H * 5.5 / 2 - ROW_H / 2,
                height:       ROW_H,
                borderTop:    `1px solid rgba(255,255,255,0.06)`,
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
              }}
            />

            {/* Items — each absolutely centered, translated by dist */}
            {sorted.map(i => {
              const dist = getDist(i);
              return (
                <div
                  key={DOMAINS[i].n}
                  style={{
                    position:  'absolute',
                    top:       '50%',
                    left:      0,
                    right:     0,
                    transform: `translateY(calc(-50% + ${dist * ROW_H}px))`,
                    transition: reduced ? 'none' : 'transform 0.08s linear',
                  }}
                >
                  <DomainRow
                    domain={DOMAINS[i]}
                    dist={dist}
                    isActive={Math.abs(dist) < 0.5}
                  />
                </div>
              );
            })}

            {/* Fade masks top/bottom */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
          </div>
        </div>

        {/* Right — Body copy + progress dots */}
        <div className="lg:w-[340px] flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/55 leading-[1.78] text-[1rem] md:text-[1.04rem]"
            >
              {DOMAINS[activeIdx].body}
            </motion.p>
          </AnimatePresence>

          <div className="mt-6 font-mono text-[0.58rem] font-bold tracking-[0.22em] uppercase text-white/20">
            {DOMAINS[activeIdx].sub}
          </div>

          {/* Progress dots */}
          <div className="mt-8 flex items-center gap-1.5">
            {DOMAINS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width:           i === activeIdx ? 20 : 5,
                  opacity:         i === activeIdx ? 1 : 0.25,
                  backgroundColor: i === activeIdx ? APEX_RED : '#ffffff',
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="h-[3px] rounded-full"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
