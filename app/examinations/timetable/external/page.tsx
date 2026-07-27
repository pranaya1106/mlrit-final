import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import DocActions from '@/components/examinations/DocActions';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'External (SEE) Timetable — Examinations — MLRIT' };

type Timetable = {
  title: string;
  regulation: string;
  period: string;
  file: string;
  badge: string;
  badgeColor: string;
  current?: boolean;
};

const TIMETABLES: Timetable[] = [
  {
    title: 'IV B.Tech II Sem — Advanced Supplementary',
    regulation: 'R22 / R20 / MLR18',
    period: 'July 2026',
    file: 'IV-B.Tech-II-Semester-R22-R20-MLR18-Regulations-Advanced-Supplementary-Examinations-July-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    current: true,
  },
  {
    title: 'B.Tech Special Supplementary OTC End Semester',
    regulation: 'All Regulations',
    period: 'July–August 2026',
    file: 'FINAL-TIMETABLE-BTECH-OTC-2026.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    current: true,
  },
  {
    title: 'I B.Tech I Sem — Supplementary',
    regulation: 'R25 / R22',
    period: 'June 2026',
    file: 'I-B.Tech.-I-Semester-Supplementary-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'I B.Tech II Sem — Regular & Supplementary',
    regulation: 'R25',
    period: 'June 2026',
    file: 'I-B.Tech.-II-Semester-Regular-and-Supplementary-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'I B.Tech II Sem — CBT (Computer-Based Test)',
    regulation: 'R25',
    period: 'July 2026',
    file: 'I-B.Tech.-II-Sem.-R25-Regulations-CBT-Examinations-July-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    current: true,
  },
  {
    title: 'I B.Tech II Sem — Computer Aided Engineering Drawing',
    regulation: 'R25',
    period: 'June 2026',
    file: 'I-B.Tech-II-Semester-R25-Computer-Aided-Engineering-Drawing-Regular-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'II B.Tech I Sem — Supplementary',
    regulation: 'R22 / MLR20 / MLR18',
    period: 'June 2026',
    file: 'II-B.Tech-I-Semester-R22-MLR20-MLR18-Regulations-Supplementary-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'II B.Tech II Sem — Regular & Supplementary',
    regulation: 'R22 / MLR20 / MLR18',
    period: 'June 2026',
    file: 'II-B.Tech-II-Semester-R22-MLR20-MLR18-Regulations-Regular-and-Supplementary-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'I B.Tech II Sem — Practical Supplementary',
    regulation: 'R25',
    period: 'June 2026',
    file: 'Practical-I-B.Tech.-II-Semester-Supplementary-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'I B.Tech I Sem — Practical Supplementary',
    regulation: 'R25',
    period: 'June 2026',
    file: 'Practical-I-B.Tech.-I-Semester-Supplementary-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'I B.Tech II Sem — Practical Regular',
    regulation: 'R25',
    period: 'June 2026',
    file: 'Practical-I-B.Tech.-II-Semester-R25-Regular-Examinations-June-2026-Timetable.pdf',
    badge: 'B.Tech',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    title: 'MBA Special Supplementary OTC End Semester',
    regulation: 'All Regulations',
    period: 'July–August 2026',
    file: 'FINAL-TIMETABLE-MBA-OTC-2026.pdf',
    badge: 'MBA',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    current: true,
  },
  {
    title: 'II MBA II Sem — Regular & Supplementary',
    regulation: 'R22',
    period: 'July 2026',
    file: 'II-MBA-II-Semester-R22-Regular-and-Supplementary-Examinations-July-2026-Timetable.pdf',
    badge: 'MBA',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    current: true,
  },
  {
    title: 'II MBA I Sem — Supplementary',
    regulation: 'R22',
    period: 'July 2026',
    file: 'II-MBA-I-Semester-R22-Supplementary-Examinations-July-2026-Timetable.pdf',
    badge: 'MBA',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    current: true,
  },
  {
    title: 'I MBA II Sem — Regular & Supplementary',
    regulation: 'R25',
    period: 'August 2026',
    file: 'I-MBA-II-Sem.-Regular-and-Supplementary-Examinations-August-2026-Timetable.pdf',
    badge: 'MBA',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    current: true,
  },
  {
    title: 'I MBA I Sem — Supplementary',
    regulation: 'R25',
    period: 'August 2026',
    file: 'I-MBA-I-Sem.-Supplementary-Examinations-August-2026-Timetable.pdf',
    badge: 'MBA',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    current: true,
  },
  {
    title: 'II M.Tech. I Sem — Supplementary',
    regulation: 'R22',
    period: 'July 2026',
    file: 'II-M.Tech.-I-Semester-R22-Supplementary-Examinations-July-2026-Timetable.pdf',
    badge: 'M.Tech',
    badgeColor: 'bg-blue-50 border-blue-200 text-blue-700',
    current: true,
  },
  {
    title: 'I M.Tech. II Sem — Regular & Supplementary',
    regulation: 'R25',
    period: 'August 2026',
    file: 'I-M.Tech-II-Sem.-Regular-and-Supplementary-Examinations-August-2026-Timetable.pdf',
    badge: 'M.Tech',
    badgeColor: 'bg-blue-50 border-blue-200 text-blue-700',
    current: true,
  },
  {
    title: 'I M.Tech. I Sem — Supplementary',
    regulation: 'R25',
    period: 'August 2026',
    file: 'I-M.Tech.-I-Sem.-Supplementary-Examinations-August-2026-Timetable.pdf',
    badge: 'M.Tech',
    badgeColor: 'bg-blue-50 border-blue-200 text-blue-700',
    current: true,
  },
  {
    title: 'Ph.D. Course Work — Regular Examinations',
    regulation: 'R25',
    period: 'August 2026',
    file: 'Ph.D.-Course-Work-Regular-Examinations-August-2026-Timetable.pdf',
    badge: 'Ph.D.',
    badgeColor: 'bg-purple-50 border-purple-200 text-purple-700',
    current: true,
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function ExternalTimetablePage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations · Timetables"
        title="External (SEE)"
        italic="Timetables."
        dek="Semester End Examination (SEE) timetables for Regular, Supplementary and Advance Supplementary examinations across all programmes and regulations."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Timetables', href: '/examinations/timetable/external' },
          { label: 'External' },
        ]}
        variant="green"
      />
      <ExaminationsQuickNav active="/examinations/timetable/external" />

      {/* Internal / External pill toggle */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 py-3">
          <div className="inline-flex items-center rounded-full bg-warm-light border border-border p-1 gap-1">
            <a
              href="/examinations/timetable/internal"
              className="px-5 py-2 rounded-full font-sans font-bold text-[0.82rem] text-muted hover:text-foreground transition-all duration-200"
            >
              Internal (CIE)
            </a>
            <a
              href="/examinations/timetable/external"
              aria-current="page"
              className="px-5 py-2 rounded-full font-sans font-bold text-[0.82rem] bg-primary text-white shadow-card-soft transition-all duration-200"
            >
              External (SEE)
            </a>
          </div>
        </div>
      </div>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              Semester End Examinations · {TIMETABLES.length} Timetables
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              SEE <span className="font-display italic font-medium" style={gradientText}>schedules.</span>
            </h2>
            <p className="mt-3 text-muted text-[0.93rem] max-w-[620px] leading-relaxed">
              All timetables are hosted locally. Use View to open in-browser or Download to save a copy.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid md:grid-cols-2 gap-5" delay={0.05}>
            {TIMETABLES.map((t) => (
              <StaggerItem key={t.file}>
                <div className="group flex flex-col gap-4 rounded-2xl border-2 border-border bg-white p-7 hover:border-secondary hover:-translate-y-0.5 transition-all h-full">
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
                  <div className="flex-1">
                    <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] leading-snug group-hover:text-secondary transition-colors">
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
              <p className="text-muted text-[0.88rem] leading-relaxed">
                For fee notifications and result announcements related to these examinations, see{' '}
                <a href="/examinations/circulars" className="text-secondary font-semibold hover:underline">
                  Circulars
                </a>{' '}
                or contact the{' '}
                <a href="/examinations/contact" className="text-secondary font-semibold hover:underline">
                  COE office
                </a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
