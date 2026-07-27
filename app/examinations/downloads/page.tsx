import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import DocActions from '@/components/examinations/DocActions';
import { EXAM_DOWNLOADS, EXAM_CALENDARS } from '@/lib/examinations';

export const metadata: Metadata = {
  title: 'Downloads — Examinations — MLRIT',
  description: 'Download examination forms, policies and academic calendars from the MLRIT COE office.',
};

const BADGE_COLORS: Record<string, string> = {
  Policy:       'bg-orange-50 border-orange-200 text-primary',
  Form:         'bg-green-50 border-green-200 text-secondary',
  Instructions: 'bg-blue-50 border-blue-200 text-blue-700',
  Profile:      'bg-neutral-100 border-neutral-300 text-muted',
  Calendar:     'bg-green-50 border-green-200 text-secondary',
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function DownloadsPage() {
  const forms  = EXAM_DOWNLOADS.filter((d) => d.category === 'forms');
  const policy = EXAM_DOWNLOADS.filter((d) => d.category !== 'forms');

  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Forms &"
        italic="Downloads."
        dek="All downloadable forms, policies, academic calendars and guidelines from the Controller of Examinations office."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Downloads' },
        ]}
        variant="green"
      />
      <ExaminationsQuickNav active="/examinations/downloads" />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 space-y-20">

          {/* Forms */}
          <div>
            <Reveal>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Student Forms</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
                Application{' '}
                <span className="font-display italic font-medium" style={gradientText}>forms.</span>
              </h2>
              <p className="mt-3 text-muted text-[0.9rem] max-w-[520px] leading-relaxed">
                Download, print and submit these forms to the COE office with supporting documents and prescribed fees.
              </p>
            </Reveal>

            <Stagger className="mt-8 space-y-2" delay={0.04}>
              {forms.map((d) => (
                <StaggerItem key={d.label}>
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-white px-5 py-4">
                    <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full border text-[0.62rem] font-mono font-bold tracking-widest uppercase ${BADGE_COLORS[d.badge ?? 'Form'] ?? 'bg-neutral-100 border-neutral-300 text-muted'}`}>
                      {d.badge}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-semibold text-foreground text-[0.92rem]">{d.label}</p>
                      {d.desc && <p className="text-muted text-[0.8rem] mt-0.5 leading-snug">{d.desc}</p>}
                    </div>
                    <DocActions href={d.href} />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Policy & Instructions */}
          <div>
            <Reveal>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Policy &amp; Instructions</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
                Policy{' '}
                <span className="font-display italic font-medium" style={gradientText}>documents.</span>
              </h2>
            </Reveal>

            <Stagger className="mt-8 space-y-2" delay={0.04}>
              {policy.map((d) => (
                <StaggerItem key={d.label}>
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-white px-5 py-4">
                    <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full border text-[0.62rem] font-mono font-bold tracking-widest uppercase ${BADGE_COLORS[d.badge ?? 'Policy'] ?? 'bg-orange-50 border-orange-200 text-primary'}`}>
                      {d.badge}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-semibold text-foreground text-[0.92rem]">{d.label}</p>
                      {d.desc && <p className="text-muted text-[0.8rem] mt-0.5 leading-snug">{d.desc}</p>}
                    </div>
                    <DocActions href={d.href} />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Academic Calendars */}
          <div>
            <Reveal>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Academic Calendars</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
                Year-wise{' '}
                <span className="font-display italic font-medium" style={gradientText}>calendars.</span>
              </h2>
            </Reveal>

            <Stagger className="mt-8 grid md:grid-cols-3 gap-5" delay={0.06}>
              {EXAM_CALENDARS.map((c) => (
                <StaggerItem key={c.label}>
                  <div className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-white p-6 h-full">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[0.62rem] font-mono font-bold tracking-widest uppercase bg-green-50 border-green-200 text-secondary">
                        {c.tag}
                      </span>
                      {c.current && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.58rem] font-bold tracking-wide uppercase">
                          <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans font-extrabold text-foreground text-[0.95rem] leading-snug flex-1">
                      {c.label}
                    </h3>
                    {c.desc && <p className="text-muted text-[0.8rem] leading-snug">{c.desc}</p>}
                    <DocActions href={c.href} viewLabel="View" downloadLabel="Download" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

        </div>
      </section>
    </>
  );
}
