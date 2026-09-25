'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';

const CAME_ORANGE = '#F5760A';

const DOMAINS = [
  { n: '01', title: 'Cultural Performances',    sub: 'Dance · Music · Drama',        body: 'Dance, music, drama, and skits addressing patriotism, social responsibility, cultural heritage, and student life — performed before large institutional audiences.' },
  { n: '02', title: 'Event Coordination',       sub: 'Ceremonies · Programmes',      body: 'Active contribution to Graduation Day, Orientation Day, Independence Day, Republic Day, and Annual Day — supporting smooth conduct of ceremonies and cultural segments.' },
  { n: '03', title: 'Cultural Celebrations',    sub: 'Festivals · Traditions',       body: "Navrat Naveli (Bathukamma, Garba, traditional performances), Kite Fest, Traditional Day, and other festive programmes celebrating India's diverse cultural traditions." },
  { n: '04', title: 'Hellenic & Ecstacy',       sub: 'Signature Events',             body: 'High-energy campus events featuring student performances, skits, stand-up, live music, and invited artists — including the Ecstacy concert night and the themed Hellenic programme.' },
];

const COLORS = ['#DC2626', '#F5760A', '#F59E0B', '#FBBF24'];

// Spring config for smooth scroll following — near-critically damped so it
// tracks scroll closely instead of trailing behind and crawling to catch up.
const SPRING = { stiffness: 300, damping: 30, restDelta: 0.0001 };

function clamp(v: number) { return Math.max(0, Math.min(1, v)); }

// Ensure input array has strictly increasing values (required by Framer)
function strictRange(values: number[]): number[] {
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) {
    out.push(Math.max(out[i - 1] + 0.0001, values[i]));
  }
  return out;
}

function getRange(i: number, total: number) {
  const center = i / (total - 1);
  const band   = 0.38 / total;
  return {
    lo2: clamp(center - band * 2.2),
    lo:  clamp(center - band),
    mid: clamp(center),
    hi:  clamp(center + band),
    hi2: clamp(center + band * 2.2),
  };
}

// ── Per-item row ──────────────────────────────────────────────────────────────
// opacity + scale only — no x translate, no color (those need main-thread restyle)
// We drive everything off the spring-smoothed progress so motion is silky
function DomainRow({ domain, index, total, smooth }: {
  domain: typeof DOMAINS[number];
  index: number;
  total: number;
  smooth: MotionValue<number>;
}) {
  const r = getRange(index, total);

  const opacityInput = strictRange([r.lo2, r.lo, r.mid, r.hi, r.hi2]);
  const opacity  = useTransform(smooth, opacityInput, [0.08, 0.22, 1, 0.22, 0.08]);
  const scale    = useTransform(smooth, strictRange([r.lo, r.mid, r.hi]), [0.96, 1.0, 0.96]);

  return (
    <li className="flex items-baseline gap-4 py-2.5 select-none" style={{ willChange: 'opacity, transform' }}>
      <motion.div
        style={{ opacity, scale, transformOrigin: 'left center' }}
        className="flex items-baseline gap-4 w-full"
      >
        <span
          className="font-mono font-black tabular-nums flex-shrink-0"
          style={{ fontSize: 'clamp(0.6rem, 1vw, 0.82rem)', color: COLORS[index], opacity: 0.55, letterSpacing: '0.12em' }}
        >
          {domain.n}
        </span>
        <span className="flex flex-col gap-0.5">
          <span
            className="font-sans font-black leading-none text-white"
            style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08 }}
          >
            {domain.title}
          </span>
          <span
            className="font-mono font-medium uppercase"
            style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.65rem)', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)' }}
          >
            {domain.sub}
          </span>
        </span>
      </motion.div>
    </li>
  );
}

// ── Per-item description ──────────────────────────────────────────────────────
function DomainDesc({ domain, index, total, smooth }: {
  domain: typeof DOMAINS[number];
  index: number;
  total: number;
  smooth: MotionValue<number>;
}) {
  const r       = getRange(index, total);
  const opacity = useTransform(smooth, strictRange([r.lo, r.mid, r.hi]), [0, 1, 0]);
  const y       = useTransform(smooth, strictRange([r.lo, r.mid, r.hi]), [18, 0, -18]);

  return (
    <motion.div
      style={{ opacity, y, willChange: 'opacity, transform' }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p className="text-white/55 leading-[1.75] text-[0.95rem] md:text-[1rem]">{domain.body}</p>
      <div className="mt-4 font-mono text-[0.56rem] font-bold tracking-[0.22em] uppercase text-white/18">{domain.sub}</div>
      <div className="mt-5 h-px w-10" style={{ backgroundColor: COLORS[index], opacity: 0.65 }} />
    </motion.div>
  );
}

// ── Per-item dot ──────────────────────────────────────────────────────────────
function DomainDot({ index, total, smooth }: {
  index: number;
  total: number;
  smooth: MotionValue<number>;
}) {
  const r       = getRange(index, total);
  const opacity = useTransform(smooth, strictRange([r.lo, r.mid, r.hi]), [0.15, 1, 0.15]);
  const scaleY  = useTransform(smooth, strictRange([r.lo, r.mid, r.hi]), [1, 2.8, 1]);

  return (
    <motion.div
      style={{ opacity, scaleY, backgroundColor: COLORS[index], willChange: 'opacity, transform' }}
      className="w-[3px] h-3 rounded-full origin-center"
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CameHowItWorks({
  sectionRef: externalRef,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef  = useRef<HTMLElement>(null);
  const sectionRef   = (externalRef ?? internalRef) as React.RefObject<HTMLElement>;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Spring-smooth the raw scroll value — this is the key to silky motion.
  // All child transforms derive from this, not the raw scroll position.
  const smooth = useSpring(scrollYProgress, SPRING);

  return (
    <section ref={sectionRef} className="relative z-10" aria-label="How the club works">

      {/* Section header — outside the scroll container so it scrolls away */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <span aria-hidden className="h-px w-6" style={{ backgroundColor: CAME_ORANGE }} />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: CAME_ORANGE }}>
            How it works
          </span>
        </div>
        <h2
          className="font-sans font-black text-white leading-[1.02]"
          style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}
        >
          Four domains. One stage.
        </h2>
      </div>

      {/* Tall scroll container — 4 × 100vh gives 1 full viewport per domain */}
      <div ref={containerRef} style={{ height: `${DOMAINS.length * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">

            {/* Left — domain list */}
            <div className="flex-1 min-w-0">
              <ul className="list-none p-0 m-0">
                {DOMAINS.map((d, i) => (
                  <DomainRow
                    key={d.n}
                    domain={d}
                    index={i}
                    total={DOMAINS.length}
                    smooth={smooth}
                  />
                ))}
              </ul>
            </div>

            {/* Right — description panel */}
            <div
              className="hidden lg:block lg:w-[300px] xl:w-[360px] flex-shrink-0 relative"
              style={{ height: 200 }}
            >
              {DOMAINS.map((d, i) => (
                <DomainDesc
                  key={d.n}
                  domain={d}
                  index={i}
                  total={DOMAINS.length}
                  smooth={smooth}
                />
              ))}
            </div>

          </div>

          {/* Progress dots — right edge */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {DOMAINS.map((_, i) => (
              <DomainDot
                key={i}
                index={i}
                total={DOMAINS.length}
                smooth={smooth}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
