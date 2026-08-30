'use client';

import { useEffect, useRef, useState } from 'react';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { asNumber, asRepeaterItems, asText } from '@/lib/content/sections';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';

type Stat = { target: number; suffix: string; label: string };

/**
 * Fallback counters. Used whenever the CMS repeater is empty, absent or fails
 * to load — the band must always render four complete figures, never a blank.
 */
const STATS: Stat[] = [
  { target: 20,  suffix: '+',   label: 'Years of Excellence' },
  { target: 11,  suffix: 'K+',  label: 'Students Enrolled' },
  { target: 98,  suffix: '%',   label: 'Placement Rate' },
  { target: 200, suffix: '+',   label: 'Recruiting Companies' },
];

/** 4 = the grid is grid-cols-2 md:grid-cols-4; a fifth would wrap alone. */
const MAX_STATS = 4;

type StatsProps = {
  /** Repeater rows from home/stats; falls back to the bundled counters. */
  stats?: unknown;
};

/**
 * Maps repeater rows onto the Stat shape, coercing per column so a half-typed
 * row renders a number rather than NaN. An empty list yields STATS verbatim,
 * so an unsaved section renders exactly as it did before the CMS existed.
 */
function statsFrom(value: unknown): Stat[] {
  const rows = asRepeaterItems(value);
  if (rows.length === 0) return STATS;

  return rows.slice(0, MAX_STATS).map((row, i) => ({
    target: asNumber(row.target, STATS[i]?.target ?? 0),
    suffix: asText(row.suffix),
    label: asText(row.label),
  }));
}

export default function Stats(props: StatsProps) {
  // Live-preview draft wins over the saved props; the fallback is unchanged.
  const { stats } = useMergedSection('home/stats', props);
  const items = statsFrom(stats);

  return (
    <div id={sectionDomId('home/stats')}>
    <section
      id="stats"
      className="border-b border-border"
      style={{ background: 'linear-gradient(135deg, var(--orange-50) 0%, var(--background) 50%, var(--green-50) 100%)' }}
    >
      <div className="w-full px-6 md:px-10 lg:px-12 py-14 md:py-20">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-10" delay={0.12}>
          {items.map((s, i) => (
            <StaggerItem key={i}><StatItem {...s} /></StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
    </div>
  );
}

function StatItem({ target, suffix, label }: Stat) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start: number | null = null;
        const dur = 1200;
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

  return (
    <div ref={ref} className="flex flex-col items-start">
      <div className="font-sans font-black text-foreground leading-none tracking-tighter-2 text-[clamp(2.4rem,4vw,3.2rem)]">
        <span>{count}</span>
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-3 font-sans font-bold text-[0.72rem] tracking-[0.16em] uppercase text-muted">
        {label}
      </div>
    </div>
  );
}
