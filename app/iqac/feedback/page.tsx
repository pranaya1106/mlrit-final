import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Feedback — IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'student-feedback', label: 'Student Feedback' },
  { id: 'faculty-feedback', label: 'Faculty Feedback' },
  { id: 'alumni-feedback', label: 'Alumni Feedback' },
  { id: 'employer-feedback', label: 'Employer Feedback' },
];

const FEEDBACK_TYPES = [
  { id: 'student-feedback', tag: 'Students',  title: 'Student Feedback',  desc: 'Semester-wise feedback on teaching quality, course delivery, infrastructure and overall campus experience collected from all enrolled students.' },
  { id: 'faculty-feedback', tag: 'Faculty',   title: 'Faculty Feedback',   desc: 'Feedback from faculty on curriculum relevance, administrative support, professional development opportunities and institutional processes.' },
  { id: 'alumni-feedback', tag: 'Alumni',    title: 'Alumni Feedback',    desc: 'Inputs from alumni on the long-term impact of their MLRIT education on career growth and professional development.' },
  { id: 'employer-feedback', tag: 'Employers', title: 'Employer Feedback',  desc: 'Annual feedback from recruiting organisations on graduate competency, workplace readiness and industry-alignment of MLRIT programmes.' },
];

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Feedback"
        italic=""
        dek="IQAC collects and analyses feedback from all stakeholders — students, faculty, employers and alumni — to drive continuous improvement."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Feedback' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/feedback" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {FEEDBACK_TYPES.map((f) => (
            <Section id={f.id} key={f.id}>
              <H2 italic="">{f.title}</H2>
              <Reveal preset="up">
                <div className="mt-6 rounded-2xl border border-border bg-white p-7 max-w-[720px] hover:border-secondary transition-colors">
                  <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-secondary mb-3">{f.tag}</div>
                  <p className="text-muted leading-relaxed text-[0.93rem]">{f.desc}</p>
                </div>
              </Reveal>
            </Section>
          ))}

        </div>
      </div>
    </>
  );
}
