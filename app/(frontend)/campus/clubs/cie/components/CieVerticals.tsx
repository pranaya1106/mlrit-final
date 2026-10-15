'use client';

/**
 * CIE — Verticals as an interactive expanding accordion.
 *
 * Four tall panels sit side by side; the hovered / focused / tapped one grows
 * and reveals its logo, name and description while the others collapse to a
 * vertical label. Each active panel lights an orange glow behind a giant ghost
 * code letter. On narrow screens it becomes a vertical tap-to-open stack.
 *
 * Reduced-motion keeps the layout but drops the long transitions.
 */

import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

const VERTICALS = [
  { code: 'MP', logo: '/images/clubs/cie/verticals/mp.svg', name: 'Microprojects',       body: 'Small teams. 8-week sprints. The first place a raw idea meets a whiteboard, a deadline and teammates.' },
  { code: 'CS', logo: '/images/clubs/cie/verticals/cs.svg', name: 'CIE Studios',         body: 'Six studios capturing campus stories through photography, video and digital content.' },
  { code: 'PD', logo: '/images/clubs/cie/verticals/pd.svg', name: 'Product Development', body: 'Promising projects taken from prototype to real deployment — 15 currently live with real users.' },
  { code: 'SC', logo: '/images/clubs/cie/verticals/sc.svg', name: 'Startup Cohort',      body: 'Founders in training — problem discovery, user interviews, unit economics. The parts people skip.' },
];

const IN_VIEW = { once: true, margin: '-80px' } as const;
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export default function CieVerticals() {
  const reduced = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const dur = reduced ? 'duration-0' : 'duration-[650ms]';

  return (
    <section id="verticals" className="relative bg-black py-20 md:py-32 overflow-hidden border-t border-white/[0.08]">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(70% 55% at 50% 0%, rgba(232,93,4,0.12) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12 md:mb-16">
          <div className="max-w-[720px]">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={IN_VIEW} transition={{ duration: 0.6, ease: EASE }} className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-primary" />
              <span className="font-mono text-[0.72rem] font-bold tracking-[0.34em] uppercase text-primary">What&apos;s inside</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={IN_VIEW} transition={{ duration: 0.75, ease: EASE, delay: 0.06 }} className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]">
              Four rooms. Four teams.
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={IN_VIEW} transition={{ duration: 0.6, delay: 0.2 }} className="font-mono text-[0.64rem] font-bold tracking-[0.26em] uppercase text-white/45 pb-2 flex items-center gap-2">
            <span className="hidden sm:inline">Hover to explore</span>
            <span className="sm:hidden">Tap to explore</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
          </motion.div>
        </div>

        {/* Accordion */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col md:flex-row gap-3 md:gap-4 md:h-[74vh] md:min-h-[540px] md:max-h-[760px]"
        >
          {VERTICALS.map((v, i) => {
            const on = active === i;
            return (
              <motion.button
                key={v.code}
                type="button"
                variants={rise}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={on}
                aria-label={v.name}
                style={{ flexGrow: on ? 3.4 : 1, flexBasis: 0 }}
                className={`group relative overflow-hidden rounded-[1.6rem] border text-left outline-none min-h-[128px] md:min-h-0 md:h-full transition-[flex-grow,border-color] ${dur} ease-out-quart ${
                  on ? 'border-primary/40' : 'border-white/10 hover:border-white/20'
                } focus-visible:ring-2 focus-visible:ring-primary`}
              >
                {/* Base gradient */}
                <span aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(155deg, #161618 0%, #09090a 100%)' }} />
                {/* Active orange wash */}
                <span
                  aria-hidden
                  className={`absolute inset-0 transition-opacity ${dur} ${on ? 'opacity-100' : 'opacity-0'}`}
                  style={{ background: 'radial-gradient(90% 70% at 20% 100%, rgba(232,93,4,0.3) 0%, transparent 60%)' }}
                />
                {/* Ghost code letter */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -bottom-6 -right-3 font-sans font-black leading-[0.7] tracking-tighter-3 select-none transition-colors ${dur} ${
                    on ? 'text-primary/20' : 'text-white/[0.05]'
                  }`}
                  style={{ fontSize: 'clamp(7rem, 15vw, 15rem)' }}
                >
                  {v.code}
                </span>

                {/* Content */}
                <span className="relative z-[1] flex h-full flex-col justify-between p-6 md:p-7">
                  {/* Top — number + small logo (collapsed only) */}
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[0.62rem] font-bold tracking-[0.26em] uppercase text-primary">
                      0{i + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.logo}
                      alt=""
                      aria-hidden
                      className={`w-11 h-11 object-contain transition-opacity ${dur} ${on ? 'opacity-0' : 'opacity-80'}`}
                    />
                  </span>

                  {/* Middle — big centered logo (active) or vertical label (collapsed desktop) */}
                  <span className="flex flex-1 items-center justify-center py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.logo}
                      alt={`${v.name} logo`}
                      className={`object-contain transition-all ${dur} ease-out-quart ${
                        on ? 'w-40 h-40 md:w-56 md:h-56 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-75'
                      }`}
                    />
                    <span
                      className={`font-sans font-black text-white/90 text-[1.35rem] tracking-tight whitespace-nowrap ${on ? 'hidden' : 'hidden md:block'}`}
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {v.name}
                    </span>
                  </span>

                  {/* Expanded content (mobile always; desktop active) */}
                  <span className={`block ${on ? 'md:block' : 'md:hidden'}`}>
                    <span className="flex items-center gap-2.5 mb-2.5">
                      <span aria-hidden className="h-px w-7 bg-primary" />
                      <span className="font-mono text-[0.58rem] font-bold tracking-[0.26em] uppercase text-white/55">Vertical</span>
                    </span>
                    <span className="block font-sans font-black text-white text-[clamp(1.6rem,3vw,2.6rem)] leading-[0.98] tracking-tighter-2">
                      {v.name}
                    </span>
                    <span className={`grid transition-all ${dur} ease-out-quart ${on ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <span className="overflow-hidden">
                        <span className="block text-white/65 text-[0.95rem] md:text-[1rem] leading-[1.65] max-w-[40ch]">
                          {v.body}
                        </span>
                        <span className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary">
                          Explore
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
