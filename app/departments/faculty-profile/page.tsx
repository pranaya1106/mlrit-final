import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';

export const metadata: Metadata = { title: 'Faculty Profiles — MLRIT' };

const FACULTY = [
  { name: 'Dr. K. Srinivas Rao',    dept: 'CSE',  title: 'Professor & IQAC Coordinator', focus: 'AI/ML · Algorithms · Cloud' },
  { name: 'Dr. M. Anitha',          dept: 'AIML', title: 'Associate Professor & HoD',    focus: 'Explainable AI · Deep Learning' },
  { name: 'Dr. P. Rajashekar',      dept: 'ECE',  title: 'Professor & HoD',              focus: 'VLSI · Embedded Systems' },
  { name: 'Prof. Ashok Kumar Cheeli', dept: 'EEE', title: 'Professor & HoD',             focus: 'Power Electronics · Smart Grid' },
  { name: 'Dr. K. Eshwara Prasad',  dept: 'MECH', title: 'Professor & HoD',              focus: 'Thermal · Manufacturing' },
  { name: 'Dr. M. Komaraiah',       dept: 'AERO', title: 'Professor & HoD',              focus: 'Propulsion · UAV Design' },
  { name: 'Dr. P. Raj Kumar',       dept: 'IT/CSIT', title: 'Professor & HoD',           focus: 'Cloud · DevOps · Systems' },
  { name: 'Dr. K. Tulasi Krishna Kumar', dept: 'MBA', title: 'Professor & HoD',          focus: 'Analytics · Marketing' },
  { name: 'Dr. T. Sumathi',         dept: 'Freshman', title: 'Professor & Coordinator',  focus: 'Mathematics · Communication' },
];

export default function FacultyPage() {
  return (
    <>
      <PageHeader
        eyebrow="People"
        title="Faculty"
        italic="profiles."
        dek="Department heads, professors and researchers — meet the people shaping MLRIT's academic and research programmes."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Academics' }, { label: 'Faculty' }]}
        variant="green"
      />
      <Section>
        <H2 italic="of Departments">Heads</H2>
        <Lede>Each department is led by a senior professor with active research and industry engagement.</Lede>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FACULTY.map((f) => (
            <div key={f.name} className="rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all">
              <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-secondary">{f.dept}</div>
              <div className="mt-2 font-sans font-extrabold text-foreground text-lg">{f.name}</div>
              <div className="mt-1 text-muted">{f.title}</div>
              <div className="mt-3 text-foreground text-[0.92rem]">{f.focus}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
