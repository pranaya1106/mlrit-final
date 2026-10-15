'use client';

/**
 * CIE — Vision & Mission as a scroll-driven manifesto.
 *
 * Each statement illuminates word-by-word as it travels up the viewport
 * (an Apple/Stripe-style reading reveal), a left accent line draws in with the
 * section's scroll, giant ghost numerals drift on parallax, and a slow conic
 * glow rotates behind it all. Quiet and fully legible under reduced-motion.
 *
 * Progress is driven by a per-frame getBoundingClientRect read rather than
 * framer's useScroll, because this page uses Lenis smooth-scroll, which does
 * not reliably emit the native scroll events useScroll listens for.
 */

import { useEffect, useRef, type RefObject } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

const DATA = [
  { n: '01', label: 'Vision', body: 'Create a student culture where innovation is not limited to competitions or special occasions.' },
  { n: '02', label: 'Mission', body: 'Make learning more practical, collaborative and student-driven.' },
];

/**
 * Progress 0 → 1 as the element's top edge travels from `startFrac` of the
 * viewport height down to `endFrac`. Updated every frame, Lenis-proof.
 */
function useTopProgress(ref: RefObject<HTMLElement | null>, startFrac: number, endFrac: number) {
  const progress = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let active = false;
    const tick = () => {
      if (!active) return;
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const vh = window.innerHeight;
      const start = vh * startFrac;
      const end = vh * endFrac;
      const top = el.getBoundingClientRect().top;
      const p = (start - top) / (start - end);
      progress.set(Math.max(0, Math.min(1, p)));
    };
    const run = () => {
      if (active) return;
      active = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(raf);
    };
    // Only animate while the section is near the viewport — a parked section
    // must not keep reading layout every frame.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? run() : stop()),
      { rootMargin: '300px 0px 300px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, startFrac, endFrac, progress]);
  return progress;
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, ['0.14em', '0em']);
  return (
    <span className="inline-block whitespace-nowrap mr-[0.26em]">
      <motion.span style={{ opacity, y }} className="inline-block">
        {word}
      </motion.span>
    </span>
  );
}

function Statement({ n, label, body, reduced }: { n: string; label: string; body: string; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useTopProgress(ref, 0.82, 0.3);
  const numY = useTransform(progress, [0, 1], [48, -48]);
  const numOpacity = useTransform(progress, [0, 0.5, 1], [0.03, 0.09, 0.05]);
  const words = body.split(' ');

  return (
    <div ref={ref} className="relative py-12 md:py-20">
      {/* Giant ghost numeral — parallax */}
      <motion.span
        aria-hidden
        style={reduced ? { opacity: 0.05 } : { y: numY, opacity: numOpacity }}
        className="pointer-events-none absolute -top-6 right-0 md:right-6 font-sans font-black text-white leading-[0.8] tracking-tighter-3 text-[clamp(7rem,16vw,16rem)] select-none"
      >
        {n}
      </motion.span>

      {/* Label */}
      <div className="relative z-[1] flex items-center gap-3 mb-5 md:mb-7">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 8px rgba(232,93,4,0.7)' }} />
        <span className="font-mono text-[0.66rem] font-bold tracking-[0.3em] uppercase text-primary">{label}</span>
      </div>

      {/* Scroll-revealed statement */}
      <p className="relative z-[1] font-sans font-black tracking-tighter-2 leading-[1.1] text-white text-[clamp(1.7rem,3.8vw,3.4rem)] max-w-[22ch]">
        {reduced
          ? body
          : words.map((w, i) => (
              <Word key={i} word={w} range={[i / words.length, (i + 1) / words.length]} progress={progress} />
            ))}
      </p>
    </div>
  );
}

export default function CieVision() {
  const reduced = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const lineScale = useTopProgress(sectionRef, 0.85, 0.15);

  return (
    <section id="vision" ref={sectionRef} className="relative bg-black py-24 md:py-40 overflow-hidden border-t border-white/[0.08]">
      {/* Ambient rotating glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="cie-vision-glow" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-12 md:mb-16">
          <span aria-hidden className="h-px w-10 bg-primary" />
          <span className="font-mono text-[0.72rem] font-bold tracking-[0.34em] uppercase text-primary">Vision &amp; Mission</span>
        </div>

        {/* Statements with a drawing accent line */}
        <div className="relative pl-6 md:pl-12">
          <motion.span
            aria-hidden
            style={reduced ? { scaleY: 1 } : { scaleY: lineScale }}
            className="absolute left-0 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-primary via-primary/40 to-transparent"
          />

          {DATA.map((d) => (
            <Statement key={d.n} n={d.n} label={d.label} body={d.body} reduced={reduced} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .cie-vision-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 95vw;
          height: 95vw;
          max-width: 1100px;
          max-height: 1100px;
          transform: translate(-50%, -50%);
          background: conic-gradient(
            from 0deg,
            rgba(232, 93, 4, 0) 0%,
            rgba(232, 93, 4, 0.14) 18%,
            rgba(232, 93, 4, 0) 40%,
            rgba(255, 150, 60, 0.1) 62%,
            rgba(232, 93, 4, 0) 85%,
            rgba(232, 93, 4, 0) 100%
          );
          filter: blur(80px);
          border-radius: 9999px;
          opacity: 0.6;
          animation: cie-vision-spin 30s linear infinite;
        }
        @keyframes cie-vision-spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cie-vision-glow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
