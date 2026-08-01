'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV_PRIMARY, NAV_RIGHT } from '@/lib/nav';
import { ChevronRight, Menu, X, ChevronDown } from './icons';

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const closeMobileMenu = () => { setMobileOpen(false); setOpenMobileItem(null); };

  // Close the drawer if the viewport crosses back into desktop (e.g. devtools
  // resize) so it can't get stuck open with body scroll locked.
  useEffect(() => {
    if (!mobileOpen) return;
    const onResize = () => { if (window.innerWidth >= 1024) closeMobileMenu(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMobileMenu(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Keep --header-h in sync with the header's real rendered height (the
  // badge row can wrap to a second line at some widths) so the sticky
  // sub-nav bars and main's padding never drift out of sync with it.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setHeight = () => {
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
    };
    setHeight();

    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  useEffect(() => {
    document.documentElement.setAttribute('data-header-hidden', String(hidden));
  }, [hidden]);

  return (
    <>
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-[1000] bg-white border-b border-border transition-transform duration-300 ease-out-quart ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* MASTHEAD */}
      <div className="bg-white">
        <div className="flex items-center justify-between lg:justify-start gap-3 lg:gap-7 px-4 lg:px-7 py-3 min-h-[64px] lg:min-h-[78px]">
          {/* Logo */}
          <Link href="/" aria-label="MLRIT Home" className="flex-shrink-0">
            <img
              src="/legacy/mlrit-logo-main.png"
              alt="MLRIT Logo"
              className="h-10 lg:h-14 w-auto"
            />
          </Link>

          {/* Institute block — desktop/tablet only; logo alone carries branding on mobile */}
          <div className="hidden lg:flex flex-col items-start pl-6 border-l border-[#e5e2db]">
            <div className="font-extrabold text-[1.02rem] text-foreground tracking-wide">
              M<span className="text-primary mx-0.5 font-black">·</span>L
              <span className="text-primary mx-0.5 font-black">·</span>R
            </div>
            <div className="font-display italic text-[0.86rem] text-neutral-800 mt-1">
              Institute of Technology
            </div>
            <div className="w-8 h-0.5 bg-primary rounded my-1.5" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                <span className="font-mono font-bold text-[0.56rem] tracking-[0.14em] uppercase text-primary">EST · 2005</span>
              </span>
              <span className="font-mono font-bold text-[0.56rem] tracking-[0.12em] uppercase text-neutral-500">DUNDIGAL · HYDERABAD</span>
              <span className="font-mono font-bold text-[0.56rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full border border-[#f0d28e] text-[#a07820] bg-[#fffbf0]">AUTONOMOUS · UGC &apos;15</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block flex-1 min-w-3" />

          {/* Contact CTA — desktop/tablet only; folded into the drawer on mobile */}
          <Link
            href="/admissions/support"
            className="hidden lg:inline-flex flex-shrink-0 items-center gap-2.5 h-10 pl-3 pr-5 rounded-[10px] bg-primary text-white font-semibold text-[0.86rem] border border-primary transition-all duration-300 ease-out-quart hover:bg-primary-hover hover:shadow-primary-glow hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-md bg-white/20">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            Contact Us
          </Link>

          {/* Hamburger — mobile/tablet only */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border text-foreground hover:bg-neutral-50 transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MAIN NAV (green) — desktop only; collapses into the hamburger drawer below lg */}
      <nav className="hidden lg:block bg-green-nav text-white shadow-[0_4px_16px_rgba(1,116,31,0.18)]" aria-label="Main">
        <ul className="flex items-stretch px-6">
          {NAV_PRIMARY.map((item) => (
            <li key={item.label} className="group relative flex-shrink-0">
              {item.href && !item.cols ? (
                <Link
                  href={item.href}
                  className="flex items-center h-[52px] px-3 text-[0.92rem] font-medium tracking-[-0.005em] hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-1 h-[52px] px-3 text-[0.92rem] font-medium tracking-[-0.005em] hover:bg-white/10 transition-colors"
                >
                  {item.label}
                  <span className="inline-block w-1.5 h-1.5 border-r border-b border-white/70 -rotate-45 translate-y-[-2px] ml-0.5" />
                </button>
              )}
              {/* Dropdown */}
              {item.cols && (
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full mt-1.5 bg-white border border-border rounded-2xl shadow-[0_18px_48px_rgba(17,17,17,0.10)] p-6 grid gap-6 min-w-max max-w-[calc(100vw-2rem)] z-50"
                     style={{ gridTemplateColumns: `repeat(${item.cols.length}, minmax(${item.colMinWidth ?? 180}px, 1fr))` }}>
                  {item.cols.map((col) => (
                    <div key={col.heading}>
                      <h4 className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted mb-3">
                        {col.heading}
                      </h4>
                      <ul className="space-y-1.5">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              target={link.external ? '_blank' : undefined}
                              rel={link.external ? 'noopener' : undefined}
                              className="block text-[0.92rem] font-medium text-foreground hover:text-primary hover:bg-orange-50 rounded-lg px-2 py-1.5 transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
          {/* Right item — pushed to the right edge */}
          <li className="ml-auto flex-shrink-0">
            <Link
              href={NAV_RIGHT.href ?? '#'}
              className="flex items-center h-[52px] px-3 text-[0.92rem] font-medium tracking-[-0.005em] whitespace-nowrap hover:bg-white/10 transition-colors"
            >
              {NAV_RIGHT.label}
            </Link>
          </li>
        </ul>
      </nav>
    </header>

    {/* MOBILE / TABLET DRAWER — collapses the green nav below lg.
        Rendered as a sibling of <header>, not a descendant: the header's
        translate-y transform (for hide-on-scroll) creates a containing
        block for `position: fixed` children, which would otherwise trap
        this drawer inside the header's own ~70px box instead of the
        viewport. */}
      <div
        className={`lg:hidden fixed inset-0 z-[1100] bg-black/45 transition-opacity duration-300 ease-out-quart ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
        aria-hidden={!mobileOpen}
      />
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-[1200] w-[86vw] max-w-[380px] bg-white shadow-[-16px_0_48px_rgba(17,17,17,0.18)] flex flex-col transition-transform duration-300 ease-out-quart ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <span className="font-sans font-extrabold text-[1rem] text-foreground tracking-wide">Menu</span>
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-neutral-50 transition-colors text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Mobile main">
          <ul>
            {NAV_PRIMARY.map((item) => (
              <li key={item.label} className="border-b border-border/60 last:border-0">
                {item.href && !item.cols ? (
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center min-h-[52px] px-3 text-[0.95rem] font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenMobileItem((cur) => (cur === item.label ? null : item.label))}
                      aria-expanded={openMobileItem === item.label}
                      className="w-full flex items-center justify-between min-h-[52px] px-3 text-[0.95rem] font-semibold text-foreground"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 text-muted transition-transform duration-200 ${
                          openMobileItem === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{ maxHeight: openMobileItem === item.label ? '600px' : '0px' }}
                    >
                      <div className="pb-3 pl-3 pr-2 grid gap-4">
                        {item.cols?.map((col) => (
                          <div key={col.heading}>
                            <h4 className="font-mono text-[0.66rem] font-bold tracking-[0.16em] uppercase text-muted mb-1.5">
                              {col.heading}
                            </h4>
                            <ul className="space-y-0.5">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener' : undefined}
                                    onClick={closeMobileMenu}
                                    className="flex items-center min-h-[44px] text-[0.9rem] font-medium text-foreground hover:text-primary transition-colors"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
            <li className="border-b border-border/60">
              <Link
                href={NAV_RIGHT.href ?? '#'}
                onClick={closeMobileMenu}
                className="flex items-center min-h-[52px] px-3 text-[0.95rem] font-semibold text-foreground hover:text-primary transition-colors"
              >
                {NAV_RIGHT.label}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-border">
          <Link
            href="/admissions/support"
            onClick={closeMobileMenu}
            className="flex items-center justify-center gap-2.5 h-12 rounded-[10px] bg-primary text-white font-semibold text-[0.92rem] border border-primary transition-all duration-300 ease-out-quart hover:bg-primary-hover"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/20">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
