import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import DocActions from '@/components/examinations/DocActions';

export const metadata: Metadata = {
  title: 'Controller of Examinations — MLRIT',
  description: 'About the Controller of Examinations office at MLRIT — autonomy, OBE framework and key functions.',
};

const FUNCTIONS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 7h6M7 10.5h4M7 14h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Examination Scheduling',
    desc: 'Plans and announces Internal (CIE) and External (SEE) examination timetables for all programmes and regulations.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M10 6v4.5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Results Processing',
    desc: 'Tabulation, validation and publication of results on the MLRIT Exam Portal. Manages re-evaluation and re-totalling requests.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 2l2.09 6.26L18 9.27l-4.5 4.14 1.18 6.59L10 17l-4.68 2.99 1.18-6.59L2 9.27l5.91-.01L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Grade Cards & Certificates',
    desc: 'Issues grade cards, provisional certificates, transcripts, migration certificates and other official documents.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Regulations & Policy',
    desc: 'Administers institutional academic regulations (R25, R22, MLR20, MLR18) and examination conduct policies.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M17 11H3M17 11l-4-4M17 11l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Student Verifications',
    desc: 'Authenticates degree and grade card credentials for employers, universities and government agencies.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 18c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Grievance Redressal',
    desc: 'Resolves student grievances related to results, malpractice cases, attendance and examination irregularities.',
  },
];

const MILESTONES = [
  { year: '2015', event: 'Autonomous status conferred by UGC', note: 'MLRIT becomes the first private engineering college in Telangana to receive full autonomy.' },
  { year: '2018', event: 'First autonomous regulation: MLR18', note: 'Introduction of institution-specific B.Tech and M.Tech regulations — MLR18.' },
  { year: '2020', event: 'MLR20 regulation', note: 'Revised credit framework and bridge courses for lateral entry introduced under MLR20.' },
  { year: '2022', event: 'R22 regulation & OBE deep integration', note: 'Strengthened Outcome-Based Education framework, mandatory NEP 2020-aligned courses introduced.' },
  { year: '2025', event: 'R25 — current regulation', note: 'Latest regulation with enhanced industry integration, CBCS, and updated grading norms aligned with NEP 2020.' },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

export default function COEPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Examinations"
        title="Controller of"
        italic="Examinations."
        dek="The COE office oversees all examination activities at MLRIT — from scheduling and conduct to results, regulations, certificates and grievance redressal."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'COE' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/coe" />

      {/* Autonomy section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              Autonomous Since 2015
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              OBE-driven{' '}
              <span className="font-display italic font-medium" style={gradientText}>
                examination framework.
              </span>
            </h2>
            <p className="mt-4 text-muted text-[0.93rem] max-w-[660px] leading-relaxed">
              As a UGC-autonomous institution since 2015, MLRIT designs and administers its own examination regulations, grading norms and academic policies — fully aligned with Outcome-Based Education (OBE) and the National Education Policy 2020. The COE office ensures transparency, consistency and integrity across all programmes.
            </p>
          </Reveal>

          {/* Key facts strip */}
          <Stagger className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-warm-light border border-border" delay={0.07}>
            {[
              { val: '2015', lbl: 'Year of autonomy' },
              { val: '4', lbl: 'Active regulations' },
              { val: '3', lbl: 'Programmes (B.Tech, M.Tech, MBA)' },
              { val: 'OBE', lbl: 'Examination framework' },
            ].map((s) => (
              <StaggerItem key={s.lbl}>
                <div className="font-sans font-black text-foreground text-[1.9rem] leading-none tracking-tighter">{s.val}</div>
                <div className="mt-1.5 font-mono text-muted text-[0.65rem] tracking-[0.14em] uppercase leading-snug">{s.lbl}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* COE Functions */}
      <section className="bg-warm-light py-16 md:py-24 border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Functions</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.06]">
              What the{' '}
              <span className="font-display italic font-medium" style={gradientText}>COE office does.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
            {FUNCTIONS.map((f) => (
              <StaggerItem key={f.title}>
                <div className="bg-white rounded-2xl border border-border p-6 h-full shadow-card-soft">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-sans font-extrabold text-foreground text-[0.95rem] mb-2">{f.title}</h3>
                  <p className="text-muted text-[0.85rem] leading-relaxed">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16 md:py-24 border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Timeline</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.06]">
              Regulatory{' '}
              <span className="font-display italic font-medium" style={gradientText}>milestones.</span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-0">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} preset="up" delay={i * 0.06}>
                <div className="flex gap-6 pb-8 relative">
                  {/* timeline line */}
                  {i < MILESTONES.length - 1 && (
                    <div className="absolute left-[2.15rem] top-10 bottom-0 w-px bg-border" />
                  )}
                  <div className="shrink-0 w-[4.3rem] text-right">
                    <span className="font-mono font-bold text-secondary text-[0.85rem]">{m.year}</span>
                  </div>
                  <div className="shrink-0 w-4 h-4 rounded-full border-2 border-secondary bg-white mt-0.5" />
                  <div className="flex-1 pb-2">
                    <h3 className="font-sans font-extrabold text-foreground text-[0.95rem] mb-1">{m.event}</h3>
                    <p className="text-muted text-[0.85rem] leading-relaxed">{m.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* COE Profile download */}
          <Reveal preset="up" delay={0.2}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <DocActions href="/examinations/coe-profile.pdf" viewLabel="View Profile" downloadLabel="Download Profile" />
              <a
                href="/examinations/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-secondary transition-colors"
              >
                Contact the COE Office →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
