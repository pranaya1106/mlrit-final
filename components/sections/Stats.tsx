'use client';

import { useEffect, useRef, useState } from 'react';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { asNumber, asRepeaterItems, asText } from '@/lib/content/sections';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';

type Stat = { target: number; suffix: string; label: string; caption: string; footnote: string };

/**
 * Fallback counters. Used whenever the CMS repeater is empty, absent or fails
 * to load — the ledger must always render four complete figures, never a blank.
 */
const STATS: Stat[] = [
  { target: 20,  suffix: '+',   label: 'Years of Excellence',   caption: 'Est · 2005',                  footnote: 'Autonomous under UGC since 2015' },
  { target: 11,  suffix: 'K+',  label: 'Students Enrolled',     caption: 'UG · PG · Research',          footnote: 'Across 8 engineering programmes' },
  { target: 98,  suffix: '%',   label: 'Placement Rate',        caption: 'Batch of 2025',               footnote: 'Verified · Placement Cell records' },
  { target: 200, suffix: '+',   label: 'Recruiting Companies',  caption: 'Incl. IIT / IIM / NIT hirers', footnote: 'Fortune 500 · Startups · MNCs' },
];

type StatsProps = {
  /** Repeater rows from home/stats; falls back to the bundled counters. */
  stats?: unknown;
};

/**
 * Maps repeater rows onto the Stat shape, coercing per column so a half-typed
 * row renders a number rather than NaN. An empty list yields STATS verbatim,
 * so an unsaved section renders exactly as the redesign ships it.
 *
 * Every row is rendered. This used to slice to four, which silently discarded
 * a fifth counter an editor had filled in and saved — the grid wraps it onto a
 * second line, which is a layout question, not a reason to drop content.
 */
function statsFrom(value: unknown): Stat[] {
  const rows = asRepeaterItems(value);
  if (rows.length === 0) return STATS;

  return rows.map((row, i) => ({
    target: asNumber(row.target, STATS[i]?.target ?? 0),
    suffix: asText(row.suffix),
    label: asText(row.label),
    caption: asText(row.caption),
    footnote: asText(row.footnote),
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
        {/* Keyed on the row count so adding or removing a counter remounts the
            group and replays the reveal.

            Stagger is the parent: it holds whileInView with once:true, and each
            StaggerItem inherits its variant state rather than observing for
            itself. Once that parent has fired and detached its observer, a
            child mounted afterwards has no active animation to inherit and
            stays at `hidden` — opacity 0. The row was in the DOM and correct;
            it was simply invisible until a reload replayed the whole group,
            which is why a new counter only appeared after save + refresh.

            The public page renders a fixed number of rows, so the key never
            changes there and nothing re-animates. */}
        <Stagger
          key={items.length}
          className="grid grid-cols-1 md:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-5 md:gap-y-12"
          delay={0.08}
        >
          {items.map((s, i) => (
            <StaggerItem key={i}>
              <StatItem index={i} {...s} />
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
    </div>
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
