'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CieHero() {
  return (
    <section className="relative bg-black overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-6 md:pt-8 relative z-[2]">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/campus/clubs"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.24em] uppercase text-white/50 hover:text-primary transition-colors"
          >
            ← Clubs &amp; Societies
          </Link>
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.24em] uppercase text-white/45 hidden md:inline">
            MLRIT · Centre for Innovation &amp; Entrepreneurship
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE }}
        className="relative w-full mt-2 md:mt-4 flex justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/clubs/cie-hero.svg"
          alt="CIE — Centre for Innovation and Entrepreneurship"
          className="block w-full max-w-[1440px] h-auto max-h-[880px] object-contain"
        />
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pt-8 pb-20 md:pb-28 relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div className="max-w-[720px]">
            <div className="flex items-center gap-3 mb-4">
              <span aria-hidden className="h-px w-8 bg-primary" />
              <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-primary">
                Ideate · Build · Innovate
              </span>
            </div>
            <h1 className="mt-2 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2.4rem,4.6vw,4rem)]">
              Where ideas become real ventures.
            </h1>
            <p className="mt-5 text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[600px]">
              A student-driven community of builders, designers, writers and
              first-time founders — turning curiosity into shipped work
              through projects, workshops, hackathons and mentorship.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:flex-shrink-0">
            <Link
              href="https://mlritcie.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#e85d04', color: '#fff' }}
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-primary-glow transition-all duration-300"
            >
              Visit mlritcie.in
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
            >
              Read on
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
