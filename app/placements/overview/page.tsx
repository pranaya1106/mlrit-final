'use client';

import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { PLACEMENT_OVERVIEW } from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const HIGHLIGHTS = [
  { val: '80%+',   label: 'Placement Rate',      sub: 'Consistently every year'        },
  { val: '20+',    label: 'Years of Excellence',  sub: 'Since inception'                },
  { val: '7000+',  label: 'Alumni Placed',        sub: 'Across industries'              },
  { val: '200+',   label: 'Hiring Partners',      sub: 'MNCs to startups'               },
  { val: '₹58 LPA',label: 'Highest Package',      sub: 'Amazon SDE · 2023'              },
  { val: '1236',   label: 'Offers in a Season',   sub: 'Record · 2022'                  },
];

const WHY_MLRIT = [
  {
    heading: 'Industry-Ready Graduates',
    body: 'The T&P Cell runs a structured, year-round programme that takes students from fundamentals to placement-ready across aptitude, communication, technical depth, and domain expertise.',
  },
  {
    heading: 'Centres of Excellence',
    body: 'On-campus Centres of Excellence with Virtusa and EPAM Systems give students hands-on exposure to live industry projects before they graduate.',
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

export default function PlacementsOverviewPage() {
  return (
    <>
      {/* Overview hero text */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Overview</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Where careers <span className="font-display italic font-medium" style={gradientText}>begin.</span>
            </h2>
            <p className="mt-5 max-w-[760px] text-muted leading-relaxed text-[1.06rem]">{PLACEMENT_OVERVIEW}</p>
          </Reveal>

          {/* Highlight numbers */}
          <Stagger className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-5" delay={0.07}>
            {HIGHLIGHTS.map((h) => (
              <StaggerItem key={h.label}>
                <div className="rounded-2xl border border-border bg-warm-light p-7 h-full">
                  <div className="font-sans font-black text-foreground leading-none tracking-tighter-2 text-[clamp(1.8rem,3vw,2.8rem)]">{h.val}</div>
                  <div className="mt-2 font-sans font-semibold text-foreground text-[0.95rem]">{h.label}</div>
                  <div className="mt-1 font-mono text-[0.72rem] tracking-[0.12em] text-muted">{h.sub}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why MLRIT */}
      <section className="bg-ink text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Why MLRIT</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              What sets our <span className="font-display italic font-medium text-warm">placements apart.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.07}>
            {WHY_MLRIT.map((w) => (
              <StaggerItem key={w.heading}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 h-full hover:border-warm/40 hover:bg-white/[0.07] transition-all">
                  <div className="w-2 h-2 rounded-full bg-warm mb-4" />
                  <h3 className="font-sans font-extrabold text-white text-[1.05rem] mb-3">{w.heading}</h3>
                  <p className="text-white/60 text-[0.9rem] leading-relaxed">{w.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
