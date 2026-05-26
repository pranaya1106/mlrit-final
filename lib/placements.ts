// Real MLRIT placement data — sourced from legacy placements-data.js (which itself
// was sourced from mlrit.ac.in/placements).

export const PLACEMENT_OVERVIEW =
  "MLR Institute of Technology, in its journey of 20 years, has become a locus yielding academic excellence — consistently achieving 80% and above placements every year in various reputed MNCs across the globe. The Training & Placement Cell transforms an amateur engineering student into a self-motivated professional with versatile domain expertise and multi-tasking abilities, ensuring every graduate is career-ready for the demands of modern industry.";

export type YearStat = { year: string; offers: number; companies: number; highest: number };

export const YEAR_STATS: YearStat[] = [
  { year: '2026', offers: 544,  companies: 36, highest: 51   },
  { year: '2025', offers: 536,  companies: 62, highest: 33   },
  { year: '2024', offers: 674,  companies: 55, highest: 28.5 },
  { year: '2023', offers: 734,  companies: 32, highest: 58   },
  { year: '2022', offers: 1236, companies: 42, highest: 25   },
  { year: '2021', offers: 740,  companies: 49, highest: 18.1 },
];

export type RoleRow = { company: string; role: string; salary: string; selects: number };
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
    { company: 'Boeing',             role: 'Aerospace Engineer',  salary: '28.5 LPA', selects: 3  },
    { company: 'EPAM Systems',       role: 'Fullstack Developer', salary: '8 LPA',    selects: 42 },
    { company: 'Amazon',             role: 'SDE I',               salary: '12 LPA',   selects: 6  },
    { company: 'Virtusa',            role: 'Data Engineer',       salary: '5.5 LPA',  selects: 48 },
    { company: 'TCS',                role: 'Systems Engineer',    salary: '4.0 LPA',  selects: 88 },
    { company: 'Infosys',            role: 'Systems Engineer',    salary: '4.0 LPA',  selects: 76 },
    { company: 'Capgemini',          role: 'Assoc. Consultant',   salary: '4.5 LPA',  selects: 64 },
    { company: 'Tata Technologies',  role: 'Design Engineer',     salary: '4.5 LPA',  selects: 52 },
    { company: 'Tech Mahindra',      role: 'Software Engineer',   salary: '4.0 LPA',  selects: 46 },
    { company: 'Optum',              role: 'Associate Developer', salary: '5.8 LPA',  selects: 38 },
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
};

// 16 recruiter logos already self-hosted under /public/placements/p1..p16
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
  { num: '1 Gbps', label: 'Connectivity'    },
];

export type Mou = {
  name: string;
  domain: string;
  package?: string;
  type: 'Centre of Excellence' | 'MoU Partner';
};

export const MOUS: Mou[] = [
  { name: 'Virtusa',          domain: 'Talend Data Integration and AWS — hands-on training with live industry projects through a dedicated on-campus Centre of Excellence.', package: '5.5 – 7 LPA', type: 'Centre of Excellence' },
  { name: 'EPAM Systems',     domain: 'Fullstack Development and Cloud Engineering — specialised curriculum delivered by EPAM practitioners at our on-campus CoE.',           package: '8 – 12 LPA',  type: 'Centre of Excellence' },
  { name: 'Boeing',           domain: 'Aerospace Design and Manufacturing — formal partnership enabling internships, research collaboration, and direct recruitment.',                                  type: 'MoU Partner' },
  { name: 'Cyient',           domain: 'Engineering and Technology Services — strategic MoU covering campus recruitment, joint technical training, and faculty development.',                          type: 'MoU Partner' },
  { name: 'Tata Technologies',domain: 'PLM and Engineering Design — dedicated Tata Technologies Centre of Excellence for advanced product lifecycle and manufacturing skills.',                       type: 'Centre of Excellence' },
  { name: 'Infosys',          domain: 'Campus Connect Programme — structured industry partnership providing Infosys-designed curriculum, certification, and recruitment.',                            type: 'MoU Partner' },
  { name: 'Revature',         domain: 'Technology staffing and training partnership — placing graduates into software development roles at Fortune 500 clients through Revature\'s workforce model.', type: 'MoU Partner' },
];

export const TRAINING = {
  general: [
    'Aptitude — Quantitative reasoning, logical analysis, and data interpretation',
    'Verbal Ability — English proficiency, comprehension, and business communication',
    'Soft Skills — Group discussions, interview techniques, and professional etiquette',
    'Technical Skills — Domain-specific programming, tools, and frameworks',
  ],
  byBranch: [
    { branch: 'CSE',         curriculum: 'C & C++, Java, Data Structures, MySQL, Agile Practices, Android, Web Programming' },
    { branch: 'ECE',         curriculum: 'C & C++, Java, Data Structures, MySQL, Agile Practices, ARM & Cortex Processor, Robotics Applications' },
    { branch: 'Mechanical',  curriculum: 'CATIA, Hypermesh, ANSYS' },
  ],
};

export const CONTACT = {
  name:  'Ravi Chandra P',
  role:  'Head of Placements',
  phone: ['+91 98499 91299', '+91 96522 26061'],
  email: 'ravichandra@mlrinstitutions.ac.in',
  address: [
    'MLR Institute of Technology',
    'Survey No. 444, Dundigal',
    'Medchal Malkajgiri',
    'Telangana – 500 043',
  ],
  eapcet: 'MLID',
};

// Drives gallery — uses placement-band photos for visual richness
export const DRIVES = [
  { img: '/placements/p1.jpg', tag: 'Capgemini · Pre-Placement Talk' },
  { img: '/placements/p2.jpg', tag: 'Virtusa · Centre of Excellence' },
  { img: '/placements/p3.jpg', tag: 'Tata Technologies · Drive 2025' },
  { img: '/placements/p4.jpg', tag: 'Tech Mahindra · Open Day' },
  { img: '/placements/p5.jpg', tag: 'LTI Mindtree · Recruitment' },
  { img: '/placements/p6.jpg', tag: 'TCS · Campus Drive' },
];
