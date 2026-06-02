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

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

// Card width + gap in px — must match CSS
const CARD_W = 320;
const GAP     = 40;
const SLOT    = CARD_W + GAP;

export default function MilestonesTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive]     = useState(0);
  const [txPx,   setTxPx]       = useState(0);
  const [started, setStarted]   = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = -top;
      const total    = height - window.innerHeight;
      if (scrolled < 0) { setStarted(false); return; }
      setStarted(true);
      const p       = Math.max(0, Math.min(1, scrolled / total));
      const idx     = Math.min(TIMELINE.length - 1, Math.floor(p * TIMELINE.length));
      // smooth sub-index progress within the current slot
      const slotP   = (p * TIMELINE.length) - idx;
      const tx      = -(idx * SLOT + slotP * SLOT);
      setActive(idx);
      setTxPx(tx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="bg-warm-light">

      {/* ── Heading ── */}
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-8">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">
          Milestones
        </span>
        <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
          Two decades,{' '}
          <span className="font-display italic font-medium" style={gradientText}>
            in eight moments.
          </span>
        </h2>
      </div>

      {/* ── Tall scroll container ── */}
      <div
        ref={wrapperRef}
        style={{ height: `${TIMELINE.length * 40}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

          {/* Clipping mask so cards slide in/out of view */}
          <div className="overflow-hidden w-full">

            {/* ── Horizontal strip ── */}
            <div
              className="flex items-start"
              style={{
                gap: `${GAP}px`,
                paddingLeft: `calc(50vw - ${CARD_W / 2}px)`,
                paddingRight: `calc(50vw - ${CARD_W / 2}px)`,
                transform: `translateX(${txPx}px)`,
                /* lerp-style transition: short enough to feel live, long enough to feel smooth */
                transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform',
              }}
            >
              {TIMELINE.map((item, i) => {
                const isActive = i === active;
                const dist     = Math.abs(i - active);
                const scale    = isActive ? 1 : Math.max(0.82, 1 - dist * 0.06);
                const opacity  = isActive ? 1 : Math.max(0.35, 1 - dist * 0.22);

                return (
                  <div
                    key={item.y}
                    style={{
                      width:  `${CARD_W}px`,
                      flexShrink: 0,
                      transform: `scale(${scale})`,
                      opacity,
                      transition: 'transform 0.4s ease, opacity 0.4s ease',
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {/* ── Image ── */}
                    <div
                      className="rounded-2xl overflow-hidden border border-border shadow-card-soft"
                      style={{ aspectRatio: '4/3' }}
                    >
                      <img
                        src={item.img}
                        alt={item.t}
                        className="w-full h-full object-cover"
                        style={{
                          filter: isActive ? 'none' : 'grayscale(30%)',
                          transition: 'filter 0.4s ease',
                        }}
                      />
                    </div>

                    {/* ── Timeline node + line row ── */}
                    <div className="relative flex items-center mt-5" style={{ height: '20px' }}>
                      {/* Left connector line */}
                      <div
                        className="flex-1 h-px"
                        style={{
                          background: i === 0 ? 'transparent' : isActive || i <= active ? '#1F6B24' : 'var(--border)',
                          transition: 'background 0.4s ease',
                        }}
                      />
                      {/* Node */}
                      <div
                        className="flex-shrink-0 grid place-items-center rounded-full border-2 transition-all duration-400 z-10"
                        style={{
                          width:       isActive ? '20px' : '14px',
                          height:      isActive ? '20px' : '14px',
                          borderColor: i <= active ? '#1F6B24' : 'var(--border)',
                          background:  isActive ? '#1F6B24' : i < active ? '#a7f3b0' : '#f5f0e8',
                          transition:  'all 0.4s ease',
                        }}
                      >
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      {/* Right connector line */}
                      <div
                        className="flex-1 h-px"
                        style={{
                          background: i === TIMELINE.length - 1 ? 'transparent' : i < active ? '#1F6B24' : 'var(--border)',
                          transition: 'background 0.4s ease',
                        }}
                      />
                    </div>

                    {/* ── Year + title + description ── */}
                    <div className="mt-4 text-center px-1">
                      <span
                        className="block font-display italic font-black leading-none tracking-tighter-2"
                        style={{ ...gradientText, fontSize: 'clamp(2rem,3vw,2.4rem)' }}
                      >
                        {item.y}
                      </span>
                      <span className="mt-1 block font-sans font-extrabold text-foreground text-[1rem] tracking-tight">
                        {item.t}
                      </span>
                      {/* Description only visible on active card */}
                      <p
                        className="mt-2 text-muted text-[0.88rem] leading-relaxed"
                        style={{
                          opacity:   isActive ? 1 : 0,
                          transform: isActive ? 'translateY(0)' : 'translateY(6px)',
                          transition: 'opacity 0.4s ease, transform 0.4s ease',
                          minHeight: '3.5rem',
                        }}
                      >
                        {item.d}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Progress dots ── */}
          <div className="flex justify-center gap-2 mt-8">
            {TIMELINE.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width:      active === i ? '28px' : '7px',
                  height:     '7px',
                  background: i <= active ? '#1F6B24' : '#d1d5db',
                }}
              />
            ))}
          </div>

          {/* ── Scroll hint ── */}
          {!started && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
              <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-muted">Scroll</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M8 13l-4-4M8 13l4-4" stroke="#1F6B24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

        </div>
      </div>

      <div className="h-20 bg-warm-light" />
    </section>
  );
}
