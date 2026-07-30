'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe from 'cobe';
import Reveal from '@/components/motion/Reveal';

/* ─── Data grouped by country ────────────────────────────────── */
type Company = { company: string; location: string; role: string; package: string; src: string; };

type Country = {
  name: string;
  flag: string;
  lat: number;   // label anchor lat
  lon: number;   // label anchor lon
  companies: Company[];
};

const COUNTRIES: Country[] = [
  {
    name: 'India', flag: '🇮🇳', lat: 20.5, lon: 78.9,
    companies: [
      { company: 'Tech Mahindra', location: 'Hyderabad', role: 'Software Engineer',  package: '6 LPA',   src: '/placements/p4.jpg'  },
      { company: 'Infosys',       location: 'Bengaluru', role: 'Software Engineer',  package: '4 LPA',   src: '/placements/p5.jpg'  },
      { company: 'Cognizant',     location: 'Chennai',   role: 'Programmer Analyst', package: '4 LPA',   src: '/placements/p6.jpg'  },
      { company: 'Hyundai Transys',location: 'Hyderabad',role: 'Engineer Trainee',   package: '4.5 LPA', src: '/placements/p11.png' },
      { company: 'NTT Data',      location: 'Hyderabad', role: 'Associate Analyst',  package: '4.5 LPA', src: '/placements/p13.png' },
      { company: 'Boeing India',  location: 'Bengaluru', role: 'Systems Engineer',   package: '12 LPA',  src: '/placements/p14.png' },
      { company: 'Wipro',         location: 'Hyderabad', role: 'Project Engineer',   package: '4 LPA',   src: '/placements/p15.png' },
      { company: 'DXC Technology',location: 'Hyderabad', role: 'Software Engineer',  package: '5 LPA',   src: '/placements/p16.png' },
    ],
  },
  {
    name: 'USA', flag: '🇺🇸', lat: 39.5, lon: -98.35,
    companies: [
      { company: 'Capgemini',  location: 'San Jose', role: 'Software Engineer', package: '33 LPA', src: '/placements/p1.jpg'  },
      { company: 'Amazon',     location: 'Seattle',  role: 'SDE I',             package: '58 LPA', src: '/placements/p12.png' },
    ],
  },
  {
    name: 'UK', flag: '🇬🇧', lat: 51.5, lon: -0.12,
    companies: [
      { company: 'Capgemini', location: 'London', role: 'Assoc. Consultant', package: '4.5 LPA', src: '/placements/p1.jpg' },
    ],
  },
  {
    name: 'UAE', flag: '🇦🇪', lat: 23.4, lon: 53.8,
    companies: [
      { company: 'Tata Technologies', location: 'Dubai', role: 'Software Engineer', package: '6 LPA', src: '/placements/p3.jpg' },
    ],
  },
  {
    name: 'Singapore', flag: '🇸🇬', lat: 1.35, lon: 103.82,
    companies: [
      { company: 'Virtusa', location: 'Singapore', role: 'Data Engineer', package: '5.5 LPA', src: '/placements/p2.jpg' },
    ],
  },
  {
    name: 'Canada', flag: '🇨🇦', lat: 56.13, lon: -106.35,
    companies: [
      { company: 'Wipro', location: 'Toronto', role: 'Project Engineer', package: '4 LPA', src: '/placements/p15.png' },
    ],
  },
  {
    name: 'Germany', flag: '🇩🇪', lat: 51.16, lon: 10.45,
    companies: [
      { company: 'EPAM Systems', location: 'Munich', role: 'Fullstack Developer', package: '8 LPA', src: '/placements/p9.png' },
    ],
  },
  {
    name: 'Australia', flag: '🇦🇺', lat: -25.27, lon: 133.78,
    companies: [
      { company: 'Cyient', location: 'Melbourne', role: 'Engineer Trainee', package: '6 LPA', src: '/placements/p10.png' },
    ],
  },
  {
    name: 'Japan', flag: '🇯🇵', lat: 36.2, lon: 138.25,
    companies: [
      { company: 'NTT Data', location: 'Tokyo', role: 'Associate Analyst', package: '4.5 LPA', src: '/placements/p13.png' },
    ],
  },
];

const THETA = 0.3;

/* ─── cobe marker list (one per company for density on globe) ── */
const ALL_MARKERS = COUNTRIES.flatMap(c =>
  c.companies.map(() => ({ location: [c.lat, c.lon] as [number, number], size: 0.04 }))
);

/* ─── Projection math (mirrors cobe W()) ─────────────────────── */
function latLonToVec(lat: number, lon: number): [number, number, number] {
  const phi   = (lat * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180 - Math.PI;
  const cosP  = Math.cos(phi);
  return [-cosP * Math.cos(theta), Math.sin(phi), cosP * Math.sin(theta)];
}

function projectVec(vec: [number, number, number], phi: number) {
  const r    = 0.85;
  const cosP = Math.cos(phi),  sinP = Math.sin(phi);
  const cosT = Math.cos(THETA), sinT = Math.sin(THETA);
  const [ux, uy, uz] = vec;
  const rx1 =  ux * cosP + uz * sinP;
  const rz1 = -ux * sinP + uz * cosP;
  const ry2 =  uy * cosT - rz1 * sinT;
  const rz2 =  uy * sinT + rz1 * cosT;
  const cx = rx1 * r, cy = -ry2 * r;
  return {
    x: (cx + 1) / 2,
    y: (cy + 1) / 2,
    visible: !(rz2 < 0 && cx * cx + cy * cy < 0.64),
  };
}

/* ─── Country panel (slide-in from right) ────────────────────── */
function CountryPanel({ country, onClose }: { country: Country; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {/* dim backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* panel */}
      <div
        className="relative w-full md:w-[420px] md:h-full md:max-h-screen overflow-y-auto
          rounded-t-3xl md:rounded-none md:rounded-l-3xl border-t md:border-t-0 md:border-l border-white/10"
        style={{ background: 'rgba(10,7,5,0.97)', backdropFilter: 'blur(20px)', maxHeight: '88vh' }}
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-white/10"
          style={{ background: 'rgba(10,7,5,0.97)' }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{country.flag}</span>
              <h3 className="font-sans font-extrabold text-white text-xl">{country.name}</h3>
            </div>
            <p className="font-mono text-white/40 text-[0.7rem] mt-1 tracking-wide">
              {country.companies.length} {country.companies.length === 1 ? 'placement' : 'placements'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* company cards */}
        <div className="p-4 flex flex-col gap-3">
          {country.companies.map((c, i) => (
            <div key={i}
              className="flex gap-4 items-center rounded-2xl border border-white/10 p-3"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              {/* logo */}
              <div className="shrink-0 w-20 h-14 rounded-xl bg-white flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.company}
                  className="max-w-full max-h-full object-contain" />
              </div>
              {/* info */}
              <div className="min-w-0">
                <p className="font-sans font-bold text-white text-[0.92rem] truncate">{c.company}</p>
                <p className="font-mono text-white/45 text-[0.68rem] mt-0.5 truncate">{c.role}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-mono text-white/35 text-[0.62rem]">📍 {c.location}</span>
                  <span className="font-mono font-bold text-[#e8600a] text-[0.75rem]">{c.package}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function AlumniGlobe() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const btnRefs    = useRef<(HTMLButtonElement | null)[]>([]);
  const globeRef   = useRef<{ destroy: () => void; update: (s: object) => void } | null>(null);
  const phiRef     = useRef(0);
  const rafRef     = useRef<number>(0);

  const [active, setActive] = useState<Country | null>(null);

  const vecs = useRef(COUNTRIES.map(c => latLonToVec(c.lat, c.lon)));

  const updateLabels = useCallback((phi: number) => {
    COUNTRIES.forEach((_, i) => {
      const btn = btnRefs.current[i];
      if (!btn) return;
      const { x, y, visible } = projectVec(vecs.current[i], phi);
      btn.style.left    = `${x * 100}%`;
      btn.style.top     = `${y * 100}%`;
      btn.style.opacity = visible ? '1' : '0';
      btn.style.pointerEvents = visible ? 'auto' : 'none';
    });
  }, []);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const init = () => {
      const size = wrapper.clientWidth;
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
      if (globeRef.current) { globeRef.current.destroy(); globeRef.current = null; }

      const globe = createGlobe(canvas, {
        devicePixelRatio: window.devicePixelRatio || 2,
        width:  size * (window.devicePixelRatio || 2),
        height: size * (window.devicePixelRatio || 2),
        phi: 0, theta: THETA,
        dark: 1, diffuse: 1.4, scale: 1,
        mapSamples: 16000, mapBrightness: 6,
        baseColor:   [0.14, 0.08, 0.03] as [number, number, number],
        markerColor: [1.00, 0.42, 0.04] as [number, number, number],
        glowColor:   [0.60, 0.28, 0.06] as [number, number, number],
        markers: ALL_MARKERS,
      });

      globeRef.current = globe;
      const tick = () => {
        phiRef.current += 0.003;
        globe.update({ phi: phiRef.current });
        updateLabels(phiRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    init();
    const ro = new ResizeObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      globeRef.current?.destroy(); globeRef.current = null;
      init();
    });
    ro.observe(wrapper);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      globeRef.current?.destroy(); globeRef.current = null;
    };
  }, [updateLabels]);

  return (
    <section className="relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 55%, #2a1200 0%, #0d0806 50%, #07060a 100%)' }}>

      {/* Heading */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-12 pt-20 pb-10">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-[#e8600a]/60 mb-3 inline-block">
            Global Network
          </span>
          <h2 className="font-sans font-black tracking-tighter text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Alumni Across{' '}
            <span className="font-display italic font-medium text-[#e8600a]">the Globe.</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-[560px] leading-relaxed text-[0.95rem]">
            Our graduates are placed at leading companies worldwide.{' '}
            <span className="text-[#e8600a]/60">Click a country</span> to see who landed there.
          </p>
        </Reveal>
      </div>

      {/* Globe — desktop */}
      <div className="hidden md:block relative w-full pb-16">
        <div ref={wrapperRef} className="relative mx-auto"
          style={{ width: 'min(720px, 88vw)', aspectRatio: '1/1' }}>

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* ghost MLR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]">
            <span className="font-sans font-black text-[#e8600a]/[0.055] tracking-tighter"
              style={{ fontSize: 'clamp(5rem,15vw,12rem)', lineHeight: 1 }}>
              MLR
            </span>
          </div>

          {/* Country label buttons */}
          {COUNTRIES.map((c, i) => (
            <button
              key={i}
              ref={el => { btnRefs.current[i] = el; }}
              onClick={() => setActive(c)}
              aria-label={`${c.name} — ${c.companies.length} placements`}
              className="absolute z-[5] -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              style={{ left: '50%', top: '50%', opacity: 0, transition: 'opacity 0.25s' }}
            >
              {/* pill label */}
              <span
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1
                  font-mono font-semibold whitespace-nowrap transition-all duration-200
                  group-hover:scale-110 group-hover:border-[#e8600a]/70"
                style={{
                  fontSize: '0.68rem',
                  background: 'rgba(10,7,5,0.80)',
                  backdropFilter: 'blur(6px)',
                  borderColor: 'rgba(232,96,10,0.35)',
                  color: 'rgba(255,255,255,0.85)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  letterSpacing: '0.04em',
                }}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                {c.companies.length > 1 && (
                  <span className="ml-0.5 rounded-full bg-[#e8600a]/80 text-white px-1.5 py-0.5"
                    style={{ fontSize: '0.58rem' }}>
                    {c.companies.length}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: country cards grid */}
      <div className="md:hidden px-6 pb-10">
        <p className="font-mono text-[0.7rem] text-white/40 mb-4 tracking-wide uppercase">Tap a country</p>
        <div className="grid grid-cols-2 gap-3">
          {COUNTRIES.map((c, i) => (
            <button key={i} onClick={() => setActive(c)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left
                hover:border-[#e8600a]/40 active:scale-95 transition-all">
              <div className="text-2xl mb-2">{c.flag}</div>
              <p className="font-sans font-bold text-white text-[0.88rem]">{c.name}</p>
              <p className="font-mono text-[#e8600a] text-[0.65rem] mt-1">
                {c.companies.length} {c.companies.length === 1 ? 'company' : 'companies'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      {active && <CountryPanel country={active} onClose={() => setActive(null)} />}
    </section>
  );
}
