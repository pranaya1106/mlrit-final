import { resolveAssetUrl } from '@/lib/cdn/url';
import type { GalleryItem } from '@/lib/content/sections';

// MLRIT placement data — authoritative source for all Placements pages.
// Data verified against official year-specific pages on mlrit.ac.in (2026-07-30).

// ─── Overview highlights ─────────────────────────────────────────────────────

export interface PlacementHighlight {
  value: string;
  label: string;
  sub?: string;
}

export const PLACEMENT_HIGHLIGHTS: PlacementHighlight[] = [
  { value: '81%',     label: 'Students getting placed',             sub: 'Consistently every year'   },
  { value: '21',      label: 'Years of experience',                 sub: 'Since inception'            },
  { value: '7000+',   label: 'Alumni placed in MNCs',               sub: 'Across industries'          },
  { value: '200+',    label: 'Campus visiting partners',             sub: 'MNCs to startups'          },
  { value: '₹58 LPA', label: 'Highest package',                     sub: 'Palo Alto Networks · 2023'  },
];

// ─── Overview paragraph ──────────────────────────────────────────────────────

export const PLACEMENT_OVERVIEW =
  'MLR Institute of Technology, in its journey of 21 years, has become a locus yielding academic excellence — consistently achieving 81% and above placements every year in various reputed MNCs across the globe. The Training & Placement Cell transforms an amateur engineering student into a self-motivated professional with versatile domain expertise and multi-tasking abilities, ensuring every graduate is career-ready for the demands of modern industry.';

// ─── Placement year type definitions ─────────────────────────────────────────

export type SelectionCount =
  | { status: 'confirmed'; value: number }
  | { status: 'in-progress' }
  | { status: 'unknown' };

export interface PlacementCompanyRecord {
  id: string;
  company: string;
  role: string;
  salaryDisplay: string;
  salaryMinLpa?: number;
  salaryMaxLpa?: number;
  selections: SelectionCount;
}

export interface PlacementYearSummary {
  year: string;
  academicYear: string;
  jobOffers: number;
  companiesVisited: number;
  highestPackageLpa: number;
  topRecruiter: string;
  topRecruiterRole: string;
  isProvisional?: boolean;
  provisionalNote?: string;
  sourceUrl: string;
  lastVerified: string;
  companies: PlacementCompanyRecord[];
}

// ─── Year-wise statistics (verified against official year pages) ──────────────
// Conflict log:
//   2026: landing page shows 36 companies, year-specific page shows 37 MNCs — year page is authoritative.
//   2023: lib previously attributed ₹58 LPA to Amazon; official page attributes it to Palo Alto Networks.
//   2024: official year page marks total as 674* (asterisked/provisional); ₹28.5 LPA headline is stated
//         on the page but not reflected by any single row in the detailed table — retained as officially stated.
//   2021: headline states ₹18.10 LPA; highest row in table is Amazon at ₹16L — headline trusted as stated.
//   2025: ServiceNow salary stored as raw integer 3300000 on official page; normalised to ₹33 LPA.

export const PLACEMENT_YEARS: PlacementYearSummary[] = [
  {
    year: '2026',
    academicYear: '2025–26',
    jobOffers: 621,
    companiesVisited: 37,
    highestPackageLpa: 51,
    topRecruiter: 'Microsoft',
    topRecruiterRole: 'Software Engineer Intern',
    sourceUrl: 'https://mlrit.ac.in/placements/placement-statistics-2026/',
    lastVerified: '2026-07-30',
    companies: [
      { id: '2026-microsoft',       company: 'Microsoft',                   role: 'Software Engineer Intern',           salaryDisplay: '₹51 LPA',           salaryMinLpa: 51,   salaryMaxLpa: 51,   selections: { status: 'confirmed', value: 2   } },
      { id: '2026-scaler',          company: 'Scaler',                      role: 'AWS DevOps Associate Intern',        salaryDisplay: '₹48 LPA',           salaryMinLpa: 48,   salaryMaxLpa: 48,   selections: { status: 'confirmed', value: 1   } },
      { id: '2026-vivnovation',     company: 'Vivnovation',                  role: 'Trainee Engineer',                   salaryDisplay: '₹20 LPA',           salaryMinLpa: 20,   salaryMaxLpa: 20,   selections: { status: 'confirmed', value: 1   } },
      { id: '2026-dbs',             company: 'DBS Tech',                    role: 'Apprenticeship',                     salaryDisplay: '₹12 LPA',           salaryMinLpa: 12,   salaryMaxLpa: 12,   selections: { status: 'confirmed', value: 3   } },
      { id: '2026-realpage',        company: 'Realpage',                    role: 'Software Engineer Intern',           salaryDisplay: '₹10 LPA',           salaryMinLpa: 10,   salaryMaxLpa: 10,   selections: { status: 'confirmed', value: 10  } },
      { id: '2026-tcs',             company: 'Tata Consultancy Services',   role: 'Ninja / Digital',                    salaryDisplay: '₹3.46 – 9.07 LPA', salaryMinLpa: 3.46, salaryMaxLpa: 9.07, selections: { status: 'confirmed', value: 101 } },
      { id: '2026-cognizant',       company: 'Cognizant',                   role: 'GenC Next / GenC Pro / GenC',        salaryDisplay: '₹4 – 6.75 LPA',    salaryMinLpa: 4,    salaryMaxLpa: 6.75, selections: { status: 'confirmed', value: 107 } },
      { id: '2026-hcl',             company: 'HCL Tech',                    role: 'Graduate Engineer Trainee',          salaryDisplay: '₹4.5 LPA',          salaryMinLpa: 4.5,  salaryMaxLpa: 4.5,  selections: { status: 'confirmed', value: 83  } },
      { id: '2026-infosys',         company: 'Infosys',                     role: 'Systems Engineer',                   salaryDisplay: '₹3.6 LPA',          salaryMinLpa: 3.6,  salaryMaxLpa: 3.6,  selections: { status: 'confirmed', value: 92  } },
      { id: '2026-virtusa',         company: 'Virtusa',                     role: 'Software Engineer',                  salaryDisplay: '₹5 – 6.5 LPA',     salaryMinLpa: 5,    salaryMaxLpa: 6.5,  selections: { status: 'confirmed', value: 41  } },
    ],
  },
  {
    year: '2025',
    academicYear: '2024–25',
    jobOffers: 536,
    companiesVisited: 62,
    highestPackageLpa: 33,
    topRecruiter: 'ServiceNow',
    topRecruiterRole: 'Associate Software QA Engineer',
    sourceUrl: 'https://mlrit.ac.in/placements/placements-statistics-2025/',
    lastVerified: '2026-07-30',
    companies: [
      { id: '2025-servicenow',   company: 'ServiceNow',     role: 'Associate Software QA Engineer',     salaryDisplay: '₹33 LPA',        salaryMinLpa: 33,   salaryMaxLpa: 33,   selections: { status: 'confirmed', value: 1   } },
      { id: '2025-bigworks',     company: 'BigWorks',       role: 'Software Engineer',                  salaryDisplay: '₹26 LPA',        salaryMinLpa: 26,   salaryMaxLpa: 26,   selections: { status: 'confirmed', value: 3   } },
      { id: '2025-inovalon',     company: 'Inovalon',       role: 'Software Engineer',                  salaryDisplay: '₹25 LPA',        salaryMinLpa: 25,   salaryMaxLpa: 25,   selections: { status: 'confirmed', value: 3   } },
      { id: '2025-cognizant',    company: 'Cognizant',      role: 'GenC',                               salaryDisplay: '₹4 LPA',         salaryMinLpa: 4,    salaryMaxLpa: 4,    selections: { status: 'confirmed', value: 154 } },
      { id: '2025-infosys',      company: 'Infosys',        role: 'Systems Engineer',                   salaryDisplay: '₹3.6 – 9 LPA',  salaryMinLpa: 3.6,  salaryMaxLpa: 9,    selections: { status: 'confirmed', value: 42  } },
      { id: '2025-globallogic',  company: 'GlobalLogic',    role: 'Associate Analyst',                  salaryDisplay: '₹2.55 LPA',      salaryMinLpa: 2.55, salaryMaxLpa: 2.55, selections: { status: 'confirmed', value: 38  } },
      { id: '2025-hcl',          company: 'HCL Tech',       role: 'Graduate Engineer Trainee',          salaryDisplay: '₹4.25 LPA',      salaryMinLpa: 4.25, salaryMaxLpa: 4.25, selections: { status: 'confirmed', value: 27  } },
      { id: '2025-techmahindra', company: 'Tech Mahindra',  role: 'Associate Process Engineer',         salaryDisplay: '₹5.5 LPA',       salaryMinLpa: 5.5,  salaryMaxLpa: 5.5,  selections: { status: 'confirmed', value: 17  } },
      { id: '2025-ust',          company: 'UST',            role: 'Software Engineer',                  salaryDisplay: '₹4.25 LPA',      salaryMinLpa: 4.25, salaryMaxLpa: 4.25, selections: { status: 'confirmed', value: 17  } },
      // TCS row marked "In Progress" on official page — not assigned a numeric count
      { id: '2025-tcs',          company: 'TCS',            role: 'Ninja / Digital / Prime',            salaryDisplay: '₹3.36 – 9 LPA', salaryMinLpa: 3.36, salaryMaxLpa: 9,    selections: { status: 'in-progress'                } },
    ],
  },
  {
    year: '2024',
    academicYear: '2023–24',
    jobOffers: 674,
    companiesVisited: 55,
    highestPackageLpa: 28.5,
    topRecruiter: 'Accenture',
    topRecruiterRole: 'Associate Software Engineer',
    isProvisional: true,
    provisionalNote: 'Total marked as 674* on official page.',
    sourceUrl: 'https://mlrit.ac.in/placements/placements-statistics-2024/',
    lastVerified: '2026-07-30',
    companies: [
      { id: '2024-accelerize',    company: 'Accelerize 360',          role: 'Software Developer',               salaryDisplay: '₹12 LPA',        salaryMinLpa: 12,   salaryMaxLpa: 12,   selections: { status: 'confirmed', value: 1  } },
      { id: '2024-accenture',     company: 'Accenture',               role: 'Associate Software Engineer',      salaryDisplay: '₹4.53 LPA',      salaryMinLpa: 4.53, salaryMaxLpa: 4.53, selections: { status: 'confirmed', value: 95 } },
      { id: '2024-capgemini',     company: 'Capgemini',               role: 'Software Engineer',                salaryDisplay: '₹4.25 – 5.75 LPA', salaryMinLpa: 4.25, salaryMaxLpa: 5.75, selections: { status: 'confirmed', value: 91 } },
      { id: '2024-techmahindra',  company: 'Tech Mahindra',           role: 'Associate Process Executive',      salaryDisplay: '₹3.25 LPA',      salaryMinLpa: 3.25, salaryMaxLpa: 3.25, selections: { status: 'confirmed', value: 65 } },
      { id: '2024-globallogic',   company: 'GlobalLogic',             role: 'Associate Analyst',                salaryDisplay: '₹2.23 LPA',      salaryMinLpa: 2.23, salaryMaxLpa: 2.23, selections: { status: 'confirmed', value: 54 } },
      { id: '2024-tcs',           company: 'Tata Consultancy Services', role: 'Digital & Prime',                salaryDisplay: '₹7 – 9 LPA',    salaryMinLpa: 7,    salaryMaxLpa: 9,    selections: { status: 'confirmed', value: 11 } },
      { id: '2024-eidiko',        company: 'Eidiko Systems',          role: 'Trainee Software Engineer',        salaryDisplay: '₹4.7 LPA',       salaryMinLpa: 4.7,  salaryMaxLpa: 4.7,  selections: { status: 'confirmed', value: 21 } },
      { id: '2024-peopletech',    company: 'PeopleTech',              role: 'Junior Software Engineer',         salaryDisplay: '₹3.3 LPA',       salaryMinLpa: 3.3,  salaryMaxLpa: 3.3,  selections: { status: 'confirmed', value: 38 } },
      { id: '2024-astramwp',      company: 'AstraMWP',                role: 'Trainee',                          salaryDisplay: '₹2.34 LPA',      salaryMinLpa: 2.34, salaryMaxLpa: 2.34, selections: { status: 'confirmed', value: 35 } },
      { id: '2024-eis',           company: 'Engineering Inspection Services', role: 'Graduate Engineer Trainee', salaryDisplay: '₹2.64 LPA',     salaryMinLpa: 2.64, salaryMaxLpa: 2.64, selections: { status: 'confirmed', value: 36 } },
    ],
  },
  {
    year: '2023',
    academicYear: '2022–23',
    jobOffers: 734,
    companiesVisited: 32,
    highestPackageLpa: 58,
    topRecruiter: 'Palo Alto Networks',
    topRecruiterRole: 'Software Engineer',
    sourceUrl: 'https://mlrit.ac.in/placements/placements-statistics-2023/',
    lastVerified: '2026-07-30',
    companies: [
      { id: '2023-paloalto',     company: 'Palo Alto Networks', role: 'Software Engineer',                    salaryDisplay: '₹58 LPA',          salaryMinLpa: 58,   salaryMaxLpa: 58,   selections: { status: 'confirmed', value: 3   } },
      { id: '2023-cisco',        company: 'Cisco Systems',      role: 'Software Engineer',                    salaryDisplay: '₹22.59 LPA',       salaryMinLpa: 22.59,salaryMaxLpa: 22.59,selections: { status: 'confirmed', value: 1   } },
      { id: '2023-experian',     company: 'Experian Services',  role: 'Automation Test Engineer',             salaryDisplay: '₹15.5 LPA',        salaryMinLpa: 15.5, salaryMaxLpa: 15.5, selections: { status: 'confirmed', value: 4   } },
      { id: '2023-epam',         company: 'EPAM Systems',       role: 'Junior Software Engineer',             salaryDisplay: '₹12 LPA',          salaryMinLpa: 12,   salaryMaxLpa: 12,   selections: { status: 'confirmed', value: 19  } },
      { id: '2023-virtusa',      company: 'Virtusa Corporation',role: 'Power Developer / Developer',          salaryDisplay: '₹5.5 – 7 LPA',    salaryMinLpa: 5.5,  salaryMaxLpa: 7,    selections: { status: 'confirmed', value: 180 } },
      { id: '2023-dxc',          company: 'DXC Technology',     role: 'Associate Professional',               salaryDisplay: '₹4.2 LPA',         salaryMinLpa: 4.2,  salaryMaxLpa: 4.2,  selections: { status: 'confirmed', value: 179 } },
      { id: '2023-accenture',    company: 'Accenture',          role: 'Associate Software Engineer',          salaryDisplay: '₹4.5 LPA',         salaryMinLpa: 4.5,  salaryMaxLpa: 4.5,  selections: { status: 'confirmed', value: 66  } },
      { id: '2023-skolar',       company: 'Skolar',             role: 'Business Development Trainee',         salaryDisplay: '₹6 LPA',           salaryMinLpa: 6,    salaryMaxLpa: 6,    selections: { status: 'confirmed', value: 52  } },
      { id: '2023-cybage',       company: 'Cybage Software',    role: 'Development Engineer',                 salaryDisplay: '₹4.5 LPA',         salaryMinLpa: 4.5,  salaryMaxLpa: 4.5,  selections: { status: 'confirmed', value: 30  } },
      { id: '2023-alten',        company: 'Alten India',        role: 'Graduate Engineer Trainee',            salaryDisplay: '₹3.5 LPA',         salaryMinLpa: 3.5,  salaryMaxLpa: 3.5,  selections: { status: 'confirmed', value: 31  } },
    ],
  },
  {
    year: '2022',
    academicYear: '2021–22',
    jobOffers: 1236,
    companiesVisited: 42,
    highestPackageLpa: 25,
    topRecruiter: 'Amazon',
    topRecruiterRole: 'Software Development Engineer',
    sourceUrl: 'https://mlrit.ac.in/placements/placements-statistics-2022/',
    lastVerified: '2026-07-30',
    companies: [
      { id: '2022-amazon',     company: 'Amazon',               role: 'Software Development Engineer',     salaryDisplay: '₹25 LPA',         salaryMinLpa: 25,   salaryMaxLpa: 25,   selections: { status: 'confirmed', value: 3   } },
      { id: '2022-walmart',    company: 'Walmart Global Tech',  role: 'Software Engineer',                  salaryDisplay: '₹24 LPA',         salaryMinLpa: 24,   salaryMaxLpa: 24,   selections: { status: 'confirmed', value: 3   } },
      { id: '2022-wipro',      company: 'Wipro Limited',        role: 'Project Engineer',                   salaryDisplay: '₹3.75 – 6.5 LPA',salaryMinLpa: 3.75, salaryMaxLpa: 6.5,  selections: { status: 'confirmed', value: 251 } },
      { id: '2022-accenture',  company: 'Accenture',            role: 'Advanced / Associate Software Eng', salaryDisplay: '₹4.5 – 6.5 LPA', salaryMinLpa: 4.5,  salaryMaxLpa: 6.5,  selections: { status: 'confirmed', value: 213 } },
      { id: '2022-tcs',        company: 'Tata Consultancy Services', role: 'Ninja / Digital',              salaryDisplay: '₹3.37 – 7 LPA',  salaryMinLpa: 3.37, salaryMaxLpa: 7,    selections: { status: 'confirmed', value: 128 } },
      { id: '2022-capgemini',  company: 'Capgemini',            role: 'Analyst / Senior Analyst',           salaryDisplay: '₹4 – 7.5 LPA',   salaryMinLpa: 4,    salaryMaxLpa: 7.5,  selections: { status: 'confirmed', value: 159 } },
      { id: '2022-virtusa',    company: 'Virtusa Corporation',  role: 'Developer / Power Developer',        salaryDisplay: '₹5.5 – 6.5 LPA', salaryMinLpa: 5.5,  salaryMaxLpa: 6.5,  selections: { status: 'confirmed', value: 112 } },
      { id: '2022-hcl',        company: 'HCL Technologies',     role: 'Graduate Engineer Trainee',          salaryDisplay: '₹4.25 LPA',       salaryMinLpa: 4.25, salaryMaxLpa: 4.25, selections: { status: 'confirmed', value: 44  } },
      { id: '2022-epam',       company: 'EPAM Systems',         role: 'Junior Software Engineer',           salaryDisplay: '₹6 LPA',          salaryMinLpa: 6,    salaryMaxLpa: 6,    selections: { status: 'confirmed', value: 20  } },
      { id: '2022-infosys',    company: 'Infosys Limited',      role: 'Specialist Programmer / Software Eng', salaryDisplay: '₹3.6 – 9.5 LPA', salaryMinLpa: 3.6, salaryMaxLpa: 9.5, selections: { status: 'confirmed', value: 34  } },
    ],
  },
  {
    year: '2021',
    academicYear: '2020–21',
    jobOffers: 740,
    companiesVisited: 49,
    highestPackageLpa: 18.1,
    topRecruiter: 'Accenture',
    topRecruiterRole: 'Advanced / Associate Software Engineer',
    // Note: page headline states ₹18.10 LPA; highest row in table is Amazon at ₹16L.
    // Headline is trusted as officially stated. Discrepancy noted for institutional review.
    sourceUrl: 'https://mlrit.ac.in/placements/placements-statistics-2021/',
    lastVerified: '2026-07-30',
    companies: [
      { id: '2021-amazon',     company: 'Amazon',                      role: 'Programmer Analyst / DevOps',    salaryDisplay: '₹9.5 – 16 LPA',  salaryMinLpa: 9.5,  salaryMaxLpa: 16,   selections: { status: 'confirmed', value: 4   } },
      { id: '2021-lti',        company: 'Larsen & Toubro Infotech',    role: 'Infinity Level 1–3',             salaryDisplay: '₹3.5 – 10 LPA',  salaryMinLpa: 3.5,  salaryMaxLpa: 10,   selections: { status: 'confirmed', value: 26  } },
      { id: '2021-accenture',  company: 'Accenture',                   role: 'Advanced / Associate Software Eng', salaryDisplay: '₹4.5 – 6.5 LPA', salaryMinLpa: 4.5, salaryMaxLpa: 6.5, selections: { status: 'confirmed', value: 221 } },
      { id: '2021-tcs',        company: 'Tata Consultancy Services',   role: 'Ninja / Digital',                salaryDisplay: '₹3.37 – 7 LPA',  salaryMinLpa: 3.37, salaryMaxLpa: 7,    selections: { status: 'confirmed', value: 56  } },
      { id: '2021-cognizant',  company: 'Cognizant Technology Solutions', role: 'Programmer Analyst Trainee', salaryDisplay: '₹4.02 LPA',       salaryMinLpa: 4.02, salaryMaxLpa: 4.02, selections: { status: 'confirmed', value: 86  } },
      { id: '2021-mindtree',   company: 'MindTree Limited',            role: 'Engineer / Junior Engineer',     salaryDisplay: '₹3 – 4 LPA',     salaryMinLpa: 3,    salaryMaxLpa: 4,    selections: { status: 'confirmed', value: 41  } },
      { id: '2021-virtusa',    company: 'Virtusa Corporation',         role: 'Associate Engineer',             salaryDisplay: '₹4 – 6.5 LPA',   salaryMinLpa: 4,    salaryMaxLpa: 6.5,  selections: { status: 'confirmed', value: 51  } },
      { id: '2021-capgemini',  company: 'Capgemini Technology Services', role: 'Analyst',                     salaryDisplay: '₹3.8 LPA',        salaryMinLpa: 3.8,  salaryMaxLpa: 3.8,  selections: { status: 'confirmed', value: 55  } },
      { id: '2021-hcl',        company: 'HCL Technologies',            role: 'Graduate Engineer Trainee',      salaryDisplay: '₹3.5 LPA',        salaryMinLpa: 3.5,  salaryMaxLpa: 3.5,  selections: { status: 'confirmed', value: 24  } },
      { id: '2021-optum',      company: 'Optum Global Solutions',      role: 'Associate Software Engineer',    salaryDisplay: '₹5 LPA',          salaryMinLpa: 5,    salaryMaxLpa: 5,    selections: { status: 'confirmed', value: 10  } },
    ],
  },
];

// ─── Year-wise statistics — derived view (backward compat with existing imports) ─
export interface YearStat {
  year: string;
  offers: number;
  companies: number;
  highest: number;
}

export const YEAR_STATS: YearStat[] = PLACEMENT_YEARS.map((y) => ({
  year: y.year,
  offers: y.jobOffers,
  companies: y.companiesVisited,
  highest: y.highestPackageLpa,
}));

export interface RoleRow {
  company: string;
  role: string;
  salary: string;
  selects: number;
}

// Derived from PLACEMENT_YEARS for backward compatibility with statistics page
export const YEAR_ROLES: Record<string, RoleRow[]> = Object.fromEntries(
  PLACEMENT_YEARS.map((y) => [
    y.year,
    y.companies
      .filter((c): c is typeof c & { selections: { status: 'confirmed'; value: number } } =>
        c.selections.status === 'confirmed'
      )
      .map((c) => ({
        company: c.company,
        role: c.role,
        salary: c.salaryDisplay,
        selects: c.selections.value,
      })),
  ])
);

// ─── Recruiter logos (self-hosted under /public/placements/) ─────────────────

export type RecruiterLogo = { src: string; alt: string };

/**
 * Bundled recruiter logos. Used until someone saves the CMS gallery at
 * placements/recruiters — see recruiterLogosFrom().
 */
export const RECRUITER_LOGOS: RecruiterLogo[] = Array.from({ length: 16 }, (_, i) => {
  const n = i + 1;
  const ext = n <= 6 ? 'jpg' : 'png';
  return { src: `/placements/p${n}.${ext}`, alt: 'Recruiter' };
});

/**
 * Maps CMS gallery items onto the { src, alt } shape both consumers already
 * render, falling back to the bundled list when nothing is saved.
 *
 * Deliberately a pure mapper taking already-fetched items: lib/placements.ts is
 * imported by client components, so it must not reach for Supabase itself.
 */
export function recruiterLogosFrom(items: readonly GalleryItem[] | undefined): RecruiterLogo[] {
  if (!items || items.length === 0) return RECRUITER_LOGOS;
  return items.map((item) => ({
    src: resolveAssetUrl(item.key, { allowTransient: true }) ?? '',
    alt: item.name?.trim() || 'Recruiter',
  }));
}

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
    docs: [{ label: 'MoU · CoE Agreement 2026', file: '/placements/mou/virtusa-coe-2026.pdf' }],
  },
  {
    name: 'EPAM Systems',
    domain: 'Fullstack Development and Cloud Engineering — specialised curriculum delivered by EPAM practitioners at our on-campus CoE.',
    package: '8 – 12 LPA',
    type: 'Centre of Excellence',
    docs: [{ label: 'UpSkill Programme Agreement', file: '/placements/mou/epam-upskill.pdf' }],
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
  },
  {
    name: 'Infosys',
    domain: 'Campus Connect Programme — structured industry partnership providing Infosys-designed curriculum, certification, and campus recruitment.',
    type: 'MoU Partner',
  },
  {
    name: 'Revature',
    domain: 'Technology staffing and training partnership — placing graduates into software development roles at Fortune 500 clients through Revature\'s workforce model.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/revature-mou.pdf' }],
  },
  {
    name: 'Cybage Software',
    domain: 'Strategic MoU enabling campus recruitment, joint training initiatives, and industry exposure for MLRIT students through Cybage\'s technology services platform.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/cybage-mou.pdf' }],
  },
  {
    name: 'ITE&C Department, Govt. of Telangana',
    domain: 'Formal partnership with the IT, Electronics and Communications Department of Telangana Government — covering Blockchain technology training and digital skilling initiatives.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/itec-blockchain.pdf' }],
  },
  {
    name: 'ALEAP We Hub',
    domain: 'Collaboration with ALEAP We Hub, Hyderabad — supporting women entrepreneurship, skill development, and industry-readiness programmes for students.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/aleap-wehub.pdf' }],
  },
  {
    name: 'Idea Labs Futuretech Ventures',
    domain: 'Partnership with Idea Labs Futuretech Ventures — enabling emerging technology exposure, innovation-driven training, and startup ecosystem engagement for students.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/idealabs-futuretech.pdf' }],
  },
  {
    name: 'India Matters Foundation',
    domain: 'Social impact partnership with India Matters Foundation, Chennai — focused on employability, professional development, and community engagement initiatives.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/india-matters-foundation.pdf' }],
  },
  {
    name: 'ITCA Bengaluru',
    domain: 'Indo-Israel technology initiative through ITCA, Bengaluru — providing access to cutting-edge training programmes and international technology collaboration opportunities.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/itca-mou.pdf' }],
  },
  {
    name: 'Movate',
    domain: 'Strategic MoU with Movate (formerly CSS Corp) — a global technology services company — covering campus recruitment, domain training, and professional development.',
    type: 'MoU Partner',
    docs: [{ label: 'MoU Agreement', file: '/placements/mou/movate-mou.pdf' }],
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

interface DrivePhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export const DRIVES: DrivePhoto[] = [
  {
    id: 'drive-slk',
    src: '/placements/drives/drive-slk-auditorium.jpg',
    alt: 'SLK campus recruitment team welcomed at the MLRIT auditorium during a campus placement drive',
    caption: 'SLK · Campus Recruitment Drive · MLRIT Auditorium',
  },
  {
    id: 'drive-siscol',
    src: '/placements/drives/drive-siscol.jpg',
    alt: 'SISCOL Steel Infra Solutions pre-placement talk at MLRIT — presenter addressing students in the Virtusa Centre of Excellence seminar room',
    caption: 'SISCOL Steel Infra Solutions · Pre-Placement Talk',
  },
  {
    id: 'drive-seminar',
    src: '/placements/drives/drive-seminar.jpg',
    alt: 'Students attending a placement preparation seminar at MLRIT',
    caption: 'Campus Placement Preparation Session · MLRIT',
  },
  {
    id: 'drive-tp-office-desk',
    src: '/placements/drives/drive-tp-office-desk.jpg',
    alt: 'Training & Placement Cell staff at work at MLR Institute of Technology',
    caption: 'Training & Placement Cell · MLRIT',
  },
  {
    id: 'drive-tp-office-room',
    src: '/placements/drives/drive-tp-office-room.jpg',
    alt: 'Training & Placement Cell interview room at MLR Institute of Technology',
    caption: 'T&P Cell · Interview Room · MLRIT',
  },
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
  { label: 'Placement Drives',     href: '/placements/drives'               },
  { label: 'Alumni',               href: '/placements/alumni'               },
  { label: 'Reach Placements At',  href: '/placements/support'              },
];

