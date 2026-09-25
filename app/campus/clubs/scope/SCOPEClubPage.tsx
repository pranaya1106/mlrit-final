'use client';

import { useEffect, useRef } from 'react';

import ScopeHero          from './components/ScopeHero';
import ScopeQuote         from './components/ScopeQuote';
import ScopeAbout         from './components/ScopeAbout';
import ScopeHowItWorks    from './components/ScopeHowItWorks';
import ScopeEventsGallery from './components/ScopeEventsGallery';
import ScopeMemoryLane    from './components/ScopeMemoryLane';
import ScopeBuiltTool     from './components/ScopeBuiltTool';
import ScopeAtmosphere    from './components/ScopeAtmosphere';
import ScopeGlow          from './components/ScopeGlow';

export default function SCOPEClubPage() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = 'auto'; };
  }, []);

  const pageRef       = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    // overflow-x:clip (not hidden) — preserves position:sticky for all children
    <div ref={pageRef} className="relative bg-[#07090b] text-white" style={{ overflowX: 'clip' }}>
      <ScopeAtmosphere />
      <ScopeGlow endRef={howItWorksRef} />

      <ScopeHero />
      <ScopeQuote />
      <ScopeAbout />
      <ScopeHowItWorks sectionRef={howItWorksRef} />
      <ScopeEventsGallery />
      <ScopeMemoryLane />
      <ScopeBuiltTool />
    </div>
  );
}
