// Data for the Chronicles broadsheet — scraped from mlrit.ac.in/category/news/

export type Story = {
  section: string;
  title: string;
  titleItalic?: string;          // italic accent inside the title
  dek?: string;
  href: string;
  img?: string;
  meta?: string;
};

export const LEAD: Story = {
  section: 'Cover Story · Campus',
  title: '21st Annual Day at MLRIT — Trishna 2K26 brings the institution together',
  titleItalic: 'Trishna 2K26',
  dek: "From founders' speeches to student awards, the day stitched two decades of the institute's story into one evening — and reset what the next decade should look like.",
  href: 'https://mlrit.ac.in/21st-annual-day-celebrations/news/',
  img:  'https://mlrit.ac.in/wp-content/uploads/2026/04/annual-day2.jpeg',
  meta: 'By Campus Desk • 14 Mar 2026 • 8 min read',
};

export const LEAD_BODY = [
  "MLR Institute of Technology celebrated its 21st Annual Day, Trishna 2K26, on Friday — bringing together students, faculty, management and guests to commemorate the institution's achievements and recognise excellence in academics, research and co-curricular activities.",
  "Sri Bala Prasad Peddigari, Chief Innovation Officer at Tata Consultancy Services and Vice-Chair of the IEEE Hyderabad Section, urged a balanced focus on academics and physical activities essential for the holistic development of students.",
  "Sri Marri Rajashekhar Reddy, MLA of Malkajgiri and Founder Secretary, reiterated that the institution was founded with a vision of promoting academic excellence, research, innovation and entrepreneurship while nurturing graduates with human values.",
];

export const MID_STORIES: Story[] = [
  {
    section: 'Student Voice',
    title: 'Koduri Viplav picked for the national Viksit Bharat Young Leaders Dialogue 2026',
    titleItalic: 'Viksit Bharat Young Leaders Dialogue 2026',
    dek: 'An MLRIT student joins a national cohort in Delhi — and returns with a sharper read on what India is asking from its campuses.',
    href: 'https://mlrit.ac.in/mlrit-student-koduri-viplav-selected-for-national-level-viksit-bharat-young-leaders-dialogue-2026/news/',
    img:  'https://mlrit.ac.in/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-06-at-18.34.19.jpeg',
    meta: 'Newsroom · 08 Jan 2026 · 6 min',
  },
  {
    section: 'Research',
    title: 'TSFA–UNESCO workshop marks the International Day of Light at MLRIT',
    titleItalic: 'International Day of Light',
    dek: 'A two-day workshop blends sustainability, optics and outreach — bringing UNESCO scholars onto the second-floor seminar hall.',
    href: 'https://mlrit.ac.in/tsfa-unesco-workshop-at-mlrit/news/',
    img:  'https://mlrit.ac.in/wp-content/uploads/2026/01/WhatsApp-Image-2025-12-30-at-18.32.07.jpeg',
    meta: 'Research Desk · 02 Jan 2026 · 7 min',
  },
  {
    section: 'Campus',
    title: 'National Integration Camp — five states, one stage, fortnight of fellowship',
    dek: 'NSS volunteers from five states converge at MLRIT for a fortnight of cultural exchange, field service and shared meals.',
    href: 'https://mlrit.ac.in/national-integration-camp-at-mlrit/news/',
    img:  'https://mlrit.ac.in/wp-content/uploads/2026/01/WhatsApp-Image-2025-12-23-at-06.52.51.jpeg',
    meta: 'NSS Cell · 24 Dec 2025 · 5 min',
  },
];

export const MOST_READ: Story[] = [
  { section: 'Cover',       title: '21st Annual Day — Trishna 2K26 brings two decades of MLRIT together',           href: 'https://mlrit.ac.in/21st-annual-day-celebrations/news/', meta: 'Campus · 14 Mar 2026' },
  { section: 'Voice',       title: 'Koduri Viplav selected for Viksit Bharat Young Leaders Dialogue 2026',          href: 'https://mlrit.ac.in/mlrit-student-koduri-viplav-selected-for-national-level-viksit-bharat-young-leaders-dialogue-2026/news/', meta: 'Student Voice · 08 Jan 2026' },
  { section: 'Placements',  title: 'Cybage scholarships granted to MLRIT students for academic year 2025–26',       href: 'https://mlrit.ac.in/cybage-scholarships-granted-for-mlrit-students/news/', meta: 'Placements · 12 Dec 2025' },
  { section: 'Aero',        title: 'MLRIT students shine at the National Drone Development Competition, Chennai',   href: 'https://mlrit.ac.in/mlrit-students-shine-in-drone-development-competition-at-chennai/news/', meta: 'Aeronautical · 02 Apr 2025' },
  { section: 'Sports',      title: "Free Sports Quota seats — MLRIT's pitch to athlete-students",                   href: 'https://mlrit.ac.in/free-sports-quota-seats/news/', meta: 'Sports · 08 Sep 2025' },
];

export const IN_BRIEF = [
  { date: '06 Sep', body: 'NIRF 2025 — MLRIT retains its band in the engineering category for a third successive year.' },
  { date: '01 Sep', body: 'Prerna outreach — MLRIT teams visit ZPHS Dundigal for a one-day mentoring drive with class X students.' },
  { date: '01 Sep', body: 'New sports grounds — Chairman inaugurates the resurfaced multi-sport grounds inside the campus.' },
  { date: '21 Aug', body: 'Orientation 2025 — first-year students are welcomed across all eight engineering branches.' },
  { date: '28 Jul', body: 'Graduation Day 2025 — the class of 2025 walks the stage at the main auditorium.' },
  { date: '10 Apr', body: 'Cisco ThingQbator — MLRIT named among the top ten institutions in Cohort 7 of the programme.' },
];

export const TIER_STORIES: Story[] = [
  { section: 'Placements', title: 'Cybage scholarships granted to MLRIT students',                 href: 'https://mlrit.ac.in/cybage-scholarships-granted-for-mlrit-students/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2026/01/WhatsApp-Image-2025-12-18-at-07.43.56.jpeg', meta: 'Newsroom · 12 Dec 2025 · 4 min' },
  { section: 'Recognition',title: 'NIRF 2025 — MLRIT holds its band in the engineering category',  href: 'https://mlrit.ac.in/nirf-2025/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/09/nirf-2.jpeg', meta: 'Newsroom · 06 Sep 2025 · 3 min' },
  { section: 'Outreach',   title: 'Prerna — MLRIT runs a science-outreach day at ZPHS Dundigal',   href: 'https://mlrit.ac.in/mlrit-organizes-prerna-outreach-programme-at-zphs-dundigal/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/09/Press-science1.jpeg', meta: 'Outreach Cell · 01 Sep 2025 · 4 min' },
  { section: 'Sports',     title: 'New sports grounds inaugurated — a campus that now plays in four codes', href: 'https://mlrit.ac.in/new-sports-grounds-inaugural-at-mlrit/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/09/Sports-inaugural.jpeg', meta: 'Sports Desk · 01 Sep 2025 · 3 min' },
  { section: 'Campus',     title: 'Orientation 2025 — eight branches, one auditorium, the first first day', href: 'https://mlrit.ac.in/orientation-day-2025/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/08/or.jpeg', meta: 'Campus Desk · 21 Aug 2025 · 5 min' },
  { section: 'Campus',     title: "Graduation Day 2025 — the class of '25 takes the stage",        href: 'https://mlrit.ac.in/graduation-day-2025/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/07/Grad.jpg', meta: 'Newsroom · 28 Jul 2025 · 6 min' },
  { section: 'Innovation', title: 'MLRIT among the top ten in Cisco ThingQbator Cohort 7',          href: 'https://mlrit.ac.in/mlrit-among-top-10-in-cisco-thingqbator-cohort-7/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/04/ThingQ-1.jpeg', meta: 'CIE-MLRIT · 10 Apr 2025 · 5 min' },
  { section: 'Aeronautical',title:'MLRIT students shine in the national drone development competition, Chennai', href: 'https://mlrit.ac.in/mlrit-students-shine-in-drone-development-competition-at-chennai/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/04/Aero1.jpeg', meta: 'Aeronautical · 02 Apr 2025 · 6 min' },
];

export const ARCHIVE: Story[] = [
  { section: 'Innovation', title: 'MLRIT Hyderabad receives a semi-humanoid robot from AIRA', href: 'https://mlrit.ac.in/mlrit-hyderabad-receives-semi-humanoid-robot-from-aira/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2024/08/AIRA_Bot.jpeg', meta: 'Newsroom · 03 Aug 2024 · 4 min' },
  { section: 'Events',     title: 'CIE-MLRIT hosts Equinox 2K24 — three days of pitches, prototypes and grants', href: 'https://mlrit.ac.in/cie-mlrit-hosts-equinox-2k24/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2024/12/Equinox-English.jpeg', meta: 'CIE-MLRIT · 02 Dec 2024 · 5 min' },
  { section: 'Sports',     title: 'The Chairman swims — and brings home five medals',         href: 'https://mlrit.ac.in/mlr-chairman-bagged-5-medals-in-swimming/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/04/Swimming1.jpeg', meta: 'Sports Desk · 08 Apr 2025 · 3 min' },
  { section: 'Academics',  title: 'ACM Student Chapter inaugurated — a new home for the CS community', href: 'https://mlrit.ac.in/acm-student-chapter-inaugurated-at-mlrit/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2024/11/ACMnews1.jpeg', meta: 'CSE Dept · 15 Sep 2024 · 4 min' },
  { section: 'Academics',  title: 'CSI hosts a one-day guide to health & cyber defense',      href: 'https://mlrit.ac.in/csi-organizes-guide-to-health-and-cyber-defense/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2024/12/CSI1.jpeg', meta: 'CSI Chapter · 29 Nov 2024 · 3 min' },
  { section: 'Industry',   title: 'MLRIT signs an MoU with PATPL — aeronautical pipeline strengthened', href: 'https://mlrit.ac.in/mlrit-mou-with-patpl/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2024/11/Aeronews1.jpeg', meta: 'Aeronautical · 15 Oct 2024 · 3 min' },
  { section: 'In the press', title: 'The Indian Express profiles MLRIT — a quiet decade of student work', href: 'https://mlrit.ac.in/indian-express-article-about-mlrit/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2024/07/MLRIT-article.jpeg', meta: 'Press · 01 Jul 2024 · 6 min' },
  { section: 'Events',     title: 'RoboTek 2K24 — ECE department hosts a national robotics meet', href: 'https://mlrit.ac.in/robotek-2k24-organized-by-dept-of-ece/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2024/05/Robotics.png', meta: 'ECE Dept · 15 May 2024 · 5 min' },
];

export const PHOTO_ESSAY = [
  { tag: '14 Mar 2026 · Annual Day', title: 'Trishna 2K26 — when two decades took a bow', href: 'https://mlrit.ac.in/21st-annual-day-celebrations/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2026/04/annual-day2.jpeg' },
  { tag: '28 Jul 2025 · Graduation', title: 'Caps in the air, a class on its way out',     href: 'https://mlrit.ac.in/graduation-day-2025/news/',           img: 'https://mlrit.ac.in/wp-content/uploads/2025/07/Grad.jpg' },
  { tag: '01 Sep 2025 · Sport',      title: 'First lap on the new grounds',                 href: 'https://mlrit.ac.in/new-sports-grounds-inaugural-at-mlrit/news/', img: 'https://mlrit.ac.in/wp-content/uploads/2025/09/Sports-inaugural.jpeg' },
];
