import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Contact IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'contact', label: 'Contact Details' },
  { id: 'send-query', label: 'Send Query' },
];

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

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="contact">
            <H2 italic="">Contact Details</H2>
            <Reveal preset="up">
              <div className="mt-6 rounded-2xl border border-border bg-white p-8 space-y-5 max-w-[560px]">
                {CONTACT_DETAILS.map((c) => (
                  <div key={c.label} className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted">{c.label}</span>
                    <span className="text-foreground text-[0.95rem] leading-snug">{c.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </Section>

          <Section id="send-query">
            <H2 italic="">Send Query</H2>
            <Reveal preset="up">
              <div className="mt-6 rounded-2xl border-2 border-secondary bg-green-50/40 p-8 flex flex-col gap-4 max-w-[560px]">
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
            </Reveal>
          </Section>

        </div>
      </div>
    </>
  );
}
