import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import AboutQuickNav from '@/components/AboutQuickNav';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Brochure — MLRIT',
  description: 'Download the MLRIT institutional brochure — programmes, fees, campus life and admissions information.',
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function BrochurePage() {
  return (
    <>
      <PageHeader
        eyebrow="Brochure"
        title="Everything about"
        italic="MLRIT in one place."
        dek="Programmes, fees, campus life, admissions and accreditations — all in one document."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Brochure' }]}
        variant="green"
      />
      <AboutQuickNav active="/about/brochure" />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 lg:px-20">

          {/* Download card */}
          <Reveal preset="up">
            <div className="rounded-2xl border-2 border-secondary bg-warm-light p-10 md:p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                  <path d="M14 4v14m-5-5 5 5 5-5M6 22h16" stroke="#01741f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Download</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
                MLRIT Institutional <span className="font-display italic font-medium" style={gradientText}>Brochure 2025–26</span>
              </h2>
              <p className="mt-4 text-muted leading-relaxed max-w-[520px] mx-auto">
                Programmes offered, fee structure, campus facilities, placement statistics, accreditations and the admissions process — all in a single PDF.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <a
                  href="/admissions/mlrit-brochure.pdf"
                  download="MLRIT-Brochure-2025-26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-secondary text-white font-bold text-sm hover:bg-secondary-hover transition-all shadow-[0_4px_16px_rgba(1,116,31,0.25)] hover:scale-105"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 2v8m-3-3 3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download PDF
                </a>
                <a
                  href="https://mlrit.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-secondary text-secondary font-bold text-sm hover:bg-secondary/5 transition-all"
                >
                  Visit Official Website
                </a>
              </div>
            </div>
          </Reveal>

          {/* Contents list */}
          <Reveal preset="up" delay={0.1}>
            <div className="mt-10 rounded-2xl border border-border bg-white p-8">
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-muted">What's inside</span>
              <ul className="mt-5 grid md:grid-cols-2 gap-3">
                {[
                  'About MLRIT & KMR Educational Society',
                  'All B.Tech, M.Tech & MBA programmes',
                  'Fee structure & scholarship details',
                  'Campus facilities & infrastructure',
                  'Placement statistics & top recruiters',
                  'Accreditations — NAAC, NBA, NIRF',
                  'Admissions process & key dates',
                  'Research centres & IPFC',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.95rem] text-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
