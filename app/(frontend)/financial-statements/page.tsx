import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';

export const metadata: Metadata = {
  title: 'Financial Statements — MLRIT',
  description: 'Year-wise financial statements of MLR Institute of Technology.',
};

// Source: mlrit.ac.in/financial-statements/ — PDFs on files.mlrit.ac.in.
const DOCS = [
  { tag: 'Statement', label: 'F.Y 2023-24', href: 'https://files.mlrit.ac.in/uploads/Committees/FY_2023-24.pdf' },
  { tag: 'Statement', label: 'F.Y 2022-23', href: 'https://files.mlrit.ac.in/uploads/FY_2022-23.pdf' },
  { tag: 'Statement', label: 'F.Y 2021-22', href: 'https://files.mlrit.ac.in/uploads/FY_2021-22.pdf' },
];

export default function FinancialStatementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Financial Statements"
        italic=""
        dek="Audited financial statements of the institution, published year-wise."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Financial Statements' }]}
      />

      <Section id="documents">
        <H2 italic="">Statements</H2>
        <Lede>Year-wise financial statements hosted on the institutional file server.</Lede>
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
