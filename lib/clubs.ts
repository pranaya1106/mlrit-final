// Clubs & Societies data — single source of truth for the /campus/clubs page.
// Club list reflects actual MLRIT clubs as provided.

export type ClubCategory =
  | 'Technical'
  | 'Cultural'
  | 'Department'
  | 'Social Service'
  | 'Society';

export interface ClubActivity {
  title: string;
  description: string;
}

/** Structured About content — shown as What / Why / What we do instead of a single paragraph. */
export interface ClubAbout {
  what: string;
  why: string;
  activities: ClubActivity[];
  /** Optional achievements/past-editions blurb, shown after the activities grid. */
  recognition?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  /** Optional season/series label — avoid fabricating exact past dates for mock events. */
  tag?: string;
  /** CSS background (gradient) used for the mock poster tile until real artwork is supplied. */
  posterGradient: string;
  blurb: string;
  /** Real recap post (e.g. Instagram) for this event, if one exists — poster becomes a link when set. */
  link?: string;
  /** Path relative to /public — real poster artwork, shown instead of the gradient placeholder when set. */
  posterImage?: string;
}

export interface ClubMemoryImage {
  /** Path relative to /public */
  src: string;
  alt: string;
}

/** A product/platform the club has built — shown as its own showcase section. */
export interface ClubBuiltTool {
  name: string;
  tagline: string;
  description: string;
  url: string;
  stats?: { label: string; value: string }[];
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  category: ClubCategory;
  description: string;
  /** Path relative to /public */
  image: string;
  /** Path relative to /public — club's own logo lockup, shown on its detail page hero when set */
  logo?: string;
  /** Short vision/tagline quote, shown above the About section when set. */
  tagline?: string;
  facultyCoordinator?: string;
  studentLead?: string;
  members?: string;
  /** Set true once a dedicated /campus/clubs/[id] detail page has been designed for this club. */
  hasDetailPage?: boolean;
  /** External URL where a prospective member can actually join — powers the floating join CTA. */
  joinUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  /** Structured What/Why/What-we-do content. Falls back to the plain `description` when absent. */
  about?: ClubAbout;
  /** Mock posters (real artwork pending) — hover reveals event info. */
  events?: ClubEvent[];
  /** "Memory lane" auto-crossfading photo band. */
  memoryLane?: ClubMemoryImage[];
  /** A tool/platform this club built and maintains. */
  builtTool?: ClubBuiltTool;
}

export const CLUB_CATEGORIES: ClubCategory[] = [
  'Technical',
  'Department',
  'Cultural',
  'Social Service',
  'Society',
];

export const CATEGORY_ACCENT: Record<ClubCategory, string> = {
  Technical:        '#01741f',
  Department:       '#1e3a5f',
  Cultural:         '#b45309',
  'Social Service': '#0369a1',
  Society:          '#6b3fa0',
};

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
    logo: '/images/clubs/scope-logo.png',
    tagline:
      'Turning coding passion into real projects and meaningful experiences through collaboration, guidance, and hands-on learning.',
    members: '56',
    hasDetailPage: true,
    joinUrl: 'https://scopeclub.vercel.app/',
    instagramUrl: 'https://www.instagram.com/mlrit_scope/',
    linkedinUrl: 'https://www.linkedin.com/company/mlrit-scope/',
    about: {
      what:
        'SCOPE Club is a student-led technical community at MLR Institute of Technology, built around coding, curiosity, problem-solving, and learning by doing. It goes beyond classroom learning — connecting students with peers and mentors across AI, open source, web & app development, game development, and other emerging technologies, and giving them an official platform for guidance, networking, and growth beyond campus boundaries.',
      why:
        'Classroom learning only goes so far, and coursework rarely keeps pace with what\'s actually current in tech. SCOPE exists to close that gap — through practical learning and peer-to-peer initiatives like SCOPE Sessions, where members learn coding concepts and get guidance straight from fellow students. What makes SCOPE different is that student-driven approach: instead of just running events, the club builds projects and platforms — like CodeStats — that keep helping students long after an event ends.',
      activities: [
        {
          title: 'Technical Workshops & Training',
          description:
            'Hands-on workshops and training sessions on coding, web and app development, cloud computing (including AWS), and other emerging, industry-relevant technologies.',
        },
        {
          title: 'Coding & Technical Competitions',
          description:
            'Coding contests, competitive programming challenges, and hackathons that let members practice problem-solving and apply their technical knowledge under real deadlines.',
        },
        {
          title: 'Innovation & Project Development',
          description:
            'Turning ideas into working solutions — web and app development, game development, hackathon builds, and other student-led projects.',
        },
        {
          title: 'SCOPE Sessions',
          description:
            'Peer-learning sessions where members learn coding concepts, tools, and technologies directly from seniors and fellow students — with room to ask questions and dig in.',
        },
        {
          title: 'Career & Industry Exposure',
          description:
            'Career-oriented talks and technical sessions that introduce students to current technologies, industry expectations, and different career paths — often with practicing professionals in the room.',
        },
        {
          title: 'Knowledge Sharing & Community Learning',
          description:
            'Student-led sessions and team-based activities where seniors and peers share what they know and work through problems together, beyond formal workshops.',
        },
      ],
      recognition:
        'SCOPE teams have competed in Jatayu, reaching the finals for two seasons and finishing as runner-up in the most recent season. Past editions of the club\'s own events include Init Saga, Zenith\'24, Webmania 2.0, Splash, GameHub 2.0, Modifest, CBUG Contest, GameHub, and Codewars.',
    },
    events: [
      {
        id: 'zenith-25',
        title: "ZENITH'25",
        tag: 'Annual Fest',
        posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)',
        blurb: "SCOPE's flagship annual fest returns — bigger and better, with fresh experiences and new avenues to explore.",
        link: 'https://www.instagram.com/p/DRKVKCGiFVK/?igsh=YmVjdjlnb3Nib2J3',
        posterImage: '/images/clubs/events/zenith-25.png',
      },
      {
        id: 'init-saga',
        title: 'INIT SAGA',
        tag: 'Flagship Hackathon',
        posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)',
        blurb: 'A 2-day hackathon tackling real-world problems across travel, education, healthcare, and agri-tech — ₹20,000 prize pool, teams of 3–4.',
        link: 'https://www.instagram.com/p/DH5V3ARIPXY/?igsh=MWR6eWRzZHd6a2MxeQ==',
        posterImage: '/images/clubs/events/init-saga.jpg',
      },
      {
        id: 'aws-cloud-trek',
        title: 'AWS Cloud Trek',
        tag: 'Workshop',
        posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)',
        blurb: 'A 2-day hands-on cloud workshop covering AWS S3, EC2, and custom-domain deployment — certificates and AWS swag for every participant.',
        link: 'https://www.instagram.com/p/DPghWlAD-CH/?igsh=MTBmYnFmdXc3bXQ4aw==',
        posterImage: '/images/clubs/events/aws-cloud-trek.jpg',
      },
      {
        id: 'aws-community-day',
        title: 'AWS Student Community Day',
        tag: 'Community Day',
        posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)',
        blurb: 'A community day of speaker sessions on AI, ML, data engineering, and cloud — plus networking and AWS swag.',
        link: 'https://www.instagram.com/p/DRUttHHD8wu/?igsh=ZXd1N3Y0Z2ZrdXRw',
        posterImage: '/images/clubs/events/aws-community-day.jpg',
      },
    ],
    memoryLane: [
      { src: '/images/clubs/memory/zenith-25-entrance-arch.jpg', alt: "Zenith'25 entrance arch, decorated for SCOPE Club's flagship fest" },
      { src: '/images/clubs/memory/zenith-25-qa-session.jpg', alt: 'A student asking a question during a Zenith\'25 discussion panel' },
      { src: '/images/clubs/memory/zenith-25-auditorium.jpg', alt: "Students filling the auditorium for Zenith'25" },
      { src: '/images/clubs/memory/zenith-25-hackathon-lab.jpg', alt: "Participants coding during the Zenith'25 hackathon" },
      { src: '/images/clubs/memory/zenith-25-mentor-round.jpg', alt: 'A mentor reviewing a team\'s project during the hackathon' },
      { src: '/images/clubs/memory/zenith-25-registration.jpg', alt: "Students registering at the Zenith'25 help desk" },
      { src: '/images/clubs/memory/zenith-25-lab-wide.jpg', alt: 'A wide view of the hackathon lab in full swing' },
      { src: '/images/clubs/memory/zenith-25-award-ceremony.jpg', alt: "Winners being congratulated on stage at Zenith'25" },
      { src: '/images/clubs/memory/zenith-25-speaker-qa.jpg', alt: 'A student speaking into a mic during a Q&A session' },
      { src: '/images/clubs/memory/zenith-25-group-photo.jpg', alt: "Participants posing with certificates after Zenith'25 and AWS Student Community Day" },
    ],
    builtTool: {
      name: 'CodeStats',
      tagline: 'Sharpen every line of code.',
      description:
        'CodeStats is an in-house coding assessment platform built by SCOPE Club for MLR Institute of Technology. Students take coding assessments, join cohorts, practice in the arena, and track how their coding performance improves over time. It\'s exclusively for the MLRIT community — students, teachers, and admins — with dashboards for scheduling assessments, managing cohorts, and reviewing every submission.',
      url: 'https://scope.mlrit.ac.in/',
      stats: [
        { label: 'Students', value: '3,000+' },
        { label: 'Teachers', value: '50+' },
        { label: 'Admins', value: '10+' },
      ],
    },
  },
  {
    id: 'apex',
    name: 'APEX Club',
    shortName: 'APEX',
    category: 'Technical',
    description:
      'Advanced Programming and Excellence Club — competitive coding, hackathons, open-source contributions, and preparation for ICPC and global coding contests.',
    image: '/images/students/reel-aiml.png',
    members: '75',
    hasDetailPage: true,
    about: {
      what:
        'APEX — Advanced Programming and Excellence Club — is MLRIT\'s competitive programming powerhouse, for students chasing algorithmic mastery, ICPC ranks, and real open-source contributions.',
      why:
        'Contest math and interview prep barely overlap with classroom DSA. APEX exists to close that gap with structured practice, live contests, and mentors who\'ve actually cleared ICPC regionals.',
      activities: [
        { title: 'Competitive Contests', description: 'Weekly rated contests that mirror ICPC and Codeforces formats — solo and team rounds alike.' },
        { title: 'ICPC Prep', description: 'Focused training camps building up the algorithms and data structures ICPC regionals actually test.' },
        { title: 'Open Source Sprints', description: 'Guided sprints landing first real pull requests in active open-source repositories.' },
        { title: 'Mock Interviews', description: 'Peer-run technical interview practice — whiteboard problems, system design, and honest feedback.' },
      ],
    },
    events: [
      { id: 'apex-icpc-camp', title: 'ICPC Bootcamp', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'A multi-day training camp drilling the algorithms and problem patterns ICPC regionals are built around.' },
      { id: 'apex-code-clash', title: 'Code Clash', tag: 'Contest', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A campus-wide rated contest across three divisions, from first-timers to seasoned competitive coders.' },
      { id: 'apex-oss-sprint', title: 'Open Source Sprint', tag: 'Weekend build', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'A weekend sprint where members land their first pull requests on real open-source projects.' },
      { id: 'apex-interview-day', title: 'Mock Interview Day', tag: 'Placement prep', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'Back-to-back mock technical interviews run by seniors and alumni, with feedback on the spot.' },
    ],
    memoryLane: [
      { src: '/images/students/reel-aiml.png', alt: 'APEX members in a coding session' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/facilities/campus/sti-hub-1.jpg', alt: 'STI Hub innovation space' },
      { src: '/images/students/faculty-seminar.png', alt: 'A tech seminar in progress' },
      { src: '/images/facilities/campus/sti-hub-2.jpg', alt: 'STI Hub workspace' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'An APEX group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },
  {
    id: 'cie',
    name: 'CIE',
    shortName: 'CIE',
    category: 'Technical',
    description:
      'Centre for Innovation and Entrepreneurship — the on-campus incubator that takes student ideas from prototype to pitch. Home of product sprints, startup mentoring, and investor days.',
    image: '/images/facilities/campus/sti-hub-1.jpg',
    members: '69',
    hasDetailPage: true,
    about: {
      what:
        'CIE — the Centre for Innovation and Entrepreneurship — is MLRIT\'s on-campus incubator, turning early-stage student ideas into pitched, funded ventures.',
      why:
        'Most good ideas die in a notebook. CIE exists to give them a runway — mentorship, seed conversations, and a room full of people who\'ll actually pressure-test the pitch.',
      activities: [
        { title: 'Startup Sprints', description: 'Multi-week sprints taking a raw idea from a napkin sketch to a testable prototype.' },
        { title: 'Mentor Clinics', description: 'One-on-one clinics with founders and industry mentors who\'ve built and shipped real products.' },
        { title: 'Investor Days', description: 'Pitch days in front of real investors and alumni founders, with direct feedback on the deck.' },
        { title: 'Idea-to-Prototype Labs', description: 'Hands-on lab time and tooling for turning a validated idea into a working first prototype.' },
      ],
    },
    events: [
      { id: 'cie-pitch-day', title: 'Pitch Day', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'Student founders pitch live to a panel of investors and alumni for seed interest and feedback.' },
      { id: 'cie-idea-sprint', title: 'Idea Sprint', tag: 'Weekend build', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A weekend sprint turning a raw idea into a validated, testable prototype.' },
      { id: 'cie-mentor-clinic', title: 'Founder Mentor Clinic', tag: 'Recurring', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'Drop-in one-on-one sessions with founders and industry mentors on whatever\'s blocking your venture.' },
      { id: 'cie-demo-day', title: 'Demo Day', tag: 'Showcase', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'The incubator\'s current cohort demos finished prototypes to campus and invited guests.' },
    ],
    memoryLane: [
      { src: '/images/facilities/campus/sti-hub-1.jpg', alt: 'STI Hub innovation space' },
      { src: '/images/facilities/campus/sti-hub-3.jpg', alt: 'STI Hub event' },
      { src: '/images/students/faculty-seminar.png', alt: 'A founder mentoring session' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/campus/conference-room.png', alt: 'A pitch day conference room' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'A CIE group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },
  {
    id: 'ewb',
    name: 'EWB-IUCEE-IEEE',
    shortName: 'EWB',
    category: 'Technical',
    description:
      'EWB-IUCEE-IEEE MLRIT Student Chapter — engineering ideas into community impact through sustainability projects, design thinking, global collaboration, and technical innovation since 2016.',
    image: '/images/facilities/campus/sti-hub-2.jpg',
    members: '60',
    tagline: 'Engineering Ideas. Empowering Communities. Creating Change.',
    hasDetailPage: true,
    instagramUrl: 'https://www.instagram.com/ewb_iucee_ieee_mlrit',
    linkedinUrl: 'https://www.linkedin.com/company/ewb-iucee-mlritt/',
    about: {
      what:
        'The EWB-IUCEE-IEEE MLRIT Student Chapter began in 2016 as IUCEE-SPEED, a student-driven platform for learning beyond the classroom. In 2020 it evolved into the EWB-IUCEE Chapter focused on UN Sustainable Development Goals, sustainability, and community-oriented engineering. In 2024, the chapter collaborated with the IEEE Student Branch, expanding into technical events, innovation, and industry interactions. Today it is a student-led platform that transforms ideas into action through design thinking, entrepreneurship, sustainability initiatives, and technical learning.',
      why:
        'EWB connects classroom theory with practical community impact through hands-on technical innovation, leadership development, and global networking. By collaborating with IEEE and IUCEE, members access multidisciplinary research, technical resources, industry mentorship, and international student leadership summits.',
      activities: [
        {
          title: 'Sustainability Projects',
          description:
            'Real engineering builds addressing environmental and community challenges — Bio-Brick (eco-fuel briquettes from organic waste), UpPETure (upcycling plastic bottles), AI Climate Drone (aerial deforestation tracking), Propulsion System, and Fusion 360 AI.',
        },
        {
          title: 'Technical Events & Competitions',
          description:
            'Eloqvent (communication and business model pitching) and ESF-R (Engineers Student Forum Regional — collaborative platform for real-world business model development).',
        },
        {
          title: 'Global Networks & Summits',
          description:
            'Access to IEEE global technical network, IUCEE leadership summits, international conferences, multidisciplinary research, and industry mentorship through global chapter partnerships.',
        },
        {
          title: 'Innovation & Design Thinking',
          description:
            'Continuous project work, mentorship programs, and on-field sustainability challenges applying design thinking and entrepreneurship to real-world engineering problems.',
        },
      ],
      recognition:
        'Best IUCEE Student Chapter Award at ICTIEE 2026 — honored for excellence in student leadership, community-focused engineering, and consistent chapter engagement. VISIONAID recognized in the POC poster presentation category for smart assistive technology for visually impaired individuals.',
    },
    events: [
      { id: 'ewb-eloqvent', title: 'Eloqvent', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'An engaging event helping students master communication and soft skills while developing viable, sustainable business models.' },
      { id: 'ewb-esfr', title: 'ESF-R', tag: 'Regional', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'Engineers Student Forum Regional — students collaborate to pitch and build robust, real-world business models.' },
      { id: 'ewb-bio-brick', title: 'Bio-Brick Project', tag: 'Sustainability', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'Converting organic waste into eco-friendly fuel briquettes for cleaner energy in underserved communities.' },
      { id: 'ewb-uppetur', title: 'UpPETure', tag: 'Innovation', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'Upcycling discarded plastic bottles into durable, valuable products to fight plastic pollution.' },
    ],
    memoryLane: [
      { src: '/images/facilities/campus/sti-hub-2.jpg', alt: 'EWB-IEEE working in the STI Hub' },
      { src: '/images/facilities/campus/sti-hub-3.jpg', alt: 'EWB chapter event at STI Hub' },
      { src: '/images/students/faculty-seminar.png', alt: 'An EWB technical session' },
      { src: '/images/students/classroom-chat.png', alt: 'Students working on a sustainability project' },
      { src: '/images/facilities/campus/sti-hub-1.jpg', alt: 'Innovation space at MLRIT' },
      { src: '/images/students/students-laughing.png', alt: 'EWB members bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'EWB-IUCEE-IEEE chapter group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at an EWB chapter event' },
    ],
  },

  {
    id: 'aws-sbg',
    name: 'AWS Student Builder Group',
    shortName: 'AWS SBG',
    category: 'Technical',
    description:
      'A student-driven cloud community at MLRIT — hands-on AWS workshops, hackathons, Gen AI sessions, and real-world cloud projects that go beyond the classroom.',
    image: '/images/facilities/campus/sti-hub-1.jpg',
    tagline: 'Learn. Build. Explore. Grow with AWS Cloud.',
    hasDetailPage: true,
    instagramUrl: 'https://www.instagram.com/awssbg_mlrit/',
    linkedinUrl: 'https://www.linkedin.com/company/awssbg-mlrit/',
    about: {
      what:
        'The AWS Student Builder Group is a student-driven technical community at MLR Institute of Technology focused on AWS Cloud and emerging technologies. Members learn by doing — through hands-on workshops, real-world cloud projects, hackathons, and peer learning — gaining practical skills in Cloud Computing, AI, Machine Learning, Generative AI, DevOps, Serverless Computing, and Cybersecurity. The group also connects students with AWS experts, digital badge credentials, and a global student builder community.',
      why:
        'Cloud skills are in high demand, but most coursework doesn\'t go far enough into practical deployment. AWS SBG exists to close that gap — providing students with actual AWS lab access, industry-relevant credentials, and a community of peers learning the same technologies, while building portfolios and preparing for internships and placements.',
      activities: [
        {
          title: 'Technical Workshops & Training',
          description:
            'Hands-on workshops covering AWS Cloud fundamentals, AI/ML, Generative AI, DevOps, Serverless Computing, and Cybersecurity — focused on real AWS services, not just theory.',
        },
        {
          title: 'Hands-on Labs & Cloud Projects',
          description:
            'Working directly with AWS services — deploying applications, managing cloud resources, building cloud-based solutions, and earning AWS digital badges and credentials.',
        },
        {
          title: 'Hackathons & Technical Competitions',
          description:
            'Coding challenges, problem-solving events, and hackathons where members build and deploy real cloud solutions under time constraints.',
        },
        {
          title: 'AWS Learning Sessions & Knowledge Sharing',
          description:
            'Peer-led learning where seniors help juniors navigate AWS concepts — collaborative sessions, shared resources, and a community of students growing together.',
        },
        {
          title: 'Career & Industry Exposure',
          description:
            'Expert sessions with AWS community speakers, industry professionals, and mentors — covering career paths, certifications, and opportunities in cloud and emerging tech.',
        },
      ],
    },
    events: [
      {
        id: 'aws-sbg-cloud-trek',
        title: 'AWS Cloud Trek Workshop',
        tag: 'Workshop',
        posterGradient: 'linear-gradient(155deg, #1a3a1a 0%, #2d6a2d 55%, #1a4a1a 100%)',
        blurb: 'A 2-day hands-on workshop covering Amazon S3 and EC2 — cloud resource management, application deployment, hosting, and security configurations.',
        posterImage: '/images/clubs/events/aws-cloud-trek.jpg',
        link: 'https://www.instagram.com/p/DPghWlAD-CH/?igsh=MTBmYnFmdXc3bXQ4aw==',
      },
      {
        id: 'aws-sbg-community-day',
        title: 'AWS Student Community Day — Cloud Voyage',
        tag: 'Community Day',
        posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)',
        blurb: 'Bringing together students, AWS speakers, industry experts, and cloud professionals for sessions on modern infrastructure, industry practices, and cloud career opportunities.',
        posterImage: '/images/clubs/events/aws-community-day.jpg',
        link: 'https://www.instagram.com/p/DRUttHHD8wu/?igsh=ZXd1N3Y0Z2ZrdXRw',
      },
    ],
    memoryLane: [
      { src: '/images/clubs/memory/zenith-25-hackathon-lab.jpg', alt: 'Students in a cloud computing lab session' },
      { src: '/images/clubs/memory/zenith-25-speaker-qa.jpg', alt: 'AWS Community Day speaker Q&A session' },
      { src: '/images/clubs/memory/zenith-25-mentor-round.jpg', alt: 'A mentor reviewing a student cloud project' },
      { src: '/images/clubs/memory/zenith-25-qa-session.jpg', alt: 'Q&A during an AWS workshop session' },
      { src: '/images/clubs/memory/zenith-25-group-photo.jpg', alt: 'Participants with certificates after AWS Student Community Day' },
      { src: '/images/clubs/memory/zenith-25-registration.jpg', alt: 'Students registering for an AWS event' },
      { src: '/images/clubs/memory/zenith-25-award-ceremony.jpg', alt: 'Students receiving AWS digital badges and recognition' },
      { src: '/images/clubs/memory/zenith-25-auditorium.jpg', alt: 'Attendees at the AWS Community Day auditorium session' },
    ],
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
    members: '90',
    hasDetailPage: true,
    about: {
      what:
        'CSE–DS Society is the department community for Computer Science – Data Science — students who want to work with real data, from cleaning messy datasets to building models that explain them.',
      why:
        'Data science moves faster than any single semester\'s syllabus. The society exists to close that gap early — through bootcamps, guided projects, and a peer network that keeps skills current between classroom units.',
      activities: [
        {
          title: 'Data Analytics Bootcamps',
          description: 'Structured, hands-on bootcamps covering the analytics pipeline end to end — from raw data to a working dashboard.',
        },
        {
          title: 'Kaggle Competitions',
          description: 'Team entries into Kaggle competitions, with shared notebooks and peer code reviews along the way.',
        },
        {
          title: 'Python Workshops',
          description: 'Workshops building up Python and its data stack — pandas, NumPy, scikit-learn — from first principles.',
        },
        {
          title: 'Data Visualisation Projects',
          description: 'Independent and group projects that turn raw datasets into clear, presentable visual stories.',
        },
      ],
    },
    events: [
      {
        id: 'data-storm',
        title: 'Data Storm Hackathon',
        tag: 'Flagship',
        posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)',
        blurb: 'A hands-on hackathon on real, messy datasets — clean it, model it, present the insight by the deadline.',
      },
      {
        id: 'python-bootcamp',
        title: 'Python for Data Bootcamp',
        tag: 'Recurring',
        posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)',
        blurb: 'A multi-week bootcamp building up the Python data stack — pandas, NumPy, and scikit-learn — from scratch.',
      },
      {
        id: 'kaggle-kickoff',
        title: 'Kaggle Kickoff',
        tag: 'Contest',
        posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)',
        blurb: 'Teams pick a live Kaggle competition and get mentorship on approach, feature engineering, and submissions.',
      },
      {
        id: 'dashboard-sprint',
        title: 'Dashboard Design Sprint',
        tag: 'Weekend build',
        posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)',
        blurb: 'A weekend sprint turning a raw dataset into a polished, presentable analytics dashboard.',
      },
    ],
    memoryLane: [
      { src: '/images/students/reel-cse.png', alt: 'CSE-DS members at a session' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/facilities/campus/library-wide-1.jpg', alt: 'Campus library' },
      { src: '/images/students/faculty-seminar.png', alt: 'A data science seminar in progress' },
      { src: '/images/students/campus-steps.png', alt: 'Students on campus steps' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/campus/canteen-friends.png', alt: 'Friends at the campus canteen' },
      { src: '/images/students/campus-group.png', alt: 'A club group photo' },
    ],
  },
  {
    id: 'cse-ml',
    name: 'CSE–ML Society',
    shortName: 'CSE ML',
    category: 'Department',
    description:
      'Department society for Computer Science – Machine Learning. Deep learning study circles, model deployment workshops, AI ethics seminars, and research paper reading groups.',
    image: '/images/students/reel-aiml.png',
    members: '84',
    hasDetailPage: true,
    about: {
      what:
        'CSE–ML Society is the department community for Computer Science – Machine Learning — for students who want to go past the syllabus into how modern ML systems are actually built, trained, and shipped.',
      why:
        'Machine learning theory and machine learning practice are two different skills. The society exists to build the practice half — through study circles, deployment workshops, and paper discussions — alongside the theory taught in class.',
      activities: [
        {
          title: 'Deep Learning Study Circles',
          description: 'Weekly circles working through deep learning fundamentals together, from backpropagation to transformer architectures.',
        },
        {
          title: 'Model Deployment Workshops',
          description: 'Hands-on sessions taking a trained model from a notebook to something actually served and callable.',
        },
        {
          title: 'AI Ethics Seminars',
          description: 'Discussion-based seminars on the ethical and societal questions raised by deploying ML systems at scale.',
        },
        {
          title: 'Research Paper Reading Groups',
          description: 'Regular reading groups that break recent ML papers down into plain-language takeaways.',
        },
      ],
    },
    events: [
      {
        id: 'deeplearn-hackathon',
        title: 'DeepLearn Hackathon',
        tag: 'Flagship',
        posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)',
        blurb: 'A team hackathon to train, fine-tune, and demo a working model against a real dataset in one weekend.',
      },
      {
        id: 'deployment-clinic',
        title: 'Model Deployment Clinic',
        tag: 'Recurring',
        posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)',
        blurb: 'A recurring clinic on taking a trained model out of a notebook and into something actually served.',
      },
      {
        id: 'paper-reading',
        title: 'Paper Reading Circle',
        tag: 'Study circle',
        posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)',
        blurb: 'A peer-led circle breaking down a recent ML paper into plain-language takeaways, one paper at a time.',
      },
      {
        id: 'cv-sprint',
        title: 'Computer Vision Sprint',
        tag: 'Weekend build',
        posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)',
        blurb: 'A weekend sprint building a working computer vision demo — detection, classification, or segmentation.',
      },
    ],
    memoryLane: [
      { src: '/images/students/reel-aiml.png', alt: 'AI/ML themed session' },
      { src: '/images/facilities/campus/sti-hub-1.jpg', alt: 'STI Hub innovation space' },
      { src: '/images/facilities/campus/sti-hub-3.jpg', alt: 'STI Hub event' },
      { src: '/images/students/faculty-seminar.png', alt: 'A tech seminar in progress' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
      { src: '/images/students/campus-group.png', alt: 'A club group photo' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
    ],
  },
  {
    id: 'code',
    name: 'CODE Club',
    shortName: 'CODE',
    category: 'Department',
    description:
      'The department-level programming club — from first-year syntax to final-year system design. Weekly problem sets, peer debugging sessions, and placement prep.',
    image: '/images/students/faculty-seminar.png',
    members: '93',
    hasDetailPage: true,
    about: {
      what:
        'CODE Club is the department-level programming home for every year — from a first "Hello, World" to final-year system design interviews.',
      why:
        'Syntax and system design live years apart in the syllabus. CODE Club exists to keep them connected — through weekly problem sets, peer debugging, and placement-focused prep.',
      activities: [
        { title: 'Weekly Problem Sets', description: 'A running set of graded problems spanning every year\'s syllabus, from loops to graph algorithms.' },
        { title: 'Peer Debugging Sessions', description: 'Drop-in sessions where seniors help juniors work through a stuck bug, live.' },
        { title: 'Placement Prep', description: 'Structured prep covering the DSA and system-design rounds most placement drives actually ask.' },
        { title: 'Mini Projects', description: 'Small, guided projects that turn syllabus concepts into something you can show in an interview.' },
      ],
    },
    events: [
      { id: 'code-hack-night', title: 'Hack Night', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'An overnight build event where teams ship a working project from scratch by sunrise.' },
      { id: 'code-debug-clinic', title: 'Debug Clinic', tag: 'Recurring', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A weekly drop-in clinic where stuck code finally gets unstuck, with a senior pairing alongside.' },
      { id: 'code-placement-drive', title: 'Placement Prep Drive', tag: 'Prep series', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'A multi-week series covering the DSA and system design rounds that show up in real placement drives.' },
      { id: 'code-first-commit', title: 'First Commit', tag: 'First-years', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'A beginner-friendly session walking first-years through Git, GitHub, and their very first pull request.' },
    ],
    memoryLane: [
      { src: '/images/students/faculty-seminar.png', alt: 'A CODE Club session in progress' },
      { src: '/images/students/reel-cse.png', alt: 'CSE students at a coding session' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/facilities/campus/library-wide-1.jpg', alt: 'Campus library' },
      { src: '/images/students/lecture-hall.png', alt: 'A lecture hall session' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'A CODE Club group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering Society',
    shortName: 'MECH',
    category: 'Department',
    description:
      'Hands-on mechanical workshops, CAD design sprints, automotive engineering projects, and participation in national-level robocon and design competitions.',
    image: '/images/facilities/campus/sti-hub-3.jpg',
    members: '81',
    hasDetailPage: true,
    about: {
      what:
        'The Mechanical Engineering Society is where MLRIT\'s mechanical students take theory into the workshop — CAD, prototyping, and machines that actually move.',
      why:
        'A mechanism you\'ve only simulated isn\'t the same as one you\'ve built and broken. The society exists to give members hands-on time with tools, materials, and real design constraints.',
      activities: [
        { title: 'CAD Design Sprints', description: 'Timed design sprints turning a brief into a fully modelled, manufacturable CAD assembly.' },
        { title: 'Workshop Builds', description: 'Hands-on fabrication time in the workshop — machining, welding, and assembly on real projects.' },
        { title: 'Robocon Prep', description: 'Focused build cycles preparing the society\'s entry for national-level robocon competitions.' },
        { title: 'Industry Plant Visits', description: 'Guided visits to manufacturing plants and automotive facilities to see production at scale.' },
      ],
    },
    events: [
      { id: 'mech-robocon-build', title: 'Robocon Build Week', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'An intense build week getting the society\'s robocon entry from CAD model to working machine.' },
      { id: 'mech-cad-sprint', title: 'CAD Design Sprint', tag: 'Weekend build', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A weekend sprint modelling a full mechanical assembly from a real design brief.' },
      { id: 'mech-plant-visit', title: 'Industry Plant Visit', tag: 'Field trip', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'A guided tour through an automotive manufacturing line, from raw material to finished product.' },
      { id: 'mech-design-expo', title: 'Design Expo', tag: 'Showcase', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'An annual expo where members demo the semester\'s best workshop builds and CAD projects.' },
    ],
    memoryLane: [
      { src: '/images/facilities/campus/sti-hub-3.jpg', alt: 'STI Hub workshop space' },
      { src: '/images/students/reel-mech.png', alt: 'Mechanical students at a workshop session' },
      { src: '/images/facilities/campus/sti-hub-4.jpg', alt: 'STI Hub fabrication area' },
      { src: '/images/students/faculty-classroom.png', alt: 'A mechanical engineering seminar' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'A MECH society group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },
  {
    id: 'eee',
    name: 'EEE Department Society',
    shortName: 'EEE',
    category: 'Department',
    description:
      'Electrical and Electronics Engineering society — circuit design labs, power systems seminars, renewable energy projects, and industry visits to power plants.',
    image: '/images/students/faculty-classroom.png',
    members: '72',
    hasDetailPage: true,
    about: {
      what:
        'The EEE Department Society runs the hands-on half of electrical engineering — circuit labs, power systems, and renewable energy builds outside the syllabus.',
      why:
        'Power systems theory only clicks once you\'ve wired something that actually works. The society exists to give students that lab time, plus a direct line to industry practice.',
      activities: [
        { title: 'Circuit Design Labs', description: 'Guided lab sessions building and debugging real circuits, from breadboard to PCB.' },
        { title: 'Power Systems Seminars', description: 'Seminars connecting classroom power systems theory to how the grid actually operates.' },
        { title: 'Renewable Energy Projects', description: 'Student-built solar and renewable energy projects, from design through working prototype.' },
        { title: 'Plant Visits', description: 'Site visits to power plants and substations to see large-scale systems firsthand.' },
      ],
    },
    events: [
      { id: 'eee-circuit-lab', title: 'Circuit Design Lab Day', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'A full-day lab session building and debugging circuits from breadboard through to a working PCB.' },
      { id: 'eee-solar-build', title: 'Solar Build Challenge', tag: 'Weekend build', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'Teams design and build a small working solar-powered system over a single weekend.' },
      { id: 'eee-plant-visit', title: 'Power Plant Visit', tag: 'Field trip', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'A guided tour of a power plant and substation, connecting classroom theory to the real grid.' },
      { id: 'eee-seminar-series', title: 'Power Systems Seminar Series', tag: 'Recurring', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'A recurring seminar series on how modern power systems and renewable grids actually work.' },
    ],
    memoryLane: [
      { src: '/images/students/faculty-classroom.png', alt: 'An EEE society seminar' },
      { src: '/images/facilities/campus/sti-hub-2.jpg', alt: 'STI Hub lab space' },
      { src: '/images/students/reel-ece.png', alt: 'Students at an electronics session' },
      { src: '/images/students/faculty-seminar-2.png', alt: 'A power systems seminar in progress' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'An EEE society group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },
  {
    id: 'ece',
    name: 'ECE Department Society',
    shortName: 'ECE',
    category: 'Department',
    description:
      'Electronics and Communication society — PCB design workshops, embedded systems challenges, VLSI seminars, and Smart India Hackathon teams.',
    image: '/images/students/reel-ece.png',
    members: '87',
    hasDetailPage: true,
    about: {
      what:
        'The ECE Department Society is MLRIT\'s home for embedded systems, PCB design, and communication engineering — beyond what a single course can cover.',
      why:
        'VLSI and embedded systems move fast, and coursework can\'t keep pace alone. The society exists to fill that gap with workshops, hackathon teams, and hands-on board design.',
      activities: [
        { title: 'PCB Design Workshops', description: 'Workshops taking a schematic all the way to a fabricated, working PCB.' },
        { title: 'Embedded Systems Challenges', description: 'Timed challenges building embedded firmware against a fixed hardware spec.' },
        { title: 'VLSI Seminars', description: 'Seminars breaking down VLSI design flow, from RTL to fabrication basics.' },
        { title: 'SIH Team Prep', description: 'Focused prep cycles forming and coaching the society\'s Smart India Hackathon teams.' },
      ],
    },
    events: [
      { id: 'ece-sih-prep', title: 'SIH Prep Bootcamp', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'An intensive bootcamp forming and coaching teams ahead of Smart India Hackathon.' },
      { id: 'ece-pcb-workshop', title: 'PCB Design Workshop', tag: 'Workshop', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A hands-on workshop taking a circuit from schematic to a fabricated, working PCB.' },
      { id: 'ece-embedded-challenge', title: 'Embedded Systems Challenge', tag: 'Contest', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'Teams race to build working embedded firmware against a fixed hardware spec.' },
      { id: 'ece-vlsi-seminar', title: 'VLSI Design Seminar', tag: 'Seminar', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'A seminar walking through the VLSI design flow, from RTL description to fabrication basics.' },
    ],
    memoryLane: [
      { src: '/images/students/reel-ece.png', alt: 'ECE students at a design session' },
      { src: '/images/facilities/campus/sti-hub-2.jpg', alt: 'STI Hub lab space' },
      { src: '/images/students/faculty-classroom.png', alt: 'An ECE department seminar' },
      { src: '/images/students/faculty-seminar-2.png', alt: 'A VLSI seminar in progress' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'An ECE society group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },
  {
    id: 'aero',
    name: 'Aeronautical Engineering Society',
    shortName: 'AERO',
    category: 'Department',
    description:
      'Aeromodelling, UAV design, wind tunnel experiments, and national aerospace competition entries. One of MLRIT\'s most active department societies.',
    image: '/images/students/reel-aero.png',
    members: '66',
    hasDetailPage: true,
    about: {
      what:
        'The Aeronautical Engineering Society is MLRIT\'s most hands-on flight lab — aeromodelling, UAV design, and wind tunnel testing done by students, for students.',
      why:
        'Aerospace theory is abstract until something actually leaves the ground. The society exists to build, test, and fly — then do it again after it inevitably doesn\'t work the first time.',
      activities: [
        { title: 'Aeromodelling Builds', description: 'Ground-up builds of scale model aircraft, from airframe design to first flight.' },
        { title: 'UAV Design Sprints', description: 'Sprints designing and testing UAV airframes and control systems against a mission brief.' },
        { title: 'Wind Tunnel Experiments', description: 'Hands-on wind tunnel sessions testing airfoil and airframe designs before a build commits.' },
        { title: 'National Competition Teams', description: 'Dedicated teams preparing entries for national-level aerospace design competitions.' },
      ],
    },
    events: [
      { id: 'aero-uav-challenge', title: 'UAV Design Challenge', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'Teams design, build, and fly a UAV against a fixed mission brief over several weeks.' },
      { id: 'aero-model-build', title: 'Aeromodelling Build Day', tag: 'Workshop', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A hands-on build day taking a scale model aircraft from airframe kit to first flight.' },
      { id: 'aero-wind-tunnel', title: 'Wind Tunnel Test Day', tag: 'Lab session', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'Members test airfoil and airframe designs in the wind tunnel before committing to a build.' },
      { id: 'aero-nationals-prep', title: 'Nationals Prep Camp', tag: 'Competition prep', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'A focused prep camp getting the society\'s entry ready for a national aerospace competition.' },
    ],
    memoryLane: [
      { src: '/images/students/reel-aero.png', alt: 'AERO society members at a build session' },
      { src: '/images/facilities/campus/sti-hub-4.jpg', alt: 'STI Hub fabrication area' },
      { src: '/images/facilities/campus/sti-hub-3.jpg', alt: 'STI Hub workshop space' },
      { src: '/images/students/faculty-seminar.png', alt: 'An aeronautical engineering seminar' },
      { src: '/images/students/classroom-chat.png', alt: 'Students in a technical discussion' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/students/campus-group.png', alt: 'An AERO society group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },

  // ─── Cultural ─────────────────────────────────────────────────────────────
  {
    id: 'came',
    name: 'CAME Club',
    shortName: 'CAME',
    category: 'Cultural',
    description:
      'Creating Aspirations for Meeting Elevation — the cultural and student engagement platform of MLRIT. Dance, music, drama, anchoring, and event coordination across Graduation Day, Navrat Naveli, Hellenic, Kite Fest, and Annual Day.',
    image: '/images/students/club-event.png',
    members: '96',
    tagline: 'Creating Aspirations, Celebrating Talent, Elevating Campus Life.',
    hasDetailPage: true,
    instagramUrl: 'https://www.instagram.com/cameclub_mlrit/',
    about: {
      what:
        'CAME — Creating Aspirations for Meeting Elevation — is the cultural and student engagement platform of MLR Institute of Technology, dedicated to enriching campus life through creativity, cultural expression, and active student participation. The club provides students with opportunities to showcase and develop their talents across dance, music, drama and skits, anchoring, cultural presentations, and event coordination. CAME plays an active role in the planning and execution of major institutional programmes, cultural celebrations, awareness initiatives, national events, and student-centric activities.',
      why:
        'Not every skill that matters fits in a lecture hall. CAME exists to give students who perform, create, and connect a real stage and a structured calendar to build toward — developing confidence, teamwork, discipline, and leadership through active participation in the institution\'s cultural and ceremonial life.',
      activities: [
        {
          title: 'Cultural Performances',
          description:
            'Dance, music, drama, and skits addressing patriotism, social responsibility, cultural heritage, and student life — performed before large institutional audiences.',
        },
        {
          title: 'Institutional Event Coordination',
          description:
            'Active contribution to Graduation Day, Orientation Day, Independence Day, Republic Day, and Annual Day — supporting smooth conduct of ceremonies and cultural segments.',
        },
        {
          title: 'Cultural Celebrations',
          description:
            'Navrat Naveli (Bathukamma, Garba, traditional performances), Kite Fest, Traditional Day, and other festive programmes celebrating India\'s diverse cultural traditions.',
        },
        {
          title: 'Hellenic & Ecstacy',
          description:
            'High-energy campus events featuring student performances, skits, stand-up, live music, and invited artists — including the Ecstacy concert night and the themed Hellenic programme.',
        },
      ],
    },
    events: [
      { id: 'came-hellenic', title: 'Hellenic', tag: 'Signature Event', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', posterImage: '/images/clubs/events/came-hellenic.png', blurb: 'A high-energy campus event with changing themes — student performances, skits, live music by Band Echo, movie team interaction, and DJ.' },
      { id: 'came-navrat-naveli', title: 'Navrat Naveli', tag: 'Cultural Fest', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', posterImage: '/images/clubs/events/came-navrat-naveli.png', blurb: 'A vibrant cultural celebration featuring Bathukamma, traditional rituals, Garba, skits, and prize distribution.' },
      { id: 'came-ecstacy', title: 'Ecstacy', tag: 'Concert Night', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', posterImage: '/images/clubs/events/came-ecstacy.jpg', blurb: 'High-energy concert night featuring live performances by artists invited from outside the institution.' },
      { id: 'came-kite-fest', title: 'Kite Fest', tag: 'Festive Event', posterGradient: 'linear-gradient(155deg, #1a3a5f 0%, #2563eb 55%, #1e40af 100%)', posterImage: '/images/clubs/events/came-kite-fest.png', blurb: 'A festive celebration of Bhogi — Rangoli competitions, kite flying, and campus-wide participation marking the harvest season.' },
      { id: 'came-graduation', title: 'Graduation Day', tag: 'Ceremonial', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', posterImage: '/images/clubs/events/came-graduation.png', blurb: 'Academic procession, lamp lighting, graduation oath, gold medal distribution, and cultural performances celebrating the graduating batch.' },
      { id: 'came-annual-day', title: 'Annual Day', tag: 'Institution Event', posterGradient: 'linear-gradient(155deg, #2d1a00 0%, #92400e 55%, #451a03 100%)', posterImage: '/images/clubs/events/came-annual-day.png', blurb: 'MLRIT\'s flagship annual celebration — student cultural performances, awards, and recognition of achievement across the institution.' },
      { id: 'came-orientation', title: 'Orientation Day', tag: 'Ceremonial', posterGradient: 'linear-gradient(155deg, #0f2a1a 0%, #166534 55%, #0f2a1a 100%)', posterImage: '/images/clubs/events/came-orientation.jpg', blurb: 'Welcome programme for incoming students — cultural performances, introductions, and the official start of campus life at MLRIT.' },
      { id: 'came-independence-day', title: 'Independence Day', tag: 'National Event', posterGradient: 'linear-gradient(155deg, #0f2a0f 0%, #15803d 55%, #1a3a0a 100%)', posterImage: '/images/clubs/events/came-independence-day.png', blurb: 'Flag hoisting, patriotic performances, drama, and student presentations marking India\'s Independence Day on campus.' },
      { id: 'came-republic-day', title: 'Republic Day', tag: 'National Event', posterGradient: 'linear-gradient(155deg, #0a1628 0%, #1d4ed8 55%, #0a1628 100%)', posterImage: '/images/clubs/events/came-republic-day.jpg', blurb: 'Flag hoisting, march past, patriotic cultural performances, and campus celebrations marking India\'s Republic Day.' },
      { id: 'came-traditional-day', title: 'Traditional Day', tag: 'Cultural Event', posterGradient: 'linear-gradient(155deg, #3a1a00 0%, #c2410c 55%, #3a1a00 100%)', posterImage: '/images/clubs/events/came-traditional-day.png', blurb: 'A day celebrating India\'s cultural diversity — students dress in traditional attire from their home states, with performances and cultural showcases.' },
    ],
    memoryLane: [
      { src: '/images/students/club-event.png', alt: 'A CAME cultural performance' },
      { src: '/images/students/p1.png', alt: 'Students at a CAME stage performance' },
      { src: '/images/students/p2.png', alt: 'A CAME cultural event moment' },
      { src: '/images/students/students-laughing.png', alt: 'CAME members bonding on campus' },
      { src: '/images/campus/canteen-friends.png', alt: 'Friends at the campus canteen' },
      { src: '/images/students/p3.png', alt: 'A CAME fest performance' },
      { src: '/images/students/campus-group.png', alt: 'CAME club group photo' },
      { src: '/images/students/campus-steps.png', alt: 'Students on campus steps' },
    ],
  },
  {
    id: 'lit',
    name: 'Club Literati',
    shortName: 'LITERATI',
    category: 'Cultural',
    description:
      'Communicate | Compete | Conquer — the literary and debate club at MLRIT. Talkmasters sessions, MLRITMUN (7th edition), TEDx MLRIT, Literary Fest, Murder Mystery, and a space for everyone to find their voice.',
    image: '/images/facilities/campus/library-wide-1.jpg',
    members: '63',
    tagline: 'Communicate | Compete | Conquer',
    hasDetailPage: true,
    instagramUrl: 'https://www.instagram.com/mlrclubliterati',
    linkedinUrl: 'https://www.linkedin.com/company/mlrclubliterati/',
    about: {
      what:
        'Club Literati is a place where students can speak their minds, explore new ideas, and slowly grow into the confidence they didn\'t know they had. It brings together people with different interests, perspectives, and personalities — creating a space where everyone has something to contribute. Whether you love being on stage or are simply looking for the courage to take that first step, Literati gives you the space to do so. At its core, Literati is about finding your voice, finding your people, and becoming a little bolder along the way.',
      why:
        'At Club Literati, every conversation can spark an idea, every idea can become an expression, and every expression can leave an impact. The club provides a space to explore ideas, exchange perspectives, and discover the power of language — encouraging students to look beyond familiar viewpoints, embrace new ways of thinking, and engage in meaningful conversations.',
      activities: [
        {
          title: 'Talkmasters Sessions',
          description:
            'Members refine impromptu speaking and build confidence on stage. Dedicated seminar and mentorship sessions where experienced senior members guide newer members in public speaking, content drafting, and debate strategy.',
        },
        {
          title: 'MLRITMUN',
          description:
            'The flagship Model UN — bringing the experience of international diplomacy to campus, giving students the opportunity to represent nations, discuss global issues, and engage in meaningful debate. Committees include AIPPM, UNCSW, UNODC, UNHRC, DISEC, and International Press.',
        },
        {
          title: 'TEDx MLRIT',
          description:
            'Theme "Echoes of Tomorrow." A full-day independently organised TEDx event held at the MLRIT Auditorium, featuring student and invited speakers exploring ideas worth spreading.',
        },
        {
          title: 'Literary Fest & Murder Mystery',
          description:
            'The annual Literary Fest (#LIT Event) celebrating creativity through Screen Battle, LitTrivia, Treasure Hunt, Courtroom drama, and more. Plus Murder Mystery — an immersive team event where every clue matters.',
        },
      ],
    },
    events: [
      {
        id: 'lit-mlritmun',
        title: 'MLRITMUN',
        tag: 'Flagship',
        posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)',
        blurb: 'The 7th Edition of MLRIT\'s Model UN — committees, resolutions, international diplomacy, and closing ceremony. Theme: Rise | Resolve | Reform.',
      },
      {
        id: 'lit-tedx',
        title: 'TEDx MLRIT',
        tag: 'Annual Event',
        posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)',
        blurb: 'Theme "Echoes of Tomorrow" — a full day of ideas worth spreading at the MLRIT Auditorium.',
        link: 'https://tedxmlrit.in',
      },
      {
        id: 'lit-literary-fest',
        title: 'Literary Fest',
        tag: 'Annual Fest',
        posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)',
        blurb: 'The #LIT Event — Screen Battle, LitTrivia, Treasure Hunt, Courtroom drama, Basketball, Food Carnival, and more across a full campus day.',
      },
      {
        id: 'lit-murder-mystery',
        title: 'Murder Mystery',
        tag: 'Immersive Event',
        posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)',
        blurb: '"Everyone has a past. Some are worth killing for." A team event where every clue counts and every member has a role.',
      },
    ],
    memoryLane: [
      { src: '/images/facilities/campus/library-wide-1.jpg', alt: 'Campus library' },
      { src: '/images/facilities/campus/library-reading-1.jpg', alt: 'Students reading in the library' },
      { src: '/images/students/p4.png', alt: 'A Club Literati debate session' },
      { src: '/images/students/p5.png', alt: 'A Club Literati Talkmasters session' },
      { src: '/images/students/students-laughing.png', alt: 'Club Literati members on campus' },
      { src: '/images/facilities/campus/library-wide-2.jpg', alt: 'Campus library reading area' },
      { src: '/images/students/campus-group.png', alt: 'Club Literati group photo' },
      { src: '/images/students/campus-steps.png', alt: 'Students on campus steps' },
    ],
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
    members: '99',
    hasDetailPage: true,
    about: {
      what:
        'The National Service Scheme unit is MLRIT\'s largest volunteer body — running rural camps, health drives, and civic awareness campaigns across the year.',
      why:
        'Service works best as habit, not a one-off. NSS exists to give students a standing, organised way to show up for the community beyond campus.',
      activities: [
        { title: 'Rural Camps', description: 'Multi-day residential camps taking on development work in partner villages.' },
        { title: 'Blood Donation Drives', description: 'Regular on-campus drives run in partnership with local hospitals and blood banks.' },
        { title: 'Voter Awareness Campaigns', description: 'Campus and community campaigns encouraging voter registration and civic participation.' },
        { title: 'Swachh Bharat Drives', description: 'Cleanliness and tree plantation drives across campus and neighbouring communities.' },
      ],
    },
    events: [
      { id: 'nss-rural-camp', title: 'Annual Rural Camp', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'A week-long residential camp taking on infrastructure and awareness work in a partner village.' },
      { id: 'nss-blood-drive', title: 'Blood Donation Drive', tag: 'Recurring', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A campus-wide blood donation drive run in partnership with a local hospital.' },
      { id: 'nss-plantation', title: 'Tree Plantation Day', tag: 'Community', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'Volunteers plant saplings across campus and a neighbouring community as part of a green drive.' },
      { id: 'nss-swachh-bharat', title: 'Swachh Bharat Drive', tag: 'Civic drive', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'A cleanliness drive across campus and nearby public spaces under the Swachh Bharat mission.' },
    ],
    memoryLane: [
      { src: '/images/students/campus-group.png', alt: 'NSS volunteers on campus' },
      { src: '/images/campus/campus-aerial.png', alt: 'Aerial view of campus' },
      { src: '/images/students/p6.png', alt: 'NSS volunteers at a community drive' },
      { src: '/images/students/p7.png', alt: 'NSS volunteers at a rural camp' },
      { src: '/images/students/students-laughing.png', alt: 'Students bonding on campus' },
      { src: '/images/campus/canteen-friends.png', alt: 'Friends at the campus canteen' },
      { src: '/images/campus/graduation.png', alt: 'A campus event' },
      { src: '/images/students/campus-steps.png', alt: 'Students on campus steps' },
    ],
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
    members: '78',
    hasDetailPage: true,
    about: {
      what:
        'The CSI Student Chapter connects MLRIT to the Computer Society of India\'s national network — talks, certifications, and industry contacts most clubs can\'t offer.',
      why:
        'Technical skill needs a professional network to turn into a career. CSI exists to give students that — real industry speakers, recognised certifications, and a seat at national conventions.',
      activities: [
        { title: 'Tech Talks', description: 'Industry speaker sessions on current technology trends and career paths.' },
        { title: 'Certification Workshops', description: 'Workshops preparing members for recognised industry certifications.' },
        { title: 'Industry Connect Sessions', description: 'Structured networking sessions connecting members directly with industry professionals.' },
        { title: 'National Convention Teams', description: 'Delegations representing MLRIT at national CSI student conventions.' },
      ],
    },
    events: [
      { id: 'csi-tech-summit', title: 'Tech Summit', tag: 'Flagship', posterGradient: 'linear-gradient(155deg, #023d10 0%, #01741f 55%, #0a3d1f 100%)', blurb: 'A day of industry speaker talks covering the technologies shaping the next few years.' },
      { id: 'csi-cert-workshop', title: 'Certification Workshop', tag: 'Workshop', posterGradient: 'linear-gradient(155deg, #0b1f3d 0%, #1e3a5f 55%, #14294a 100%)', blurb: 'A guided workshop preparing members for a recognised industry certification exam.' },
      { id: 'csi-industry-connect', title: 'Industry Connect Evening', tag: 'Networking', posterGradient: 'linear-gradient(155deg, #3a1503 0%, #b45309 55%, #7a3706 100%)', blurb: 'A structured networking evening pairing members directly with visiting industry professionals.' },
      { id: 'csi-national-convention', title: 'National Convention Send-off', tag: 'Delegation', posterGradient: 'linear-gradient(155deg, #1a0b3d 0%, #6b3fa0 55%, #3a1f5f 100%)', blurb: 'A send-off and prep session for the delegation representing MLRIT at the national CSI convention.' },
    ],
    memoryLane: [
      { src: '/images/students/students-laughing.png', alt: 'CSI members bonding on campus' },
      { src: '/images/facilities/campus/library-wide-1.jpg', alt: 'Campus library' },
      { src: '/images/facilities/campus/sti-hub-4.jpg', alt: 'STI Hub event space' },
      { src: '/images/campus/conference-room.png', alt: 'A CSI industry connect session' },
      { src: '/images/students/campus-steps.png', alt: 'Students on campus steps' },
      { src: '/images/students/p8.png', alt: 'CSI members at a tech talk' },
      { src: '/images/students/campus-group.png', alt: 'A CSI Student Chapter group photo' },
      { src: '/images/students/club-event.png', alt: 'Students at a club event' },
    ],
  },
];

export function getClubById(id: string): Club | undefined {
  return CLUBS.find((c) => c.id === id);
}

/** Only clubs with a designed /campus/clubs/[id] detail page are statically generated. */
export function getAllClubIds(): string[] {
  return CLUBS.filter((c) => c.hasDetailPage).map((c) => c.id);
}

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
