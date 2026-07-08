import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'IQAC Composition — IQAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'members', label: 'Members' },
  { id: 'head-iqac', label: 'Head IQAC' },
  { id: 'roles-responsibilities', label: 'Roles & Responsibilities' },
];

const MEMBERS = [
  { role: 'Chairperson',           name: 'Principal',                               tag: 'Leadership'    },
  { role: 'Head IQAC',             name: 'Dr. Radhika Devi V, Director & Dean H&S', tag: 'Coordinator'   },
  { role: 'Senior Administrative', name: 'Officers of the Institution',              tag: 'Administration' },
  { role: 'Senior Teachers',       name: 'Three to Eight Faculty Members',           tag: 'Faculty'       },
  { role: 'External Stakeholder',  name: 'Nominee from Local Society / Industry',    tag: 'External'      },
  { role: 'Alumni Representative', name: 'One Nominee from Alumni',                  tag: 'Alumni'        },
];

export default function CompositionPage() {
  return (
    <>
      <PageHeader
        eyebrow="IQAC"
        title="IQAC Composition"
        italic=""
        dek="The cell brings together institutional leadership, faculty, alumni and external stakeholders to ensure comprehensive quality oversight."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'IQAC Composition' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/composition" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      <Section id="members">
        <H2 italic="">Members</H2>
        <Lede>The cell brings together institutional leadership, faculty, alumni and external stakeholders to ensure comprehensive quality oversight.</Lede>
        <Stagger className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
          {MEMBERS.map((m) => (
            <StaggerItem key={m.role}>
              <div className="rounded-2xl border border-border bg-white p-6 h-full hover:border-secondary transition-colors">
                <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-primary mb-2">{m.tag}</div>
                <div className="font-sans font-extrabold text-foreground text-[0.95rem]">{m.role}</div>
                <div className="mt-1.5 text-muted text-[0.88rem] leading-snug">{m.name}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section id="head-iqac">
        <Reveal preset="up" delay={0.1}>
          <div className="mt-8 rounded-2xl border border-border bg-white p-8 md:p-10 flex flex-col md:flex-row gap-8">
            <div className="shrink-0 w-40 h-44 md:w-44 md:h-48 rounded-2xl overflow-hidden border border-border self-start">
              <img src="/images/leadership/dr-radhika-devi.jpg" alt="Dr. Radhika Devi V" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1">
              <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary mb-2">Head IQAC</div>
              <h3 className="font-sans font-black text-foreground text-[1.4rem] tracking-tight">Dr. Radhika Devi V</h3>
              <p className="mt-1 font-mono text-muted text-[0.78rem] tracking-wide uppercase">Director · Dean H&S · Head IQAC</p>
              <div className="mt-5 h-px bg-border" />
              <p className="mt-5 text-foreground leading-relaxed text-[1rem]">
                An acclaimed academician and administrator in the field of technical education with more than 21 years of academic experience. Former Head of the Science and Humanities Department at MLR Institute of Technology.
              </p>
              <p className="mt-3 text-muted leading-relaxed text-[0.95rem]">
                She has organised and attended several National and International Conferences, Seminars and Workshops, and has published nearly 20 research papers in Journals of National and International Repute.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  'IUCEE Showcase Award — Excellence in Academic Leadership',
                  'Swarna Jayanti Puruskar — Best Research Paper (NASI)',
                  'IUCEE Showcase Award — Leadership of Teaching & Learning Centre',
                ].map((a) => (
                  <span key={a} className="px-3 py-1.5 rounded-full bg-warm-light border border-border font-sans text-[0.82rem] text-foreground">{a}</span>
                ))}
              </div>
            </div>
            <div className="md:w-64 shrink-0">
              <div className="rounded-2xl border border-border bg-warm-light p-6 space-y-4">
                <div>
                  <div className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Qualification</div>
                  <p className="text-foreground text-[0.93rem]">M.Sc., Ph.D — Physics<br /><span className="text-muted text-[0.85rem]">Hyderabad Central University</span></p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <div className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Specialisation</div>
                  <p className="text-foreground text-[0.93rem]">Density Functional Theory · Transparent Conducting Oxides</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <div className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Research Focus</div>
                  <p className="text-foreground text-[0.93rem]">TCOs · Smart Materials · Higher Education · ICT in Education</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section id="roles-responsibilities">
        <H2 italic="">Roles & Responsibilities</H2>
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-warm-light/40 p-8 text-center">
          <p className="text-muted italic text-[0.95rem]">Content to be updated.</p>
        </div>
      </Section>

        </div>
      </div>
    </>
  );
}
