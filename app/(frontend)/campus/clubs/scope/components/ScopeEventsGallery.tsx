'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const SCOPE_CYAN = '#00C2FF';

interface EventItem {
  slug: string;
  name: string;
  kind: string;
  caption: string;
  src: string;
  link?: string;
}

// Real event posters — portrait/square flyers, not landscape photos, so they're
// shown at their native aspect ratio (never cropped) with a blurred copy of the
// same poster filling the backdrop for atmosphere.
const EVENTS: EventItem[] = [
  {
    slug: 'zenith-25',
    name: 'ZENITH’25',
    kind: 'Annual Fest · 2-Day Hackathon',
    caption: "SCOPE's flagship annual fest — a 2-day hackathon and AWS Community Day, with a ₹75,000 prize pool across Agri-Tech, Med-Tech, and Ed-Tech.",
    src: '/images/clubs/events/zenith-25.png',
    link: 'https://www.instagram.com/p/DRKVKCGiFVK/?igsh=YmVjdjlnb3Nib2J3',
  },
  {
    slug: 'init-saga',
    name: 'INIT SAGA',
    kind: 'Flagship Hackathon',
    caption: 'A 2-day hackathon tackling real-world problems across travel, education, healthcare, and agri-tech — ₹20,000 prize pool, teams of 3–4.',
    src: '/images/clubs/events/init-saga.jpg',
    link: 'https://www.instagram.com/p/DH5V3ARIPXY/?igsh=MWR6eWRzZHd6a2MxeQ==',
  },
  {
    slug: 'aws-cloud-trek',
    name: 'AWS Cloud Trek',
    kind: 'Workshop',
    caption: 'A 2-day hands-on cloud workshop covering AWS S3, EC2, and custom-domain deployment — certificates and AWS swag for every participant.',
    src: '/images/clubs/events/aws-cloud-trek.jpg',
    link: 'https://www.instagram.com/p/DPghWlAD-CH/?igsh=MTBmYnFmdXc3bXQ4aw==',
  },
  {
    slug: 'aws-community-day',
    name: 'AWS Student Community Day',
    kind: 'Community Day',
    caption: 'A community day of speaker sessions on AI, ML, data engineering, and cloud — plus networking and AWS swag.',
    src: '/images/clubs/events/aws-community-day.jpg',
    link: 'https://www.instagram.com/p/DRUttHHD8wu/?igsh=ZXd1N3Y0Z2ZrdXRw',
  },
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(38px) saturate(1.3) brightness(0.42)', transform: 'scale(1.15)' }}
        draggable={false}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(7,9,11,0.86) 0%, rgba(7,9,11,0.55) 45%, rgba(7,9,11,0.3) 100%)' }}
      />
    </motion.div>
  );
}

// ─── Foreground poster — shown whole, never cropped. Sits in the band between
// the left info panel and the right thumbnail strip; hidden below lg where
// that band gets too narrow (the blurred backdrop + text carry the section).
function PosterCard({ item, active }: { item: EventItem; active: boolean }) {
  return (
    <motion.div
      className="hidden lg:flex absolute inset-y-0 items-center justify-center pointer-events-none"
      style={{ left: 'clamp(420px, 38vw, 560px)', right: 'clamp(120px, 12vw, 180px)' }}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.96 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      {active && (
        <motion.div
          layoutId="scope-thumb-ring"
          className="absolute inset-0 rounded-lg"
          style={{ border: `2px solid ${SCOPE_CYAN}`, willChange: 'transform' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
    </motion.button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ScopeEventsGallery() {
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
      aria-label="SCOPE events"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Background stack — blurred poster atmosphere */}
        <div className="absolute inset-0 bg-[#07090b]">
          {EVENTS.map((item, i) => (
            <BgMedia key={item.slug} item={item} active={i === activeIdx} />
          ))}
        </div>

        {/* Foreground posters — shown whole, never cropped */}
        {EVENTS.map((item, i) => (
          <PosterCard key={item.slug} item={item} active={i === activeIdx} />
        ))}

        {/* Left info panel */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-[480px] z-10">
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: SCOPE_CYAN }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: SCOPE_CYAN }}>
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
                style={{ background: `${SCOPE_CYAN}22`, border: `1px solid ${SCOPE_CYAN}55`, color: SCOPE_CYAN }}
              >
                {active.kind}
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
              {active.link && (
                <a
                  href={active.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-5 font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase transition-colors"
                  style={{ color: SCOPE_CYAN }}
                >
                  View recap ↗
                </a>
              )}
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
                  backgroundColor: i === activeIdx ? SCOPE_CYAN : '#fff',
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
