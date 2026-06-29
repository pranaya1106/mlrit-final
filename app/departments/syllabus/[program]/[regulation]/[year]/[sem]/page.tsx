import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
import { getSyllabusCourses } from '@/lib/syllabus-data';

type Params = { program: string; regulation: string; year: string; sem: string };

const PROGRAMS = ['cse', 'cse-ds', 'aiml', 'ece', 'eee', 'mechanical', 'aeronautical'];
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

export default function SyllabusPage({ params }: { params: Params }) {
  const semNum = parseInt(params.sem.replace('sem', ''), 10);
  const courses = getSyllabusCourses(params.program, params.regulation, semNum);

  // Helpers for related semester links
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
        dek={`Subject-wise syllabus PDFs for the ${params.program.toUpperCase()} programme under regulation ${params.regulation.toUpperCase()}. Click any subject to open its syllabus.`}
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
        {courses.length === 0 ? (
          <>
            <Lede>
              A subject-wise breakdown for {params.regulation.toUpperCase()} Semester {semNum} isn’t published yet.
              You can still download the complete syllabus for this regulation.
            </Lede>
            <div className="mt-6">
              <Link
                href={`/departments/${params.program}`}
                className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-primary px-5 py-2.5 font-sans font-bold text-[0.86rem] text-primary transition-colors hover:bg-primary/[0.06]"
              >
                ← Back to {params.program.toUpperCase()} · Academics
              </Link>
            </div>
          </>
        ) : (
          <>
            <Lede>{courses.length} subjects · click a row to open the syllabus PDF.</Lede>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
              <table className="w-full text-left text-[0.94rem]">
                <thead className="bg-warm-light/50">
                  <tr>
                    <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">Code</th>
                    <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">Subject</th>
                    <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted text-right">Syllabus</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, i) => (
                    <tr key={`${c.code}-${i}`} className="border-t border-border transition-colors hover:bg-warm-light/40">
                      <td className="px-5 py-3.5 font-sans font-bold text-foreground align-top whitespace-nowrap">{c.code}</td>
                      <td className="px-5 py-3.5">
                        <a
                          href={c.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-foreground hover:text-primary hover:underline"
                        >
                          {c.title}
                        </a>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <a
                          href={c.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[0.76rem] font-bold text-primary hover:underline"
                        >
                          View PDF ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
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
