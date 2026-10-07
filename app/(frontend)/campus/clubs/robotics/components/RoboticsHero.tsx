'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE_OUT_QUART = [0.16, 1, 0.3, 1] as const;
const INSTAGRAM_URL = 'https://www.instagram.com/mlrit_robotic_club/';

function InstagramCTA() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsFloating(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    const el = document.getElementById('robotics-hero-sentinel');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Robotics Club on Instagram"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2, ease: EASE_OUT_QUART }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-bold text-[0.82rem] tracking-tight border border-white/25 text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10 group"
      >
        Follow on Instagram
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </motion.a>

      <AnimatePresence>
        {isFloating && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
            className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8"
          >
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Robotics Club on Instagram (opens in new tab)"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-sans font-bold text-[0.78rem] tracking-tight text-white border border-white/12 transition-all duration-300 hover:border-white/25 group"
              style={{ backgroundColor: '#0c0c0e' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden />
              Robotics Club
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function RoboticsHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(560px, 66vw, 920px)', backgroundColor: '#071209' }}
      aria-label="Robotics Club hero"
    >
      <Image
        src="/images/clubs/robotics-hero.png"
        alt=""
        fill
        priority
        quality={88}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.68) 60%, rgba(8,8,8,0.82) 100%)' }}
        aria-hidden="true"
      />

      {/* Club logo — top-left */}
      <div className="absolute z-[3]" style={{ top: 'clamp(20px, 3vw, 40px)', left: 'clamp(20px, 3vw, 48px)' }}>
        <div
          className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/25 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          aria-label="Robotics Club logo"
        >
          <Image src="/images/clubs/robotics-logo.png" alt="Robotics Club logo" width={80} height={80} className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Main typography */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center select-none" aria-label="Robotics Club">
        <motion.h1
          className="font-sans font-black text-white text-center leading-none"
          style={{ fontSize: 'clamp(4rem, 12vw, 12rem)', letterSpacing: '-0.04em', lineHeight: 0.9 }}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -80 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_QUART }}
        >
          ROBOTICS
        </motion.h1>

        <motion.span
          className="font-display font-medium text-center leading-none"
          style={{ fontSize: 'clamp(3.5rem, 10.5vw, 10.5rem)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#c9a84c', display: 'block' }}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 80 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_QUART }}
          aria-hidden="true"
        >
          CLUB
        </motion.span>

        <motion.p
          className="mt-6 text-center font-sans px-4"
          style={{ fontSize: 'clamp(0.78rem, 1.2vw, 1rem)', color: 'rgba(255,255,255,0.55)', maxWidth: 480, lineHeight: 1.55 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: EASE_OUT_QUART }}
        >
          ECE Department · MLR Institute of Technology
        </motion.p>

        <motion.div className="mt-5 md:mt-8"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT_QUART }}
        >
          <InstagramCTA />
        </motion.div>
      </div>

      <div id="robotics-hero-sentinel" className="absolute bottom-0 w-full h-1" aria-hidden="true" />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 z-[3] pointer-events-none"
        style={{ height: 140, background: 'linear-gradient(to bottom, transparent 0%, #071209 100%)' }}
        aria-hidden="true"
      />
    </section>
  );
}
