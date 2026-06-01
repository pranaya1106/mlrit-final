/**
 * Content for the secondary nav-bar pages (About sub-pages, Admissions,
 * Campus, Messages, etc.). One shared data shape so a single component
 * can render every page consistently.
 */

export type InfoBlock =
  | { kind: 'lead'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'bullets'; title?: string; items: string[] }
  | { kind: 'stat-grid'; items: { num: string; label: string }[] }
  | { kind: 'cards'; items: { title: string; body: string; href?: string }[] }
  | { kind: 'quote'; text: string; attribution: string; role?: string }
  | { kind: 'cta'; label: string; href: string; external?: boolean };

export type InfoPage = {
  eyebrow: string;        // "About · Vision & Mission" etc.
  title: string;          // "Introduction"
  italic?: string;        // "to MLRIT" — appended after title
  dek: string;            // Sub-headline / lede
  crumbs: { label: string; href?: string }[];
  blocks: InfoBlock[];
};

export const INFO_PAGES: Record<string, InfoPage> = {
  /* ──────────────────── ABOUT ──────────────────── */

  'about/vision-mission/introduction': {
    eyebrow: 'About · Vision & Mission',
    title: 'Introduction',
    italic: 'to MLRIT',
    dek: 'A snapshot of the institute — its founding, its scale, and the engineers it builds.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Introduction' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLR Institute of Technology (MLRIT) is a premier autonomous engineering institution founded in 2005 under the KMR Educational Society. Located at Dundigal, Hyderabad, the institute is affiliated to JNTU Hyderabad and approved by AICTE.',
      },
      {
        kind: 'paragraph',
        text:
          'Over two decades, MLRIT has grown from a 240-seat campus into a 11,000-student institution running 11 engineering and management departments, three active research centres, and an industry-MoU portfolio that includes Virtusa, EPAM, Boeing, Cyient and Tata Technologies. The institute holds NAAC institutional accreditation, NBA programme-level accreditation across CSE/ECE/EEE/MECH/IT, and is ranked in the NIRF engineering category.',
      },
      {
        kind: 'stat-grid',
        items: [
          { num: '2005', label: 'Founded' },
          { num: '11K+', label: 'Students on campus' },
          { num: '7K+',  label: 'Alumni worldwide' },
          { num: '11',   label: 'Departments' },
          { num: '25+',  label: 'Doctoral faculty' },
          { num: '12',   label: 'Labs in CSE alone' },
        ],
      },
      {
        kind: 'bullets',
        title: 'What sets MLRIT apart',
        items: [
          'Autonomous status — own curriculum, own examinations, own assessment systems.',
          'NAAC + NBA accreditation — quality benchmarks recognised nationally.',
          'Industry-integrated curriculum across all 11 departments.',
          'Live capstones, paid internships, and a 98% placement record across cohorts.',
          'Doctoral-strong faculty with active publications and patents.',
        ],
      },
      { kind: 'cta', label: 'Read the full About page →', href: '/about' },
    ],
  },

  'about/vision-mission/vision-mission': {
    eyebrow: 'About · Vision & Mission',
    title: 'Vision and',
    italic: 'mission.',
    dek: 'The North Star that guides every department, every curriculum decision, every campus investment.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Vision & Mission' }],
    blocks: [
      {
        kind: 'cards',
        items: [
          {
            title: 'Vision',
            body:
              'To emerge as a centre of excellence in technical education and research — producing globally competent engineers, capable of building a strong and developed nation.',
          },
          {
            title: 'Mission',
            body:
              'To deliver an industry-aligned curriculum, operate well-resourced laboratories, and nurture a research culture that empowers every student — producing professionals equipped to lead in an evolving world.',
          },
        ],
      },
      {
        kind: 'bullets',
        title: 'Strategic priorities',
        items: [
          'Outcome-Based Education across every programme — clear PEOs, COs and POs at the course level.',
          'Industry MoUs that convert into electives, internships and live capstones.',
          'A doctoral-strong, research-active faculty with continuous publication output.',
          'Equity in admissions and placements — diversity is a measured metric, not a slogan.',
          'A culture of student-led entrepreneurship, with on-campus IPFC support.',
        ],
      },
    ],
  },

  'about/legacy': {
    eyebrow: 'About',
    title: 'Twenty years,',
    italic: 'one mission.',
    dek: 'A chronology of the milestones that took MLRIT from a 240-seat campus in 2005 to an autonomous institution in 2026.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Legacy' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT was founded by Sri Marri Laxman Reddy Garu and his family under the KMR Educational Society — with the conviction that engineering education in Telangana needed an institution that combined depth with discipline.',
      },
      {
        kind: 'bullets',
        title: 'Milestones',
        items: [
          '2005 — Foundation. Inaugural intake of 240 across CSE, ECE, MECH, EEE.',
          '2008 — First B.Tech batch graduates. CSE earns the first NBA cycle.',
          '2011 — M.Tech programmes launched across CSE, ECE, MECH, EEE.',
          '2017 — IPFC established to support student patent filings and IPR awareness.',
          '2019 — NAAC institutional accreditation granted.',
          '2022 — UGC autonomous status. MLRIT now designs its own curriculum.',
          '2024 — New UG programmes launched (AIML, CSE-CS, CSE-DS, CSIT, IT).',
          '2025 — 20-year milestone. 11,000+ students, 7,000+ alumni placed worldwide.',
          '2026 — Trishna 2K26: 621 placement offers, ₹51 LPA top package.',
        ],
      },
      { kind: 'cta', label: 'See the full timeline on About →', href: '/about' },
    ],
  },

  'about/rankings-awards': {
    eyebrow: 'About',
    title: 'Rankings and',
    italic: 'awards.',
    dek: 'The accreditations, rankings and external recognitions that benchmark MLRIT against national engineering institutions.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Rankings & Awards' }],
    blocks: [
      {
        kind: 'cards',
        items: [
          { title: 'NAAC Accredited',  body: 'Institutional accreditation — recognises overall quality of governance, learning and research.' },
          { title: 'NBA Accredited',   body: 'Programme-level accreditation across CSE, ECE, EEE, MECH and IT.' },
          { title: 'NIRF Engineering', body: 'Featured in the National Institutional Ranking Framework — engineering category, 201–300 band, three years running.' },
          { title: 'UGC Autonomous',   body: 'Granted autonomous status. MLRIT designs its own curriculum, regulations and assessment systems.' },
          { title: 'AICTE Approved',   body: 'All B.Tech, M.Tech and MBA programmes approved by the All India Council for Technical Education.' },
          { title: 'JNTUH Affiliated', body: 'Degrees awarded by Jawaharlal Nehru Technological University, Hyderabad — under MLRIT autonomous regulations.' },
        ],
      },
      {
        kind: 'bullets',
        title: 'Departmental recognitions',
        items: [
          'CSE — NBA accredited since 2008, NIRF-featured for three consecutive years.',
          'ECE — NBA accredited, Boeing-partnered avionics lab.',
          'Mechanical — NBA accredited, industry MoUs with Tata Technologies and Cyient.',
          'EEE — NBA accredited, Centres of Excellence in renewable energy systems.',
          'IT — NBA accredited, EPAM-partnered curriculum.',
        ],
      },
    ],
  },

  'about/brochure': {
    eyebrow: 'About',
    title: 'Institute',
    italic: 'brochure.',
    dek: 'Download the official MLRIT institute brochure — academics, admissions, campus, placements, and contact information.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Brochure' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'The MLRIT brochure is a single PDF that covers every aspect of the institute — programmes, faculty, infrastructure, placement records, fees, and admission timelines. Use it as a starting point or share it with prospective students.',
      },
      {
        kind: 'cta',
        label: 'Download the brochure (PDF) →',
        href: 'https://mlrit.ac.in/wp-content/uploads/2024/06/MLRIT-Brochure.pdf',
        external: true,
      },
      {
        kind: 'cards',
        items: [
          { title: 'Programmes',  body: '11 engineering and management departments. UG (B.Tech), PG (M.Tech, MBA), and Ph.D. across 5 disciplines.', href: '/academics' },
          { title: 'Placements',  body: '₹51 LPA highest package. 98% placement rate. 7,000+ alumni placed worldwide.', href: '/placements' },
          { title: 'Research',    body: 'Three research centres, 25+ doctoral faculty, IPFC support for patents.', href: '/research' },
        ],
      },
    ],
  },

  'about/messages/principal': {
    eyebrow: 'About · Messages',
    title: "Principal's",
    italic: 'message.',
    dek: 'From the desk of the Principal, MLR Institute of Technology.',
    crumbs: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Messages' },
      { label: "Principal's Message" },
    ],
    blocks: [
      {
        kind: 'quote',
        text:
          'We believe that engineering education is most powerful when it is hands-on, industry-aligned and research-driven. At MLRIT, we have built that — across 11 departments, with a faculty team that mentors every student from the first class to the final capstone. Welcome to a place where ideas turn into engineering.',
        attribution: 'Dr. K. Srinivas Rao',
        role: 'Principal, MLR Institute of Technology',
      },
      {
        kind: 'paragraph',
        text:
          'Under the Principal\'s leadership, MLRIT has expanded into autonomous status, launched five new UG programmes, and grown its research-active doctoral faculty to over 25. The placement record — capped by the ₹51 LPA top package of 2026 — speaks to a curriculum that meets industry where industry is heading.',
      },
      { kind: 'cta', label: 'Explore academics →', href: '/academics' },
    ],
  },

  'about/messages/dean': {
    eyebrow: 'About · Messages',
    title: "Dean's",
    italic: 'message.',
    dek: 'From the desk of the Dean, Academics.',
    crumbs: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Messages' },
      { label: "Dean's Message" },
    ],
    blocks: [
      {
        kind: 'quote',
        text:
          'Academic excellence at MLRIT is not a slogan — it is a practice. Outcome-Based Education, regular curriculum review with industry experts, and a culture of measurable assessment combine to produce graduates ready for the world they will shape.',
        attribution: 'Dr. P. Rajashekar',
        role: 'Dean, Academics — MLRIT',
      },
      {
        kind: 'paragraph',
        text:
          'The Dean\'s office anchors curriculum design, examination governance, and Programme Outcome (PO) attainment across every department. Through autonomous status, MLRIT now refreshes regulations on a rolling cycle — keeping the curriculum aligned with what industry needs next.',
      },
      { kind: 'cta', label: 'Open the academics overview →', href: '/academics' },
    ],
  },

  /* ──────────────────── ADMISSIONS ──────────────────── */

  'admissions/how-to-apply': {
    eyebrow: 'Admissions',
    title: 'How to',
    italic: 'apply.',
    dek: 'A step-by-step guide to applying to MLRIT — across B.Tech, M.Tech and MBA programmes.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Admissions' }, { label: 'How to Apply' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'Admissions to MLRIT are managed through TS-EAMCET (B.Tech), GATE / PGECET (M.Tech) and TS-ICET (MBA). A small percentage of seats are filled through management-quota counselling.',
      },
      {
        kind: 'bullets',
        title: 'Application steps — B.Tech',
        items: [
          'Appear for TS EAMCET and qualify with a valid rank.',
          'Register and participate in TS EAMCET counselling.',
          'Select MLRIT (institute code: MLRD) as a preference during web-options.',
          'Pay the counselling-allocation fee and report to MLRIT with original certificates.',
          'For management-quota seats, contact the MLRIT admissions office directly.',
        ],
      },
      {
        kind: 'bullets',
        title: 'Application steps — M.Tech / MBA',
        items: [
          'M.Tech: qualify GATE or TS PGECET; participate in PGECET counselling.',
          'MBA: qualify TS ICET; participate in ICET counselling.',
          'Select MLRIT during web-options and report after allocation.',
        ],
      },
      { kind: 'cta', label: 'Visit MLRIT admissions →', href: 'https://mlrit.ac.in/admissions/', external: true },
    ],
  },

  'admissions/eligibility': {
    eyebrow: 'Admissions',
    title: 'Eligibility',
    italic: 'criteria.',
    dek: 'Programme-wise eligibility requirements for B.Tech, M.Tech and MBA admissions.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Admissions' }, { label: 'Eligibility' }],
    blocks: [
      {
        kind: 'cards',
        items: [
          {
            title: 'B.Tech',
            body:
              '10+2 (or equivalent) with Mathematics, Physics and Chemistry — minimum 45% aggregate (40% for reserved categories). Valid TS-EAMCET rank required.',
          },
          {
            title: 'M.Tech',
            body:
              'Bachelor\'s degree in Engineering / Technology (or equivalent) in the relevant discipline with minimum 50% aggregate (45% reserved). Valid GATE or TS-PGECET rank.',
          },
          {
            title: 'MBA',
            body:
              'Bachelor\'s degree in any discipline with minimum 50% aggregate (45% reserved). Valid TS-ICET / CAT / MAT / XAT rank.',
          },
        ],
      },
      {
        kind: 'bullets',
        title: 'Additional notes',
        items: [
          'Lateral entry to B.Tech (3-year) is available through TS ECET — for diploma holders.',
          'Ph.D. eligibility follows JNTUH Ph.D. regulations — Master\'s degree in the relevant discipline.',
          'For management-quota admissions, contact the MLRIT admissions office for current-year cut-offs.',
        ],
      },
    ],
  },

  'admissions/fee-structure': {
    eyebrow: 'Admissions',
    title: 'Fee',
    italic: 'structure.',
    dek: 'Annual fee structure across UG and PG programmes at MLRIT.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Admissions' }, { label: 'Fee Structure' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT fees are determined by the Telangana State Higher Education Council (TSCHE) under the convener-quota structure. Management-quota fees are notified separately each year.',
      },
      {
        kind: 'cards',
        items: [
          { title: 'B.Tech (Convener)', body: 'As fixed by TSCHE. Annual tuition typically includes academic fee, university fee, and student welfare charges.' },
          { title: 'B.Tech (Management)', body: 'Notified each academic year. Contact the admissions office for the current management-quota fee schedule.' },
          { title: 'M.Tech', body: 'As fixed by TSCHE. Stipend-eligible candidates (GATE-qualified) may receive AICTE-funded scholarships.' },
          { title: 'MBA', body: 'As fixed by TSCHE. ICET-allocated seats follow the convener-quota fee schedule.' },
        ],
      },
      {
        kind: 'bullets',
        title: 'What the fee covers',
        items: [
          'Tuition, library, laboratory and university examination fees.',
          'Identity card, student handbook and orientation programmes.',
          'Hostel, transport and food are charged separately as opted.',
        ],
      },
      { kind: 'cta', label: 'View current fee schedule (mlrit.ac.in) →', href: 'https://mlrit.ac.in/admissions/', external: true },
    ],
  },

  'admissions/scholarships': {
    eyebrow: 'Admissions',
    title: 'Scholarships',
    italic: 'and aid.',
    dek: 'State, central and institute-level scholarships available to MLRIT students.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Admissions' }, { label: 'Scholarships' }],
    blocks: [
      {
        kind: 'cards',
        items: [
          { title: 'Post-Matric (SC/ST/BC/EBC)', body: 'Telangana State scholarship covering tuition reimbursement and maintenance allowance. Apply through the e-Pass portal each year.' },
          { title: 'AICTE Scholarships', body: 'Pragati & Saksham scholarships for girls and differently-abled students respectively. Awarded by AICTE to qualifying candidates.' },
          { title: 'Merit Scholarship', body: 'Institute-level award for top-ranking students in EAMCET / PGECET / ICET. Awarded annually.' },
          { title: 'Sports & Cultural', body: 'Fee concessions and stipends for state and national-level sports and cultural representatives.' },
        ],
      },
      {
        kind: 'bullets',
        title: 'How to apply',
        items: [
          'Government scholarships — apply via the Telangana e-Pass portal each academic year.',
          'AICTE scholarships — apply via the AICTE National Scholarship Portal (NSP).',
          'Institute scholarships — eligible students are notified by the MLRIT admissions office.',
        ],
      },
      { kind: 'cta', label: 'Telangana e-Pass portal →', href: 'https://telanganaepass.cgg.gov.in', external: true },
    ],
  },

  /* ──────────────────── CAMPUS ──────────────────── */

  'campus/hostels': {
    eyebrow: 'Campus · Life',
    title: 'Hostels',
    italic: 'on campus.',
    dek: 'Separate boys\' and girls\' hostels — modern, well-managed, walking distance from academic blocks.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campus' }, { label: 'Hostels' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT operates dedicated on-campus hostels for boys and girls. Rooms are organised on a sharing basis with attached washrooms, study furniture and 24×7 wi-fi.',
      },
      {
        kind: 'bullets',
        title: 'Amenities',
        items: [
          'Air-cooled, well-ventilated rooms with study furniture.',
          'Hostel mess with weekly menus prepared by qualified caterers.',
          '24×7 wi-fi connectivity in rooms and common areas.',
          'Recreation rooms with TV, indoor games and a reading lounge.',
          'Resident wardens, medical room and 24×7 security.',
        ],
      },
      {
        kind: 'stat-grid',
        items: [
          { num: '2',     label: 'Hostel blocks' },
          { num: '24×7',  label: 'Security & wi-fi' },
          { num: '4',     label: 'Meals per day' },
          { num: '100m',  label: 'To academic blocks' },
        ],
      },
    ],
  },

  'campus/sports': {
    eyebrow: 'Campus · Life',
    title: 'Sports',
    italic: 'at MLRIT.',
    dek: 'A full-spectrum sports programme — cricket, football, kabaddi, basketball, badminton, athletics — plus dedicated coaching.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campus' }, { label: 'Sports' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT runs one of the strongest sports programmes among Hyderabad engineering colleges. From cricket and football to kabaddi and athletics, the institute fields competitive teams at the JNTU, state and national levels.',
      },
      {
        kind: 'bullets',
        title: 'Facilities',
        items: [
          'Full-size cricket field and football ground.',
          'Indoor courts for basketball, badminton and table tennis.',
          'Synthetic athletics track and dedicated kabaddi pit.',
          'Gymnasium with strength and conditioning equipment.',
          'Resident coaches across cricket, kabaddi, athletics and team sports.',
        ],
      },
      {
        kind: 'bullets',
        title: 'Achievements',
        items: [
          'JNTU-H inter-college champions across multiple sports.',
          'Student-athletes representing Telangana at the South Zone level.',
          'Annual sports meet attracting cross-college participation.',
        ],
      },
    ],
  },

  'campus/cafeteria': {
    eyebrow: 'Campus · Life',
    title: 'Cafeteria',
    italic: '& food.',
    dek: 'Multiple food courts and a central cafeteria — affordable, hygienic, and open all day.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campus' }, { label: 'Cafeteria' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT runs a central cafeteria and multiple food courts across the campus. Menus rotate weekly and span South Indian, North Indian, Chinese and continental cuisines — at student-friendly prices.',
      },
      {
        kind: 'bullets',
        title: 'Highlights',
        items: [
          'Central cafeteria open 8 am – 8 pm.',
          'Food courts in the engineering and management blocks.',
          'Weekly rotating menus across regional cuisines.',
          'Hygiene-audited kitchens and routine quality checks.',
          'Pre-paid card system for cashless transactions.',
        ],
      },
    ],
  },

  'campus/transport': {
    eyebrow: 'Campus · Life',
    title: 'Transport',
    italic: 'services.',
    dek: 'Institute-operated buses across 40+ routes covering Hyderabad — punctual, safe, GPS-tracked.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campus' }, { label: 'Transport' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT operates a fleet of buses across 40+ routes spanning Hyderabad, Secunderabad and the surrounding suburbs. All buses are GPS-tracked and operated by professionally trained drivers.',
      },
      {
        kind: 'stat-grid',
        items: [
          { num: '40+',  label: 'Active routes' },
          { num: '60+',  label: 'Buses' },
          { num: 'GPS',  label: 'Tracked in real-time' },
          { num: '24×7', label: 'Helpline' },
        ],
      },
      {
        kind: 'bullets',
        title: 'Coverage',
        items: [
          'Major Hyderabad clusters — Kukatpally, Miyapur, Ameerpet, Secunderabad, LB Nagar.',
          'Suburban towns and townships connected via dedicated routes.',
          'Special evening shuttles after extended labs and project work.',
          'GPS-based parent app for real-time bus tracking.',
        ],
      },
    ],
  },

  'campus/clubs': {
    eyebrow: 'Campus · Life',
    title: 'Clubs and',
    italic: 'societies.',
    dek: 'From robotics and coding to dance, drama and debate — student-led clubs that build community.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campus' }, { label: 'Clubs & Societies' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT supports 30+ student-led clubs across technical, cultural, social and sports domains. Every department hosts at least one technical society; the cultural calendar runs throughout the year.',
      },
      {
        kind: 'cards',
        items: [
          { title: 'Coding & Robotics',     body: 'Hackathons, ACM-ICPC training, robotics competitions, IEEE student branch.' },
          { title: 'Cultural Societies',    body: 'Dance crews, music ensembles, theatre, photography, fine arts.' },
          { title: 'Literary & Debate',     body: 'Literary club, debate society, model UN, quizzing teams.' },
          { title: 'Social & Service',      body: 'NSS unit, Rotaract, blood-donation drives, rural outreach.' },
          { title: 'Department Societies',  body: 'Tech societies in CSE, ECE, EEE, MECH, IT and AIML.' },
          { title: 'Sports Clubs',          body: 'Cricket, football, kabaddi, basketball, badminton, athletics.' },
        ],
      },
    ],
  },

  'campus/events': {
    eyebrow: 'Campus · Life',
    title: 'Events',
    italic: 'on campus.',
    dek: 'The annual cultural and technical calendar — Trishna, Symphony, hackathons, and department fests.',
    crumbs: [{ label: 'Home', href: '/' }, { label: 'Campus' }, { label: 'Events' }],
    blocks: [
      {
        kind: 'lead',
        text:
          'MLRIT\'s event calendar runs year-round — anchored by the annual Trishna celebration, the cultural festival Symphony, departmental tech-fests and a continuous stream of guest lectures, hackathons and industry workshops.',
      },
      {
        kind: 'cards',
        items: [
          { title: 'Trishna',         body: 'Annual Day — combines tech, culture and recognition. Trishna 2K26 celebrated 20 years with 621 placement offers.' },
          { title: 'Symphony',        body: 'Cultural festival — dance, drama, music, fashion. Cross-college participation.' },
          { title: 'Department Fests', body: 'Each department hosts a yearly tech-fest with workshops, paper presentations and competitions.' },
          { title: 'Hackathons',      body: 'Periodic 24/48-hour hackathons in partnership with industry sponsors.' },
          { title: 'Guest Lectures',  body: 'Weekly industry lectures from MoU partners and alumni speakers.' },
          { title: 'Convocations',    body: 'Annual graduation ceremonies featuring chief guests from government, industry and academia.' },
        ],
      },
      { kind: 'cta', label: 'See homepage events showcase →', href: '/#events' },
    ],
  },
};

export function getInfoPage(slug: string): InfoPage | undefined {
  return INFO_PAGES[slug];
}
