'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface WordConfig {
  text: string;
  // Base position (percent of container, 0–100)
  x: number;
  y: number;
  // Base transforms
  rotate: number;
  scale: number;
  skewX?: number;
  // clamp() font-size string, e.g. 'clamp(4rem, 10vw, 11rem)'
  fontSize?: string;
  // Scroll parallax: how far (px) each axis shifts across full scroll progress
  dX: number;
  dY: number;
  dRotate?: number;
  // Visual
  opacity?: number;
  // Mobile overrides (optional)
  mX?: number;
  mY?: number;
  mScale?: number;
  mRotate?: number;
  mFontSize?: string;
}

export interface TypographicSculptureProps {
  words: WordConfig[];
  accentColor: string;
  /** "section" height as a multiple of 100vh (scroll distance) */
  scrollHeight?: number;
  label?: string;
}

// Spring — near-critically damped for silky scroll tracking
const SPRING = { stiffness: 280, damping: 32, restDelta: 0.001 };

// ── Single word ────────────────────────────────────────────────────────────────
function SculptureWord({
  word,
  smooth,
  isMobile,
}: {
  word: WordConfig;
  smooth: ReturnType<typeof useSpring>;
  isMobile: boolean;
}) {
  const x        = isMobile && word.mX        != null ? word.mX        : word.x;
  const y        = isMobile && word.mY        != null ? word.mY        : word.y;
  const sc       = isMobile && word.mScale    != null ? word.mScale    : word.scale;
  const rotate   = isMobile && word.mRotate   != null ? word.mRotate   : word.rotate;
  const fontSize = isMobile && word.mFontSize != null ? word.mFontSize : (word.fontSize ?? 'clamp(3.5rem, 9vw, 10rem)');

  // Scroll-driven transforms — each word has its own offsets
  const motionX = useTransform(smooth, [0, 1], [0, word.dX]);
  const motionY = useTransform(smooth, [0, 1], [0, word.dY]);
  const motionR = useTransform(smooth, [0, 1], [0, word.dRotate ?? 0]);

  return (
    <motion.span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top:  `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${sc}) skewX(${word.skewX ?? 0}deg)`,
        x: motionX,
        y: motionY,
        rotate: motionR,
        opacity: word.opacity ?? 1,
        // Compositor-friendly — only transform + opacity
        willChange: 'transform',
        // Typography
        fontFamily:    'var(--font-manrope), ui-sans-serif, system-ui, sans-serif',
        fontSize,
        fontWeight:    800,
        textTransform: 'uppercase' as const,
        letterSpacing: '-0.04em',
        lineHeight:    0.88,
        whiteSpace:    'nowrap' as const,
        color:         'rgba(255,255,255,0.92)',
        userSelect:    'none' as const,
        pointerEvents: 'none' as const,
      }}
    >
      {word.text}
    </motion.span>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function TypographicSculpture({
  words,
  accentColor,
  scrollHeight = 1.6,
  label = 'Typographic sculpture',
}: TypographicSculptureProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Single shared progress value — all words derive from this
  const smooth = useSpring(scrollYProgress, SPRING);

  // Entry: whole composition fades+scales in as section enters viewport
  const entryOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const entryScale   = useTransform(scrollYProgress, [0, 0.15], [0.88, 1]);

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className="relative z-10"
      style={{ height: `${scrollHeight * 100}vh` }}
    >
      {/* Sticky viewport — composition lives here */}
      <div className="sticky top-0 h-screen overflow-hidden" aria-hidden="true">
        {/* Subtle accent gradient to anchor the composition */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 70% 55% at 50% 50%, ${accentColor}08 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Composition wrapper — perspective gives 3-D depth */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            perspective: '900px',
            perspectiveOrigin: '50% 45%',
            opacity: entryOpacity,
            scale: entryScale,
          }}
        >
          {/* Inner preserves 3D so individual rotateZ/X/Y compound correctly */}
          <div
            style={{
              position:      'absolute',
              inset:         0,
              transformStyle:'preserve-3d',
            }}
          >
            {words.map((w, i) => (
              <SculptureWord
                key={i}
                word={w}
                smooth={smooth}
                isMobile={false}
              />
            ))}
          </div>
        </motion.div>

        {/* Screen-reader label (visible to SR, hidden visually) */}
        <span className="sr-only">{words.map(w => w.text).join(' ')}</span>
      </div>
    </section>
  );
}
