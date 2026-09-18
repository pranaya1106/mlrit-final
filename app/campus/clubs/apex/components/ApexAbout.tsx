'use client';

import { useRef, useMemo, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';

const ABOUT_TEXT =
  'APEX MLRIT is a student-led esports and game development community. ' +
  'Established March 2024, it brings players, developers, designers and ' +
  'storytellers into one active gaming culture on the Dundigal campus. ' +
  'The club runs Valorant, BGMI, FIFA and multi-title events — bootcamps, ' +
  'casting, production and content collabs. Members ship real mobile, PC and ' +
  'VR games on Unity, Unreal Engine and Godot. Others film, cast or run the ' +
  'media desk for the tournament next week. ' +
  'We build teams, scrim regularly and climb leaderboards. ' +
  'Inclusive, respectful and hype — we celebrate wins, share highlights and make friends for life.';

const FACTS = [
  ['Established', 'March 2024'],
  ['Location',    'MLRIT · Dundigal'],
  ['Titles',      'Valorant · BGMI · FIFA'],
  ['Engines',     'Unity · Unreal · Godot'],
] as const;

const APEX_RED = '#D80000';

const DIM_COLOR  = 'rgba(255,255,255,0.18)';
const FULL_COLOR = 'rgba(255,255,255,1.00)';

const REVEAL_START = 0.04;
const REVEAL_END   = 0.92;
const SPAN         = REVEAL_END - REVEAL_START;
const WINDOW       = 0.018; // narrow front = sharp reveal

export default function ApexAbout() {
  const sectionRef  = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced      = !!useReducedMotion();

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  });

  // Spring-smooth to match HowItWorks feel
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.4 });

  // Build per-char metadata once (index → threshold pair)
  const chars = useMemo(() => {
    const result: { char: string; start: number; end: number; isSpace: boolean }[] = [];
    const words = ABOUT_TEXT.split(' ');
    let charIdx = 0;
    const totalChars = ABOUT_TEXT.replace(/ /g, '').length;

    words.forEach((word, wi) => {
      Array.from(word).forEach((ch) => {
        const t     = charIdx / (totalChars - 1);
        const start = REVEAL_START + t * (SPAN - WINDOW);
        result.push({ char: ch, start, end: start + WINDOW, isSpace: false });
        charIdx++;
      });
      // space between words (not counted in totalChars)
      if (wi < words.length - 1) {
        result.push({ char: ' ', start: 0, end: 0, isSpace: true });
      }
    });
    return result;
  }, []);

  // Refs to all char spans for direct DOM mutation — zero React re-renders on scroll
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // On first render, initialise colours
  useEffect(() => {
    spanRefs.current.forEach((el) => {
      if (el) el.style.color = reduced ? FULL_COLOR : DIM_COLOR;
    });
  }, [reduced]);

  // Single motion-value event drives ALL DOM colour writes — no React involved
  useMotionValueEvent(smooth, 'change', (progress) => {
    if (reduced) return;
    spanRefs.current.forEach((el, i) => {
      if (!el) return;
      const { start, end, isSpace } = chars[i];
      if (isSpace) return;
      const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
      // Linear interpolate opacity component only (much cheaper than full rgba parse)
      const alpha = 0.18 + t * (1 - 0.18);
      el.style.color = `rgba(255,255,255,${alpha.toFixed(3)})`;
    });
  });

  // Header + facts use lightweight motion values (only 2 elements)
  const headerOpacity = useMemo(() => smooth, [smooth]); // proxy — we'll use range in style
  const factsRef      = useRef<HTMLDivElement>(null);

  useMotionValueEvent(smooth, 'change', (progress) => {
    // Header — fade in 0→0.04
    const headerEl = containerRef.current?.querySelector<HTMLElement>('.apex-about-header');
    if (headerEl) {
      const o = Math.min(1, progress / 0.04);
      const y = 12 - o * 12;
      headerEl.style.opacity   = String(o);
      headerEl.style.transform = `translateY(${y}px)`;
    }
    // Facts — fade in 0.82→0.93
    const factsEl = factsRef.current;
    if (factsEl) {
      const o = Math.max(0, Math.min(1, (progress - 0.82) / 0.11));
      const y = 16 - o * 16;
      factsEl.style.opacity   = String(o);
      factsEl.style.transform = `translateY(${y}px)`;
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: '220vh' }}
      aria-label="What is APEX?"
    >
      <div
        ref={containerRef}
        className="sticky top-0 flex items-center justify-center min-h-screen overflow-hidden px-6 py-20"
      >
        <div className="max-w-[860px] w-full mx-auto">

          {/* Eyebrow — direct DOM, no Framer wrapper needed */}
          <div
            className="apex-about-header flex items-center gap-3 mb-8"
            style={{ opacity: 0, transform: 'translateY(12px)', willChange: 'opacity, transform' }}
          >
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              What is APEX?
            </span>
          </div>

          {/* Text reveal — plain spans, colours written via ref, zero re-renders */}
          <p
            className="font-sans font-bold leading-[1.6]"
            style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.85rem)' }}
            aria-label={ABOUT_TEXT}
          >
            {chars.map((c, i) => (
              c.isSpace
                ? <span key={i}>&nbsp;</span>
                : (
                  <span
                    key={i}
                    ref={el => { spanRefs.current[i] = el; }}
                    aria-hidden="true"
                    style={{ color: DIM_COLOR, willChange: 'color' }}
                  >
                    {c.char}
                  </span>
                )
            ))}
          </p>

          {/* Facts grid */}
          <div
            ref={factsRef}
            className="mt-12 border-t border-white/10 pt-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8"
            style={{ opacity: 0, transform: 'translateY(16px)', willChange: 'opacity, transform' }}
          >
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/30">{k}</div>
                <div className="mt-1.5 text-white/80 text-[0.9rem] leading-snug">{v}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
