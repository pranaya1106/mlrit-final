import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Quality Initiatives — IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'initiatives', label: 'Initiatives & Activities' },
  { id: 'impact-analysis', label: 'Impact Analysis' },
];

const INITIATIVES = [
  { n: '01', t: 'Outcome-Based Education (OBE)', d: 'Systematic implementation of OBE across all programmes — aligning curriculum, pedagogy and assessment to defined Programme Outcomes (POs) and Course Outcomes (COs).' },
  { n: '02', t: 'Academic and Administrative Audit', d: 'Periodic internal and external audits of academic and administrative functions to identify gaps and drive targeted improvements.' },
  { n: '03', t: 'Faculty Development Programmes', d: 'Continuous professional development through FDPs, workshops, NPTEL certification drives and inter-institutional knowledge exchanges.' },
  { n: '04', t: 'Student Satisfaction Survey', d: 'Regular collection and analysis of student feedback on teaching quality, infrastructure, facilities and overall institutional experience.' },
  { n: '05', t: 'Green & Sustainable Campus', d: 'Initiatives towards energy conservation, e-waste management, rainwater harvesting and an eco-conscious campus environment.' },
  { n: '06', t: 'Industry–Academia Collaboration', d: 'Strengthening MoUs, guest lectures, live projects and internship pipelines to keep curriculum industry-relevant.' },
];

export default function InitiativesPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Quality Initiatives"
        italic=""
        dek="Key initiatives undertaken by IQAC to promote and sustain quality across academic and administrative activities."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Quality Initiatives' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/initiatives" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="initiatives">
            <H2 italic="">Initiatives & Activities</H2>
            <Lede>Key initiatives undertaken by IQAC to promote and sustain quality across academic and administrative activities.</Lede>
            <Stagger className="mt-8 grid md:grid-cols-2 gap-5" delay={0.07}>
              {INITIATIVES.map((o) => (
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

          <Section id="impact-analysis">
            <H2 italic="">Impact Analysis</H2>
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-warm-light/40 p-8 text-center">
              <p className="text-muted italic text-[0.95rem]">Content to be updated.</p>
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}
