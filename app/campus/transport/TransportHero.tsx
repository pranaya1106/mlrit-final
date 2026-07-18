'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const SLIDES = [
  {
    src: '/images/campus/transport/bus-route-3.jpg',
    alt: 'MLRIT college bus fleet at Dundigal campus depot',
    pos: '40% 60%',
  },
  {
    src: '/images/campus/transport/bus-route-2.jpg',
    alt: 'MLR Institute of Technology bus livery close-up',
    pos: '50% 45%',
  },
  {
    src: '/images/campus/transport/bus-fleet.jpg',
    alt: 'MLRIT campus bus — side view',
    pos: '20% 50%',
  },
];

const INTERVAL = 2800; // faster cycling

export default function TransportHero() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    timerRef.current = setTimeout(() => {
      setActive(next);
      setTransitioning(false);
    }, 550);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % SLIDES.length;
        setTransitioning(true);
        setTimeout(() => setTransitioning(false), 550);
        return next;
      });
    }, INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section
      aria-label="Transport"
      className="relative overflow-hidden bg-ink flex flex-col"
      style={{ height: 'clamp(600px, 86vh, 960px)' }}
    >
      {/* ── Images — crossfade ── */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: i === active ? (transitioning ? 0 : 1) : 0,
              transition: 'opacity 550ms cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}
          >
            <Image
              src={slide.src}
              alt={i === active ? slide.alt : ''}
              fill
              priority={i === 0}
              quality={88}
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: slide.pos,
                filter: 'brightness(0.88) saturate(0.95)',
              }}
            />
          </div>
        ))}

        {/* Bottom fade — fades photo into near-black so wave blends cleanly */}
        <div style={{
          position: 'absolute', inset: 'auto 0 0 0', height: 340,
          background: 'linear-gradient(to bottom, transparent, rgba(12,12,14,0.55) 70%, rgba(12,12,14,0.82) 100%)',
        }} />
        {/* Left tint — keeps heading readable over busy image areas */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(12,12,14,0.20) 0%, transparent 55%)',
        }} />
      </div>

      {/* ── Slide indicators ── */}
      <div
        className="absolute bottom-28 right-6 md:right-14 lg:right-20 z-10 flex gap-2"
        aria-label="Slide navigation"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              height: 3,
              borderRadius: 99,
              background: i === active ? '#e85d04' : 'rgba(255,255,255,0.2)',
              width: i === active ? 32 : 8,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* ── Breadcrumb ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 md:px-14 lg:px-20 pt-10 md:pt-14">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 font-mono text-[0.67rem] tracking-[0.14em] uppercase text-white/30"
        >
          <Link href="/" className="hover:text-white/55 transition-colors">Home</Link>
          <span className="text-white/15" aria-hidden="true">/</span>
          <span>Campus</span>
          <span className="text-white/15" aria-hidden="true">/</span>
          <span className="text-white/55">Transport</span>
        </nav>
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 mt-auto max-w-[1280px] mx-auto w-full px-6 md:px-14 lg:px-20 pb-28 md:pb-32">
        <div className="max-w-[680px]">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-primary font-sans font-bold text-[0.62rem] tracking-[0.22em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            Campus Life
          </span>
          <h1 className="font-sans font-black leading-[1.01] text-white"
            style={{ fontSize: 'clamp(3rem, 6.5vw, 5.5rem)', letterSpacing: '-0.03em' }}>
            Transport{' '}
            <span className="font-display italic font-normal text-warm">services.</span>
          </h1>
          <p className="mt-5 text-white/50 leading-relaxed max-w-[500px]"
            style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)' }}>
            27 institute-operated routes connecting Hyderabad to the
            Dundigal campus — every working day.
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { value: '27', label: 'Routes' },
              { value: '400+', label: 'Stops covered' },
              { value: '6:30 AM', label: 'First departure' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-sans font-black text-white text-[1.4rem] leading-none tracking-tight">{value}</p>
                <p className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-white/30 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Wave transition into cream section ── */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0, zIndex: 10 }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', height: 90 }}>
          <path
            d="M0,30 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z"
            fill="#faf7f0"
          />
        </svg>
      </div>
    </section>
  );
}
