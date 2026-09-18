'use client';

import { useRef } from 'react';

const APEX_RED = '#D80000';

const DOMAINS = [
  { n: '01', title: 'Game Development',         sub: 'Unity · Unreal · Godot',               body: 'Real games on real engines — mobile, PC and VR. Members ship playable projects every semester, guided by peers who have shipped before.' },
  { n: '02', title: 'E-Sports',                 sub: 'Valorant · BGMI · FIFA · Multi-title',  body: 'Competitive gaming from the ground up — team formation, scrims, coaching, casting, and the community that makes every match worth playing.' },
  { n: '03', title: 'UI/UX & Game Design',      sub: 'Interface · Feedback · Game Feel',      body: "The design work that makes a build worth playing — interfaces, feedback loops, visual language and the invisible craft players feel but can't name." },
  { n: '04', title: 'Storytelling & Narrative', sub: 'World-building · Characters · Writing', body: 'Worlds and characters that give every mechanic a reason to exist. Writing workshops, narrative design and the craft of making players care.' },
  { n: '05', title: 'Emerging Tech',            sub: 'AR/VR · Procedural · New Engines',      body: 'The frontier — AR/VR, procedural generation and experimental engines where the next genre is being invented right now.' },
] as const;

export default function ApexHowItWorks({
  sectionRef: externalRef,
}: {
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  const internalRef = useRef<HTMLElement>(null);
  const sectionRef  = (externalRef ?? internalRef) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      aria-label="How the club works"
    >
      <style>{`
        .apex-list-section {
          padding: 8rem 0;
        }

        .apex-list-container {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2.5rem;
          align-items: start;
        }

        .apex-sticky-label {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          color: rgba(255,255,255,0.9);
          position: sticky;
          top: calc(50vh - 0.6lh);
          align-self: flex-start;
          min-width: max-content;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .apex-sticky-label span {
          display: block;
          color: ${APEX_RED};
          font-size: 0.55em;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: monospace;
          margin-bottom: 0.5rem;
        }

        .apex-domains-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: clamp(2.2rem, 5vw, 5rem);
          font-weight: 700;
        }

        .apex-domains-list li {
          line-height: 1.3;
          padding: 0.6rem 0;
          scroll-snap-align: center;
          color: rgba(255,255,255,0.18);
          transition: color 0.2s;
          cursor: default;
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
        }

        .apex-domains-list li .apex-num {
          font-size: 0.35em;
          font-weight: 900;
          color: rgba(255,255,255,0.2);
          font-family: monospace;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .apex-domains-list li .apex-sub {
          display: block;
          font-size: 0.28em;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.15);
          font-family: monospace;
          margin-top: 0.2rem;
          line-height: 1;
        }

        .apex-domains-list li .apex-title-wrap {
          display: flex;
          flex-direction: column;
        }

        /* CSS scroll-driven brightness animation */
        @supports (animation-timeline: scroll()) and (animation-range: 0% 100%) {
          .apex-domains-list li:first-of-type  { --start-opacity: 1; }
          .apex-domains-list li:last-of-type   { --end-opacity: 1;   }

          .apex-domains-list li {
            opacity: 0.18;
            animation-name: apex-brighten;
            animation-fill-mode: both;
            animation-timing-function: linear;
            animation-timeline: view();
            animation-range: cover calc(50% - 1lh) calc(50% + 1lh);
          }

          .apex-domains-list li.apex-colored:nth-child(1)  { --hue: 0;   }
          .apex-domains-list li.apex-colored:nth-child(2)  { --hue: 72;  }
          .apex-domains-list li.apex-colored:nth-child(3)  { --hue: 144; }
          .apex-domains-list li.apex-colored:nth-child(4)  { --hue: 216; }
          .apex-domains-list li.apex-colored:nth-child(5)  { --hue: 288; }

          /* last item stays white */
          .apex-domains-list li:last-of-type {
            color: rgba(255,255,255,0.9) !important;
          }

          @keyframes apex-brighten {
            0%   { opacity: var(--start-opacity, 0.18); }
            50%  { opacity: 1; color: oklch(72% 0.22 var(--hue, 0)); }
            100% { opacity: var(--end-opacity,   0.18); }
          }
        }

        @media (max-width: 640px) {
          .apex-list-container {
            column-gap: 1rem;
            padding: 0 1.25rem;
          }
          .apex-sticky-label {
            font-size: clamp(1.1rem, 5vw, 2rem);
          }
        }
      `}</style>

      <div className="apex-list-section">
        {/* Section header — above the scroll list */}
        <div className="max-w-[1200px] mx-auto px-10 mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span aria-hidden className="h-px w-6" style={{ backgroundColor: APEX_RED }} />
            <span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase" style={{ color: APEX_RED }}>
              How it works
            </span>
          </div>
          <h2
            className="font-sans font-black text-white leading-[1.02]"
            style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}
          >
            Five domains. One community.
          </h2>
        </div>

        {/* Scroll list */}
        <div className="apex-list-container">
          <p className="apex-sticky-label" aria-hidden>
            <span>APEX</span>
            Domains
          </p>

          <ul className="apex-domains-list">
            {DOMAINS.map((d) => (
              <li key={d.n} className="apex-colored">
                <span className="apex-num">{d.n}</span>
                <span className="apex-title-wrap">
                  {d.title}
                  <span className="apex-sub">{d.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
