'use client';

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: '-80px' } as const;

const stagger = (childDelay = 0.06, initial = 0.02) => ({
  hidden: {},
  show: { transition: { staggerChildren: childDelay, delayChildren: initial } },
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW}
      variants={stagger(0.15, 0)}
    >
      <motion.span
        aria-hidden
        className="h-px w-8 bg-primary origin-left"
        variants={{
          hidden: { scaleX: 0 },
          show:   { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
        }}
      />
      <motion.span
        className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-primary"
        variants={{
          hidden: { opacity: 0, x: -6 },
          show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

export default function CieAbout() {
  return (
    <section id="about" className="relative bg-black py-24 md:py-36 overflow-hidden">
      {/* Ghost chapter numeral */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute -left-6 md:left-4 lg:left-8 top-[10%] hidden lg:block z-[0]"
      >
        <div className="font-mono text-[0.68rem] font-bold tracking-[0.36em] uppercase text-white/25 mb-2 ml-2">
          § Chapter Two
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={IN_VIEW}
          transition={{ duration: 1, ease: EASE }}
          className="font-sans font-black text-white/[0.06] leading-[0.8] tracking-tighter-3"
          style={{ fontSize: 'clamp(12rem, 22vw, 26rem)' }}
        >
          02
        </motion.div>
      </div>

      {/* Corner bracket */}
      <div aria-hidden className="absolute top-8 right-8 w-8 h-8 pointer-events-none hidden md:block z-[1]">
        <span className="absolute top-0 right-0 w-full h-px bg-primary" />
        <span className="absolute top-0 right-0 w-px h-full bg-primary" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 z-[1]">
        <div className="grid lg:grid-cols-12 gap-y-14 lg:gap-x-10">
          {/* Left — meta rail */}
          <div className="lg:col-span-4 lg:pt-4">
            <Eyebrow>About · The room</Eyebrow>
            <div className="mt-10 space-y-6 border-l border-white/10 pl-6">
              {[
                ['Location',  'Dundigal, Hyderabad'],
                ['Model',     'Student-run'],
                ['Verticals', 'MP · CS · PD · SC'],
                ['Home',      'Innovation Hub / EPICS'],
              ].map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={IN_VIEW}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: EASE }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[26px] top-2 w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ boxShadow: '0 0 8px rgba(232,93,4,0.6)' }}
                  />
                  <div className="font-mono text-[0.6rem] font-bold tracking-[0.24em] uppercase text-white/40">{k}</div>
                  <div className="mt-1 text-white text-[0.98rem] leading-snug font-medium">{v}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — heading + prose */}
          <div className="lg:col-span-8 lg:pl-8 lg:border-l lg:border-white/10">
            <motion.h2
              className="font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.4rem,5.6vw,5rem)] mb-10 md:mb-14 max-w-[16ch]"
              initial="hidden"
              whileInView="show"
              viewport={IN_VIEW}
              variants={stagger(0.07, 0.05)}
              style={{ display: 'block' }}
            >
              {['A', 'student-run', 'incubator,', 'built', 'for', 'building.'].map((w, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: '0.4em' },
                    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                  style={{ display: 'inline-block', marginRight: '0.28em' }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.h2>

            <motion.div
              className="max-w-[62ch] space-y-6 text-white/75 leading-[1.8] text-[1.05rem] md:text-[1.12rem]"
              initial="hidden"
              whileInView="show"
              viewport={IN_VIEW}
              variants={stagger(0.14, 0.05)}
            >
              <motion.p variants={fadeUp}>
                <span className="float-left text-white font-sans font-black text-[3.6rem] leading-[0.85] mr-3 pt-1 tracking-tighter-2">
                  C
                </span>
                IE is MLRIT&apos;s Centre for Innovation and Entrepreneurship — a
                student-run incubator on the Dundigal campus. It exists to give
                students a place to actually build the things they&apos;d otherwise
                only talk about.
              </motion.p>
              <motion.p variants={fadeUp}>
                The room is open. First years and final years show up, from every
                branch. Some come to ship games or products; others come to run
                tournaments, film the events, or handle the media desk for the
                club that shipped last week.
              </motion.p>
              <motion.p variants={fadeUp}>
                Failure is treated as part of the learning, not the outcome.
                Ideas get argued with, not dismissed. Everyone here is either
                building something or helping someone else build something.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
