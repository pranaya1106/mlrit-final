import Link from 'next/link';
import { NAV_PRIMARY, NAV_RIGHT } from '@/lib/nav';
import { ChevronRight } from './icons';

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-[1000] bg-white border-b border-border">
      {/* MASTHEAD */}
      <div className="bg-white">
        <div className="flex items-center justify-start gap-7 px-7 py-3 min-h-[78px]">
          {/* Logo */}
          <Link href="/" aria-label="MLRIT Home" className="flex-shrink-0">
            <img
              src="/legacy/mlrit-logo-main.png"
              alt="MLRIT Logo"
              className="h-14 w-auto"
            />
          </Link>

          {/* Institute block */}
          <div className="flex flex-col items-start pl-6 border-l border-[#e5e2db]">
            <div className="font-extrabold text-[1.02rem] text-foreground tracking-wide">
              M<span className="text-primary mx-0.5 font-black">·</span>L
              <span className="text-primary mx-0.5 font-black">·</span>R
            </div>
            <div className="font-display italic text-[0.86rem] text-neutral-800 mt-1">
              Institute of Technology
            </div>
            <div className="w-8 h-0.5 bg-primary rounded my-1.5" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                <span className="font-mono font-bold text-[0.56rem] tracking-[0.14em] uppercase text-primary">EST · 2005</span>
              </span>
              <span className="font-mono font-bold text-[0.56rem] tracking-[0.12em] uppercase text-neutral-500">DUNDIGAL · HYDERABAD</span>
              <span className="font-mono font-bold text-[0.56rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full border border-[#f0d28e] text-[#a07820] bg-[#fffbf0]">AUTONOMOUS · UGC '15</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-3" />

          {/* Contact CTA */}
          <Link
            href="/admissions/support"
            className="inline-flex flex-shrink-0 items-center gap-2.5 h-10 pl-3 pr-5 rounded-[10px] bg-primary text-white font-semibold text-[0.86rem] border border-primary transition-all duration-300 ease-out-quart hover:bg-primary-hover hover:shadow-primary-glow hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-md bg-white/20">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            Contact Us
          </Link>
        </div>
      </div>

      {/* MAIN NAV (green) */}
      <nav className="bg-green-nav text-white shadow-[0_4px_16px_rgba(1,116,31,0.18)]" aria-label="Main">
        <ul className="flex items-stretch px-6">
          {NAV_PRIMARY.map((item) => (
            <li key={item.label} className="group relative flex-shrink-0">
              {item.href && !item.cols ? (
                <Link
                  href={item.href}
                  className="flex items-center h-[52px] px-3 text-[0.92rem] font-medium tracking-[-0.005em] hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-1 h-[52px] px-3 text-[0.92rem] font-medium tracking-[-0.005em] hover:bg-white/10 transition-colors"
                >
                  {item.label}
                  <span className="inline-block w-1.5 h-1.5 border-r border-b border-white/70 -rotate-45 translate-y-[-2px] ml-0.5" />
                </button>
              )}
              {/* Dropdown */}
              {item.cols && (
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 top-full mt-1.5 bg-white border border-border rounded-2xl shadow-[0_18px_48px_rgba(17,17,17,0.10)] p-6 grid gap-6 min-w-max z-50"
                     style={{ gridTemplateColumns: `repeat(${item.cols.length}, minmax(180px, 1fr))` }}>
                  {item.cols.map((col) => (
                    <div key={col.heading}>
                      <h4 className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted mb-3">
                        {col.heading}
                      </h4>
                      <ul className="space-y-1.5">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              target={link.external ? '_blank' : undefined}
                              rel={link.external ? 'noopener' : undefined}
                              className="block text-[0.92rem] font-medium text-foreground hover:text-primary hover:bg-orange-50 rounded-lg px-2 py-1.5 transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
          {/* Right item — pushed to the right edge */}
          <li className="ml-auto flex-shrink-0">
            <Link
              href={NAV_RIGHT.href ?? '#'}
              className="flex items-center h-[52px] px-3 text-[0.92rem] font-medium tracking-[-0.005em] whitespace-nowrap hover:bg-white/10 transition-colors"
            >
              {NAV_RIGHT.label}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
