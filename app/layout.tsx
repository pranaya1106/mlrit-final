import type { Metadata } from 'next';
import { Manrope, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <SmoothScroll />
        <Header />
        <main className="pt-[var(--header-h)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
