// Single source of truth for the main navigation.

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
        heading: 'Institution',
        links: [
          { label: 'About MLRIT',        href: '/about' },
          { label: 'Vision and Mission', href: '/about#vision' },
          { label: 'Leadership',         href: '/about#leadership' },
          { label: 'Accreditations',     href: '/iqac' },
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
          { label: 'Academics Overview',           href: '/academics' },
          { label: 'Undergraduate (B.Tech)',        href: '/departments/ug' },
          { label: 'Postgraduate (M.Tech and MBA)', href: '/departments/pg' },
          { label: 'Faculty Profiles',              href: '/departments/faculty-profile' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'ERP', href: '#' },
          { label: 'LMS', href: '#' },
          { label: 'Academic Calendar', href: 'https://mlrit.ac.in/examinations/', external: true },
          { label: 'Exam Portal',       href: 'https://mlrit.ac.in/examinations/', external: true },
        ],
      },
    ],
  },
  {
    label: 'Admissions',
    cols: [
      {
        heading: 'Undergraduate',
        links: [
          { label: 'How to Apply', href: 'https://mlrit.ac.in/admissions/', external: true },
          { label: 'Eligibility', href: 'https://mlrit.ac.in/admissions/', external: true },
          { label: 'Fee Structure', href: 'https://mlrit.ac.in/admissions/', external: true },
          { label: 'Scholarships', href: 'https://mlrit.ac.in/scholarships/', external: true },
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
          { label: 'Overview', href: '/research' },
          { label: 'Research Centers', href: '/research/centers' },
          { label: 'Sponsored Projects', href: '/research/sponsored-projects' },
          { label: 'Research Scholars', href: '/research/scholars' },
          { label: 'Doctoral Faculty', href: '/research/doctoral-faculty' },
          { label: 'IPFC Centre', href: '/research/ipfc' },
        ],
      },
      {
        heading: 'Resources',
        links: [
          { label: 'Publications', href: '/research/publications' },
          { label: 'Patents (IPRs)', href: '/research/patents' },
          { label: 'Consultancy', href: '/research/consultancy' },
          { label: 'Entrepreneurship', href: '/research/entrepreneurship' },
          { label: 'Policies and Forms', href: '/research/policies' },
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
          { label: 'Hostels', href: '#' },
          { label: 'Sports', href: '#' },
          { label: 'Cafeteria', href: '#' },
          { label: 'Transport', href: '#' },
        ],
      },
      {
        heading: 'Student Life',
        links: [
          { label: 'Clubs and Societies', href: '#' },
          { label: 'Events', href: '/#events' },
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
