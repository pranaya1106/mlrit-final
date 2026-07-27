'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

/**
 * Animated attention-grabbing nav button for MLRIT Chronicles.
 * Sits in the green navbar as NAV_RIGHT replacement.
 *
 * Layers (back → front):
 *  1. Rotating conic gradient ring (8–14 s, pointer-events:none)
 *  2. Pulse halo (3–5 s, pointer-events:none)
 *  3. Frosted fill + label
 *
 * Reduced-motion: all decorative animations stop; static premium look retained.
 */
export default function ChroniclesAttentionButton({ href }: { href: string }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      aria-label="MLRIT Chronicles — read the latest edition"
      className="relative inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-[10px]"
    >
      {/* Rotating gradient ring */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-[-2px] rounded-[12px] z-0"
        style={{
          background: 'conic-gradient(from 0deg, #e85d04, #f4a23a, #ffd27a, #e85d04)',
          opacity: 0.85,
        }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={reduce ? {} : {
          repeat: Infinity,
          duration: 11,
          ease: 'linear',
        }}
      />

      {/* Pulse halo */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-[-4px] rounded-[14px] z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(232,93,4,0.35) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1.03, 0.97] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
      )}

      {/* Inner frosted button */}
      <motion.span
        className="relative z-10 flex items-center gap-2 h-[38px] px-4 rounded-[10px] bg-[#01741f] whitespace-nowrap select-none"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.25)' }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={reduce ? {} : { scale: 1.025 }}
        whileTap={reduce ? {} : { scale: 0.975 }}
        transition={{ type: 'spring', damping: 22, stiffness: 350, mass: 0.8 }}
      >
        {/* Dot indicator */}
        <span
          aria-hidden
          className="w-1.5 h-1.5 rounded-full bg-[#ffd27a] shrink-0"
          style={{ boxShadow: '0 0 5px rgba(255,210,122,0.9)' }}
        />

        {/* Text with highlighter sweep */}
        <span className="relative font-sans font-semibold text-[0.88rem] tracking-[-0.01em] text-white">
          {/* Highlighter layer — sweeps left→right on hover */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 right-0 rounded-[3px]"
            style={{
              background: 'rgba(255, 210, 122, 0.28)',
              originX: 0,
              skewX: '-6deg',
            }}
            initial={{ scaleX: 0 }}
            animate={!reduce && hovered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          />
          MLRIT Chronicles
        </span>

        {/* New badge */}
        <span
          aria-hidden
          className="ml-0.5 px-1.5 py-px rounded-full text-[0.58rem] font-mono font-black tracking-wider uppercase"
          style={{
            background: 'linear-gradient(135deg, #e85d04 0%, #f4a23a 100%)',
            color: '#fff',
          }}
        >
          New
        </span>
      </motion.span>
    </Link>
  );
}
