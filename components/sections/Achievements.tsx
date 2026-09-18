'use client';

import { motion } from 'framer-motion';

import { resolveAssetUrl } from '@/lib/cdn/url';
import { asGalleryItems, asRepeaterItems, asText } from '@/lib/content/sections';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';

type Rank = { num: string; title: string; sub: string; tint: string };

/**
 * Fallback rank cards. Used whenever the CMS repeater is empty, absent or
 * fails to load, so the row is never blank.
 */
const RANKS: Rank[] = [
  { num: '201',  title: 'NIRF Rankings 2024',       sub: '201–300 Band · Engineering Category', tint: '#e85d04' },
  { num: '#6',   title: 'Times Engineering Survey', sub: '6th in Telangana',                    tint: '#1F6B24' },
  { num: 'AAAA', title: 'Careers360 Rating',        sub: 'Four-A Accredited Institution',       tint: '#c26a2b' },
];

/**
 * Maps repeater rows onto the Rank shape. An empty list yields RANKS verbatim.
 * `tint` falls back per position rather than to a single colour, so a row left
 * blank keeps the palette the design intended instead of turning orange.
 */
function ranksFrom(value: unknown): Rank[] {
  const rows = asRepeaterItems(value);
  if (rows.length === 0) return RANKS;

  return rows.map((row, i) => ({
    num: asText(row.num),
    title: asText(row.title),
    sub: asText(row.sub),
    tint: asText(row.tint, RANKS[i]?.tint ?? RANKS[0].tint),
  }));
}

/**
 * Fallback logos used until the CMS supplies its own gallery.
 * Order defines the marquee sequence — first entry appears first in the loop.
 */
const LOGOS = [
  { name: 'NAAC',         src: '/legacy/nirf/naac.svg'         },
  { name: 'AICTE',        src: '/legacy/nirf/aicte.svg'        },
  { name: 'The Week',     src: '/legacy/nirf/the%20week.svg'   },
  { name: 'ARIIA',        src: '/legacy/nirf/arha.svg'         },
  { name: 'NBA',          src: '/legacy/nirf/nba.svg'          },
  { name: 'Dataquest',    src: '/legacy/nirf/dataquest.svg'    },
  { name: 'Gyaan Vigyan', src: '/legacy/nirf/gyaanvigyan.svg'  },
];

/**
 * Fallback copy. Used whenever the CMS lookup in app/page.tsx fails, returns
 * nothing, or returns a row missing any field — the section must always render
 * complete text, never a blank or half-filled headline.
 */
const DEFAULT_HEADLINE_LEAD = 'Accreditations';
const DEFAULT_HEADLINE_ACCENT = 'and Approvals.';
const DEFAULT_BODY =
  'AICTE, NAAC, NBA, ARIIA and more — MLRIT is recognised by every leading national body for academic excellence, programme quality and innovation.';

type AchievementsProps = {
  headlineLead?: string;
  headlineAccent?: string;
  body?: string;
  /** Gallery items from the CMS; falls back to LOGOS. */
  logos?: unknown;
  /** Repeater rows from the CMS; falls back to the bundled RANKS. */
  ranks?: unknown;
};

export default function Achievements(props: AchievementsProps) {
  const { headlineLead, headlineAccent, body, logos, ranks } = useMergedSection(
    'home/achievements',
    props
  );

  const lead = headlineLead?.trim() || DEFAULT_HEADLINE_LEAD;
  const accent = headlineAccent?.trim() || DEFAULT_HEADLINE_ACCENT;
  const bodyText = body?.trim() || DEFAULT_BODY;
  const rankCards = ranksFrom(ranks);

  // Uploaded logos win; empty CMS field renders the bundled list untouched.
  const uploaded = asGalleryItems(logos);
  const displayLogos = uploaded.length > 0
    ? uploaded.map((item, i) => ({
        name: item.name?.trim() || item.title?.trim() || LOGOS[i]?.name || `Logo ${i + 1}`,
        src:  resolveAssetUrl(item.key, { allowTransient: true }) ?? LOGOS[i]?.src ?? '',
      })).filter((l) => l.src)
    : LOGOS;

  return (
    <div id={sectionDomId('home/achievements')}>
      <section id="achievements" className="relative bg-snow grain-texture pt-6 md:pt-10 pb-8 md:pb-24 overflow-hidden">
        {/* Ambient blobs */}
        <div aria-hidden className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-secondary/[0.08] blur-[100px] pointer-events-none" />
        <div aria-hidden className="absolute top-1/2 -right-32 w-[420px] h-[420px] rounded-full bg-gold-400/[0.10] blur-[100px] pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 left-1/2 w-[420px] h-[420px] rounded-full bg-primary/[0.06] blur-[100px] pointer-events-none" />
        {/* Faint grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.030]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          {/* ── ROW 1 · HEADING — full-width, breathing room ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-24 items-end"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.78rem] tracking-[0.24em] uppercase">
                Recognition
              </span>

              <h2 className="mt-6 font-sans font-black tracking-tighter-2 leading-[0.98] text-foreground text-[clamp(2.6rem,5.4vw,4.8rem)]">
                {lead}{' '}
                <span
                  className="font-display italic font-medium"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', color: 'transparent',
                  }}
                >
                  {accent}
                </span>
              </h2>
            </div>

            <p className="text-foreground/75 leading-[1.75] text-[clamp(1rem,1.15vw,1.15rem)] max-w-[480px] lg:justify-self-end lg:text-right">
              {bodyText}
            </p>
          </motion.div>

          {/* ── ROW 2 · RANK CARDS — 3-across, full width, generous ── */}
          <ul className="relative z-10 mt-6 md:mt-14 grid gap-4 md:gap-8 md:grid-cols-3">
            {rankCards.map((r, i) => (
              <motion.li
                key={`${r.title}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl md:rounded-3xl bg-white border border-border p-5 md:p-9 lg:p-10 min-h-0 md:min-h-[220px] flex flex-col justify-between hover:border-transparent hover:shadow-[0_28px_60px_-20px_rgba(0,0,0,0.18)] transition-shadow duration-500 overflow-hidden"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 transition-all duration-500 group-hover:h-2"
                  style={{ background: r.tint }}
                />

                <div className="flex items-start justify-between">
                  <span
                    className="font-sans font-black text-[2.2rem] md:text-[clamp(3.4rem,5vw,5rem)] leading-[0.85] tracking-tighter-3 transition-transform duration-500 origin-left group-hover:scale-[1.05]"
                    style={{ color: r.tint }}
                  >
                    {r.num}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-[0.62rem] md:text-[0.7rem] font-bold tracking-[0.2em] uppercase pt-1 md:pt-2 opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: r.tint }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-3 md:mt-6">
                  <div className="font-sans font-extrabold text-foreground text-[0.98rem] md:text-[1.14rem] tracking-tight leading-snug">
                    {r.title}
                  </div>
                  <div className="mt-1 md:mt-2 text-muted text-[0.82rem] md:text-[0.95rem] leading-relaxed">
                    {r.sub}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* Trust-mark line separator */}
          <div className="mt-10 md:mt-14 flex items-center gap-3">
            <span className="chapter-mark">§ 03</span>
            <span className="editorial-rule" aria-hidden />
            <span className="editorial-eyebrow">{displayLogos.length} · Trust Marks · Scrolling below</span>
          </div>

          {/* ── LOGOS MARQUEE ─────────────────────────────────
              Big accreditation logos scrolling horizontally under
              the heading + rank cards. Duplicated once so the loop
              seams together at translateX(-50%). Fade masks at the
              edges prevent hard cut-ins. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 md:mt-10"
          >
            <div
              className="relative"
              style={{
                WebkitMaskImage:
                  'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
                maskImage:
                  'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
              }}
            >
              <div className="flex w-[200%] animate-marquee gap-12 md:gap-14 items-center">
                {[...displayLogos, ...displayLogos].map((l, i) => (
                  <figure
                    key={`${l.name}-${i}`}
                    className="group flex-shrink-0 flex flex-col items-center justify-center"
                  >
                    <div className="relative flex items-center justify-center h-32 md:h-40 lg:h-44 w-44 md:w-56 lg:w-64 rounded-2xl bg-white border border-border transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_20px_48px_-16px_rgba(232,93,4,0.24)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={l.src}
                        alt={l.name}
                        className="max-h-[70%] max-w-[76%] object-contain grayscale-[0.15] group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <figcaption className="mt-4 font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase text-muted group-hover:text-primary transition-colors">
                      {l.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
