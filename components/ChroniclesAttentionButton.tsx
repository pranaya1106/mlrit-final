'use client';

import Link from 'next/link';

export default function ChroniclesAttentionButton({ href }: { href: string }) {
  return (
    <>
      <style>{`
        @keyframes chron-spin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes chron-pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.18); }
        }

        .chron-wrap {
          position: relative;
          display: inline-block;
          border-radius: 8px;
          padding: 2px;
        }

        /* Spinning glow traces the border */
        .chron-ring {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .chron-ring::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 220%; height: 220%;
          background: conic-gradient(
            from 0deg,
            transparent  0%,
            transparent  38%,
            rgba(232,93,4,0.6) 46%,
            rgba(255,180,60,1) 50%,
            rgba(232,93,4,0.6) 54%,
            transparent  62%,
            transparent 100%
          );
          animation: chron-spin 2.2s linear infinite;
        }
        .chron-ring::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: 6px;
          background: #b0ada8;
        }

        .chron-box {
          cursor: pointer;
          border: 3px solid #d0cdc8;
          background-color: #b0ada8;
          padding-bottom: 6px;
          transition: 0.1s ease-in-out;
          user-select: none;
          display: inline-block;
          text-decoration: none;
          border-radius: 6px;
          position: relative;
          z-index: 1;
        }
        .chron-box .chron-inner {
          background-color: #fff;
          border: 3px solid #fff;
          padding: 5px 14px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .chron-label {
          font-size: 0.82rem;
          letter-spacing: 0.02em;
          color: #1a1a1a;
          font-weight: 600;
          white-space: nowrap;
        }
        .chron-box:active {
          padding: 0;
          margin-bottom: 6px;
          transform: translateY(6px);
        }
        .chron-new {
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 1px 5px;
          border-radius: 999px;
          background: #e85d04;
          color: #fff;
          font-family: monospace;
          flex-shrink: 0;
          animation: chron-pulse 2s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>

      <span className="chron-wrap">
        <span aria-hidden className="chron-ring" />
        <Link href={href} aria-label="MLRIT Chronicles — read the latest edition" className="chron-box">
          <div className="chron-inner">
            <svg viewBox="0 0 22 22" width="16" height="16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
              <path d="M3 5.5 L10.5 4 L10.5 18 L3 19.5 Z" stroke="#1a1a1a" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M19 5.5 L11.5 4 L11.5 18 L19 19.5 Z" stroke="#1a1a1a" strokeWidth="1.3" strokeLinejoin="round" />
              <line x1="11" y1="4" x2="11" y2="18" stroke="#1a1a1a" strokeWidth="0.9" opacity="0.4" />
              <path d="M15.5 4.4 L15.5 8.6 L16.6 7.5 L17.7 8.6 L17.7 4.7" fill="#e85d04" stroke="#e85d04" strokeWidth="0.6" strokeLinejoin="round" />
            </svg>
            <span className="chron-label">MLRIT Chronicles</span>
            <span className="chron-new">New</span>
          </div>
        </Link>
      </span>
    </>
  );
}
