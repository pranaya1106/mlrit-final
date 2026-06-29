import Link from 'next/link';

const EXAMS_NAV = [
  { label: 'Overview',        href: '/examinations' },
  { label: 'Timetable',       href: '/examinations/timetable' },
  { label: 'Regulations',     href: '/examinations/regulations' },
  { label: 'Circulars',       href: '/examinations/circulars' },
  { label: 'Support',         href: '/examinations/support' },
];

export default function ExaminationsQuickNav({ active }: { active: string }) {
  return (
    <nav className="bg-white border-b border-border sticky top-[var(--header-h)] z-30">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {EXAMS_NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 px-4 py-4 font-sans font-medium text-[0.88rem] border-b-2 transition-all whitespace-nowrap ${
                l.href === active
                  ? 'text-foreground border-primary font-semibold'
                  : 'text-muted hover:text-foreground border-transparent hover:border-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
