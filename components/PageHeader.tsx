// Editorial "chapter cover" hero shared across 39+ pages.
//
// Same props API as before (eyebrow / title / italic / dek / crumbs / variant /
// tone), so every consuming page keeps working — but the visual system now
// mirrors the department, CIE and APEX pages: dark ink canvas (or paper) with
// a ghost display word bleeding from the left, corner bracket in the accent
// colour, hairline draws, word-stagger on the title, and a facts strip with a
// mono chapter mark on the right.
//
// Pure CSS animations (no framer-motion) so the component stays server-safe
// and every hero renders on first paint with no client bundle cost.
import { ReactNode } from 'react';

type Variant = 'green' | 'navy' | 'orange';
type Tone = 'dark' | 'light';

const ACCENT: Record<Variant, string> = {
  green:  '#01741f',
  navy:   '#1e3a5f',
  orange: '#e85d04',
};

export default function PageHeader({
  eyebrow,
  title,
  italic,
  dek,
  crumbs,
  variant = 'green',
  tone = 'dark',
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  dek?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  variant?: Variant;
  tone?: Tone;
}) {
  const accent = ACCENT[variant];
  const isDark = tone === 'dark';

  // Ghost display word — first word of the title, uppercased, bleeding off
  // the left edge. Editorial anchor.
  const ghost = (title.trim().split(/\s+/)[0] || '').toUpperCase();
  const titleWords = title.split(' ');
  const italicWords = italic ? italic.split(' ') : [];

  return (
    <section
      className={`ph-hero relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-paper grain-texture text-foreground'}`}
      style={{ minHeight: 'clamp(440px, 60vh, 620px)' }}
    >
      {/* Ambient masked grid pattern — echoes the club pages */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[0]"
        style={{
          backgroundImage:
            `linear-gradient(${isDark ? 'rgba(114,114,114,1)' : 'rgba(24,20,15,1)'} 1px, transparent 1px),` +
            `linear-gradient(90deg, ${isDark ? 'rgba(114,114,114,1)' : 'rgba(24,20,15,1)'} 1px, transparent 1px)`,
          backgroundSize: '52px 52px',
          opacity: isDark ? 0.08 : 0.05,
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 55% at 30% 45%, #000 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 60% 55% at 30% 45%, #000 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
        }}
      />

      {/* Ambient accent glows */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none blur-[100px] z-[0]"
        style={{ backgroundColor: accent, opacity: isDark ? 0.14 : 0.08 }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none blur-[100px] z-[0]"
        style={{ backgroundColor: accent, opacity: isDark ? 0.10 : 0.06 }}
      />

      {/* GHOST display word — bleeds off the left edge */}
      <div
        aria-hidden
        className="absolute -left-4 md:-left-8 lg:-left-12 pointer-events-none select-none z-[0] hidden md:block"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <div
          className="ph-ghost font-sans font-black leading-[0.78] tracking-tighter-3 whitespace-nowrap"
          style={{
            fontSize: 'clamp(14rem, 28vw, 36rem)',
            color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(24,20,15,0.045)',
          }}
        >
          {ghost}
        </div>
      </div>

      {/* Corner bracket top-right — signature mark in accent */}
      <div
        aria-hidden
        className="ph-bracket absolute top-8 right-8 w-8 h-8 pointer-events-none hidden md:block z-[3]"
      >
        <span className="absolute top-0 right-0 w-full h-px" style={{ backgroundColor: accent }} />
        <span className="absolute top-0 right-0 w-px h-full" style={{ backgroundColor: accent }} />
      </div>

      {/* Content */}
      <div
        className="relative z-[2] max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-28 flex flex-col justify-center"
        style={{ minHeight: 'clamp(440px, 60vh, 620px)' }}
      >
        {/* Crumbs */}
        {crumbs && crumbs.length > 0 && (
          <div
            className="ph-crumbs flex flex-wrap items-center gap-2 font-mono text-[0.66rem] font-bold tracking-[0.24em] uppercase mb-8"
            style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,15,15,0.55)' }}
          >
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.href ? (
                  <a
                    href={c.href}
                    className="transition-colors"
                    style={{ opacity: 0.85 }}
                  >
                    {c.label}
                  </a>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < crumbs.length - 1 && (
                  <span style={{ opacity: 0.4 }}>/</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Eyebrow — rule draws, then label */}
        {eyebrow && (
          <div className="flex items-center gap-3 mb-6">
            <span
              aria-hidden
              className="ph-rule h-px w-8 origin-left block"
              style={{ backgroundColor: accent }}
            />
            <span
              className="ph-eyebrow font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase"
              style={{ color: accent }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        {/* Title — word-stagger via CSS animation-delay */}
        <h1
          className={`ph-title font-sans font-black tracking-tighter-3 leading-[0.98] ${isDark ? 'text-white' : 'text-foreground'}`}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
        >
          {titleWords.map((word, i) => (
            <span
              key={i}
              className="ph-word inline-block"
              style={{
                marginRight: '0.28em',
                animationDelay: `${0.2 + i * 0.06}s`,
              }}
            >
              {word}
            </span>
          ))}
          {italic && (
            <span
              className="block font-display italic font-medium mt-2"
              style={{
                color: accent,
                fontSize: '0.86em',
                lineHeight: 1.05,
              }}
            >
              {italicWords.map((word, i) => (
                <span
                  key={i}
                  className="ph-word inline-block"
                  style={{
                    marginRight: '0.24em',
                    animationDelay: `${0.4 + (titleWords.length + i) * 0.05}s`,
                  }}
                >
                  {word}
                </span>
              ))}
            </span>
          )}
        </h1>

        {/* Underline hairline — draws under the title */}
        <span
          aria-hidden
          className="ph-underline block mt-7 md:mt-9 h-px origin-left"
          style={{
            width: '22%',
            minWidth: '120px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(15,15,15,0.28)',
          }}
        />

        {/* Dek */}
        {dek && (
          <p
            className={`ph-dek mt-7 md:mt-9 leading-[1.7] text-[clamp(1rem,1.3vw,1.18rem)] max-w-[62ch] ${isDark ? 'text-white/70' : 'text-muted'}`}
          >
            {dek}
          </p>
        )}

        {/* Bottom-right mono chapter mark — quiet editorial signature */}
        <div
          aria-hidden
          className="absolute right-8 bottom-8 pointer-events-none hidden md:block font-mono text-[0.62rem] font-bold tracking-[0.28em] uppercase ph-mark"
          style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(15,15,15,0.4)' }}
        >
          § {(eyebrow || 'Chapter').trim().slice(0, 20)}
        </div>
      </div>

      {/* CSS animations — one keyframe set, applied via animation-delay per element */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes phRuleDraw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes phEyebrowIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes phWordRise {
          from { opacity: 0; transform: translateY(0.4em); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes phDekFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes phGhostSlide {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes phBracket {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes phUnderline {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes phFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .ph-hero .ph-rule      { animation: phRuleDraw 0.7s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.10s; }
        .ph-hero .ph-eyebrow   { animation: phEyebrowIn 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.25s; }
        .ph-hero .ph-word      { animation: phWordRise 0.75s cubic-bezier(0.22,1,0.36,1) both; }
        .ph-hero .ph-underline { animation: phUnderline 0.85s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.7s; }
        .ph-hero .ph-dek       { animation: phDekFade 0.8s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.85s; }
        .ph-hero .ph-ghost     { animation: phGhostSlide 1.2s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.05s; }
        .ph-hero .ph-bracket   { animation: phBracket 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.5s; }
        .ph-hero .ph-crumbs    { animation: phFade 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.05s; }
        .ph-hero .ph-mark      { animation: phFade 0.7s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.9s; }

        @media (prefers-reduced-motion: reduce) {
          .ph-hero .ph-rule,
          .ph-hero .ph-eyebrow,
          .ph-hero .ph-word,
          .ph-hero .ph-underline,
          .ph-hero .ph-dek,
          .ph-hero .ph-ghost,
          .ph-hero .ph-bracket,
          .ph-hero .ph-crumbs,
          .ph-hero .ph-mark {
            animation: none;
          }
        }
      `}} />
    </section>
  );
}
