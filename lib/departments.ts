// Department data — one source for the dynamic /departments/[slug] route.

export type Department = {
  slug: string;
  code: string;
  name: string;
  short: string;
  degree: string;
  duration: string;
  level: 'ug' | 'pg';
  accent: 'green' | 'navy' | 'orange';
  tagline: string;
  vision: string;
  mission: string[];
  peos: { id: string; text: string }[];
  pos?: string[];
  hod: { name: string; title: string };
  reels?: DeptReel[];
};

export type DeptReel = {
  reelUrl: string;
  thumbnail: string;
  quote: string;
  name: string;
  role: string;
};

export const DEPARTMENTS: Department[] = [
  {
    slug: 'cse',
    code: 'CSE',
    name: 'Computer Science and Engineering',
    short: 'Computer Science',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'green',
    tagline: 'Building the software systems that power the modern world.',
    vision: 'To be a centre of excellence in Computer Science education, research and innovation — producing engineers ready to lead in industry and academia.',
    mission: [
      'Deliver an industry-aligned curriculum spanning AI, systems, web and cybersecurity.',
      'Operate well-resourced labs in DSA, AI/ML, cloud and operating systems.',
      'Foster research participation among undergraduates and faculty.',
    ],
    peos: [
      { id: 'PEO1', text: 'Build careers as software engineers, researchers and entrepreneurs.' },
      { id: 'PEO2', text: 'Pursue advanced studies and lifelong learning in computing.' },
      { id: 'PEO3', text: 'Contribute to society as ethical, collaborative technologists.' },
    ],
    hod: { name: 'Dr. Ajmeera Kiran', title: 'Professor & Head of Department, CSE' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/DWdgy0xDGvL/',
        thumbnail: '/images/students/reel-cse.png',
        quote: '"The labs here pushed me to build things I never thought I could — real projects, real mentors, real outcomes."',
        name: 'CSE Student',
        role: 'B.Tech — Computer Science & Engineering',
      },
    ],
  },
  {
    slug: 'cse-ds',
    code: 'CSE-DS',
    name: 'Computer Science & Engineering (Data Science)',
    short: 'Data Science',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'orange',
    tagline: 'Turning data into decisions.',
    vision: 'To produce data scientists who extract value from data — for industry, research and society.',
    mission: [
      'Curriculum covering statistics, ML, deep learning, big-data engineering and visualisation.',
      'Industry-aligned capstone projects with real datasets.',
      'Tooling exposure — Python, R, Spark, TensorFlow, PyTorch, Tableau.',
    ],
    peos: [
      { id: 'PEO1', text: 'Build careers in analytics, ML engineering and research.' },
      { id: 'PEO2', text: 'Translate domain problems into data-driven solutions.' },
      { id: 'PEO3', text: 'Apply data ethics responsibly across applications.' },
    ],
    hod: { name: 'Dr. P. Subhashini', title: 'Professor & Head of Department' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/DWdgy0xDGvL/',
        thumbnail: '/images/students/reel-aiml.png',
        quote: '"Data Science at MLRIT gave me the tools to turn raw numbers into real decisions — Python, Spark, real datasets from day one."',
        name: 'CSE-DS Student',
        role: 'B.Tech — Computer Science & Engineering (Data Science)',
      },
    ],
  },
  {
    slug: 'aiml',
    code: 'AIML',
    name: 'Artificial Intelligence and Machine Learning',
    short: 'AI / ML',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'green',
    tagline: 'Building systems that learn.',
    vision: 'To produce AI engineers and researchers shaping the next generation of intelligent systems.',
    mission: [
      'Curriculum spanning ML, deep learning, NLP, computer vision and AI ethics.',
      'GPU-equipped AI lab with NVIDIA A-series hardware.',
      'Live research collaboration with industry partners and the MLRIT R&D Cell.',
    ],
    peos: [
      { id: 'PEO1', text: 'Career in ML engineering, AI research or applied data science.' },
      { id: 'PEO2', text: 'Advance through M.Tech and PhD programmes globally.' },
      { id: 'PEO3', text: 'Build AI systems responsibly with fairness and explainability.' },
    ],
    hod: { name: 'Dr. Kashi Sai Prasad', title: 'Associate Professor & Head of Department' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/DWdgy0xDGvL/',
        thumbnail: '/images/students/reel-aiml.png',
        quote: '"Training neural networks in the GPU lab, publishing research as an undergrad — AIML here is the real thing, not just theory."',
        name: 'AI/ML Student',
        role: 'B.Tech — Artificial Intelligence & Machine Learning',
      },
    ],
  },
  {
    slug: 'ece',
    code: 'ECE',
    name: 'Electronics and Communication Engineering',
    short: 'ECE',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'navy',
    tagline: 'Shaping the silicon and signals that connect the world.',
    vision: 'To produce ECE engineers capable of designing the systems that power modern communication, computing and embedded devices.',
    mission: [
      'Deliver a curriculum balancing fundamentals with VLSI, embedded and signal-processing tracks.',
      'Operate state-of-the-art FPGA, embedded and RF labs.',
      'Promote student participation in industry-led design competitions.',
    ],
    peos: [
      { id: 'PEO1', text: 'Career in semiconductor, embedded, telecom or signal-processing companies.' },
      { id: 'PEO2', text: 'Pursue advanced studies in electronics and computing.' },
      { id: 'PEO3', text: 'Develop ethical, sustainable hardware-software systems.' },
    ],
    hod: { name: 'Dr. V. Thrimurthulu', title: 'Professor & Head of Department, ECE' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/CixMnEPPIm9/',
        thumbnail: '/images/students/reel-ece.png',
        quote: '"From signal processing to FPGA design — every semester opened a new world. MLRIT gave me the depth I needed."',
        name: 'ECE Student',
        role: 'B.Tech — Electronics & Communication Engineering',
      },
    ],
  },
  {
    slug: 'eee',
    code: 'EEE',
    name: 'Electrical and Electronics Engineering',
    short: 'EEE',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'orange',
    tagline: 'Powering tomorrow — sustainably.',
    vision: 'To produce electrical engineers ready for power systems, electronics, control and renewable-energy industries.',
    mission: [
      'Deliver a curriculum balancing fundamentals with power electronics, renewables, control and instrumentation.',
      'Operate well-equipped power, machines and embedded labs.',
      'Engage students in industry projects, internships and research.',
    ],
    peos: [
      { id: 'PEO1', text: 'Career in power, electronics or instrumentation sectors.' },
      { id: 'PEO2', text: 'Pursue postgraduate study and research.' },
      { id: 'PEO3', text: 'Champion sustainable energy and ethical engineering.' },
    ],
    hod: { name: 'Prof. Ashok Kumar Cheeli', title: 'Professor & Head of Department' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/CixMnEPPIm9/',
        thumbnail: '/images/students/reel-ece.png',
        quote: '"Power systems, renewable energy, control circuits — EEE at MLRIT prepares you for the grid of the future."',
        name: 'EEE Student',
        role: 'B.Tech — Electrical & Electronics Engineering',
      },
    ],
  },
  {
    slug: 'mechanical',
    code: 'MECH',
    name: 'Mechanical Engineering',
    short: 'Mechanical',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'orange',
    tagline: 'Designing the machines that move our world.',
    vision: 'To be a centre of excellence producing mechanical engineers capable of contributing to manufacturing, design and thermal sectors globally.',
    mission: [
      'Deliver a curriculum balancing theory, simulation and shop-floor practice.',
      'Operate well-equipped CAD/CAM, thermal and manufacturing labs.',
      'Encourage student participation in industry projects and competitions.',
    ],
    peos: [
      { id: 'PEO1', text: 'Build careers in design, manufacturing, automotive and energy sectors.' },
      { id: 'PEO2', text: 'Pursue postgraduate study and research in mechanical sciences.' },
      { id: 'PEO3', text: 'Innovate as entrepreneurs in product design and rapid prototyping.' },
    ],
    hod: { name: 'Dr. J. Krishnaraj', title: 'Professor & Head of Department' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/C81FPqwNwv7/',
        thumbnail: '/images/students/reel-mech.png',
        quote: '"Workshop sessions made theory tangible. I went from reading about manufacturing to actually machining parts in semester two."',
        name: 'Mechanical Student',
        role: 'B.Tech — Mechanical Engineering',
      },
    ],
  },
  {
    slug: 'aeronautical',
    code: 'AERO',
    name: 'Aeronautical Engineering',
    short: 'Aeronautical',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'navy',
    tagline: 'Engineering flight — from drones to spacecraft.',
    vision: 'To produce aeronautical engineers leading India\'s ambitions in aviation, space and unmanned systems.',
    mission: [
      'Curriculum covering aerodynamics, propulsion, materials, structures and avionics.',
      'Active UAV / drone research and design competitions.',
      'Industry partnerships with HAL, BEL and PATPL.',
    ],
    peos: [
      { id: 'PEO1', text: 'Career in aviation, space, defence and UAV companies.' },
      { id: 'PEO2', text: 'Pursue M.Tech and PhD in aerospace sciences.' },
      { id: 'PEO3', text: 'Innovate in the unmanned systems and space economy.' },
    ],
    hod: { name: 'Algam Sai Kumar', title: 'Head of Department, Aeronautical Engineering' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/DGK1OMGyIop/',
        thumbnail: '/images/students/reel-aero.png',
        quote: '"Wind tunnel experiments, UAV builds, HAL visits — Aeronautical at MLRIT is an experience unlike any other engineering branch."',
        name: 'Aeronautical Student',
        role: 'B.Tech — Aeronautical Engineering',
      },
    ],
  },
  {
    slug: 'mba',
    code: 'MBA',
    name: 'Master of Business Administration',
    short: 'MBA',
    degree: 'MBA', duration: '2 Years', level: 'pg', accent: 'green',
    tagline: 'From engineering to enterprise.',
    vision: 'To produce business leaders who combine engineering instinct with management craft.',
    mission: [
      'Dual-specialisation curriculum (Marketing, Finance, HR, Operations, Analytics).',
      'Live consulting projects with industry partners.',
      'Strong placement record across services and product firms.',
    ],
    peos: [
      { id: 'PEO1', text: 'Career in management consulting, analytics, product or operations.' },
      { id: 'PEO2', text: 'Develop entrepreneurial ventures.' },
      { id: 'PEO3', text: 'Lead with ethics, communication and analytical rigour.' },
    ],
    hod: { name: 'Dr. N. Ramanjaneyulu', title: 'Professor & Head of MBA' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/DWdgy0xDGvL/',
        thumbnail: '/images/students/campus-group.png',
        quote: '"Live consulting projects, industry mentors, dual specialisations — the MBA here bridges engineering thinking with business leadership."',
        name: 'MBA Student',
        role: 'MBA — Master of Business Administration',
      },
    ],
  },
  {
    slug: 'hs',
    code: 'H&S',
    name: 'Freshman Engineering',
    short: 'Freshman',
    degree: 'B.Tech (1st year)', duration: '1 Year', level: 'ug', accent: 'green',
    tagline: 'STEM — Science, Technology, Engineering and Math: education for global leadership.',
    vision: 'To attain excellence in pedagogy in the areas of humanities and basic sciences, to face the emerging global challenges efficiently and to make the students expert professionals in their fields.',
    mission: [
      'Encourage the students to know the practical applications of concepts through experience and participation.',
      'Develop students’ ability to converse rationally, speculatively and inventively in ways that are appropriate across the disciplines.',
      'Endeavor to excel in knowledge and human resource capacity building in science without sacrificing quality and quantity.',
      'Provide students with soft skills and behavioral training programs in order to develop their overall personality and social consciousness.',
      'Provide an amicable ambience to inspire the students to indulge in creativity and innovation.',
    ],
    peos: [
      { id: 'PEO1', text: 'Build the common conceptual base in mathematics, sciences and communication for every engineering branch.' },
      { id: 'PEO2', text: 'Develop critical thinking, practical application skills and effective communication across disciplines.' },
      { id: 'PEO3', text: 'Prepare students to transition confidently into their chosen engineering specialisation.' },
    ],
    hod: { name: 'Dr. Ch. Achi Reddy', title: 'Professor & Head, Department of Humanities and Sciences' },
    reels: [
      {
        reelUrl: 'https://www.instagram.com/reel/DWdgy0xDGvL/',
        thumbnail: '/images/students/campus-group.png',
        quote: '"First year set the foundation — maths, physics, communication, critical thinking. MLRIT starts you right before you specialise."',
        name: 'Freshman Student',
        role: 'B.Tech — Freshman Engineering (First Year)',
      },
    ],
  },
];

export function getDepartment(slug: string) {
  return DEPARTMENTS.find((d) => d.slug === slug);
}
