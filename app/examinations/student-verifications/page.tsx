import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal from '@/components/motion/Reveal';
import DocActions from '@/components/examinations/DocActions';

export const metadata: Metadata = {
  title: 'Student Verifications — Examinations — MLRIT',
  description: 'Request authentication of MLRIT degree, grade card or provisional certificate credentials.',
};

const USE_CASES = [
  { title: 'Employment Verification', desc: 'Employers verifying degree and grade card authenticity prior to joining.' },
  { title: 'Higher Studies (India)', desc: 'Postgraduate admission requiring verified transcripts or degree certificates.' },
  { title: 'Abroad Applications', desc: 'Foreign universities requiring WES, NACES or direct institution-to-institution verification.' },
  { title: 'Government Agencies', desc: 'PSU or government service verifications requiring attested copies of degree and grade cards.' },
  { title: 'Background Checks', desc: 'Third-party screening agencies conducting education background checks.' },
];

export default function StudentVerificationsPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Examinations"
        title="Student"
        italic="Verifications."
        dek="Official authentication of MLRIT degree certificates, grade cards and provisional certificates for employment, higher studies and government agencies."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Student Verifications' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/student-verifications" />

      <section className="bg-warm-light py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 lg:px-20 space-y-6">

          {/* Download form */}
          <Reveal preset="up">
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-2">Step 1</p>
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-2">
                Download the Verification Form
              </h3>
              <p className="text-muted text-[0.88rem] leading-relaxed mb-5">
                Download and complete the Student Verification Form. This form is required for all credential authentication requests submitted to the COE office.
              </p>
              <DocActions href="/examinations/student-verification.pdf" viewLabel="View Form" downloadLabel="Download Form" />
            </div>
          </Reveal>

          {/* Submit instructions */}
          <Reveal preset="up" delay={0.08}>
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-2">Step 2</p>
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-2">
                Submit to the COE Office
              </h3>
              <p className="text-muted text-[0.88rem] leading-relaxed mb-4">
                Submit the completed form in person at the COE office (Administrative Block) or send it by email to{' '}
                <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">
                  coe@mlrinstitutions.ac.in
                </a>.
                Attach a copy of the document to be verified and a valid government-issued ID proof.
              </p>
              <p className="text-muted text-[0.85rem] leading-relaxed">
                <span className="font-semibold text-foreground">Processing time:</span> 5–7 working days for standard requests. Urgent requests may be accommodated subject to workload — contact the office in advance.
              </p>
            </div>
          </Reveal>

          {/* Use cases */}
          <Reveal preset="up" delay={0.14}>
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-5">Verification is accepted for</h3>
              <ul className="space-y-3">
                {USE_CASES.map((u) => (
                  <li key={u.title} className="flex items-start gap-3">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    <div>
                      <span className="font-sans font-semibold text-foreground text-[0.88rem]">{u.title}</span>
                      <span className="text-muted text-[0.85rem]"> — {u.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal preset="up" delay={0.2}>
            <div className="p-5 rounded-xl border border-border bg-white flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.85rem] leading-relaxed">
                For WES or international credential evaluations, contact the COE office directly — additional supporting documents may be required. See the{' '}
                <a href="/examinations/contact" className="text-secondary font-semibold hover:underline">Contact Us</a> page for office details.
              </p>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
