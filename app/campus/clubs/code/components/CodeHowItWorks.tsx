'use client';

import { useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const CODE_GREEN = '#3DDC5A';

interface PageContent {
  type: 'cover' | 'domain' | 'blank';
  n?: string;
  title?: string;
  sub?: string;
  body?: string;
  color: string;
  bg: string;
}

const PAGES: PageContent[] = [
  {
    type: 'cover',
    color: CODE_GREEN,
    bg: 'linear-gradient(145deg, #020d04 0%, #061a09 45%, #020d04 100%)',
  },
  {
    type: 'domain', n: '01',
    title: 'Weekly\nProblem Sets',
    sub: 'Loops · Graphs · Algorithms',
    body: 'A running set of graded problems spanning every year\'s syllabus, from loops to graph algorithms.',
    color: '#3DDC5A',
    bg: 'linear-gradient(145deg, #020d04 0%, #061a09 55%, #020d04 100%)',
  },
  {
    type: 'domain', n: '02',
    title: 'Peer\nDebugging',
    sub: 'Drop-In Sessions',
    body: 'Drop-in sessions where seniors help juniors work through a stuck bug, live.',
    color: '#22C55E',
    bg: 'linear-gradient(145deg, #021209 0%, #062016 55%, #021209 100%)',
  },
  {
    type: 'domain', n: '03',
    title: 'Placement\nPrep',
    sub: 'DSA · System Design',
    body: 'Structured prep covering the DSA and system-design rounds most placement drives actually ask.',
    color: '#0EA85A',
    bg: 'linear-gradient(145deg, #021409 0%, #062414 55%, #021409 100%)',
  },
  {
    type: 'domain', n: '04',
    title: 'Mini\nProjects',
    sub: 'Guided Builds',
    body: 'Small, guided projects that turn syllabus concepts into something you can show in an interview.',
    color: '#84E8A0',
    bg: 'linear-gradient(145deg, #031a08 0%, #072e10 55%, #031a08 100%)',
  },
  {
    type: 'blank',
    color: CODE_GREEN,
    bg: 'linear-gradient(145deg, #010802 0%, #031006 100%)',
  },
];

const LEAF_PAIRS: [PageContent, PageContent][] = [];
const padded = PAGES.length % 2 === 0 ? PAGES : [...PAGES, { type: 'blank' as const, color: CODE_GREEN, bg: '#010802' }];
for (let i = 0; i < padded.length; i += 2) {
  LEAF_PAIRS.push([padded[i], padded[i + 1]]);
}
const TOTAL_LEAVES = LEAF_PAIRS.length;

function PageFace({ page }: { page: PageContent }) {
  const pad = 'clamp(28px, 4.5vw, 56px)';

  if (page.type === 'blank') {
    return (
      <div style={{ position: 'absolute', inset: 0, background: page.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 'clamp(0.52rem, 0.8vw, 0.65rem)', fontWeight: 900, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.08)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          CODE · MLRIT
        </span>
      </div>
    );
  }

  if (page.type === 'cover') {
    return (
      <div style={{ position: 'absolute', inset: 0, background: page.bg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: pad, overflow: 'hidden' }}>
        {[0.22, 0.44, 0.66, 0.88].map(p => (
          <div key={p} aria-hidden style={{ position: 'absolute', top: `${p * 100}%`, left: '8%', right: '8%', height: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 2, background: page.color, borderRadius: 999, opacity: 0.7 }} />
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 'clamp(0.52rem, 0.8vw, 0.65rem)', fontWeight: 900, letterSpacing: '0.26em', textTransform: 'uppercase', color: page.color, opacity: 0.8 }}>
            CODE · MLRIT
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 'clamp(1.6rem, 4vw, 3.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.92, margin: 0 }}>
            What<br />We Do?
          </h3>
          <p style={{ fontSize: 'clamp(0.7rem, 0.95vw, 0.82rem)', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0, maxWidth: 380 }}>
            Four habits, every year — problem sets, debugging, placement prep, and guided projects.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ height: 3, width: 32, background: page.color, borderRadius: 999, opacity: 0.5 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: page.bg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: pad, overflow: 'hidden' }}>
      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 'clamp(0.58rem, 0.9vw, 0.72rem)', fontWeight: 900, letterSpacing: '0.2em', color: page.color, opacity: 0.75 }}>
        {page.n}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 2.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, whiteSpace: 'pre-line', margin: 0 }}>
          {page.title}
        </h3>
        <p style={{ fontSize: 'clamp(0.68rem, 0.9vw, 0.8rem)', color: 'rgba(255,255,255,0.46)', lineHeight: 1.7, margin: 0 }}>
          {page.body}
        </p>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 'clamp(0.44rem, 0.58vw, 0.55rem)', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
          {page.sub}
        </div>
      </div>
      <div style={{ height: 3, width: 36, background: page.color, borderRadius: 999, opacity: 0.65 }} />
    </div>
  );
}

export default function CodeHowItWorks({
  sectionRef: externalRef,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef  = (externalRef ?? internalRef) as React.RefObject<HTMLElement>;

  const [flippedCount, setFlippedCount] = useState(0);
  const [isBookClosed, setIsBookClosed] = useState(true);
  const flippedRef = useRef(0);

  const bookContainerControls = useAnimationControls();
  const lc0 = useAnimationControls();
  const lc1 = useAnimationControls();
  const lc2 = useAnimationControls();
  const controlsPool = [lc0, lc1, lc2];

  const BOOK_W = 'min(420px, 88vw)';
  const BOOK_H = 'clamp(400px, 58vw, 620px)';
  const SHIFT_X = Math.min(420, typeof window !== 'undefined' ? window.innerWidth * 0.88 : 420) / 2;

  const handleClick = async () => {
    const current = flippedRef.current;

    if (current === 0) {
      setIsBookClosed(false);
      bookContainerControls.start({
        x: SHIFT_X,
        transition: { duration: 0.6, ease: 'easeInOut' },
      });
    }

    if (current < TOTAL_LEAVES) {
      setFlippedCount(current + 1);
      flippedRef.current = current + 1;
      await controlsPool[current].start({
        rotateY: -180,
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
      });
    } else {
      bookContainerControls.start({
        x: 0,
        transition: { duration: 0.8, ease: 'easeInOut' },
      });
      for (let i = TOTAL_LEAVES - 1; i >= 0; i--) {
        controlsPool[i].start({
          rotateY: 0,
          transition: { duration: 0.5, ease: 'easeInOut' },
        });
        await new Promise<void>(r => setTimeout(r, 80));
      }
      setFlippedCount(0);
      flippedRef.current = 0;
      setIsBookClosed(true);
    }
  };

  return (
    <section ref={sectionRef} className="relative z-10 py-24" aria-label="How the club works">

      <div className="max-w-[1400px] mx-auto mb-16 px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-3 mb-4">
          <span aria-hidden className="h-px w-6" style={{ backgroundColor: CODE_GREEN }} />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: CODE_GREEN }}>
            How it works
          </span>
        </div>
        <h2 className="font-sans font-black text-white leading-[1.02]" style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}>
          Four habits. Every year.
        </h2>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: 2500,
          cursor: 'pointer',
          overflow: 'visible',
          paddingBottom: 48,
        }}
        onClick={handleClick}
        role="button"
        aria-label={isBookClosed ? 'Open book' : flippedCount < TOTAL_LEAVES ? 'Flip page' : 'Close book'}
      >
        <motion.div
          animate={bookContainerControls}
          style={{
            width: BOOK_W,
            height: BOOK_H,
            position: 'relative',
            transformStyle: 'preserve-3d',
            boxShadow: isBookClosed
              ? '8px 10px 40px 0px rgba(0,0,0,0.75)'
              : '0px 0px 0px transparent',
            transition: 'box-shadow 0.6s ease',
          }}
        >
          {LEAF_PAIRS.map(([frontPage, backPage], index) => {
            const isFlipped  = index < flippedCount;
            const isFlipping = index === flippedCount - 1;
            const zOffset    = isFlipped ? index * 0.4 : (TOTAL_LEAVES - index) * 0.4;
            const zIndex     = isFlipping ? 100 : isFlipped ? index : TOTAL_LEAVES - index;
            const br         = 12;

            return (
              <motion.div
                key={index}
                animate={controlsPool[index]}
                initial={{ rotateY: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  zIndex,
                  transform: `translateZ(${zOffset}px)`,
                  willChange: 'transform',
                }}
              >
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    borderRadius: `0px ${br}px ${br}px 0px`,
                    overflow: 'hidden',
                  }}
                >
                  <PageFace page={frontPage} />
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12%', background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent)', pointerEvents: 'none' }} />
                </div>

                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(0.01px)',
                    borderRadius: `${br}px 0px 0px ${br}px`,
                    overflow: 'hidden',
                  }}
                >
                  <PageFace page={backPage} />
                  <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12%', background: 'linear-gradient(to left, rgba(0,0,0,0.18), transparent)', pointerEvents: 'none' }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex justify-center">
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
          {isBookClosed
            ? 'Click to open'
            : flippedCount < TOTAL_LEAVES
            ? 'Click to flip'
            : 'Click to close'}
        </span>
      </div>

    </section>
  );
}
