#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update facultyDB - CSE faculty + remaining ECE/Mech/Aero/Fresh batch."""
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = 'c:/mlr/homepage/departments/faculty-profile.html'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

def js_str(s):
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')

def journals_js(lst):
    if not lst: return ''
    items = ',\n          '.join('{t: "%s", j: "%s", y: "%s"}' % (js_str(j['t']), js_str(j['j']), js_str(j['y'])) for j in lst)
    return '\n          ' + items

def make_body(key, d):
    folder = d.get('folder', 'cse')
    photo = d.get('photo', f'images/{folder}/{key}.jpg')
    areas_js = ', '.join('"%s"' % js_str(a) for a in d['areas'])
    subj_js  = ', '.join('"%s"' % js_str(s) for s in d['subjects'])
    books_js = ''
    if d.get('books'):
        books_js = ', '.join('{t: "%s", pub: "%s", y: "%s", isbn: "%s"}' % (js_str(b['t']), js_str(b.get('pub','')), js_str(b.get('y','')), js_str(b.get('isbn',''))) for b in d['books'])
    patents_js = ', '.join('"%s"' % js_str(p) for p in d.get('patents', []))
    return (
        'name: "%s", role: "%s", dept: "%s",\n'
        '        photo: "%s", qual: "%s",\n'
        '        email: "%s", exp: "%s", joined: "%s",\n'
        '        areas: [%s],\n'
        '        subjects: [%s],\n'
        '        journals: [%s],\n'
        '        conferences: %d, confTitles: [], books: [%s], patents: [%s], awards: []'
    ) % (
        js_str(d['name']), js_str(d['role']), js_str(d['dept']),
        photo, js_str(d['qual']),
        js_str(d['email']), js_str(d['exp']), js_str(d['joined']),
        areas_js, subj_js,
        journals_js(d['journals']),
        d['conferences'], books_js, patents_js
    )

updates = {

# ─── CSE Faculty ───────────────────────────────────────────────────────────────

'j-mahalakshmi': dict(
    name='Dr. J. Mahalakshmi', role='Associate Professor', dept='Computer Science and Engineering',
    qual='Ph.D (CSE), M.Tech (IT), B.Tech (CSIT)', email='',
    exp='14 years', joined='08-05-2023',
    areas=['Cloud Computing', 'Internet of Things'],
    subjects=['Cryptography and Network Security', 'Operating Systems', 'Data Mining', 'Computer Networks'],
    journals=[], conferences=0, books=[], folder='cse'
),

'allam-sangeetha': dict(
    name='Ms. Allam Sangeetha', role='Associate Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.Tech; Ph.D (Pursuing)', email='sangeetha.a@mlrinstitutions.ac.in',
    exp='12 years', joined='04-03-2021',
    areas=['Machine Learning', 'Deep Learning', 'Operating Systems'],
    subjects=['Machine Learning', 'Deep Learning', 'Operating Systems'],
    journals=[],
    conferences=12,
    books=[{'t': 'Linux Programming', 'pub': 'Lambert Academic Publisher', 'y': '2024', 'isbn': '978-620-7-64950-1'}],
    patents=['Smart irrigation system', 'Sign language recognition', 'Tumor detection', 'Plant selection prediction system'],
    folder='cse'
),

'nagarjuna-tandra': dict(
    name='Mr. Nagarjuna Tandra', role='Associate Professor', dept='Computer Science and Engineering',
    qual='M.Tech (Software Engineering), B.Tech (CSE)', email='nagarjunatandra@mlrit.ac.in',
    exp='12 years', joined='20-06-2023',
    areas=['Software Project Management', 'Database Management System', 'Computer Networks', 'Software Engineering'],
    subjects=['Software Project Management', 'DBMS', 'Computer Networks', 'Operating Systems', 'Software Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'b-devananda-rao': dict(
    name='Mr. B. Devananda Rao', role='Associate Professor', dept='Computer Science and Engineering',
    qual='Ph.D, M.Tech, B.Tech', email='dev.bolleddu@gmail.com',
    exp='16 years', joined='11-08-2021',
    areas=['Computer Science Engineering', 'Compiler Design', 'Data Structures'],
    subjects=['Formal Languages and Automata Theory', 'Compiler Design', 'Design and Analysis of Algorithms', 'Computer Networks', 'Data Structures'],
    journals=[], conferences=0, books=[], folder='cse'
),

'g-prabhakara-reddy': dict(
    name='Mr. G. Prabhakara Reddy', role='Associate Professor', dept='Computer Science and Engineering',
    qual='M.Tech, MSIT, B.Com', email='guntakap@yahoo.com',
    exp='17 years', joined='',
    areas=['Privacy Preserving', 'Data Mining', 'Machine Learning', 'Database Systems'],
    subjects=['Linux Programming', 'Database Management Systems', 'Data Structures', 'Computer Networks', 'Distributed Databases'],
    journals=[
        {'t': 'Privacy Preserving and Data Publishing using Tuple Grouping Algorithm', 'j': 'IJCA', 'y': '2018'},
    ],
    conferences=3, books=[], folder='cse'
),

'm-srinivasa-rao': dict(
    name='Mr. M. Srinivasa Rao', role='Associate Professor', dept='Computer Science and Engineering',
    qual='Ph.D, M.Tech, B.Tech', email='msrinivasarao700@gmail.com',
    exp='25 years', joined='23-11-2016',
    areas=['Network Security', 'Operating Systems', 'Java'],
    subjects=['JAVA', 'Computer Organisation', 'Operating System', 'Linux', 'Network Security', 'Advanced Data Structures'],
    journals=[
        {'t': 'A Case Study Of Secure Embedded Voting System using Biometric', 'j': 'IJCIET (ISSN Online: 0976-6316)', 'y': '2017'},
    ],
    conferences=0, books=[], folder='cse'
),

'sai-krishna': dict(
    name='Mr. Sai Krishna', role='Associate Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSIT)', email='VSKRISHNA@MLRIT.AC.IN',
    exp='17 years', joined='01-06-2023',
    areas=['Big Data', 'Database Management Systems', 'Software Testing', 'Computer Graphics'],
    subjects=['Big Data', 'Database Management Systems', 'C Programming', 'Software Testing', 'Computer Graphics', 'Design Patterns'],
    journals=[
        {'t': 'Clustering the Labeled and Unlabeled Datasets using New MST based Divide and Conquer Technique', 'j': 'International Journal of Computer Science Engineering and Technology (Vol.1, Issue 6)', 'y': '2011'},
        {'t': 'A Comparative study of Face Recognition with Principal Component Analysis and Cross-Correlation Technique', 'j': 'International Journal of Computer Applications (Vol.10, Issue 8)', 'y': '2010'},
        {'t': 'Finding the Number of Clusters in Unlabeled Datasets using Extended Dark Block Extraction', 'j': 'International Journal of Computer Applications (Vol.7, Issue 3)', 'y': '2010'},
    ],
    conferences=0, books=[], folder='cse'
),

'guduru-durga-bhavani': dict(
    name='Miss. Guduru Durga Bhavani', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (IT)', email='bhavani92@mlrit.ac.in',
    exp='4 years', joined='07-01-2022',
    areas=['Data Structures', 'Python Programming'],
    subjects=['Data Structures', 'Python Programming'],
    journals=[], conferences=0, books=[], folder='cse'
),

'sasmita-pradhan': dict(
    name='Mrs. Sasmita Kumari Pradhan', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.E. (CSE); Ph.D (Pursuing)', email='sasmitakumari@mlrit.ac.in',
    exp='10 years', joined='27-05-2024',
    areas=['Artificial Intelligence', 'Machine Learning'],
    subjects=['Python', 'Automata Compiler Design', 'Mobile Development and Application', 'Computer Network'],
    journals=[], conferences=4, books=[], folder='cse'
),

'b-muralikrishna': dict(
    name='Mr. B. Muralikrishna', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE); Ph.D (Pursuing)', email='muralikrishna.b@mlrinstitutions.ac.in',
    exp='17 years', joined='05-08-2022',
    areas=['Machine Learning', 'Compiler Design'],
    subjects=['Compiler Design', 'Python Programming', 'OOP Through Java', 'Data Structures', 'Advanced Data Structures'],
    journals=[
        {'t': 'Marine Life Ecosystem Analysis Based on Climate Change Detection', 'j': 'Remote Sensing', 'y': '2025'},
        {'t': 'Disaster Management Based on Biodiversity Conservation', 'j': 'Remote Sensing', 'y': '2025'},
    ],
    conferences=0,
    books=[
        {'t': 'Data Mining and Warehousing', 'pub': 'LeiLani Katie Publishers', 'y': '2026', 'isbn': ''},
        {'t': 'IoT and Big Data Analytics for Smart Cities', 'pub': 'IBSC Publishers', 'y': '2022', 'isbn': ''},
    ],
    folder='cse'
),

'b-ratnamala': dict(
    name='Mrs. B. Ratnamala', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (IT), B.Tech (CSIT)', email='ratnabaggani@gmail.com',
    exp='13 years', joined='07-07-2025',
    areas=['Software Testing', 'Database Management Systems', 'Software Engineering'],
    subjects=['Database Management Systems', 'Software Engineering', 'Software Testing', 'Object-Oriented Programming Through Java', 'C Programming', 'Operating Systems'],
    journals=[], conferences=0, books=[], folder='cse'
),

'j-chaitanya': dict(
    name='Mr. Jonnalagadda Chaitanya', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (IT)', email='jonnalagaddachaitanya99@gmail.com',
    exp='2.5 years', joined='18-02-2025',
    areas=['Computer Networks'],
    subjects=['Computer Networks'],
    journals=[], conferences=0, books=[], folder='cse'
),

'd-jeevitha': dict(
    name='Ms. Dubasi Jeevitha', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE); Ph.D (Pursuing)', email='djeev2024@gmail.com',
    exp='3 years', joined='24-01-2025',
    areas=['Computer Science Engineering'],
    subjects=['Computer Science Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'd-tejaswini': dict(
    name='Ms. D. Tejaswini', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='tejaswi@mlrit.ac.in',
    exp='1.5 years', joined='16-10-2023',
    areas=['Computer Networks', 'Network Security', 'Cryptography'],
    subjects=['Computer Networks', 'Introduction to Cryptography', 'Network Security', 'Information Retrieval System'],
    journals=[], conferences=0, books=[], folder='cse'
),

'hareesh-pesala': dict(
    name='Mr. Hareesh Pesala', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (Electronics), B.Tech (CSE)', email='harish.p247@gmail.com',
    exp='3 years', joined='05-07-2024',
    areas=['Data Structures', 'Information Retrieval Systems'],
    subjects=['Data Structures', 'Information Retrieval Systems'],
    journals=[], conferences=0, books=[], folder='cse'
),

'ramya-s-pure': dict(
    name='Ms. Ramya S. Pure', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (ECE); Ph.D (Pursuing)', email='ramya.s@mlrit.ac.in',
    exp='15 years', joined='12-06-2024',
    areas=['Mobile Ad Hoc Networks', 'Network Security', 'Wireless Sensor Networks'],
    subjects=['Computer Network', 'Information & Network Security', 'Operating System', 'Computer Organization', 'OOP with Java'],
    journals=[
        {'t': 'Data reliability in Adhoc network for enhanced security using randomized bit interleaving', 'j': 'JETIR (Vol.9, Issue 12)', 'y': '2022'},
        {'t': 'Energy efficiency in wireless sensor network: A comprehensive survey', 'j': 'JOICS (Vol.11, Issue 4)', 'y': '2021'},
        {'t': 'User Recognition from Social Behavior', 'j': 'IJRPR (Vol.2, Issue 8)', 'y': '2021'},
        {'t': 'Network Intrusion Detection using Supervised Machine Learning Technique with Feature Selection', 'j': 'IRJET (Vol.7, Issue 12)', 'y': '2020'},
        {'t': 'A location-Aided flooding Mechanism in Community Based IOT Networks', 'j': 'IJSREM (Vol.4, Issue 6)', 'y': '2020'},
    ],
    conferences=1,
    books=[],
    patents=['202441001267A'],
    folder='cse'
),

'p-santhosh-kumar': dict(
    name='Mr. P. Santhosh Kumar', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CS), B.Tech (CSE)', email='santhosh.p@mlrit.ac.in',
    exp='9 years', joined='09-07-2024',
    areas=['Artificial Intelligence', 'Deep Learning'],
    subjects=['Artificial Intelligence', 'Deep Learning'],
    journals=[], conferences=0, books=[], folder='cse'
),

'jetti-sri-lakshmi': dict(
    name='Ms. Jetti Sri Lakshmi', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (IT)', email='srilakshmi.j@mlrit.ac.in',
    exp='1 year', joined='07-06-2024',
    areas=['Machine Learning'],
    subjects=['Machine Learning'],
    journals=[], conferences=0, books=[], folder='cse'
),

'ms-sabitha': dict(
    name='Ms. M. S. Sabitha', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='sabitha.mynepalli@gmail.com',
    exp='4 years', joined='29-02-2024',
    areas=['Computer Networks', 'Human Computer Interaction', 'Digital Electronics'],
    subjects=['Computer Networks Lab', 'Database Management Systems Lab'],
    journals=[], conferences=0, books=[], folder='cse'
),

'a-laxmi-prasanna': dict(
    name='Ms. A. Laxmi Prasanna', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE); Ph.D (Pursuing)', email='prasannababli@gmail.com',
    exp='9 years', joined='01-08-2024',
    areas=['Computer Networks', 'Software Engineering', 'Machine Learning', 'Cloud Computing'],
    subjects=['Computer Networks', 'Software Engineering', 'Machine Learning', 'Cloud Computing'],
    journals=[
        {'t': 'Securing Healthcare: A Fusion of AI and Blockchain for Medical Data Protection', 'j': 'Journal of Advanced Zoology (ISSN: 0253-7214, Vol.45, Special Issue 02)', 'y': '2023'},
        {'t': 'Maxillo Facial Fracture Detection System (MFDS) in Accident Victims with Deep Learning Techniques', 'j': 'TELEMATIQUE (ISSN: 1856-4194, Vol.23, Issue 1)', 'y': '2024'},
        {'t': 'Authenticity verification & Validation for storing data without knowing client identity in Cloud Atmosphere', 'j': 'International Journal & Magazine of Engineering, Technology, Management and Research (ISSN: 2348-4845, Vol.2, Issue 7)', 'y': '2015'},
    ],
    conferences=0,
    books=[],
    patents=['202341053314', '202341057823', '202341066214', '202341066983'],
    folder='cse'
),

'kshitiza-vasudeva': dict(
    name='Mrs. Kshitiza Vasudeva', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (IT); Ph.D (Pursuing)', email='kshitiza@mlrit.ac.in',
    exp='7 years', joined='14-06-2024',
    areas=['Computer Vision', 'Machine Learning', 'Image Processing', 'Artificial Intelligence'],
    subjects=['OOP with JAVA', 'Data Structures', 'Design and Analysis of Algorithms', 'Web Services', 'Operating System'],
    journals=[
        {'t': 'Advanced Specialized Processor Architecture for Smartphones', 'j': 'International Journal of Computational Intelligence Research (Vol.13, No.5)', 'y': '2017'},
        {'t': 'A methodical review on issues of medical image management system with watermarking approach', 'j': 'International Journal', 'y': '2016'},
        {'t': 'SCL-FExR: supervised contrastive learning approach for facial expression Recognition', 'j': 'Multimedia Tools and Applications (Vol.82, No.20)', 'y': '2023'},
        {'t': 'Adaptive Heuristics with Self-Healing for efficient Dynamic consolidation', 'j': 'International Journal of Latest Trends in Engineering and Technology (Special Issue-RICSIT)', 'y': '2016'},
    ],
    conferences=4, books=[], folder='cse'
),

'boddu-srilatha': dict(
    name='Mrs. Boddu Srilatha', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE); Ph.D (Pursuing)', email='ssrilatha216@gmail.com',
    exp='1 year', joined='30-08-2023',
    areas=['Natural Language Processing', 'Machine Learning', 'Artificial Intelligence'],
    subjects=['Natural Language Processing', 'Machine Learning', 'Artificial Intelligence'],
    journals=[], conferences=0, books=[], folder='cse'
),

'v-balakrishna-reddy': dict(
    name='Mr. V. Balakrishna Reddy', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='balakrishnareddy@mlrit.ac.in',
    exp='1 year', joined='21-02-2024',
    areas=['Computer Science Engineering'],
    subjects=['Computer Science Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'p-victor-emmanuel': dict(
    name='Mr. P. Victor Emmanuel', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='pvemmanuel24@gmail.com',
    exp='14 years', joined='15-02-2024',
    areas=['Cloud Computing', 'DevOps', 'AWS', 'Azure', 'GCP'],
    subjects=['Computer Networks', 'Cloud & DevOps', 'Constitution of India'],
    journals=[], conferences=1, books=[], folder='cse'
),

'm-vineesha': dict(
    name='Mrs. M. Vineesha', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (IT)', email='lakshmivineesha@gmail.com',
    exp='8 years', joined='12-02-2024',
    areas=['Cloud Technologies', 'DevOps'],
    subjects=['Cloud Technologies', 'DevOps'],
    journals=[], conferences=0, books=[], folder='cse'
),

'b-manjusha': dict(
    name='Mrs. B. Manjusha', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='Bollimuntha.manjusha@gmail.com',
    exp='4 years', joined='09-08-2023',
    areas=['Python Programming', 'OOP Through Java', 'Data Structures', 'Database Management Systems'],
    subjects=['Python Programming', 'OOP Through Java', 'Data Structures', 'Database Management Systems'],
    journals=[], conferences=0, books=[], folder='cse'
),

'm-srinivasulu': dict(
    name='Mr. M. Srinivasulu', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='Srinivasulu.m@mlrit.ac.in',
    exp='8 years', joined='01-02-2024',
    areas=['Software Engineering', 'Data Mining', 'Big Data', 'Computer Organization'],
    subjects=['Software Engineering', 'Data Mining', 'Big Data', 'Computer Organization'],
    journals=[], conferences=0, books=[], folder='cse'
),

'swathi': dict(
    name='Mrs. Swathi', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech', email='',
    exp='', joined='',
    areas=['Computer Science Engineering'],
    subjects=['Computer Science Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'k-samatha': dict(
    name='Mrs. K. Samatha', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='sairi.sam1990@gmail.com',
    exp='', joined='15-03-2023',
    areas=['Computer Science Engineering'],
    subjects=['Computer Science Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'a-nagamani': dict(
    name='Mrs. A. Nagamani', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), M.Sc, B.Sc (Computer Science)', email='astakalanagamani@gmail.com',
    exp='14 years', joined='17-03-2023',
    areas=['Software Engineering', 'Artificial Intelligence', 'Software Testing', 'Machine Learning'],
    subjects=['Software Engineering', 'Artificial Intelligence', 'Software Testing', 'Machine Learning'],
    journals=[],
    conferences=2,
    books=[{'t': 'Robotics', 'pub': 'NTL', 'y': '2023', 'isbn': '978-81-19762-05-7'}],
    folder='cse'
),

'kranthi-kumari': dict(
    name='Ms. Kranthi Kumari', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='kranthikumari@mlrit.ac.in',
    exp='4 years', joined='02-01-2023',
    areas=['Artificial Intelligence', 'Machine Learning', 'Software Engineering'],
    subjects=['Artificial Intelligence', 'Machine Learning', 'Software Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'ragini-patil': dict(
    name='Ms. Ragini Patil', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.E', email='ragini@mlrinstitutions.ac.in',
    exp='2 years', joined='01-09-2022',
    areas=['Computer Science Engineering'],
    subjects=['Computer Science Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'lingaiah-suramsetti': dict(
    name='Mr. Lingaiah Suramsetti', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.Tech', email='suramsettil@gmail.com',
    exp='10 years', joined='07-12-2022',
    areas=['Computer Science Engineering'],
    subjects=['C', 'C++ & Java', 'OOP Through C++ & Java', 'Internet & Web Technologies'],
    journals=[], conferences=0, books=[], folder='cse'
),

'i-sapthami': dict(
    name='Ms. I. Sapthami', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (IT); Ph.D (Pursuing)', email='isapthami@gmail.com',
    exp='9 years', joined='',
    areas=['Machine Learning', 'Deep Learning'],
    subjects=['Software Testing', 'Operating Systems', 'Python Programming', 'E-Commerce', 'Distributed Systems'],
    journals=[
        {'t': 'Crop yield Prediction using Machine learning models', 'j': 'International Journal of Analytical and Experimental Model Analysis (UGC CARE Group II, Vol.XIV, Issue 6)', 'y': '2022'},
        {'t': 'An Android based Application for College leave management system', 'j': 'International Journal of Analytical and Experimental Model Analysis (UGC CARE Group II, Vol.XIV, Issue 6)', 'y': '2022'},
        {'t': 'An Android based Application for women safety using GPS and Mobile Tracking', 'j': 'International Journal of Analytical and Experimental Model Analysis (UGC CARE Group II, Vol.XIV, Issue 6)', 'y': '2022'},
        {'t': 'An efficient Method to prevent shoulder side attacks using ML techniques', 'j': 'Journal of Interdisciplinary Cycle Research (UGC CARE, Vol.XIII, Issue 7)', 'y': '2021'},
        {'t': 'Implementation Of An Efficient Data Sharing Scheme For Mobile Cloud Data', 'j': 'International Journal of Engineering Sciences (UGC CARE, Vol.XI, Issue 7)', 'y': '2020'},
    ],
    conferences=4, books=[], folder='cse'
),

'p-deepak': dict(
    name='Mr. P. Deepak', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.E. (CSE); Ph.D (Pursuing)', email='p.deepak@mlrinstitutions.ac.in',
    exp='11 years', joined='01-06-2022',
    areas=['Machine Learning', 'Deep Learning', 'Big Data Analytics'],
    subjects=['Relational Database Management System', 'Big Data Analytics'],
    journals=[
        {'t': 'Internet of Things (IOT) Security Threats in Smart Refrigeration', 'j': 'Global Journal of Applied Engineering in Computer Science and Mathematics (Vol.1(1))', 'y': '2021'},
        {'t': 'Challenges of Long-Term Evaluation to 5G Migration', 'j': 'International Journal of Management and Social Science Research Review (Vol.5, Issue 11, Impact Factor: 5.483)', 'y': '2018'},
    ],
    conferences=2, books=[], folder='cse'
),

'jeethu-philip': dict(
    name='Mrs. Jeethu Philip', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.E (CSE), B.E (CSE)', email='jeethuphilip@mlrinstitutions.ac.in',
    exp='1 year', joined='16-11-2020',
    areas=['Cloud Computing'],
    subjects=['C Programming', 'DBMS'],
    journals=[], conferences=0, books=[], folder='cse'
),

'j-pradeep-kumar': dict(
    name='Mr. J. Pradeep Kumar', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (IT), B.Tech (IT)', email='pradeep.jakkulla@gmail.com',
    exp='8 years', joined='20-06-2012',
    areas=['Information Security', 'Software Engineering', 'Software Testing'],
    subjects=['OOP Analysis and Design', 'Software Engineering', 'Software Testing and QA', 'Information Retrieval Systems', 'Soft Computing'],
    journals=[
        {'t': 'Seed Sowing Machine for Zero Till Farming', 'j': 'IJITEE', 'y': '2019'},
        {'t': 'Migration of Big Data Analysis from Hadoop MapReduce to Spark', 'j': 'AISC', 'y': '2018'},
        {'t': 'Content-Based Image Retrieval using features extracted from half toning-based block truncation coding', 'j': 'IJEEST', 'y': '2016'},
    ],
    conferences=0,
    books=[{'t': 'C Programming and Data Structures', 'pub': 'Hitech Publications', 'y': '', 'isbn': ''}],
    folder='cse'
),

'telise-vinod': dict(
    name='Mr. Telise Vinod', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.Tech', email='vinodh@mlrinstitutions.ac.in',
    exp='', joined='',
    areas=['Data Structures', 'C Programming'],
    subjects=['Data Structures', 'C Programming'],
    journals=[], conferences=0, books=[], folder='cse'
),

'kukunoor-shekar': dict(
    name='Mr. Kukunoor Shekar', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='Shekar.kukunoor@mlrinstitutions.ac.in',
    exp='8 years', joined='29-06-2016',
    areas=['Cloud Computing', 'Software Engineering', 'E-Commerce', 'Data Structures'],
    subjects=['E-Commerce', 'Software Testing Fundamentals', 'Software Engineering', 'Cloud Computing', 'Advanced Data Structures', 'Computer Networks'],
    journals=[
        {'t': 'A Geographical Factor of Interest Recommended Strategies in Location Based Social Networks', 'j': 'International Journal of Engineering & Technology', 'y': '2018'},
        {'t': 'Segmentation of Hard exudates for the detection of Diabetic Retinopathy with RNN based semantic features using fundus images', 'j': 'Materials Today: Proceedings', 'y': '2022'},
        {'t': 'Android based image processor for blind', 'j': 'International Journal of Innovative Technology and Exploring Engineering', 'y': '2019'},
        {'t': 'Analyze Electoral Performance of Parliament Using Hadoop', 'j': 'IJERT', 'y': '2018'},
    ],
    conferences=3,
    books=[],
    patents=['202200001 (Customized ZIP File Input Format Using MapReduce)', '202200002 (Pet Feeder Automation Using Raspberry Pi and IoT)'],
    folder='cse'
),

'g-praveen': dict(
    name='Mr. G. Praveen', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='PRAVEENCOMPUTER77@GMAIL.COM',
    exp='10 years', joined='05-07-2021',
    areas=['Computer Science Engineering'],
    subjects=['Computer Science Engineering'],
    journals=[], conferences=0, books=[], folder='cse'
),

'sk-lokesh-naik': dict(
    name='Mr. S. K. Lokesh Naik', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.Tech', email='lokesh.naik@mlrinstitutions.ac.in',
    exp='13 years', joined='',
    areas=['Computer Networks', 'Mobile Computing', 'Network Security', 'Cyber Security'],
    subjects=['Computer Networks', 'Mobile Computing', 'Network Security and Cryptography', 'Software Engineering', 'Operating Systems', 'Cyber Security'],
    journals=[], conferences=0, books=[], folder='cse'
),

'oruganti-ramesh': dict(
    name='Mr. Oruganti Ramesh', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE)', email='rameshmalyadri@gmail.com',
    exp='5.7 years', joined='',
    areas=['Computer Architecture', 'Computer Networks', 'Database Management Systems'],
    subjects=['Computer Architecture and Organisation', 'Computer Networks', 'Database Management Systems'],
    journals=[], conferences=0, books=[], folder='cse'
),

'divya-priya-degala': dict(
    name='Mrs. Divya Priya Degala', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.Tech; Ph.D (Pursuing)', email='divyapriya@mlrinstitutions.ac.in',
    exp='10 years', joined='15-07-2019',
    areas=['Adaptive Watermarking', 'Face Recognition', 'Cloud Data Security'],
    subjects=['Operating Systems', 'DBMS', 'Python', 'DAA', 'Automata and Compiler Design', 'Web Technologies', 'Distributed Systems'],
    journals=[
        {'t': 'Adaptive watermarking for image security', 'j': 'Web of Science indexed journal', 'y': '2022'},
        {'t': 'Face recognition using deep learning techniques', 'j': 'Web of Science indexed journal', 'y': '2022'},
        {'t': 'Cloud data security using encryption techniques', 'j': 'Web of Science indexed journal', 'y': '2021'},
        {'t': 'Multiple Biometric Authentication through Image Assessment using Machine Learning', 'j': 'Book Chapter', 'y': '2023'},
    ],
    conferences=9,
    books=[{'t': 'Conscience of Data Science with Ethics', 'pub': '', 'y': '2023', 'isbn': '978-81-19762-01-9'}],
    patents=['Traffic sign recognition', 'Intelligent shopping cart', 'Medical diagnosis tool'],
    folder='cse'
),

'bashetty-suman': dict(
    name='Mr. Bashetty Suman', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.Tech', email='bashettysumanpg@gmail.com',
    exp='6.5 years', joined='',
    areas=['Web Technology', 'Database Management Systems', 'Data Warehousing'],
    subjects=['DWDM', 'DBMS', 'Web Technology', 'Operating Systems'],
    journals=[
        {'t': 'An enhance efficiency of key management method for wireless networks', 'j': 'Springer (ISBN 978-981-13-1580-0)', 'y': '2018'},
    ],
    conferences=0, books=[], folder='cse'
),

'b-veda-vidhya': dict(
    name='Ms. B. Veda Vidhya', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech, B.Tech', email='vedavidhyab@gmail.com',
    exp='7 years', joined='',
    areas=['Cloud Computing', 'Computer Networks', 'Operating Systems'],
    subjects=['Computer Networks', 'C Programming', 'Data Structures', 'Principles of Programming Language', 'Software Engineering', 'Operating Systems'],
    journals=[
        {'t': 'A group tasks scheduling algorithm for cloud computing networks based on QoS', 'j': 'IJET (ISSN 2227-524X)', 'y': '2018'},
    ],
    conferences=0, books=[], folder='cse'
),

'k-swetha': dict(
    name='Ms. K. Swetha', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (Software Engineering), B.Tech (CSE); Ph.D (Pursuing)', email='K.swetha@mlrinstitutions.ac.in',
    exp='3 years', joined='08-12-2018',
    areas=['Java Programming', 'Mobile Application Development', 'Web Technologies', 'Cryptography', 'Python Programming'],
    subjects=['Java', 'Mobile Application Development', 'Web Technologies', 'Cryptography', 'Python Programming', 'Software Testing'],
    journals=[],
    conferences=4, books=[], folder='cse'
),

'en-vijaya-kumari': dict(
    name='Ms. E. N. Vijaya Kumari', role='Assistant Professor', dept='Computer Science and Engineering',
    qual='M.Tech (CSE), B.Tech (CSE); Ph.D (Pursuing)', email='vijayakumari@mlrinstitutions.ac.in',
    exp='6.8 years', joined='19-06-2019',
    areas=['Machine Learning', 'Autonomous Vehicles', 'Medical Image Processing'],
    subjects=['Software Testing Fundamentals', 'Software Testing Management'],
    journals=[],
    conferences=5,
    books=[],
    patents=['202241025417A', '202341040501'],
    folder='cse'
),

# ─── ECE Faculty (remaining) ───────────────────────────────────────────────────

'akhila-akula': dict(
    name='Ms. Akhila Akula', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech, B.Tech (ECE)', email='akhila.akula@mlrit.ac.in',
    exp='5 years', joined='07-12-2023',
    areas=['Internet of Things', 'Computer Networks', 'Embedded Systems', 'Image Processing'],
    subjects=['Internet of Things', 'Computer Networks', 'Embedded Systems', 'Image Processing', 'Data Structures', 'Python'],
    journals=[],
    conferences=6, books=[], folder='ece'
),

'b-anusha': dict(
    name='Ms. Badepalli Anusha', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech, B.Tech (ECE)', email='badepalli.anuhsa@mlrinstitutions.ac.in',
    exp='12 years', joined='05-12-2017',
    areas=['Communication Engineering', 'VLSI', 'Antenna Design', 'Power Systems'],
    subjects=['Analog Communications', 'Digital Communications', 'Signals and Systems', 'Electromagnetic Interference', 'Electronic Devices'],
    journals=[
        {'t': 'Design and implementation of RFID based attendance system', 'j': 'International Journal of Innovative Technology and Exploring Engineering (Vol.9, Issue 1)', 'y': '2019'},
        {'t': 'CSHM multiplier and radix-256 algorithm using fir filter design', 'j': 'International Journal of Innovative Technology and Exploring Engineering (Vol.8, Issue 11)', 'y': '2019'},
        {'t': 'VLSI design of an area and time efficient design of overloaded CDMA architecture using han carlson adder', 'j': 'International Journal of Innovative Technology and Exploring Engineering (Vol.8, Issue 4S2)', 'y': '2019'},
        {'t': 'Pentagonal shaped koch fractal monopole slot antenna for multiband applications', 'j': 'ARPN Journal of Engineering and Applied Sciences (Vol.12, Issue 15)', 'y': '2017'},
        {'t': 'A new concept of simultaneous voltage SAG or SWEEL and load reactive power compensation', 'j': 'International Journal of Applied Engineering Research (Vol.9, Issue 20)', 'y': '2014'},
    ],
    conferences=2, books=[], folder='ece'
),

'b-sireesha': dict(
    name='Ms. Badepalli Sireesha', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (DECS), B.Tech (ECE)', email='sireeshareddy3813@gmail.com',
    exp='3 years', joined='03-09-2023',
    areas=['Internet of Things', 'Digital System Design'],
    subjects=['Digital System Design', 'Electronic Design Automation'],
    journals=[], conferences=1, books=[], folder='ece'
),

# ─── Mechanical Faculty (remaining) ───────────────────────────────────────────

'j-laxmi-prasad': dict(
    name='Mr. J. Laxmi Prasad', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech (Mechatronics), B.Tech (Mechanical)', email='laxmiprasad@mlrinstitutions.ac.in',
    exp='2 years', joined='14-09-2016',
    areas=['Mechatronics', 'CAD/CAM', 'Automation in Manufacturing'],
    subjects=['Engineering Graphics', 'CAD/CAM', 'Automation in Manufacturing'],
    journals=[], conferences=0, books=[], folder='mechanical'
),

# ─── Aeronautical Faculty (remaining) ─────────────────────────────────────────

'a-udaya-deepika': dict(
    name='Ms. A. Udaya Deepika', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Aerospace Engineering), B.Tech (Aeronautical)', email='udeepika.aero4825@gmail.com',
    exp='5 years', joined='',
    areas=['Composites', 'Aircraft Structures', 'CFD', 'Structural Analysis'],
    subjects=['Flight Scheduling & Operation', 'Aerodynamics', 'Airframe Structural Design', 'Introduction to Aerospace Engineering'],
    journals=[
        {'t': 'Dynamic stability analysis of structural members', 'j': 'Structural Engineering Journal', 'y': '2021'},
        {'t': 'CFD Investigation for different nozzle jets', 'j': 'Aeronautical Engineering Journal', 'y': '2021'},
        {'t': 'Buckling Analysis of Stiffened Panel for Aircraft Fuselage', 'j': 'Aerospace Structures Journal', 'y': '2022'},
        {'t': 'Design and Fabrication of Black Box Ejection System for a Civil Transport Aircraft', 'j': 'Aerospace Design Journal', 'y': '2022'},
    ],
    conferences=0, books=[], folder='aeronautical'
),

'yelamasetti-balram': dict(
    name='Mr. Yelamasetti Balram', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Aeronautical/Aerospace Engineering), B.Tech', email='',
    exp='3 years', joined='',
    areas=['Aeronautical Engineering', 'Aircraft Structures'],
    subjects=['Aeronautical Engineering', 'Aircraft Structures'],
    journals=[], conferences=0, books=[], folder='aeronautical'
),

# ─── Freshman / H&S Faculty ───────────────────────────────────────────────────

'nirmala-kumari': dict(
    name='Dr. V. Nirmala Kumari', role='Associate Professor', dept='Humanities & Sciences (English)',
    qual='Ph.D (English), MA (English), BA (Hons.)', email='dr.nirmala@mlrinstitutions.ac.in',
    exp='10 years', joined='01-09-2022',
    areas=['Indian Writing in English', 'English Language Teaching'],
    subjects=['ESE', 'Seminar', 'ELCS'],
    journals=[], conferences=0, books=[], folder='freshman'
),

}

changed = 0
for key, data in updates.items():
    start_pat = re.compile(r'"%s"\s*:\s*\{' % re.escape(key))
    m = start_pat.search(content)
    if not m:
        print(f'NOT FOUND: {key}')
        continue
    brace_start = m.end() - 1
    depth = 0
    i = brace_start
    while i < len(content):
        if content[i] == '{': depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    new_body = '{\n        ' + make_body(key, data) + '\n      }'
    content = content[:brace_start] + new_body + content[i+1:]
    print(f'UPDATED: {key}')
    changed += 1

if changed:
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'\nSaved {changed} updates.')
else:
    print('Nothing updated.')
