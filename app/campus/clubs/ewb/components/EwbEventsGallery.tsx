'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const EWB_GREEN = '#3FAE5C';

interface EventItem {
  slug: string;
  name: string;
  tag: string;
  caption: string;
  gradient: string;
}

// No event photography exists for this chapter yet in lib/clubs.ts — same as
// the site's generic club template, each event is its own gradient tile
// rather than a cropped/guessed placeholder photo.
const EVENTS: EventItem[] = [
  { slug: 'ewb-eloqvent', name: 'Eloqvent', tag: 'Flagship', caption: 'An engaging event helping students master communication and soft skills while developing viable, sustainable business models.', gradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)' },
  { slug: 'ewb-esfr', name: 'ESF-R', tag: 'Regional', caption: 'Engineers Student Forum Regional — students collaborate to pitch and build robust, real-world business models.', gradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)' },
  { slug: 'ewb-bio-brick', name: 'Bio-Brick Project', tag: 'Sustainability', caption: 'Converting organic waste into eco-friendly fuel briquettes for cleaner energy in underserved communities.', gradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)' },
  { slug: 'ewb-uppetur', name: 'UpPETure', tag: 'Innovation', caption: 'Upcycling discarded plastic bottles into durable, valuable products to fight plastic pollution.', gradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)' },
];

const TOTAL = EVENTS.length;

// ─── Background — full-bleed wash of the event's gradient ────────────────────
function BgMedia({ item, active }: { item: EventItem; active: boolean }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{ willChange: 'opacity' }}
    >
      <div className="absolute inset-0" style={{ background: item.gradient, opacity: 0.6 }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(7,9,7,0.88) 0%, rgba(7,9,7,0.55) 45%, rgba(7,9,7,0.25) 100%)' }}
      />
    </motion.div>
  );
}

// ─── Foreground tile — event name on its own gradient card.
// Only the active card is ever mounted (via AnimatePresence below), so two
// names never cross-fade on top of each other the way two photos safely can.
function EventCard({ item }: { item: EventItem }) {
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
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl flex items-center justify-center text-center px-10"
        style={{ height: '52vh', width: '400px', maxWidth: '100%', background: item.gradient, boxShadow: '0 30px 80px rgba(0,0,0,0.55)' }}
      >
        <span
          className="font-sans font-black text-white/90"
          style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)' }}
        >
          {item.name}
        </span>
      </div>
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
      <div className="absolute inset-0" style={{ background: item.gradient }} />
      {active && (
        <motion.div
          layoutId="ewb-thumb-ring"
          className="absolute inset-0 rounded-lg"
          style={{ border: `2px solid ${EWB_GREEN}`, willChange: 'transform' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EwbEventsGallery() {
  const sectionRef   = useRef<HTMLElement>(null);
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
      aria-label="EWB events"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Background stack */}
        <div className="absolute inset-0 bg-[#070907]">
          {EVENTS.map((item, i) => (
            <BgMedia key={item.slug} item={item} active={i === activeIdx} />
          ))}
        </div>

        {/* Foreground tile — only the active card is mounted at a time */}
        <AnimatePresence mode="wait">
          <EventCard key={active.slug} item={active} />
        </AnimatePresence>

        {/* Left info panel */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-[480px] z-10">
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: EWB_GREEN }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: EWB_GREEN }}>
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
                style={{ background: `${EWB_GREEN}22`, border: `1px solid ${EWB_GREEN}55`, color: EWB_GREEN }}
              >
                {active.tag}
              </div>
              <h2
                className="font-sans font-black text-white leading-[1.02] mb-3"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)' }}
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
        <div className="absolute right-10 md:right-14 top-1/2 -translate-y-1/2 z-10">
          <div className="flex flex-col gap-2">
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
                  backgroundColor: i === activeIdx ? EWB_GREEN : '#fff',
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
