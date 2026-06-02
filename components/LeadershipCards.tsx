'use client';

import { useEffect, useRef, useState } from 'react';

const LEADERS = [
  {
    tag: 'Founder',
    name: 'Sri Marri Laxman Reddy',
    role: 'Founder, KMR Educational Society',
    img: '/images/about/milestone-2005.jpg',
    message: 'Our founding vision was simple — give every student from Telangana access to world-class engineering education, right here at home.',
    points: [
      'Established MLRIT in 2005 under the KMR Educational Society',
      'Built a 38-acre campus at Dundigal dedicated entirely to academic excellence',
      'Created an institution that now serves over 7,000 alumni worldwide',
    ],
  },
  {
    tag: 'Patron',
    name: 'Sri Marri Rajashekhar Reddy',
    role: 'Founder Secretary · MLA, Malkajgiri',
    img: '/images/about/milestone-2019.jpg',
    message: 'MLRIT stands as proof that public service and quality education can go hand in hand — shaping engineers who give back to society.',
    points: [
      'Drives governance and institutional vision as Founder Secretary',
      'Ensures MLRIT remains accessible, inclusive and nationally recognised',
      'Champions research, autonomy and industry linkages at board level',
    ],
  },
  {
    tag: 'Leadership',
    name: 'Dr. K. Srinivas Rao',
    role: 'Principal, MLR Institute of Technology',
    img: '/images/about/milestone-2022.jpg',
    message: 'Academic rigour and student welfare are not opposing goals — at MLRIT we have always pursued both, together.',
    points: [
      'Oversees academic programmes across 10 engineering branches and MBA',
      'Leads the institution's NAAC and NBA accreditation cycles',
      'Champions outcome-based education and industry-integrated curriculum',
    ],
  },
  {
    tag: 'Leadership',
    name: 'Dr. P. Rajashekar',
    role: 'Dean, Academics',
    img: '/images/about/milestone-2012.jpg',
    message: 'We design curricula that respond to where industry is going, not just where it has been — that is what autonomous status allows us to do.',
    points: [
      'Architects the autonomous curriculum and examination framework',
      'Leads outcome-based education reforms across all departments',
      'Coordinates faculty development, research cells and academic audits',
    ],
  },
  {
    tag: 'Leadership',
    name: 'Prof. Ravi Chandra P',
    role: 'Head, Training & Placements',
    img: '/images/about/milestone-2026.jpg',
    message: 'Placement is not a season — it is a year-round culture of preparation, industry exposure and relentless follow-through.',
    points: [
      'Leads corporate relations with 200+ hiring partners across India',
      'Delivered 621 placement offers in 2025–26 with ₹51 LPA top package',
      'Runs mock interviews, aptitude labs and soft-skills programmes year-round',
    ],
  },
  {
    tag: 'Leadership',
    name: 'Dr. M. Anitha',
    role: 'Dean, Research & Innovation',
    img: '/images/about/milestone-2017.jpg',
    message: 'Research at MLRIT is not an afterthought — it is embedded in every department, every lab and every faculty development plan.',
    points: [
      'Heads three JNTUH-recognised research centres and the IPFC',
      'Drives patent filings, funded projects and industry-sponsored research',
      'Mentors faculty towards publications, grants and doctoral supervision',
    ],
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

function LeaderCard({ leader, index }: { leader: typeof LEADERS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border bg-white shadow-card-soft
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 -translate-x-16' : 'opacity-0 translate-x-16'}`}
    >
      {/* Image — swaps side based on index */}
      <div className={`relative aspect-[4/3] md:aspect-auto min-h-[260px] overflow-hidden ${isEven ? 'md:order-1' : 'md:order-2'}`}>
        <img
          src={leader.img}
          alt={leader.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* subtle green overlay on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Tag pill on image */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase text-primary border border-primary/20">
          {leader.tag}
        </span>
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-center p-8 md:p-10 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
        {/* Name + role */}
        <div className="mb-5">
          <h3 className="font-sans font-black text-foreground text-[1.4rem] tracking-tight leading-snug">
            {leader.name}
          </h3>
          <p className="mt-1 font-mono text-[0.7rem] font-bold tracking-[0.16em] uppercase text-muted">
            {leader.role}
          </p>
        </div>

        {/* Quote */}
        <blockquote className="relative mb-6 pl-4 border-l-2 border-primary">
          <p className="font-display italic text-[1.05rem] text-foreground/80 leading-relaxed">
            "{leader.message}"
          </p>
        </blockquote>

        {/* Bullet points */}
        <ul className="space-y-2.5">
          {leader.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-muted text-[0.93rem] leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LeadershipCards() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Heading */}
        <div className="mb-14">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">People</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Leadership and{' '}
            <span className="font-display italic font-medium" style={gradientText}>governance.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {LEADERS.map((leader, i) => (
            <LeaderCard key={leader.name} leader={leader} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
