import type { Metadata } from 'next';
import {
  type Story,
  MOST_READ,
  IN_BRIEF,
  PHOTO_ESSAY,
} from '@/lib/chronicles';
import { getLiveNews, getArchivedNews, formatNewsDate } from '@/lib/newsApi';
import { buildLeadStory, buildRecentStories, buildTierStories, buildArchiveStories, LIVE_FEED_SIZE } from '@/lib/frontPage';
import ChroniclesQuickNav from '@/components/ChroniclesQuickNav';
import ChroniclesTicker from '@/components/ChroniclesTicker';

export const metadata: Metadata = {
  title: 'MLRIT Chronicles — The campus broadsheet',
  description: '"All the campus that\'s fit to print" — a broadsheet of stories, ideas and updates from MLR Institute of Technology.',
};

/* Broadsheet: warm paper + black ink (DESIGN.md "Institutional Record"). Type
   is the site's own trio, not a separate Chronicles-only system — confirmed
   against the live deployed page: Playfair Display for every headline and
   body paragraph (font-display), JetBrains Mono for every tracked-uppercase
   meta/date/label/digit (font-mono), Manrope for nav (font-sans). Kiln Orange
   is the one accent — live dot, active nav, primary link — never a surface fill. */

// The India edition date line — genuinely today, not a fixed placeholder.
function editionDate(): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('weekday')}, ${get('day')} ${get('month')} ${get('year')}`.toUpperCase();
}

export default async function ChroniclesPage() {
  const [liveNewsFeed, archivedNewsFeed] = await Promise.all([
    getLiveNews(LIVE_FEED_SIZE),
    getArchivedNews(),
  ]);
  const liveWireTicker = liveNewsFeed.slice(0, 6);
  const { story: LEAD, body: LEAD_BODY } = buildLeadStory(liveNewsFeed);
  const RECENT_STORIES = buildRecentStories(liveNewsFeed);
  const TIER_STORIES = buildTierStories(liveNewsFeed);
  const ARCHIVE_STORIES = buildArchiveStories(archivedNewsFeed);
  const EDITION_DATE = editionDate();

  const tickerItems = liveNewsFeed.length ? liveNewsFeed.map((n) => n.title) : IN_BRIEF.map((b) => b.body);

  return (
    <div className="bg-white text-black">
      {/* UTILITY BAR */}
      <div className="border-b border-black/20">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between py-2 font-mono uppercase text-[0.65rem] tracking-[0.15em] text-black/70">
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" aria-hidden />
            {EDITION_DATE}
          </span>
          <div className="flex items-center gap-3">
            <span>MLRIT · HYDERABAD</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">VOL. V · NO. 23</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">SPRING EDITION</span>
          </div>
        </div>
      </div>

      {/* MASTHEAD */}
      <header id="top" className="border-b-2 border-black scroll-mt-32">
        <div className="max-w-[1200px] mx-auto px-4 text-center py-6 md:py-9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/legacy/mlrit-logo-450.png"
            alt="MLR Institute of Technology"
            width={450}
            height={112}
            className="h-9 md:h-11 w-auto mx-auto mb-4"
          />
          <p className="font-mono uppercase text-[0.65rem] tracking-[0.15em] text-black/60 mb-2.5">
            The campus broadsheet of MLR Institute of Technology
          </p>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.9] text-[clamp(2.4rem,8vw,5.5rem)]">
            MLRIT Chronicles
          </h1>
          <p className="font-mono uppercase text-[0.65rem] tracking-[0.15em] text-black/60 mt-3">
            Campus · Research · Placements · Sport
          </p>
        </div>
      </header>

      <ChroniclesTicker items={tickerItems} />

      <ChroniclesQuickNav />

      <main className="max-w-[1200px] mx-auto px-4">

        {/* LEAD + RAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 pt-8 pb-8 border-b-2 border-black">
          <article className="lg:col-span-2 lg:pr-8 lg:border-r lg:border-black/15">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col justify-center order-2 md:order-1">
                <span className="font-mono font-bold uppercase tracking-[0.15em] text-xs text-primary mb-3">{LEAD.section}</span>
                <h2 className="font-display font-bold tracking-tight leading-[1.02] text-[clamp(1.9rem,3.6vw,3rem)] mb-4">
                  {LEAD.title}
                </h2>
                <p className="font-display text-lg leading-relaxed text-black/80 mb-4">{LEAD.dek}</p>
                <div className="font-mono uppercase tracking-[0.15em] text-[0.65rem] text-black/70">{LEAD.meta}</div>
              </div>

              <div className="order-1 md:order-2">
                {LEAD.img && (
                  <a href={LEAD.href} target="_blank" rel="noopener" className="block overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={LEAD.img}
                      alt={LEAD.title}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </a>
                )}
              </div>
            </div>

            {LEAD_BODY.length > 0 && (
              <div className="mt-6 pt-5 border-t border-black/20 grid md:grid-cols-2 gap-x-8 gap-y-3 font-display text-[1.0625rem] leading-[1.75] text-black/85">
                {LEAD_BODY.map((p, i) => (
                  <p key={i} className={i === 0 ? 'md:col-span-2' : undefined}>{p}</p>
                ))}
              </div>
            )}
            <a
              href={LEAD.href}
              target="_blank"
              rel="noopener"
              className="inline-block mt-4 font-mono font-bold uppercase tracking-[0.15em] text-[0.7rem] text-primary border-b-2 border-primary pb-0.5 hover:bg-primary hover:text-white hover:border-transparent hover:px-2 transition-all"
            >
              Continue reading →
            </a>
          </article>

          {/* RIGHT RAIL — In Brief, Live Wire, Most Read */}
          <aside className="lg:pl-8 flex flex-col gap-8 min-w-0">
            <section id="brief" className="scroll-mt-32">
              <RailHead label="In Brief" meta="Today" />
              <ul className="list-none p-0 m-0">
                {IN_BRIEF.map((b, i) => (
                  <li
                    key={i}
                    className={`py-2.5 grid grid-cols-[48px_1fr] gap-3 items-baseline ${
                      i < IN_BRIEF.length - 1 ? 'border-b border-black/15' : ''
                    }`}
                  >
                    <span className="font-mono uppercase tracking-[0.15em] text-[0.6rem] text-black/70">{b.date}</span>
                    <span
                      className="font-display text-sm leading-snug"
                      dangerouslySetInnerHTML={{ __html: b.body.replace(/^([^—]+?)\s—/, '<strong class="font-bold">$1</strong> —') }}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <RailHead label="Live Wire" meta={liveWireTicker.length ? 'Auto-updated' : 'Warming up'} />
              {liveWireTicker.length === 0 ? (
                <p className="font-display text-sm leading-snug text-black/70">
                  No live items yet — the scraper hasn&apos;t run, or the news service isn&apos;t reachable.
                </p>
              ) : (
                <div className="flex flex-col">
                  {liveWireTicker.map((n) => (
                    <a
                      key={n.id}
                      href={n.link}
                      target="_blank"
                      rel="noopener"
                      className="py-2.5 border-b border-black/15 last:border-b-0 group"
                    >
                      <span className="font-mono uppercase tracking-[0.15em] text-[0.6rem] text-black/60 block mb-1">
                        {n.category} · {formatNewsDate(n.published_at)}
                      </span>
                      <p className="font-display font-bold text-sm leading-snug group-hover:underline underline-offset-2">
                        {n.title}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </section>

            {/* Most Read — boxed, per the broadsheet sidebar */}
            <section className="border-2 border-black p-5">
              <div className="flex items-center gap-3 mb-5">
                <h3 className="font-display font-bold text-xl uppercase tracking-tight">Most Read</h3>
                <div className="flex-1 border-t border-black/30" />
              </div>
              <ol className="space-y-4 list-none p-0 m-0">
                {MOST_READ.map((s, i) => (
                  <li key={i}>
                    <a href={s.href} target="_blank" rel="noopener" className="flex items-start gap-3.5 group">
                      <span className="font-mono font-black text-3xl leading-none text-primary/80 group-hover:text-primary transition-colors shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-mono uppercase tracking-[0.15em] text-[0.6rem] text-black/60 block mb-1">
                          {s.section}
                        </span>
                        <p className="font-display font-bold text-sm leading-snug group-hover:underline underline-offset-2">
                          {s.title}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>

        {/* RECENT STORIES */}
        <section id="recent" className="border-b-2 border-black scroll-mt-32">
          <SectionHead title="Recent Stories" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 pb-8">
            {RECENT_STORIES.map((s, i) => (
              <div
                key={i}
                className={`pb-6 md:pb-0 md:px-4 first:md:pl-0 last:md:pr-0 ${
                  i < RECENT_STORIES.length - 1 ? 'md:border-r md:border-black/15' : ''
                }`}
              >
                <a href={s.href} target="_blank" rel="noopener" className="flex flex-col h-full group">
                  {s.img && (
                    <div className="overflow-hidden mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.img}
                        alt={s.title}
                        loading="lazy"
                        className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}
                  <span className="font-mono font-bold uppercase tracking-[0.15em] text-xs text-primary mb-2">{s.section}</span>
                  <h3 className="font-display font-bold text-xl leading-[1.15] mb-2 group-hover:underline underline-offset-2">
                    {s.title}
                  </h3>
                  <p className="font-display text-sm leading-relaxed text-black/75 mb-3">{s.dek}</p>
                  <div className="font-mono uppercase tracking-[0.15em] text-[0.65rem] text-black/70 mt-auto">{s.meta}</div>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* MORE FROM THIS ISSUE */}
        <StoryGrid id="issue" title="More From This Issue" stories={TIER_STORIES} />

        {/* PHOTO ESSAY */}
        <section id="photo-essay" className="border-b-2 border-black scroll-mt-32">
          <SectionHead title="Photo Essay" trail="Twelve months, one campus" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 pb-8">
            {PHOTO_ESSAY.map((p, i) => (
              <div
                key={i}
                className={`pb-6 md:pb-0 md:px-4 first:md:pl-0 last:md:pr-0 ${
                  i < PHOTO_ESSAY.length - 1 ? 'md:border-r md:border-black/15' : ''
                }`}
              >
                <a href={p.href} target="_blank" rel="noopener" className="flex flex-col h-full group">
                  <div className="overflow-hidden mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-display font-bold text-lg leading-[1.15] mb-1.5 group-hover:underline underline-offset-2">
                    {p.title}
                  </h4>
                  <p className="font-mono uppercase tracking-[0.15em] text-[0.65rem] text-black/70 mt-auto">{p.tag}</p>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ARCHIVE — auto-populated as items roll out of the current issue */}
        <StoryGrid id="archive" title="From The Archives" trail="Older stories" stories={ARCHIVE_STORIES} />
      </main>
    </div>
  );
}

function RailHead({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="flex justify-between items-baseline border-t-2 border-black pt-2 mb-3">
      <h3 className="font-mono font-bold uppercase tracking-[0.15em] text-xs">{label}</h3>
      <span className="font-mono uppercase tracking-[0.15em] text-[0.6rem] text-black/60">{meta}</span>
    </div>
  );
}

function SectionHead({ title, trail }: { title: string; trail?: string }) {
  return (
    <div className="flex items-center gap-4 pt-8 pb-4">
      <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight uppercase">{title}</h2>
      <div className="flex-1 border-t-2 border-black" />
      {trail && (
        <span className="font-mono uppercase tracking-[0.15em] text-[0.65rem] text-black/70 whitespace-nowrap hidden md:block">
          {trail}
        </span>
      )}
    </div>
  );
}

function StoryGrid({ id, title, trail, stories }: { id?: string; title: string; trail?: string; stories: Story[] }) {
  return (
    <section id={id} className="border-b-2 border-black scroll-mt-32">
      <SectionHead title={title} trail={trail} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 pb-8">
        {stories.map((s, i) => (
          <div
            key={i}
            className={`pb-6 md:pb-0 lg:px-4 first:lg:pl-0 lg:border-r lg:border-black/15 lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(4n)]:pr-0 lg:[&:nth-child(4n+1)]:pl-0 ${
              i >= 4 ? 'lg:mt-8 lg:pt-8 lg:border-t lg:border-t-black/15' : ''
            }`}
          >
            <a href={s.href} target="_blank" rel="noopener" className="flex flex-col h-full group">
              <div className="overflow-hidden mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img!}
                  alt={s.title}
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <span className="font-mono font-bold uppercase tracking-[0.15em] text-[0.65rem] text-primary mb-1.5">{s.section}</span>
              <h4 className="font-display font-bold text-base leading-[1.15] mb-2 group-hover:underline underline-offset-2">
                {s.title}
              </h4>
              <p className="font-mono uppercase tracking-[0.15em] text-[0.6rem] text-black/70 mt-auto">{s.meta}</p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
