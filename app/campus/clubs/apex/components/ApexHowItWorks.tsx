'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

const APEX_RED = '#D80000';

const DOMAINS = [
  { n: '01', title: 'Game Development',         sub: 'Unity · Unreal · Godot',               body: 'Real games on real engines — mobile, PC and VR. Members ship playable projects every semester, guided by peers who have shipped before.' },
  { n: '02', title: 'E-Sports',                 sub: 'Valorant · BGMI · FIFA · Multi-title',  body: 'Competitive gaming from the ground up — team formation, scrims, coaching, casting, and the community that makes every match worth playing.' },
  { n: '03', title: 'UI/UX & Game Design',      sub: 'Interface · Feedback · Game Feel',      body: "The design work that makes a build worth playing — interfaces, feedback loops, visual language and the invisible craft players feel but can't name." },
  { n: '04', title: 'Storytelling & Narrative', sub: 'World-building · Characters · Writing', body: 'Worlds and characters that give every mechanic a reason to exist. Writing workshops, narrative design and the craft of making players care.' },
  { n: '05', title: 'Emerging Tech',            sub: 'AR/VR · Procedural · New Engines',      body: 'The frontier — AR/VR, procedural generation and experimental engines where the next genre is being invented right now.' },
] as const;

const COUNT  = DOMAINS.length;
const ROW_H  = 68; // px
const SPEED  = 0.42; // items per second

function gaussian(dist: number, sigma = 1.6) {
  return Math.exp(-0.5 * Math.pow(dist / sigma, 2));
}

export default function ApexHowItWorks({
  sectionRef: externalRef,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef  = (externalRef ?? internalRef) as React.RefObject<HTMLElement>;
  const reduced     = !!useReducedMotion();

  const [activeFloat, setActiveFloat] = useState(0);
  const floatRef = useRef(0);
  const rafRef   = useRef<number>(0);
  const lastRef  = useRef<number>(0);

  const tick = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    if (!reduced) {
      floatRef.current = (floatRef.current + SPEED * dt + COUNT) % COUNT;
      setActiveFloat(floatRef.current);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [reduced]);

  useEffect(() => {
    const onVis = () => { if (!document.hidden) lastRef.current = performance.now(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    lastRef.current = performance.now();
    rafRef.current  = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const activeIdx = Math.round(activeFloat) % COUNT;

  function getDist(i: number) {
    let d = i - activeFloat;
    while (d >  COUNT / 2) d -= COUNT;
    while (d < -COUNT / 2) d += COUNT;
    return d;
  }

  // render furthest items first (behind), closest last (on top)
  const sorted = [...DOMAINS.keys()].sort((a, b) => Math.abs(getDist(b)) - Math.abs(getDist(a)));

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-screen flex items-center"
      aria-label="How the club works"
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-20 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

        {/* Left — kinetic wheel */}
        <div className="flex-1 w-full min-w-0">
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

          {/* Wheel container — overflow-y hidden to clip top/bottom, overflow-x visible so titles don't get cut */}
          <div
            className="relative"
            style={{ height: ROW_H * 5.5, overflowY: 'hidden', overflowX: 'clip' }}
            aria-live="polite"
            aria-label={`Active domain: ${DOMAINS[activeIdx].title}`}
          >
            {/* Top + bottom fade masks */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to bottom, #080808 30%, transparent)' }} />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to top, #080808 30%, transparent)' }} />

            {sorted.map(i => {
              const dist    = getDist(i);
              const g       = gaussian(dist);
              const fontSize = 1.1 + g * (3.6 - 1.1);
              const opacity  = 0.15 + g * 0.85;
              const x        = g * 40;
              const colorVal = Math.round(50 + g * 205);
              const color    = `rgb(${colorVal},${colorVal},${colorVal})`;
              const isActive = Math.abs(dist) < 0.5;

              return (
                <div
                  key={DOMAINS[i].n}
                  style={{
                    position:   'absolute',
                    top:        '50%',
                    left:       0,
                    right:      0,
                    transform:  `translateY(calc(-50% + ${dist * ROW_H}px))`,
                    transition: reduced ? 'none' : 'transform 0.1s linear',
                  }}
                >
                  <motion.div
                    animate={{ x, opacity }}
                    transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                    className="flex items-baseline gap-3 select-none pr-4"
                  >
                    <motion.span
                      animate={{ color: isActive ? APEX_RED : 'rgba(255,255,255,0.22)' }}
                      transition={{ duration: 0.2 }}
                      className="font-sans font-black tabular-nums flex-shrink-0"
                      style={{ fontSize: `${Math.max(0.7, fontSize * 0.38)}rem`, lineHeight: 1 }}
                    >
                      {DOMAINS[i].n}
                    </motion.span>
                    <motion.span
                      animate={{ color, fontSize: `${fontSize}rem` }}
                      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                      className="font-sans font-black leading-none"
                      style={{ lineHeight: 1, whiteSpace: 'nowrap' }}
                    >
                      {DOMAINS[i].title}
                    </motion.span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — description */}
        <div className="lg:w-[320px] flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/55 leading-[1.78] text-[0.97rem] md:text-[1.02rem]"
            >
              {DOMAINS[activeIdx].body}
            </motion.p>
          </AnimatePresence>

          <div className="mt-5 font-mono text-[0.58rem] font-bold tracking-[0.22em] uppercase text-white/20">
            {DOMAINS[activeIdx].sub}
          </div>

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
