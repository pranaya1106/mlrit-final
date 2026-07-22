import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'IQAC Composition — IQAC — MLRIT',
  description: 'Members, roles, and responsibilities of the Internal Quality Assurance Cell at MLR Institute of Technology.',
};

const NAV_ITEMS = [
  { id: 'members', label: 'Members' },
  { id: 'head-iqac', label: 'Head IQAC' },
  { id: 'roles-responsibilities', label: 'Roles & Responsibilities' },
];

interface Member {
  sno: number;
  category: string;
  position: string;
}

const MEMBERS: Member[] = [
  { sno: 1,  category: 'Chairman',                    position: 'Principal'          },
  { sno: 2,  category: 'Head IQAC',                   position: 'Director'           },
  { sno: 3,  category: 'Management Representative',   position: 'Member'             },
  { sno: 4,  category: 'Management Representative',   position: 'Member'             },
  { sno: 5,  category: 'Industry Representative',     position: 'External Member'    },
  { sno: 6,  category: 'Employer Representative',     position: 'External Member'    },
  { sno: 7,  category: 'Alumni Representative',       position: 'Member'             },
  { sno: 8,  category: 'Heads of Departments',        position: 'Members'            },
  { sno: 9,  category: 'Dean – Research & Development', position: 'Member'           },
  { sno: 10, category: 'Controller of Examinations',  position: 'Member'             },
  { sno: 11, category: 'Administrative Officer',      position: 'Member'             },
  { sno: 12, category: 'Coordinator',                 position: 'IQAC Coordinator'   },
  { sno: 13, category: 'Coordinator',                 position: 'IQAC Coordinator'   },
  { sno: 14, category: 'Coordinator',                 position: 'IQAC Coordinator'   },
  { sno: 15, category: 'Coordinator',                 position: 'IQAC Coordinator'   },
];

interface RoleDetail {
  role: string;
  responsibilities: string[];
}

const ROLES: RoleDetail[] = [
  {
    role: 'Chairman (Principal)',
    responsibilities: [
      'Provide strategic leadership for institutional quality enhancement.',
      'Approve quality policies, plans, and initiatives.',
      'Chair IQAC meetings and review progress.',
      'Facilitate implementation of quality assurance systems.',
      'Ensure institutional support for accreditation and ranking activities.',
      'Promote a culture of academic excellence and continuous improvement.',
    ],
  },
  {
    role: 'IQAC Coordinator',
    responsibilities: [
      'Coordinate all IQAC activities and meetings.',
      'Prepare annual quality plans and action schedules.',
      'Facilitate implementation of quality initiatives.',
      'Monitor quality benchmarks and institutional KPIs.',
      'Coordinate preparation and submission of AQAR.',
      'Maintain quality documentation and records.',
      'Liaise with statutory bodies such as NAAC, NBA, AICTE, UGC, NIRF, AISHE, and JNTUH.',
      'Organize quality awareness programmes, workshops, and FDPs.',
      'Present progress reports to the Principal and IQAC.',
    ],
  },
  {
    role: 'Management Representative',
    responsibilities: [
      'Provide policy guidance for quality initiatives.',
      'Support infrastructure and resource development.',
      'Facilitate strategic planning and institutional growth.',
      'Review institutional performance.',
    ],
  },
  {
    role: 'Heads of Departments',
    responsibilities: [
      'Implement IQAC initiatives at the department level.',
      'Monitor teaching-learning processes.',
      'Ensure preparation of course files and academic records.',
      'Coordinate academic audits and departmental reviews.',
      'Promote research and innovation among faculty and students.',
    ],
  },
  {
    role: 'Controller of Examinations',
    responsibilities: [
      'Ensure transparent and fair examination processes.',
      'Monitor assessment and evaluation mechanisms.',
      'Maintain confidentiality and integrity in examinations.',
      'Support attainment analysis and examination reforms.',
    ],
  },
  {
    role: 'Administrative Officer',
    responsibilities: [
      'Support administrative quality initiatives.',
      'Maintain institutional records and documentation.',
      'Coordinate administrative audits.',
      'Facilitate implementation of e-Governance practices.',
    ],
  },
  {
    role: 'Industry Representative',
    responsibilities: [
      'Provide industry perspectives on curriculum relevance.',
      'Suggest emerging technologies and skill requirements.',
      'Facilitate internships, projects, and industry collaborations.',
      'Support employability initiatives.',
    ],
  },
  {
    role: 'Alumni Representative',
    responsibilities: [
      'Share alumni feedback on academic programmes.',
      'Support mentoring and career guidance.',
      'Facilitate alumni engagement and networking.',
      'Promote industry–institution collaboration.',
    ],
  },
];

export default function CompositionPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="IQAC Composition"
        italic=""
        dek="The cell brings together institutional leadership, management, faculty, external stakeholders, and alumni to ensure comprehensive quality oversight and continuous improvement."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'IQAC Composition' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/composition" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="members">
            <H2 italic="">IQAC Members</H2>
            <Lede>The IQAC functions as the nodal agency for quality assurance and enhancement, bringing together institutional leadership, faculty, and external experts.</Lede>
            <Reveal preset="up" delay={0.08}>
              <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-left">
                  <caption className="sr-only">IQAC Member Composition</caption>
                  <thead>
                    <tr className="bg-warm-light border-b border-border">
                      <th scope="col" className="px-5 py-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted w-12">S.No.</th>
                      <th scope="col" className="px-5 py-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted">Category</th>
                      <th scope="col" className="px-5 py-3 font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MEMBERS.map((m) => (
                      <tr key={m.sno} className="bg-white hover:bg-warm-light/40 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-muted text-[0.82rem]">{m.sno}</td>
                        <td className="px-5 py-3.5 text-foreground text-[0.93rem]">{m.category}</td>
                        <td className="px-5 py-3.5">
                          <span className={[
                            'inline-block px-2.5 py-0.5 rounded-full font-mono text-[0.68rem] font-bold tracking-wide',
                            m.position === 'IQAC Coordinator'
                              ? 'bg-secondary/10 text-secondary border border-secondary/20'
                              : m.position === 'Principal' || m.position === 'Director'
                              ? 'bg-primary/8 text-primary border border-primary/15'
                              : m.position === 'External Member'
                              ? 'bg-warm-light text-muted border border-border'
                              : 'bg-warm-light text-muted border border-border',
                          ].join(' ')}>
                            {m.position}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </Section>

          <Section id="head-iqac">
            <H2 italic="">Head IQAC</H2>
            <Reveal preset="up" delay={0.1}>
              <div className="mt-8 rounded-2xl border border-border bg-white p-8 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="shrink-0 w-40 h-44 md:w-44 md:h-48 rounded-2xl overflow-hidden border border-border self-start">
                  <img src="/images/leadership/dr-radhika-devi.jpg" alt="Dr. Radhika Devi V" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1">
                  <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary mb-2">Head IQAC</div>
                  <h3 className="font-sans font-black text-foreground text-[1.4rem] tracking-tight">Dr. Radhika Devi V</h3>
                  <p className="mt-1 font-mono text-muted text-[0.78rem] tracking-wide uppercase">Director · Dean H&amp;S · Head IQAC</p>
                  <div className="mt-5 h-px bg-border" />
                  <p className="mt-5 text-foreground leading-relaxed text-[1rem]">
                    An acclaimed academician and administrator in the field of technical education with more than 21 years of academic experience. Former Head of the Science and Humanities Department at MLR Institute of Technology.
                  </p>
                  <p className="mt-3 text-muted leading-relaxed text-[0.95rem]">
                    She has organised and attended several National and International Conferences, Seminars and Workshops, and has published nearly 20 research papers in Journals of National and International Repute.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {[
                      'IUCEE Showcase Award — Excellence in Academic Leadership',
                      'Swarna Jayanti Puruskar — Best Research Paper (NASI)',
                      'IUCEE Showcase Award — Leadership of Teaching & Learning Centre',
                    ].map((a) => (
                      <span key={a} className="px-3 py-1.5 rounded-full bg-warm-light border border-border font-sans text-[0.82rem] text-foreground">{a}</span>
                    ))}
                  </div>
                </div>
                <div className="md:w-64 shrink-0">
                  <div className="rounded-2xl border border-border bg-warm-light p-6 space-y-4">
                    <div>
                      <div className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Qualification</div>
                      <p className="text-foreground text-[0.93rem]">M.Sc., Ph.D — Physics<br /><span className="text-muted text-[0.85rem]">Hyderabad Central University</span></p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                      <div className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Specialisation</div>
                      <p className="text-foreground text-[0.93rem]">Density Functional Theory · Transparent Conducting Oxides</p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                      <div className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Research Focus</div>
                      <p className="text-foreground text-[0.93rem]">TCOs · Smart Materials · Higher Education · ICT in Education</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </Section>

          <Section id="roles-responsibilities">
            <H2 italic="">Roles &amp; Responsibilities</H2>
            <Reveal preset="right">
              <p className="mt-4 text-muted leading-relaxed text-[1rem]">
                The IQAC functions as the nodal agency for quality assurance and enhancement, ensuring that the institution continuously improves its academic and administrative performance.
              </p>
            </Reveal>
            <div className="mt-8 space-y-4">
              {ROLES.map((r, i) => (
                <Reveal key={r.role} preset="right" delay={i * 0.05}>
                  <div className="rounded-2xl border border-border bg-white p-6">
                    <h3 className="font-sans font-extrabold text-foreground text-[1rem] mb-4">{r.role}</h3>
                    <ul className="space-y-2">
                      {r.responsibilities.map((resp, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                          <span className="text-muted leading-relaxed text-[0.93rem]">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}
