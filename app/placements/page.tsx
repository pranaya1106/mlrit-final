'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import {
  PLACEMENT_OVERVIEW, YEAR_STATS, YEAR_ROLES, RECRUITER_LOGOS, RECRUITERS,
  INFRASTRUCTURE_LIST, INFRA_STATS, MOUS, TRAINING, CONTACT, DRIVES,
} from '@/lib/placements';

export default function PlacementsPage() {
  const [activeYear, setActiveYear] = useState(YEAR_STATS[1].year); // 2025 default

  return (
    <div className="bg-white">
      <Wall />
      <Performance activeYear={activeYear} setActiveYear={setActiveYear} />
      <Recruiters />
      <Training />
      <Infrastructure />
      <Mous />
      <Drives />
      <Contact />
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* HERO WALL — dark + animated neural-network canvas        */
/* ──────────────────────────────────────────────────────── */
function Wall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    let raf = 0;
    const NODES = 62, MAX_DIST = 180, R = 2.2, SPEED = 0.38;
    let W = 0, H = 0;
    type N = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };
    let nodes: N[] = [];

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      W = canvas.width = rect.width; H = canvas.height = rect.height;
    };
    const mkNode = (): N => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
      r: R + Math.random() * 1.2, accent: Math.random() < 0.12,
    });
    const init = () => { resize(); nodes = Array.from({ length: NODES }, mkNode); };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > MAX_DIST) continue;
          const alpha = (1 - d / MAX_DIST) * 0.18;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = (a.accent || b.accent) ? `rgba(255,140,30,${alpha})` : `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? 'rgba(255,140,30,0.85)' : 'rgba(255,255,255,0.55)';
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    init();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement!);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const WALL_STATS = [
    { val: '₹33 LPA', lbl: 'Highest Package' },
    { val: '536+',    lbl: 'Offers · 2025'    },
    { val: '62+',     lbl: 'Companies'        },
    { val: '7000+',   lbl: 'Alumni Placed'    },
  ];

  return (
    <section id="pl-wall" className="relative bg-[#0a0d18] text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/40 via-transparent to-black/80 pointer-events-none" />
      <div className="relative z-[2] max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-28 md:py-40">
        <Reveal>
          <span className="font-mono text-[0.72rem] font-bold tracking-[0.18em] uppercase text-white/55 mb-4 inline-block">
            Placements at MLRIT
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-sans font-extrabold leading-[0.96] tracking-tighter-2 text-white text-[clamp(2.8rem,6vw,5.5rem)] mb-5">
            Engineering careers<br />
            <span className="font-display italic font-medium text-warm">are built here.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-white/72 font-light leading-relaxed text-[1.1rem] max-w-[720px] mb-14">
            80% and above placements every year — engineers from MLRIT land roles at the world's most respected organisations.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-8 border-t border-white/15 max-w-[920px]" delay={0.1}>
          {WALL_STATS.map((s) => (
            <StaggerItem key={s.lbl}>
              <div className="font-sans font-black text-white leading-none tracking-tighter-2 text-[clamp(1.7rem,2.6vw,2.6rem)]">{s.val}</div>
              <div className="mt-2 font-mono font-medium text-[0.68rem] tracking-[0.16em] uppercase text-white/55">{s.lbl}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── */
/* PERFORMANCE — Year stat cards + year-by-year detail      */
/* ──────────────────────────────────────────────────────── */
function Performance({ activeYear, setActiveYear }: { activeYear: string; setActiveYear: (y: string) => void }) {
  const years = YEAR_STATS;
  const roles = YEAR_ROLES[activeYear] || [];
  return (
    <section id="pl-performance" className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">By the Numbers</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Placement <span className="font-display italic font-medium" style={gradientText}>performance.</span>
          </h2>
          <p className="mt-4 max-w-[680px] text-muted leading-relaxed">{PLACEMENT_OVERVIEW}</p>
        </Reveal>

        {/* Six-year track-record grid */}
        <Stagger className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5" delay={0.07}>
          {years.map((y) => (
            <StaggerItem key={y.year}>
              <button
                type="button"
                onClick={() => setActiveYear(y.year)}
                className={`text-left w-full rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
                  activeYear === y.year
                    ? 'border-primary bg-primary/[0.04] shadow-[0_12px_30px_rgba(232,93,4,0.12)]'
                    : 'border-border bg-white hover:border-primary'
                }`}
              >
                <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-muted">{y.year}</div>
                <div className="mt-2 font-sans font-extrabold text-foreground text-3xl tracking-tighter-2">{y.offers}</div>
                <div className="mt-1 text-xs text-muted">offers</div>
                <div className="mt-3 flex items-center justify-between text-[0.7rem] font-mono text-muted">
                  <span>{y.companies} cos.</span>
                  <span>₹{y.highest} LPA</span>
                </div>
              </button>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Year roles table */}
        {roles.length > 0 && (
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-10 overflow-hidden rounded-2xl border border-border bg-white"
          >
            <table className="w-full text-left">
              <thead className="bg-warm-light/60">
                <tr>
                  <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-muted">Company</th>
                  <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-muted">Role</th>
                  <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-muted">Salary</th>
                  <th className="px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-muted">Selects</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.company} className="border-t border-border">
                    <td className="px-5 py-3.5 font-sans font-bold text-foreground">{r.company}</td>
                    <td className="px-5 py-3.5 text-foreground">{r.role}</td>
                    <td className="px-5 py-3.5 font-mono text-primary font-semibold">{r.salary}</td>
                    <td className="px-5 py-3.5 font-mono text-foreground">{r.selects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── */
/* RECRUITERS — Marquee of logos                            */
/* ──────────────────────────────────────────────────────── */
function Recruiters() {
  return (
    <section id="pl-recruiters" className="bg-[#0B0F1A] text-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Our Recruiters</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Top Hiring <span className="font-display italic font-medium text-warm">Partners.</span>
          </h2>
          <p className="mt-4 text-white/55 max-w-[680px]">
            Leading organisations across IT, product, consulting, and core engineering sectors recruit regularly from MLRIT.
          </p>
        </Reveal>
      </div>

      {/* Marquee — logo strip */}
      <div className="relative mt-10 overflow-hidden mask-fade">
        <div className="flex gap-8 animate-marquee w-max">
          {[...RECRUITER_LOGOS, ...RECRUITER_LOGOS].map((l, i) => (
            <div key={i} className="flex-shrink-0 h-24 w-44 grid place-items-center rounded-xl bg-white/[0.04] border border-white/10 px-5 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={l.alt} className="max-w-full max-h-full object-contain opacity-90" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {/* Names cloud */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 mt-10">
        <Stagger className="flex flex-wrap gap-2" delay={0.025}>
          {RECRUITERS.map((n) => (
            <StaggerItem key={n}>
              <span className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[0.72rem] tracking-[0.06em] text-white/80">
                {n}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <style jsx>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 38s linear infinite; }
        .mask-fade {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── */
/* TRAINING — General + by-branch curriculum                */
/* ──────────────────────────────────────────────────────── */
function Training() {
  return (
    <section id="pl-training" className="bg-[#f7f4ed] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <Reveal preset="right">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Career Readiness</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.04]">
            Training <span className="font-display italic font-medium" style={gradientText}>programme.</span>
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            From day one, the Training & Placement Cell runs a four-strand curriculum to take every student from textbook to job-ready.
          </p>
          <ul className="mt-7 space-y-3.5">
            {TRAINING.general.map((g) => (
              <li key={g} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal preset="up" delay={0.15}>
          <div className="rounded-2xl border border-border bg-white p-8">
            <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-muted">By Branch</div>
            <h3 className="mt-2 font-sans font-extrabold text-foreground text-2xl tracking-tighter-2">Domain curriculum</h3>
            <p className="mt-3 text-muted">Branch-specific technical tracks aligned with industry demand.</p>
            <div className="mt-6 space-y-3.5">
              {TRAINING.byBranch.map((b) => (
                <div key={b.branch} className="grid grid-cols-[80px_1fr] gap-4 items-start border-t border-border pt-3.5">
                  <div className="font-sans font-extrabold text-primary text-sm tracking-wider">{b.branch}</div>
                  <div className="text-foreground text-[0.94rem] leading-relaxed">{b.curriculum}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── */
/* INFRASTRUCTURE — Light section, stats + bullet list      */
/* ──────────────────────────────────────────────────────── */
function Infrastructure() {
  return (
    <section id="pl-infra" className="bg-white py-20 md:py-28">
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
            {INFRASTRUCTURE_LIST.map((i) => (
              <li key={i} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />{i}
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
  );
}

/* ──────────────────────────────────────────────────────── */
/* MOUS — Centres of Excellence grid                        */
/* ──────────────────────────────────────────────────────── */
function Mous() {
  return (
    <section id="pl-mou" className="bg-[#f7f4ed] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Industry Partnerships</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            MoUs and <span className="font-display italic font-medium" style={gradientText}>Centres of Excellence.</span>
          </h2>
          <p className="mt-4 max-w-[720px] text-muted leading-relaxed">
            Formal partnerships and Centres of Excellence with leading industry organisations — providing students with advanced domain training and direct placement pathways.
          </p>
        </Reveal>
        <Stagger className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.08}>
          {MOUS.map((m) => (
            <StaggerItem key={m.name}>
              <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all">
                <div className="flex items-start justify-between">
                  <div className="font-sans font-extrabold text-foreground text-lg">{m.name}</div>
                  <span className={`font-mono text-[0.6rem] tracking-[0.14em] uppercase px-2 py-1 rounded-full ${
                    m.type === 'Centre of Excellence'
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'bg-green-50 text-secondary border border-green-200'
                  }`}>
                    {m.type}
                  </span>
                </div>
                <p className="mt-3 text-muted leading-relaxed text-[0.95rem]">{m.domain}</p>
                {m.package && (
                  <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-light border border-border font-mono text-[0.72rem] font-semibold tracking-wide text-foreground">
                    Pkg · {m.package}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── */
/* DRIVES gallery                                           */
/* ──────────────────────────────────────────────────────── */
function Drives() {
  return (
    <section id="pl-gallery" className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">On Campus</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Placement <span className="font-display italic font-medium text-secondary">drives.</span>
          </h2>
          <p className="mt-4 text-muted max-w-[640px]">Dozens of companies. Hundreds of offers. Every placement season, MLRIT brings industry directly to campus.</p>
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-5" delay={0.07}>
          {DRIVES.map((d, i) => (
            <StaggerItem key={i}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-black aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute left-4 right-4 bottom-4 font-mono text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-white/90">
                  {d.tag}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── */
/* CONTACT — Placement officer + address                    */
/* ──────────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="pl-contact" className="bg-[#0a0d18] text-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-12">
        <Reveal preset="right">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Get in Touch</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Placement <span className="font-display italic font-medium text-warm">Cell.</span>
          </h2>
          <div className="mt-7 font-sans">
            <div className="font-extrabold text-white text-2xl">{CONTACT.name}</div>
            <div className="text-white/55 mt-1">{CONTACT.role}</div>
          </div>
          <div className="mt-7 space-y-3">
            {CONTACT.phone.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="flex items-center gap-3 text-white hover:text-primary transition-colors">
                <span className="w-8 h-8 grid place-items-center rounded-full bg-white/[0.06] border border-white/15">☎</span>
                <span className="font-mono">{p}</span>
              </a>
            ))}
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-white hover:text-primary transition-colors">
              <span className="w-8 h-8 grid place-items-center rounded-full bg-white/[0.06] border border-white/15">✉</span>
              <span className="font-mono">{CONTACT.email}</span>
            </a>
          </div>
        </Reveal>
        <Reveal preset="up" delay={0.15}>
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-8">
            <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-warm/55">Address</div>
            <div className="mt-3 text-white leading-relaxed text-[1.04rem]">
              {CONTACT.address.map((l) => <div key={l}>{l}</div>)}
            </div>
            <div className="mt-7 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/40 font-mono text-[0.72rem] font-semibold tracking-wide text-primary">
              EAPCET Code · {CONTACT.eapcet}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};
