// MLRIT placement data — authoritative source for all Placements pages.

// ─── Overview highlights ─────────────────────────────────────────────────────

export interface PlacementHighlight {
  value: string;
  label: string;
  sub?: string;
}

export const PLACEMENT_HIGHLIGHTS: PlacementHighlight[] = [
  { value: '81%',     label: 'Students getting placed',       sub: 'Consistently every year'   },
  { value: '21',      label: 'Years of experience',           sub: 'Since inception'            },
  { value: '7000+',   label: 'Alumni placed in MNCs',         sub: 'Across industries'          },
  { value: '200+',    label: 'Campus visiting partners',       sub: 'MNCs to startups'          },
  { value: '₹58 LPA', label: 'Highest package from Microsoft', sub: 'Microsoft SDE · 2023'     },
];

// ─── Overview paragraph ──────────────────────────────────────────────────────

export const PLACEMENT_OVERVIEW =
  'MLR Institute of Technology, in its journey of 21 years, has become a locus yielding academic excellence — consistently achieving 81% and above placements every year in various reputed MNCs across the globe. The Training & Placement Cell transforms an amateur engineering student into a self-motivated professional with versatile domain expertise and multi-tasking abilities, ensuring every graduate is career-ready for the demands of modern industry.';

// ─── Year-wise statistics ────────────────────────────────────────────────────

export interface YearStat {
  year: string;
  offers: number;
  companies: number;
  highest: number;
}

export const YEAR_STATS: YearStat[] = [
  { year: '2026', offers: 544,  companies: 36, highest: 51   },
  { year: '2025', offers: 536,  companies: 62, highest: 33   },
  { year: '2024', offers: 674,  companies: 55, highest: 28.5 },
  { year: '2023', offers: 734,  companies: 32, highest: 58   },
  { year: '2022', offers: 1236, companies: 42, highest: 25   },
  { year: '2021', offers: 740,  companies: 49, highest: 18.1 },
];

export interface RoleRow {
  company: string;
  role: string;
  salary: string;
  selects: number;
}

export const YEAR_ROLES: Record<string, RoleRow[]> = {
  '2025': [
    { company: 'ServiceNow',   role: 'Software Engineer',   salary: '33 LPA',  selects: 4   },
    { company: 'Virtusa',      role: 'Data/AWS Engineer',   salary: '5.5 LPA', selects: 45  },
    { company: 'EPAM Systems', role: 'Fullstack Developer', salary: '8 LPA',   selects: 38  },
    { company: 'TCS',          role: 'Systems Engineer',    salary: '4.0 LPA', selects: 72  },
    { company: 'Capgemini',    role: 'Assoc. Consultant',   salary: '4.5 LPA', selects: 58  },
    { company: 'Infosys',      role: 'Systems Engineer',    salary: '4.0 LPA', selects: 65  },
    { company: 'Wipro',        role: 'Project Engineer',    salary: '4.0 LPA', selects: 52  },
    { company: 'LTI Mindtree', role: 'Software Engineer',   salary: '5.5 LPA', selects: 34  },
    { company: 'NTT Data',     role: 'Associate Analyst',   salary: '4.5 LPA', selects: 28  },
    { company: 'Mphasis',      role: 'Software Engineer',   salary: '4.0 LPA', selects: 22  },
  ],
  '2024': [
    { company: 'Boeing',            role: 'Aerospace Engineer',  salary: '28.5 LPA', selects: 3  },
    { company: 'EPAM Systems',      role: 'Fullstack Developer', salary: '8 LPA',    selects: 42 },
    { company: 'Amazon',            role: 'SDE I',               salary: '12 LPA',   selects: 6  },
    { company: 'Virtusa',           role: 'Data Engineer',       salary: '5.5 LPA',  selects: 48 },
    { company: 'TCS',               role: 'Systems Engineer',    salary: '4.0 LPA',  selects: 88 },
    { company: 'Infosys',           role: 'Systems Engineer',    salary: '4.0 LPA',  selects: 76 },
    { company: 'Capgemini',         role: 'Assoc. Consultant',   salary: '4.5 LPA',  selects: 64 },
    { company: 'Tata Technologies', role: 'Design Engineer',     salary: '4.5 LPA',  selects: 52 },
    { company: 'Tech Mahindra',     role: 'Software Engineer',   salary: '4.0 LPA',  selects: 46 },
    { company: 'Optum',             role: 'Associate Developer', salary: '5.8 LPA',  selects: 38 },
  ],
  '2023': [
    { company: 'Amazon',       role: 'SDE I',               salary: '58 LPA',  selects: 2   },
    { company: 'Virtusa',      role: 'Data Engineer',       salary: '5.5 LPA', selects: 52  },
    { company: 'Boeing',       role: 'Aerospace Engineer',  salary: '16 LPA',  selects: 4   },
    { company: 'LTI Mindtree', role: 'Software Engineer',   salary: '5.5 LPA', selects: 44  },
    { company: 'TCS',          role: 'Systems Engineer',    salary: '4.0 LPA', selects: 96  },
    { company: 'Capgemini',    role: 'Assoc. Consultant',   salary: '4.5 LPA', selects: 72  },
    { company: 'Infosys',      role: 'Systems Engineer',    salary: '4.0 LPA', selects: 84  },
    { company: 'Cyient',       role: 'Engineering Analyst', salary: '4.5 LPA', selects: 38  },
    { company: 'NTT Data',     role: 'Associate Analyst',   salary: '4.5 LPA', selects: 32  },
    { company: 'GlobalEdge',   role: 'Software Engineer',   salary: '4.0 LPA', selects: 28  },
  ],
  '2022': [
    { company: 'Prolifics',         role: 'Fullstack Developer', salary: '25 LPA',  selects: 3   },
    { company: 'Capgemini',         role: 'Assoc. Consultant',   salary: '4.5 LPA', selects: 142 },
    { company: 'TCS',               role: 'Systems Engineer',    salary: '4.0 LPA', selects: 188 },
    { company: 'Infosys',           role: 'Systems Engineer',    salary: '3.8 LPA', selects: 156 },
    { company: 'Tata Technologies', role: 'Design Engineer',     salary: '4.5 LPA', selects: 62  },
    { company: 'Wipro',             role: 'Project Engineer',    salary: '4.0 LPA', selects: 96  },
    { company: 'Cognizant',         role: 'Programmer Analyst',  salary: '4.0 LPA', selects: 84  },
    { company: 'Tech Mahindra',     role: 'Software Engineer',   salary: '3.8 LPA', selects: 74  },
    { company: 'Virtusa',           role: 'Associate Engineer',  salary: '5.0 LPA', selects: 58  },
    { company: 'Sonata Software',   role: 'Software Engineer',   salary: '4.0 LPA', selects: 44  },
  ],
  '2021': [
    { company: 'Mphasis',        role: 'Senior Associate',    salary: '18.1 LPA', selects: 8   },
    { company: 'TCS',            role: 'Systems Engineer',    salary: '3.5 LPA',  selects: 162 },
    { company: 'Infosys',        role: 'Systems Engineer',    salary: '3.5 LPA',  selects: 118 },
    { company: 'Wipro',          role: 'Project Engineer',    salary: '3.5 LPA',  selects: 96  },
    { company: 'Capgemini',      role: 'Assoc. Consultant',   salary: '4.0 LPA',  selects: 88  },
    { company: 'DXC Technology', role: 'Associate',           salary: '3.8 LPA',  selects: 64  },
    { company: 'Virtusa',        role: 'Associate Engineer',  salary: '4.5 LPA',  selects: 44  },
    { company: 'Cyient',         role: 'Engineering Analyst', salary: '4.0 LPA',  selects: 38  },
    { company: 'MEIL',           role: 'Graduate Engineer',   salary: '3.5 LPA',  selects: 32  },
    { company: 'ValueLabs',      role: 'Software Engineer',   salary: '3.8 LPA',  selects: 28  },
  ],
};

// ─── Recruiter logos (self-hosted under /public/placements/) ─────────────────

export const RECRUITER_LOGOS = Array.from({ length: 16 }, (_, i) => {
  const n = i + 1;
  const ext = n <= 6 ? 'jpg' : 'png';
  return { src: `/placements/p${n}.${ext}`, alt: 'Recruiter' };
});

export const RECRUITERS = [
  'Capgemini', 'Virtusa', 'Tata Technologies', 'Tech Mahindra', 'LTI Mindtree',
  'Tata Consultancy Services', 'Infosys', 'Wipro', 'Optum', 'Sonata Software',
  'NTT Data', 'Mphasis', 'EPAM Systems', 'ServiceNow', 'Amazon', 'Boeing',
  'Cognizant', 'HCL Tech', 'Cyient', 'Prolifics', 'DXC Technology', 'ValueLabs',
  'Revature', 'GlobalEdge', 'MEIL',
];

// ─── Infrastructure ───────────────────────────────────────────────────────────

export const INFRASTRUCTURE_LIST = [
  '800+ networked computer systems with webcams and 1 Gbps internet connectivity',
  'Auditorium with 1,200-seat capacity for pre-placement talks and mass drives',
  'Dedicated placement block with seminar halls, GD rooms, and interview panels',
  'Uninterrupted power backup across all placement facilities',
  'Centres of Excellence with Virtusa and EPAM Systems for advanced domain training',
];

export const INFRA_STATS = [
  { num: '800+',   label: 'Systems'         },
  { num: '1200',   label: 'Seat Auditorium' },
  { num: '1 Gbps', label: 'Connectivity'   },
];

// ─── MoUs & Centres of Excellence ────────────────────────────────────────────

export interface Mou {
  name: string;
  domain: string;
  package?: string;
  type: 'Centre of Excellence' | 'MoU Partner';
  docs?: { label: string; file: string }[];
}

export const MOUS: Mou[] = [
  {
    name: 'Virtusa',
    domain: 'Talend Data Integration and AWS — hands-on training with live industry projects through a dedicated on-campus Centre of Excellence.',
    package: '5.5 – 7 LPA',
    type: 'Centre of Excellence',
    docs: [
      { label: 'MoU Agreement',     file: '/placements/mou/Virtusa_MOU_COE_Partner_2025_Signed.pdf' },
      { label: 'AWS Track',         file: '/placements/mou/Virtusa_AWS.pdf'                          },
      { label: 'Dot Net Track',     file: '/placements/mou/Virtusa_DotNet.pdf'                       },
      { label: 'Talend + Big Data', file: '/placements/mou/Virtusa_Talend.pdf'                       },
    ],
  },
  {
    name: 'EPAM Systems',
    domain: 'Fullstack Development and Cloud Engineering — specialised curriculum delivered by EPAM practitioners at our on-campus CoE.',
    package: '8 – 12 LPA',
    type: 'Centre of Excellence',
  },
  {
    name: 'HCL Tech',
    domain: 'Specialised technical training in Snowflake, Informatica, and Java — developing job-ready professionals through industry-designed learning.',
    type: 'Centre of Excellence',
  },
  {
    name: 'Tata Technologies',
    domain: 'PLM and Engineering Design — dedicated Tata Technologies Centre of Excellence for advanced product lifecycle and manufacturing skills.',
    type: 'Centre of Excellence',
  },
  {
    name: 'Boeing',
    domain: 'Aerospace Design and Manufacturing — formal partnership enabling internships, research collaboration, and direct recruitment.',
    type: 'MoU Partner',
  },
  {
    name: 'Cyient',
    domain: 'Engineering and Technology Services — strategic MoU covering campus recruitment, joint technical training, and faculty development.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/Cyient_MLRIT_MoU.pdf' }],
  },
  {
    name: 'Infosys',
    domain: 'Campus Connect Programme — structured industry partnership providing Infosys-designed curriculum, certification, and campus recruitment.',
    type: 'MoU Partner',
    docs: [{ label: 'Campus Connect', file: '/placements/mou/Infosys_Campus_Connect.pdf' }],
  },
  {
    name: 'Revature',
    domain: 'Technology staffing and training partnership — placing graduates into software development roles at Fortune 500 clients through Revature\'s workforce model.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/Revature_MoU.pdf' }],
  },
];

// ─── Industry Readiness programmes ───────────────────────────────────────────

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  items?: string[];
}

export const READINESS_MODULES: TrainingModule[] = [
  {
    id: 'aptitude',
    title: 'Aptitude & Reasoning',
    description: 'Quantitative reasoning, logical analysis, and data interpretation — structured to meet the assessment standards of top MNCs.',
  },
  {
    id: 'verbal',
    title: 'Verbal Ability & Communication',
    description: 'English proficiency, comprehension, group discussions, and business communication for corporate readiness.',
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills & Professional Etiquette',
    description: 'Interview techniques, professional conduct, leadership, and team dynamics workshops delivered by industry practitioners.',
  },
  {
    id: 'technical',
    title: 'Technical Training',
    description: 'Domain-specific programming, tools, and frameworks aligned to branch curricula and market demand.',
    items: ['Python · 200 students trained', 'SQL · 200 students trained', 'Java · 150 students trained', '.NET · 100 students trained'],
  },
  {
    id: 'resume',
    title: 'Resume Building & Mock Interviews',
    description: 'Hands-on resume workshops, personal branding sessions, and simulated interview rounds with expert feedback.',
  },
  {
    id: 'coding',
    title: 'Coding Practice & Assessments',
    description: 'Regular coding challenges, competitive programming practice, and mock online assessments mirroring company-level tests.',
  },
];

export interface BranchCurriculum {
  branch: string;
  curriculum: string;
}

export const BRANCH_CURRICULA: BranchCurriculum[] = [
  { branch: 'CSE',        curriculum: 'C & C++, Java, Data Structures, MySQL, Agile Practices, Android, Web Programming'                        },
  { branch: 'ECE',        curriculum: 'C & C++, Java, Data Structures, MySQL, Agile Practices, ARM & Cortex Processor, Robotics Applications' },
  { branch: 'Mechanical', curriculum: 'CATIA, Hypermesh, ANSYS'                                                                                },
];

// ─── Global Certification ─────────────────────────────────────────────────────

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  description: string;
  skills?: string[];
  studentsCount?: string;
  logoSrc?: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'sap',
    name: 'SAP Certification',
    issuer: 'SAP SE',
    description: 'Globally recognised enterprise software certification covering SAP platforms and business process integration.',
    skills: ['SAP ERP', 'Business Process Integration', 'Enterprise Software'],
    studentsCount: '106 students certified',
    logoSrc: '/placements/certi/certi-1.png',
  },
  {
    id: 'servicenow',
    name: 'ServiceNow Certification',
    issuer: 'ServiceNow',
    description: 'Industry-standard certification in ServiceNow platform administration, development, and IT service management.',
    skills: ['ServiceNow Platform', 'ITSM', 'Workflow Automation'],
    studentsCount: '116 students certified',
    logoSrc: '/placements/certi/certi-2.png',
  },
  {
    id: 'certi-3',
    name: 'Industry Certification',
    issuer: 'Certification Partner',
    description: 'Professional certification programme offered through MLRIT\'s industry partnerships.',
    logoSrc: '/placements/certi/certi-3.png',
  },
  {
    id: 'certi-4',
    name: 'Industry Certification',
    issuer: 'Certification Partner',
    description: 'Professional certification programme offered through MLRIT\'s industry partnerships.',
    logoSrc: '/placements/certi/certi-4.png',
  },
  {
    id: 'certi-5',
    name: 'Industry Certification',
    issuer: 'Certification Partner',
    description: 'Professional certification programme offered through MLRIT\'s industry partnerships.',
    logoSrc: '/placements/certi/certi-5.png',
  },
  {
    id: 'certi-6',
    name: 'Industry Certification',
    issuer: 'Certification Partner',
    description: 'Professional certification programme offered through MLRIT\'s industry partnerships.',
    logoSrc: '/placements/certi/certi-6.png',
  },
  {
    id: 'certi-7',
    name: 'Industry Certification',
    issuer: 'Certification Partner',
    description: 'Professional certification programme offered through MLRIT\'s industry partnerships.',
    logoSrc: '/placements/certi/certi-7.png',
  },
];

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface PlacementContact {
  name: string;
  designation: string;
  phones: string[];
  email: string;
  purpose: string;
}

export const PLACEMENT_CONTACTS: PlacementContact[] = [
  {
    name: 'Mr. Ravi Chandra P',
    designation: 'Head of Placements',
    phones: ['+91 98499 91299', '+91 96522 26061'],
    email: 'ravichandra@mlrinstitutions.ac.in',
    purpose: 'Campus recruitment, company tie-ups, placement policy and student placement queries.',
  },
  {
    name: 'Mr. S. Arun Kumar',
    designation: 'Asst. Training & Placement Officer',
    phones: ['+91 98661 93405'],
    email: 'placements@mlrinstitutions.ac.in',
    purpose: 'Student registration, resume prep, mock interviews and training schedules.',
  },
];

// ─── Drives gallery ───────────────────────────────────────────────────────────

export const DRIVES = [
  { img: '/placements/p1.jpg', tag: 'Capgemini · Pre-Placement Talk'  },
  { img: '/placements/p2.jpg', tag: 'Virtusa · Centre of Excellence'  },
  { img: '/placements/p3.jpg', tag: 'Tata Technologies · Drive 2025'  },
  { img: '/placements/p4.jpg', tag: 'Tech Mahindra · Open Day'        },
  { img: '/placements/p5.jpg', tag: 'LTI Mindtree · Recruitment'      },
  { img: '/placements/p6.jpg', tag: 'TCS · Campus Drive'              },
];

// ─── Navigation config (single source of truth) ──────────────────────────────

export interface PlacementsNavItem {
  label: string;
  href: string;
}

export const PLACEMENTS_NAV: PlacementsNavItem[] = [
  { label: 'Overview',             href: '/placements/overview'             },
  { label: 'Statistics',           href: '/placements/statistics'           },
  { label: 'Industry Readiness',   href: '/placements/industry-readiness'   },
  { label: 'Global Certification', href: '/placements/global-certification' },
  { label: 'MoUs & Partnerships',  href: '/placements/mous'                 },
  { label: 'Alumni',               href: '/placements/alumni'               },
  { label: 'Reach Placements At',  href: '/placements/support'              },
];

// ─── Legacy aliases (keep existing imports working during migration) ──────────

/** @deprecated Use PLACEMENT_HIGHLIGHTS */
export const TRAINING = {
  general: READINESS_MODULES.slice(0, 4).map(m => `${m.title} — ${m.description}`),
  byBranch: BRANCH_CURRICULA,
};
