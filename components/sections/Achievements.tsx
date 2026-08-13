/**
 * Fallback copy. Used whenever the CMS lookup in app/page.tsx fails, returns
 * nothing, or returns a row missing any field — the section must always render
 * complete text, never a blank or half-filled headline.
 */
const DEFAULT_HEADLINE_LEAD = 'Accreditations';
const DEFAULT_HEADLINE_ACCENT = 'and Approvals.';
const DEFAULT_BODY =
  'AICTE, NAAC, NBA, ARIIA and more — recognised by leading national bodies for academic excellence and quality education.';

type AchievementsProps = {
  headlineLead?: string;
  headlineAccent?: string;
  body?: string;
};

export default function Achievements({ headlineLead, headlineAccent, body }: AchievementsProps) {
  const lead = headlineLead?.trim() || DEFAULT_HEADLINE_LEAD;
  const accent = headlineAccent?.trim() || DEFAULT_HEADLINE_ACCENT;
  const bodyText = body?.trim() || DEFAULT_BODY;

  const ranks = [
    { num: '201',  title: 'NIRF Rankings 2024',       sub: '201–300 Band, Engineering Category' },
    { num: '#6',   title: 'Times Engineering Survey', sub: '6th in Telangana' },
    { num: 'AAAA', title: 'Career360 Rating',         sub: 'Four-A Accredited Institution' },
  ];

  // Constellation positioning — px offsets from centre, mirrors legacy index.html
  const bubbles = [
    { name: 'NAAC',         src: '/legacy/nirf/naac.svg',         x: 0,    y: 0,    size: 'lg', cx: 260, cy: 240 },
    { name: 'AICTE',        src: '/legacy/nirf/aicte.svg',        x: -120, y: -120, size: 'md', cx: 90,  cy: 90  },
    { name: 'The Week',     src: '/legacy/nirf/the%20week.svg',   x: 120,  y: -120, size: 'md', cx: 405, cy: 75  },
    { name: 'ARIIA',        src: '/legacy/nirf/arha.svg',         x: 155,  y: 20,   size: 'sm', cx: 445, cy: 220 },
    { name: 'NBA',          src: '/legacy/nirf/nba.svg',          x: 90,   y: 145,  size: 'md', cx: 410, cy: 395 },
    { name: 'Dataquest',    src: '/legacy/nirf/dataquest.svg',    x: -90,  y: 145,  size: 'md', cx: 205, cy: 420 },
    { name: 'Gyaan Vigyan', src: '/legacy/nirf/gyaanvigyan.svg',  x: -155, y: 20,   size: 'sm', cx: 75,  cy: 295 },
  ];
  // SVG lines connecting bubbles (matches legacy ordering)
  const lines: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
  ];
  const sizePx = (s: string) => (s === 'lg' ? 'w-28 h-28 md:w-32 md:h-32' : s === 'md' ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20');

  return (
    <section id="achievements" className="relative bg-snow py-10 md:py-14 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary/[0.08] blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-gold-400/[0.10] blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 rounded-full bg-primary/[0.06] blur-[80px] pointer-events-none" />

      <div className="relative w-full px-6 md:px-10 lg:px-12 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Recognition
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2rem,3.6vw,3rem)]">
            {lead} <span className="font-display italic font-medium" style={{
              backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>{accent}</span>
          </h2>
          <p className="mt-4 max-w-[560px] text-muted leading-relaxed text-[1.05rem]">
            {bodyText}
          </p>
          <ul className="mt-8 space-y-4">
            {ranks.map((r) => (
              <li key={r.title} className="grid grid-cols-[100px_1fr] items-center gap-4 border-t border-border pt-4">
                <div className="font-display italic font-black text-[clamp(2rem,3vw,2.6rem)] text-foreground leading-none tracking-tighter-2">{r.num}</div>
                <div>
                  <div className="font-sans font-extrabold text-foreground">{r.title}</div>
                  <div className="text-sm text-muted">{r.sub}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Constellation */}
        <div className="relative aspect-square max-w-[520px] mx-auto w-full">
          <div className="absolute inset-0 origin-center scale-[0.8] sm:scale-100">
            <svg viewBox="0 0 520 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="absolute inset-0 w-full h-full">
              {lines.map(([a, b], i) => (
                <line key={i} x1={bubbles[a].cx} y1={bubbles[a].cy} x2={bubbles[b].cx} y2={bubbles[b].cy} stroke="rgba(232, 93, 4, 0.20)" strokeWidth={1.2} strokeDasharray="3 4" />
              ))}
            </svg>
            {bubbles.map((b, i) => (
              <div
                key={b.name}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border border-border shadow-[0_8px_24px_rgba(17,17,17,0.06)] grid place-items-center p-3 hover:-translate-y-[calc(50%+4px)] transition-transform ${sizePx(b.size)}`}
                style={{ transform: `translate(calc(-50% + ${b.x}px), calc(-50% + ${b.y}px))` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.name} className="max-w-full max-h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
