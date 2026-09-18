'use client';

import Link from 'next/link';

export default function ChroniclesAttentionButton({ href }: { href: string }) {
  return (
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
  );
}
