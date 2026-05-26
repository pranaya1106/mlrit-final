'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type Slide = {
  logo: string; alt: string; tag: string; title: string; desc: string; video: string; poster: string;
};

const SLIDES: Slide[] = [
  {
    logo:  '/assets/logo.svg',
    alt:   'The Equinox E-Summit 2K24',
    tag:   'Entrepreneurship Summit · 2024',
    title: 'The Equinox\nE-Summit 2K24',
    desc:  "MLRIT's flagship annual summit bringing together entrepreneurs, investors, and innovators to inspire the next generation of leaders.",
    video: '/videos/events-bg.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_0711.JPG',
  },
  {
    logo:  '/assets/main-logo.svg',
    alt:   'Zignasa 2025',
    tag:   'Technical & Cultural Fest · 2025',
    title: 'Zignasa\n2025',
    desc:  "MLRIT's grand annual extravaganza featuring technical competitions, hackathons, cultural performances, and celebrity nights.",
    video: '/videos/inno.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_0750.JPG',
  },
  {
    logo:  '/assets/logo.svg',
    alt:   'Zenith 2K25',
    tag:   'National Tech Fest · 2025',
    title: 'Zenith\n2K25',
    desc:  "Three days, dozens of events — robotics arenas, coding marathons and an opening-night band lineup that lit up the main grounds.",
    video: '/videos/sports.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_0998.JPG',
  },
  {
    logo:  '/assets/logo.svg',
    alt:   'Trishna Annual Day 2K26',
    tag:   'Institutional · Annual Day 2026',
    title: 'Trishna\nAnnual Day 2K26',
    desc:  "MLRIT's 21st Annual Day — student awards, alumni stories and a quiet evening that earned its loud applause.",
    video: '/videos/av3.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_1131.JPG',
  },
];

export default function Events() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const hoverRef = useRef<number | null>(null);
  const autoRef  = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const paint = useCallback((i: number) => {
    setActive(i);
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === i) {
        v.muted = true; v.playsInline = true;
        const p = v.play(); if (p?.catch) p.catch(() => {});
      } else {
        try { v.pause(); } catch {}
      }
    });
  }, []);

  const startAuto = useCallback(() => {
    if (autoRef.current) window.clearInterval(autoRef.current);
    autoRef.current = window.setInterval(() => {
      setActive((cur) => {
        const nxt = (cur + 1) % SLIDES.length;
        paint(nxt);
        return nxt;
      });
    }, 6000);
  }, [paint]);

  const stopAuto = () => { if (autoRef.current) { window.clearInterval(autoRef.current); autoRef.current = null; } };

  useEffect(() => {
    paint(0);
    startAuto();
    return () => {
      stopAuto();
      if (hoverRef.current) window.clearTimeout(hoverRef.current);
    };
  }, [paint, startAuto]);

  const enterPlay = () => {
    if (hoverRef.current) window.clearTimeout(hoverRef.current);
    hoverRef.current = window.setTimeout(() => { setPlaying(true); stopAuto(); }, 3000);
  };
  const exitPlay = () => {
    if (hoverRef.current) window.clearTimeout(hoverRef.current);
    if (playing) setPlaying(false);
    startAuto();
  };

  const slide = SLIDES[active];

  return (
    <section
      id="events"
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black cursor-pointer"
      onPointerEnter={enterPlay}
      onPointerLeave={exitPlay}
      aria-label="Featured events"
    >
      {/* Rotating videos */}
      {SLIDES.map((s, i) => (
        <video
          key={i}
          ref={(el) => { videoRefs.current[i] = el; }}
          className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform,filter] duration-1000 ease-out-quart z-0 ${
            i === active ? 'opacity-100' : 'opacity-0'
          } ${
            playing && i === active ? 'scale-100 brightness-100 saturate-100' : 'scale-[1.08] brightness-[0.45] saturate-[0.85]'
          }`}
          muted loop playsInline preload={i === 0 ? 'auto' : 'metadata'}
          poster={s.poster}
        >
          <source src={s.video} type="video/mp4" />
        </video>
      ))}

      {/* Dark gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-[background] duration-700 ease-out-quart"
        style={{
          background: playing
            ? 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 40%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Top dots */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[9] flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Event ${i + 1}`}
            onClick={(e) => { e.stopPropagation(); paint(i); startAuto(); }}
            className={`h-1 rounded-full transition-all duration-400 ease-out-quart ${
              i === active ? 'w-7 bg-warm' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Centered card */}
      <div
        className={`absolute inset-0 z-[6] flex items-center justify-center pointer-events-none transition-all duration-700 ease-out-quart ${
          playing ? 'opacity-0 translate-y-[-40px] scale-[0.95]' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <article className="text-center max-w-[720px] px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.logo} alt={slide.alt} className="h-24 md:h-32 w-auto mx-auto mb-8" style={{ filter: 'drop-shadow(0 8px 40px rgba(0,0,0,0.5)) brightness(1.05)' }} />
          <p className="font-sans font-bold text-[0.65rem] tracking-[0.22em] uppercase text-warm/60 mb-3">{slide.tag}</p>
          <h2 className="font-sans font-bold text-warm leading-[1.05] tracking-tight text-[clamp(1.9rem,5vw,4rem)] mb-5 whitespace-pre-line" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>
            {slide.title}
          </h2>
          <p className="text-white/70 font-light leading-relaxed max-w-[560px] mx-auto mb-8 text-[1rem]">{slide.desc}</p>
          <span className="inline-flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-white/35">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative rounded-full w-1.5 h-1.5 bg-primary" />
            </span>
            Stay to play video
          </span>
        </article>
      </div>

      {/* Bottom-left chip when playing */}
      <div
        className={`absolute bottom-10 left-8 md:left-12 z-[8] transition-all duration-700 ease-out-quart ${
          playing ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.logo} alt={slide.alt} className="h-16 md:h-20 w-auto" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6)) brightness(0.95)' }} />
        <p className="mt-3 font-sans font-semibold text-[0.6rem] tracking-[0.18em] uppercase text-warm/55">{slide.tag}</p>
      </div>
    </section>
  );
}
