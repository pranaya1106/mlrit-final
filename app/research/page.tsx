import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { RESEARCH_OVERVIEW, RESEARCH_NAV } from '@/lib/research';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Research — Overview — MLRIT' };

export default function ResearchPage() {
  const stats = [
    { num: '3',           label: 'Research Centres' },
    { num: '2016 – 2025', label: 'Publications' },
    { num: '2019',        label: 'IPFC Established' },
    { num: '25+',         label: 'Doctoral Faculty' },
  ];
  return (
    <>
      <PageHeader
        eyebrow="R&D Cell"
        title={RESEARCH_OVERVIEW.title}
        italic={RESEARCH_OVERVIEW.italic}
        dek={RESEARCH_OVERVIEW.dek}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }, { label: 'Overview' }]}
      />

      {/* Stat strip */}
      <section className="bg-ink-2 text-white py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-white/55">{s.label}</div>
              <div className="mt-2 font-sans font-black text-white text-[clamp(1.6rem,2.4vw,2.2rem)] tracking-tighter-2">{s.num}</div>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <H2 italic="of MLRIT's R&D">The pillars</H2>
        <Lede>Five threads weave through every research initiative at MLRIT — from culture-building to centres, faculty to scholars to live projects.</Lede>
        <ul className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-4">
          {RESEARCH_OVERVIEW.bullets?.map((b) => (
            <li key={b} className="flex items-start gap-3 text-[1.04rem] text-foreground">
              <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>
      </Section>

      {/* Sub-page index */}
      <Section surface>
        <H2 italic="this section">Explore</H2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESEARCH_NAV.filter((n) => n.slug).map((n) => (
            <Link key={n.slug} href={`/research/${n.slug}`} className="block rounded-2xl border border-border bg-white p-6 hover:border-primary hover:-translate-y-1 transition-all">
              <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">Research</div>
              <div className="mt-2 font-sans font-extrabold text-foreground text-lg">{n.label}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-primary font-semibold text-sm">Open →</div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
