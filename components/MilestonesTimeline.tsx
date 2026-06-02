'use client';

import { useEffect, useRef, useState } from 'react';

const TIMELINE = [
  { y: '2005', t: 'Foundation Stone',   d: 'MLR Institute of Technology established under KMR Educational Society at Dundigal, Hyderabad.',            img: '/images/about/milestone-2005.jpg' },
  { y: '2008', t: 'First Graduation',   d: 'First batch of B.Tech graduates step out — placed across Wipro, Infosys and TCS.',                         img: '/images/about/milestone-2008.jpg' },
  { y: '2012', t: 'NBA Cycle Begins',   d: 'CSE, ECE and Mechanical programmes earn first NBA accreditation cycle.',                                    img: '/images/about/milestone-2012.jpg' },
  { y: '2017', t: 'IPFC Established',   d: 'Intellectual Property Facilitation Centre opens to support patent filings and IPR awareness.',              img: '/images/about/milestone-2017.jpg' },
  { y: '2019', t: 'NAAC Accreditation', d: 'Institutional NAAC accreditation granted — recognises overall quality.',                                    img: '/images/about/milestone-2019.jpg' },
  { y: '2022', t: 'Autonomous Status',  d: 'UGC grants autonomous status — institution designs its own regulations.',                                   img: '/images/about/milestone-2022.jpg' },
  { y: '2025', t: 'Two Decades',        d: 'MLRIT crosses 20 years with 7,000+ alumni placed across the world.',                                       img: '/images/about/milestone-2025.jpg' },
  { y: '2026', t: 'Trishna 2K26',       d: '21st Annual Day — 621 placement offers and a ₹51 LPA top package mark the strongest season yet.',          img: '/images/about/milestone-2026.jpg' },
];

const COLORS = [
  'linear-gradient(135deg,#1F6B24 0%,#2d8a35 100%)',
  'linear-gradient(135deg,#14532d 0%,#1F6B24 100%)',
  'linear-gradient(135deg,#166534 0%,#22c55e44 100%)',
  'linear-gradient(135deg,#1F6B24 0%,#15803d 100%)',
  'linear-gradient(135deg,#064e3b 0%,#1F6B24 100%)',
  'linear-gradient(135deg,#14532d 0%,#2d8a35 100%)',
  'linear-gradient(135deg,#1F6B24 0%,#166534 100%)',
  'linear-gradient(135deg,#064e3b 0%,#1F6B24 100%)',
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function MilestonesTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = -top;
      const total = height - window.innerHeight;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
      setActive(Math.min(TIMELINE.length - 1, Math.floor(p * TIMELINE.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Each card gets a top offset so they stack visually
  const CARD_HEIGHT = 140; // px, approximate card height
  const STACK_OFFSET = 44; // px between stacked cards

  return (
    <section className="bg-warm-light">
      {/* Section heading — outside sticky, scrolls normally */}
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-10">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Milestones</span>
        <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
          Two decades,{' '}
          <span className="font-display italic font-medium" style={gradientText}>in eight moments.</span>
        </h2>
      </div>

      {/* Tall scroll container */}
      <div
        ref={wrapperRef}
        style={{ height: `${TIMELINE.length * 100}vh` }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div className="w-full max-w-[1180px] mx-auto px-6 md:px-12 lg:px-20">

            <div className="flex gap-10 lg:gap-16 items-start">

              {/* LEFT: sticky image pane */}
              <div className="hidden md:flex flex-col gap-4 w-[340px] lg:w-[380px] flex-shrink-0">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-card-soft">
                  {TIMELINE.map((item, i) => (
                    <div
                      key={item.y}
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{ opacity: active === i ? 1 : 0, zIndex: active === i ? 1 : 0 }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: COLORS[i] }}>
                        <span className="font-display italic font-black text-white/25 select-none leading-none" style={{ fontSize: 'clamp(3.5rem,8vw,6rem)' }}>{item.y}</span>
                        <span className="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white/40">{item.t}</span>
                      </div>
                      <img src={item.img} alt={item.t} className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ))}
                </div>

                {/* Active year */}
                <div className="flex items-baseline gap-3">
                  <span className="font-display italic font-black leading-none tracking-tighter-2 transition-all duration-300"
                    style={{ ...gradientText, fontSize: 'clamp(2rem,2.8vw,2.6rem)' }}>
                    {TIMELINE[active].y}
                  </span>
                  <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">
                    {String(active + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-0.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress * 100}%`, background: '#1F6B24' }} />
                </div>
              </div>

              {/* RIGHT: stacking cards */}
              <div className="flex-1 relative" style={{ height: `${STACK_OFFSET * (TIMELINE.length - 1) + CARD_HEIGHT + 48}px` }}>

                {TIMELINE.map((item, i) => {
                  // Card is "revealed" once we've scrolled past its entry point
                  const entryProgress = i / TIMELINE.length;
                  const isVisible = progress >= entryProgress - 0.01;
                  // Cards stack from top: each revealed card sits at its stacked position
                  const stackTop = i * STACK_OFFSET;
                  // Active card has no scale reduction; buried cards scale down slightly
                  const isBuried = isVisible && i < active;
                  const scale = isBuried ? 1 - (active - i) * 0.015 : 1;
                  const opacity = isVisible ? (isBuried ? Math.max(0.55, 1 - (active - i) * 0.12) : 1) : 0;

                  return (
                    <div
                      key={item.y}
                      className="absolute left-0 right-0 transition-all duration-500"
                      style={{
                        top: `${stackTop}px`,
                        opacity,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        zIndex: i + 1,
                      }}
                    >
                      {/* Horizontal rail + node */}
                      <div className="flex items-center gap-3 mb-3 px-1">
                        <div
                          className="grid place-items-center w-4 h-4 flex-shrink-0 rounded-full border-2 transition-colors duration-300"
                          style={{ borderColor: active === i ? '#1F6B24' : '#d1d5db', background: '#f5f0e8' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                            style={{ background: active === i ? '#1F6B24' : '#d1d5db' }} />
                        </div>
                        <div className="flex-1 h-px" style={{ background: active === i ? '#1F6B24' : 'var(--border)', transition: 'background 0.3s' }} />
                        <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle flex-shrink-0">
                          {String(i + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Card */}
                      <div
                        className="rounded-2xl border bg-white/95 backdrop-blur-sm px-6 py-5 transition-all duration-300"
                        style={{
                          borderColor: active === i ? '#1F6B24' : 'var(--border)',
                          boxShadow: active === i ? '0 8px 32px rgba(31,107,36,0.13)' : '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="font-display italic font-black leading-none tracking-tighter-2"
                            style={{ ...gradientText, fontSize: 'clamp(1.8rem,2.4vw,2.2rem)' }}>
                            {item.y}
                          </span>
                          <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] tracking-tight leading-snug">
                            {item.t}
                          </h3>
                        </div>
                        <p className="mt-2 text-muted leading-relaxed text-[0.93rem]">{item.d}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding after scroll section */}
      <div className="h-16 bg-warm-light" />

      {/* Mobile: simple horizontal snap */}
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
      <div className="md:hidden px-6 pb-16">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2">
          {TIMELINE.map((item, i) => (
            <div key={item.y} className="snap-center flex-shrink-0 w-[80vw]">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border mb-3 relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: COLORS[i] }}>
                  <span className="font-display italic font-black text-white/10 text-[5rem] leading-none select-none">{item.y}</span>
                </div>
                <img src={item.img} alt={item.t} className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="rounded-2xl border border-border bg-white/90 p-5">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display italic font-black text-[1.9rem] leading-none tracking-tighter-2" style={gradientText}>{item.y}</span>
                  <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">{String(i+1).padStart(2,'0')} / {String(TIMELINE.length).padStart(2,'0')}</span>
                </div>
                <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] tracking-tight leading-snug">{item.t}</h3>
                <p className="mt-2 text-muted leading-relaxed text-[0.9rem]">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
