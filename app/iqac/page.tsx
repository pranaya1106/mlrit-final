import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'about',        label: 'About IQAC'      },
  { id: 'objectives',   label: 'Objectives'      },
  { id: 'functions',    label: 'Functions'       },
  { id: 'composition',  label: 'Composition'     },
  { id: 'aqar',         label: 'AQAR Reports'    },
  { id: 'accreditation',label: 'Accreditation'   },
];

export default function IQACPage() {
  const objectives = [
    'Foster a culture of continuous quality improvement across departments.',
    'Coordinate self-study reports, AQAR submissions, and external audits.',
    'Promote outcome-based education (OBE) and curriculum alignment.',
    'Champion student-feedback systems and academic excellence metrics.',
    'Drive accreditation cycles — NAAC, NBA, ARIIA, NIRF.',
  ];
  const functions = [
    'Develop and apply quality benchmarks for teaching, research and student support.',
    'Disseminate information on quality parameters of higher education.',
    'Coordinate quality-related activities including audits and reviews.',
    'Document quality initiatives leading to continual improvement.',
    'Act as the nodal agency for IQA-related activities of the institution.',
  ];
  const composition = [
    'Chairperson — Principal',
    'Senior Administrative Officers',
    'Three to eight senior teachers',
    'One nominee from local society / industry / stakeholders',
    'One nominee from alumni',
    'IQAC Coordinator — convenor',
  ];

  return (
    <>
      <PageHeader
        eyebrow="Quality Assurance"
        title="Internal Quality Assurance Cell"
        italic="(IQAC)"
        dek="The IQAC at MLRIT plans, guides and monitors quality assurance and quality enhancement activities of the institution — a single cell coordinating all accreditation, audit and improvement initiatives."
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

          <Section id="about">
            <H2 italic="of IQAC">About</H2>
            <Lede>IQAC operates as the apex body for all quality-related activities at MLRIT — combining academic leadership, faculty representation and external stakeholders.</Lede>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                { h: 'Vision', p: 'To create a culture of academic excellence, innovation and quality enhancement across all programmes and processes at MLRIT.' },
                { h: 'Mission', p: 'To institutionalise quality through assessment, accreditation and benchmarking — strengthening MLRIT\'s identity as a premier engineering institution.' },
                { h: 'Head IQAC', p: 'Dr. K. Srinivas Rao, Professor & IQAC Coordinator — leading quality initiatives, audits and accreditation work.' },
              ].map((c) => (
                <div key={c.h} className="rounded-2xl border border-border bg-white p-7">
                  <div className="font-mono font-semibold text-[0.7rem] tracking-[0.18em] uppercase text-secondary">{c.h}</div>
                  <p className="mt-3 text-foreground leading-relaxed">{c.p}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="objectives" surface>
            <H2 italic="for Quality Enhancement">Key Objectives</H2>
            <ul className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-4">
              {objectives.map((o) => (
                <li key={o} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                  <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-primary" />
                  {o}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="functions">
            <H2 italic="of IQAC">Functions</H2>
            <ol className="mt-6 space-y-4 list-decimal pl-6">
              {functions.map((f) => <li key={f} className="text-foreground leading-relaxed text-[1.02rem]">{f}</li>)}
            </ol>
          </Section>

          <Section id="composition" surface>
            <H2 italic="of IQAC">Composition</H2>
            <Lede>The cell brings together institutional leadership, faculty, alumni and external stakeholders.</Lede>
            <ul className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-3.5">
              {composition.map((m) => (
                <li key={m} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                  <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-secondary" />
                  {m}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="aqar">
            <H2 italic="and Documents">AQAR Reports</H2>
            <Lede>Annual Quality Assurance Reports submitted to NAAC for assessment cycles.</Lede>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {['2023-24', '2022-23', '2021-22'].map((yr) => (
                <a key={yr} href="#" className="rounded-2xl border border-border bg-white p-6 hover:border-primary hover:-translate-y-1 transition-all block">
                  <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">AQAR</div>
                  <div className="mt-2 font-sans font-black text-foreground text-2xl tracking-tighter-2">{yr}</div>
                  <div className="mt-4 inline-flex items-center gap-2 text-primary font-semibold text-sm">Download PDF →</div>
                </a>
              ))}
            </div>
          </Section>

          <Section id="accreditation" surface>
            <H2 italic="(NAAC, NBA, NIRF)">Accreditation Pages</H2>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              <a href="/iqac/naac" className="block rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all">
                <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">Accreditation</div>
                <div className="mt-2 font-sans font-black text-foreground text-2xl">NAAC</div>
                <div className="mt-3 text-muted">National Assessment and Accreditation Council — institutional accreditation.</div>
              </a>
              <a href="/iqac/nba" className="block rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all">
                <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">Accreditation</div>
                <div className="mt-2 font-sans font-black text-foreground text-2xl">NBA</div>
                <div className="mt-3 text-muted">National Board of Accreditation — programme-level accreditation.</div>
              </a>
              <a href="#" className="block rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all">
                <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">Ranking</div>
                <div className="mt-2 font-sans font-black text-foreground text-2xl">NIRF</div>
                <div className="mt-3 text-muted">National Institutional Ranking Framework — annual engineering category ranks.</div>
              </a>
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}
