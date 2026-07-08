import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';

export const metadata: Metadata = { title: 'Feedback — IQAC — MLRIT' };

const FEEDBACK_TYPES = [
  { tag: 'Students',  title: 'Student Feedback',  desc: 'Semester-wise feedback on teaching quality, course delivery, infrastructure and overall campus experience collected from all enrolled students.' },
  { tag: 'Faculty',   title: 'Faculty Feedback',   desc: 'Feedback from faculty on curriculum relevance, administrative support, professional development opportunities and institutional processes.' },
  { tag: 'Employers', title: 'Employer Feedback',  desc: 'Annual feedback from recruiting organisations on graduate competency, workplace readiness and industry-alignment of MLRIT programmes.' },
  { tag: 'Alumni',    title: 'Alumni Feedback',    desc: 'Inputs from alumni on the long-term impact of their MLRIT education on career growth and professional development.' },
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
      <Section>
        <H2 italic="">Feedback</H2>
        <Lede>IQAC collects and analyses feedback from all stakeholders — students, faculty, employers and alumni — to drive continuous improvement.</Lede>
        <Stagger className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.07}>
          {FEEDBACK_TYPES.map((f) => (
            <StaggerItem key={f.tag}>
              <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-secondary transition-colors">
                <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-secondary mb-3">{f.tag}</div>
                <h3 className="font-sans font-extrabold text-foreground text-[1rem] mb-2">{f.title}</h3>
                <p className="text-muted leading-relaxed text-[0.93rem]">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
