import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Quality Initiatives — IQAC — MLRIT',
  description: 'Major quality initiatives coordinated by IQAC at MLR Institute of Technology to promote and sustain excellence across academic and administrative activities.',
};

const NAV_ITEMS = [
  { id: 'initiatives', label: 'Major Initiatives' },
  { id: 'responsibilities', label: 'Key Responsibilities' },
];

const INITIATIVES = [
  'Academic Quality Enhancement',
  'Curriculum Enrichment',
  'Faculty Development Programmes',
  'Student Skill Development',
  'Outcome-Based Education Implementation',
  'Research Promotion',
  'Innovation and Entrepreneurship',
  'Green Campus Initiatives',
  'Digital Learning Ecosystem',
  'Industry-Institute Interaction',
  'Internal Academic Audits',
  'Administrative Process Improvements',
  'Stakeholder Feedback System',
  'Student Satisfaction Survey',
  'Best Practices Documentation',
  'Institutional Distinctiveness',
  'National Ranking and Accreditation Support',
];

const RESPONSIBILITIES = [
  'Planning quality initiatives',
  'Monitoring academic processes',
  'Supporting strategic planning',
  'Reviewing institutional performance',
  'Facilitating evidence-based decision making',
  'Coordinating accreditation documentation',
  'Strengthening stakeholder engagement',
  'Promoting institutional excellence',
  'Encouraging innovation and best practices',
  'Driving continuous improvement across all functional areas',
];

export default function InitiativesPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Quality Initiatives"
        italic=""
        dek="IQAC actively coordinates institutional initiatives across seventeen focus areas to promote and sustain quality in academic and administrative activities at MLR Institute of Technology (Autonomous)."
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
            <H2 italic="">Major Quality Initiatives</H2>
            <Lede>
              The IQAC actively coordinates institutional initiatives in the following areas to ensure holistic institutional development:
            </Lede>
            <Reveal preset="up" delay={0.08}>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIATIVES.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border bg-white px-5 py-4 hover:border-secondary transition-colors"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.6rem] font-bold flex items-center justify-center mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-foreground leading-relaxed text-[0.93rem]">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </Section>

          <Section id="responsibilities">
            <H2 italic="">Key Responsibilities</H2>
            <Reveal preset="right">
              <p className="mt-4 text-muted leading-relaxed text-[1rem]">
                The IQAC acts as the institutional quality catalyst by:
              </p>
            </Reveal>
            <Reveal preset="up" delay={0.08}>
              <div className="mt-6 rounded-2xl border border-border bg-white p-7">
                <ul className="space-y-3">
                  {RESPONSIBILITIES.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                      <span className="text-foreground leading-relaxed text-[0.93rem]">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </Section>

        </div>
      </div>
    </>
  );
}
