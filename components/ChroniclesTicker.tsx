'use client';

import { useState } from 'react';

/**
 * Broadsheet ticker rail.
 *
 * WCAG 2.2.2 (Pause, Stop, Hide) requires a mechanism to pause any motion that
 * starts automatically and runs for more than five seconds, so the marquee ships
 * with a real toggle rather than hover-pause alone. `motion-reduce:animate-none`
 * covers users who have already asked the OS for less motion.
 */
export default function ChroniclesTicker({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  if (items.length === 0) return null;

  const line = items.join('  ·  ');

  return (
    <div className="border-b border-black/20 bg-black text-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center gap-3">
        <span className="font-mono font-bold uppercase tracking-[0.15em] text-[0.65rem] py-2 pr-3 border-r border-white/30 shrink-0">
          Latest
        </span>

        <div className="overflow-hidden flex-1 py-2">
          <div
            className={`animate-marquee motion-reduce:animate-none whitespace-nowrap font-display text-[0.85rem] tracking-wide ${
              paused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {line}{'  ·  '}{line}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? 'Resume scrolling headlines' : 'Pause scrolling headlines'}
          className="shrink-0 w-11 h-11 -mr-1 flex items-center justify-center text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
        >
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <path d="M2 1.5v9l8-4.5-8-4.5z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <rect x="2" y="1.5" width="3" height="9" />
              <rect x="7" y="1.5" width="3" height="9" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
