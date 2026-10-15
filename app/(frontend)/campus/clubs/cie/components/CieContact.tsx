'use client';

/** CIE — closing / get involved finale. */

import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import { Reveal, Eyebrow, MagneticButton } from './cieShared';

export default function CieContact() {
  return (
    <section id="join" className="relative bg-black text-white py-24 md:py-40 overflow-hidden border-t border-white/[0.08]">
      {/* Kinetic ghost word */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-8 overflow-hidden select-none"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
          maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <div className="flex w-max gap-10 cie-join-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-sans font-black tracking-tighter-3 whitespace-nowrap text-white/[0.045] leading-none text-[clamp(4rem,13vw,12rem)]">
              JOIN CIE · BUILD · SHIP ·
            </span>
          ))}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]" style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(232,93,4,0.16) 0%, transparent 70%)' }} />

      <div className="relative z-[1] max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-[780px]">
          <Reveal><Eyebrow>Get involved</Eyebrow></Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 font-sans font-black tracking-tighter-3 leading-[0.95] text-white text-[clamp(2.8rem,7vw,6rem)]">
              Your next idea<br />
              <span className="text-primary">starts here.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-white/65 leading-[1.75] text-[1.05rem] max-w-[52ch]">
              Any branch, any year. Walk in during club hours, or reach out on any channel below.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton href="https://mlritcie.in" external primary>
                Visit mlritcie.in
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
              <a
                href="mailto:ciemlrit@mlrit.ac.in"
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.12] hover:border-white/30 transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                Email us
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 border-t border-white/10 pt-10 grid md:grid-cols-3 gap-y-8 gap-x-10">
            <div>
              <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/45 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Address
              </div>
              <div className="mt-2 text-white/85 text-[0.95rem] leading-snug">MLRIT, Dundigal,<br />Hyderabad, Telangana 500043</div>
            </div>
            <div>
              <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/45">Email</div>
              <div className="mt-2 space-y-1">
                <a href="mailto:ciemlrit@mlrit.ac.in" className="block text-white/85 hover:text-primary text-[0.95rem] transition-colors">ciemlrit@mlrit.ac.in</a>
                <a href="mailto:cie@mlrinstitutions.ac.in" className="block text-white/85 hover:text-primary text-[0.95rem] transition-colors">cie@mlrinstitutions.ac.in</a>
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-white/45">Follow</div>
              <div className="mt-3 flex items-center gap-2">
                {[
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Linkedin, label: 'LinkedIn' },
                  { Icon: Youtube, label: 'YouTube' },
                  { Icon: Twitter, label: 'X' },
                ].map(({ Icon, label }) => (
                  <a key={label} href="https://mlritcie.in" target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 rounded-full border border-white/15 text-white/70 grid place-items-center hover:text-primary hover:border-primary/40 transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        .cie-join-marquee { animation: cie-join-scroll 48s linear infinite; }
        @keyframes cie-join-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .cie-join-marquee { animation: none; } }
      `}</style>
    </section>
  );
}
