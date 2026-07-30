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
const CARD_W = 460;
const GAP     = 56;
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
      // scrolled = how many px of the wrapper have passed the top of viewport
      const scrolled = -top;
      const total    = height - window.innerHeight;
      if (scrolled <= 0) { setStarted(false); setActive(0); setTxPx(0); return; }
      if (scrolled >= total) { setStarted(true); setActive(TIMELINE.length - 1); setTxPx(-((TIMELINE.length - 1) * SLOT)); return; }
      setStarted(true);
      const p     = scrolled / total;
      const raw   = p * TIMELINE.length;
      const idx   = Math.min(TIMELINE.length - 1, Math.floor(raw));
      const slotP = raw - idx;
      setActive(idx);
      setTxPx(-(idx * SLOT + slotP * SLOT));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="bg-warm-light relative">

      {/* ── Tall scroll container — no top padding so sticky triggers immediately ── */}
      <div
        ref={wrapperRef}
        style={{ height: `${TIMELINE.length * 55}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden">

          {/* ── Giant background year watermark ── */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <span
              className="font-display italic font-black leading-none tracking-tighter-2"
              style={{
                fontSize: 'clamp(18rem,32vw,32rem)',
                color: 'transparent',
                WebkitTextStroke: '2px rgba(31,107,36,0.09)',
                transition: 'opacity 0.5s ease',
              }}
            >
              {TIMELINE[active].y}
            </span>
          </div>

          {/* ── Heading — pinned at top of sticky viewport ── */}
          <div className="relative w-full px-6 md:px-12 lg:px-16 pt-14 pb-2 flex-shrink-0">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[0.78rem] font-extrabold tracking-[0.28em] uppercase text-primary">
                Milestones
              </span>
              <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-muted">
                {String(active + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
              </span>
            </div>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2.2rem,5vw,4.4rem)] leading-[1.02]">
              Two decades,{' '}
              <span className="font-display italic font-medium" style={gradientText}>
                in eight moments.
              </span>
            </h2>
          </div>

          {/* Cards — fill remaining height, centred */}
          <div className="flex-1 flex flex-col justify-center overflow-hidden w-full">

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
                const scale    = isActive ? 1.02 : Math.max(0.78, 1 - dist * 0.07);
                const opacity  = isActive ? 1 : Math.max(0.28, 1 - dist * 0.26);

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
                      className="relative rounded-3xl overflow-hidden border-2"
                      style={{
                        aspectRatio: '4/3',
                        borderColor: isActive ? '#1F6B24' : 'var(--border)',
                        boxShadow: isActive
                          ? '0 24px 60px -12px rgba(31,107,36,0.35), 0 0 0 6px rgba(31,107,36,0.08)'
                          : '0 10px 30px -10px rgba(0,0,0,0.15)',
                        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.t}
                        className="w-full h-full object-cover"
                        style={{
                          filter: isActive ? 'none' : 'grayscale(40%) brightness(0.92)',
                          transition: 'filter 0.4s ease, transform 0.6s ease',
                          transform: isActive ? 'scale(1.02)' : 'scale(1)',
                        }}
                      />
                      {/* Year badge on image */}
                      <div
                        className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md font-mono font-bold text-[0.7rem] tracking-[0.18em] uppercase transition-all"
                        style={{
                          background: isActive ? 'rgba(31,107,36,0.95)' : 'rgba(255,255,255,0.85)',
                          color: isActive ? '#fff' : 'var(--foreground)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')} · {item.y}
                      </div>
                    </div>

                    {/* ── Timeline node + line row ── */}
                    <div className="relative flex items-center mt-6" style={{ height: '28px' }}>
                      {/* Left connector line */}
                      <div
                        className="flex-1"
                        style={{
                          height: '2px',
                          background: i === 0 ? 'transparent' : isActive || i <= active ? '#1F6B24' : 'var(--border)',
                          transition: 'background 0.4s ease',
                        }}
                      />
                      {/* Node */}
                      <div
                        className="flex-shrink-0 grid place-items-center rounded-full border-2 z-10"
                        style={{
                          width:       isActive ? '28px' : '16px',
                          height:      isActive ? '28px' : '16px',
                          borderColor: i <= active ? '#1F6B24' : 'var(--border)',
                          background:  isActive ? '#1F6B24' : i < active ? '#a7f3b0' : '#f5f0e8',
                          boxShadow:   isActive ? '0 0 0 8px rgba(31,107,36,0.15)' : 'none',
                          transition:  'all 0.4s ease',
                        }}
                      >
                        {isActive && (
                          <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      {/* Right connector line */}
                      <div
                        className="flex-1"
                        style={{
                          height: '2px',
                          background: i === TIMELINE.length - 1 ? 'transparent' : i < active ? '#1F6B24' : 'var(--border)',
                          transition: 'background 0.4s ease',
                        }}
                      />
                    </div>

                    {/* ── Year + title + description ── */}
                    <div className="mt-5 text-center px-2">
                      <span
                        className="block font-display italic font-black leading-none tracking-tighter-2"
                        style={{ ...gradientText, fontSize: isActive ? 'clamp(3.4rem,5vw,4.6rem)' : 'clamp(2.4rem,3.6vw,3rem)', transition: 'font-size 0.4s ease' }}
                      >
                        {item.y}
                      </span>
                      <span className="mt-2 block font-sans font-extrabold text-foreground tracking-tight" style={{ fontSize: isActive ? '1.4rem' : '1.05rem', transition: 'font-size 0.4s ease' }}>
                        {item.t}
                      </span>
                      {/* Description only visible on active card */}
                      <p
                        className="mt-3 text-muted leading-relaxed mx-auto"
                        style={{
                          opacity:   isActive ? 1 : 0,
                          transform: isActive ? 'translateY(0)' : 'translateY(6px)',
                          transition: 'opacity 0.4s ease, transform 0.4s ease',
                          minHeight: '3.5rem',
                          fontSize:  '1rem',
                          maxWidth:  '380px',
                        }}
                      >
                        {item.d}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>{/* end flex-1 cards area */}

          {/* ── Progress dots + year rail ── */}
          <div className="relative flex justify-center items-center gap-3 mt-10 mb-8">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:      active === i ? '40px' : '9px',
                    height:     '9px',
                    background: i <= active ? '#1F6B24' : '#d1d5db',
                    boxShadow:  active === i ? '0 0 0 4px rgba(31,107,36,0.12)' : 'none',
                  }}
                />
                <span
                  className="font-mono font-bold text-[0.62rem] tracking-[0.16em] transition-colors duration-300"
                  style={{ color: i === active ? '#1F6B24' : i < active ? 'var(--muted)' : 'var(--subtle)' }}
                >
                  {item.y}
                </span>
              </div>
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
