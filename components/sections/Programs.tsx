'use client';

import Link from 'next/link';
import { useState } from 'react';

type Card = {
  slug: string;
  dept: string;        // CSE, ECE, etc.
  name: string;        // Programme name
  meta: string;        // duration / level
  size: 'lg' | 'md' | 'sm';
};

const UG: Card[] = [
  { slug: 'cse',         dept: 'CSE · Flagship',  name: 'Computer Science & Engineering',    meta: 'B.Tech · 4 Years · 240 seats',   size: 'lg' },
  { slug: 'aiml',        dept: 'AIML',            name: 'AI & Machine Learning',             meta: 'B.Tech · 4 Years',                size: 'md' },
  { slug: 'cse-cs',      dept: 'CSE-CS',          name: 'CSE (Cyber Security)',              meta: 'B.Tech · 4 Years',                size: 'md' },
  { slug: 'cse-ds',      dept: 'CSE-DS',          name: 'CSE (Data Science)',                meta: 'B.Tech · 4 Years',                size: 'sm' },
  { slug: 'csit',        dept: 'CSIT',            name: 'CS & Information Technology',       meta: 'B.Tech · 4 Years',                size: 'sm' },
  { slug: 'it',          dept: 'IT',              name: 'Information Technology',            meta: 'B.Tech · 4 Years',                size: 'sm' },
  { slug: 'ece',         dept: 'ECE',             name: 'Electronics & Communication',       meta: 'B.Tech · 4 Years',                size: 'md' },
  { slug: 'eee',         dept: 'EEE',             name: 'Electrical & Electronics',          meta: 'B.Tech · 4 Years',                size: 'sm' },
  { slug: 'mechanical',  dept: 'MECH',            name: 'Mechanical Engineering',            meta: 'B.Tech · 4 Years',                size: 'sm' },
  { slug: 'aeronautical',dept: 'AERO',            name: 'Aeronautical Engineering',          meta: 'B.Tech · 4 Years',                size: 'md' },
];

const PG: Card[] = [
  { slug: 'mba',         dept: 'MBA · Flagship',  name: 'Master of Business Administration', meta: 'MBA · 2 Years · 120 seats',       size: 'lg' },
  { slug: 'mtech-cse',   dept: 'M.Tech-CSE',      name: 'M.Tech in Computer Science',        meta: 'M.Tech · 2 Years',                size: 'md' },
  { slug: 'mtech-vlsi',  dept: 'M.Tech-VLSI',     name: 'M.Tech in VLSI System Design',      meta: 'M.Tech · 2 Years',                size: 'md' },
  { slug: 'mtech-ps',    dept: 'M.Tech-PS',       name: 'M.Tech in Power Systems',           meta: 'M.Tech · 2 Years',                size: 'sm' },
  { slug: 'mtech-aero',  dept: 'M.Tech-AERO',     name: 'M.Tech in Aerospace Propulsion',    meta: 'M.Tech · 2 Years',                size: 'sm' },
  { slug: 'phd',         dept: 'Ph.D',            name: 'Doctoral programmes',               meta: 'Ph.D · CSE, ECE, MECH, EEE, MBA', size: 'md' },
];

export default function Programs() {
  const [tab, setTab] = useState<'ug' | 'pg'>('ug');
  const list = tab === 'ug' ? UG : PG;

  return (
    <section id="programs" className="bg-[#f7f7f5] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-[640px]">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-secondary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Programmes
            </span>
            <h2 className="mt-4 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2.2rem,4vw,3.4rem)]">
              Find the programme <span className="font-display italic font-medium" style={{
                backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent', color: 'transparent',
              }}>built for you.</span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Sixteen full-time programmes across engineering, sciences and management — every one curated for industry alignment and research depth.
            </p>
          </div>
          {/* Tabs */}
          <div className="inline-flex gap-2 self-start md:self-end">
            <Tab active={tab === 'ug'} onClick={() => setTab('ug')}>Undergraduate</Tab>
            <Tab active={tab === 'pg'} onClick={() => setTab('pg')}>Postgraduate</Tab>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(140px,auto)] gap-3.5">
          {list.map((c, i) => {
            const span = c.size === 'lg' ? 'md:col-span-2 lg:col-span-2 md:row-span-2' : c.size === 'md' ? 'lg:col-span-2' : '';
            const isLg = c.size === 'lg';
            const href = c.slug.startsWith('mtech') || c.slug === 'phd' ? '/departments/pg' : `/departments/${c.slug}`;
            return (
              <Link
                key={c.slug + i}
                href={href}
                className={`group relative overflow-hidden rounded-2xl border ${
                  isLg
                    ? 'border-transparent bg-gradient-to-br from-secondary to-[#006d25] text-white p-9'
                    : 'border-border bg-white text-foreground p-7 hover:border-transparent hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
                } transition-all ${span}`}
              >
                {/* Top accent line on hover */}
                {!isLg && (
                  <span className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                )}
                <div className="flex flex-col h-full justify-end">
                  <div className={`font-mono text-[0.62rem] font-bold tracking-[0.16em] uppercase ${isLg ? 'text-white/45' : 'text-primary'} mb-2`}>
                    {c.dept}
                  </div>
                  <div className={`font-sans font-extrabold leading-tight ${isLg ? 'text-white text-[clamp(1.3rem,2vw,1.8rem)] tracking-tighter-2' : 'text-foreground text-[0.95rem]'}`}>
                    {c.name}
                  </div>
                  <div className={`font-mono text-[0.72rem] font-light mt-1.5 ${isLg ? 'text-white/55' : 'text-muted'}`}>
                    {c.meta}
                  </div>
                  {isLg && (
                    <div className="mt-4 font-sans font-medium text-[0.82rem] text-white/70 group-hover:text-white transition-colors">
                      Explore programme →
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Tab({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-sans font-medium text-[0.78rem] border-[1.5px] transition-all duration-300 ${
        active
          ? 'bg-secondary text-white border-secondary shadow-[0_2px_12px_rgba(0,143,49,0.2)]'
          : 'bg-white text-muted border-border hover:bg-secondary hover:text-white hover:border-secondary'
      }`}
    >
      {children}
    </button>
  );
}
