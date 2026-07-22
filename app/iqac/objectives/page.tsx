import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Objectives — IQAC — MLRIT',
  description: 'Strategic goals and quality policy of the Internal Quality Assurance Cell at MLR Institute of Technology.',
};

const NAV_ITEMS = [
  { id: 'goals', label: 'Strategic Goals' },
  { id: 'quality-policy', label: 'Quality Policy' },
];

const OBJECTIVES = [
  {
    n: '01',
    t: 'Academic Excellence',
    d: 'Strengthen the quality of teaching-learning processes through innovative pedagogical practices, curriculum enrichment, experiential learning, and outcome-based education to enhance student learning outcomes.',
  },
  {
    n: '02',
    t: 'Continuous Quality Improvement',
    d: 'Establish robust quality assurance mechanisms that facilitate periodic review, monitoring, assessment, and continual enhancement of academic and administrative processes.',
  },
  {
    n: '03',
    t: 'Outcome-Based Education (OBE)',
    d: 'Promote effective implementation of Outcome-Based Education by aligning curriculum delivery, assessment, and attainment with Programme Outcomes (POs), Programme Specific Outcomes (PSOs), and Course Outcomes (COs).',
  },
  {
    n: '04',
    t: 'Research, Innovation and Consultancy',
    d: 'Encourage faculty and students to engage in impactful research, interdisciplinary collaborations, innovation, entrepreneurship, consultancy, patents, and technology transfer.',
  },
  {
    n: '05',
    t: 'Faculty Empowerment',
    d: 'Support continuous professional development through Faculty Development Programmes (FDPs), workshops, certifications, research opportunities, and industry interactions.',
  },
  {
    n: '06',
    t: 'Student Development',
    d: 'Create a learner-centric environment that nurtures technical competence, leadership, ethical values, innovation, employability skills, and lifelong learning.',
  },
  {
    n: '07',
    t: 'Digital Transformation',
    d: 'Leverage digital technologies and data-driven systems to improve academic administration, documentation, quality monitoring, and institutional decision-making.',
  },
  {
    n: '08',
    t: 'Accreditation and Ranking Excellence',
    d: 'Strengthen institutional preparedness for accreditation and ranking frameworks such as NAAC, NBA, NIRF, AISHE, AICTE, and other quality assessment agencies.',
  },
  {
    n: '09',
    t: 'Stakeholder Engagement',
    d: 'Develop effective mechanisms to obtain, analyze, and act upon feedback from students, faculty, alumni, employers, parents, and industry to enhance institutional effectiveness.',
  },
  {
    n: '10',
    t: 'Sustainable Institutional Development',
    d: 'Promote environmentally responsible practices, social responsibility, inclusiveness, ethical governance, and community engagement to achieve long-term institutional sustainability.',
  },
];

const QUALITY_POLICY_COMMITMENTS = [
  'Deliver quality education through effective curriculum planning, innovative teaching-learning practices, and robust assessment systems.',
  'Promote Outcome-Based Education to ensure attainment of defined learning outcomes and graduate attributes.',
  'Foster a culture of continuous quality improvement through regular monitoring, evaluation, and quality audits.',
  'Encourage research, innovation, entrepreneurship, consultancy, and interdisciplinary collaboration.',
  'Strengthen industry partnerships to enhance experiential learning, internships, skill development, and employability.',
  'Provide opportunities for faculty development, leadership, and professional growth.',
  'Create an inclusive, student-centric, and technology-enabled learning environment.',
  'Ensure transparent, participative, and accountable governance practices.',
  'Promote environmental sustainability, social responsibility, and ethical values.',
  'Comply with statutory, regulatory, and accreditation requirements while continually improving institutional effectiveness.',
];

export default function ObjectivesPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Objectives"
        italic=""
        dek="The IQAC of MLR Institute of Technology (Autonomous) is committed to fostering a culture of quality, innovation, and continuous improvement through ten strategic goals that guide all institutional activities."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Objectives' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/objectives" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="goals">
            <H2 italic="">Strategic Goals of IQAC</H2>
            <Lede>
              Driving Excellence through Continuous Quality Enhancement — by integrating quality benchmarks into all institutional processes, IQAC ensures that every academic and administrative activity contributes to sustainable growth, stakeholder satisfaction, and national and international recognition.
            </Lede>
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

          <Section id="quality-policy">
            <H2 italic="">Quality Policy</H2>
            <Reveal preset="right">
              <p className="mt-4 text-foreground leading-relaxed text-[1.05rem] font-semibold">
                Committed to Academic Excellence and Continuous Improvement
              </p>
              <p className="mt-3 text-muted leading-relaxed text-[1rem]">
                MLR Institute of Technology (Autonomous) is committed to providing quality technical education by fostering an environment of academic excellence, innovation, research, ethical values, inclusiveness, and continuous improvement. The Internal Quality Assurance Cell (IQAC) serves as the institutional catalyst in implementing and sustaining quality assurance systems that align with national standards and global best practices.
              </p>
              <p className="mt-3 text-muted leading-relaxed text-[1rem]">
                The Institute strives to continuously enhance academic and administrative processes by adopting transparent governance, learner-centric education, industry engagement, digital transformation, and evidence-based decision-making to produce competent professionals and responsible citizens.
              </p>
            </Reveal>

            <Reveal preset="up" delay={0.1}>
              <div className="mt-8 rounded-2xl border border-border bg-white p-7">
                <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary mb-5">Quality Policy Statement — The Institution is committed to:</div>
                <ol className="space-y-3">
                  {QUALITY_POLICY_COMMITMENTS.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.6rem] font-bold flex items-center justify-center mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-foreground leading-relaxed text-[0.93rem]">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </Section>

        </div>
      </div>
    </>
  );
}
