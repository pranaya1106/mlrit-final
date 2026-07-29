import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import IQACQuickNav from '@/components/IQACQuickNav';
import { Section, H2, Lede } from '@/components/PageSection';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'AQAR — IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'about',   label: 'About AQAR' },
  { id: 'reports', label: 'Reports'    },
];

const REPORTS = [
  { year: '2023–24', file: '/iqac/aqar/aqar-2023-24.pdf', available: true,  latest: true  },
  { year: '2022–23', file: '/iqac/aqar/aqar-2022-23.pdf', available: true,  latest: false },
  { year: '2020–21', file: '/iqac/aqar/aqar-2020-21.pdf', available: false, latest: false },
  { year: '2019–20', file: '/iqac/aqar/aqar-2019-20.pdf', available: false, latest: false },
  { year: '2018–19', file: '/iqac/aqar/aqar-2018-19.pdf', available: false, latest: false },
  { year: '2017–18', file: '/iqac/aqar/aqar-2017-18.pdf', available: false, latest: false },
  { year: '2016–17', file: '/iqac/aqar/aqar-2016-17.pdf', available: false, latest: false },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function AQARPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Annual Quality"
        italic="Assurance Reports."
        dek="AQAR — Annual Quality Assurance Reports submitted by MLRIT to NAAC as part of the institutional accreditation cycle, documenting quality initiatives, outcomes and improvements each academic year."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'AQAR' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/aqar" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {/* About */}
          <Section id="about">
            <H2 italic="">About AQAR</H2>
            <div className="mt-6 grid md:grid-cols-2 gap-8">
              <Reveal preset="right">
                <p className="text-foreground leading-relaxed text-[1.05rem]">
                  The Annual Quality Assurance Report (AQAR) is a yearly report prepared and submitted by MLRIT&apos;s Internal Quality Assurance Cell (IQAC) to NAAC. It documents the quality initiatives undertaken, academic outcomes achieved and improvements made during the academic year.
                </p>
                <p className="mt-4 text-muted leading-relaxed text-[1rem]">
                  AQAR submission is a mandatory requirement for all NAAC-accredited institutions and forms a key part of the continuous quality assessment process. It covers curriculum, teaching-learning, research, infrastructure, student support and governance.
                </p>
              </Reveal>
              <Reveal preset="up" delay={0.1}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: '7+',    sub: 'Years of Reports'       },
                    { val: 'NAAC',  sub: 'Submitted To'           },
                    { val: 'IQAC',  sub: 'Prepared By'            },
                    { val: 'Annual', sub: 'Submission Frequency'  },
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

          {/* Reports */}
          <Section id="reports" surface>
            <H2 italic="">AQAR Reports</H2>
            <Lede>Annual Quality Assurance Reports for each academic year. Click to download the PDF.</Lede>
            <Stagger className="mt-8 grid md:grid-cols-3 lg:grid-cols-4 gap-4" delay={0.06}>
              {REPORTS.map((r) => (
                <StaggerItem key={r.year}>
                  {r.available ? (
                    <a
                      href={r.file}
                      download
                      className="group block rounded-2xl border-2 border-border bg-white p-6 hover:border-secondary hover:-translate-y-1 transition-all text-center"
                    >
                      {r.latest && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.58rem] font-bold tracking-wide uppercase mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                          Latest
                        </span>
                      )}
                      <div className="font-sans font-black text-foreground text-[1.4rem] tracking-tighter-2 group-hover:text-secondary transition-colors">
                        {r.year}
                      </div>
                      <div className="mt-1 font-mono text-muted text-[0.68rem] tracking-wide uppercase">AQAR</div>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-secondary font-bold text-[0.78rem] group-hover:gap-2.5 transition-all">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                          <path d="M6.5 1.5v7M4 6.5l2.5 2.5 2.5-2.5M1.5 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download PDF
                      </div>
                    </a>
                  ) : (
                    <div className="block rounded-2xl border-2 border-dashed border-border bg-warm-light/40 p-6 text-center opacity-60">
                      <div className="font-sans font-black text-foreground text-[1.4rem] tracking-tighter-2">{r.year}</div>
                      <div className="mt-1 font-mono text-muted text-[0.68rem] tracking-wide uppercase">AQAR</div>
                      <div className="mt-4 font-mono text-muted text-[0.7rem]">Contact IQAC Office</div>
                    </div>
                  )}
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal preset="up" delay={0.3}>
              <div className="mt-8 p-5 rounded-xl border border-border bg-white flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-secondary shrink-0 mt-0.5" aria-hidden>
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <p className="text-muted text-[0.88rem] leading-relaxed">
                  For reports not available for download, please contact the IQAC office at{' '}
                  <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">
                    coe@mlrinstitutions.ac.in
                  </a>{' '}
                  or call <a href="tel:+919652226061" className="text-secondary font-semibold hover:underline">+91 96522 26061</a>.
                </p>
              </div>
            </Reveal>
          </Section>

        </div>
      </div>
    </>
  );
}
