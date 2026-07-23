import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import { PLACEMENT_CONTACTS } from '@/lib/placements';

export const metadata: Metadata = {
  title: 'Reach Placements At MLRIT — Training & Placement Cell',
  description: 'Contact the Training & Placements Cell at MLRIT for campus recruitment, internship and training enquiries.',
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function PlacementsSupportPage() {
  return (
    <>
      {/* Page intro */}
      <section className="bg-white pt-14 pb-4">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Contact</span>
            <h1 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Reach Placements{' '}
              {/* Final wording "Reach Placements At…" — suffix pending institutional confirmation */}
              <span className="font-display italic font-medium" style={gradientText}>At MLRIT.</span>
            </h1>
            <p className="mt-4 max-w-[640px] text-muted leading-relaxed">
              Get in touch with the Training & Placement Cell for campus recruitment drives, partnership enquiries, student registration, and placement support.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-warm-light min-h-[50vh] py-10 md:py-16">
        <div className="max-w-[720px] mx-auto px-6 md:px-12 lg:px-20 space-y-6">

          {PLACEMENT_CONTACTS.map((c) => (
            <Reveal key={c.designation} preset="up">
              <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
                <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">{c.designation}</p>
                <h2 className="font-sans font-extrabold text-foreground text-[1.1rem]">{c.name}</h2>
                <p className="mt-1 text-muted text-[0.88rem]">{c.purpose}</p>
                <div className="mt-5 flex flex-col gap-2.5">
                  {c.phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/[\s\-]/g, '')}`}
                      className="inline-flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline"
                      aria-label={`Call ${c.name} at ${p}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M12 9.17a.7.7 0 01-.23.46l-.94.94a.7.7 0 01-.55.19C4.61 10.76 3.28 4.67 3.28 4.67a.7.7 0 01.23-.7l.94-.94a.7.7 0 01.47-.19l1.75 3.5a.7.7 0 01-.19.89l-.56.56a4.2 4.2 0 00.35.35l.56-.56a.7.7 0 01.89-.19L12 9.17z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {p}
                    </a>
                  ))}
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline"
                    aria-label={`Email ${c.name} at ${c.email}`}
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

          {/* Office location */}
          <Reveal preset="up">
            <div className="bg-white rounded-2xl border border-border p-7 shadow-card-soft">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Office Location</p>
              <h2 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-3">T&P Cell — Ground Floor, Main Block</h2>
              <address className="not-italic text-foreground text-[0.93rem] leading-relaxed">
                MLR Institute of Technology<br />
                Survey No. 444, Dundigal, Gandi Maisamma<br />
                Medchal Malkajgiri, Telangana – 500 043
              </address>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 font-mono text-[0.72rem] font-semibold text-secondary tracking-wide">
                EAPCET Code · MLID
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="mailto:placements@mlrinstitutions.ac.in"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-semibold text-sm hover:bg-secondary/90 transition-colors"
                >
                  Email T&P Cell
                </a>
                <a
                  href="tel:+919849991299"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-warm-light text-foreground font-semibold text-sm hover:border-secondary transition-colors"
                >
                  Call +91 98499 91299
                </a>
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
