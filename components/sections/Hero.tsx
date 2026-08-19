'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ChevronRight } from '../icons';
import StudentReelSlider from './StudentReelSlider';
import type { DeptReel } from '@/lib/departments';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';

const lineUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0   },
};

/**
 * Fallback copy. Used whenever the CMS lookup in app/page.tsx fails, returns
 * nothing, or returns a row missing any field — the hero must always render
 * complete text, never a blank or half-filled headline.
 */
const DEFAULT_HEADLINE_LEAD = 'Engineering';
const DEFAULT_HEADLINE_ACCENT = 'the Future.';
const DEFAULT_BODY =
  "Two decades of shaping minds. 11,000+ engineers and counting. At MLRIT, we don't just teach the future — we build it.";

type HeroProps = {
  headlineLead?: string;
  headlineAccent?: string;
  body?: string;
};

const HERO_REELS: DeptReel[] = [
  {
    reelUrl: 'https://www.instagram.com/reel/DWdgy0xDGvL/',
    thumbnail: '/images/students/reel-cse.png',
    quote: '"The labs here pushed me to build things I never thought I could — real projects, real mentors, real outcomes."',
    name: 'CSE Student',
    role: 'B.Tech · Computer Science & Engineering',
  },
  {
    reelUrl: 'https://www.instagram.com/reel/CixMnEPPIm9/',
    thumbnail: '/images/students/reel-ece.png',
    quote: '"From signal processing to FPGA design — every semester opened a new world. MLRIT gave me the depth I needed."',
    name: 'ECE Student',
    role: 'B.Tech · Electronics & Communication Engineering',
  },
  {
    reelUrl: 'https://www.instagram.com/reel/C81FPqwNwv7/',
    thumbnail: '/images/students/reel-mech.png',
    quote: '"Workshop sessions made theory tangible. I went from reading about manufacturing to actually machining parts in semester two."',
    name: 'Mechanical Student',
    role: 'B.Tech · Mechanical Engineering',
  },
];

export default function Hero(props: HeroProps) {
  // Live-preview draft wins over the saved props; fallbacks below are unchanged.
  const { headlineLead, headlineAccent, body } = useMergedSection('home/hero', props);

  // The headline renders as two nodes so the second half can carry the gradient
  // clip; the CMS stores the halves separately to match.
  const lead = headlineLead?.trim() || DEFAULT_HEADLINE_LEAD;
  const accent = headlineAccent?.trim() || DEFAULT_HEADLINE_ACCENT;
  const bodyText = body?.trim() || DEFAULT_BODY;

  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay only fires on the element's initial load; after framer-motion
  // hydrates/re-renders the node the browser may skip it, leaving a black box.
  // Force playback once mounted.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <>
      <section id={sectionDomId('home/hero')} className="relative w-full h-[calc(100vh-var(--header-h))] min-h-[640px] overflow-hidden flex flex-col justify-end items-center lg:items-start">
        {/* Background video */}
        <motion.video
          ref={videoRef}
          src="/videos/hero.mp4"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline preload="auto"
        />

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.75) 100%)' }}
        />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}
          className="relative z-[2] w-full max-w-[720px] px-6 lg:px-16 pb-10 lg:pb-[70px] flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.h1
            variants={lineUp}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-extrabold text-white leading-[0.96] tracking-tighter-2 text-[clamp(2.2rem,9vw,3.2rem)] lg:text-[clamp(3.4rem,6.8vw,6rem)]"
            style={{ textShadow: '0 2px 32px rgba(0,0,0,0.35)' }}
          >
            {lead}
            {accent && (
              <span
                className="block font-display italic font-medium tracking-tight pb-[0.06em] mt-[0.05em]"
                style={{
                  letterSpacing: '-0.015em',
                  backgroundImage: 'linear-gradient(180deg, #fff 0%, var(--primary) 110%)',
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
          <motion.p
            variants={lineUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[480px] text-white/90 leading-[1.55] text-[1.02rem] font-normal"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            {bodyText}
          </motion.p>
          <motion.div variants={lineUp} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <Link
              href="#programs"
              className="mt-8 inline-flex items-center gap-2.5 h-[50px] pl-3 pr-6 rounded-[10px] bg-primary text-white font-semibold text-[0.95rem] border border-primary transition-all duration-300 ease-out-quart hover:bg-primary-hover hover:shadow-primary-glow hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-md bg-white/20">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              Explore Programs
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </>
  );
}
