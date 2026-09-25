'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion';

const EWB_GREEN = '#3FAE5C';

const DOMAINS = [
  { n: '01', title: 'Sustainability Projects', sub: 'Bio-Brick · UpPETure · AI Drone', body: 'Real engineering builds addressing environmental and community challenges — Bio-Brick (eco-fuel briquettes from organic waste), UpPETure (upcycling plastic bottles), AI Climate Drone (aerial deforestation tracking), Propulsion System, and Fusion 360 AI.' },
  { n: '02', title: 'Events & Competitions',   sub: 'Eloqvent · ESF-R',              body: 'Eloqvent (communication and business model pitching) and ESF-R (Engineers Student Forum Regional — collaborative platform for real-world business model development).' },
  { n: '03', title: 'Global Networks',         sub: 'IEEE · IUCEE Summits',          body: 'Access to IEEE global technical network, IUCEE leadership summits, international conferences, multidisciplinary research, and industry mentorship through global chapter partnerships.' },
  { n: '04', title: 'Innovation & Design',     sub: 'Design Thinking · Mentorship',  body: 'Continuous project work, mentorship programs, and on-field sustainability challenges applying design thinking and entrepreneurship to real-world engineering problems.' },
];

const COLORS = ['#3FAE5C', '#6FBF3F', '#1F7A3D', '#C0392B'];

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
export default function EwbHowItWorks({
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
          <span aria-hidden className="h-px w-6" style={{ backgroundColor: EWB_GREEN }} />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: EWB_GREEN }}>
            How it works
          </span>
        </div>
        <h2
          className="font-sans font-black text-white leading-[1.02]"
          style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}
        >
          Four domains. One chapter.
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
