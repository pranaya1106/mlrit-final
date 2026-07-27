import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { DEPARTMENTS } from '@/lib/departments';

export const metadata: Metadata = { title: 'Undergraduate Programmes — MLRIT' };

export default function UGPage() {
  const ugs = DEPARTMENTS
    .filter((d) => d.level === 'ug' && d.slug !== 'hs')
    .sort((a, b) => a.short.localeCompare(b.short));
  const freshman = DEPARTMENTS.find((d) => d.slug === 'hs');
  const allUgs = freshman ? [freshman, ...ugs] : ugs;
  return (
    <>
      <PageHeader
        eyebrow="B.Tech Programmes"
        title="Undergraduate"
        italic="programmes."
        dek="A four-year B.Tech across seven engineering branches, built on a shared first-year foundation — with an industry-integrated curriculum, hands-on labs and a culture of inquiry."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Academics' }, { label: 'Undergraduate' }]}
        variant="green"
      />
      <Section>
        <H2 italic="branches">Engineering</H2>
        <Lede>Every B.Tech branch at MLRIT is JNTUH-affiliated, AICTE-approved and offered as a 4-year programme.</Lede>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allUgs.map((d) => (
            <Link key={d.slug} href={`/departments/${d.slug}`} className="block rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all group">
              <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">{d.code}</div>
              <div className="mt-2 font-sans font-extrabold text-foreground text-xl">{d.short}</div>
              <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{d.tagline}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">Open → </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
