
import Reveal from '@/components/motion/Reveal';
import { READINESS_MODULES, BRANCH_CURRICULA } from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function IndustryReadinessPage() {
  return (
    <>
      {/* Page intro */}
      <section className="bg-white pt-14 pb-4">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Industry Readiness</span>
            <h1 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Built for <span className="font-display italic font-medium" style={gradientText}>the industry.</span>
            </h1>
            <p className="mt-4 max-w-[700px] text-muted leading-relaxed">
              MLRIT&apos;s Training & Placement Cell runs a structured, year-round programme spanning aptitude, communication, domain skills,
              and professional readiness — ensuring every graduate is prepared to compete and succeed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Training programme modules */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <h2 className="font-sans font-black tracking-tighter-2 text-foreground text-[1.6rem] leading-tight mb-8">
              Preparation <span className="font-display italic font-medium" style={gradientText}>areas.</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {READINESS_MODULES.map((mod, i) => (
              <Reveal key={mod.id} preset="up" delay={i * 0.05}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-warm-light p-6 h-full">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[0.78rem] font-bold flex items-center justify-center" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-sans font-bold text-foreground text-[1rem] mb-1">{mod.title}</h3>
                    <p className="text-muted text-[0.92rem] leading-relaxed">{mod.description}</p>
                    {mod.items && (
                      <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${mod.title} outcomes`}>
                        {mod.items.map((item) => (
                          <li key={item} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 font-mono text-[0.68rem] text-primary tracking-wide">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Branch-wise curriculum */}
      <section className="bg-ink text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Curriculum</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Branch-wise <span className="font-display italic font-medium text-warm">training.</span>
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-col gap-4">
            {BRANCH_CURRICULA.map((b, i) => (
              <Reveal key={b.branch} preset="up" delay={i * 0.06}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:border-warm/30 transition-all">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0">
                      <span className="inline-block font-mono text-[0.7rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-warm/10 text-warm border border-warm/20">
                        {b.branch}
                      </span>
                    </div>
                    <p className="text-white/65 text-[0.92rem] leading-relaxed">{b.curriculum}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
