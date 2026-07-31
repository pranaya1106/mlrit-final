'use client';

import { useEffect, useState } from 'react';

// Same direction-detection logic as Header.tsx's own hide-on-scroll — hidden
// while scrolling down past the top, shown again on scroll-up or near the top.
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (y < 140) {
        setHidden(false);
      } else if (y > lastY + 4) {
        setHidden(true); // scrolling down
      } else if (y < lastY - 4) {
        setHidden(false); // scrolling up
      }
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return hidden;
}
