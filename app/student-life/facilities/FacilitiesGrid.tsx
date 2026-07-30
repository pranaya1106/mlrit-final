'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, stagger, useAnimate, useDragControls } from 'framer-motion';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

const SPRING = { type: 'spring', damping: 20, mass: 1, stiffness: 140 } as const;
const MODAL_SPRING = { type: 'spring', damping: 28, mass: 1, stiffness: 220 } as const;

/* ── Data ── */
interface Facility {
  title: string;
  tag: string;
  desc: string;
  cover: string;           // single card image
  images: string[];        // modal gallery (may be same as [cover] for ATM)
  col: number;
  row: number;
}

const FACILITIES: Facility[] = [
  {
    title: 'Green Campus',
    tag: '31 Acres · Solar Powered',
    desc: 'A lush 31-acre solar-powered campus in Dundigal — tree-lined pathways, open sports grounds, and natural ventilation across every building. Designed to reduce carbon footprint while giving students a calm, green space to learn and grow.',
    cover: '/images/campus/entrance.png',
    images: [
      '/images/campus/entrance.png',
      '/images/facilities/campus/campus-7P5A2397.jpg',
      '/images/facilities/campus/campus-7P5A1225.jpg',
      '/images/facilities/campus/campus-7P5A1958.jpg',
      '/images/facilities/campus/campus-7P5A1967.jpg',
    ],
    col: 2, row: 2,
  },
  {
    title: 'Cafeteria',
    tag: '8 AM – 8 PM · Multi-cuisine',
    desc: 'A spacious open-air dining hall serving South Indian, North Indian, and continental meals from 8 AM to 8 PM. Outdoor stalls by Nescafé, Frankie, and local vendors keep the campus buzzing all day.',
    cover: '/images/campus/dining-hall.png',
    images: [
      '/images/campus/dining-hall.png',
      '/images/campus/canteen-friends.png',
      '/images/facilities/campus/cafeteria-1.jpg',
      '/images/facilities/campus/cafeteria-2.jpg',
      '/images/facilities/campus/cafeteria-3.jpg',
    ],
    col: 1, row: 1,
  },
  {
    title: 'STI Hub',
    tag: 'Innovation · Startups',
    desc: 'The Student Technology and Innovation Hub is supported by AIM — Atal Innovation Mission. It provides co-working space, prototyping labs, and mentorship to student entrepreneurs and research teams.',
    cover: '/images/facilities/campus/sti-hub-1.jpg',
    images: [
      '/images/facilities/campus/sti-hub-1.jpg',
      '/images/facilities/lab-wind-tunnel.png',
      '/images/facilities/campus/sti-hub-2.jpg',
      '/images/facilities/campus/sti-hub-3.jpg',
      '/images/facilities/campus/sti-hub-4.jpg',
    ],
    col: 1, row: 1,
  },
  {
    title: 'Library',
    tag: 'Books · Journals · Digital',
    desc: 'The Marri Balreddy Library spans two floors with over 50,000 volumes, subscriptions to IEEE and Springer journals, a digital kiosk for self-checkout, and quiet reading zones where students can focus without distraction.',
    cover: '/images/facilities/campus/library-wide-1.jpg',
    images: [
      '/images/facilities/campus/library-wide-1.jpg',
      '/images/facilities/campus/library-wide-2.jpg',
      '/images/facilities/campus/library-stacks-1.jpg',
      '/images/facilities/campus/library-stacks-2.jpg',
      '/images/facilities/campus/library-reading-1.jpg',
      '/images/facilities/campus/library-reading-2.jpg',
      '/images/facilities/campus/library-desk.jpg',
      '/images/facilities/campus/library-entrance.jpg',
    ],
    col: 2, row: 1,
  },
  {
    title: 'Hospital',
    tag: 'On-Campus Medical',
    desc: 'A fully staffed on-campus hospital offering free medical care to all students and hostel residents, 24/7. From first aid to specialist referrals — healthcare is always within walking distance.',
    cover: '/images/facilities/campus/hospital-1.jpg',
    images: [
      '/images/facilities/campus/hospital-1.jpg',
      '/images/facilities/campus/hospital-2.jpg',
    ],
    col: 1, row: 1,
  },
  {
    title: 'Stationery',
    tag: 'Campus Store',
    desc: 'The campus stationery store stocks textbooks, lab supplies, stationery, and electronics accessories — everything you need for coursework, available right on campus at affordable prices.',
    cover: '/images/facilities/campus/stationery-1.jpg',
    images: [
      '/images/facilities/campus/stationery-1.jpg',
      '/images/facilities/campus/stationery-2.jpg',
    ],
    col: 1, row: 1,
  },
  {
    title: 'ATM',
    tag: 'Banking · On-Campus',
    desc: 'A bank ATM is located on campus for 24/7 cash access. No need to travel off campus — banking essentials are available right where you study.',
    cover: '/images/facilities/campus/atm-1.jpg',
    images: [
      '/images/facilities/campus/atm-1.jpg',
    ],
    col: 1, row: 1,
  },
];

/* ── Word-by-word animated text ── */
function AnimatedText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [scope, animate] = useAnimate();
  useEffect(() => {
    animate(
      'span',
      { opacity: 1, filter: 'blur(0px)', y: 0 },
      { duration: 0.4, delay: stagger(0.025, { startDelay: 0.1 }) }
    );
  }, [animate]);
  return (
    <div ref={scope} className={className} style={style}>
      {text.split(' ').map((word, i) => (
        <motion.span key={i} className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}>
          {word}
        </motion.span>
      ))}
    </div>
  );
}

/* ── Modal with auto-rotate + drag ── */
function FacilityModal({ facility, onClose }: { facility: Facility; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const dragControls = useDragControls();
  const n = facility.images.length;
  const isLocal = (s: string) => s.startsWith('/');

  const prev = useCallback(() => setActive(p => (p - 1 + n) % n), [n]);
  const next = useCallback(() => setActive(p => (p + 1) % n), [n]);

  /* Auto-rotate every 3 s — pauses when only 1 image */
  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [n, next]);

  /* Keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, next, prev]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0"
        style={{ background: 'rgba(10,9,8,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-5xl overflow-hidden"
        style={{ backgroundColor: '#111009', borderRadius: 24, maxHeight: '92vh' }}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 64 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 48 }}
        transition={MODAL_SPRING}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row" style={{ maxHeight: '92vh' }}>

          {/* ── Left: image gallery with drag ── */}
          <div className="relative flex-none md:w-[58%] bg-black overflow-hidden" style={{ minHeight: 300 }}>

            {/* Draggable image strip */}
            <motion.div
              className="flex h-full"
              drag="x"
              dragControls={dragControls}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) next();
                else if (info.offset.x > 60) prev();
              }}
              style={{ cursor: n > 1 ? 'grab' : 'default', touchAction: 'pan-y' }}
              whileDrag={{ cursor: 'grabbing' }}
            >
              <AnimatePresence mode="sync">
                <motion.div key={active} className="absolute inset-0"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <Image src={facility.images[active]} alt={facility.title} fill
                    className="object-cover" quality={92} unoptimized={isLocal(facility.images[active])} />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Bottom gradient for thumbnails */}
            {n > 1 && (
              <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{
                height: 100, background: 'linear-gradient(to top, rgba(17,16,9,0.97) 0%, transparent 100%)'
              }} />
            )}

            {/* Thumbnails */}
            {n > 1 && (
              <div className="absolute bottom-3 inset-x-3 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {facility.images.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className="flex-none relative overflow-hidden transition-all duration-200"
                    style={{
                      width: 46, height: 34, borderRadius: 6,
                      outline: i === active ? '2px solid #e85d04' : '2px solid transparent',
                      outlineOffset: 1, opacity: i === active ? 1 : 0.5,
                    }}
                    aria-label={`Photo ${i + 1}`}>
                    <Image src={src} alt="" fill className="object-cover" quality={40} unoptimized={isLocal(src)} />
                  </button>
                ))}
              </div>
            )}

            {/* Prev / Next arrows */}
            {n > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10"
                  style={{ background: 'rgba(10,9,8,0.72)', backdropFilter: 'blur(4px)' }} aria-label="Previous">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </button>
                <button onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10"
                  style={{ background: 'rgba(10,9,8,0.72)', backdropFilter: 'blur(4px)' }} aria-label="Next">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2L10 7L5 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </button>
              </>
            )}

            {/* Auto-rotate progress bar */}
            {n > 1 && (
              <motion.div
                key={`bar-${active}`}
                className="absolute top-0 left-0 h-[2px]"
                style={{ background: '#e85d04', originX: 0 }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            )}
          </div>

          {/* ── Right: info panel ── */}
          <div className="flex-1 flex flex-col p-7 md:p-10 overflow-y-auto">
            {/* Close button */}
            <div className="flex justify-end mb-5">
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="Close">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1L10 10M10 1L1 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Tag */}
            <motion.p className="font-mono font-bold uppercase mb-3"
              style={{ fontSize: '0.57rem', letterSpacing: '0.22em', color: '#e85d04' }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.32 }}>
              {facility.tag}
            </motion.p>

            {/* Title */}
            <motion.h2 className="font-sans font-black text-white mb-5 leading-none"
              style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.38 }}>
              {facility.title}
            </motion.h2>

            {/* Rule */}
            <motion.div className="mb-6"
              style={{ height: 1, background: 'rgba(255,255,255,0.08)' }}
              initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.18, duration: 0.5 }} />

            {/* Description */}
            <AnimatedText text={facility.desc}
              className="font-sans leading-relaxed text-white/55"
              style={{ fontSize: 'clamp(0.875rem, 1.15vw, 0.975rem)' }} />

            {/* Counter */}
            {n > 1 && (
              <motion.p className="font-mono text-white/20 mt-auto pt-8"
                style={{ fontSize: '0.58rem', letterSpacing: '0.14em' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {active + 1} / {n} · drag or use ← → keys
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Bento card — single cover photo, hover reveals label + "explore" CTA, click opens modal ── */
function BentoCard({ facility, onOpen }: { facility: Facility; onOpen: () => void }) {
  const isLocal = (s: string) => s.startsWith('/');

  return (
    <motion.article
      className="relative w-full h-full overflow-hidden rounded-2xl cursor-pointer select-none"
      onClick={onOpen}
      whileHover="hover"
      whileTap={{ scale: 0.975 }}
      initial="rest"
      animate="rest"
      role="button"
      tabIndex={0}
      aria-label={`Open ${facility.title}`}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
    >
      {/* Single cover image — subtle scale on hover */}
      <motion.div className="absolute inset-0 will-change-transform"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.055 } }}
        transition={SPRING}>
        <Image src={facility.cover} alt={facility.title} fill
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          className="object-cover" quality={85} unoptimized={isLocal(facility.cover)} />
      </motion.div>

      {/* Persistent bottom vignette */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.15) 55%, transparent 100%)',
      }} />

      {/* Hover: top-left "EXPLORE" pill */}
      <motion.div
        className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full px-2.5 py-[5px]"
        style={{ background: '#e85d04' }}
        variants={{ rest: { opacity: 0, y: -6, scale: 0.9 }, hover: { opacity: 1, y: 0, scale: 1 } }}
        transition={{ duration: 0.18 }} aria-hidden="true">
        <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
          <path d="M4 1v6M1 4h6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="font-mono font-bold text-white" style={{ fontSize: '0.5rem', letterSpacing: '0.16em' }}>
          EXPLORE
        </span>
      </motion.div>

      {/* Resting label — fades out on hover */}
      <motion.div className="absolute bottom-0 inset-x-0 p-4"
        variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: 6 } }}
        transition={{ duration: 0.18 }}>
        <p className="font-sans font-extrabold text-white leading-snug"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', letterSpacing: '-0.02em' }}>
          {facility.title}
        </p>
      </motion.div>

      {/* Hover label — slides up */}
      <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none">
        <motion.p className="font-mono font-bold uppercase text-white/55 mb-1"
          style={{ fontSize: '0.54rem', letterSpacing: '0.2em' }}
          variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          transition={{ ...SPRING, delay: 0 }}>
          {facility.tag}
        </motion.p>
        <motion.p className="font-sans font-extrabold text-white leading-snug"
          style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', letterSpacing: '-0.02em' }}
          variants={{ rest: { opacity: 0, y: 12 }, hover: { opacity: 1, y: 0 } }}
          transition={{ ...SPRING, delay: 0.04 }}>
          {facility.title}
        </motion.p>
      </div>
    </motion.article>
  );
}

/* ── Grid ── */
export default function FacilitiesGrid() {
  const [open, setOpen] = useState<Facility | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <section aria-label="Campus facilities" className="bg-[#faf7f0] py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-16">

          {/* Section eyebrow */}
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10" style={{ background: '#e85d04', opacity: 0.5 }} />
            <span className="font-mono font-bold uppercase text-ink/30"
              style={{ fontSize: '0.6rem', letterSpacing: '0.22em' }}>
              On-Campus Facilities
            </span>
          </div>

          <Stagger className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }} delay={0.06}>

            {/* Green Campus 2×2 */}
            <StaggerItem style={{ gridColumn: 'span 2', gridRow: 'span 2', minHeight: 500 }}>
              <BentoCard facility={FACILITIES[0]} onOpen={() => setOpen(FACILITIES[0])} />
            </StaggerItem>

            {/* Cafeteria 1×1 */}
            <StaggerItem style={{ gridColumn: 'span 1', minHeight: 240 }}>
              <BentoCard facility={FACILITIES[1]} onOpen={() => setOpen(FACILITIES[1])} />
            </StaggerItem>

            {/* STI Hub 1×1 */}
            <StaggerItem style={{ gridColumn: 'span 1', minHeight: 240 }}>
              <BentoCard facility={FACILITIES[2]} onOpen={() => setOpen(FACILITIES[2])} />
            </StaggerItem>

            {/* Library 2×1 */}
            <StaggerItem style={{ gridColumn: 'span 2', minHeight: 240 }}>
              <BentoCard facility={FACILITIES[3]} onOpen={() => setOpen(FACILITIES[3])} />
            </StaggerItem>

            {/* Hospital 1×1 */}
            <StaggerItem style={{ gridColumn: 'span 1', minHeight: 210 }}>
              <BentoCard facility={FACILITIES[4]} onOpen={() => setOpen(FACILITIES[4])} />
            </StaggerItem>

            {/* Stationery 1×1 */}
            <StaggerItem style={{ gridColumn: 'span 1', minHeight: 210 }}>
              <BentoCard facility={FACILITIES[5]} onOpen={() => setOpen(FACILITIES[5])} />
            </StaggerItem>

            {/* ATM 2×1 */}
            <StaggerItem style={{ gridColumn: 'span 2', minHeight: 210 }}>
              <BentoCard facility={FACILITIES[6]} onOpen={() => setOpen(FACILITIES[6])} />
            </StaggerItem>

          </Stagger>
        </div>
      </section>

      <AnimatePresence>
        {open && <FacilityModal facility={open} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
