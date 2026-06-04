import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

const PILLARS = [
  { title: 'Founded 2005',           body: 'Established by Sri Marri Laxman Reddy Garu through the KMR Educational Society to bring world-class engineering education to Telangana.' },
  { title: 'Autonomous · UGC',       body: 'Granted autonomous status by the UGC — MLRIT designs its own curriculum, examinations, and assessment systems.' },
  { title: 'Affiliated · JNTUH',     body: "Affiliated to Jawaharlal Nehru Technological University, Hyderabad. Degrees awarded by JNTUH under MLRIT's autonomous regulations." },
  { title: 'Approved · AICTE',       body: 'All B.Tech, M.Tech and MBA programmes are approved by the All India Council for Technical Education.' },
  { title: 'Accredited · NAAC, NBA', body: 'NAAC institutional accreditation and NBA programme-level accreditation across CSE, ECE, EEE, MECH and IT.' },
  { title: 'Ranked · NIRF',          body: 'Featured in the National Institutional Ranking Framework engineering category — 201-300 band, three years running.' },
];

export const metadata: Metadata = {
  title: 'About MLRIT — Marri Laxman Reddy Institute of Technology',
  description: 'Founded in 2005, MLRIT is a premier autonomous engineering institution under KMR Educational Society, affiliated to JNTUH and approved by AICTE, located at Dundigal, Hyderabad.',
};

const SECTIONS = [
  {
    href: '/about/vision-mission/introduction',
    tag: 'Introduction',
    title: 'Our Story',
    body: 'From a single campus in Dundigal to a nationally accredited institution — twenty years of engineering education, research and placement excellence.',
  },
  {
    href: '/about/vision-mission/vision-mission',
    tag: 'Vision & Mission',
    title: 'What drives us',
    body: 'Promote academic excellence, research and innovation to produce graduates with human values and leadership qualities to serve the nation.',
  },
  {
    href: '/about/legacy',
    tag: 'Legacy',
    title: 'Two decades in eight moments',
    body: 'Our institutional timeline — milestones, leadership and the people who have shaped MLRIT since 2005.',
  },
  {
    href: '/about/rankings-awards',
    tag: 'Rankings & Awards',
    title: 'Recognised nationally',
    body: 'NAAC, NBA, NIRF, AICTE — the accreditations and rankings that benchmark our commitment to quality.',
  },
  {
    href: '/about/internal-governance',
    tag: 'Internal Governance',
    title: 'Messages from leadership',
    body: "The Principal and Deans share their vision for MLRIT's academic mission, research culture and student development.",
  },
  {
    href: '/about/brochure',
    tag: 'Brochure',
    title: 'Download our brochure',
    body: 'Programmes, fees, campus life and admissions — everything in one document.',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'story',   label: 'Our Story'   },
  { id: 'pillars', label: 'Six Pillars' },
  { id: 'explore', label: 'Explore'     },
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

      {/* Quick nav */}
      <nav className="bg-white border-b border-border sticky top-[var(--header-h)] z-30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {[
              { label: 'Introduction',      href: '/about/vision-mission/introduction' },
              { label: 'Vision & Mission',  href: '/about/vision-mission/vision-mission' },
              { label: 'Legacy',            href: '/about/legacy' },
              { label: 'Rankings & Awards', href: '/about/rankings-awards' },
              { label: 'Brochure',          href: '/about/brochure' },
              { label: 'Internal Governance', href: '/about/internal-governance' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] text-muted hover:text-foreground border-b-2 border-transparent hover:border-primary transition-all whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0">
          <div className="sticky top-28 pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {/* Intro */}
          <section id="story" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
              <Reveal preset="right">
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Our Story</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  From a vision in 2005<br />
                  <span className="font-display italic font-medium" style={gradientText}>to a benchmark today.</span>
                </h2>
                <Link href="/about/vision-mission/introduction" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
                  Read full story →
                </Link>
              </Reveal>
              <Reveal preset="up" delay={0.1}>
                <div className="space-y-4 text-foreground leading-relaxed text-[1.05rem]">
                  <p>
                    MLR Institute of Technology was founded in 2005 by <strong>Sri Marri Laxman Reddy Garu</strong> and his family under the <strong>KMR Educational Society</strong>, with a clear purpose — to bring rigorous, industry-aligned engineering education to Telangana.
                  </p>
                  <p>
                    In its first two decades MLRIT has earned <strong>autonomous status</strong> from the UGC, <strong>NAAC institutional accreditation</strong>, <strong>NBA programme-level accreditation</strong> across CSE/ECE/EEE/MECH/IT, and a place in the NIRF engineering category. Over 7,000 alumni now work across the globe.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Six Pillars */}
          <section id="pillars" className="bg-warm-light py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">What Defines Us</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Six pillars of <span className="font-display italic font-medium" style={gradientText}>MLRIT.</span>
                </h2>
              </Reveal>
              <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.08}>
                {PILLARS.map((p) => (
                  <StaggerItem key={p.title}>
                    <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all">
                      <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-primary">Pillar</div>
                      <h3 className="mt-2 font-sans font-extrabold text-foreground text-xl tracking-tight">{p.title}</h3>
                      <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{p.body}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          {/* Section cards */}
          <section id="explore" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Explore</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  About <span className="font-display italic font-medium" style={gradientText}>MLRIT.</span>
                </h2>
              </Reveal>
              <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.07}>
                {SECTIONS.map((s) => (
                  <StaggerItem key={s.href}>
                    <Link href={s.href} className="group block rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all">
                      <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-primary">{s.tag}</div>
                      <h3 className="mt-2 font-sans font-extrabold text-foreground text-xl tracking-tight">{s.title}</h3>
                      <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{s.body}</p>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-3 transition-all">Open →</div>
                    </Link>
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
