'use client';

import { useEffect, useRef } from 'react';

const VANTA      = '#0a0705';
const FROST      = '#f2f5f7';
const PARALLAX   = 9;     // image travels 0% → -9% vertically across the section
const FADE_START = 0.65;  // bar starts fading at 65% through each section

interface CollectionItem {
  id:       string;
  number:   string;
  label:    string;
  count:    string;
  quote:    string;
  video?:   string;
  poster?:  string;
  src?:     string;
  gradient: string;
}

const ITEMS: CollectionItem[] = [
  {
    id:       'came',
    number:   '01',
    label:    'Hellenic',
    count:    'Signature Event',
    quote:    "High-energy campus event\nwith live music, skits,\nand Band Echo.",
    video:    '/videos/came.mp4',
    gradient: 'linear-gradient(155deg,#023d10 0%,#01741f 55%,#0a3d1f 100%)',
  },
  {
    id:       'traditional',
    number:   '02',
    label:    'Traditional Day',
    count:    'Cultural Event',
    quote:    "Traditional attire from\nevery state — performances\nand cultural showcases.",
    video:    '/videos/traditionalday.mp4',
    src:      '/images/clubs/events/web/came-traditional-day-web.jpg',
    gradient: 'linear-gradient(155deg,#3a1a00 0%,#c2410c 55%,#3a1a00 100%)',
  },
  {
    id:       'annual',
    number:   '03',
    label:    'Annual Day',
    count:    'Institution Event',
    quote:    "MLRIT's flagship annual\ncelebration of student\nachievement and culture.",
    video:    '/videos/came-hero.mp4',
    src:      '/images/clubs/events/web/came-annual-day-web.jpg',
    gradient: 'linear-gradient(155deg,#2d1a00 0%,#92400e 55%,#451a03 100%)',
  },
  {
    id:       'ecstacy',
    number:   '04',
    label:    'Ecstacy',
    count:    'Concert Night',
    quote:    "Live performances by\nartists invited from\noutside the institution.",
    src:      '/images/clubs/events/web/came-ecstacy-web.jpg',
    gradient: 'linear-gradient(155deg,#0b1f3d 0%,#1e3a5f 55%,#14294a 100%)',
  },
  {
    id:       'navrat',
    number:   '05',
    label:    'Navrat Naveli',
    count:    'Cultural Fest',
    quote:    "Bathukamma, Garba,\ntraditional rituals and\nprize distribution.",
    src:      '/images/clubs/events/web/came-navrat-naveli-web.jpg',
    gradient: 'linear-gradient(155deg,#3a1503 0%,#b45309 55%,#7a3706 100%)',
  },
  {
    id:       'graduation',
    number:   '06',
    label:    'Graduation Day',
    count:    'Ceremonial',
    quote:    "Procession, lamp lighting,\ngold medals, and\ncultural performances.",
    src:      '/images/clubs/events/web/came-graduation-web.jpg',
    gradient: 'linear-gradient(155deg,#1a0b3d 0%,#6b3fa0 55%,#3a1f5f 100%)',
  },
];

const TOTAL = ITEMS.length;

type LenisScrollArg = { scroll: number };
type LenisInstance  = {
  on:  (event: string, cb: (s: LenisScrollArg) => void) => void;
  off: (event: string, cb: (s: LenisScrollArg) => void) => void;
};

export default function CameCollectionGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs to the animated elements inside each section
  const mediaRefs    = useRef<(HTMLElement | null)[]>([]);
  const barRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const leftColRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // 2-second dwell before video plays; cancelled on section change
  const dwellTimers = useRef<(ReturnType<typeof setTimeout> | null)[]>(Array(TOTAL).fill(null));
  const lastActive  = useRef(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function stopVideo(i: number) {
      const el = mediaRefs.current[i];
      if (!(el instanceof HTMLVideoElement)) return;
      if (dwellTimers.current[i]) { clearTimeout(dwellTimers.current[i]!); dwellTimers.current[i] = null; }
      el.pause();
      el.currentTime = 0;
    }

    function startDwell(i: number) {
      if (dwellTimers.current[i]) return;
      dwellTimers.current[i] = setTimeout(() => {
        dwellTimers.current[i] = null;
        const el = mediaRefs.current[i];
        if (el instanceof HTMLVideoElement) el.play().catch(() => {});
      }, 2000);
    }

    function onScroll({ scroll }: LenisScrollArg) {
      const top      = container!.offsetTop;
      const height   = container!.offsetHeight;
      const progress = Math.max(0, Math.min(1, (scroll - top) / height));
      const activeIdx = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));

      // Section change → video dwell logic
      if (activeIdx !== lastActive.current) {
        if (lastActive.current >= 0) stopVideo(lastActive.current);
        lastActive.current = activeIdx;
        startDwell(activeIdx);
      }

      for (let i = 0; i < TOTAL; i++) {
        const media = mediaRefs.current[i];
        const bar   = barRefs.current[i];
        const label = labelRefs.current[i];
        if (!media || !bar || !label) continue;

        // sectionProgress 0→1 for this section
        const sp = Math.max(0, Math.min(1, progress * TOTAL - i));

        // Parallax: image/video goes 0% → -PARALLAX% linearly
        const yPct = -(sp * PARALLAX);
        media.style.transform = `translate3d(0px,${yPct.toFixed(3)}%,0px)`;

        // Label X: starts off-screen right (+labelWidth), slides left through 0, exits left (-labelWidth)
        const labelW    = label.offsetWidth || 808;
        const rawX      = labelW * (1 - 2 * sp);
        // Clamp: label's left edge must stay ≥2px right of the left column's right edge
        const leftCol   = leftColRefs.current[i];
        const minX      = leftCol
          ? leftCol.offsetLeft + leftCol.offsetWidth + 2 - label.offsetLeft
          : -labelW;
        const labelX    = Math.max(minX, rawX);
        label.style.transform = `translate3d(${labelX.toFixed(2)}px,0px,0px)`;

        // Bar opacity: 1 through most of section, fades out in final (1-FADE_START) fraction
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
      dwellTimers.current.forEach(t => t && clearTimeout(t));
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

      {/* Sticky scroll container — each item = 100svh of scroll travel */}
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
            {/* Full-bleed parallax media */}
            {item.video ? (
              <video
                ref={el => { mediaRefs.current[i] = el; }}
                poster={item.poster ?? item.src}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 size-full object-cover"
                style={{ transform: 'translate3d(0px,0%,0px)', scale: '1.18', willChange: 'transform' }}
              >
                <source src={item.video} type="video/mp4" />
              </video>
            ) : item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={el => { mediaRefs.current[i] = el; }}
                src={item.src}
                alt={item.label}
                className="absolute inset-0 size-full object-cover"
                style={{ transform: 'translate3d(0px,0%,0px)', scale: '1.18', willChange: 'transform' }}
                loading="lazy"
                draggable={false}
              />
            ) : (
              <div
                ref={el => { mediaRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{ background: item.gradient, transform: 'translate3d(0px,0%,0px)', scale: '1.18', willChange: 'transform' }}
              />
            )}

            {/* Top/bottom gradient vignette */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(to bottom,rgba(10,7,5,.65) 0%,transparent 40%,rgba(10,7,5,.75) 100%)` }}
            />

            {/* White reveal bar — overflow-hidden clips the horizontally sliding label */}
            <div
              ref={el => { barRefs.current[i] = el; }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden"
              style={{ backgroundColor: FROST, color: VANTA, opacity: i === 0 ? 1 : 0 }}
            >
              <div className="flex items-center gap-10 py-8 sm:py-10">
                {/* Static: number + quote */}
                <div ref={el => { leftColRefs.current[i] = el; }} className="shrink-0 pl-6 sm:pl-10">
                  <p className="font-mono text-xs tabular-nums" style={{ color: `${VANTA}72` }}>
                    {item.number}
                  </p>
                  <p className="mt-5 whitespace-pre-line font-mono text-[0.7rem] uppercase leading-[1.7] tracking-[0.06em]">
                    {item.quote}
                  </p>
                </div>

                {/* Label — scroll-driven translateX, clipped by parent overflow-hidden */}
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
