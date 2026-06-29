import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Timetable — Examinations — MLRIT' };

const TIMETABLES = [
  {
    title: 'IV B.Tech II Sem — Regular & Supplementary',
    regulation: 'R22 / R25',
    period: 'April 2026',
    href: '/examinations/timetable-iv-btech-ii-sem-2026.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    current: true,
  },
  {
    title: 'I B.Tech I Sem — Supplementary',
    regulation: 'R25 / R22',
    period: 'June 2026',
    href: 'https://mlrit.ac.in/circulars/',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    current: true,
  },
  {
    title: 'I B.Tech II Sem — Regular & Supplementary',
    regulation: 'R25 / R22',
    period: 'June 2026',
    href: 'https://mlrit.ac.in/circulars/',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    current: true,
  },
  {
    title: 'II B.Tech I Sem — Supplementary',
    regulation: 'R22 / MLR20 / MLR18',
    period: 'June 2026',
    href: 'https://mlrit.ac.in/circulars/',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    current: false,
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function TimetablePage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Examination"
        italic="timetables."
        dek="Scheduled timetables for Regular, Supplementary and Advance Supplementary examinations across all programmes and regulations."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Examinations', href: '/examinations' }, { label: 'Timetable' }]}
        variant="green"
      />
      <ExaminationsQuickNav active="/examinations/timetable" />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Current</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Exam <span className="font-display italic font-medium" style={gradientText}>schedules.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid md:grid-cols-2 gap-5" delay={0.07}>
            {TIMETABLES.map((t) => (
              <StaggerItem key={t.title}>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-4 rounded-2xl border-2 border-border bg-white p-7 hover:border-secondary hover:-translate-y-1 transition-all h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[0.65rem] font-mono font-bold tracking-widest uppercase ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                    {t.current && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.6rem] font-bold tracking-wide uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] leading-snug group-hover:text-secondary transition-colors">
                      {t.title}
                    </h3>
                    <p className="mt-2 font-mono text-muted text-[0.72rem] tracking-wide uppercase">{t.regulation} · {t.period}</p>
                  </div>

                  <div className="mt-auto flex items-center gap-2 text-secondary font-semibold text-[0.82rem] group-hover:gap-3 transition-all">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M7 2v7M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download Timetable
                  </div>
                </a>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal preset="up" delay={0.3}>
            <div className="mt-8 p-5 rounded-xl border border-border bg-warm-light flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.88rem] leading-relaxed">
                For the most up-to-date timetables, please check{' '}
                <a href="https://mlrit.ac.in/circulars/" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline">
                  mlrit.ac.in/circulars
                </a>{' '}
                or the{' '}
                <a href="https://exams.mlrinstitutions.ac.in/" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline">
                  Exam Portal
                </a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
