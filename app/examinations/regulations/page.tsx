import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Regulations — Examinations — MLRIT' };

const REGS = [
  {
    badge: 'B.Tech', label: 'B.Tech Academic Regulations (R25)',
    desc: 'Current autonomous regulation for B.Tech programmes — 2022 intake onwards. Covers credits, promotions, examinations and grading.',
    href: 'https://files.mlrit.ac.in/Service%20Rules/B.Tech.AcademicRegulations(R25).pdf',
    color: 'border-secondary/30 bg-green-50/40', badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    badge: 'M.Tech', label: 'M.Tech Academic Regulations (R25)',
    desc: 'Regulation governing M.Tech programmes — course structure, minimum credits, thesis and evaluation norms.',
    href: 'https://files.mlrit.ac.in/Service%20Rules/M.Tech-AcademicRegulations(R25).pdf',
    color: 'border-primary/30 bg-orange-50/40', badgeColor: 'bg-orange-50 border-orange-200 text-primary',
  },
  {
    badge: 'MBA', label: 'MBA Academic Regulations (R25)',
    desc: 'Academic regulation for the 2-year MBA programme — dual specialisation, credits, CGPA requirements and project evaluation.',
    href: 'https://files.mlrit.ac.in/Service%20Rules/MBA-AcademicRegulations(R25).pdf',
    color: 'border-secondary/30 bg-green-50/40', badgeColor: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    badge: 'Policy', label: 'Examination Policy',
    desc: 'Institutional examination policy covering conduct, malpractice, evaluation, grievance redressal and re-evaluation procedures.',
    href: 'https://files.mlrit.ac.in/policy/Examination-Policy.pdf',
    color: 'border-primary/30 bg-orange-50/40', badgeColor: 'bg-orange-50 border-orange-200 text-primary',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function RegulationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Academic"
        italic="regulations."
        dek="Current academic regulations and examination policy governing all B.Tech, M.Tech and MBA programmes at MLRIT."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Examinations', href: '/examinations' }, { label: 'Regulations' }]}
        variant="green"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">R25 — Current</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Programme <span className="font-display italic font-medium" style={gradientText}>regulations.</span>
            </h2>
            <p className="mt-4 text-muted text-[1rem] max-w-[560px] leading-relaxed">
              As an autonomous institution, MLRIT designs and follows its own academic regulations approved by UGC and affiliated to JNTUH.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid md:grid-cols-2 gap-6" delay={0.08}>
            {REGS.map((r) => (
              <StaggerItem key={r.label}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block rounded-2xl border-2 p-8 hover:-translate-y-1 transition-all h-full ${r.color}`}
                >
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[0.65rem] font-mono font-bold tracking-widest uppercase ${r.badgeColor} mb-5`}>
                    {r.badge}
                  </span>
                  <h3 className="font-sans font-extrabold text-foreground text-[1.1rem] leading-snug group-hover:text-secondary transition-colors">
                    {r.label}
                  </h3>
                  <p className="mt-3 text-muted text-[0.9rem] leading-relaxed">{r.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-secondary font-bold text-[0.82rem] group-hover:gap-3 transition-all">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M7 2v7M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download PDF
                  </div>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
