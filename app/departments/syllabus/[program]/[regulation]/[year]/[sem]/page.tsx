import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';

type Params = { program: string; regulation: string; year: string; sem: string };

const PROGRAMS = ['cse', 'cse-cs', 'cse-ds', 'aiml', 'csit', 'it', 'ece', 'eee', 'mechanical', 'aeronautical'];
const REGULATIONS = ['mlr18', 'mlr20', 'r22', 'r25'];
const YEARS = ['year1', 'year2', 'year3', 'year4'];
const SEMS  = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'];

export function generateStaticParams() {
  // Generate full catalog: program × regulation × year/sem (sem maps to year)
  const params: Params[] = [];
  for (const program of PROGRAMS) {
    for (const regulation of REGULATIONS) {
      for (let y = 1; y <= 4; y++) {
        for (let s = 1; s <= 2; s++) {
          const semNum = (y - 1) * 2 + s;
          params.push({ program, regulation, year: `year${y}`, sem: `sem${semNum}` });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: `${params.program.toUpperCase()} · ${params.regulation.toUpperCase()} · ${params.year} ${params.sem} — Syllabus` };
}

function semCourses(program: string, sem: string) {
  // Stub course list — same shape every page
  const base: { code: string; title: string; ltp: string; credits: number; type: string }[] = [
    { code: 'BS101', title: 'Mathematics — I',              ltp: '3-1-0', credits: 4, type: 'Basic Sciences' },
    { code: 'BS102', title: 'Physics',                      ltp: '3-1-0', credits: 4, type: 'Basic Sciences' },
    { code: 'ES101', title: 'Programming Fundamentals',     ltp: '3-0-0', credits: 3, type: 'Engineering Sci.' },
    { code: 'ES102', title: 'Engineering Drawing',          ltp: '1-0-4', credits: 3, type: 'Engineering Sci.' },
    { code: 'HS101', title: 'English Communication',        ltp: '2-0-2', credits: 3, type: 'Humanities' },
    { code: 'LB101', title: 'Programming Lab',              ltp: '0-0-3', credits: 1.5, type: 'Laboratory' },
    { code: 'LB102', title: 'Physics Lab',                  ltp: '0-0-3', credits: 1.5, type: 'Laboratory' },
    { code: 'MC101', title: 'Mandatory — Induction',        ltp: '0-0-0', credits: 0, type: 'Mandatory' },
  ];
  return base;
}

export default function SyllabusPage({ params }: { params: Params }) {
  const courses = semCourses(params.program, params.sem);
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  // Helpers for related semester links
  const semNum = parseInt(params.sem.replace('sem', ''), 10);
  const allSems = SEMS.map((s, i) => ({
    label: `Sem ${i + 1}`,
    href: `/departments/syllabus/${params.program}/${params.regulation}/year${Math.ceil((i + 1) / 2)}/sem${i + 1}`,
    active: i + 1 === semNum,
  }));

  return (
    <>
      <PageHeader
        eyebrow={`${params.regulation.toUpperCase()} · ${params.program.toUpperCase()}`}
        title={`Year ${params.year.replace('year', '')} ·`}
        italic={`Sem ${semNum} Syllabus`}
        dek={`Course list, credits and L-T-P for the ${params.program.toUpperCase()} programme under regulation ${params.regulation.toUpperCase()}.`}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Departments' },
          { label: params.program.toUpperCase(), href: `/departments/${params.program}` },
          { label: params.regulation.toUpperCase() },
          { label: `Year ${params.year.replace('year', '')}` },
          { label: `Sem ${semNum}` },
        ]}
        variant="green"
      />

      <Section>
        <H2 italic="this semester">Courses</H2>
        <Lede>{courses.length} courses · {totalCredits} credits.</Lede>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-[0.94rem]">
            <thead className="bg-warm-light/50">
              <tr>
                <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">Code</th>
                <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">Course</th>
                <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">L-T-P</th>
                <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">Credits</th>
                <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">Type</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.code} className="border-t border-border">
                  <td className="px-5 py-3.5 font-sans font-bold text-foreground">{c.code}</td>
                  <td className="px-5 py-3.5 text-foreground">{c.title}</td>
                  <td className="px-5 py-3.5 font-mono text-muted">{c.ltp}</td>
                  <td className="px-5 py-3.5 font-mono text-foreground">{c.credits}</td>
                  <td className="px-5 py-3.5 text-muted">{c.type}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-warm-light/40">
              <tr className="border-t border-border">
                <td className="px-5 py-3.5 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted" colSpan={3}>Total credits</td>
                <td className="px-5 py-3.5 font-sans font-extrabold text-foreground" colSpan={2}>{totalCredits}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

      <Section surface>
        <H2 italic="in this regulation">Other semesters</H2>
        <Lede>Switch between semesters within {params.regulation.toUpperCase()} for the {params.program.toUpperCase()} programme.</Lede>
        <div className="mt-6 flex flex-wrap gap-2">
          {allSems.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className={`px-3.5 py-2 rounded-full border text-sm transition-colors ${
                s.active
                  ? 'bg-foreground text-white border-foreground'
                  : 'bg-white border-border hover:border-primary hover:text-primary'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {REGULATIONS.filter((r) => r !== params.regulation).map((r) => (
            <Link key={r}
                  href={`/departments/syllabus/${params.program}/${r}/year1/sem1`}
                  className="px-3.5 py-2 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm">
              Switch to {r.toUpperCase()}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
