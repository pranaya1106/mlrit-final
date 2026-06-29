import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import IQACQuickNav from '@/components/IQACQuickNav';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'IQAC Support — MLRIT',
  description: 'Contact the IQAC office at MLRIT for queries related to accreditation, AQAR, NBA and institutional quality assurance.',
};

const CONTACTS = [
  {
    name: 'Dr. Radhika Devi V',
    role: 'Head IQAC — Director & Dean H&S',
    phone: 'To be updated',
    email: 'iqac@mlrinstitutions.ac.in',
    purpose: 'Accreditation, AQAR submissions, quality assurance and NBA documentation.',
  },
  {
    name: 'IQAC Office',
    role: 'General Enquiries',
    phone: '1800 572 4363',
    email: 'iqac@mlrinstitutions.ac.in',
    purpose: 'Criteria-wise reports, NAAC queries and institutional benchmarking.',
    tollFree: true,
  },
];

export default function IQACSupportPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="IQAC Support"
        title="Quality Assurance"
        italic="Office."
        dek="Reach the IQAC office for accreditation queries, AQAR submissions and NBA documentation."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'IQAC', href: '/iqac' },
          { label: 'Support' },
        ]}
      />
      <IQACQuickNav active="/iqac/support" />

      <section className="bg-warm-light min-h-screen py-16 md:py-24">
        <div className="max-w-[720px] mx-auto px-6 md:px-12 lg:px-20 space-y-6">

          {CONTACTS.map((c) => (
            <Reveal key={c.role} preset="up">
              <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
                <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">{c.role}</p>
                <h3 className="font-sans font-extrabold text-foreground text-[1.1rem]">{c.name}</h3>
                <p className="mt-1 text-muted text-[0.88rem]">{c.purpose}</p>
                <div className="mt-5 flex flex-col gap-2.5">
                  {c.phone === 'To be updated' ? (
                    <span className="inline-flex items-center gap-2 text-muted text-[0.88rem] italic">Phone — To be updated</span>
                  ) : (
                    <a
                      href={c.tollFree ? `tel:${c.phone.replace(/\s/g, '')}` : `tel:+91${c.phone.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M12 9.17a.7.7 0 01-.23.46l-.94.94a.7.7 0 01-.55.19C4.61 10.76 3.28 4.67 3.28 4.67a.7.7 0 01.23-.7l.94-.94a.7.7 0 01.47-.19l1.75 3.5a.7.7 0 01-.19.89l-.56.56a4.2 4.2 0 00.35.35l.56-.56a.7.7 0 01.89-.19L12 9.17z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {c.phone}{c.tollFree ? ' (Toll Free)' : ''}
                    </a>
                  )}
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M1 5l6 3.5L13 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    {c.email}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal preset="up">
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Office Location</p>
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-3">IQAC Office — Administrative Block</h3>
              <p className="text-foreground text-[0.93rem] leading-relaxed">
                MLR Institute of Technology<br />
                Survey No. 444, Dundigal, Gandi Maisamma<br />
                Medchal Malkajgiri, Telangana – 500 043
              </p>
              <div className="mt-5">
                <a
                  href="mailto:iqac@mlrinstitutions.ac.in"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary/90 transition-colors"
                >
                  Email IQAC Office
                </a>
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
