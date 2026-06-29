'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/motion/Reveal';
import AdmissionsQuickNav from '@/components/AdmissionsQuickNav';

// ── Programme data ─────────────────────────────────────────────────────────
const BTECH = [
  {
    abbr: 'CSE',
    name: 'Computer Science & Engineering',
    seats: 180,
    duration: '4 Years',
    desc: 'Core CS fundamentals—algorithms, OS, databases, software engineering—with modern full-stack and cloud tracks.',
    href: '/departments/cse',
  },
  {
    abbr: 'AIML',
    name: 'CSE (Artificial Intelligence & Machine Learning)',
    seats: 120,
    duration: '4 Years',
    desc: 'Deep learning, NLP, computer vision and MLOps. Prepare to engineer intelligent systems at scale.',
    href: '/departments/aiml',
  },
  {
    abbr: 'CSE-CS',
    name: 'CSE (Cyber Security)',
    seats: 60,
    duration: '4 Years',
    desc: 'Offensive and defensive security, cryptography, network security and ethical hacking methodology.',
    href: '/departments/cse-cs',
  },
  {
    abbr: 'CSE-DS',
    name: 'CSE (Data Science)',
    seats: 60,
    duration: '4 Years',
    desc: 'Statistical modelling, big data pipelines, visualisation and business analytics on real-world datasets.',
    href: '/departments/cse-ds',
  },
  {
    abbr: 'CSIT',
    name: 'Computer Science & Information Technology',
    seats: 60,
    duration: '4 Years',
    desc: 'Bridges CS theory with IT practice—ERP systems, networking and enterprise application development.',
    href: '/departments/csit',
  },
  {
    abbr: 'IT',
    name: 'Information Technology',
    seats: 60,
    duration: '4 Years',
    desc: 'System administration, web technologies, IoT and digital transformation for modern enterprises.',
    href: '/departments/it',
  },
  {
    abbr: 'ECE',
    name: 'Electronics & Communication Engineering',
    seats: 120,
    duration: '4 Years',
    desc: 'VLSI design, embedded systems, wireless communications and signal processing with industry labs.',
    href: '/departments/ece',
  },
  {
    abbr: 'EEE',
    name: 'Electrical & Electronics Engineering',
    seats: 60,
    duration: '4 Years',
    desc: 'Power systems, control engineering, renewable energy and smart grid technologies.',
    href: '/departments/eee',
  },
  {
    abbr: 'MECH',
    name: 'Mechanical Engineering',
    seats: 60,
    duration: '4 Years',
    desc: 'Thermodynamics, CAD/CAM, manufacturing processes and mechatronics with hands-on workshop training.',
    href: '/departments/mech',
  },
  {
    abbr: 'AERO',
    name: 'Aeronautical Engineering',
    seats: 60,
    duration: '4 Years',
    desc: 'Aerodynamics, aircraft structures, propulsion and avionics. The only aeronautical programme in the region.',
    href: '/departments/aero',
  },
];

const MTECH = [
  {
    abbr: 'M.CSE',
    name: 'M.Tech — Computer Science & Engineering',
    seats: 18,
    duration: '2 Years',
    desc: 'Advanced algorithms, distributed systems and research-oriented curriculum. GATE/PGECET qualified candidates.',
    href: '/departments/cse',
  },
  {
    abbr: 'VLSI',
    name: 'M.Tech — VLSI System Design',
    seats: 18,
    duration: '2 Years',
    desc: 'Chip design, verification, EDA tools and industry collaboration with semiconductor firms.',
    href: '/departments/ece',
  },
  {
    abbr: 'PWR',
    name: 'M.Tech — Power Systems',
    seats: 18,
    duration: '2 Years',
    desc: 'Smart grids, power electronics and energy management with SCADA simulation labs.',
    href: '/departments/eee',
  },
  {
    abbr: 'AER',
    name: 'M.Tech — Aerospace Propulsion',
    seats: 18,
    duration: '2 Years',
    desc: 'Jet propulsion, combustion dynamics and rocket engineering with computational fluid dynamics.',
    href: '/departments/aero',
  },
];

const MBA = [
  {
    abbr: 'MBA',
    name: 'Master of Business Administration',
    seats: 60,
    duration: '2 Years',
    desc: 'Dual specialisation MBA covering Finance, Marketing, HR and Operations. ICET qualified. Industry mentors, live projects and placement support.',
    href: '/departments/mba',
  },
];

type Tab = 'btech' | 'mtech' | 'mba';

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: 'btech', label: 'B.Tech', count: BTECH.length },
  { id: 'mtech', label: 'M.Tech', count: MTECH.length },
  { id: 'mba',   label: 'MBA',    count: MBA.length   },
];

function ProgrammeCard({
  abbr, name, seats, duration, desc, href,
}: (typeof BTECH)[number]) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card-soft p-6 flex flex-col gap-4 hover:shadow-card-strong transition-shadow group">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex px-3 py-1 rounded-full bg-green-50 border border-green-200 text-secondary font-mono font-bold text-[0.7rem] tracking-widest uppercase shrink-0">
          {abbr}
        </span>
        <span className="font-mono text-[0.7rem] text-muted tracking-wide">{duration}</span>
      </div>
      <h3 className="font-sans font-bold text-[1.02rem] text-foreground leading-snug group-hover:text-secondary transition-colors">
        {name}
      </h3>
      <p className="text-muted text-[0.9rem] leading-relaxed flex-1">{desc}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <span className="font-mono text-[0.72rem] text-muted">{seats} seats</span>
        <a
          href={href}
          className="inline-flex items-center gap-1.5 text-secondary font-sans font-semibold text-sm hover:gap-2.5 transition-all"
        >
          Explore
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function ByDegreePage() {
  const [activeTab, setActiveTab] = useState<Tab>('btech');

  const programmes = activeTab === 'btech' ? BTECH : activeTab === 'mtech' ? MTECH : MBA;

  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Programmes"
        title="Find your"
        italic="perfect programme."
        dek="From core engineering to next-gen specialisations, MLRIT offers 15 programmes designed for the jobs of tomorrow."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Programmes by Degree' },
        ]}
      />
      <AdmissionsQuickNav active="/admissions/by-degree" />

      <section className="bg-warm-light min-h-screen py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          {/* Tabs */}
          <div className="flex gap-2 p-1.5 bg-white border border-border rounded-2xl shadow-card-soft w-fit mb-12">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-xl font-sans font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-secondary text-white shadow-secondary-glow'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-[0.7rem] font-mono ${activeTab === tab.id ? 'text-white/70' : 'text-subtle'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Programme grid */}
          <div
            key={activeTab}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-300 animate-fade-in"
            style={{ animation: 'tabFadeIn 0.3s ease forwards' }}
          >
            {programmes.map(p => (
              <Reveal key={p.abbr} preset="up" delay={0.05}>
                <ProgrammeCard {...p} />
              </Reveal>
            ))}
          </div>

          {/* Inline keyframe for tab switch animation */}
          <style>{`
            @keyframes tabFadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Admission criteria note */}
          <Reveal preset="up" delay={0.2}>
            <div className="mt-16 bg-white border border-border rounded-2xl p-8 shadow-card-soft">
              <h3 className="font-sans font-bold text-[1.08rem] text-foreground mb-4">Admission Criteria</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { degree: 'B.Tech', via: 'AP/TS EAMCET', qual: '10+2 with Maths, Physics, Chemistry (Min 45%)' },
                  { degree: 'M.Tech', via: 'GATE / PGECET', qual: 'B.Tech in relevant branch (Min 50%)' },
                  { degree: 'MBA',    via: 'AP/TS ICET',    qual: 'Any degree (Min 50% aggregate)' },
                ].map(item => (
                  <div key={item.degree} className="flex flex-col gap-2">
                    <span className="font-mono text-[0.7rem] tracking-widest uppercase text-secondary font-bold">{item.degree}</span>
                    <p className="text-foreground font-semibold text-sm">Via {item.via}</p>
                    <p className="text-muted text-[0.87rem]">{item.qual}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
