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
  { slug: 'cse-cs',       dept: 'CSE-CS',  name: 'CSE — Cyber Security',            meta: 'B.Tech · 4 Years',             desc: 'Cryptography, ethical hacking and forensics with a campus SOC and red-team lab.', accent: 'navy'   },
  { slug: 'cse-ds',       dept: 'CSE-DS',  name: 'CSE — Data Science',              meta: 'B.Tech · 4 Years',             desc: 'Statistics, ML, deep learning, big-data and visualisation with industry capstones.', accent: 'orange' },
  { slug: 'csit',         dept: 'CSIT',    name: 'CS & Information Technology',     meta: 'B.Tech · 4 Years',             desc: 'Cloud, DevOps and full-stack engineering for modern enterprise systems.',         accent: 'green'  },
  { slug: 'it',           dept: 'IT',      name: 'Information Technology',          meta: 'B.Tech · 4 Years',             desc: 'Systems, networks, software, security and IT service management.',                accent: 'navy'   },
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

// Unified ink card with a small accent stripe along the top edge.
// Accent only colours a 4-px bar and the dept chip — no saturated gradients.
const accentBar = (a: Card['accent']) =>
  a === 'green'  ? 'bg-secondary'
  : a === 'navy' ? 'bg-[#3a6ec4]'
  :                'bg-primary';
const accentChip = (a: Card['accent']) =>
  a === 'green'
    ? 'bg-secondary/15 text-[#7ad19e] border-secondary/30'
    : a === 'navy'
    ? 'bg-[#3a6ec4]/15 text-[#9bbcf0] border-[#3a6ec4]/30'
    : 'bg-primary/15 text-[#ffb27a] border-primary/30';

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
      {/* Header — uses inner container but section is full-bleed */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-[640px]">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-secondary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Programmes
            </span>
            <h2 className="mt-4 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2.2rem,4vw,3.4rem)]">
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
            <p className="mt-4 text-muted leading-relaxed max-w-[560px]">
              Scroll through every UG and PG programme — each card stacks into view, revealing the next.
            </p>
          </div>
          <div className="inline-flex gap-2 self-start md:self-end">
            <Tab active={tab === 'ug'} onClick={() => setTab('ug')}>Undergraduate</Tab>
            <Tab active={tab === 'pg'} onClick={() => setTab('pg')}>Postgraduate</Tab>
          </div>
        </div>
      </div>

      {/* Scroll-stack rail — fully edge-to-edge */}
      <ScrollStack
        key={tab} /* remount when switching tabs so transforms recalc */
        useWindowScroll
        itemDistance={120}
        itemScale={0.025}
        itemStackDistance={28}
        stackPosition="22%"
        scaleEndPosition="12%"
        baseScale={0.88}
        className="w-full"
      >
        {rows.map(([a, b], i) => (
          <ScrollStackItem
            key={`${tab}-${i}`}
            itemClassName="!h-auto !p-0 !my-0 !rounded-[28px] !shadow-[0_24px_60px_rgba(0,0,0,0.10)] bg-transparent"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      style={{ backgroundColor: '#16161a' }}
      className="group relative block overflow-hidden rounded-[28px] min-h-[280px] md:min-h-[320px] bg-ink-2 border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Accent bar along the top */}
      <span className={`absolute top-0 left-0 right-0 h-1 ${accentBar(card.accent)}`} />
      {/* Soft sphere decoration tinted toward accent — much subtler than the old gradient */}
      <span className={`pointer-events-none absolute -top-32 -right-32 w-72 h-72 rounded-full ${accentBar(card.accent)} opacity-[0.12] blur-3xl`} />
      <span className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative z-10 flex flex-col h-full p-8 md:p-10">
        <div className={`inline-flex items-center self-start gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase ${accentChip(card.accent)}`}>
          {card.dept}
        </div>
        <h3 className="mt-4 font-sans font-extrabold tracking-tighter-2 leading-[1.05] text-white text-[clamp(1.55rem,2.3vw,2.3rem)]">
          {card.name}
        </h3>
        <p className="mt-4 text-white/65 leading-relaxed text-[0.98rem] md:text-[1.02rem] max-w-[480px]">
          {card.desc}
        </p>
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/[0.06]">
          <span className="font-mono text-[0.72rem] font-medium tracking-[0.06em] text-white/45">{card.meta}</span>
          <span className="inline-flex items-center gap-2 font-sans font-medium text-[0.92rem] text-white/85 group-hover:text-primary transition-colors">
            Explore <span className="transition-transform group-hover:translate-x-1">→</span>
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
      className={`px-5 py-2 rounded-full font-sans font-medium text-[0.82rem] border-[1.5px] transition-all duration-300 ${
        active
          ? 'bg-foreground text-white border-foreground'
          : 'bg-white text-muted border-border hover:bg-foreground hover:text-white hover:border-foreground'
      }`}
    >
      {children}
    </button>
  );
}
