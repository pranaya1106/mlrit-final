'use client';

import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { RECRUITER_LOGOS, RECRUITERS, MOUS } from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function PlacementsRecruitersPage() {
  return (
    <>
      {/* Recruiters */}
      <section className="bg-ink-2 text-white py-10 md:py-14 overflow-hidden">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Our Recruiters</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Top Hiring <span className="font-display italic font-medium text-warm">Partners.</span>
            </h2>
            <p className="mt-4 text-white/55 max-w-[680px]">
              Leading organisations across IT, product, consulting, and core engineering sectors recruit regularly from MLRIT.
            </p>
          </Reveal>
        </div>

        {/* Marquee */}
        <div className="relative mt-10 overflow-hidden mask-fade">
          <div className="flex gap-8 animate-marquee w-max">
            {[...RECRUITER_LOGOS, ...RECRUITER_LOGOS].map((l, i) => (
              <div key={i} className="flex-shrink-0 h-24 w-44 grid place-items-center rounded-xl bg-white/[0.04] border border-white/10 px-5 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={l.alt} className="max-w-full max-h-full object-contain opacity-90" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Names cloud */}
        <div className="w-full px-6 md:px-10 lg:px-12 mt-10">
          <Stagger className="flex flex-wrap gap-2" delay={0.025}>
            {RECRUITERS.map((n) => (
              <StaggerItem key={n}>
                <span className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[0.72rem] tracking-[0.06em] text-white/80">
                  {n}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <style jsx>{`
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 38s linear infinite; }
          .mask-fade {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
                    mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
          }
        `}</style>
      </section>

      {/* MoUs */}
      <section className="bg-cream py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Industry Partnerships</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              MoUs and <span className="font-display italic font-medium" style={gradientText}>Centres of Excellence.</span>
            </h2>
            <p className="mt-4 max-w-[720px] text-muted leading-relaxed">
              Formal partnerships and Centres of Excellence with leading industry organisations — providing students with advanced domain training and direct placement pathways.
            </p>
          </Reveal>
          <Stagger className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.08}>
            {MOUS.map((m) => (
              <StaggerItem key={m.name}>
                <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-sans font-extrabold text-foreground text-lg">{m.name}</div>
                    <span className={`shrink-0 font-mono text-[0.6rem] tracking-[0.14em] uppercase px-2 py-1 rounded-full ${
                      m.type === 'Centre of Excellence'
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-green-50 text-secondary border border-green-200'
                    }`}>
                      {m.type}
                    </span>
                  </div>
                  <p className="mt-3 text-muted leading-relaxed text-[0.95rem]">{m.domain}</p>
                  {m.package && (
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-light border border-border font-mono text-[0.72rem] font-semibold tracking-wide text-foreground">
                      Pkg · {m.package}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
