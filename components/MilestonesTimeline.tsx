'use client';

import { useEffect, useRef, useState } from 'react';

const TIMELINE = [
  { y: '2005', t: 'Foundation Stone',   d: 'MLR Institute of Technology established under KMR Educational Society at Dundigal, Hyderabad.',   img: '/images/about/milestone-2005.jpg' },
  { y: '2008', t: 'First Graduation',   d: 'First batch of B.Tech graduates step out — placed across Wipro, Infosys and TCS.',                img: '/images/about/milestone-2008.jpg' },
  { y: '2012', t: 'NBA Cycle Begins',   d: 'CSE, ECE and Mechanical programmes earn first NBA accreditation cycle.',                          img: '/images/about/milestone-2012.jpg' },
  { y: '2017', t: 'IPFC Established',   d: 'Intellectual Property Facilitation Centre opens to support patent filings and IPR awareness.',    img: '/images/about/milestone-2017.jpg' },
  { y: '2019', t: 'NAAC Accreditation', d: 'Institutional NAAC accreditation granted — recognises overall quality.',                          img: '/images/about/milestone-2019.jpg' },
  { y: '2022', t: 'Autonomous Status',  d: 'UGC grants autonomous status — institution designs its own regulations.',                         img: '/images/about/milestone-2022.jpg' },
  { y: '2025', t: 'Two Decades',        d: 'MLRIT crosses 20 years with 7,000+ alumni placed across the world.',                             img: '/images/about/milestone-2025.jpg' },
  { y: '2026', t: 'Trishna 2K26',       d: '21st Annual Day — 621 placement offers and a ₹51 LPA top package mark the strongest season yet.', img: '/images/about/milestone-2026.jpg' },
];

const COLORS = ['#1F6B24','#236e28','#1a5e1f','#266b2c','#1F6B24','#236e28','#1a5e1f','#266b2c'];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function MilestonesTimeline() {
  const stickyRef = useRef<HTMLDivElement>(null);   // the sticky outer wrapper
  const trackRef  = useRef<HTMLDivElement>(null);   // the horizontal cards strip
  const [active, setActive]   = useState(0);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sticky = stickyRef.current;
      const track  = trackRef.current;
      if (!sticky || !track) return;

      const { top, height } = sticky.getBoundingClientRect();
      const scrollable = height - window.innerHeight;          // total vertical scroll range
      const progress   = Math.max(0, Math.min(1, -top / scrollable)); // 0 → 1

      const maxShift = track.scrollWidth - track.clientWidth;  // how far to slide left
      setTranslateX(-(progress * maxShift));

      // active card
      const cardWidth = track.scrollWidth / TIMELINE.length;
      setActive(Math.min(TIMELINE.length - 1, Math.floor(progress * TIMELINE.length)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="bg-warm-light">

      {/* Tall outer div — its height creates the scroll distance */}
      <div
        ref={stickyRef}
        style={{ height: `${TIMELINE.length * 80}vh` }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

          <div className="max-w-[1280px] mx-auto w-full px-6 md:px-12 lg:px-20">

            {/* Heading */}
            <div className="mb-10">
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Milestones</span>
              <h2 className="mt-2 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.04]">
                Two decades,{' '}
                <span className="font-display italic font-medium" style={gradientText}>in eight moments.</span>
              </h2>
            </div>

            {/* Two-col: image left + scrolling cards right */}
            <div className="flex gap-10 lg:gap-14 items-center">

              {/* Sticky image — only on md+ */}
              <div className="hidden md:block w-[320px] lg:w-[360px] flex-shrink-0">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-card-soft">
                  {TIMELINE.map((item, i) => (
                    <div
                      key={item.y}
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{ opacity: active === i ? 1 : 0, zIndex: active === i ? 1 : 0 }}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: COLORS[i] }}
                      >
                        <span
                          className="font-display italic font-black text-white/10 select-none leading-none"
                          style={{ fontSize: 'clamp(4rem,10vw,7rem)' }}
                        >
                          {item.y}
                        </span>
                      </div>
                      <img
                        src={item.img}
                        alt={item.t}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>

                {/* Year + counter */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span
                    className="font-display italic font-black leading-none tracking-tighter-2 transition-all duration-300"
                    style={{ ...gradientText, fontSize: 'clamp(2rem,2.8vw,2.6rem)' }}
                  >
                    {TIMELINE[active].y}
                  </span>
                  <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">
                    {String(active + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-0.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${((active + 1) / TIMELINE.length) * 100}%`, background: '#1F6B24' }}
                  />
                </div>
              </div>

              {/* Horizontal sliding cards — clipped, transforms on scroll */}
              <div className="flex-1 overflow-hidden">

                {/* Rail line above cards */}
                <div className="relative mb-0">
                  <div className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>

                <div
                  ref={trackRef}
                  className="flex gap-5 pt-8 will-change-transform"
                  style={{
                    transform: `translateX(${translateX}px)`,
                    transition: 'transform 0.05s linear',
                    width: 'max-content',
                  }}
                >
                  {TIMELINE.map((item, i) => (
                    <div key={item.y} className="relative w-[280px] lg:w-[300px] flex-shrink-0">

                      {/* Node on rail */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 grid place-items-center w-4 h-4 rounded-full border-2 transition-colors duration-300"
                        style={{ borderColor: active === i ? '#1F6B24' : '#d1d5db', background: '#f5f0e8' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                          style={{ background: active === i ? '#1F6B24' : '#d1d5db' }} />
                      </div>

                      {/* Card */}
                      <div
                        className="rounded-2xl border bg-white/90 backdrop-blur-sm p-5 lg:p-6 transition-all duration-300"
                        style={{
                          borderColor: active === i ? '#1F6B24' : 'var(--border)',
                          boxShadow: active === i ? '0 8px 28px rgba(31,107,36,0.12)' : '',
                          transform: active === i ? 'translateY(-4px)' : 'none',
                        }}
                      >
                        <div className="flex items-baseline gap-3">
                          <span
                            className="font-display italic font-black leading-none tracking-tighter-2"
                            style={{ ...gradientText, fontSize: 'clamp(1.8rem,2.5vw,2.2rem)' }}
                          >
                            {item.y}
                          </span>
                          <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">
                            {String(i + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="mt-3 font-sans font-extrabold text-foreground text-[1.05rem] tracking-tight leading-snug">
                          {item.t}
                        </h3>
                        <p className="mt-2 text-muted leading-relaxed text-[0.9rem]">{item.d}</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: simple horizontal snap scroll */}
          </div>
        </div>
      </div>

      {/* Mobile fallback — normal horizontal snap scroll */}
      <div className="md:hidden py-16 px-6">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Milestones</span>
        <h2 className="mt-2 mb-8 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.8rem,6vw,2.4rem)] leading-[1.04]">
          Two decades, <span className="font-display italic font-medium" style={gradientText}>in eight moments.</span>
        </h2>
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {TIMELINE.map((item, i) => (
            <div key={item.y} className="snap-center flex-shrink-0 w-[78vw]">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border mb-3 relative">
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: COLORS[i] }}>
                  <span className="font-display italic font-black text-white/10 text-[5rem] leading-none select-none">{item.y}</span>
                </div>
                <img src={item.img} alt={item.t} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="rounded-2xl border border-border bg-white/90 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-display italic font-black text-[2rem] leading-none tracking-tighter-2" style={gradientText}>{item.y}</span>
                  <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">{String(i+1).padStart(2,'0')} / {String(TIMELINE.length).padStart(2,'0')}</span>
                </div>
                <h3 className="mt-3 font-sans font-extrabold text-foreground text-[1.05rem] tracking-tight leading-snug">{item.t}</h3>
                <p className="mt-2 text-muted leading-relaxed text-[0.9rem]">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
