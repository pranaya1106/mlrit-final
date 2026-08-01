'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ChevronRight } from '../icons';
import StudentReelSlider from './StudentReelSlider';
import type { DeptReel } from '@/lib/departments';

const lineUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0   },
};

const HERO_REELS: DeptReel[] = [
  {
    reelUrl: 'https://www.instagram.com/reel/DWdgy0xDGvL/',
    thumbnail: '/images/students/campus-group.png',
    quote: '"The labs here pushed me to build things I never thought I could — real projects, real mentors, real outcomes."',
    name: 'CSE Student',
    role: 'B.Tech · Computer Science & Engineering',
  },
  {
    reelUrl: 'https://www.instagram.com/reel/CixMnEPPIm9/',
    thumbnail: '/images/students/faculty-classroom.png',
    quote: '"From signal processing to FPGA design — every semester opened a new world. MLRIT gave me the depth I needed."',
    name: 'ECE Student',
    role: 'B.Tech · Electronics & Communication Engineering',
  },
  {
    reelUrl: 'https://www.instagram.com/reel/C81FPqwNwv7/',
    thumbnail: '/images/students/students-laughing.png',
    quote: '"Workshop sessions made theory tangible. I went from reading about manufacturing to actually machining parts in semester two."',
    name: 'Mechanical Student',
    role: 'B.Tech · Mechanical Engineering',
  },
];

export default function Hero() {
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
      <section className="relative w-full h-[calc(100vh-var(--header-h))] min-h-[640px] overflow-hidden flex flex-col justify-end items-center lg:items-start">
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
            Engineering
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
              the Future.
            </span>
          </motion.h1>
          <motion.p
            variants={lineUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[480px] text-white/90 leading-[1.55] text-[1.02rem] font-normal"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            Two decades of shaping minds. 11,000+ engineers and counting. At MLRIT, we don&apos;t just teach the future — we build it.
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

      {/* Student Reel Slider — reel thumbnails as full-bleed cover */}
      <StudentReelSlider reels={HERO_REELS} label="In Their Words…" />
    </>
  );
}
