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
 */
export const asNumber = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').trim());
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
