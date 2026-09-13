'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/* ── Shared primitives ──────────────────────────────────────────── */

const SECTION_CLASS = 'w-full px-6 md:px-10 lg:px-12 py-14 md:py-20';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-extrabold tracking-[0.26em] uppercase text-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.04]">
      {children}
    </h2>
  );
}

function Dek({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-muted leading-relaxed text-[clamp(1rem,1.1vw,1.12rem)] max-w-[820px]">
      {children}
    </p>
  );
}

function SectionDivider() {
  return <div className="w-full border-t border-border" />;
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

/* ── 1 · About R&D Cell ─────────────────────────────────────────── */

export function AboutRDCell() {
  return (
    <section id="about-rdc" className={`${SECTION_CLASS} bg-white`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>01 · About the R&D Cell</Eyebrow>
          <SectionTitle>
            An independent cell, nurturing research{' '}
            <em className="font-display italic font-medium text-primary">across the institute.</em>
          </SectionTitle>
          <Dek>
            MLR Institute of Technology has established an independent R&D Cell to promote and
            monitor the research programmes of the college. The cell is steered by an advisory
            board comprising senior faculty from various organisations and conducts periodic
            research review meetings to examine the quality of research output.
          </Dek>
          <Dek>
            The cell coordinates sponsored projects, doctoral programmes, faculty publications,
            IP protection, consultancy and entrepreneurship — drawing together the work
            happening inside our three departmental research centres, the IPFC, and the wider
            faculty.
          </Dek>
        </motion.div>

        <motion.blockquote
          variants={fadeUp}
          className="mt-10 border-l-4 border-primary pl-7 max-w-[700px]"
        >
          <p className="font-display italic text-foreground text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.55]">
            &ldquo;We focus on need-based technology — research that solves a real problem, for
            industry, society, or students.&rdquo;
          </p>
          <footer className="mt-3 font-mono text-[0.72rem] tracking-[0.18em] uppercase text-muted">
            MLRIT R&amp;D Cell
          </footer>
        </motion.blockquote>

        <motion.div variants={fadeUp} className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { num: '3',           label: 'JNTUH Research Centres' },
            { num: '25+',         label: 'Doctoral Faculty' },
            { num: '60+',         label: 'Patents Filed' },
            { num: '2016 – 2025', label: 'Peer-reviewed Publications' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-cream-2 p-6">
              <div className="font-sans font-black text-foreground text-[clamp(1.6rem,2.8vw,2.2rem)] tracking-tighter-2 leading-none">
                {s.num}
              </div>
              <div className="mt-2 font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 2 · Research Areas / Thrust Areas ─────────────────────────── */

const THRUST_AREAS = [
  {
    dept: 'Computer Science & Engineering',
    areas: ['Machine Learning & AI', 'Data Engineering', 'Cyber Security', 'Cloud Computing', 'Software Engineering', 'NLP & Indic Languages'],
    tone: 'green' as const,
  },
  {
    dept: 'Electronics & Communication',
    areas: ['VLSI & Low-Power Design', 'Embedded Systems', 'IoT & Edge AI', 'Image Processing', 'Wireless Communications', 'Signal Processing'],
    tone: 'orange' as const,
  },
  {
    dept: 'Mechanical Engineering',
    areas: ['Composite Materials', 'Manufacturing & CAD/CAM', 'Thermal & Fluid Engineering', 'Robotics & Mechatronics', 'Additive Manufacturing', 'Renewable Energy'],
    tone: 'green' as const,
  },
  {
    dept: 'Electrical & Electronics',
    areas: ['Power Electronics', 'Renewable Energy Integration', 'Smart Grids', 'Power Systems'],
    tone: 'orange' as const,
  },
  {
    dept: 'Management Studies',
    areas: ['Marketing Analytics', 'Consumer Behaviour', 'HR Analytics', 'Operations Research'],
    tone: 'green' as const,
  },
  {
    dept: 'Humanities & Sciences',
    areas: ['Applied Mathematics', 'Optimisation', 'Statistics', 'Communication Studies'],
    tone: 'orange' as const,
  },
];

export function ResearchAreas() {
  return (
    <section id="areas" className={`${SECTION_CLASS} bg-cream-2`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>02 · Research Areas &amp; Thrust Areas</Eyebrow>
          <SectionTitle>
            Where MLRIT research{' '}
            <em className="font-display italic font-medium text-primary">is focused.</em>
          </SectionTitle>
          <Dek>
            Research at MLRIT spans six departments — each with defined thrust areas aligned to
            industry need, national priority programmes, and doctoral supervisor expertise.
          </Dek>
        </motion.div>

        <motion.div
          variants={stagger}
          className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {THRUST_AREAS.map(({ dept, areas, tone }) => (
            <motion.div
              key={dept}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-4"
            >
              <div
                className={`w-10 h-1 rounded-full ${
                  tone === 'green' ? 'bg-primary' : 'bg-secondary'
                }`}
              />
              <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] leading-snug">
                {dept}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <li
                    key={a}
                    className={`px-3 py-1 rounded-full text-[0.75rem] font-medium border ${
                      tone === 'green'
                        ? 'border-primary/20 text-primary bg-primary/[0.04]'
                        : 'border-secondary/20 text-secondary bg-secondary/[0.04]'
                    }`}
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 3 · Committees ─────────────────────────────────────────────── */

export function Committees() {
  return (
    <section id="committees" className={`${SECTION_CLASS} bg-white`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>03 · Committees</Eyebrow>
          <SectionTitle>
            Research is guided by{' '}
            <em className="font-display italic font-medium text-primary">two committees.</em>
          </SectionTitle>
          <Dek>
            The Research Advisory Committee and the Research Ethics Committee together set the
            direction, review quality, and uphold standards for all research activity at MLRIT.
          </Dek>
        </motion.div>

        <motion.div
          variants={stagger}
          className="mt-10 grid md:grid-cols-2 gap-6 max-w-[900px]"
        >
          {/* RAC */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-border bg-ink text-white p-8"
          >
            <div className="font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-warm mb-3">
              RAC
            </div>
            <h3 className="font-sans font-extrabold text-white text-[1.2rem] leading-snug mb-4">
              Research Advisory Committee
            </h3>
            <p className="text-white/70 text-[0.93rem] leading-relaxed mb-6">
              Comprising the Principal, Dean Research, R&amp;D Coordinator, Heads of Departments,
              and senior faculty. The RAC reviews ongoing research activity, approves new project
              proposals and consultancy engagements, mentors junior faculty on their first grants,
              and conducts quarterly reviews of sponsored projects and doctoral progress.
            </p>
            <ul className="space-y-2">
              {['Quarterly review of sponsored projects & doctoral progress', 'Sanctioning new proposals & consultancy engagements', 'Guidance to junior faculty pursuing funded grants', 'Periodic review of R&D, IP and Consultancy policies'].map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[0.85rem] text-white/65">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-warm shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* REC */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-8"
          >
            <div className="font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary mb-3">
              REC
            </div>
            <h3 className="font-sans font-extrabold text-foreground text-[1.2rem] leading-snug mb-4">
              Research Ethics Committee
            </h3>
            <p className="text-muted text-[0.93rem] leading-relaxed mb-6">
              The REC ensures that all research conducted at MLRIT — including sponsored projects,
              student theses, and faculty research — adheres to established ethical standards.
              The committee reviews research proposals involving human participants, data privacy,
              or sensitive materials, and issues ethical clearance certificates.
            </p>
            <ul className="space-y-2">
              {['Ethical review of research proposals', 'Clearance for studies involving human participants', 'Data privacy and research integrity oversight', 'Annual ethics audit of ongoing projects'].map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[0.85rem] text-muted">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 4 · Sponsored Research Projects ───────────────────────────── */

const AGENCIES = [
  { name: 'DST – SERB',  desc: 'Science and Engineering Research Board — fundamental and applied research.' },
  { name: 'AICTE',       desc: 'RPS, MODROBS and AQIS schemes for academic and infrastructure projects.' },
  { name: 'DRDO',        desc: 'Defence R&D on materials, embedded systems and signal processing.' },
  { name: 'DBT',         desc: 'Department of Biotechnology grants for healthcare and bio-engineering.' },
  { name: 'MSME / IPFC', desc: 'Ministry of MSME schemes including IPFC operational support.' },
  { name: 'Industry',    desc: 'Sponsored R&D from semiconductor, IT, manufacturing and pharma partners.' },
];

export function SponsoredProjects() {
  return (
    <section id="sponsored-projects" className={`${SECTION_CLASS} bg-cream-2`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>04 · Sponsored Research Projects</Eyebrow>
          <SectionTitle>
            Externally funded research,{' '}
            <em className="font-display italic font-medium text-primary">at scale.</em>
          </SectionTitle>
          <Dek>
            MLRIT faculty lead funded projects from national agencies and industry partners — from
            initial proposal through completion and outcome reporting.
          </Dek>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[700px]">
          {[
            { num: '25+',    label: 'Active Projects' },
            { num: '₹3 Cr+', label: 'Total Funding' },
            { num: '8',      label: 'Funding Agencies' },
            { num: '40+',    label: 'Faculty PIs' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-white p-5 text-center">
              <div className="font-sans font-black text-primary text-[1.7rem] tracking-tighter-2 leading-none">
                {s.num}
              </div>
              <div className="mt-2 font-mono text-[0.63rem] font-bold tracking-[0.16em] uppercase text-muted leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <h3 className="mt-12 mb-5 font-sans font-extrabold text-foreground text-[1.1rem]">
            Funding Partners
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENCIES.map((a) => (
              <div key={a.name} className="flex gap-4 rounded-xl border border-border bg-white p-5">
                <div className="w-1 self-stretch rounded-full bg-primary/30 shrink-0" />
                <div>
                  <div className="font-sans font-bold text-foreground text-[0.95rem]">{a.name}</div>
                  <div className="mt-1 text-muted text-[0.84rem] leading-relaxed">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/research/sponsored-projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-[0.9rem] hover:bg-primary/90 transition-colors"
          >
            View All Projects →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 5 · Research Centres ───────────────────────────────────────── */

const CENTRES = [
  {
    code: 'CSE',
    name: 'Computer Science and Engineering',
    body: 'Doctoral research and sponsored projects in machine learning, data engineering, software engineering, cyber security and cloud computing. Scholars work in the AI/ML lab alongside high-performance compute facilities.',
    areas: ['Machine Learning', 'Data Engineering', 'Cyber Security', 'Cloud Computing', 'Software Engineering'],
  },
  {
    code: 'ECE',
    name: 'Electronics and Communication',
    body: 'VLSI design, embedded and IoT systems, wireless communications and signal processing. Industry-grade EDA tooling — Cadence, Synopsys, Xilinx — supports doctoral and teaching work.',
    areas: ['VLSI Design', 'Embedded Systems', 'IoT', 'Image Processing', 'Wireless Comms'],
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    body: 'Composite materials, thermal and fluid engineering, manufacturing, robotics and renewable energy. CNC, 3D-printing and materials-testing labs support experimental and computational work.',
    areas: ['Composite Materials', 'Manufacturing', 'Thermal & Fluids', 'Robotics', 'Renewable Energy'],
  },
];

export function ResearchCentres() {
  return (
    <section id="centers" className={`${SECTION_CLASS} bg-white`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>05 · Research Centres</Eyebrow>
          <SectionTitle>
            Three JNTUH-recognised centres carry{' '}
            <em className="font-display italic font-medium text-primary">the day-to-day work.</em>
          </SectionTitle>
          <Dek>
            Each centre hosts doctoral scholars, runs sponsored projects, and produces the bulk of
            the institute&apos;s peer-reviewed publications and patents.
          </Dek>
        </motion.div>

        <motion.div variants={stagger} className="mt-10 space-y-5">
          {CENTRES.map(({ code, name, body, areas }, i) => (
            <motion.div
              key={code}
              variants={fadeUp}
              className="grid md:grid-cols-[auto_1fr] gap-6 rounded-2xl border border-border bg-white p-7 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col items-start md:items-center gap-1 md:w-20 md:pt-1">
                <span className="font-sans font-black text-foreground text-[2rem] tracking-tighter-2 leading-none tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase text-primary">
                  {code}
                </span>
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-foreground text-[1.1rem] leading-snug mb-3">
                  {name} Research Centre
                </h3>
                <p className="text-muted text-[0.93rem] leading-relaxed mb-4">{body}</p>
                <div className="flex flex-wrap gap-2">
                  {areas.map((a) => (
                    <span
                      key={a}
                      className="px-3 py-1 rounded-full border border-primary/20 text-primary text-[0.75rem] font-medium bg-primary/[0.04]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8">
          <Link
            href="/research/centers"
            className="inline-flex items-center gap-2 font-sans font-bold text-[0.9rem] text-primary hover:gap-3 transition-all"
          >
            View Research Centres in detail →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 6 · Research Facilities ────────────────────────────────────── */

const FACILITIES = [
  {
    name: 'AI / ML Lab',
    body: 'Workstations with NVIDIA GPUs, JupyterHub, Spark cluster, and curated research datasets.',
  },
  {
    name: 'VLSI & FPGA Lab',
    body: 'Cadence, Synopsys, Mentor and Xilinx Vivado licences; Spartan, Artix, Zynq and Cyclone boards.',
  },
  {
    name: 'IoT & Embedded Lab',
    body: 'ESP32, STM32, Raspberry Pi, Arduino, Jetson Nano; LoRa, Zigbee and BLE bench setups.',
  },
  {
    name: 'Materials & Manufacturing',
    body: 'CNC machines, 3D printers, composite layup equipment, and mechanical testing systems.',
  },
  {
    name: 'Cloud Research Access',
    body: 'AWS, GCP, Azure and Snowflake credits for student and faculty research workloads.',
  },
  {
    name: 'Digital Library',
    body: 'IEEE, Springer, Elsevier and ACM subscriptions — over 10 million research articles.',
  },
];

export function ResearchFacilities() {
  return (
    <section id="facilities" className={`${SECTION_CLASS} bg-ink text-white`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>06 · Research Facilities</Eyebrow>
          <SectionTitle>
            <span className="text-white">
              Labs and resources that{' '}
              <em className="font-display italic font-medium text-warm">support the work.</em>
            </span>
          </SectionTitle>
          <p className="mt-4 text-white/60 leading-relaxed text-[clamp(1rem,1.1vw,1.12rem)] max-w-[820px]">
            MLRIT&apos;s three research centres operate purpose-built laboratories backed by
            industry-grade tooling. Faculty and scholars get day-to-day access to the resources
            they need.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FACILITIES.map((f, i) => (
            <motion.div
              key={f.name}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.07] transition-colors"
            >
              <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] uppercase text-warm/70 mb-3">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-sans font-extrabold text-white text-[1.05rem] leading-snug mb-2">
                {f.name}
              </h3>
              <p className="text-white/55 text-[0.88rem] leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 7 · Research Policies ──────────────────────────────────────── */

const POLICIES = [
  {
    name: 'IP Policy',
    body: 'Ownership, inventor share, institute share, and procedures for patent filing, licensing and commercialisation.',
  },
  {
    name: 'R&D Policy',
    body: "The institute's commitment to research, structure of the R&D Cell, and incentives for faculty researchers.",
  },
  {
    name: 'Consultancy Policy',
    body: 'How faculty undertake consultancy — revenue sharing, NDAs, and use of institute facilities.',
  },
  {
    name: 'Innovation & Entrepreneurship Policy',
    body: 'Framework for student and faculty ventures — incubation, equity, leave provisions, incentives.',
  },
];

export function ResearchPolicies() {
  return (
    <section id="policies" className={`${SECTION_CLASS} bg-white`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>07 · Research Policies</Eyebrow>
          <SectionTitle>
            Four approved policies{' '}
            <em className="font-display italic font-medium text-primary">govern all research.</em>
          </SectionTitle>
          <Dek>
            All research activity at MLRIT is governed by four formal policies, reviewed
            periodically by the R&amp;D Committee.
          </Dek>
        </motion.div>

        <motion.div
          variants={stagger}
          className="mt-10 grid sm:grid-cols-2 gap-5 max-w-[900px]"
        >
          {POLICIES.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              className="rounded-xl border border-border bg-cream-2 p-6"
            >
              <h3 className="font-sans font-extrabold text-foreground text-[1rem] mb-2">
                {p.name}
              </h3>
              <p className="text-muted text-[0.88rem] leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8">
          <Link
            href="/research/policies"
            className="inline-flex items-center gap-2 font-sans font-bold text-[0.9rem] text-primary hover:gap-3 transition-all"
          >
            View Policies & Forms in full →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 8 · Publications ───────────────────────────────────────────── */

const PUB_YEARS = [
  { year: '2025', count: '120+' },
  { year: '2024', count: '110+' },
  { year: '2023', count: '95+' },
  { year: '2022', count: '85+' },
  { year: '2021', count: '80+' },
  { year: '2020', count: '70+' },
];

export function Publications() {
  return (
    <section id="publications" className={`${SECTION_CLASS} bg-cream-2`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>08 · Publications</Eyebrow>
          <SectionTitle>
            Peer-reviewed research output{' '}
            <em className="font-display italic font-medium text-primary">since 2016.</em>
          </SectionTitle>
          <Dek>
            MLRIT faculty and scholars publish in SCI, Scopus, UGC-CARE and ABDC-indexed journals
            and conferences. Year-wise consolidated lists are maintained by the R&amp;D Cell.
          </Dek>
        </motion.div>

        <motion.div
          variants={stagger}
          className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-3"
        >
          {PUB_YEARS.map(({ year, count }) => (
            <motion.div
              key={year}
              variants={fadeUp}
              className="rounded-xl border border-border bg-white p-5 text-center"
            >
              <div className="font-sans font-black text-primary text-[1.5rem] tracking-tighter-2 leading-none">
                {count}
              </div>
              <div className="mt-2 font-mono text-[0.63rem] font-bold tracking-[0.14em] uppercase text-muted">
                {year}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/research/publications"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-[0.9rem] hover:bg-primary/90 transition-colors"
          >
            View All Publications →
          </Link>
          <Link
            href="/research/patents"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary font-semibold text-[0.9rem] hover:bg-primary hover:text-white transition-colors"
          >
            View Patents →
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 9 · Downloads ──────────────────────────────────────────────── */

const DOWNLOADS = [
  'Publication Incentive Form',
  'Patent Filing / Invention Disclosure Form',
  'Sponsored Project Proposal Form',
  'Consultancy Agreement Template',
  'Patent Incentive Claim Form',
  'Travel Support — Conference Form',
  'Research Incentive Scheme (Full Document)',
  'R&D Policy Document',
  'IP Policy Document',
  'Consultancy Policy Document',
  'Innovation & Entrepreneurship Policy',
];

export function Downloads() {
  return (
    <section id="downloads" className={`${SECTION_CLASS} bg-white`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>09 · Downloads</Eyebrow>
          <SectionTitle>
            Forms and documents{' '}
            <em className="font-display italic font-medium text-primary">for researchers.</em>
          </SectionTitle>
          <Dek>
            All research-related forms and policy documents are available through the R&amp;D Cell.
            Request any document by writing to{' '}
            <a href="mailto:deanresearch@mlrit.ac.in" className="text-primary hover:underline">
              deanresearch@mlrit.ac.in
            </a>.
          </Dek>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 max-w-[780px]">
          <ul className="divide-y divide-border rounded-2xl border border-border overflow-hidden bg-white">
            {DOWNLOADS.map((d, i) => (
              <li key={d} className="flex items-center gap-4 px-6 py-4 hover:bg-cream-2 transition-colors group">
                <span className="font-mono text-[0.62rem] font-bold tracking-[0.16em] text-muted/60 w-6 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-sans text-[0.93rem] text-foreground">{d}</span>
                <a
                  href="mailto:deanresearch@mlrit.ac.in"
                  className="text-[0.8rem] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  aria-label={`Request ${d}`}
                >
                  Request →
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-muted text-[0.82rem] italic">
            Documents are dispatched within two working days of request.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── 10 · Contact Us ────────────────────────────────────────────── */

export function ContactUs() {
  return (
    <section id="contact" className={`${SECTION_CLASS} bg-ink text-white`}>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.div variants={fadeUp}>
          <Eyebrow>10 · Contact Us</Eyebrow>
          <SectionTitle>
            <span className="text-white">
              Reach the{' '}
              <em className="font-display italic font-medium text-warm">Dean Research.</em>
            </span>
          </SectionTitle>
          <p className="mt-4 text-white/60 leading-relaxed text-[clamp(1rem,1.1vw,1.12rem)] max-w-[720px]">
            For sponsored projects, research scholars, publications, patents, consultancy,
            or any research-related enquiry — write or call directly.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 max-w-[600px]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-8 md:p-10">
            <div className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-warm mb-2">
              Dean — Research & Development
            </div>
            <h3 className="font-sans font-black text-white text-[1.5rem] tracking-tight leading-snug mb-1">
              Dr. T. Arun Kumar
            </h3>
            <div className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-white/50 mb-8">
              MLR Institute of Technology
            </div>

            <div className="space-y-4">
              <a
                href="tel:+919491465303"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.06] grid place-items-center shrink-0 group-hover:border-warm/50 group-hover:bg-warm/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M13.5 10.5l-2.25-2.25a1 1 0 00-1.415 0l-.96.96A7.08 7.08 0 016.79 7.13l.96-.96a1 1 0 000-1.415L5.5 2.5a1 1 0 00-1.415 0l-1.06 1.06C2.24 4.35 2 5.25 2.19 6.15A12.06 12.06 0 009.85 13.81c.9.19 1.8-.05 2.59-.83l1.06-1.06a1 1 0 000-1.42z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-white/40 mb-0.5">Phone</div>
                  <div className="font-sans font-semibold text-white text-[1.05rem] group-hover:text-warm transition-colors">
                    +91 94914 65303
                  </div>
                </div>
              </a>

              <a
                href="mailto:deanresearch@mlrit.ac.in"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.06] grid place-items-center shrink-0 group-hover:border-warm/50 group-hover:bg-warm/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1.5 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-white/40 mb-0.5">Email</div>
                  <div className="font-sans font-semibold text-white text-[1.05rem] group-hover:text-warm transition-colors">
                    deanresearch@mlrit.ac.in
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.06] grid place-items-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.49-2.01-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="pt-1">
                  <div className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-white/40 mb-0.5">Office</div>
                  <div className="font-sans text-white/75 text-[0.9rem] leading-relaxed">
                    MLR Institute of Technology<br />
                    Survey No. 444, Dundigal<br />
                    Medchal Malkajgiri, Telangana – 500 043
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="mailto:deanresearch@mlrit.ac.in"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-warm text-white font-semibold text-[0.9rem] hover:bg-warm/90 transition-colors"
              >
                Write to the Dean Research
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Page composition ───────────────────────────────────────────── */

export default function ResearchOverviewSections() {
  return (
    <main>
      <AboutRDCell />
      <SectionDivider />
      <ResearchAreas />
      <SectionDivider />
      <Committees />
      <SectionDivider />
      <SponsoredProjects />
      <SectionDivider />
      <ResearchCentres />
      <ResearchFacilities />
      <SectionDivider />
      <ResearchPolicies />
      <SectionDivider />
      <Publications />
      <SectionDivider />
      <Downloads />
      <ContactUs />
    </main>
  );
}
