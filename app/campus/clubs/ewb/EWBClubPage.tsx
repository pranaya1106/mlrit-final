'use client';

import { useEffect, useRef } from 'react';

import EwbHero          from './components/EwbHero';
import EwbQuote         from './components/EwbQuote';
import EwbAbout         from './components/EwbAbout';
import EwbHowItWorks    from './components/EwbHowItWorks';
import EwbEventsGallery from './components/EwbEventsGallery';
import EwbMemoryLane    from './components/EwbMemoryLane';
import EwbAtmosphere    from './components/EwbAtmosphere';
import EwbGlow          from './components/EwbGlow';

export default function EWBClubPage() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = 'auto'; };
  }, []);

  const pageRef       = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    // overflow-x:clip (not hidden) — preserves position:sticky for all children
    <div ref={pageRef} className="relative bg-[#070907] text-white" style={{ overflowX: 'clip' }}>
      <EwbAtmosphere />
      <EwbGlow endRef={howItWorksRef} />

      <EwbHero />
      <EwbQuote />
      <EwbAbout />
      <EwbHowItWorks sectionRef={howItWorksRef} />
      <EwbEventsGallery />
      <EwbMemoryLane />
    </div>
  );
}
