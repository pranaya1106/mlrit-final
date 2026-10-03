'use client';

import { RefObject } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: '-80px' } as const;

const stagger = (childDelay = 0.06, initial = 0.02) => ({
  hidden: {},
  show: { transition: { staggerChildren: childDelay, delayChildren: initial } },
});

const fadeUpTight = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
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
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } } }}
      />
      <motion.span
        className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-primary"
        variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

const OBJECTIVES = [
  { n: '01', t: 'Foster innovation',   b: 'Innovation and entrepreneurial thinking as everyday habits — not one-week competitions.' },
  { n: '02', t: 'Build the room',      b: 'Facilities and resources that let the ambitious go from idea to working prototype.' },
  { n: '03', t: 'Open the door',       b: 'Direct connections to industry mentors and founders who reply, review and open the next door.' },
  { n: '04', t: 'Back the founders',   b: 'Support student-led startups — from the deck to DPIIT registration and the first customer.' },
  { n: '05', t: 'Bring the stage',     b: 'Hackathons, workshops and speaker series that give every good idea an audience.' },
  { n: '06', t: 'Bridge two worlds',   b: 'Sit at the intersection of academia and industry — turn coursework into launched product.' },
];

const VERTICALS = [
  { code: 'MP', logo: '/images/clubs/cie/verticals/mp.svg', name: 'Microprojects',       body: 'Small teams. 8-week sprints. First place a raw idea meets a whiteboard, a deadline and teammates.' },
  { code: 'CS', logo: '/images/clubs/cie/verticals/cs.svg', name: 'CIE Studios',         body: 'Six studios capturing campus stories through photography, video and digital content.' },
  { code: 'PD', logo: '/images/clubs/cie/verticals/pd.svg', name: 'Product Development', body: 'Promising projects taken from prototype to real deployment. 15 currently live with real users.' },
  { code: 'SC', logo: '/images/clubs/cie/verticals/sc.svg', name: 'Startup Cohort',      body: 'Founders in training — problem understanding, user interviews, unit economics. The parts people skip.' },
];

interface Props {
  sectionRef: RefObject<HTMLElement | null>;
}

export default function CieHowItWorks({ sectionRef }: Props) {
  return (
    <section ref={sectionRef} className="relative bg-black">

      {/* Vision + Mission */}
      <div className="py-20 md:py-24 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Vision &amp; Mission</Eyebrow>
          <motion.div
            className="mt-10 grid lg:grid-cols-2 lg:divide-x lg:divide-white/10"
            initial="hidden"
            whileInView="show"
            viewport={IN_VIEW}
            variants={stagger(0.16, 0.1)}
          >
            {[
              { n: '01', label: 'Vision',  body: 'Create a student culture where innovation is not limited to competitions or special occasions.' },
              { n: '02', label: 'Mission', body: 'Make learning more practical, collaborative and student-driven.' },
            ].map((v, i) => (
              <motion.div
                key={v.n}
                variants={stagger(0.1, 0)}
                className={i === 0 ? 'lg:pr-14' : 'mt-12 lg:mt-0 lg:pl-14'}
              >
                <div className="flex items-baseline gap-4">
                  <motion.span
                    variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 0.25, y: 0, transition: { duration: 0.8, ease: EASE } } }}
                    className="font-sans font-black text-white text-[3rem] leading-none tracking-tighter-2 tabular-nums"
                    style={{ display: 'inline-block' }}
                  >
                    {v.n}
                  </motion.span>
                  <motion.span variants={fadeUpTight} className="font-mono text-[0.66rem] font-bold tracking-[0.24em] uppercase text-white/55">
                    {v.label}
                  </motion.span>
                </div>
                <motion.p variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                  className="mt-5 text-white text-[clamp(1.15rem,1.55vw,1.4rem)] leading-[1.5] font-medium max-w-[42ch]"
                >
                  {v.body}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Six Pillars */}
      <div className="py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>Six pillars · How we work</Eyebrow>
              <motion.h2
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]"
                initial="hidden" whileInView="show" viewport={IN_VIEW}
                variants={stagger(0.07, 0.05)}
                style={{ display: 'block' }}
              >
                {['Six', 'ways', 'of', 'moving.'].map((w, i) => (
                  <motion.span key={i} variants={{ hidden: { opacity: 0, y: '0.4em' }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                    style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
                ))}
              </motion.h2>
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">§ 01 → 06</div>
          </div>

          <div className="space-y-2">
            {OBJECTIVES.map((o, i) => (
              <motion.div
                key={o.n}
                initial="hidden" whileInView="show" viewport={IN_VIEW}
                variants={stagger(0.1, 0)}
                whileHover="hover"
                className={`group relative py-8 md:py-10 lg:py-12 ${i % 2 !== 0 ? 'lg:pl-[8%]' : ''}`}
              >
                <motion.span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px bg-white/15 origin-left"
                  variants={{
                    hidden: { scaleX: 0 },
                    show:   { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
                    hover:  { backgroundColor: 'rgba(232,93,4,0.7)', transition: { duration: 0.35 } },
                  }}
                />
                <div className="grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-start">
                  <motion.div variants={{ hidden: { opacity: 0, y: 32, x: -8 }, show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, ease: EASE } } }}>
                    <div
                      className="font-sans font-black leading-[0.85] tracking-tighter-3 tabular-nums text-white/40 group-hover:text-primary transition-colors duration-500"
                      style={{ fontSize: 'clamp(3.8rem, 8vw, 7rem)' }}
                    >
                      {o.n}
                    </div>
                  </motion.div>
                  <motion.div variants={fadeUpTight} className="pt-2 md:pt-4 max-w-[62ch]">
                    <h3 className="font-sans font-black text-white text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.1] tracking-tight">{o.t}</h3>
                    <p className="mt-3 md:mt-4 text-white/55 text-[0.98rem] md:text-[1.02rem] leading-[1.7]">{o.b}</p>
                  </motion.div>
                  <motion.div variants={fadeUpTight} className="hidden md:flex flex-col items-end gap-3 pt-3 min-w-[3rem]">
                    <span className="font-mono text-[0.6rem] font-bold tracking-[0.24em] uppercase text-white/30">Pillar</span>
                    <span aria-hidden className="w-8 h-px bg-white/15 group-hover:bg-primary group-hover:w-14 transition-all duration-500 ease-out-quart" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
            <motion.span aria-hidden initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={IN_VIEW}
              transition={{ duration: 0.9, ease: EASE }} className="block h-px bg-white/15 origin-left" />
          </div>
        </div>
      </div>

      {/* Four Verticals */}
      <div className="py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/clubs/cie/decor/beam.svg" alt="" aria-hidden
          className="hidden lg:block absolute -top-12 -right-32 w-[520px] h-auto pointer-events-none select-none z-0"
          style={{ opacity: 0.35, mixBlendMode: 'screen' }}
        />
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap max-w-[1200px]">
            <div>
              <Eyebrow>What&apos;s inside</Eyebrow>
              <motion.h2
                className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)] max-w-[14ch]"
                initial="hidden" whileInView="show" viewport={IN_VIEW}
                variants={stagger(0.07, 0.05)} style={{ display: 'block' }}
              >
                {['Four', 'rooms.', 'Four', 'teams.'].map((w, i) => (
                  <motion.span key={i} variants={{ hidden: { opacity: 0, y: '0.4em' }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                    style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
                ))}
              </motion.h2>
            </div>
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 pb-2">§ 04 / MP · CS · PD · SC</div>
          </div>

          <div className="space-y-2">
            {VERTICALS.map((v, i) => {
              const flipped = i % 2 === 1;
              return (
                <motion.article
                  key={v.code}
                  initial="hidden" whileInView="show" viewport={IN_VIEW}
                  variants={stagger(0.08, 0)}
                  whileHover="hover"
                  className="group relative py-10 md:py-14 lg:py-16"
                >
                  <motion.span aria-hidden className="absolute top-0 left-0 right-0 h-px bg-white/15 origin-left"
                    variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } }, hover: { backgroundColor: 'rgba(232,93,4,0.7)', transition: { duration: 0.35 } } }}
                  />
                  <span aria-hidden
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl ${flipped ? 'right-0 md:-right-20' : 'left-0 md:-left-20'}`}
                    style={{ backgroundColor: 'rgba(232,93,4,0.12)' }}
                  />
                  <div className={`relative grid gap-8 md:gap-14 items-center ${flipped ? 'md:grid-cols-[1fr_auto]' : 'md:grid-cols-[auto_1fr]'}`}>
                    <motion.div
                      variants={{ hidden: { opacity: 0, scale: 0.85, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}
                      className={`relative flex-shrink-0 mx-auto md:mx-0 ${flipped ? 'md:order-2' : ''}`}
                    >
                      <div aria-hidden className={`absolute inset-0 flex items-center pointer-events-none select-none ${flipped ? 'justify-end -mr-8' : 'justify-start -ml-8'}`}>
                        <span className="font-sans font-black leading-[0.75] tracking-tighter-3 text-white/[0.05] group-hover:text-white/[0.08] transition-colors duration-700"
                          style={{ fontSize: 'clamp(9rem, 18vw, 20rem)' }}>{v.code}</span>
                      </div>
                      <motion.div
                        className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] lg:w-[340px] lg:h-[340px] flex items-center justify-center"
                        whileHover={{ rotate: [-1.5, 1.5, -1, 0] }}
                        transition={{ duration: 0.7, ease: EASE }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={v.logo} alt={`${v.name} logo`}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.06]" />
                      </motion.div>
                    </motion.div>
                    <motion.div variants={fadeUpTight} className={`max-w-[52ch] ${flipped ? 'md:order-1 md:text-right md:ml-auto' : ''}`}>
                      <div className={`flex items-center gap-3 mb-4 ${flipped ? 'md:justify-end' : ''}`}>
                        <span className="font-mono text-[0.62rem] font-bold tracking-[0.28em] uppercase text-primary">Vertical · {String(i + 1).padStart(2, '0')}</span>
                        <span aria-hidden className="h-px w-8 bg-primary" />
                      </div>
                      <h3 className="font-sans font-black text-white text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.98] tracking-tighter-2">{v.name}</h3>
                      <p className={`mt-5 text-white/60 text-[1rem] md:text-[1.05rem] leading-[1.75] ${flipped ? 'md:ml-auto' : ''}`}>{v.body}</p>
                    </motion.div>
                  </div>
                </motion.article>
              );
            })}
            <motion.span aria-hidden initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={IN_VIEW}
              transition={{ duration: 0.9, ease: EASE }} className="block h-px bg-white/15 origin-left" />
          </div>
        </div>
      </div>
    </section>
  );
}
