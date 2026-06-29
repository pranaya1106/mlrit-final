import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Circulars — Examinations — MLRIT' };

const CIRCULARS = [
  { title: 'I B.Tech I Semester Supplementary Examinations June 2026 — Timetable',                                  href: 'https://mlrit.ac.in/circulars/', date: 'May 2026' },
  { title: 'I B.Tech II Semester Regular & Supplementary Examinations June 2026 — Timetable',                        href: 'https://mlrit.ac.in/circulars/', date: 'May 2026' },
  { title: 'IV B.Tech II Semester Advance Supplementary Examinations June 2026 — Fee Notification',                  href: 'https://mlrit.ac.in/circulars/', date: 'May 2026' },
  { title: 'II B.Tech I Semester (R22/MLR20/MLR18) Supplementary Examinations June 2026 — Timetable',                href: 'https://mlrit.ac.in/circulars/', date: 'Apr 2026' },
  { title: 'IV B.Tech II Semester Regular & Supplementary Examinations April 2026 — Timetable',                      href: '/examinations/timetable-iv-btech-ii-sem-2026.pdf', date: 'Mar 2026' },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function CircularsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Circulars &"
        italic="notifications."
        dek="Latest examination circulars, timetables, fee notifications and important announcements from the Controller of Examinations."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Examinations', href: '/examinations' }, { label: 'Circulars' }]}
        variant="green"
      />
      <ExaminationsQuickNav active="/examinations/circulars" />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Latest</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Recent <span className="font-display italic font-medium" style={gradientText}>circulars.</span>
            </h2>
          </Reveal>

          <div className="mt-10 flex flex-col gap-3">
            {CIRCULARS.map((c, i) => (
              <Reveal key={i} preset="up" delay={i * 0.05}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-6 py-5 rounded-xl border border-border bg-white hover:border-secondary hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M3 2h8a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans font-semibold text-foreground text-[0.93rem] leading-snug group-hover:text-secondary transition-colors">{c.title}</p>
                      <p className="mt-1 font-mono text-muted text-[0.7rem] tracking-wide">{c.date}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-muted group-hover:text-secondary transition-colors" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal preset="up" delay={0.3}>
            <div className="mt-8 text-center">
              <a
                href="https://mlrit.ac.in/circulars/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-secondary text-secondary font-bold text-sm hover:bg-secondary hover:text-white transition-all"
              >
                View All Circulars on mlrit.ac.in ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
