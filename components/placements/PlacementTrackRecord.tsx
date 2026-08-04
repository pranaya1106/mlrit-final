'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';
import { PLACEMENT_YEARS } from '@/lib/placements';
import type { SelectionCount } from '@/lib/placements';

function formatSelections(s: SelectionCount): string {
  if (s.status === 'confirmed') return s.value.toString();
  if (s.status === 'in-progress') return 'In progress';
  return '—';
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PlacementTrackRecord() {
  const [openYear, setOpenYear] = useState<string | null>(null);

  function toggle(year: string) {
    setOpenYear((prev) => (prev === year ? null : year));
  }

  return (
    <section className="bg-ink-2 text-white py-10 md:py-14">
      <div className="w-full px-6 md:px-10 lg:px-12">

        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">
            Year on Year
          </span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Placement <span className="font-display italic font-medium text-warm">seasons.</span>
          </h2>
          <p className="mt-3 text-white/50 max-w-[540px] text-[0.92rem]">
            Expand any year to view the full company breakdown.
          </p>
        </Reveal>

        <div
          className="mt-10 rounded-2xl border border-white/10 overflow-hidden"
          onMouseLeave={() => setOpenYear(null)}
        >
          {/* Table header */}
          <div className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_2rem] gap-x-4 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
            <div />
            <div className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-white/35">Year</div>
            <div className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-white/35">Job Offers</div>
            <div className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-white/35">Companies</div>
            <div className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-white/35">Highest Package</div>
            <div />
          </div>

          {/* Rows */}
          {PLACEMENT_YEARS.map((y, i) => {
            const isOpen = openYear === y.year;
            const isLast = i === PLACEMENT_YEARS.length - 1;

            return (
              <div key={y.year} className={!isLast ? 'border-b border-white/8' : ''}>
                {/* Summary row — clickable */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`detail-${y.year}`}
                  onClick={() => toggle(y.year)}
                  onMouseEnter={() => setOpenYear(y.year)}
                  onFocus={() => setOpenYear(y.year)}
                  className={[
                    'group relative w-full grid grid-cols-[2rem_1fr_1fr_1fr_1fr_2rem] gap-x-4 px-5 py-4 text-left',
                    'transition-all duration-300 ease-out will-change-transform origin-center',
                    'hover:-translate-y-1 hover:scale-[1.02] hover:z-10 hover:shadow-[0_28px_60px_-14px_rgba(0,0,0,0.65),inset_4px_0_0_0_rgba(255,140,30,0.95)]',
                    'hover:bg-gradient-to-r hover:from-white/[0.08] hover:via-white/[0.05] hover:to-transparent',
                    'focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-warm/50',
                    isOpen ? 'bg-white/[0.06]' : 'hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  {/* subtle gradient wash on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,140,30,0.06) 0%, rgba(255,140,30,0) 60%)',
                    }}
                  />
                  {/* Chevron */}
                  <div className="flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease }}
                      aria-hidden
                      className="text-white/30 text-[0.7rem] leading-none"
                    >
                      ▾
                    </motion.span>
                  </div>

                  {/* Year */}
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-white text-[1rem] transition-all duration-300 origin-left group-hover:text-warm group-hover:scale-110">
                      {y.year}
                    </span>
                    {y.isProvisional && (
                      <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full border border-amber-400/30 text-amber-400/70">
                        provisional
                      </span>
                    )}
                  </div>

                  {/* Offers */}
                  <div className="flex items-center">
                    <span
                      className="font-sans font-extrabold text-white leading-none tracking-tight transition-all duration-300 origin-left group-hover:scale-[1.18]"
                      style={{ textShadow: '0 0 0 rgba(255,140,30,0)' }}
                    >
                      <span className="inline-block group-hover:[text-shadow:0_0_24px_rgba(255,180,80,0.55)] transition-[text-shadow] duration-300 text-[1.3rem]">
                        {y.jobOffers.toLocaleString()}
                      </span>
                    </span>
                  </div>

                  {/* Companies */}
                  <div className="flex items-center">
                    <span className="font-sans font-semibold text-white/80 text-[1rem] transition-all duration-300 origin-left group-hover:text-white group-hover:scale-110">
                      {y.companiesVisited}
                    </span>
                  </div>

                  {/* Highest package */}
                  <div className="flex items-center">
                    <span className="font-mono font-bold text-primary text-[1rem] leading-none transition-all duration-300 origin-left group-hover:scale-[1.2] group-hover:[text-shadow:0_0_20px_rgba(232,93,4,0.55)]">
                      ₹{y.highestPackageLpa} LPA
                    </span>
                  </div>

                  <div />
                </button>

                {/* Expandable company detail */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`detail-${y.year}`}
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="mx-4 mb-4 rounded-xl overflow-x-auto" style={{ background: 'var(--cream, #faf7f0)', border: '1px solid var(--border, #e4e0d7)' }}>
                        <table className="w-full text-left min-w-[520px]">
                          <caption className="sr-only">
                            Company-wise placement breakdown for {y.year}
                          </caption>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border, #e4e0d7)' }}>
                              <th scope="col" className="px-5 py-3 font-mono text-[0.6rem] tracking-[0.14em] uppercase font-normal w-[32%]" style={{ color: 'var(--muted, #6a6a64)' }}>
                                Company
                              </th>
                              <th scope="col" className="px-5 py-3 font-mono text-[0.6rem] tracking-[0.14em] uppercase font-normal" style={{ color: 'var(--muted, #6a6a64)' }}>
                                Role
                              </th>
                              <th scope="col" className="px-5 py-3 font-mono text-[0.6rem] tracking-[0.14em] uppercase font-normal text-right" style={{ color: 'var(--muted, #6a6a64)' }}>
                                Package
                              </th>
                              <th scope="col" className="px-5 py-3 font-mono text-[0.6rem] tracking-[0.14em] uppercase font-normal text-right" style={{ color: 'var(--muted, #6a6a64)' }}>
                                Selected
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {y.companies.map((c, ci) => (
                              <tr key={c.id} style={{ borderTop: '1px solid var(--border, #e4e0d7)' }}>
                                <td className="px-5 py-3 font-sans font-semibold text-[0.84rem] leading-snug" style={{ color: 'var(--foreground, #0f0f0f)' }}>
                                  {c.company}
                                  {ci === 0 && (
                                    <span className="ml-1.5 font-mono text-[0.52rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full border" style={{ borderColor: 'rgba(232,93,4,0.35)', color: 'var(--primary, #e85d04)', background: 'rgba(232,93,4,0.07)' }}>
                                      top
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-3 text-[0.82rem]" style={{ color: 'var(--muted, #6a6a64)' }}>{c.role}</td>
                                <td className="px-5 py-3 font-mono text-[0.82rem] text-right font-semibold" style={{ color: 'var(--primary, #e85d04)' }}>
                                  {c.salaryDisplay}
                                </td>
                                <td className="px-5 py-3 font-mono text-[0.82rem] text-right" style={{ color: 'var(--muted, #6a6a64)' }}>
                                  {formatSelections(c.selections)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
