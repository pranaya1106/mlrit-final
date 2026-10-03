'use client';

// Ambient atmosphere layer for Robotics Club — subtle green radial bloom.
export default function RoboticsAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16,185,129,0.07) 0%, transparent 70%)',
      }}
    />
  );
}
