import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Section } from '@/components/PageSection';
import { getSyllabusCourses } from '@/lib/syllabus-data';

type Params = { program: string; regulation: string };

const PROGRAMS    = ['cse', 'cse-ds', 'aiml', 'ece', 'eee', 'mechanical', 'aeronautical'];
const REGULATIONS = ['mlr18', 'mlr20', 'r22', 'r25'];

export function generateStaticParams() {
  const params: Params[] = [];
  for (const program of PROGRAMS) {
    for (const regulation of REGULATIONS) {
      params.push({ program, regulation });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return {
    title: `${params.program.toUpperCase()} · ${params.regulation.toUpperCase()} Syllabus — MLRIT`,
  };
}

export default function SyllabusPage({ params }: { params: Params }) {
  const semesters = Array.from({ length: 8 }, (_, i) => {
    const semNum = i + 1;
    return { semNum, courses: getSyllabusCourses(params.program, params.regulation, semNum) };
  });

  const hasCourses = semesters.some((s) => s.courses.length > 0);

  return (
    <>
      <PageHeader
        eyebrow={`${params.regulation.toUpperCase()} · ${params.program.toUpperCase()}`}
        title="Full programme"
        italic="syllabus."
        dek={`All eight semesters of the ${params.program.toUpperCase()} programme under ${params.regulation.toUpperCase()}. Click any subject to open its syllabus PDF.`}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Departments' },
          { label: params.program.toUpperCase(), href: `/departments/${params.program}` },
          { label: `${params.regulation.toUpperCase()} Syllabus` },
        ]}
        variant="green"
      />

      <Section>
        {!hasCourses ? (
          <p className="text-muted leading-relaxed">
            Subject-wise data for {params.regulation.toUpperCase()} hasn&apos;t been published yet.{' '}
            <Link href={`/departments/${params.program}`} className="text-primary font-semibold hover:underline">
              ← Back to {params.program.toUpperCase()}
            </Link>
          </p>
        ) : (
          <div className="space-y-14">
            {semesters.map(({ semNum, courses }) =>
              courses.length === 0 ? null : (
                <div key={semNum}>
                  <p className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-primary mb-1">
                    Year {Math.ceil(semNum / 2)} · Semester {((semNum - 1) % 2) + 1}
                  </p>
                  <h3 className="font-sans font-extrabold text-foreground text-xl tracking-tight mb-5">
                    Semester {semNum}
                  </h3>
                  <div className="overflow-hidden rounded-2xl border border-border bg-white">
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
                </div>
              )
            )}
          </div>
        )}
      </Section>

      <Section surface>
        <p className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-muted mb-4">Other Regulations</p>
        <div className="flex flex-wrap gap-2">
          {REGULATIONS.filter((r) => r !== params.regulation).map((r) => (
            <Link
              key={r}
              href={`/departments/syllabus/${params.program}/${r}`}
              className="px-3.5 py-2 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-semibold"
            >
              {r.toUpperCase()}
            </Link>
          ))}
          <Link
            href={`/departments/${params.program}`}
            className="px-3.5 py-2 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-semibold"
          >
            ← {params.program.toUpperCase()}
          </Link>
        </div>
      </Section>
    </>
  );
}
