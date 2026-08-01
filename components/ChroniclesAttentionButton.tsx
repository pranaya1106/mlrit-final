'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function ChroniclesAttentionButton({ href }: { href: string }) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={href}
      aria-label="MLRIT Chronicles — read the latest edition"
      className="relative inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-[10px]"
    >
      {/* Ambient pulse halo — no rotation, just a breathing orange glow */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-[-4px] rounded-[14px] z-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(232,93,4,0.35) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.97, 1.03, 0.97] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
      )}

      <style>{`
        .chron-shell:hover .chron-fill,
        .chron-shell:focus-within .chron-fill {
          transform: scaleX(1) !important;
        }
      `}</style>

      <span
        className="chron-shell relative z-10 flex items-center h-[38px] px-4 rounded-[10px] bg-[#01741f] overflow-hidden select-none cursor-pointer whitespace-nowrap"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 8px rgba(1,116,31,0.4)' }}
      >
        <span
          aria-hidden
          className="chron-fill pointer-events-none absolute inset-0 bg-[#e85d04]"
          style={{
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            transition: 'transform 0.35s cubic-bezier(0.65,0,0.076,1)',
          }}
        />
        <span className="relative z-10 font-sans font-semibold text-[0.85rem] tracking-[-0.01em] text-white">
          MLRIT Chronicles
        </span>
        <span
          aria-hidden
          className="relative z-10 ml-2 px-1.5 py-px rounded-full text-[0.58rem] font-mono font-black tracking-wider uppercase"
          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
        >
          New
        </span>
      </span>
    </Link>
  );
}
