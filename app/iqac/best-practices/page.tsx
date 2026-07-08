import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Best Practices — IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'best-practice-1', label: 'Best Practice 1' },
  { id: 'best-practice-2', label: 'Best Practice 2' },
  { id: 'best-practice-3', label: 'Best Practice 3' },
];

const PRACTICES = [
  { id: 'best-practice-1', n: 'Best Practice 1', t: 'Mentoring & Student Support System', d: 'Every student is assigned a faculty mentor who tracks academic progress, attendance, personal development and career readiness throughout the programme.' },
  { id: 'best-practice-2', n: 'Best Practice 2', t: 'Industry-Integrated Curriculum', d: 'Curriculum designed in consultation with industry experts; includes live projects, internship components and elective tracks aligned to current technology domains.' },
  { id: 'best-practice-3', n: 'Best Practice 3', t: 'Green Campus Initiatives', d: 'Sustained efforts towards solar energy, tree plantation drives, water conservation and paperless administration to build an eco-sensitive campus.' },
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

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {PRACTICES.map((p) => (
            <Section id={p.id} key={p.id}>
              <H2 italic="">{p.n}</H2>
              <Reveal preset="up">
                <div className="mt-6 rounded-2xl border border-border bg-white p-7 max-w-[720px] hover:border-secondary transition-colors">
                  <h3 className="font-sans font-extrabold text-foreground text-[1rem] mb-2">{p.t}</h3>
                  <p className="text-muted leading-relaxed text-[0.93rem]">{p.d}</p>
                </div>
              </Reveal>
            </Section>
          ))}

        </div>
      </div>
    </>
  );
}
