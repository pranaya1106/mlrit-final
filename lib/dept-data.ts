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

export type DeptData = {
  vision: string;
  mission: string[];
  history: string;
  introduction: string;
  hodMessage: string;
  teachingMethodology: string;
  peos: { id: string; text: string }[];
  labs: Lab[];
  faculty: FacultyMember[];
  achievements: { title: string; desc: string }[];
  committees?: { name: string; members?: string[] }[];
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
    achievements: [
      { title: 'Engineering Project Expo', desc: 'Organised by the IEEE student branch, showcasing innovative final-year projects across AI, IoT and embedded systems domains with participation from 15+ colleges.' },
      { title: 'Technical Quiz, EPICS / Micro Projects', desc: 'Inter-departmental technical quiz and EPICS-based micro project competitions held annually, encouraging hands-on problem solving and rapid prototyping skills.' },
      { title: 'Student Mini Projects Expo / Technical Seminars', desc: 'Department-level expo for 2nd and 3rd year students presenting mini projects, complemented by technical seminars from industry professionals and alumni.' },
      { title: 'CSI Student Chapter Activities', desc: 'Active CSI student chapter conducts workshops, coding competitions and tech talks throughout the academic year.' },
      { title: 'SWAYAM / NPTEL Certifications', desc: 'Department recognised as NPTEL Discipline Star with 140+ faculty and student certifications in a single semester.' },
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
    achievements: [
      { title: 'Data Science Hackathon — National Winners', desc: 'Team MLRIT-DS won first place at the National Data Science Hackathon 2024, developing a predictive model for public health resource allocation using census and hospital data.' },
      { title: 'Kaggle Top Rankings', desc: 'Students consistently rank in the top 2% of Kaggle competitions, with notable finishes in tabular data, time-series forecasting and NLP classification challenges throughout 2023 and 2024.' },
      { title: 'Analytics Vidhya Datahack Competition', desc: 'Department team secured 3rd place at the Analytics Vidhya Datahack 2024, competing against 500+ teams from premier institutions across India in a demand forecasting challenge.' },
      { title: 'Industry Internship Excellence Awards', desc: 'Six students received the Mu Sigma "Insights Champion" award for exceptional performance during their summer internship, with two receiving Pre-Placement Offers upon completion.' },
      { title: 'NPTEL Discipline Star — Data Science', desc: 'Department recognised as NPTEL Discipline Star with 90+ certifications completed in a single semester, covering courses in data analytics, Python, machine learning and statistical inference.' },
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
    achievements: [
      { title: 'Smart India Hackathon — National Finalists', desc: 'Students secured Top 10 ranks in SIH 2024, developing an AI-based crop disease detection system using satellite imagery and deep learning.' },
      { title: 'Google Summer of Code (GSoC)', desc: '4 students selected for GSoC 2024 contributing to open-source ML frameworks including TensorFlow and scikit-learn projects.' },
      { title: 'Hyderabad AI and ML Challenge', desc: 'Team "DeepMind MLRIT" won 1st place at the Hyderabad AI and ML Challenge 2023, competing against 200+ teams from across India.' },
      { title: 'MLRIT AI Club — TechNova Summit', desc: 'The MLRIT AI Club organised "TechNova AI Summit 2024" drawing 1,200+ attendees over two days with industry keynotes and student paper presentations.' },
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
    achievements: [
      { title: 'Centres of Excellence', desc: 'Cadence, MATLAB, Embedded and Robotics, and LabVIEW Centres of Excellence — providing industry-standard training, hands-on experience and certification pathways for students.' },
      { title: 'NBA Accreditation', desc: 'The B.Tech ECE programme holds NBA accreditation, reflecting the department\'s commitment to outcome-based education and continuous quality improvement aligned with the Washington Accord.' },
      { title: 'IEEE and IETE Memberships', desc: 'Active institutional memberships in IETE, ISTE, IEEE and IUCEE — providing students with access to global publications, conferences and networking opportunities.' },
      { title: 'Funded Research Projects', desc: 'Faculty have secured funded research projects in VLSI, embedded systems and signal processing, with student involvement across all major project tracks.' },
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
    achievements: [
      { title: '260 kWp Rooftop Solar Plant', desc: 'A flagship grid-connected rooftop solar installation on campus — operated as both a sustainability initiative and an active research and teaching resource for renewable energy courses.' },
      { title: 'Industry Partnerships', desc: 'Active partnerships and project collaborations with power utilities and electrical equipment manufacturers, supporting student internships and applied research.' },
      { title: 'Acoustically-Designed Classrooms', desc: 'Modern acoustically-designed classrooms and well-equipped laboratories supporting both undergraduate teaching and postgraduate research in EEE.' },
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
    achievements: [
      { title: 'Centres of Excellence — Composites, NDT and Welding', desc: 'Three operational CoEs anchor advanced research in composite materials, non-destructive testing and welding technology — supporting student projects, industry consulting and publications.' },
      { title: 'Mahindra and Pennar Industry Partnerships', desc: 'Active MoUs with Mahindra and Mahindra and Pennar Industries provide internships, joint projects and live shop-floor exposure for students.' },
      { title: 'SAE Baja / Supra Participation', desc: 'Student teams compete annually in SAE Baja and Supra automotive design competitions — designing, fabricating and racing all-terrain and formula-style vehicles.' },
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
    achievements: [
      { title: 'DRDO and Tata Advanced Systems Collaborations', desc: 'Active research collaborations with DRDO and Tata Advanced Systems anchor capstone projects, internships and live aerospace problems for students.' },
      { title: 'UAV Design Competitions', desc: 'Student teams design and fly UAVs in national-level competitions, with successful entries in design, fabrication and autonomous flight categories.' },
      { title: 'Centre for Innovation', desc: 'Dedicated Centre for Innovation supports student-led aerospace prototyping — from propulsion testbeds to composite airframe components.' },
      { title: 'Industry-Linked Research', desc: 'Faculty-led research on smart aerospace systems, propulsion and aircraft structures — frequently in collaboration with Boeing India and IIT Hyderabad.' },
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
    achievements: [
      { title: 'Entrepreneurship Cell (E-Cell)', desc: 'Active E-Cell drives student-led ventures, pitch events and idea labs — supporting capstone business plans and early-stage incubation.' },
      { title: 'Industry Advisory Board', desc: 'Industry advisory board with CXO-level members helps shape curriculum, mentor capstone projects and drive placement linkages.' },
      { title: 'CXO Guest Lecture Series', desc: 'Regular guest lectures from senior leaders across BFSI, IT services and consumer-tech firms expose students to live industry decisions and frameworks.' },
      { title: 'Strong Placement Record', desc: 'The MBA programme has built a strong placement record across services and product firms — with growing presence in analytics, consulting and product management roles.' },
    ],
  },
};

export function getDeptData(slug: string): DeptData | undefined {
  return DEPT_DATA[slug];
}
