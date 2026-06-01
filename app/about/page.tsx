'use client';

/**
 * About — MLRIT
 * Layout modeled on mastersunion.org/about-us, in a clean white theme.
 *
 *   Hero → Story (timeline) → Vision/Mission → Chairman Quote →
 *   Leadership Team → Diversity → Affiliations (tabs) → M.L.R.I.T principle
 *   → In the News → Explore Further → CTA
 *
 * Every section uses framer-motion via the Reveal / Stagger primitives.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import CinematicTimeline from '@/components/CinematicTimeline';

/* ──────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────── */

const TIMELINE = [
  { y: '2005', t: 'Foundation Stone',     d: 'MLR Institute of Technology established under KMR Educational Society at Dundigal, Hyderabad with an inaugural intake of 240 students across CSE, ECE, MECH and EEE.' },
  { y: '2008', t: 'First Graduation',     d: 'First B.Tech batch graduates — placed across Wipro, Infosys and TCS. CSE earns the first National Board of Accreditation (NBA) cycle.' },
  { y: '2011', t: 'M.Tech Programmes',    d: 'Postgraduate programmes launched in CSE, ECE, MECH and EEE. JNTUH-recognised research centres set up across four disciplines.' },
  { y: '2017', t: 'IPFC Established',     d: 'Intellectual Property Facilitation Centre opens — anchoring patent filings, IPR workshops and a culture of student-led invention.' },
  { y: '2019', t: 'NAAC Accreditation',   d: 'Institutional NAAC accreditation granted — formal recognition of institutional quality, governance and learning outcomes.' },
  { y: '2022', t: 'Autonomous Status',    d: 'UGC grants autonomous status. MLRIT now designs its own curriculum, regulations and assessment systems — agile to industry needs.' },
  { y: '2024', t: 'New Programmes',       d: 'AIML, CSE-CS, CSE-DS, CSIT and IT launched. Combined intake crosses 1,000+ across UG programmes. New campus blocks open.' },
  { y: '2025', t: 'Twenty Years',         d: 'MLRIT crosses 20 years — 11,000+ students, 7,000+ alumni placed worldwide, 25+ doctoral faculty, 3 active research centres.' },
  { y: '2026', t: 'Trishna 2K26',         d: '21st Annual Day — 621 placement offers, ₹51 LPA highest package, and the strongest training-and-placement season in MLRIT history.' },
];

const PATRONS = [
  { name: 'Sri Marri Laxman Reddy',         role: 'Founder, KMR Educational Society',                  link: '#' },
  { name: 'Sri Marri Rajashekhar Reddy',    role: 'Founder Secretary · MLA, Malkajgiri',               link: '#' },
  { name: 'Smt. Marri Indira Reddy',        role: 'Chairperson, KMR Educational Society',              link: '#' },
];

const EXECUTIVES = [
  { name: 'Dr. K. Srinivas Rao',     role: 'Principal',                              org: 'MLR Institute of Technology' },
  { name: 'Dr. P. Rajashekar',       role: 'Dean, Academics',                        org: 'MLRIT' },
  { name: 'Prof. Ravi Chandra P',    role: 'Head, Training & Placements',            org: 'MLRIT' },
  { name: 'Dr. M. Anitha',           role: 'Dean, Research & Innovation',            org: 'MLRIT' },
  { name: 'Dr. T. Sumathi',          role: 'Coordinator, Freshman Engineering',      org: 'MLRIT' },
];

const ACADEMIC_LEADS = [
  { name: 'Dr. Ajmeera Kiran',           role: 'Head, CSE',          photo: '/faculty/cse/ajmeera-kiran.jpg' },
  { name: 'Dr. P. Subhashini',           role: 'Head, CSE-CS / DS',  photo: '/faculty/cse-cs/p-subhashini.jpg' },
  { name: 'Dr. Kashi Sai Prasad',        role: 'Head, AIML',         photo: '/faculty/aiml/kashi-sai-prasad.jpg' },
  { name: 'Dr. D.B.K. Kamesh',           role: 'Head, CSIT',         photo: '/faculty/csit/d-b-k-kamesh.jpg' },
  { name: 'Dr. N V Raja Sekhar Reddy',   role: 'Head, IT',           photo: '/faculty/it/n-v-raja-sekhar-reddy.jpg' },
  { name: 'Dr. S V S Prasad',            role: 'Head, ECE',          photo: '/faculty/ece/svs-prasad.jpg' },
  { name: 'Prof. Ashok Kumar Cheeli',    role: 'Head, EEE',          photo: '/faculty/eee/ashok-kumar.jpg' },
  { name: 'Dr. J. Krishnaraj',           role: 'Head, Mechanical',   photo: '/faculty/mechanical/krishnaraj.jpg' },
  { name: 'Dr. M. Satyanarayana Gupta',  role: 'Head, Aeronautical', photo: '/faculty/aeronautical/satyanarayana.jpg' },
  { name: 'Dr. N. Ramanjaneyulu',        role: 'Head, MBA',          photo: '/faculty/mba/ramanjaneyulu.jpeg' },
];

const DIVERSITY = [
  { num: '11K+',  label: 'Students on campus' },
  { num: '42%',   label: 'Women in UG cohort' },
  { num: '25+',   label: 'Doctoral faculty' },
  { num: '40%',   label: 'Women in faculty' },
];

const ACCREDITATIONS = {
  Accreditations: [
    { name: 'NAAC',  detail: 'Institutional accreditation — recognises overall quality of governance, learning and research.' },
    { name: 'NBA',   detail: 'Programme-level accreditation across CSE, ECE, EEE, MECH and IT.' },
    { name: 'NIRF',  detail: 'Featured in the National Institutional Ranking Framework (engineering category, 201–300 band) for three years running.' },
  ],
  Approvals: [
    { name: 'UGC · Autonomous',  detail: 'Granted autonomous status — MLRIT designs its own curriculum, examinations and assessment systems.' },
    { name: 'AICTE',             detail: 'All B.Tech, M.Tech and MBA programmes are approved by the All India Council for Technical Education.' },
    { name: 'JNTUH Affiliated',  detail: 'Affiliated to Jawaharlal Nehru Technological University, Hyderabad — degrees awarded by JNTUH under MLRIT autonomous regulations.' },
  ],
  Partnerships: [
    { name: 'Virtusa',   detail: 'Centre of Excellence — training and direct placement pathway.' },
    { name: 'EPAM',      detail: 'Industry-led curriculum and capstone projects.' },
    { name: 'Boeing',    detail: 'Aerospace partnership — UAV/avionics labs and internships.' },
    { name: 'Cyient',    detail: 'Embedded systems and digital engineering MoU.' },
    { name: 'Tata Tech', detail: 'Manufacturing and design-engineering collaboration.' },
    { name: 'Revature',  detail: 'Software engineering bootcamps and hire-train-deploy pipeline.' },
  ],
};

const PRINCIPLES = [
  {
    letter: 'M',
    word: 'Multidisciplinary',
    body: 'Eleven engineering and management departments under one roof — students learn across boundaries from day one. No silos, only shared problems and shared classrooms.',
  },
  {
    letter: 'L',
    word: 'Learning by doing',
    body: 'Project-based learning, flipped classrooms and industry-mentored hackathons replace the lecture-only mould. Every semester ships something real — a circuit, a paper, a prototype, a product.',
  },
  {
    letter: 'R',
    word: 'Research-driven',
    body: 'Three active research centres, 25+ doctoral faculty, and a steady stream of publications across IEEE, Springer and Elsevier indexed venues — undergraduates included.',
  },
  {
    letter: 'I',
    word: 'Industry-integrated',
    body: 'Active MoUs with Virtusa, EPAM, Boeing, Cyient and Tata Technologies. Industry mentors run electives, capstones run on real datasets, internships are paid and graded.',
  },
  {
    letter: 'T',
    word: 'Twenty-year track record',
    body: '7,000+ alumni placed worldwide. 98% placement rate. ₹51 LPA highest package. The numbers are public, audited and unbroken across every cohort since 2008.',
  },
];

const NEWS = [
  { date: 'Mar 2026',  pub: 'The Hindu',          title: 'MLRIT crosses 621 placement offers in 2025-26 — strongest season in two decades.' },
  { date: 'Feb 2026',  pub: 'Telangana Today',    title: 'Trishna 2K26 — annual showcase celebrates 20 years of MLRIT engineering excellence.' },
  { date: 'Jan 2026',  pub: 'Education World',    title: 'MLRIT reports ₹8.4 LPA average package across CSE, ECE and CSE-DS graduates.' },
  { date: 'Nov 2025',  pub: 'Times of India',     title: 'JNTUH-affiliated autonomous colleges lead in research output — MLRIT in the top quintile.' },
  { date: 'Sep 2025',  pub: 'The New Indian',     title: 'Industry-integrated curricula reshape Hyderabad engineering education — MLRIT featured.' },
  { date: 'Jul 2025',  pub: 'Deccan Chronicle',   title: 'Boeing partners with MLRIT to expand UAV and avionics research at Dundigal campus.' },
];

const EXPLORE = [
  { title: 'Academics',   href: '/academics',   blurb: '12 departments. UG, PG and PhD programmes.' },
  { title: 'Placements',  href: '/placements',  blurb: '₹51 LPA top package. 98% placement rate.' },
  { title: 'Research',    href: '/research',    blurb: 'Three centres, 25+ doctoral faculty.' },
  { title: 'Chronicles',  href: '/chronicles',  blurb: 'Stories, events and student voices.' },
];

/* ──────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="bg-white text-foreground">
      <Hero />
      <CinematicTimeline />
      <VisionMission />
      <ChairmanQuote />
      <LeadershipTeam />
      <Diversity />
      <Affiliations />
      <Principles />
      <News />
      <Explore />
      <CTA />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   1 · HERO — clean white, big bold headline, intro copy
   ════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-20 md:pb-28">
        <Reveal preset="up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream border border-border font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            About MLRIT
          </span>
        </Reveal>

        <Reveal preset="up" delay={0.1}>
          <h1 className="mt-7 font-sans font-black tracking-tighter-2 leading-[0.96] text-foreground text-[clamp(2.6rem,6vw,5.2rem)] max-w-[1100px]">
            Reimagining engineering{' '}
            <span
              className="font-display italic font-medium"
              style={{
                backgroundImage: 'linear-gradient(180deg, #0f0f0f 0%, #e85d04 130%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              education.
            </span>
          </h1>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          <Reveal preset="right" delay={0.2}>
            <p className="text-[1.08rem] md:text-[1.18rem] leading-[1.65] text-muted max-w-[560px]">
              At MLRIT we teach engineering by{' '}
              <span className="font-bold text-foreground">doing engineering</span>. Students build
              circuits, ship prototypes, and run live capstones with industry mentors — because
              engineering is learned when you fabricate, debug and deploy, not just when you
              listen.
            </p>
          </Reveal>

          <Reveal preset="up" delay={0.3}>
            <div className="grid grid-cols-3 gap-6 lg:gap-10">
              {[
                { n: '20+',  l: 'Years of legacy' },
                { n: '11K+', l: 'Students on campus' },
                { n: '7K+',  l: 'Alumni worldwide' },
              ].map((s) => (
                <div key={s.l} className="border-t border-border pt-5">
                  <div className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-none">
                    {s.n}
                  </div>
                  <div className="mt-2 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-muted leading-tight">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   2 · OUR STORY — vertical timeline (sticky year on the left,
   alternating year groups, animated reveal per item)
   ════════════════════════════════════════════════════════ */

// Story() removed — the cinematic timeline (components/CinematicTimeline.tsx)
// now owns this section with a scroll-pinned, year-morphing experience.
function StoryUnused() {
  return null;
}

/* ════════════════════════════════════════════════════════
   3 · VISION + MISSION — two-column, big cards on cream
   ════════════════════════════════════════════════════════ */

function VisionMission() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-6 md:gap-8">
        <Reveal preset="right">
          <div className="rounded-3xl bg-white p-10 md:p-12 shadow-card-soft hover:shadow-card-strong hover:-translate-y-1 transition-all duration-500 ease-out-quart h-full">
            <span className="font-mono text-[0.66rem] font-extrabold tracking-[0.22em] uppercase text-secondary">
              Our Vision
            </span>
            <h3 className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.04]">
              An education model that maximises{' '}
              <span className="font-display italic font-medium text-primary">human potential.</span>
            </h3>
            <p className="mt-5 text-muted leading-relaxed text-[1.02rem]">
              To emerge as a centre of excellence in technical education and research — producing
              globally competent engineers, capable of building a strong and developed nation.
            </p>
          </div>
        </Reveal>

        <Reveal preset="up" delay={0.1}>
          <div className="rounded-3xl bg-white p-10 md:p-12 shadow-card-soft hover:shadow-card-strong hover:-translate-y-1 transition-all duration-500 ease-out-quart h-full">
            <span className="font-mono text-[0.66rem] font-extrabold tracking-[0.22em] uppercase text-primary">
              Our Mission
            </span>
            <h3 className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.04]">
              A globally eminent institution that continuously{' '}
              <span className="font-display italic font-medium text-secondary">challenges pedagogy.</span>
            </h3>
            <p className="mt-5 text-muted leading-relaxed text-[1.02rem]">
              Deliver an industry-aligned curriculum, well-resourced laboratories, and a research
              culture that empowers every student — building professionals equipped to lead in
              an evolving world.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   4 · CHAIRMAN / FOUNDER QUOTE
   ════════════════════════════════════════════════════════ */

function ChairmanQuote() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">
        <Reveal preset="right">
          <div
            className="aspect-[4/5] rounded-3xl overflow-hidden grid place-items-center shadow-card-strong"
            style={{ background: 'linear-gradient(135deg, #1F6B24 0%, #2d8b55 45%, #1F6B24 100%)' }}
          >
            <div className="text-center px-6">
              <div className="font-display italic font-medium text-white/85 text-[1.05rem] mb-3">
                Founder
              </div>
              <div className="font-sans font-black text-white text-[clamp(2rem,3vw,2.8rem)] tracking-tighter-2 leading-tight">
                Sri Marri
                <br />
                Laxman Reddy
              </div>
              <div className="mt-5 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-white/55">
                KMR Educational Society
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal preset="up" delay={0.1}>
          <div>
            <span
              aria-hidden
              className="font-display text-primary text-[6rem] leading-[0.8] block"
            >
              &ldquo;
            </span>
            <p className="font-display italic font-medium text-foreground text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.32] tracking-tight max-w-[820px]">
              The future of education is not just a means to an end — but a transformative
              journey that shapes leaders and innovators capable of building a stronger nation.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="w-12 h-px bg-primary" />
              <div>
                <div className="font-sans font-bold text-foreground text-[1rem]">
                  Sri Marri Laxman Reddy
                </div>
                <div className="text-muted text-[0.88rem] mt-0.5">
                  Founder, KMR Educational Society
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   5 · LEADERSHIP TEAM — three categories of cards
   ════════════════════════════════════════════════════════ */

function LeadershipTeam() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
            Leadership
          </span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground leading-[1.04] text-[clamp(2.2rem,4.5vw,3.8rem)] max-w-[900px]">
            Creating a community of{' '}
            <span className="font-display italic font-medium text-secondary">change-makers.</span>
          </h2>
        </Reveal>

        {/* Patrons */}
        <SubGroup eyebrow="Patrons" className="mt-16">
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATRONS.map((p) => (
              <StaggerItem key={p.name}>
                <LeaderCard name={p.name} role={p.role} accent="green" big />
              </StaggerItem>
            ))}
          </Stagger>
        </SubGroup>

        {/* Executive Leaders */}
        <SubGroup eyebrow="Executive Leaders" className="mt-20">
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {EXECUTIVES.map((e) => (
              <StaggerItem key={e.name}>
                <LeaderCard name={e.name} role={e.role} org={e.org} accent="orange" />
              </StaggerItem>
            ))}
          </Stagger>
        </SubGroup>

        {/* Department Heads */}
        <SubGroup eyebrow="Heads of Department" className="mt-20">
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ACADEMIC_LEADS.slice(0, expanded ? ACADEMIC_LEADS.length : 5).map((h) => (
              <StaggerItem key={h.name}>
                <LeaderCard name={h.name} role={h.role} photo={h.photo} compact />
              </StaggerItem>
            ))}
          </Stagger>
          {ACADEMIC_LEADS.length > 5 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-[1.5px] border-foreground bg-white hover:bg-foreground hover:text-white font-sans font-bold text-[0.85rem] transition-colors duration-300"
              >
                {expanded ? 'View less' : `View ${ACADEMIC_LEADS.length - 5} more`}
                <motion.span
                  aria-hidden
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  ↓
                </motion.span>
              </button>
            </div>
          )}
        </SubGroup>
      </div>
    </section>
  );
}

function SubGroup({
  eyebrow,
  className = '',
  children,
}: {
  eyebrow: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Reveal>
        <div className="flex items-center gap-4 mb-7">
          <span className="font-mono text-[0.66rem] font-extrabold tracking-[0.22em] uppercase text-secondary">
            {eyebrow}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Reveal>
      {children}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?|Sri|Smt\.?|Prof\.?)\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function LeaderCard({
  name,
  role,
  org,
  photo,
  accent = 'orange',
  big,
  compact,
}: {
  name: string;
  role: string;
  org?: string;
  photo?: string;
  accent?: 'orange' | 'green';
  big?: boolean;
  compact?: boolean;
}) {
  const accentColor = accent === 'orange' ? 'text-primary' : 'text-secondary';
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`group h-full rounded-2xl bg-white shadow-card-soft hover:shadow-card-strong border border-border overflow-hidden ${
        big ? 'p-7' : compact ? 'p-4' : 'p-6'
      }`}
    >
      <div className={`relative w-full ${compact ? 'aspect-[3/4]' : 'aspect-[4/5]'} rounded-xl overflow-hidden mb-4`}
           style={{ background: 'linear-gradient(135deg, #ecdec1 0%, #faf7f0 100%)' }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-display italic font-medium text-foreground/30 text-[clamp(2.5rem,4vw,4.5rem)] tracking-tighter">
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>
      <div className={`font-sans font-extrabold tracking-tighter-2 text-foreground leading-tight ${
        compact ? 'text-[0.92rem]' : big ? 'text-[1.15rem]' : 'text-[1.05rem]'
      }`}>
        {name}
      </div>
      <div className={`mt-1 ${accentColor} font-sans font-semibold ${compact ? 'text-[0.74rem]' : 'text-[0.82rem]'}`}>
        {role}
      </div>
      {org && (
        <div className="mt-1 font-mono text-[0.66rem] tracking-[0.06em] uppercase text-subtle">
          {org}
        </div>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   6 · DIVERSITY & INCLUSION — stats
   ════════════════════════════════════════════════════════ */

function Diversity() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
        <Reveal preset="right">
          <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
            Diversity & Inclusion
          </span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground leading-[1.04] text-[clamp(2rem,3.6vw,3rem)]">
            We value diversity,{' '}
            <span className="font-display italic font-medium text-secondary">voices, and perspectives.</span>
          </h2>
          <p className="mt-5 text-muted leading-relaxed text-[1.02rem] max-w-[520px]">
            At MLRIT, we celebrate diversity with strong representation across our students,
            faculty and staff. Inclusivity sits at the heart of our community — every cohort
            reflects the country we serve.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-2 gap-5">
          {DIVERSITY.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-2xl bg-cream border border-border p-7 md:p-8 h-full hover:-translate-y-1 hover:shadow-card-soft transition-all duration-300">
                <div className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2.4rem,4vw,3.6rem)] leading-none">
                  {s.num}
                </div>
                <div className="mt-3 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted leading-tight">
                  {s.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   7 · AFFILIATIONS — tab navigation + cards
   ════════════════════════════════════════════════════════ */

function Affiliations() {
  const tabs = Object.keys(ACCREDITATIONS) as (keyof typeof ACCREDITATIONS)[];
  const [tab, setTab] = useState<keyof typeof ACCREDITATIONS>(tabs[0]);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
            Affiliations & Collaborations
          </span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground leading-[1.04] text-[clamp(2rem,4vw,3.4rem)] max-w-[820px]">
            Backed by the bodies that{' '}
            <span className="font-display italic font-medium text-secondary">set the standard.</span>
          </h2>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={0.05}>
          <div className="mt-10 inline-flex gap-2 flex-wrap">
            {tabs.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-5 py-2.5 rounded-full font-sans font-bold text-[0.84rem] border-[1.5px] transition-all duration-300 ${
                    active
                      ? 'bg-foreground text-white border-foreground'
                      : 'bg-white text-muted border-border hover:bg-foreground hover:text-white hover:border-foreground'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Cards — animate on tab change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {ACCREDITATIONS[tab].map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-white border border-border p-7 hover:border-primary hover:-translate-y-1 hover:shadow-card-soft transition-all duration-300"
              >
                <div className="font-mono text-[0.66rem] font-extrabold tracking-[0.18em] uppercase text-primary mb-3">
                  {tab}
                </div>
                <div className="font-sans font-extrabold text-foreground text-[1.15rem] tracking-tighter-2 leading-tight">
                  {item.name}
                </div>
                <p className="mt-3 text-muted leading-relaxed text-[0.94rem]">{item.detail}</p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   8 · PRINCIPLES — M.L.R.I.T five-letter manifesto
   ════════════════════════════════════════════════════════ */

function Principles() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
            What we stand for
          </span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground leading-[1.04] text-[clamp(2.4rem,5vw,4rem)]">
            M.L.R.I.T —{' '}
            <span className="font-display italic font-medium text-secondary">five principles.</span>
          </h2>
        </Reveal>

        <Stagger className="mt-16 space-y-3" delay={0.07}>
          {PRINCIPLES.map((p) => (
            <StaggerItem key={p.letter + p.word}>
              <PrincipleRow {...p} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function PrincipleRow({ letter, word, body }: { letter: string; word: string; body: string }) {
  return (
    <motion.div
      whileHover={{ x: 6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group grid grid-cols-[80px_1fr] md:grid-cols-[180px_1fr_2fr] gap-6 md:gap-10 items-start py-8 md:py-10 border-t border-border last:border-b"
    >
      <div className="font-display italic font-medium text-foreground/15 group-hover:text-primary transition-colors duration-500 text-[clamp(4rem,8vw,7rem)] leading-[0.85] tracking-tighter">
        {letter}
      </div>
      <div className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.04]">
        {word}
      </div>
      <p className="text-muted leading-[1.7] text-[1.02rem] md:text-[1.05rem] md:pt-2">{body}</p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   9 · IN THE NEWS
   ════════════════════════════════════════════════════════ */

function News() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
                In the News
              </span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground leading-[1.04] text-[clamp(2rem,3.8vw,3.2rem)]">
                What the press{' '}
                <span className="font-display italic font-medium text-secondary">is saying.</span>
              </h2>
            </div>
            <Link
              href="/chronicles"
              className="inline-flex items-center gap-2 self-start md:self-end font-sans font-bold text-[0.92rem] text-foreground hover:text-primary transition-colors"
            >
              Read MLRIT Chronicles →
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
          {NEWS.map((n) => (
            <StaggerItem key={n.title}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl bg-white border border-border p-7 h-full flex flex-col hover:border-primary hover:shadow-card-soft transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-[0.66rem] font-extrabold tracking-[0.16em] uppercase text-primary">
                    {n.pub}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="font-mono text-[0.66rem] tracking-[0.08em] uppercase text-subtle">
                    {n.date}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-foreground text-[1.04rem] leading-[1.4] tracking-tight flex-1">
                  {n.title}
                </h3>
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-sans font-bold text-[0.86rem]">
                  Read article <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   10 · EXPLORE FURTHER — 4 deep-link cards
   ════════════════════════════════════════════════════════ */

function Explore() {
  return (
    <section className="bg-white py-24 md:py-32 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <h2 className="font-sans font-black tracking-tighter-2 text-foreground leading-[1.04] text-[clamp(2rem,3.8vw,3.2rem)] max-w-[800px]">
            Explore <span className="font-display italic font-medium text-primary">MLRIT...</span>
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5" delay={0.06}>
          {EXPLORE.map((e) => (
            <StaggerItem key={e.title}>
              <Link href={e.href} className="group block h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-2xl border border-border p-8 hover:border-primary bg-white hover:bg-cream transition-colors duration-500"
                >
                  <div className="font-sans font-black tracking-tighter-2 text-foreground text-[1.6rem]">
                    {e.title}
                  </div>
                  <p className="mt-3 text-muted leading-relaxed text-[0.95rem]">{e.blurb}</p>
                  <div className="mt-10 inline-flex items-center gap-2 text-primary font-sans font-bold text-[0.92rem]">
                    Open
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   11 · CTA — closing band
   ════════════════════════════════════════════════════════ */

function CTA() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="rounded-[36px] border border-border bg-cream p-12 md:p-16 lg:p-20 text-center">
            <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
              Visit MLRIT
            </span>
            <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-foreground leading-[1.02] text-[clamp(2.2rem,4.5vw,3.8rem)] max-w-[900px] mx-auto">
              See the campus that built{' '}
              <span className="font-display italic font-medium text-secondary">21 years of engineers.</span>
            </h2>
            <p className="mt-6 text-muted text-[1.04rem] leading-relaxed max-w-[640px] mx-auto">
              MLR Institute of Technology, Dundigal, Hyderabad, Telangana — 500043. Schedule a
              campus visit or speak to the admissions team.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/placements"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-white font-sans font-bold text-[0.92rem] hover:bg-primary transition-colors"
              >
                See Placement Outcomes →
              </Link>
              <Link
                href="/academics"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-[1.5px] border-foreground text-foreground font-sans font-bold text-[0.92rem] hover:bg-foreground hover:text-white transition-colors"
              >
                Explore Academics
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
