'use client';

import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';

export default function ChroniclesAttentionButton({ href }: { href: string }) {
  const reduce = useReducedMotion();

  return (
    <>
      <style>{`
        @keyframes chron-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes chron-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        @keyframes chron-opacity {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        .chron-wrapper {
          animation: none;
        }
        .chron-layer {
          animation: ${reduce ? 'none' : 'chron-rotate 8s linear infinite'};
        }
        .chron-layer-dodge {
          animation: ${reduce ? 'none' : 'chron-rotate 8s linear infinite'};
          mix-blend-mode: color-dodge;
        }
        .chron-light {
          animation: ${reduce ? 'none' : 'chron-pulse 3s ease-in-out infinite'};
        }
        .chron-overlay {
          animation: ${reduce ? 'none' : 'chron-opacity 5s ease infinite'};
          transition: transform 0.3s ease;
        }
        .chron-wrapper:hover .chron-overlay {
          transform: scale(1.06);
        }
        .chron-wrapper:active .chron-overlay {
          transform: scale(0.95);
        }
        .chron-wrapper:hover .chron-btn-text {
          color: transparent;
          text-shadow: none;
        }
        .chron-fill-btn {
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }
      `}</style>

      <Link
        href={href}
        aria-label="MLRIT Chronicles — read the latest edition"
        className="chron-wrapper relative inline-flex items-center justify-center overflow-clip rounded-[32px] border-2 border-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{
          filter: 'saturate(0.75) brightness(1.7)',
          overflowClipMargin: '4px',
        }}
      >
        {/* Base button — mix-blend color-dodge */}
        <span
          className="chron-fill-btn relative z-[-1] flex items-center gap-2 h-[38px] px-4 rounded-[30px] whitespace-nowrap select-none"
          style={{
            background: '#01741f',
            backgroundSize: '200% 200%',
            boxShadow: 'inset 0 0 10px 9px rgba(85,85,136,0.7)',
            mixBlendMode: 'color-dodge',
          }}
        >
          <span
            className="chron-btn-text font-sans font-semibold text-[0.85rem] tracking-[0.05em] text-white"
            style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}
          >
            MLRIT Chronicles
          </span>
          <span
            aria-hidden
            className="relative px-1.5 py-px rounded-full text-[0.58rem] font-mono font-black tracking-wider uppercase"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            New
          </span>
        </span>

        {/* Rotating radial gradient layer — mix-blend difference */}
        <span
          aria-hidden
          className="chron-layer pointer-events-none absolute"
          style={{
            left: '-160px',
            width: '500%',
            aspectRatio: '1',
            background: 'radial-gradient(ellipse at 65% 180%, #fff, #e85d04, #fff, #01741f, #fff, #0ea5e9, #fff, #a855f7, #fff, #f4a23a, #fff)',
            mixBlendMode: 'difference',
          }}
        />

        {/* Second layer — color-dodge */}
        <span
          aria-hidden
          className="chron-layer-dodge pointer-events-none absolute"
          style={{
            left: '-160px',
            width: '500%',
            aspectRatio: '1',
            background: 'radial-gradient(ellipse at 65% 180%, #fff, #e85d04, #fff, #01741f, #fff, #0ea5e9, #fff, #a855f7, #fff, #f4a23a, #fff)',
          }}
        />

        {/* Highlight light streak */}
        <span
          aria-hidden
          className="chron-light pointer-events-none absolute z-[1] rounded-[50px]"
          style={{
            width: '80%',
            height: '1.9rem',
            background: 'rgba(255,255,255,0.3)',
            filter: 'blur(5px)',
          }}
        />

        {/* Text overlay — multiply blend, pulses */}
        <span
          aria-hidden
          className="chron-overlay pointer-events-none absolute z-[2] flex items-center gap-2 h-[38px] px-4 rounded-[30px]"
          style={{
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: '#000',
            textShadow: '0 0 4px #fff',
            boxShadow: 'inset 0 -4px 4px 0 rgba(0,0,0,0.25), inset 0 4px 4px 0 rgba(255,255,255,0.33)',
            mixBlendMode: 'multiply',
          }}
        >
          MLRIT Chronicles
        </span>
      </Link>
    </>
  );
}
