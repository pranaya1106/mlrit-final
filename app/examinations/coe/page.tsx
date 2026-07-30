import type { Metadata } from 'next';
import ExaminationsHero from '@/components/ExaminationsHero';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import DocActions from '@/components/examinations/DocActions';

export const metadata: Metadata = {
  title: 'Controller of Examinations — MLRIT',
  description: 'About the Controller of Examinations office at MLRIT — autonomy, OBE framework and key functions.',
};

const FUNCTIONS = [
  {
    title: 'Examination Scheduling',
    desc: 'Plans and announces Internal (CIE) and External (SEE) examination timetables for all programmes and regulations.',
  },
  {
    title: 'Results Processing',
    desc: 'Tabulation, validation and publication of results on the MLRIT Exam Portal. Manages re-evaluation and re-totalling requests.',
  },
  {
    title: 'Grade Cards & Certificates',
    desc: 'Issues grade cards, provisional certificates, transcripts, migration certificates and other official documents.',
  },
  {
    title: 'Regulations & Policy',
    desc: 'Administers institutional academic regulations (R25, R22, MLR20, MLR18) and examination conduct policies.',
  },
  {
    title: 'Student Verifications',
    desc: 'Authenticates degree and grade card credentials for employers, universities and government agencies.',
  },
  {
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
      <ExaminationsHero
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

      {/* Autonomy — editorial lead treatment */}
      <section className="bg-white py-12 md:py-16">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-start">
            <Reveal>
              <span className="font-mono text-[0.72rem] font-extrabold tracking-[0.24em] uppercase text-primary">
                Autonomous Since 2015
              </span>
              <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.02]">
                OBE-driven{' '}
                <span className="font-display italic font-medium" style={gradientText}>
                  examination framework.
                </span>
              </h2>
              <div className="mt-6 border-l-[3px] border-primary pl-6">
                <p className="font-display italic font-medium text-foreground text-[clamp(1.1rem,1.4vw,1.4rem)] leading-[1.5]">
                  A UGC-autonomous institution designing its own regulations, grading norms and academic policies — aligned with Outcome-Based Education and NEP 2020.
                </p>
              </div>
            </Reveal>

            <Reveal preset="up" delay={0.1}>
              <div className="space-y-5">
                <p className="text-foreground/85 text-[1.05rem] leading-[1.75]">
                  <span className="font-display italic font-black text-primary text-[3.4rem] leading-[0.7] float-left mr-3 mt-1">A</span>
                  s a UGC-autonomous institution since 2015, MLRIT designs and administers its own examination regulations, grading norms and academic policies — fully aligned with Outcome-Based Education (OBE) and the National Education Policy 2020.
                </p>
                <p className="text-muted text-[1rem] leading-[1.75]">
                  The COE office ensures transparency, consistency and integrity across all programmes — from timetable notification to final grade cards.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Facts strip */}
          <Stagger className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4" delay={0.07}>
            {[
              { val: '2015', lbl: 'Year of autonomy' },
              { val: '4',    lbl: 'Active regulations' },
              { val: '3',    lbl: 'Programmes' },
              { val: 'OBE',  lbl: 'Framework' },
            ].map((s, i) => (
              <StaggerItem key={s.lbl}>
                <div className="relative rounded-2xl bg-warm-light border border-border p-6 h-full overflow-hidden group hover:-translate-y-1 hover:shadow-card-soft transition-all duration-300">
                  <span aria-hidden className="absolute -top-2 -right-2 font-display italic font-black text-[5rem] leading-none tracking-tighter text-foreground/[0.05] select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <div className="font-sans font-black text-foreground text-[clamp(1.8rem,2.4vw,2.2rem)] leading-none tracking-tighter">
                      {s.val}
                    </div>
                    <div className="mt-2 font-mono text-muted text-[0.65rem] tracking-[0.16em] uppercase leading-snug">
                      {s.lbl}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* COE Functions — no icons, numbered cards */}
      <section className="bg-warm-light py-12 md:py-16 border-t border-border">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.72rem] font-extrabold tracking-[0.24em] uppercase text-primary">Functions</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              What the{' '}
              <span className="font-display italic font-medium" style={gradientText}>COE office does.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
            {FUNCTIONS.map((f, i) => (
              <StaggerItem key={f.title}>
                <div className="relative bg-white rounded-2xl border border-border p-7 h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-card-soft overflow-hidden">
                  <span aria-hidden className="absolute -top-3 -right-3 font-display italic font-black text-[5.5rem] leading-none tracking-tighter text-primary/[0.06] select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <span className="font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase text-primary">
                      {String(i + 1).padStart(2, '0')} · Function
                    </span>
                    <h3 className="mt-3 font-sans font-extrabold text-foreground text-[1.15rem] tracking-tight leading-snug">
                      {f.title}
                    </h3>
                    <p className="mt-3 text-muted text-[0.95rem] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-12 md:py-16 border-t border-border">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.72rem] font-extrabold tracking-[0.24em] uppercase text-primary">Timeline</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              Regulatory{' '}
              <span className="font-display italic font-medium" style={gradientText}>milestones.</span>
            </h2>
          </Reveal>

          <div className="mt-10 relative">
            <div className="absolute left-[7.5rem] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <Reveal key={m.year} preset="up" delay={i * 0.06}>
                  <div className="flex items-start gap-6">
                    <div className="shrink-0 w-[6.5rem] text-right pt-1">
                      <span className="font-display italic font-black text-primary text-[clamp(1.6rem,2.2vw,2rem)] leading-none tracking-tighter">
                        {m.year}
                      </span>
                    </div>
                    <div className="relative shrink-0 z-10 mt-2 w-4 h-4 rounded-full border-2 border-primary bg-white grid place-items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1 rounded-2xl border border-border bg-warm-light p-5 md:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-soft">
                      <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] tracking-tight">{m.event}</h3>
                      <p className="mt-2 text-muted text-[0.94rem] leading-[1.7]">{m.note}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal preset="up" delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <DocActions href="/examinations/coe-profile.pdf" viewLabel="View Profile" downloadLabel="Download Profile" />
              <a
                href="/examinations/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
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
