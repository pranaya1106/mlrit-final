import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Annual Reports — Examinations — MLRIT',
  description: 'Annual examination reports from the Controller of Examinations office at MLRIT.',
};

const REPORTS = [
  {
    year: '2024–25',
    title: 'Annual Examination Report 2024–25',
    desc: 'Summary of examination outcomes, pass rates, re-evaluation statistics and process improvements for A.Y. 2024–25.',
    href: '/examinations/contact',
    external: false,
    current: false,
  },
  {
    year: '2023–24',
    title: 'Annual Examination Report 2023–24',
    desc: 'Examination performance data, regulation-wise analysis and COE activity report for A.Y. 2023–24.',
    href: '/examinations/contact',
    external: false,
    current: false,
  },
  {
    year: '2022–23',
    title: 'Annual Examination Report 2022–23',
    desc: 'Transition to R22 regulation — performance overview, OBE alignment and examination infrastructure report.',
    href: '/examinations/contact',
    external: false,
    current: false,
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function AnnualReportsPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Examinations"
        title="Annual"
        italic="Reports."
        dek="Year-wise examination activity reports published by the Controller of Examinations office — performance data, process reviews and regulatory compliance."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Annual Reports' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/annual-reports" />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Reports</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              Year-wise{' '}
              <span className="font-display italic font-medium" style={gradientText}>examination reports.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid md:grid-cols-3 gap-5" delay={0.07}>
            {REPORTS.map((r) => (
              <StaggerItem key={r.year}>
                <div className="rounded-2xl border border-border bg-warm-light p-6 h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[0.62rem] font-mono font-bold tracking-widest uppercase bg-green-50 border-green-200 text-secondary">
                      {r.year}
                    </span>
                    {r.current && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.58rem] font-bold tracking-wide uppercase">
                        <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans font-extrabold text-foreground text-[0.95rem] leading-snug mb-2">{r.title}</h3>
                    <p className="text-muted text-[0.82rem] leading-relaxed">{r.desc}</p>
                  </div>
                  <a
                    href={r.href}
                    target={r.external ? '_blank' : undefined}
                    rel={r.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 text-secondary font-bold text-[0.8rem] hover:underline mt-auto"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M7 2v7M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {r.external ? 'Request Report ↗' : 'Request from COE →'}
                  </a>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal preset="up" delay={0.2}>
            <div className="mt-10 p-5 rounded-xl border border-border bg-warm-light flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.85rem] leading-relaxed">
                Annual examination reports are available on request from the COE office. Contact{' '}
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
