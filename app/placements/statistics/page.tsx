import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import PageHeader from '@/components/PageHeader';
import PlacementsQuickNav from '@/components/PlacementsQuickNav';
import PlacementTrackRecord from '@/components/placements/PlacementTrackRecord';
import SideQuickNav from '@/components/SideQuickNav';
import {
  PLACEMENT_HIGHLIGHTS,
  INFRASTRUCTURE_LIST,
  INFRA_STATS,
} from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'statistics', label: 'Statistics' },
];

export default function PlacementsStatisticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Placements"
        title="Year-wise"
        italic="statistics."
        dek="Verified placement outcomes year on year — offers, packages, and company participation from our campus recruitment seasons."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Placements', href: '/placements/overview' }, { label: 'Statistics' }]}
        variant="green"
      />
      <PlacementsQuickNav active="/placements/statistics" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      {/* Headline stats */}
      <section id="statistics" className="bg-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" delay={0.06}>
            {PLACEMENT_HIGHLIGHTS.map((h) => (
              <StaggerItem key={h.label}>
                <div className="rounded-2xl border border-border bg-warm-light p-6 h-full">
                  <div
                    className="font-sans font-black text-foreground leading-none tracking-tighter-2 text-[clamp(1.4rem,2.4vw,2.2rem)]"
                    aria-label={`${h.value} — ${h.label}`}
                  >
                    {h.value}
                  </div>
                  <div className="mt-2 font-sans font-semibold text-foreground text-[0.88rem] leading-snug">{h.label}</div>
                  {h.sub && (
                    <div className="mt-1 font-mono text-[0.62rem] tracking-[0.1em] text-muted/70">{h.sub}</div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Year-on-year track record — client component */}
      <PlacementTrackRecord />

      {/* Infrastructure */}
      <section className="bg-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <Reveal preset="right">
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Facilities</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Placement <span className="font-display italic font-medium" style={gradientText}>infrastructure.</span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-[560px]">
              MLRIT maintains a dedicated placement block equipped to host large-scale campus recruitment drives throughout the year.
            </p>
            <ul className="mt-7 space-y-3.5" aria-label="Infrastructure facilities">
              {INFRASTRUCTURE_LIST.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-5" delay={0.12}>
            {INFRA_STATS.map((s) => (
              <StaggerItem key={s.label}>
                <div className="rounded-2xl bg-warm-light border border-border p-7">
                  <div className="font-sans font-black text-foreground text-[clamp(2rem,3vw,2.6rem)] leading-none tracking-tighter-2">{s.num}</div>
                  <div className="mt-2 font-mono font-semibold text-[0.72rem] tracking-[0.16em] uppercase text-muted">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

        </div>
      </div>
    </>
  );
}
