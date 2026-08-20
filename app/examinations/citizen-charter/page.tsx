import type { Metadata } from 'next';
import ExaminationsHero from '@/components/ExaminationsHero';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import DocActions from '@/components/examinations/DocActions';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Citizen Charter — Examinations — MLRIT',
  description: 'The COE Citizen Charter outlines service timelines, standards and grievance redressal for examination-related services at MLRIT.',
};

const SERVICES = [
  {
    service: 'Grade Card Issuance',
    timeline: '30 working days after result declaration',
    desc: 'Official grade cards issued after each semester result is published.',
  },
  {
    service: 'Duplicate Grade Card',
    timeline: '7 working days after application',
    desc: 'Issued on submission of completed form and prescribed fee.',
  },
  {
    service: 'Provisional Certificate',
    timeline: '15 working days after final semester result',
    desc: 'Issued to graduating students on clearance of dues and library NOC.',
  },
  {
    service: 'Transcript',
    timeline: '10 working days after application',
    desc: 'Official sealed transcript for employment or higher education.',
  },
  {
    service: 'Name Correction',
    timeline: '10 working days after verification',
    desc: 'Correction applied across all official records on submission of supporting documents.',
  },
  {
    service: 'Re-evaluation',
    timeline: 'Within the period specified in the notification',
    desc: 'Applications accepted within the notified window after result declaration. Revised result published within 30 days.',
  },
  {
    service: 'Student Verification',
    timeline: '5–7 working days',
    desc: 'Authentication of degree and grade card credentials for external agencies.',
  },
  {
    service: 'Migration Certificate',
    timeline: '15 working days after application',
    desc: 'Issued on submission of completed form and clearance of dues.',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'citizen-charter', label: 'Citizen Charter' },
];

export default function CitizenCharterPage() {
  return (
    <>
      <ExaminationsHero
        title="Citizen"
        italic="Charter."
        dek="The COE Citizen Charter defines service standards, processing timelines and grievance redressal for all examination-related services at MLRIT."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Citizen Charter' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/citizen-charter" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      <section id="citizen-charter" className="bg-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">

          {/* Intro + Download */}
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Service Standards</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              What you can{' '}
              <span className="font-display italic font-medium" style={gradientText}>expect from us.</span>
            </h2>
            <p className="mt-4 text-muted text-[0.93rem] max-w-[660px] leading-relaxed">
              The Citizen Charter commits the Controller of Examinations office to delivering services within defined timelines. It also outlines the grievance redressal procedure for unresolved complaints.
            </p>
            <div className="mt-6">
              <DocActions href="/examinations/citizen-charter.pdf" viewLabel="View PDF" downloadLabel="Download PDF" />
            </div>
          </Reveal>

          {/* Service table */}
          <div className="mt-14 overflow-x-auto">
            <Reveal>
              <span className="font-mono text-[0.68rem] font-bold tracking-[0.2em] uppercase text-muted">Service Timelines</span>
            </Reveal>
            <Stagger className="mt-5 space-y-3" delay={0.05}>
              {SERVICES.map((s) => (
                <StaggerItem key={s.service}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-xl border border-border bg-warm-light px-5 py-4">
                    <div className="sm:w-[42%]">
                      <p className="font-sans font-extrabold text-foreground text-[0.92rem]">{s.service}</p>
                      <p className="mt-0.5 text-muted text-[0.82rem] leading-snug">{s.desc}</p>
                    </div>
                    <div className="sm:flex-1 sm:text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-border font-mono text-[0.72rem] font-bold text-secondary">
                        {s.timeline}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Grievance */}
          <Reveal preset="up" delay={0.2}>
            <div className="mt-14 rounded-2xl border border-border bg-warm-light p-8">
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-3">Grievance Redressal</h3>
              <p className="text-muted text-[0.88rem] leading-relaxed mb-4">
                If a service is not delivered within the committed timeline, students may escalate by writing to{' '}
                <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">
                  coe@mlrinstitutions.ac.in
                </a>{' '}
                with their application reference. The COE office will acknowledge within 2 working days and resolve within 10 working days of acknowledgement.
              </p>
              <a
                href="/examinations/contact"
                className="inline-flex items-center gap-2 text-secondary font-semibold text-[0.88rem] hover:underline"
              >
                Contact COE Office →
              </a>
            </div>
          </Reveal>

        </div>
      </section>

        </div>
      </div>
    </>
  );
}
