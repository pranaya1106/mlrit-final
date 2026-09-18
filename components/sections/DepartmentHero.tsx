'use client';

/*
 * DepartmentHero — editorial "chapter cover" for each department page.
 *
 * Split spread on the dark ink canvas: a massive display department CODE
 * bleeding off the left, full name + facts underneath, meta chapter marks;
 * and a full-bleed photo panel on the right that carries the student-reel
 * carousel (quote + video card + thumbnail nav).
 *
 * Motion: entrance stagger — chapter mark → display code → full name → tagline
 * → facts pop up. Reel photo crossfades between slides. Corner bracket + ghost
 * numeral drift in on scroll.
 */

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowUpRight } from 'lucide-react';
import type { Department, DeptReel } from '@/lib/departments';

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

// Accent → orange primary anchor colour. Each department gets its own
// hairline colour so the chapter feels distinct.
function accentHex(a: Department['accent']): string {
  if (a === 'green')  return '#01741f';
  if (a === 'navy')   return '#1e3a5f';
  return '#e85d04';
}

export default function DepartmentHero({
  department,
  reels = [],
}: {
  department: Department;
  reels?: DeptReel[];
}) {
  const d = department;
  const accent = accentHex(d.accent);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const hasReels = reels.length > 0;
  const reel = hasReels ? reels[active] : null;

  const go = useCallback(
    (idx: number) => {
      setDir(idx > active ? 1 : -1);
      setActive(idx);
    },
    [active],
  );
  const prev = () => go((active - 1 + reels.length) % reels.length);
  const next = () => go((active + 1) % reels.length);

  // Auto-advance every 6s
  useEffect(() => {
    if (!hasReels || reels.length < 2 || modalOpen) return;
    const t = window.setInterval(next, 6000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, hasReels, modalOpen]);

  // ESC closes modal
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  return (
    <>
      <section
        className="relative w-full bg-black text-white overflow-hidden"
        style={{ minHeight: 'clamp(640px, 92vh, 900px)' }}
      >
        {/* Ambient grid pattern behind everything — echoes the club pages */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[0]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(114,114,114,1) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(114,114,114,1) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
            opacity: 0.08,
            WebkitMaskImage:
              'radial-gradient(ellipse 60% 55% at 30% 45%, #000 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 60% 55% at 30% 45%, #000 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
          }}
        />

        {/* Ghost department code — HUGE, bleeds off the left edge, ~7% opacity */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute -left-4 md:-left-8 lg:-left-10 top-1/2 -translate-y-1/2 pointer-events-none select-none z-[0] hidden md:block"
        >
          <div
            className="font-sans font-black leading-[0.78] tracking-tighter-3 whitespace-nowrap"
            style={{
              fontSize: 'clamp(18rem, 34vw, 42rem)',
              color: 'rgba(255,255,255,0.06)',
            }}
          >
            {d.code}
          </div>
        </motion.div>

        {/* Corner bracket top-right — signature mark in accent color */}
        <div
          aria-hidden
          className="absolute top-8 right-8 w-8 h-8 pointer-events-none hidden md:block z-[3]"
        >
          <span className="absolute top-0 right-0 w-full h-px" style={{ backgroundColor: accent }} />
          <span className="absolute top-0 right-0 w-px h-full" style={{ backgroundColor: accent }} />
        </div>

        {/* Content grid */}
        <div className="relative z-[2] max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pt-8 md:pt-10 pb-14 md:pb-20 min-h-full h-full grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-y-10 lg:gap-x-14 items-stretch"
             style={{ minHeight: 'clamp(640px, 92vh, 900px)' }}
        >
          {/* ═════════ LEFT COLUMN — EDITORIAL SPREAD ═════════ */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
            className="relative flex flex-col justify-between py-4 md:py-6"
          >
            {/* TOP — chapter mark + breadcrumb */}
            <motion.div variants={fadeUp}>
              <Link
                href="/academics/undergraduate"
                className="inline-flex items-center gap-2 font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/45 hover:text-white transition-colors"
              >
                ← Academics
              </Link>
              <div className="mt-4 flex items-center gap-3">
                <span aria-hidden className="h-px w-8" style={{ backgroundColor: accent }} />
                <span
                  className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase"
                  style={{ color: accent }}
                >
                  Department · {d.degree}
                </span>
              </div>
            </motion.div>

            {/* CENTER — display code + full name */}
            <motion.div variants={fadeUp} className="mt-8 md:mt-12 lg:mt-4">
              {/* Display department code — massive Manrope Black in accent */}
              <div className="relative">
                <motion.h1
                  initial={{ opacity: 0, y: 40, letterSpacing: '-0.02em' }}
                  animate={{ opacity: 1, y: 0, letterSpacing: '-0.06em' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
                  className="font-sans font-black leading-[0.85] text-white"
                  style={{
                    fontSize: 'clamp(4rem, 10vw, 10rem)',
                    color: accent,
                    textShadow: '0 4px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  {d.code}
                </motion.h1>
                {/* Underline hairline */}
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
                  className="block mt-3 md:mt-4 h-px origin-left"
                  style={{ width: '30%', backgroundColor: 'rgba(255,255,255,0.35)' }}
                />
              </div>

              {/* Full department name */}
              <motion.h2
                variants={fadeUp}
                className="mt-6 md:mt-8 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.6rem,2.8vw,2.6rem)] max-w-[24ch]"
              >
                {d.name}
              </motion.h2>

              {/* Tagline */}
              <motion.p
                variants={fadeUp}
                className="mt-5 md:mt-6 text-white/60 leading-[1.65] text-[0.98rem] md:text-[1.05rem] max-w-[48ch]"
              >
                {d.tagline}
              </motion.p>
            </motion.div>

            {/* BOTTOM — facts strip + CTAs */}
            <motion.div variants={fadeUp} className="mt-10 md:mt-12">
              {/* Facts strip — hairline separated */}
              <div className="relative pt-5 grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6 max-w-[560px]">
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
                  className="absolute top-0 left-0 right-0 h-px bg-white/15 origin-left"
                />
                {[
                  ['Degree',   d.degree],
                  ['Duration', d.duration],
                  ['Level',    d.level.toUpperCase()],
                  ['Chapter',  '§ 03'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="font-mono text-[0.58rem] font-bold tracking-[0.24em] uppercase text-white/40">
                      {k}
                    </div>
                    <div className="mt-1 text-white text-[0.94rem] leading-snug font-medium">
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA row */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/admissions/overview"
                  style={{ backgroundColor: accent, color: '#fff' }}
                  className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] transition-all duration-300 shadow-md"
                >
                  Admissions
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#overview"
                  className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
                >
                  Read the programme
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* ═════════ RIGHT COLUMN — PHOTO PANEL + REEL ═════════ */}
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
            className="relative min-h-[400px] lg:min-h-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10"
          >
            {hasReels && reel ? (
              <>
                {/* Photo layer — crossfades between reels */}
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.div
                    key={`bg-${active}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute inset-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reel.thumbnail}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Dark wash for legibility */}
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.75) 100%)',
                  }}
                />

                {/* TOP-LEFT — mono caption */}
                <div className="absolute top-5 left-5 md:top-6 md:left-6 z-[2]">
                  <div className="font-mono text-[0.62rem] font-bold tracking-[0.24em] uppercase text-white/70">
                    § In their words
                  </div>
                </div>

                {/* TOP-RIGHT — slide counter */}
                <div className="absolute top-5 right-5 md:top-6 md:right-6 z-[2] font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/70 tabular-nums">
                  {String(active + 1).padStart(2, '0')} / {String(reels.length).padStart(2, '0')}
                </div>

                {/* BOTTOM — quote + video card + nav */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-[2]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`quote-${active}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"
                    >
                      {/* Quote */}
                      <blockquote className="max-w-[420px]">
                        <p
                          className="text-white font-medium tracking-[-0.005em] leading-[1.35]"
                          style={{ fontSize: 'clamp(1rem, 1.4vw, 1.25rem)' }}
                        >
                          &ldquo;{reel.quote}&rdquo;
                        </p>
                        <cite className="not-italic mt-3 flex flex-col gap-0.5">
                          <span className="font-sans font-semibold text-white text-[0.9rem]">
                            {reel.name}
                          </span>
                          <span className="font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase text-white/55">
                            {reel.role}
                          </span>
                        </cite>
                      </blockquote>

                      {/* Play button */}
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        aria-label="Watch the reel"
                        className="group inline-flex items-center gap-2.5 h-11 pl-3 pr-4 rounded-full bg-white/90 text-neutral-900 hover:bg-white transition-colors shrink-0 self-start md:self-end"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white">
                          <Play className="w-3 h-3 fill-current translate-x-[1px]" />
                        </span>
                        <span className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase">
                          Watch reel
                        </span>
                      </button>
                    </motion.div>
                  </AnimatePresence>

                  {/* Nav dots — bottom center */}
                  {reels.length > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous"
                        className="mr-2 w-6 h-6 rounded-full text-white/60 hover:text-white grid place-items-center transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M13 4l-6 6 6 6" /></svg>
                      </button>
                      {reels.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => go(i)}
                          aria-label={`Go to reel ${i + 1}`}
                          className={`h-[3px] rounded-full transition-all duration-500 ${
                            i === active ? 'w-8 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'
                          }`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={next}
                        aria-label="Next"
                        className="ml-2 w-6 h-6 rounded-full text-white/60 hover:text-white grid place-items-center transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M7 4l6 6-6 6" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* No reels — fallback ambient panel with accent gradient */
              <div
                className="absolute inset-0 flex items-end p-6 md:p-8"
                style={{
                  background:
                    `radial-gradient(circle at 30% 20%, ${accent}55, transparent 55%),` +
                    'linear-gradient(180deg, #0b0b0d 0%, #050506 100%)',
                }}
              >
                <div>
                  <div className="font-mono text-[0.62rem] font-bold tracking-[0.24em] uppercase text-white/70">
                    § Chapter cover
                  </div>
                  <div className="mt-3 font-sans font-black text-white text-[2.5rem] leading-tight tracking-tight">
                    {d.short}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═════════ Reel modal ═════════ */}
      <AnimatePresence>
        {modalOpen && reel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95"
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Instagram Reel player"
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] font-extrabold tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors rounded px-2 py-1"
            >
              Close
            </button>
            <motion.a
              href={reel.reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="group relative flex flex-col items-center justify-center w-[min(360px,90vw)] aspect-[9/16] md:h-[min(80vh,600px)] md:w-auto rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reel.thumbnail}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
              <span className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
                <svg viewBox="0 0 48 48" className="w-14 h-14 drop-shadow-lg" aria-hidden="true">
                  <defs>
                    <radialGradient id="ig-grad-dept" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect width="48" height="48" rx="12" fill="url(#ig-grad-dept)" />
                  <circle cx="24" cy="24" r="9" fill="none" stroke="#fff" strokeWidth="3" />
                  <circle cx="34.5" cy="13.5" r="2.5" fill="#fff" />
                </svg>
                <div>
                  <p className="font-sans font-black text-white text-[1.1rem] leading-snug">Watch on Instagram</p>
                  <p className="mt-1 font-mono text-[0.65rem] font-bold tracking-[0.14em] uppercase text-white/60">
                    Tap to open reel ↗
                  </p>
                </div>
                <div className="mt-2 border-t border-white/20 pt-4 w-full">
                  <p className="font-sans font-semibold text-white text-[0.88rem]">{reel.name}</p>
                  <p className="font-mono text-[0.62rem] font-bold tracking-[0.12em] uppercase text-white/50 mt-0.5">
                    {reel.role}
                  </p>
                </div>
              </span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
