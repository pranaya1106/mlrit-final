'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, FileText, GraduationCap, Newspaper,
  ArrowRight, User, FlaskConical
} from 'lucide-react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { NAV_PRIMARY } from '@/lib/nav';
import { DEPARTMENTS } from '@/lib/departments';
import { DEPT_DATA } from '@/lib/dept-data';
import { LEAD, MID_STORIES, ARCHIVE, TIER_STORIES } from '@/lib/chronicles';
import { FACULTY } from '@/lib/faculty';
import { SYLLABUS_DATA } from '@/lib/syllabus-data';
import { RESEARCH_NAV } from '@/lib/research';
import { RECRUITERS, YEAR_STATS } from '@/lib/placements';
import { BUS_ROUTES } from '@/lib/transport-routes';
import { cn } from '@/lib/utils';

// ─── Utility helpers (inlined — ChroniclesClient is not a separate file yet) ─

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function mapStorySectionToTab(section: string): string {
  const s = section.toLowerCase();
  if (s.includes('front') || s.includes('lead')) return 'Front Page';
  if (s.includes('placement') || s.includes('industry')) return 'Placements';
  if (s.includes('research') || s.includes('innovation') || s.includes('academic') || s.includes('recognition') || s.includes('aero')) return 'Research';
  if (s.includes('sport')) return 'Sports';
  if (s.includes('voice') || s.includes('student')) return 'Student Voice';
  if (s.includes('alumni')) return 'Alumni';
  if (s.includes('event') || s.includes('festival')) return 'Events';
  if (s.includes('faculty')) return 'Faculty';
  if (s.includes('opinion')) return 'Opinion';
  if (s.includes('archive')) return 'Archive';
  return 'Campus';
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SearchItem = {
  title: string;
  description: string;
  url: string;
  type: 'page' | 'department' | 'faculty' | 'lab' | 'news';
  category?: string;
  keywords?: string;
  /** Exact tokens (slug, code, name) this item should match on for top-tier ranking. */
  exactKeys?: string[];
};

const TYPE_CONFIG = {
  page: {
    icon: FileText,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    label: 'Page',
  },
  department: {
    icon: GraduationCap,
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    label: 'Dept',
  },
  faculty: {
    icon: User,
    bg: 'bg-green-50',
    text: 'text-green-700',
    label: 'Faculty',
  },
  lab: {
    icon: FlaskConical,
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    label: 'Lab',
  },
  news: {
    icon: Newspaper,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    label: 'News',
  },
} as const;

const QUICK_LINKS = [
  { label: 'Admissions', href: '/admissions' },
  { label: 'Placements', href: '/placements' },
  { label: 'Academics', href: '/academics' },
  { label: 'MLRIT Chronicles', href: '/chronicles' },
];

const NO_RESULTS_SUGGESTIONS = ['Admissions', 'Departments', 'Placements', 'Faculty'];

// ─── Ranking ─────────────────────────────────────────────────────────────────
// This RE-ORDERS the full match set — it never removes a relevant result.
// getTier is a pure function of (item, query): every item the search finds
// gets a tier number, the list is sorted by it, and the complete list is
// still shown. Priority: exact department > related department variant (e.g.
// CSE-DS for "cse") > faculty > laboratories > pages (incl. research/events)
// > chronicles (fallback — never above real content) > fuzzy/typo matches.

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

function isExactMatch(item: SearchItem, q: string): boolean {
  return !!item.exactKeys?.includes(q);
}

function isPartialMatch(item: SearchItem, q: string): boolean {
  const haystacks = [item.title, item.description, item.keywords, ...(item.exactKeys ?? [])]
    .filter((s): s is string => !!s)
    .map((s) => s.toLowerCase());
  return haystacks.some((h) => h.includes(q));
}

function getTier(item: SearchItem, q: string): number {
  const exact = isExactMatch(item, q);
  const literal = exact || isPartialMatch(item, q);

  // A pure fuzzy/typo hit (no literal match anywhere) is always the lowest
  // priority, but it's still included in the results, never dropped.
  if (!literal) return 10;

  if (item.type === 'department') return exact ? 0 : 1;
  if (item.type === 'faculty') return exact ? 2 : 3;
  if (item.type === 'lab') return exact ? 4 : 5;
  if (item.type === 'page') return exact ? 6 : 7;
  // Chronicles is always a fallback tier — never above real content, but
  // still present in the list, not hidden.
  return exact ? 8 : 9;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'page' | 'department' | 'faculty' | 'lab' | 'news'>('all');

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchIndex = useRef<SearchItem[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Build search index once
  useEffect(() => {
    const items: SearchItem[] = [];

    // Navigation pages
    NAV_PRIMARY.forEach((nav) => {
      if (nav.href) {
        items.push({
          title: nav.label,
          description: `Navigate to ${nav.label}`,
          url: nav.href,
          type: 'page',
          exactKeys: [nav.label.toLowerCase()],
        });
      }
      nav.cols?.forEach((col) => {
        col.links.forEach((link) => {
          items.push({
            title: link.label,
            description: `${col.heading} · ${nav.label}`,
            url: link.href,
            type: 'page',
            category: nav.label,
            exactKeys: [link.label.toLowerCase()],
          });
        });
      });
    });

    // Library lives on the external site — still a real, first-class destination.
    items.push({
      title: 'Library',
      description: 'Campus library — books, digital resources and reading spaces',
      url: 'https://mlrit.ac.in/campus-life/library/',
      type: 'page',
      category: 'Campus',
      exactKeys: ['library'],
    });

    // Departments
    DEPARTMENTS.forEach((dept) => {
      items.push({
        title: dept.name,
        description: dept.tagline,
        url: `/departments/${dept.slug}`,
        type: 'department',
        category: dept.degree,
        keywords: `${dept.slug} ${dept.code} ${dept.short} engineering technology`,
        exactKeys: [dept.slug, dept.code.toLowerCase(), dept.short.toLowerCase()],
      });
    });

    // Faculty — one entry per real faculty record from lib/faculty.ts (209
    // profiles), linking straight to their own /faculty/[slug] page. Previously
    // sourced from DEPT_DATA[dept.slug].faculty, which is an empty array in
    // every department — that made faculty search silently return zero results.
    const deptShortByKey: Record<string, string> = {};
    DEPARTMENTS.forEach((dept) => {
      deptShortByKey[dept.slug] = dept.short;
    });
    FACULTY.forEach((person) => {
      const cleanName = person.name.replace(/^(dr\.|mr\.|mrs\.|ms\.|miss|prof\.)\s+/i, '');
      const deptShort = deptShortByKey[person.department] ?? person.department.toUpperCase();
      items.push({
        title: person.name,
        description: `${person.designation}${person.isHod ? ' (HOD)' : ''} · ${deptShort}${person.specialization?.[0] ? ` · ${person.specialization[0]}` : ''}`,
        url: `/faculty/${person.slug}`,
        type: 'faculty',
        category: deptShort,
        keywords: `${person.department} ${deptShort} faculty ${person.subjectsTaught.join(' ')}`,
        exactKeys: [
          cleanName.toLowerCase(),
          ...cleanName.toLowerCase().split(/[\s.]+/).filter((w) => w.length > 2),
        ],
      });
    });

    // Laboratories — same department-tagging so "cse" also surfaces CSE's labs.
    DEPARTMENTS.forEach((dept) => {
      const labs = DEPT_DATA[dept.slug]?.labs ?? [];
      labs.forEach((lab) => {
        items.push({
          title: lab.name,
          description: `${dept.short} Laboratory · ${lab.desc}`,
          url: `/departments/${dept.slug}#labs`,
          type: 'lab',
          category: dept.short,
          keywords: `${dept.slug} ${dept.code} ${dept.short} laboratory lab`,
          exactKeys: [lab.name.toLowerCase()],
        });
      });
    });

    // Syllabus — one entry per course, flattened from SYLLABUS_DATA's
    // program -> regulation -> semester(1-8) -> course[] nesting. Searchable
    // by course code, title, program, regulation, or semester phrasing.
    // Reuses the 'page' type — same as any other destination link.
    Object.entries(SYLLABUS_DATA).forEach(([program, regs]) => {
      Object.entries(regs).forEach(([regulation, sems]) => {
        Object.entries(sems).forEach(([semKey, courses]) => {
          const semNum = Number(semKey);
          const year = Math.ceil(semNum / 2);
          const semInYear = semNum - (year - 1) * 2;
          courses.forEach((course) => {
            items.push({
              title: course.title,
              description: `${course.code} · ${program.toUpperCase()} · ${regulation.toUpperCase()} · Semester ${semNum}`,
              url: `/departments/syllabus/${program}/${regulation}/year${year}/sem${semInYear}`,
              type: 'page',
              category: 'Syllabus',
              keywords: `${program} ${regulation} semester ${semNum} year ${year} syllabus course subject curriculum`,
              exactKeys: [course.code.toLowerCase()],
            });
          });
        });
      });
    });

    // Research — Centers, Sponsored Projects, Scholars, Doctoral Faculty,
    // Publications, Patents, Consultancy, Entrepreneurship, Policies, IPFC.
    RESEARCH_NAV.filter((r) => r.slug).forEach((r) => {
      items.push({
        title: r.label,
        description: `Research · ${r.label}`,
        url: `/research/${r.slug}`,
        type: 'page',
        category: 'Research',
        keywords: `research ${r.label.toLowerCase()}`,
        exactKeys: [r.label.toLowerCase(), r.slug.toLowerCase()],
      });
    });

    // Placements — recruiting companies and year-wise statistics, plus fixed
    // contact/officer entry points. Broader "placements" navigation already
    // comes from NAV_PRIMARY above; these add company/year-level granularity.
    RECRUITERS.forEach((company) => {
      items.push({
        title: company,
        description: 'Recruiting company · Placements',
        url: '/placements/recruiters',
        type: 'page',
        category: 'Placements',
        keywords: 'recruiter company placement hiring',
        exactKeys: [company.toLowerCase()],
      });
    });
    YEAR_STATS.forEach((stat) => {
      items.push({
        title: `Placement Statistics ${stat.year}`,
        description: `${stat.offers} offers · ${stat.companies} companies · Highest ${stat.highest} LPA`,
        url: '/placements/statistics',
        type: 'page',
        category: 'Placements',
        keywords: `placement statistics ${stat.year} offers companies package`,
        exactKeys: [stat.year],
      });
    });
    items.push({
      title: 'Placement Officer',
      description: 'Training & Placement Cell contacts · Placements',
      url: '/placements/support',
      type: 'page',
      category: 'Placements',
      keywords: 'placement officer tpo training and placement cell contact',
      exactKeys: ['placement officer', 'tpo'],
    });

    // Administration & key contacts — mirrors the role -> page mapping the
    // chatbot's administration_directory.py already uses (lib/info-pages.ts
    // quote/roster blocks + the section-specific support/page.tsx contact
    // cards) so a role search lands on the same page that carries the name.
    const ADMIN_CONTACTS: { title: string; description: string; url: string; keys: string[] }[] = [
      { title: 'Principal', description: "Principal's Message · About MLRIT", url: '/about/messages/principal', keys: ['principal'] },
      { title: 'Dean, Academics', description: "Dean's Message · About MLRIT", url: '/about/messages/dean', keys: ['dean', 'dean academics'] },
      { title: 'Controller of Examinations', description: 'Examinations contacts & support', url: '/examinations/support', keys: ['controller of examinations', 'coe'] },
      { title: 'Admission Officer', description: 'Admissions key contacts & support', url: '/admissions/support', keys: ['admission officer', 'admissions officer', 'admissions i/c'] },
      { title: 'IQAC Coordinator', description: 'IQAC contacts & support', url: '/iqac/support', keys: ['iqac coordinator', 'iqac head'] },
      { title: 'Chairman, Vice Chairman & Secretary', description: 'KMR Educational Society Governing Body · Legacy', url: '/about/legacy', keys: ['chairman', 'vice chairman', 'secretary'] },
    ];
    ADMIN_CONTACTS.forEach((admin) => {
      items.push({
        title: admin.title,
        description: admin.description,
        url: admin.url,
        type: 'page',
        category: 'Administration',
        keywords: `administration ${admin.keys.join(' ')}`,
        exactKeys: admin.keys,
      });
    });

    // Transport — one entry per bus route, searchable by route number or any
    // stop/destination name along that route.
    BUS_ROUTES.forEach((route) => {
      items.push({
        title: `Route ${route.routeNumber}`,
        description: route.stops.slice(0, 4).join(', ') + (route.stops.length > 4 ? `, +${route.stops.length - 4} more` : ''),
        url: '/campus/transport',
        type: 'page',
        category: 'Transport',
        keywords: `bus route transport ${route.stops.join(' ')}`,
        exactKeys: [`route ${route.routeNumber}`, String(route.routeNumber), ...route.stops.map((s) => s.toLowerCase())],
      });
    });

    // Chronicles / news
    const allStories = [LEAD, ...MID_STORIES, ...ARCHIVE, ...TIER_STORIES];
    allStories.forEach((story) => {
      let keywords = '';
      const sec = story.section.toLowerCase();
      if (sec.includes('sport')) keywords = 'sports cricket swimming football basketball badminton';
      else if (sec.includes('placement') || sec.includes('industry')) keywords = 'placement jobs salary package recruiting intern career';
      else if (sec.includes('research') || sec.includes('innovation') || sec.includes('aero')) keywords = 'research drone robot science innovation project';
      else if (sec.includes('voice')) keywords = 'voice student youth parliament';
      else if (sec.includes('event')) keywords = 'event festival equinox robotek annual day';

      items.push({
        title: story.title,
        description: story.dek ?? '',
        url: `/chronicles?section=${encodeURIComponent(mapStorySectionToTab(story.section))}&story=${slugify(story.title)}`,
        type: 'news',
        category: story.section,
        keywords,
      });
    });

    searchIndex.current = items;
  }, []);

  // Typo-tolerant matching — kept tight (low threshold) so it only adds genuine
  // near-misses. Results from this are MERGED with literal matches (not used
  // only when literal matching finds nothing), so the full relevant set is
  // always gathered — ranking then decides order, never which ones to drop.
  const fuse = useRef<Fuse<SearchItem>>();
  useEffect(() => {
    fuse.current = new Fuse(searchIndex.current, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'description', weight: 0.3 },
        { name: 'category', weight: 0.1 },
        { name: 'keywords', weight: 0.1 },
      ],
      threshold: 0.25,
    });
  }, []);

  // Run search — gather every literal (exact/partial) AND fuzzy match, then
  // rank the complete set by relevance tier (see getTier). Nothing relevant is
  // ever filtered out here; only the display order changes.
  useEffect(() => {
    const q = normalizeQuery(query);
    if (q === '') {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const items = searchIndex.current;
    const literalMatches = items.filter((item) => isExactMatch(item, q) || isPartialMatch(item, q));
    const fuzzyMatches = (fuse.current?.search(query) ?? []).map((r) => r.item);

    const seen = new Set<string>();
    const combined: SearchItem[] = [];
    const tierOverride = new Map<string, number>();
    const keyOf = (item: SearchItem) => `${item.type}:${item.url}:${item.title}`;
    const add = (item: SearchItem) => {
      const key = keyOf(item);
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(item);
      }
      return key;
    };
    [...literalMatches, ...fuzzyMatches].forEach(add);

    // A name search should also surface that person's department, not just the
    // isolated faculty profile — ranked just below the faculty match itself.
    // Faculty items' `keywords` always start with the department slug (see
    // index-build above) — cheaper and more robust than parsing the profile URL.
    const facultySlugs = new Set(
      combined
        .filter((i) => i.type === 'faculty')
        .map((i) => i.keywords?.split(' ')[0])
        .filter((s): s is string => !!s)
    );
    facultySlugs.forEach((slug) => {
      const deptItem = items.find((i) => i.type === 'department' && i.exactKeys?.includes(slug));
      if (deptItem) tierOverride.set(add(deptItem), 2.5);
    });

    const ranked = combined
      .map((item) => ({ item, tier: tierOverride.get(keyOf(item)) ?? getTier(item, q) }))
      .sort((a, b) => a.tier - b.tier)
      .map((r) => r.item);

    const filtered = ranked
      .filter((item) => filter === 'all' || item.type === filter)
      .slice(0, 20);

    setResults(filtered);
    setActiveIndex(-1);
  }, [query, filter]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      }
      if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        const url = results[activeIndex].url;
        onClose();
        window.location.href = url;
      }
    },
    [isOpen, onClose, results, activeIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Open/close behaviour — every open starts clean, no history to restore.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setFilter('all');
    }
  }, [isOpen]);

  const handleResultClick = () => {
    onClose();
  };

  const handleSuggestionClick = (q: string) => {
    setQuery(q);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (!mounted) return null;

  const showEmpty = query.trim() !== '' && results.length === 0;
  const showResults = results.length > 0;
  const showHome = query.trim() === '';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-start justify-center px-4"
          style={{ paddingTop: 'clamp(60px, 12vh, 120px)' }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative w-full max-w-[640px] bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.2)] border border-border overflow-hidden"
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="w-5 h-5 text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                id="search-overlay-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, departments, news…"
                className="flex-1 bg-transparent border-none outline-none text-foreground text-[1rem] placeholder:text-muted/50"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-border/40 rounded-md transition-colors text-muted"
                    title="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-muted bg-border/40 px-1.5 py-0.5 rounded border border-border/60">
                  <span>esc</span>
                </kbd>
              </div>
            </div>

            {/* Filter tabs */}
            {query && (
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/50 bg-[#fafafa]">
                {(['all', 'page', 'department', 'faculty', 'lab', 'news'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all',
                      filter === f
                        ? 'bg-green-700 text-white'
                        : 'text-muted hover:bg-border/40'
                    )}
                  >
                    {f === 'all' ? 'All' : f === 'page' ? 'Pages' : f === 'department' ? 'Depts' : f === 'faculty' ? 'Faculty' : f === 'lab' ? 'Labs' : 'News'}
                  </button>
                ))}
                {results.length > 0 && (
                  <span className="ml-auto text-[10px] text-muted font-mono">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            {/* Body */}
            <div className="max-h-[min(420px,55vh)] overflow-y-auto">

              {/* Results */}
              {showResults && (
                <div ref={listRef} className="p-2">
                  {results.map((item, idx) => {
                    const cfg = TYPE_CONFIG[item.type];
                    const Icon = cfg.icon;
                    return (
                      <Link
                        key={idx}
                        href={item.url}
                        onClick={handleResultClick}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group',
                          idx === activeIndex
                            ? 'bg-green-50 ring-1 ring-green-200'
                            : 'hover:bg-gray-50'
                        )}
                      >
                        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
                          <Icon className={cn('w-4.5 h-4.5', cfg.text)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[0.88rem] text-foreground truncate">{item.title}</span>
                            {item.category && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-muted/60 bg-border/40 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <p className="text-[0.76rem] text-muted truncate mt-0.5">{item.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Empty state */}
              {showEmpty && (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-border/40 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-muted" />
                  </div>
                  <p className="text-muted font-medium">No results found</p>
                  <p className="text-muted/60 text-sm mt-1 mb-4">No matches for &ldquo;{query}&rdquo;</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2.5">
                    Try searching for
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 px-6">
                    {NO_RESULTS_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestionClick(s)}
                        className="text-[12px] font-medium bg-border/30 hover:bg-green-50 hover:text-green-700 text-foreground/80 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Home state */}
              {showHome && (
                <div className="p-4 space-y-5">
                  {/* Quick links */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted mb-2.5 block">
                      Quick Links
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center justify-center text-center p-3 rounded-xl border border-border hover:border-green-300 hover:bg-green-50 transition-all"
                        >
                          <span className="font-medium text-[0.82rem] text-foreground">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="flex items-center gap-2 text-[11px] text-muted/60 border-t border-border/40 pt-3">
                    <span>Use <kbd className="font-mono bg-border/40 px-1 rounded">↑↓</kbd> to navigate, <kbd className="font-mono bg-border/40 px-1 rounded">Enter</kbd> to open, <kbd className="font-mono bg-border/40 px-1 rounded">Esc</kbd> to close</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
