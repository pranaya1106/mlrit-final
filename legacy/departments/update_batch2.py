#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update facultyDB - EEE remaining faculty batch."""
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
    folder = d.get('folder', 'eee')
    photo = d.get('photo', f'images/{folder}/{key}.jpg')
    areas_js = ', '.join('"%s"' % js_str(a) for a in d['areas'])
    subj_js  = ', '.join('"%s"' % js_str(s) for s in d['subjects'])
    books_js = ''
    if d.get('books'):
        books_js = ', '.join('{t: "%s", pub: "%s", y: "%s", isbn: "%s"}' % (js_str(b['t']), js_str(b.get('pub','')), js_str(b.get('y','')), js_str(b.get('isbn',''))) for b in d['books'])
    return (
        'name: "%s", role: "%s", dept: "%s",\n'
        '        photo: "%s", qual: "%s",\n'
        '        email: "%s", exp: "%s", joined: "%s",\n'
        '        areas: [%s],\n'
        '        subjects: [%s],\n'
        '        journals: [%s],\n'
        '        conferences: %d, confTitles: [], books: [%s], patents: [], awards: []'
    ) % (
        js_str(d['name']), js_str(d['role']), js_str(d['dept']),
        photo, js_str(d['qual']),
        js_str(d['email']), js_str(d['exp']), js_str(d['joined']),
        areas_js, subj_js,
        journals_js(d['journals']),
        d['conferences'], books_js
    )

updates = {

'a-shubhangi-rao': dict(
    name='Ms. A. Shubhangi Rao', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='M.E, B.E (Electrical & Electronics Engineering)', email='shubhir5789@gmail.com',
    exp='6 years', joined='17-12-2018',
    areas=['Control Systems', 'Induction Motor Drives', 'Smart Grid', 'Power Electronics', 'Solar Energy'],
    subjects=['Control Systems', 'Electrical Machines', 'Power Electronics', 'Renewable Energy Systems'],
    journals=[
        {'t': 'Comparative analysis among PI, PID and Fuzzy Logic Controller for speed control of Induction Motor', 'j': 'International Journal of Enhanced Research in Science Technology & Engineering (Vol.2, Issue 7)', 'y': '2013'},
        {'t': 'Comparative analysis among fuzzy PI, fuzzy PID and fuzzy logic controller for speed control of induction motor', 'j': 'International Journal of Enhanced Research in Science Technology & Engineering (Vol.2, Issue 8)', 'y': '2013'},
        {'t': 'MLR Institute campus energy monitoring and controlling system with interconnection of grid and solar power', 'j': 'International Journal of Engineering and Technology UAE (SCOPUS)', 'y': '2018'},
        {'t': 'BLDC Motor Based Cuk Converter Using Model Predictive Controller for Low Power Application', 'j': 'International Journal of Advanced Trends in Computer Science and Engineering', 'y': '2020'},
    ],
    conferences=3, books=[], folder='eee'
),

'a-yadagiri': dict(
    name='Mr. A. Yadagiri', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='M.Tech, B.Tech (Electrical & Electronics Engineering)', email='yadagiri259@gmail.com',
    exp='5 years', joined='31-08-2019',
    areas=['Power Electronics', 'Electrical Drives', 'Power Systems'],
    subjects=['Power Electronics', 'Electrical Drives', 'Circuit Theory'],
    journals=[], conferences=0, books=[], folder='eee'
),

'ch-srivardhan-kumar': dict(
    name='Dr. Ch. Srivardhan Kumar', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='Ph.D (Power Electronics Application in Power Systems), M.Tech, B.Tech',
    email='chsvnk123@gmail.com', exp='11 years', joined='09-08-2017',
    areas=['Power Electronics', 'Dynamic Voltage Restorer', 'Power Quality', 'Optimization Algorithms', 'Electric Vehicles'],
    subjects=['Power Electronics', 'Power Quality', 'Control Systems', 'Electric Drives'],
    journals=[
        {'t': 'Review of Dynamic Voltage Restorer (DVR) Using Various Control Topologies', 'j': 'International Journal of Advanced Trends in Computer Science and Engineering (IJATCSE, Vol.9 No.2)', 'y': '2020'},
        {'t': 'Mitigating The Voltage Issue in Transmission Line in Series Voltage Compensation Method', 'j': 'CIMS (Vol.28 No.10)', 'y': '2020'},
        {'t': 'Development of a novel Harris Hawks-based optimization algorithm for power quality enhancement', 'j': 'Electrical Engineering (SCIE, Vol.50(2), IF=1.8)', 'y': '2022'},
        {'t': 'Power quality enhancement by using Z-DVR based series voltage compensation with black widow optimization', 'j': 'International Journal of Applied Power Engineering (SCOPUS, Vol.12 No.3, IF=1.06)', 'y': '2023'},
        {'t': 'Performance and Comparison of Voltage Compensation Based on Hybrid Metaheuristic Technique Tuned Z-Dynamic Voltage Restorer', 'j': 'Electrica (SCOPUS, Vol.23(3), IF=0.9)', 'y': '2023'},
    ],
    conferences=3,
    books=[{'t': 'Electrifying the Roads: A Comprehensive Guide to EV Vehicles', 'pub': '', 'y': '2023', 'isbn': '978-93-5747-597-6'}],
    folder='eee'
),

'k-rajasri': dict(
    name='Ms. K. Rajasri', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='M.Tech, B.Tech (Electrical & Electronics Engineering)', email='kasularajasree@gmail.com',
    exp='6.5 years', joined='03-02-2022',
    areas=['Electrical Power Systems', 'HVDC Transmission', 'Power Electronics', 'DC-DC Converters'],
    subjects=['Power Systems', 'Transmission and Distribution', 'Power Electronics'],
    journals=[
        {'t': 'Performance analysis of Hybrid HVDC Transmission DC Motor Fed DC-DC Converter With High Step Up Voltage Gain', 'j': 'International Journal (Power Systems)', 'y': '2022'},
    ],
    conferences=1, books=[], folder='eee'
),

'm-sreenivasa-reddy': dict(
    name='Mr. M. Sreenivasa Reddy', role='Associate Professor', dept='Electrical and Electronics Engineering',
    qual='M.Tech, B.E (Electrical & Electronics Engineering)', email='reddy2347524@yahoo.co.uk',
    exp='13 years', joined='07-10-2013',
    areas=['Power Systems', 'Distribution Systems', 'Solar Energy', 'Power Quality', 'Renewable Energy'],
    subjects=['Power Systems', 'Electrical Machines', 'Power Electronics', 'Renewable Energy'],
    journals=[
        {'t': 'MLR Institute Campus Energy Monitoring and Controlling System', 'j': 'International Journal of Engineering and Technology UAE (SCOPUS)', 'y': '2018'},
        {'t': 'Mitigating Voltage Sag In Secondary Distribution Line Using DVR', 'j': 'International Journal of Scientific & Technology Research (Vol.9 Issue 3)', 'y': '2020'},
        {'t': 'New Hybrid PSO Algorithm for Non-Convex Optimal Power Flow Problem', 'j': 'International Journal of Electrical and Electronics Research (Vol.4 Issue 4)', 'y': '2016'},
        {'t': 'Digital Computation of Fault Location on Electric Power Transmission Lines', 'j': 'International Journal of Engineering Research in Industrial Applications (Vol.3 No.3)', 'y': '2010'},
        {'t': 'Design of Sensors for Adaptive Solar Panels', 'j': 'ARPN Journal of Engineering and Applied Sciences (Vol.13 No.10)', 'y': '2018'},
    ],
    conferences=4, books=[], folder='eee'
),

'n-karthik': dict(
    name='Mr. N. Karthik', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='M.Tech, B.Tech (Electrical & Electronics Engineering)', email='karthiknachagari2748@gmail.com',
    exp='6 years', joined='02-01-2019',
    areas=['Power Systems', 'Control Systems', 'Electrical Machines'],
    subjects=['Power Systems', 'Electrical Machines', 'Control Systems'],
    journals=[], conferences=3, books=[], folder='eee'
),

'p-jithendar': dict(
    name='Mr. P. Jithendar', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='M.Tech, B.Tech (Electrical & Electronics Engineering)', email='jitendar13@gmail.com',
    exp='3 years', joined='24-08-2015',
    areas=['Power Quality', 'Distribution Systems', 'Power Electronics', 'DPFC'],
    subjects=['Power Systems', 'Power Electronics', 'Electrical Machines'],
    journals=[
        {'t': 'Enhancement of power quality in Distribution line By using Distributed Power Flow Controller (DPFC)', 'j': 'International Journal of Research in Computer and Communication Technology (Vol.3 Issue 10)', 'y': '2014'},
    ],
    conferences=2, books=[], folder='eee'
),

't-bhargava-ramu': dict(
    name='Dr. T. Bhargava Ramu', role='Associate Professor', dept='Electrical and Electronics Engineering',
    qual='Ph.D (Power Electronics), M.Tech, B.Tech', email='bhargava.ramu@yahoo.com',
    exp='18 years', joined='06-07-2018',
    areas=['Power Electronics', 'D-STATCOM', 'Multilevel Inverters', 'Power Quality', 'Electric Vehicles'],
    subjects=['Power Electronics', 'Power Systems', 'Electrical Machines', 'Control Systems'],
    journals=[
        {'t': 'Mitigating Voltage Sag In Secondary Distribution Line Using DVR With Single DC Source', 'j': 'International Journal of Scientific & Technology Research (Vol.9 Issue 3)', 'y': '2020'},
        {'t': 'Investigation In Finding The Role Of Active Loads In The Electrical Grid Dominated By Power Electronics', 'j': 'Think India Journal', 'y': '2019'},
        {'t': 'Performance Analysis of Different Level D-STATCOM using Finfet Technology', 'j': 'History Research Journal', 'y': '2019'},
        {'t': 'BLDC Motor Based Cuk Converter Using Model Predictive Controller for Low Power Applications', 'j': 'International Journal of Advanced Trends in Computer Science and Engineering', 'y': '2020'},
    ],
    conferences=5,
    books=[{'t': 'Electrifying the Roads: A Comprehensive Guide to EV Vehicles', 'pub': '', 'y': '2023', 'isbn': '978-93-5747-597-6'}],
    folder='eee'
),

't-mrudula': dict(
    name='Ms. T. Mrudula', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='M.Tech, B.Tech (Electrical & Electronics Engineering)', email='mrudulat@mlrit.ac.in',
    exp='5 years', joined='06-02-2023',
    areas=['Power Electronics', 'Electrical Machines', 'Power Systems'],
    subjects=['Power Electronics', 'Electrical Machines', 'Basic Electrical Engineering'],
    journals=[], conferences=0, books=[], folder='eee'
),

'y-lalitha-kameswari': dict(
    name='Dr. Y. Lalitha Kameswari', role='Assistant Professor', dept='Electrical and Electronics Engineering',
    qual='Ph.D (Power Electronics & Drives)', email='',
    exp='7 years', joined='09-10-2023',
    areas=['Power Electronics', 'Multilevel Inverters', 'Power Quality', 'Fuzzy Logic Control', 'Neural Networks'],
    subjects=['Power Electronics', 'Power Systems', 'Control Systems', 'Electrical Machines'],
    journals=[
        {'t': 'Analysis of ANFIS based Multilevel Inverter for Rural Electrification', 'j': 'High Technology Letters (SCOPUS, Vol.29 Issue 1)', 'y': '2023'},
        {'t': 'Performance Evaluation of Cascaded Multilevel Inverter using Neuro Fuzzy controller', 'j': 'Journal of Advanced Research in Dynamical & Control Systems (SCOPUS, Vol.10 Issue 2)', 'y': '2018'},
        {'t': 'Design and Implementation of Controller for vocal reduction', 'j': 'International Journal of Recent Technology and Engineering (SCOPUS, Vol.8 Issue 2S8)', 'y': '2019'},
        {'t': 'Cost Effective Solution for a Shunt Hybrid Filter Using Enhanced Current Controller', 'j': 'International Journal of Power Electronics and Drive System (SCOPUS, Vol.9 No.4)', 'y': '2018'},
        {'t': 'Fuzzy Logic Controlled Harmonic Suppressor in Cascaded Multilevel Inverter', 'j': 'International Journal of Power Electronics and Drive System (SCOPUS, Vol.7 No.2)', 'y': '2016'},
        {'t': 'Hybrid Controlled Harmonic Suppressor for Enhancing Power Quality in Cascaded H-bridge Multilevel Inverter', 'j': 'Discovery (Vol.48(222))', 'y': '2015'},
        {'t': 'Harmonic suppressor for enhancing power quality in cascaded multilevel inverter', 'j': 'International Journal of Power Systems Microelectronics (Vol.1 Issue 1)', 'y': '2015'},
        {'t': 'Seven Level Cascaded Multilevel Inverter for Harmonic Elimination with Reduced Number of Switches', 'j': 'International Journal on Electrical and Electronics Engineering Advanced Research (Vol.2 Issue 2)', 'y': '2014'},
        {'t': 'Power Quality Improvement in Cascaded Multilevel Inverter using Fuzzy logic and Neural Network Techniques', 'j': 'International Journal of Emerging Trends in Electrical and Electronics (Vol.10 Issue 10)', 'y': '2014'},
    ],
    conferences=4, books=[], folder='eee'
),

}

changed = 0
for key, data in updates.items():
    # Find entry
    start_pat = re.compile(r'"%s"\s*:\s*\{' % re.escape(key))
    m = start_pat.search(content)
    if not m:
        print(f'NOT FOUND: {key}')
        continue
    # Find matching closing brace
    brace_start = m.end() - 1  # position of opening {
    depth = 0
    i = brace_start
    while i < len(content):
        if content[i] == '{': depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    # content[brace_start:i+1] is the old entry body including braces
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
