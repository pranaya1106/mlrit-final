// Single source of truth for the main navigation.
// Mirrors the reference site (mlrit-next-js.vercel.app) link structure
// so every nav target resolves to a real, on-site page.

export type NavItem = {
  label: string;
  href?: string;
  cols?: NavDropdownCol[];
};

export type NavDropdownCol = {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
};

export const NAV_PRIMARY: NavItem[] = [
  {
    label: 'About',
    cols: [
      {
        heading: 'About',
        links: [
          { label: 'About MLRIT',         href: '/about' },
          { label: 'Introduction',        href: '/about/vision-mission/introduction' },
          { label: 'Vision & Mission',    href: '/about/vision-mission/vision-mission' },
          { label: 'Legacy',              href: '/about/legacy' },
          { label: 'Rankings & Awards',   href: '/about/rankings-awards' },
          { label: 'Brochure',            href: '/about/brochure' },
        ],
      },
      {
        heading: 'Internal Governance',
        links: [
          { label: 'Internal Governance', href: '/about/internal-governance' },
        ],
      },
    ],
  },
  {
    label: 'Academics',
    cols: [
      {
        heading: 'Programmes',
        links: [
          { label: 'Academics Overview',            href: '/academics' },
          { label: 'Undergraduate (B.Tech)',        href: '/departments/ug' },
          { label: 'Postgraduate (M.Tech and MBA)', href: '/departments/pg' },
          { label: 'Faculty Profiles',              href: '/departments/faculty-profile' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'ERP',               href: 'https://mlrit.ac.in/', external: true },
          { label: 'LMS',               href: 'https://mlrit.ac.in/', external: true },
          { label: 'Academic Calendar', href: 'https://mlrit.ac.in/examinations/', external: true },
          { label: 'Edmit · Course Registration', href: 'https://mlrit.ac.in/admissions/', external: true },
          { label: 'Exam Portal',       href: 'https://mlrit.ac.in/examinations/', external: true },
        ],
      },
    ],
  },
  {
    label: 'Admissions',
    href: '/admissions',
    cols: [
      {
        heading: 'Apply',
        links: [
          { label: 'Overview',          href: '/admissions' },
          { label: 'Counselling',       href: '/admissions/counselling' },
          { label: 'Scholarships',      href: '/admissions/scholarships' },
          { label: 'Support & FAQ',     href: '/admissions/support' },
        ],
      },
      {
        heading: 'Information',
        links: [
          { label: 'Fees',              href: '/admissions/fees' },
          { label: 'Why MLRIT',         href: '/admissions/why-mlrit' },
          { label: 'Admission Policies',href: '/admissions/policies' },
        ],
      },
    ],
  },
  {
    label: 'Research',
    cols: [
      {
        heading: 'Programmes',
        links: [
          { label: 'Overview',           href: '/research' },
          { label: 'Research Centers',   href: '/research/centers' },
          { label: 'Sponsored Projects', href: '/research/sponsored-projects' },
          { label: 'Research Scholars',  href: '/research/scholars' },
          { label: 'Doctoral Faculty',   href: '/research/doctoral-faculty' },
          { label: 'IPFC Centre',        href: '/research/ipfc' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Publications',        href: '/research/publications' },
          { label: 'Patents (IPRs)',      href: '/research/patents' },
          { label: 'Consultancy',         href: '/research/consultancy' },
          { label: 'Entrepreneurship',    href: '/research/entrepreneurship' },
          { label: 'Policies and Forms',  href: '/research/policies' },
        ],
      },
    ],
  },
  {
    label: 'Campus',
    cols: [
      {
        heading: 'Facilities',
        links: [
          { label: 'Hostels',    href: '/campus/hostels' },
          { label: 'Sports',     href: '/campus/sports' },
          { label: 'Cafeteria',  href: '/campus/cafeteria' },
          { label: 'Transport',  href: '/campus/transport' },
        ],
      },
      {
        heading: 'Student Life',
        links: [
          { label: 'Clubs and Societies', href: '/campus/clubs' },
          { label: 'Events',              href: '/campus/events' },
        ],
      },
    ],
  },
  {
    label: 'IQAC',
    cols: [
      {
        heading: 'Quality',
        links: [
          { label: 'IQAC', href: '/iqac' },
          { label: 'NAAC', href: 'https://naac.mlrit.ac.in/', external: true },
          { label: 'NBA',  href: '/accreditation/nba' },
        ],
      },
    ],
  },
  {
    label: 'Examinations',
    href: '/examinations',
    cols: [
      {
        heading: 'Examinations',
        links: [
          { label: 'Overview',          href: '/examinations' },
          { label: 'Circulars',         href: '/examinations/circulars' },
          { label: 'Timetable',         href: '/examinations/timetable' },
          { label: 'Regulations',       href: '/examinations/regulations' },
          { label: 'Academic Calendar', href: '/examinations#calendars' },
          { label: 'Syllabus Explorer', href: '/examinations/syllabus' },
        ],
      },
      {
        heading: 'Portal',
        links: [
          { label: 'Results',           href: 'https://exams.mlrinstitutions.ac.in/', external: true },
          { label: 'Fee Payments',      href: 'https://exams.mlrinstitutions.ac.in/', external: true },
          { label: 'Previous Papers',   href: 'https://exams.mlrinstitutions.ac.in/Old_Qp/Old_QP.html', external: true },
        ],
      },
    ],
  },
  { label: 'Placements', href: '/placements' },
];

export const NAV_RIGHT: NavItem = {
  label: 'MLRIT Chronicles',
  href: '/chronicles',
};
