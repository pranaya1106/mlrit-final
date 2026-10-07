'use client';

import { useEffect, useRef } from 'react';

const VANTA    = '#07090b';
const FROST    = '#f2f5f7';
const PARALLAX = 9;
const FADE_START = 0.65;
const SCOPE_CYAN = '#00C2FF';

interface CollectionItem {
  id:      string;
  number:  string;
  label:   string;
  count:   string;
  quote:   string;
  src:     string;
  link?:   string;
}

const ITEMS: CollectionItem[] = [
  {
    id:      'zenith-25',
    number:  '01',
    label:   'ZENITH\'25',
    count:   'Annual Fest · 2-Day Hackathon',
    quote:   "Flagship annual fest —\n₹75,000 prize pool across\nAgri-Tech, Med-Tech, Ed-Tech.",
    src:     '/images/clubs/events/zenith-25.png',
    link:    'https://www.instagram.com/p/DRKVKCGiFVK/?igsh=YmVjdjlnb3Nib2J3',
  },
  {
    id:      'init-saga',
    number:  '02',
    label:   'INIT SAGA',
    count:   'Flagship Hackathon',
    quote:   "2-day hackathon tackling\nreal-world problems —\n₹20,000 prize pool.",
    src:     '/images/clubs/events/init-saga.jpg',
    link:    'https://www.instagram.com/p/DH5V3ARIPXY/?igsh=MWR6eWRzZHd6a2MxeQ==',
  },
  {
    id:      'aws-cloud-trek',
    number:  '03',
    label:   'AWS Cloud Trek',
    count:   'Workshop · 2 Days',
    quote:   "Hands-on cloud workshop:\nAWS S3, EC2, and\ncustom-domain deployment.",
    src:     '/images/clubs/events/aws-cloud-trek.jpg',
    link:    'https://www.instagram.com/p/DPghWlAD-CH/?igsh=MTBmYnFmdXc3bXQ4aw==',
  },
  {
    id:      'aws-community-day',
    number:  '04',
    label:   'Community Day',
    count:   'Community · AWS',
    quote:   "AI, ML, data engineering\nand cloud speaker sessions\nplus AWS swag.",
    src:     '/images/clubs/events/aws-community-day.jpg',
    link:    'https://www.instagram.com/p/DRUttHHD8wu/?igsh=ZXd1N3Y0Z2ZrdXRw',
  },
];

const TOTAL = ITEMS.length;

type LenisScrollArg = { scroll: number };
type LenisInstance  = {
  on:  (event: string, cb: (s: LenisScrollArg) => void) => void;
  off: (event: string, cb: (s: LenisScrollArg) => void) => void;
};

export default function ScopeCollectionGallery() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const imgRefs       = useRef<(HTMLImageElement | null)[]>([]);
  const barRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const leftColRefs   = useRef<(HTMLDivElement | null)[]>([]);

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
        const img   = imgRefs.current[i];
        if (!bar || !label || !img) continue;

        const sp = Math.max(0, Math.min(1, progress * TOTAL - i));

        const yPct = -(sp * PARALLAX);
        img.style.transform = `translate3d(0px,${yPct.toFixed(3)}%,0px)`;

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
            {/* Full-bleed parallax poster */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={el => { imgRefs.current[i] = el; }}
              src={item.src}
              alt={item.label}
              className="absolute inset-0 size-full object-cover object-center"
              style={{
                transform:  'translate3d(0px,0%,0px)',
                scale:      '1.18',
                willChange: 'transform',
                filter:     'brightness(0.55) saturate(1.2)',
              }}
              draggable={false}
            />

            {/* Gradient vignette */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(to bottom,rgba(7,9,11,.72) 0%,transparent 38%,rgba(7,9,11,.82) 100%)` }}
            />

            {/* Club-coloured accent line at top */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
              style={{ background: `linear-gradient(to right, ${SCOPE_CYAN}00, ${SCOPE_CYAN}88, ${SCOPE_CYAN}00)` }}
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
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 font-mono text-[0.58rem] font-bold tracking-[0.18em] uppercase transition-colors"
                      style={{ color: SCOPE_CYAN }}
                    >
                      View recap ↗
                    </a>
                  )}
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
