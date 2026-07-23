// Single source of truth for the main navigation.
// Mirrors the reference site (mlrit-next-js.vercel.app) link structure
// so every nav target resolves to a real, on-site page.

export type NavItem = {
  label: string;
  href?: string;
  cols?: NavDropdownCol[];
  /** Minimum column width in px for this dropdown. Defaults to 180. */
  colMinWidth?: number;
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
          { label: 'Overview',            href: '/about' },
          { label: 'Vision & Mission',    href: '/about/vision-mission/vision-mission' },
          { label: 'Legacy',              href: '/about/legacy' },
          { label: 'Rankings & Awards',   href: '/about/rankings-awards' },
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
    label: 'Life at MLR',
    colMinWidth: 200,
    cols: [
      {
        heading: 'Explore',
        links: [
          // TODO: replace interim routes once /student-life/* pages are built
          { label: 'Overview',                    href: '/student-life' },
          { label: 'Discover MLR',                href: '/campus/sports' },    // interim → /student-life/discover-mlr
          { label: 'Facilities & Amenities', href: '/student-life/facilities' },
          { label: 'Hostel',                      href: '/campus/hostels' },
          { label: 'Sports',                      href: '/campus/sports' },
          { label: 'Transport',                   href: '/campus/transport' },
        ],
      },
      {
        heading: 'Student Community',
        links: [
          { label: 'Student Clubs', href: '/campus/clubs' },
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
          { label: 'Support',             href: '/research/support' },
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
          { label: 'AQAR', href: '/iqac/aqar' },
          { label: 'NBA',  href: '/iqac/nba' },
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
          { label: 'Overview',      href: '/examinations' },
          { label: 'Timetable',     href: '/examinations/timetable' },
          { label: 'Regulations',   href: '/examinations/regulations' },
          { label: 'Support',       href: '/examinations/support' },
        ],
      },
    ],
  },
  {
    label: 'Placements',
    href: '/placements',
    cols: [
      {
        heading: 'Placements',
        links: [
          { label: 'Overview',             href: '/placements/overview'             },
          { label: 'Statistics',           href: '/placements/statistics'           },
          { label: 'Industry Readiness',   href: '/placements/industry-readiness'   },
          { label: 'Global Certification', href: '/placements/global-certification' },
          { label: 'MoUs & Partnerships',  href: '/placements/mous'                 },
          { label: 'Alumni',               href: '/placements/alumni'               },
          { label: 'Reach Placements At',  href: '/placements/support'              },
        ],
      },
    ],
  },
];

export const NAV_RIGHT: NavItem = {
  label: 'MLRIT Chronicles',
  href: '/chronicles',
};
