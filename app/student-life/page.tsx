import Image from 'next/image';
import type { Metadata } from 'next';
import MemoryLane from './MemoryLane';
import CurvedLoopText from './CurvedLoopText';
import { MEMORY_LANE_ITEMS } from './data';

export const metadata: Metadata = {
  title: 'Student Life | MLR Institute of Technology',
  description:
    'Life at MLRIT goes far beyond academics — shared moments, lasting friendships, and a campus that becomes home.',
};

const STATS = [
  { value: '20+', label: 'Student Clubs' },
  { value: '5000+', label: 'Students' },
  { value: '30+', label: 'Annual Events' },
  { value: '18+', label: 'Sports Teams' },
];

export default function StudentLifeOverviewPage() {
  return (
    <>
      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: '#090909',
          height: 'clamp(480px, 54.375vw, 900px)',
        }}
        aria-label="Student Life at MLRIT"
      >
        <Image
          src="/images/student-life/hero.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
          style={{ borderRadius: 0 }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(to right, rgba(9,9,9,0.72) 0%, rgba(9,9,9,0.38) 50%, rgba(9,9,9,0.10) 100%)',
          }}
        />

        <div
          className="absolute inset-x-0 z-[2]"
          style={{ top: 'calc(-11.11vw + 10vw)' }}
        >
          <CurvedLoopText
            text="A lifetime of memories"
            fontSize={160}
            fontWeight="600"
            letterSpacing="-2px"
            color="#ffffff"
            baseVelocity={80}
            curveAmount={0}
            direction={-1}
          />
        </div>

        <p
          className="absolute z-[3] text-white font-sans"
          style={{
            left: 'clamp(20px, 3.96vw, 57px)',
            bottom: 'clamp(20px, 12.6%, 99px)',
            fontSize: 'clamp(0.8rem, 1.67vw, 1.5rem)',
            lineHeight: 1.45,
            maxWidth: 'clamp(180px, 23.96vw, 345px)',
          }}
        >
          &ldquo;Where everything falls right in place with time and people&rdquo;
        </p>
      </section>

      {/* ─── MEMORY LANE ──────────────────────────────────────────────────── */}
      <MemoryLane items={MEMORY_LANE_ITEMS} />

      {/* ─── STATS ────────────────────────────────────────────────────────── */}
      <section
        className="w-full py-16 md:py-20"
        style={{ backgroundColor: '#090909' }}
        aria-label="Student life at a glance"
      >
        {/* Heading block */}
        <div className="text-center px-6 mb-12 md:mb-16">
          <h2 className="text-white font-sans font-semibold" style={{ fontSize: 'clamp(1.5rem, 2.78vw, 2.5rem)', lineHeight: 1.25 }}>
            Welcome to Student Life<br />
            at <em className="font-display italic not-italic" style={{ fontStyle: 'italic' }}>MLR Institute of Technology</em>
          </h2>
          <p className="mt-3 text-neutral-400 font-sans" style={{ fontSize: 'clamp(0.875rem, 1.11vw, 1rem)' }}>
            Where learning meets living — every day on campus
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-8 md:px-12 py-4"
              style={{
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                minWidth: 'clamp(140px, 18vw, 220px)',
              }}
            >
              <span
                className="font-display italic"
                style={{
                  fontSize: 'clamp(2.5rem, 5.56vw, 5rem)',
                  lineHeight: 1,
                  color: '#c9a84c',
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </span>
              <span
                className="mt-2 text-white font-sans text-center"
                style={{ fontSize: 'clamp(0.8rem, 1vw, 0.9rem)', letterSpacing: '0.02em' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CELEBRATE CAMPUS ENGAGEMENTS ─────────────────────────────────── */}
      <section
        className="w-full py-10 md:py-14"
        style={{ backgroundColor: '#090909' }}
        aria-label="Campus Engagements"
      >
        <div className="mx-auto px-4 md:px-10" style={{ maxWidth: '1360px' }}>
          {/* Full-width rounded image */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              borderRadius: '16px',
              height: 'clamp(260px, 34.72vw, 500px)',
            }}
          >
            <Image
              src="/images/student-life/hero.jpg"
              alt="Students celebrating on campus"
              fill
              quality={85}
              sizes="(max-width: 1360px) 100vw, 1360px"
              className="object-cover object-center"
            />
          </div>

          {/* Two-column text row */}
          <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-0">
            {/* Left: heading */}
            <div className="md:w-1/2 md:pr-12">
              <h2
                className="text-white font-sans font-semibold"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', lineHeight: 1.2 }}
              >
                Celebrate Campus
              </h2>
              <span
                className="font-display italic"
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  lineHeight: 1.2,
                  color: '#c9a84c',
                  display: 'block',
                }}
              >
                Engagements
              </span>
            </div>

            {/* Right: body copy */}
            <div className="md:w-1/2">
              <p
                className="text-neutral-300 font-sans leading-relaxed"
                style={{ fontSize: 'clamp(0.875rem, 1.11vw, 1rem)' }}
              >
                Dive into campus clubs, cultural fests, sports leagues, and academic competitions that spark growth and lasting memories. At MLRIT, every event is a chance to discover your passion, build your network, and create experiences that stay with you long after graduation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
