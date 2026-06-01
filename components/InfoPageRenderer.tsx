'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import PageHeader from '@/components/PageHeader';
import type { InfoPage, InfoBlock } from '@/lib/info-pages';

export default function InfoPageRenderer({ page }: { page: InfoPage }) {
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        italic={page.italic}
        dek={page.dek}
        crumbs={page.crumbs}
      />
      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 space-y-14 md:space-y-20">
          {page.blocks.map((block, i) => (
            <Block key={i} block={block} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}

function Block({ block, index }: { block: InfoBlock; index: number }) {
  switch (block.kind) {
    case 'lead':
      return (
        <Reveal>
          <p className="text-foreground/85 text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.55] font-sans font-medium max-w-[820px]">
            {block.text}
          </p>
        </Reveal>
      );

    case 'paragraph':
      return (
        <Reveal>
          <p className="text-muted leading-[1.8] text-[1.02rem] max-w-[760px]">{block.text}</p>
        </Reveal>
      );

    case 'bullets':
      return (
        <Reveal>
          {block.title && (
            <h3 className="font-sans font-extrabold text-foreground text-[clamp(1.25rem,1.8vw,1.65rem)] tracking-tighter-2 mb-6">
              {block.title}
            </h3>
          )}
          <ul className="space-y-3.5">
            {block.items.map((item) => (
              <li key={item} className="flex items-start gap-3.5 text-foreground/85 leading-[1.7] text-[1.02rem]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      );

    case 'stat-grid':
      return (
        <Stagger className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6" delay={0.06}>
          {block.items.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-2xl border border-border bg-cream p-7 hover:-translate-y-1 hover:shadow-card-soft transition-all duration-300 h-full">
                <div className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3vw,2.6rem)] leading-none">
                  {s.num}
                </div>
                <div className="mt-3 font-mono text-[0.66rem] tracking-[0.18em] uppercase text-muted leading-tight">
                  {s.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      );

    case 'cards':
      return (
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" delay={0.06}>
          {block.items.map((c) => {
            const inner = (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-border bg-white p-7 h-full hover:border-primary hover:shadow-card-soft transition-all duration-300"
              >
                <h3 className="font-sans font-extrabold text-foreground text-[1.15rem] tracking-tighter-2 leading-tight">
                  {c.title}
                </h3>
                <p className="mt-3 text-muted leading-relaxed text-[0.96rem]">{c.body}</p>
                {c.href && (
                  <div className="mt-5 inline-flex items-center gap-1.5 text-primary font-sans font-bold text-[0.86rem]">
                    Learn more <span>→</span>
                  </div>
                )}
              </motion.div>
            );
            return (
              <StaggerItem key={c.title}>
                {c.href ? (
                  <Link href={c.href} className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      );

    case 'quote':
      return (
        <Reveal>
          <div className="border-l-[3px] border-primary pl-7 md:pl-10 max-w-[820px]">
            <span aria-hidden className="font-display text-primary text-[5rem] leading-[0.7] block">&ldquo;</span>
            <p className="font-display italic font-medium text-foreground text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.4] tracking-tight">
              {block.text}
            </p>
            <div className="mt-7 flex items-center gap-4">
              <span className="w-12 h-px bg-primary" />
              <div>
                <div className="font-sans font-bold text-foreground text-[0.98rem]">{block.attribution}</div>
                {block.role && <div className="text-muted text-[0.86rem] mt-0.5">{block.role}</div>}
              </div>
            </div>
          </div>
        </Reveal>
      );

    case 'cta':
      return (
        <Reveal>
          <a
            href={block.href}
            target={block.external ? '_blank' : undefined}
            rel={block.external ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-white font-sans font-bold text-[0.92rem] hover:bg-primary transition-colors"
          >
            {block.label}
          </a>
        </Reveal>
      );

    default:
      void index;
      return null;
  }
}
