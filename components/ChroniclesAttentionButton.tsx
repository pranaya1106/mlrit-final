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
        @property --chron-a {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes chron-shine {
          to { --chron-a: 360deg; }
        }
        .chron-border {
          animation: ${reduce ? 'none' : 'chron-shine 3s linear infinite'};
          background: conic-gradient(
            from var(--chron-a),
            rgba(255,210,122,0.15) 0%,
            rgba(255,255,255,0.85) 20%,
            rgba(255,210,122,1) 35%,
            rgba(255,255,255,0.85) 50%,
            rgba(255,210,122,0.15) 70%,
            transparent 85%,
            transparent 100%
          );
        }
      `}</style>

      {/* Spinning shine border — sits 2px behind the shell */}
      <span aria-hidden className="chron-border pointer-events-none absolute inset-[-2px] rounded-[12px] z-0" />

      <span
        className="chron-shell relative z-10 flex items-center h-[38px] px-4 rounded-[10px] bg-[#01741f] overflow-hidden select-none cursor-pointer whitespace-nowrap"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 3px rgba(0,0,0,0.25)' }}
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
