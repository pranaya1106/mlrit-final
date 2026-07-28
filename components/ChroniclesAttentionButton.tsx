'use client';

import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';

export default function ChroniclesAttentionButton({ href }: { href: string }) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={href}
      aria-label="MLRIT Chronicles — read the latest edition"
      className="relative inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-[10px]"
    >
      <style>{`
        .chron-shell:hover .chron-fill,
        .chron-shell:focus-within .chron-fill {
          transform: scaleX(1) !important;
        }
        @keyframes chron-glow {
          0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1.5px rgba(232,93,4,0.55), 0 0 8px 2px rgba(232,93,4,0.25); }
          50%       { box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 2px   rgba(232,93,4,0.9),  0 0 16px 4px rgba(232,93,4,0.45); }
        }
        .chron-shell {
          animation: chron-glow 2.8s ease-in-out infinite;
        }
      `}</style>

      <span
        className="chron-shell relative flex items-center h-[38px] px-4 rounded-[10px] bg-[#01741f] overflow-hidden select-none cursor-pointer whitespace-nowrap"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1.5px rgba(232,93,4,0.55), 0 0 8px 2px rgba(232,93,4,0.25)' }}
      >
        {/* Orange fill — sweeps left → right on hover */}
        <span
          aria-hidden
          className="chron-fill pointer-events-none absolute inset-0 bg-[#e85d04]"
          style={{
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            transition: reduce ? 'none' : 'transform 0.35s cubic-bezier(0.65,0,0.076,1)',
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
