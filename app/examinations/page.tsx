import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Examinations — MLRIT',
  description: 'Controller of Examinations, results, timetables, regulations, downloads and academic calendars for MLR Institute of Technology.',
};

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview'         },
  { id: 'quicklinks',   label: 'Quick Links'      },
  { id: 'downloads',    label: 'Downloads'        },
  { id: 'regulations',  label: 'Regulations'      },
  { id: 'calendars',    label: 'Academic Calendar'},
  { id: 'contact',      label: 'Contact'          },
];

const QUICK_LINKS = [
  {
    label: 'Results', href: 'https://exams.mlrinstitutions.ac.in/', desc: 'Check semester and supplementary exam results',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><rect x="3" y="3" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M7 11h8M7 7h8M7 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Fee Payments', href: 'https://exams.mlrinstitutions.ac.in/', desc: 'Pay examination fees online',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2 9h18" stroke="currentColor" strokeWidth="1.6"/><circle cx="7" cy="14" r="1.5" fill="currentColor"/></svg>,
  },
  {
    label: 'Circulars', href: 'https://mlrit.ac.in/circulars/', desc: 'Latest examination notifications and circulars',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><path d="M11 2a9 9 0 100 18A9 9 0 0011 2z" stroke="currentColor" strokeWidth="1.6"/><path d="M11 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Previous Question Papers', href: 'https://exams.mlrinstitutions.ac.in/Old_Qp/Old_QP.html', desc: 'Previous year question papers for all branches',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><path d="M6 2h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 7h6M8 11h6M8 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Student Verification', href: '/examinations/student-verification.pdf', desc: 'Certificate and degree verification process',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.6"/></svg>,
  },
  {
    label: 'Citizen Charter', href: '/examinations/citizen-charter.pdf', desc: 'Commitments and timelines for exam services',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><path d="M11 2l2.09 6.26H20l-5.47 3.97 2.09 6.27L11 14.53l-5.62 3.97 2.09-6.27L2 8.26h6.91L11 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  },
  {
    label: 'Apply for Certificates', href: '/examinations/apply-for-certificates.pdf', desc: 'Apply for transcripts, bonafide and other certificates',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><path d="M4 4h14v10H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 18h6M11 14v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    label: 'Academic Results', href: 'https://exams.mlrinstitutions.ac.in/', desc: 'View published academic results',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden><path d="M3 17l5-5 4 4 6-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
];

const DOWNLOADS = [
  { label: 'Examination Policy',        href: '/examinations/exam-policy.pdf'                         },
  { label: 'CBT Application Form',      href: '/examinations/cbt-form.pdf'         },
  { label: 'Condonation Form',          href: '/examinations/condonation-form.pdf'             },
  { label: 'Duplicate Grade Card',      href: '/examinations/duplicate-grade-card.pdf'         },
  { label: 'Name Correction Form',      href: '/examinations/name-correction.pdf'              },
  { label: 'Plagiarism Check Form',     href: '/examinations/plagiarism-check.pdf'             },
  { label: 'Re-admission Form',         href: '/examinations/readmission.pdf'                  },
  { label: 'Transcript Application',    href: '/examinations/transcript-form.pdf'  },
  { label: 'Important Instructions',    href: '/examinations/important-instructions.pdf' },
  { label: 'COE Profile',               href: '/examinations/coe-profile.pdf'   },
];

const REGULATIONS = [
  { label: 'B.Tech Regulations (R25)', href: '/examinations/btech-regulations-r25.pdf', badge: 'B.Tech', color: 'text-secondary bg-green-50 border-green-200' },
  { label: 'M.Tech Regulations (R25)', href: '/examinations/mtech-regulations-r25.pdf', badge: 'M.Tech', color: 'text-primary bg-orange-50 border-orange-200' },
  { label: 'MBA Regulations (R25)',    href: '/examinations/mba-regulations-r25.pdf',    badge: 'MBA',    color: 'text-secondary bg-green-50 border-green-200' },
];

const CALENDARS = [
  { label: 'Academic Calendar 2025–26', href: '/examinations/academic-calendar-2025-26.pdf',  year: '2025–26', current: true  },
  { label: 'Academic Calendar 2024–25', href: '/examinations/academic-calendar-2024-25.pdf',     year: '2024–25', current: false },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

function DownloadRow({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-border bg-white hover:border-secondary hover:-translate-y-0.5 transition-all group"
    >
      <span className="font-sans text-[0.93rem] text-foreground group-hover:text-secondary transition-colors">{label}</span>
      <span className="shrink-0 w-8 h-8 rounded-full bg-warm-light border border-border flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-all">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 2v7M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors" />
        </svg>
      </span>
    </a>
  );
}

export default function ExaminationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Controller of"
        italic="Examinations."
        dek="The office of the Controller of Examinations (COE) was established in 2015 after conferment of Autonomous status. It oversees all examination activities — scheduling, results, regulations and student services."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Examinations' }]}
        variant="green"
      />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">

          {/* Overview */}
          <section id="overview" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Overview</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Autonomous since <span className="font-display italic font-medium" style={gradientText}>2015.</span>
                </h2>
              </Reveal>
              <div className="mt-10 grid md:grid-cols-2 gap-8">
                <Reveal preset="right" delay={0.05}>
                  <p className="text-foreground leading-relaxed text-[1.05rem]">
                    The Controller of Examinations office at MLRIT manages the end-to-end examination process — from scheduling and conduct to results publication and certificate issuance. As an autonomous institution, MLRIT designs and conducts its own examinations under JNTUH affiliation.
                  </p>
                  <p className="mt-4 text-muted leading-relaxed text-[1rem]">
                    All examinations follow the Outcome-Based Education (OBE) framework with Continuous Internal Evaluation (CIE) and Semester End Examinations (SEE) components. The COE ensures transparent, fair and timely evaluation for all students.
                  </p>
                </Reveal>
                <Reveal preset="up" delay={0.1}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: '2015', sub: 'COE Established'        },
                      { val: 'OBE',  sub: 'Outcome-Based Education'},
                      { val: 'CIE',  sub: 'Continuous Evaluation'  },
                      { val: 'R25',  sub: 'Current Regulation'     },
                    ].map(s => (
                      <div key={s.sub} className="rounded-2xl border border-border bg-warm-light p-6">
                        <div className="font-sans font-black text-secondary tracking-tighter-2 text-[1.8rem] leading-none">{s.val}</div>
                        <div className="mt-2 font-mono text-muted text-[0.7rem] tracking-wide uppercase">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section id="quicklinks" className="bg-warm-light py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Quick Links</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Student <span className="font-display italic font-medium" style={gradientText}>services.</span>
                </h2>
              </Reveal>
              <Stagger className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4" delay={0.06}>
                {QUICK_LINKS.map(q => (
                  <StaggerItem key={q.label}>
                    <a
                      href={q.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 h-full hover:border-secondary hover:-translate-y-1 transition-all"
                    >
                      <span className="w-10 h-10 rounded-xl bg-warm-light border border-border flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all">
                        {q.icon}
                      </span>
                      <span className="font-sans font-extrabold text-foreground text-[1rem] group-hover:text-secondary transition-colors">{q.label}</span>
                      <span className="text-muted text-[0.85rem] leading-relaxed">{q.desc}</span>
                      <span className="mt-auto inline-flex items-center gap-1 text-secondary font-semibold text-[0.8rem] group-hover:gap-2 transition-all">
                        Open ↗
                      </span>
                    </a>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          {/* Downloads */}
          <section id="downloads" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Downloads</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Forms &amp; <span className="font-display italic font-medium" style={gradientText}>documents.</span>
                </h2>
              </Reveal>
              <div className="mt-10 grid md:grid-cols-2 gap-3">
                {DOWNLOADS.map((d, i) => (
                  <Reveal key={d.label} preset="up" delay={i * 0.04}>
                    <DownloadRow label={d.label} href={d.href} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Regulations */}
          <section id="regulations" className="bg-warm-light py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Regulations</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Academic <span className="font-display italic font-medium" style={gradientText}>regulations.</span>
                </h2>
                <p className="mt-4 text-muted text-[1rem] max-w-[600px] leading-relaxed">
                  Current academic regulations governing examinations, credits, promotions and degree requirements for all programmes.
                </p>
              </Reveal>
              <Stagger className="mt-10 grid md:grid-cols-3 gap-5" delay={0.08}>
                {REGULATIONS.map(r => (
                  <StaggerItem key={r.label}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-2xl border-2 border-border bg-white p-7 hover:border-secondary hover:-translate-y-1 transition-all"
                    >
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[0.68rem] font-mono font-bold tracking-widest uppercase ${r.color} mb-4`}>
                        {r.badge}
                      </span>
                      <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] group-hover:text-secondary transition-colors">{r.label}</h3>
                      <div className="mt-4 inline-flex items-center gap-2 text-secondary font-semibold text-[0.8rem] group-hover:gap-3 transition-all">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                          <path d="M7 2v7M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download PDF
                      </div>
                    </a>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          {/* Academic Calendars */}
          <section id="calendars" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Academic Calendar</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  UG &amp; PG <span className="font-display italic font-medium" style={gradientText}>calendars.</span>
                </h2>
              </Reveal>
              <div className="mt-10 flex flex-wrap gap-5">
                {CALENDARS.map((c, i) => (
                  <Reveal key={c.year} preset="up" delay={i * 0.1}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-5 rounded-2xl border-2 p-6 min-w-[280px] hover:-translate-y-1 transition-all ${
                        c.current
                          ? 'border-secondary bg-green-50/60 hover:border-secondary'
                          : 'border-border bg-white hover:border-secondary'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.current ? 'bg-secondary text-white' : 'bg-warm-light border border-border text-muted'}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        {c.current && <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-secondary block mb-1">Current</span>}
                        <p className="font-sans font-extrabold text-foreground text-[1rem]">{c.label}</p>
                        <p className="font-mono text-muted text-[0.72rem] tracking-wide mt-0.5">Download PDF ↗</p>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="bg-warm-light py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Contact</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Exam <span className="font-display italic font-medium" style={gradientText}>section.</span>
                </h2>
              </Reveal>
              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <Reveal preset="right" delay={0.05}>
                  <div className="bg-white rounded-2xl border border-border p-8 shadow-card-soft">
                    <h3 className="font-sans font-extrabold text-foreground text-[1.1rem] mb-5">Controller of Examinations</h3>
                    <div className="space-y-4 text-[0.93rem]">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden><path d="M1 3l5.5 4L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="1" y="2" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                        </span>
                        <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">coe@mlrinstitutions.ac.in</a>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden><path d="M6.5 1C4.015 1 2 3.015 2 5.5c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5C11 3.015 8.985 1 6.5 1z" stroke="currentColor" strokeWidth="1.5"/><circle cx="6.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>
                        </span>
                        <span className="text-muted leading-relaxed">Dundigal V, Survey No. 444, Dundigal, Medchal Malkajgiri, Telangana – 500 043</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden><path d="M11.5 9.17a1 1 0 01-.33.66l-1 1A1 1 0 019.5 11C4.5 11 2 5.5 2 5.5a1 1 0 01.33-1L3.5 3.33A1 1 0 014.17 3l1.5 3a1 1 0 01-.2.95l-.8.8A5 5 0 006.2 9l.8-.8a1 1 0 01.95-.2l3 1.17z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <a href="tel:18005724363" className="text-secondary font-semibold hover:underline">1800 572 4363 (Toll Free)</a>
                      </div>
                    </div>
                  </div>
                </Reveal>
                <Reveal preset="up" delay={0.1}>
                  <div className="bg-green-hero rounded-2xl p-8 text-white">
                    <h3 className="font-sans font-extrabold text-white text-[1.1rem] mb-3">Exam Portal</h3>
                    <p className="text-white/75 text-[0.9rem] leading-relaxed mb-6">
                      Access results, fee payments, timetables and all exam-related services through the MLRIT Examinations portal.
                    </p>
                    <a
                      href="https://exams.mlrinstitutions.ac.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all shadow-primary-glow hover:scale-105"
                    >
                      Open Exam Portal
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M2 7h10M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
