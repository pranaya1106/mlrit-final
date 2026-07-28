'use client';

import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';

export default function ChroniclesAttentionButton({ href }: { href: string }) {
  const reduce = useReducedMotion();

  return (
    <>
      <style>{`
        @keyframes chron-rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes chron-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        @keyframes chron-opacity {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        .chron-layer {
          animation: ${reduce ? 'none' : 'chron-rotate 8s linear infinite'};
        }
        .chron-light {
          animation: ${reduce ? 'none' : 'chron-pulse 3s ease-in-out infinite'};
        }
        .chron-overlay {
          animation: ${reduce ? 'none' : 'chron-opacity 5s ease infinite'};
          transition: transform 0.3s ease;
        }
        .chron-wrapper:hover .chron-overlay { transform: scale(1.06); }
        .chron-wrapper:active .chron-overlay { transform: scale(0.95); }
        .chron-wrapper:hover .chron-btn-text,
        .chron-wrapper:active .chron-btn-text {
          color: transparent !important;
          text-shadow: none !important;
        }
        .chron-btn-base {
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }
      `}</style>

      {/* isolation:isolate keeps blend modes from leaking into the navbar */}
      <span style={{ isolation: 'isolate', display: 'inline-flex', alignItems: 'center' }}>
        <Link
          href={href}
          aria-label="MLRIT Chronicles — read the latest edition"
          className="chron-wrapper relative inline-flex items-center justify-center rounded-[32px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{
            overflow: 'clip',
            overflowClipMargin: '4px',
            border: '2px solid rgba(255,255,255,0.7)',
            filter: 'saturate(0.7) brightness(1.75)',
          }}
        >
          {/* Base button layer */}
          <span
            className="chron-btn-base relative z-[-1] flex items-center gap-2 h-[38px] px-4 rounded-[30px] whitespace-nowrap select-none"
            style={{
              background: '#01741f',
              boxShadow: 'inset 0 0 10px 9px rgba(85,85,136,0.6)',
              mixBlendMode: 'color-dodge',
            }}
          >
            <span
              className="chron-btn-text font-sans font-semibold text-[0.85rem] tracking-[0.04em] text-white"
              style={{ textShadow: '0 1px 3px rgba(255,255,255,0.9)' }}
            >
              MLRIT Chronicles
            </span>
            <span
              aria-hidden
              className="px-1.5 py-px rounded-full text-[0.58rem] font-mono font-black tracking-wider uppercase"
              style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
            >
              New
            </span>
          </span>

          {/* Rotating radial gradient — difference blend */}
          <span
            aria-hidden
            className="chron-layer pointer-events-none absolute"
            style={{
              left: '-160px',
              width: '500%',
              aspectRatio: '1 / 1',
              background: 'radial-gradient(ellipse at 65% 180%, #fff, #e85d04, #fff, #01741f, #fff, #0ea5e9, #fff, #a855f7, #fff, #f4a23a, #fff)',
              mixBlendMode: 'difference',
            }}
          />

          {/* Second layer — color-dodge */}
          <span
            aria-hidden
            className="chron-layer pointer-events-none absolute"
            style={{
              left: '-160px',
              width: '500%',
              aspectRatio: '1 / 1',
              background: 'radial-gradient(ellipse at 65% 180%, #fff, #e85d04, #fff, #01741f, #fff, #0ea5e9, #fff, #a855f7, #fff, #f4a23a, #fff)',
              mixBlendMode: 'color-dodge',
            }}
          />

          {/* Pulsing light streak */}
          <span
            aria-hidden
            className="chron-light pointer-events-none absolute z-[1] rounded-[50px]"
            style={{
              width: '80%',
              height: '1.6rem',
              background: 'rgba(255,255,255,0.28)',
              filter: 'blur(5px)',
            }}
          />

          {/* Text overlay — multiply + opacity pulse */}
          <span
            aria-hidden
            className="chron-overlay pointer-events-none absolute z-[2] flex items-center gap-2 h-[38px] px-4 rounded-[30px]"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#000',
              textShadow: '0 0 4px #fff',
              boxShadow: 'inset 0 -4px 4px 0 rgba(0,0,0,0.2), inset 0 4px 4px 0 rgba(255,255,255,0.3)',
              mixBlendMode: 'multiply',
            }}
          >
            MLRIT Chronicles
          </span>
        </Link>
      </span>
    </>
  );
}
