// Clubs & Societies data — single source of truth for the /campus/clubs page.
// Club list reflects actual MLRIT clubs as provided.

export type ClubCategory =
  | 'Technical'
  | 'Cultural'
  | 'Department'
  | 'Social Service'
  | 'Society';

export interface Club {
  id: string;
  name: string;
  shortName: string;
  category: ClubCategory;
  description: string;
  /** Path relative to /public */
  image: string;
  facultyCoordinator?: string;
  studentLead?: string;
  members?: string;
  /** Optional dedicated club page route */
  href?: string;
}

export const CLUB_CATEGORIES: ClubCategory[] = [
  'Technical',
  'Department',
  'Cultural',
  'Social Service',
  'Society',
];

export const CLUBS: Club[] = [
  // ─── Technical ────────────────────────────────────────────────────────────
  {
    id: 'scope',
    name: 'SCOPE',
    shortName: 'SCOPE',
    category: 'Technical',
    description:
      'Student Chapter of Professionals and Engineers — organises tech workshops, coding challenges, and industry-connect sessions to bridge classroom learning with real-world engineering.',
    image: '/images/students/classroom-chat.png',
    members: '300+',
  },
  {
    id: 'apex',
    name: 'APEX Club',
    shortName: 'APEX',
    category: 'Technical',
    description:
      'Advanced Programming and Excellence Club — competitive coding, hackathons, open-source contributions, and preparation for ICPC and global coding contests.',
    image: '/images/students/reel-aiml.png',
    members: '250+',
  },
  {
    id: 'cie',
    name: 'CIE',
    shortName: 'CIE',
    category: 'Technical',
    description:
      'Centre for Innovation and Entrepreneurship — the on-campus incubator that takes student ideas from prototype to pitch. Home of product sprints, startup mentoring, and investor days.',
    image: '/images/facilities/campus/sti-hub-1.jpg',
    members: '200+',
  },
  {
    id: 'ewb',
    name: 'Engineers Without Borders',
    shortName: 'EWB',
    category: 'Technical',
    description:
      'Engineers Without Borders — applying engineering skills to real social challenges. Members work on sustainable infrastructure, clean water, and community development projects.',
    image: '/images/facilities/campus/sti-hub-2.jpg',
    members: '120+',
  },

  // ─── Department ───────────────────────────────────────────────────────────
  {
    id: 'cse-ds',
    name: 'CSE–DS Society',
    shortName: 'CSE DS',
    category: 'Department',
    description:
      'Department society for Computer Science – Data Science. Runs data analytics bootcamps, Kaggle competitions, Python workshops, and data visualisation projects.',
    image: '/images/students/reel-cse.png',
    members: '350+',
  },
  {
    id: 'cse-ml',
    name: 'CSE–ML Society',
    shortName: 'CSE ML',
    category: 'Department',
    description:
      'Department society for Computer Science – Machine Learning. Deep learning study circles, model deployment workshops, AI ethics seminars, and research paper reading groups.',
    image: '/images/students/reel-aiml.png',
    members: '300+',
  },
  {
    id: 'code',
    name: 'CODE Club',
    shortName: 'CODE',
    category: 'Department',
    description:
      'The department-level programming club — from first-year syntax to final-year system design. Weekly problem sets, peer debugging sessions, and placement prep.',
    image: '/images/students/faculty-seminar.png',
    members: '400+',
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering Society',
    shortName: 'MECH',
    category: 'Department',
    description:
      'Hands-on mechanical workshops, CAD design sprints, automotive engineering projects, and participation in national-level robocon and design competitions.',
    image: '/images/facilities/campus/sti-hub-3.jpg',
    members: '280+',
  },
  {
    id: 'eee',
    name: 'EEE Department Society',
    shortName: 'EEE',
    category: 'Department',
    description:
      'Electrical and Electronics Engineering society — circuit design labs, power systems seminars, renewable energy projects, and industry visits to power plants.',
    image: '/images/students/faculty-classroom.png',
    members: '220+',
  },
  {
    id: 'robotics',
    name: 'Robotics Club',
    shortName: 'ROBOTICS',
    category: 'Department',
    description:
      'A technical student community under the ECE Department — robotics workshops, embedded systems projects, Robothon competitions, IEEE RAS sessions, and breakthrough builds like the Borewell Rescue Robot and Brain-Controlled Wheelchair.',
    image: '/images/clubs/robotics-hero.png',
    members: '320+',
    href: '/campus/clubs/robotics',
  },
  {
    id: 'aero',
    name: 'Aeronautical Engineering Society',
    shortName: 'AERO',
    category: 'Department',
    description:
      'Aeromodelling, UAV design, wind tunnel experiments, and national aerospace competition entries. One of MLRIT\'s most active department societies.',
    image: '/images/students/reel-aero.png',
    members: '180+',
  },

  // ─── Cultural ─────────────────────────────────────────────────────────────
  {
    id: 'came',
    name: 'CAME',
    shortName: 'CAME',
    category: 'Cultural',
    description:
      'Cultural Arts, Music, and Entertainment — the creative heartbeat of MLRIT. Dance, music, theatre, and visual arts come together for Symphony, Trishna, and inter-college fests.',
    image: '/images/students/club-event.png',
    members: '450+',
  },
  {
    id: 'lit',
    name: 'LIT Club',
    shortName: 'LIT',
    category: 'Cultural',
    description:
      'Literary and Intellectual Tribe — creative writing, poetry slams, debate, MUN simulations, college magazine editing, and annual short-story competitions.',
    image: '/images/facilities/campus/library-wide-1.jpg',
    members: '150+',
  },

  // ─── Social Service ───────────────────────────────────────────────────────
  {
    id: 'nss',
    name: 'NSS Unit',
    shortName: 'NSS',
    category: 'Social Service',
    description:
      'National Service Scheme — rural camps, blood donation drives, voter awareness drives, tree plantation, and Swachh Bharat initiatives. One of MLRIT\'s largest student bodies.',
    image: '/images/students/campus-group.png',
    facultyCoordinator: 'Programme Officer, NSS',
    members: '500+',
  },

  // ─── Society ──────────────────────────────────────────────────────────────
  {
    id: 'csi',
    name: 'CSI Student Chapter',
    shortName: 'CSI',
    category: 'Society',
    description:
      'Computer Society of India — professional networking, tech talks, certification workshops, industry connect events, and participation in national CSI student conventions.',
    image: '/images/students/students-laughing.png',
    members: '270+',
  },
];

// Hero floating card images — used by the Trionn-style convergence hero
export const HERO_ORBITAL_IMAGES = [
  { src: '/images/students/club-event.png',              alt: 'Students at a cultural event' },
  { src: '/images/facilities/campus/sti-hub-1.jpg',      alt: 'STI Hub innovation space' },
  { src: '/images/students/students-laughing.png',       alt: 'Students bonding on campus' },
  { src: '/images/sports/marathon-runner.png',           alt: 'Student marathon' },
  { src: '/images/facilities/campus/library-wide-1.jpg', alt: 'Campus library' },
  { src: '/images/students/campus-steps.png',            alt: 'Students on campus steps' },
  { src: '/images/students/classroom-chat.png',          alt: 'Students in discussion' },
  { src: '/images/campus/canteen-friends.png',           alt: 'Friends at the campus canteen' },
];
