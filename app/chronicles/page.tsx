import type { Metadata } from 'next';
import Link from 'next/link';
import {
  type Story,
  LEAD,
  LEAD_BODY,
  MID_STORIES,
  MOST_READ,
  IN_BRIEF,
  ARCHIVE,
  PHOTO_ESSAY,
} from '@/lib/chronicles';
import { getLiveNews, formatNewsDate } from '@/lib/newsApi';
import { buildTierStories, TIER_SIZE } from '@/lib/frontPage';

export const metadata: Metadata = {
  title: 'MLRIT Chronicles — The campus broadsheet',
  description: '"All the campus that\'s fit to print" — a broadsheet of stories, ideas and updates from MLR Institute of Technology.',
};

const SECTIONS = ['Front Page', 'Campus', 'Placements', 'Research', 'Sports', 'Student Voice', 'Alumni', 'Events', 'Faculty', 'Opinion', 'Archive'];

export default async function ChroniclesPage() {
  const liveNewsFeed = await getLiveNews(TIER_SIZE);
  const liveWireTicker = liveNewsFeed.slice(0, 8);
  const TIER_STORIES = buildTierStories(liveNewsFeed);

  return (
    <div className="bg-white text-foreground font-display">
      {/* MASTHEAD */}
      <header className="border-t-4 border-black border-b border-black px-6 md:px-12 lg:px-20 pt-8 md:pt-12 lg:pt-14 pb-5 md:pb-7 text-center">
        <div className="flex justify-between items-center font-mono text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-muted border-b border-border pb-3 mb-5">
          <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-black mr-2 align-middle animate-pulse" /> Live · Spring '26 Edition</span>
          <span>Vol. V · Issue 23</span>
        </div>
        <div className="h-1 bg-black my-2" />
        <h1 className="font-display font-black uppercase leading-[0.88] tracking-tighter-2 text-[clamp(3rem,12vw,13rem)] mt-0 mb-0">
          MLRIT <span className="italic font-normal">Chronicles</span>
        </h1>
        <p className="italic text-muted text-[clamp(0.92rem,1.1vw,1.1rem)] mt-4">
          "All the campus that's fit to print" — a broadsheet of stories, ideas and updates from MLR Institute of Technology.
        </p>
        <div className="h-0.5 bg-black mt-5" />
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-muted border-t border-border mt-5 pt-3.5">
          <span>Saturday, <strong className="text-black font-bold">16 May 2026</strong></span>
          <span>Dundigal · Hyderabad</span>
          <span>62 pages · ₹0</span>
          <span>Reading time · 4 min</span>
        </div>
      </header>

      {/* RIBBON */}
      <nav aria-label="Sections" className="bg-black text-white border-y border-black">
        <div className="flex overflow-x-auto no-scrollbar px-6 md:px-12 lg:px-20">
          {SECTIONS.map((s, i) => (
            <a
              key={s}
              href="#"
              className={`whitespace-nowrap font-sans text-[0.78rem] font-bold tracking-[0.14em] uppercase px-4 py-3.5 hover:bg-white/10 transition-colors ${
                i === 0 ? 'bg-white text-black' : 'text-white'
              } ${i > 0 ? 'border-l border-white/15' : ''}`}
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* FRONT PAGE 3-col */}
      <main className="px-6 md:px-12 lg:px-20 py-10 md:py-14 grid lg:grid-cols-[1.4fr_1fr_1fr] gap-8 lg:gap-12">

        {/* LEAD STORY */}
        <article className="flex flex-col">
          <span className="inline-flex items-center gap-2 self-start font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase text-white bg-black px-2.5 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> {LEAD.section}
          </span>
          <h2 className="font-display font-black leading-[0.98] tracking-tighter-2 text-[clamp(2.4rem,4.6vw,4.4rem)] text-black mb-4">
            {beforeItalic(LEAD.title, LEAD.titleItalic)}
            {LEAD.titleItalic && <em className="italic font-normal">{LEAD.titleItalic}</em>}
            {afterItalic(LEAD.title, LEAD.titleItalic)}
          </h2>
          <p className="font-display text-[clamp(1.05rem,1.3vw,1.2rem)] leading-[1.55] mb-5">{LEAD.dek}</p>
          <div className="font-mono text-[0.72rem] font-semibold tracking-[0.14em] uppercase border-y border-black py-2.5 mb-5">
            {LEAD.meta?.split('•').map((s, i) => (
              <span key={i} className={i > 0 ? 'before:mx-2 before:text-muted before:content-["•"]' : ''}>{s.trim()}</span>
            ))}
          </div>
          {LEAD.img && (
            <a href={LEAD.href} target="_blank" rel="noopener" className="block border border-black overflow-hidden mb-3.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LEAD.img} alt="" className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-105" />
            </a>
          )}
          <div className="space-y-3.5 font-display text-[1.04rem] leading-[1.65]">
            {LEAD_BODY.map((p, i) => (
              <p key={i} className={i === 0 ? "first-letter:font-black first-letter:text-[4.2em] first-letter:float-left first-letter:leading-[0.86] first-letter:mr-3 first-letter:mt-1.5" : undefined}>{p}</p>
            ))}
            <a href={LEAD.href} target="_blank" rel="noopener" className="inline-flex items-center gap-2 mt-2 font-sans font-bold text-[0.82rem] tracking-[0.06em] uppercase text-black border-b-2 border-black hover:bg-black hover:text-white hover:px-2 hover:py-1 hover:border-0 transition-all">
              Continue reading →
            </a>
          </div>
        </article>

        {/* MIDDLE — secondary stories */}
        <div className="flex flex-col gap-6 lg:border-l lg:border-border lg:pl-10">
          {MID_STORIES.map((s, i) => (
            <article key={i} className={`pb-5 ${i < MID_STORIES.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="inline-block font-sans text-[0.7rem] font-extrabold tracking-[0.18em] uppercase border-b-2 border-black pb-1 mb-2.5">
                {s.section}
              </span>
              {s.img && (
                <a href={s.href} target="_blank" rel="noopener" className="block border border-black overflow-hidden mb-3 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt="" className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105" />
                </a>
              )}
              <h3 className="font-display font-extrabold leading-[1.08] tracking-tight text-[clamp(1.32rem,1.7vw,1.7rem)] mb-2.5">
                {beforeItalic(s.title, s.titleItalic)}
                {s.titleItalic && <em className="italic font-normal">{s.titleItalic}</em>}
                {afterItalic(s.title, s.titleItalic)}
              </h3>
              <p className="font-display text-[0.98rem] leading-[1.5] mb-3">{s.dek}</p>
              <p className="font-mono text-[0.68rem] font-medium tracking-[0.14em] uppercase text-muted">{s.meta}</p>
            </article>
          ))}
        </div>

        {/* RIGHT — Most Read + In Brief */}
        <aside className="flex flex-col gap-10 lg:border-l lg:border-border lg:pl-10">
          <section>
            <RailHead label="Most Read" pill="This week" />
            <div className="flex flex-col">
              {MOST_READ.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener" className="grid grid-cols-[36px_1fr] gap-3.5 py-3.5 border-b border-dashed border-border last:border-b-0 group">
                  <div className="font-display font-black italic text-[1.6rem] leading-none tracking-tighter-2 text-black">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <p className="font-display font-bold text-[1.02rem] leading-[1.22] tracking-tight group-hover:underline group-hover:underline-offset-[3px] group-hover:decoration-2 mb-1">{s.title}</p>
                    <p className="font-mono text-[0.66rem] tracking-[0.14em] uppercase text-muted">{s.meta}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section>
            <RailHead label="In Brief" pill="Today" />
            <ul className="list-none p-0 m-0">
              {IN_BRIEF.map((b, i) => (
                <li key={i} className={`py-3 grid grid-cols-[auto_1fr] gap-3 items-baseline ${i < IN_BRIEF.length - 1 ? 'border-b border-border' : ''}`}>
                  <span className="font-mono font-bold text-[0.62rem] tracking-[0.14em] uppercase bg-black text-white px-1.5 py-0.5 whitespace-nowrap">{b.date}</span>
                  <span className="font-display text-[0.98rem] leading-[1.45]">
                    {(([head, ...tail]) => tail.length ? <><strong className="font-sans font-bold">{head}</strong>{' — '}{tail.join(' — ')}</> : <>{head}</>)(b.body.split(/\s—\s/))}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* LIVE WIRE — auto-scraped news */}
          <section>
            <RailHead label="Live Wire" pill={liveWireTicker.length ? 'Auto-updated' : 'Warming up'} />
            {liveWireTicker.length === 0 ? (
              <p className="font-mono text-[0.76rem] text-muted leading-relaxed">
                No live items yet — the scraper hasn't run, or the news service isn't reachable.
              </p>
            ) : (
              <div className="flex flex-col">
                {liveWireTicker.map((n) => (
                  <a
                    key={n.id}
                    href={n.link}
                    target="_blank"
                    rel="noopener"
                    className="py-3 border-b border-dashed border-border last:border-b-0 group"
                  >
                    <span className="font-mono text-[0.6rem] font-bold tracking-[0.14em] uppercase text-muted">
                      {n.category} · {formatNewsDate(n.published_at)}
                    </span>
                    <p className="font-display font-bold text-[0.96rem] leading-[1.25] tracking-tight mt-1 group-hover:underline group-hover:underline-offset-[3px] group-hover:decoration-2">
                      {n.title}
                    </p>
                    <p className="font-mono text-[0.64rem] tracking-[0.1em] uppercase text-muted mt-1">{n.source}</p>
                  </a>
                ))}
              </div>
            )}
          </section>

        </aside>
      </main>

      {/* TIER — More from this issue */}
      <TierGrid label="More from" italicLabel="this issue" trail="See all stories" trailHref="/chronicles" stories={TIER_STORIES} />

      {/* PHOTO ESSAY (inverted) */}
      <section className="bg-black text-white px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="flex items-end gap-5 mb-7 md:mb-9">
          <h3 className="font-display font-black tracking-tighter-2 text-[clamp(1.8rem,2.8vw,2.4rem)] leading-none">
            Photo essay · <em className="italic font-normal">The year in frames</em>
          </h3>
          <div className="flex-1 h-px bg-white/40 mb-2" />
          <span className="font-mono text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-white/70">Twelve months, one campus</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 min-h-[300px] md:min-h-[440px]">
          {PHOTO_ESSAY.map((p, i) => (
            <a key={i} href={p.href} target="_blank" rel="noopener" className="relative block overflow-hidden border border-white/20 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" style={{ filter: 'contrast(1.04) saturate(1.08)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute left-5 right-5 bottom-5 z-10">
                <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase inline-block border border-white/50 px-2 py-0.5 mb-2">{p.tag}</span>
                <h4 className="font-display font-extrabold text-[clamp(1.05rem,1.4vw,1.4rem)] leading-[1.16] tracking-tight">{p.title}</h4>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* TIER — From the archives */}
      <TierGrid label="From the" italicLabel="archives" trail="2024 · in review" stories={ARCHIVE} />
    </div>
  );
}

function beforeItalic(text: string, italic?: string) {
  if (!italic) return text;
  const idx = text.indexOf(italic);
  return idx === -1 ? text : text.slice(0, idx);
}
function afterItalic(text: string, italic?: string) {
  if (!italic) return null;
  const idx = text.indexOf(italic);
  return idx === -1 ? null : text.slice(idx + italic.length);
}

function RailHead({ label, pill }: { label: string; pill: string }) {
  return (
    <h3 className="flex justify-between items-center font-sans font-extrabold text-[0.78rem] tracking-[0.2em] uppercase border-t-[3px] border-b border-black py-2 mb-3.5">
      {label}
      <span className="font-mono font-semibold text-[0.62rem] tracking-[0.16em] bg-black text-white px-2 py-0.5">{pill}</span>
    </h3>
  );
}

function TierGrid({ label, italicLabel, trail, trailHref, stories }: { label: string; italicLabel: string; trail: string; trailHref?: string; stories: Story[] }) {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16 border-y-[3px] border-double border-black bg-white">
      <div className="flex items-end gap-5 mb-7 md:mb-9">
        <h3 className="font-display font-black tracking-tighter-2 text-[clamp(1.8rem,2.8vw,2.4rem)] leading-none">
          {label} <em className="italic font-normal">{italicLabel}</em>
        </h3>
        <div className="flex-1 h-px bg-black mb-2" />
        {trailHref
          ? <a href={trailHref} target="_blank" rel="noopener" className="font-sans text-[0.78rem] font-bold tracking-[0.12em] uppercase border-[1.5px] border-black px-3.5 py-2 hover:bg-black hover:text-white transition-colors">{trail}</a>
          : <span className="font-sans text-[0.78rem] font-bold tracking-[0.12em] uppercase border-[1.5px] border-black px-3.5 py-2">{trail}</span>}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
        {stories.map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noopener" className="flex flex-col gap-3 pb-3.5 border-b border-border group">
            <div className="border border-black overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img!} alt="" className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105" style={{ filter: 'contrast(1.02) saturate(1.05)' }} />
            </div>
            <span className="self-start font-sans text-[0.66rem] font-extrabold tracking-[0.18em] uppercase border-b-2 border-black pb-0.5">{s.section}</span>
            <h4 className="font-display font-extrabold text-[1.15rem] leading-[1.18] tracking-tight group-hover:underline group-hover:underline-offset-[3px] group-hover:decoration-2">
              {beforeItalic(s.title, s.titleItalic)}
              {s.titleItalic && <em className="italic font-normal">{s.titleItalic}</em>}
              {afterItalic(s.title, s.titleItalic)}
            </h4>
            <p className="font-mono text-[0.66rem] font-medium tracking-[0.14em] uppercase text-muted">{s.meta}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
