'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import Chatbot from '@/components/Chatbot';
import Footer, { type FooterContent } from '@/components/Footer';
import Header from '@/components/Header';
import SideButtons from '@/components/SideButtons';
import SmoothScroll from '@/components/SmoothScroll';

/**
 * Site chrome — header, footer, floating buttons, chatbot — around every page
 * except the admin.
 *
 * The admin is a full-height two-pane editor: a fixed form beside an iframe of
 * the real site. Rendering the public header above it pushed that h-screen
 * layout below the fold, so the whole window scrolled and neither pane kept
 * its own scroll position. The chatbot and side buttons also floated over the
 * form. None of it belongs there — the preview iframe loads the real site and
 * brings its own chrome, which is the copy an editor actually wants to see.
 *
 * `children` is passed through as a prop, so pages stay server components and
 * keep their static rendering; only this wrapper ships to the client, and it
 * only reads the pathname.
 */
export default function SiteChrome({
  children,
  footer = {},
}: {
  children: React.ReactNode;
  footer?: FooterContent;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  if (isAdmin) return <>{children}</>;

  const isHome = pathname === '/';

  return (
    <>
      <SmoothScroll />
      <Header />
      <main className="pt-[var(--header-h)]">{children}</main>
      <Footer {...footer} />
      <SideButtons />
      <Chatbot />
      {!isHome && (
        <Link
          href="/"
          aria-label="Go to homepage"
          className="fixed bottom-6 left-6 z-[900] flex items-center justify-center w-10 h-10 rounded-full bg-white border border-border shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-foreground hover:bg-cream hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)] transition-all duration-200 hover:-translate-y-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H13v-4H7v4H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </Link>
      )}
    </>
  );
}
