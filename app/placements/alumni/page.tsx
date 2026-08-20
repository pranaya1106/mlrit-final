'use client';

import Reveal from '@/components/motion/Reveal';
import AlumniGlobe from '@/components/placements/AlumniGlobe';
import PageHeader from '@/components/PageHeader';
import PlacementsQuickNav from '@/components/PlacementsQuickNav';
import { usePathname } from 'next/navigation';
import SideQuickNav from '@/components/SideQuickNav';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const NAV_ITEMS = [
  { id: 'alumni', label: 'Alumni' },
];

export default function PlacementsAlumniPage() {
  const pathname = usePathname();
  return (
    <main>
      <PageHeader
        eyebrow="Placements"
        title="Alumni"
        italic="worldwide."
        dek="7,000+ MLRIT alumni working at leading MNCs and startups across the globe."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Placements', href: '/placements/overview' }, { label: 'Alumni' }]}
        variant="green"
      />
      <PlacementsQuickNav active={pathname} />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      {/* Re-Member section */}
      <section id="alumni" className="bg-ink text-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <div className="max-w-[760px]">
            <Reveal>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Alumni Network</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.04]">
                Re-<span className="font-display italic font-medium text-warm">Member.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-white/65 leading-relaxed text-[1.06rem] max-w-[640px]">
                Remember the late nights before exams, the friendships forged over group projects, the thrill of your first placement call?
                Re-Member is MLRIT&apos;s invitation to return — as a part of the community that shaped you.
              </p>
              <p className="mt-4 text-white/55 leading-relaxed text-[0.96rem] max-w-[600px]">
                Reconnect with batchmates, mentor current students, attend alumni events, and stay part of an institution that never stopped being your home.
                Whether you graduated last year or two decades ago, your story is still part of MLRIT&apos;s story.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 grid sm:grid-cols-3 gap-5">
                {[
                  { title: 'Reconnect', body: 'Find former batchmates and faculty. Stay in touch with the people who mattered.' },
                  { title: 'Mentor', body: 'Guide current students with your experience. Your insight can open the right door at the right time.' },
                  { title: 'Contribute', body: 'Participate in placement drives, guest lectures, and alumni-student events on campus.' },
                ].map((card, i) => (
                  <div key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="w-2 h-2 rounded-full bg-warm mb-3" aria-hidden />
                    <h3 className="font-sans font-semibold text-white text-[0.95rem] mb-1">{card.title}</h3>
                    <p className="text-white/50 text-[0.82rem] leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-10 flex flex-wrap gap-4 items-center">
                {/* Alumni portal URL not yet confirmed — link intentionally withheld */}
                <span
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-warm text-white font-semibold text-[0.92rem] cursor-not-allowed opacity-70"
                  aria-label="Alumni portal — link coming soon"
                  title="Alumni portal link pending confirmation"
                >
                  Alumni Portal — Coming Soon
                </span>
                <a
                  href="mailto:placements@mlrinstitutions.ac.in"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/80 font-semibold text-[0.92rem] hover:border-warm/50 hover:text-white transition-all"
                >
                  Contact T&P Cell
                </a>
              </div>
              <p className="mt-3 font-mono text-[0.68rem] text-white/30 tracking-wide">
                Alumni portal link will be published once confirmed by the institution.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Globe — alumni across the world */}
      <AlumniGlobe />

        </div>
      </div>
    </main>
  );
}
