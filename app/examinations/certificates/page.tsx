import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import DocActions from '@/components/examinations/DocActions';

export const metadata: Metadata = {
  title: 'Application of Certificates — Examinations — MLRIT',
  description: 'Apply for provisional certificate, degree certificate, transcript, migration certificate and other official documents from the MLRIT COE office.',
};

const CERTIFICATES = [
  {
    title: 'Provisional Certificate',
    desc: 'Issued to graduating students after clearing all dues and obtaining library NOC. Used for employment and PG admissions until the degree certificate is ready.',
    timeline: '15 working days after final semester result',
    fee: 'As per schedule',
  },
  {
    title: 'Degree Certificate',
    desc: 'The official degree conferred during the annual convocation. Students who cannot attend convocation may collect it from the administrative office.',
    timeline: 'Issued at/after convocation',
    fee: 'As per schedule',
  },
  {
    title: 'Consolidated Grade Card',
    desc: 'A single document listing all semester grades from I to VIII (B.Tech) or I to IV (M.Tech / MBA). Required for GATE, GRE, UPSC applications.',
    timeline: '10 working days',
    fee: 'As per schedule',
  },
  {
    title: 'Official Transcript',
    desc: 'Sealed, signed transcript for foreign universities, WES/NACES credential evaluators or employment abroad.',
    timeline: '10 working days',
    fee: 'As per schedule',
  },
  {
    title: 'Migration Certificate',
    desc: 'Required for students transferring to another university. Issued only after all dues are cleared.',
    timeline: '15 working days',
    fee: 'As per schedule',
  },
  {
    title: 'Medium of Instruction (MOI) Letter',
    desc: 'Certifies that the medium of instruction was English throughout the programme. Required for foreign university applications.',
    timeline: '5 working days',
    fee: 'As per schedule',
  },
  {
    title: 'Duplicate Grade Card',
    desc: 'Replacement for a lost or damaged grade card. Requires an affidavit and prescribed fee.',
    timeline: '7 working days',
    fee: 'As per schedule',
  },
  {
    title: 'Name Correction',
    desc: 'Correction of name in official records on submission of gazette notification or court affidavit.',
    timeline: '10 working days',
    fee: 'As per schedule',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function CertificatesPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Examinations"
        title="Application of"
        italic="Certificates."
        dek="Apply for official documents from the Controller of Examinations — provisional certificates, transcripts, grade cards, migration certificates and more."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Application of Certificates' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/certificates" />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

          {/* Application form download */}
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Start Here</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              Download the{' '}
              <span className="font-display italic font-medium" style={gradientText}>application form.</span>
            </h2>
            <p className="mt-4 text-muted text-[0.93rem] max-w-[600px] leading-relaxed">
              A single application form covers all certificate types. Select the certificate(s) you need, complete the form and submit it to the COE office in person or by email.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <DocActions href="/examinations/apply-for-certificates.pdf" viewLabel="View Form" downloadLabel="Download Form" />
              <a
                href="/examinations/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-secondary transition-colors"
              >
                Contact COE Office →
              </a>
            </div>
          </Reveal>

          {/* Certificate cards */}
          <div className="mt-16">
            <Reveal>
              <span className="font-mono text-[0.68rem] font-bold tracking-[0.2em] uppercase text-muted">Available Documents</span>
            </Reveal>
            <Stagger className="mt-6 grid md:grid-cols-2 gap-4" delay={0.05}>
              {CERTIFICATES.map((c) => (
                <StaggerItem key={c.title}>
                  <div className="rounded-2xl border border-border bg-warm-light p-6 h-full">
                    <h3 className="font-sans font-extrabold text-foreground text-[0.97rem] mb-2">{c.title}</h3>
                    <p className="text-muted text-[0.84rem] leading-relaxed mb-4">{c.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-border font-mono text-[0.65rem] font-bold text-secondary">
                        {c.timeline}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Submission note */}
          <Reveal preset="up" delay={0.2}>
            <div className="mt-12 p-5 rounded-xl border border-border bg-warm-light flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.85rem] leading-relaxed">
                Submit your completed application at the COE office (Administrative Block) or email it to{' '}
                <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">
                  coe@mlrinstitutions.ac.in
                </a>. Attach supporting documents and proof of fee payment where applicable.
              </p>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
