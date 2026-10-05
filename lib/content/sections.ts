/**
 * Every CMS-editable section, keyed by `${page}/${section}` — the same pair
 * used for the content_blocks lookup and the /admin/[page]/[section] route.
 *
 * Adding an entry here is all that is needed to give a section an admin editor;
 * the write API reads this to know which fields are required.
 */
export const CONTENT_SECTIONS = {
  'home/hero': {
    label: 'Homepage — Hero',
    fields: [
      { name: 'headlineLead', label: 'Headline lead', defaultValue: "Engineering" },
      { name: 'headlineAccent', label: 'Headline accent', defaultValue: "the Future." },
      { name: 'body', label: 'Body', multiline: true, defaultValue: "Two decades of shaping minds. 11,000+ engineers and counting. At MLRIT, we don't just teach the future — we build it." },
      // One upload drives both the inline preview and the lightbox — they are
      // the same film, and letting them diverge would be a bug, not a feature.
      { name: 'film', label: 'Hero film', type: 'video' },
      { name: 'poster', label: 'Hero still image', type: 'image' },
    ],
  },
  // Counters under the hero. Mirrors the STATS array in components/sections/Stats.tsx;
  // an empty repeater leaves that array in charge.
  'home/stats': {
    label: 'Homepage — Stat counters',
    fields: [
      {
        name: 'stats',
        label: 'Counters',
        type: 'repeater',
        itemFields: [
          { name: 'target', label: 'Number', type: 'number' },
          { name: 'suffix', label: 'Suffix' },
          { name: 'label', label: 'Label' },
          { name: 'caption', label: 'Caption (above)' },
          { name: 'footnote', label: 'Footnote (below)' },
        ],
        defaultItems: [
          {
            id: 'years',
            target: 20,
            suffix: '+',
            label: 'Years of Excellence',
            caption: 'Est \u00b7 2005',
            footnote: 'Autonomous under UGC since 2015',
          },
          {
            id: 'students',
            target: 11,
            suffix: 'K+',
            label: 'Students Enrolled',
            caption: 'UG \u00b7 PG \u00b7 Research',
            footnote: 'Across 8 engineering programmes',
          },
          {
            id: 'placement-rate',
            target: 98,
            suffix: '%',
            label: 'Placement Rate',
            caption: 'Batch of 2025',
            footnote: 'Verified \u00b7 Placement Cell records',
          },
          {
            id: 'recruiters',
            target: 200,
            suffix: '+',
            label: 'Recruiting Companies',
            caption: 'Incl. IIT / IIM / NIT hirers',
            footnote: 'Fortune 500 \u00b7 Startups \u00b7 MNCs',
          },
        ],
      },
    ],
  },
  'home/achievements': {
    label: 'Homepage — Accreditations',
    fields: [
      { name: 'headlineLead', label: 'Headline lead', defaultValue: "Accreditations" },
      { name: 'headlineAccent', label: 'Headline accent', defaultValue: "and Approvals." },
      { name: 'body', label: 'Body', multiline: true, defaultValue: "AICTE, NAAC, NBA, ARIIA and more — MLRIT is recognised by every leading national body for academic excellence, programme quality and innovation." },
      // defaultItems mirror the component's bundled logos so the editor opens
      // with the live set already listed and editable. No cap: the redesign
      // renders these in a marquee, which takes any number.
      {
        name: 'logos',
        label: 'Accreditation logos',
        type: 'gallery',
        itemFields: ['name'],
        defaultItems: [
          { id: 'naac', name: 'NAAC', key: '/legacy/nirf/naac.svg' },
          { id: 'aicte', name: 'AICTE', key: '/legacy/nirf/aicte.svg' },
          { id: 'the-week', name: 'The Week', key: '/legacy/nirf/the%20week.svg' },
          { id: 'ariia', name: 'ARIIA', key: '/legacy/nirf/arha.svg' },
          { id: 'nba', name: 'NBA', key: '/legacy/nirf/nba.svg' },
          { id: 'dataquest', name: 'Dataquest', key: '/legacy/nirf/dataquest.svg' },
          { id: 'gyaan-vigyan', name: 'Gyaan Vigyan', key: '/legacy/nirf/gyaanvigyan.svg' },
        ],
      },
      // Rank cards down the left column. `tint` is the accent colour used for
      // the number, the left rule and the hover index — any CSS colour.
      {
        name: 'ranks',
        label: 'Rank cards',
        type: 'repeater',
        itemFields: [
          { name: 'num', label: 'Figure' },
          { name: 'title', label: 'Title' },
          { name: 'sub', label: 'Subtitle' },
          { name: 'tint', label: 'Accent colour' },
        ],
        defaultItems: [
          {
            id: 'nirf',
            num: '201',
            title: 'NIRF Rankings 2024',
            sub: '201\u2013300 Band \u00b7 Engineering Category',
            tint: '#e85d04',
          },
          {
            id: 'times',
            num: '#6',
            title: 'Times Engineering Survey',
            sub: '6th in Telangana',
            tint: '#1F6B24',
          },
          {
            id: 'careers360',
            num: 'AAAA',
            title: 'Careers360 Rating',
            sub: 'Four-A Accredited Institution',
            tint: '#c26a2b',
          },
        ],
      },
    ],
  },
  'home/programs': {
    label: 'Homepage — Programmes',
    fields: [
      { name: 'headlineLead', label: 'Headline lead', defaultValue: "Find the programme" },
      { name: 'headlineAccent', label: 'Headline accent', defaultValue: "built for you." },
      { name: 'body', label: 'Body', multiline: true, defaultValue: "Scroll through every UG and PG programme — each card stacks into view, revealing the next." },
      // Two lists, one per tab. `accent` is a plain string rather than an enum
      // input: the component already narrows anything unrecognised to orange,
      // so a typo degrades to the default instead of breaking the card.
      {
        name: 'ug',
        label: 'Undergraduate cards',
        type: 'repeater',
        itemFields: [
          { name: 'slug', label: 'Slug (link target)' },
          { name: 'dept', label: 'Dept code' },
          { name: 'name', label: 'Programme name' },
          { name: 'meta', label: 'Meta line' },
          { name: 'desc', label: 'Description' },
          { name: 'accent', label: 'Accent (green / orange / navy)' },
        ],
        defaultItems: [
          {
            id: "cse",
            slug: "cse",
            dept: "CSE",
            name: "Computer Science & Engineering",
            meta: "B.Tech · 4 Years · 240 seats",
            desc: "Industry-aligned curriculum across AI/ML, systems, web and cybersecurity.",
            accent: "green",
          },
          {
            id: "aiml",
            slug: "aiml",
            dept: "AIML",
            name: "AI & Machine Learning",
            meta: "B.Tech · 4 Years",
            desc: "Foundational ML, deep learning and applied AI research on dedicated GPU hardware.",
            accent: "orange",
          },
          {
            id: "cse-ds",
            slug: "cse-ds",
            dept: "CSE-DS",
            name: "CSE — Data Science",
            meta: "B.Tech · 4 Years",
            desc: "Statistics, ML, deep learning, big-data and visualisation with industry capstones.",
            accent: "orange",
          },
          {
            id: "ece",
            slug: "ece",
            dept: "ECE",
            name: "Electronics & Communication",
            meta: "B.Tech · 4 Years",
            desc: "VLSI, embedded systems, signal processing and RF — anchored in industry projects.",
            accent: "orange",
          },
          {
            id: "eee",
            slug: "eee",
            dept: "EEE",
            name: "Electrical & Electronics",
            meta: "B.Tech · 4 Years",
            desc: "Power systems, electronics, control and renewable-energy engineering.",
            accent: "green",
          },
          {
            id: "mechanical",
            slug: "mechanical",
            dept: "MECH",
            name: "Mechanical Engineering",
            meta: "B.Tech · 4 Years",
            desc: "CAD/CAM, thermal sciences and manufacturing with industry-grade workshops.",
            accent: "navy",
          },
          {
            id: "aeronautical",
            slug: "aeronautical",
            dept: "AERO",
            name: "Aeronautical Engineering",
            meta: "B.Tech · 4 Years",
            desc: "Aerodynamics, propulsion and UAV design — active drone research lab.",
            accent: "orange",
          },
        ],
      },
      {
        name: 'pg',
        label: 'Postgraduate cards',
        type: 'repeater',
        itemFields: [
          { name: 'slug', label: 'Slug (link target)' },
          { name: 'dept', label: 'Dept code' },
          { name: 'name', label: 'Programme name' },
          { name: 'meta', label: 'Meta line' },
          { name: 'desc', label: 'Description' },
          { name: 'accent', label: 'Accent (green / orange / navy)' },
        ],
        defaultItems: [
          {
            id: "mba",
            slug: "mba",
            dept: "MBA",
            name: "Master of Business Administration",
            meta: "MBA · 2 Years · 120 seats",
            desc: "Dual-specialisation curriculum across Marketing, Finance, HR, Operations and Analytics.",
            accent: "green",
          },
          {
            id: "mtech-cse",
            slug: "mtech-cse",
            dept: "M.Tech-CSE",
            name: "M.Tech in Computer Science",
            meta: "M.Tech · 2 Years",
            desc: "AI/ML and systems specialisations with active research-led project work.",
            accent: "orange",
          },
          {
            id: "mtech-vlsi",
            slug: "mtech-vlsi",
            dept: "M.Tech-VLSI",
            name: "M.Tech in VLSI System Design",
            meta: "M.Tech · 2 Years",
            desc: "Front-end and back-end VLSI design tracks anchored in FPGA labs.",
            accent: "navy",
          },
          {
            id: "mtech-ps",
            slug: "mtech-ps",
            dept: "M.Tech-PS",
            name: "M.Tech in Power Systems",
            meta: "M.Tech · 2 Years",
            desc: "Smart grid, renewables, protection — industry-led project scope.",
            accent: "orange",
          },
          {
            id: "mtech-aero",
            slug: "mtech-aero",
            dept: "M.Tech-AERO",
            name: "M.Tech in Aerospace Propulsion",
            meta: "M.Tech · 2 Years",
            desc: "Propulsion, materials and unmanned-systems research with industry MoUs.",
            accent: "green",
          },
          {
            id: "phd",
            slug: "phd",
            dept: "Ph.D",
            name: "Doctoral programmes",
            meta: "Ph.D · 5 disciplines",
            desc: "JNTUH-recognised research centres in CSE, ECE, MECH, EEE and MBA.",
            accent: "navy",
          },
        ],
      },
    ],
  },
  'home/why-mlrit': {
    label: 'Homepage — Why MLRIT',
    fields: [
      { name: 'headlineLead', label: 'Headline line 1', defaultValue: "Industry." },
      { name: 'headlineAccent', label: 'Headline line 2 (gradient)', defaultValue: "Integrated." },
      { name: 'headlineTail', label: 'Headline line 3 (italic)', defaultValue: "Blended with sport." },
      { name: 'body', label: 'Body', multiline: true, defaultValue: "An integrated curriculum that gives equal weight to academics, employable skills, and sport." },
      {
        name: 'footnote',
        label: 'Founding note (**bold** supported)',
        multiline: true,
        defaultValue: "Founded in **2005** by the KMR Education Trust, headed by **Mr. Marri Laxman Reddy**. Located in Dundigal, Hyderabad. Affiliated to JNTUH. Granted autonomous status by the UGC in 2015.",
      },
      { name: 'video', label: 'Portrait video', type: 'video' },
    ],
  },

  'home/success-stories': {
    label: 'Homepage — Success stories',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', defaultValue: "Wall of Achievements" },
      { name: 'headingLead', label: 'Heading line 1', defaultValue: "Building Real Careers," },
      { name: 'headingAccent', label: 'Heading line 2', defaultValue: "Not Just Degrees." },
      { name: 'body', label: 'Body', multiline: true, defaultValue: "Real placements, real achievements — MLRIT students on the biggest campus stages and the country's top recruiters." },
      {
        name: 'cards',
        label: 'Cards',
        type: 'gallery',
        itemFields: [
          { name: 'season', label: 'Season / tag' },
          { name: 'name', label: 'Name' },
          { name: 'detail', label: 'Detail' },
        ],
        defaultItems: [
          {
            id: 'microsoft',
            key: 'https://i.ibb.co/MxvbKjRH/8.jpg',
            season: 'Placement \u00b7 2026',
            name: 'Microsoft \u2014 51 LPA',
            detail: 'Sai Loukhya & Sailatha \u00b7 CSE',
          },
          {
            id: 'faculty-cert',
            key: 'https://i.ibb.co/670CTVrD/6.png',
            season: 'Faculty \u00b7 Cert',
            name: 'Mrs. Vijay Keerthika',
            detail: 'Wipro TalentNext \u00b7 87 %',
          },
          {
            id: 'football',
            key: 'https://i.ibb.co/99JB52L2/4.jpg',
            season: 'Sports \u00b7 1st Place',
            name: 'MLRIT Football',
            detail: "vs. St. Peter's \u00b7 March 21\u201322",
          },
        ],
      },
    ],
  },

  'home/testimonials': {
    label: 'Homepage \u2014 Alumni voices',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', defaultValue: "Alumni Voices" },
      { name: 'headingLead', label: 'Heading lead', defaultValue: "What Our" },
      { name: 'headingAccent', label: 'Heading accent', defaultValue: "Graduates Say." },
      { name: 'body', label: 'Body', multiline: true, defaultValue: "Five MLRIT alumni — five different paths, one shared starting line." },
      {
        name: 'people',
        label: 'Alumni clips',
        type: 'gallery',
        // The item's primary upload is the clip itself, not a thumbnail.
        accept: 'video',
        itemFields: [
          { name: 'name', label: 'Name' },
          { name: 'title', label: 'Title / batch' },
          { name: 'description', label: 'Quote' },
        ],
        defaultItems: [
          {
            id: 'sathvika',
            key: '/videos/av1.mp4',
            name: 'Sathvika',
            title: 'CSIT \u00b7 MLRIT \u00b7 B.Tech CSE 2023',
            description:
              'MLRIT was where I learned to think like an engineer \u2014 not just to code.',
          },
          {
            id: 'pranay',
            key: '/videos/av2.mp4',
            name: 'Dasam Pranay',
            title: 'Aeronautical Engineering \u00b7 B.Tech AE 2023',
            description:
              'The aeronautical block at MLRIT is more than labs and lecture halls.',
          },
          {
            id: 'pavani',
            key: '/videos/av3.mp4',
            name: 'Gopi Pavani',
            title: 'Aerospace Engineer \u00b7 Safran \u00b7 B.Tech AE 2022',
            description:
              'MLRIT gave me the tools and confidence to walk into Safran from day one.',
          },
        ],
      },
    ],
  },

  'home/events': {
    label: 'Homepage \u2014 Events',
    fields: [
      {
        name: 'slides',
        label: 'Event slides',
        type: 'gallery',
        // Primary upload is the clip; the logo and poster are their own
        // columns, because one slide legitimately carries three files.
        accept: 'video',
        itemFields: [
          { name: 'title', label: 'Title' },
          { name: 'tag', label: 'Tag' },
          { name: 'desc', label: 'Description' },
          { name: 'quote', label: 'Quote' },
          { name: 'speaker', label: 'Speaker' },
          { name: 'speakerRole', label: 'Speaker role' },
          { name: 'logo', label: 'Logo', type: 'image' },
          { name: 'poster', label: 'Poster', type: 'image' },
        ],
        defaultItems: [
          {
            id: 'equinox',
            key: "/videos/equinox.mp4",
            title: "The Equinox E-Summit 2K24",
            tag: "Entrepreneurship · 2024",
            desc: "Equinox E-Summit is MLRIT's annual entrepreneurship summit — live startup pitches, investor panels, product showcases and workshops run by founders. Students pitch real ideas to real investors, on campus.",
            quote: "Live pitches. Real investors. Zero rehearsal. Equinox is where student ideas meet the people who fund them.",
            speaker: "Equinox E-Summit",
            speakerRole: "Annual · MLRIT Campus",
            logo: "/assets/logo.svg",
            poster: "https://mlrit-next.vercel.app/assets/SBS_0711.JPG",
          },
          {
            id: 'zignasa',
            key: "/videos/zignasa.mp4",
            title: "Zignasa 2025",
            tag: "Tech · Cultural · 2025",
            desc: "Zignasa is MLRIT's inter-departmental fest — hackathons, robotics arenas, coding contests, music, dance and film screenings running simultaneously. Every department competes. Every stage is open.",
            quote: "Every department on stage. Zignasa is the event that turns the whole campus into one team.",
            speaker: "Zignasa",
            speakerRole: "Annual Fest · MLRIT",
            logo: "/assets/zignasa-logo.png",
            poster: "https://mlrit-next.vercel.app/assets/SBS_0750.JPG",
          },
          {
            id: 'zenith',
            key: "/videos/zenith.mp4",
            title: "Zenith 2K25",
            tag: "National Tech Fest · 2025",
            desc: "Zenith is MLRIT's national-level technical festival — colleges from across India compete in robotics, circuit design, coding sprints and product challenges. Open registrations, multi-college participation.",
            quote: "National-level. Multi-college. Engineering at full intensity — Zenith is where MLRIT competes with the country.",
            speaker: "Zenith",
            speakerRole: "National Tech Fest · MLRIT",
            logo: "/assets/logo.svg",
            poster: "https://mlrit-next.vercel.app/assets/SBS_0998.JPG",
          },
          {
            id: 'navrat-naveli',
            key: "/videos/came.mp4",
            title: "Navrat Naveli 2025",
            tag: "Cultural · Dussehra · 2025",
            desc: "Navrat Naveli is MLRIT's Dussehra cultural event — classical and folk performances, garba, rangoli, traditional food and student-led celebrations marking the spirit of the festival across the campus.",
            quote: "Music, dance, colour and tradition — Navrat Naveli is how MLRIT celebrates Dussehra together.",
            speaker: "Navrat Naveli",
            speakerRole: "Cultural Fest · MLRIT",
            logo: "/assets/logo.svg",
            poster: "https://mlrit-next.vercel.app/assets/SBS_1131.JPG",
          },
        ],
      },
    ],
  },

  // Counters in the dark placements band. Mirrors the STATS array in
  // components/sections/Placements.tsx. Separate from home/stats: different
  // numbers, different component, edited independently.
  'home/placements': {
    label: 'Homepage — Placement counters',
    fields: [
      // The headline figure above the grid — it counts up, so it is a number
      // with its unit beside it rather than one preformatted string.
      { name: 'highest', label: 'Headline figure', defaultValue: '44' },
      { name: 'highestUnit', label: 'Headline unit', defaultValue: 'LPA' },
      {
        name: 'stats',
        label: 'Counters',
        type: 'repeater',
        // `value` is free text, not number + suffix: the redesign prints
        // '5,000+' and '18 LPA' verbatim, so splitting them would make the
        // editor encode formatting it cannot see in the preview.
        itemFields: [
          { name: 'value', label: 'Value' },
          { name: 'label', label: 'Label' },
          { name: 'note', label: 'Note' },
        ],
        defaultItems: [
          { id: 'placed', value: '5,000+', label: 'Students Placed', note: 'in Top MNCs since 2005' },
          {
            id: 'recruiters',
            value: '200+',
            label: 'Recruiters on Campus',
            note: 'incl. IIT / IIM / NIT hirers',
          },
          {
            id: 'average',
            value: '18 LPA',
            label: 'Average \u00b7 Top Quartile',
            note: 'Placed batch of 2025',
          },
          {
            id: 'rate',
            value: '98 %',
            label: 'Placement Rate',
            note: 'Batch of 2025 \u00b7 Verified',
          },
        ],
      },
    ],
  },

  // Recruiter logos, shared by the homepage marquee and /placements/recruiters.
  // One field, two consumers — previously the same 16 paths were generated
  // independently in both places and would have drifted the moment either was
  // edited.
  'placements/recruiters': {
    label: 'Placements — Recruiter logos',
    fields: [
      {
        name: 'logos',
        label: 'Recruiter logos',
        type: 'gallery',
        itemFields: ['name'],
        defaultItems: [
          { id: 'p1', name: 'Recruiter', key: '/placements/p1.jpg' },
          { id: 'p2', name: 'Recruiter', key: '/placements/p2.jpg' },
          { id: 'p3', name: 'Recruiter', key: '/placements/p3.jpg' },
          { id: 'p4', name: 'Recruiter', key: '/placements/p4.jpg' },
          { id: 'p5', name: 'Recruiter', key: '/placements/p5.jpg' },
          { id: 'p6', name: 'Recruiter', key: '/placements/p6.jpg' },
          { id: 'p7', name: 'Recruiter', key: '/placements/p7.png' },
          { id: 'p8', name: 'Recruiter', key: '/placements/p8.png' },
          { id: 'p9', name: 'Recruiter', key: '/placements/p9.png' },
          { id: 'p10', name: 'Recruiter', key: '/placements/p10.png' },
          { id: 'p11', name: 'Recruiter', key: '/placements/p11.png' },
          { id: 'p12', name: 'Recruiter', key: '/placements/p12.png' },
          { id: 'p13', name: 'Recruiter', key: '/placements/p13.png' },
          { id: 'p14', name: 'Recruiter', key: '/placements/p14.png' },
          { id: 'p15', name: 'Recruiter', key: '/placements/p15.png' },
          { id: 'p16', name: 'Recruiter', key: '/placements/p16.png' },
        ],
      },
    ],
  },

  'iqac/aqar': {
    label: 'IQAC — AQAR reports',
    fields: [
      {
        name: 'reports',
        label: 'AQAR reports',
        type: 'repeater',
        // `available` and `latest` are yes/blank rather than checkboxes: a
        // repeater column holds text, and the component reads them the same
        // way the footer reads its external-link flag.
        itemFields: [
          { name: 'year', label: 'Year' },
          { name: 'file', label: 'PDF link' },
          { name: 'available', label: 'Published (yes / blank)' },
          { name: 'latest', label: 'Latest (yes / blank)' },
        ],
        defaultItems: [
          { id: "2023-24", year: "2023–24", file: "/iqac/aqar/aqar-2023-24.pdf", available: "yes", latest: "yes" },
          { id: "2022-23", year: "2022–23", file: "/iqac/aqar/aqar-2022-23.pdf", available: "yes", latest: "" },
          { id: "2020-21", year: "2020–21", file: "/iqac/aqar/aqar-2020-21.pdf", available: "", latest: "" },
          { id: "2019-20", year: "2019–20", file: "/iqac/aqar/aqar-2019-20.pdf", available: "", latest: "" },
          { id: "2018-19", year: "2018–19", file: "/iqac/aqar/aqar-2018-19.pdf", available: "", latest: "" },
          { id: "2017-18", year: "2017–18", file: "/iqac/aqar/aqar-2017-18.pdf", available: "", latest: "" },
          { id: "2016-17", year: "2016–17", file: "/iqac/aqar/aqar-2016-17.pdf", available: "", latest: "" },
        ],
      },
    ],
  },

  'iqac/best-practices': {
    label: 'IQAC — Best practices',
    fields: [
      {
        name: 'practices',
        label: 'Practices',
        type: 'repeater',
        itemFields: [
          { name: 'n', label: 'Number label' },
          { name: 't', label: 'Title' },
          { name: 'd', label: 'Description' },
        ],
        defaultItems: [
          { id: "best-practice-1", n: "Best Practice 1", t: "Mentoring & Student Support System", d: "Every student is assigned a faculty mentor who tracks academic progress, attendance, personal development and career readiness throughout the programme." },
          { id: "best-practice-2", n: "Best Practice 2", t: "Industry-Integrated Curriculum", d: "Curriculum designed in consultation with industry experts; includes live projects, internship components and elective tracks aligned to current technology domains." },
          { id: "best-practice-3", n: "Best Practice 3", t: "Green Campus Initiatives", d: "Sustained efforts towards solar energy, tree plantation drives, water conservation and paperless administration to build an eco-sensitive campus." },
        ],
      },
    ],
  },

  'iqac/functions': {
    label: 'IQAC — Functions',
    fields: [
      {
        name: 'functions',
        label: 'Functions',
        type: 'repeater',
        itemFields: [{ name: 'text', label: 'Function' }],
        defaultItems: [
          { id: "fn-1", text: "Develops and monitors institutional quality benchmarks." },
          { id: "fn-2", text: "Coordinates accreditation and ranking activities." },
          { id: "fn-3", text: "Facilitates Academic and Administrative Audits." },
          { id: "fn-4", text: "Promotes Outcome-Based Education (OBE)." },
          { id: "fn-5", text: "Encourages innovative teaching-learning methodologies." },
          { id: "fn-6", text: "Collects and analyses stakeholder feedback." },
          { id: "fn-7", text: "Monitors implementation of quality initiatives." },
          { id: "fn-8", text: "Coordinates Annual Quality Assurance Report (AQAR) preparation." },
          { id: "fn-9", text: "Supports NBA, NAAC, NIRF, AISHE, and statutory compliance." },
          { id: "fn-10", text: "Organizes faculty development programmes, workshops, seminars, and quality awareness activities." },
          { id: "fn-11", text: "Promotes best practices and institutional distinctiveness." },
          { id: "fn-12", text: "Maintains quality documentation and evidence for accreditation." },
        ],
      },
      {
        name: 'steps',
        label: 'Process flow steps',
        type: 'repeater',
        itemFields: [
          { name: 'n', label: 'Number' },
          { name: 'label', label: 'Label' },
        ],
        defaultItems: [
          { id: "step-01", n: "01", label: "Vision & Mission" },
          { id: "step-02", n: "02", label: "Strategic Planning" },
          { id: "step-03", n: "03", label: "Quality Objectives & Benchmarks" },
          { id: "step-04", n: "04", label: "Department Quality Planning" },
          { id: "step-05", n: "05", label: "Implementation of Academic & Administrative Processes" },
          { id: "step-06", n: "06", label: "Monitoring & Documentation" },
          { id: "step-07", n: "07", label: "Internal Academic Audit / Administrative Audit" },
          { id: "step-08", n: "08", label: "Stakeholder Feedback Collection" },
          { id: "step-09", n: "09", label: "Performance Analysis" },
          { id: "step-10", n: "10", label: "IQAC Review Meeting" },
          { id: "step-11", n: "11", label: "Action Taken Report (ATR)" },
          { id: "step-12", n: "12", label: "Corrective & Preventive Actions" },
          { id: "step-13", n: "13", label: "Continuous Quality Improvement" },
          { id: "step-14", n: "14", label: "Institutional Excellence" },
        ],
      },
    ],
  },

  'iqac/objectives': {
    label: 'IQAC — Objectives',
    fields: [
      {
        name: 'objectives',
        label: 'Objectives',
        type: 'repeater',
        itemFields: [
          { name: 'n', label: 'Number' },
          { name: 't', label: 'Title' },
          { name: 'd', label: 'Description' },
        ],
        defaultItems: [
          { id: "obj-01", n: "01", t: "Academic Excellence", d: "Strengthen the quality of teaching-learning processes through innovative pedagogical practices, curriculum enrichment, experiential learning, and outcome-based education to enhance student learning outcomes." },
          { id: "obj-02", n: "02", t: "Continuous Quality Improvement", d: "Establish robust quality assurance mechanisms that facilitate periodic review, monitoring, assessment, and continual enhancement of academic and administrative processes." },
          { id: "obj-03", n: "03", t: "Outcome-Based Education (OBE)", d: "Promote effective implementation of Outcome-Based Education by aligning curriculum delivery, assessment, and attainment with Programme Outcomes (POs), Programme Specific Outcomes (PSOs), and Course Outcomes (COs)." },
          { id: "obj-04", n: "04", t: "Research, Innovation and Consultancy", d: "Encourage faculty and students to engage in impactful research, interdisciplinary collaborations, innovation, entrepreneurship, consultancy, patents, and technology transfer." },
          { id: "obj-05", n: "05", t: "Faculty Empowerment", d: "Support continuous professional development through Faculty Development Programmes (FDPs), workshops, certifications, research opportunities, and industry interactions." },
          { id: "obj-06", n: "06", t: "Student Development", d: "Create a learner-centric environment that nurtures technical competence, leadership, ethical values, innovation, employability skills, and lifelong learning." },
          { id: "obj-07", n: "07", t: "Digital Transformation", d: "Leverage digital technologies and data-driven systems to improve academic administration, documentation, quality monitoring, and institutional decision-making." },
          { id: "obj-08", n: "08", t: "Accreditation and Ranking Excellence", d: "Strengthen institutional preparedness for accreditation and ranking frameworks such as NAAC, NBA, NIRF, AISHE, AICTE, and other quality assessment agencies." },
          { id: "obj-09", n: "09", t: "Stakeholder Engagement", d: "Develop effective mechanisms to obtain, analyze, and act upon feedback from students, faculty, alumni, employers, parents, and industry to enhance institutional effectiveness." },
          { id: "obj-10", n: "10", t: "Sustainable Institutional Development", d: "Promote environmentally responsible practices, social responsibility, inclusiveness, ethical governance, and community engagement to achieve long-term institutional sustainability." },
        ],
      },
      {
        name: 'commitments',
        label: 'Quality policy commitments',
        type: 'repeater',
        itemFields: [{ name: 'text', label: 'Commitment' }],
        defaultItems: [
          { id: "commitment-1", text: "Deliver quality education through effective curriculum planning, innovative teaching-learning practices, and robust assessment systems." },
          { id: "commitment-2", text: "Promote Outcome-Based Education to ensure attainment of defined learning outcomes and graduate attributes." },
          { id: "commitment-3", text: "Foster a culture of continuous quality improvement through regular monitoring, evaluation, and quality audits." },
          { id: "commitment-4", text: "Encourage research, innovation, entrepreneurship, consultancy, and interdisciplinary collaboration." },
          { id: "commitment-5", text: "Strengthen industry partnerships to enhance experiential learning, internships, skill development, and employability." },
          { id: "commitment-6", text: "Provide opportunities for faculty development, leadership, and professional growth." },
          { id: "commitment-7", text: "Create an inclusive, student-centric, and technology-enabled learning environment." },
          { id: "commitment-8", text: "Ensure transparent, participative, and accountable governance practices." },
          { id: "commitment-9", text: "Promote environmental sustainability, social responsibility, and ethical values." },
          { id: "commitment-10", text: "Comply with statutory, regulatory, and accreditation requirements while continually improving institutional effectiveness." },
        ],
      },
    ],
  },

  'iqac/reports': {
    label: "IQAC — Reports & documents",
    fields: [
      {
        name: "aqar",
        label: "AQAR reports",
        type: 'repeater',
        itemFields: [
          { name: "label", label: "Label" },
          { name: "href", label: "Link" },
          { name: "tag", label: "Tag" },
        ],
        defaultItems: [
          { id: "aqar-reports", label: "AQAR Reports", href: "/iqac/aqar", tag: "Annual Report" },
        ],
      },
      {
        name: "minutes",
        label: "Minutes",
        type: 'repeater',
        itemFields: [
          { name: "label", label: "Label" },
          { name: "href", label: "Link" },
          { name: "tag", label: "Tag" },
        ],
        defaultItems: [
          { id: "iqac-minutes-of-meeting", label: "IQAC Minutes of Meeting", href: "https://mlrit.ac.in/iqac-mom/", tag: "Governance" },
        ],
      },
      {
        name: "other",
        label: "Other reports",
        type: 'repeater',
        itemFields: [
          { name: "label", label: "Label" },
          { name: "href", label: "Link" },
          { name: "tag", label: "Tag" },
        ],
        defaultItems: [
          { id: "strategic-perspective-plan", label: "Strategic Perspective Plan", href: "https://mlrit.ac.in/iqac/", tag: "Planning" },
          { id: "policies", label: "Policies", href: "https://mlrit.ac.in/iqac/policies/", tag: "Policy" },
          { id: "newsletters", label: "Newsletters", href: "https://mlrit.ac.in/iqac/", tag: "Publications" },
          { id: "nba-programme-accreditation", label: "NBA — Programme Accreditation", href: "/iqac/nba", tag: "Accreditation" },
        ],
      },
    ],
  },

  'iqac/feedback': {
    label: "IQAC — Feedback types",
    fields: [
      {
        name: "types",
        label: "Feedback types",
        type: 'repeater',
        itemFields: [
          { name: "tag", label: "Tag" },
          { name: "title", label: "Title" },
          { name: "desc", label: "Description" },
        ],
        defaultItems: [
          { id: "student-feedback", tag: "Students", title: "Student Feedback", desc: "Semester-wise feedback on teaching quality, course delivery, infrastructure and overall campus experience collected from all enrolled students." },
          { id: "faculty-feedback", tag: "Faculty", title: "Faculty Feedback", desc: "Feedback from faculty on curriculum relevance, administrative support, professional development opportunities and institutional processes." },
          { id: "alumni-feedback", tag: "Alumni", title: "Alumni Feedback", desc: "Inputs from alumni on the long-term impact of their MLRIT education on career growth and professional development." },
          { id: "employer-feedback", tag: "Employers", title: "Employer Feedback", desc: "Annual feedback from recruiting organisations on graduate competency, workplace readiness and industry-alignment of MLRIT programmes." },
        ],
      },
    ],
  },

  'iqac/contact': {
    label: "IQAC — Contact details",
    fields: [
      {
        name: "details",
        label: "Contact details",
        type: 'repeater',
        itemFields: [
          { name: "label", label: "Label" },
          { name: "value", label: "Value" },
        ],
        defaultItems: [
          { id: "head-iqac", label: "Head IQAC", value: "Dr. Radhika Devi V — Director & Dean H&S" },
          { id: "phone", label: "Phone", value: "+91-40-2304 4444" },
          { id: "email", label: "Email", value: "iqac@mlrit.ac.in" },
          { id: "address", label: "Address", value: "IQAC Office, MLRIT, Dundigal, Hyderabad – 500 043, Telangana, India" },
          { id: "office-hours", label: "Office Hours", value: "Monday – Saturday, 9:00 AM – 5:00 PM" },
        ],
      },
    ],
  },

  // NBA accreditation table — the cycle and status move every few years.
  'iqac/nba': {
    label: 'IQAC — NBA accredited programmes',
    fields: [
      {
        name: 'programmes',
        label: 'Accredited programmes',
        type: 'repeater',
        itemFields: [
          { name: 'dept', label: 'Department' },
          { name: 'code', label: 'Code' },
          { name: 'cycle', label: 'Cycle' },
          { name: 'status', label: 'Status' },
          { name: 'dcp', label: 'DCP report link' },
        ],
        defaultItems: [
          { id: "cse", dept: "Computer Science & Engineering", code: "CSE", cycle: "2022–2025", status: "Accredited", dcp: "/iqac/dcp-cse.pdf" },
          { id: "ece", dept: "Electronics & Communication", code: "ECE", cycle: "2022–2025", status: "Accredited", dcp: "/iqac/dcp-ece.pdf" },
          { id: "mech", dept: "Mechanical Engineering", code: "MECH", cycle: "2022–2025", status: "Accredited", dcp: "/iqac/dcp-mech.pdf" },
          { id: "aero", dept: "Aeronautical Engineering", code: "AERO", cycle: "2022–2025", status: "Accredited", dcp: "/iqac/dcp-aero.pdf" },
          { id: "ds", dept: "CSE — Data Science", code: "DS", cycle: "2022–2025", status: "Accredited", dcp: "/iqac/dcp-ds.pdf" },
          { id: "aiml", dept: "CSE — AI & Machine Learning", code: "AIML", cycle: "2022–2025", status: "Accredited", dcp: "/iqac/dcp-aiml.pdf" },
        ],
      },
    ],
  },

  // The shared chapter-cover hero, on every secondary page. Keyed by route
  // path: PageHeader reads its own path, so adding a page here needs no change
  // at the call site.
  //
  // Dynamic routes (faculty/[slug], syllabus) are deliberately absent — their
  // headers come from the record being shown, not from fixed copy.
  'site/page-headers': {
    label: 'Page headers',
    fields: [
      {
        name: 'headers',
        label: 'Headers by page',
        type: 'repeater',
        itemFields: [
          { name: 'path', label: 'Route (do not change)' },
          { name: 'eyebrow', label: 'Eyebrow' },
          { name: 'title', label: 'Title' },
          { name: 'italic', label: 'Title italic tail' },
          { name: 'dek', label: 'Sub-headline' },
        ],
        defaultItems: [
          {
            id: "about-internal-governance",
            path: "/about/internal-governance",
            eyebrow: "About MLRIT",
            title: "Internal",
            italic: "Governance.",
            dek: "The leadership team and institutional governance structure of MLR Institute of Technology.",
          },
          {
            id: "about-legacy",
            path: "/about/legacy",
            eyebrow: "Legacy",
            title: "Founding",
            italic: "voices.",
            dek: "Messages from the Founder and Chairman of MLRIT — the vision and values that have guided the institution since 2005.",
          },
          {
            id: "about",
            path: "/about",
            eyebrow: "About MLRIT",
            title: "Twenty years of",
            italic: "building engineers.",
            dek: "MLR Institute of Technology — Dundigal, Hyderabad. An autonomous, JNTUH-affiliated, AICTE-approved engineering institution founded in 2005 by the KMR Educational Society.",
          },
          {
            id: "about-rankings-awards",
            path: "/about/rankings-awards",
            eyebrow: "Rankings & Awards",
            title: "Recognised",
            italic: "nationally.",
            dek: "The accreditations, rankings and institutional achievements that benchmark MLRIT's twenty years of quality engineering education.",
          },
          {
            id: "about-timeline",
            path: "/about/timeline",
            eyebrow: "Timeline",
            title: "Two decades in",
            italic: "eight moments.",
            dek: "From the foundation stone in 2005 to a nationally accredited institution — the institutional milestones that shaped MLRIT.",
          },
          {
            id: "about-vision-mission-vision-mission",
            path: "/about/vision-mission/vision-mission",
            eyebrow: "Vision & Mission",
            title: "What we",
            italic: "stand for.",
            dek: "The guiding principles that shape every academic, research and institutional decision at MLRIT.",
          },
          {
            id: "academics",
            path: "/academics",
            eyebrow: "Academics",
            title: "Education that",
            italic: "adapts faster than industry.",
            dek: "An autonomous, outcome-based, research-led academic system. Ten engineering branches at the undergraduate level, four M.Tech specialisations, an MBA programme, and doctoral research across five disciplines.",
          },
          {
            id: "admissions-by-degree",
            path: "/admissions/by-degree",
            eyebrow: "Programmes",
            title: "Find your",
            italic: "perfect programme.",
            dek: "From core engineering to next-gen specialisations, MLRIT offers 15 programmes designed for the jobs of tomorrow.",
          },
          {
            id: "admissions-counselling",
            path: "/admissions/counselling",
            eyebrow: "Counselling",
            title: "Admission process &",
            italic: "counselling guide.",
            dek: "Everything you need to know about web counselling, required documents and important dates for joining MLRIT.",
          },
          {
            id: "admissions-fees",
            path: "/admissions/fees",
            eyebrow: "Fee Structure 2025–26",
            title: "Transparent &",
            italic: "competitive fees.",
            dek: "MLRIT offers quality education at accessible fee levels. Fee structure is approved by the Telangana Fee Regulation Committee (TSFRC) / APSCHE.",
          },
          {
            id: "admissions-policies",
            path: "/admissions/policies",
            eyebrow: "Policies",
            title: "Institutional policies &",
            italic: "student rights.",
            dek: "Transparency and fairness define MLRIT's institutional framework. Our policies are aligned with UGC, AICTE and state regulatory guidelines.",
          },
          {
            id: "admissions-scholarships",
            path: "/admissions/scholarships",
            eyebrow: "Financial Support",
            title: "Scholarships &",
            italic: "fee support.",
            dek: "MLRIT believes financial constraints should never stand between talent and opportunity. Explore our merit-based, sports and government-linked scholarship programmes.",
          },
          {
            id: "admissions-support",
            path: "/admissions/support",
            eyebrow: "Admissions Support",
            title: "We're here",
            italic: "to help.",
            dek: "Find answers to the most common admissions questions, or reach out to our team directly.",
          },
          {
            id: "admissions-why-mlrit",
            path: "/admissions/why-mlrit",
            eyebrow: "Why MLRIT",
            title: "More than a degree —",
            italic: "a launchpad.",
            dek: "MLRIT isn't just where you earn a degree — it's where you find your direction, your people, and your future.",
          },
          {
            id: "departments-pg",
            path: "/departments/pg",
            eyebrow: "M.Tech & MBA",
            title: "Postgraduate",
            italic: "programmes.",
            dek: "Two-year M.Tech specialisations and a two-year MBA — research-led, industry-anchored, designed for postgraduate growth.",
          },
          {
            id: "departments-ug",
            path: "/departments/ug",
            eyebrow: "B.Tech Programmes",
            title: "Undergraduate",
            italic: "programmes.",
            dek: "A four-year B.Tech across seven engineering branches, built on a shared first-year foundation — with an industry-integrated curriculum, hands-on labs and a culture of inquiry.",
          },
          {
            id: "iqac-aqar",
            path: "/iqac/aqar",
            eyebrow: "IQAC",
            title: "Annual Quality",
            italic: "Assurance Reports.",
            dek: "AQAR — Annual Quality Assurance Reports submitted by MLRIT to NAAC as part of the institutional accreditation cycle, documenting quality initiatives, outcomes and improvements each academic year.",
          },
          {
            id: "iqac-best-practices",
            path: "/iqac/best-practices",
            eyebrow: "IQAC",
            title: "Best Practices",
            italic: "",
            dek: "Institutional best practices adopted at MLRIT that reflect commitment to quality, innovation and holistic student development.",
          },
          {
            id: "iqac-composition",
            path: "/iqac/composition",
            eyebrow: "IQAC",
            title: "IQAC Composition",
            italic: "",
            dek: "The cell brings together institutional leadership, management, faculty, external stakeholders, and alumni to ensure comprehensive quality oversight and continuous improvement.",
          },
          {
            id: "iqac-contact",
            path: "/iqac/contact",
            eyebrow: "IQAC",
            title: "Contact IQAC",
            italic: "",
            dek: "Reach out to the IQAC office for queries on accreditation, quality assurance reports, feedback forms or any IQAC activities.",
          },
          {
            id: "iqac-feedback",
            path: "/iqac/feedback",
            eyebrow: "IQAC",
            title: "Feedback",
            italic: "",
            dek: "IQAC collects and analyses feedback from all stakeholders — students, faculty, employers and alumni — to drive continuous improvement.",
          },
          {
            id: "iqac-functions",
            path: "/iqac/functions",
            eyebrow: "IQAC",
            title: "Functions",
            italic: "",
            dek: "The IQAC performs key functions to ensure continuous quality enhancement across academic and administrative activities at MLR Institute of Technology (Autonomous).",
          },
          {
            id: "iqac-initiatives",
            path: "/iqac/initiatives",
            eyebrow: "IQAC",
            title: "Quality Initiatives",
            italic: "",
            dek: "IQAC actively coordinates institutional initiatives across seventeen focus areas to promote and sustain quality in academic and administrative activities at MLR Institute of Technology (Autonomous).",
          },
          {
            id: "iqac-naac",
            path: "/iqac/naac",
            eyebrow: "Accreditation",
            title: "NAAC",
            italic: "at MLRIT",
            dek: "National Assessment and Accreditation Council — MLRIT's institutional accreditation, self-study reports and assessment cycle artefacts.",
          },
          {
            id: "iqac-nba",
            path: "/iqac/nba",
            eyebrow: "Accreditation",
            title: "NBA — Programme",
            italic: "accreditation.",
            dek: "National Board of Accreditation — programme-level accreditation for engineering branches at MLR Institute of Technology, validating outcome-based education quality.",
          },
          {
            id: "iqac-objectives",
            path: "/iqac/objectives",
            eyebrow: "IQAC",
            title: "Objectives",
            italic: "",
            dek: "The IQAC of MLR Institute of Technology (Autonomous) is committed to fostering a culture of quality, innovation, and continuous improvement through ten strategic goals that guide all institutional activities.",
          },
          {
            id: "iqac",
            path: "/iqac",
            eyebrow: "Quality Assurance",
            title: "Internal Quality Assurance Cell (IQAC)",
            italic: "",
            dek: "The IQAC of MLR Institute of Technology (Autonomous) functions as the central quality assurance and enhancement body — fostering a culture of quality, innovation, and continuous improvement across all academic and administrative activities.",
          },
          {
            id: "iqac-reports",
            path: "/iqac/reports",
            eyebrow: "IQAC",
            title: "Reports & Documents",
            italic: "",
            dek: "Access IQAC reports, governance documents, policies, AQAR submissions and accreditation records.",
          },
          {
            id: "iqac-support",
            path: "/iqac/support",
            eyebrow: "IQAC Support",
            title: "Quality Assurance",
            italic: "Office.",
            dek: "Reach the IQAC office for accreditation queries, AQAR submissions and NBA documentation.",
          },
          {
            id: "placements-alumni",
            path: "/placements/alumni",
            eyebrow: "Placements",
            title: "Alumni",
            italic: "worldwide.",
            dek: "7,000+ MLRIT alumni working at leading MNCs and startups across the globe.",
          },
          {
            id: "placements-global-certification",
            path: "/placements/global-certification",
            eyebrow: "Placements",
            title: "Global",
            italic: "certifications.",
            dek: "AWS, Google, Microsoft, Cisco and NPTEL certifications embedded directly into the MLRIT curriculum.",
          },
          {
            id: "placements-industry-readiness",
            path: "/placements/industry-readiness",
            eyebrow: "Placements",
            title: "Industry",
            italic: "readiness.",
            dek: "The training pipeline that takes first-years to placement-ready seniors — aptitude, communication, and domain expertise.",
          },
          {
            id: "placements-mous",
            path: "/placements/mous",
            eyebrow: "Placements",
            title: "MoUs &",
            italic: "partnerships.",
            dek: "Formal industry engagements and Centres of Excellence powering hands-on learning at MLRIT.",
          },
          {
            id: "placements-statistics",
            path: "/placements/statistics",
            eyebrow: "Placements",
            title: "Year-wise",
            italic: "statistics.",
            dek: "Verified placement outcomes year on year — offers, packages, and company participation from our campus recruitment seasons.",
          },
          {
            id: "placements-support",
            path: "/placements/support",
            eyebrow: "Placements",
            title: "Contact",
            italic: "T&P Cell.",
            dek: "Recruiter enquiries, campus drive requests and corporate connect — reach the Training & Placement Cell directly.",
          },
          {
            id: "student-life-facilities",
            path: "/student-life/facilities",
            eyebrow: "Campus · Life",
            title: "Facilities &",
            italic: "Amenities",
            dek: "A solar-powered, 31-acre green campus built around student life — with every daily need within walking distance.",
          },
        ],
      },
    ],
  },

  // Secondary pages rendered by InfoPageRenderer — About, Admissions, Campus,
  // Student Life. One list keyed by slug rather than a section per page: the
  // fields are identical for all of them, and 17 near-empty configs would be
  // 17 places to keep in sync.
  //
  // Header copy only. `blocks` is a 20-kind discriminated union and needs a
  // real block editor to be safely editable; the bundled blocks still render.
  'info/pages': {
    label: 'Info pages — headers',
    fields: [
      {
        name: 'pages',
        label: 'Pages',
        type: 'repeater',
        itemFields: [
          { name: 'slug', label: 'Page (do not change)' },
          { name: 'eyebrow', label: 'Eyebrow' },
          { name: 'title', label: 'Title' },
          { name: 'italic', label: 'Title italic tail' },
          { name: 'dek', label: 'Sub-headline' },
        ],
        defaultItems: [
          {
            id: "about-vision-mission-introduction",
            slug: "about/vision-mission/introduction",
            eyebrow: "About MLRIT",
            title: "Built Beyond",
            italic: "Classrooms",
            dek: "Since 2005, MLR Institute of Technology has been shaping engineers, thinkers, and leaders — through academics, innovation, and the culture of a campus that never stops growing.",
          },
          {
            id: "about-vision-mission-vision-mission",
            slug: "about/vision-mission/vision-mission",
            eyebrow: "Our Purpose",
            title: "Vision &",
            italic: "Mission",
            dek: "The foundational beliefs that guide every decision, programme, and experience at MLR Institute of Technology.",
          },
          {
            id: "about-legacy",
            slug: "about/legacy",
            eyebrow: "Two Decades",
            title: "The MLRIT",
            italic: "Legacy",
            dek: "From a single campus in Dundigal to a nationally recognised institution — a timeline of milestones and the leadership that built them.",
          },
          {
            id: "about-rankings-awards",
            slug: "about/rankings-awards",
            eyebrow: "Recognition",
            title: "Rankings &",
            italic: "Awards",
            dek: "National rankings, institutional accreditations, research achievements, and recognitions that reflect the quality MLRIT delivers.",
          },
          {
            id: "about-brochure",
            slug: "about/brochure",
            eyebrow: "Official Brochure",
            title: "Everything about MLRIT,",
            italic: "in one document",
            dek: "Programmes, campus life, research, sports, facilities, admissions — the complete MLRIT story, ready to download.",
          },
          {
            id: "about-messages-principal",
            slug: "about/messages/principal",
            eyebrow: "About · Messages",
            title: "",
            italic: "message.",
            dek: "From the desk of the Principal, MLR Institute of Technology.",
          },
          {
            id: "about-messages-dean",
            slug: "about/messages/dean",
            eyebrow: "About · Messages",
            title: "",
            italic: "message.",
            dek: "From the desk of the Director, MLR Institute of Technology.",
          },
          {
            id: "admissions-how-to-apply",
            slug: "admissions/how-to-apply",
            eyebrow: "Admissions",
            title: "How to",
            italic: "apply.",
            dek: "A step-by-step guide to applying to MLRIT — across B.Tech, M.Tech and MBA programmes. Source: mlrit.ac.in/admissions/.",
          },
          {
            id: "admissions-eligibility",
            slug: "admissions/eligibility",
            eyebrow: "Admissions",
            title: "Eligibility",
            italic: "criteria.",
            dek: "Programme-wise eligibility requirements for B.Tech, M.Tech and MBA admissions at MLRIT. Source: mlrit.ac.in/admissions/.",
          },
          {
            id: "admissions-fee-structure",
            slug: "admissions/fee-structure",
            eyebrow: "Admissions",
            title: "Fee",
            italic: "structure.",
            dek: "Annual fee structure across UG and PG programmes at MLRIT for 2025–26. Source: mlrit.ac.in/admissions/.",
          },
          {
            id: "admissions-scholarships",
            slug: "admissions/scholarships",
            eyebrow: "Admissions",
            title: "Scholarships",
            italic: "and aid.",
            dek: "State, central and institute-level scholarships available to MLRIT students.",
          },
          {
            id: "campus-hostels",
            slug: "campus/hostels",
            eyebrow: "Campus · Life",
            title: "Hostels",
            italic: "on campus.",
            dek: "Home away from home — purpose-built residential blocks for boys and girls, steps from the academic campus, for 1,650+ students.",
          },
          {
            id: "campus-sports",
            slug: "campus/sports",
            eyebrow: "Campus · Life",
            title: "Sports",
            italic: "at MLRIT.",
            dek: "World-class indoor and outdoor sports infrastructure, resident coaching staff, and a legacy of champions — cricket, volleyball, football, basketball, badminton and table tennis.",
          },
          {
            id: "campus-cafeteria",
            slug: "campus/cafeteria",
            eyebrow: "Campus · Life",
            title: "Cafeteria",
            italic: "& food.",
            dek: "Multiple food courts and a central cafeteria — affordable, hygienic, and open all day.",
          },
          {
            id: "campus-transport",
            slug: "campus/transport",
            eyebrow: "Campus · Life",
            title: "Transport",
            italic: "services.",
            dek: "Institute-operated buses across 40+ routes covering Hyderabad — punctual, safe, GPS-tracked.",
          },
          {
            id: "campus-clubs",
            slug: "campus/clubs",
            eyebrow: "Campus · Life",
            title: "Clubs and",
            italic: "societies.",
            dek: "From robotics and coding to dance, drama and debate — student-led clubs that build community.",
          },
          {
            id: "student-life-facilities",
            slug: "student-life/facilities",
            eyebrow: "Campus · Life",
            title: "Facilities &",
            italic: "Amenities",
            dek: "A campus built for the complete student — 26,000 sq ft indoor stadium, dual hostels, a central cafeteria, 27 bus routes, and over 30 active student clubs.",
          },
        ],
      },
    ],
  },

  // Footer — shown on every page, so it lives under its own `site` slug rather
  // than `home`. The Useful Links accordion is deliberately not here: it is a
  // nested structure a flat list cannot express, and it changes rarely.
  'site/footer': {
    label: 'Site — Footer',
    fields: [
      {
        name: 'links',
        label: 'Navigation links',
        type: 'repeater',
        // Flat, with `head` naming the column. Rows are grouped by head in
        // render order, so reordering rows moves both links and columns
        // without needing a nested editor.
        itemFields: [
          { name: 'head', label: 'Column' },
          { name: 'label', label: 'Label' },
          { name: 'href', label: 'Link' },
          { name: 'external', label: 'Opens in new tab (yes / blank)' },
        ],
        defaultItems: [
          { id: "about-about-mlrit-0", head: "About", label: "About MLRIT", href: "/about", external: "" },
          { id: "about-vision-mission-1", head: "About", label: "Vision & Mission", href: "/about/vision-mission/vision-mission", external: "" },
          { id: "about-legacy-2", head: "About", label: "Legacy", href: "/about/legacy", external: "" },
          { id: "about-rankings-awards-3", head: "About", label: "Rankings & Awards", href: "/about/rankings-awards", external: "" },
          { id: "about-internal-governance-4", head: "About", label: "Internal Governance", href: "/about/internal-governance", external: "" },
          { id: "admissions-overview-5", head: "Admissions", label: "Overview", href: "/admissions", external: "" },
          { id: "admissions-counselling-6", head: "Admissions", label: "Counselling", href: "/admissions/counselling", external: "" },
          { id: "admissions-scholarships-7", head: "Admissions", label: "Scholarships", href: "/admissions/scholarships", external: "" },
          { id: "admissions-fee-structure-8", head: "Admissions", label: "Fee Structure", href: "/admissions/fees", external: "" },
          { id: "admissions-why-mlrit-9", head: "Admissions", label: "Why MLRIT", href: "/admissions/why-mlrit", external: "" },
          { id: "examinations-overview-10", head: "Examinations", label: "Overview", href: "/examinations", external: "" },
          { id: "examinations-timetable-11", head: "Examinations", label: "Timetable", href: "/examinations/timetable", external: "" },
          { id: "examinations-regulations-12", head: "Examinations", label: "Regulations", href: "/examinations/regulations", external: "" },
          { id: "examinations-aqar-13", head: "Examinations", label: "AQAR", href: "/iqac/aqar", external: "" },
          { id: "follow-us-linkedin-14", head: "Follow Us", label: "LinkedIn", href: "https://www.linkedin.com/school/mlr-institute-of-technology/", external: "yes" },
          { id: "follow-us-instagram-15", head: "Follow Us", label: "Instagram", href: "https://www.instagram.com/mlritofficial/", external: "yes" },
          { id: "follow-us-facebook-16", head: "Follow Us", label: "Facebook", href: "https://www.facebook.com/Mlrit/", external: "yes" },
          { id: "follow-us-x-com-17", head: "Follow Us", label: "X.com", href: "https://x.com/mlritin", external: "yes" },
          { id: "follow-us-youtube-18", head: "Follow Us", label: "YouTube", href: "https://www.youtube.com/channel/UCAfZfemyTCM-965RZy6QiGA", external: "yes" },
        ],
      },
      {
        name: 'logos',
        label: 'Accreditation logos',
        type: 'gallery',
        itemFields: [{ name: 'name', label: 'Alt text' }],
        defaultItems: [
          { id: 'naac', key: '/legacy/nirf/naac.svg', name: 'NAAC' },
          { id: 'aicte', key: '/legacy/nirf/aicte.svg', name: 'AICTE' },
          { id: 'nba', key: '/legacy/nirf/nba.svg', name: 'NBA' },
        ],
      },
      { name: 'watermark', label: 'Watermark word', defaultValue: 'MLRIT' },
      { name: 'craftedLead', label: 'Crafted line — lead', defaultValue: 'Crafted with passion by ' },
      { name: 'craftedName', label: 'Crafted line — name', defaultValue: 'The Students' },
      { name: 'craftedTail', label: 'Crafted line — tail', defaultValue: ' of MLRIT' },
      { name: 'copyright', label: 'Copyright', defaultValue: '\u00a9 2026 KMR Educational Society' },
      {
        name: 'badges',
        label: 'Legal badges',
        type: 'repeater',
        itemFields: [{ name: 'label', label: 'Label' }],
        defaultItems: [
          { id: 'jntuh', label: 'Affiliated to JNTUH' },
          { id: 'aicte', label: 'Approved by AICTE' },
        ],
      },
      { name: 'disclosuresLabel', label: 'Disclosures link label', defaultValue: 'Disclosures' },
      {
        name: 'disclosuresHref',
        label: 'Disclosures link URL',
        defaultValue: 'https://mlrit.ac.in/mandatory-disclosures/',
      },
    ],
  },

} as const;

export type SectionKey = keyof typeof CONTENT_SECTIONS;

export type FieldType = 'text' | 'multiline' | 'image' | 'video' | 'gallery' | 'repeater';

/** Per-item metadata a gallery may collect alongside each image. */
export type GalleryItemField = 'name' | 'title' | 'linkUrl' | 'active' | 'startDate' | 'endDate';

/**
 * One column of a repeater row. Unlike a gallery's itemFields — a fixed set of
 * known metadata names — a repeater declares its own shape, because the rows
 * are the content rather than annotations on an uploaded image.
 */
export type RepeaterItemField = {
  readonly name: string;
  readonly label: string;
  /**
   * `image`/`video` turn the column into its own upload slot, so one gallery
   * row can carry several files — an event slide needs a logo, a clip and a
   * poster, which a single `key` cannot express.
   */
  readonly type?: 'text' | 'number' | 'image' | 'video';
};

/** Columns that hold an uploaded asset key rather than typed text. */
export const isMediaColumn = (column: RepeaterItemField): boolean =>
  column.type === 'image' || column.type === 'video';

export type FieldConfig = {
  readonly name: string;
  readonly label: string;
  readonly type?: FieldType;
  /** Legacy shorthand for `type: 'multiline'`; existing configs still use it. */
  readonly multiline?: boolean;
  /**
   * List fields only. For a gallery: which metadata inputs each item gets, as
   * names from the fixed GalleryItemField set (omit for a plain list of images
   * with no per-item fields). For a repeater: the row's columns, declared
   * inline because a repeater defines its own shape.
   *
   * Read through galleryItemFields()/repeaterItemFields() rather than directly
   * — those narrow the union by the element kind actually present.
   */
  readonly itemFields?: readonly GalleryItemField[] | readonly RepeaterItemField[];
  /**
   * List fields only. How many items the consuming component can actually
   * render. Extras are kept in the data but never displayed, so the editor
   * warns rather than letting someone add rows that silently vanish. Omit when
   * the list has no fixed limit.
   */
  readonly maxItems?: number;
  /**
   * Gallery only. What the item's primary `key` accepts. Defaults to images;
   * `video` makes the gallery a list of clips, which is what the testimonial
   * and event carousels hold.
   */
  readonly accept?: 'image' | 'video';
  /**
   * Gallery only. Seeds the EDITOR when nothing has been saved yet, so a
   * section that currently ships hardcoded assets opens with those assets as
   * real, editable rows instead of an empty list.
   *
   * These are never written to the database on load — only an explicit Save
   * persists them. That matters: the public components treat an empty stored
   * gallery as "use my bundled fallback", and auto-saving defaults would
   * quietly convert every section from fallback-driven to CMS-driven.
   */
  readonly defaultItems?: readonly GalleryItem[] | readonly RepeaterItem[];
  /**
   * Text fields only. Seeds the EDITOR when nothing has been saved yet, the
   * same contract defaultItems gives lists: the form opens showing the copy
   * the component currently renders, as editable text.
   *
   * Never written to the database on load — only an explicit Save persists it.
   * Without this a required text field opens blank, which both hides the live
   * copy and makes the section unsavable until every field is retyped.
   */
  readonly defaultValue?: string;
};

/**
 * One gallery entry. `id` is minted client-side on add and never changes, so it
 * survives reordering and is safe as a React key; `key` is the storage key (or,
 * briefly, a local object URL while the upload is in flight).
 */
export type GalleryItem = {
  id: string;
  key: string;
  name?: string;
  title?: string;
  linkUrl?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  /** Extra columns declared by the field's itemFields, text or media keys. */
  [column: string]: string | number | boolean | undefined;
};

/**
 * One repeater row. `id` is minted client-side on add and never changes, so it
 * survives reordering and is safe as a React key; every other key is a column
 * declared by the field's itemFields.
 *
 * Number columns are stored as numbers, but a row that has been through a
 * text input can hold the string form — consumers coerce rather than trust.
 */
export type RepeaterItem = {
  id: string;
  [column: string]: string | number | undefined;
};

/** Resolved field type — `type` wins, then the `multiline` shorthand, then text. */
export const fieldType = (field: FieldConfig): FieldType =>
  field.type ?? (field.multiline ? 'multiline' : 'text');

/**
 * Media fields hold an uploaded asset key and are optional: a section with no
 * uploaded file falls back to whatever the component hardcodes. Only the text
 * fields are required on save.
 */
export const isMediaField = (field: FieldConfig): boolean => {
  const type = fieldType(field);
  return type === 'image' || type === 'video' || type === 'gallery';
};

/** What a gallery item's primary key accepts — images unless stated. */
export const galleryAccept = (field: FieldConfig): 'image' | 'video' =>
  field.accept ?? 'image';

/** Gallery fields hold an array of items rather than a single string value. */
export const isGalleryField = (field: FieldConfig): boolean => fieldType(field) === 'gallery';

/** Repeater fields hold an array of structured rows — text-first, no uploads. */
export const isRepeaterField = (field: FieldConfig): boolean => fieldType(field) === 'repeater';

/** Either kind of list field: stored as an array, never as a string. */
export const isListField = (field: FieldConfig): boolean =>
  isGalleryField(field) || isRepeaterField(field);

/**
 * Whether a save must reject this field when it is blank.
 *
 * Media is optional (no upload => the component's bundled asset), and so is a
 * repeater (no rows => the component's bundled array). Only plain text fields
 * are required, which is what keeps a repeater-only section savable at all.
 */
export const isRequiredField = (field: FieldConfig): boolean =>
  !isMediaField(field) && !isRepeaterField(field);

/**
 * The gallery metadata names on a field, ignoring repeater column objects.
 * Filtering by element kind rather than casting keeps a mis-declared config
 * from reaching the editor as a malformed input.
 */
export const galleryItemFields = (field: FieldConfig): readonly GalleryItemField[] =>
  (field.itemFields ?? []).filter(
    (item): item is GalleryItemField => typeof item === 'string'
  );

/** The repeater columns on a field, ignoring gallery metadata names. */
export const repeaterItemFields = (field: FieldConfig): readonly RepeaterItemField[] =>
  (field.itemFields ?? []).filter(
    (item): item is RepeaterItemField => typeof item === 'object' && item !== null
  );

/** Narrows an unknown stored value to repeater rows, discarding malformed ones. */
export const asRepeaterItems = (value: unknown): RepeaterItem[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is RepeaterItem =>
      typeof item === 'object' &&
      item !== null &&
      !Array.isArray(item) &&
      typeof (item as RepeaterItem).id === 'string'
  );
};

/**
 * A repeater column read as a number, for the counter targets.
 *
 * Accepts the number itself and the string an <input type="number"> produces;
 * anything unusable yields the fallback so a half-typed row renders the
 * component's own value rather than NaN.
 *
 * Blank is checked before parsing, and that is the whole point: Number('') is
 * 0, and 0 is finite, so an absent or empty value used to sail through as a
 * legitimate zero and the fallback never ran. That is how a headline figure
 * with nothing saved rendered as "0 LPA".
 */
export const asNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;

  const text = String(value ?? '').trim();
  if (text === '') return fallback;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** A repeater column read as a trimmed string. */
export const asText = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;

/** Narrows an unknown stored value to gallery items, discarding malformed ones. */
export const asGalleryItems = (value: unknown): GalleryItem[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is GalleryItem =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as GalleryItem).id === 'string' &&
      typeof (item as GalleryItem).key === 'string'
  );
};

/** Field config for a page/section pair, or null when it is not editable. */
export function getSectionConfig(
  page: string,
  section: string
): { label: string; fields: readonly FieldConfig[] } | null {
  const key = `${page}/${section}`;
  if (!Object.prototype.hasOwnProperty.call(CONTENT_SECTIONS, key)) return null;
  return CONTENT_SECTIONS[key as SectionKey];
}
