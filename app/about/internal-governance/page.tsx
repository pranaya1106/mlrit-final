'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import AboutQuickNav from '@/components/AboutQuickNav';
import PageHeader from '@/components/PageHeader';
import LeaderScrollStack, { LeaderStackItem } from '@/components/LeaderScrollStack';

// ─── Leadership data ──────────────────────────────────────────────────────────
// videoUrl: set to an actual local /videos/… or external URL when the asset is
// available. Leave undefined to suppress the play button entirely — never show
// a play button for a non-existent video.

type Leader = {
  tag: string;
  name: string;
  role: string;
  img: string;
  message: string;
  accent: string;
  videoUrl?: string;
};

const LEADERS: Leader[] = [
  {
    tag: 'Principal',
    name: 'Dr. S.V.S. Prasad',
    role: 'Principal, MLR Institute of Technology',
    img: '/faculty-new/ece/ece-s-v-s-prasad.jpg',
    message:
      'Excellence is not an act but a habit — and at MLRIT, we cultivate that habit every single day. Through rigorous academics, industry exposure, and a culture of discipline and ambition, we prepare our students to excel in competitive environments and lead with integrity wherever their careers take them.',
    accent: '#e85d04',
    // videoUrl: '/videos/principal-message.mp4',
  },
  {
    tag: 'Director',
    name: 'Dr. V. Radhika Devi',
    role: 'Director, MLR Institute of Technology',
    img: '/images/governance/director-v-radhika-devi-hq.jpg',
    message:
      'At MLRIT, we are committed to nurturing not just engineers but complete human beings — individuals who are technically sound, ethically grounded, and socially responsible. Our focus on continuous learning, research, and innovation ensures that every student leaves our campus ready to make a meaningful contribution to the world.',
    accent: '#01741f',
    // videoUrl: '/videos/director-message.mp4',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

// ─── Video modal ──────────────────────────────────────────────────────────────

type VideoModalProps = {
  leader: Leader;
  onClose: () => void;
};

function LeaderVideoModal({ leader, onClose }: VideoModalProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => {
      setVisible(true);
      videoRef.current?.play().catch(() => {});
    }, 16);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${leader.tag}'s message video`}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12"
      style={{
        transition: 'opacity 0.26s ease, backdrop-filter 0.26s ease',
        opacity: visible ? 1 : 0,
        backdropFilter: visible ? 'blur(20px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(20px)' : 'blur(0px)',
        background: visible ? 'rgba(8,8,14,0.78)' : 'rgba(8,8,14,0)',
        pointerEvents: visible ? 'all' : 'none',
      }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.26s ease',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(28px)',
          opacity: visible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-colors backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close video"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          src={leader.videoUrl}
          playsInline
          controls
          className="w-full aspect-video bg-black block"
          style={{ display: 'block' }}
        >
          Your browser does not support HTML5 video.
        </video>

        {/* Name bar */}
        <div
          className="px-7 py-5 flex items-center gap-4"
          style={{ background: '#fff', borderTop: `3px solid ${leader.accent}` }}
        >
          <div>
            <span
              className="font-mono text-[0.58rem] font-bold tracking-[0.2em] uppercase"
              style={{ color: leader.accent }}
            >
              {leader.tag}
            </span>
            <p className="mt-0.5 font-sans font-black text-foreground text-[1.05rem] tracking-tight">
              {leader.name}
            </p>
            <p className="font-mono text-[0.7rem] text-muted">{leader.role}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Leader card ──────────────────────────────────────────────────────────────

function LeaderCard({ leader, index, total }: { leader: Leader; index: number; total: number }) {
  const [videoOpen, setVideoOpen] = React.useState(false);
  const [imgHovered, setImgHovered] = React.useState(false);

  return (
    <>
      {/* Outer wrapper — no transforms here so stack positioning stays stable */}
      <div
        className="rounded-2xl overflow-hidden bg-white border border-border shadow-card-soft"
        style={{ borderTop: `3px solid ${leader.accent}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[clamp(280px,35%,420px)_1fr]">
          {/* ── Portrait column ──────────────────────────────── */}
          <div
            className="relative overflow-hidden"
            style={{ minHeight: 'clamp(240px,40vw,420px)' }}
            onMouseEnter={() => setImgHovered(true)}
            onMouseLeave={() => setImgHovered(false)}
          >
            {/* Photo */}
            <img
              src={leader.img}
              alt={leader.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{ transform: imgHovered ? 'scale(1.04)' : 'scale(1)' }}
            />

            {/* Bottom gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
              style={{ transition: 'opacity 0.4s ease', opacity: imgHovered ? 0.85 : 1 }}
            />

            {/* Counter badge */}
            <span className="absolute top-4 right-4 font-mono text-[0.56rem] text-white/80 tracking-widest bg-black/35 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>

            {/* Play button — only shown when a real video exists */}
            {leader.videoUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="absolute inset-0 flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`Play ${leader.tag}'s message`}
                style={{ pointerEvents: 'all' }}
              >
                <span
                  className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white/70 bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/65 group-hover:scale-110 group-focus-visible:scale-110"
                >
                  <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden>
                    <path d="M2 2l18 11L2 24V2z" fill="white" />
                  </svg>
                </span>
              </button>
            )}

            {/* Name overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10 pointer-events-none">
              <span
                className="font-mono text-[0.58rem] font-bold tracking-[0.22em] uppercase"
                style={{ color: leader.accent }}
              >
                {leader.tag}
              </span>
              <h3 className="mt-1 font-sans font-black text-white text-[clamp(1.15rem,2vw,1.55rem)] leading-snug tracking-tight drop-shadow-sm">
                {leader.name}
              </h3>
            </div>
          </div>

          {/* ── Message column ───────────────────────────────── */}
          <div className="flex flex-col justify-between p-7 md:p-10">
            <div>
              <p className="font-mono text-[0.68rem] text-muted tracking-wide">
                {leader.role}
              </p>

              <div className="my-6 h-px bg-border" />

              <blockquote className="pl-5 border-l-[3px]" style={{ borderColor: leader.accent }}>
                <p className="font-display italic text-[clamp(1rem,1.4vw,1.15rem)] text-foreground/80 leading-[1.8]">
                  &ldquo;{leader.message}&rdquo;
                </p>
              </blockquote>

              {/* Play text link — secondary affordance on mobile/touch */}
              {leader.videoUrl && (
                <button
                  onClick={() => setVideoOpen(true)}
                  className="mt-7 inline-flex items-center gap-2.5 font-mono text-[0.72rem] font-bold tracking-[0.14em] uppercase transition-opacity hover:opacity-70 focus:outline-none focus-visible:underline"
                  style={{ color: leader.accent }}
                  aria-label={`Play ${leader.tag}'s message video`}
                >
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border"
                    style={{ borderColor: leader.accent }}
                  >
                    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden>
                      <path d="M1 1l6 4-6 4V1z" fill="currentColor" />
                    </svg>
                  </span>
                  Play Message
                </button>
              )}
            </div>

            <div className="mt-8 h-0.5 w-12 rounded-full" style={{ background: leader.accent }} />
          </div>
        </div>
      </div>

      {videoOpen && <LeaderVideoModal leader={leader} onClose={() => setVideoOpen(false)} />}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InternalGovernancePage() {
  return (
    <>
      <PageHeader
        eyebrow="About MLRIT"
        title="Internal"
        italic="Governance."
        dek="The leadership team and institutional governance structure of MLR Institute of Technology."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Internal Governance' },
        ]}
        variant="green"
      />

      <AboutQuickNav active="/about/internal-governance" />

      <section className="bg-[#f7f5f0] py-14 md:py-20">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <div className="mb-4">
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              Leadership
            </span>
            <h2
              className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]"
            >
              Director &amp;{' '}
              <span className="font-display italic font-medium" style={gradientText}>
                Principal.
              </span>
            </h2>
            <p className="mt-3 text-muted text-[1rem] leading-relaxed max-w-[520px]">
              The people who lead and shape MLR Institute of Technology.
            </p>
          </div>
        </div>

        <div className="w-full px-6 md:px-10 lg:px-12">
          <LeaderScrollStack
            itemDistance={80}
            itemScale={0.025}
            itemStackDistance={22}
            stackPosition="16%"
            scaleEndPosition="8%"
            baseScale={0.93}
            bottomSpace="18vh"
          >
            {LEADERS.map((l, i) => (
              <LeaderStackItem key={l.name}>
                <LeaderCard leader={l} index={i} total={LEADERS.length} />
              </LeaderStackItem>
            ))}
          </LeaderScrollStack>
        </div>
      </section>
    </>
  );
}
