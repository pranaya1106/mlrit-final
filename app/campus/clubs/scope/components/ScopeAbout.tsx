'use client';

import { useRef, useMemo, useEffect } from 'react';
import {
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';

const SCOPE_CYAN = '#00C2FF';

const ABOUT_TEXT =
  'SCOPE Club is a student-led technical community at MLR Institute of ' +
  'Technology, built around coding, curiosity, problem-solving, and learning ' +
  'by doing. It goes beyond classroom learning — connecting students with ' +
  'peers and mentors across AI, open source, web & app development, game ' +
  'development, and other emerging technologies, and giving them an ' +
  'official platform for guidance, networking, and growth beyond campus ' +
  'boundaries.';

const FACTS = [
  ['Members', '56+'],
  ['Location', 'MLRIT · Dundigal'],
  ['Focus', 'AI · Web · Open Source'],
  ['Built', 'CodeStats Platform'],
] as const;

const DIM  = 'rgba(255,255,255,0.18)';
const FULL = 'rgba(255,255,255,1.00)';

const REVEAL_START = 0.04;
const REVEAL_END   = 0.92;
const SPAN         = REVEAL_END - REVEAL_START;
const WINDOW       = 0.018;

export default function ScopeAbout() {
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const factsRef     = useRef<HTMLDivElement>(null);
  const reduced      = !!useReducedMotion();

  // Per-character metadata: index in the flat string → scroll thresholds
  // Spaces are included as plain chars so natural text flow is preserved
  const chars = useMemo(() => {
    const totalNonSpace = ABOUT_TEXT.replace(/ /g, '').length;
    let nonSpaceIdx = 0;
    return Array.from(ABOUT_TEXT).map((ch) => {
      if (ch === ' ') return { ch, start: 0, end: 0, isSpace: true };
      const t     = nonSpaceIdx / (totalNonSpace - 1);
      const start = REVEAL_START + t * (SPAN - WINDOW);
      nonSpaceIdx++;
      return { ch, start, end: start + WINDOW, isSpace: false };
    });
  }, []);

  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  });
  // Near-critically damped — tracks scroll closely instead of trailing/crawling to catch up.
  const smooth = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });

  // Initialise
  useEffect(() => {
    spanRefs.current.forEach((el) => {
      if (el) el.style.color = reduced ? FULL : DIM;
    });
  }, [reduced]);

  // Single listener — direct DOM writes, zero React re-renders per frame
  useMotionValueEvent(smooth, 'change', (progress) => {
    // Eyebrow header
    const hdr = containerRef.current?.querySelector<HTMLElement>('.scope-about-hdr');
    if (hdr) {
      const o = Math.min(1, progress / 0.04);
      hdr.style.opacity   = String(o);
      hdr.style.transform = `translateY(${12 - o * 12}px)`;
    }

    // Char colour reveal
    if (!reduced) {
      spanRefs.current.forEach((el, i) => {
        if (!el) return;
        const { start, end, isSpace } = chars[i];
        if (isSpace) return;
        const t     = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        const alpha = 0.18 + t * 0.82;
        el.style.color = `rgba(255,255,255,${alpha.toFixed(3)})`;
      });
    }

    // Facts
    const f = factsRef.current;
    if (f) {
      const o = Math.max(0, Math.min(1, (progress - 0.82) / 0.11));
      f.style.opacity   = String(o);
      f.style.transform = `translateY(${16 - o * 16}px)`;
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: '220vh' }}
      aria-label="What is SCOPE?"
    >
      <div
        ref={containerRef}
        className="sticky top-0 flex items-center justify-center min-h-screen overflow-hidden px-6 py-20"
      >
        <div className="max-w-[860px] w-full mx-auto">

          {/* Eyebrow */}
          <div
            className="scope-about-hdr flex items-center gap-3 mb-8"
            style={{ opacity: 0, transform: 'translateY(12px)', willChange: 'opacity, transform' }}
          >
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: SCOPE_CYAN }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: SCOPE_CYAN }}>
              What is SCOPE?
            </span>
          </div>

          {/* Paragraph — renders as a single flowing block of text.
              Each character is a plain inline <span>; spaces are literal text nodes.
              The browser wraps the line naturally, identical to a normal paragraph. */}
          <p
            className="font-sans font-semibold leading-[1.75]"
            style={{ fontSize: 'clamp(1.05rem, 2vw, 1.5rem)' }}
            aria-label={ABOUT_TEXT}
          >
            {chars.map((c, i) =>
              c.isSpace ? (
                // Plain text space — preserves word spacing and natural wrapping
                <span key={i} aria-hidden="true"> </span>
              ) : (
                <span
                  key={i}
                  ref={el => { spanRefs.current[i] = el; }}
                  aria-hidden="true"
                  style={{ color: reduced ? FULL : DIM, willChange: 'color' }}
                >
                  {c.ch}
                </span>
              )
            )}
          </p>

          {/* Facts grid */}
          <div
            ref={factsRef}
            className="mt-14 border-t border-white/10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8"
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
