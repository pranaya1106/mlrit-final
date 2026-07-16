import Link from 'next/link';

const ADMISSIONS_NAV = [
  { label: 'Overview',       href: '/admissions' },
  { label: 'Why MLRIT',      href: '/admissions/why-mlrit' },
  { label: 'How to Apply',   href: '/admissions/how-to-apply' },
  { label: 'Eligibility',    href: '/admissions/eligibility' },
  { label: 'Counselling',    href: '/admissions/counselling' },
  { label: 'Fee Structure',  href: '/admissions/fees' },
  { label: 'Scholarships',   href: '/admissions/scholarships' },
  { label: 'Support',        href: '/admissions/support' },
];

export default function AdmissionsQuickNav({ active }: { active: string }) {
  return (
    <nav className="bg-white border-b border-border sticky top-[var(--subnav-top)] z-30 transition-[top] duration-300 ease-out-quart">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {ADMISSIONS_NAV.map((l) => (
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
