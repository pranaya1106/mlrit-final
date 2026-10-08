const CHRONICLES_NAV = [
  { label: 'Front Page',     href: '#top' },
  { label: 'Recent Stories', href: '#recent' },
  { label: 'In Brief',       href: '#brief' },
  { label: 'More Stories',   href: '#issue' },
  { label: 'Photo Essay',    href: '#photo-essay' },
  { label: 'Archive',        href: '#archive' },
];

export default function ChroniclesQuickNav() {
  return (
    <nav
      aria-label="Chronicles sections"
      className="bg-white border-b border-black/20 sticky top-[var(--subnav-top)] z-30 transition-[top] duration-300 ease-out-quart"
    >
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Mobile: 3×2 grid so every section is visible — a sideways scroll
            gave no hint the row continued. Hairlines come from gap-px over the
            tinted background. md+ is the original single scrolling row. */}
        <div className="grid grid-cols-3 gap-px bg-black/15 md:bg-transparent md:gap-0 md:flex md:items-center md:overflow-x-auto md:divide-x md:divide-black/15" style={{ scrollbarWidth: 'none' }}>
          {CHRONICLES_NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 bg-white text-center md:text-left px-1 py-2.5 md:px-4 md:py-3 font-sans font-bold uppercase text-[0.6rem] md:text-[0.7rem] tracking-[0.08em] md:tracking-[0.15em] text-black hover:bg-black hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
