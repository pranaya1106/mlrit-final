import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import AboutQuickNav from '@/components/AboutQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Rankings & Awards — MLRIT',
  description: 'NAAC, NBA, NIRF, AICTE — accreditations and rankings that benchmark MLRIT\'s commitment to quality engineering education.',
};

const STATS = [
  { value: 'NAAC',     label: 'Institutional Accreditation',    sub: 'National Assessment & Accreditation Council' },
  { value: 'NBA',      label: 'Programme Accreditation',        sub: 'CSE · ECE · EEE · MECH · IT' },
  { value: 'NIRF',     label: 'National Ranking',               sub: '201–300 band · Engineering category' },
  { value: 'AICTE',    label: 'Regulatory Approval',            sub: 'All India Council for Technical Education' },
  { value: 'UGC',      label: 'Autonomous Status',              sub: 'University Grants Commission' },
  { value: '7,000+',   label: 'Alumni Placed',                  sub: 'Across India and globally' },
  { value: '621',      label: 'Placement Offers',               sub: '2025–26 season' },
  { value: '₹51 LPA',  label: 'Top Package',                    sub: 'Highest offer 2025–26' },
];

const AWARDS = [
  { year: '2024', title: 'Best Engineering College — Telangana', org: 'Education Today Awards' },
  { year: '2023', title: 'NBA Accreditation Renewal', org: 'National Board of Accreditation' },
  { year: '2022', title: 'UGC Autonomous Status Granted', org: 'University Grants Commission' },
  { year: '2021', title: 'IPFC Centre of Excellence', org: 'Intellectual Property India' },
  { year: '2019', title: 'NAAC Institutional Accreditation', org: 'NAAC, Bengaluru' },
  { year: '2018', title: 'NIRF Engineering Rankings — 201–300', org: 'Ministry of Education, India' },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'stats',  label: 'Accreditations' },
  { id: 'awards', label: 'Awards'         },
];

export default function RankingsAwardsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rankings & Awards"
        title="Recognised"
        italic="nationally."
        dek="The accreditations, rankings and institutional achievements that benchmark MLRIT's twenty years of quality engineering education."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Rankings & Awards' }]}
        variant="green"
      />
      <AboutQuickNav active="/about/rankings-awards" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {/* Stats */}
          <section id="stats" className="bg-white py-10 md:py-14">
            <div className="w-full px-6 md:px-10 lg:px-12">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Accreditations & Rankings</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Numbers that <span className="font-display italic font-medium" style={gradientText}>speak for themselves.</span>
                </h2>
              </Reveal>
              <Stagger className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5" delay={0.07}>
                {STATS.map((s) => (
                  <StaggerItem key={s.label}>
                    <div className="rounded-2xl border border-border bg-warm-light p-7 h-full hover:border-secondary transition-colors">
                      <div className="font-sans font-black text-secondary tracking-tighter-2 text-[clamp(1.6rem,3vw,2.2rem)] leading-none">{s.value}</div>
                      <div className="mt-2 font-sans font-bold text-foreground text-[0.9rem]">{s.label}</div>
                      <div className="mt-1 font-mono text-muted text-[0.68rem] tracking-wide uppercase">{s.sub}</div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          {/* Awards timeline */}
          <section id="awards" className="bg-warm-light py-10 md:py-14">
            <div className="w-full px-6 md:px-10 lg:px-12">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Timeline</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Awards &amp; <span className="font-display italic font-medium" style={gradientText}>recognitions.</span>
                </h2>
              </Reveal>
              <div className="mt-12 relative">
                <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />
                <div className="space-y-6">
                  {AWARDS.map((a, i) => (
                    <Reveal key={a.title} preset="right" delay={i * 0.08}>
                      <div className="flex items-start gap-6">
                        <div className="shrink-0 w-[72px] font-mono text-[0.75rem] font-bold text-secondary tracking-wide text-right pt-1">{a.year}</div>
                        <div className="hidden md:block shrink-0 w-3 h-3 rounded-full border-2 border-secondary bg-white mt-1.5 relative z-10" />
                        <div className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-secondary transition-colors">
                          <h3 className="font-sans font-extrabold text-foreground text-[1.05rem]">{a.title}</h3>
                          <p className="mt-1 text-muted text-[0.88rem] font-mono tracking-wide">{a.org}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
