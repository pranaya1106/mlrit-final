import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';
import AboutQuickNav from '@/components/AboutQuickNav';

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

      {/* Quick nav — shared component: wraps to pills + scroll-hides on mobile, original tab row on desktop */}
      <AboutQuickNav active="/about" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {/* Intro */}
          <section id="story" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto pl-6 pr-11 md:pl-12 md:pr-11 lg:px-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
              <Reveal preset="right">
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Our Story</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  From a vision in 2005<br />
                  <span className="font-display italic font-medium" style={gradientText}>to a benchmark today.</span>
                </h2>
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
            <div className="max-w-[1280px] mx-auto pl-6 pr-11 md:pl-12 md:pr-11 lg:px-20">
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

          {/* Explore — two clean editorial paragraphs */}
          <section id="explore" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto pl-6 pr-11 md:pl-12 md:pr-11 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Explore</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  About <span className="font-display italic font-medium" style={gradientText}>MLRIT.</span>
                </h2>
              </Reveal>

              <div className="mt-12 grid md:grid-cols-2 gap-14 lg:gap-20">

                {/* Our Story */}
                <Reveal preset="right" delay={0.05}>
                  <div>
                    <span className="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">Our Story</span>
                    <h3 className="font-sans font-black text-foreground text-[1.3rem] tracking-tight leading-snug mb-5">
                      From a single campus in Dundigal to a nationally recognised institution.
                    </h3>
                    <div className="space-y-4 text-foreground leading-relaxed text-[1rem]">
                      <p>
                        MLR Institute of Technology was founded in 2005 by <strong>Sri Marri Laxman Reddy Garu</strong> and his family through the KMR Educational Society — with a single, clear purpose: to bring rigorous, industry-aligned engineering education to the students of Telangana. Starting with a handful of branches on a 38-acre campus at Dundigal, Hyderabad, MLRIT has grown steadily into one of the region's most trusted engineering institutions.
                      </p>
                      <p>
                        Two decades on, the institution holds <strong>autonomous status</strong> granted by the UGC, <strong>NAAC institutional accreditation</strong>, <strong>NBA programme-level accreditation</strong> across five branches, and a consistent presence in the NIRF engineering rankings. Over 7,000 alumni now work across India and the world — in software, aerospace, finance, research and public service — each carrying forward the founding promise of <em>right education, bright placements.</em>
                      </p>
                    </div>
                  </div>
                </Reveal>

                {/* What Drives Us */}
                <Reveal preset="up" delay={0.1}>
                  <div>
                    <span className="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">What Drives Us</span>
                    <h3 className="font-sans font-black text-foreground text-[1.3rem] tracking-tight leading-snug mb-5">
                      Academic excellence, human values and a commitment to the nation.
                    </h3>
                    <div className="space-y-4 text-foreground leading-relaxed text-[1rem]">
                      <p>
                        MLRIT's vision is to promote academic excellence, research, innovation and entrepreneurial thinking — producing graduates equipped not just with technical depth but with the values and leadership qualities needed to contribute meaningfully to society. Every curriculum decision, every faculty appointment, every lab investment flows from this single guiding purpose.
                      </p>
                      <p>
                        The mission is lived daily: through student-centric teaching built on cutting-edge technologies, an environment that nurtures research and entrepreneurship, and a placement engine that prepares every student for a global career. MLRIT believes the best education is one that makes graduates both competent and compassionate — globally competitive and socially responsible in equal measure.
                      </p>
                    </div>
                    <Link href="/about/vision-mission/vision-mission" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-[0.88rem] hover:gap-3 transition-all">
                      Read Vision & Mission →
                    </Link>
                  </div>
                </Reveal>

              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
