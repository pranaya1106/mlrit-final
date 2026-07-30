import type { Metadata } from 'next';
import ExaminationsHero from '@/components/ExaminationsHero';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Exam Fee & Results — Examinations — MLRIT',
  description: 'Pay examination fees and access results on the MLRIT Examinations Portal.',
};

const STEPS = [
  {
    step: '01',
    title: 'Open the Exam Portal',
    desc: 'Go to exams.mlrinstitutions.ac.in and sign in with your MLRIT student credentials (roll number and date of birth).',
  },
  {
    step: '02',
    title: 'Navigate to Fee Payment',
    desc: 'Under the Fee section, select the current semester and choose Regular or Supplementary examination fee as applicable.',
  },
  {
    step: '03',
    title: 'Pay Online',
    desc: 'Fee payment is accepted via Net Banking, UPI, Debit / Credit Card through the integrated payment gateway.',
  },
  {
    step: '04',
    title: 'Download Receipt',
    desc: 'After payment, download and save the fee receipt. Retain a copy for hall ticket collection and future reference.',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function FeeResultsPage() {
  return (
    <>
      <ExaminationsHero
        title="Exam Fee &"
        italic="Results."
        dek="Pay your examination fee and access semester results — both managed through the MLRIT Examinations Portal."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Exam Fee & Results' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/fee-results" />

      {/* Exam Portal CTA */}
      <section className="bg-ink text-white py-14">
        <div className="w-full px-6 md:px-10 lg:px-12 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.2em] uppercase text-white/50 mb-2 inline-block">
              MLRIT Examinations Portal
            </span>
            <h2 className="font-sans font-black tracking-tighter text-white text-[clamp(1.5rem,2.5vw,2.1rem)] leading-[1.1]">
              Fee payment and results<br />are on the Exam Portal.
            </h2>
            <p className="mt-3 text-white/60 text-[0.9rem] leading-relaxed max-w-[500px]">
              The MLRIT Examinations Portal is the single destination for paying examination fees, accessing results and downloading hall tickets.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="https://exams.mlrinstitutions.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-[0.93rem] hover:bg-primary/90 transition-colors"
            >
              Open Exam Portal ↗
            </a>
          </div>
        </div>
      </section>

      {/* Fee payment steps */}
      <section className="bg-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">How to Pay</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.06]">
              Fee payment in{' '}
              <span className="font-display italic font-medium" style={gradientText}>four steps.</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} preset="up" delay={i * 0.07}>
                <div className="rounded-2xl border border-border bg-white p-7 h-full">
                  <span className="font-mono font-bold text-primary text-[0.72rem] tracking-[0.2em] uppercase">{s.step}</span>
                  <h3 className="mt-2 font-sans font-extrabold text-foreground text-[1rem]">{s.title}</h3>
                  <p className="mt-2 text-muted text-[0.88rem] leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-warm-light py-16 md:py-20 border-t border-border">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Results</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.06]">
              Checking your{' '}
              <span className="font-display italic font-medium" style={gradientText}>results.</span>
            </h2>
            <p className="mt-4 text-muted text-[0.93rem] max-w-[600px] leading-relaxed">
              Semester results are published on the MLRIT Exam Portal within the timelines specified in the academic calendar. Log in with your student credentials to view and download your grade sheet.
            </p>
          </Reveal>

          <Reveal preset="up" delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://exams.mlrinstitutions.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary/90 transition-colors"
              >
                View Results on Portal ↗
              </a>
              <a
                href="/examinations/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-secondary transition-colors"
              >
                Contact COE for Result Queries →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
