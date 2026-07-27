import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Circulars — Examinations — MLRIT',
  description: 'Official examination circulars published by the Controller of Examinations at MLRIT.',
};

export default function CircularsPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Examinations"
        title="COE"
        italic="Circulars."
        dek="Official circulars issued by the Controller of Examinations — examination schedules, fee notifications, malpractice orders and general instructions."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Circulars' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/circulars" />

      <section className="bg-warm-light min-h-[60vh] py-16 md:py-24">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 lg:px-20 space-y-6">

          <Reveal preset="up">
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-2">Official Source</p>
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-2">
                Circulars — mlrit.ac.in
              </h3>
              <p className="text-muted text-[0.88rem] leading-relaxed mb-5">
                All examination circulars are published on the MLRIT institutional website under the Circulars section. This includes timetable circulars, fee-related notices, examination guidelines and supplementary exam schedules.
              </p>
              <a
                href="https://mlrit.ac.in/circulars/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary/90 transition-colors"
              >
                View Circulars on mlrit.ac.in ↗
              </a>
            </div>
          </Reveal>

          <Reveal preset="up" delay={0.1}>
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-2">Exam Portal</p>
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-2">
                MLRIT Examinations Portal
              </h3>
              <p className="text-muted text-[0.88rem] leading-relaxed mb-5">
                Internal examination circulars, hall tickets, result notifications and student-specific communications are available on the MLRIT Exam Portal after login.
              </p>
              <a
                href="https://exams.mlrinstitutions.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-secondary transition-colors"
              >
                Open Exam Portal ↗
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
                For queries about a specific circular, contact the COE office at{' '}
                <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">
                  coe@mlrinstitutions.ac.in
                </a>{' '}
                or visit the{' '}
                <a href="/examinations/contact" className="text-secondary font-semibold hover:underline">
                  Contact Us
                </a>{' '}
                page.
              </p>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
