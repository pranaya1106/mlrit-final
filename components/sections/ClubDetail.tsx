'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Users, UserRound, GraduationCap, Pause, Play, Instagram, Linkedin } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import { CATEGORY_ACCENT, type Club, type ClubEvent, type ClubMemoryImage } from '@/lib/clubs';

// ─── Shared section-header bits — same pattern used across the clubs pages ────

function Eyebrow({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] font-bold tracking-[0.26em] uppercase text-secondary">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent ?? 'currentColor' }} aria-hidden />
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-sans font-black tracking-tighter-2 leading-[1.04] text-white"
      style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.8rem)' }}
    >
      {children}
    </h2>
  );
}

// ─── About — What / Why / What we do ───────────────────────────────────────────

function AboutSection({ club }: { club: Club }) {
  if (!club.about) {
    return (
      <section className="bg-ink">
        <div className="w-full px-6 md:px-10 lg:px-16 max-w-[900px] mx-auto py-16 md:py-24">
          <Reveal><Eyebrow>About the club</Eyebrow></Reveal>
          <Reveal delay={0.05} className="mt-4">
            <p className="text-white/70 leading-relaxed" style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.3rem)' }}>
              {club.description}
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ink">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[900px] mx-auto py-16 md:py-24">
        <Reveal><Eyebrow>About the club</Eyebrow></Reveal>

        {club.tagline && (
          <Reveal delay={0.03} className="mt-5">
            <p
              className="font-display italic font-medium text-warm leading-snug"
              style={{ fontSize: 'clamp(1.3rem, 2vw, 1.7rem)' }}
            >
              “{club.tagline}”
            </p>
          </Reveal>
        )}

        <Reveal delay={0.05} className="mt-6">
          <h3 className="font-sans font-extrabold text-white text-[1.15rem] mb-2">What is {club.shortName}?</h3>
          <p className="text-white/70 leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)' }}>
            {club.about.what}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <h3 className="font-sans font-extrabold text-white text-[1.15rem] mb-2">Why {club.shortName}?</h3>
          <p className="text-white/70 leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)' }}>
            {club.about.why}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 pt-10 border-t border-white/10">
          <h3 className="font-sans font-extrabold text-white text-[1.15rem] mb-6">What do they do?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {club.about.activities.map((a, i) => (
              <Reveal key={a.title} delay={0.05 * i}>
                <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: '#16161a' }}>
                  <h4 className="font-sans font-bold text-white text-[0.95rem] mb-1.5">{a.title}</h4>
                  <p className="text-white/50 text-[0.85rem] leading-relaxed">{a.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {club.about.recognition && (
          <Reveal delay={0.2} className="mt-14 pt-10 border-t border-white/10">
            <h3 className="font-sans font-extrabold text-white text-[1.15rem] mb-2">Achievements &amp; recognition</h3>
            <p className="text-white/70 leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)' }}>
              {club.about.recognition}
            </p>
          </Reveal>
        )}

        {(club.instagramUrl || club.linkedinUrl) && (
          <Reveal delay={0.25} className="mt-10 flex items-center gap-4">
            {club.instagramUrl && (
              <a
                href={club.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${club.shortName} on Instagram`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/14 text-white/60 hover:text-white hover:border-white/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Instagram className="w-4 h-4" aria-hidden />
              </a>
            )}
            {club.linkedinUrl && (
              <a
                href={club.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${club.shortName} on LinkedIn`}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/14 text-white/60 hover:text-white hover:border-white/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Linkedin className="w-4 h-4" aria-hidden />
              </a>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ─── Event posters — placeholder artwork, hover reveals what the event was ───

function EventPosterTile({ ev }: { ev: ClubEvent }) {
  const content = (
    <>
      {/* Base face — real poster art if we have it, otherwise a placeholder */}
      {ev.posterImage ? (
        <>
          <Image
            src={ev.posterImage}
            alt={`${ev.title} poster`}
            fill
            className="object-contain"
            sizes="360px"
            quality={85}
          />
          {/* Instagram's own preview crop cuts text close to the edges — a soft
              vignette fades that into black so it reads as intentional framing
              rather than a hard slice, until real poster files replace this. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                'linear-gradient(90deg, rgba(5,5,5,0.97) 0%, transparent 26%, transparent 74%, rgba(5,5,5,0.97) 100%)',
                'linear-gradient(180deg, rgba(5,5,5,0.97) 0%, transparent 26%, transparent 74%, rgba(5,5,5,0.97) 100%)',
              ].join(', '),
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {ev.tag && (
            <span className="font-mono text-[0.56rem] font-bold tracking-[0.16em] uppercase text-white/50 mb-3">
              {ev.tag}
            </span>
          )}
          <h4 className="font-sans font-black text-white leading-tight text-[1.05rem]">
            {ev.title}
          </h4>
          {ev.link ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.5rem] font-bold tracking-[0.14em] uppercase text-white/35 mt-4">
              <Instagram className="w-3 h-3" aria-hidden />
              View post
            </span>
          ) : (
            <span className="font-mono text-[0.5rem] font-bold tracking-[0.14em] uppercase text-white/25 mt-4">
              Sample poster
            </span>
          )}
        </div>
      )}

      {/* Always-visible corner badge — signals the real poster links out */}
      {ev.link && ev.posterImage && (
        <span
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-white z-10"
          style={{ backgroundColor: 'rgba(12,12,14,0.72)', backdropFilter: 'blur(6px)' }}
        >
          <Instagram className="w-3.5 h-3.5" aria-hidden />
        </span>
      )}

      {/* Hover overlay — event info */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(180deg, rgba(12,12,14,0) 0%, rgba(12,12,14,0.92) 60%, rgba(12,12,14,0.98) 100%)' }}
      >
        {ev.tag && (
          <span className="font-mono text-[0.56rem] font-bold tracking-[0.14em] uppercase text-white/45 mb-1.5">
            {ev.tag}
          </span>
        )}
        <h4 className="font-sans font-extrabold text-white text-[0.95rem] mb-1.5 leading-snug">
          {ev.title}
        </h4>
        <p className="text-white/65 text-[0.78rem] leading-relaxed">{ev.blurb}</p>
        {ev.link && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] font-bold tracking-[0.12em] uppercase text-white/50 mt-2.5">
            <Instagram className="w-3.5 h-3.5" aria-hidden />
            View on Instagram
          </span>
        )}
      </div>
    </>
  );

  const className = "group relative block rounded-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-white";
  const style = ev.posterImage
    ? { aspectRatio: '3 / 4', backgroundColor: '#050505' }
    : { aspectRatio: '3 / 4', background: ev.posterGradient };

  if (ev.link) {
    return (
      <a href={ev.link} target="_blank" rel="noopener noreferrer" className={className} style={style} aria-label={`${ev.title} — view post on Instagram`}>
        {content}
      </a>
    );
  }
  return (
    <div className={className} style={style} tabIndex={0}>
      {content}
    </div>
  );
}

function EventPosters({ club }: { club: Club }) {
  if (!club.events?.length) return null;
  const hasRealArt = club.events.some((ev) => ev.posterImage);
  const hasRealLinks = club.events.some((ev) => ev.link);
  return (
    <section className="bg-ink border-t border-white/06">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1320px] mx-auto py-16 md:py-24">
        <Reveal preset="right" className="mb-3"><Eyebrow>Event posters</Eyebrow></Reveal>
        <Reveal delay={0.05} className="mb-2">
          <SectionHeading>
            On the <span className="font-display italic font-medium text-warm">floor</span>
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.08} className="mb-10">
          <p className="text-white/40 text-[0.85rem]">
            {hasRealArt
              ? 'Hover a poster for details, or click through to the real recap.'
              : hasRealLinks
                ? 'Placeholder artwork for now — hover a poster for details, or click through to the real recap.'
                : 'Sample posters for now — real event artwork drops in here soon. Hover a poster for details.'}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {club.events.map((ev, i) => (
            <Reveal key={ev.id} delay={0.05 * i}>
              <EventPosterTile ev={ev} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Memory lane — Purdue-style continuous horizontal photo marquee ──────────

// Cycled tile widths so the strip reads as a mosaic of different photo shapes,
// not a uniform grid — matches the varied-width tiles in the reference design.
const MARQUEE_TILE_WIDTHS = [260, 200, 320, 230, 280, 210, 300, 240];
const MARQUEE_TILE_HEIGHT = 168;

function MarqueeRow({
  images,
  reverse,
  duration,
  paused,
}: {
  images: ClubMemoryImage[];
  reverse: boolean;
  duration: number;
  paused: boolean;
}) {
  // Doubled so translateX(-50%) loops seamlessly with no visible seam.
  const tiles = [...images, ...images];
  return (
    <div className="overflow-hidden">
      <div
        className="marquee-track flex gap-3 w-max"
        style={{
          animationName: 'marquee-x',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {tiles.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ height: MARQUEE_TILE_HEIGHT, width: MARQUEE_TILE_WIDTHS[i % MARQUEE_TILE_WIDTHS.length] }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="320px"
              quality={68}
              loading={i < images.length ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryLane({ images, clubShortName }: { images: ClubMemoryImage[]; clubShortName: string }) {
  const [paused, setPaused] = useState(false);
  if (images.length === 0) return null;

  const rowA = images;
  const rowB = [...images].reverse();

  return (
    <section className="bg-ink border-t border-white/06">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1320px] mx-auto py-16 md:py-24">
        <Reveal preset="right" className="mb-3"><Eyebrow>Memory lane</Eyebrow></Reveal>
        <Reveal delay={0.05} className="mb-10">
          <SectionHeading>
            Moments from <span className="font-display italic font-medium text-warm">{clubShortName}</span>
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative rounded-2xl overflow-hidden py-1" style={{ backgroundColor: '#000' }}>
            <div className="flex flex-col gap-3">
              <MarqueeRow images={rowA} reverse={false} duration={34} paused={paused} />
              {rowB.length > 1 && <MarqueeRow images={rowB} reverse duration={40} paused={paused} />}
            </div>

            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play memory lane' : 'Pause memory lane'}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors z-10 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              style={{ backgroundColor: 'rgba(12,12,14,0.7)', backdropFilter: 'blur(6px)' }}
            >
              {paused ? <Play className="w-4 h-4" aria-hidden /> : <Pause className="w-4 h-4" aria-hidden />}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Built-tool showcase — e.g. CodeStats ──────────────────────────────────────

function BuiltToolSection({ club }: { club: Club }) {
  const tool = club.builtTool;
  if (!tool) return null;

  return (
    <section className="border-t border-white/06" style={{ backgroundColor: '#16161a' }}>
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1100px] mx-auto py-16 md:py-24">
        <Reveal preset="right" className="mb-3">
          <Eyebrow>Built by {club.shortName}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <SectionHeading>
            {tool.name}{' '}
            <span className="font-display italic font-medium text-warm">{tool.tagline}</span>
          </SectionHeading>
        </Reveal>

        <Reveal delay={0.1} className="mt-6 max-w-[720px]">
          <p className="text-white/65 leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)' }}>
            {tool.description}
          </p>
        </Reveal>

        {tool.stats && tool.stats.length > 0 && (
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
            {tool.stats.map((s) => (
              <div key={s.label}>
                <div className="font-sans font-black text-white text-[1.6rem] leading-none">{s.value}</div>
                <div className="font-mono text-[0.62rem] font-bold tracking-[0.14em] uppercase text-white/40 mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        )}

        <Reveal delay={0.2} className="mt-10">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-sans font-bold text-[0.9rem] text-white transition-colors hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{ backgroundColor: CATEGORY_ACCENT[club.category] }}
          >
            Visit {tool.name}
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Floating "Join" CTA — persistent, bottom-right ────────────────────────────

function JoinFloatingButton({ url, external, clubShortName }: { url: string; external: boolean; clubShortName: string }) {
  return (
    <a
      href={url}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="fixed z-40 inline-flex items-center gap-2 rounded-full font-sans font-bold text-black text-[0.85rem] px-5 py-3.5 transition-transform hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      style={{
        right: '1.5rem',
        bottom: '1.5rem',
        background: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      }}
    >
      Join {clubShortName}
      <ArrowUpRight className="w-4 h-4" aria-hidden />
    </a>
  );
}

// ─── Page root ──────────────────────────────────────────────────────────────

export default function ClubDetail({ club }: { club: Club }) {
  const accent = CATEGORY_ACCENT[club.category];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-ink overflow-hidden" style={{ height: 'min(560px, 68vh)' }}>
        <Image
          src={club.image}
          alt={club.name}
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
          quality={75}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(12,12,14,0.35) 0%, rgba(12,12,14,0.75) 55%, #0c0c0e 100%)' }}
        />

        {/* Club logo — small badge tucked in the top-right corner, with the
            member count sitting right below it */}
        {club.logo && (
          <div className="absolute z-10 top-5 right-5 md:top-7 md:right-8 flex flex-col items-end gap-2">
            <Reveal preset="fade" delay={0.6}>
              <Image
                src={club.logo}
                alt={`${club.name} logo`}
                width={1104}
                height={435}
                className="h-auto object-contain"
                style={{ width: 'clamp(100px, 13vw, 190px)' }}
              />
            </Reveal>
            {club.members && (
              <Reveal preset="fade" delay={0.7}>
                <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                  <Users className="w-4 h-4" aria-hidden style={{ color: accent }} />
                  {club.members} members
                </span>
              </Reveal>
            )}
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col w-full px-6 md:px-10 lg:px-16 max-w-[1320px] mx-auto py-8 md:py-12">
          <Reveal preset="right">
            <Link
              href="/campus/clubs"
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.18em] uppercase text-white/55 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
              All Clubs &amp; Societies
            </Link>
          </Reveal>

          <Reveal delay={0.05} className="mt-8">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full font-mono text-[0.6rem] font-bold tracking-[0.16em] uppercase text-white"
              style={{ backgroundColor: accent }}
            >
              {club.category}
            </span>
          </Reveal>

          {/* Title — centered in the hero. Grid columns are sized to each
              word's own content width, so "Club" (col 2, row 2) starts
              exactly where "SCOPE" (col 1, row 1) ends, one row below —
              mirrors the "We Build / Community." reference. */}
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-[max-content_max-content] overflow-hidden">
              <motion.h1
                initial={{ y: '-115%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, mass: 1, delay: 0.15 }}
                className="col-start-1 row-start-1 font-sans font-black tracking-tighter-2 leading-[0.94]"
                style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.2rem)', color: 'rgba(255,255,255,0.9)' }}
              >
                {club.shortName}
              </motion.h1>
              <motion.p
                initial={{ y: '115%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, mass: 1, delay: 0.42 }}
                className="col-start-2 row-start-2 font-display italic font-medium text-warm leading-[0.94]"
                style={{ fontSize: 'clamp(4.2rem, 10vw, 8.4rem)' }}
              >
                Club
              </motion.p>
            </div>
          </div>

          <Reveal delay={0.6} className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {club.members && !club.logo && (
              <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                <Users className="w-4 h-4" aria-hidden style={{ color: accent }} />
                {club.members} members
              </span>
            )}
            {club.facultyCoordinator && (
              <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                <GraduationCap className="w-4 h-4" aria-hidden style={{ color: accent }} />
                {club.facultyCoordinator}
              </span>
            )}
            {club.studentLead && (
              <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.1em] uppercase text-white/60">
                <UserRound className="w-4 h-4" aria-hidden style={{ color: accent }} />
                {club.studentLead}
              </span>
            )}
          </Reveal>
        </div>
      </section>

      <AboutSection club={club} />
      <EventPosters club={club} />
      {club.memoryLane && club.memoryLane.length > 0 && (
        <MemoryLane images={club.memoryLane} clubShortName={club.shortName} />
      )}
      <BuiltToolSection club={club} />

      {/* ── Closing CTA ── */}
      <section className="bg-ink border-t border-white/06">
        <div className="w-full px-6 md:px-10 lg:px-16 max-w-[900px] mx-auto py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <h2
                className="font-sans font-black tracking-tighter-2 leading-[1.05] text-white"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}
              >
                Want in?{' '}
                <span className="font-display italic font-medium text-warm">
                  Reach out to {club.shortName}.
                </span>
              </h2>
              <p className="mt-4 text-white/45 leading-relaxed max-w-[480px]">
                Drop by a session, follow the club on campus, or ask your student
                coordinator how to join.
              </p>
            </div>
            <Link
              href={club.joinUrl ?? '/student-life'}
              target={club.joinUrl ? '_blank' : undefined}
              rel={club.joinUrl ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border font-sans font-bold text-[0.9rem] text-white hover:bg-white/06 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white flex-shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.14)' }}
            >
              {club.joinUrl ? `Join ${club.shortName}` : 'Explore student life'}
              <ArrowUpRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <JoinFloatingButton
        url={club.joinUrl ?? '/student-life'}
        external={Boolean(club.joinUrl)}
        clubShortName={club.shortName}
      />
    </>
  );
}
