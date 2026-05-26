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
    hod: { name: 'Dr. K. Srinivas Rao', title: 'Professor & Head of Department' },
  },
  {
    slug: 'cse-cs',
    code: 'CSE-CS',
    name: 'Computer Science & Engineering (Cyber Security)',
    short: 'Cyber Security',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'navy',
    tagline: 'Defending the digital frontier.',
    vision: 'To produce cybersecurity engineers capable of safeguarding the digital infrastructure of nations, enterprises and individuals.',
    mission: [
      'Deliver a curriculum spanning network security, cryptography, ethical hacking and forensics.',
      'Maintain a state-of-the-art SOC and red-team lab on campus.',
      'Embed industry certifications (CEH, OSCP, CompTIA) in the programme.',
    ],
    peos: [
      { id: 'PEO1', text: 'Build careers as security analysts, penetration testers and CISOs.' },
      { id: 'PEO2', text: 'Stay ahead of evolving threat landscapes through continued learning.' },
      { id: 'PEO3', text: 'Contribute to a safer digital society with ethical practice.' },
    ],
    hod: { name: 'Dr. K. Srinivas Rao', title: 'Professor & Head of Department' },
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
    hod: { name: 'Dr. K. Srinivas Rao', title: 'Professor & Head of Department' },
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
    hod: { name: 'Dr. M. Anitha', title: 'Associate Professor & In-Charge HoD' },
  },
  {
    slug: 'csit',
    code: 'CSIT',
    name: 'Computer Science & Information Technology',
    short: 'CSIT',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'navy',
    tagline: 'Where computing meets enterprise systems.',
    vision: 'To produce IT engineers who can architect, deploy and manage modern enterprise systems.',
    mission: [
      'Curriculum spanning systems, cloud, DevOps, full-stack and information security.',
      'Industry-grade cloud labs (AWS, Azure, GCP).',
      'Project-based learning anchored in real enterprise workflows.',
    ],
    peos: [
      { id: 'PEO1', text: 'Career in full-stack development, cloud engineering and IT operations.' },
      { id: 'PEO2', text: 'Strong foundation for industry certifications.' },
      { id: 'PEO3', text: 'Lifelong learning across rapidly changing IT stacks.' },
    ],
    hod: { name: 'Dr. P. Raj Kumar', title: 'Professor & Head of Department' },
  },
  {
    slug: 'it',
    code: 'IT',
    name: 'Information Technology',
    short: 'IT',
    degree: 'B.Tech', duration: '4 Years', level: 'ug', accent: 'green',
    tagline: 'Engineering enterprise IT.',
    vision: 'To produce IT engineers with strong systems-thinking and a service-orientation mindset.',
    mission: [
      'Curriculum covering systems, networks, software, security and IT service management.',
      'Project-driven learning and capstone integration.',
      'Industry interface through MoUs and internships.',
    ],
    peos: [
      { id: 'PEO1', text: 'Career in IT services, systems administration and software roles.' },
      { id: 'PEO2', text: 'Pursue M.Tech / MBA / certifications.' },
      { id: 'PEO3', text: 'Build IT systems that are reliable, ethical and secure.' },
    ],
    hod: { name: 'Dr. P. Raj Kumar', title: 'Professor & Head of Department' },
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
    hod: { name: 'Dr. P. Rajashekar', title: 'Professor & Head of Department' },
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
    hod: { name: 'Dr. K. Eshwara Prasad', title: 'Professor & Head of Department' },
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
    hod: { name: 'Dr. M. Komaraiah', title: 'Professor & Head of Department' },
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
    hod: { name: 'Dr. K. Tulasi Krishna Kumar', title: 'Professor & Head of MBA' },
  },
  {
    slug: 'freshman',
    code: 'FRESHMAN',
    name: 'Freshman Engineering',
    short: 'Freshman',
    degree: 'B.Tech (1st year)', duration: '1 Year', level: 'ug', accent: 'green',
    tagline: 'The shared foundation for every engineering branch.',
    vision: 'To deliver a strong, common first-year experience across mathematics, sciences, humanities and design fundamentals.',
    mission: [
      'Foundational courses in maths, physics, chemistry, programming, communication and design.',
      'Mentorship and bridge programmes for new entrants.',
      'Early-career counselling to help students choose their major direction.',
    ],
    peos: [
      { id: 'PEO1', text: 'Build the conceptual base for every B.Tech branch.' },
      { id: 'PEO2', text: 'Develop communication, design and computational thinking skills.' },
      { id: 'PEO3', text: 'Form a cohort across branches before specialising.' },
    ],
    hod: { name: 'Dr. T. Sumathi', title: 'Professor & Coordinator, Freshman Engineering' },
  },
];

export function getDepartment(slug: string) {
  return DEPARTMENTS.find((d) => d.slug === slug);
}
