import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import IQACQuickNav from '@/components/IQACQuickNav';
import { Section, H2, Lede } from '@/components/PageSection';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'NBA — MLRIT' };

const NAV_ITEMS = [
  { id: 'about',       label: 'About NBA'    },
  { id: 'programmes',  label: 'Programmes'   },
  { id: 'dcp',         label: 'DCP Reports'  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function NBAPage() {
  const programmes = [
    { dept: 'Computer Science & Engineering',  code: 'CSE',  cycle: '2022–2025', status: 'Accredited', dcp: '/iqac/dcp-cse.pdf'  },
    { dept: 'Electronics & Communication',     code: 'ECE',  cycle: '2022–2025', status: 'Accredited', dcp: '/iqac/dcp-ece.pdf'  },
    { dept: 'Mechanical Engineering',          code: 'MECH', cycle: '2022–2025', status: 'Accredited', dcp: '/iqac/dcp-mech.pdf'   },
    { dept: 'Aeronautical Engineering',        code: 'AERO', cycle: '2022–2025', status: 'Accredited', dcp: '/iqac/dcp-aero.pdf' },
    { dept: 'CSE — Data Science',              code: 'DS',   cycle: '2022–2025', status: 'Accredited', dcp: '/iqac/dcp-ds.pdf'   },
    { dept: 'CSE — AI & Machine Learning',     code: 'AIML', cycle: '2022–2025', status: 'Accredited', dcp: '/iqac/dcp-aiml.pdf' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Accreditation"
        title="NBA — Programme"
        italic="accreditation."
        dek="National Board of Accreditation — programme-level accreditation for engineering branches at MLR Institute of Technology, validating outcome-based education quality."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'NBA' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/nba" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {/* About NBA */}
          <Section id="about">
            <H2 italic="NBA">About</H2>
            <div className="mt-6 grid md:grid-cols-2 gap-8">
              <Reveal preset="right">
                <p className="text-foreground leading-relaxed text-[1.05rem]">
                  The National Board of Accreditation (NBA) is an autonomous body that evaluates the quality of technical programmes in India. NBA accreditation signifies that a programme meets the defined standards of quality in terms of curriculum, infrastructure, faculty, and outcomes.
                </p>
                <p className="mt-4 text-muted leading-relaxed text-[1rem]">
                  MLRIT holds NBA accreditation for multiple engineering programmes under the Tier-1 framework — affirming the institution&apos;s commitment to outcome-based education (OBE) and continuous quality improvement.
                </p>
              </Reveal>
              <Reveal preset="up" delay={0.1}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: '6',       sub: 'Accredited Programmes' },
                    { val: 'Tier-I',  sub: 'NBA Framework'         },
                    { val: 'OBE',     sub: 'Outcome Based Edu.'    },
                    { val: '2025',    sub: 'Current Cycle End'      },
                  ].map((s) => (
                    <div key={s.sub} className="rounded-2xl border border-border bg-warm-light p-6">
                      <div className="font-sans font-black text-secondary tracking-tighter-2 text-[1.8rem] leading-none">{s.val}</div>
                      <div className="mt-2 font-mono text-muted text-[0.7rem] tracking-wide uppercase">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Section>

          {/* Accredited Programmes */}
          <Section id="programmes" surface>
            <H2 italic="programmes">Accredited</H2>
            <Lede>The following B.Tech programmes at MLRIT are currently accredited by the National Board of Accreditation under the Tier-1 framework.</Lede>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-card-soft">
              <table className="w-full text-left">
                <thead className="bg-warm-light/60 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted">Programme</th>
                    <th className="px-6 py-4 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted hidden md:table-cell">Accreditation Cycle</th>
                    <th className="px-6 py-4 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted">Status</th>
                    <th className="px-6 py-4 font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted">DCP</th>
                  </tr>
                </thead>
                <tbody>
                  {programmes.map((p, i) => (
                    <tr key={p.code} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-warm-light/20'}`}>
                      <td className="px-6 py-4">
                        <div className="font-sans font-bold text-foreground">{p.dept}</div>
                        <div className="font-mono text-muted text-[0.7rem] tracking-wide mt-0.5">{p.code}</div>
                      </td>
                      <td className="px-6 py-4 text-foreground font-mono text-[0.88rem] hidden md:table-cell">{p.cycle}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-secondary font-semibold text-[0.75rem]">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={p.dcp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-secondary font-semibold text-[0.82rem] hover:gap-2.5 transition-all"
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                            <path d="M6.5 1.5v7M4 6.5l2.5 2.5 2.5-2.5M1.5 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* DCP Reports */}
          <Section id="dcp">
            <H2 italic="Reports">DCP</H2>
            <Lede>Departmental Compliance Profile (DCP) documents for each NBA-accredited programme at MLRIT.</Lede>
            <Stagger className="mt-8 grid md:grid-cols-3 gap-5" delay={0.07}>
              {programmes.map((p) => (
                <StaggerItem key={p.code}>
                  <a
                    href={p.dcp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border-2 border-border bg-white p-7 hover:border-secondary hover:-translate-y-1 transition-all h-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-secondary" aria-hidden>
                        <path d="M4 2h10a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase text-secondary mb-2">{p.code}</div>
                    <h3 className="font-sans font-extrabold text-foreground text-[0.95rem] leading-snug group-hover:text-secondary transition-colors">{p.dept}</h3>
                    <p className="mt-2 text-muted text-[0.82rem]">DCP — {p.cycle}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-secondary font-semibold text-[0.8rem] group-hover:gap-2.5 transition-all">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                        <path d="M6.5 1.5v7M4 6.5l2.5 2.5 2.5-2.5M1.5 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download PDF
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </Section>

        </div>
      </div>
    </>
  );
}
