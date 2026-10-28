import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import IQACQuickNav from '@/components/IQACQuickNav';

export const metadata: Metadata = {
  title: 'Policies — IQAC — MLRIT',
  description:
    'Institutional policy documents at MLR Institute of Technology — admission, examination, research, IP, consultancy, welfare and quality systems.',
};

// Source: mlrit.ac.in/iqac/policies/ — PDFs on files.mlrit.ac.in.
const DOCS = [
  { tag: 'Policy', label: 'Admission Policy', href: 'https://files.mlrit.ac.in/iqac/Admission-Policy.pdf' },
  { tag: 'Policy', label: 'Consultancy Policy', href: 'https://files.mlrit.ac.in/uploads/Committees/CONSULTANCY_POLICY.pdf' },
  { tag: 'Policy', label: 'Examination Policy', href: 'https://files.mlrit.ac.in/iqac/Examination-Policy.pdf' },
  { tag: 'Policy', label: 'IT Policy and SOP', href: 'https://files.mlrit.ac.in/iqac/IT-Policy-and-SOP.pdf' },
  { tag: 'Policy', label: 'Recruitment Policy & Service Rules', href: 'https://files.mlrit.ac.in/iqac/Recruitment-policy-and-service-rules.pdf' },
  { tag: 'Policy', label: 'Student Welfare Policy', href: 'https://files.mlrit.ac.in/iqac/Student-Welfare-Policy.pdf' },
  { tag: 'Policy', label: 'TLC Policy', href: 'https://files.mlrit.ac.in/iqac/TLC-Policy.pdf' },
  { tag: 'Policy', label: 'Mentor Policy', href: 'https://files.mlrit.ac.in/iqac/MLRIT_MENTOR_POLICY.pdf' },
  { tag: 'Policy', label: 'ESQP Policy', href: 'https://files.mlrit.ac.in/iqac/MLRIT_ESQP_POLICY.pdf' },
  { tag: 'Policy', label: 'ITEAM Policy', href: 'https://files.mlrit.ac.in/iqac/MLRIT_ITEAM_POLICY.pdf' },
  { tag: 'Policy', label: 'PBAS Policy', href: 'https://files.mlrit.ac.in/iqac/PBAS_POLICY_FINAL.pdf' },
  { tag: 'SOP', label: 'Feedback SOP', href: 'https://files.mlrit.ac.in/iqac/SOP_Feedback_03.pdf' },
];

export default function IqacPoliciesPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Policies"
        italic=""
        dek="Institutional policies governing admission, examination, research, intellectual property, consultancy and student welfare."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Policies' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/policies" />

      <Section id="documents">
        <H2 italic="">Policy Documents</H2>
        <Lede>Download institutional policy documents by area.</Lede>
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
