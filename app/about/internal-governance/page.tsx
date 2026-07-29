'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import AboutQuickNav from '@/components/AboutQuickNav';
import PageHeader from '@/components/PageHeader';
import LeaderScrollStack, { LeaderStackItem } from '@/components/LeaderScrollStack';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

const LEADERS = [
  {
    tag: 'Director',
    name: 'Dr. V. Radhika Devi',
    role: 'Director, MLR Institute of Technology',
    img: '/images/governance/director-v-radhika-devi-hq.jpg',
    message: 'At MLRIT, we are committed to nurturing not just engineers but complete human beings — individuals who are technically sound, ethically grounded, and socially responsible. Our focus on continuous learning, research, and innovation ensures that every student leaves our campus ready to make a meaningful contribution to the world.',
    accent: '#01741f',
  },
  {
    tag: 'Principal',
    name: 'Dr. S.V.S. Prasad',
    role: 'Principal, MLR Institute of Technology',
    img: '/faculty-new/ece/ece-s-v-s-prasad.jpg',
    message: 'Excellence is not an act but a habit — and at MLRIT, we cultivate that habit every single day. Through rigorous academics, industry exposure, and a culture of discipline and ambition, we prepare our students to excel in competitive environments and lead with integrity wherever their careers take them.',
    accent: '#e85d04',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

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
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="mb-4">
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Leadership</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Director &amp;{' '}
              <span className="font-display italic font-medium" style={gradientText}>Principal.</span>
            </h2>
            <p className="mt-3 text-muted text-[1rem] leading-relaxed max-w-[520px]">
              The people who lead and shape MLR Institute of Technology.
            </p>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <LeaderScrollStack
            itemDistance={60}
            itemScale={0.028}
            itemStackDistance={20}
            stackPosition="18%"
            scaleEndPosition="8%"
            baseScale={0.92}
            bottomSpace="10vh"
          >
            {LEADERS.map((l, i) => (
              <LeaderStackItem key={l.name}>
                <div
                  className="rounded-2xl overflow-hidden bg-white border border-border shadow-card-soft grid grid-cols-1 md:grid-cols-[320px_1fr]"
                  style={{ borderTop: `3px solid ${l.accent}` }}
                >
                  <div className="relative overflow-hidden" style={{ minHeight: '180px' }}>
                    <img
                      src={l.img}
                      alt={l.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 font-mono text-[0.58rem] text-white/80 tracking-widest bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {String(i + 1).padStart(2, '0')} / {String(LEADERS.length).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between p-6 md:p-7">
                    <div>
                      <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary">
                        {l.tag}
                      </span>
                      <h3 className="mt-2 font-sans font-black text-foreground text-[clamp(1.1rem,1.8vw,1.5rem)] leading-snug tracking-tight">
                        {l.name}
                      </h3>
                      <p className="mt-1 font-mono text-[0.7rem] text-muted tracking-wide">
                        {l.role}
                      </p>
                      <div className="my-5 h-px bg-border" />
                      <blockquote className="pl-4 border-l-2 border-primary">
                        <p className="font-display italic text-[0.98rem] text-foreground/72 leading-relaxed">
                          "{l.message}"
                        </p>
                      </blockquote>
                    </div>
                    <div className="mt-6 h-0.5 w-10 rounded-full" style={{ background: l.accent }} />
                  </div>
                </div>
              </LeaderStackItem>
            ))}
          </LeaderScrollStack>
        </div>
      </section>

      {/* ── DEPARTMENT HEADS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">Academic Leadership</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Department{' '}
              <span className="font-display italic font-medium" style={gradientText}>Heads.</span>
            </h2>
          </Reveal>

          <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.05}>
            {DEPT_HEADS.map((d) => (
              <StaggerItem key={d.name}>
                <HodCard d={d} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

type DeptHead = { dept: string; name: string; title: string; video?: string };

function HodModal({ d, onClose }: { d: DeptHead; onClose: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Animate in
    const t = setTimeout(() => setVisible(true), 10);
    // Play video
    videoRef.current?.play().catch(() => {});
    // Close on Escape
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      style={{
        transition: 'opacity 0.25s ease, backdrop-filter 0.25s ease',
        opacity: visible ? 1 : 0,
        backdropFilter: visible ? 'blur(18px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(18px)' : 'blur(0px)',
        background: visible ? 'rgba(10,10,18,0.72)' : 'rgba(10,10,18,0)',
      }}
      onClick={handleClose}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(24px)',
          opacity: visible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Video or placeholder */}
        {d.video ? (
          <video
            ref={videoRef}
            src={d.video}
            muted
            playsInline
            loop
            controls
            className="w-full aspect-video bg-black object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-ink-2 flex items-center justify-center">
            <p className="font-mono text-[0.75rem] text-white/40 tracking-widest uppercase">Video coming soon</p>
          </div>
        )}

        {/* Name bar */}
        <div className="bg-white px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-primary">{d.dept}</span>
            <p className="mt-0.5 font-sans font-black text-foreground text-[1.05rem] tracking-tight">{d.name}</p>
            <p className="font-mono text-[0.72rem] text-muted">{d.title}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function HodCard({ d }: { d: DeptHead }) {
  const [open, setOpen] = React.useState(false);
  const hoverTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setOpen(true), 180);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <>
      <div
        className="relative rounded-xl border border-border bg-white shadow-card-soft overflow-hidden hover:border-primary hover:-translate-y-0.5 transition-all cursor-pointer"
        style={{ height: '160px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <span className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-primary">{d.dept}</span>
          <p className="mt-1.5 font-sans font-bold text-foreground text-[0.95rem]">{d.name}</p>
          <p className="mt-0.5 font-mono text-[0.72rem] text-muted">{d.title}</p>
        </div>
        {/* Play hint */}
        {d.video && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden>
              <path d="M1 1l6 4-6 4V1z" fill="currentColor" className="text-primary"/>
            </svg>
          </div>
        )}
      </div>

      {open && <HodModal d={d} onClose={() => setOpen(false)} />}
    </>
  );
}

const DEPT_HEADS: DeptHead[] = [
  { dept: 'H&S',         name: 'Dr. CH Achi Reddy',           title: 'HOD — Humanities & Sciences',                   video: '/videos/hods/hod-hs.mp4' },
  { dept: 'Aeronautical', name: 'Mr. Sai Kumar',              title: 'I/C HOD — Aeronautical Engineering',            video: '/videos/hods/hod-aero.mp4' },
  { dept: 'CSE',         name: 'Dr. Ajmeera Kiran',           title: 'HOD — Computer Science & Engineering',          video: '/videos/hods/hod-cse.mp4' },
  { dept: 'ECE',         name: 'Dr. V. Thrimurthulu',         title: 'HOD — Electronics & Communication',             video: '/videos/hods/hod-ece.mp4' },
  { dept: 'CSE (AI&ML)', name: 'Dr. Kashi Sai Prasad',        title: 'HOD — CSE (Artificial Intelligence & ML)',      video: '/videos/hods/hod-aiml.mp4' },
  { dept: 'CSIT',        name: 'Dr. DBK Kamesh',              title: 'HOD — CSE (Information Technology)',            video: '/videos/hods/hod-csit.mp4' },
  { dept: 'Mechanical',  name: 'Prof. M. Venkateshwar Reddy', title: 'HOD — Mechanical Engineering',                  video: '/videos/hods/hod-mech.mp4' },
  { dept: 'EEE',         name: 'Prof. Ashok Kumar',           title: 'HOD — Electrical & Electronics Engineering',    video: '/videos/hods/hod-eee.mp4' },
  { dept: 'CSE (DS/CS)', name: 'Dr. P. Subhashini',           title: 'HOD — CSE (Data Science / Cyber Security)',     video: '/videos/hods/hod-ds-cs.mp4' },
  { dept: 'MBA',         name: 'Dr. N. Ramanjaneyulu',        title: 'HOD — Master of Business Administration',       video: '/videos/hods/hod-mba.mp4' },
];
