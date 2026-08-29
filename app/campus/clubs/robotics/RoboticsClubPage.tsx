'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Design constants ─────────────────────────────────────────────────────────

const EASE_OUT_QUART = [0.16, 1, 0.3, 1] as const;
const INSTAGRAM_URL = 'https://www.instagram.com/mlrit_robotic_club/';
const LINKEDIN_URL = 'https://www.linkedin.com/company/mlrit_robotic_club/';

// ─── Club data (sourced from PDF) ─────────────────────────────────────────────

const roboticsClub = {
  name: 'Robotics Club',
  dept: 'Under the ECE Department · MLR Institute of Technology',
  tagline:
    'Passionate innovators exploring Robotics, AI, Embedded Systems, and Automation through hands-on learning.',
  about:
    'The Robotics Club is a platform for students to explore emerging technologies and transform their ideas into practical engineering solutions. Through workshops, projects, competitions, and collaborations, the club prepares students to address real-world engineering challenges.',
  purpose:
    'The club exists to inspire students to develop technology that addresses real-world challenges, provide hands-on learning through robotics projects, and foster creativity, innovation, and critical thinking.',
  collaborations: [
    {
      name: 'IETE',
      full: 'Institution of Electronics and Telecommunication Engineers',
      desc: 'Technical education, workshops, seminars, networking, and career development.',
    },
    {
      name: 'IIC',
      full: "Institution's Innovation Council",
      desc: 'A Ministry of Education initiative supporting project development, hackathons, competitions, and problem-solving.',
    },
    {
      name: 'IEEE RAS',
      full: 'IEEE Robotics and Automation Society',
      desc: 'Technical learning, competitions, conferences, networking, and career readiness.',
    },
  ],
  objectives: [
    'Inspire innovation and creativity among students',
    'Develop practical robotics and automation skills',
    'Encourage teamwork and problem-solving',
    'Provide exposure to emerging technologies',
    'Promote project-based and experiential learning',
    'Prepare students to become future technology leaders',
    'Encourage participation in technical competitions and project exhibitions',
  ],
  activityPillars: [
    {
      title: 'Workshops & Training',
      items: [
        'PCB design and development workshops',
        'Robotics workshops',
        'Embedded systems workshops',
        'ARM architecture and microcontroller-based learning',
        'Technical training sessions',
      ],
    },
    {
      title: 'Competitions & Challenges',
      items: [
        'Robothons',
        'Robotech events',
        'Robo games',
        'Circuit debugging challenges',
        'Project-based competitions',
      ],
    },
    {
      title: 'Knowledge Sharing',
      items: [
        'Technical talks',
        'IEEE RAS sessions',
        'Seminars and interactive sessions',
        'Paper and poster presentations',
      ],
    },
    {
      title: 'Innovation & Projects',
      items: [
        'Real-world robotics projects',
        'Embedded-system-based projects',
        'Automation solutions',
        'Project exhibitions',
        'Prototype development',
      ],
    },
  ],
  notableProjects: [
    {
      name: 'Bore Bot',
      subtitle: 'Borewell Rescue Robot',
      desc: 'Rescues people, especially children, trapped in narrow borewells.',
    },
    {
      name: 'Brain-Controlled Wheelchair',
      subtitle: 'Assistive Technology',
      desc: 'An intelligent mobility device allowing people with severe physical disabilities to control movement using brain signals.',
    },
    {
      name: 'AquaBotX',
      subtitle: 'Environmental Monitoring',
      desc: 'An autonomous robot that monitors water quality and collects real-time environmental data.',
    },
    {
      name: 'Winding Machine',
      subtitle: 'Industrial Automation',
      desc: 'An automated machine that winds wire or thread onto a spool with precision, speed, and consistency.',
    },
  ],
  achievements: [
    'Participation in Robo Games / Bots, Project Expos, and technical competitions',
    'Paper and poster presentations',
    'Student internships',
    'PCB boards developed by club members',
    'News and media coverage',
    '10th Anniversary Celebrations',
  ],
  events: [
    {
      name: 'PCB Workshop',
      date: 'August 12 & 13, 2026',
      target: '1st & 2nd Year Students',
      type: 'Workshop',
      instagramUrl: 'https://www.instagram.com/p/DHP8mINvDQt/',
      image: '/images/students/reel-ece.png',
      desc: 'Hands-on printed circuit board design and development workshop covering industry-grade PCB tools and techniques.',
    },
    {
      name: 'Robothon',
      date: 'September 2, 2026',
      target: 'All 4 Years',
      type: 'Competition',
      instagramUrl: 'https://www.instagram.com/p/DB-8Cgyz8ym/',
      image: '/images/students/faculty-seminar.png',
      desc: 'MLRIT\'s flagship robotics competition where teams design, build, and compete with autonomous and semi-autonomous robots.',
    },
    {
      name: 'Robotech',
      date: 'February 2, 2027',
      target: 'National Players',
      type: 'National Event',
      instagramUrl: 'https://www.instagram.com/p/C6F73JXvS3R/',
      image: '/images/students/campus-group.png',
      desc: 'National-level robotics technology event attracting participants from across India. Robot arena battles and technical showcases.',
    },
  ],
  memoryLane: [
    { id: 'r1', src: '/images/clubs/robotics/memory-1.jpg',  alt: 'Robotics Club members working on a project' },
    { id: 'r2', src: '/images/clubs/robotics/memory-2.jpg',  alt: 'Students at a Robotics Club workshop' },
    { id: 'r3', src: '/images/clubs/robotics/memory-3.jpg',  alt: 'Robotics competition at MLRIT' },
    { id: 'r4', src: '/images/clubs/robotics/memory-4.jpg',  alt: 'Robotics Club event moments' },
    { id: 'r5', src: '/images/clubs/robotics/memory-5.jpg',  alt: 'Students building robots together' },
    { id: 'r6', src: '/images/clubs/robotics/memory-6.jpg',  alt: 'Robotics Club collaboration session' },
    { id: 'r7', src: '/images/clubs/robotics/memory-7.jpg',  alt: 'Project expo demonstration' },
    { id: 'r8', src: '/images/clubs/robotics/memory-8.png',  alt: 'Robotics Club campus memories' },
  ],
};

// ─── Persistent Instagram CTA ─────────────────────────────────────────────────

function InstagramCTA() {
  const [isFloating, setIsFloating] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsFloating(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    const el = document.getElementById('robotics-hero-sentinel');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero-inline CTA — visible when hero is in view */}
      <motion.a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Robotics Club on Instagram"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2, ease: EASE_OUT_QUART }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-bold text-[0.82rem] tracking-tight border border-white/25 text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 group"
      >
        Follow on Instagram
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </motion.a>

      {/* Floating CTA — appears after hero scrolls out */}
      <AnimatePresence>
        {isFloating && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
            className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8"
          >
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Robotics Club on Instagram (opens in new tab)"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-sans font-bold text-[0.78rem] tracking-tight bg-ink shadow-card-strong text-white border border-white/12 transition-all duration-300 hover:bg-ink-2 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 group"
              style={{ backgroundColor: '#0c0c0e' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden />
              Robotics Club
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function RoboticsHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(560px, 66vw, 920px)', backgroundColor: '#0c0c0e' }}
      aria-label="Robotics Club hero"
    >
      {/* Background image */}
      <Image
        src="/images/clubs/robotics-hero.png"
        alt=""
        fill
        priority
        quality={88}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* Dark overlay for text contrast */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.68) 60%, rgba(8,8,8,0.82) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Club logo — top-left */}
      <div
        className="absolute z-[3]"
        style={{ top: 'clamp(20px, 3vw, 40px)', left: 'clamp(20px, 3vw, 48px)' }}
      >
        <div
          className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/25 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          aria-label="Robotics Club logo"
        >
          {/* SVG logo approximation — circular with MLRIT ECE Robotic Club text */}
          <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
            <circle cx="40" cy="40" r="40" fill="#111" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="#8b0000" strokeWidth="1.5" />
            {/* Wing shapes */}
            <path d="M14 35 Q8 28 14 20 Q22 26 22 34Z" fill="#c0392b" opacity="0.9" />
            <path d="M66 35 Q72 28 66 20 Q58 26 58 34Z" fill="#c0392b" opacity="0.9" />
            <path d="M12 37 Q6 30 10 22 Q18 28 20 36Z" fill="#e74c3c" opacity="0.7" />
            <path d="M68 37 Q74 30 70 22 Q62 28 60 36Z" fill="#e74c3c" opacity="0.7" />
            {/* Center shield */}
            <ellipse cx="40" cy="40" rx="14" ry="16" fill="#c9a84c" opacity="0.15" />
            <text x="40" y="34" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">MLRIT</text>
            <text x="40" y="42" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">ECE</text>
            <text x="40" y="56" textAnchor="middle" fill="#c9a84c" fontSize="4.5" fontWeight="600" fontFamily="sans-serif">ROBOTIC CLUB</text>
          </svg>
        </div>
      </div>

      {/* Main typography — ROBOTICS from above, CLUB from below */}
      <div
        className="absolute inset-0 z-[2] flex flex-col items-center justify-center select-none"
        aria-label="Robotics Club"
      >
        {/* ROBOTICS — enters from above */}
        <motion.h1
          className="font-sans font-black text-white text-center leading-none"
          style={{
            fontSize: 'clamp(4rem, 12vw, 12rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
          }}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -80 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_QUART }}
        >
          ROBOTICS
        </motion.h1>

        {/* CLUB — enters from below */}
        <motion.span
          className="font-display font-medium text-center leading-none"
          style={{
            fontSize: 'clamp(3.5rem, 10.5vw, 10.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            color: '#c9a84c',
            display: 'block',
          }}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 80 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_QUART }}
          aria-hidden="true"
        >
          CLUB
        </motion.span>

        {/* Tagline */}
        <motion.p
          className="mt-6 text-center font-sans px-4"
          style={{
            fontSize: 'clamp(0.78rem, 1.2vw, 1rem)',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 480,
            lineHeight: 1.55,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: EASE_OUT_QUART }}
        >
          ECE Department · MLR Institute of Technology
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT_QUART }}
        >
          <InstagramCTA />
        </motion.div>
      </div>

      {/* Sentinel for floating CTA trigger */}
      <div id="robotics-hero-sentinel" className="absolute bottom-0 w-full h-1" aria-hidden="true" />

      {/* Bottom fade into cream */}
      <div
        className="absolute inset-x-0 bottom-0 z-[3] pointer-events-none"
        style={{ height: 140, background: 'linear-gradient(to bottom, transparent 0%, #faf7f0 100%)' }}
        aria-hidden="true"
      />
    </section>
  );
}

// ─── About section ────────────────────────────────────────────────────────────

function RoboticsAbout() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: '#faf7f0', paddingTop: 'clamp(60px, 8vw, 120px)', paddingBottom: 'clamp(60px, 8vw, 120px)' }}
      aria-label="About the Robotics Club"
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: '1200px' }}>
        {/* Label */}
        <span
          className="inline-flex items-center gap-2 font-mono text-[0.62rem] font-bold tracking-[0.26em] uppercase mb-6 block"
          style={{ color: '#01741f' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden />
          About the Club
        </span>

        {/* Two-column: large statement + details */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Left — large editorial statement */}
          <div>
            <h2
              className="font-sans font-black tracking-tighter-2 leading-[1.04]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', color: '#0f0f0f' }}
            >
              What is the{' '}
              <span className="font-display italic font-medium" style={{ color: '#c9a84c' }}>
                Robotics Club?
              </span>
            </h2>

            <p
              className="mt-6 font-sans leading-relaxed"
              style={{ fontSize: 'clamp(1rem, 1.25vw, 1.15rem)', color: '#5e5d57', maxWidth: 520 }}
            >
              {roboticsClub.about}
            </p>

            {/* Purpose callout */}
            <blockquote
              className="mt-8 border-l-2 pl-5"
              style={{ borderColor: '#e85d04' }}
            >
              <p
                className="font-display italic"
                style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)', color: '#0f0f0f', lineHeight: 1.4 }}
              >
                &ldquo;{roboticsClub.tagline}&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Right — objectives + collaborations */}
          <div className="space-y-10">
            {/* Key objectives */}
            <div>
              <h3
                className="font-sans font-bold mb-4"
                style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9d9b94' }}
              >
                Key Objectives
              </h3>
              <ul className="space-y-2.5">
                {roboticsClub.objectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: '#e85d04' }}
                      aria-hidden
                    />
                    <span
                      className="font-sans leading-snug"
                      style={{ fontSize: 'clamp(0.875rem, 1vw, 0.95rem)', color: '#27272a' }}
                    >
                      {obj}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collaborations */}
            <div>
              <h3
                className="font-sans font-bold mb-4"
                style={{ fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9d9b94' }}
              >
                Collaborations
              </h3>
              <div className="space-y-3">
                {roboticsClub.collaborations.map((collab) => (
                  <div
                    key={collab.name}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: '#f1ece1', border: '1px solid #e8e2d2' }}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-sans font-black text-[0.82rem]" style={{ color: '#0f0f0f' }}>
                        {collab.name}
                      </span>
                      <span className="font-sans text-[0.72rem]" style={{ color: '#9d9b94' }}>
                        {collab.full}
                      </span>
                    </div>
                    <p className="font-sans text-[0.8rem] leading-snug" style={{ color: '#5e5d57' }}>
                      {collab.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Recognition */}
        <div className="mt-16 pt-12 border-t" style={{ borderColor: '#e8e2d2' }}>
          <h3
            className="font-sans font-black mb-6"
            style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', color: '#0f0f0f' }}
          >
            Achievements &amp;{' '}
            <span className="font-display italic font-medium" style={{ color: '#c9a84c' }}>Recognition</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roboticsClub.achievements.map((item) => (
              <li key={item} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f1ece1', border: '1px solid #e8e2d2' }}>
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#c9a84c' }} aria-hidden />
                <span className="font-sans text-[0.87rem] leading-snug" style={{ color: '#27272a' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Activities section ───────────────────────────────────────────────────────

function RoboticsActivities() {
  return (
    <section
      className="w-full"
      style={{
        backgroundColor: '#f1ece1',
        paddingTop: 'clamp(60px, 8vw, 100px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
      }}
      aria-label="Robotics Club activities"
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span
            className="inline-flex items-center gap-2 font-mono text-[0.62rem] font-bold tracking-[0.26em] uppercase mb-5 block"
            style={{ color: '#01741f' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden />
            What We Do
          </span>
          <h2
            className="font-sans font-black tracking-tighter-2 leading-[1.04]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#0f0f0f' }}
          >
            Build. Compete.{' '}
            <span className="font-display italic font-medium" style={{ color: '#c9a84c' }}>Innovate.</span>
          </h2>
        </div>

        {/* Activity pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {roboticsClub.activityPillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: '#faf7f0',
                border: '1px solid #e8e2d2',
                borderTop: `3px solid ${['#e85d04', '#01741f', '#1e3a5f', '#c9a84c'][i]}`,
              }}
            >
              <h3
                className="font-sans font-extrabold mb-4"
                style={{ fontSize: '0.92rem', color: '#0f0f0f' }}
              >
                {pillar.title}
              </h3>
              <ul className="space-y-2">
                {pillar.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[0.6rem] mt-1 flex-shrink-0" style={{ color: '#9d9b94' }}>▸</span>
                    <span className="font-sans text-[0.8rem] leading-snug" style={{ color: '#5e5d57' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Notable Projects */}
        <div>
          <h3
            className="font-sans font-black mb-8"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: '#0f0f0f' }}
          >
            Notable Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {roboticsClub.notableProjects.map((project, i) => (
              <div
                key={project.name}
                className="flex gap-5 p-6 rounded-2xl"
                style={{ backgroundColor: '#faf7f0', border: '1px solid #e8e2d2' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-sans font-black text-sm"
                  style={{ backgroundColor: '#0c0c0e', color: '#c9a84c' }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h4 className="font-sans font-extrabold mb-0.5" style={{ fontSize: '0.95rem', color: '#0f0f0f' }}>
                    {project.name}
                  </h4>
                  <p className="font-mono text-[0.62rem] font-bold tracking-wide uppercase mb-2" style={{ color: '#9d9b94' }}>
                    {project.subtitle}
                  </p>
                  <p className="font-sans text-[0.82rem] leading-relaxed" style={{ color: '#5e5d57' }}>
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Events section ───────────────────────────────────────────────────────────

function RoboticsEvents() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: '#faf7f0',
        paddingTop: 'clamp(60px, 8vw, 100px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
      }}
      aria-label="Robotics Club events"
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="mb-12 md:mb-14">
          <span
            className="inline-flex items-center gap-2 font-mono text-[0.62rem] font-bold tracking-[0.26em] uppercase mb-5 block"
            style={{ color: '#01741f' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden />
            Events
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="font-sans font-black tracking-tighter-2 leading-[1.04]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#0f0f0f' }}
            >
              Our Flagship{' '}
              <span className="font-display italic font-medium" style={{ color: '#c9a84c' }}>Events</span>
            </h2>
            <p className="font-sans text-[0.85rem] max-w-[320px]" style={{ color: '#9d9b94' }}>
              Academic Year 2026–2027 · Tentative schedule subject to change
            </p>
          </div>
        </div>

        {/* Editorial event layout: 1 large + 2 smaller */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-5">
          {/* Featured event — left */}
          {roboticsClub.events[0] && (
            <a
              href={roboticsClub.events[0].instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${roboticsClub.events[0].name} — view on Instagram`}
              className="group relative overflow-hidden rounded-2xl block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              style={{ height: 'clamp(320px, 40vw, 520px)' }}
              onMouseEnter={() => setHoveredIdx(0)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <Image
                src={roboticsClub.events[0].image}
                alt={roboticsClub.events[0].name}
                fill
                quality={80}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700"
                style={{ transform: hoveredIdx === 0 ? 'scale(1.04)' : 'scale(1)' }}
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.30) 50%, transparent 100%)',
                  opacity: hoveredIdx === 0 ? 1 : 0.75,
                }}
                aria-hidden="true"
              />
              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-[1]">
                <span
                  className="inline-block px-2.5 py-1 rounded-full font-mono text-[0.54rem] font-bold tracking-[0.14em] uppercase mb-3 text-white"
                  style={{ backgroundColor: '#e85d04' }}
                >
                  {roboticsClub.events[0].type}
                </span>
                <h3 className="font-sans font-black text-white mb-1" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}>
                  {roboticsClub.events[0].name}
                </h3>
                <p className="text-white/60 font-sans text-[0.82rem] mb-3 leading-relaxed max-w-[380px]"
                  style={{ opacity: hoveredIdx === 0 ? 1 : 0, transition: 'opacity 0.4s ease' }}
                >
                  {roboticsClub.events[0].desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.62rem] font-bold tracking-wide text-white/40 uppercase">
                    {roboticsClub.events[0].date}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 font-sans text-[0.76rem] font-bold text-white transition-opacity duration-300"
                    style={{ opacity: hoveredIdx === 0 ? 1 : 0 }}
                  >
                    View Event <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                  </span>
                </div>
              </div>
            </a>
          )}

          {/* Right column — 2 smaller events */}
          <div className="flex flex-col gap-5">
            {roboticsClub.events.slice(1).map((event, idx) => {
              const actualIdx = idx + 1;
              return (
                <a
                  key={event.name}
                  href={event.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${event.name} — view on Instagram`}
                  className="group relative overflow-hidden rounded-2xl block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 flex-1"
                  style={{ minHeight: 'clamp(140px, 18vw, 245px)' }}
                  onMouseEnter={() => setHoveredIdx(actualIdx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700"
                    style={{ transform: hoveredIdx === actualIdx ? 'scale(1.05)' : 'scale(1)' }}
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(to top, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.20) 60%, transparent 100%)',
                      opacity: hoveredIdx === actualIdx ? 1 : 0.7,
                    }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 z-[1]">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full font-mono text-[0.5rem] font-bold tracking-[0.14em] uppercase mb-2 text-white"
                      style={{ backgroundColor: idx === 0 ? '#01741f' : '#1e3a5f' }}
                    >
                      {event.type}
                    </span>
                    <h3 className="font-sans font-black text-white mb-0.5" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.3rem)' }}>
                      {event.name}
                    </h3>
                    <p
                      className="text-white/55 font-sans text-[0.75rem] leading-snug mb-2 max-w-[260px]"
                      style={{ opacity: hoveredIdx === actualIdx ? 1 : 0, transition: 'opacity 0.35s ease' }}
                    >
                      {event.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.56rem] font-bold tracking-wide text-white/35 uppercase">
                        {event.date}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 font-sans text-[0.7rem] font-bold text-white transition-opacity duration-300"
                        style={{ opacity: hoveredIdx === actualIdx ? 1 : 0 }}
                      >
                        View <ArrowUpRight className="w-3 h-3" aria-hidden />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Memory Lane ──────────────────────────────────────────────────────────────

const CARD_W = 300;
const CARD_H = 360;
const CARD_GAP = 20;
const STEP_MS = 520;
const DELAY_MS = 1400;

const MEMORY_CAPTIONS = [
  'Building together.\nLearning by doing.',
  'Every circuit.\nEvery competition.',
  'Ideas become\ninventions here.',
  'Late nights.\nBreakthrough moments.',
  'Engineering\nas a team sport.',
  'Real problems.\nReal solutions.',
  'Where students\nbecome engineers.',
  'One build at\na time.',
];

function RoboticsMemoryLane() {
  const items = roboticsClub.memoryLane;
  const N = items.length;
  const tripled = [...items, ...items, ...items];

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(N);
  const [activeIdx, setActiveIdx] = useState(N);
  const isPaused = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResetting = useRef(false);

  const getOffset = useCallback((idx: number) => {
    const w = containerRef.current?.clientWidth ?? window.innerWidth;
    return idx * (CARD_W + CARD_GAP) - w / 2 + CARD_W / 2;
  }, []);

  const applyTransform = useCallback((offset: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate
      ? `transform ${STEP_MS}ms cubic-bezier(0.25,0.46,0.45,0.94)`
      : 'none';
    track.style.transform = `translateX(${-offset}px)`;
  }, []);

  const goTo = useCallback((idx: number, animate: boolean) => {
    idxRef.current = idx;
    setActiveIdx(idx);
    applyTransform(getOffset(idx), animate);
  }, [applyTransform, getOffset]);

  const advance = useCallback((dir: 1 | -1 = 1) => {
    if (isResetting.current) return;
    const next = idxRef.current + dir;
    goTo(next, true);
    if (next >= N * 2) {
      isResetting.current = true;
      setTimeout(() => { goTo(next - N, false); isResetting.current = false; }, STEP_MS + 50);
    } else if (next < N) {
      isResetting.current = true;
      setTimeout(() => { goTo(next + N, false); isResetting.current = false; }, STEP_MS + 50);
    }
  }, [goTo, N]);

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isPaused.current) { advance(1); scheduleNext(); }
    }, DELAY_MS);
  }, [advance]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      goTo(N, false);
      scheduleNext();
    });
    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [goTo, scheduleNext, N]);

  const pause = () => { isPaused.current = true; if (timerRef.current) clearTimeout(timerRef.current); };
  const resume = () => { isPaused.current = false; scheduleNext(); };

  const handlePrev = () => { pause(); advance(-1); resume(); };
  const handleNext = () => { pause(); advance(1); resume(); };

  // Active index in the canonical items array
  const canonicalIdx = ((activeIdx % N) + N) % N;
  const caption = MEMORY_CAPTIONS[canonicalIdx % MEMORY_CAPTIONS.length];
  const captionLines = caption.split('\n');

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        backgroundColor: '#0c0c0e',
        paddingTop: 'clamp(60px, 8vw, 100px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
      }}
      aria-label="Club Memory Lane"
    >
      {/* Header */}
      <div className="mx-auto px-6 md:px-10 lg:px-16 mb-12" style={{ maxWidth: '1200px' }}>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span
              className="inline-flex items-center gap-2 font-mono text-[0.62rem] font-bold tracking-[0.26em] uppercase mb-4 block"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c9a84c' }} aria-hidden />
              Memory Lane
            </span>
            <h2
              className="font-sans font-black tracking-tighter-2 leading-[1.04] text-white"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Built together.{' '}
              <span className="font-display italic font-medium" style={{ color: '#c9a84c' }}>
                Remembered always.
              </span>
            </h2>
          </div>

          {/* Caption — synced to active card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={canonicalIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
              className="text-right"
              aria-live="polite"
              aria-atomic="true"
            >
              {captionLines.map((line, i) => (
                <p
                  key={i}
                  className="font-display italic"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.35rem)', color: i === 0 ? '#ffffff' : '#c9a84c', lineHeight: 1.25 }}
                >
                  {line}
                </p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        role="region"
        aria-label="Memory Lane photo carousel"
        className="relative overflow-hidden"
        style={{ height: `${CARD_H + 32}px` }}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
      >
        <div
          ref={trackRef}
          className="absolute top-4 flex"
          style={{ gap: `${CARD_GAP}px`, left: 0, willChange: 'transform' }}
        >
          {tripled.map((item, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={`${item.id}-${i}`}
                aria-hidden={i < N || i >= N * 2}
                className="shrink-0 overflow-hidden"
                style={{
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  borderRadius: '12px',
                  transition: `transform ${STEP_MS}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${STEP_MS}ms ease`,
                  transform: isActive ? 'scale(1.04)' : 'scale(0.95)',
                  opacity: isActive ? 1 : 0.45,
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    quality={80}
                    sizes={`${CARD_W}px`}
                    className="object-cover object-center"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto px-6 md:px-10 lg:px-16 mt-8 flex items-center justify-end gap-3" style={{ maxWidth: '1200px' }}>
        <button
          onClick={handlePrev}
          aria-label="Previous memory"
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.6)' }}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next memory"
          className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.6)' }}
        >
          <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
        <span className="font-mono text-[0.58rem] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {String(canonicalIdx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────

function RoboticsFooterCTA() {
  return (
    <section
      className="w-full"
      style={{
        backgroundColor: '#faf7f0',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
      aria-label="Connect with the Robotics Club"
    >
      <div className="mx-auto px-6 md:px-10 lg:px-16 text-center" style={{ maxWidth: '860px' }}>
        <span
          className="inline-flex items-center gap-2 font-mono text-[0.62rem] font-bold tracking-[0.26em] uppercase mb-6"
          style={{ color: '#01741f' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden />
          Connect with us
        </span>

        <h2
          className="font-sans font-black tracking-tighter-2 leading-[1.04] mb-6"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)', color: '#0f0f0f' }}
        >
          Curious about{' '}
          <span className="font-display italic font-medium" style={{ color: '#c9a84c' }}>
            Robotics?
          </span>
        </h2>

        <p
          className="font-sans leading-relaxed mb-10 mx-auto"
          style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)', color: '#5e5d57', maxWidth: 500 }}
        >
          Join a club meeting, follow us on Instagram, or walk up to the ECE labs. Everyone is welcome — first year or final year.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Robotics Club on Instagram (opens in new tab)"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans font-bold text-[0.9rem] text-white transition-all duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 group"
            style={{ backgroundColor: '#0c0c0e' }}
          >
            Instagram
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </a>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Robotics Club on LinkedIn (opens in new tab)"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans font-bold text-[0.9rem] border transition-colors duration-300 hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 group"
            style={{ borderColor: 'rgba(15,15,15,0.2)', color: '#0f0f0f' }}
          >
            LinkedIn
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </a>

          <Link
            href="/campus/clubs"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sans font-bold text-[0.9rem] border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            style={{ borderColor: 'rgba(15,15,15,0.15)', color: '#5e5d57' }}
          >
            All Clubs &amp; Societies
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function RoboticsClubPage() {
  return (
    <div style={{ backgroundColor: '#faf7f0' }}>
      <RoboticsHero />
      <RoboticsAbout />
      <RoboticsActivities />
      <RoboticsEvents />
      <RoboticsMemoryLane />
      <RoboticsFooterCTA />
    </div>
  );
}
