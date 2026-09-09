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
        <div className="flex items-center overflow-x-auto divide-x divide-black/15" style={{ scrollbarWidth: 'none' }}>
          {CHRONICLES_NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 px-4 py-3 font-sans font-bold uppercase text-[0.7rem] tracking-[0.15em] text-black hover:bg-black hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
