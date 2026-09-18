'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

import { resolveAssetUrl } from '@/lib/cdn/url';
import { asGalleryItems, asText } from '@/lib/content/sections';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';

type Slide = {
  logo: string;
  alt: string;
  tag: string;
  title: string;
  desc: string;
  quote: string;
  speaker: string;
  speakerRole: string;
  video: string;
  poster: string;
};

/**
 * Fallback slides. Used whenever the CMS gallery is empty, absent or fails to
 * load, so the carousel always has something to play.
 */
const SLIDES: Slide[] = [
  {
    logo:  '/assets/logo.svg',
    alt:   'The Equinox E-Summit 2K24',
    tag:   'Entrepreneurship · 2024',
    title: 'The Equinox E-Summit 2K24',
    desc:  'Equinox E-Summit is MLRIT\'s annual entrepreneurship summit — live startup pitches, investor panels, product showcases and workshops run by founders. Students pitch real ideas to real investors, on campus.',
    quote: 'Live pitches. Real investors. Zero rehearsal. Equinox is where student ideas meet the people who fund them.',
    speaker: 'Equinox E-Summit',
    speakerRole: 'Annual · MLRIT Campus',
    video: '/videos/equinox.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_0711.JPG',
  },
  {
    logo:  '/assets/zignasa-logo.png',
    alt:   'Zignasa 2025',
    tag:   'Tech · Cultural · 2025',
    title: 'Zignasa 2025',
    desc:  'Zignasa is MLRIT\'s inter-departmental fest — hackathons, robotics arenas, coding contests, music, dance and film screenings running simultaneously. Every department competes. Every stage is open.',
    quote: 'Every department on stage. Zignasa is the event that turns the whole campus into one team.',
    speaker: 'Zignasa',
    speakerRole: 'Annual Fest · MLRIT',
    video: '/videos/zignasa.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_0750.JPG',
  },
  {
    logo:  '/assets/logo.svg',
    alt:   'Zenith 2K25',
    tag:   'National Tech Fest · 2025',
    title: 'Zenith 2K25',
    desc:  'Zenith is MLRIT\'s national-level technical festival — colleges from across India compete in robotics, circuit design, coding sprints and product challenges. Open registrations, multi-college participation.',
    quote: 'National-level. Multi-college. Engineering at full intensity — Zenith is where MLRIT competes with the country.',
    speaker: 'Zenith',
    speakerRole: 'National Tech Fest · MLRIT',
    video: '/videos/zenith.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_0998.JPG',
  },
  {
    logo:  '/assets/logo.svg',
    alt:   'Navrat Naveli 2025',
    tag:   'Cultural · Dussehra · 2025',
    title: 'Navrat Naveli 2025',
    desc:  'Navrat Naveli is MLRIT\'s Dussehra cultural event — classical and folk performances, garba, rangoli, traditional food and student-led celebrations marking the spirit of the festival across the campus.',
    quote: 'Music, dance, colour and tradition — Navrat Naveli is how MLRIT celebrates Dussehra together.',
    speaker: 'Navrat Naveli',
    speakerRole: 'Cultural Fest · MLRIT',
    video: '/videos/came.mp4',
    poster:'https://mlrit-next.vercel.app/assets/SBS_1131.JPG',
  },
];

type EventsProps = {
  /** Gallery items from the CMS; falls back to the bundled SLIDES. */
  slides?: unknown;
};

/**
 * Maps gallery items onto Slide. The item's primary key is the clip; `logo`
 * and `poster` are media columns of their own, because one slide carries three
 * separate files. An empty gallery yields SLIDES verbatim.
 *
 * Media falls back per position rather than globally, so a row missing only a
 * poster still shows the bundled poster for that slot instead of nothing.
 */
function slidesFrom(value: unknown): Slide[] {
  const items = asGalleryItems(value);
  if (items.length === 0) return SLIDES;

  const mapped = items.map((item, i) => {
    const fallback = SLIDES[i] ?? SLIDES[0];
    const title = asText(item.title, fallback.title);
    return {
      title,
      // `alt` is not separately editable — it always described the same thing
      // the title does, and two fields that must agree is a bug waiting.
      alt: title,
      tag: asText(item.tag),
      desc: asText(item.desc),
      quote: asText(item.quote),
      speaker: asText(item.speaker),
      speakerRole: asText(item.speakerRole),
      video: resolveAssetUrl(item.key, { allowTransient: true }) ?? fallback.video,
      logo:
        resolveAssetUrl(asText(item.logo), { allowTransient: true }) ?? fallback.logo,
      poster:
        resolveAssetUrl(asText(item.poster), { allowTransient: true }) ?? fallback.poster,
    };
  });

  return mapped.length > 0 ? mapped : SLIDES;
}

export default function Events(props: EventsProps) {
  // Live-preview draft wins over the saved props; the fallback is unchanged.
  const { slides } = useMergedSection('home/events', props);
  const SLIDE_LIST = slidesFrom(slides);
  const [active, setActive] = useState(0);
  const autoRef  = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const paint = useCallback((i: number) => {
    setActive(i);
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === i) {
        v.muted = true;
        v.playsInline = true;
        const p = v.play();
        if (p?.catch) p.catch(() => {});
      } else {
        try { v.pause(); } catch {}
      }
    });
  }, []);

  const startAuto = useCallback(() => {
    if (autoRef.current) window.clearInterval(autoRef.current);
    autoRef.current = window.setInterval(() => {
      setActive((cur) => {
        const nxt = (cur + 1) % SLIDE_LIST.length;
        paint(nxt);
        return nxt;
      });
    }, 8000);
  }, [paint]);

  const stopAuto = () => {
    if (autoRef.current) {
      window.clearInterval(autoRef.current);
      autoRef.current = null;
    }
  };

  useEffect(() => {
    paint(0);
    startAuto();
    return () => stopAuto();
  }, [paint, startAuto]);

  const next = () => { const nxt = (active + 1) % SLIDE_LIST.length; paint(nxt); startAuto(); };
  const prev = () => { const p = (active - 1 + SLIDE_LIST.length) % SLIDE_LIST.length; paint(p); startAuto(); };
  const jump = (i: number) => { paint(i); startAuto(); };

  const slide = SLIDE_LIST[active];

  return (
    <div id={sectionDomId('home/events')}>
    <section
      id="events"
      className="relative w-full h-screen min-h-[640px] overflow-hidden bg-ink"
      aria-label="Featured events"
    >
      {/* Rotating videos */}
      {SLIDE_LIST.map((s, i) => (
        <video
          key={i}
          ref={(el) => { videoRefs.current[i] = el; }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out-quart z-0 ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          loop
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          poster={s.poster}
        >
          <source src={s.video} type="video/mp4" />
        </video>
      ))}

      {/* Cinematic gradient overlays */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Signature label — top-left */}
      <div className="absolute top-8 md:top-10 left-8 md:left-14 z-[6]">
        <span
          className="font-display italic text-white/85 text-[clamp(1.25rem,1.6vw,1.8rem)] tracking-tight"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
        >
          Our Clubs
        </span>
      </div>

      {/* Top-right event badge */}
      <div className="absolute top-8 md:top-10 right-8 md:right-14 z-[6] hidden md:block">
        <div className="text-right">
          <div className="font-mono font-extrabold text-[0.66rem] tracking-[0.24em] uppercase text-warm/85">
            {slide.tag}
          </div>
          <div className="mt-1 font-mono text-[0.62rem] tracking-[0.18em] uppercase text-white/45">
            {String(active + 1).padStart(2, '0')} / {String(SLIDE_LIST.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Bottom-left editorial quote block */}
      <div className="absolute bottom-24 md:bottom-28 left-8 md:left-14 right-8 md:right-auto md:max-w-[640px] z-[6]">
        <p
          key={slide.quote}
          className="font-display text-white leading-[1.32] text-[clamp(1.4rem,2.4vw,2.4rem)] tracking-tight animate-[fadeSlideUp_0.7s_ease]"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}
        >
          {slide.quote}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span className="w-8 h-px bg-warm/70" />
          <div>
            <div className="font-sans font-bold text-white text-[1rem]">{slide.speaker}</div>
            <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-white/55 mt-0.5">
              {slide.speakerRole}
            </div>
          </div>
        </div>
      </div>

      {/* Centered CTA — pill */}
      <button
        type="button"
        onClick={() => jump((active + 1) % SLIDE_LIST.length)}
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-[7] inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-ink font-sans font-bold text-[0.78rem] tracking-[0.22em] uppercase hover:bg-warm transition-colors"
      >
        Watch Next Event
      </button>

      {/* Bottom-right thumbnail nav */}
      <div className="absolute bottom-8 md:bottom-10 right-8 md:right-14 z-[7] flex items-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous event"
          className="w-10 h-10 rounded-full border border-white/30 text-white/85 grid place-items-center hover:bg-white hover:text-ink hover:border-white transition-colors"
        >
          ←
        </button>

        {/* Thumbnail strip — video previews on hover with play icon */}
        <div className="hidden sm:flex items-center gap-2">
          {SLIDE_LIST.map((s, i) => (
            <button
              type="button"
              key={i}
              onClick={() => jump(i)}
              onMouseEnter={(e) => {
                const v = e.currentTarget.querySelector('video');
                if (v) { v.muted = true; v.play().catch(() => {}); }
              }}
              onMouseLeave={(e) => {
                const v = e.currentTarget.querySelector('video');
                if (v && i !== active) { try { v.pause(); v.currentTime = 0; } catch {} }
              }}
              aria-label={`Show ${s.alt}`}
              className={`group relative w-20 h-14 md:w-24 md:h-16 rounded-md overflow-hidden transition-all duration-400 ${
                i === active
                  ? 'ring-2 ring-warm ring-offset-2 ring-offset-transparent scale-105'
                  : 'opacity-70 hover:opacity-100 border border-white/20 hover:ring-1 hover:ring-white/60'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.poster} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" />
              <video
                src={s.video}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              {/* Play overlay — hidden on active, appears on hover for others */}
              <span
                className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${
                  i === active ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                }`}
                aria-hidden
              >
                <span className="grid place-items-center w-7 h-7 rounded-full bg-white/95 backdrop-blur-md text-ink shadow-lg">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                    <path d="M3 1.5v11l10-5.5L3 1.5z" />
                  </svg>
                </span>
              </span>
              {i === active && (
                <span className="absolute inset-0 bg-black/10" />
              )}
            </button>
          ))}
        </div>

        {/* Progress dots on mobile */}
        <div className="flex sm:hidden gap-1.5">
          {SLIDE_LIST.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-warm' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next event"
          className="w-10 h-10 rounded-full border border-white/30 text-white/85 grid place-items-center hover:bg-white hover:text-ink hover:border-white transition-colors"
        >
          →
        </button>
      </div>

      {/* Featured preview card — bottom-right big thumb (desktop only, above the nav) */}
      <div className="hidden lg:block absolute bottom-28 right-14 z-[6] w-52 xl:w-60 aspect-video rounded-lg overflow-hidden border border-white/20 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid place-items-center w-11 h-11 rounded-full bg-white/85 backdrop-blur-md text-ink">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
              <path d="M3 1.5v11l10-5.5L3 1.5z" />
            </svg>
          </span>
        </div>
        <div className="absolute bottom-2 left-3 right-3">
          <div className="font-sans font-bold text-white text-[0.78rem] leading-tight truncate">{slide.title}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </section>
    </div>
  );
}
