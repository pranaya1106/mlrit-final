import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Functions — IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'functions', label: 'Key Functions' },
  { id: 'process-flow', label: 'Process Flow' },
];

const FUNCTIONS = [
  'Develop and apply quality benchmarks for the various academic and administrative activities of the institution.',
  'Facilitate the creation of a learner-centric environment conducive to quality education and faculty maturation to adopt the required knowledge and technology for participatory teaching and learning process.',
  'Arrange for feedback response from students, parents and other stakeholders on quality-related institutional processes.',
  'Disseminate information on various quality parameters of higher education.',
  'Organise inter and intra institutional workshops, seminars on quality related themes and promotion of quality circles.',
  'Document the various programmes / activities leading to quality improvement.',
  'Act as nodal agency of the institution for coordinating quality-related activities including adoption and dissemination of best practices.',
  'Develop and maintain institutional database through MIS for the purpose of maintaining and enhancing the institutional quality.',
  'Periodically conduct Academic and Administrative Audit and its follow-up activities.',
  'Prepare and submit Annual Quality Assurance Report (AQAR) as per the guidelines and parameters of NAAC.',
];

export default function FunctionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Functions"
        italic=""
        dek="Key functions of the Internal Quality Assurance Cell at MLRIT."
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
            <H2 italic="">Process Flow</H2>
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-warm-light/40 p-8 text-center">
              <p className="text-muted italic text-[0.95rem]">Content to be updated.</p>
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}
