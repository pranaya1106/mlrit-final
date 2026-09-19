'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_PRIMARY, NAV_RIGHT } from '@/lib/nav';
import { ChevronRight, Menu, X, ChevronDown } from './icons';
import { Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import ChroniclesAttentionButton from './ChroniclesAttentionButton';

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.42);
  const headerRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const isHome = pathname === '/';

  const closeMobileMenu = () => { setMobileOpen(false); setOpenMobileItem(null); };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
        setHidden(true);
      } else if (y < lastY - 4) {
        setHidden(false);
      }
      lastY = y;

      // Watermark fade — full at scrollY 0, gone by scrollY 400
      const t = Math.min(1, y / 400);
      setWatermarkOpacity(0.42 * (1 - t));
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
        className={`fixed inset-x-0 top-0 z-[1000] bg-paper/95 backdrop-blur-md transition-transform duration-300 ease-out-quart ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Decorative background artwork — same SVG as Hero + WhyMLRIT.
            Sits at low opacity so the nav links / logo / CTAs read
            cleanly on top; z-[0] keeps it behind everything. */}
        <img
          src="/vectors/whymlrit-background.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0] opacity-25"
        />

        {/* ── MLRIT brand watermark ───────────────────────────
            Big logo pinned to the top-left. Sits between the header's
            paper background and the nav content, extends below the
            header into the hero area, and fades out as the user scrolls
            past the hero. `overflow-visible` on the header lets it
            spill downward. */}
        <img
          src="/vectors/mlrit-logo-colorful.svg"
          alt=""
          aria-hidden
          className="absolute z-[0] pointer-events-none w-[170px] md:w-[220px] lg:w-[270px]"
          style={{
            top: '-24px',
            left: '-30px',
            opacity: watermarkOpacity,
            transition: 'opacity 0.2s linear',
            // Boost the natural brand colours — orange top-leaf, deep green
            // body, bright green edge — instead of desaturating them.
            filter: 'saturate(1.15)',
            WebkitMaskImage:
              'linear-gradient(180deg, #000 0%, #000 30%, rgba(0,0,0,0.4) 55%, transparent 78%)',
            maskImage:
              'linear-gradient(180deg, #000 0%, #000 30%, rgba(0,0,0,0.4) 55%, transparent 78%)',
          }}
          id="mlrit-brand-watermark"
        />

        {/* ── ROW 1 · MASTHEAD ────────────────────────────────
            Logo lockup on the left, serif institute name after a hair
            divider. Mobile shows the utility rail here instead. */}
        <div className="relative z-[1]">
          <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4 px-5 lg:px-10 pt-4 pb-4">
            <div className="flex items-center gap-5 lg:gap-6">
              <Link href="/" aria-label="MLRIT Home" className="flex-shrink-0">
                <img
                  src="/legacy/mlrit-logo-main.png"
                  alt="MLRIT Logo"
                  className="h-11 lg:h-14 w-auto"
                />
              </Link>

              {/* Institute name — Playfair serif, all caps, editorial letterspacing */}
              <div className="hidden md:flex items-center pl-5 lg:pl-6 border-l border-border/80">
                <span className="font-display text-[1rem] lg:text-[1.15rem] font-medium tracking-[0.08em] text-foreground/90 uppercase">
                  MLR Institute of Technology
                </span>
              </div>
            </div>

            {/* Mobile utility — search + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground hover:bg-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground hover:bg-white transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 2 · NAV RAIL ──────────────────────────────
            Primary nav on the left, Chronicles + Contact on the right.
            Each nav item carries a persistent hairline underline that
            intensifies to primary on hover. */}
        <div className="hidden lg:block relative z-[1]">
          <div className="mx-auto max-w-[1440px] flex items-end justify-between px-5 lg:px-10 pb-1">
            <nav
              aria-label="Main"
              className="inline-flex rounded-full px-2 border border-white/70 bg-white/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_14px_34px_-18px_rgba(24,20,15,0.22),inset_0_1px_0_rgba(255,255,255,0.75)]"
              style={{
                WebkitBackdropFilter: 'blur(28px) saturate(160%)',
                backdropFilter: 'blur(28px) saturate(160%)',
              }}
            >
              <ul className="flex items-stretch gap-1">
                {!isHome && (
                  <>
                    <li>
                      <Link
                        href="/"
                        aria-label="Home"
                        className="relative flex items-center justify-center h-[56px] px-3 text-foreground/60 hover:text-primary transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                          <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H13v-4H7v4H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </li>
                    <li className="self-center w-px h-4 bg-border/60 mx-1" aria-hidden />
                  </>
                )}
                {NAV_PRIMARY.map((item) => (
                  <li key={item.label} className="group relative">
                    {item.href && !item.cols ? (
                      <Link
                        href={item.href}
                        className="relative flex items-center h-[56px] px-4 whitespace-nowrap text-[1.02rem] font-medium text-foreground/80 hover:text-primary tracking-[-0.005em] transition-colors after:absolute after:left-4 after:right-4 after:bottom-2 after:h-px after:bg-transparent after:transition-all after:duration-300 after:ease-out-quart hover:after:bg-primary hover:after:h-[1.5px]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="relative flex items-center gap-1.5 h-[56px] px-4 whitespace-nowrap text-[1.02rem] font-medium text-foreground/80 hover:text-primary tracking-[-0.005em] transition-colors after:absolute after:left-4 after:right-4 after:bottom-2 after:h-px after:bg-transparent after:transition-all after:duration-300 after:ease-out-quart group-hover:after:bg-primary group-hover:after:h-[1.5px]"
                      >
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-50 transition-transform duration-200 group-hover:rotate-180 group-hover:opacity-100" />
                      </button>
                    )}
                    {item.cols && (
                      <div
                        className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-0 top-full mt-2 bg-white border border-border rounded-2xl shadow-[0_18px_48px_rgba(17,17,17,0.10)] p-6 grid gap-6 min-w-max max-w-[calc(100vw-2rem)] z-50"
                        style={{ gridTemplateColumns: `repeat(${item.cols.length}, minmax(${item.colMinWidth ?? 180}px, 1fr))` }}
                      >
                        {item.cols.map((col) => (
                          <div key={col.heading}>
                            <h4 className="editorial-eyebrow mb-3">
                              {col.heading}
                            </h4>
                            <ul className="space-y-0.5">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener' : undefined}
                                    className="block text-[0.9rem] font-medium text-foreground hover:text-primary hover:bg-orange-50/60 rounded-lg px-2 py-1.5 transition-colors"
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
              </ul>
            </nav>

            {/* Utility rail — right side: search, Chronicles, Contact */}
            <div className="flex items-end gap-4">
              <button
                id="search-trigger-btn"
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center justify-center w-10 h-10 mb-2 rounded-full text-muted hover:text-primary transition-colors"
                title="Search (Ctrl+K)"
                aria-label="Open search (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              <ChroniclesAttentionButton href={NAV_RIGHT.href ?? '/chronicles'} />

              {/* Contact — orange CTA pill */}
              <Link
                href="/admissions/support"
                style={{ backgroundColor: '#e85d04', color: '#ffffff', borderColor: '#e85d04' }}
                className="group inline-flex items-center gap-3 h-[56px] mb-[1px] pl-7 pr-6 rounded-full text-[1.05rem] font-semibold border hover:shadow-primary-glow hover:-translate-y-[1px] transition-all duration-300 ease-out-quart tracking-[-0.005em]"
              >
                Contact
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ─────────────────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-[1100] bg-black/45 transition-opacity duration-300 ease-out-quart ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
        aria-hidden={!mobileOpen}
      />
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-[1200] w-[86vw] max-w-[380px] bg-paper shadow-[-16px_0_48px_rgba(17,17,17,0.18)] flex flex-col transition-transform duration-300 ease-out-quart ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <span className="editorial-eyebrow">Menu</span>
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white transition-colors text-foreground border border-border"
          >
            <X className="w-4 h-4" />
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
                            <h4 className="editorial-eyebrow mb-1.5">
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
            className="flex items-center justify-center gap-2.5 h-12 rounded-full bg-ink text-white font-semibold text-[0.92rem] border border-ink hover:bg-ink-2 transition-all duration-300 ease-out-quart"
          >
            Contact the Institute
            <ChevronRight className="w-3.5 h-3.5 opacity-80" />
          </Link>
        </div>
      </div>
    </>
  );
}
