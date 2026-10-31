'use client';

import Image from 'next/image';
import Link from 'next/link';

/* Dark photo band → cream. Breadcrumb pill, ruled eyebrow, plain statement
   heading and one dek; the route explorer starts immediately below it. */
export default function TransportHero() {
  return (
    <section
      aria-label="Transport"
      className="relative overflow-hidden bg-ink flex flex-col"
      style={{ minHeight: 'clamp(440px, 56vh, 600px)' }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/campus/transport/bus-route-3.jpg"
          alt=""
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '40% 55%', filter: 'brightness(0.5) saturate(0.85)' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(12,12,14,0.86) 0%, rgba(12,12,14,0.55) 52%, rgba(12,12,14,0.30) 100%)',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12 pt-8 md:pt-14 pb-24 md:pb-32">
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-2 rounded-full font-mono uppercase"
          style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
            padding: '7px 14px', fontSize: '0.62rem', letterSpacing: '0.16em',
          }}
        >
          <Link href="/" className="text-white/55 hover:text-white transition-colors">Home</Link>
          <span className="text-white/25" aria-hidden="true">›</span>
          <span className="text-white/55">Campus</span>
          <span className="text-white/25" aria-hidden="true">›</span>
          <span className="text-white">Transport</span>
        </nav>

        <div className="mt-8 md:mt-12 flex items-center gap-4">
          <span className="h-px flex-shrink-0" style={{ width: 34, background: 'rgba(255,255,255,0.35)' }} aria-hidden="true" />
          <p className="font-mono uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.72)' }}>
            Campus Transport
          </p>
          <span className="h-px flex-1 max-w-[70px]" style={{ background: 'rgba(255,255,255,0.18)' }} aria-hidden="true" />
        </div>

        <h1
          className="mt-4 font-sans font-black text-white"
          style={{ fontSize: 'clamp(2.4rem, 5.4vw, 4rem)', lineHeight: 1.04, letterSpacing: '-0.035em' }}
        >
          College Bus Routes
        </h1>

        <p className="mt-4 max-w-[560px] font-sans text-white/75 leading-relaxed" style={{ fontSize: '1rem' }}>
          27 college bus routes connect Hyderabad, Secunderabad and Sangareddy to the campus at
          Dundigal. Find the bus that passes your area, preview its path on the map and call the
          route incharge directly.
        </p>
      </div>

      {/* Curve into the cream section */}
      <div aria-hidden="true" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0, zIndex: 10 }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', height: 70 }}>
          <path d="M0,70 L0,44 C360,4 1080,4 1440,44 L1440,70 Z" fill="#faf7f0" />
        </svg>
      </div>
    </section>
  );
}
