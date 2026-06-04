'use client';

import Link from 'next/link';
import { useState } from 'react';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

type Card = {
  slug: string;
  dept: string;
  name: string;
  meta: string;
  desc: string;
  accent?: 'green' | 'orange' | 'navy';
};

const UG: Card[] = [
  { slug: 'cse',          dept: 'CSE',     name: 'Computer Science & Engineering',  meta: 'B.Tech · 4 Years · 240 seats', desc: 'Industry-aligned curriculum across AI/ML, systems, web and cybersecurity.',     accent: 'green'  },
  { slug: 'aiml',         dept: 'AIML',    name: 'AI & Machine Learning',           meta: 'B.Tech · 4 Years',             desc: 'Foundational ML, deep learning and applied AI research on dedicated GPU hardware.', accent: 'orange' },
  { slug: 'cse-ds',       dept: 'CSE-DS',  name: 'CSE — Data Science',              meta: 'B.Tech · 4 Years',             desc: 'Statistics, ML, deep learning, big-data and visualisation with industry capstones.', accent: 'orange' },
  { slug: 'ece',          dept: 'ECE',     name: 'Electronics & Communication',     meta: 'B.Tech · 4 Years',             desc: 'VLSI, embedded systems, signal processing and RF — anchored in industry projects.', accent: 'orange' },
  { slug: 'eee',          dept: 'EEE',     name: 'Electrical & Electronics',        meta: 'B.Tech · 4 Years',             desc: 'Power systems, electronics, control and renewable-energy engineering.',           accent: 'green'  },
  { slug: 'mechanical',   dept: 'MECH',    name: 'Mechanical Engineering',          meta: 'B.Tech · 4 Years',             desc: 'CAD/CAM, thermal sciences and manufacturing with industry-grade workshops.',      accent: 'navy'   },
  { slug: 'aeronautical', dept: 'AERO',    name: 'Aeronautical Engineering',        meta: 'B.Tech · 4 Years',             desc: 'Aerodynamics, propulsion and UAV design — active drone research lab.',            accent: 'orange' },
];

const PG: Card[] = [
  { slug: 'mba',         dept: 'MBA',         name: 'Master of Business Administration',   meta: 'MBA · 2 Years · 120 seats', desc: 'Dual-specialisation curriculum across Marketing, Finance, HR, Operations and Analytics.', accent: 'green'  },
  { slug: 'mtech-cse',   dept: 'M.Tech-CSE',  name: 'M.Tech in Computer Science',          meta: 'M.Tech · 2 Years',          desc: 'AI/ML and systems specialisations with active research-led project work.',                accent: 'orange' },
  { slug: 'mtech-vlsi',  dept: 'M.Tech-VLSI', name: 'M.Tech in VLSI System Design',        meta: 'M.Tech · 2 Years',          desc: 'Front-end and back-end VLSI design tracks anchored in FPGA labs.',                        accent: 'navy'   },
  { slug: 'mtech-ps',    dept: 'M.Tech-PS',   name: 'M.Tech in Power Systems',             meta: 'M.Tech · 2 Years',          desc: 'Smart grid, renewables, protection — industry-led project scope.',                        accent: 'orange' },
  { slug: 'mtech-aero',  dept: 'M.Tech-AERO', name: 'M.Tech in Aerospace Propulsion',      meta: 'M.Tech · 2 Years',          desc: 'Propulsion, materials and unmanned-systems research with industry MoUs.',                 accent: 'green'  },
  { slug: 'phd',         dept: 'Ph.D',        name: 'Doctoral programmes',                 meta: 'Ph.D · 5 disciplines',      desc: 'JNTUH-recognised research centres in CSE, ECE, MECH, EEE and MBA.',                       accent: 'navy'   },
];

// Accent → bar color + chip color (used on the LIGHT card surface)
const accentBar = (a: Card['accent']) =>
  a === 'green'  ? 'bg-secondary'
  : a === 'navy' ? 'bg-[#3a6ec4]'
  :                'bg-primary';
const accentText = (a: Card['accent']) =>
  a === 'green'  ? 'text-secondary'
  : a === 'navy' ? 'text-[#3a6ec4]'
  :                'text-primary';
const accentBg = (a: Card['accent']) =>
  a === 'green'  ? 'bg-secondary/10 border-secondary/25'
  : a === 'navy' ? 'bg-[#3a6ec4]/10 border-[#3a6ec4]/25'
  :                'bg-primary/10 border-primary/25';
const accentGradient = (a: Card['accent']) =>
  a === 'green'  ? 'from-secondary/0 via-secondary/0 to-secondary/[0.06]'
  : a === 'navy' ? 'from-[#3a6ec4]/0 via-[#3a6ec4]/0 to-[#3a6ec4]/[0.06]'
  :                'from-primary/0 via-primary/0 to-primary/[0.06]';

const linkFor = (slug: string) =>
  slug.startsWith('mtech') || slug === 'phd' ? '/departments/pg' : `/departments/${slug}`;

// Group cards into rows of 2
function pairs<T>(arr: T[]): [T, T | null][] {
  const out: [T, T | null][] = [];
  for (let i = 0; i < arr.length; i += 2) out.push([arr[i], arr[i + 1] ?? null]);
  return out;
}

export default function Programs() {
  const [tab, setTab] = useState<'ug' | 'pg'>('ug');
  const rows = pairs(tab === 'ug' ? UG : PG);

  return (
    <section id="programs" className="bg-cream py-20 md:py-28 relative">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-[680px]">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border text-secondary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Programmes
            </span>
            <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-foreground text-[clamp(2.4rem,4.4vw,3.8rem)]">
              Find the programme{' '}
              <span
                className="font-display italic font-medium"
                style={{
                  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', color: 'transparent',
                }}
              >
                built for you.
              </span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-[560px] text-[1.02rem]">
              Scroll through every UG and PG programme — each card stacks into view, revealing the next.
            </p>
          </div>
          <div className="inline-flex gap-2 self-start md:self-end">
            <Tab active={tab === 'ug'} onClick={() => setTab('ug')}>Undergraduate</Tab>
            <Tab active={tab === 'pg'} onClick={() => setTab('pg')}>Postgraduate</Tab>
          </div>
        </div>
      </div>

      {/* Scroll-stack rail */}
      <ScrollStack
        key={tab}
        useWindowScroll
        itemDistance={140}
        itemScale={0.02}
        itemStackDistance={32}
        stackPosition="22%"
        scaleEndPosition="10%"
        baseScale={0.9}
        className="w-full"
      >
        {rows.map(([a, b], i) => (
          <ScrollStackItem
            key={`${tab}-${i}`}
            itemClassName="!h-auto !p-0 !my-0 !rounded-[32px] bg-transparent"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {a && <ProgramCard card={a} />}
              {b ? <ProgramCard card={b} /> : <div className="hidden md:block" />}
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}

function ProgramCard({ card }: { card: Card }) {
  return (
    <Link
      href={linkFor(card.slug)}
      style={{ backgroundColor: '#ffffff' }}
      className="group relative block overflow-hidden rounded-[32px] min-h-[320px] md:min-h-[360px] border border-border shadow-card-soft hover:shadow-card-strong hover:-translate-y-1 transition-all duration-500 ease-out-quart"
    >
      {/* Soft accent gradient bottom-right */}
      <span
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentGradient(card.accent)}`}
      />

      {/* Top accent bar */}
      <span className={`absolute top-0 left-0 right-0 h-[3px] ${accentBar(card.accent)}`} />

      {/* Giant dept code as decorative background type */}
      <span
        className={`pointer-events-none absolute -right-4 -bottom-10 font-display italic font-black text-[12rem] md:text-[14rem] leading-none ${accentText(card.accent)} opacity-[0.06] tracking-tighter select-none`}
      >
        {card.dept.split('-')[0]}
      </span>

      <div className="relative z-10 flex flex-col h-full p-9 md:p-11">
        {/* Dept chip */}
        <div className={`inline-flex items-center self-start gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase ${accentBg(card.accent)} ${accentText(card.accent)}`}>
          {card.dept}
        </div>

        {/* Program name — big bold display type */}
        <h3 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-foreground text-[clamp(1.7rem,2.4vw,2.5rem)]">
          {card.name}
        </h3>

        {/* Description */}
        <p className="mt-4 text-muted leading-relaxed text-[0.98rem] md:text-[1.02rem] max-w-[480px]">
          {card.desc}
        </p>

        {/* Footer — meta + arrow */}
        <div className="mt-auto pt-7 flex items-center justify-between border-t border-border/60">
          <span className="font-mono text-[0.7rem] font-semibold tracking-[0.08em] text-subtle uppercase">
            {card.meta}
          </span>
          <span className={`inline-flex items-center gap-2 font-sans font-bold text-[0.92rem] text-foreground group-hover:${accentText(card.accent).replace('text-', 'text-')} transition-colors`}>
            <span className={`relative ${accentText(card.accent)}`}>
              Explore <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function Tab({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-sans font-semibold text-[0.85rem] border-[1.5px] transition-all duration-300 ${
        active
          ? 'bg-foreground text-white border-foreground shadow-md'
          : 'bg-white text-muted border-border hover:bg-foreground hover:text-white hover:border-foreground'
      }`}
    >
      {children}
    </button>
  );
}
