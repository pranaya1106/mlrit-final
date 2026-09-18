'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronRight } from '../icons';
import type { DeptReel } from '@/lib/departments';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';
import VideoLightbox from '../VideoLightbox';

const lineUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0   },
};

const DEFAULT_HEADLINE_LEAD = 'Engineering';
const DEFAULT_HEADLINE_ACCENT = 'the Future.';
const DEFAULT_BODY =
  "Two decades of shaping minds. 11,000+ engineers and counting. At MLRIT, we don't just teach the future — we build it.";

type HeroProps = {
  headlineLead?: string;
  headlineAccent?: string;
  body?: string;
};

// Kept for API compatibility.
const HERO_REELS: DeptReel[] = [];
void HERO_REELS;

export default function Hero(props: HeroProps) {
  const { headlineLead, headlineAccent, body } = useMergedSection('home/hero', props);

  const lead = headlineLead?.trim() || DEFAULT_HEADLINE_LEAD;
  const accent = headlineAccent?.trim() || DEFAULT_HEADLINE_ACCENT;
  const bodyText = body?.trim() || DEFAULT_BODY;

  const [filmOpen, setFilmOpen] = useState(false);

  // Video preview stays static — no scroll-driven scale/drift.
  const sectionRef = useRef<HTMLElement>(null);
  const previewScale = 1;
  const previewX = 0;
  const previewY = 0;

  return (
    <section ref={sectionRef} id={sectionDomId('home/hero')} className="relative pt-5 md:pt-7 lg:pt-8 overflow-hidden">
      {/* Same decorative background artwork as WhyMLRIT — sits behind
          the picture card in the cream margin around it, blending into
          the header above via a fade so nav content stays readable. */}
      <img
        src="/vectors/whymlrit-background.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0]"
      />

      <div aria-hidden className="absolute inset-x-0 top-0 z-[0] pointer-events-none">

        {/* Central hairline ruler with tick marks — extends across the top */}
        <div className="hidden md:flex absolute inset-x-0 top-[14px] justify-center px-24">
          <svg
            className="w-full max-w-[540px] h-[8px] opacity-[0.28]"
            viewBox="0 0 540 8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <line x1="0" y1="4" x2="540" y2="4" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
            {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="8" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
            ))}
            {/* accent tick in the centre in brand orange */}
            <circle cx="270" cy="4" r="1.5" fill="var(--primary)" />
          </svg>
        </div>

        {/* Small green dot cluster far-left, mirrors gold cluster far-right */}
        <div className="hidden lg:flex absolute top-[14px] left-16 items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-secondary opacity-40" />
          <span className="w-1 h-1 rounded-full bg-secondary opacity-25" />
          <span className="w-1 h-1 rounded-full bg-secondary opacity-15" />
        </div>
        <div className="hidden lg:flex absolute top-[14px] right-16 items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-gold opacity-15" />
          <span className="w-1 h-1 rounded-full bg-gold opacity-25" />
          <span className="w-1 h-1 rounded-full bg-gold opacity-40" />
        </div>
      </div>
      {/* Video preview lightbox — Masters-Union-style modal */}
      <VideoLightbox
        open={filmOpen}
        onClose={() => setFilmOpen(false)}
        src="/videos/hero.mp4"
        eyebrow="MLRIT · Campus Film"
        title="Two decades of engineering in two minutes."
        description="Founded in 2005 · Autonomous under UGC since 2015 · 11,000+ engineers and counting. A short film across the campus, the courts, the classrooms, and the people who built them."
      />

      {/* ── INSET HERO CARD ───────────────────────────────────
          Fills the full remaining viewport height under the fixed
          header. Cream margin only on the sides, rounded on all four
          corners, extends into the section below via negative margin.
          Layout is flex-column so headline/body/CTA never escape. */}
      {/* z-[2] is CRITICAL: without it, the Stats section below (which
          has z-[1] so it sits above the video's negative-margin overlap)
          paints its cream background over the card's bottom 160px, and
          the headline/body/CTA appear to sit on cream. Card must beat
          Stats so its ink bg wins in the overlap zone. */}
      <div
        className="relative z-[2] mx-4 md:mx-6 lg:mx-8 h-[80vh] min-h-[480px] md:h-[calc(100vh-var(--header-h)+8rem)] md:min-h-[640px] overflow-hidden bg-ink rounded-[24px] md:rounded-[32px] shadow-[0_40px_100px_-30px_rgba(15,15,15,0.35)]"
        style={{ marginBottom: 0 }}
      >
        {/* Background image — the campus facade. Static hero visual so
            the moving campus film below gets to be the video moment. */}
        <motion.img
          src="/images/campus/SBS_1131.JPG"
          alt="MLR Institute of Technology main campus"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Editorial gradient — absolute layer 1 */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(12,12,14,0.28) 0%, rgba(12,12,14,0) 30%, rgba(12,12,14,0.15) 60%, rgba(12,12,14,0.78) 100%),' +
              'linear-gradient(90deg, rgba(12,12,14,0.55) 0%, rgba(12,12,14,0.15) 45%, rgba(12,12,14,0) 100%)',
          }}
        />


        {/* Content column — flex layout, guaranteed inside the card */}
        <div className="relative z-[2] h-full flex flex-col">
          {/* Spacer — pushes bottom content to the bottom of the card */}
          <div className="flex-1 min-h-0" />

          {/* Bottom content — headline, body, CTA. Deep pb on desktop so the
              block lifts above the fold even though the card extends past
              the viewport there for the overlap effect. Mobile's card is a
              fixed 80vh with no overlap, so a small pb sits it right at
              the bottom of the image instead. */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } } }}
            className="px-6 md:px-12 lg:px-20 pb-8 md:pb-52 lg:pb-56"
          >
            <motion.h1
              variants={lineUp}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[980px] font-sans font-semibold text-white leading-[0.94] tracking-tighter-2 text-[clamp(2.6rem,9vw,3.6rem)] lg:text-[clamp(4.4rem,7.6vw,6.8rem)]"
            >
              <span className="block">{lead}</span>
              {accent && (
                <span
                  className="editorial-italic block pb-[0.06em] mt-[0.02em]"
                  style={{
                    backgroundImage:
                      'linear-gradient(180deg, #fff 0%, #fff 55%, var(--primary) 130%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  {accent}
                </span>
              )}
            </motion.h1>

            <motion.div
              variants={lineUp}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-[minmax(0,540px)_auto] items-end gap-6 md:gap-12"
            >
              <p className="text-white/90 leading-[1.65] text-[1.08rem] md:text-[1.2rem] font-light max-w-[560px]">
                {bodyText}
              </p>

              <div className="flex items-center gap-5">
                <Link href="#programs" className="btn-precious">
                  <span className="btn-precious__dot" aria-hidden />
                  Explore Programmes
                  <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                </Link>
                <Link
                  href="/about"
                  className="hidden sm:inline text-[0.85rem] font-medium text-white/75 hover:text-white transition-colors border-b border-white/25 hover:border-white/60 pb-0.5"
                >
                  About the Institute
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating video preview card — mastersunion.org style, scroll-driven.
            Starts compact in the corner, grows and drifts inward as the user
            scrolls through the hero, opens the lightbox on click. */}
        <motion.button
          type="button"
          onClick={() => setFilmOpen(true)}
          aria-label="Explore our campus — watch the film"
          style={{
            scale: previewScale,
            x: previewX,
            y: previewY,
            transformOrigin: 'top right',
          }}
          className="hidden md:block group absolute right-5 md:right-8 top-[55%] md:top-[58%] z-[3] w-64 md:w-80 lg:w-[380px] rounded-2xl overflow-hidden bg-ink border border-white/12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] hover:border-white/30 hover:shadow-[0_36px_100px_-20px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow] duration-300 will-change-transform"
        >
          <div className="relative aspect-video">
            <video
              src="/videos/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Bottom vignette for label legibility */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(12,12,14,0) 0%, rgba(12,12,14,0.88) 100%)',
              }}
            />

            {/* Label row */}
            <div className="absolute inset-x-0 bottom-0 px-4 md:px-5 pb-4 md:pb-5 flex items-end justify-between gap-3">
              <span className="editorial-eyebrow !text-white/90 !text-[0.62rem] md:!text-[0.7rem] leading-[1.2]">
                Explore Our Campus
              </span>
              <span className="inline-flex flex-shrink-0 items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-ink group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <svg viewBox="0 0 12 14" className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current translate-x-[1px]" aria-hidden>
                  <path d="M0 0 L12 7 L0 14 Z" />
                </svg>
              </span>
            </div>
          </div>
        </motion.button>
      </div>

      {/* "01 · Est 2005" chapter mark — anchors to the hero image instead of
          floating detached at the top of Stats below. Mobile only; Stats
          hides its own copy of this same first-item caption so it isn't
          shown twice. */}
      <div className="md:hidden flex items-center gap-2 mx-4 mt-4">
        <span className="chapter-mark !text-[0.66rem]">01</span>
        <span className="editorial-eyebrow !text-[0.66rem]">Est · 2005</span>
      </div>
    </section>
  );
}
