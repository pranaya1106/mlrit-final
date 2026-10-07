'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SCOPE_CYAN = '#00C2FF';
const EASE = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { label: 'Students', value: '3,000+' },
  { label: 'Teachers', value: '50+' },
  { label: 'Admins',   value: '10+' },
] as const;

export default function ScopeBuiltTool() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });

  return (
    <section
      ref={ref}
      className="relative z-10 px-6 md:px-10 lg:px-16 py-28 md:py-40"
      aria-label="What SCOPE built"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-6"
        >
          <span aria-hidden className="h-px w-6" style={{ backgroundColor: SCOPE_CYAN }} />
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: SCOPE_CYAN }}>
            What SCOPE Built
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-20 items-end">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
              className="font-sans font-black text-white leading-[0.98]"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              CodeStats
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
              className="mt-4 italic text-white/45"
              style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
            >
              Sharpen every line of code.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.26 }}
              className="mt-6 text-white/55 leading-[1.75] max-w-[560px]"
              style={{ fontSize: 'clamp(0.92rem, 1.2vw, 1.02rem)' }}
            >
              CodeStats is an in-house coding assessment platform built by SCOPE Club for
              MLR Institute of Technology. Students take coding assessments, join cohorts,
              practice in the arena, and track how their coding performance improves over
              time — exclusively for the MLRIT community, with dashboards for scheduling
              assessments, managing cohorts, and reviewing every submission.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.34 }}
              href="https://scope.mlrit.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-9 font-mono text-[0.72rem] font-bold tracking-[0.2em] uppercase px-6 py-3.5 rounded-full transition-colors"
              style={{ backgroundColor: SCOPE_CYAN, color: '#031820' }}
            >
              Visit CodeStats ↗
            </motion.a>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-5 lg:border-l lg:border-white/10 lg:pl-10">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease: EASE, delay: 0.3 + i * 0.08 }}
              >
                <div
                  className="font-sans font-black leading-none"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: SCOPE_CYAN }}
                >
                  {s.value}
                </div>
                <div className="mt-2 font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/35">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
