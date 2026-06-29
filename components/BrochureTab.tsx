'use client';

export default function BrochureTab() {
  return (
    <a
      href="/admissions/mlrit-brochure.pdf"
      download="MLRIT-Brochure-2025-26.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 group"
      aria-label="Download Brochure"
    >
      <div
        className="flex items-center justify-center font-sans font-bold text-white text-[0.78rem] tracking-[0.18em] uppercase transition-all duration-300 group-hover:pr-3"
        style={{
          background: '#01741f',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          padding: '14px 10px',
          borderRadius: '0 8px 8px 0',
          boxShadow: '-2px 0 12px rgba(1,116,31,0.25)',
          gap: '8px',
        }}
      >
        {/* Download icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{ transform: 'rotate(90deg)', marginBottom: '4px' }}
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
