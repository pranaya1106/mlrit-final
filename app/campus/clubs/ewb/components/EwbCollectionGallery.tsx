'use client';

import { useEffect, useRef } from 'react';

const VANTA     = '#041009';
const FROST     = '#f2f5f7';
const PARALLAX  = 9;
const FADE_START = 0.65;
const EWB_GREEN = '#3FAE5C';

interface CollectionItem {
  id:       string;
  number:   string;
  label:    string;
  count:    string;
  quote:    string;
  gradient: string;
}

const ITEMS: CollectionItem[] = [
  {
    id:       'eloqvent',
    number:   '01',
    label:    'Eloqvent',
    count:    'Flagship · Communication',
    quote:    "Master communication\nand build sustainable\nbusiness models.",
    gradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)',
  },
  {
    id:       'esfr',
    number:   '02',
    label:    'ESF-R',
    count:    'Regional · Business',
    quote:    "Students collaborate\nto pitch and build\nrobust business models.",
    gradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)',
  },
  {
    id:       'bio-brick',
    number:   '03',
    label:    'Bio-Brick',
    count:    'Sustainability · Innovation',
    quote:    "Organic waste into\neco-friendly fuel\nfor communities.",
    gradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)',
  },
  {
    id:       'uppetur',
    number:   '04',
    label:    'UpPETure',
    count:    'Innovation · Upcycling',
    quote:    "Discarded plastic\nbottles into durable\nvaluable products.",
    gradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)',
  },
];

const TOTAL = ITEMS.length;

type LenisScrollArg = { scroll: number };
type LenisInstance  = {
  on:  (event: string, cb: (s: LenisScrollArg) => void) => void;
  off: (event: string, cb: (s: LenisScrollArg) => void) => void;
};

export default function EwbCollectionGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const leftColRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll({ scroll }: LenisScrollArg) {
      const top      = container!.offsetTop;
      const height   = container!.offsetHeight;
      const rawProg  = (scroll - top) / height;
      const progress = Math.max(0, Math.min(1, rawProg));

      for (let i = 0; i < TOTAL; i++) {
        const bar   = barRefs.current[i];
        const label = labelRefs.current[i];
        const bg    = bgRefs.current[i];
        if (!bar || !label || !bg) continue;

        const sp = Math.max(0, Math.min(1, progress * TOTAL - i));

        const yPct = -(sp * PARALLAX);
        bg.style.transform = `translate3d(0px,${yPct.toFixed(3)}%,0px) scale(1.18)`;

        const labelW  = label.offsetWidth || 808;
        const rawX    = labelW * (1 - 2 * sp);
        const leftCol = leftColRefs.current[i];
        const minX    = leftCol
          ? leftCol.offsetLeft + leftCol.offsetWidth + 2 - label.offsetLeft
          : -labelW;
        label.style.transform = `translate3d(${Math.max(minX, rawX).toFixed(2)}px,0px,0px)`;

        const opacity = sp < FADE_START ? 1 : Math.max(0, 1 - (sp - FADE_START) / (1 - FADE_START));
        bar.style.opacity = opacity.toFixed(4);
      }
    }

    function handleNative() { onScroll({ scroll: window.scrollY }); }

    const lenis = (window as unknown as { __lenisInstance?: LenisInstance }).__lenisInstance;
    if (lenis?.on) {
      lenis.on('scroll', onScroll);
    } else {
      window.addEventListener('scroll', handleNative, { passive: true });
    }
    handleNative();

    return () => {
      if (lenis?.off) lenis.off('scroll', onScroll);
      window.removeEventListener('scroll', handleNative);
    };
  }, []);

  return (
    <>
      {/* Section header */}
      <div className="relative z-10 border-t border-white/10">
        <div className="px-6 pb-16 pt-24 sm:px-10 sm:pt-32">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/30">
            02
          </span>
          <h2
            className="mt-2 font-semibold leading-none tracking-[-0.035em] text-white"
            style={{ fontSize: 'clamp(2rem,5vw,3.75rem)' }}
          >
            Collection
          </h2>
        </div>
      </div>

      {/* Sticky scroll container */}
      <div
        ref={containerRef}
        className="relative z-10"
        style={{ height: `${TOTAL * 100}svh` }}
      >
        {ITEMS.map((item, i) => (
          <section
            key={item.id}
            className="sticky top-0 h-svh overflow-hidden"
            style={{ backgroundColor: VANTA }}
            aria-label={item.label}
          >
            {/* Full-bleed gradient background with parallax */}
            <div
              ref={el => { bgRefs.current[i] = el; }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: item.gradient,
                opacity:    0.72,
                transform:  'translate3d(0px,0%,0px) scale(1.18)',
                willChange: 'transform',
              }}
            />

            {/* Gradient vignette */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(to bottom,rgba(4,16,9,.78) 0%,transparent 38%,rgba(4,16,9,.88) 100%)` }}
            />

            {/* Club-coloured accent line at top */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
              style={{ background: `linear-gradient(to right, ${EWB_GREEN}00, ${EWB_GREEN}88, ${EWB_GREEN}00)` }}
            />

            {/* White reveal bar */}
            <div
              ref={el => { barRefs.current[i] = el; }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden"
              style={{ backgroundColor: FROST, color: VANTA, opacity: i === 0 ? 1 : 0 }}
            >
              <div className="flex items-center gap-10 py-8 sm:py-10">
                {/* Static left: number + quote */}
                <div ref={el => { leftColRefs.current[i] = el; }} className="shrink-0 pl-6 sm:pl-10">
                  <p className="font-mono text-xs tabular-nums" style={{ color: `${VANTA}72` }}>
                    {item.number}
                  </p>
                  <p className="mt-5 whitespace-pre-line font-mono text-[0.7rem] uppercase leading-[1.7] tracking-[0.06em]">
                    {item.quote}
                  </p>
                </div>

                {/* Label — translateX driven by scroll */}
                <div
                  ref={el => { labelRefs.current[i] = el; }}
                  className="flex shrink-0 items-baseline gap-8 will-change-transform"
                  style={{ transform: i === 0 ? 'translate3d(0px,0px,0px)' : 'translate3d(808px,0px,0px)' }}
                >
                  <span
                    className="whitespace-nowrap font-semibold uppercase leading-none tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(2.5rem,8vw,7rem)' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="whitespace-nowrap font-mono text-[0.7rem] uppercase tracking-[0.18em]"
                    style={{ color: `${VANTA}72` }}
                  >
                    {item.count}
                  </span>
                </div>
              </div>
            </div>

            {/* Counter — bottom right */}
            <p
              className="absolute bottom-8 right-6 sm:right-10 font-mono text-[0.66rem] uppercase tracking-[0.2em]"
              style={{ color: `${FROST}99` }}
            >
              {item.number} / {String(TOTAL).padStart(2, '0')}
            </p>
          </section>
        ))}
      </div>
    </>
  );
}
