'use client';

/** CIE — Events ("The record") as a turnable wheel of posters. */

import { SectionHead } from './cieShared';
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel';

const EVENTS = [
  { name: 'Workshop Carnival 2.0', poster: '/images/clubs/cie/events/wc-2.png' },
  { name: 'Business to Brand',     poster: '/images/clubs/cie/events/b2b.png' },
  { name: 'Equinox E-Summit',      poster: '/images/clubs/cie/events/equinox.png' },
  { name: 'GI Mahotsav 2024',      poster: '/images/clubs/cie/events/gi.png' },
  { name: 'Workshop Carnival',     poster: '/images/clubs/cie/events/wc.png' },
  { name: 'MetaLoop',              poster: '/images/clubs/cie/events/metaloop.png' },
  { name: 'Hustle Mania',          poster: '/images/clubs/cie/events/hustle-mania.png' },
];

const ITEMS: WorksWheelItem[] = EVENTS.map((e) => ({ title: e.name, image: e.poster }));

export default function CieEvents() {
  return (
    <section id="events" className="relative bg-black py-20 md:py-32 overflow-hidden border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHead
          eyebrow="Archive"
          index="§ events"
          title={<>Where ideas went public.</>}
          lead="Scroll or drag to turn the wheel — every edition the club has run."
        />

        {/* Framed stage — clips the drum cleanly and keeps the index clear of
            the page's floating side rail. */}
        <div className="relative mt-10 md:mt-14 md:mr-10 lg:mr-14 h-[68vh] min-h-[500px] max-h-[760px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.035] to-transparent">
          <WorksWheel items={ITEMS} label="The record" ratio={0.74} />
        </div>
      </div>
    </section>
  );
}
