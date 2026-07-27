import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Internal (CIE) Timetable — Examinations — MLRIT' };

export default function InternalTimetablePage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations · Timetables"
        title="Internal (CIE)"
        italic="Timetables."
        dek="Continuous Internal Evaluation (CIE) mid-term and unit test schedules are published on the MLRIT Exam Portal and through department notices."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Timetables', href: '/examinations/timetable/internal' },
          { label: 'Internal' },
        ]}
        variant="green"
      />
      <ExaminationsQuickNav active="/examinations/timetable/internal" />

      {/* Internal / External pill toggle */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 py-3">
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

      <section className="bg-warm-light min-h-[60vh] py-16 md:py-24">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 lg:px-20 space-y-6">

          <Reveal preset="up">
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-2">Exam Portal</p>
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-2">
                Internal Timetables — MLRIT Exam Portal
              </h3>
              <p className="text-muted text-[0.88rem] leading-relaxed mb-5">
                CIE (mid-term, unit test and internal practical examination) timetables are published on the MLRIT Exam Portal. Log in with your student credentials to view your personalised schedule.
              </p>
              <a
                href="https://exams.mlrinstitutions.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary/90 transition-colors"
              >
                Open Exam Portal ↗
              </a>
            </div>
          </Reveal>

          <Reveal preset="up" delay={0.1}>
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-2">Department Notices</p>
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-2">
                Department-level CIE Schedules
              </h3>
              <p className="text-muted text-[0.88rem] leading-relaxed mb-5">
                Some internal test schedules are announced directly through department notice boards or department-specific notifications on the circulars page. Check with your department office for the latest internal exam dates.
              </p>
              <a
                href="https://mlrit.ac.in/circulars/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-secondary transition-colors"
              >
                View Circulars ↗
              </a>
            </div>
          </Reveal>

          <Reveal preset="up" delay={0.15}>
            <div className="p-5 rounded-xl border border-border bg-white flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.85rem] leading-relaxed">
                For CIE-related queries, contact your department's academic coordinator or the{' '}
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
