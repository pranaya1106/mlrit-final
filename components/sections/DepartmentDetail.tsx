'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DEPARTMENTS, type Department } from '@/lib/departments';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ChevronRight, ArrowRight } from '@/components/icons';

export default function DepartmentDetail({ department: d }: { department: Department }) {
  return (
    <div className="bg-white">
      <Hero d={d} />
      <Snapshot d={d} />
      <BuildYears d={d} />
      <HowYouLearn d={d} />
      <HODBlock d={d} />
      <PEOs d={d} />
      <Outcomes d={d} />
      <SyllabusBlock d={d} />
      <SiblingBranches current={d.slug} />
      <ApplyBanner d={d} />
    </div>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */
function Hero({ d }: { d: Department }) {
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      {/* Soft radial accents */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-primary/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-secondary/[0.10] blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 lg:py-40">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-white/55 mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="text-white/30">/</span>
            <Link href="/departments/ug" className="hover:text-primary">{d.level === 'pg' ? 'Postgraduate' : 'Undergraduate'}</Link>
            <span className="text-white/30">/</span>
            <span>{d.code}</span>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
          <div>
            <Reveal delay={0.05}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-warm font-mono text-[0.66rem] font-extrabold tracking-[0.22em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {d.degree} · {d.code}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 font-sans font-extrabold tracking-tighter-3 leading-[0.96] text-white text-[clamp(2.6rem,6vw,5.6rem)]">
                {d.degree === 'MBA' ? 'A two-year' : 'A four-year'} <span className="font-display italic font-medium text-warm">{d.degree}</span>
                <br />
                where you build{' '}
                <span
                  className="font-display italic font-medium"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #fff 0%, var(--primary) 110%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', color: 'transparent',
                  }}
                >
                  {d.short.toLowerCase()}.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-[640px] text-white/72 leading-relaxed text-[clamp(1.05rem,1.3vw,1.2rem)]">
                {d.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="https://mlrit.ac.in/admissions/" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-2.5 h-12 pl-3 pr-6 rounded-[10px] bg-primary text-white font-semibold text-[0.92rem] border border-primary hover:bg-primary-hover hover:shadow-primary-glow hover:-translate-y-0.5 transition-all"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/20">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  Apply Now
                </Link>
                <Link
                  href={`/departments/syllabus/${d.slug}/r25/year1/sem1`}
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] bg-transparent text-white font-semibold text-[0.92rem] border border-white/30 hover:bg-white hover:text-foreground transition-all"
                >
                  View Curriculum
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Eligibility & quick info card */}
          <Reveal delay={0.25}>
            <div className="rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur p-7">
              <span className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-warm/65">At a glance</span>
              <ul className="mt-5 divide-y divide-white/10">
                {[
                  ['Degree',       d.degree],
                  ['Duration',     d.duration],
                  ['Code',         d.code],
                  ['Level',        d.level.toUpperCase()],
                  ['Eligibility',  d.degree === 'MBA' ? 'Graduate · TS-ICET / valid score' : 'Class XII PCM · TS-EAPCET / JEE Main'],
                  ['Affiliation',  'JNTUH · AICTE approved'],
                  ['EAPCET Code',  'MLID'],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between py-3.5">
                    <span className="font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/55">{k}</span>
                    <span className="font-sans font-semibold text-white text-right">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── SNAPSHOT STRIP ───────────────────────────── */
function Snapshot({ d }: { d: Department }) {
  const stats: { num: string; label: string }[] =
    d.degree === 'MBA'
      ? [
          { num: '2 Yrs',  label: 'Duration'       },
          { num: '120',    label: 'Seats'          },
          { num: '5+',     label: 'Specialisations'},
          { num: '95%',    label: 'Placements'     },
        ]
      : [
          { num: '4 Yrs',  label: 'Duration'      },
          { num: '8',      label: 'Semesters'     },
          { num: '180+',   label: 'Credits'       },
          { num: '98%',    label: 'Placement rate'},
        ];
  return (
    <section className="bg-ink-2 text-white py-12">
      <Stagger className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12" delay={0.1}>
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <div>
              <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-white/55">{s.label}</div>
              <div className="mt-2 font-sans font-black tracking-tighter-2 text-white text-[clamp(1.8rem,2.6vw,2.6rem)]">{s.num}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ───────────────────── WHAT YOU'LL BUILD — Year cards ───────────────────── */
function BuildYears({ d }: { d: Department }) {
  const years = d.degree === 'MBA'
    ? [
        { y: 'Year 01', t: 'Fundamentals + Live Cases', d: 'Core management foundations across Marketing, Finance, HR, Operations and Analytics — anchored in live case studies and team consulting projects.' },
        { y: 'Year 02', t: 'Specialisation + Capstone', d: 'Dual-specialisation tracks, a six-month capstone with industry partners, and a placement-focused final semester.' },
      ]
    : [
        { y: 'Year 01', t: 'Foundations & Curiosity', d: 'Mathematics, sciences, programming and design fundamentals — the shared first year that prepares you for any branch.' },
        { y: 'Year 02', t: 'Core Engineering', d: `Department-specific core subjects in ${d.short.toLowerCase()}, hands-on labs, and your first major project.` },
        { y: 'Year 03', t: 'Electives + Internship', d: 'Specialisation electives, summer internship at a partner company, and minor-degree options across departments.' },
        { y: 'Year 04', t: 'Capstone + Placement', d: 'A year-long capstone project, placement training, and direct industry recruitment — the launch ramp.' },
      ];
  return (
    <section className="bg-warm-light py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">The Journey</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,4vw,3.4rem)] leading-[1.04]">
            Build {d.short.toLowerCase()} in{' '}
            <span
              className="font-display italic font-medium"
              style={{
                backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent', color: 'transparent',
              }}
            >
              {years.length === 4 ? 'four years.' : 'two years.'}
            </span>
          </h2>
          <p className="mt-4 max-w-[680px] text-muted leading-relaxed">
            Every year layers new skills onto the last — fundamentals, then craft, then specialisation, then a capstone that recruiters notice.
          </p>
        </Reveal>
        <Stagger className={`mt-12 grid gap-5 ${years.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`} delay={0.1}>
          {years.map((y, i) => (
            <StaggerItem key={y.y}>
              <div className="relative rounded-2xl border border-border bg-white p-8 h-full overflow-hidden hover:border-primary hover:-translate-y-1 transition-all">
                <span className="absolute -top-6 -right-2 font-display italic font-black text-[6.5rem] leading-none tracking-tighter-3 text-primary/[0.06] select-none">{String(i + 1).padStart(2, '0')}</span>
                <div className="relative">
                  <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-primary">{y.y}</div>
                  <h3 className="mt-2 font-sans font-extrabold text-foreground text-xl md:text-2xl tracking-tighter-2 leading-tight">{y.t}</h3>
                  <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{y.d}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ──────────────────── HOW YOU LEARN — split with video ─────────────────── */
function HowYouLearn({ d }: { d: Department }) {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <Reveal preset="right">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">How You Learn</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Studios, labs and capstones —{' '}
            <span
              className="font-display italic font-medium"
              style={{
                backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent', color: 'transparent',
              }}
            >
              not just lectures.
            </span>
          </h2>
          <ul className="mt-7 space-y-4 text-foreground text-[1.04rem] leading-relaxed">
            {d.mission.map((m, i) => (
              <li key={m} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-primary" />
                {m}
              </li>
            ))}
          </ul>
          <Link
            href={`/departments/syllabus/${d.slug}/r25/year1/sem1`}
            className="mt-9 inline-flex items-center gap-2 font-sans font-semibold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
          >
            Explore the curriculum
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <Reveal preset="scale" delay={0.15}>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black border border-border">
            <video src="/videos/sports.mp4" autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <div className="absolute left-6 right-6 bottom-6 text-white">
              <div className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-warm/80">Inside MLRIT</div>
              <div className="mt-1 font-sans font-extrabold text-lg md:text-xl">A day on the {d.code} block.</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────── HOD AUTHORITY BLOCK ─────────────────────── */
function HODBlock({ d }: { d: Department }) {
  return (
    <section className="bg-ink text-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-[1.1fr_1fr] gap-12 items-start">
        <Reveal preset="right">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">From the HOD</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Led by faculty who{' '}
            <span className="font-display italic font-medium text-warm">teach by doing.</span>
          </h2>
          <p className="mt-5 text-white/72 leading-relaxed text-[1.04rem] max-w-[560px]">
            The {d.code} department at MLRIT is anchored by doctoral faculty with active industry, research and project mentorship work — and a head who keeps the corridor moving every day.
          </p>
        </Reveal>
        <Reveal preset="up" delay={0.15}>
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-8 md:p-10 backdrop-blur">
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase text-warm/65">Head of Department</div>
            <div className="mt-3 font-sans font-black text-white text-[clamp(1.6rem,2.4vw,2.4rem)] tracking-tighter-2 leading-tight">{d.hod.name}</div>
            <div className="mt-2 text-white/65">{d.hod.title}</div>
            <div className="mt-6 grid gap-3">
              <a href={`mailto:hod.${d.slug}@mlrit.ac.in`} className="inline-flex items-center gap-2.5 text-white hover:text-primary transition-colors">
                <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/15 grid place-items-center">✉</span>
                <span className="font-mono text-sm">hod.{d.slug}@mlrit.ac.in</span>
              </a>
              <a href="tel:+919652226061" className="inline-flex items-center gap-2.5 text-white hover:text-primary transition-colors">
                <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/15 grid place-items-center">☎</span>
                <span className="font-mono text-sm">+91 96522 26061</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────── PEOs grid ─────────────────────── */
function PEOs({ d }: { d: Department }) {
  return (
    <section className="bg-warm-light py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Outcomes Framework</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Programme Educational <span className="font-display italic font-medium" style={{
              backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>Objectives.</span>
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid md:grid-cols-3 gap-5" delay={0.1}>
          {d.peos.map((peo, i) => (
            <StaggerItem key={peo.id}>
              <div className="relative rounded-2xl border border-border bg-white p-8 h-full overflow-hidden hover:border-primary hover:-translate-y-1 transition-all">
                <span className="absolute -top-5 -right-2 font-display italic font-black text-[5.5rem] leading-none tracking-tighter-3 text-secondary/[0.08] select-none">{String(i + 1).padStart(2, '0')}</span>
                <div className="relative">
                  <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-secondary">{peo.id}</div>
                  <p className="mt-4 text-foreground leading-relaxed text-[1.02rem]">{peo.text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─────────────────────── BIG OUTCOMES STAT ROW ─────────────────────── */
function Outcomes({ d }: { d: Department }) {
  const cards = [
    { n: '7000+', l: 'Alumni placed across the globe' },
    { n: '₹51 LPA', l: 'Highest package · 2026 season' },
    { n: '200+',   l: 'Recruiters · IT, product & core' },
    { n: '98%',    l: 'Placement rate over five years' },
  ];
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Outcomes</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            What the {d.code} corridor{' '}
            <span className="font-display italic font-medium text-secondary">ships.</span>
          </h2>
          <p className="mt-4 max-w-[640px] text-muted leading-relaxed">Across MLRIT — the {d.code} programme is part of an institutional placement engine that delivers, year after year.</p>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5" delay={0.08}>
          {cards.map((c) => (
            <StaggerItem key={c.l}>
              <div className="rounded-2xl border border-border bg-warm-light p-7 h-full">
                <div className="font-sans font-black text-foreground tracking-tighter-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-none">{c.n}</div>
                <div className="mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted leading-tight">{c.l}</div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.2} className="mt-10">
          <Link href="/placements" className="inline-flex items-center gap-2 font-sans font-semibold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
            See the full placement report
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────── SYLLABUS QUICK LINKS ─────────────────────── */
function SyllabusBlock({ d }: { d: Department }) {
  const [reg, setReg] = useState<'mlr20' | 'r22' | 'r25'>('r25');
  if (d.slug === 'mba' || d.slug === 'freshman') return null;
  return (
    <section className="bg-ink-2 text-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Curriculum</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            The {d.code} syllabus,{' '}
            <span className="font-display italic font-medium text-warm">year by year.</span>
          </h2>
          <p className="mt-4 max-w-[640px] text-white/65 leading-relaxed">Pick the regulation that applies to your batch, then jump straight into any semester.</p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {(['mlr20', 'r22', 'r25'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReg(r)}
              className={`px-4 py-2 rounded-full font-mono text-[0.72rem] tracking-[0.14em] uppercase border transition-colors ${
                reg === r ? 'bg-warm text-foreground border-warm' : 'text-white border-white/20 hover:border-white/50'
              }`}
            >
              {r === 'mlr20' ? 'MLR-20' : r.toUpperCase()}
            </button>
          ))}
        </div>

        <motion.div
          key={reg}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3"
        >
          {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => {
            const y = Math.ceil(s / 2);
            return (
              <Link
                key={s}
                href={`/departments/syllabus/${d.slug}/${reg}/year${y}/sem${s}`}
                className="group rounded-xl border border-white/15 bg-white/[0.03] p-4 hover:border-warm hover:bg-white/[0.08] transition-all"
              >
                <div className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-white/45">Year {y}</div>
                <div className="mt-1 font-sans font-extrabold text-white text-lg">Sem {s}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-warm/80 font-mono text-[0.66rem] tracking-wider group-hover:text-warm transition-colors">
                  Open
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────── SIBLING BRANCHES CAROUSEL-ish ─────────────────────── */
function SiblingBranches({ current }: { current: string }) {
  const others = DEPARTMENTS.filter((d) => d.slug !== current).slice(0, 6);
  return (
    <section className="bg-warm-light py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">More from MLRIT</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,2.8rem)] leading-[1.04]">
                Sister branches.
              </h2>
            </div>
            <Link href="/departments/ug" className="font-sans font-semibold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors inline-flex items-center gap-2">
              All programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
        <Stagger className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.07}>
          {others.map((x) => (
            <StaggerItem key={x.slug}>
              <Link href={`/departments/${x.slug}`} className="block rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all group">
                <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-secondary">{x.code}</div>
                <div className="mt-2 font-sans font-extrabold text-foreground text-lg">{x.short}</div>
                <p className="mt-3 text-muted text-[0.94rem] leading-relaxed">{x.tagline}</p>
                <div className="mt-5 inline-flex items-center gap-1 font-sans font-medium text-primary text-sm group-hover:gap-2 transition-all">
                  Open <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─────────────────────── APPLY CTA BANNER ─────────────────────── */
function ApplyBanner({ d }: { d: Department }) {
  return (
    <section className="bg-ink text-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <Reveal preset="right">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Admissions 2025–26</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.02]">
            Your {d.code} journey <span className="font-display italic font-medium text-warm">starts here.</span>
          </h2>
          <p className="mt-5 max-w-[560px] text-white/72 leading-relaxed">
            Applications are open for the 2025-26 intake. Seats are limited — secure yours before the deadline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="https://mlrit.ac.in/admissions/" target="_blank" rel="noopener"
              className="inline-flex items-center gap-2.5 h-12 pl-3 pr-6 rounded-[10px] bg-primary text-white font-semibold text-[0.92rem] border border-primary hover:bg-primary-hover hover:shadow-primary-glow hover:-translate-y-0.5 transition-all"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/20"><ChevronRight className="w-3.5 h-3.5" /></span>
              Apply Now
            </Link>
            <a href="tel:+919652226061" className="inline-flex items-center gap-2 h-12 px-5 rounded-[10px] bg-white/[0.06] border border-white/20 text-white font-medium text-[0.92rem] hover:bg-white/15 transition-colors">
              ☎ +91 96522 26061
            </a>
          </div>
        </Reveal>
        <Reveal preset="scale" delay={0.15}>
          <div className="rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur p-7">
            <div className="font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase text-warm/60">Quick links</div>
            <div className="mt-5 grid gap-3">
              {[
                ['Application form',     'https://files.mlrit.ac.in/uploads/ADMISSION_FORM_2024-25.pdf', true],
                ['Fee structure',         'https://mlrit.ac.in/admissions/', true],
                ['Scholarships',          'https://mlrit.ac.in/scholarships/', true],
                ['Placement report',      '/placements', false],
              ].map(([label, href, ext]) => (
                <a
                  key={label as string}
                  href={href as string}
                  {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
                  className="flex items-center justify-between border border-white/10 rounded-xl px-4 py-3 hover:border-primary hover:bg-white/[0.06] transition-colors"
                >
                  <span className="font-sans font-semibold text-white">{label}</span>
                  <ArrowRight className="w-4 h-4 text-warm" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
