
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import PageHeader from '@/components/PageHeader';
import PlacementsQuickNav from '@/components/PlacementsQuickNav';
import { MOUS } from '@/lib/placements';
import SideQuickNav from '@/components/SideQuickNav';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const coes = MOUS.filter((m) => m.type === 'Centre of Excellence');
const partners = MOUS.filter((m) => m.type === 'MoU Partner');

const NAV_ITEMS = [
  { id: 'mous', label: 'MoUs & Partnerships' },
];

export default function PlacementsMoUsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Placements"
        title="MoUs &"
        italic="partnerships."
        dek="Formal industry engagements and Centres of Excellence powering hands-on learning at MLRIT."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Placements', href: '/placements/overview' }, { label: 'MoUs & Partnerships' }]}
        variant="green"
      />
      <PlacementsQuickNav active="/placements/mous" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      {/* Centres of Excellence */}
      <section id="mous" className="bg-white py-14 md:py-20">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary mb-2 inline-block">On-Campus</span>
            <h2 className="font-sans font-black tracking-tighter-2 text-foreground text-[1.6rem] leading-tight mb-8">
              Centres of <span className="font-display italic font-medium" style={gradientText}>Excellence.</span>
            </h2>
          </Reveal>
          <Stagger className="grid md:grid-cols-2 gap-5" delay={0.07}>
            {coes.map((m) => (
              <StaggerItem key={m.name}>
                <div className="rounded-2xl border border-border bg-warm-light p-7 h-full hover:border-primary hover:-translate-y-1 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-sans font-extrabold text-foreground text-lg">{m.name}</h3>
                    <span className="shrink-0 font-mono text-[0.6rem] tracking-[0.14em] uppercase px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                      CoE
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed text-[0.95rem]">{m.domain}</p>
                  {m.package && (
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border font-mono text-[0.72rem] font-semibold tracking-wide text-foreground">
                      Package · {m.package}
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
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white font-mono text-[0.68rem] text-muted hover:text-foreground hover:border-primary transition-all"
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

      {/* MoU Partners */}
      <section className="bg-ink text-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55 mb-2 inline-block">Strategic</span>
            <h2 className="font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] mb-8">
              MoU <span className="font-display italic font-medium text-warm">Partners.</span>
            </h2>
          </Reveal>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.07}>
            {partners.map((m) => (
              <StaggerItem key={m.name}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 h-full hover:border-warm/40 hover:bg-white/[0.07] transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-sans font-extrabold text-white text-lg">{m.name}</h3>
                    <span className="shrink-0 font-mono text-[0.6rem] tracking-[0.14em] uppercase px-2 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-800/50">
                      MoU
                    </span>
                  </div>
                  <p className="text-white/60 leading-relaxed text-[0.92rem]">{m.domain}</p>
                  {m.docs && m.docs.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {m.docs.map((doc) => (
                        <a
                          key={doc.label}
                          href={doc.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] font-mono text-[0.68rem] text-white/50 hover:text-white hover:border-warm/50 transition-all"
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

        </div>
      </div>
    </>
  );
}
