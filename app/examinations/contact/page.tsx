import type { Metadata } from 'next';
import ExaminationsHero from '@/components/ExaminationsHero';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal from '@/components/motion/Reveal';
import { EXAM_CONTACTS } from '@/lib/examinations';

export const metadata: Metadata = {
  title: 'Contact Us — Examinations — MLRIT',
  description: 'Contact the Controller of Examinations office at MLRIT for queries related to results, timetables, regulations and certificates.',
};

export default function ExaminationsContactPage() {
  return (
    <>
      <ExaminationsHero
        title="Contact"
        italic="Us."
        dek="Reach the COE office for results, timetables, regulations, re-evaluation and certificate requests."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Contact Us' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/contact" />

      <section className="bg-warm-light min-h-screen py-10 md:py-14">
        <div className="max-w-[720px] mx-auto px-6 md:px-12 lg:px-20 space-y-6">

          {EXAM_CONTACTS.map((c) => (
            <Reveal key={c.role} preset="up">
              <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
                <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">{c.role}</p>
                <h3 className="font-sans font-extrabold text-foreground text-[1.1rem]">{c.name}</h3>
                <p className="mt-1 text-muted text-[0.88rem]">{c.purpose}</p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href={c.tollFree ? `tel:${c.phone.replace(/\s/g, '')}` : `tel:+91${c.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M12 9.17a.7.7 0 01-.23.46l-.94.94a.7.7 0 01-.55.19C4.61 10.76 3.28 4.67 3.28 4.67a.7.7 0 01.23-.7l.94-.94a.7.7 0 01.47-.19l1.75 3.5a.7.7 0 01-.19.89l-.56.56a4.2 4.2 0 00.35.35l.56-.56a.7.7 0 01.89-.19L12 9.17z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {c.phone}{c.tollFree ? ' (Toll Free)' : ''}
                  </a>
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
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-3">COE Office — Administrative Block</h3>
              <p className="text-foreground text-[0.93rem] leading-relaxed">
                MLR Institute of Technology<br />
                Survey No. 444, Dundigal, Gandi Maisamma<br />
                Medchal Malkajgiri, Telangana – 500 043
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="mailto:coe@mlrinstitutions.ac.in"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary/90 transition-colors"
                >
                  Email COE Office
                </a>
                <a
                  href="https://exams.mlrinstitutions.ac.in/"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-warm-light text-foreground font-semibold text-sm hover:border-secondary transition-colors"
                >
                  Open Exam Portal ↗
                </a>
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
