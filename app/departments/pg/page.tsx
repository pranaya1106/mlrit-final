import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { DEPARTMENTS } from '@/lib/departments';

export const metadata: Metadata = { title: 'Postgraduate Programmes — MLRIT' };

const MTECH = [
  { code: 'MTech-CSE',  name: 'Computer Science & Engineering', tag: 'AI/ML and systems specialisations.' },
  { code: 'MTech-VLSI', name: 'VLSI System Design',             tag: 'Front-end and back-end VLSI tracks with FPGA labs.' },
  { code: 'MTech-PS',   name: 'Power Systems',                  tag: 'Smart grid, renewables and protection.' },
  { code: 'MTech-AERO', name: 'Aerospace Propulsion',           tag: 'Propulsion, materials and unmanned systems.' },
];

export default function PGPage() {
  const mba = DEPARTMENTS.find((d) => d.slug === 'mba')!;
  return (
    <>
      <PageHeader
        eyebrow="M.Tech & MBA"
        title="Postgraduate"
        italic="programmes."
        dek="Two-year M.Tech specialisations and a two-year MBA — research-led, industry-anchored, designed for postgraduate growth."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Academics' }, { label: 'Postgraduate' }]}
      />
      <Section>
        <H2 italic="specialisations">M.Tech</H2>
        <Lede>Four research-led M.Tech tracks across CSE, VLSI, Power Systems and Aerospace Propulsion.</Lede>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {MTECH.map((m) => (
            <div key={m.code} className="rounded-2xl border border-border bg-white p-7 hover:border-primary transition-colors">
              <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">{m.code}</div>
              <div className="mt-2 font-sans font-extrabold text-foreground text-xl">{m.name}</div>
              <p className="mt-3 text-muted leading-relaxed">{m.tag}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section surface>
        <H2 italic="(Management)">MBA</H2>
        <Lede>{mba.tagline}</Lede>
        <Link href="/departments/mba" className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-white font-semibold hover:bg-primary transition-colors">
          Explore MBA programme →
        </Link>
      </Section>
    </>
  );
}
