'use client';

/*
  DomainFolders — one always-open folder with 5 domain cards in a 3D Z-tunnel.

  Mechanics (faithful to MotionLayerScroller Framer source):
    • scrollY MotionValue ← non-passive wheel + touch drag (zero React renders)
    • smoothScroll = useSpring(scrollY, {stiffness:100, damping:30})
    • Each card: translateZ = looping Z derived via useTransform(smoothScroll, …)
    • scale from Z position: far → 0.55, centre → 1, close → 1.45
    • opacity fades at depth edges
    • blur depth-of-field, cleared on hover (exact Framer pattern)
    • useVelocity → smoothVelocity → velocityRotation → camera rotateX tilt
    • Click card → fixed detail panel (AnimatePresence mode="wait")
    • Keyboard: Tab/Enter to select, Escape to close detail
    • Reduced motion: disables blur, tilt, spring physics
*/

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useId,
  memo,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

export interface DomainItem {
  id:    string;
  n:     string;
  title: string;
  sub:   string;
  body:  string;
  color: string;
  tags:  string[];
}

const DEFAULT_DOMAINS: DomainItem[] = [
  {
    id: 'game-dev', n: '01',
    title: 'Game Development',
    sub:   'Unity · Unreal · Godot',
    body:  'Real games on real engines — mobile, PC and VR. Members ship playable projects every semester, guided by peers who have shipped before.',
    color: '#e85d04',
    tags:  ['Unity', 'Unreal', 'Godot', 'Mobile', 'VR', 'PC'],
  },
  {
    id: 'esports', n: '02',
    title: 'E-Sports',
    sub:   'Valorant · BGMI · FIFA · Multi-title',
    body:  'Competitive gaming from the ground up — team formation, scrims, coaching, casting, and the community that makes every match worth playing.',
    color: '#f59e0b',
    tags:  ['Valorant', 'BGMI', 'FIFA', 'Scrims', 'Casting'],
  },
  {
    id: 'uiux', n: '03',
    title: 'UI/UX & Game Design',
    sub:   'Interface · Feedback · Game Feel',
    body:  "The design work that makes a build worth playing — interfaces, feedback loops, visual language and the invisible craft players feel but can't name.",
    color: '#22c55e',
    tags:  ['Figma', 'Game Feel', 'Interface', 'Prototyping'],
  },
  {
    id: 'narrative', n: '04',
    title: 'Storytelling & Narrative',
    sub:   'World-building · Characters · Writing',
    body:  'Worlds and characters that give every mechanic a reason to exist. Writing workshops, narrative design and the craft of making players care.',
    color: '#3b82f6',
    tags:  ['Writing', 'World-build', 'Narrative Design', 'Characters'],
  },
  {
    id: 'emerging-tech', n: '05',
    title: 'Emerging Tech',
    sub:   'AR/VR · Procedural · New Engines',
    body:  'The frontier — AR/VR, procedural generation and experimental engines where the next genre is being invented right now.',
    color: '#a855f7',
    tags:  ['AR', 'VR', 'Procedural', 'WebGL', 'Experimental'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tunnel constants  (mirror Framer source defaults)
// ─────────────────────────────────────────────────────────────────────────────

const SPACING     = 240;   // Z gap between cards (px)
const PERSPECTIVE = 900;   // CSS perspective (px)
const SCROLL_SENS = 0.9;   // wheel multiplier
const TILT_BASE   = 6;     // base camera rotateX (degrees) — slight downward look

// Springs — copied straight from Framer source
const SCROLL_SPRING = { stiffness: 100, damping: 30 };
const VEL_SPRING    = { stiffness: 100, damping: 30 };

// Card dimensions
const CARD_W = 360;
const CARD_H = 230;

// ─────────────────────────────────────────────────────────────────────────────
// Folder shell — the always-visible container drawn as a physical folder
// ─────────────────────────────────────────────────────────────────────────────

function FolderFrame({ accentColor }: { accentColor: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        0,
      }}
    >
      {/* Top folder tab bar */}
      <div style={{
        position:      'absolute',
        top:           0,
        left:          0,
        right:         0,
        height:        44,
        borderBottom:  `1px solid ${accentColor}28`,
        background:    `linear-gradient(180deg, ${accentColor}10 0%, transparent 100%)`,
        display:       'flex',
        alignItems:    'center',
        paddingLeft:   20,
        gap:           12,
      }}>
        {/* Tab */}
        <div style={{
          height:        28,
          padding:       '0 16px',
          background:    `${accentColor}18`,
          border:        `1px solid ${accentColor}40`,
          borderBottom:  'none',
          borderRadius:  '4px 4px 0 0',
          display:       'flex',
          alignItems:    'center',
          gap:           8,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor, opacity: 0.9, boxShadow: `0 0 8px ${accentColor}` }} />
          <span style={{
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '0.5rem',
            fontWeight:    700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         `${accentColor}cc`,
          }}>
            APEX / Domains
          </span>
        </div>
        {/* Accent stripe */}
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accentColor}20, transparent)` }} />
        <span style={{
          fontFamily:    'var(--font-mono, monospace)',
          fontSize:      '0.44rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.12)',
          paddingRight:  16,
        }}>
          Scroll to explore
        </span>
      </div>

      {/* Left border rule */}
      <div style={{
        position:   'absolute',
        top:        44,
        bottom:     0,
        left:       0,
        width:      1,
        background: `linear-gradient(180deg, ${accentColor}30, transparent 80%)`,
      }} />
      {/* Right border rule */}
      <div style={{
        position:   'absolute',
        top:        44,
        bottom:     0,
        right:      0,
        width:      1,
        background: `linear-gradient(180deg, ${accentColor}30, transparent 80%)`,
      }} />
      {/* Bottom border */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        right:      0,
        height:     1,
        background: `linear-gradient(90deg, transparent, ${accentColor}22, transparent)`,
      }} />

      {/* Corner notch TL */}
      <div style={{ position: 'absolute', top: 44, left: 0, width: 6, height: 6, borderTop: `1px solid ${accentColor}55`, borderLeft: `1px solid ${accentColor}55` }} />
      {/* Corner notch TR */}
      <div style={{ position: 'absolute', top: 44, right: 0, width: 6, height: 6, borderTop: `1px solid ${accentColor}55`, borderRight: `1px solid ${accentColor}55` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single card — memo prevents re-render when other cards' hover state changes
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  domain:       DomainItem;
  index:        number;
  total:        number;
  smoothScroll: ReturnType<typeof useSpring>;
  onSelect:     (id: string) => void;
  reduced:      boolean;
}

const DomainCard = memo(function DomainCard({
  domain, index, total, smoothScroll, onSelect, reduced,
}: CardProps) {
  const [hovered, setHovered] = useState(false);

  const totalDepth = total * SPACING;
  const zInitial   = -index * SPACING;

  // ── Core Z loop (exact Framer source) ────────────────────────────────────
  const layerZ = useTransform(smoothScroll, (value) => {
    const currentZ   = zInitial + value;
    const normalised = ((currentZ % totalDepth) + totalDepth) % totalDepth;
    return normalised - totalDepth * 0.5;
  });

  // Scale: farther = smaller, closer = larger
  const scale = useTransform(
    layerZ,
    [-totalDepth * 0.5, 0, totalDepth * 0.5],
    [0.52, 1, 1.48],
    { clamp: false },
  );

  // Opacity: fade at depth edges
  const opacity = useTransform(
    layerZ,
    [-totalDepth * 0.5, -SPACING * 1.3, 0, SPACING * 1.3, totalDepth * 0.5],
    [0, 0.4, 1, 0.4, 0],
    { clamp: true },
  );

  // Depth-of-field blur — cleared instantly on hover (Framer source pattern)
  const blurRaw = useTransform(
    layerZ,
    [-totalDepth * 0.5, -SPACING * 0.5, 0, SPACING * 0.5, totalDepth * 0.5],
    reduced ? [0, 0, 0, 0, 0] : [16, 8, 0, 8, 16],
    { clamp: true },
  );
  const filterValue = useTransform(blurRaw, (b) =>
    hovered || b <= 0 ? 'none' : `blur(${b.toFixed(1)}px)`,
  );

  // z-index: hovered always on top, otherwise track Z position
  const zIndex = useTransform(layerZ, (z) =>
    hovered ? 999 : Math.round(500 + z * 0.5),
  );

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(domain.id); }
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${domain.title} — press Enter to view details`}
      onKeyDown={handleKey}
      onClick={(e) => { e.stopPropagation(); onSelect(domain.id); }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position:        'absolute',
        width:           CARD_W,
        height:          CARD_H,
        left:            '50%',
        top:             '50%',
        x:               '-50%',
        y:               '-50%',
        translateZ:      layerZ,
        scale,
        opacity,
        filter:          filterValue,
        zIndex,
        transformOrigin: 'center center',
        willChange:      'transform, opacity, filter',
        cursor:          'pointer',
        outline:         'none',
        borderRadius:    10,
        overflow:        'hidden',
        background:      'rgba(255,255,255,0.028)',
        border:          `1px solid ${domain.color}38`,
        boxShadow:       `0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 ${domain.color}18`,
        userSelect:      'none',
      }}
      whileHover={reduced ? {} : {
        boxShadow: `0 28px 70px rgba(0,0,0,0.55), 0 0 0 1px ${domain.color}65`,
        y: '-52%',   // slight lift (adds to the -50% base y translate)
      }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {/* Colour top bar */}
      <div style={{
        position:   'absolute',
        top: 0, left: 0, right: 0,
        height:     3,
        background: `linear-gradient(90deg, ${domain.color}, ${domain.color}33)`,
      }} />

      {/* Number watermark */}
      <div style={{
        position:      'absolute',
        right:         '4%',
        top:           '6%',
        fontFamily:    'var(--font-manrope), sans-serif',
        fontWeight:    800,
        fontSize:      'clamp(3rem, 5vw, 4.5rem)',
        lineHeight:    1,
        letterSpacing: '-0.06em',
        color:         domain.color,
        opacity:       0.1,
        userSelect:    'none',
        pointerEvents: 'none',
      }}>
        {domain.n}
      </div>

      {/* Card content */}
      <div style={{
        position:       'absolute',
        inset:          0,
        padding:        '1.5rem 1.6rem 1.3rem',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '0.5rem',
            fontWeight:    700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         domain.color,
            marginBottom:  '0.65rem',
            opacity:       0.92,
          }}>
            {domain.n} · Domain
          </p>
          <h3 style={{
            fontFamily:    'var(--font-manrope), sans-serif',
            fontWeight:    800,
            fontSize:      'clamp(1.05rem, 1.8vw, 1.3rem)',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
            color:         'rgba(255,255,255,0.92)',
            marginBottom:  '0.55rem',
          }}>
            {domain.title}
          </h3>
          <p style={{
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '0.46rem',
            fontWeight:    600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.24)',
            lineHeight:    1.5,
          }}>
            {domain.sub}
          </p>
        </div>

        {/* Tags row — just 3 max to keep card clean */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {domain.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{
              fontFamily:    'var(--font-mono, monospace)',
              fontSize:      '0.42rem',
              fontWeight:    700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding:       '0.22em 0.55em',
              borderRadius:  3,
              border:        `1px solid ${domain.color}30`,
              color:         domain.color,
              background:    `${domain.color}0e`,
            }}>
              {tag}
            </span>
          ))}
          <span style={{
            fontFamily:    'var(--font-mono, monospace)',
            fontSize:      '0.4rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         `${domain.color}60`,
            alignSelf:     'center',
            marginLeft:    'auto',
          }}>
            Open →
          </span>
        </div>
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Detail pop panel — fixed overlay, AnimatePresence mode="wait"
// ─────────────────────────────────────────────────────────────────────────────

function DetailPanel({
  domain,
  onClose,
  reduced,
}: {
  domain: DomainItem;
  onClose: () => void;
  reduced: boolean;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <>
      {/* Scrim */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position:            'fixed',
          inset:               0,
          zIndex:              8000,
          background:          'rgba(0,0,0,0.72)',
          backdropFilter:      'blur(8px)',
          WebkitBackdropFilter:'blur(8px)',
          cursor:              'default',
        }}
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${domain.title} details`}
        initial={{ opacity: 0, scale: reduced ? 1 : 0.9, y: reduced ? 0 : 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{   opacity: 0, scale: reduced ? 1 : 0.95, y: reduced ? 0 : -16 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position:  'fixed',
          top:       '50%',
          left:      '50%',
          x:         '-50%',
          y:         '-50%',
          zIndex:    8001,
          width:     'min(560px, 92vw)',
          background:'rgba(8,8,8,0.94)',
          border:    `1px solid ${domain.color}50`,
          borderRadius: 14,
          padding:   '2.6rem 2.8rem',
          boxShadow: `0 48px 120px rgba(0,0,0,0.65), 0 0 0 1px ${domain.color}1a`,
        }}
      >
        {/* Top accent */}
        <div style={{
          position:     'absolute',
          top: 0, left: 0, right: 0,
          height:       3,
          borderRadius: '14px 14px 0 0',
          background:   `linear-gradient(90deg, ${domain.color}, transparent)`,
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.6rem' }}>
          <div>
            <p style={{
              fontFamily:    'var(--font-mono, monospace)',
              fontSize:      '0.52rem',
              fontWeight:    700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color:         domain.color,
              marginBottom:  '0.55rem',
            }}>
              {domain.n} · Domain
            </p>
            <h3 style={{
              fontFamily:    'var(--font-manrope), sans-serif',
              fontWeight:    800,
              fontSize:      'clamp(1.5rem, 3vw, 2.2rem)',
              letterSpacing: '-0.03em',
              lineHeight:    1.05,
              color:         'rgba(255,255,255,0.95)',
            }}>
              {domain.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width:      30, height: 30,
              borderRadius:'50%',
              border:     '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color:      'rgba(255,255,255,0.4)',
              cursor:     'pointer',
              display:    'flex', alignItems: 'center', justifyContent: 'center',
              fontSize:   '0.65rem',
              flexShrink: 0,
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '1.6rem' }} />

        {/* Body */}
        <p style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize:   'clamp(0.88rem, 1.5vw, 1rem)',
          lineHeight: 1.78,
          color:      'rgba(255,255,255,0.5)',
          marginBottom:'1.8rem',
        }}>
          {domain.body}
        </p>

        {/* All tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.42rem', marginBottom: '1.6rem' }}>
          {domain.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily:    'var(--font-mono, monospace)',
              fontSize:      '0.48rem',
              fontWeight:    700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding:       '0.28em 0.65em',
              borderRadius:  3,
              border:        `1px solid ${domain.color}35`,
              color:         domain.color,
              background:    `${domain.color}10`,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Sub */}
        <p style={{
          fontFamily:    'var(--font-mono, monospace)',
          fontSize:      '0.46rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         'rgba(255,255,255,0.16)',
        }}>
          {domain.sub}
        </p>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// The 3D tunnel — wheel/touch scroll drives smoothScroll, cards loop in Z
// ─────────────────────────────────────────────────────────────────────────────

function LayerTunnel({
  domains,
  onSelectCard,
  reduced,
}: {
  domains:      DomainItem[];
  onSelectCard: (id: string) => void;
  reduced:      boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Initialise so card 0 sits at Z=0 (front): scrollY = totalDepth / 2
  const scrollY      = useMotionValue(domains.length * SPACING / 2);
  const smoothScroll = useSpring(scrollY, SCROLL_SPRING);

  // Velocity → camera tilt (exact Framer source pattern)
  const scrollVel  = useVelocity(smoothScroll);
  const smoothVel  = useSpring(scrollVel, VEL_SPRING);
  const velRot     = useTransform(smoothVel, [-600, 0, 600], reduced ? [0,0,0] : [-3, 0, 3]);
  const cameraRotX = useTransform(velRot, (offset) => TILT_BASE + offset);

  // Non-passive wheel — exact Framer source normalisation
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    scrollY.set(scrollY.get() + e.deltaY * factor * SCROLL_SENS);
  }, [scrollY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Touch drag
  const touchY = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchY.current = e.touches[0].clientY; };
  const onTouchMove  = (e: React.TouchEvent) => {
    const dy = touchY.current - e.touches[0].clientY;
    touchY.current = e.touches[0].clientY;
    scrollY.set(scrollY.get() + dy * 1.5);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      style={{
        position:        'absolute',
        inset:           0,
        top:             44,   // below folder tab bar
        overflow:        'hidden',
        perspective:     PERSPECTIVE,
        perspectiveOrigin:'50% 46%',
        cursor:          'grab',
        touchAction:     'none',
      }}
    >
      {/* Camera — velocity tilt here so all cards tilt together */}
      <motion.div
        style={{
          position:       'absolute',
          inset:          0,
          rotateX:        cameraRotX,
          transformStyle: 'preserve-3d',
        }}
      >
        {domains.map((d, i) => (
          <DomainCard
            key={d.id}
            domain={d}
            index={i}
            total={domains.length}
            smoothScroll={smoothScroll}
            onSelect={onSelectCard}
            reduced={reduced}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export interface DomainFoldersProps {
  domains?:     DomainItem[];
  accentColor?: string;
  eyebrow?:     string;
  headline?:    string;
}

export default function DomainFolders({
  domains     = DEFAULT_DOMAINS,
  accentColor = '#D80000',
  eyebrow     = 'How it works',
  headline    = 'Five domains. One community.',
}: DomainFoldersProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const reduced   = !!useReducedMotion();
  const uid       = useId();
  const activeDomain = domains.find((d) => d.id === activeCard) ?? null;

  return (
    <section
      className="relative z-10"
      aria-label="APEX domains"
      id={`${uid}-section`}
    >
      {/* Section header */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-24 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <span aria-hidden className="h-px w-6" style={{ background: accentColor }} />
          <span
            className="font-mono font-bold tracking-[0.3em] uppercase"
            style={{ fontSize: '0.68rem', color: accentColor }}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          className="font-sans font-black text-white"
          style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)', letterSpacing: '-0.02em', lineHeight: 1.08 }}
        >
          {headline}
        </h2>
        <p
          className="mt-3 font-sans"
          style={{ fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)', color: 'rgba(255,255,255,0.3)', lineHeight: 1.65 }}
        >
          Scroll inside the folder · Click a card to explore
        </p>
      </div>

      {/* Folder stage — full-width, fixed height */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pb-20">
        <div
          style={{
            position:     'relative',
            width:        '100%',
            height:       520,
            borderRadius: 12,
            overflow:     'hidden',
            background:   'rgba(255,255,255,0.018)',
            boxShadow:    `0 0 0 1px ${accentColor}22, 0 24px 80px rgba(0,0,0,0.35)`,
          }}
        >
          {/* Folder frame decoration */}
          <FolderFrame accentColor={accentColor} />

          {/* 3D tunnel — sits below the tab bar (top:44px set inside) */}
          <LayerTunnel
            domains={domains}
            onSelectCard={setActiveCard}
            reduced={reduced}
          />
        </div>
      </div>

      {/* Detail panel — fixed overlay, exits cleanly */}
      <AnimatePresence mode="wait">
        {activeDomain && (
          <DetailPanel
            key={activeDomain.id}
            domain={activeDomain}
            onClose={() => setActiveCard(null)}
            reduced={reduced}
          />
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <p
        aria-hidden
        className="text-center pb-6 font-mono"
        style={{ fontSize: '0.42rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.08)', textTransform: 'uppercase' }}
      >
        Tab · Enter to open · Escape to close
      </p>
    </section>
  );
}
