'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DeptReel } from '@/lib/departments';

type Props = {
  reels: DeptReel[];
  label?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function StudentReelSlider({ reels, label = 'In Their Words…' }: Props) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const go = useCallback((idx: number) => {
    setDir(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const prev = () => go((active - 1 + reels.length) % reels.length);
  const next = () => go((active + 1) % reels.length);

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  const reel = reels[active];

  return (
    <>
      {/* ── SECTION ─────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(520px, 80vh, 800px)' }}
        aria-label={label}
      >
        {/* ── Slide background image ── */}
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={`bg-${active}`}
            custom={dir}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={reel.thumbnail}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center scale-[1.03]"
            />
            {/* Dark cinematic overlay */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(12,12,14,0.25) 0%, rgba(12,12,14,0.1) 35%, rgba(12,12,14,0.6) 70%, rgba(12,12,14,0.82) 100%)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Content layer ─────────────────────────────── */}
        <div className="relative z-10 h-full flex flex-col justify-between px-8 md:px-14 lg:px-16 pt-10 pb-10 md:pb-12 max-w-[1600px] mx-auto">

          {/* Top-left: script label */}
          <p className="font-display italic text-white/80 text-[1.1rem] md:text-[1.3rem] tracking-wide select-none">
            {label}
          </p>

          {/* Bottom row: quote left, video card right */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">

            {/* ── Left: quote ── */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`quote-${active}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="flex flex-col gap-4 max-w-[600px]"
              >
                <blockquote className="font-display text-white text-[clamp(1.25rem,2.6vw,2rem)] leading-[1.3] font-normal">
                  {reel.quote}
                </blockquote>
                <cite className="not-italic flex flex-col gap-0.5">
                  <span className="font-sans font-semibold text-white text-[0.95rem]">
                    {reel.name}
                  </span>
                  <span className="font-mono text-[0.68rem] font-extrabold tracking-[0.16em] uppercase text-white/55">
                    {reel.role}
                  </span>
                </cite>
              </motion.div>
            </AnimatePresence>

            {/* ── Right: video card + nav ── */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              {/* Video thumbnail card */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.button
                  key={`card-${active}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
                  type="button"
                  onClick={() => setModalOpen(true)}
                  aria-label={`Watch Instagram Reel — ${reel.name}`}
                  className={[
                    'group relative overflow-hidden rounded-md',
                    'w-[clamp(240px,30vw,400px)] aspect-video',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50',
                    'transition-[transform,shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
                    'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                  ].join(' ')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reel.thumbnail}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* Subtle dark wash */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"
                  />
                  {/* Play circle */}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={[
                        'flex items-center justify-center w-12 h-12 rounded-full',
                        'bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.35)]',
                        'transition-[transform,background] duration-300',
                        'group-hover:scale-110 group-hover:bg-white',
                      ].join(' ')}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="#0c0c0e"
                        className="w-5 h-5 translate-x-[2px]"
                        aria-hidden="true"
                      >
                        <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
                      </svg>
                    </span>
                  </span>
                </motion.button>
              </AnimatePresence>

              {/* Nav row: ← thumbnails → */}
              {reels.length > 1 && (
                <div className="flex items-center gap-[10px]" role="group" aria-label="Testimonial navigation">
                  {/* Prev */}
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="flex items-center justify-center w-8 h-8 text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                      <path d="M13 4l-6 6 6 6" />
                    </svg>
                  </button>

                  {/* Thumbnail dots */}
                  {reels.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      aria-current={i === active ? 'true' : undefined}
                      className={[
                        'w-[42px] h-[42px] rounded-sm overflow-hidden transition-all duration-300',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
                        i === active
                          ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent opacity-100'
                          : 'opacity-50 hover:opacity-80 ring-1 ring-white/30',
                      ].join(' ')}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.thumbnail}
                        alt={`Testimonial ${i + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next testimonial"
                    className="flex items-center justify-center w-8 h-8 text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                      <path d="M7 4l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
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
            {/* Close */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] font-extrabold tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded px-2 py-1"
            >
              Close
            </button>

            {/* Watch on Instagram card */}
            <motion.a
              href={reel.reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="group relative flex flex-col items-center justify-center w-[min(360px,90vw)] aspect-[9/16] md:h-[min(80vh,600px)] md:w-auto rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              {/* Thumbnail background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reel.thumbnail}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Dark overlay */}
              <span className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

              {/* Instagram gradient badge */}
              <span className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
                {/* IG logo */}
                <svg viewBox="0 0 48 48" className="w-14 h-14 drop-shadow-lg" aria-hidden="true">
                  <defs>
                    <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497"/>
                      <stop offset="5%" stopColor="#fdf497"/>
                      <stop offset="45%" stopColor="#fd5949"/>
                      <stop offset="60%" stopColor="#d6249f"/>
                      <stop offset="90%" stopColor="#285AEB"/>
                    </radialGradient>
                  </defs>
                  <rect width="48" height="48" rx="12" fill="url(#ig-grad)"/>
                  <circle cx="24" cy="24" r="9" fill="none" stroke="#fff" strokeWidth="3"/>
                  <circle cx="34.5" cy="13.5" r="2.5" fill="#fff"/>
                </svg>

                <div>
                  <p className="font-sans font-black text-white text-[1.1rem] leading-snug">Watch on Instagram</p>
                  <p className="mt-1 font-mono text-[0.65rem] font-bold tracking-[0.14em] uppercase text-white/60">
                    Tap to open reel ↗
                  </p>
                </div>

                {/* Student info */}
                <div className="mt-2 border-t border-white/20 pt-4 w-full">
                  <p className="font-sans font-semibold text-white text-[0.88rem]">{reel.name}</p>
                  <p className="font-mono text-[0.62rem] font-bold tracking-[0.12em] uppercase text-white/50 mt-0.5">{reel.role}</p>
                </div>
              </span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
