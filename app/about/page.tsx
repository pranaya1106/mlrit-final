import type { Metadata } from 'next';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import PageHeader from '@/components/PageHeader';
import MilestonesTimeline from '@/components/MilestonesTimeline';
import LeadershipCards from '@/components/LeadershipCards';

export const metadata: Metadata = {
  title: 'About MLRIT — Marri Laxman Reddy Institute of Technology',
  description: 'Founded in 2005, MLRIT is a premier autonomous engineering institution under KMR Educational Society, affiliated to JNTUH and approved by AICTE, located at Dundigal, Hyderabad.',
};

const PILLARS = [
  { title: 'Founded 2005',          body: 'Established in 2005 by Sri Marri Laxman Reddy Garu and his family through the KMR Educational Society to bring world-class engineering education to Telangana.' },
  { title: 'Autonomous · UGC',      body: 'Granted autonomous status by the UGC, MLRIT designs its own curriculum, examinations, and assessment systems — staying agile to industry needs.' },
  { title: 'Affiliated · JNTUH',    body: 'Affiliated to Jawaharlal Nehru Technological University, Hyderabad — degrees are awarded by JNTUH under MLRIT\'s autonomous regulations.' },
  { title: 'Approved · AICTE',      body: 'All B.Tech, M.Tech and MBA programmes are approved by the All India Council for Technical Education and recognised nationally.' },
  { title: 'Accredited · NAAC, NBA',body: 'NAAC institutional accreditation and NBA programme-level accreditation across CSE, ECE, EEE, MECH and IT — recognised quality benchmarks.' },
  { title: 'Ranked · NIRF',         body: 'Featured in the National Institutional Ranking Framework (NIRF) engineering category three years running — 201-300 band.' },
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

      {/* The Story */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
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
                The campus sits on Survey No. 444 at Dundigal, Hyderabad — a 38-acre estate that today hosts ten engineering branches, an MBA programme, three research centres, and a 1,200-seat auditorium that has become the backdrop for the institution's biggest moments.
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
      <section className="bg-warm-light py-20 md:py-28">
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

      {/* Vision & Mission */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-8">
          <Reveal preset="right">
            <div className="rounded-2xl border border-border bg-white p-8 md:p-10 h-full">
              <span className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-secondary">Vision</span>
              <p className="mt-3 font-sans font-extrabold text-foreground text-[1.4rem] md:text-[1.65rem] leading-[1.25] tracking-tight">
                To be a centre of excellence in engineering education — producing graduates with strong technical foundations, ethical clarity, and a lasting curiosity for innovation.
              </p>
            </div>
          </Reveal>
          <Reveal preset="up" delay={0.1}>
            <div className="rounded-2xl border border-border bg-[#0a0d18] text-white p-8 md:p-10 h-full">
              <span className="font-mono text-[0.66rem] font-bold tracking-[0.2em] uppercase text-warm/60">Mission</span>
              <ul className="mt-4 space-y-3 text-[1rem] leading-relaxed">
                {[
                  'Deliver an outcome-based curriculum aligned with industry and research demands.',
                  'Nurture faculty research, publications and patents through the IPFC and R&D Cell.',
                  'Build a placement engine that prepares every student for global careers.',
                  'Integrate sports, the arts and ethical leadership into engineering education.',
                ].map((m) => (
                  <li key={m} className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-warm flex-shrink-0" />
                    <span className="text-white/85">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <MilestonesTimeline />

      {/* Leadership */}
      <LeadershipCards />

      {/* Campus */}
      <section className="bg-[#0a0d18] text-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-12 items-center">
          <Reveal preset="right">
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Campus</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              38 acres at <span className="font-display italic font-medium text-warm">Dundigal.</span>
            </h2>
            <p className="mt-4 text-white/72 leading-relaxed">
              The MLRIT campus is built around academic blocks for ten engineering branches, dedicated research centres, sports infrastructure across four codes, a 1,200-seat auditorium, hostel blocks, and the placement block that runs year-round drives.
            </p>
            <ul className="mt-7 space-y-3 text-white/85">
              {['Ten academic blocks across CSE, ECE, EEE, MECH, AERO, IT, CSIT, AIML and more',
                '1,200-seat auditorium for Annual Day, fests and pre-placement talks',
                'Dedicated placement block with seminar halls, GD and interview rooms',
                'Three JNTUH-recognised research centres + IPFC',
                'Sports grounds across cricket, football, athletics and badminton'].map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal preset="scale" delay={0.15}>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/15">
              <video className="w-full h-full object-cover" autoPlay muted loop playsInline preload="metadata">
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};
