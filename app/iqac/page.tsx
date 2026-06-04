import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview'     },
  { id: 'head',         label: 'Head IQAC'    },
  { id: 'objectives',   label: 'Objectives'   },
  { id: 'functions',    label: 'Functions'    },
  { id: 'composition',  label: 'Composition'  },
  { id: 'reports',      label: 'Reports'      },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function IQACPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quality Assurance"
        title="Internal Quality Assurance Cell (IQAC)"
        italic=""
        dek="With a prime mission to develop a system of conscious, consistent and catalytic improvement in the overall performance of the institution, IQAC has been established at MLRIT to promote holistic academic excellence."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC' }]}
        variant="green"
      />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {/* Overview */}
          <Section id="overview">
            <H2 italic="of IQAC">Overview</H2>
            <div className="mt-6 grid md:grid-cols-2 gap-8">
              <Reveal preset="right">
                <p className="text-foreground leading-relaxed text-[1.05rem]">
                  IQAC is a part of the institution's system and works towards realisation of the goals of quality enhancement and sustenance. All the efforts and measures of the institute are channelised towards promoting holistic academic excellence through IQAC.
                </p>
                <p className="mt-4 text-muted leading-relaxed text-[1rem]">
                  The cell coordinates self-study reports, AQAR submissions, external audits, outcome-based education initiatives and benchmarking activities — acting as the nodal agency for all internal quality assurance activities.
                </p>
              </Reveal>
              <Reveal preset="up" delay={0.1}>
                <div className="rounded-2xl border-2 border-secondary bg-green-50/40 p-7">
                  <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary mb-3">Vision</div>
                  <p className="font-sans font-extrabold text-foreground text-[1.1rem] leading-snug">
                    To ensure quality culture as the prime concern of the Institution through institutionalising and internalising of all the initiatives taken with internal and external support.
                  </p>
                </div>
              </Reveal>
            </div>
          </Section>

          {/* Head IQAC */}
          <Section id="head" surface>
            <H2 italic="IQAC">Head</H2>
            <Reveal preset="up">
              <div className="mt-6 rounded-2xl border border-border bg-white p-8 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary mb-2">Head IQAC</div>
                  <h3 className="font-sans font-black text-foreground text-[1.4rem] tracking-tight">Dr. Radhika Devi V</h3>
                  <p className="mt-1 font-mono text-muted text-[0.78rem] tracking-wide uppercase">Director · Dean H&S · Head IQAC</p>
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
                      <span key={a} className="px-3 py-1.5 rounded-full bg-warm-light border border-border font-sans text-[0.82rem] text-foreground">
                        {a}
                      </span>
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

          {/* Objectives */}
          <Section id="objectives">
            <H2 italic="of IQAC">Objectives</H2>
            <Lede>The primary aim of IQAC is to drive conscious, consistent and catalytic improvement across all institutional activities.</Lede>
            <Stagger className="mt-8 grid md:grid-cols-2 gap-5" delay={0.07}>
              {[
                { n: '01', t: 'Develop Quality Systems', d: 'Develop a system for conscious, consistent and catalytic action to improve the academic and administrative performance of the institution.' },
                { n: '02', t: 'Promote Quality Culture', d: 'Promote measures for institutional functioning towards quality enhancement through internalization of quality culture and institutionalization of best practices.' },
                { n: '03', t: 'OBE & Curriculum', d: 'Champion outcome-based education (OBE) and curriculum alignment across all programmes and regulations.' },
                { n: '04', t: 'Student Feedback Systems', d: 'Implement and monitor student-feedback systems, academic excellence metrics and continuous improvement processes.' },
                { n: '05', t: 'Accreditation Drive', d: 'Coordinate and lead all accreditation cycles including NBA, NIRF, ARIIA — ensuring sustained quality benchmarks.' },
              ].map((o) => (
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

          {/* Functions */}
          <Section id="functions" surface>
            <H2 italic="of IQAC">Functions</H2>
            <div className="mt-8 flex flex-col gap-3">
              {[
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
              ].map((f, i) => (
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

          {/* Composition */}
          <Section id="composition">
            <H2 italic="of IQAC">Composition</H2>
            <Lede>The cell brings together institutional leadership, faculty, alumni and external stakeholders to ensure comprehensive quality oversight.</Lede>
            <Stagger className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
              {[
                { role: 'Chairperson',             name: 'Principal',                                     tag: 'Leadership' },
                { role: 'Head IQAC',               name: 'Dr. Radhika Devi V, Director & Dean H&S',       tag: 'Coordinator' },
                { role: 'Senior Administrative',   name: 'Officers of the Institution',                   tag: 'Administration' },
                { role: 'Senior Teachers',         name: 'Three to Eight Faculty Members',                tag: 'Faculty' },
                { role: 'External Stakeholder',    name: 'Nominee from Local Society / Industry',         tag: 'External' },
                { role: 'Alumni Representative',   name: 'One Nominee from Alumni',                       tag: 'Alumni' },
              ].map((m) => (
                <StaggerItem key={m.role}>
                  <div className="rounded-2xl border border-border bg-white p-6 h-full hover:border-secondary transition-colors">
                    <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-primary mb-2">{m.tag}</div>
                    <div className="font-sans font-extrabold text-foreground text-[0.95rem]">{m.role}</div>
                    <div className="mt-1.5 text-muted text-[0.88rem] leading-snug">{m.name}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Section>

          {/* Reports & Links */}
          <Section id="reports" surface>
            <H2 italic="and Documents">Reports</H2>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { label: 'Strategic Perspective Plan',  href: 'https://mlrit.ac.in/iqac/',        tag: 'Planning' },
                { label: 'IQAC Minutes of Meeting',     href: 'https://mlrit.ac.in/iqac-mom/',    tag: 'Governance' },
                { label: 'Policies',                    href: 'https://mlrit.ac.in/iqac/policies/', tag: 'Policy' },
                { label: 'AQAR Reports',                href: 'https://mlrit.ac.in/aqar/',         tag: 'Annual Report' },
                { label: 'Newsletters',                 href: 'https://mlrit.ac.in/iqac/',        tag: 'Publications' },
                { label: 'NBA — Programme Accreditation', href: '/iqac/nba',                       tag: 'Accreditation' },
              ].map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group block rounded-2xl border border-border bg-white p-6 hover:border-secondary hover:-translate-y-1 transition-all"
                >
                  <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-secondary mb-2">{r.tag}</div>
                  <div className="font-sans font-extrabold text-foreground text-[0.95rem] group-hover:text-secondary transition-colors leading-snug">{r.label}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-secondary font-semibold text-[0.78rem] group-hover:gap-2 transition-all">Open →</div>
                </a>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}
