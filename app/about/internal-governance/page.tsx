'use client';

import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import LeaderScrollStack, { LeaderStackItem } from '@/components/LeaderScrollStack';

const ABOUT_NAV = [
  { label: 'Introduction',       href: '/about/vision-mission/introduction' },
  { label: 'Vision & Mission',   href: '/about/vision-mission/vision-mission' },
  { label: 'Legacy',             href: '/about/legacy' },
  { label: 'Rankings & Awards',  href: '/about/rankings-awards' },
  { label: 'Brochure',           href: '/about/brochure' },
  { label: 'Internal Governance', href: '/about/internal-governance' },
];

const LEADERS = [
  {
    tag: 'Principal',
    name: 'M.Radhika Devi',
    role: 'Principal, MLR Institute of Technology',
    img: '/images/about/milestone-2022.jpg',
    message: 'Academic rigour and student welfare are not opposing goals — at MLRIT we have always pursued both, together. Our autonomous status lets us stay ahead of industry, while our NAAC and NBA accreditations validate our quality every cycle.',
    accent: '#01741f',
  },
  {
    tag: 'Dean — Academics',
    name: 'M.Radhika Devi',
    role: 'Dean, Academics',
    img: '/images/about/milestone-2012.jpg',
    message: 'We design curricula that respond to where industry is going, not just where it has been. Autonomous status gives us the agility to refresh syllabi, integrate emerging tools, and keep our students ahead of the curve every year.',
    accent: '#015416',
  },
  {
    tag: 'Head — Placements',
    name: 'Prof. Ravi Chandra P',
    role: 'Head, Training & Placements',
    img: '/images/about/milestone-2026.jpg',
    message: 'Placement is not a season — it is a year-round culture of preparation, industry exposure and relentless follow-through. 621 offers in 2025–26 with a ₹51 LPA top package is the result of that culture, built over years.',
    accent: '#01741f',
  },
  {
    tag: 'Dean — Research',
    name: 'Dr. M. Anitha',
    role: 'Dean, Research & Innovation',
    img: '/images/about/milestone-2017.jpg',
    message: 'Research at MLRIT is not an afterthought — it is embedded in every department, every lab and every faculty development plan. Through our IPFC and three JNTUH-recognised research centres, we are building a genuine culture of inquiry.',
    accent: '#015416',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function InternalGovernancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Internal Governance"
        title="Leadership"
        italic="in their own words."
        dek="The Principal and Deans share their vision for MLRIT's academic mission, research culture and student development."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Internal Governance' }]}
        variant="green"
      />

      {/* Quick nav */}
      <nav className="bg-white border-b border-border sticky top-[var(--header-h)] z-30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center gap-1 overflow-x-auto">
            {ABOUT_NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                  l.href === '/about/internal-governance'
                    ? 'text-foreground border-primary font-semibold'
                    : 'text-muted hover:text-foreground border-transparent hover:border-primary'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Leadership cards using smooth ScrollStack */}
      <section className="bg-[#f7f5f0] py-16">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 mb-6">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">People</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Governance and{' '}
            <span className="font-display italic font-medium" style={gradientText}>leadership.</span>
          </h2>
        </div>

        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <LeaderScrollStack
            itemDistance={160}
            itemScale={0.025}
            itemStackDistance={28}
            stackPosition="18%"
            scaleEndPosition="8%"
            baseScale={0.88}
          >
            {LEADERS.map((l, i) => (
              <LeaderStackItem key={l.name}>
                <div
                  className="rounded-2xl overflow-hidden bg-white border border-border shadow-card-soft grid grid-cols-1 md:grid-cols-[340px_1fr]"
                  style={{ borderTop: `3px solid ${l.accent}` }}
                >
                  <div className="relative overflow-hidden" style={{ minHeight: '260px' }}>
                    <img src={l.img} alt={l.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 font-mono text-[0.58rem] text-white/80 tracking-widest bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {String(i + 1).padStart(2, '0')} / {String(LEADERS.length).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between p-7 md:p-9">
                    <div>
                      <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary">{l.tag}</span>
                      <h3 className="mt-2 font-sans font-black text-foreground text-[clamp(1.1rem,1.8vw,1.5rem)] leading-snug tracking-tight">{l.name}</h3>
                      <p className="mt-1 font-mono text-[0.7rem] text-muted tracking-wide">{l.role}</p>
                      <div className="my-5 h-px bg-border" />
                      <blockquote className="pl-4 border-l-2 border-primary">
                        <p className="font-display italic text-[0.98rem] text-foreground/72 leading-relaxed">"{l.message}"</p>
                      </blockquote>
                    </div>
                    <div className="mt-6 h-0.5 w-10 rounded-full" style={{ background: l.accent }} />
                  </div>
                </div>
              </LeaderStackItem>
            ))}
          </LeaderScrollStack>
        </div>
      </section>
    </>
  );
}
