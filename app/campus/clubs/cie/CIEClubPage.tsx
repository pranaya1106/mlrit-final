'use client';

import { useEffect, useRef } from 'react';

import CieAtmosphere        from './components/CieAtmosphere';
import CieGlow              from './components/CieGlow';
import CieHero              from './components/CieHero';
import CieQuote             from './components/CieQuote';
import CieAbout             from './components/CieAbout';
import CieHowItWorks        from './components/CieHowItWorks';
import CieCollectionGallery from './components/CieCollectionGallery';
import CieMemoryLane        from './components/CieMemoryLane';

export default function CIEClubPage() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = 'auto'; };
  }, []);

  const howItWorksRef = useRef<HTMLElement>(null);

  return (
    // overflow-x:clip (not hidden) — preserves position:sticky for all children
    <div className="relative bg-black text-white" style={{ overflowX: 'clip' }}>
      <CieAtmosphere />
      <CieGlow endRef={howItWorksRef} />

      <CieHero />
      <CieQuote />
      <CieAbout />
      <CieHowItWorks sectionRef={howItWorksRef} />
      <CieCollectionGallery />
      <CieMemoryLane />
    </div>
  );
}
