'use client';

import { useEffect, useRef } from 'react';

const VANTA    = '#080808';
const FROST    = '#f2f5f7';
const PARALLAX = 9;   // image travels ±9% vertically
// Bar fades out when section progress exceeds this threshold
const FADE_START = 0.65;

interface CollectionItem {
  id:      string;
  number:  string;
  label:   string;
  count:   string;
  quote:   string;
  video:   string;
  poster?: string;
}

const ITEMS: CollectionItem[] = [
  {
    id:      'genesis',
    number:  '01',
    label:   'Genesis',
    count:   'Workshop · Gameathon',
    quote:   "A Unity intensive where\nmentors guided teams that\nshipped full games.",
    video:   '/videos/apex-genesis.mp4',
    poster:  '/images/clubs/apex/events/genesis.jpg',
  },
  {
    id:      'vcc',
    number:  '02',
    label:   'VCC',
    count:   'Tournament · Valorant',
    quote:   "MLRIT's Valorant Campus\nChampionship — intense 5v5\nrounds, campus-wide.",
    video:   '/videos/apex-vcc.mp4',
    poster:  '/images/clubs/apex/events/vcc.jpg',
  },
  {
    id:      'esports',
    number:  '03',
    label:   'Interdept Esports',
    count:   'Championship · BGMI+Val',
    quote:   "First-ever Interdepartmental\nEsports Championship —\n180+ gamers, 17 depts.",
    video:   '/videos/apex-esports.mp4',
    poster:  '/images/clubs/apex/events/interdept.jpg',
  },
  {
    id:      'highlights',
    number:  '04',
    label:   'APEX Highlights',
    count:   'Community · All Events',
    quote:   "The people, the games,\nthe energy that defines\nthe club.",
    video:   '/videos/apex-vid.mp4',
  },
];

const TOTAL = ITEMS.length;

type LenisScrollArg = { scroll: number };
type LenisInstance  = {
  on:  (event: string, cb: (s: LenisScrollArg) => void) => void;
  off: (event: string, cb: (s: LenisScrollArg) => void) => void;
};

export default function ApexCollectionGallery() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const videoRefs     = useRef<(HTMLVideoElement | null)[]>([]);
  const barRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const leftColRefs   = useRef<(HTMLDivElement | null)[]>([]);

  // 2-second dwell timer: only play video if user stays on a section ≥2s
  const dwellTimers  = useRef<(ReturnType<typeof setTimeout> | null)[]>(Array(TOTAL).fill(null));
  const lastActive   = useRef(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function stopVideo(i: number) {
      const v = videoRefs.current[i];
      if (!v) return;
      if (dwellTimers.current[i]) { clearTimeout(dwellTimers.current[i]!); dwellTimers.current[i] = null; }
      v.pause();
      v.currentTime = 0;
    }

    function startDwell(i: number) {
      if (dwellTimers.current[i]) return; // already scheduled
      dwellTimers.current[i] = setTimeout(() => {
        dwellTimers.current[i] = null;
        const v = videoRefs.current[i];
        if (v) v.play().catch(() => {});
      }, 2000);
    }

    function onScroll({ scroll }: LenisScrollArg) {
      const top      = container!.offsetTop;
      const height   = container!.offsetHeight;
      const rawProg  = (scroll - top) / height;
      const progress = Math.max(0, Math.min(1, rawProg));
      const activeIdx = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));

      // Dwell / video control
      if (activeIdx !== lastActive.current) {
        if (lastActive.current >= 0) stopVideo(lastActive.current);
        lastActive.current = activeIdx;
        startDwell(activeIdx);
      }

      for (let i = 0; i < TOTAL; i++) {
        const bar   = barRefs.current[i];
        const label = labelRefs.current[i];
        const video = videoRefs.current[i];
        if (!bar || !label || !video) continue;

        // sectionProgress: 0 = this section's scroll start, 1 = its scroll end
        const sp = Math.max(0, Math.min(1, progress * TOTAL - i));

        // Image / video parallax: 0% at entry, -9% at exit (continuous linear)
        const yPct      = -(sp * PARALLAX);
        video.style.transform = `translate3d(0px,${yPct.toFixed(3)}%,0px)`;

        // Label X: starts off-screen RIGHT (+labelWidth), slides through 0, ends off-screen LEFT (-labelWidth)
        const labelW    = label.offsetWidth || 808;
        const rawX      = labelW * (1 - 2 * sp);
        // Clamp: label's left edge must stay ≥2px to the right of the left column's right edge
        // label natural left = label.offsetLeft (within the bar flex row)
        const leftCol   = leftColRefs.current[i];
        const minX      = leftCol
          ? leftCol.offsetLeft + leftCol.offsetWidth + 2 - label.offsetLeft
          : -labelW;
        const labelX    = Math.max(minX, rawX);
        label.style.transform = `translate3d(${labelX.toFixed(2)}px,0px,0px)`;

        // Bar opacity: full during section, fades out in last (1-FADE_START) fraction
        const opacity   = sp < FADE_START ? 1 : Math.max(0, 1 - (sp - FADE_START) / (1 - FADE_START));
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
            {/* Full-bleed parallax video */}
            <video
              ref={el => { videoRefs.current[i] = el; }}
              poster={item.poster}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 size-full object-cover"
              style={{
                transform:  'translate3d(0px,0%,0px)',
                scale:      '1.18',
                willChange: 'transform',
              }}
            >
              <source src={item.video} type="video/mp4" />
            </video>

            {/* Gradient vignette */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(to bottom,rgba(8,8,8,.65) 0%,transparent 40%,rgba(8,8,8,.75) 100%)` }}
            />

            {/* White reveal bar — overflow-hidden clips the sliding label */}
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

                {/* Label — translateX driven by scroll, clipped by overflow-hidden */}
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
