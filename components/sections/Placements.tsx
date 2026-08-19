'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { asGalleryItems } from '@/lib/content/sections';
import { recruiterLogosFrom } from '@/lib/placements';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';

type Stat = { target: number; suffix: string; label: string };

const STATS: Stat[] = [
  { target: 44,  suffix: 'LPA', label: 'Highest Package' },
  { target: 5,   suffix: 'K+',  label: 'Students Placed in Top MNCs' },
  { target: 18,  suffix: 'LPA', label: 'Avg. Salary — Top 25%' },
  { target: 200, suffix: '+',   label: 'Recruiters incl. IIT/IIM/NIT Hirers' },
];

type PlacementsProps = {
  /** Gallery items from placements/recruiters; falls back to the bundled set. */
  logos?: unknown;
};

export default function Placements(props: PlacementsProps) {
  // Live-preview draft wins over the saved props.
  const { logos } = useMergedSection('placements/recruiters', props);

  // Same source as /placements/recruiters, mapped to { src, alt }. An empty
  // gallery yields the bundled 16, so this renders unchanged until someone
  // saves the CMS field.
  const recruiterLogos = recruiterLogosFrom(asGalleryItems(logos));

  return (
    <div id={sectionDomId('placements/recruiters')}>
    <section id="placements" style={{ backgroundColor: '#0c0c0e' }} className="relative bg-ink text-white py-10 md:py-14 overflow-hidden">
      {/* Network background SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.55] pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="plNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.7">
          <line x1="5%"  y1="15%" x2="28%" y2="42%" /><line x1="28%" y1="42%" x2="55%" y2="20%" />
          <line x1="55%" y1="20%" x2="80%" y2="38%" /><line x1="80%" y1="38%" x2="95%" y2="12%" />
          <line x1="28%" y1="42%" x2="45%" y2="68%" /><line x1="45%" y1="68%" x2="70%" y2="75%" />
          <line x1="70%" y1="75%" x2="80%" y2="38%" /><line x1="55%" y1="20%" x2="45%" y2="68%" />
          <line x1="10%" y1="70%" x2="28%" y2="42%" /><line x1="10%" y1="70%" x2="45%" y2="68%" />
          <line x1="70%" y1="75%" x2="92%" y2="85%" /><line x1="80%" y1="38%" x2="92%" y2="85%" />
          <line x1="5%"  y1="15%" x2="55%" y2="20%" /><line x1="92%" y1="85%" x2="95%" y2="12%" />
        </g>
        <g fill="#ffffff">
          {[[ '5%','15%',3], ['28%','42%',4], ['55%','20%',3], ['80%','38%',4], ['95%','12%',2.5], ['45%','68%',3.5], ['70%','75%',3], ['10%','70%',2.5], ['92%','85%',3]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx as string} cy={cy as string} r={r as number} opacity={0.7} />
          ))}
        </g>
      </svg>

      {/* Header */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-12 text-center">
        <span className="font-mono text-[0.72rem] font-bold tracking-[0.18em] uppercase text-white/55 mb-3 inline-block">
          Placements
        </span>
        <h2 className="font-sans font-black tracking-tighter-2 leading-[1.04] text-white text-[clamp(2.2rem,4vw,3.6rem)]">
          From Campus <span className="font-display italic font-medium text-warm">to Corporate.</span>
        </h2>
        <p className="mt-4 text-white/72 leading-relaxed max-w-[600px] mx-auto">
          Our placement records reflect the quality of education and industry readiness we build in every student.
        </p>

        {/* Gold divider line */}
        <div className="mt-10 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-warm to-transparent" />

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {STATS.map((s, i) => <PlacementStat key={i} {...s} />)}
        </div>

        {/* Recruiters label */}
        <p className="mt-16 font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-white/45">
          Global Hiring Partners
        </p>
      </div>

      {/* Full-bleed scrolling band */}
      <div className="relative z-10 mt-8 overflow-hidden mask-fade">
        <div className="flex gap-10 animate-marquee w-max">
          {[...recruiterLogos, ...recruiterLogos].map((logo, i) => (
            <div key={i} className="flex-shrink-0 h-20 w-40 grid place-items-center rounded-xl bg-white/[0.06] border border-white/10 px-5 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt="" className="max-w-full max-h-full object-contain opacity-90" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 text-center mt-12">
        <Link href="/placements"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-white/30 text-white font-medium text-[0.85rem] tracking-[0.1em] uppercase hover:bg-white hover:text-foreground transition-colors">
          Explore More →
        </Link>
      </div>

      {/* Marquee + mask styles */}
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .mask-fade {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
      `}</style>
    </section>
    </div>
  );
}

function PlacementStat({ target, suffix, label }: Stat) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start: number | null = null;
        const dur = 1400;
        const tick = (ts: number) => {
          if (!start) start = ts;
          const t = Math.min(1, (ts - start) / dur);
          const ease = 1 - Math.pow(1 - t, 3);
          setN(Math.round(target * ease));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  // For "44 LPA" style suffix keep a space; for "+" or "K+" no space
  const space = /[A-Za-z]/.test(suffix) ? ' ' : '';
  return (
    <div ref={ref} className="text-center">
      <div className="font-sans font-black text-white leading-none tracking-tighter-2 text-[clamp(2rem,3vw,2.6rem)]">
        {n}<span className="text-warm">{space}{suffix}</span>
      </div>
      <div className="mt-3 font-mono font-medium text-[0.68rem] tracking-[0.16em] uppercase text-white/55 max-w-[160px] mx-auto leading-tight">
        {label}
      </div>
    </div>
  );
}
