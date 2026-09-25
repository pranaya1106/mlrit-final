'use client';

import { useEffect, useRef } from 'react';

import CameHero          from './components/CameHero';
import CameQuote         from './components/CameQuote';
import CameAbout         from './components/CameAbout';
import CameHowItWorks    from './components/CameHowItWorks';
import CameEventsGallery from './components/CameEventsGallery';
import CameMemoryLane    from './components/CameMemoryLane';
import CameAtmosphere    from './components/CameAtmosphere';
import CameGlow          from './components/CameGlow';

export default function CAMEClubPage() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = 'auto'; };
  }, []);

  const pageRef       = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    // overflow-x:clip (not hidden) — preserves position:sticky for all children
    <div ref={pageRef} className="relative bg-[#0a0705] text-white" style={{ overflowX: 'clip' }}>
      <CameAtmosphere />
      <CameGlow endRef={howItWorksRef} />

      <CameHero />
      <CameQuote />
      <CameAbout />
      <CameHowItWorks sectionRef={howItWorksRef} />
      <CameEventsGallery />
      <CameMemoryLane />
    </div>
  );
}
