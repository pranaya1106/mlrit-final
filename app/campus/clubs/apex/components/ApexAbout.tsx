'use client';

import { useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

// ─── APEX about text ──────────────────────────────────────────────────────────
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

// DIM_OPACITY matches the reference — barely-there grey
const DIM  = 'rgba(255,255,255,0.18)';
const FULL = 'rgba(255,255,255,1.00)';

// ─── Per-character span ───────────────────────────────────────────────────────
// Reference: sharp binary transition at the scroll front — no trailing glow.
// Each char gets a small window [start, end] that is just wide enough to
// prevent a hard step function but narrow enough to look like a moving front.
function Char({
  char,
  progress,
  start,
  end,
  reduced,
}: {
  char:     string;
  progress: MotionValue<number>;
  start:    number;
  end:      number;
  reduced:  boolean;
}) {
  const color = useTransform(
    progress,
    [start, end],
    reduced ? [FULL, FULL] : [DIM, FULL],
  );
  return <motion.span style={{ color }} aria-hidden="true">{char}</motion.span>;
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function ApexAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced    = !!useReducedMotion();

  // Section is 220vh — sticky panel fills viewport for the scroll travel
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  });

  const words = useMemo(() => ABOUT_TEXT.split(' '), []);
  const totalChars = useMemo(() => ABOUT_TEXT.replace(/ /g, '').length, []);

  // Reveal window: narrow (~3 chars worth) so the front looks sharp
  // Reference shows near-binary transition, not a wide gradient
  const REVEAL_START = 0.04;
  const REVEAL_END   = 0.92;
  const SPAN         = REVEAL_END - REVEAL_START;
  const WINDOW       = 0.022; // tight — about 2 chars wide at the front

  const wordCharOffsets = useMemo(() => {
    let offset = 0;
    return words.map(w => { const o = offset; offset += w.length; return o; });
  }, [words]);

  // Header fade-in at section start
  const headerOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);
  const headerY       = useTransform(scrollYProgress, [0, 0.04], [12, 0]);

  // Facts fade in near end
  const factsOpacity = useTransform(scrollYProgress, [0.82, 0.93], [0, 1]);
  const factsY       = useTransform(scrollYProgress, [0.82, 0.93], [16, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: '220vh' }}
      aria-label="What is APEX?"
    >
      <div className="sticky top-0 flex items-center justify-center min-h-screen overflow-hidden px-6 py-20">
        <div className="max-w-[860px] w-full mx-auto">

          {/* Eyebrow */}
          <motion.div
            style={{ opacity: headerOpacity, y: headerY }}
            className="flex items-center gap-3 mb-8"
          >
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              What is APEX?
            </span>
          </motion.div>

          {/* Text reveal — reference accurate */}
          {/* Each word wrapped in inline-block span to prevent mid-word breaks */}
          <p
            className="font-sans font-bold leading-[1.6]"
            style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.85rem)' }}
            aria-label={ABOUT_TEXT}
          >
            {words.map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.28em] whitespace-nowrap" aria-hidden="true">
                {Array.from(word).map((ch, ci) => {
                  const charIdx = wordCharOffsets[wi] + ci;
                  const t       = charIdx / (totalChars - 1);
                  // Map t → scroll progress range for this char
                  const start   = REVEAL_START + t * (SPAN - WINDOW);
                  const end     = start + WINDOW;
                  return (
                    <Char
                      key={ci}
                      char={ch}
                      progress={scrollYProgress}
                      start={start}
                      end={end}
                      reduced={reduced}
                    />
                  );
                })}
              </span>
            ))}
          </p>

          {/* Facts grid */}
          <motion.div
            style={{ opacity: factsOpacity, y: factsY }}
            className="mt-12 border-t border-white/10 pt-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8"
          >
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/30">{k}</div>
                <div className="mt-1.5 text-white/80 text-[0.9rem] leading-snug">{v}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
