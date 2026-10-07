'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const CAME_ORANGE = '#F5760A';

interface EventItem {
  slug: string;
  name: string;
  tag: string;
  caption: string;
  /** Web-sized poster derivative. Absent for the one source file that's corrupted —
   *  falls back to `gradient` instead, same as the mock data's own posterGradient field. */
  src?: string;
  gradient: string;
}

// Real event posters from lib/clubs.ts. Several of the originals are far too
// large to serve directly (one PNG was 15000×7500 / 58MB) — web-sized JPEG
// derivatives live alongside them in events/web/, originals untouched.
// came-independence-day.png (and its -new twin) is a corrupted file that
// won't decode, so that one event falls back to its posterGradient.
const EVENTS: EventItem[] = [
  { slug: 'came-hellenic', name: 'Hellenic', tag: 'Signature Event', caption: 'A high-energy campus event with changing themes — student performances, skits, live music by Band Echo, movie team interaction, and DJ.', src: '/images/clubs/events/web/came-hellenic-web.jpg', gradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)' },
  { slug: 'came-navrat-naveli', name: 'Navrat Naveli', tag: 'Cultural Fest', caption: 'A vibrant cultural celebration featuring Bathukamma, traditional rituals, Garba, skits, and prize distribution.', src: '/images/clubs/events/web/came-navrat-naveli-web.jpg', gradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)' },
  { slug: 'came-ecstacy', name: 'Ecstacy', tag: 'Concert Night', caption: 'High-energy concert night featuring live performances by artists invited from outside the institution.', src: '/images/clubs/events/web/came-ecstacy-web.jpg', gradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)' },
  { slug: 'came-kite-fest', name: 'Kite Fest', tag: 'Festive Event', caption: 'A festive celebration of Bhogi — Rangoli competitions, kite flying, and campus-wide participation marking the harvest season.', src: '/images/clubs/events/web/came-kite-fest-web.jpg', gradient: 'linear-gradient(155deg, #1a3a5f 0%, #2563eb 55%, #1e40af 100%)' },
  { slug: 'came-graduation', name: 'Graduation Day', tag: 'Ceremonial', caption: 'Academic procession, lamp lighting, graduation oath, gold medal distribution, and cultural performances celebrating the graduating batch.', src: '/images/clubs/events/web/came-graduation-web.jpg', gradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)' },
  { slug: 'came-annual-day', name: 'Annual Day', tag: 'Institution Event', caption: "MLRIT's flagship annual celebration — student cultural performances, awards, and recognition of achievement across the institution.", src: '/images/clubs/events/web/came-annual-day-web.jpg', gradient: 'linear-gradient(155deg, #2d1a00 0%, #92400e 55%, #451a03 100%)' },
  { slug: 'came-orientation', name: 'Orientation Day', tag: 'Ceremonial', caption: 'Welcome programme for incoming students — cultural performances, introductions, and the official start of campus life at MLRIT.', src: '/images/clubs/events/web/came-orientation-web.jpg', gradient: 'linear-gradient(155deg, #0f2a1a 0%, #166534 55%, #0f2a1a 100%)' },
  { slug: 'came-independence-day', name: 'Independence Day', tag: 'National Event', caption: "Flag hoisting, patriotic performances, drama, and student presentations marking India's Independence Day on campus.", gradient: 'linear-gradient(155deg, #0f2a0f 0%, #15803d 55%, #1a3a0a 100%)' },
  { slug: 'came-republic-day', name: 'Republic Day', tag: 'National Event', caption: "Flag hoisting, march past, patriotic cultural performances, and campus celebrations marking India's Republic Day.", src: '/images/clubs/events/web/came-republic-day-web.jpg', gradient: 'linear-gradient(155deg, #0a1628 0%, #1d4ed8 55%, #0a1628 100%)' },
  { slug: 'came-traditional-day', name: 'Traditional Day', tag: 'Cultural Event', caption: "A day celebrating India's cultural diversity — students dress in traditional attire from their home states, with performances and cultural showcases.", src: '/images/clubs/events/web/came-traditional-day-web.jpg', gradient: 'linear-gradient(155deg, #3a1a00 0%, #c2410c 55%, #3a1a00 100%)' },
];

const TOTAL = EVENTS.length;

// ─── Background — blurred, darkened copy of the poster for atmosphere ────────
function BgMedia({ item, active }: { item: EventItem; active: boolean }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ willChange: 'opacity' }}
    >
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(38px) saturate(1.3) brightness(0.42)', transform: 'scale(1.15)' }}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: item.gradient, opacity: 0.55 }} />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(10,7,5,0.86) 0%, rgba(10,7,5,0.55) 45%, rgba(10,7,5,0.3) 100%)' }}
      />
    </motion.div>
  );
}

// ─── Foreground poster — shown whole, never cropped. Sits in the band between
// the left info panel and the right thumbnail strip; hidden below lg where
// that band gets too narrow (the blurred backdrop + text carry the section).
// Falls back to a plain gradient tile for the one event with no valid image.
// Only the active card is ever mounted (via AnimatePresence below), so the
// gradient tile's event-name text never cross-fades on top of a neighboring
// poster the way two photos can safely dissolve into each other.
function PosterCard({ item }: { item: EventItem }) {
  return (
    <motion.div
      key={item.slug}
      className="hidden lg:flex absolute inset-y-0 items-center justify-center pointer-events-none"
      style={{ left: 'clamp(420px, 38vw, 560px)', right: 'clamp(120px, 12vw, 180px)' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {item.src ? (
        <div
          className="relative rounded-xl overflow-hidden shadow-2xl"
          style={{ height: '62vh', maxWidth: '100%', boxShadow: '0 30px 80px rgba(0,0,0,0.55)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.name}
            className="block h-full w-auto max-w-full object-contain bg-black/40"
            draggable={false}
          />
        </div>
      ) : (
        <div
          className="relative rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
          style={{ height: '52vh', width: '380px', maxWidth: '100%', background: item.gradient, boxShadow: '0 30px 80px rgba(0,0,0,0.55)' }}
        >
          <span
            className="font-sans font-black text-white/85 text-center px-8"
            style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)' }}
          >
            {item.name}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────────
function Thumb({ item, active, onClick }: { item: EventItem; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{ scale: active ? 1.1 : 0.9, opacity: active ? 1 : 0.45 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="relative flex-shrink-0 rounded-lg overflow-hidden"
      style={{ width: 52, height: 52, willChange: 'transform, opacity' }}
      aria-label={item.name}
      aria-pressed={active}
    >
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.src} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      ) : (
        <div className="absolute inset-0" style={{ background: item.gradient }} />
      )}
      {active && (
        <motion.div
          layoutId="came-thumb-ring"
          className="absolute inset-0 rounded-lg"
          style={{ border: `2px solid ${CAME_ORANGE}`, willChange: 'transform' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CameEventsGallery() {
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

  const jumpTo = useCallback((i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop;
    const h   = el.offsetHeight;
    window.scrollTo({ top: top + (i / TOTAL) * h, behavior: 'smooth' });
  }, []);

  const active = EVENTS[activeIdx];

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: `${TOTAL * 100}vh` }}
      aria-label="CAME events"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Background stack — blurred poster atmosphere */}
        <div className="absolute inset-0 bg-[#0a0705]">
          {EVENTS.map((item, i) => (
            <BgMedia key={item.slug} item={item} active={i === activeIdx} />
          ))}
        </div>

        {/* Foreground poster — only the active card is mounted at a time */}
        <AnimatePresence mode="wait">
          <PosterCard key={active.slug} item={active} />
        </AnimatePresence>

        {/* Left info panel */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-[480px] z-10">
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: CAME_ORANGE }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: CAME_ORANGE }}>
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
                style={{ background: `${CAME_ORANGE}22`, border: `1px solid ${CAME_ORANGE}55`, color: CAME_ORANGE }}
              >
                {active.tag}
              </div>
              <h2
                className="font-sans font-black text-white leading-[1.02] mb-3"
                style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)' }}
              >
                {active.name}
              </h2>
              <p className="text-white/55 text-[0.95rem] leading-[1.65] max-w-[340px]">
                {active.caption}
              </p>
              <div className="mt-5 font-mono text-[0.56rem] font-bold tracking-[0.22em] uppercase text-white/25">
                {String(activeIdx + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right thumbnail strip */}
        <div
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10"
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
        <div className="absolute bottom-8 left-8 md:left-14 lg:left-20 z-10">
          <div className="flex items-center gap-2">
            {EVENTS.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width:           i === activeIdx ? 18 : 4,
                  opacity:         i === activeIdx ? 1 : 0.22,
                  backgroundColor: i === activeIdx ? CAME_ORANGE : '#fff',
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
