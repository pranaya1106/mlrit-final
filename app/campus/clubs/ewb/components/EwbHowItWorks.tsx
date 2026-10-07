'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const EWB_GREEN = '#3FAE5C';

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
    color: EWB_GREEN,
    bg: 'linear-gradient(145deg, #020d05 0%, #061a0a 45%, #020d05 100%)',
  },
  {
    type: 'domain', n: '01',
    title: 'Sustainability\nProjects',
    sub: 'Bio-Brick · UpPETure · AI Drone',
    body: 'Real engineering builds addressing environmental and community challenges — Bio-Brick (eco-fuel briquettes from organic waste), UpPETure (upcycling plastic bottles), AI Climate Drone (aerial deforestation tracking), Propulsion System, and Fusion 360 AI.',
    color: '#3FAE5C',
    bg: 'linear-gradient(145deg, #020d05 0%, #061a0a 55%, #020d05 100%)',
  },
  {
    type: 'domain', n: '02',
    title: 'Events &\nCompetitions',
    sub: 'Eloqvent · ESF-R',
    body: 'Eloqvent (communication and business model pitching) and ESF-R (Engineers Student Forum Regional — collaborative platform for real-world business model development).',
    color: '#6FBF3F',
    bg: 'linear-gradient(145deg, #061402 0%, #0a2406 55%, #061402 100%)',
  },
  {
    type: 'domain', n: '03',
    title: 'Global\nNetworks',
    sub: 'IEEE · IUCEE Summits',
    body: 'Access to IEEE global technical network, IUCEE leadership summits, international conferences, multidisciplinary research, and industry mentorship through global chapter partnerships.',
    color: '#1F7A3D',
    bg: 'linear-gradient(145deg, #030e07 0%, #081a0f 55%, #030e07 100%)',
  },
  {
    type: 'domain', n: '04',
    title: 'Innovation\n& Design',
    sub: 'Design Thinking · Mentorship',
    body: 'Continuous project work, mentorship programs, and on-field sustainability challenges applying design thinking and entrepreneurship to real-world engineering problems.',
    color: '#C0392B',
    bg: 'linear-gradient(145deg, #140302 0%, #260706 55%, #140302 100%)',
  },
  {
    type: 'blank',
    color: EWB_GREEN,
    bg: 'linear-gradient(145deg, #010802 0%, #031006 100%)',
  },
];

const LEAF_PAIRS: [PageContent, PageContent][] = [];
const padded = PAGES.length % 2 === 0 ? PAGES : [...PAGES, { type: 'blank' as const, color: EWB_GREEN, bg: '#010802' }];
for (let i = 0; i < padded.length; i += 2) {
  LEAF_PAIRS.push([padded[i], padded[i + 1]]);
}
const TOTAL_LEAVES = LEAF_PAIRS.length;

function PageFace({ page }: { page: PageContent }) {
  const pad = 'clamp(28px, 4.5vw, 56px)';

  if (page.type === 'blank') {
    return (
      <div style={{ position: 'absolute', inset: 0, background: page.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 'clamp(0.52rem, 0.8vw, 0.65rem)', fontWeight: 900, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.08)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          EWB · MLRIT
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
          <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 'clamp(0.52rem, 0.8vw, 0.65rem)', fontWeight: 900, letterSpacing: '0.26em', textTransform: 'uppercase', color: page.color, opacity: 0.8 }}>
            EWB · MLRIT
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 'clamp(1.6rem, 4vw, 3.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.92, margin: 0 }}>
            What<br />We Do?
          </h3>
          <p style={{ fontSize: 'clamp(0.7rem, 0.95vw, 0.82rem)', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0, maxWidth: 380 }}>
            Four domains of sustainable engineering — from real-world builds to global networks.
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
      <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 'clamp(0.58rem, 0.9vw, 0.72rem)', fontWeight: 900, letterSpacing: '0.2em', color: page.color, opacity: 0.75 }}>
        {page.n}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 2.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0, whiteSpace: 'pre-line', margin: 0 }}>
          {page.title}
        </h3>
        <p style={{ fontSize: 'clamp(0.68rem, 0.9vw, 0.8rem)', color: 'rgba(255,255,255,0.46)', lineHeight: 1.7, margin: 0 }}>
          {page.body}
        </p>
        <div style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 'clamp(0.44rem, 0.58vw, 0.55rem)', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
          {page.sub}
        </div>
      </div>
      <div style={{ height: 3, width: 36, background: page.color, borderRadius: 999, opacity: 0.65 }} />
    </div>
  );
}

export default function EwbHowItWorks({
  sectionRef: externalRef,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef  = (externalRef ?? internalRef) as React.RefObject<HTMLElement>;

  const [flippedCount, setFlippedCount] = useState(0);
  const [isBookClosed, setIsBookClosed] = useState(true);
  const flippedRef = useRef(0);
  const tiltStopped = useRef(false);

  const bookContainerControls = useAnimationControls();
  const tiltControls = useAnimationControls();
  const lc0 = useAnimationControls();
  const lc1 = useAnimationControls();
  const lc2 = useAnimationControls();
  const controlsPool = [lc0, lc1, lc2];

  useEffect(() => {
    let cancelled = false;
    async function runTilt() {
      await new Promise<void>(r => setTimeout(r, 1200));
      while (!cancelled && !tiltStopped.current) {
        await tiltControls.start({ rotateY: -14, transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] } });
        if (cancelled || tiltStopped.current) break;
        await tiltControls.start({ rotateY: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } });
        if (cancelled || tiltStopped.current) break;
        await new Promise<void>(r => setTimeout(r, 2800));
      }
    }
    runTilt();
    return () => { cancelled = true; };
  }, [tiltControls]);

  const BOOK_W = 'min(420px, 88vw)';
  const BOOK_H = 'clamp(400px, 58vw, 620px)';
  const SHIFT_X = Math.min(420, typeof window !== 'undefined' ? window.innerWidth * 0.88 : 420) / 2;

  const handleClick = async () => {
    const current = flippedRef.current;

    if (current === 0) {
      tiltStopped.current = true;
      tiltControls.stop();
      tiltControls.start({ rotateY: 0, transition: { duration: 0.3, ease: 'easeOut' } });
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
          <span aria-hidden className="h-px w-6" style={{ backgroundColor: EWB_GREEN }} />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: EWB_GREEN }}>
            How it works
          </span>
        </div>
        <h2 className="font-sans font-black text-white leading-[1.02]" style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}>
          Four domains. One chapter.
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
          animate={tiltControls}
          initial={{ rotateY: 0 }}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
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
        </motion.div>
      </div>

      <div className="flex justify-center">
        <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
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
