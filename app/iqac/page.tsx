import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'IQAC — MLRIT',
  description: 'Internal Quality Assurance Cell of MLR Institute of Technology — fostering a culture of quality, innovation, and continuous improvement.',
};

const NAV_ITEMS = [
  { id: 'about', label: 'About IQAC' },
  { id: 'vision-mission', label: 'Vision & Mission' },
  { id: 'commitment', label: 'Commitment to Quality' },
  { id: 'quality-framework', label: 'Quality Framework' },
];

const MISSION_POINTS = [
  'To institutionalize quality assurance practices across academic and administrative domains.',
  'To promote excellence in teaching, learning, research, innovation, and extension activities.',
  'To facilitate outcome-based education and continuous curriculum improvement.',
  'To encourage stakeholder participation for institutional development.',
  'To strengthen governance through transparency, accountability, and evidence-based decision making.',
  'To achieve excellence in accreditation, ranking, and national quality frameworks.',
];

const COMMITMENT_ITEMS = [
  'Academic Excellence',
  'Continuous Quality Improvement',
  'Student-Centric Learning',
  'Research and Innovation',
  'Industry Collaboration',
  'Digital Transformation',
  'Sustainable Development',
  'Ethical Governance',
  'Institutional Transparency',
  'Inclusive Growth',
];

const QUALITY_FRAMEWORKS = [
  { code: 'NAAC', label: 'National Assessment and Accreditation Council' },
  { code: 'NBA', label: 'National Board of Accreditation' },
  { code: 'NIRF', label: 'National Institutional Ranking Framework' },
  { code: 'AISHE', label: 'All India Survey on Higher Education' },
  { code: 'AICTE', label: 'All India Council for Technical Education' },
  { code: 'UGC', label: 'University Grants Commission' },
  { code: 'JNTUH', label: 'Jawaharlal Nehru Technological University Hyderabad' },
  { code: 'OBE', label: 'Outcome-Based Education' },
];

export default function IQACPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quality Assurance"
        title="Internal Quality Assurance Cell (IQAC)"
        italic=""
        dek="The IQAC of MLR Institute of Technology (Autonomous) functions as the central quality assurance and enhancement body — fostering a culture of quality, innovation, and continuous improvement across all academic and administrative activities."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="about">
            <H2 italic="">About IQAC</H2>
            <div className="mt-6 space-y-4">
              <Reveal preset="right">
                <p className="text-foreground leading-relaxed text-[1.05rem]">
                  The Internal Quality Assurance Cell (IQAC) serves as the quality sustenance and enhancement mechanism of the institution. Established in accordance with the guidelines of the National Assessment and Accreditation Council (NAAC), IQAC promotes a culture of quality through systematic planning, monitoring, documentation, and continuous improvement of academic and administrative processes.
                </p>
              </Reveal>
              <Reveal preset="right" delay={0.05}>
                <p className="text-muted leading-relaxed text-[1rem]">
                  The IQAC acts as a catalyst for institutional excellence by encouraging innovation, outcome-based education, digital transformation, stakeholder participation, and evidence-based decision making. It coordinates quality initiatives aligned with NAAC, NBA, NIRF, AISHE, UGC, AICTE, and other regulatory frameworks to ensure holistic institutional development.
                </p>
              </Reveal>
              <Reveal preset="right" delay={0.1}>
                <p className="text-muted leading-relaxed text-[1rem]">
                  Through continuous monitoring and periodic reviews, IQAC strengthens teaching-learning processes, research, extension activities, governance, infrastructure, and student support systems, thereby contributing to the realization of the institution&apos;s vision and mission.
                </p>
              </Reveal>
            </div>

            <Reveal preset="up" delay={0.12}>
              <blockquote className="mt-8 rounded-2xl border-l-4 border-secondary bg-green-50/40 px-7 py-5">
                <p className="font-sans font-semibold text-foreground text-[1rem] leading-relaxed italic">
                  &ldquo;Quality is not an event; it is a continuous journey towards excellence.&rdquo;
                </p>
                <footer className="mt-2 font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-secondary">IQAC Motto</footer>
              </blockquote>
            </Reveal>
          </Section>

          <Section id="vision-mission">
            <H2 italic="">Vision &amp; Mission</H2>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <Reveal preset="right">
                <div className="rounded-2xl border-2 border-secondary bg-green-50/40 p-7 h-full">
                  <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary mb-3">Vision</div>
                  <p className="font-sans font-extrabold text-foreground text-[1rem] leading-snug">
                    To nurture a culture of continuous quality enhancement and innovation that transforms MLR Institute of Technology into a globally recognized institution of academic excellence, research, innovation, and societal impact.
                  </p>
                </div>
              </Reveal>
              <Reveal preset="up" delay={0.1}>
                <div className="rounded-2xl border border-border bg-white p-7 h-full">
                  <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary mb-4">Mission</div>
                  <ul className="space-y-2.5">
                    {MISSION_POINTS.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                        <span className="text-foreground leading-relaxed text-[0.93rem]">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </Section>

          <Section id="commitment">
            <H2 italic="">Our Commitment to Quality</H2>
            <p className="mt-3 text-muted leading-relaxed text-[1rem]">IQAC is committed to:</p>
            <Reveal preset="up" delay={0.08}>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {COMMITMENT_ITEMS.map((item) => (
                  <div key={item} className="rounded-xl border border-border bg-white px-4 py-3 text-center hover:border-secondary transition-colors">
                    <p className="font-sans font-semibold text-foreground text-[0.85rem] leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </Section>

          <Section id="quality-framework">
            <H2 italic="">Institutional Quality Framework</H2>
            <p className="mt-3 text-muted leading-relaxed text-[1rem]">
              IQAC aligns institutional activities with the following quality frameworks:
            </p>
            <Reveal preset="up" delay={0.08}>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-warm-light border-b border-border">
                      <th className="px-5 py-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted">Framework</th>
                      <th className="px-5 py-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted">Full Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {QUALITY_FRAMEWORKS.map((f) => (
                      <tr key={f.code} className="bg-white hover:bg-warm-light/40 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-secondary text-[0.88rem]">{f.code}</td>
                        <td className="px-5 py-3.5 text-foreground text-[0.93rem]">{f.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </Section>

        </div>
      </div>
    </>
  );
}
