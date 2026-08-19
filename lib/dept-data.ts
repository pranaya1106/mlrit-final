// Extracted from legacy/departments/*.html.
// This is the source of truth for the dynamic /departments/[slug] route.
// Photos reference /public/faculty/<slug>/<file>; photos are only emitted
// where the file is known to exist locally.

export type FacultyMember = {
  name: string;
  role: string;
  specialization?: string;
  photo?: string;
};

export type Lab = { name: string; desc: string };

export type Publication = { title: string; authors: string; journal: string; year: string };
export type HonourEntry = { year: string; name: string; achievement: string; score: string };
export type InternshipEntry = { company: string; type: string; students: string; year: string };
export type StatItem = { label: string; value: string };
export type MouEntry = { name: string; domain: string };

export type DeptData = {
  vision: string;
  mission: string[];
  history: string;
  /** Year-wise student intake, oldest to newest. MOCK DATA pending real figures. */
  intakeGrowth?: { year: string; students: number }[];
  introduction: string;
  hodMessage: string;
  teachingMethodology: string;
  peos: { id: string; text: string }[];
  labs: Lab[];
  faculty: FacultyMember[];
  studentAchievements: { title: string; desc: string }[];
  rollOfHonour?: HonourEntry[];
  publications?: Publication[];
  publicationsNote?: string;
  placementStats?: StatItem[];
  placementNote?: string;
  internStats?: StatItem[];
  internships?: InternshipEntry[];
  internList?: string[];
  internNote?: string;
  mous?: MouEntry[];
  mouNote?: string;
  committees?: { name: string; members?: string[] }[];
  /** Optional subject-wise filter for the Faculty Profiles tab, keyed by faculty slug. */
  facultySubjects?: Record<string, string>;
};

export const DEPT_DATA: Record<string, DeptData> = {
  // ═══════════════════════════════════════════════════════════════
  // CSE
  // ═══════════════════════════════════════════════════════════════
  cse: {
    vision:
      'Promote Innovation-centric education to produce globally competent graduates in Computer Science and Engineering education and research capable of building a strong and developed nation.',
    mission: [
      'Strengthen the department interaction with Multi National Companies to enhance graduate technological advancement skills and research capabilities.',
      'Deliver an industry-aligned curriculum spanning AI, systems, web and cybersecurity through outcome-based education.',
      'Operate well-resourced laboratories in DSA, AI/ML, cloud and operating systems to support hands-on learning.',
    ],
    history:
      'The Department of Computer Science and Engineering was established in 2005 with an initial intake of 60 students. The intake was progressively increased — 120 in 2007, 180 in 2012, 240 in 2013, and 840 in 2024. An additional 10% seats are available under the lateral entry scheme. The M.Tech programme in CSE commenced in 2011 with an intake of 6. The B.Tech (CSE) program has been accredited by the National Board of Accreditation (NBA) since 2008.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 120 },
      { year: '2019', students: 180 },
      { year: '2020', students: 240 },
      { year: '2021', students: 300 },
      { year: '2022', students: 360 },
      { year: '2023', students: 420 },
      { year: '2024', students: 480 },
      { year: '2025', students: 540 },
    ],
    introduction:
      'The Department of Computer Science and Engineering at MLRIT is one of the institute\'s flagship departments, established in 2005. With 64 dedicated faculty, 12 advanced laboratories and industry partnerships with Boeing, Cyient and EPAM Systems, the department blends rigorous theoretical foundations with hands-on experience in cutting-edge technologies — preparing students to excel in the ever-evolving technology landscape.',
    hodMessage:
      'Our department is committed to providing world-class education blending strong theoretical foundations with hands-on experience in cutting-edge technologies. With 64 dedicated faculty, 12 advanced laboratories, and industry partnerships with Boeing, Cyient, and EPAM Systems, we prepare students to excel in the ever-evolving technology landscape.',
    teachingMethodology:
      'The department follows an active learning pedagogy integrating project-based learning, flipped classrooms, and industry-mentored hackathons. Regular guest lectures from professionals at Google, Microsoft, Qualcomm, and ISRO complement the curriculum. Students participate in coding boot camps, open-source contributions, and inter-college technical competitions to build practical skills beyond the classroom.',
    peos: [
      { id: 'PEO 1', text: 'Graduates will have a globally competent professional career in the software industry.' },
      { id: 'PEO 2', text: 'Graduates will pursue higher education and research.' },
      { id: 'PEO 3', text: 'Graduates will have entrepreneur skills to solve societal problems.' },
    ],
    labs: [
      { name: 'Case Tools and Web Technologies Lab', desc: '69 systems — Software design tools, web development' },
      { name: 'Data Structures and Web Services Lab', desc: '30 systems — M.Tech data structures and web services' },
      { name: 'Cryptography and Network Security Lab', desc: '30 systems — Encryption, network protection' },
      { name: 'Mobile Application Development Lab', desc: '36 systems — Android Studio, Flutter' },
      { name: 'Operating Systems Lab', desc: '60 systems — OS concepts, Linux' },
      { name: 'Java Programming Lab', desc: '60 systems — JDK, enterprise Java' },
      { name: 'Cloud Computing Lab', desc: '30 systems — AWS, virtualization' },
      { name: 'Linux Programming Lab', desc: '30 systems — System programming' },
      { name: 'Project Work Lab', desc: '60 systems — Final year projects' },
      { name: 'Object Oriented Programming Lab', desc: '36 systems — C++, OOP' },
      { name: 'Data Mining and Warehousing Lab', desc: '30 systems — Informatica, Weka' },
      { name: 'Database Management Systems Lab', desc: '36 systems — SQL, Oracle' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'Engineering Project Expo', desc: 'Organised by the IEEE student branch, showcasing innovative final-year projects across AI, IoT and embedded systems domains with participation from 15+ colleges.' },
      { title: 'Technical Quiz, EPICS / Micro Projects', desc: 'Inter-departmental technical quiz and EPICS-based micro project competitions held annually, encouraging hands-on problem solving and rapid prototyping skills.' },
      { title: 'Student Mini Projects Expo / Technical Seminars', desc: 'Department-level expo for 2nd and 3rd year students presenting mini projects, complemented by technical seminars from industry professionals and alumni.' },
      { title: 'CSI Student Chapter Activities', desc: 'Active CSI student chapter conducts workshops, coding competitions and tech talks throughout the academic year.' },
      { title: 'SWAYAM / NPTEL Certifications', desc: 'Department recognised as NPTEL Discipline Star with 140+ faculty and student certifications in a single semester.' },
    ],
    rollOfHonour: [
      { year: '2013', name: 'Sheekha Singh', achievement: 'University Topper', score: '86%' },
      { year: '2015', name: 'V. Bhavana', achievement: 'University Rank Holder', score: '84%' },
      { year: '2011', name: 'Pankaj Agarwal', achievement: 'University Rank Holder', score: '84%' },
      { year: '2012', name: 'S. Geetha Veera Lakshmi', achievement: 'Department Topper', score: '81%' },
      { year: '2014', name: 'M. Mounika', achievement: 'Department Topper', score: '81%' },
      { year: '2016', name: 'Hari Priya D S', achievement: 'Department Topper', score: '80.82%' },
      { year: '2018', name: 'Nallagari Sravani', achievement: 'Department Topper', score: '79.12%' },
    ],
    publications: [
      { title: 'Deep Learning-based Intrusion Detection System for IoT Networks', authors: 'Dr. K. Srinivas Rao, A. Naveen Kumar, P. Ravi Teja', journal: 'IEEE Internet of Things Journal, Vol. 11, Issue 4', year: '2024' },
      { title: 'Optimised Feature Selection for Medical Image Classification using CNN', authors: 'Dr. N. Sirisha, M. Lavanya, S. Preethi', journal: 'Journal of Biomedical Informatics, Elsevier, Vol. 148', year: '2024' },
      { title: 'Blockchain-enabled Secure Data Sharing in Cloud Environments', authors: 'Dr. Ajmeera Kiran, Allam Sangeetha, B. Venkat Reddy', journal: 'Cluster Computing, Springer, Vol. 26, pp. 2145–2160', year: '2023' },
      { title: 'Sentiment Analysis of Social Media Data using Transformer Models', authors: 'Dr. K. Srinivas Rao, G. Mounika, R. Sai Kiran', journal: 'International Conference on NLP and Text Mining (NLPTM 2023), ACM', year: '2023' },
      { title: 'Energy-Efficient Routing Protocol for Wireless Sensor Networks using Fuzzy Logic', authors: 'Dr. N. Sirisha, K. Rajesh, T. Anuradha', journal: 'Wireless Personal Communications, Springer, Vol. 124, pp. 987–1003', year: '2022' },
      { title: 'Hybrid Machine Learning Approach for Crop Yield Prediction using Satellite Imagery', authors: 'Allam Sangeetha, Dr. Ajmeera Kiran, V. Srinath', journal: 'Computers and Electronics in Agriculture, Elsevier, Vol. 189', year: '2021' },
    ],
    placementStats: [
      { label: 'Placement Rate', value: '98%' },
      { label: 'Highest Package', value: '42 LPA' },
      { label: 'Students Placed (2024)', value: '312' },
      { label: 'Recruiters', value: '55+' },
    ],
    placementNote: 'Top recruiters include Microsoft, Amazon, TCS, Infosys, Capgemini, Wipro, Cognizant, and Accenture.',
    internStats: [
      { label: 'Students Placed', value: '120+' },
      { label: 'Partner Companies', value: '45+' },
      { label: 'Avg. Duration', value: '6 Mo.' },
    ],
    internships: [
      { company: 'TCS', type: 'Summer Internship', students: '28', year: '2024' },
      { company: 'Infosys', type: 'Summer Internship', students: '22', year: '2024' },
      { company: 'Wipro', type: 'Winter Internship', students: '18', year: '2023' },
      { company: 'Microsoft', type: 'Summer Internship', students: '6', year: '2024' },
      { company: 'Amazon', type: 'Summer Internship', students: '8', year: '2024' },
      { company: 'Cognizant', type: 'Winter Internship', students: '15', year: '2023' },
    ],
    mous: [
      { name: 'Boeing', domain: 'Aerospace and technology partner supporting industry-aligned software training and campus recruitment.' },
      { name: 'Cyient', domain: 'Engineering and technology services partner supporting applied student projects and campus recruitment.' },
      { name: 'EPAM Systems', domain: 'Software engineering partner supporting fullstack development training and campus recruitment.' },
    ],
    committees: [
      { name: 'Departmental Advisory Committee (DAC)' },
      { name: 'Programme Assessment Committee (PAC)' },
      { name: 'Course Expert Team' },
      { name: 'Vision and Mission Committee' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CSE-DS (Data Science)
  // ═══════════════════════════════════════════════════════════════
  'cse-ds': {
    vision:
      'To be a leading centre for Data Science education, producing analytically skilled engineers who harness data ethically to solve complex societal and industry problems.',
    mission: [
      'Deliver outcome-based education grounded in statistics and programming, equipping students with the analytical foundation required to solve complex data problems.',
      'Foster a culture of real-world project work through industry partnerships, enabling students to tackle authentic data challenges across diverse domains.',
      'Cultivate ethical data practitioners who understand privacy, governance and responsible use of data in all professional contexts.',
      'Strengthen industry readiness through certifications, internships and placement linkages that prepare graduates for high-impact data science careers.',
    ],
    history:
      'Established in 2020, the Department of CSE (Data Science) was created to meet the surging demand for analytics professionals across industry and research. The inaugural batch graduated in 2024, achieving a 100% placement rate with offers from leading data-driven organisations. The department has since built a suite of six specialised laboratories and forged industry partnerships that support real-world capstone projects every semester.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 60 },
      { year: '2019', students: 90 },
      { year: '2020', students: 120 },
      { year: '2021', students: 150 },
      { year: '2022', students: 180 },
      { year: '2023', students: 210 },
      { year: '2024', students: 240 },
      { year: '2025', students: 270 },
    ],
    introduction:
      'The Department of Computer Science and Engineering (Data Science) was established in 2020 to address the rapidly growing industry demand for data-literate engineers. Offering B.Tech with an intake of 120 students under the R25 regulation, the department is built around the Python, R and SQL ecosystem. Partnerships with leading analytics organisations provide students with real-world capstone projects that bridge academic knowledge and industry practice.',
    hodMessage:
      'Our Data Science department fosters innovation in data analytics, machine learning, and cloud computing. With 22 research papers, 5 patents, and industry projects with Mu Sigma, Fractal Analytics, and Amazon, we equip students with skills to lead in the data-driven economy.',
    teachingMethodology:
      'The department adopts a project-driven pedagogy anchored in real datasets sourced from industry and public repositories. Every semester integrates Kaggle competitions, data journalism exercises and dashboard design workshops. Industry mentors from analytics firms guide capstone projects, while regular seminars on data ethics and emerging tools ensure students remain aligned with evolving professional standards.',
    peos: [
      { id: 'PEO 1', text: 'Apply statistical methods and programming to extract insights from large-scale structured and unstructured data, solving real-world analytical challenges across diverse industry domains.' },
      { id: 'PEO 2', text: 'Contribute to data-driven research and adapt to evolving tools, platforms, and methodologies in the rapidly changing data science ecosystem.' },
      { id: 'PEO 3', text: 'Design ethical, privacy-aware data solutions that deliver measurable business impact while adhering to governance standards and responsible data practices.' },
    ],
    labs: [
      { name: 'Data Engineering Lab', desc: 'ETL pipelines, Apache Kafka, Apache Airflow, workflow orchestration' },
      { name: 'Statistical Computing Lab', desc: 'R, SAS, SPSS, hypothesis testing, regression modelling' },
      { name: 'Business Intelligence Lab', desc: 'Tableau, Power BI, Looker, interactive dashboards, executive reporting' },
      { name: 'Database Systems Lab', desc: 'PostgreSQL, MongoDB, Snowflake, query optimisation, schema design' },
      { name: 'Data Science Platforms Lab', desc: 'Jupyter Notebooks, Databricks, Azure ML, experiment tracking' },
      { name: 'Cloud Analytics Lab', desc: 'AWS Redshift, Google BigQuery, dbt, cloud-scale data transformation' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'Data Science Hackathon — National Winners', desc: 'Team MLRIT-DS won first place at the National Data Science Hackathon 2024, developing a predictive model for public health resource allocation using census and hospital data.' },
      { title: 'Kaggle Top Rankings', desc: 'Students consistently rank in the top 2% of Kaggle competitions, with notable finishes in tabular data, time-series forecasting and NLP classification challenges throughout 2023 and 2024.' },
      { title: 'Analytics Vidhya Datahack Competition', desc: 'Department team secured 3rd place at the Analytics Vidhya Datahack 2024, competing against 500+ teams from premier institutions across India in a demand forecasting challenge.' },
      { title: 'Industry Internship Excellence Awards', desc: 'Six students received the Mu Sigma "Insights Champion" award for exceptional performance during their summer internship, with two receiving Pre-Placement Offers upon completion.' },
      { title: 'NPTEL Discipline Star — Data Science', desc: 'Department recognised as NPTEL Discipline Star with 90+ certifications completed in a single semester, covering courses in data analytics, Python, machine learning and statistical inference.' },
    ],
    rollOfHonour: [
      { year: '2024', name: 'P. Sai Chandana', achievement: 'Department Topper', score: '89%' },
      { year: '2023', name: 'K. Haritha Reddy', achievement: 'University Rank Holder', score: '86%' },
      { year: '2023', name: 'M. Venkat Sai', achievement: 'Department Topper', score: '84%' },
    ],
    publications: [
      { title: 'An architecture on drone agriculture IoT using Machine learning', authors: 'Dr. D.B.K. Kamesh', journal: '2nd International Conference on Cognitive and Intelligent Computing (ICCIC-2022)', year: '2022' },
      { title: 'Machine Learning-Based Software Effort Estimation of Suggestive Agile and Scrumban Methodologies', authors: 'Dr. D.B.K. Kamesh', journal: '14th International Conference on Soft Computing and Pattern Recognition (SoCPaR 2022)', year: '2022' },
      { title: 'Automating WEB Interface in Relation to User Behavior', authors: 'Dr. D.B.K. Kamesh', journal: 'Artificial Intelligence and Cognitive Computing', year: '2018' },
      { title: 'Identification of Effective Parameters for Designing a Data Channel', authors: 'Dr. D.B.K. Kamesh', journal: 'Artificial Intelligence and Cognitive Computing', year: '2018' },
      { title: 'An Advanced Framework to Identify Cybercrime using Data Analytics', authors: 'Dr. D.B.K. Kamesh', journal: 'Artificial Intelligence and Cognitive Computing', year: '2018' },
      { title: 'An Efficient Technique for Energy-Proficient Clustering-Based Routing Protocol for Packet Split and Merge in Wireless Sensor Networks', authors: 'Dr. D.B.K. Kamesh', journal: 'Artificial Intelligence and Cognitive Computing', year: '2018' },
      { title: 'Home Automation using GSM', authors: 'Dr. D.B.K. Kamesh', journal: 'Artificial Intelligence and Cognitive Computing', year: '2018' },
      { title: 'Online Speaker Authentication using Phonemic Distance Measurements', authors: 'Dr. D.B.K. Kamesh', journal: 'Artificial Intelligence and Cognitive Computing', year: '2018' },
      { title: 'A Secured Surveillance System for Monitoring Your Home', authors: 'Dr. D.B.K. Kamesh', journal: 'Artificial Intelligence and Cognitive Computing', year: '2018' },
      { title: 'Snort Rule Detection for Countering in Network Attack', authors: 'Dr. D.B.K. Kamesh', journal: "FICTA-2016, Springer — International Conference on Frontiers of Intelligent Computing: Theory and Applications", year: '2016' },
      { title: 'Text-to-Speech Conversion', authors: 'Dr. D.B.K. Kamesh', journal: "3rd International Conference on Advances in Computer Science, Engineering and Technology (ICACSET'16)", year: '2016' },
    ],
    publicationsNote: 'Selected publications from departmental faculty, ingested from the individual profile pages on mlrit.ac.in.',
    placementStats: [
      { label: 'Placement Rate', value: '96%' },
      { label: 'Average Package', value: '₹10 LPA' },
      { label: 'Highest Package', value: '₹28 LPA' },
      { label: 'Companies', value: '40+' },
    ],
    placementNote: 'Top recruiters include Mu Sigma, Fractal Analytics, Tiger Analytics, Amazon, Microsoft, Wipro, TCS, and Infosys. Graduates work as data analysts, data engineers and data scientists at leading analytics-first organisations and technology firms across India and abroad.',
    internStats: [
      { label: 'Students Interned', value: '100+' },
      { label: 'Companies', value: '28+' },
      { label: 'PPOs Converted', value: '6' },
    ],
    internList: [
      'Internships at Mu Sigma, Fractal Analytics, Amazon, and TCS through campus and off-campus drives',
      'Fractal Analytics summer analyst programme — 10 students, 2 PPOs (2024)',
      'Tiger Analytics data engineering internship — 8 students selected with live project exposure',
      'AICTE NEAT data science virtual internships and NASSCOM Future Skills certified projects',
    ],
    mous: [
      { name: 'Mu Sigma', domain: 'Decision sciences and analytics partner running live industry projects and a summer analyst programme, with top interns recognised through the Mu Sigma "Insights Champion" award.' },
      { name: 'Fractal Analytics', domain: 'Applied AI and analytics partner running a summer analyst programme with Pre-Placement Offers for top-performing interns.' },
      { name: 'Amazon', domain: 'Cloud and data engineering partner supporting live industry projects for the data science curriculum.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // AIML
  // ═══════════════════════════════════════════════════════════════
  aiml: {
    vision:
      'To be a centre of excellence in Artificial Intelligence and Machine Learning education, producing globally competent engineers who drive innovation and responsible technological transformation.',
    mission: [
      'Deliver outcome-based, industry-aligned AI and ML education integrating mathematical rigour with practical implementation.',
      'Foster research culture through collaborations, publications and student-driven projects in AI domains.',
      'Cultivate ethical AI practitioners who contribute positively to society and adapt to emerging technologies.',
      'Establish strong industry linkages ensuring high employability and entrepreneurial readiness of graduates.',
    ],
    history:
      'Established in 2020, the Department of CSE (AI and ML) was created in response to transformative industry demand for AI-specialised engineers. Within its first three years the department achieved 100% placements, launched two funded research projects and built a dedicated GPU computing laboratory supporting over 40 concurrent deep learning workloads.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 60 },
      { year: '2019', students: 100 },
      { year: '2020', students: 130 },
      { year: '2021', students: 160 },
      { year: '2022', students: 190 },
      { year: '2023', students: 220 },
      { year: '2024', students: 250 },
      { year: '2025', students: 280 },
    ],
    introduction:
      'The Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning) was established to meet the rapidly growing industry demand for AI-literate engineers. Offering B.Tech with an intake of 120 students, the department is equipped with GPU-accelerated labs, dedicated AI research clusters and partnerships with leading technology organisations. The curriculum follows the R25 regulation and integrates outcome-based education with project-driven, industry-mentored learning.',
    hodMessage:
      'Our department blends cutting-edge AI and ML research with industry-focused curriculum. With GPU-accelerated labs, partnerships with leading tech firms, and 28+ publications, we are shaping the next generation of AI innovators and data-driven problem solvers.',
    teachingMethodology:
      'The department employs a blended learning pedagogy combining Socratic questioning, flipped classrooms and project-based learning cycles. Every semester includes a capstone AI project mentored by industry practitioners. Regular hackathons, Kaggle challenges and paper reading groups supplement formal instruction to develop research-minded problem solvers.',
    peos: [
      { id: 'PEO 1', text: 'Apply strong foundations in mathematics, statistics, and computing to design intelligent systems that address real-world challenges.' },
      { id: 'PEO 2', text: 'Pursue lifelong learning and research in AI, ML, and related emerging technologies to remain competitive in a dynamic global landscape.' },
      { id: 'PEO 3', text: 'Lead multidisciplinary teams with effective communication, ethical reasoning, and entrepreneurial thinking to create societal value.' },
    ],
    labs: [
      { name: 'GPU Deep Learning Lab', desc: 'NVIDIA A100/T4 GPUs, PyTorch, TensorFlow, CUDA programming' },
      { name: 'Computer Vision Lab', desc: 'Image classification, object detection, OpenCV, YOLO' },
      { name: 'Natural Language Processing Lab', desc: 'Transformers, BERT, GPT fine-tuning, text analytics' },
      { name: 'Data Science and Analytics Lab', desc: 'Python, R, Tableau, Power BI, statistical modelling' },
      { name: 'AI Research Lab', desc: 'Reinforcement learning, generative AI, model interpretability' },
      { name: 'Cloud and MLOps Lab', desc: 'AWS SageMaker, Azure ML, Docker, Kubernetes, CI/CD pipelines' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'Smart India Hackathon — National Finalists', desc: 'Students secured Top 10 ranks in SIH 2024, developing an AI-based crop disease detection system using satellite imagery and deep learning.' },
      { title: 'Google Summer of Code (GSoC)', desc: '4 students selected for GSoC 2024 contributing to open-source ML frameworks including TensorFlow and scikit-learn projects.' },
      { title: 'Hyderabad AI and ML Challenge', desc: 'Team "DeepMind MLRIT" won 1st place at the Hyderabad AI and ML Challenge 2023, competing against 200+ teams from across India.' },
      { title: 'MLRIT AI Club — TechNova Summit', desc: 'The MLRIT AI Club organised "TechNova AI Summit 2024" drawing 1,200+ attendees over two days with industry keynotes and student paper presentations.' },
    ],
    rollOfHonour: [
      { year: '2024', name: 'B. Sai Teja', achievement: 'Department Topper', score: '88%' },
      { year: '2023', name: 'R. Pooja Sri', achievement: 'University Rank Holder', score: '85%' },
      { year: '2023', name: 'G. Harsha Vardhan', achievement: 'Department Topper', score: '83%' },
    ],
    publications: [],
    publicationsNote: 'Faculty publications for this department are listed on each individual faculty profile page on mlrit.ac.in. A consolidated departmental publications list is pending ingestion.',
    placementStats: [
      { label: 'Placement Rate', value: '98%' },
      { label: 'Average Package', value: '₹12 LPA' },
      { label: 'Highest Package', value: '₹33 LPA' },
      { label: 'Companies', value: '45+' },
    ],
    placementNote: 'Top recruiters include ServiceNow, EPAM Systems, Amazon, Microsoft, Virtusa, Capgemini, TCS, Infosys, Wipro, and LTI Mindtree. Alumni have joined AI research teams at leading product companies worldwide.',
    internStats: [
      { label: 'Students Interned', value: '120+' },
      { label: 'Companies', value: '30+' },
      { label: 'PPOs Converted', value: '8' },
    ],
    internList: [
      'Internships at Amazon, Microsoft, Google, and Infosys through campus and off-campus drives',
      'EPAM Systems internship programme — 12 students, 3 PPOs (2024)',
      'Virtusa Centre of Excellence internship — 8 students selected annually',
      'AICTE NEAT and NITI Aayog AI challenge participation internships',
    ],
    mous: [
      { name: 'EPAM Systems', domain: 'Software engineering partner running a dedicated internship programme with Pre-Placement Offers for top performers.' },
      { name: 'Virtusa', domain: 'AI and cloud Centre of Excellence running a dedicated on-campus internship track selecting students every year.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ECE
  // ═══════════════════════════════════════════════════════════════
  ece: {
    vision:
      'To provide quality technical education with innovation and importance to R and D, fulfilling societal needs while achieving academic excellence in preparing globally competent engineers.',
    mission: [
      'Adopt innovative student-centric learning approaches to deliver core electronics and communication fundamentals.',
      'Foster research-oriented perspectives and enable national and international competitive capabilities.',
      'Strengthen core competencies through an experiential curriculum spanning VLSI, embedded systems and communications.',
    ],
    history:
      'The ECE Department was established in 2005 with an initial intake of 60 students. Following autonomous status in 2015, the department now offers B.Tech with 120 intake and M.Tech in Embedded Systems. The department holds NBA accreditation and maintains active memberships in IETE, ISTE, IEEE and IUCEE.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 60 },
      { year: '2019', students: 75 },
      { year: '2020', students: 90 },
      { year: '2021', students: 105 },
      { year: '2022', students: 120 },
      { year: '2023', students: 140 },
      { year: '2024', students: 160 },
      { year: '2025', students: 180 },
    ],
    introduction:
      'The ECE Department was established in 2005 with an initial intake of 60 students. Following autonomous status in 2015, the department now offers B.Tech with 120 intake and M.Tech in Embedded Systems. The department holds NBA accreditation and maintains active memberships in IETE, ISTE, IEEE and IUCEE — and operates Centres of Excellence in Cadence, MATLAB and LabVIEW for industry-ready training.',
    hodMessage:
      'The ECE Department has been at the forefront of innovation since 2005. With NBA accreditation and active memberships in IETE, IEEE, and IUCEE, we provide an ecosystem where students thrive in VLSI design, signal processing, IoT, and wireless communications. Our Centres of Excellence in Cadence, MATLAB, and LabVIEW ensure industry-ready training.',
    teachingMethodology:
      'The department follows an active learning pedagogy integrating project-based learning, flipped classrooms and industry-mentored sessions. Regular guest lectures from industry professionals complement the curriculum, alongside hands-on laboratory exposure across all eight specialised labs.',
    peos: [
      { id: 'PEO 1', text: 'Excel in core engineering with foundational mathematics and science knowledge.' },
      { id: 'PEO 2', text: 'Develop solid fundamentals for lifelong professional and higher education success.' },
      { id: 'PEO 3', text: 'Demonstrate effective design, management, and leadership skills at national and multinational levels.' },
    ],
    labs: [
      { name: 'Cadence Centre of Excellence', desc: 'VLSI design tools, Cadence Virtuoso' },
      { name: 'MATLAB Centre of Excellence', desc: 'Signal processing, simulation' },
      { name: 'Embedded Systems and Robotics Lab', desc: 'ARM processors, RTOS' },
      { name: 'LabVIEW Centre of Excellence', desc: 'Virtual instrumentation' },
      { name: 'Microprocessors Lab', desc: '8086/8051 programming' },
      { name: 'DSP Lab', desc: 'Digital signal processing, filter design' },
      { name: 'Communication Systems Lab', desc: 'AM/FM modulation, antennas' },
      { name: 'VLSI Design Lab', desc: 'FPGA, Verilog, synthesis' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'Centres of Excellence', desc: 'Cadence, MATLAB, Embedded and Robotics, and LabVIEW Centres of Excellence — providing industry-standard training, hands-on experience and certification pathways for students.' },
      { title: 'NBA Accreditation', desc: 'The B.Tech ECE programme holds NBA accreditation, reflecting the department\'s commitment to outcome-based education and continuous quality improvement aligned with the Washington Accord.' },
      { title: 'IEEE and IETE Memberships', desc: 'Active institutional memberships in IETE, ISTE, IEEE and IUCEE — providing students with access to global publications, conferences and networking opportunities.' },
      { title: 'Funded Research Projects', desc: 'Faculty have secured funded research projects in VLSI, embedded systems and signal processing, with student involvement across all major project tracks.' },
    ],
    rollOfHonour: [
      { year: '2015', name: 'K. Sai Priya', achievement: 'University Rank Holder', score: '83%' },
      { year: '2016', name: 'R. Anusha', achievement: 'Department Topper', score: '80%' },
      { year: '2018', name: 'M. Kavitha', achievement: 'Department Topper', score: '78%' },
    ],
    publications: [
      { title: 'FPGA-based Real-Time Image Processing for Autonomous Navigation', authors: 'Dr. S V S Prasad, R. Kumar', journal: 'IEEE VLSI Design Conference', year: '2024' },
      { title: 'Energy Harvesting Techniques for IoT Sensor Networks', authors: 'Dr. Shrikant Upadhyay, P. Reddy', journal: 'Elsevier Sustainable Energy', year: '2024' },
      { title: 'Deep Learning Approach for Speech Enhancement in Noisy Environments', authors: 'Dr. Kiran Chand Ravi, S. Mounika', journal: 'Signal Processing Letters, IEEE', year: '2023' },
      { title: 'Millimeter-Wave Antenna Design for 5G Applications', authors: 'Dr. G. Karthik Reddy, T. Venkat', journal: 'Microwave and Optical Technology Letters', year: '2023' },
      { title: 'Low-Power VLSI Architecture for Biomedical Signal Processing', authors: 'Dr. S V S Prasad, K. Anusha', journal: 'Circuits, Systems and Signal Processing, Springer', year: '2022' },
      { title: 'Secure IoT Communication using Lightweight Cryptographic Protocols', authors: 'Dr. Shrikant Upadhyay, M. Srinath', journal: 'Computer Communications, Elsevier', year: '2021' },
    ],
    placementStats: [
      { label: 'Placement Rate', value: '95%' },
      { label: 'Highest Package', value: '28 LPA' },
      { label: 'Students Placed', value: '108' },
      { label: 'Recruiters', value: '35+' },
    ],
    internStats: [
      { label: 'Students', value: '90+' },
      { label: 'Companies', value: '35+' },
      { label: 'Avg. Duration', value: '6 Mo.' },
    ],
    internships: [
      { company: 'TCS', type: 'Summer Internship', students: '20', year: '2024' },
      { company: 'Qualcomm', type: 'Summer Internship', students: '4', year: '2024' },
      { company: 'Wipro', type: 'Winter Internship', students: '15', year: '2023' },
      { company: 'BHEL', type: 'Summer Internship', students: '8', year: '2023' },
      { company: 'L and T', type: 'Summer Internship', students: '12', year: '2024' },
      { company: 'HCL', type: 'Winter Internship', students: '10', year: '2023' },
    ],
    internNote: 'Internship opportunities are facilitated through the Training and Placement Cell in collaboration with the ECE department.',
    mous: [
      { name: 'Cadence Design Systems', domain: 'VLSI design tooling partner — Cadence Centre of Excellence for chip design training and Cadence Virtuoso certification.' },
      { name: 'MathWorks (MATLAB)', domain: 'Simulation and signal-processing partner — MATLAB Centre of Excellence supporting coursework and certification pathways.' },
      { name: 'National Instruments (LabVIEW)', domain: 'Virtual instrumentation partner — LabVIEW Centre of Excellence for measurement and automation training.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // EEE
  // ═══════════════════════════════════════════════════════════════
  eee: {
    vision:
      'To impart students with strong fundamental and applied knowledge to identify, analyze and research on upcoming energy related challenges that provide optimal solutions to the society and nation needs.',
    mission: [
      'Deliver core and advanced knowledge across all EEE domains — power, machines, control and electronics.',
      'Foster research and innovation to address emerging energy challenges in the power and renewables sectors.',
      'Develop entrepreneurial and leadership capabilities for eco-friendly and sustainable energy solutions.',
    ],
    history:
      'The EEE Department offers state-of-the-art facilities with acoustically-designed classrooms and modern instruments. The department hosts a flagship 260 kWp rooftop solar plant connected to the campus grid — anchoring its commitment to sustainable energy education and research.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 60 },
      { year: '2019', students: 80 },
      { year: '2020', students: 100 },
      { year: '2021', students: 120 },
      { year: '2022', students: 140 },
      { year: '2023', students: 160 },
      { year: '2024', students: 180 },
      { year: '2025', students: 200 },
    ],
    introduction:
      'The EEE department offers state-of-the-art facilities with acoustically-designed classrooms, well-equipped laboratories and integration of seminars and workshops. The department hosts a 260 kWp rooftop solar plant connected to the grid — a working demonstration of the department\'s commitment to sustainable, eco-friendly energy education.',
    hodMessage:
      'The EEE department is dedicated to shaping the future of energy and electronics. Our state-of-the-art laboratories, acoustically-designed classrooms, and the flagship 260 kWp rooftop solar plant demonstrate our commitment to sustainable energy solutions.',
    teachingMethodology:
      'The department follows active learning pedagogy integrating project-based learning, flipped classrooms and industry-mentored sessions. Regular guest lectures from industry professionals complement the curriculum, while lab sessions across six dedicated labs anchor theory in measurement and experimentation.',
    peos: [
      { id: 'PEO 1', text: 'Excel in core engineering with mathematics and science foundations.' },
      { id: 'PEO 2', text: 'Build problem-solving skills through research while instilling human values.' },
      { id: 'PEO 3', text: 'Demonstrate design, management, and leadership expertise at national and multinational organizations.' },
    ],
    labs: [
      { name: 'Electrical Machines Lab', desc: 'DC/AC machines, transformers' },
      { name: 'Power Electronics Lab', desc: 'Converters, inverters, PWM' },
      { name: 'Control Systems Lab', desc: 'PID controllers, MATLAB' },
      { name: 'Measurements Lab', desc: 'Instruments, bridges' },
      { name: 'Power Systems Lab', desc: 'Load flow, protection' },
      { name: 'Renewable Energy Lab', desc: '260 kWp solar, wind' },
    ],
    faculty: [],
    studentAchievements: [
      { title: '260 kWp Rooftop Solar Plant', desc: 'A flagship grid-connected rooftop solar installation on campus — operated as both a sustainability initiative and an active research and teaching resource for renewable energy courses.' },
      { title: 'Industry Partnerships', desc: 'Active partnerships and project collaborations with power utilities and electrical equipment manufacturers, supporting student internships and applied research.' },
      { title: 'Acoustically-Designed Classrooms', desc: 'Modern acoustically-designed classrooms and well-equipped laboratories supporting both undergraduate teaching and postgraduate research in EEE.' },
    ],
    rollOfHonour: [
      { year: '2016', name: 'P. Srinivas', achievement: 'Department Topper', score: '79%' },
      { year: '2018', name: 'K. Anitha', achievement: 'Department Topper', score: '77%' },
    ],
    publications: [
      { title: 'Optimal Power Flow in Smart Grids using Meta-heuristic Algorithms', authors: 'Prof. Ashok Kumar Cheeli, R. Prasad', journal: 'IEEE Power Systems', year: '2024' },
      { title: 'SiC-based Multilevel Inverter for Solar PV Applications', authors: 'Dr. M. Dileep Kumar, K. Sai', journal: 'Power Electronics, Elsevier', year: '2024' },
      { title: 'IoT-enabled Smart Energy Metering System for Campus Buildings', authors: 'Ashok Reddy Kanna, P. Harsha', journal: 'Sustainable Cities and Society, Elsevier', year: '2023' },
      { title: 'Fault Detection in Power Distribution Networks using ML', authors: 'Prof. Ashok Kumar Cheeli, M. Anusha', journal: 'Electrical Power Systems Research', year: '2023' },
      { title: 'Design of MPPT Controller for Wind Energy Conversion', authors: 'K. Usha Rani, T. Naveen', journal: 'Renewable Energy, Elsevier', year: '2022' },
      { title: 'Battery Management System for Electric Vehicles', authors: 'Dr. M. Dileep Kumar, S. Kiran', journal: 'Journal of Energy Storage, Elsevier', year: '2021' },
    ],
    placementStats: [
      { label: 'Placement Rate', value: '90%' },
      { label: 'Highest Package', value: '18 LPA' },
      { label: 'Students Placed', value: '54' },
      { label: 'Recruiters', value: '25+' },
    ],
    internStats: [
      { label: 'Students', value: '60+' },
      { label: 'Companies', value: '25+' },
      { label: 'Avg. Duration', value: '6 Mo.' },
    ],
    internships: [
      { company: 'BHEL', type: 'Industrial Training', students: '12', year: '2024' },
      { company: 'NTPC', type: 'Industrial Training', students: '8', year: '2024' },
      { company: 'Schneider', type: 'Summer Internship', students: '6', year: '2023' },
      { company: 'L and T Electrical', type: 'Industrial Training', students: '10', year: '2023' },
      { company: 'Siemens', type: 'Summer Internship', students: '5', year: '2024' },
      { company: 'ABB', type: 'Summer Internship', students: '4', year: '2023' },
    ],
    internNote: 'Internship opportunities are facilitated through the Training and Placement Cell in collaboration with the EEE department.',
    mous: [
      { name: 'BHEL', domain: 'Power generation partner hosting annual Industrial Training placements in power plant operations.' },
      { name: 'NTPC', domain: 'Power generation partner hosting annual Industrial Training placements in thermal power operations.' },
      { name: 'Schneider Electric', domain: 'Electrical equipment and automation partner hosting summer internships in power electronics and automation.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MECHANICAL
  // ═══════════════════════════════════════════════════════════════
  mechanical: {
    vision:
      'To be recognized globally for outstanding education and research leading to well qualified engineers who are innovative, entrepreneurial and successful in advanced fields of mechanical engineering.',
    mission: [
      'Deliver high-quality education to develop globally competitive engineers and entrepreneurs.',
      'Provide state-of-the-art research facilities across composites, manufacturing and thermal engineering.',
      'Embed lifelong learning, design thinking and shop-floor practice across the curriculum.',
    ],
    history:
      'The Mechanical Engineering Department offers B.Tech and M.Tech programmes with specializations in Advanced Composite Materials, Product Life Cycle Management and Nondestructive Testing. Active partnerships with Mahindra and Mahindra and Pennar Industries provide industry exposure and project opportunities.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 60 },
      { year: '2019', students: 80 },
      { year: '2020', students: 105 },
      { year: '2021', students: 120 },
      { year: '2022', students: 140 },
      { year: '2023', students: 165 },
      { year: '2024', students: 180 },
      { year: '2025', students: 200 },
    ],
    introduction:
      'The Mechanical Engineering Department offers B.Tech and M.Tech programmes with specializations in Advanced Composite Materials, Product Life Cycle Management and Nondestructive Testing. Centres of Excellence in Composite Materials, NDT and Welding Technology — along with active partnerships with Mahindra and Mahindra and Pennar Industries — make the department a strong choice for students aiming at design, manufacturing and thermal careers.',
    hodMessage:
      'Mechanical Engineering at MLRIT combines traditional engineering excellence with modern innovation. Our Centres of Excellence in Composite Materials, NDT, and Welding Technology provide advanced research capabilities. Through partnerships with Mahindra and Pennar Industries, our students gain real-world experience.',
    teachingMethodology:
      'The department follows active learning pedagogy integrating project-based learning, flipped classrooms and industry-mentored sessions. Regular guest lectures from industry professionals complement the curriculum, and students gain shop-floor exposure through dedicated manufacturing and NDT lab sessions.',
    peos: [
      { id: 'PEO 1', text: 'Excellence in undergraduate and postgraduate studies and professional careers.' },
      { id: 'PEO 2', text: 'Data analysis, synthesis, and product design capabilities across specializations.' },
      { id: 'PEO 3', text: 'Strong communication, ethical standards, and emerging technology leadership.' },
    ],
    labs: [
      { name: 'Thermodynamics Lab', desc: 'Heat engines, refrigeration' },
      { name: 'Fluid Mechanics Lab', desc: 'Flow measurement, pumps' },
      { name: 'Strength of Materials Lab', desc: 'Tensile, hardness testing' },
      { name: 'CAD/CAM Lab', desc: 'AutoCAD, SolidWorks, CNC' },
      { name: 'Metallurgy Lab', desc: 'Microscopy, heat treatment' },
      { name: 'IC Engines Lab', desc: 'Engine testing, performance' },
      { name: 'Composite Materials CoE', desc: 'Fibre composites' },
      { name: 'NDT Centre of Excellence', desc: 'Ultrasonic, radiographic testing' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'Centres of Excellence — Composites, NDT and Welding', desc: 'Three operational CoEs anchor advanced research in composite materials, non-destructive testing and welding technology — supporting student projects, industry consulting and publications.' },
      { title: 'Mahindra and Pennar Industry Partnerships', desc: 'Active MoUs with Mahindra and Mahindra and Pennar Industries provide internships, joint projects and live shop-floor exposure for students.' },
      { title: 'SAE Baja / Supra Participation', desc: 'Student teams compete annually in SAE Baja and Supra automotive design competitions — designing, fabricating and racing all-terrain and formula-style vehicles.' },
    ],
    rollOfHonour: [
      { year: '2015', name: 'S. Rajesh', achievement: 'Department Topper', score: '78%' },
      { year: '2017', name: 'K. Mounika', achievement: 'Department Topper', score: '76%' },
    ],
    publications: [
      { title: 'Optimization of Friction Stir Welding Parameters using Taguchi Method', authors: 'Dr. J. Krishnaraj, P. Sai Kumar', journal: 'Journal of Manufacturing Processes, Elsevier', year: '2024' },
      { title: 'Thermal Analysis of Phase Change Materials for Solar Energy Storage', authors: 'Dr. N. Prabhu Kishore, R. Anil', journal: 'Applied Thermal Engineering', year: '2024' },
      { title: 'CNC Machining Parameter Optimization using Grey Relational Analysis', authors: 'Dr. Ch. Ravi Kiran, K. Ravi Teja', journal: 'Materials Today: Proceedings', year: '2023' },
      { title: 'Fatigue Life Prediction of Composite Laminates under Cyclic Loading', authors: 'Dr. J. Krishnaraj, M. Srikanth', journal: 'Composite Structures, Elsevier', year: '2023' },
      { title: 'Topology Optimization of Automotive Bracket using FEM', authors: 'Dr. Harikishor Kumar, S. Preethi', journal: 'Finite Elements in Analysis and Design', year: '2022' },
      { title: 'Performance Analysis of Biodiesel Blends in CI Engines', authors: 'Dr. N. Prabhu Kishore, V. Krishna', journal: 'Fuel, Elsevier', year: '2021' },
    ],
    placementStats: [
      { label: 'Placement Rate', value: '88%' },
      { label: 'Highest Package', value: '12 LPA' },
      { label: 'Students Placed', value: '85' },
      { label: 'Recruiters', value: '30+' },
    ],
    internStats: [
      { label: 'Students', value: '80+' },
      { label: 'Companies', value: '30+' },
      { label: 'Avg. Duration', value: '6 Mo.' },
    ],
    internships: [
      { company: 'Mahindra', type: 'Summer Internship', students: '15', year: '2024' },
      { company: 'Tata Motors', type: 'Summer Internship', students: '10', year: '2024' },
      { company: 'L and T', type: 'Summer Internship', students: '12', year: '2023' },
      { company: 'Pennar', type: 'Summer Internship', students: '8', year: '2023' },
      { company: 'Ashok Leyland', type: 'Summer Internship', students: '6', year: '2024' },
      { company: 'Hyundai', type: 'Summer Internship', students: '5', year: '2023' },
    ],
    internNote: 'Internship opportunities are facilitated through the Training and Placement Cell in collaboration with the Mechanical department.',
    mous: [
      { name: 'Mahindra and Mahindra', domain: 'Automotive design and manufacturing partner — active MoU providing internships, joint projects and live shop-floor exposure.' },
      { name: 'Pennar Industries', domain: 'Engineering and industrial manufacturing partner — active MoU providing internships, joint projects and live shop-floor exposure.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // AERONAUTICAL
  // ═══════════════════════════════════════════════════════════════
  aeronautical: {
    vision:
      'To be a centre of excellence in Aeronautical engineering with emphasis on Research and Innovation to serve the needs of industry with human values to build strong nation.',
    mission: [
      'Consistently produce top quality Aeronautical engineers with core and multidisciplinary skills.',
      'Develop ace leaders and successful entrepreneurs with human values.',
      'Enable participation in aviation, space, defence and UAV-led research and competitions.',
    ],
    history:
      'The Aeronautical Engineering department provides excellent infrastructure and state-of-the-art laboratories for graduate research and innovation in aerospace engineering. Active collaborations with defence and aerospace organisations have anchored its growth — including DRDO, Tata Advanced Systems and Boeing India.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 40 },
      { year: '2019', students: 55 },
      { year: '2020', students: 70 },
      { year: '2021', students: 85 },
      { year: '2022', students: 100 },
      { year: '2023', students: 115 },
      { year: '2024', students: 130 },
      { year: '2025', students: 150 },
    ],
    introduction:
      'The Aeronautical Engineering department provides excellent infrastructure and state-of-the-art laboratories for graduate research and innovation in aerospace engineering. With a Flight Simulation Lab, Digital Manufacturing Lab and Centre for Innovation — alongside collaborations with DRDO, Tata Advanced Systems and IIT Hyderabad — students work on cutting-edge aviation and space technology projects.',
    hodMessage:
      'The Aeronautical Engineering department is a centre of excellence for aerospace education and research. Our Flight Simulation Lab, Digital Manufacturing Lab, and Centre for Innovation provide the perfect environment. With collaborations with DRDO, Tata Advanced Systems, and IIT Hyderabad, students work on cutting-edge aviation and space technology.',
    teachingMethodology:
      'The department follows active learning pedagogy integrating project-based learning, flipped classrooms and industry-mentored sessions. Regular guest lectures from defence and aerospace professionals complement the curriculum, while lab sessions on flight simulation, propulsion and CFD anchor theory in real systems.',
    peos: [
      { id: 'PEO 1', text: 'Prepare students for successful careers in industrial, academic, and entrepreneurial sectors.' },
      { id: 'PEO 2', text: 'Develop technical problem-solving abilities through data analysis and product design.' },
      { id: 'PEO 3', text: 'Foster communication skills, ethical attitudes, and leadership in emerging technology.' },
    ],
    labs: [
      { name: 'Flight Simulation Lab', desc: 'Aircraft flight dynamics, pilot training' },
      { name: 'Digital Manufacturing Lab', desc: 'Rapid prototyping, additive manufacturing' },
      { name: 'Aerodynamics Lab', desc: 'Wind tunnel, flow visualization' },
      { name: 'Propulsion Lab', desc: 'Jet engine models, thrust measurement' },
      { name: 'Aircraft Structures Lab', desc: 'Stress analysis, composites' },
      { name: 'CFD Lab', desc: 'ANSYS Fluent, computational methods' },
      { name: 'Project Laboratory', desc: 'Final year projects, UAV assembly' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'DRDO and Tata Advanced Systems Collaborations', desc: 'Active research collaborations with DRDO and Tata Advanced Systems anchor capstone projects, internships and live aerospace problems for students.' },
      { title: 'UAV Design Competitions', desc: 'Student teams design and fly UAVs in national-level competitions, with successful entries in design, fabrication and autonomous flight categories.' },
      { title: 'Centre for Innovation', desc: 'Dedicated Centre for Innovation supports student-led aerospace prototyping — from propulsion testbeds to composite airframe components.' },
      { title: 'Industry-Linked Research', desc: 'Faculty-led research on smart aerospace systems, propulsion and aircraft structures — frequently in collaboration with Boeing India and IIT Hyderabad.' },
    ],
    rollOfHonour: [
      { year: '2017', name: 'R. Varun', achievement: 'Department Topper', score: '77%' },
      { year: '2019', name: 'K. Sai Teja', achievement: 'Department Topper', score: '75%' },
    ],
    publications: [
      { title: 'CFD Analysis of Morphing Wing Configurations for UAV Applications', authors: 'Dr. M. Satyanarayana Gupta, K. Ravi', journal: 'Aerospace Science and Technology, Elsevier', year: '2024' },
      { title: 'Additive Manufacturing of Lightweight Lattice Structures for Aerospace', authors: 'Dr. A. Vivek Anand, P. Hari', journal: 'Materials and Design', year: '2024' },
      { title: 'Structural Health Monitoring of Composite Aircraft Panels using PZT Sensors', authors: 'K. Veeranjaneyulu, M. Srinivas', journal: 'Smart Materials and Structures, IOP', year: '2023' },
      { title: 'Optimization of Turbine Blade Cooling Channels using Genetic Algorithm', authors: 'Dr. A. Vivek Anand, R. Suresh', journal: 'Applied Thermal Engineering', year: '2023' },
      { title: 'Flutter Analysis of High-Aspect-Ratio Wings using Aeroelastic Models', authors: 'Dr. R. Arvind Singh, T. Ankita', journal: 'Journal of Fluids and Structures', year: '2022' },
      { title: 'Autonomous Navigation System for Quadcopter using Computer Vision', authors: 'Dr. M. Satyanarayana Gupta, S. Varun', journal: 'Drones, MDPI', year: '2021' },
    ],
    placementStats: [
      { label: 'Placement Rate', value: '85%' },
      { label: 'Highest Package', value: '14 LPA' },
      { label: 'Students Placed', value: '42' },
      { label: 'Recruiters', value: '15+' },
    ],
    internStats: [
      { label: 'Students', value: '40+' },
      { label: 'Companies', value: '15+' },
      { label: 'Avg. Duration', value: '6 Mo.' },
    ],
    internships: [
      { company: 'DRDO', type: 'Research Internship', students: '5', year: '2024' },
      { company: 'Tata Advanced Systems', type: 'Industry Internship', students: '4', year: '2024' },
      { company: 'HAL', type: 'Summer Internship', students: '6', year: '2023' },
      { company: 'Boeing India', type: 'Industry Internship', students: '3', year: '2024' },
      { company: 'Cyient', type: 'Industry Internship', students: '8', year: '2023' },
      { company: 'IIT Hyderabad', type: 'Research Internship', students: '3', year: '2023' },
    ],
    internNote: 'Internship opportunities are facilitated through the Training and Placement Cell in collaboration with the Aeronautical department.',
    mous: [
      { name: 'DRDO', domain: 'Defence research partner anchoring capstone projects and research internships in aerospace systems.' },
      { name: 'Tata Advanced Systems Limited', domain: 'Aerospace and defence manufacturing partner supporting industry internships and applied research.' },
      { name: 'Boeing India', domain: 'Aerospace industry partner supporting applied research collaboration and internships.' },
      { name: 'IIT Hyderabad', domain: 'Academic research collaborator providing joint aerospace research internships and lab access.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // MBA
  // ═══════════════════════════════════════════════════════════════
  mba: {
    vision:
      'Centre of Excellence for Management Studies with special focus on innovation, Research, entrepreneurial skills, and team working skills.',
    mission: [
      'Deliver student-centered education emphasizing innovation, research and entrepreneurship.',
      'Run social impact projects incorporating human values, diversity and ethics.',
      'Develop analytical and decision-making abilities for effective leadership.',
    ],
    history:
      'The MBA programme at MLRIT emphasizes that innovation, business and technology are inseparable for sustainable growth. The department operates an active Entrepreneurship Cell and is guided by an industry advisory board that helps shape curriculum and capstone engagements.',
    // MOCK DATA — replace with real year-wise intake figures.
    intakeGrowth: [
      { year: '2017', students: 60 },
      { year: '2019', students: 60 },
      { year: '2020', students: 90 },
      { year: '2021', students: 90 },
      { year: '2022', students: 120 },
      { year: '2023', students: 120 },
      { year: '2024', students: 150 },
      { year: '2025', students: 150 },
    ],
    introduction:
      'The MBA program at MLRIT emphasizes that innovation, business and technology are inseparable for sustainable growth. The department has an active Entrepreneurship Cell, regular CXO-level guest lectures and a strong industry advisory board — preparing future business leaders through case-based learning, industry exposure and entrepreneurship.',
    hodMessage:
      'The MBA department believes that innovation, business, and technology are inseparable pillars of sustainable growth. Our programme develops future business leaders through case-based learning, industry exposure, and entrepreneurship. With our active E-Cell and strong placement record, we prepare graduates who can lead with integrity and vision.',
    teachingMethodology:
      'The department follows active learning pedagogy integrating project-based learning, flipped classrooms and industry-mentored sessions. Regular CXO-level guest lectures, live consulting projects and case-based discussions complement the formal curriculum.',
    peos: [
      { id: 'PEO 1', text: 'Apply management theories to handle business and entrepreneurial challenges.' },
      { id: 'PEO 2', text: 'Develop critical thinking for better decision-making and innovation.' },
      { id: 'PEO 3', text: 'Build value-based leadership competencies and contribute effectively to organizational teams.' },
    ],
    labs: [
      { name: 'Computer Lab', desc: 'Business analytics, ERP simulation' },
      { name: 'Language Lab', desc: 'Communication skills, presentations' },
      { name: 'Seminar Hall', desc: 'Guest lectures, case discussions' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'Entrepreneurship Cell (E-Cell)', desc: 'Active E-Cell drives student-led ventures, pitch events and idea labs — supporting capstone business plans and early-stage incubation.' },
      { title: 'Industry Advisory Board', desc: 'Industry advisory board with CXO-level members helps shape curriculum, mentor capstone projects and drive placement linkages.' },
      { title: 'CXO Guest Lecture Series', desc: 'Regular guest lectures from senior leaders across BFSI, IT services and consumer-tech firms expose students to live industry decisions and frameworks.' },
      { title: 'Strong Placement Record', desc: 'The MBA programme has built a strong placement record across services and product firms — with growing presence in analytics, consulting and product management roles.' },
    ],
    rollOfHonour: [
      { year: '2023', name: 'A. Priya', achievement: 'Department Topper', score: '8.9 CGPA' },
      { year: '2022', name: 'R. Venkat', achievement: 'Department Topper', score: '8.7 CGPA' },
    ],
    publications: [
      { title: 'Impact of Digital Transformation on SME Performance in Telangana', authors: 'Dr. N. Ramanjaneyulu, K. Priya', journal: 'International Journal of Management Studies', year: '2024' },
      { title: 'Behavioral Finance and Investment Decision-Making among Retail Investors', authors: 'Dr. M. V. Narasimha Rao, P. Sai', journal: 'Journal of Financial Economics, Elsevier', year: '2024' },
      { title: 'Social Media Marketing Strategies for D2C Brands in India', authors: 'Dr. G. Aruna, R. Meghana', journal: 'Journal of Marketing Communications', year: '2023' },
      { title: 'Employee Engagement and Retention in IT Industry Post-Pandemic', authors: 'M. Umrez, S. Lakshmi', journal: 'Human Resource Management Review', year: '2023' },
      { title: 'Fintech Adoption Patterns among Urban Consumers', authors: 'Dr. M. V. Narasimha Rao, T. Harsha', journal: 'Electronic Commerce Research', year: '2022' },
      { title: 'Sustainable Supply Chain Management Practices in Indian Manufacturing', authors: 'Dr. N. Ramanjaneyulu, V. Anil', journal: 'Journal of Cleaner Production', year: '2021' },
    ],
    placementStats: [
      { label: 'Placement Rate', value: '92%' },
      { label: 'Highest Package', value: '10 LPA' },
      { label: 'Students Placed', value: '48' },
      { label: 'Recruiters', value: '30+' },
    ],
    internStats: [
      { label: 'Students', value: '50+' },
      { label: 'Companies', value: '30+' },
      { label: 'Avg. Duration', value: '2 Mo.' },
    ],
    internships: [
      { company: 'Deloitte', type: 'Summer Internship', students: '4', year: '2024' },
      { company: 'KPMG', type: 'Summer Internship', students: '3', year: '2024' },
      { company: 'HDFC Bank', type: 'Summer Internship', students: '8', year: '2023' },
      { company: 'Kotak', type: 'Summer Internship', students: '6', year: '2023' },
      { company: 'Amazon', type: 'Summer Internship', students: '5', year: '2024' },
      { company: 'Accenture', type: 'Summer Internship', students: '7', year: '2023' },
    ],
    internNote: 'Internship opportunities are facilitated through the Training and Placement Cell in collaboration with the MBA department.',
    mous: [],
    mouNote: 'The MBA programme partners with industry through a CXO-level Industry Advisory Board — spanning BFSI, IT services and consumer-tech — that shapes curriculum and mentors capstone projects, rather than company-specific instructional MoUs.',
  },

  // ═══════════════════════════════════════════════════════════════
  // H&S (Freshman Engineering — Department of Humanities and Sciences)
  // ═══════════════════════════════════════════════════════════════
  hs: {
    vision:
      'To attain excellence in pedagogy in the areas of humanities and basic sciences, to face the emerging global challenges efficiently and to make the students expert professionals in their fields.',
    mission: [
      'Encourage the students to know the practical applications of concepts through experience and participation.',
      'Develop students’ ability to converse rationally, speculatively and inventively in ways that are appropriate across the disciplines.',
      'Endeavor to excel in knowledge and human resource capacity building in science without sacrificing quality and quantity.',
      'Provide students with soft skills and behavioral training programs in order to develop their overall personality and social consciousness.',
      'Provide an amicable ambience to inspire the students to indulge in creativity and innovation.',
    ],
    history:
      'The Department of Humanities and Sciences delivers the common first-year foundation shared by every B.Tech branch at MLRIT — covering mathematics, physics, chemistry, programming and communication skills before students specialise in their chosen engineering discipline.',
    introduction:
      'Engineering is all about applying science and mathematics practically to come up with solutions to problems we face in our daily lives. STEM education is an important learning tool for today\'s students — it encourages critical thinking, problem management skills, and uses real-world applications to promote innovation. The department\'s programme supports educators in providing students with more personalised learning, often supported by innovative technologies.',
    hodMessage:
      'We build the common foundation every engineering branch stands on — strong fundamentals in mathematics, sciences and communication, delivered through active learning, micro-projects and community-oriented engineering practice. Our goal is to make every first-year student an expert professional in the making.',
    teachingMethodology:
      'Key differentiators of the department\'s innovative practices include Micro Projects in the first-year to help students understand concepts deeply, COTS (Concept Oriented Tutorials) to build students\' strategic knowledge, EPICS (Engineering Projects in Community Service) encouraging engineering for community improvement, SPEED (Student Platform for Engineering Education Development) empowering students to drive change in engineering education, active learning methodologies that promote critical thinking, and Seminar Hours with COSHISS (Consortium of Students Helping Improve Speaking Skills) to teach the art of communication.',
    peos: [],
    labs: [
      { name: 'Advanced Engineering Physics Lab', desc: 'Physics experiments and instrumentation for first-year engineering foundations' },
      { name: 'Computer Aided Engineering Drawing Lab', desc: 'CAD fundamentals and engineering graphics' },
      { name: 'Chemistry Lab', desc: 'Engineering chemistry experiments and analysis' },
      { name: 'Programming Problem Solving Lab', desc: 'Foundational programming logic and problem solving' },
      { name: 'Basic Electric Engineering Lab', desc: 'Core electrical circuits and measurement' },
      { name: 'English Language and Communication Skills Lab', desc: 'Spoken English, presentation and communication skills' },
      { name: 'Engineering Workshop', desc: 'Hands-on fabrication and workshop practice' },
      { name: 'Python Programming Lab', desc: 'Python programming fundamentals' },
      { name: 'Data Structures Lab', desc: 'Foundational data structures and algorithms' },
      { name: 'IOT and IT Workshop Lab', desc: 'Introductory IoT and IT workshop practice' },
    ],
    faculty: [],
    studentAchievements: [
      { title: 'ISRO Space Centre Visit', desc: 'First-year students visited the Satish Dhawan Space Centre, ISRO, Sriharikota, as part of an industry and research exposure programme.' },
      { title: 'Leadership and Study Skills Workshop', desc: 'A one-day training programme on Leadership Skills, Study Skills and Memory Skills was organised for first-year students by Dr. C. S. Vepa, Director of the National School of Banking.' },
      { title: 'Cambridge BEC Certification Overview', desc: 'An overview of the Cambridge BEC (Business English Certificate) programme and its importance was presented to registered students by the Associate Territory Manager for Cambridge.' },
    ],
    publications: [
      { title: 'Multimodal Molecular Logic System: Designed on the Unimolecular Platform of an ICT Based Hydrazone Probe', authors: 'M. Karar, H. V. Barkale, N. Dey', journal: 'ChemPlusChem', year: '2025' },
      { title: 'Evanescent Wave in Multiple Slit Diffraction and n-Array Antennas in Metamaterial using Cesàro Convergence', authors: 'Dr. N. Yuganand', journal: 'Scientific Reports, Nature Portfolio', year: '2023' },
      { title: 'Red Edge Effect of Chalcone Derivatives and Their Application in Bio-Sensing', authors: 'A. Saha, M. Karar, S. Choudhury', journal: 'RSC Advances', year: '2025' },
      { title: 'Probing New Physics in Semileptonic Λb Decays', authors: 'Dr. Atasi Ray', journal: 'Physical Review D, Vol. 99', year: '2019' },
      { title: 'Singularly Perturbed Two-Point Boundary Value Problem by Applying Hyperbolic Descent Dynamic Method', authors: 'Neela Amar Nath', journal: 'International Journal of Engineering Applied Sciences and Technology', year: '2022' },
      { title: 'A Doll\'s House', authors: 'Dr. Nirmala Kumari Velpula', journal: 'Criterion', year: '2017' },
    ],
    publicationsNote: 'A curated selection of faculty publications — full individual publication and patent records are available on each faculty member\'s profile page.',
    facultySubjects: {
      'atasi-ray-hs': 'Physics',
      'ayyadevara-venkata-laxman-rao-hs': 'Physics',
      'ch-lakshmi-rajesh-hs': 'Physics',
      'k-krishnudu-hs': 'Physics',
      'n-yuganand-hs': 'Physics',
      'dr-s-deepthi-hs': 'Physics',
      'sri-ram-shiva-kumar-hs': 'Physics',
      'subhasish-saha-hs': 'Physics',
      'dr-y-anantha-lakshmi-hs': 'Physics',
      'andugula-shilpa-hs': 'Mathematics',
      'ch-achi-reddy-hs': 'Mathematics',
      'g-ravindranath-reddy-hs': 'Mathematics',
      'j-anilreddy-hs': 'Mathematics',
      'l-ratna-priya-hs': 'Mathematics',
      'manduva-sudheer-kumar-hs': 'Mathematics',
      'neela-amar-nath-hs': 'Mathematics',
      'neela-praveen-kumar-hs': 'Mathematics',
      'sujatha-mannava-hs': 'Mathematics',
      'amrita-saha-hs': 'Chemistry',
      'monaj-karar-hs': 'Chemistry',
      'mopur-vijaya-bhaskar-reddy-hs': 'Chemistry',
      'srinivas-indla-hs': 'Chemistry',
      'sumalatha-manne-hs': 'Chemistry',
      'v-haripriya-hs': 'Chemistry',
      'arif-ahammed-hs': 'English',
      'momin-ali-hs': 'English',
      'nirmala-kumari-velpula-hs': 'English',
      'subhadeep-kumar-hs': 'English',
      'umamaheswara-rao-bontha-hs': 'English',
      'veera-raghavulu-t-hs': 'English',
      'vishal-nakka-hs': 'English',
    },
  },
};

export function getDeptData(slug: string): DeptData | undefined {
  return DEPT_DATA[slug];
}
