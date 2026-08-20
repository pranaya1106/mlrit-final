import type { Metadata } from 'next';
import ExaminationsHero from '@/components/ExaminationsHero';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import DocActions from '@/components/examinations/DocActions';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Internal (CIE) Timetable — Examinations — MLRIT' };

type Timetable = {
  title: string;
  regulation: string;
  period: string;
  file: string;
  badge: string;
  badgeColor: string;
  current?: boolean;
};

const CIE_TIMETABLES: Timetable[] = [
  {
    title: 'I M.Tech. II Sem — CIE II (Mid-term)',
    regulation: 'R25',
    period: 'July 2026',
    file: 'I-M.Tech.-II-Semester-R25-CIE-II-Examinations-July-2026-Timetable.pdf',
    badge: 'M.Tech',
    badgeColor: 'bg-blue-50 border-blue-200 text-blue-700',
    current: true,
  },
  {
    title: 'I MBA II Sem — CIE II (Mid-term)',
    regulation: 'R25',
    period: 'July 2026',
    file: 'I-MBA-II-Semester-R25-CIE-II-Examinations-July-2026-Timetable.pdf',
    badge: 'MBA',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    current: true,
  },
  {
    title: 'Ph.D. Course Work — MID II',
    regulation: 'R25',
    period: 'July 2026',
    file: 'Ph.D.-Course-Work-R25-MID-II-Examinations-July-2026-Timetable.pdf',
    badge: 'Ph.D.',
    badgeColor: 'bg-purple-50 border-purple-200 text-purple-700',
    current: true,
  },
  {
    title: 'II MBA II Sem — CIE 2 (Mid-term)',
    regulation: 'R22',
    period: 'June 2026',
    file: 'II-MBA-II-Semester-CIE-2-Examinations-June-2026-Timetable.pdf',
    badge: 'MBA',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
  },
  {
    title: 'II B.Tech. II Sem — MID 2',
    regulation: 'R22',
    period: 'April 2026',
    file: 'II-B.Tech.-II-Sem.-R22-MID-2-Examinations-April-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'timetable-internal', label: 'Timetable (Internal)' },
];

export default function InternalTimetablePage() {
  return (
    <>
      <ExaminationsHero
        title="Internal (CIE)"
        italic="Timetables."
        dek="Continuous Internal Evaluation (CIE) mid-term and unit test schedules for all programmes and regulations."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Timetables', href: '/examinations/timetable/internal' },
          { label: 'Internal' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/timetable/internal" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      {/* Internal / External pill toggle */}
      <div className="bg-white border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-12 py-3">
          <div className="inline-flex items-center rounded-full bg-warm-light border border-border p-1 gap-1">
            <a
              href="/examinations/timetable/internal"
              aria-current="page"
              className="px-5 py-2 rounded-full font-sans font-bold text-[0.82rem] bg-primary text-white shadow-card-soft transition-all duration-200"
            >
              Internal (CIE)
            </a>
            <a
              href="/examinations/timetable/external"
              className="px-5 py-2 rounded-full font-sans font-bold text-[0.82rem] text-muted hover:text-foreground transition-all duration-200"
            >
              External (SEE)
            </a>
          </div>
        </div>
      </div>

      <section id="timetable-internal" className="bg-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              Continuous Internal Evaluation · {CIE_TIMETABLES.length} Timetables
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              CIE <span className="font-display italic font-medium" style={gradientText}>schedules.</span>
            </h2>
            <p className="mt-3 text-muted text-[0.93rem] max-w-[620px] leading-relaxed">
              Mid-term and unit test timetables published by the COE. Use View to open in-browser or Download to save a copy.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid md:grid-cols-2 gap-5" delay={0.05}>
            {CIE_TIMETABLES.map((t) => (
              <StaggerItem key={t.file}>
                <div className="group flex flex-col gap-4 rounded-2xl border-2 border-border bg-white p-7 hover:border-primary hover:-translate-y-0.5 transition-all h-full">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[0.65rem] font-mono font-bold tracking-widest uppercase ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                    {t.current && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[0.6rem] font-bold tracking-wide uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] leading-snug group-hover:text-primary transition-colors">
                      {t.title}
                    </h3>
                    <p className="mt-2 font-mono text-muted text-[0.72rem] tracking-wide uppercase">{t.regulation} · {t.period}</p>
                  </div>
                  <DocActions
                    href={`/examinations/timetables/${encodeURIComponent(t.file)}`}
                    filename={t.file}
                    viewLabel="View PDF"
                    downloadLabel="Download"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal preset="up" delay={0.3}>
            <div className="mt-8 p-5 rounded-xl border border-border bg-warm-light flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.85rem] leading-relaxed">
                For CIE-related queries, contact your department&apos;s academic coordinator or the{' '}
                <a href="/examinations/contact" className="text-secondary font-semibold hover:underline">
                  COE office
                </a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

        </div>
      </div>
    </>
  );
}
