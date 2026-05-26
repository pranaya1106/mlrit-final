'use client';

import { useEffect, useRef, useState } from 'react';

type Stat = { target: number; suffix: string; label: string };

const STATS: Stat[] = [
  { target: 20,  suffix: '+',   label: 'Years of Excellence' },
  { target: 11,  suffix: 'K+',  label: 'Students Enrolled' },
  { target: 98,  suffix: '%',   label: 'Placement Rate' },
  { target: 200, suffix: '+',   label: 'Recruiting Companies' },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="border-b border-border"
      style={{ background: 'linear-gradient(135deg, var(--orange-50) 0%, var(--background) 50%, var(--green-50) 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => <StatItem key={i} {...s} />)}
        </div>
      </div>
    </section>
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
