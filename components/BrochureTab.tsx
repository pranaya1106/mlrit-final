'use client';

export default function BrochureTab() {
  return (
    <a
      href="/admissions/mlrit-brochure.pdf"
      download="MLRIT-Brochure-2025-26.pdf"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Brochure"
      className="group"
    >
      <div
        className="flex items-center justify-center font-sans font-bold text-white text-[0.68rem] tracking-[0.16em] uppercase"
        style={{
          background: '#01741f',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          padding: '12px 8px',
          borderRadius: '0 6px 6px 0',
          boxShadow: '-2px 0 10px rgba(1,116,31,0.22)',
          gap: '6px',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          style={{ transform: 'rotate(90deg)', marginBottom: '3px' }}
          aria-hidden
        >
          <path
            d="M7 2v7M4 7l3 3 3-3M2 12h10"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Brochure
      </div>
    </a>
  );
}
