import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { PLACEMENT_HIGHLIGHTS, PLACEMENT_OVERVIEW } from '@/lib/placements';

export const metadata: Metadata = {
  title: 'Placements — Overview — MLRIT',
  description: 'Where careers begin — MLRIT Training & Placement Cell, 21 years of building industry-ready graduates.',
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const WHY_MLRIT = [
  {
    heading: 'Industry-Ready Graduates',
    body: 'The T&P Cell runs a structured, year-round programme that takes students from fundamentals to placement-ready across aptitude, communication, technical depth, and domain expertise.',
  },
  {
    heading: 'Centres of Excellence',
    body: 'On-campus Centres of Excellence with Virtusa, EPAM Systems, HCL Tech, and Tata Technologies give students hands-on exposure to live industry projects before they graduate.',
  },
  {
    heading: 'Top-Tier Recruiters',
    body: 'Companies like Amazon, Boeing, ServiceNow, TCS, Infosys, Capgemini, and 200+ others recruit directly from MLRIT every year — spanning IT, product, consulting, and core engineering.',
  },
  {
    heading: 'Consistent Track Record',
    body: 'Six consecutive years of 500+ placement offers. MLRIT graduates are employed at Fortune 500 companies, global MNCs, and high-growth startups worldwide.',
  },
  {
    heading: 'Dedicated Infrastructure',
    body: 'A full placement block with 800+ networked systems, a 1,200-seat auditorium, GD rooms, and interview panels ensures large-scale drives run without friction.',
  },
  {
    heading: 'Holistic Development',
    body: 'Beyond academics, MLRIT invests in soft skills, leadership, and professional etiquette — qualities that distinguish our graduates in competitive hiring processes.',
  },
];

const EXPLORE = [
  { href: '/placements/statistics',           label: 'Year-wise Statistics',  desc: 'Six years of offers, top packages, and recruiter break-downs.',            tone: 'orange' },
  { href: '/placements/industry-readiness',   label: 'Industry Readiness',    desc: 'The training pipeline that turns first-years into placement-ready seniors.', tone: 'green'  },
  { href: '/placements/global-certification', label: 'Global Certifications', desc: 'AWS, Google, Microsoft, Cisco and NPTEL certifications embedded into the curriculum.', tone: 'orange' },
  { href: '/placements/mous',                 label: 'MoUs & Partnerships',   desc: 'Formal industry engagements powering our Centres of Excellence.',           tone: 'green'  },
  { href: '/placements/alumni',               label: 'Alumni Worldwide',       desc: '7,000+ alumni across Fortune-500 firms and high-growth startups.',         tone: 'orange' },
  { href: '/placements/support',              label: 'Reach the T&P Cell',    desc: 'Recruiter enquiries, campus drive requests and corporate connect.',       tone: 'green'  },
];

export default function PlacementsOverviewPage() {
  return (
    <>
      {/* Editorial intro — drop cap + pull quote */}
      <section className="bg-white py-12 md:py-16">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-start">
            <Reveal>
              <span className="font-mono text-[0.72rem] font-extrabold tracking-[0.24em] uppercase text-primary">
                Overview
              </span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02]">
                Where careers{' '}
                <span className="font-display italic font-medium" style={gradientText}>
                  begin.
                </span>
              </h2>
              <div className="mt-6 border-l-[3px] border-primary pl-6">
                <p className="font-display italic font-medium text-foreground text-[clamp(1.15rem,1.5vw,1.5rem)] leading-[1.45]">
                  Twenty-one years of building industry-ready professionals — every year, MLRIT places 81%+ of its graduating class.
                </p>
              </div>
            </Reveal>

            <Reveal preset="up" delay={0.1}>
              <div className="space-y-5">
                <p className="text-foreground/85 text-[1.06rem] leading-[1.8]">
                  <span className="font-display italic font-black text-primary text-[3.6rem] leading-[0.7] float-left mr-3 mt-1">M</span>
                  {PLACEMENT_OVERVIEW}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Highlights */}
          <Stagger className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" delay={0.06}>
            {PLACEMENT_HIGHLIGHTS.map((h, i) => (
              <StaggerItem key={h.label}>
                <div className="relative rounded-2xl border border-border bg-warm-light p-6 h-full overflow-hidden group hover:-translate-y-1 hover:border-primary hover:shadow-card-soft transition-all duration-300">
                  <span
                    aria-hidden
                    className="absolute -top-2 -right-2 font-display italic font-black text-[5rem] leading-none tracking-tighter text-primary/[0.05] group-hover:text-primary/[0.15] transition-colors duration-500 select-none"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-primary">
                      {String(i + 1).padStart(2, '0')} · Metric
                    </div>
                    <div className="mt-3 font-sans font-black text-foreground leading-none tracking-tighter-2 text-[clamp(1.8rem,3vw,2.6rem)]">
                      {h.value}
                    </div>
                    <div className="mt-2 font-sans font-bold text-foreground text-[0.95rem] leading-tight">
                      {h.label}
                    </div>
                    {h.sub && (
                      <div className="mt-1 font-mono text-[0.68rem] tracking-[0.14em] text-muted">
                        {h.sub}
                      </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why MLRIT — dark editorial band with numbered cards */}
      <section className="relative bg-ink text-white py-14 md:py-20 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-primary/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#c26a2b]/20 blur-[120px]" />
        <div className="relative w-full px-6 md:px-10 lg:px-12">
          <div className="max-w-[820px] mb-12 md:mb-14">
            <Reveal>
              <span className="font-mono text-[0.72rem] font-extrabold tracking-[0.24em] uppercase text-warm">
                Why MLRIT
              </span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,4vw,3.4rem)] leading-[1.02]">
                What sets our{' '}
                <span
                  className="font-display italic font-medium"
                  style={{
                    background: 'linear-gradient(180deg, #fff 0%, #f2b56b 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  placements apart.
                </span>
              </h2>
              <p className="mt-4 text-white/70 text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed max-w-[720px]">
                Six qualities the T&amp;P Cell has built into the college for over two decades.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
            {WHY_MLRIT.map((w, i) => (
              <StaggerItem key={w.heading}>
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 h-full transition-all duration-500 hover:-translate-y-1.5 hover:border-warm/40 hover:bg-white/[0.07] overflow-hidden">
                  <span
                    aria-hidden
                    className="absolute -top-2 -right-2 font-display italic font-black text-[5.5rem] leading-none tracking-tighter text-white/[0.06] select-none"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <span className="font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase text-warm/85">
                      {String(i + 1).padStart(2, '0')} · Reason
                    </span>
                    <h3 className="mt-3 font-sans font-extrabold text-white text-[1.2rem] tracking-tight leading-snug">
                      {w.heading}
                    </h3>
                    <p className="mt-3 text-white/70 text-[0.94rem] leading-[1.7]">{w.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Explore the section */}
      <section className="relative bg-cream-2 py-14 md:py-20 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-primary/[0.05] blur-[110px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#1F6B24]/[0.05] blur-[110px]" />
        <div className="relative w-full px-6 md:px-10 lg:px-12">
          <div className="max-w-[820px] mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-extrabold tracking-[0.24em] uppercase text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Explore the Placements Section
            </span>
            <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,4vw,3.4rem)] leading-[1.02]">
              Six ways to know{' '}
              <span className="font-display italic font-medium" style={gradientText}>
                MLRIT placements.
              </span>
            </h2>
          </div>

          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
            {EXPLORE.map((e, i) => {
              const green = e.tone === 'green';
              return (
                <StaggerItem key={e.href}>
                  <Link
                    href={e.href}
                    className="group relative block rounded-3xl bg-white border border-border p-7 h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,0,0,0.18)] hover:border-transparent overflow-hidden"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        green
                          ? 'bg-gradient-to-br from-[#1F6B24] via-[#2a8a3d] to-[#3aa050]'
                          : 'bg-gradient-to-br from-[#c26a2b] via-[#d97b3a] to-[#e08a3a]'
                      }`}
                    />
                    <span
                      aria-hidden
                      className="absolute -top-2 -right-2 font-display italic font-black text-[6.5rem] leading-none tracking-tighter-2 text-foreground/[0.04] group-hover:text-white/15 transition-colors duration-500 select-none"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="relative">
                      <span
                        className={`inline-block font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase transition-colors duration-500 ${
                          green
                            ? 'text-primary group-hover:text-white/85'
                            : 'text-secondary group-hover:text-white/85'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')} · Explore
                      </span>
                      <h3 className="mt-4 font-sans font-extrabold text-foreground text-[1.3rem] tracking-tight leading-snug group-hover:text-white transition-colors duration-500">
                        {e.label}
                      </h3>
                      <p className="mt-3 text-muted text-[0.94rem] leading-[1.7] group-hover:text-white/85 transition-colors duration-500">
                        {e.desc}
                      </p>
                      <div className="mt-6 font-sans font-bold text-[0.85rem] text-primary group-hover:text-white transition-colors duration-500">
                        Explore →
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
    </>
  );
}
