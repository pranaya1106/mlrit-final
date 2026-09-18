import type { Metadata } from 'next';
import { Manrope, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import type { FooterContent } from '@/components/Footer';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MLRIT — Marri Laxman Reddy Institute of Technology',
  description:
    'MLR Institute of Technology — premier engineering institution in Dundigal, Hyderabad. B.Tech, M.Tech, MBA programmes with industry-integrated curriculum.',
  metadataBase: new URL('https://mlrit-final.vercel.app'),
  openGraph: {
    title: 'MLRIT — Marri Laxman Reddy Institute of Technology',
    description:
      'Engineering the future. 20+ years of excellence, 11K+ students, 98% placement rate.',
    url: 'https://mlrit-final.vercel.app',
    siteName: 'MLRIT',
    locale: 'en_IN',
    type: 'website',
  },
};

/**
 * Footer copy for every page. Fetched here because the footer is global.
 *
 * Failure is silent by design: a missing env var, a network blip or no row at
 * all returns {}, and the footer renders the values baked into the component.
 * The layout must never be the reason a page fails to build.
 */
async function getFooterContent(): Promise<FooterContent> {
  try {
    const { getSection } = await import('@/lib/content/client');
    const row = await getSection('site', 'footer');
    return (row?.content ?? {}) as FooterContent;
  } catch {
    return {};
  }
}

// Matches the homepage window, so an edited footer goes live on the same
// cadence as edited section copy rather than waiting for a redeploy.
export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const footer = await getFooterContent();

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-paper text-foreground font-sans antialiased">
        <SiteChrome footer={footer}>{children}</SiteChrome>
      </body>
    </html>
  );
}
