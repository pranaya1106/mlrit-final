import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';
import AboutQuickNav from '@/components/AboutQuickNav';

export const metadata: Metadata = {
  title: 'About MLRIT — Marri Laxman Reddy Institute of Technology',
  description:
    'Founded in 2005, MLRIT is a premier autonomous engineering institution under KMR Educational Society, affiliated to JNTUH and approved by AICTE, located at Dundigal, Hyderabad.',
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'story',   label: 'Our Story'   },
  { id: 'pillars', label: 'Six Pillars' },
];

const PILLARS = [
  {
    title: 'Founded 2005',
    body: 'Established by Sri Marri Laxman Reddy Garu through the KMR Educational Society to bring world-class engineering education to Telangana.',
  },
  {
    title: 'Autonomous · UGC',
    body: 'Granted autonomous status by the UGC — MLRIT designs its own curriculum, examinations, and assessment systems.',
  },
  {
    title: 'Affiliated · JNTUH',
    body: "Affiliated to Jawaharlal Nehru Technological University, Hyderabad. Degrees awarded by JNTUH under MLRIT's autonomous regulations.",
  },
  {
    title: 'Approved · AICTE',
    body: 'All B.Tech, M.Tech and MBA programmes are approved by the All India Council for Technical Education.',
  },
  {
    title: 'Accredited · NAAC, NBA',
    body: 'NAAC institutional accreditation and NBA programme-level accreditation across CSE, ECE, EEE, MECH and IT.',
  },
  {
    title: 'Ranked · NIRF',
    body: 'Featured in the National Institutional Ranking Framework engineering category — three consecutive years.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About MLRIT"
        title="Twenty years of"
        italic="building engineers."
        dek="MLR Institute of Technology — Dundigal, Hyderabad. An autonomous, JNTUH-affiliated, AICTE-approved engineering institution founded in 2005 by the KMR Educational Society."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        variant="green"
      />

      {/* Quick nav — shared component with premium styling */}
      <AboutQuickNav active="/about" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-8 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">

          {/* ── OUR STORY ──────────────────────────────────────────────────────── */}
          <section id="story" className="bg-white py-10 md:py-14">
            <div className="w-full px-6 md:px-10 lg:px-12 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-start">
              <Reveal preset="right">
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Our Story</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  From a vision in 2005
                  <br />
                  <span className="font-display italic font-medium" style={gradientText}>
                    to a benchmark today.
                  </span>
                </h2>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { num: '20+', label: 'Years of excellence' },
                    { num: '11,000+', label: 'Students enrolled' },
                    { num: '7,000+', label: 'Alumni worldwide' },
                    { num: '621', label: 'Placements in 2025–26' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-warm-light p-4">
                      <p className="font-sans font-black text-foreground text-[1.5rem] tracking-tighter">{s.num}</p>
                      <p className="font-mono text-[0.65rem] text-muted tracking-wide uppercase mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal preset="up" delay={0.1}>
                <div className="space-y-4 text-foreground leading-relaxed text-[1.05rem]">
                  <p>
                    MLR Institute of Technology was founded in 2005 by{' '}
                    <strong>Sri Marri Laxman Reddy Garu</strong> and his family under the{' '}
                    <strong>KMR Educational Society</strong>, with a clear purpose — to bring rigorous, industry-aligned engineering
                    education to Telangana.
                  </p>
                  <p>
                    Starting with a handful of branches on a 38-acre campus at Dundigal, the institution has grown steadily
                    into one of the region&apos;s most trusted engineering colleges. Two decades on, MLRIT holds{' '}
                    <strong>autonomous status</strong> from the UGC,{' '}
                    <strong>NAAC institutional accreditation</strong>,{' '}
                    <strong>NBA programme-level accreditation</strong> across five branches, and a consistent place in NIRF
                    engineering rankings.
                  </p>
                  <p>
                    Over 7,000 alumni now work across India and the world — in software, aerospace, finance, research and
                    public service — each carrying forward the founding promise of{' '}
                    <em>right education, bright placements.</em>
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/about/legacy"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-[0.9rem] hover:gap-3 transition-all"
                  >
                    Read our full legacy →
                  </Link>
                  <Link
                    href="/about/timeline"
                    className="inline-flex items-center gap-2 text-muted font-semibold text-[0.9rem] hover:text-primary hover:gap-3 transition-all"
                  >
                    View timeline →
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── SIX PILLARS ────────────────────────────────────────────────────── */}
          <section id="pillars" className="bg-warm-light py-12 md:py-16">
            <div className="w-full px-6 md:px-10 lg:px-12">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">What Defines Us</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Six pillars of{' '}
                  <span className="font-display italic font-medium" style={gradientText}>MLRIT.</span>
                </h2>
              </Reveal>
              <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.07}>
                {PILLARS.map((p, i) => (
                  <StaggerItem key={p.title}>
                    <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all">
                      <div className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-primary mb-1">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="mt-1 font-sans font-extrabold text-foreground text-xl tracking-tight">{p.title}</h3>
                      <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{p.body}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>


        </div>
      </div>
    </>
  );
}
