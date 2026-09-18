'use client';

import { useEffect, useRef, useState } from 'react';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

type Stat = { target: number; suffix: string; label: string; caption: string; footnote: string };

const STATS: Stat[] = [
  { target: 20,  suffix: '+',   label: 'Years of Excellence',   caption: 'Est · 2005',                  footnote: 'Autonomous under UGC since 2015' },
  { target: 11,  suffix: 'K+',  label: 'Students Enrolled',     caption: 'UG · PG · Research',          footnote: 'Across 8 engineering programmes' },
  { target: 98,  suffix: '%',   label: 'Placement Rate',        caption: 'Batch of 2025',               footnote: 'Verified · Placement Cell records' },
  { target: 200, suffix: '+',   label: 'Recruiting Companies',  caption: 'Incl. IIT / IIM / NIT hirers', footnote: 'Fortune 500 · Startups · MNCs' },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="paper-ground grain-texture border-b border-border relative z-[1] overflow-hidden"
    >
      {/* Ghost "01" numeral in the background — editorial anchor.
          Hidden on mobile: at min clamp size (12rem) it overwhelms a
          phone-width viewport and bleeds into the stat text. */}
      <div aria-hidden className="ghost-numeral top-16 right-8 md:right-16 hidden md:block">
        01
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12 pt-10 md:pt-0 pb-6 md:pb-10">

        {/* The 4 ledger numbers — single column stack on mobile, 4-up on desktop */}
        <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-5 md:gap-y-12" delay={0.08}>
          {STATS.map((s, i) => (
            <StaggerItem key={i}>
              <StatItem index={i} {...s} />
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}

function StatItem({ target, suffix, label, caption, footnote, index }: Stat & { index: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start: number | null = null;
        const dur = 1600;
        const tick = (ts: number) => {
          if (!start) start = ts;
          const t = Math.min(1, (ts - start) / dur);
          const ease = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(target * ease));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);

  const idx = String(index + 1).padStart(2, '0');

  return (
    <div ref={ref} className="flex flex-col items-start border-t-2 border-border/70 pt-3 md:pt-5 group relative">
      {/* First item's caption now lives in Hero, anchored to the image, so
          it isn't shown twice on mobile. */}
      <div className={`${index === 0 ? 'hidden md:flex' : 'flex'} items-center gap-2 mb-2 md:mb-4 w-full`}>
        <span className="chapter-mark !text-[0.66rem]">{idx}</span>
        <span className="editorial-eyebrow !text-[0.66rem] truncate">{caption}</span>
      </div>
      <div className="flex items-baseline gap-1 text-foreground">
        <span className="font-sans font-black leading-none tracking-tighter-3 text-[2.2rem] md:text-[clamp(3.4rem,5.6vw,4.8rem)]">
          {count}
        </span>
        <span className="editorial-italic text-primary leading-none text-[1.3rem] md:text-[clamp(2rem,3vw,2.6rem)]">
          {suffix}
        </span>
      </div>
      <div className="mt-2 md:mt-4 font-sans font-semibold text-[0.9rem] md:text-[1.02rem] text-foreground/85 leading-snug">
        {label}
      </div>
      <div className="mt-1 md:mt-1.5 text-muted text-[0.76rem] md:text-[0.82rem] leading-snug">
        <span className="hidden md:inline text-primary font-mono font-bold mr-1">†</span>
        {footnote}
      </div>
    </div>
  );
}
