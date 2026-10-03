'use client';

// Ambient atmosphere layer for CIE — a subtle warm radial bloom fixed behind
// all content. Matches the APEX/CAME Atmosphere pattern.
export default function CieAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,93,4,0.09) 0%, transparent 70%)',
      }}
    />
  );
}
