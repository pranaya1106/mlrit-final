'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, Users, UserRound,
  GraduationCap, Pause, Play, Instagram, Linkedin,
} from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import { CATEGORY_ACCENT, type Club, type ClubEvent, type ClubMemoryImage } from '@/lib/clubs';

const INK = '#0c0c0e';

// ─── Shared UI ─────────────────────────────────────────────────────────────────

function Eyebrow({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-bold tracking-[0.26em] uppercase" style={{ color: accent ?? '#e85d04' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent ?? '#e85d04' }} aria-hidden />
      {children}
    </span>
  );
}

// ─── Viewport label — repeatable fade, both scroll directions ──────────────────
function ViewportLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="font-mono text-[0.58rem] font-bold tracking-[0.26em] uppercase text-white/25 select-none"
    >
      {children}
    </motion.span>
  );
}

// ─── Aurora background — NOT clipped, sits as fixed-like absolute layer ────────
// Key fix: section has position:relative but NO overflow:hidden at the section level.
// The aurora div uses position:absolute with its own overflow:hidden just for the image.
// Blobs extend beyond the image clip, remaining visible through the section bounds.

function Aurora({ image, accent }: { image: string; accent: string }) {
  return (
    <div aria-hidden className="absolute inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
      {/* Club image — blurred, very low opacity, fills section */}
      <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
        <Image
          src={image} alt="" fill
          className="object-cover"
          style={{ opacity: 0.18, filter: 'blur(40px) saturate(2)', transform: 'scale(1.12)' }}
          sizes="100vw" quality={25} priority={false}
        />
      </div>

      {/* Accent colour blob — top-left */}
      <motion.div
        className="absolute"
        style={{
          width: '70vw', height: '70vw',
          top: '-25%', left: '-20%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}38 0%, transparent 65%)`,
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, 28, 0], y: [0, -22, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Deep green blob — bottom-right */}
      <motion.div
        className="absolute"
        style={{
          width: '55vw', height: '55vw',
          bottom: '-20%', right: '-15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8,48,18,0.55) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
        animate={{ x: [0, -22, 0], y: [0, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Warm amber blob — centre */}
      <motion.div
        className="absolute"
        style={{
          width: '40vw', height: '40vw',
          top: '30%', left: '35%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(35,18,5,0.40) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={{ x: [0, 18, 0], y: [0, 26, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />

      {/* Readability scrim — always on top of blobs */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(12,12,14,0.52) 0%, rgba(12,12,14,0.38) 50%, rgba(12,12,14,0.60) 100%)' }}
      />
    </div>
  );
}

// ─── Sports-identical word-spotlight ──────────────────────────────────────────

function SpotlightWord({
  word, globalIdx, totalWords, progress,
}: {
  word: string;
  globalIdx: number;
  totalWords: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const band   = 0.82;
  const half   = band / totalWords;
  const center = (globalIdx / totalWords) * band + half * 0.5;
  const lo = Math.max(0, center - half * 2);
  const hi = Math.min(1, center + half * 0.5);
  const lit   = useTransform(progress, [lo, hi], [0, 1]);
  const color = useTransform(lit, (v) => {
    const c = Math.round(58 + (255 - 58) * v);
    return `rgb(${c},${c},${c})`;
  });
  return <motion.span style={{ color }} className="inline mr-[0.22em]">{word}</motion.span>;
}

// ─── QUOTE SECTION — first scroll page, pinned, word-spotlight ─────────────────

function QuoteSection({ club, accent }: { club: Club; accent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  if (!club.tagline) return null;
  const words = club.tagline.split(' ');

  return (
    <section
      ref={containerRef}
      aria-label="Club quote"
      // position:relative, NO overflow:hidden — aurora blobs must show
      className="relative"
      style={{ height: prefersReduced ? 'auto' : '280vh', backgroundColor: INK }}
    >
      <Aurora image={club.image} accent={accent} />

      <div
        className={`${prefersReduced ? 'relative' : 'sticky'} top-0 h-screen flex flex-col justify-center`}
        style={{ zIndex: 1 }}
      >
        {/* Full-width layout — quote centred in the full viewport */}
        <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <Eyebrow accent={accent}>About the club</Eyebrow>
          </motion.div>

          {/* Quote — full width, wraps naturally */}
          <p
            className="font-sans font-semibold leading-[1.65] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.2rem, 2vw, 1.75rem)', maxWidth: '72ch' }}
          >
            {prefersReduced
              ? <span className="text-white">{club.tagline}</span>
              : words.map((word, i) => (
                  <SpotlightWord
                    key={i} word={word} globalIdx={i}
                    totalWords={words.length} progress={scrollYProgress}
                  />
                ))
            }
          </p>

          {/* Bottom label — bottom-left of the sticky panel */}
          <div className="absolute bottom-10 left-8 md:left-16 lg:left-24">
            <ViewportLabel>{club.shortName}</ViewportLabel>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT — condensed activity grid ──────────────────────────────────────────

function AboutSection({ club, accent }: { club: Club; accent: string }) {
  if (!club.about) return null;
  return (
    // NO overflow:hidden — aurora must show
    <section className="relative" style={{ backgroundColor: INK }}>
      <Aurora image={club.image} accent={accent} />

      <div className="relative border-t border-white/08" style={{ zIndex: 1 }}>
        <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32 py-20 md:py-28">

          <Reveal>
            <h3 className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-white/35 mb-8">
              What we do
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {club.about.activities.map((a, i) => (
              <Reveal key={a.title} delay={0.04 * i}>
                <div
                  className="rounded-2xl border border-white/08 p-6"
                  style={{ backgroundColor: 'rgba(18,18,22,0.65)', backdropFilter: 'blur(16px)' }}
                >
                  <h4 className="font-sans font-bold text-white text-[0.92rem] mb-2">{a.title}</h4>
                  <p className="text-white/42 text-[0.82rem] leading-relaxed">{a.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {club.about.recognition && (
            <Reveal delay={0.15} className="mt-12 pt-10 border-t border-white/06">
              <p className="text-white/38 text-[0.85rem] leading-relaxed max-w-[680px]">
                {club.about.recognition}
              </p>
            </Reveal>
          )}

          {(club.instagramUrl || club.linkedinUrl) && (
            <Reveal delay={0.2} className="mt-8 flex items-center gap-3">
              {club.instagramUrl && (
                <a href={club.instagramUrl} target="_blank" rel="noopener noreferrer"
                  aria-label={`${club.shortName} on Instagram`}
                  className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/45 hover:text-white hover:border-white/28 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                  <Instagram className="w-4 h-4" aria-hidden />
                </a>
              )}
              {club.linkedinUrl && (
                <a href={club.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  aria-label={`${club.shortName} on LinkedIn`}
                  className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/45 hover:text-white hover:border-white/28 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                  <Linkedin className="w-4 h-4" aria-hidden />
                </a>
              )}
            </Reveal>
          )}

          <div className="mt-16">
            <ViewportLabel>Club</ViewportLabel>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ON THE FLOOR — scroll-driven card stack ───────────────────────────────────

function PosterCard({
  ev, index, total, scrollYProgress,
}: {
  ev: ClubEvent;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const step  = 1 / total;
  const s0 = index * step;           // card enters
  const s1 = s0 + step * 0.08;      // card fully visible
  const s2 = s0 + step * 0.82;      // card starts exiting
  const s3 = s0 + step;             // card fully gone

  const y = useTransform(scrollYProgress,
    [s0, s1, s2, s3],
    ['18px', '0px', '0px', '-70px']
  );
  const scale = useTransform(scrollYProgress,
    [s0, s1, s2, s3],
    [0.97, 1, 1, 0.95]
  );
  // Sharp: invisible → fully on → fully off — tight exit so no bleed from info bar
  const opacity = useTransform(scrollYProgress,
    [Math.max(0, s0 - step * 0.02), s1, s2, s0 + step * 0.92, s3],
    [0, 1, 1, 0, 0]
  );
  const rotate = useTransform(scrollYProgress,
    [s0, s1, s2, s3],
    ['-0.3deg', '0deg', '0deg', '0.6deg']
  );

  return (
    <motion.div
      style={{ y, scale, opacity, rotate, zIndex: total - index, transformOrigin: 'bottom center' }}
      className="absolute inset-0 rounded-2xl overflow-hidden"
    >
      {/* Poster image */}
      <div className="relative w-full h-full">
        {ev.posterImage ? (
          <>
            <Image
              src={ev.posterImage} alt={`${ev.title} poster`} fill
              className="object-cover"
              sizes="(max-width:768px) 95vw, 70vw"
              quality={90} priority={index === 0}
            />
            {/* Subtle edge fade so poster bleeds into dark bg */}
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
              background: [
                'linear-gradient(90deg, rgba(8,8,10,0.8) 0%, transparent 16%, transparent 84%, rgba(8,8,10,0.8) 100%)',
                'linear-gradient(180deg, rgba(8,8,10,0.5) 0%, transparent 14%, transparent 72%, rgba(8,8,10,0.96) 100%)',
              ].join(', ')
            }} />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: ev.posterGradient }}>
            {ev.tag && <p className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">{ev.tag}</p>}
            <h4 className="font-sans font-black text-white text-[2.2rem] text-center px-12 leading-tight">{ev.title}</h4>
          </div>
        )}

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-8 md:pb-10"
          style={{ background: 'linear-gradient(0deg, rgba(8,8,10,0.98) 0%, rgba(8,8,10,0.7) 55%, transparent 100%)' }}>
          <div className="flex items-end justify-between gap-6">
            <div>
              {ev.tag && <p className="font-mono text-[0.56rem] font-bold tracking-[0.18em] uppercase text-white/35 mb-2">{ev.tag}</p>}
              <h4 className="font-sans font-extrabold text-white leading-snug" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.4rem)' }}>
                {ev.title}
              </h4>
              {ev.blurb && (
                <p className="text-white/48 text-[0.83rem] leading-relaxed mt-1.5 max-w-[560px]">{ev.blurb}</p>
              )}
            </div>
            {ev.link && (
              <a href={ev.link} target="_blank" rel="noopener noreferrer"
                aria-label={`${ev.title} on Instagram`}
                className="flex-shrink-0 w-10 h-10 rounded-full border border-white/14 flex items-center justify-center text-white/50 hover:text-white hover:border-white/28 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                <Instagram className="w-4 h-4" aria-hidden />
              </a>
            )}
          </div>
          <p className="mt-4 font-mono text-[0.52rem] font-bold tracking-[0.18em] uppercase text-white/22">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollDot({ index, total, scrollYProgress }: {
  index: number; total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const step = 1 / total;
  const s0 = index * step;
  const s1 = s0 + step * 0.08;
  const s2 = s0 + step * 0.82;
  const s3 = s0 + step;
  const w  = useTransform(scrollYProgress, [s0, s1, s2, s3], ['5px', '20px', '20px', '5px']);
  const op = useTransform(scrollYProgress, [s0, s1, s2, s3], [0.2, 1, 1, 0.2]);
  return <motion.span aria-hidden className="h-[3px] rounded-full bg-white" style={{ width: w, opacity: op }} />;
}

function EventPosters({ club, accent }: { club: Club; accent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const events = club.events;
  if (!events?.length) return null;
  const n = events.length;

  return (
    <section
      ref={containerRef}
      aria-label="On the Floor — event posters"
      // NO overflow:hidden at section level
      className="relative"
      style={{ height: prefersReduced ? 'auto' : `${80 + n * 90}vh`, backgroundColor: INK }}
    >
      {/* Aurora diffusion — BEFORE the card stack, as requested */}
      <Aurora image={club.image} accent={accent} />

      {prefersReduced ? (
        <div className="relative border-t border-white/08 px-8 md:px-16 lg:px-24 py-20" style={{ zIndex: 1 }}>
          <Eyebrow accent={accent}>Event posters</Eyebrow>
          <h2 className="font-sans font-black text-white mt-3 mb-10" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)' }}>
            On the <span className="font-display italic font-medium text-warm">floor</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {events.map((ev) => (
              <div key={ev.id} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '3/4', backgroundColor: '#050505' }}>
                {ev.posterImage
                  ? <Image src={ev.posterImage} alt={`${ev.title} poster`} fill className="object-contain" sizes="33vw" quality={80} />
                  : <div className="absolute inset-0 flex items-center justify-center" style={{ background: ev.posterGradient }}><h4 className="font-sans font-black text-white text-xl px-6 text-center">{ev.title}</h4></div>
                }
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sticky top-0 h-screen flex flex-col" style={{ zIndex: 1 }}>
          {/* Section header */}
          <div className="px-8 md:px-16 lg:px-24 pt-10 pb-6 border-t border-white/08">
            <div className="flex items-end justify-between">
              <div>
                <Reveal preset="right"><Eyebrow accent={accent}>Event posters</Eyebrow></Reveal>
                <Reveal delay={0.05} className="mt-2">
                  <h2 className="font-sans font-black text-white" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)' }}>
                    On the <span className="font-display italic font-medium text-warm">floor</span>
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={0.08}>
                <p className="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white/28">Scroll to explore</p>
              </Reveal>
            </div>
          </div>

          {/* Card stack */}
          <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
            <div className="absolute inset-0 px-8 md:px-16 lg:px-24 pb-16">
              <div className="relative w-full h-full">
                {events.map((ev, i) => (
                  <PosterCard key={ev.id} ev={ev} index={i} total={n} scrollYProgress={scrollYProgress} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer — dots + label */}
          <div className="px-8 md:px-16 lg:px-24 pb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {events.map((_, i) => (
                <ScrollDot key={i} index={i} total={n} scrollYProgress={scrollYProgress} />
              ))}
            </div>
            <ViewportLabel>Club</ViewportLabel>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── MEMORY LANE — marquee + cinematic story ───────────────────────────────────

const TILE_WIDTHS = [400, 300, 480, 340, 430, 295, 460, 360];
const TILE_H = 260;

function MarqueeRow({ images, reverse, duration, paused }: {
  images: ClubMemoryImage[]; reverse: boolean; duration: number; paused: boolean;
}) {
  const tiles = [...images, ...images];
  return (
    <div className="overflow-hidden">
      <div className="flex gap-5 w-max" style={{
        animationName: 'marquee-x',
        animationDuration: `${duration}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationDirection: reverse ? 'reverse' : 'normal',
        animationPlayState: paused ? 'paused' : 'running',
      }}>
        {tiles.map((img, i) => (
          <div key={`${img.src}-${i}`} className="relative flex-shrink-0 rounded-2xl overflow-hidden"
            style={{ height: TILE_H, width: TILE_WIDTHS[i % TILE_WIDTHS.length] }}>
            <Image src={img.src} alt={img.alt} fill className="object-cover"
              sizes={`${TILE_WIDTHS[i % TILE_WIDTHS.length]}px`} quality={75}
              loading={i < images.length ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryFrame({ img, index, total, scrollYProgress }: {
  img: ClubMemoryImage; index: number; total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const start = index / total;
  const end   = (index + 1) / total;
  const imgY   = useTransform(scrollYProgress, [start, end], ['0%', '-6%']);
  const imgS   = useTransform(scrollYProgress, [start, end], [1, 1.06]);
  const op     = useTransform(scrollYProgress, [start, Math.min(1, end - 0.02), end], [1, 1, 0]);
  const capY   = useTransform(scrollYProgress, [start, end], ['0%', '-18%']);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity: op, zIndex: total - index }}
    >
      <motion.div className="absolute inset-0" style={{ scale: imgS, y: imgY }}>
        <Image src={img.src} alt={img.alt} fill className="object-cover"
          sizes="100vw" quality={80} priority={index === 0} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(8,8,10,0.28) 0%, transparent 35%, rgba(8,8,10,0.72) 100%)' }} />
      </motion.div>
      <motion.div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 lg:px-24 pb-14 md:pb-18" style={{ y: capY }}>
        <p className="font-mono text-[0.56rem] font-bold tracking-[0.2em] uppercase text-white/38 mb-2">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <h3 className="font-sans font-black text-white leading-tight drop-shadow-lg"
          style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.8rem)' }}>
          {img.alt}
        </h3>
      </motion.div>
    </motion.div>
  );
}

function MemoryLane({ images, clubShortName, accent, heroImage }: {
  images: ClubMemoryImage[]; clubShortName: string; accent: string; heroImage: string;
}) {
  const [paused, setPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  if (!images.length) return null;
  const rowB = [...images].reverse();

  return (
    <section aria-label="Moments from the club" style={{ backgroundColor: INK }}>

      {/* ── Marquee header ── */}
      <div className="border-t border-white/08 pt-20 pb-0">
        <div className="px-8 md:px-16 lg:px-24 mb-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <Reveal preset="right" className="mb-3">
                <Eyebrow accent={accent}>Memory lane</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-sans font-black text-white" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)' }}>
                  Moments from <span className="font-display italic font-medium text-warm">{clubShortName}</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.08}>
              <button onClick={() => setPaused(p => !p)}
                aria-label={paused ? 'Play' : 'Pause'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/12 text-white/45 hover:text-white hover:border-white/25 transition-colors font-mono text-[0.7rem] font-bold tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                {paused ? <Play className="w-3.5 h-3.5" aria-hidden /> : <Pause className="w-3.5 h-3.5" aria-hidden />}
                {paused ? 'Play' : 'Pause'}
              </button>
            </Reveal>
          </div>
        </div>

        {/* Two-row marquee */}
        {!prefersReduced && (
          <Reveal delay={0.1} className="space-y-5 overflow-hidden py-1">
            <MarqueeRow images={images} reverse={false} duration={46} paused={paused} />
            {rowB.length > 1 && <MarqueeRow images={rowB} reverse duration={54} paused={paused} />}
          </Reveal>
        )}

        {prefersReduced && (
          <div className="px-8 md:px-16 lg:px-24 grid grid-cols-2 md:grid-cols-3 gap-4 pb-12">
            {images.map((img) => (
              <div key={img.src} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="33vw" quality={72} />
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}

// ─── Built tool ────────────────────────────────────────────────────────────────

function BuiltToolSection({ club, accent }: { club: Club; accent: string }) {
  const tool = club.builtTool;
  if (!tool) return null;
  return (
    <section className="border-t border-white/06" style={{ backgroundColor: '#16161a' }}>
      <div className="w-full px-8 md:px-16 lg:px-24 max-w-[1100px] mx-auto py-20 md:py-28">
        <Reveal preset="right" className="mb-3"><Eyebrow accent={accent}>Built by {club.shortName}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-sans font-black text-white" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)' }}>
            {tool.name} <span className="font-display italic font-medium text-warm">{tool.tagline}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-5 max-w-[600px]">
          <p className="text-white/55 leading-relaxed" style={{ fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)' }}>
            {tool.description}
          </p>
        </Reveal>
        {tool.stats && tool.stats.length > 0 && (
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            {tool.stats.map((s) => (
              <div key={s.label}>
                <div className="font-sans font-black text-white text-[1.8rem] leading-none">{s.value}</div>
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.15em] uppercase text-white/32 mt-2">{s.label}</div>
              </div>
            ))}
          </Reveal>
        )}
        <Reveal delay={0.2} className="mt-10">
          <a href={tool.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-sans font-bold text-[0.9rem] text-white transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{ backgroundColor: accent }}>
            Visit {tool.name}<ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Floating join ─────────────────────────────────────────────────────────────

function JoinFloatingButton({ url, external, clubShortName }: { url: string; external: boolean; clubShortName: string }) {
  return (
    <a href={url} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
      className="fixed z-40 inline-flex items-center gap-2 rounded-full font-sans font-bold text-black text-[0.85rem] px-5 py-3.5 transition-transform hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      style={{ right: '1.5rem', bottom: '1.5rem', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
      Join {clubShortName}<ArrowUpRight className="w-4 h-4" aria-hidden />
    </a>
  );
}

// ─── Page root ─────────────────────────────────────────────────────────────────

export default function ClubDetail({ club }: { club: Club }) {
  const accent = CATEGORY_ACCENT[club.category];

  return (
    <>
      {/* ── Hero — unchanged ── */}
      <section className="relative bg-ink overflow-hidden" style={{ height: 'min(560px, 68vh)' }}>
        <Image src={club.image} alt={club.name} fill priority className="object-cover opacity-40" sizes="100vw" quality={75} />
        <div aria-hidden className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(12,12,14,0.35) 0%, rgba(12,12,14,0.75) 55%, #0c0c0e 100%)' }} />

        {club.logo && (
          <div className="absolute z-10 top-5 right-5 md:top-7 md:right-8 flex flex-col items-end gap-2">
            <Reveal preset="fade" delay={0.6}>
              <Image src={club.logo} alt={`${club.name} logo`} width={1104} height={435}
                className="h-auto object-contain" style={{ width: 'clamp(100px, 13vw, 190px)' }} />
            </Reveal>
            {club.members && (
              <Reveal preset="fade" delay={0.7}>
                <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                  <Users className="w-4 h-4" aria-hidden style={{ color: accent }} />{club.members} members
                </span>
              </Reveal>
            )}
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col w-full px-8 md:px-16 lg:px-24 max-w-[1400px] mx-auto py-8 md:py-12">
          <Reveal preset="right">
            <Link href="/campus/clubs"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.18em] uppercase text-white/55 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden />All Clubs &amp; Societies
            </Link>
          </Reveal>

          <Reveal delay={0.05} className="mt-8">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full font-mono text-[0.6rem] font-bold tracking-[0.16em] uppercase text-white"
              style={{ backgroundColor: accent }}>{club.category}</span>
          </Reveal>

          {/* SCOPE + Club title — spring entry */}
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-[max-content_max-content] overflow-hidden">
              <motion.h1
                initial={{ y: '-115%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, mass: 1, delay: 0.15 }}
                className="col-start-1 row-start-1 font-sans font-black tracking-tighter-2 leading-[0.94]"
                style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.2rem)', color: 'rgba(255,255,255,0.9)' }}
              >
                {club.shortName}
              </motion.h1>
              <motion.p
                initial={{ y: '115%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, mass: 1, delay: 0.42 }}
                className="col-start-2 row-start-2 font-display italic font-medium text-warm leading-[0.94]"
                style={{ fontSize: 'clamp(4.2rem, 10vw, 8.4rem)' }}
              >
                Club
              </motion.p>
            </div>
          </div>

          <Reveal delay={0.6} className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {club.members && !club.logo && (
              <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                <Users className="w-4 h-4" aria-hidden style={{ color: accent }} />{club.members} members
              </span>
            )}
            {club.facultyCoordinator && (
              <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                <GraduationCap className="w-4 h-4" aria-hidden style={{ color: accent }} />{club.facultyCoordinator}
              </span>
            )}
            {club.studentLead && (
              <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                <UserRound className="w-4 h-4" aria-hidden style={{ color: accent }} />{club.studentLead}
              </span>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── About — condensed activity grid ── */}
      {club.about && <AboutSection club={club} accent={accent} />}

      {/* ── On the Floor — scroll card stack with diffusion ── */}
      <EventPosters club={club} accent={accent} />

      {/* ── Moments From — marquee + cinematic story ── */}
      {club.memoryLane && club.memoryLane.length > 0 && (
        <MemoryLane images={club.memoryLane} clubShortName={club.shortName} accent={accent} heroImage={club.image} />
      )}

      <BuiltToolSection club={club} accent={accent} />

      {/* ── Closing CTA ── */}
      <section className="border-t border-white/08" style={{ backgroundColor: INK }}>
        <div className="w-full px-8 md:px-16 lg:px-24 max-w-[900px] mx-auto py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <h2 className="font-sans font-black text-white tracking-tighter-2 leading-[1.05]"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                Want in?{' '}
                <span className="font-display italic font-medium text-warm">Reach out to {club.shortName}.</span>
              </h2>
              <p className="mt-4 text-white/38 text-[0.88rem] leading-relaxed max-w-[480px]">
                Drop by a session, follow the club on campus, or ask your student coordinator how to join.
              </p>
            </div>
            <Link href={club.joinUrl ?? '/student-life'} target={club.joinUrl ? '_blank' : undefined}
              rel={club.joinUrl ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border font-sans font-bold text-[0.9rem] text-white hover:bg-white/06 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white flex-shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.14)' }}>
              {club.joinUrl ? `Join ${club.shortName}` : 'Explore student life'}<ArrowUpRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <JoinFloatingButton url={club.joinUrl ?? '/student-life'} external={Boolean(club.joinUrl)} clubShortName={club.shortName} />
    </>
  );
}
