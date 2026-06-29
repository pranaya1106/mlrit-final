'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import createGlobe from 'cobe';
import Reveal from '@/components/motion/Reveal';

/* ─── Data ───────────────────────────────────────────────────── */
type AlumniEntry = {
  company: string;
  location: string;
  package: string;
  role: string;
  src: string;
  lat: number;
  lon: number;
};

const ALUMNI: AlumniEntry[] = [
  { company: 'TCS',           location: 'Hyderabad',  role: 'Systems Engineer',    package: '4 LPA',    src: '/placements/p4.jpg',  lat:  17.38, lon:  78.47 },
  { company: 'Infosys',       location: 'Bengaluru',  role: 'Software Engineer',   package: '4 LPA',    src: '/placements/p6.jpg',  lat:  12.97, lon:  77.59 },
  { company: 'ServiceNow',    location: 'San Jose',   role: 'Software Engineer',   package: '33 LPA',   src: '/placements/p1.jpg',  lat:  37.33, lon: -121.88 },
  { company: 'Amazon',        location: 'Seattle',    role: 'SDE I',               package: '58 LPA',   src: '/placements/p2.jpg',  lat:  47.60, lon: -122.33 },
  { company: 'Capgemini',     location: 'London',     role: 'Assoc. Consultant',   package: '4.5 LPA',  src: '/placements/p3.jpg',  lat:  51.50, lon:   -0.12 },
  { company: 'Tech Mahindra', location: 'Dubai',      role: 'Software Engineer',   package: '6 LPA',    src: '/placements/p5.jpg',  lat:  25.20, lon:  55.27 },
  { company: 'Virtusa',       location: 'Singapore',  role: 'Data Engineer',       package: '5.5 LPA',  src: '/placements/p7.png',  lat:   1.35, lon: 103.82 },
  { company: 'Wipro',         location: 'Toronto',    role: 'Project Engineer',    package: '4 LPA',    src: '/placements/p8.png',  lat:  43.65, lon: -79.38 },
  { company: 'EPAM Systems',  location: 'Munich',     role: 'Fullstack Developer', package: '8 LPA',    src: '/placements/p9.png',  lat:  48.14, lon:  11.58 },
  { company: 'Boeing',        location: 'Melbourne',  role: 'Aerospace Engineer',  package: '28.5 LPA', src: '/placements/p10.png', lat: -37.81, lon: 144.96 },
  { company: 'LTI Mindtree',  location: 'Pune',       role: 'Software Engineer',   package: '5.5 LPA',  src: '/placements/p11.png', lat:  18.52, lon:  73.86 },
  { company: 'NTT Data',      location: 'Tokyo',      role: 'Associate Analyst',   package: '4.5 LPA',  src: '/placements/p12.png', lat:  35.68, lon: 139.69 },
  { company: 'Cognizant',     location: 'Chennai',    role: 'Programmer Analyst',  package: '4 LPA',    src: '/placements/p13.png', lat:  13.08, lon:  80.27 },
  { company: 'Mphasis',       location: 'Bengaluru',  role: 'Software Engineer',   package: '5 LPA',    src: '/placements/p14.png', lat:  12.95, lon:  77.65 },
  { company: 'Cyient',        location: 'Hyderabad',  role: 'Engineer Trainee',    package: '4.5 LPA',  src: '/placements/p15.png', lat:  17.40, lon:  78.48 },
  { company: 'ValueLabs',     location: 'Hyderabad',  role: 'Software Engineer',   package: '4.5 LPA',  src: '/placements/p16.png', lat:  17.45, lon:  78.36 },
];

const THETA = 0.3; // fixed tilt — must match cobe theta

/* ─── lat/lon → cobe unit vector ────────────────────────────── */
function latLonToVec(lat: number, lon: number): [number, number, number] {
  const phi   = (lat * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180 - Math.PI;
  const cosP  = Math.cos(phi);
  return [-cosP * Math.cos(theta), Math.sin(phi), cosP * Math.sin(theta)];
}

/* ─── Project unit-vector → {x,y} fraction + visible flag ───── *
 * Mirrors cobe's internal W() projection function.              */
function projectMarker(
  vec: [number, number, number],
  phi: number,
): { x: number; y: number; visible: boolean } {
  const elevation = 0.05;
  const r = 0.8 + elevation;

  const cosP = Math.cos(phi),  sinP = Math.sin(phi);
  const cosT = Math.cos(THETA), sinT = Math.sin(THETA);

  const [ux, uy, uz] = vec;
  const rx1 =  ux * cosP + uz * sinP;
  const rz1 = -ux * sinP + uz * cosP;
  const ry2 =  uy  * cosT - rz1 * sinT;
  const rz2 =  uy  * sinT + rz1 * cosT;

  const ex = rx1 * r;
  const ey = ry2 * r;

  // aspect=1 (square canvas), scale=1, offset=[0,0]
  const cx = ex;
  const cy = -ey;

  const x = (cx + 1) / 2;
  const y = (cy + 1) / 2;
  const visible = !(rz2 < 0 && cx * cx + cy * cy < 0.64);

  return { x, y, visible };
}

/* ─── Popup card ─────────────────────────────────────────────── */
type PopupState = { entry: AlumniEntry; px: number; py: number } | null;

function Popup({ state, onClose }: { state: PopupState; onClose: () => void }) {
  useEffect(() => {
    if (!state) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [state, onClose]);

  if (!state) return null;

  return (
    <>
      {/* backdrop hit area — click outside to close */}
      <div className="fixed inset-0 z-[90]" onClick={onClose} />

      {/* card */}
      <div
        className="fixed z-[100] pointer-events-auto"
        style={{
          left: state.px,
          top:  state.py,
          transform: 'translate(-50%, calc(-100% - 16px))',
        }}
      >
        <div
          className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
          style={{
            background: 'rgba(12,9,6,0.96)',
            backdropFilter: 'blur(16px)',
            width: 220,
            boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,96,10,0.2)',
          }}
        >
          {/* Logo area */}
          <div className="flex items-center justify-center bg-white" style={{ height: 110 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={state.entry.src}
              alt={state.entry.company}
              className="max-h-[70%] max-w-[80%] object-contain"
            />
          </div>

          {/* Info */}
          <div className="px-4 py-3.5">
            <p className="font-sans font-extrabold text-white text-[1rem] leading-tight">
              {state.entry.company}
            </p>
            <p className="font-mono text-white/50 text-[0.72rem] mt-1">
              {state.entry.role}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="font-mono text-white/40 text-[0.68rem]">
                📍 {state.entry.location}
              </span>
              <span className="font-mono font-bold text-[#e8600a] text-[0.82rem]">
                {state.entry.package}
              </span>
            </div>
          </div>

          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20
              flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* anchor arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-[7px]"
            style={{
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(232,96,10,0.25)',
            }}
          />
        </div>
      </div>
    </>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AlumniGlobe() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const dotRefs     = useRef<(HTMLButtonElement | null)[]>([]);
  const globeRef    = useRef<{ destroy: () => void; update: (s: object) => void } | null>(null);
  const phiRef      = useRef(0);
  const rafRef      = useRef<number>(0);

  const [popup, setPopup] = useState<PopupState>(null);

  /* precompute unit vectors once */
  const vecs = useRef(ALUMNI.map(a => latLonToVec(a.lat, a.lon)));

  const updateDots = useCallback((phi: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const wRect = wrapper.getBoundingClientRect();
    const size  = wRect.width; // square

    ALUMNI.forEach((_, i) => {
      const btn = dotRefs.current[i];
      if (!btn) return;
      const { x, y, visible } = projectMarker(vecs.current[i], phi);

      btn.style.left    = `${x * 100}%`;
      btn.style.top     = `${y * 100}%`;
      btn.style.opacity = visible ? '1' : '0';
      btn.style.pointerEvents = visible ? 'auto' : 'none';

      // pulse ring scale = visible depth proxy
      const depth = visible ? 0.5 + (1 - Math.abs(x - 0.5) * 2) * 0.5 : 0;
      btn.style.setProperty('--dot-depth', depth.toFixed(3));
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
        phi: 0,
        theta: THETA,
        dark: 1,
        diffuse: 1.4,
        scale: 1,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor:   [0.15, 0.08, 0.03] as [number, number, number],
        markerColor: [1.00, 0.42, 0.04] as [number, number, number],
        glowColor:   [0.60, 0.28, 0.06] as [number, number, number],
        markers: ALUMNI.map(a => ({
          location: [a.lat, a.lon] as [number, number],
          size: 0.07,
        })),
      });

      globeRef.current = globe;

      const tick = () => {
        phiRef.current += 0.003;
        globe.update({ phi: phiRef.current });
        updateDots(phiRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    init();

    const ro = new ResizeObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      globeRef.current?.destroy();
      globeRef.current = null;
      init();
    });
    ro.observe(wrapper);
    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, [updateDots]);

  const handleDotClick = useCallback((entry: AlumniEntry, i: number) => {
    const btn = dotRefs.current[i];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    setPopup(p => (p?.entry === entry ? null : { entry, px: cx, py: cy }));
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 55%, #2a1200 0%, #0d0806 50%, #07060a 100%)' }}
    >
      {/* Heading */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-10">
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
            <span className="text-[#e8600a]/60">Tap any glowing dot</span> to see where they landed.
          </p>
        </Reveal>
      </div>

      {/* Globe — desktop */}
      <div className="hidden md:block relative w-full pb-16">
        <div
          ref={wrapperRef}
          className="relative mx-auto"
          style={{ width: 'min(720px, 88vw)', aspectRatio: '1/1' }}
        >
          {/* cobe canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* ghost MLR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]">
            <span
              className="font-sans font-black text-[#e8600a]/[0.055] tracking-tighter"
              style={{ fontSize: 'clamp(5rem,15vw,12rem)', lineHeight: 1 }}
            >
              MLR
            </span>
          </div>

          {/* invisible clickable dot hit-targets */}
          {ALUMNI.map((a, i) => (
            <button
              key={i}
              ref={el => { dotRefs.current[i] = el; }}
              onClick={() => handleDotClick(a, i)}
              aria-label={`${a.company} — ${a.location}`}
              className="absolute z-[5] -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
              style={{
                left: '50%', top: '50%',
                opacity: 0,
                width: 28, height: 28,
                transition: 'opacity 0.2s',
              }}
            >
              {/* visible pulse ring + dot */}
              <span
                className="absolute inset-0 rounded-full flex items-center justify-center"
              >
                {/* outer pulse ring */}
                <span
                  className="absolute rounded-full border border-[#e8600a]/50 animate-ping"
                  style={{ width: 22, height: 22, animationDuration: '2s' }}
                />
                {/* inner glow dot */}
                <span
                  className="relative rounded-full bg-[#e8600a] group-hover:bg-[#ff8040] transition-colors shadow-[0_0_8px_3px_rgba(232,96,10,0.6)]"
                  style={{ width: 10, height: 10 }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: grid of cards */}
      <div className="md:hidden px-6 pb-10">
        <p className="font-mono text-[0.7rem] text-white/40 mb-5 tracking-wide uppercase">
          Companies · Tap to explore
        </p>
        <div className="grid grid-cols-2 gap-3">
          {ALUMNI.map((a, i) => (
            <button
              key={i}
              onClick={() => setPopup({ entry: a, px: window.innerWidth / 2, py: window.innerHeight / 2 })}
              className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.04] text-left
                hover:border-[#e8600a]/40 transition-colors active:scale-95"
            >
              <div className="flex items-center justify-center h-[72px] bg-white/[0.05] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt={a.company} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="px-3 py-2">
                <p className="font-sans font-bold text-white text-[0.78rem] truncate">{a.company}</p>
                <p className="font-mono text-[#e8600a] text-[0.65rem] font-semibold mt-0.5">{a.package}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popup */}
      <Popup state={popup} onClose={() => setPopup(null)} />

      <style jsx>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
        .animate-ping { animation: ping 2s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>
    </section>
  );
}
