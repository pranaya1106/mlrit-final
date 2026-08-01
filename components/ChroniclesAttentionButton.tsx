'use client';

import Link from 'next/link';

export default function ChroniclesAttentionButton({ href }: { href: string }) {
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
      `}</style>

      {/* Spinning border ring: overflow:hidden clips the oversized rotating inner */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 12,
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'block',
            position: 'absolute',
            inset: '-100%',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,210,122,0.15) 12%, rgba(255,255,255,0.9) 25%, rgba(255,220,100,1) 35%, rgba(255,255,255,0.9) 45%, rgba(255,210,122,0.15) 58%, transparent 72%)',
            animationName: 'chron-spin',
            animationDuration: '3s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
      </span>

      <span
        className="chron-shell relative z-10 flex items-center h-[38px] px-4 rounded-[10px] overflow-hidden select-none cursor-pointer whitespace-nowrap"
        style={{
          background: 'linear-gradient(145deg, #01741f, #015a18)',
          boxShadow: '-1px -3px 10px rgba(1,116,31,0.5), 3px 3px 10px rgba(0,0,0,0.35), inset 3px 3px 8px rgba(0,0,0,0.2), inset -3px -3px 8px rgba(255,255,255,0.08)',
          transition: 'box-shadow 500ms, background 500ms',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '1px 1px 10px rgba(0,0,0,0.3), -1px -1px 10px rgba(1,180,50,0.4)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '-1px -3px 10px rgba(1,116,31,0.5), 3px 3px 10px rgba(0,0,0,0.35), inset 3px 3px 8px rgba(0,0,0,0.2), inset -3px -3px 8px rgba(255,255,255,0.08)';
        }}
      >
        {/* Orange fill — sweeps left → right on hover */}
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
