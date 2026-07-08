import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';

export const metadata: Metadata = { title: 'Best Practices — IQAC — MLRIT' };

const PRACTICES = [
  { n: 'Best Practice 1', t: 'Mentoring & Student Support System', d: 'Every student is assigned a faculty mentor who tracks academic progress, attendance, personal development and career readiness throughout the programme.' },
  { n: 'Best Practice 2', t: 'Industry-Integrated Curriculum', d: 'Curriculum designed in consultation with industry experts; includes live projects, internship components and elective tracks aligned to current technology domains.' },
  { n: 'Best Practice 3', t: 'Green Campus Initiatives', d: 'Sustained efforts towards solar energy, tree plantation drives, water conservation and paperless administration to build an eco-sensitive campus.' },
];

export default function BestPracticesPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="Best Practices"
        italic=""
        dek="Institutional best practices adopted at MLRIT that reflect commitment to quality, innovation and holistic student development."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'Best Practices' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/best-practices" />
      <Section>
        <H2 italic="">Best Practices</H2>
        <Lede>Institutional best practices adopted at MLRIT that reflect commitment to quality, innovation and holistic student development.</Lede>
        <Stagger className="mt-8 grid md:grid-cols-2 gap-5" delay={0.07}>
          {PRACTICES.map((p) => (
            <StaggerItem key={p.n}>
              <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-secondary transition-colors">
                <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-secondary mb-3">{p.n}</div>
                <h3 className="font-sans font-extrabold text-foreground text-[1rem] mb-2">{p.t}</h3>
                <p className="text-muted leading-relaxed text-[0.93rem]">{p.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
