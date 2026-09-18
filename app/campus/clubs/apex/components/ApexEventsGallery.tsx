'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const APEX_RED = '#D80000';

// ─── Asset config — alternating video / image ─────────────────────────────────
type EventItem =
  | { slug: string; name: string; kind: string; caption: string; src: string; type: 'video'; poster?: string }
  | { slug: string; name: string; kind: string; caption: string; src: string; type: 'image' };

const EVENTS: EventItem[] = [
  {
    slug:    'genesis-vid',
    name:    'GENESIS',
    kind:    'Workshop · Gameathon',
    caption: 'A Unity intensive where industry mentors guided teams that shipped full games from scratch.',
    src:     '/videos/apex-genesis.mp4',
    poster:  '/images/clubs/apex/events/genesis.jpg',
    type:    'video',
  },
  {
    slug:    'genesis-img',
    name:    'GENESIS',
    kind:    'Workshop · Gameathon',
    caption: 'Industry mentors, teams of two, one game shipped — GENESIS in stills.',
    src:     '/images/clubs/apex/events/genesis.jpg',
    type:    'image',
  },
  {
    slug:    'vcc-vid',
    name:    'VCC',
    kind:    'Tournament · Valorant',
    caption: "MLRIT's Valorant Campus Championship — intense 5v5 rounds, campus-wide competition.",
    src:     '/videos/apex-vcc.mp4',
    poster:  '/images/clubs/apex/events/vcc.jpg',
    type:    'video',
  },
  {
    slug:    'vcc-img',
    name:    'VCC',
    kind:    'Tournament · Valorant',
    caption: 'The first campus Valorant championship — bracket play, spectators, and a stage.',
    src:     '/images/clubs/apex/events/vcc.jpg',
    type:    'image',
  },
  {
    slug:    'esports-vid',
    name:    'Interdepartmental Esports',
    kind:    'Championship · BGMI + Valorant',
    caption: 'The first-ever Interdepartmental Esports Championship — 180+ gamers, 17 departments.',
    src:     '/videos/apex-esports.mp4',
    poster:  '/images/clubs/apex/events/interdept.jpg',
    type:    'video',
  },
  {
    slug:    'esports-img',
    name:    'Interdepartmental Esports',
    kind:    'Championship · BGMI + Valorant',
    caption: '180+ students, 17 departments — the championship that brought the whole campus to one arena.',
    src:     '/images/clubs/apex/events/interdept.jpg',
    type:    'image',
  },
  {
    slug:    'apex-vid',
    name:    'APEX Highlights',
    kind:    'Community · All Events',
    caption: 'A look at what APEX is — the people, the games, the energy that defines the club.',
    src:     '/videos/apex-vid.mp4',
    type:    'video',
  },
  {
    slug:    'apex-img',
    name:    'APEX Highlights',
    kind:    'Community · All Events',
    caption: 'Every event. Every member. Every moment — APEX.',
    src:     '/images/clubs/apex/events/interdept.jpg',
    type:    'image',
  },
];

const TOTAL = EVENTS.length; // 8

// ─── Background media item (full-bleed) ───────────────────────────────────────
function BgMedia({ item, active }: { item: typeof EVENTS[number]; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (active) videoRef.current.play().catch(() => {});
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [active]);

  return (
    <motion.div
      key={item.slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {item.type === 'image' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.type === 'video' ? item.poster : undefined}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Dark overlay so text is legible */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.15) 100%)' }} />
    </motion.div>
  );
}

// ─── Thumbnail item in the strip ──────────────────────────────────────────────
function Thumb({
  item,
  active,
  onClick,
}: {
  item: typeof EVENTS[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        scale:   active ? 1.08 : 0.92,
        opacity: active ? 1    : 0.48,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex-shrink-0 rounded-lg overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      style={{ width: 52, height: 52 }}
      aria-label={`${item.name} ${item.type}`}
      aria-pressed={active}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={'poster' in item ? (item as { poster: string }).poster : item.src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-3 h-3 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-1" />
        </div>
      )}
      {/* Active ring */}
      {active && (
        <motion.div
          layoutId="thumb-ring"
          className="absolute inset-0 rounded-lg"
          style={{ border: `2px solid ${APEX_RED}` }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
    </motion.button>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
// Reference behavior: section occupies TOTAL×100vh, sticky viewport shows
// full-bleed background. Scroll progress 0→1 maps to item 0→TOTAL-1.
// Vertical thumbnail strip in center advances with scroll.
export default function ApexEventsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  });

  // Map scroll progress to active item — each item gets equal scroll share
  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      const idx = Math.min(TOTAL - 1, Math.floor(v * TOTAL));
      setActiveIdx(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  // Thumb strip scroll — keep active thumb visible in strip
  const thumbStripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = thumbStripRef.current;
    if (!el) return;
    const thumbH = 52 + 8; // height + gap
    el.scrollTo({ top: Math.max(0, activeIdx * thumbH - el.clientHeight / 2 + thumbH / 2), behavior: 'smooth' });
  }, [activeIdx]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: `${TOTAL * 100}vh` }}
      aria-label="APEX events"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Full-bleed background — all items stacked, active one fades in */}
        <div className="absolute inset-0 bg-[#080808]">
          {EVENTS.map((item, i) => (
            <BgMedia key={item.slug} item={item} active={i === activeIdx} />
          ))}
        </div>

        {/* Left — text info */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-[480px]">
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              Events
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="inline-flex items-center h-5 px-2 rounded-full font-mono text-[0.54rem] font-bold tracking-[0.18em] uppercase mb-3"
                style={{ background: `${APEX_RED}22`, border: `1px solid ${APEX_RED}55`, color: APEX_RED }}
              >
                {EVENTS[activeIdx].kind} · {EVENTS[activeIdx].type === 'video' ? '▶ Video' : 'Photo'}
              </div>
              <h2
                className="font-sans font-black text-white leading-[1.02] mb-3"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)' }}
              >
                {EVENTS[activeIdx].name}
              </h2>
              <p className="text-white/55 text-[0.95rem] leading-[1.65] max-w-[340px]">
                {EVENTS[activeIdx].caption}
              </p>
              <div className="mt-5 font-mono text-[0.56rem] font-bold tracking-[0.22em] uppercase text-white/25">
                {String(activeIdx + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center-right — vertical thumbnail strip (reference-accurate) */}
        <div
          className="absolute right-12 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ maxHeight: '70vh' }}
        >
          <div
            ref={thumbStripRef}
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: '70vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {EVENTS.map((item, i) => (
              <Thumb
                key={item.slug}
                item={item}
                active={i === activeIdx}
                onClick={() => {
                  // Jump scroll to this item's position
                  if (!sectionRef.current) return;
                  const top = sectionRef.current.offsetTop;
                  const h   = sectionRef.current.offsetHeight;
                  window.scrollTo({ top: top + (i / TOTAL) * h, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-8 left-8 md:left-14 lg:left-20">
          <div className="flex items-center gap-2">
            {EVENTS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width:   i === activeIdx ? 18 : 4,
                  opacity: i === activeIdx ? 1  : 0.25,
                  backgroundColor: i === activeIdx ? APEX_RED : '#fff',
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="h-[2px] rounded-full"
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[0.56rem] font-bold tracking-[0.22em] uppercase text-white/25">
            Scroll to explore
          </p>
        </div>

      </div>
    </section>
  );
}
