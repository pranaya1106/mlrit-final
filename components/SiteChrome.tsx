'use client';

import { usePathname } from 'next/navigation';

import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';
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
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SmoothScroll />
      <Header />
      <main className="pt-[var(--header-h)]">{children}</main>
      <Footer />
      <SideButtons />
      <Chatbot />
    </>
  );
}
