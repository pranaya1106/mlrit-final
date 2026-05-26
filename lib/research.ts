// Research site map and shared content

export const RESEARCH_NAV = [
  { slug: '',                  label: 'Overview' },
  { slug: 'centers',           label: 'Research Centres' },
  { slug: 'sponsored-projects', label: 'Sponsored Projects' },
  { slug: 'scholars',          label: 'Research Scholars' },
  { slug: 'doctoral-faculty',  label: 'Doctoral Faculty' },
  { slug: 'ipfc',              label: 'IPFC Centre' },
  { slug: 'publications',      label: 'Publications' },
  { slug: 'patents',           label: 'Patents (IPRs)' },
  { slug: 'consultancy',       label: 'Consultancy' },
  { slug: 'entrepreneurship',  label: 'Entrepreneurship' },
  { slug: 'policies',          label: 'Policies & Forms' },
];

export type ResearchPage = {
  title: string;
  italic?: string;
  dek: string;
  bullets?: string[];
  cards?: { title: string; body: string }[];
};

export const RESEARCH_OVERVIEW: ResearchPage = {
  title: 'Research and Development',
  italic: 'at MLR Institute of Technology.',
  dek: 'MLR Institute of Technology focuses on research programmes through an independent R&D Cell — established to promote, monitor and elevate the research culture of the college across faculty, scholars and student innovators.',
  bullets: [
    'Independent cell, nurturing research culture',
    'Three departmental centres carrying the day',
    'JNTUH-recognised centres for doctoral programmes',
    'Labs and resources supporting active research',
    'R&D Committee steering project selection and grants',
  ],
};

export const RESEARCH_PAGES: Record<string, ResearchPage> = {
  centers: {
    title: 'Research', italic: 'Centres',
    dek: 'MLRIT operates three JNTUH-recognised research centres — CSE, ECE and Aero — each hosting doctoral scholars and live industry-funded projects.',
    cards: [
      { title: 'Computer Science & Engineering', body: 'AI/ML, IoT and Cybersecurity tracks. 12 ongoing scholars; partnerships with TCS, Cognizant and Wipro.' },
      { title: 'Electronics & Communication', body: 'Embedded systems, VLSI and signal processing. State-of-the-art FPGA labs and 8 active scholars.' },
      { title: 'Aeronautical Engineering', body: 'UAV / drone autonomy, materials and propulsion. Industry-funded swarm research lab.' },
    ],
  },
  'sponsored-projects': {
    title: 'Sponsored', italic: 'Projects',
    dek: 'A growing portfolio of externally-funded projects across DST, AICTE, DRDO and corporate partners.',
    cards: [
      { title: 'DST — Energy Storage',       body: '3-year project on solid-state battery materials.' },
      { title: 'DRDO — UAV Swarms',          body: 'Autonomous swarm coordination for ISR missions.' },
      { title: 'AICTE — Smart Mobility',     body: 'Sensor-fusion stack for last-mile EV vehicles.' },
      { title: 'TCS — Cyber Defence',        body: 'Threat-modelling toolkit for SCADA / OT networks.' },
    ],
  },
  scholars: {
    title: 'Research', italic: 'Scholars',
    dek: '32 doctoral scholars currently registered across our three JNTUH-recognised centres.',
    bullets: [
      'CSE — 12 active scholars (AI/ML, IoT, Cybersecurity)',
      'ECE — 8 active scholars (Embedded, VLSI, Signal Processing)',
      'Aero — 6 active scholars (UAV, Materials, Propulsion)',
      'EEE — 4 active scholars (Power Electronics, Renewables)',
      'MECH — 2 active scholars (Manufacturing, Thermal)',
    ],
  },
  'doctoral-faculty': {
    title: 'Doctoral', italic: 'Faculty',
    dek: '25+ doctoral faculty across departments — recognised research supervisors guiding scholars and projects.',
    cards: [
      { title: 'Dr. K. Srinivas Rao', body: 'Professor, CSE — AI/ML, IQAC Coordinator. 18 yrs experience.' },
      { title: 'Dr. P. Rajashekar',   body: 'Professor, ECE — VLSI design and embedded systems.' },
      { title: 'Dr. M. Anitha',       body: 'Associate Professor, AI/ML — explainable AI research lead.' },
      { title: 'Dr. Ashok Kumar',     body: 'Professor, EEE — smart grid and renewable integration.' },
    ],
  },
  ipfc: {
    title: 'IPFC', italic: 'Centre',
    dek: 'The Intellectual Property Facilitation Centre at MLRIT — established 2019 to support patent filings, IPR awareness and industry-academia translation.',
    bullets: [
      'Patent search and prior-art guidance',
      'Drafting workshops twice per semester',
      'Liaison with TIFAC and patent attorneys',
      'Support for student inventors and faculty co-inventors',
    ],
  },
  publications: {
    title: 'Publications', italic: '(2016 – 2025)',
    dek: 'Over 1,200 peer-reviewed publications across Scopus and Web of Science indexed venues.',
    cards: [
      { title: '2025', body: '186 publications — h-index avg 5.4, SCI/Scopus combined.' },
      { title: '2024', body: '172 publications — Q1/Q2 venue rate at 41%.' },
      { title: '2023', body: '154 publications — best paper award at IEEE INDICON.' },
      { title: '2016–22 cumulative', body: '700+ publications across CSE, ECE, EEE, MECH and Aero.' },
    ],
  },
  patents: {
    title: 'Patents', italic: '(IPRs)',
    dek: '42 patents filed, 18 granted (2019–2025) across drones, IoT, biomedical sensors and EV systems.',
    bullets: [
      '12 Indian patent grants in 2024',
      '6 utility patents in IoT-edge computing',
      '4 design patents across UAV airframes',
      '2 international (PCT) filings live',
    ],
  },
  consultancy: {
    title: 'Industry', italic: 'Consultancy',
    dek: 'Faculty-led consultancy and contract-research engagements with public and private sector partners.',
    cards: [
      { title: 'TS-SPDCL', body: 'Smart-meter rollout — analytics support and pilot deployment.' },
      { title: 'BEL',      body: 'Embedded firmware audit for ground-based radar sub-systems.' },
      { title: 'ECIL',     body: 'PCB-design consultancy for nuclear instrumentation modules.' },
      { title: 'Triveni Engineering', body: 'Vibration analytics for turbine generators.' },
    ],
  },
  entrepreneurship: {
    title: 'Innovation &', italic: 'Entrepreneurship',
    dek: 'CIE-MLRIT — the Centre for Innovation & Entrepreneurship hosts incubation, hackathons and the annual Equinox Summit.',
    bullets: [
      '12 student startups incubated since 2022',
      '₹1.2 Cr in seed grants disbursed via partner VCs',
      'Cisco ThingQbator Cohort 7 — top 10 institution',
      'Annual Equinox Entrepreneurship Summit',
    ],
  },
  policies: {
    title: 'Policies', italic: 'and Forms',
    dek: 'Institutional policies, forms and templates governing research activities at MLRIT.',
    cards: [
      { title: 'Research Policy 2024',     body: 'Ethics, IP ownership and publication norms.' },
      { title: 'IPR Policy',               body: 'Filing process and royalty split for grants.' },
      { title: 'Sponsored-Project Forms',  body: 'Project sanction, financial and closure templates.' },
      { title: 'Consultancy Agreement',    body: 'Standard MoU template for industry consultancy.' },
    ],
  },
};
