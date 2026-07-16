'use client';

/**
 * Department detail page — legacy-style layout, premium polish.
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │ Hero (green) — eyebrow pill + dept title            │
 *   ├──────────────────────────────────────────────────────┤
 *   │ Sticky dark tab bar — Overview · Objectives · …     │
 *   ├──────┬───────────────────────────────────────────────┤
 *   │ Side │ Active panel content                          │
 *   │ nav  │   • Introduction + HOD card                   │
 *   │      │   • Vision & Mission                          │
 *   │      │   • Innovative Teaching                       │
 *   │      │   • History · Labs accordions                 │
 *   └──────┴───────────────────────────────────────────────┘
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Department } from '@/lib/departments';
import { DEPT_DATA, type DeptData } from '@/lib/dept-data';
import { getFacultyByDepartment, type FacultyProfile } from '@/lib/faculty';
import { getSyllabusCourses } from '@/lib/syllabus-data';

type Props = { department: Department };
type PanelProps = { d: Department; data: DeptData };

const FALLBACK_DATA: DeptData = {
  vision: '',
  mission: [],
  history: '',
  introduction: '',
  hodMessage: '',
  teachingMethodology:
    'The department follows an active-learning pedagogy integrating project-based learning, flipped classrooms, and industry-mentored hackathons. Regular guest lectures from industry professionals complement the curriculum.',
  peos: [],
  labs: [],
  faculty: [],
  achievements: [],
};
type TabId = 'overview' | 'objectives' | 'faculty' | 'academics' | 'achievements' | 'committees';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',     label: 'Overview' },
  { id: 'objectives',   label: 'Objectives' },
  { id: 'faculty',      label: 'Faculty Profiles' },
  { id: 'academics',    label: 'Academics' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'committees',   label: 'Committees' },
];

const QUICK_NAV: Record<TabId, { id: string; label: string }[]> = {
  overview: [
    { id: 'intro',     label: 'Introduction' },
    { id: 'vm',        label: 'Vision & Mission' },
    { id: 'teaching',  label: 'Teaching' },
    { id: 'history',   label: 'History' },
    { id: 'labs',      label: 'Labs' },
  ],
  objectives: [
    { id: 'peos',     label: 'PEOs' },
    { id: 'obe',      label: 'OBE' },
    { id: 'handbook', label: 'Handbook' },
  ],
  faculty: [
    { id: 'all-faculty', label: 'All Faculty' },
  ],
  academics: [
    { id: 'syllabus-pdfs', label: 'Syllabus PDFs' },
    { id: 'catalog',       label: 'Course Catalog' },
    { id: 'explorer',      label: 'Syllabus Explorer' },
  ],
  achievements: [
    { id: 'achieve',     label: 'Achievements' },
    { id: 'honour',      label: 'Roll of Honour' },
    { id: 'pubs',        label: 'Publications' },
    { id: 'internships', label: 'Internships' },
    { id: 'placements',  label: 'Placements' },
  ],
  committees: [
    { id: 'dac',     label: 'DAC' },
    { id: 'pac',     label: 'PAC' },
    { id: 'experts', label: 'Domain Experts' },
  ],
};

export default function DepartmentDetail({ department: d }: Props) {
  const [tab, setTab] = useState<TabId>('overview');
  const [activeNav, setActiveNav] = useState<string>('intro');
  const data: DeptData = DEPT_DATA[d.slug] ?? {
    ...FALLBACK_DATA,
    vision: d.vision,
    mission: d.mission,
    peos: d.peos.map((p) => ({ id: p.id, text: p.text })),
  };

  // Scroll-spy — highlight nav item matching the section in view
  useEffect(() => {
    const items = QUICK_NAV[tab];
    if (!items.length) return;
    setActiveNav(items[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveNav(visible[0].target.id);
      },
      { rootMargin: '-220px 0px -60% 0px', threshold: 0 }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tab]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 220;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #1F6B24 0%, #2d8b55 50%, #1F6B24 100%)',
          minHeight: '40vh',
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 75% 30%, rgba(232,93,4,0.18), transparent 55%)',
          }}
        />
        <div
          className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16 flex flex-col justify-end"
          style={{ minHeight: '40vh' }}
        >
          <span className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-white/30 font-mono text-[0.7rem] font-extrabold tracking-[0.18em] uppercase text-secondary shadow-sm">
            {d.degree} — {d.name}
          </span>
          <h1 className="mt-6 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2rem,4.2vw,3.6rem)] max-w-[1100px]">
            Department of {d.name}
          </h1>
        </div>
      </section>

      {/* ── STICKY TAB BAR ─────────────────────────────────── */}
      <nav className="bg-white border-b border-border sticky z-40 overflow-x-auto transition-[top] duration-300 ease-out-quart" style={{ top: 'var(--subnav-top)' }}>
        <div className="flex items-center gap-1 max-w-[1600px] mx-auto px-2 md:px-6" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  window.scrollTo({
                    top: Math.max(0, window.scrollY),
                    behavior: 'auto',
                  });
                }}
                className={`shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                  active
                    ? 'text-foreground border-primary font-semibold'
                    : 'text-muted hover:text-foreground border-transparent hover:border-primary'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── BODY — sidebar + panels ────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
          {/* Sidebar */}
          <aside className="lg:sticky lg:self-start lg:top-[calc(var(--subnav-top)+80px)] transition-[top] duration-300 ease-out-quart">
            <div className="font-mono text-[0.62rem] font-extrabold tracking-[0.22em] uppercase text-secondary mb-4">
              Quick Nav
            </div>
            <nav className="flex flex-col gap-0.5">
              {QUICK_NAV[tab].map((n) => {
                const active = activeNav === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleNavClick(n.id)}
                    className={`group flex items-center gap-3 py-2.5 pl-3 pr-2 rounded-r-md text-left text-[0.86rem] transition-all duration-200 border-l-2 ${
                      active
                        ? 'border-primary bg-primary/[0.08] text-primary font-bold'
                        : 'border-transparent text-muted hover:text-foreground hover:border-border'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        active ? 'bg-primary' : 'bg-subtle group-hover:bg-foreground'
                      }`}
                    />
                    {n.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Panels */}
          <div className="min-w-0">
            {tab === 'overview'     && <OverviewPanel d={d} data={data} />}
            {tab === 'objectives'   && <ObjectivesPanel d={d} data={data} />}
            {tab === 'faculty'      && <FacultyPanel d={d} data={data} />}
            {tab === 'academics'    && <AcademicsPanel d={d} data={data} />}
            {tab === 'achievements' && <AchievementsPanel d={d} data={data} />}
            {tab === 'committees'   && <CommitteesPanel data={data} />}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════════════════
   Reusable bits
   ═════════════════════════════════════════════════════════ */

function PanelHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.6rem,2.5vw,2.2rem)] leading-[1.15] scroll-mt-[220px]"
    >
      {children}
      <span aria-hidden className="block mt-4 w-[60px] h-[4px] rounded-sm bg-primary" />
    </h2>
  );
}

function SubHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className="mt-12 mb-5 pb-2 border-b-2 border-secondary/15 font-sans font-extrabold text-[0.72rem] tracking-[0.14em] uppercase text-secondary scroll-mt-[220px]"
    >
      {children}
    </div>
  );
}

function Accordion({
  id,
  title,
  defaultOpen,
  autoToggle,
  children,
}: {
  id?: string;
  title: string;
  defaultOpen?: boolean;
  autoToggle?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoToggle || !id) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOpen(entry.isIntersecting),
      { rootMargin: '-220px 0px -40% 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoToggle, id]);

  return (
    <div
      ref={rootRef}
      id={id}
      className="mb-4 rounded-xl bg-white shadow-card-soft overflow-hidden scroll-mt-[220px]"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left border-l-[3px] transition-all duration-200 ${
          open
            ? 'border-primary bg-primary/[0.04]'
            : 'border-secondary hover:border-primary hover:bg-secondary/[0.04] hover:translate-x-1'
        }`}
      >
        <span className="font-sans font-bold text-foreground text-[0.95rem]">{title}</span>
        <span className={`text-xs transition-transform duration-300 ${open ? 'rotate-180 text-primary' : 'text-subtle'}`}>
          ▼
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out-smooth"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function AccentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-7 shadow-card-soft border-t-[3px] border-t-secondary hover:-translate-y-1 hover:shadow-card-strong hover:border-t-primary transition-all duration-300">
      <h3 className="font-sans font-extrabold text-foreground text-xl tracking-tighter-2 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   Panel 1 — OVERVIEW
   ═════════════════════════════════════════════════════════ */

function getInitials(name: string): string {
  return name
    .replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?|Prof\.?)\s*/i, '')
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function OverviewPanel({ d, data }: PanelProps) {
  const allFaculty = getFacultyByDepartment(d.slug);
  const hod = allFaculty.find((f) => f.isHod);
  const hodPhoto = hod?.image ?? data.faculty.find((f) => /head|hod/i.test(f.role))?.photo;
  const initials = getInitials(d.hod.name);
  const message =
    data.hodMessage ||
    `${d.tagline} Our team delivers an industry-aligned curriculum, runs well-resourced labs, and mentors every student from foundation to final-year capstone.`;

  return (
    <div className="space-y-2">
      <PanelHeading id="intro">Introduction</PanelHeading>

      {/* HOD card */}
      <div className="mt-8 flex flex-col md:flex-row gap-7 items-start rounded-2xl bg-white shadow-card-soft p-7 md:p-9 border-l-[4px] border-secondary">
        <div className="w-[110px] h-[110px] rounded-full overflow-hidden flex-shrink-0 grid place-items-center bg-secondary/10 border-[3px] border-secondary relative">
          {hodPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hodPhoto} alt={d.hod.name} className="absolute inset-0 w-full h-full object-cover object-top" />
          ) : (
            <span
              className="text-white font-sans font-black text-2xl tracking-wider"
              style={{ background: 'linear-gradient(135deg, #2d8b55, #1F6B24)' }}
            >
              <span className="grid place-items-center w-full h-full">{initials}</span>
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[0.68rem] font-extrabold tracking-[0.14em] uppercase text-primary mb-2">
            From the HOD&apos;s Desk
          </div>
          <p className="font-sans italic text-foreground/85 text-[0.96rem] leading-[1.8]">
            &ldquo;{message}&rdquo;
          </p>
          <div className="mt-3 font-sans font-bold text-secondary text-[0.86rem]">
            — {d.hod.name}, {d.hod.title.split(',')[0]}
          </div>
        </div>
      </div>

      {/* Introduction paragraph (if available) */}
      {data.introduction && (
        <p className="mt-6 text-foreground/80 leading-[1.85] text-[0.96rem] max-w-[860px]">
          {data.introduction}
        </p>
      )}

      {/* Vision and Mission */}
      <SubHeading id="vm">Vision and Mission</SubHeading>
      <div className="grid md:grid-cols-2 gap-6">
        <AccentCard title="Vision">
          <p className="text-foreground/85 leading-[1.75] text-[0.96rem]">{data.vision || d.vision}</p>
        </AccentCard>
        <AccentCard title="Mission">
          <ul className="space-y-2.5">
            {(data.mission.length ? data.mission : d.mission).map((m) => (
              <li key={m} className="flex items-start gap-3 text-foreground/85 leading-[1.7] text-[0.95rem]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </AccentCard>
      </div>

      {/* Innovative Teaching */}
      <SubHeading id="teaching">Innovative Teaching Methodology</SubHeading>
      <p className="text-foreground/80 leading-[1.85] text-[0.96rem] max-w-[860px]">
        {data.teachingMethodology}
      </p>

      {/* History */}
      <div className="mt-12 space-y-3">
        <Accordion id="history" title="History of the Department" autoToggle>
          <p className="text-foreground/80 leading-[1.75] text-[0.94rem]">
            {data.history ||
              `The Department of ${d.short} was established as part of MLRIT's founding commitment to engineering excellence. Intake has expanded steadily as demand from industry and PG programmes grew.`}
          </p>
        </Accordion>

        {/* Labs */}
        {data.labs.length > 0 && (
          <Accordion id="labs" title={`Academic Laboratories (${data.labs.length} Labs)`} autoToggle>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.labs.map((lab) => (
                <div
                  key={lab.name}
                  className="rounded-lg p-4 border-l-[3px] border-secondary hover:border-primary hover:-translate-y-1 hover:shadow-card-soft transition-all duration-300"
                  style={{ backgroundColor: '#f9f8f5' }}
                >
                  <div className="font-sans font-bold text-foreground text-[0.88rem] leading-tight">{lab.name}</div>
                  <div className="mt-1 text-muted text-[0.78rem] leading-snug">{lab.desc}</div>
                </div>
              ))}
            </div>
          </Accordion>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   Panel 2 — OBJECTIVES
   ═════════════════════════════════════════════════════════ */

function ObjectivesPanel({ d, data }: PanelProps) {
  const peos = data.peos.length ? data.peos : d.peos.map((p) => ({ id: p.id, text: p.text }));
  return (
    <div>
      <PanelHeading id="peos">Programme Educational Objectives</PanelHeading>
      <div className="mt-8 grid md:grid-cols-3 gap-5">
        {peos.map((p) => (
          <div
            key={p.id}
            className="rounded-xl bg-white p-7 shadow-card-soft border-t-[3px] border-t-secondary hover:border-t-primary hover:-translate-y-1 hover:shadow-card-strong transition-all duration-300 text-center"
          >
            <div className="font-mono font-extrabold text-[0.7rem] tracking-[0.14em] uppercase text-secondary mb-3">
              {p.id}
            </div>
            <p className="text-foreground/85 leading-[1.7] text-[0.95rem]">{p.text}</p>
          </div>
        ))}
      </div>

      <SubHeading id="obe">Outcome Based Education (OBE)</SubHeading>
      <div className="grid md:grid-cols-2 gap-10">
        {(['B.Tech', 'M.Tech'] as const).map((level) => (
          <div key={level}>
            <h4 className="font-sans font-extrabold text-[0.82rem] tracking-[0.08em] uppercase text-secondary mb-3">
              {level}
            </h4>
            <ul className="space-y-0">
              {[
                'Educational Objectives and Outcomes',
                'OBE Process Manual',
                'Course Outcomes Description Booklets',
                'Course Outcomes (COs) Attainment',
                'Program Outcomes (POs) Attainment',
              ].map((item) => (
                <li
                  key={item}
                  className="group py-2.5 pl-5 border-b border-foreground/[0.06] text-foreground/85 text-[0.92rem] relative cursor-default transition-all duration-200 hover:translate-x-1.5 hover:text-foreground"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-[18px] w-1.5 h-1.5 rounded-full bg-primary transition-transform duration-200 group-hover:scale-150"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SubHeading id="handbook">Handbook</SubHeading>
      <div className="max-w-[500px] rounded-xl bg-white p-7 shadow-card-soft">
        <h3 className="font-sans font-extrabold text-foreground text-xl mb-2">Programme Handbook</h3>
        <p className="text-muted leading-relaxed text-[0.94rem]">
          Comprehensive document covering curriculum, regulations, attendance, evaluation, code of conduct and all
          programme-level information.
        </p>
        <a href="#" className="mt-4 inline-flex items-center gap-2 font-sans font-bold text-[0.82rem] text-primary hover:gap-3 transition-all">
          Download handbook →
        </a>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   Panel 3 — FACULTY PROFILES
   ═════════════════════════════════════════════════════════ */

function FacultyPanel({ d, data }: PanelProps) {
  const newFaculty = getFacultyByDepartment(d.slug);

  // Fall back to old data only if no new records exist for this dept
  const useNew = newFaculty.length > 0;

  if (useNew) {
    return (
      <div>
        <PanelHeading id="all-faculty">Faculty Profiles</PanelHeading>
        <p className="mt-6 text-muted max-w-[700px] leading-relaxed">
          The department is led by a doctoral-strong team across teaching, research and industry engagement.
          Total faculty: <strong className="text-foreground">{newFaculty.length}</strong>.
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {newFaculty.map((f: FacultyProfile) => {
            const initials = getInitials(f.name);
            return (
              <Link
                key={f.slug}
                href={`/faculty/${f.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-card-soft hover:shadow-card-strong transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                style={{ background: 'linear-gradient(135deg, #2a2f40, #3a4050)' }}
                aria-label={`View profile of ${f.name}`}
              >
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image}
                    alt={f.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-400 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center font-sans font-black text-4xl text-white/35 group-hover:opacity-0 transition-opacity">
                    {initials}
                  </div>
                )}

                {/* Bottom name strip */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/90 via-black/55 to-transparent text-white group-hover:opacity-0 transition-opacity">
                  <div className="font-sans font-bold text-[0.84rem] leading-tight line-clamp-2">{f.name}</div>
                  <div className="text-white/65 text-[0.66rem] mt-0.5">{f.designation}</div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center text-center p-5">
                  <div>
                    <div className="font-sans font-bold text-white text-[0.98rem] leading-tight">{f.name}</div>
                    <div className="mt-1 text-white/55 text-[0.7rem]">{f.designation}</div>
                    {f.specialization.length > 0 && (
                      <div className="mt-3 font-mono font-bold text-primary text-[0.7rem] tracking-[0.04em] leading-snug">
                        {f.specialization.slice(0, 2).join(' · ')}
                      </div>
                    )}
                    <div className="mt-5 inline-block px-4 py-1.5 rounded-md border border-white/30 text-white text-[0.7rem] font-bold">
                      View profile
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Legacy fallback for departments without new data yet
  const faculty = data.faculty.length > 0
    ? data.faculty
    : [{ name: d.hod.name, role: 'Head of Department', specialization: d.short }];

  return (
    <div>
      <PanelHeading id="all-faculty">Faculty Profiles</PanelHeading>
      <p className="mt-6 text-muted max-w-[700px] leading-relaxed">
        The department is led by a doctoral-strong team across teaching, research and industry engagement.
        Total faculty: <strong className="text-foreground">{faculty.length}</strong>.
      </p>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {faculty.map((f) => {
          const initials = getInitials(f.name);
          return (
            <div
              key={f.name + f.role}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-card-soft hover:shadow-card-strong transition-shadow duration-300"
              style={{ background: 'linear-gradient(135deg, #2a2f40, #3a4050)' }}
            >
              {f.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.photo}
                  alt={f.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-400 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center font-sans font-black text-4xl text-white/35 group-hover:opacity-0 transition-opacity">
                  {initials}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/90 via-black/55 to-transparent text-white group-hover:opacity-0 transition-opacity">
                <div className="font-sans font-bold text-[0.84rem] leading-tight line-clamp-2">{f.name}</div>
                <div className="text-white/65 text-[0.66rem] mt-0.5">{f.role}</div>
              </div>
              <div className="absolute inset-0 bg-ink/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center text-center p-5">
                <div>
                  <div className="font-sans font-bold text-white text-[0.98rem] leading-tight">{f.name}</div>
                  <div className="mt-1 text-white/55 text-[0.7rem]">{f.role}</div>
                  {f.specialization && (
                    <div className="mt-3 font-mono font-bold text-primary text-[0.7rem] tracking-[0.04em] leading-snug">
                      {f.specialization}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   Panel 4 — ACADEMICS
   ═════════════════════════════════════════════════════════ */

const SYLLABUS_REGS: { code: string; slug: string; label: string }[] = [
  { code: 'R25',   slug: 'r25',   label: '2025 regulation' },
  { code: 'R22',   slug: 'r22',   label: '2022 regulation' },
  { code: 'MLR20', slug: 'mlr20', label: 'MLR 2020 regulation' },
  { code: 'MLR18', slug: 'mlr18', label: 'MLR 2018 regulation' },
];

// Department slug → prefix used by the complete-syllabus PDFs in /public/syllabus.
// Most departments match their slug; mechanical/aeronautical use shortened prefixes.
const SYLLABUS_FILE_PREFIX: Record<string, string> = {
  mechanical: 'mech',
  aeronautical: 'aero',
};

// Which regulations have a complete-syllabus PDF on disk, per department.
// Source: scraped from mlrit.ac.in and saved to /public/syllabus/<prefix>-<reg>-syllabus.pdf.
const SYLLABUS_AVAILABLE: Record<string, string[]> = {
  cse:          ['r25', 'r22', 'mlr20', 'mlr18'],
  'cse-ds':     ['r25', 'r22', 'mlr20'],
  aiml:         ['r25', 'r22', 'mlr20'],
  ece:          ['r25', 'r22', 'mlr20'],
  eee:          ['r25', 'r22', 'mlr20', 'mlr18'],
  mechanical:   ['r25', 'r22', 'mlr20', 'mlr18'],
  aeronautical: ['r25', 'r22', 'mlr18'],
};

function syllabusPdfHref(deptSlug: string, regSlug: string): string {
  const prefix = SYLLABUS_FILE_PREFIX[deptSlug] ?? deptSlug;
  return `/syllabus/${prefix}-${regSlug}-syllabus.pdf`;
}

function AcademicsPanel({ d }: PanelProps) {
  const availableRegSlugs = SYLLABUS_AVAILABLE[d.slug] ?? [];
  const availableRegs = SYLLABUS_REGS.filter((r) => availableRegSlugs.includes(r.slug));
  const regsForCatalog = availableRegs.length ? availableRegs : SYLLABUS_REGS;

  // Regulations that actually have per-subject data in SYLLABUS_DATA
  const regsWithData = SYLLABUS_REGS.filter((r) =>
    [1, 2, 3, 4, 5, 6, 7, 8].some((sem) => getSyllabusCourses(d.slug, r.slug, sem).length > 0)
  );

  const [activeReg, setActiveReg] = useState(regsWithData[0]?.slug ?? regsForCatalog[0]?.slug ?? 'r25');

  const semesters = Array.from({ length: 8 }, (_, i) => {
    const semNum = i + 1;
    return { semNum, courses: getSyllabusCourses(d.slug, activeReg, semNum) };
  }).filter((s) => s.courses.length > 0);

  return (
    <div>
      <PanelHeading id="syllabus-pdfs">Academics</PanelHeading>

      {/* ── Syllabus PDFs ── */}
      <SubHeading>Syllabus PDFs</SubHeading>
      {availableRegs.length === 0 ? (
        <p className="text-muted leading-relaxed text-[0.92rem]">
          Complete syllabus PDFs for this programme will be published here soon.
        </p>
      ) : (
        <div className="space-y-4">
          {availableRegs.map((r) => {
            const pdfHref = syllabusPdfHref(d.slug, r.slug);
            return (
              <div
                key={r.slug}
                className="flex flex-col gap-4 rounded-xl bg-white p-5 md:p-6 shadow-card-soft border-l-[3px] border-secondary transition-all hover:-translate-y-0.5 hover:shadow-card-strong sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="font-sans font-bold text-foreground text-[1rem]">{r.code} Complete Syllabus</div>
                  <div className="mt-0.5 text-muted text-[0.82rem]">{r.label}</div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <a
                    href={pdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border-[1.5px] border-primary px-5 py-2.5 font-sans font-bold text-[0.86rem] text-primary transition-colors hover:bg-primary/[0.06]"
                  >
                    View
                  </a>
                  <a
                    href={pdfHref}
                    download
                    className="inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-2.5 font-sans font-bold text-[0.86rem] text-white transition-colors hover:bg-secondary-pressed"
                  >
                    Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Online Course Catalog ── */}
      <SubHeading id="catalog">Online Course Catalog</SubHeading>
      <div className="space-y-4">
        {regsForCatalog.map((r) => (
          <Link
            key={r.slug}
            href={`/departments/syllabus/${d.slug}/${r.slug}`}
            className="group flex items-center justify-between gap-4 rounded-xl bg-white p-5 md:p-6 shadow-card-soft border-l-[3px] border-secondary transition-all hover:-translate-y-0.5 hover:shadow-card-strong"
          >
            <div className="min-w-0">
              <div className="font-sans font-bold text-foreground text-[1rem]">{r.code} Course Catalog</div>
              <div className="mt-0.5 text-muted text-[0.82rem]">{r.label} · all semesters</div>
            </div>
            <span className="inline-flex flex-shrink-0 items-center gap-2 font-mono text-[0.76rem] font-bold text-primary transition-all group-hover:gap-3">
              Open ↗
            </span>
          </Link>
        ))}
      </div>

      {/* ── Inline Syllabus ── */}
      <SubHeading id="syllabus-inline">Subject-wise Syllabus</SubHeading>

      {/* Regulation pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {regsWithData.map((r) => (
          <button
            key={r.slug}
            onClick={() => setActiveReg(r.slug)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
              activeReg === r.slug
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-border text-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {r.code}
          </button>
        ))}
      </div>

      {semesters.length === 0 ? (
        <p className="text-muted text-[0.92rem]">
          Subject-wise data for {activeReg.toUpperCase()} hasn&apos;t been published yet.
        </p>
      ) : (
        <div className="space-y-10">
          {semesters.map(({ semNum, courses }) => (
            <div key={semNum}>
              <p className="font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase text-primary mb-1">
                Year {Math.ceil(semNum / 2)} · Semester {((semNum - 1) % 2) + 1}
              </p>
              <h4 className="font-sans font-extrabold text-foreground text-lg tracking-tight mb-4">
                Semester {semNum}
              </h4>
              <div className="overflow-x-auto overflow-hidden rounded-xl border border-border bg-white">
                <table className="w-full text-left text-[0.9rem]">
                  <thead className="bg-warm-light/50">
                    <tr>
                      <th className="px-4 py-3 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted">Code</th>
                      <th className="px-4 py-3 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted">Subject</th>
                      <th className="px-4 py-3 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-muted text-right">PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, i) => (
                      <tr key={`${c.code}-${i}`} className="border-t border-border hover:bg-warm-light/40 transition-colors">
                        <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap align-top">{c.code}</td>
                        <td className="px-4 py-3">
                          <a
                            href={c.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground hover:text-primary hover:underline"
                          >
                            {c.title}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <a
                            href={c.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[0.72rem] font-bold text-primary hover:underline"
                          >
                            View ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   Panel 5 — ACHIEVEMENTS
   ═════════════════════════════════════════════════════════ */

function AchievementsPanel({ d, data }: PanelProps) {
  const items = data.achievements.length
    ? data.achievements
    : [
        { title: 'NBA Accreditation', desc: `${d.code} programme accredited by the National Board of Accreditation.` },
        { title: 'Highest package',   desc: '44 LPA in 2024-25 — top quartile placements.' },
        { title: 'Research output',   desc: 'Active publications in IEEE/Springer/Elsevier indexed venues.' },
        { title: 'Industry MoUs',     desc: 'Active partnerships with Virtusa, EPAM, Boeing, Cyient and TATA.' },
      ];

  return (
    <div>
      <PanelHeading id="achieve">Achievements</PanelHeading>
      <div className="mt-8 grid sm:grid-cols-2 gap-5 max-w-[900px]">
        {items.map((a) => (
          <div
            key={a.title}
            className="rounded-xl bg-white p-6 shadow-card-soft border-l-[3px] border-primary hover:-translate-y-1 hover:shadow-card-strong transition-all"
          >
            <h4 className="font-sans font-bold text-foreground text-[0.98rem] mb-1.5">{a.title}</h4>
            <p className="text-muted text-[0.88rem] leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>

      <SubHeading id="honour">Roll of Honour</SubHeading>
      <p className="text-muted leading-relaxed max-w-[720px]">
        Student achievers, gold-medalists and university rank-holders are honoured each year.
      </p>

      <SubHeading id="pubs">Publications</SubHeading>
      <p className="text-muted leading-relaxed max-w-[720px]">
        Faculty publications across journals and conferences. Browse by year on the department&apos;s research portal.
      </p>

      <SubHeading id="internships">Internships</SubHeading>
      <p className="text-muted leading-relaxed max-w-[720px]">
        Live internships with MoU partners and industry mentors during summer and final-year semesters.
      </p>

      <SubHeading id="placements">Placements</SubHeading>
      <p className="text-muted leading-relaxed max-w-[720px]">
        See the full placement performance on the{' '}
        <Link href="/placements" className="text-primary font-semibold hover:underline">
          Placements page
        </Link>
        .
      </p>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   Panel 6 — COMMITTEES
   ═════════════════════════════════════════════════════════ */

function CommitteesPanel({ data }: { data: DeptData }) {
  const committees =
    data.committees && data.committees.length
      ? data.committees.map((c, i) => ({
          id: i === 0 ? 'dac' : i === 1 ? 'pac' : 'experts',
          name: c.name,
          members: c.members,
        }))
      : [
          { id: 'dac',     name: 'Departmental Advisory Committee (DAC)', members: undefined },
          { id: 'pac',     name: 'Programme Advisory Committee (PAC)',    members: undefined },
          { id: 'experts', name: 'Domain Experts',                        members: undefined },
        ];

  return (
    <div>
      <PanelHeading>Departmental Committees</PanelHeading>
      <div className="mt-8 space-y-5">
        {committees.map((c) => (
          <div
            key={c.id + c.name}
            id={c.id}
            className="rounded-xl bg-white p-7 shadow-card-soft border-l-[3px] border-secondary scroll-mt-[220px]"
          >
            <div className="font-mono text-[0.7rem] font-extrabold tracking-[0.14em] uppercase text-secondary mb-2">
              {c.id.toUpperCase()}
            </div>
            <h3 className="font-sans font-extrabold text-foreground text-xl">{c.name}</h3>
            {c.members && c.members.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {c.members.map((m) => (
                  <li key={m} className="flex items-start gap-3 text-foreground/85 text-[0.93rem] leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted leading-relaxed">
                Senior internal &amp; external advisors shaping departmental direction.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
