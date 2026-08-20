
import Reveal from '@/components/motion/Reveal';
import PageHeader from '@/components/PageHeader';
import PlacementsQuickNav from '@/components/PlacementsQuickNav';
import { READINESS_MODULES, BRANCH_CURRICULA } from '@/lib/placements';
import SideQuickNav from '@/components/SideQuickNav';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'industry-readiness', label: 'Industry Readiness' },
];

export default function IndustryReadinessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Placements"
        title="Industry"
        italic="readiness."
        dek="The training pipeline that takes first-years to placement-ready seniors — aptitude, communication, and domain expertise."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Placements', href: '/placements/overview' }, { label: 'Industry Readiness' }]}
        variant="green"
      />
      <PlacementsQuickNav active="/placements/industry-readiness" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      {/* Training programme modules */}
      <section id="industry-readiness" className="bg-white py-14 md:py-20">
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

        </div>
      </div>
    </>
  );
}
