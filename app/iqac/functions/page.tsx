import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Functions — IQAC — MLRIT',
  description: 'Key functions and quality assurance process flow of the Internal Quality Assurance Cell at MLR Institute of Technology.',
};

const NAV_ITEMS = [
  { id: 'functions', label: 'Key Functions' },
  { id: 'process-flow', label: 'Process Flow' },
];

const FUNCTIONS = [
  'Develops and monitors institutional quality benchmarks.',
  'Coordinates accreditation and ranking activities.',
  'Facilitates Academic and Administrative Audits.',
  'Promotes Outcome-Based Education (OBE).',
  'Encourages innovative teaching-learning methodologies.',
  'Collects and analyses stakeholder feedback.',
  'Monitors implementation of quality initiatives.',
  'Coordinates Annual Quality Assurance Report (AQAR) preparation.',
  'Supports NBA, NAAC, NIRF, AISHE, and statutory compliance.',
  'Organizes faculty development programmes, workshops, seminars, and quality awareness activities.',
  'Promotes best practices and institutional distinctiveness.',
  'Maintains quality documentation and evidence for accreditation.',
];

const PROCESS_FLOW_STEPS = [
  { n: '01', label: 'Vision & Mission' },
  { n: '02', label: 'Strategic Planning' },
  { n: '03', label: 'Quality Objectives & Benchmarks' },
  { n: '04', label: 'Department Quality Planning' },
  { n: '05', label: 'Implementation of Academic & Administrative Processes' },
  { n: '06', label: 'Monitoring & Documentation' },
  { n: '07', label: 'Internal Academic Audit / Administrative Audit' },
  { n: '08', label: 'Stakeholder Feedback Collection' },
  { n: '09', label: 'Performance Analysis' },
  { n: '10', label: 'IQAC Review Meeting' },
  { n: '11', label: 'Action Taken Report (ATR)' },
  { n: '12', label: 'Corrective & Preventive Actions' },
  { n: '13', label: 'Continuous Quality Improvement' },
  { n: '14', label: 'Institutional Excellence' },
];

export default function FunctionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Functions"
        italic=""
        dek="The IQAC performs key functions to ensure continuous quality enhancement across academic and administrative activities at MLR Institute of Technology (Autonomous)."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Functions' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/functions" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="functions">
            <H2 italic="">Key Functions</H2>
            <div className="mt-8 flex flex-col gap-3">
              {FUNCTIONS.map((f, i) => (
                <Reveal key={i} preset="right" delay={i * 0.04}>
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-white px-5 py-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.65rem] font-bold flex items-center justify-center mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-foreground leading-relaxed text-[0.95rem]">{f}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          <Section id="process-flow">
            <H2 italic="">IQAC Process Flow</H2>
            <Reveal preset="right">
              <p className="mt-4 text-muted leading-relaxed text-[1rem]">
                The IQAC follows the <strong className="text-foreground">Plan–Do–Check–Act (PDCA)</strong> methodology and aligns institutional quality initiatives with the requirements of NAAC, NBA, AICTE, UGC, JNTUH, NIRF, AISHE, and other statutory and regulatory bodies.
              </p>
              <p className="mt-3 text-muted leading-relaxed text-[1rem]">
                The quality assurance process is participative, involving all stakeholders, including management, faculty, students, alumni, employers, parents, and industry experts.
              </p>
            </Reveal>
            <Reveal preset="up" delay={0.1}>
              <div className="mt-8 rounded-2xl border border-border bg-white overflow-hidden">
                <div className="px-6 py-4 bg-warm-light border-b border-border">
                  <span className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted">IQAC Quality Assurance Process</span>
                </div>
                <div className="p-6">
                  <ol className="relative border-l-2 border-secondary/30 space-y-0 ml-3">
                    {PROCESS_FLOW_STEPS.map((step, i) => {
                      const isFirst = i === 0;
                      const isLast = i === PROCESS_FLOW_STEPS.length - 1;
                      return (
                        <li key={step.n} className="pl-6 pb-5 last:pb-0 relative">
                          <span className={[
                            'absolute -left-[13px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[0.6rem] font-bold',
                            isFirst || isLast
                              ? 'bg-secondary text-white'
                              : 'bg-white border-2 border-secondary/40 text-secondary',
                          ].join(' ')}>
                            {step.n}
                          </span>
                          <p className={[
                            'text-[0.93rem] leading-snug pt-0.5',
                            isFirst || isLast ? 'font-semibold text-foreground' : 'text-muted',
                          ].join(' ')}>
                            {step.label}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </Reveal>
          </Section>

        </div>
      </div>
    </>
  );
}
