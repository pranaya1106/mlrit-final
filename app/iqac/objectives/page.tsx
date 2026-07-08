import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';

export const metadata: Metadata = { title: 'Objectives — IQAC — MLRIT' };

const OBJECTIVES = [
  { n: '01', t: 'Develop Quality Systems', d: 'Develop a system for conscious, consistent and catalytic action to improve the academic and administrative performance of the institution.' },
  { n: '02', t: 'Promote Quality Culture', d: 'Promote measures for institutional functioning towards quality enhancement through internalization of quality culture and institutionalization of best practices.' },
  { n: '03', t: 'OBE & Curriculum', d: 'Champion outcome-based education (OBE) and curriculum alignment across all programmes and regulations.' },
  { n: '04', t: 'Student Feedback Systems', d: 'Implement and monitor student-feedback systems, academic excellence metrics and continuous improvement processes.' },
  { n: '05', t: 'Accreditation Drive', d: 'Coordinate and lead all accreditation cycles including NBA, NIRF, ARIIA — ensuring sustained quality benchmarks.' },
];

export default function ObjectivesPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Objectives"
        italic=""
        dek="The primary aim of IQAC is to drive conscious, consistent and catalytic improvement across all institutional activities."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Objectives' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/objectives" />
      <Section>
        <H2 italic="">Objectives</H2>
        <Lede>The primary aim of IQAC is to drive conscious, consistent and catalytic improvement across all institutional activities.</Lede>
        <Stagger className="mt-8 grid md:grid-cols-2 gap-5" delay={0.07}>
          {OBJECTIVES.map((o) => (
            <StaggerItem key={o.n}>
              <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-secondary transition-colors">
                <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-secondary mb-3">{o.n}</div>
                <h3 className="font-sans font-extrabold text-foreground text-[1rem] mb-2">{o.t}</h3>
                <p className="text-muted leading-relaxed text-[0.93rem]">{o.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
