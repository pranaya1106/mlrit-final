'use client';

/** CIE — Numbers as a dramatic count-up band. */

import { motion } from 'framer-motion';
import { SectionHead, useCountUp, EASE, IN_VIEW } from './cieShared';

const STATS = [
  { value: 500, label: 'Students engaged', suffix: '+' },
  { value: 80, label: 'Microprojects', suffix: '+' },
  { value: 40, label: 'Products built', suffix: '+' },
  { value: 25, label: 'Startups mentored', suffix: '+' },
];

function Stat({ value, label, suffix, showDivider, index }: { value: number; label: string; suffix: string; showDivider: boolean; index: number }) {
  const { ref, n } = useCountUp(value);
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
      className="group relative px-2 md:px-8 py-6"
    >
      {showDivider && (
        <motion.span
          aria-hidden
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.9, ease: EASE } } }}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-[64%] w-px bg-white/12 origin-center"
        />
      )}
      <div className="font-mono text-[0.56rem] font-bold tracking-[0.28em] uppercase text-white/40">№ 0{index + 1}</div>
      <div
        ref={ref}
        className="mt-4 font-sans font-black text-white leading-[0.82] tracking-tighter-3 tabular-nums text-[clamp(3.2rem,7.5vw,6rem)] transition-colors duration-500 group-hover:text-primary"
      >
        {n.toLocaleString('en-IN')}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-4 font-mono text-[0.64rem] font-bold tracking-[0.22em] uppercase text-white/60">{label}</div>
    </motion.div>
  );
}

export default function CieNumbers() {
  return (
    <section id="numbers" className="relative bg-black py-24 md:py-36 overflow-hidden border-t border-white/[0.08]">
      {/* Huge faint backdrop word */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-sans font-black text-white/[0.03] leading-none tracking-tighter-3 select-none"
        style={{ fontSize: 'clamp(8rem, 24vw, 22rem)' }}
      >
        IMPACT
      </span>

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHead eyebrow="By the numbers" index="§ impact" title={<>Our impact so far.</>} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <Stat key={s.label} value={s.value} label={s.label} suffix={s.suffix} showDivider={i < STATS.length - 1} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
