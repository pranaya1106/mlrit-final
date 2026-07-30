
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { READINESS_MODULES, BRANCH_CURRICULA, MOUS } from '@/lib/placements';

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
        <div className="w-full px-6 md:px-10 lg:px-12">
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
        <div className="w-full px-6 md:px-10 lg:px-12">
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
      <section className="bg-ink text-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
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

      {/* Industry Partners */}
      <section className="bg-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Partners</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Centres of Excellence &amp; <span className="font-display italic font-medium" style={gradientText}>MoU partners.</span>
            </h2>
            <p className="mt-4 max-w-[720px] text-muted leading-relaxed">
              Formal partnerships and on-campus Centres of Excellence provide advanced domain training and direct placement pathways.
            </p>
          </Reveal>
          <Stagger className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.08}>
            {MOUS.map((m) => (
              <StaggerItem key={m.name}>
                <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all shadow-card-soft">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="font-sans font-extrabold text-foreground text-lg">{m.name}</div>
                    <span className={`shrink-0 font-mono text-[0.6rem] tracking-[0.14em] uppercase px-2 py-1 rounded-full ${
                      m.type === 'Centre of Excellence'
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-green-50 text-secondary border border-green-200'
                    }`}>
                      {m.type}
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed text-[0.95rem]">{m.domain}</p>
                  {m.package && (
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-light border border-border font-mono text-[0.72rem] font-semibold tracking-wide text-foreground">
                      Pkg · {m.package}
                    </div>
                  )}
                  {m.docs && m.docs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.docs.map((doc) => (
                        <a
                          key={doc.label}
                          href={doc.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-warm-light font-mono text-[0.68rem] text-muted hover:text-foreground hover:border-primary transition-all"
                          aria-label={`${doc.label} — opens PDF`}
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2 1h6l2 2v8H2V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                            <path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                          </svg>
                          {doc.label}
                        </a>
                      ))}
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
