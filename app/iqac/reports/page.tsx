import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Reports & Documents — IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'aqar-reports', label: 'AQAR Reports' },
  { id: 'minutes', label: 'Minutes' },
  { id: 'audit-reports', label: 'Audit Reports' },
  { id: 'policy-documents', label: 'Policy Documents' },
];

const AQAR_REPORTS = [
  { label: 'AQAR Reports',                  href: '/iqac/aqar',                          tag: 'Annual Report' },
];

const MINUTES = [
  { label: 'IQAC Minutes of Meeting',       href: 'https://mlrit.ac.in/iqac-mom/',       tag: 'Governance'    },
];

const OTHER_REPORTS = [
  { label: 'Strategic Perspective Plan',    href: 'https://mlrit.ac.in/iqac/',           tag: 'Planning'      },
  { label: 'Policies',                      href: 'https://mlrit.ac.in/iqac/policies/',  tag: 'Policy'        },
  { label: 'Newsletters',                   href: 'https://mlrit.ac.in/iqac/',           tag: 'Publications'  },
  { label: 'NBA — Programme Accreditation', href: '/iqac/nba',                           tag: 'Accreditation' },
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Reports & Documents"
        italic=""
        dek="Access IQAC reports, governance documents, policies, AQAR submissions and accreditation records."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Reports & Documents' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/reports" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="aqar-reports">
            <H2 italic="">AQAR Reports</H2>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {AQAR_REPORTS.map((r) => (
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

          <Section id="minutes">
            <H2 italic="">Minutes</H2>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {MINUTES.map((r) => (
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

          <Section id="audit-reports">
            <H2 italic="">Audit Reports</H2>
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-warm-light/40 p-8 text-center">
              <p className="text-muted italic text-[0.95rem]">Content to be updated.</p>
            </div>
          </Section>

          <Section id="policy-documents">
            <H2 italic="">Policy Documents</H2>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {OTHER_REPORTS.map((r) => (
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
