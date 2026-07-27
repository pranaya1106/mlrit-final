'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

/**
 * Chronicles nav button with expanding-pill + sliding-arrow hover effect.
 * On hover: orange pill grows from left to fill full width; arrow slides right.
 * Outer glow ring + pulse halo remain as ambient decorators.
 */
export default function ChroniclesAttentionButton({ href }: { href: string }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const spring = { type: 'spring' as const, damping: 28, stiffness: 260, mass: 0.9 };
  const ease   = { duration: 0.38, ease: [0.65, 0, 0.076, 1] as const };

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
        transition={reduce ? {} : { repeat: Infinity, duration: 11, ease: 'linear' }}
      />

      {/* Pulse halo */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-[-4px] rounded-[14px] z-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(232,93,4,0.35) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1.03, 0.97] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
      )}

      {/* Button shell */}
      <motion.span
        className="relative z-10 flex items-center h-[38px] px-4 rounded-[10px] bg-[#01741f] overflow-hidden select-none cursor-pointer whitespace-nowrap"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.25)' }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={reduce ? {} : { scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.9 }}
      >
        {/* Fill layer — scaleX 0→1 from left on hover */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#e85d04]"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={!reduce && hovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.35, ease: [0.65, 0, 0.076, 1] }}
        />

        {/* Label */}
        <span className="relative z-10 font-sans font-semibold text-[0.85rem] tracking-[-0.01em] text-white">
          MLRIT Chronicles
        </span>

        {/* New badge */}
        <span
          aria-hidden
          className="relative z-10 ml-2 px-1.5 py-px rounded-full text-[0.58rem] font-mono font-black tracking-wider uppercase"
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
        >
          New
        </span>
      </motion.span>
    </Link>
  );
}
