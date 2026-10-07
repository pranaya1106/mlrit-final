'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const APEX_RED = '#D80000';

type EventItem =
  | { slug: string; name: string; kind: string; caption: string; src: string; type: 'video'; poster?: string }
  | { slug: string; name: string; kind: string; caption: string; src: string; type: 'image' };

const EVENTS: EventItem[] = [
  { slug: 'genesis-vid',  name: 'GENESIS',                 kind: 'Workshop · Gameathon',         caption: 'A Unity intensive where industry mentors guided teams that shipped full games from scratch.',                     src: '/videos/apex-genesis.mp4',         poster: '/images/clubs/apex/events/genesis.jpg',   type: 'video' },
  { slug: 'genesis-img',  name: 'GENESIS',                 kind: 'Workshop · Gameathon',         caption: 'Industry mentors, teams of two, one game shipped — GENESIS in stills.',                                         src: '/images/clubs/apex/events/genesis.jpg',                                               type: 'image' },
  { slug: 'vcc-vid',      name: 'VCC',                     kind: 'Tournament · Valorant',         caption: "MLRIT's Valorant Campus Championship — intense 5v5 rounds, campus-wide competition.",                          src: '/videos/apex-vcc.mp4',             poster: '/images/clubs/apex/events/vcc.jpg',       type: 'video' },
  { slug: 'vcc-img',      name: 'VCC',                     kind: 'Tournament · Valorant',         caption: 'The first campus Valorant championship — bracket play, spectators, and a stage.',                              src: '/images/clubs/apex/events/vcc.jpg',                                                   type: 'image' },
  { slug: 'esports-vid',  name: 'Interdepartmental Esports', kind: 'Championship · BGMI + Valorant', caption: 'The first-ever Interdepartmental Esports Championship — 180+ gamers, 17 departments.',                     src: '/videos/apex-esports.mp4',         poster: '/images/clubs/apex/events/interdept.jpg', type: 'video' },
  { slug: 'esports-img',  name: 'Interdepartmental Esports', kind: 'Championship · BGMI + Valorant', caption: '180+ students, 17 departments — the championship that brought the whole campus to one arena.',             src: '/images/clubs/apex/events/interdept.jpg',                                             type: 'image' },
  { slug: 'apex-vid',     name: 'APEX Highlights',         kind: 'Community · All Events',        caption: 'A look at what APEX is — the people, the games, the energy that defines the club.',                           src: '/videos/apex-vid.mp4',                                                                type: 'video' },
  { slug: 'apex-img',     name: 'APEX Highlights',         kind: 'Community · All Events',        caption: 'Every event. Every member. Every moment — APEX.',                                                             src: '/images/clubs/apex/events/interdept.jpg',                                             type: 'image' },
];

const TOTAL = EVENTS.length;

// ─── Background media — GPU-composited opacity only ───────────────────────────
function BgMedia({ item, active }: { item: EventItem; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ willChange: 'opacity' }}
    >
      {item.type === 'image' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.src} alt={item.name} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 100%)' }}
      />
    </motion.div>
  );
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────────
function Thumb({ item, active, onClick }: { item: EventItem; active: boolean; onClick: () => void }) {
  const poster = item.type === 'video' ? item.poster : item.src;
  return (
    <motion.button
      onClick={onClick}
      animate={{ scale: active ? 1.1 : 0.9, opacity: active ? 1 : 0.45 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="relative flex-shrink-0 rounded-lg overflow-hidden"
      style={{ width: 52, height: 52, willChange: 'transform, opacity' }}
      aria-label={`${item.name} ${item.type}`}
      aria-pressed={active}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster ?? item.src} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-3 h-3 border-l-[8px] border-l-white border-y-[5px] border-y-transparent ml-0.5" />
        </div>
      )}
      {active && (
        <motion.div
          layoutId="thumb-ring"
          className="absolute inset-0 rounded-lg"
          style={{ border: `2px solid ${APEX_RED}`, willChange: 'transform' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ApexEventsGallery() {
  const sectionRef   = useRef<HTMLElement>(null);
  const thumbRef     = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  // Track previous idx in a ref so we can detect real changes without triggering extra renders
  const prevIdxRef   = useRef(0);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  });

  // useMotionValueEvent avoids setState on every frame — only fires when the
  // derived index actually changes (1 re-render per slide, not per pixel scrolled)
  useMotionValueEvent(scrollYProgress, 'change', useCallback((v: number) => {
    const idx = Math.min(TOTAL - 1, Math.floor(v * TOTAL));
    if (idx !== prevIdxRef.current) {
      prevIdxRef.current = idx;
      setActiveIdx(idx);
    }
  }, []));

  // Scroll thumb strip to keep active visible
  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const THUMB_H = 52 + 8;
    el.scrollTo({ top: Math.max(0, activeIdx * THUMB_H - el.clientHeight / 2 + THUMB_H / 2), behavior: 'smooth' });
  }, [activeIdx]);

  const jumpTo = useCallback((i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop;
    const h   = el.offsetHeight;
    window.scrollTo({ top: top + (i / TOTAL) * h, behavior: 'smooth' });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: `${TOTAL * 100}vh` }}
      aria-label="APEX events"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Background stack — GPU opacity composite */}
        <div className="absolute inset-0 bg-[#080808]">
          {EVENTS.map((item, i) => (
            <BgMedia key={item.slug} item={item} active={i === activeIdx} />
          ))}
        </div>

        {/* Left info panel */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-[480px]">
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              Events
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: 'opacity, transform' }}
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

        {/* Right thumbnail strip */}
        <div
          className="absolute right-10 md:right-14 top-1/2 -translate-y-1/2"
          style={{ maxHeight: '70vh' }}
        >
          <div
            ref={thumbRef}
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: '70vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {EVENTS.map((item, i) => (
              <Thumb
                key={item.slug}
                item={item}
                active={i === activeIdx}
                onClick={() => jumpTo(i)}
              />
            ))}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-8 left-8 md:left-14 lg:left-20">
          <div className="flex items-center gap-2">
            {EVENTS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width:           i === activeIdx ? 18 : 4,
                  opacity:         i === activeIdx ? 1 : 0.22,
                  backgroundColor: i === activeIdx ? APEX_RED : '#fff',
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="h-[2px] rounded-full"
                style={{ willChange: 'width, opacity' }}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[0.56rem] font-bold tracking-[0.22em] uppercase text-white/22">
            Scroll to explore
          </p>
        </div>

      </div>
    </section>
  );
}
