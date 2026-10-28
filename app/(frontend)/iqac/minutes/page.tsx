import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import IQACQuickNav from '@/components/IQACQuickNav';

export const metadata: Metadata = {
  title: 'IQAC MoM — IQAC — MLRIT',
  description: 'Minutes of IQAC meetings at MLR Institute of Technology, academic year-wise.',
};

// Source: mlrit.ac.in/iqac-mom/ (redirects to /iqac/iqac-mom/ on the legacy
// site). Recent years live on files.mlrit.ac.in; older years on the legacy
// uploads folder.
const DOCS = [
  { tag: 'Governance', label: 'IQAC MoM A.Y. 2025-2026', href: 'https://files.mlrit.ac.in/iqac/IQAC_MOM_2025-26.pdf' },
  { tag: 'Governance', label: 'IQAC MoM A.Y. 2024-2025', href: 'https://files.mlrit.ac.in/iqac/IQAC_MOM_2024-25.pdf' },
  { tag: 'Governance', label: 'IQAC MoM A.Y. 2023-2024', href: 'https://files.mlrit.ac.in/iqac/IQAC_MOM_2023-24.pdf' },
  { tag: 'Governance', label: 'IQAC MoM A.Y. 2022-2023', href: 'https://files.mlrit.ac.in/Iqac/IQAC-2022.pdf' },
  { tag: 'Governance', label: 'IQAC MoM A.Y. 2017-2018', href: 'https://mlrit.ac.in/wp-content/uploads/iqac/17-18-IQAC.pdf' },
  { tag: 'Governance', label: 'IQAC MoM A.Y. 2016-2017', href: 'https://mlrit.ac.in/wp-content/uploads/iqac/16-17-IQAC.pdf' },
];

export default function IqacMinutesPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="IQAC MoM"
        italic=""
        dek="Minutes of Internal Quality Assurance Cell meetings, published academic year-wise."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Minutes of Meeting' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/minutes" />

      <Section id="documents">
        <H2 italic="">Minutes of Meeting</H2>
        <Lede>Download the minutes of each IQAC meeting by academic year.</Lede>
        <div className="mt-5 md:mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {DOCS.map((d) => (
            <a
              key={d.label}
              href={d.href}
              target={d.href.startsWith('http') ? '_blank' : undefined}
              rel={d.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group block rounded-2xl border border-border bg-white p-4 md:p-6 hover:border-secondary hover:-translate-y-1 transition-all"
            >
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-secondary mb-2">{d.tag}</div>
              <div className="font-sans font-extrabold text-foreground text-[0.95rem] group-hover:text-secondary transition-colors leading-snug">{d.label}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-secondary font-semibold text-[0.78rem] group-hover:gap-2 transition-all">Open →</div>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
