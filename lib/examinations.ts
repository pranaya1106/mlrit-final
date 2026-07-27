// Single source of truth for Examinations section navigation and document data.

/* ── Navigation ──────────────────────────────────────────────────────── */

export interface ExamNavItem {
  label: string;
  href: string;
  /** Sub-tabs rendered inside the page (not a separate top-level tab) */
  children?: { label: string; href: string }[];
}

export const EXAMS_NAV: ExamNavItem[] = [
  { label: 'COE',                       href: '/examinations/coe'                   },
  { label: 'Circulars',                 href: '/examinations/circulars'             },
  { label: 'Notifications',            href: '/examinations/notifications'         },
  {
    label: 'Timetables',
    href: '/examinations/timetable',
    children: [
      { label: 'Internal',              href: '/examinations/timetable/internal'    },
      { label: 'External',              href: '/examinations/timetable/external'    },
    ],
  },
  { label: 'Exam Fee & Results',        href: '/examinations/fee-results'           },
  { label: 'Student Verifications',     href: '/examinations/student-verifications' },
  { label: 'Citizen Charter',           href: '/examinations/citizen-charter'       },
  { label: 'Application of Certificates', href: '/examinations/certificates'        },
  { label: 'Downloads',                 href: '/examinations/downloads'             },
  { label: 'PYQs',                      href: '/examinations/pyqs'                  },
  { label: 'Annual Reports',            href: '/examinations/annual-reports'        },
  { label: 'Contact Us',                href: '/examinations/contact'               },
];

/* ── Document types ───────────────────────────────────────────────────── */

export type DocCategory =
  | 'forms'
  | 'regulations'
  | 'calendars'
  | 'timetable'
  | 'policy'
  | 'charter'
  | 'verification'
  | 'certificates'
  | 'annual-report'
  | 'circular'
  | 'notification';

export interface ExaminationDocument {
  label: string;
  desc?: string;
  href: string;
  category: DocCategory;
  badge?: string;
  /** Show a "Current" indicator */
  current?: boolean;
  /** Year or regulation tag shown in UI */
  tag?: string;
  /** Link opens externally */
  external?: boolean;
}

/* ── Downloads (forms + policy) ────────────────────────────────────────── */

export const EXAM_DOWNLOADS: ExaminationDocument[] = [
  {
    label: 'Examination Policy',
    desc: 'Institutional examination conduct, malpractice and grievance policy.',
    href: '/examinations/exam-policy.pdf',
    category: 'policy',
    badge: 'Policy',
  },
  {
    label: 'CBT Application Form',
    desc: 'Application form for Computer-Based Test enrolment.',
    href: '/examinations/cbt-form.pdf',
    category: 'forms',
    badge: 'Form',
  },
  {
    label: 'Condonation of Attendance Form',
    desc: 'Apply for attendance condonation before the semester examination.',
    href: '/examinations/condonation-form.pdf',
    category: 'forms',
    badge: 'Form',
  },
  {
    label: 'Duplicate Grade Card',
    desc: 'Request a duplicate copy of your grade card.',
    href: '/examinations/duplicate-grade-card.pdf',
    category: 'forms',
    badge: 'Form',
  },
  {
    label: 'Name Correction Form',
    desc: 'Submit a name correction request for official examination records.',
    href: '/examinations/name-correction.pdf',
    category: 'forms',
    badge: 'Form',
  },
  {
    label: 'Plagiarism Check Form',
    desc: 'Submit project reports or theses for plagiarism screening.',
    href: '/examinations/plagiarism-check.pdf',
    category: 'forms',
    badge: 'Form',
  },
  {
    label: 'Re-Admission Form',
    desc: 'Re-admission application for students rejoining after a gap.',
    href: '/examinations/readmission.pdf',
    category: 'forms',
    badge: 'Form',
  },
  {
    label: 'Transcript Application',
    desc: 'Official transcript request for foreign universities or employment.',
    href: '/examinations/transcript-form.pdf',
    category: 'forms',
    badge: 'Form',
  },
  {
    label: 'Important Instructions',
    desc: 'Instructions for students appearing in semester examinations.',
    href: '/examinations/important-instructions.pdf',
    category: 'policy',
    badge: 'Instructions',
  },
  {
    label: 'COE Profile',
    desc: 'Profile of the Controller of Examinations office and its functions.',
    href: '/examinations/coe-profile.pdf',
    category: 'policy',
    badge: 'Profile',
  },
];

/* ── Academic Calendars ────────────────────────────────────────────────── */

export const EXAM_CALENDARS: ExaminationDocument[] = [
  {
    label: 'Academic Calendar 2026–27',
    desc: 'Current academic year schedule — key dates, exam windows and holidays.',
    href: '/examinations/academic-calendar-2026-27.pdf',
    category: 'calendars',
    badge: 'Calendar',
    current: true,
    tag: '2026–27',
  },
  {
    label: 'Academic Calendar 2025–26',
    desc: 'Previous academic year reference calendar.',
    href: '/examinations/academic-calendar-2025-26.pdf',
    category: 'calendars',
    badge: 'Calendar',
    tag: '2025–26',
  },
  {
    label: 'Academic Calendar 2024–25',
    href: '/examinations/academic-calendar-2024-25.pdf',
    category: 'calendars',
    badge: 'Calendar',
    tag: '2024–25',
  },
];

/* ── Timetables ─────────────────────────────────────────────────────────── */

export const EXAM_TIMETABLES_EXTERNAL: ExaminationDocument[] = [
  {
    label: 'IV B.Tech II Sem — May / June 2026',
    desc: 'External (JNTUH) timetable for final-year B.Tech students.',
    href: '/examinations/timetable-iv-btech-ii-sem-2026.pdf',
    category: 'timetable',
    badge: 'B.Tech',
    current: true,
    tag: 'IV B.Tech',
  },
];

export const EXAM_TIMETABLES_INTERNAL: ExaminationDocument[] = [
  {
    label: 'I M.Tech. II Sem — CIE II (R25, July 2026)',
    desc: 'Internal mid-term timetable for I M.Tech. II Semester, R25 regulation.',
    href: '/examinations/timetables/I-M.Tech.-II-Semester-R25-CIE-II-Examinations-July-2026-Timetable.pdf',
    category: 'timetable',
    badge: 'M.Tech',
    external: false,
  },
  {
    label: 'I MBA II Sem — CIE II (R25, July 2026)',
    desc: 'Internal mid-term timetable for I MBA II Semester, R25 regulation.',
    href: '/examinations/timetables/I-MBA-II-Semester-R25-CIE-II-Examinations-July-2026-Timetable.pdf',
    category: 'timetable',
    badge: 'MBA',
    external: false,
  },
  {
    label: 'Ph.D. Course Work — MID II (R25, July 2026)',
    desc: 'Internal mid-term timetable for Ph.D. Course Work, R25 regulation.',
    href: '/examinations/timetables/Ph.D.-Course-Work-R25-MID-II-Examinations-July-2026-Timetable.pdf',
    category: 'timetable',
    badge: 'Ph.D.',
    external: false,
  },
];

/* ── Citizen Charter ────────────────────────────────────────────────────── */

export const CITIZEN_CHARTER: ExaminationDocument = {
  label: 'Citizen Charter — Examinations',
  desc: 'The COE Citizen Charter outlines service standards, timelines and grievance redressal mechanisms for all examination-related services.',
  href: '/examinations/citizen-charter.pdf',
  category: 'charter',
  badge: 'Charter',
};

/* ── Student Verification ─────────────────────────────────────────────── */

export const STUDENT_VERIFICATION: ExaminationDocument = {
  label: 'Student Verification Form',
  desc: 'Official verification request for degree, provisional certificate or grade card authenticity — used by employers or institutions.',
  href: '/examinations/student-verification.pdf',
  category: 'verification',
  badge: 'Verification',
};

/* ── Application of Certificates ──────────────────────────────────────── */

export const CERTIFICATES_FORM: ExaminationDocument = {
  label: 'Apply for Certificates',
  desc: 'Application form for provisional certificate, degree certificate, migration certificate, medium of instruction letter and other official documents.',
  href: '/examinations/apply-for-certificates.pdf',
  category: 'certificates',
  badge: 'Form',
};

/* ── Contacts ────────────────────────────────────────────────────────── */

export interface ExamContact {
  name: string;
  role: string;
  phone: string;
  email: string;
  purpose: string;
  tollFree?: boolean;
}

export const EXAM_CONTACTS: ExamContact[] = [
  {
    name: 'Mr. G. Prabhakar Reddy',
    role: 'Controller of Examinations',
    phone: '91009 63025',
    email: 'coe@mlrinstitutions.ac.in',
    purpose: 'Examinations, results, timetables, regulations and certificates.',
  },
  {
    name: 'Examinations Office',
    role: 'General Enquiries',
    phone: '1800 572 4363',
    email: 'coe@mlrinstitutions.ac.in',
    purpose: 'Fee payments, re-evaluation applications and general exam queries.',
    tollFree: true,
  },
];
