'use client';

import { useEffect, useRef, useState } from 'react';

export type NavItem = { id: string; label: string };

export default function SideQuickNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const clicking = useRef(false);

  useEffect(() => {
    if (!items.length) return;

    const onScroll = () => {
      if (clicking.current) return;
      const mid = window.innerHeight * 0.35;
      let closest = items[0].id;
      let minDist = Infinity;
      items.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const dist = Math.abs(el.getBoundingClientRect().top - mid);
        if (dist < minDist) { minDist = dist; closest = id; }
      });
      setActive(closest);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    clicking.current = true;
    setActive(id);
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => { clicking.current = false; }, 800);
  };

  return (
    <div className="hidden lg:block sticky top-28 w-52 shrink-0 self-start">
      <p className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-primary mb-3">
        Quick Nav
      </p>
      <nav className="flex flex-col">
        {items.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`group flex items-center gap-3 text-left px-4 py-2.5 rounded-r-xl border-l-2 transition-all duration-200 ${
                isActive
                  ? 'border-primary bg-orange-50/60'
                  : 'border-transparent hover:border-border hover:bg-warm-light/60'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-200 ${
                  isActive ? 'bg-primary' : 'bg-border group-hover:bg-muted'
                }`}
              />
              <span
                className={`font-sans text-[0.88rem] leading-snug transition-colors duration-200 ${
                  isActive ? 'text-primary font-semibold' : 'text-muted group-hover:text-foreground'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
