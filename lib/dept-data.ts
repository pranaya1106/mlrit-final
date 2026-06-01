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
    faculty: [
      { name: 'Dr. Ajmeera Kiran', role: 'Associate Professor, HOD', specialization: 'Deep Learning, ML, IoT', photo: '/faculty/cse/ajmeera-kiran.jpg' },
      { name: 'Dr. N. Sirisha', role: 'Professor, Associate Dean', specialization: 'Big Data, Network Security', photo: '/faculty/cse/n-sirisha.jpg' },
      { name: 'Dr. V. Thrimurthulu', role: 'Professor', specialization: 'Image Processing, NLP, IoT', photo: '/faculty/cse/v-thrimurthulu.jpg' },
      { name: 'Dr. K. Venkata Subbaiah', role: 'Professor', specialization: 'Wireless Mesh, AI, Security', photo: '/faculty/cse/k-venkata-subbaiah.jpg' },
      { name: 'Dr. Kandrakunta Chinnaiah', role: 'Associate Professor', specialization: 'Bioinformatics, WSN', photo: '/faculty/cse/kandrakunta-chinnaiah.jpg' },
      { name: 'Dr. J. Mahalakshmi', role: 'Associate Professor', specialization: 'Cloud, IoT', photo: '/faculty/cse/j-mahalakshmi.jpeg' },
      { name: 'Dr. G. John Samuel Babu', role: 'Associate Professor', specialization: 'Cloud Computing, IoT', photo: '/faculty/cse/john-samuel-babu.jpg' },
      { name: 'Dr. K. Gagan Kumar', role: 'Associate Professor', specialization: 'Image Processing, ML', photo: '/faculty/cse/k-gagan-kumar.jpg' },
      { name: 'Mr. Sai Krishna', role: 'Associate Professor', photo: '/faculty/cse/sai-krishna.jpg' },
      { name: 'Mr. Nagarjuna Tandra', role: 'Associate Professor', photo: '/faculty/cse/nagarjuna-tandra.jpg' },
      { name: 'Dr. B. Sanjai Prasada Rao', role: 'Associate Professor', specialization: 'Image Processing, ML, DL', photo: '/faculty/cse/b-sanjai-prasad.jpg' },
      { name: 'Dr. T. Venkata Nagaraju', role: 'Associate Professor', photo: '/faculty/cse/t-venkata-nagaraju.jpeg' },
      { name: 'Dr. M. Kalpana Chowdary', role: 'Associate Professor', specialization: 'Image Processing, DL', photo: '/faculty/cse/m-kalpana-chowdary.jpg' },
      { name: 'Mr. B. Devananda Rao', role: 'Associate Professor', photo: '/faculty/cse/b-devananda-rao.jpg' },
      { name: 'Dr. K. Pushpa Rani', role: 'Associate Professor', specialization: 'Deep Learning, NLP', photo: '/faculty/cse/k-pushpa-rani.jpg' },
      { name: 'G. Prabhakara Reddy', role: 'Associate Professor', photo: '/faculty/cse/g-prabhakara-reddy.jpg' },
      { name: 'Mr. M. Srinivasa Rao', role: 'Associate Professor', photo: '/faculty/cse/m-srinivasa-rao.jpg' },
      { name: 'Allam Sangeetha', role: 'Associate Professor', specialization: 'ML, Deep Learning, OS', photo: '/faculty/cse/allam-sangeetha.jpg' },
      { name: 'Miss Guduru Durga Bhavani', role: 'Assistant Professor', photo: '/faculty/cse/guduru-durga-bhavani.jpeg' },
      { name: 'Dr. Shaik Mohammed Ilias', role: 'Assistant Professor', photo: '/faculty/cse/shaik-mohammed-ilias.jpeg' },
      { name: 'Mrs. Sasmita Kumari Pradhan', role: 'Assistant Professor', photo: '/faculty/cse/sasmita-pradhan.png' },
      { name: 'Mr. Boligarla Muralikrishna', role: 'Assistant Professor', photo: '/faculty/cse/b-muralikrishna.jpeg' },
      { name: 'Mrs. B. Ratnamala', role: 'Assistant Professor', photo: '/faculty/cse/b-ratnamala.jpeg' },
      { name: 'Jonnalagadda Chaitanya', role: 'Assistant Professor', photo: '/faculty/cse/j-chaitanya.jpeg' },
      { name: 'Dubasi Jeevitha', role: 'Assistant Professor', photo: '/faculty/cse/d-jeevitha.jpeg' },
      { name: 'D. Tejaswini', role: 'Assistant Professor', photo: '/faculty/cse/d-tejaswini.jpg' },
      { name: 'Mr. Hareesh Pesala', role: 'Assistant Professor', photo: '/faculty/cse/hareesh-pesala.jpg' },
      { name: 'Ramya S Pure', role: 'Assistant Professor', photo: '/faculty/cse/ramya-s-pure.jpg' },
      { name: 'P. Santhosh Kumar', role: 'Assistant Professor', photo: '/faculty/cse/p-santhosh-kumar.jpeg' },
      { name: 'Jetti Sri Lakshmi', role: 'Assistant Professor', photo: '/faculty/cse/jetti-sri-lakshmi.jpg' },
      { name: 'M. S. Sabitha', role: 'Assistant Professor', photo: '/faculty/cse/ms-sabitha.jpg' },
      { name: 'Anishetty Laxmi Prasanna', role: 'Assistant Professor', photo: '/faculty/cse/a-laxmi-prasanna.jpg' },
      { name: 'Mrs. Boddu Srilatha', role: 'Assistant Professor', photo: '/faculty/cse/boddu-srilatha.jpg' },
      { name: 'Mr. V. Balakrishna Reddy', role: 'Assistant Professor', photo: '/faculty/cse/v-balakrishna-reddy.jpg' },
      { name: 'Mr. P. Victor Emmanuel', role: 'Assistant Professor', photo: '/faculty/cse/p-victor-emmanuel.jpg' },
      { name: 'Mrs. M. Vineesha', role: 'Assistant Professor', photo: '/faculty/cse/m-vineesha.jpg' },
      { name: 'Mrs. B. Manjusha', role: 'Assistant Professor', photo: '/faculty/cse/b-manjusha.jpg' },
      { name: 'Mr. M. Srinivasulu', role: 'Assistant Professor', photo: '/faculty/cse/m-srinivasulu.jpg' },
      { name: 'Mr. Nagarjuna Rao Gudelli', role: 'Assistant Professor', photo: '/faculty/cse/nagarjuna-rao-gudelli.jpg' },
      { name: 'Mrs. Swathi', role: 'Assistant Professor', photo: '/faculty/cse/swathi.jpeg' },
      { name: 'Mrs. K. Samatha', role: 'Assistant Professor', photo: '/faculty/cse/k-samatha.jpeg' },
      { name: 'Mrs. A. Nagamani', role: 'Assistant Professor', photo: '/faculty/cse/a-nagamani.jpg' },
      { name: 'Ms. Kranthi Kumari', role: 'Assistant Professor', photo: '/faculty/cse/kranthi-kumari.jpg' },
      { name: 'Ragini Patil', role: 'Assistant Professor', photo: '/faculty/cse/ragini-patil.jpg' },
      { name: 'Lingaiah Suramsetti', role: 'Assistant Professor', photo: '/faculty/cse/lingaiah-suramsetti.png' },
      { name: 'I. Sapthami', role: 'Assistant Professor', photo: '/faculty/cse/i-sapthami.jpg' },
      { name: 'Mr. P. Deepak', role: 'Assistant Professor', photo: '/faculty/cse/p-deepak.jpg' },
      { name: 'Mrs. Jeethu Philip', role: 'Assistant Professor', photo: '/faculty/cse/jeethu-philip.jpg' },
      { name: 'J. Pradeep Kumar', role: 'Assistant Professor', photo: '/faculty/cse/j-pradeep-kumar.jpg' },
      { name: 'Telise Vinod', role: 'Assistant Professor', photo: '/faculty/cse/telise-vinod.jpg' },
      { name: 'Mr. Kukunoor Shekar', role: 'Assistant Professor', photo: '/faculty/cse/kukunoor-shekar.jpg' },
      { name: 'Mr. G. Praveen', role: 'Assistant Professor', photo: '/faculty/cse/g-praveen.jpg' },
      { name: 'S K Lokesh Naik', role: 'Assistant Professor', photo: '/faculty/cse/sk-lokesh-naik.jpg' },
      { name: 'Oruganti Ramesh', role: 'Assistant Professor', photo: '/faculty/cse/oruganti-ramesh.jpg' },
      { name: 'Mrs. Divya Priya Degala', role: 'Assistant Professor', photo: '/faculty/cse/divya-priya-degala.jpg' },
      { name: 'Palelli Purushotham', role: 'Assistant Professor', photo: '/faculty/cse/palelli-purushotham.jpeg' },
      { name: 'Bashetty Suman', role: 'Assistant Professor', photo: '/faculty/cse/bashetty-suman.jpg' },
      { name: 'B. Veda Vidhya', role: 'Assistant Professor', photo: '/faculty/cse/b-veda-vidhya.jpg' },
      { name: 'K. Swetha', role: 'Assistant Professor', photo: '/faculty/cse/k-swetha.jpg' },
      { name: 'E. N. Vijaya Kumari', role: 'Assistant Professor', photo: '/faculty/cse/en-vijaya-kumari.jpg' },
    ],
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
  // CSE-CS (Cyber Security)
  // ═══════════════════════════════════════════════════════════════
  'cse-cs': {
    vision:
      'To be a nationally recognised centre for Cyber Security education, producing ethical, skilled professionals who safeguard digital assets and promote a secure cyberspace.',
    mission: [
      'Deliver rigorous security fundamentals grounded in mathematics, networking and systems — equipping students with deep technical competence in cyber security principles.',
      'Provide hands-on attack-defence training through live red team / blue team exercises, CTF challenges and VAPT simulations that mirror real-world threat landscapes.',
      'Cultivate ethical hacking and compliance awareness, preparing graduates to operate within legal frameworks including ISO 27001, NIST and GDPR.',
      'Drive industry certifications and placement outcomes by forging strong partnerships with EC-Council, NASSCOM, DSCI and leading cyber security employers.',
    ],
    history:
      'Established in 2021 in direct response to the critical shortage of cyber security professionals across government, banking and enterprise sectors, the Department of CSE (Cyber Security) began its first academic year with 60 students and a vision to become the leading Cyber Security school in Telangana. The inaugural batch graduated in 2025, achieving 100% placement across top-tier cyber security firms including Deloitte Cyber, PwC and Wipro CyberSecurity — validating the department\'s rigorous, industry-aligned curriculum from its very first cohort.',
    introduction:
      'The Department of Computer Science and Engineering (Cyber Security) was established in 2021 to address the critical shortage of skilled cyber security professionals in India and globally. Offering B.Tech with an intake of 60 students per year, the programme follows the R25 regulation and is aligned with EC-Council, NASSCOM and DSCI frameworks. The department features a dedicated Ethical Hacking Lab, SOC Simulation Lab and VAPT training infrastructure, ensuring every graduate is industry-ready from day one.',
    hodMessage:
      'Our Cyber Security department trains students in ethical hacking, digital forensics, and SOC operations. As an EC-Council Academic Partner with 5 patents and industry tie-ups with Deloitte, PwC, and Wipro Cyber, we produce certified security professionals ready for the frontlines of cybersecurity.',
    teachingMethodology:
      'The department employs a hands-on, threat-centric pedagogy designed to bridge the gap between academic knowledge and operational security skills. Teaching methodologies include capture-the-flag (CTF) challenges embedded within coursework, live red team / blue team exercises that simulate adversarial attack and defence scenarios, industry-led workshops on SIEM platforms and incident response playbooks, and active participation in bug bounty programmes. Students graduate having operated real security toolchains and managed simulated security incidents from detection through remediation.',
    peos: [
      { id: 'PEO 1', text: 'Apply cryptographic principles and security protocols to design and evaluate secure systems and networks, ensuring confidentiality, integrity, and availability across enterprise and cloud environments.' },
      { id: 'PEO 2', text: 'Conduct penetration testing, digital forensics, and incident response using industry-standard tools and methodologies to identify, contain, and remediate cyber threats in real-world scenarios.' },
      { id: 'PEO 3', text: 'Build ethical, legally compliant cyber security solutions aligned with global standards including ISO 27001, NIST Cybersecurity Framework, and GDPR — contributing to a safer digital society.' },
    ],
    labs: [
      { name: 'Ethical Hacking Lab', desc: 'Kali Linux, Metasploit Framework, Burp Suite Professional, Nmap, Nikto — live attack simulation environments' },
      { name: 'Network Security Lab', desc: 'Wireshark, Snort IDS, pfSense firewall, GNS3 network emulator — packet analysis and perimeter defence' },
      { name: 'Forensics and Incident Response Lab', desc: 'Autopsy, FTK (Forensic Toolkit), Volatility memory forensics — digital evidence acquisition and analysis' },
      { name: 'SOC Simulation Lab', desc: 'Splunk Enterprise, IBM QRadar, SIEM dashboards, threat hunting workflows — Security Operations Centre simulation' },
      { name: 'Cryptography and PKI Lab', desc: 'OpenSSL, GnuPG, HSM simulation, certificate authority setup — cryptographic protocol implementation and key management' },
      { name: 'Cloud Security Lab', desc: 'AWS Security Hub, Azure Defender, IAM policy management, Zero Trust architecture — cloud-native security controls' },
    ],
    faculty: [
      { name: 'Dr. P. Subhashini', role: 'Professor and HOD', photo: '/faculty/cse-cs/p-subhashini.jpg' },
      { name: 'Mr. Atluri Srujan', role: 'Assistant Professor', photo: '/faculty/cse-cs/atluri-srujan.jpg' },
      { name: 'Manisha Kandukuri', role: 'Assistant Professor', photo: '/faculty/cse-cs/manisha-kandukuri.jpg' },
      { name: 'Juttu Suresh', role: 'Assistant Professor', photo: '/faculty/cse-cs/juttu-suresh.jpg' },
      { name: 'K. Shiva Krishna', role: 'Assistant Professor', photo: '/faculty/cse-cs/k-shiva-krishna.jpg' },
      { name: 'Bochu Sandhya', role: 'Assistant Professor', photo: '/faculty/cse-cs/bochu-sandhya.jpg' },
      { name: 'Mrs. Swathi Dendi', role: 'Assistant Professor', photo: '/faculty/cse-cs/swathi-dendi.jpg' },
      { name: 'Mrs. Y. Anjali Satyavati', role: 'Assistant Professor', specialization: 'Cyber Security', photo: '/faculty/cse-cs/y-anjali-satyavati.jpg' },
      { name: 'Irfan Bagawan', role: 'Assistant Professor', photo: '/faculty/cse-cs/irfan-bagawan.jpg' },
      { name: 'Kiran Kumar Reddy A.', role: 'Assistant Professor', photo: '/faculty/cse-cs/kiran-kumar-reddy-a.jpg' },
      { name: 'Ms. Mukku Bhavana', role: 'Assistant Professor', photo: '/faculty/cse-cs/mukku-bhavana.jpg' },
      { name: 'Bolagani Balaji', role: 'Assistant Professor', photo: '/faculty/cse-cs/bolagani-balaji.jpg' },
      { name: 'Ms. D. Tejaswini', role: 'Assistant Professor', specialization: 'Cyber Security', photo: '/faculty/cse-cs/d-tejaswini.jpg' },
      { name: 'Mrs. Ch. Sharonu Pushpa', role: 'Assistant Professor', photo: '/faculty/cse-cs/ch-sharonu-pushpa.jpg' },
      { name: 'G. Umamaheswari', role: 'Assistant Professor', specialization: 'Cyber Security', photo: '/faculty/cse-cs/g-umamaheswari.jpg' },
    ],
    achievements: [
      { title: 'CEH Certification Cohort', desc: 'Inaugural batch achieved a 100% pass rate on the EC-Council Certified Ethical Hacker (CEH) examination, with several students placing in the top 5% globally on the CEH practical exam.' },
      { title: 'National CTF Wins', desc: 'Team CyberDefenders MLRIT secured podium positions at NullCon HackIM, c0c0n CTF and InCTF — establishing the department as a top-tier capture-the-flag programme in South India.' },
      { title: 'Bug Bounty Program', desc: 'Students collectively earned over $25,000 in bug bounties from HackerOne and Bugcrowd programmes, with disclosures in major SaaS platforms and fintech APIs.' },
      { title: 'EC-Council Academic Partnership', desc: 'Department recognised as EC-Council Academic Partner — extending CEH, CHFI and ECSA programmes to students at subsidised rates and granting access to iLabs cloud range.' },
      { title: '100% Placement (Inaugural Batch)', desc: 'The 2025 graduating batch achieved 100% placement across cyber security firms including Deloitte Cyber, PwC Cyber Practice and Wipro CyberSecurity — vindicating the programme model.' },
    ],
    committees: [
      { name: 'Programme Assessment Committee (PAC)' },
      { name: 'Departmental Advisory Committee (DAC)' },
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
    faculty: [
      { name: 'Dr. P. Subhashini', role: 'Professor and HOD' },
      { name: 'Dr. D.B.K. Kamesh', role: 'Professor', photo: '/faculty/cse-ds/d-b-k-kamesh.jpg' },
      { name: 'Dr. Damalla Jyothi', role: 'Associate Professor', photo: '/faculty/cse-ds/damalla-jyothi.jpg' },
      { name: 'Dr. P. Salma Khatoon', role: 'Associate Professor' },
      { name: 'Dr. Veerasekhar Reddy', role: 'Associate Professor', photo: '/faculty/cse-ds/veerasekhar-reddy.jpg' },
      { name: 'Arshiya Begum', role: 'Assistant Professor' },
      { name: 'Tahneyath Ahmed', role: 'Assistant Professor', photo: '/faculty/cse-ds/tahneyath-ahmed.jpg' },
      { name: 'K. Rani', role: 'Assistant Professor', photo: '/faculty/cse-ds/k-rani.jpg' },
      { name: 'Manasaraj', role: 'Assistant Professor', photo: '/faculty/cse-ds/manasaraj.jpg' },
      { name: 'S. Shakina', role: 'Assistant Professor', photo: '/faculty/cse-ds/s-shakina.jpg' },
      { name: 'Sravanthi Anumasula', role: 'Assistant Professor', photo: '/faculty/cse-ds/sravanthi-anumasula.jpg' },
      { name: 'D. Srivalli', role: 'Assistant Professor', photo: '/faculty/cse-ds/d-srivalli.jpg' },
      { name: 'D. Gayathri', role: 'Assistant Professor', photo: '/faculty/cse-ds/d-gayathri.jpg' },
      { name: 'N. Baby Rani', role: 'Assistant Professor', photo: '/faculty/cse-ds/n-baby-rani.jpg' },
      { name: 'Dasari Amulya', role: 'Assistant Professor', photo: '/faculty/cse-ds/dasari-amulya.jpg' },
      { name: 'V. Divya', role: 'Assistant Professor', photo: '/faculty/cse-ds/v-divya.jpg' },
      { name: 'Ms. P. Nishitha', role: 'Assistant Professor', photo: '/faculty/cse-ds/p-nishitha.jpg' },
      { name: 'A. Nirisha', role: 'Assistant Professor', photo: '/faculty/cse-ds/a-nirisha.jpg' },
      { name: 'S. Anudeep', role: 'Assistant Professor', photo: '/faculty/cse-ds/s-anudeep.jpg' },
      { name: 'Ms. Madhavi Banala', role: 'Assistant Professor', photo: '/faculty/cse-ds/madhavi-banala.jpg' },
      { name: 'Mrs. Pallavi Mechineni', role: 'Assistant Professor', photo: '/faculty/cse-ds/pallavi-mechineni.jpg' },
      { name: 'Bochu Sandhya', role: 'Assistant Professor', photo: '/faculty/cse-ds/bochu-sandhya.jpg' },
      { name: 'Mrs. Swathi Dendi', role: 'Assistant Professor', photo: '/faculty/cse-ds/swathi-dendi.jpg' },
      { name: 'Mrs. Banoth Rajeshwari', role: 'Assistant Professor', photo: '/faculty/cse-ds/banoth-rajeshwari.jpg' },
      { name: 'Irfan Bagawan', role: 'Assistant Professor', photo: '/faculty/cse-ds/irfan-bagawan.jpg' },
      { name: 'Kiran Kumar Reddy A.', role: 'Assistant Professor', photo: '/faculty/cse-ds/kiran-kumar-reddy-a.jpg' },
      { name: 'Bolagani Balaji', role: 'Assistant Professor', photo: '/faculty/cse-ds/bolagani-balaji.jpg' },
      { name: 'Malothu Sindhuja', role: 'Assistant Professor', photo: '/faculty/cse-ds/malothu-sindhuja.jpg' },
      { name: 'Hasina Nasrin', role: 'Assistant Professor', photo: '/faculty/cse-ds/hasina-nasrin.jpg' },
      { name: 'Ms. K. Alankruthi', role: 'Assistant Professor', photo: '/faculty/cse-ds/k-alankruthi.jpg' },
      { name: 'Mrs. B. Ravali Reddy', role: 'Assistant Professor', photo: '/faculty/cse-ds/b-ravali-reddy.jpg' },
      { name: 'Mathipogu Ashok Babu', role: 'Assistant Professor', photo: '/faculty/cse-ds/mathipogu-ashok-babu.jpg' },
      { name: 'Mrs. K. Srinija', role: 'Assistant Professor', photo: '/faculty/cse-ds/k-srinija.jpg' },
      { name: 'Bhukya Balakrishna', role: 'Assistant Professor', photo: '/faculty/cse-ds/bhukya-balakrishna.jpg' },
      { name: 'Jangam Nagaraju', role: 'Assistant Professor', photo: '/faculty/cse-ds/jangam-nagaraju.jpg' },
      { name: 'Mary Navyatha Govindu', role: 'Assistant Professor', photo: '/faculty/cse-ds/mary-navyatha-govindu.jpg' },
      { name: 'N. Thulasi Chithra', role: 'Assistant Professor', photo: '/faculty/cse-ds/n-thulasi-chithra.jpg' },
      { name: 'Mrs. S. Parvathi', role: 'Assistant Professor', photo: '/faculty/cse-ds/s-parvathi.jpg' },
      { name: 'N. Sandhya', role: 'Assistant Professor', photo: '/faculty/cse-ds/n-sandhya.jpg' },
      { name: 'Mrs. M. Srividya', role: 'Assistant Professor', photo: '/faculty/cse-ds/m-srividya.jpg' },
      { name: 'Ms. D. Neelima Priyadarshini', role: 'Assistant Professor', photo: '/faculty/cse-ds/d-neelima-priyadarshini.jpg' },
      { name: 'Ms. N. Vijayasri', role: 'Assistant Professor', photo: '/faculty/cse-ds/n-vijayasri.jpg' },
      { name: 'Rowsonara Begum', role: 'Assistant Professor', photo: '/faculty/cse-ds/rowsonara-begum.jpg' },
      { name: 'Mr. Mohd Anwar Ali', role: 'Assistant Professor', photo: '/faculty/cse-ds/mohd-anwar-ali.jpg' },
      { name: 'Ms. B. Sushma', role: 'Assistant Professor', photo: '/faculty/cse-ds/b-sushma.jpg' },
      { name: 'Mr. D. Sandeep', role: 'Assistant Professor', photo: '/faculty/cse-ds/d-sandeep.jpg' },
      { name: 'S. Navya', role: 'Assistant Professor', photo: '/faculty/cse-ds/s-navya.jpg' },
    ],
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
    faculty: [
      { name: 'Dr. Kashi Sai Prasad', role: 'Associate Professor and HOD', photo: '/faculty/aiml/kashi-sai-prasad.jpg' },
      { name: 'Dr. K. Varada Rajkumar', role: 'Professor', photo: '/faculty/aiml/k-varada-rajkumar.jpg' },
      { name: 'Dr. Penubaka Kiran Kumar Reddy', role: 'Professor', specialization: 'Machine learning, Internet of Things, Python', photo: '/faculty/aiml/penubaka-kiran-kumar-reddy.jpg' },
      { name: 'VS Pavan Kumar', role: 'Associate Professor', photo: '/faculty/aiml/vs-pavan-kumar.jpg' },
      { name: 'Bidinamcherla Ammanni', role: 'Associate Professor', specialization: 'Machine Learning', photo: '/faculty/aiml/bidinamcherla-ammanni.jpg' },
      { name: 'Dr. Sivakrishna Kondaveeti', role: 'Associate Professor', photo: '/faculty/aiml/sivakrishna-kondaveeti.jpg' },
      { name: 'G. Sowmya', role: 'Associate Professor', photo: '/faculty/aiml/g-sowmya.jpg' },
      { name: 'Singanamala Priyanka', role: 'Assistant Professor', photo: '/faculty/aiml/singanamala-priyanka.jpg' },
      { name: 'Pasupuleti Pavani', role: 'Assistant Professor', specialization: 'Web Technologies, Natural Language Processing', photo: '/faculty/aiml/pasupuleti-pavani.jpg' },
      { name: 'Remedi Sravani', role: 'Assistant Professor', photo: '/faculty/aiml/remedi-sravani.jpg' },
      { name: 'Lakshmi Saritha', role: 'Assistant Professor', photo: '/faculty/aiml/lakshmi-saritha.jpg' },
      { name: 'Komari Biksheswara Rao', role: 'Assistant Professor', photo: '/faculty/aiml/komari-biksheswara-rao.jpg' },
      { name: 'E. Raghavender', role: 'Assistant Professor', photo: '/faculty/aiml/e-raghavender.jpg' },
      { name: 'Seedarla Sandhya Rani', role: 'Assistant Professor', photo: '/faculty/aiml/seedarla-sandhya-rani.jpg' },
      { name: 'Shaik Gouse Pasha', role: 'Assistant Professor', photo: '/faculty/aiml/shaik-gouse-pasha.jpg' },
      { name: 'M. Lakshmi Saranya', role: 'Assistant Professor', photo: '/faculty/aiml/m-lakshmi-saranya.jpg' },
      { name: 'Pottapinjara Babu', role: 'Assistant Professor', photo: '/faculty/aiml/pottapinjara-babu.jpg' },
      { name: 'B. Mamatha', role: 'Assistant Professor', photo: '/faculty/aiml/b-mamatha.jpg' },
      { name: 'T. Aswani', role: 'Assistant Professor', specialization: 'Java, Operating Systems', photo: '/faculty/aiml/t-aswani.jpg' },
      { name: 'Ravi Gangadharolla', role: 'Assistant Professor', photo: '/faculty/aiml/ravi-gangadharolla.jpg' },
      { name: 'Pacha Swathi', role: 'Assistant Professor', specialization: 'Machine learning', photo: '/faculty/aiml/pacha-swathi.jpg' },
      { name: 'T. Nagini', role: 'Assistant Professor', photo: '/faculty/aiml/t-nagini.jpg' },
      { name: 'H. Ramanjineyulu', role: 'Assistant Professor', photo: '/faculty/aiml/h-ramanjineyulu.jpg' },
      { name: 'Talari Meena', role: 'Assistant Professor', photo: '/faculty/aiml/talari-meena.jpg' },
      { name: 'Nemala Jayasri', role: 'Assistant Professor', photo: '/faculty/aiml/nemala-jayasri.jpg' },
      { name: 'Gunda Aishwarya', role: 'Assistant Professor', photo: '/faculty/aiml/gunda-aishwarya.jpg' },
      { name: 'P. Lokesh Kumar', role: 'Assistant Professor', photo: '/faculty/aiml/p-lokesh-kumar.jpg' },
      { name: 'J. Teja', role: 'Assistant Professor', photo: '/faculty/aiml/j-teja.jpg' },
      { name: 'Mrs. K. Anusha', role: 'Assistant Professor', specialization: 'Machine Learning, Deep Learning', photo: '/faculty/aiml/k-anusha.jpg' },
      { name: 'Mr. R. Akhilesh Reddy', role: 'Assistant Professor', photo: '/faculty/aiml/r-akhilesh-reddy.jpg' },
      { name: 'P. Sai Kumar', role: 'Assistant Professor', photo: '/faculty/aiml/p-sai-kumar.jpg' },
      { name: 'Damala Obulesu', role: 'Assistant Professor', photo: '/faculty/aiml/damala-obulesu.jpg' },
      { name: 'Bhaskar Mekala', role: 'Assistant Professor', photo: '/faculty/aiml/bhaskar-mekala.jpg' },
      { name: 'Masigari Nagalakshmi', role: 'Assistant Professor', photo: '/faculty/aiml/masigari-nagalakshmi.jpg' },
      { name: 'Y. Naveen', role: 'Assistant Professor', photo: '/faculty/aiml/y-naveen.jpg' },
      { name: 'Kallam Hemanthi', role: 'Assistant Professor', specialization: 'Machine learning', photo: '/faculty/aiml/kallam-hemanthi.jpg' },
      { name: 'Vijay Keerthika', role: 'Assistant Professor', photo: '/faculty/aiml/vijay-keerthika.jpg' },
      { name: 'G. Umamaheswari', role: 'Assistant Professor', photo: '/faculty/aiml/g-umamaheswari.jpg' },
      { name: 'K. Jyothsna Reddy', role: 'Assistant Professor', photo: '/faculty/aiml/k-jyothsna-reddy.jpg' },
    ],
    achievements: [
      { title: 'Smart India Hackathon — National Finalists', desc: 'Students secured Top 10 ranks in SIH 2024, developing an AI-based crop disease detection system using satellite imagery and deep learning.' },
      { title: 'Google Summer of Code (GSoC)', desc: '4 students selected for GSoC 2024 contributing to open-source ML frameworks including TensorFlow and scikit-learn projects.' },
      { title: 'Hyderabad AI and ML Challenge', desc: 'Team "DeepMind MLRIT" won 1st place at the Hyderabad AI and ML Challenge 2023, competing against 200+ teams from across India.' },
      { title: 'MLRIT AI Club — TechNova Summit', desc: 'The MLRIT AI Club organised "TechNova AI Summit 2024" drawing 1,200+ attendees over two days with industry keynotes and student paper presentations.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // CSIT
  // ═══════════════════════════════════════════════════════════════
  csit: {
    vision:
      'To produce globally competent CSIT professionals who can apply knowledge from both Computer Science and Information Technology to solve diverse real-world computational problems with ethics and innovation.',
    mission: [
      'Build strong foundations in mathematics, programming, algorithms and systems alongside applied IT disciplines including networks, databases and modern web technologies.',
      'Provide hands-on industry exposure through project-based learning, internships and partnerships with leading IT employers — preparing graduates for diverse computational engineering roles.',
      'Cultivate professional ethics, multi-disciplinary problem-solving and the soft skills required to lead and collaborate effectively in global IT environments.',
      'Encourage research, higher studies and entrepreneurship by fostering self-learning, critical thinking and an innovation-first mindset.',
    ],
    history:
      'CSIT was launched in academic year 2020-2021 with an initial intake of 60 students, in response to industry demand for graduates fluent in both core Computer Science and applied IT. Designed as a single integrated programme rather than separate CSE and IT tracks, CSIT is positioned to serve students who want maximum optionality across the IT industry landscape.',
    introduction:
      'The Department of Computer Science and Information Technology (CSIT) at MLRIT was launched in 2020-2021 with an intake of 60 students per year. The programme deliberately combines the rigorous core of Computer Science with the breadth of Information Technology, so graduates are prepared for roles across software engineering, networking, databases, cloud and modern web stacks. The integrated curriculum gives students a clear edge in placement outcomes compared to single-discipline CSE or IT graduates.',
    hodMessage:
      'Our department combines the best of Computer Science and Information Technology in a single integrated programme. Students gain depth in core CS — algorithms, systems, AI — alongside breadth in IT — networks, databases, cloud, and modern web. The result is graduates who can step into any role across the IT industry and command higher offers than single-discipline counterparts.',
    teachingMethodology:
      'The CSIT programme follows a project-driven pedagogy that interleaves theory with hands-on labs in every semester. Students build real software systems — from low-level systems programming through to full-stack web applications, mobile apps and cloud-native services — and present their work in capstone reviews to industry mentors. Teaching is supplemented with workshops on emerging stacks, hackathons and structured internship rotations from the third year onwards.',
    peos: [
      { id: 'PEO 1', text: 'Apply knowledge and skills from both Computer Science and Information Technology to solve diverse computational engineering problems across software, systems, networks, and data domains.' },
      { id: 'PEO 2', text: 'Apply acquired skills across multi-disciplinary domains while operating ethically and meeting evolving social challenges in the global IT industry.' },
      { id: 'PEO 3', text: 'Demonstrate the soft skills, professional values, and adaptability required to excel in diverse global work environments and pursue lifelong learning.' },
    ],
    labs: [
      { name: 'Programming and Data Structures Lab', desc: 'C, C++ and Python labs for foundational programming, DSA and algorithmic problem solving' },
      { name: 'Web Technologies Lab', desc: 'Full-stack web development — React, Node.js, REST APIs, modern build tooling' },
      { name: 'Networks and Cyber Security Lab', desc: 'Cisco Packet Tracer, Wireshark and security tooling for hands-on networking and defensive exercises' },
      { name: 'Database Systems Lab', desc: 'PostgreSQL, MongoDB and Oracle — relational and NoSQL design, query optimisation' },
      { name: 'Cloud and DevOps Lab', desc: 'AWS, Docker, Kubernetes and CI/CD pipelines for cloud-native deployment workflows' },
    ],
    faculty: [
      { name: 'Dr. D.B.K. Kamesh', role: 'Professor and HOD', photo: '/faculty/csit/d-b-k-kamesh.jpg' },
      { name: 'Ms. P. Nishitha', role: 'Assistant Professor', photo: '/faculty/csit/p-nishitha.jpg' },
      { name: 'D. Rajeshwari', role: 'Assistant Professor', specialization: 'E-Commerce, Information Retrieval System, Cloud Essentials', photo: '/faculty/csit/d-rajeshwari.jpg' },
      { name: 'A. Nirisha', role: 'Assistant Professor', photo: '/faculty/csit/a-nirisha.jpg' },
      { name: 'P. Poojasree', role: 'Assistant Professor', specialization: 'Devops, Python, Production Support', photo: '/faculty/csit/p-poojasree.jpg' },
      { name: 'Rajkumar Bhookya', role: 'Assistant Professor', specialization: 'Image processing, Deep learning, Cloud - Devops', photo: '/faculty/csit/rajkumar-bhookya.jpg' },
      { name: 'Devolla Manogna', role: 'Assistant Professor', specialization: 'Programming languages, Computer Networks, and Cyber Security', photo: '/faculty/csit/devolla-manogna.jpg' },
      { name: 'S. Anudeep', role: 'Assistant Professor', photo: '/faculty/csit/s-anudeep.jpg' },
      { name: 'Banothu Seva', role: 'Assistant Professor', specialization: 'Programming languages, Computer Networks, and Cyber Security', photo: '/faculty/csit/banothu-seva.jpg' },
      { name: 'Ms. Madhavi Banala', role: 'Assistant Professor', photo: '/faculty/csit/madhavi-banala.jpg' },
      { name: 'N. Thulasi Chithra', role: 'Assistant Professor', photo: '/faculty/csit/n-thulasi-chithra.jpg' },
      { name: 'V. Srikanth', role: 'Assistant Professor', specialization: 'Artificial Intelligence, Machine Learning', photo: '/faculty/csit/v-srikanth.jpg' },
      { name: 'T. Gandhi', role: 'Assistant Professor', specialization: 'Machine Learning', photo: '/faculty/csit/t-gandhi.jpg' },
      { name: 'Mrs. T. Mounika', role: 'Assistant Professor', specialization: 'Machine Learning', photo: '/faculty/csit/t-mounika.jpg' },
      { name: 'Mrs. S. Parvathi', role: 'Assistant Professor', photo: '/faculty/csit/s-parvathi.jpg' },
      { name: 'N. Sandhya', role: 'Assistant Professor', photo: '/faculty/csit/n-sandhya.jpg' },
      { name: 'Mrs. M. Srividya', role: 'Assistant Professor', photo: '/faculty/csit/m-srividya.jpg' },
      { name: 'Ms. D. Neelima Priyadarshini', role: 'Assistant Professor', photo: '/faculty/csit/d-neelima-priyadarshini.jpg' },
      { name: 'Ms. N. Vijayasri', role: 'Assistant Professor', photo: '/faculty/csit/n-vijayasri.jpg' },
      { name: 'S. Navya', role: 'Assistant Professor', photo: '/faculty/csit/s-navya.jpg' },
    ],
    achievements: [
      { title: 'Hackathon Wins', desc: 'CSIT students have placed in the top 10 at multiple national hackathons including Smart India Hackathon and Hack-the-North editions across 2023 and 2024.' },
      { title: 'Multi-Disciplinary Capstones', desc: 'Capstone projects routinely span CS and IT domains — full-stack apps with ML backends, secure cloud microservices and analytics dashboards — earning recognition from industry mentors.' },
      { title: 'Strong Placement Outcomes', desc: 'The integrated curriculum has translated into placement offers across software engineering, full-stack development, cloud engineering and IT services roles at competitive packages.' },
    ],
    committees: [
      { name: 'Vision and Mission Committee' },
      { name: 'Departmental Advisory Committee (DAC)' },
      { name: 'Programme Assessment Committee (PAC)' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // IT
  // ═══════════════════════════════════════════════════════════════
  it: {
    vision:
      'To build an IT department committed to continuous improvement that adapts swiftly to 21st-century challenges by developing professionals with robust technical and research backgrounds.',
    mission: [
      'Provide a quality teaching-learning environment that builds proficiency in theoretical and applied IT foundations.',
      'Create skilled IT engineers capable of research and developing solutions for national betterment.',
      'Instil professional and ethical values and a sense of social responsibility among students.',
      'Develop entrepreneurial skills and motivate the pursuit of higher studies and lifelong learning.',
    ],
    history:
      'The Department of Information Technology was established in 2005 with an intake of 60, growing over the years to its current intake of 180 students per year. Two decades of consistent investment in faculty, labs and industry tie-ups have produced thousands of alumni serving across software engineering, systems and emerging IT roles globally.',
    introduction:
      'The Department of Information Technology was established in 2005 with an initial intake of 60, expanded to 180 students per year. The department offers a 4-year B.Tech programme designed to produce industry-ready software engineers through creative teaching, structured in-house training and a deliberate focus on personality development — combining theoretical depth, applied skills and the general competencies required to thrive in the IT industry.',
    hodMessage:
      'The IT department has produced quality engineers since 2005. Our pedagogy combines rigorous theoretical foundations with applied skills, in-house training programmes, and personality development — so graduates step into IT industry roles confident, well-rounded, and industry-ready from day one.',
    teachingMethodology:
      'The IT department combines lecture-based theory with structured in-house training, creative teaching techniques and continuous evaluation. Students benefit from skill-building workshops, certification programmes and personality-development modules embedded across the curriculum — preparing them not only for technical interviews but for long-term success in industry roles.',
    peos: [
      { id: 'PEO 1', text: 'Be successfully employed as software engineers in the IT industry, applying knowledge of computing and engineering principles to deliver real-world software solutions.' },
      { id: 'PEO 2', text: 'Become successful entrepreneurs, project leaders, and team members who assume leadership positions and contribute to the IT industry and society.' },
      { id: 'PEO 3', text: 'Progress through advanced degree or certificate programmes in engineering and related fields, demonstrating commitment to lifelong learning.' },
    ],
    labs: [
      { name: 'Programming and Web Lab', desc: 'C, Java, Python and full-stack web technologies for foundational and applied programming work' },
      { name: 'Networks Lab', desc: 'Computer networks, protocol simulation and packet analysis with Cisco Packet Tracer and Wireshark' },
      { name: 'Database Lab', desc: 'Oracle, MySQL and MongoDB — relational and NoSQL design, queries and optimisation' },
      { name: 'Cloud and DevOps Lab', desc: 'AWS, Docker, Kubernetes and CI/CD pipelines for modern cloud-native workflows' },
      { name: 'IT Project Lab', desc: 'Capstone and mini-project workstations equipped for full-stack, mobile and analytics projects' },
    ],
    faculty: [
      { name: 'Dr. N V Raja Sekhar Reddy', role: 'Professor and HOD', specialization: 'Wireless Networks, Cloud Computing', photo: '/faculty/it/n-v-raja-sekhar-reddy.jpg' },
      { name: 'Dr. Dhilli Rao Gorja', role: 'Associate Professor', specialization: 'Organic Synthesis, Chemical Biology, Cancer Research', photo: '/faculty/it/dhilli-rao-gorja.jpg' },
      { name: 'Mrs. K. Neeraja', role: 'Associate Professor' },
      { name: 'Mr. Vikram Raju', role: 'Associate Professor' },
      { name: 'Dr. Mopur Vijaya Bhaskar Reddy', role: 'Associate Professor', photo: '/faculty/it/mopur-vijaya-bhaskar-reddy.jpg' },
      { name: 'Mrs. IVS. Haritha', role: 'Assistant Professor' },
      { name: 'Mrs. G. Anitha', role: 'Assistant Professor' },
      { name: 'Vemuri Nitin', role: 'Assistant Professor', specialization: 'Data Mining', photo: '/faculty/it/vemuri-nitin.jpg' },
      { name: 'Mrs. Shruthi Patel', role: 'Assistant Professor', photo: '/faculty/it/shruthi-patel.jpg' },
      { name: 'Mr. D. Sandeep', role: 'Assistant Professor', photo: '/faculty/it/d-sandeep.jpg' },
      { name: 'J. Adilakshmi', role: 'Assistant Professor', photo: '/faculty/it/j-adilakshmi.jpg' },
      { name: 'Bhasker Boddu', role: 'Assistant Professor', specialization: 'Computer Science and Engineering', photo: '/faculty/it/bhasker-boddu.jpg' },
      { name: 'P. Laxmaiah', role: 'Assistant Professor', photo: '/faculty/it/p-laxmaiah.jpg' },
      { name: 'B. Varija', role: 'Assistant Professor', photo: '/faculty/it/b-varija.jpg' },
      { name: 'Ms. B. Sushma', role: 'Assistant Professor', photo: '/faculty/it/b-sushma.jpg' },
      { name: 'G. Sathyanarayan', role: 'Assistant Professor', photo: '/faculty/it/g-sathyanarayan.jpg' },
      { name: 'Mr. Mohd Anwar Ali', role: 'Assistant Professor', photo: '/faculty/it/mohd-anwar-ali.jpg' },
      { name: 'M. Harshini', role: 'Assistant Professor', photo: '/faculty/it/m-harshini.jpg' },
      { name: 'J. Shubangi', role: 'Assistant Professor' },
      { name: 'Agosh M C', role: 'Faculty' },
      { name: 'Venkatesh G', role: 'Faculty' },
      { name: 'Hm Lijo Mon', role: 'Faculty' },
    ],
    achievements: [
      { title: 'Two Decades of IT Engineers', desc: 'Since 2005 the department has graduated thousands of alumni serving across software engineering, systems, networking and emerging IT roles globally — including leadership positions at Tier-1 IT services firms.' },
      { title: 'NPTEL / SWAYAM Certifications', desc: 'Sustained high participation in NPTEL and SWAYAM certification courses across operating systems, networks, databases and modern web development.' },
      { title: 'Industry Internships', desc: 'Strong internship pipeline into Tier-1 IT services firms — TCS, Infosys, Wipro, Cognizant — converted into full-time roles for many students.' },
    ],
    committees: [
      { name: 'Vision and Mission Committee' },
      { name: 'Departmental Advisory Committee (DAC)' },
      { name: 'Programme Assessment Committee (PAC)' },
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
    faculty: [
      { name: 'Dr. S V S Prasad', role: 'Professor, HOD', specialization: 'Image Processing, VLSI, Signal Processing', photo: '/faculty/ece/svs-prasad.jpg' },
      { name: 'Dr. Shrikant Upadhyay', role: 'Associate Professor', specialization: 'Embedded Systems, IoT', photo: '/faculty/ece/shrikant-upadhyay.jpg' },
      { name: 'Dr. Kiran Chand Ravi', role: 'Associate Professor', specialization: 'Wireless Communications', photo: '/faculty/ece/kiran-chand.jpeg' },
      { name: 'Dr. G. Karthik Reddy', role: 'Associate Professor', specialization: 'Digital Image Processing', photo: '/faculty/ece/karthik-reddy.jpg' },
      { name: 'Dr. T. Vijetha', role: 'Associate Professor', photo: '/faculty/ece/t-vijetha.jpg' },
      { name: 'Dr. P. Yakaiah', role: 'Associate Professor', photo: '/faculty/ece/p-yakaiah.jpg' },
      { name: 'Dr. K. Nishanth Rao', role: 'Associate Professor', photo: '/faculty/ece/k-nishanth-rao.jpg' },
      { name: 'Rudraram Divya', role: 'Assistant Professor', photo: '/faculty/ece/rudraram-divya.jpg' },
      { name: 'Pullela Sravani', role: 'Assistant Professor', photo: '/faculty/ece/pullela-sravani.jpg' },
      { name: 'M. Nagendra Babu', role: 'Assistant Professor', photo: '/faculty/ece/nagendra-babu.jpg' },
      { name: 'G. Venkata Subba Reddy', role: 'Assistant Professor', photo: '/faculty/ece/gv-subba-reddy.jpg' },
      { name: 'Akhila Akula', role: 'Assistant Professor', photo: '/faculty/ece/akhila-akula.jpg' },
      { name: 'Ms. Mary Kannidi', role: 'Assistant Professor', photo: '/faculty/ece/mary-kannidi.jpeg' },
      { name: 'Mr. S. Naveen Kumar', role: 'Assistant Professor', photo: '/faculty/ece/s-naveen-kumar.jpg' },
      { name: 'Mr. Khobragade Pithamber', role: 'Assistant Professor', photo: '/faculty/ece/khobragade-pithamber.jpg' },
      { name: 'Mr. K. Purushotham', role: 'Assistant Professor', photo: '/faculty/ece/k-purushotham.jpg' },
      { name: 'Dr. Y. Sivaramakrishna', role: 'Assistant Professor', photo: '/faculty/ece/y-sivaramakrishna.jpg' },
      { name: 'Dr. Ganesh Miriyala', role: 'Assistant Professor', photo: '/faculty/ece/ganesh-miriyala.jpg' },
      { name: 'Dr. Velpula Vijaya Kumar', role: 'Assistant Professor', photo: '/faculty/ece/velpula-vijaya-kumar.jpg' },
      { name: 'Mrs. Pinnamaraju Sahitya', role: 'Assistant Professor', photo: '/faculty/ece/sahitya.jpg' },
      { name: 'Mr. Ladi Sandip Kumar Patra', role: 'Assistant Professor', photo: '/faculty/ece/sandip-kumar.jpg' },
      { name: 'Mr. Vadla Arun Kumar', role: 'Assistant Professor', photo: '/faculty/ece/vadla-arun-kumar.jpg' },
      { name: 'Dr. Manoj Kumar', role: 'Assistant Professor', photo: '/faculty/ece/manoj-kumar.jpg' },
      { name: 'Ms. Badepalli Sireesha', role: 'Assistant Professor', photo: '/faculty/ece/b-sireesha.jpg' },
      { name: 'Mrs. N. Poornima Deepthi', role: 'Assistant Professor', photo: '/faculty/ece/n-poornima-deepthi.jpg' },
      { name: 'Mr. B. Kiran Kumar', role: 'Assistant Professor', photo: '/faculty/ece/b-kiran-kumar.jpg' },
      { name: 'Mr. G. Kaushik', role: 'Assistant Professor', photo: '/faculty/ece/g-kaushik.jpg' },
      { name: 'Mrs. Geetha Yerramsetti', role: 'Assistant Professor', photo: '/faculty/ece/geetha-yerramsetti.jpg' },
      { name: 'Mr. M. Raju Naik', role: 'Assistant Professor', photo: '/faculty/ece/m-raju-naik.jpg' },
      { name: 'Mr. K. Maniraj', role: 'Assistant Professor', photo: '/faculty/ece/k-maniraj.jpg' },
      { name: 'Mr. Sudhakar Ajmera', role: 'Assistant Professor', photo: '/faculty/ece/sudhakar-ajmera.jpg' },
      { name: 'Ms. Badepalli Anusha', role: 'Assistant Professor', photo: '/faculty/ece/b-anusha.jpg' },
      { name: 'Mr. Chinthakindi Babaiah', role: 'Assistant Professor', photo: '/faculty/ece/chinthakindi-babaiah.jpeg' },
      { name: 'Mr. Rayala Sateesh', role: 'Assistant Professor', photo: '/faculty/ece/rayala-sateesh.jpg' },
      { name: 'Mrs. S. Monika', role: 'Assistant Professor', photo: '/faculty/ece/s-monika.jpg' },
      { name: 'Mr. K. Hari Babu', role: 'Assistant Professor', photo: '/faculty/ece/k-hari-babu.png' },
    ],
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
    faculty: [
      { name: 'Prof. Ashok Kumar Cheeli', role: 'Professor & HOD', specialization: 'Communication Engg, VLSI, Fiber Optics', photo: '/faculty/eee/ashok-kumar.jpg' },
      { name: 'Dr. M. Dileep Kumar', role: 'Associate Professor', specialization: 'Power Electronics, Drives', photo: '/faculty/eee/dileep-kumar.jpg' },
      { name: 'Ashok Reddy Kanna', role: 'Associate Professor' },
      { name: 'K. Usha Rani', role: 'Associate Professor' },
      { name: 'Dr. Sumana Das', role: 'Associate Professor', photo: '/faculty/eee/sumana-das.jpeg' },
      { name: 'Dr. B. V. Rajanna', role: 'Associate Professor', photo: '/faculty/eee/bv-rajanna.jpg' },
      { name: 'Dr. T. Bhargava Ramu', role: 'Associate Professor', photo: '/faculty/eee/t-bhargava-ramu.jpg' },
      { name: 'Dr. Sonu Kumar', role: 'Assistant Professor', photo: '/faculty/eee/sonu-kumar.jpeg' },
      { name: 'Dr. Y. Lalitha Kameswari', role: 'Assistant Professor', photo: '/faculty/eee/y-lalitha-kameswari.jpeg' },
      { name: 'T. Mrudula', role: 'Assistant Professor', photo: '/faculty/eee/t-mrudula.jpg' },
      { name: 'N. Karthik', role: 'Assistant Professor', photo: '/faculty/eee/n-karthik.jpg' },
      { name: 'P. Jithendar', role: 'Assistant Professor', photo: '/faculty/eee/p-jithendar.jpg' },
      { name: 'A. Yadagiri', role: 'Assistant Professor', photo: '/faculty/eee/a-yadagiri.jpg' },
      { name: 'K. Rajasri', role: 'Assistant Professor', photo: '/faculty/eee/k-rajasri.jpg' },
      { name: 'A. Shubhangi Rao', role: 'Assistant Professor', photo: '/faculty/eee/a-shubhangi-rao.jpg' },
      { name: 'Dr. CH. Srivardhan Kumar', role: 'Assistant Professor', photo: '/faculty/eee/ch-srivardhan-kumar.jpg' },
      { name: 'M. Sreenivasa Reddy', role: 'Associate Professor', photo: '/faculty/eee/m-sreenivasa-reddy.jpg' },
    ],
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
    faculty: [
      { name: 'Dr. J. Krishnaraj', role: 'Professor, HOD', specialization: 'Manufacturing Engg, Composites, NDT', photo: '/faculty/mechanical/krishnaraj.jpg' },
      { name: 'Dr. N. Prabhu Kishore', role: 'Associate Professor', specialization: 'Heat Transfer, IC Engines', photo: '/faculty/mechanical/prabhu-kishore.jpeg' },
      { name: 'Dr. Ch. Ravi Kiran', role: 'Associate Professor', specialization: 'Manufacturing, CAD/CAM', photo: '/faculty/mechanical/ravi-kiran.jpg' },
      { name: 'Dr. Harikishor Kumar', role: 'Associate Professor', specialization: 'Machine Design, FEM', photo: '/faculty/mechanical/harikishor.jpg' },
      { name: 'Dr. K. Limbadri', role: 'Associate Professor', photo: '/faculty/mechanical/k-limbadri.jpg' },
      { name: 'Dr. Pramod Kumar P', role: 'Associate Professor', photo: '/faculty/mechanical/pramod-kumar.jpg' },
      { name: 'Dr. Lokasani Bhanuprakash', role: 'Associate Professor', photo: '/faculty/mechanical/lokasani-bhanuprakash.jpg' },
      { name: 'Dr. Alli Anil Kumar', role: 'Assistant Professor', photo: '/faculty/mechanical/alli-anil-kumar.jpg' },
      { name: 'Mrs. Laxmi', role: 'Assistant Professor', photo: '/faculty/mechanical/laxmi.jpg' },
      { name: 'Mr. Chintala Muralikrishna', role: 'Assistant Professor', photo: '/faculty/mechanical/chintala-muralikrishna.jpg' },
      { name: 'Mr. J. Sunil Kumar', role: 'Assistant Professor', photo: '/faculty/mechanical/j-sunil-kumar.jpg' },
      { name: 'J. Laxmi Prasad', role: 'Assistant Professor', photo: '/faculty/mechanical/j-laxmi-prasad.jpg' },
      { name: 'Mr. N E Chandra Prasad', role: 'Assistant Professor', photo: '/faculty/mechanical/ne-chandra-prasad.jpg' },
      { name: 'Mr. Mudhuganti Mahender', role: 'Assistant Professor', photo: '/faculty/mechanical/mudhuganti-mahender.jpg' },
      { name: 'Dr. G. Chandramohana Reddy', role: 'Assistant Professor', photo: '/faculty/mechanical/g-chandramohana-reddy.jpg' },
      { name: 'Mr. M. Sundeep', role: 'Assistant Professor', photo: '/faculty/mechanical/m-sundeep.jpg' },
      { name: 'Mr. S. Nagaraju', role: 'Assistant Professor', photo: '/faculty/mechanical/s-nagaraju.jpg' },
      { name: 'Mr. G. Anandarao', role: 'Assistant Professor', photo: '/faculty/mechanical/g-anandarao.jpg' },
      { name: 'Mr. G. Venkata Rambabu', role: 'Assistant Professor', photo: '/faculty/mechanical/g-venkata-rambabu.jpg' },
      { name: 'Mr. M. Venkateswar Reddy', role: 'Assistant Professor', photo: '/faculty/mechanical/m-venkateswar-reddy.jpg' },
    ],
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
    faculty: [
      { name: 'Dr. M. Satyanarayana Gupta', role: 'HOD, Professor', specialization: 'FEM, Machine Design, Smart Aerospace', photo: '/faculty/aeronautical/satyanarayana.jpg' },
      { name: 'Dr. A. Vivek Anand', role: 'Professor, Dean', specialization: 'Propulsion, Gas Turbines', photo: '/faculty/aeronautical/vivek-anand.jpg' },
      { name: 'K. Veeranjaneyulu', role: 'Professor', specialization: 'Aircraft Structures, FEM', photo: '/faculty/aeronautical/veeranjaneyulu.jpg' },
      { name: 'Dr. R. Arvind Singh', role: 'Professor of Eminence', specialization: 'Flight Dynamics, Control', photo: '/faculty/aeronautical/arvind-singh.jpg' },
      { name: 'Dr. S. Jayalakshmi', role: 'Professor of Eminence', photo: '/faculty/aeronautical/s-jayalakshmi.jpg' },
      { name: 'Dr. Thangavel Sanjeeviraja', role: 'Associate Professor', photo: '/faculty/aeronautical/thangavel-sanjeeviraja.jpeg' },
      { name: 'Nayani Uday Ranjan Goud', role: 'Associate Professor', photo: '/faculty/aeronautical/nayani-uday-ranjan.jpg' },
      { name: 'Swetha Bala MNVS', role: 'Associate Professor, Associate Dean', photo: '/faculty/aeronautical/swetha-bala.jpg' },
      { name: 'Dr. Saiprakash', role: 'Associate Professor', photo: '/faculty/aeronautical/saiprakash.jpg' },
      { name: 'M. Ganesh', role: 'Associate Professor', photo: '/faculty/aeronautical/m-ganesh.jpg' },
      { name: 'Mr. Yelamasetti Balram', role: 'Assistant Professor', photo: '/faculty/aeronautical/yelamasetti-balram.jpg' },
      { name: 'Sreekanth Sura', role: 'Assistant Professor', photo: '/faculty/aeronautical/sreekanth-sura.jpg' },
      { name: 'Ms. G. Sravanthi', role: 'Assistant Professor', photo: '/faculty/aeronautical/g-sravanthi.jpeg' },
      { name: 'Mr. B. Manideep', role: 'Assistant Professor', photo: '/faculty/aeronautical/b-manideep.jpg' },
      { name: 'Nirmith Kumar Mishra', role: 'Assistant Professor', photo: '/faculty/aeronautical/nirmith-kumar-mishra.jpg' },
      { name: 'A. Udaya Deepika', role: 'Assistant Professor', photo: '/faculty/aeronautical/a-udaya-deepika.jpg' },
      { name: 'K. Arun Kumar', role: 'Assistant Professor', photo: '/faculty/aeronautical/k-arun-kumar.jpg' },
      { name: 'B. Nagaraj Goud', role: 'Assistant Professor', photo: '/faculty/aeronautical/b-nagaraj-goud.jpg' },
      { name: 'A. Sai Kumar', role: 'Assistant Professor', photo: '/faculty/aeronautical/a-sai-kumar.jpg' },
    ],
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
    faculty: [
      { name: 'Dr. N. Ramanjaneyulu', role: 'Professor, HOD', specialization: 'Strategic Management, Leadership', photo: '/faculty/mba/ramanjaneyulu.jpeg' },
      { name: 'Dr. M. V. Narasimha Rao', role: 'Professor', specialization: 'Finance, Banking, Fintech', photo: '/faculty/mba/narasimha-rao.jpg' },
      { name: 'Dr. G. Aruna', role: 'Professor', specialization: 'Marketing, Consumer Behaviour', photo: '/faculty/mba/aruna.jpg' },
      { name: 'M. Umrez', role: 'Associate Professor', specialization: 'HR Management, OB', photo: '/faculty/mba/umrez.jpg' },
      { name: 'Dr. M. Tirupalaiah', role: 'Associate Professor', photo: '/faculty/mba/m-tirupalaiah.jpg' },
      { name: 'Dr. Jostna Kumar Gantepogu', role: 'Assistant Professor', photo: '/faculty/mba/jostna-kumar.jpg' },
      { name: 'Dr. Vasudha Kurikala', role: 'Assistant Professor', photo: '/faculty/mba/vasudha-kurikala.jpg' },
      { name: 'Mr. A. Koti Reddy', role: 'Assistant Professor', photo: '/faculty/mba/a-koti-reddy.jpg' },
      { name: 'Mr. M. Parsharamulu', role: 'Assistant Professor', photo: '/faculty/mba/m-parsharamulu.jpg' },
      { name: 'Mr. B. S. Venkat Narayana', role: 'Assistant Professor', photo: '/faculty/mba/bs-venkat-narayana.jpg' },
      { name: 'B. Vishnu Prasad', role: 'Assistant Professor', photo: '/faculty/mba/b-vishnu-prasad.jpg' },
      { name: 'Dr. K. Rajya Lakshmi', role: 'Assistant Professor', photo: '/faculty/mba/k-rajya-lakshmi.jpg' },
      { name: 'Mrs. Sudha Rani N', role: 'Assistant Professor', photo: '/faculty/mba/sudha-rani.jpeg' },
      { name: 'N. Madhusudhanarao', role: 'Assistant Professor', photo: '/faculty/mba/n-madhusudhanarao.jpg' },
      { name: 'Mr. Ram Narsa Goud', role: 'Assistant Professor', photo: '/faculty/mba/ram-narsa-goud.jpg' },
    ],
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
