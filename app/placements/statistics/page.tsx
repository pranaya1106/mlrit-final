'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import {
  YEAR_STATS,
  YEAR_ROLES,
  PLACEMENT_HIGHLIGHTS,
  INFRASTRUCTURE_LIST,
  INFRA_STATS,
} from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function PlacementsStatisticsPage() {
  const [activeYear, setActiveYear] = useState(YEAR_STATS[1].year);
  const roles = YEAR_ROLES[activeYear] || [];

  return (
    <>
      {/* Page intro */}
      <section className="bg-white pt-14 pb-4">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Statistics</span>
            <h1 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Placement <span className="font-display italic font-medium" style={gradientText}>performance.</span>
            </h1>
            <p className="mt-4 max-w-[680px] text-muted leading-relaxed">
              Verified placement outcomes year on year — offers, packages, and company participation from our campus recruitment seasons.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Headline stats */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" delay={0.06}>
            {PLACEMENT_HIGHLIGHTS.map((h) => (
              <StaggerItem key={h.label}>
                <div className="rounded-2xl border border-border bg-warm-light p-6 h-full">
                  <div
                    className="font-sans font-black text-foreground leading-none tracking-tighter-2 text-[clamp(1.4rem,2.4vw,2.2rem)]"
                    aria-label={`${h.value} — ${h.label}`}
                  >
                    {h.value}
                  </div>
                  <div className="mt-2 font-sans font-semibold text-foreground text-[0.88rem] leading-snug">{h.label}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Year-on-year placements */}
      <section className="bg-ink-2 text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Year on Year</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Placement <span className="font-display italic font-medium text-warm">seasons.</span>
            </h2>
            <p className="mt-3 text-white/50 max-w-[540px] text-[0.92rem]">Select a year to view company-wise breakdown.</p>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5" delay={0.07}>
            {YEAR_STATS.map((y) => (
              <StaggerItem key={y.year}>
                <button
                  type="button"
                  onClick={() => setActiveYear(y.year)}
                  aria-pressed={activeYear === y.year}
                  className={`text-left w-full rounded-2xl border p-5 transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm/70 ${
                    activeYear === y.year
                      ? 'border-warm bg-warm/[0.08] shadow-[0_12px_30px_rgba(255,140,30,0.14)]'
                      : 'border-white/15 bg-white/[0.03] hover:border-warm/50'
                  }`}
                >
                  <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-white/50">{y.year}</div>
                  <div className="mt-2 font-sans font-extrabold text-white text-3xl tracking-tighter-2">{y.offers}</div>
                  <div className="mt-1 text-xs text-white/40">offers</div>
                  <div className="mt-3 flex items-center justify-between text-[0.7rem] font-mono text-white/50">
                    <span>{y.companies} cos.</span>
                    <span>₹{y.highest} LPA</span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </Stagger>

          {roles.length > 0 && (
            <motion.div
              key={activeYear}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <table className="w-full text-left min-w-[560px]">
                <caption className="sr-only">Company-wise placement details for {activeYear}</caption>
                <thead className="border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Company</th>
                    <th scope="col" className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Role</th>
                    <th scope="col" className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Salary</th>
                    <th scope="col" className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Selects</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r) => (
                    <tr key={r.company} className="border-t border-white/10">
                      <td className="px-5 py-3.5 font-sans font-bold text-white">{r.company}</td>
                      <td className="px-5 py-3.5 text-white/70">{r.role}</td>
                      <td className="px-5 py-3.5 font-mono text-warm font-semibold">{r.salary}</td>
                      <td className="px-5 py-3.5 font-mono text-white/70">{r.selects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {roles.length === 0 && (
            <p className="mt-10 text-white/40 text-[0.88rem]">Detailed company breakdown not available for {activeYear}.</p>
          )}
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <Reveal preset="right">
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Facilities</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Placement <span className="font-display italic font-medium" style={gradientText}>infrastructure.</span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-[560px]">
              MLRIT maintains a dedicated placement block equipped to host large-scale campus recruitment drives throughout the year.
            </p>
            <ul className="mt-7 space-y-3.5" aria-label="Infrastructure facilities">
              {INFRASTRUCTURE_LIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-5" delay={0.12}>
            {INFRA_STATS.map((s) => (
              <StaggerItem key={s.label}>
                <div className="rounded-2xl bg-warm-light border border-border p-7">
                  <div className="font-sans font-black text-foreground text-[clamp(2rem,3vw,2.6rem)] leading-none tracking-tighter-2">{s.num}</div>
                  <div className="mt-2 font-mono font-semibold text-[0.72rem] tracking-[0.16em] uppercase text-muted">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
