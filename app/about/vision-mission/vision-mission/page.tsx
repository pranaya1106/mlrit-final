import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import AboutQuickNav from '@/components/AboutQuickNav';
import Reveal from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Vision & Mission — MLRIT',
  description: 'The vision and mission of MLR Institute of Technology — academic excellence, research, innovation and producing graduates with human values and leadership qualities.',
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'vision',  label: 'Vision'      },
  { id: 'mission', label: 'Mission'     },
  { id: 'values',  label: 'Core Values' },
];

export default function VisionMissionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vision & Mission"
        title="What we"
        italic="stand for."
        dek="The guiding principles that shape every academic, research and institutional decision at MLRIT."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Vision & Mission' }]}
        variant="green"
      />
      <AboutQuickNav active="/about/vision-mission/vision-mission" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <section id="vision" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 space-y-10">

              {/* Vision */}
              <Reveal preset="right">
                <div className="rounded-2xl border-2 border-secondary bg-white p-10 md:p-12">
                  <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Vision</span>
                  <p className="mt-5 font-sans font-black text-foreground text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.25] tracking-tight max-w-[760px]">
                    Promote academic excellence, research, innovation, and entrepreneurial skills to produce graduates with human values and leadership qualities to serve the nation.
                  </p>
                </div>
              </Reveal>

            </div>
          </section>

          <section id="mission" className="bg-white pb-20 md:pb-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 space-y-10">

              {/* Mission */}
              <Reveal preset="up" delay={0.1}>
                <div className="rounded-2xl border border-border bg-warm-light p-10 md:p-12">
                  <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Mission</span>
                  <ul className="mt-6 space-y-5">
                    {[
                      'Provide student-centric education and training on cutting-edge technologies to make the students globally competitive and socially responsible citizens.',
                      'Create an environment to strengthen the research, innovation and entrepreneurship to solve societal problems.',
                      'Deliver an outcome-based curriculum aligned with industry and research demands.',
                      'Build a placement engine that prepares every student for global careers.',
                    ].map((m, i) => (
                      <li key={i} className="flex items-start gap-5">
                        <span className="shrink-0 w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center font-mono text-[0.72rem] font-bold text-secondary mt-0.5">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-foreground leading-relaxed text-[1.05rem]">{m}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

            </div>
          </section>

          <section id="values" className="bg-white pb-20 md:pb-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 space-y-10">

              {/* Core values strip */}
              <Reveal preset="up" delay={0.2}>
                <div className="rounded-2xl border border-border bg-white p-8">
                  <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-muted">Core Values</span>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {['Integrity', 'Inclusivity', 'Empathy', 'Excellence', 'Innovation', 'Learning for Life'].map((v) => (
                      <span key={v} className="px-5 py-2.5 rounded-full bg-warm-light border border-border font-sans font-semibold text-[0.95rem] text-foreground">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

            </div>
          </section>

        </div>
      </div>
    </>
  );
}
