'use client';

import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';

const LEADERS = [
  {
    tag: 'Founder',
    name: 'Sri Marri Laxman Reddy',
    role: 'Founder, KMR Educational Society',
    img: '/images/about/milestone-2005.jpg',
    message: 'Our founding vision was simple — give every student from Telangana access to world-class engineering education, right here at home. In 2005, we laid the foundation stone at Dundigal with a single promise: right education, bright placements.',
    accent: '#1F6B24',
  },
  {
    tag: 'Patron',
    name: 'Sri Marri Rajashekhar Reddy',
    role: 'Founder Secretary · MLA, Malkajgiri',
    img: '/images/about/milestone-2019.jpg',
    message: 'MLRIT stands as proof that public service and quality education can go hand in hand. We continue to invest in infrastructure, faculty and student welfare because we believe every engineer we produce is a gift to the nation.',
    accent: '#1a5e1f',
  },
  {
    tag: 'Principal',
    name: 'Dr. K. Srinivas Rao',
    role: 'Principal, MLR Institute of Technology',
    img: '/images/about/milestone-2022.jpg',
    message: 'Academic rigour and student welfare are not opposing goals — at MLRIT we have always pursued both, together. Our autonomous status lets us stay ahead of industry, while our NAAC and NBA accreditations validate our quality.',
    accent: '#1F6B24',
  },
  {
    tag: 'Dean — Academics',
    name: 'Dr. P. Rajashekar',
    role: 'Dean, Academics',
    img: '/images/about/milestone-2012.jpg',
    message: 'We design curricula that respond to where industry is going, not just where it has been. Autonomous status gives us the agility to refresh syllabi, integrate emerging tools, and keep our students ahead of the curve.',
    accent: '#1a5e1f',
  },
  {
    tag: 'Head — Placements',
    name: 'Prof. Ravi Chandra P',
    role: 'Head, Training & Placements',
    img: '/images/about/milestone-2026.jpg',
    message: 'Placement is not a season — it is a year-round culture of preparation, industry exposure and relentless follow-through. 621 offers in 2025–26 with a ₹51 LPA top package is the result of that culture.',
    accent: '#1F6B24',
  },
  {
    tag: 'Dean — Research',
    name: 'Dr. M. Anitha',
    role: 'Dean, Research & Innovation',
    img: '/images/about/milestone-2017.jpg',
    message: 'Research at MLRIT is not an afterthought — it is embedded in every department, every lab and every faculty development plan. Through our IPFC and three JNTUH-recognised research centres, we are building a genuine culture of inquiry.',
    accent: '#1a5e1f',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const STACK_TOP   = 120;  // px from viewport top where cards pin
const ITEM_GAP    = 28;   // px between pinned cards (peek amount)
const ITEM_SCALE  = 0.025;// scale reduction per buried card

function LeaderStackInner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef     = useRef<HTMLDivElement[]>([]);
  const rafRef       = useRef<number | null>(null);
  const lenScroll    = useRef(0);
  const targetScroll = useRef(0);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    cardsRef.current = Array.from(
      container.querySelectorAll<HTMLDivElement>('.leadership-card')
    );
  }, []);

  const apply = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;
    const scroll = lenScroll.current;
    const vh = window.innerHeight;

    cards.forEach((card, i) => {
      const rect     = card.getBoundingClientRect();
      const cardAbsTop = rect.top + scroll;

      // Pin start: when the card's natural top reaches STACK_TOP in viewport
      const pinStart = cardAbsTop - STACK_TOP - i * ITEM_GAP;

      // How many cards are above this one (already pinned)
      let translateY = 0;
      if (scroll >= pinStart) {
        translateY = scroll - cardAbsTop + STACK_TOP + i * ITEM_GAP;
      }

      // Scale: bury cards that are below the active one
      // active = the card whose pinStart is closest but not yet passed
      const activeIndex = cards.reduce((acc, c, j) => {
        const cTop = c.getBoundingClientRect().top + scroll;
        const ps = cTop - STACK_TOP - j * ITEM_GAP;
        return scroll >= ps ? j : acc;
      }, 0);

      const depth = activeIndex - i;
      const scale = depth > 0 ? Math.max(0.88, 1 - depth * ITEM_SCALE) : 1;
      const opacity = depth > 0 ? Math.max(0.6, 1 - depth * 0.12) : 1;

      card.style.transform  = `translate3d(0,${translateY}px,0) scale(${scale})`;
      card.style.opacity    = String(opacity);
    });
  }, []);

  const tick = useCallback(() => {
    const t    = targetScroll.current;
    const l    = lenScroll.current;
    const next = l + (t - l) * 0.16;
    lenScroll.current = Math.abs(next - t) < 0.05 ? t : next;
    apply();
    rafRef.current = requestAnimationFrame(tick);
  }, [apply]);

  const onScroll = useCallback(() => {
    targetScroll.current = window.scrollY;
  }, []);

  useLayoutEffect(() => {
    measure();
    targetScroll.current = window.scrollY;
    lenScroll.current    = window.scrollY;
    apply();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measure, apply, onScroll, tick]);

  useEffect(() => {
    const t = setTimeout(measure, 600);
    return () => clearTimeout(t);
  }, [measure]);

  return (
    <div ref={containerRef} className="relative pb-48">
      {LEADERS.map((l, i) => (
        <div
          key={l.name}
          className="leadership-card relative w-full mb-8 origin-top"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Card */}
          <div
            className="rounded-2xl overflow-hidden bg-white border border-border shadow-card-soft grid grid-cols-1 md:grid-cols-[340px_1fr]"
            style={{ borderTop: `3px solid ${l.accent}` }}
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ minHeight: '260px' }}>
              <img
                src={l.img}
                alt={l.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 font-mono text-[0.58rem] text-white/75 tracking-widest bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {String(i + 1).padStart(2, '0')} / {String(LEADERS.length).padStart(2, '0')}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-7 md:p-9">
              <div>
                <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary">
                  {l.tag}
                </span>
                <h3 className="mt-2 font-sans font-black text-foreground text-[clamp(1.15rem,1.8vw,1.55rem)] leading-snug tracking-tight">
                  {l.name}
                </h3>
                <p className="mt-1 font-mono text-[0.7rem] text-muted tracking-wide">
                  {l.role}
                </p>
                <div className="my-5 h-px bg-border" />
                <blockquote className="pl-4 border-l-2 border-primary">
                  <p className="font-display italic text-[1rem] text-foreground/72 leading-relaxed">
                    "{l.message}"
                  </p>
                </blockquote>
              </div>
              <div className="mt-6 h-0.5 w-10 rounded-full" style={{ background: l.accent }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LeadershipCards() {
  return (
    <section className="bg-[#f7f5f0] py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Heading */}
        <div className="mb-6">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">People</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Leadership and{' '}
            <span className="font-display italic font-medium" style={gradientText}>governance.</span>
          </h2>
          <p className="mt-3 text-muted text-[1rem] leading-relaxed max-w-[520px]">
            Meet the people who founded, lead and shape MLR Institute of Technology.
          </p>
        </div>

        <LeaderStackInner />
      </div>
    </section>
  );
}
