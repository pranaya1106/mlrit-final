'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Reveal from '@/components/motion/Reveal';

/* ─────────────────────────────────────────────────────────────────
   DATA
   thumbnail = company logo path (existing recruiter images)
   videoUrl  = leave empty until real videos are ready
───────────────────────────────────────────────────────────────── */
export type AlumniEntry = {
  name: string;
  location: string;
  company: string;
  role: string;
  package: string;
  videoUrl: string;
  thumbnail: string;
};

export const ALUMNI_VIDEOS: AlumniEntry[] = [
  { name: 'To be updated', location: 'Hyderabad, India',     company: 'TCS',           role: 'Systems Engineer',    package: '4 LPA',    videoUrl: '', thumbnail: '/placements/p4.jpg'  },
  { name: 'To be updated', location: 'Bengaluru, India',     company: 'Infosys',        role: 'Software Engineer',   package: '4 LPA',    videoUrl: '', thumbnail: '/placements/p6.jpg'  },
  { name: 'To be updated', location: 'San Jose, USA',        company: 'ServiceNow',     role: 'Software Engineer',   package: '33 LPA',   videoUrl: '', thumbnail: '/placements/p1.jpg'  },
  { name: 'To be updated', location: 'Seattle, USA',         company: 'Amazon',         role: 'SDE I',               package: '58 LPA',   videoUrl: '', thumbnail: '/placements/p2.jpg'  },
  { name: 'To be updated', location: 'London, UK',           company: 'Capgemini',      role: 'Assoc. Consultant',   package: '4.5 LPA',  videoUrl: '', thumbnail: '/placements/p3.jpg'  },
  { name: 'To be updated', location: 'Dubai, UAE',           company: 'Tech Mahindra',  role: 'Software Engineer',   package: '6 LPA',    videoUrl: '', thumbnail: '/placements/p5.jpg'  },
  { name: 'To be updated', location: 'Singapore',            company: 'Virtusa',        role: 'Data Engineer',       package: '5.5 LPA',  videoUrl: '', thumbnail: '/placements/p7.png'  },
  { name: 'To be updated', location: 'Toronto, Canada',      company: 'Wipro',          role: 'Project Engineer',    package: '4 LPA',    videoUrl: '', thumbnail: '/placements/p8.png'  },
  { name: 'To be updated', location: 'Munich, Germany',      company: 'EPAM Systems',   role: 'Fullstack Developer', package: '8 LPA',    videoUrl: '', thumbnail: '/placements/p9.png'  },
  { name: 'To be updated', location: 'Melbourne, Australia', company: 'Boeing',         role: 'Aerospace Engineer',  package: '28.5 LPA', videoUrl: '', thumbnail: '/placements/p10.png' },
  { name: 'To be updated', location: 'Pune, India',          company: 'LTI Mindtree',   role: 'Software Engineer',   package: '5.5 LPA',  videoUrl: '', thumbnail: '/placements/p11.png' },
  { name: 'To be updated', location: 'Noida, India',         company: 'NTT Data',       role: 'Associate Analyst',   package: '4.5 LPA',  videoUrl: '', thumbnail: '/placements/p12.png' },
];

/* ─────────────────────────────────────────────────────────────────
   ORBITAL MATH
   Each node sits on an elliptical path tilted in 3D perspective.
   We use two rings + scatter for depth variety.
───────────────────────────────────────────────────────────────── */
type Node = AlumniEntry & {
  cx: number; cy: number;          // center offset px (from scene center)
  scale: number;                   // 0.6–1.0 — simulates depth
  animDuration: number;
  animDelay: number;
  side: 'left' | 'right';
};

// Scene is rendered at 1200×580 logical px
const CX = 600, CY = 290;

const RAW_NODES: Array<{ angle: number; rx: number; ry: number; scale: number }> = [
  { angle:  15, rx: 480, ry: 130, scale: 0.95 },
  { angle:  55, rx: 460, ry: 125, scale: 0.88 },
  { angle: 100, rx: 440, ry: 120, scale: 0.80 },
  { angle: 145, rx: 460, ry: 125, scale: 0.88 },
  { angle: 195, rx: 480, ry: 130, scale: 0.95 },
  { angle: 240, rx: 440, ry: 120, scale: 0.82 },
  { angle: 285, rx: 460, ry: 125, scale: 0.90 },
  { angle: 325, rx: 480, ry: 130, scale: 0.97 },
  // second ring (smaller)
  { angle:  35, rx: 310, ry:  85, scale: 0.75 },
  { angle:  95, rx: 300, ry:  80, scale: 0.70 },
  { angle: 170, rx: 310, ry:  85, scale: 0.72 },
  { angle: 260, rx: 300, ry:  80, scale: 0.74 },
];

function buildNodes(entries: AlumniEntry[]): Node[] {
  return entries.map((e, i) => {
    const r = RAW_NODES[i % RAW_NODES.length];
    const rad = (r.angle * Math.PI) / 180;
    const cx = Math.cos(rad) * r.rx;
    const cy = Math.sin(rad) * r.ry;
    return {
      ...e,
      cx, cy,
      scale: r.scale,
      animDuration: 14 + (i * 1.7) % 8,
      animDelay: (i * 0.9) % 5,
      side: cx >= 0 ? 'right' : 'left',
    };
  });
}

/* ─────────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────────── */
function VideoModal({ entry, onClose }: { entry: AlumniEntry; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="w-full max-w-[680px] bg-[#0d1117] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-white/10">
          <div>
            <p className="font-sans font-extrabold text-white text-[1rem]">{entry.name}</p>
            <p className="font-mono text-[0.72rem] text-white/50 mt-0.5">{entry.role} · {entry.company}</p>
            <p className="font-mono text-[0.65rem] text-white/35 mt-0.5">{entry.location} · {entry.package}</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* body */}
        <div className="relative aspect-video bg-black">
          {entry.videoUrl ? (
            <iframe
              src={entry.videoUrl.includes('youtube') || entry.videoUrl.includes('youtu.be')
                ? `https://www.youtube.com/embed/${entry.videoUrl.match(/(?:youtu\.be\/|v=)([^&?/]+)/)?.[1]}?autoplay=1`
                : entry.videoUrl}
              title={`${entry.name} — Alumni`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen" allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.thumbnail} alt={entry.company}
                className="max-h-[60%] max-w-[50%] object-contain opacity-30" />
              <p className="font-mono text-white/30 text-[0.75rem] tracking-widest uppercase">Video coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ORBITAL NODE CARD
───────────────────────────────────────────────────────────────── */
function OrbitalCard({ node, active, onHover, onClick }: {
  node: Node;
  active: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
}) {
  const cardW = Math.round(node.scale * 190);

  return (
    <div
      className="absolute"
      style={{
        left: CX + node.cx,
        top:  CY + node.cy,
        transform: `translate(-50%, -50%) scale(${node.scale})`,
        zIndex: Math.round(node.scale * 10),
        animation: `floatNode ${node.animDuration}s ease-in-out ${node.animDelay}s infinite`,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* connector line drawn via CSS box-shadow trick — we'll use SVG in parent */}
      <button
        onClick={onClick}
        className="group block rounded-xl overflow-hidden border transition-all duration-300 focus:outline-none"
        style={{
          width: cardW,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(8px)',
          borderColor: active ? 'rgba(255,160,50,0.6)' : 'rgba(255,255,255,0.12)',
          boxShadow: active
            ? '0 8px 32px rgba(232,93,4,0.25), 0 0 0 1px rgba(255,160,50,0.3)'
            : '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* image */}
        <div className="relative flex items-center justify-center bg-white/[0.08]" style={{ height: cardW * 0.58 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={node.thumbnail}
            alt={node.company}
            className="max-w-[75%] max-h-[70%] object-contain"
            style={{ filter: 'brightness(0.9)' }}
          />
          {/* hover play overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M3 2l9 4.5L3 11V2z" fill="#0f0f0f"/>
              </svg>
            </div>
          </div>
        </div>

        {/* info */}
        <div className="px-3 py-2.5 text-left">
          <p className="font-sans font-bold text-white truncate" style={{ fontSize: Math.round(node.scale * 13) }}>
            {node.name}
          </p>
          <p className="font-mono text-white/50 truncate mt-0.5" style={{ fontSize: Math.round(node.scale * 11) }}>
            {node.company}
          </p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono text-white/40 truncate" style={{ fontSize: Math.round(node.scale * 10) }}>
              {node.location}
            </span>
            <span className="font-mono font-semibold text-[#e8a030] shrink-0 ml-1" style={{ fontSize: Math.round(node.scale * 11) }}>
              {node.package}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CONNECTOR SVG (drawn under all cards)
───────────────────────────────────────────────────────────────── */
function Connectors({ nodes, activeIdx }: { nodes: Node[]; activeIdx: number | null }) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="1200" height="580"
      viewBox="0 0 1200 580"
      aria-hidden
    >
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(232,93,4,0.5)" />
          <stop offset="100%" stopColor="rgba(232,93,4,0)"   />
        </radialGradient>
      </defs>
      {/* central warm glow */}
      <ellipse cx="600" cy="290" rx="220" ry="130" fill="url(#cg)" />
      {/* connector lines */}
      {nodes.map((n, i) => {
        const active = activeIdx === i;
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={CX + n.cx} y2={CY + n.cy}
            stroke={active ? 'rgba(232,93,4,0.45)' : 'rgba(255,255,255,0.06)'}
            strokeWidth={active ? 1.2 : 0.7}
            strokeDasharray={active ? '0' : '5 7'}
          />
        );
      })}
      {/* orbit ring ellipses */}
      <ellipse cx="600" cy="290" rx="480" ry="130" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <ellipse cx="600" cy="290" rx="310" ry="85"  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function AlumniGlobe() {
  const [activeModal, setActiveModal] = useState<AlumniEntry | null>(null);
  const [hoveredIdx, setHoveredIdx]   = useState<number | null>(null);
  const nodes = buildNodes(ALUMNI_VIDEOS);

  return (
    <section className="text-white py-20 md:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0a0e14 0%, #0d1117 50%, #0c0f0a 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">

        {/* heading */}
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-[#e8a030]/60 mb-3 inline-block">
            Global Network
          </span>
          <h2 className="font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Alumni Across{' '}
            <span className="font-display italic font-medium" style={{ color: '#e8a030' }}>the Globe.</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-[540px] leading-relaxed">
            Our graduates are making their mark at top companies worldwide — from Hyderabad to Seattle, London to Singapore.
          </p>
        </Reveal>

      </div>

      {/* ── Desktop orbital scene ── */}
      <div className="hidden md:block mt-12 relative">
        {/* scene: 1200×580 fixed, then scaled by container */}
        <div
          className="relative mx-auto"
          style={{ width: '100%', maxWidth: 1200, aspectRatio: '1200/580' }}
        >
          {/* SVG connectors + glow — bottom layer */}
          <Connectors nodes={nodes} activeIdx={hoveredIdx} />

          {/* center wordmark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span
              className="font-sans font-black text-white/[0.08] tracking-tighter"
              style={{ fontSize: 'clamp(5rem,10vw,9.5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
            >
              MLR
            </span>
            <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/[0.12] mt-1">
              Alumni Network
            </span>
          </div>

          {/* orbital cards */}
          {nodes.map((node, i) => (
            <OrbitalCard
              key={i}
              node={node}
              active={hoveredIdx === i}
              onHover={(v) => setHoveredIdx(v ? i : null)}
              onClick={() => setActiveModal(node)}
            />
          ))}
        </div>
      </div>

      {/* ── Mobile: wordmark + horizontal scroll ── */}
      <div className="md:hidden mt-10 px-6">
        {/* mini glow wordmark */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative flex items-center justify-center w-48 h-48">
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.18) 0%, transparent 70%)' }} />
            <span className="font-sans font-black text-white/15 tracking-tighter" style={{ fontSize: '4rem' }}>MLR</span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {ALUMNI_VIDEOS.map((entry, i) => (
            <button
              key={i}
              onClick={() => setActiveModal(entry)}
              className="shrink-0 w-[175px] rounded-xl overflow-hidden border border-white/10 text-left focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center justify-center bg-white/[0.06]" style={{ height: 100 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={entry.thumbnail} alt={entry.company} className="max-h-[70%] max-w-[75%] object-contain" />
              </div>
              <div className="px-3 py-2.5">
                <p className="font-sans font-bold text-white text-[0.82rem] truncate">{entry.name}</p>
                <p className="font-mono text-white/50 text-[0.65rem] truncate mt-0.5">{entry.company}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-mono text-white/35 text-[0.6rem] truncate">{entry.location}</span>
                  <span className="font-mono font-semibold text-[0.65rem] shrink-0 ml-1" style={{ color: '#e8a030' }}>{entry.package}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeModal && (
        <VideoModal entry={activeModal} onClose={() => setActiveModal(null)} />
      )}

      <style jsx>{`
        @keyframes floatNode {
          0%,  100% { transform: translate(-50%, -50%) scale(var(--s, 1)) translateY(0px); }
          40%        { transform: translate(-50%, -50%) scale(var(--s, 1)) translateY(-9px); }
          70%        { transform: translate(-50%, -50%) scale(var(--s, 1)) translateY(5px); }
        }
      `}</style>
    </section>
  );
}
