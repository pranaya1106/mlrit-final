'use client';

import { useEffect, useRef } from 'react';

import CodeHero          from './components/CodeHero';
import CodeQuote         from './components/CodeQuote';
import CodeAbout         from './components/CodeAbout';
import CodeHowItWorks    from './components/CodeHowItWorks';
import CodeEventsGallery from './components/CodeEventsGallery';
import CodeMemoryLane    from './components/CodeMemoryLane';
import CodeAtmosphere    from './components/CodeAtmosphere';
import CodeGlow          from './components/CodeGlow';

export default function CODEClubPage() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = 'auto'; };
  }, []);

  const pageRef       = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    // overflow-x:clip (not hidden) — preserves position:sticky for all children
    <div ref={pageRef} className="relative bg-[#060a06] text-white" style={{ overflowX: 'clip' }}>
      <CodeAtmosphere />
      <CodeGlow endRef={howItWorksRef} />

      <CodeHero />
      <CodeQuote />
      <CodeAbout />
      <CodeHowItWorks sectionRef={howItWorksRef} />
      <CodeEventsGallery />
      <CodeMemoryLane />
    </div>
  );
}
