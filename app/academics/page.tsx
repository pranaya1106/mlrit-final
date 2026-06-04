import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { DEPARTMENTS } from '@/lib/departments';

export const metadata: Metadata = {
  title: 'Academics — MLR Institute of Technology',
  description: 'Outcome-based, autonomous engineering education at MLRIT. UG / PG programmes across 10 branches, research-led curriculum, JNTUH-affiliated, AICTE-approved, NBA accredited.',
};

const FRAMEWORKS = [
  { tag: 'OBE',       title: 'Outcome-Based Education', body: 'Every course maps to defined Course Outcomes (COs), Programme Outcomes (POs) and Programme Educational Objectives (PEOs) — measured at every internal and external assessment.' },
  { tag: 'Autonomy',  title: 'Autonomous Regulations',  body: 'UGC-granted autonomous status. MLRIT designs its own regulations (R22, R25), reviews syllabi each academic year, and assesses students through internal evaluations.' },
  { tag: 'Industry',  title: 'Industry Integration',     body: 'Centres of Excellence with Virtusa, EPAM, Tata Technologies and Boeing — embedded into the curriculum. Capstone projects with live datasets and industry mentors.' },
  { tag: 'Research',  title: 'Research-Led Teaching',   body: 'Doctoral faculty bring active research into UG courses. Three JNTUH-recognised research centres and the IPFC support student innovation from year one.' },
];

const HUB_LINKS = [
  { href: '/departments/ug',              title: 'Undergraduate Programmes', body: 'Ten B.Tech branches — from CSE and AI/ML to Aeronautical Engineering.', tag: 'B.Tech' },
  { href: '/departments/pg',              title: 'Postgraduate Programmes',  body: 'M.Tech specialisations across CSE, VLSI, Power Systems and Aerospace — plus the MBA programme.', tag: 'M.Tech / MBA' },
  { href: '/departments/faculty-profile', title: 'Faculty Profiles',         body: 'Department heads, professors and researchers — meet the people shaping the academic programmes.', tag: 'Faculty' },
  { href: '/research',                    title: 'Research and Development',  body: 'Three JNTUH-recognised centres, 1,200+ publications, 42 patents, ongoing DRDO/DST/AICTE projects.', tag: 'R&D' },
  { href: '/iqac',                        title: 'Internal Quality Assurance',body: 'IQAC — coordinating audits, AQAR submissions, NAAC and NBA accreditation cycles.', tag: 'Quality' },
  { href: '/chronicles',                  title: 'Chronicles',               body: 'The campus broadsheet — stories from students, faculty and alumni.', tag: 'Stories' },
];

const REGULATIONS = [
  { code: 'R25',    note: 'Latest autonomous regulation — applied to 2025 intake onwards.', live: true  },
  { code: 'R22',    note: 'Autonomous regulation effective 2022 — currently mid-degree batches.', live: true },
  { code: 'MLR-20', note: 'Affiliated JNTUH regulation 2020 — graduating cohort.', live: false },
  { code: 'MLR-18', note: 'Earlier JNTUH regulation 2018 — archive only.', live: false },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Education that"
        italic="adapts faster than industry."
        dek="An autonomous, outcome-based, research-led academic system. Ten engineering branches at the undergraduate level, four M.Tech specialisations, an MBA programme, and doctoral research across five disciplines."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Academics' }]}
        variant="green"
      />

      {/* FRAMEWORK */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">How We Teach</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              The four <span className="font-display italic font-medium" style={gradientText}>frameworks.</span>
            </h2>
            <p className="mt-4 max-w-[720px] text-muted leading-relaxed">
              Every academic decision at MLRIT runs through four lenses — outcome-based teaching, autonomy of regulation, industry integration, and research-led depth.
            </p>
          </Reveal>
          <Stagger className="mt-12 grid md:grid-cols-2 gap-5" delay={0.1}>
            {FRAMEWORKS.map((f) => (
              <StaggerItem key={f.tag}>
                <div className="rounded-2xl border border-border bg-white p-8 h-full hover:border-primary transition-colors">
                  <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-primary">{f.tag}</div>
                  <h3 className="mt-3 font-sans font-extrabold text-foreground text-xl md:text-2xl tracking-tighter-2">{f.title}</h3>
                  <p className="mt-3 text-muted leading-relaxed">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* HUB LINKS */}
      <section className="bg-warm-light py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Explore</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Pick your <span className="font-display italic font-medium" style={gradientText}>thread.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.08}>
            {HUB_LINKS.map((h) => (
              <StaggerItem key={h.href}>
                <Link href={h.href} className="block rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all h-full">
                  <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-primary">{h.tag}</div>
                  <h3 className="mt-2 font-sans font-extrabold text-foreground text-xl">{h.title}</h3>
                  <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{h.body}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-primary font-semibold text-sm">Open →</div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Departments</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Nine <span className="font-display italic font-medium" style={gradientText}>departments.</span>
            </h2>
            <p className="mt-4 max-w-[680px] text-muted leading-relaxed">
              From core engineering to emerging specialisations — every department runs its own labs, research and placement track.
            </p>
          </Reveal>
          <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.05}>
            {DEPARTMENTS.map((d) => (
              <StaggerItem key={d.slug}>
                <Link href={`/departments/${d.slug}`} className="block rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all">
                  <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-secondary">{d.code} · {d.degree}</div>
                  <div className="mt-2 font-sans font-extrabold text-foreground text-lg leading-tight">{d.short}</div>
                  <p className="mt-2 text-muted text-[0.94rem] leading-relaxed">{d.tagline}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SYLLABUS REGULATIONS */}
      <section className="bg-ink text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Curriculum</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Active <span className="font-display italic font-medium text-warm">regulations.</span>
            </h2>
            <p className="mt-4 max-w-[640px] text-white/65 leading-relaxed">
              MLRIT operates under autonomous regulations from 2022 onwards. Earlier JNTUH-affiliated regulations remain on file for graduating batches.
            </p>
          </Reveal>
          <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5" delay={0.08}>
            {REGULATIONS.map((r) => (
              <StaggerItem key={r.code}>
                <div className={`rounded-2xl border p-7 h-full transition-all ${r.live ? 'border-warm/40 bg-white/[0.04] hover:bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] opacity-70'}`}>
                  <div className={`font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase ${r.live ? 'text-warm' : 'text-white/40'}`}>
                    {r.live ? 'Live' : 'Archive'}
                  </div>
                  <div className="mt-2 font-sans font-black text-white text-2xl tracking-tighter-2">{r.code}</div>
                  <p className="mt-3 text-white/70 text-[0.94rem]">{r.note}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2} className="mt-10 text-center">
            <Link href="/departments/syllabus/cse/r25/year1/sem1" className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-warm text-foreground font-semibold text-sm hover:bg-white transition-colors">
              Open R25 · CSE · Sem 1 →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};
