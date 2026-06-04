import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import AboutQuickNav from '@/components/AboutQuickNav';
import Reveal from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Introduction — About MLRIT',
  description: 'The story of MLR Institute of Technology — founded in 2005 by Sri Marri Laxman Reddy Garu, 38 acres at Dundigal, Hyderabad.',
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const PILLARS = [
  { title: 'Founded 2005',           body: 'Established by Sri Marri Laxman Reddy Garu through the KMR Educational Society to bring world-class engineering education to Telangana.' },
  { title: 'Autonomous · UGC',       body: 'Granted autonomous status by the UGC — MLRIT designs its own curriculum, examinations, and assessment systems.' },
  { title: 'Affiliated · JNTUH',     body: 'Affiliated to Jawaharlal Nehru Technological University, Hyderabad. Degrees awarded by JNTUH under MLRIT\'s autonomous regulations.' },
  { title: 'Approved · AICTE',       body: 'All B.Tech, M.Tech and MBA programmes are approved by the All India Council for Technical Education.' },
  { title: 'Accredited · NAAC, NBA', body: 'NAAC institutional accreditation and NBA programme-level accreditation across CSE, ECE, EEE, MECH and IT.' },
  { title: 'Ranked · NIRF',          body: 'Featured in the National Institutional Ranking Framework engineering category — 201-300 band, three years running.' },
];

const NAV_ITEMS = [
  { id: 'story',   label: 'Our Story'   },
  { id: 'pillars', label: 'Six Pillars' },
];

export default function IntroductionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Introduction"
        title="From a vision in 2005"
        italic="to a benchmark today."
        dek="MLR Institute of Technology — Dundigal, Hyderabad. An autonomous, JNTUH-affiliated, AICTE-approved engineering institution founded by the KMR Educational Society."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Introduction' }]}
        variant="green"
      />
      <AboutQuickNav active="/about/vision-mission/introduction" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          {/* Story */}
          <section id="story" className="bg-white py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
              <Reveal preset="right">
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Our Story</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Twenty years,{' '}
                  <span className="font-display italic font-medium" style={gradientText}>one promise.</span>
                </h2>
              </Reveal>
              <Reveal preset="up" delay={0.1}>
                <div className="space-y-5 text-foreground leading-relaxed text-[1.05rem]">
                  <p>
                    MLR Institute of Technology was founded in 2005 by <strong>Sri Marri Laxman Reddy Garu</strong> and his family under the <strong>KMR Educational Society</strong>, with a clear purpose — to bring rigorous, industry-aligned engineering education to Telangana.
                  </p>
                  <p>
                    The campus sits on Survey No. 444 at Dundigal, Hyderabad — a 38-acre estate that today hosts ten engineering branches, an MBA programme, three research centres, and a 1,200-seat auditorium.
                  </p>
                  <p>
                    In its first two decades MLRIT has earned <strong>autonomous status</strong> from the UGC, <strong>NAAC institutional accreditation</strong>, <strong>NBA programme-level accreditation</strong> across CSE/ECE/EEE/MECH/IT, and a place in the NIRF engineering category for three years running. Over 7,000 alumni now work in software, aerospace, finance and consulting across the globe.
                  </p>
                  <p>
                    The institute remains affiliated to <strong>JNTUH</strong> and approved by <strong>AICTE</strong> — and committed to a single founding promise: <em>right education, bright placements.</em>
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Pillars */}
          <section id="pillars" className="bg-warm-light py-20 md:py-28">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
              <Reveal>
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">What Defines Us</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                  Six pillars of <span className="font-display italic font-medium" style={gradientText}>MLRIT.</span>
                </h2>
              </Reveal>
              <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PILLARS.map((p, i) => (
                  <Reveal key={p.title} preset="up" delay={i * 0.07}>
                    <div className="rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:-translate-y-1 transition-all">
                      <div className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-primary">Pillar</div>
                      <h3 className="mt-2 font-sans font-extrabold text-foreground text-xl tracking-tight">{p.title}</h3>
                      <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{p.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
