'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const AREAS = [
  { href: '/research/centers',            label: 'Research Centres',   desc: 'Three JNTUH-recognised centres — CSE, ECE, Mechanical.',                 tone: 'green' },
  { href: '/research/sponsored-projects', label: 'Sponsored Projects', desc: 'DST, AICTE, DRDO, DBT, MSME and industry-funded projects.',              tone: 'orange' },
  { href: '/research/scholars',           label: 'Research Scholars',  desc: 'Full-time and part-time Ph.D. scholars under recognised guides.',        tone: 'green' },
  { href: '/research/doctoral-faculty',   label: 'Doctoral Faculty',   desc: 'Recognised research supervisors by department and specialisation.',      tone: 'orange' },
  { href: '/research/ipfc',               label: 'IPFC Centre',        desc: 'MSME-supported Intellectual Property Facilitation Centre, est. 2019.',   tone: 'green' },
  { href: '/research/publications',       label: 'Publications',       desc: 'Year-wise journal and conference publications from 2016 onwards.',      tone: 'orange' },
  { href: '/research/patents',            label: 'Patents (IPRs)',     desc: 'Filed, published and granted patents — plus how to file your own.',      tone: 'green' },
  { href: '/research/consultancy',        label: 'Consultancy',        desc: 'Industry, MSME and government engagements via labs and faculty.',        tone: 'orange' },
  { href: '/research/entrepreneurship',   label: 'Entrepreneurship',   desc: 'Innovation Cell, incubation, IP and mentorship for ventures.',           tone: 'green' },
  { href: '/research/policies',           label: 'Policies & Forms',   desc: 'IP, R&D, Consultancy and Innovation policies — plus all forms.',         tone: 'orange' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function ResearchAreasGrid() {
  return (
    <section className="relative bg-cream-2 py-14 md:py-20 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-primary/[0.05] blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#1F6B24]/[0.05] blur-[110px]" />

      <div className="relative w-full px-6 md:px-10 lg:px-12">
        <div className="max-w-[820px] mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-extrabold tracking-[0.24em] uppercase text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Explore the Research Section
          </span>
          <h2 className="mt-4 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,4vw,3.4rem)] leading-[1.02]">
            Ten pillars of{' '}
            <span
              className="font-display italic font-medium"
              style={{
                backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent', color: 'transparent',
              }}
            >
              MLRIT research.
            </span>
          </h2>
          <p className="mt-4 text-muted leading-relaxed text-[clamp(1rem,1.1vw,1.15rem)] max-w-[720px]">
            Centres, scholars, projects, publications, patents — and the policies behind it all. Start anywhere.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {AREAS.map(({ href, label, desc, tone }, i) => {
            const green = tone === 'green';
            return (
              <motion.div key={href} variants={item}>
                <Link
                  href={href}
                  className="group relative block rounded-3xl bg-white border border-border p-7 h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,0,0,0.18)] hover:border-transparent overflow-hidden"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      green
                        ? 'bg-gradient-to-br from-[#1F6B24] via-[#2a8a3d] to-[#3aa050]'
                        : 'bg-gradient-to-br from-[#c26a2b] via-[#d97b3a] to-[#e08a3a]'
                    }`}
                  />
                  <span
                    aria-hidden
                    className="absolute -top-2 -right-2 font-display italic font-black text-[6.5rem] leading-none tracking-tighter-2 text-foreground/[0.04] group-hover:text-white/15 transition-colors duration-500 select-none"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative">
                    <span
                      className={`inline-block font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase transition-colors duration-500 ${
                        green
                          ? 'text-primary group-hover:text-white/80'
                          : 'text-secondary group-hover:text-white/80'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')} · Research
                    </span>

                    <h3 className="mt-4 font-sans font-extrabold text-foreground text-[1.3rem] tracking-tight leading-snug group-hover:text-white transition-colors duration-500">
                      {label}
                    </h3>
                    <p className="mt-3 text-muted text-[0.94rem] leading-relaxed group-hover:text-white/85 transition-colors duration-500">
                      {desc}
                    </p>

                    <div className="mt-6 font-sans font-bold text-[0.85rem] text-primary group-hover:text-white transition-colors duration-500">
                      Explore →
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
