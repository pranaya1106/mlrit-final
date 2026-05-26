import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DEPARTMENTS, getDepartment } from '@/lib/departments';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';

export function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const d = getDepartment(params.slug);
  if (!d) return { title: 'Department — MLRIT' };
  return { title: `${d.name} — MLRIT` };
}

export default function DepartmentPage({ params }: { params: { slug: string } }) {
  const d = getDepartment(params.slug);
  if (!d) notFound();
  return (
    <>
      <PageHeader
        eyebrow={`${d.degree} · ${d.code}`}
        title={`Department of`}
        italic={d.short}
        dek={d.tagline}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Departments' },
          { label: 'Undergraduate', href: '/departments/ug' },
          { label: d.code },
        ]}
        variant={d.accent}
      />

      {/* Quick facts */}
      <section className="bg-[#0B0F1A] text-white py-10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { lbl: 'Degree',   val: d.degree   },
            { lbl: 'Duration', val: d.duration },
            { lbl: 'Code',     val: d.code     },
            { lbl: 'Level',    val: d.level.toUpperCase() },
          ].map((s) => (
            <div key={s.lbl}>
              <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-white/55">{s.lbl}</div>
              <div className="mt-2 font-sans font-black text-white text-[clamp(1.4rem,2vw,2rem)] tracking-tighter-2">{s.val}</div>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <H2 italic="and Mission">Vision</H2>
        <Lede>{d.vision}</Lede>
        <ul className="mt-7 grid md:grid-cols-2 gap-x-10 gap-y-3.5">
          {d.mission.map((m) => (
            <li key={m} className="flex items-start gap-3 text-[1.02rem] text-foreground">
              <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-primary" />
              {m}
            </li>
          ))}
        </ul>
      </Section>

      <Section surface>
        <H2 italic="(PEOs)">Programme Educational Objectives</H2>
        <div className="mt-7 grid md:grid-cols-3 gap-5">
          {d.peos.map((peo) => (
            <div key={peo.id} className="rounded-2xl border border-border bg-white p-7">
              <div className="font-mono font-semibold text-[0.7rem] tracking-[0.18em] uppercase text-secondary">{peo.id}</div>
              <p className="mt-3 text-foreground leading-relaxed">{peo.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <H2 italic="of the Department">Head</H2>
            <div className="mt-6 rounded-2xl border border-border bg-white p-7">
              <div className="font-sans font-black text-foreground text-2xl tracking-tighter-2">{d.hod.name}</div>
              <div className="mt-1 text-muted">{d.hod.title}</div>
              <div className="mt-4 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">Contact</div>
              <div className="text-foreground">hod.{d.slug}@mlrit.ac.in</div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-warm-light p-8">
            <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-muted">Syllabus</div>
            <p className="mt-3 text-foreground">Curriculum versions for {d.code} — pick the regulation that applies to your batch.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['MLR-18', 'MLR-20', 'R22', 'R25'].map((reg) => (
                <Link key={reg} href={`/departments/syllabus/${d.slug}/${reg.toLowerCase().replace('-', '')}/year1/sem1`}
                      className="inline-flex px-3.5 py-2 rounded-full border border-foreground text-foreground font-medium text-sm hover:bg-foreground hover:text-white transition-colors">
                  {reg}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section surface>
        <H2 italic="branches">Browse other</H2>
        <div className="mt-6 flex flex-wrap gap-2">
          {DEPARTMENTS.filter((x) => x.slug !== d.slug).map((x) => (
            <Link key={x.slug} href={`/departments/${x.slug}`} className="px-3.5 py-2 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm">
              {x.code} · {x.short}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
