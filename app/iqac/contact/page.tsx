import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';

export const metadata: Metadata = { title: 'Contact IQAC — MLRIT' };

const CONTACT_DETAILS = [
  { label: 'Head IQAC',    value: 'Dr. Radhika Devi V — Director & Dean H&S' },
  { label: 'Phone',        value: '+91-40-2304 4444' },
  { label: 'Email',        value: 'iqac@mlrit.ac.in' },
  { label: 'Address',      value: 'IQAC Office, MLRIT, Dundigal, Hyderabad – 500 043, Telangana, India' },
  { label: 'Office Hours', value: 'Monday – Saturday, 9:00 AM – 5:00 PM' },
];

export default function ContactIQACPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Contact IQAC"
        italic=""
        dek="Reach out to the IQAC office for queries on accreditation, quality assurance reports, feedback forms or any IQAC activities."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Contact IQAC' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/contact" />
      <Section>
        <H2 italic="">Contact IQAC</H2>
        <Reveal preset="up">
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-white p-8 space-y-5">
              {CONTACT_DETAILS.map((c) => (
                <div key={c.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted">{c.label}</span>
                  <span className="text-foreground text-[0.95rem] leading-snug">{c.value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border-2 border-secondary bg-green-50/40 p-8 flex flex-col justify-center gap-4">
              <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Send a Query</div>
              <p className="text-foreground leading-relaxed text-[0.97rem]">
                For questions related to accreditation, quality assurance reports, feedback forms or IQAC activities, write to us directly or visit the IQAC office during working hours.
              </p>
              <a
                href="mailto:iqac@mlrit.ac.in"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-secondary text-white font-semibold text-[0.88rem] hover:bg-secondary/90 transition-colors w-fit"
              >
                Email IQAC →
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
