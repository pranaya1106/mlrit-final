import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FACULTY, getFacultyBySlug, getAllFacultySlugs } from '@/lib/faculty';
import PageHeader from '@/components/PageHeader';

export function generateStaticParams() {
  return getAllFacultySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const f = getFacultyBySlug(params.slug);
  if (!f) return { title: 'Faculty — MLRIT' };
  return {
    title: `${f.name} — Faculty — MLRIT`,
    description: f.description
      ? f.description.slice(0, 160)
      : `${f.designation}, ${f.name} at MLR Institute of Technology.`,
  };
}

const DEPT_LABELS: Record<string, string> = {
  cse:          'Computer Science & Engineering',
  'cse-ds':     'Computer Science & Data Science',
  aiml:         'CSE (AI & ML)',
  ece:          'Electronics & Communication Engineering',
  eee:          'Electrical & Electronics Engineering',
  mechanical:   'Mechanical Engineering',
  aeronautical: 'Aeronautical Engineering',
  mba:          'Master of Business Administration',
  hs:           'Humanities & Sciences',
};

const DEPT_SLUGS: Record<string, string> = {
  cse:          'cse',
  'cse-ds':     'cse-ds',
  aiml:         'aiml',
  ece:          'ece',
  eee:          'eee',
  mechanical:   'mechanical',
  aeronautical: 'aeronautical',
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans font-extrabold text-foreground text-[1.05rem] tracking-tight mb-3 pb-2 border-b border-border">
      {children}
    </h2>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-border/60 last:border-0">
      <dt className="text-muted text-[0.82rem] font-medium min-w-[160px] shrink-0">{label}</dt>
      <dd className="text-foreground text-[0.9rem] leading-snug">{value}</dd>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="px-3 py-1 rounded-full bg-cream-2 border border-border text-foreground text-[0.78rem] font-medium leading-tight"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function FacultyProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const f = getFacultyBySlug(params.slug);
  if (!f) notFound();

  const deptLabel = DEPT_LABELS[f.department] ?? f.department;
  const deptPageSlug = DEPT_SLUGS[f.department];

  const initials = f.name
    .replace(/^(Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <>
      <PageHeader
        eyebrow="Faculty"
        title={f.name}
        dek={`${f.designation} · ${deptLabel}`}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Academics' },
          ...(deptPageSlug ? [{ label: deptLabel, href: `/departments/${deptPageSlug}` }] : [{ label: deptLabel }]),
          { label: f.name },
        ]}
        variant="green"
      />

      <div className="bg-cream min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
          <div className="grid lg:grid-cols-[300px_1fr] gap-10 xl:gap-16">

            {/* ── Left column: portrait + identity ── */}
            <aside className="flex flex-col gap-6">
              {/* Portrait */}
              <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-card-soft"
                style={{ background: 'linear-gradient(135deg, #2a2f40, #3a4050)' }}
              >
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image}
                    alt={f.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="eager"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center font-sans font-black text-5xl text-white/30">
                    {initials}
                  </div>
                )}
              </div>

              {/* Identity card */}
              <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
                <div>
                  <div className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted mb-1">
                    Designation
                  </div>
                  <div className="font-sans font-bold text-foreground text-[0.95rem] leading-snug">
                    {f.designation}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted mb-1">
                    Department
                  </div>
                  <div className="font-sans text-foreground text-[0.9rem] leading-snug">
                    {deptLabel}
                  </div>
                </div>
                {f.experience && (
                  <div>
                    <div className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted mb-1">
                      Teaching Experience
                    </div>
                    <div className="font-sans font-bold text-foreground text-[0.9rem]">
                      {f.experience} years
                    </div>
                  </div>
                )}
                {f.email && (
                  <div>
                    <div className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted mb-1">
                      Email
                    </div>
                    <a
                      href={`mailto:${f.email}`}
                      className="font-sans text-primary text-[0.85rem] hover:underline break-all"
                    >
                      {f.email}
                    </a>
                  </div>
                )}
                {f.profileLinks && Object.keys(f.profileLinks).length > 0 && (
                  <div>
                    <div className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted mb-2">
                      Profiles
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {f.profileLinks.googleScholar && (
                        <a
                          href={f.profileLinks.googleScholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.82rem] text-primary hover:underline truncate"
                        >
                          Google Scholar
                        </a>
                      )}
                      {f.profileLinks.scopus && (
                        <a
                          href={f.profileLinks.scopus}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.82rem] text-primary hover:underline truncate"
                        >
                          Scopus
                        </a>
                      )}
                      {f.profileLinks.orcid && (
                        <a
                          href={f.profileLinks.orcid}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.82rem] text-primary hover:underline truncate"
                        >
                          ORCID
                        </a>
                      )}
                      {f.profileLinks.linkedin && (
                        <a
                          href={f.profileLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.82rem] text-primary hover:underline truncate"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Back navigation */}
              {deptPageSlug && (
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/departments/${deptPageSlug}`}
                    className="inline-flex items-center gap-2 text-[0.82rem] font-medium text-muted hover:text-primary transition-colors"
                  >
                    <span aria-hidden>←</span> {deptLabel} Department
                  </Link>
                </div>
              )}
            </aside>

            {/* ── Right column: profile content ── */}
            <main className="space-y-10">

              {/* Biography */}
              {f.description && (
                <section aria-labelledby="bio-heading">
                  <SectionHeading>
                    <span id="bio-heading">Profile</span>
                  </SectionHeading>
                  <p className="text-foreground leading-relaxed text-[0.97rem] max-w-[70ch]">
                    {f.description}
                  </p>
                </section>
              )}

              {/* Academic Qualifications */}
              {f.qualifications.length > 0 && (
                <section aria-labelledby="quals-heading">
                  <SectionHeading>
                    <span id="quals-heading">Academic Qualifications</span>
                  </SectionHeading>
                  <dl className="divide-y divide-border/60">
                    {f.qualifications.map((q, i) => (
                      <div key={i} className="py-2.5">
                        <dd className="text-foreground text-[0.9rem] leading-snug">{q}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* Areas of Specialisation */}
              {f.specialization.length > 0 && (
                <section aria-labelledby="spec-heading">
                  <SectionHeading>
                    <span id="spec-heading">Areas of Specialisation</span>
                  </SectionHeading>
                  <TagList items={f.specialization} />
                </section>
              )}

              {/* Subjects Taught */}
              {f.subjectsTaught.length > 0 && (
                <section aria-labelledby="subjects-heading">
                  <SectionHeading>
                    <span id="subjects-heading">Subjects Taught</span>
                  </SectionHeading>
                  <TagList items={f.subjectsTaught} />
                </section>
              )}

              {/* Publications */}
              {f.publications.length > 0 && (
                <section aria-labelledby="pubs-heading">
                  <SectionHeading>
                    <span id="pubs-heading">Publications</span>
                  </SectionHeading>
                  <ol className="space-y-3 list-decimal list-outside pl-5">
                    {f.publications.map((pub, i) => (
                      <li
                        key={i}
                        className="text-foreground text-[0.88rem] leading-relaxed pl-1"
                      >
                        {pub}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Patents */}
              {f.patents.length > 0 && (
                <section aria-labelledby="patents-heading">
                  <SectionHeading>
                    <span id="patents-heading">Patents</span>
                  </SectionHeading>
                  <ol className="space-y-3 list-decimal list-outside pl-5">
                    {f.patents.map((p, i) => (
                      <li key={i} className="text-foreground text-[0.88rem] leading-relaxed pl-1">
                        {p}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Books & Book Chapters */}
              {f.books.length > 0 && (
                <section aria-labelledby="books-heading">
                  <SectionHeading>
                    <span id="books-heading">Books & Book Chapters</span>
                  </SectionHeading>
                  <ol className="space-y-3 list-decimal list-outside pl-5">
                    {f.books.map((b, i) => (
                      <li key={i} className="text-foreground text-[0.88rem] leading-relaxed pl-1">
                        {b}
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
