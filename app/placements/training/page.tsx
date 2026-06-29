'use client';

import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { TRAINING, INFRASTRUCTURE_LIST, INFRA_STATS, YEAR_STATS, YEAR_ROLES } from '@/lib/placements';
import { useState } from 'react';
import { motion } from 'framer-motion';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function PlacementsTrainingPage() {
  const [activeYear, setActiveYear] = useState(YEAR_STATS[1].year);
  const roles = YEAR_ROLES[activeYear] || [];

  return (
    <>
      {/* Training programme */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Training Programme</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Built for <span className="font-display italic font-medium" style={gradientText}>the industry.</span>
            </h2>
            <p className="mt-4 max-w-[700px] text-muted leading-relaxed">
              MLRIT's T&P Cell runs a structured, year-round training programme spanning aptitude, communication, domain skills, and professional readiness.
            </p>
          </Reveal>

          {/* General training modules */}
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {TRAINING.general.map((item, i) => (
              <Reveal key={i} preset="up" delay={i * 0.05}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-warm-light p-6">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[0.78rem] font-bold flex items-center justify-center">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-foreground text-[0.97rem] leading-relaxed font-sans">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Branch-wise curriculum */}
          <Reveal preset="up">
            <h3 className="mt-16 font-sans font-black tracking-tighter-2 text-foreground text-[1.5rem] mb-6">
              Branch-wise <span className="font-display italic font-medium" style={gradientText}>curriculum.</span>
            </h3>
          </Reveal>
          <div className="flex flex-col gap-4">
            {TRAINING.byBranch.map((b) => (
              <Reveal key={b.branch} preset="up">
                <div className="rounded-2xl border border-border bg-white p-6 shadow-card-soft">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0">
                      <span className="inline-block font-mono text-[0.7rem] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {b.branch}
                      </span>
                    </div>
                    <p className="text-muted text-[0.92rem] leading-relaxed">{b.curriculum}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Placement stats */}
      <section className="bg-ink-2 text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Results</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Year-on-year <span className="font-display italic font-medium text-warm">placements.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5" delay={0.07}>
            {YEAR_STATS.map((y) => (
              <StaggerItem key={y.year}>
                <button
                  type="button"
                  onClick={() => setActiveYear(y.year)}
                  className={`text-left w-full rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
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
              transition={{ duration: 0.45 }}
              className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <table className="w-full text-left">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Company</th>
                    <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Role</th>
                    <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Salary</th>
                    <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-white/40">Selects</th>
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
            <ul className="mt-7 space-y-3.5">
              {INFRASTRUCTURE_LIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />{item}
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
