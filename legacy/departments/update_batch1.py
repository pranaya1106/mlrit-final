#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update facultyDB with real data for batch 1 (EEE + Mechanical + Aeronautical + MBA)."""
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = 'c:/mlr/homepage/departments/faculty-profile.html'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

updates = {}

# ── sonu-kumar (EEE) ─────────────────────────────────────────────────────────
updates['sonu-kumar'] = {
    'name': 'Dr. Sonu Kumar', 'role': 'Assistant Professor',
    'dept': 'Electrical and Electronics Engineering',
    'qual': 'Ph.D (Electrical & Electronics Instrumentation)', 'email': '',
    'exp': '10 years', 'joined': '17-07-2023',
    'areas': ['Renewable Energy Systems', 'Hybrid Energy Systems', 'Battery Storage', 'Power Electronics', 'IoT in Energy'],
    'subjects': ['Electrical Machines', 'Power Systems', 'Renewable Energy Systems'],
    'journals': [
        {'t': 'Estimation of State of Charge of Lead-Acid Battery Used in Solar PV System', 'j': 'Bhartiya Vaigyanik Evam Audyogik Anusandhan Patrika (CSIR-NISCAIR)', 'y': '2019'},
        {'t': 'Design of Optimum Sizing for Hybrid Renewable Energy System using HOMER Pro', 'j': 'International Journal of Grid and Distributed Computing', 'y': '2021'},
        {'t': 'Sizing Optimization and Techno-Economic Analysis of Hybrid Renewable Energy System', 'j': 'Journal of Scientific and Industrial Research', 'y': '2021'},
        {'t': 'Grid Tied Inverters for Renewable Energy Systems', 'j': 'International Journal of Environment and Sustainable Development (Inderscience)', 'y': '2022'},
        {'t': 'Design and Development of Micro Off-grid Inverter', 'j': 'Journal of Scientific and Industrial Research', 'y': '2022'},
        {'t': 'Design and analysis of a solar-wind hybrid renewable energy tree', 'j': 'Results in Engineering', 'y': '2023'},
        {'t': 'Optimization Technique for Renewable Energy Storage Systems', 'j': 'International Transactions on Electrical Energy Systems (Hindawi)', 'y': '2023'},
        {'t': 'Switched-Resistor Passive Balancing', 'j': 'International Journal of Energy Research (IF=4.67)', 'y': '2023'},
        {'t': 'Performance Evaluation of Hybrid Multilevel Inverter', 'j': 'Journal of Engineering and Applied Science (Springer)', 'y': '2023'},
        {'t': 'Potential and Evaluation Strategies in Renewable Energy Systems', 'j': 'Energies (Vol.16, IF=3.2)', 'y': '2023'},
        {'t': 'Smart Cities and Embedded IoT Sensor Systems', 'j': 'International Journal of Biology, Pharmacy and Allied Sciences', 'y': '2021'},
        {'t': 'State of Charge Estimation of Li-ion Battery', 'j': 'BioGecko', 'y': '2023'},
    ],
    'conferences': 7, 'books': [], 'patents': [], 'awards': []
}

# ── sumana-das (EEE) ─────────────────────────────────────────────────────────
updates['sumana-das'] = {
    'name': 'Dr. Sumana Das', 'role': 'Associate Professor',
    'dept': 'Electrical and Electronics Engineering',
    'qual': 'Ph.D (Power Electronics)', 'email': '',
    'exp': '7 years', 'joined': '20-08-2023',
    'areas': ['Power Electronics', 'Load Frequency Control', 'Renewable Energy Systems', 'Power System Control', 'Virtual Inertia Control'],
    'subjects': ['Power Electronics', 'Power Systems', 'Control Systems'],
    'journals': [
        {'t': 'Maiden application of TIDN-(1+PI) cascade controller in LFC of a multi-area hydro-thermal system', 'j': 'International Transactions on Electrical Energy Systems (SCIE, Vol.31: e12907)', 'y': '2021'},
        {'t': 'Load frequency control of a multi-source multi-area thermal system including biogas-solar thermal', 'j': 'International Transactions on Electrical Energy Systems (SCIE, Vol.31(12): e13165)', 'y': '2021'},
        {'t': 'A Novel Mine Blasting Algorithm Optimized DFOPI-TIDN Controller for Virtual Inertia Control', 'j': 'Iranian Journal of Science and Technology, Transactions of Electrical Engineering (SCIE)', 'y': '2022'},
        {'t': 'Effect of PI-TI based virtual inertia controller with virtual damping', 'j': 'Arabian Journal for Science and Engineering (SCIE)', 'y': '2022'},
        {'t': 'Over Current and Over Voltage Diminution Using Active SFCL In A Distribution System', 'j': 'International Journal of Electrical and Electronics Engineering Research', 'y': '2015'},
    ],
    'conferences': 3, 'books': [], 'patents': [], 'awards': []
}

# ── bv-rajanna (EEE) ─────────────────────────────────────────────────────────
updates['bv-rajanna'] = {
    'name': 'Dr. B.V. Rajanna', 'role': 'Associate Professor',
    'dept': 'Electrical and Electronics Engineering',
    'qual': 'Ph.D (Power Electronics and Drives), M.Tech, B.Tech',
    'email': 'bv.rajanna@mlrit.ac.in',
    'exp': '11 years', 'joined': '13-04-2023',
    'areas': ['Power Electronics and Drives', 'Smart Metering', 'Microgrids', 'Renewable Energy', 'Battery Storage'],
    'subjects': ['Power Electronics', 'Electric Drives', 'Microgrids', 'Power Systems'],
    'journals': [
        {'t': 'Automatic Meter Reading for Smart Metering by using QPSK Modem with PLC Channel and GSM Modem', 'j': 'Journal of Electrical Engineering (SCOPUS, Vol.15(4))', 'y': '2015'},
        {'t': 'Solar Photovoltaic Generators with MPPT and Battery Storage in Microgrids', 'j': 'International Journal of Power Electronics and Drive Systems (SCOPUS, Vol.7(3))', 'y': '2016'},
        {'t': 'BPSK Modulation and Demodulation with PLC and GSM Communication for Smart Metering', 'j': 'International Journal of Power Electronics and Drive Systems (SCOPUS, Vol.7(3))', 'y': '2016'},
        {'t': 'Defining Control Strategies for Micro Grids with MPPT using Fuzzy Logic Control', 'j': 'International Journal of Power Electronics and Drive Systems (SCOPUS, Vol.7(3))', 'y': '2016'},
        {'t': 'Design, Modeling & Simulation of DSTATCOM for Distribution Lines for Power Quality Improvement', 'j': 'Journal of Electrical Engineering (SCOPUS, Vol.17(2))', 'y': '2017'},
        {'t': 'Advanced Active Power Filter for Grid Integrated Hybrid Renewable Power Generation Systems', 'j': 'Indonesian Journal of Electrical Engineering and Computer Science (SCOPUS, Vol.11(1))', 'y': '2018'},
        {'t': 'Grid Connected Inverter for Current Control by using Anti-Islanding Technique', 'j': 'International Journal of Power Electronics and Drive Systems (SCOPUS, Vol.9(2))', 'y': '2018'},
        {'t': 'Resonance Propagation and Elimination in Integrated and Islanded Micro Grids', 'j': 'International Journal of Power Electronics and Drive Systems (SCOPUS, Vol.9(3))', 'y': '2018'},
        {'t': 'Reactive Power Compensation with DSTATCOM in Single Phase Micro Grid', 'j': 'Journal of Electrical Engineering (SCOPUS, Vol.19(1))', 'y': '2019'},
        {'t': 'Dynamic Model Development for Lead Acid Storage Battery', 'j': 'Indonesian Journal of Electrical Engineering and Computer Science (SCOPUS, Vol.15(2))', 'y': '2019'},
        {'t': 'Comparison of one and two time constant models for Lithium Ion Battery', 'j': 'International Journal of Electrical and Computer Engineering (SCOPUS, Vol.10(1))', 'y': '2020'},
        {'t': 'Induction drive system with DSTATCOM based asymmetric twin converter', 'j': 'International Journal of Power Electronics and Drive Systems (SCOPUS, Vol.11(4))', 'y': '2020'},
        {'t': 'Chopper-Based Control Circuit for BESS Integration in Solar PV Grids', 'j': 'Energies (SCIE, Vol.14(6), IF=3.004)', 'y': '2021'},
        {'t': 'Comparison Study of Lead-Acid and Lithium-Ion Batteries for Solar Photovoltaic Applications', 'j': 'International Journal of Power Electronics and Drive Systems (SCOPUS, Vol.12(2))', 'y': '2021'},
        {'t': 'Design and analysis of dual-mode numerically controlled oscillators based controlled oscillator frequency modulation', 'j': 'International Journal of Electrical and Computer Engineering (SCOPUS, Vol.12(5))', 'y': '2022'},
        {'t': 'Design and Memory Optimization of Hybrid M-GDI Numerical Controlled Oscillator', 'j': 'International Transaction Journal of Engineering, Management & Applied Sciences & Technologies (ESCI, Vol.13(12))', 'y': '2022'},
        {'t': 'Design and memory optimization of hybrid gate diffusion input numerical controlled oscillator', 'j': 'International Journal of Reconfigurable and Embedded Systems (SCOPUS, Vol.12(1))', 'y': '2023'},
        {'t': 'Transmission line fault analysis using actuating relays and Atmega 328P controller', 'j': 'International Journal of Applied Power Engineering (SCOPUS, Vol.12(2))', 'y': '2023'},
    ],
    'conferences': 5, 'books': [], 'patents': [], 'awards': []
}

# ── pramod-kumar (Mechanical) ─────────────────────────────────────────────────
updates['pramod-kumar'] = {
    'name': 'Dr. Pramod Kumar Peyyala', 'role': 'Associate Professor',
    'dept': 'Mechanical Engineering',
    'qual': 'Ph.D (Mechanical Engineering, JNTUK), M.Tech (CAD/CAM), B.Tech',
    'email': 'pramod.330@gmail.com',
    'exp': '12 years', 'joined': '',
    'areas': ['CAD/CAM', 'Composite Materials', 'Nanocomposites', 'Structural Analysis', 'FEA'],
    'subjects': ['CAD/CAM', 'Strength of Materials', 'Finite Element Analysis', 'Engineering Mechanics'],
    'journals': [
        {'t': 'An analytical study on buckling behavior of CNT/polymer composite plates', 'j': 'Journal of Theoretical and Applied Mechanics (SCIE, Vol.56(1))', 'y': '2018'},
        {'t': 'First Order Shear Deformation Theory for stress research of CNT/Polymer Laminated Composite Plate', 'j': 'International Journal of Engineering and Advanced Technology (SCOPUS)', 'y': '2019'},
        {'t': 'Correlation of CLPT and FSDT responses in CNT/Polymer composite beams', 'j': 'International Journal of Recent Technology and Engineering (SCOPUS)', 'y': '2019'},
        {'t': 'An Analytical Investigation of Deflection Behavior of CNT Reinforced Composite Plates', 'j': 'Journal of Advanced Research in Dynamical and Control Systems (SCOPUS)', 'y': '2019'},
        {'t': 'An Analytical Study of Buckling Behavior of Nanocomposite Beams', 'j': 'SAE Technical Paper Series (SCOPUS)', 'y': '2018'},
        {'t': 'Deflection and Buckling behaviour of simply supported nanocomposite beams', 'j': 'Materials Science and Engineering (SCOPUS, Vol.225)', 'y': '2017'},
        {'t': 'Deflection Behavior of Carbon Nanotube Reinforced Polymer Composite Beams', 'j': 'Materials Today (SCOPUS, Vol.5(13))', 'y': '2018'},
        {'t': 'A First Order Shear Deformation Theory Approach for Buckling of Nanocomposite Beams', 'j': 'International Journal of Aerospace and Mechanical Engineering', 'y': '2017'},
        {'t': 'Experimental Investigation for Evaluation of Mechanical Properties of Rice Husk and Saw Dust Composites', 'j': 'International Journal of Trend in Research and Development', 'y': '2018'},
    ],
    'conferences': 4, 'books': [], 'patents': [], 'awards': []
}

# ── ravi-kiran (Mechanical) ───────────────────────────────────────────────────
updates['ravi-kiran'] = {
    'name': 'Dr. Ch. Ravi Kiran', 'role': 'Associate Professor',
    'dept': 'Mechanical Engineering',
    'qual': 'Ph.D (JNTU Ananthapur), M.Tech (Thermal Engineering), B.Tech',
    'email': 'ravimadhu1063@gmail.com',
    'exp': '5 years', 'joined': '',
    'areas': ['Thermal Engineering', 'Biodiesel', 'IC Engines', 'Heat Transfer', 'Renewable Fuels'],
    'subjects': ['Thermodynamics', 'IC Engines', 'Heat Transfer', 'Fluid Mechanics'],
    'journals': [
        {'t': 'Experimental Investigation of Performance & Emission Characteristics of CI Diesel Engine Using Jute Oil Blends', 'j': 'International Journal of Applied Engineering Research (UGC CARE, Vol.13(2))', 'y': '2018'},
        {'t': 'A Numerical Model to Predict the Performance of CI Engine Enriched by Hydrogen Fuel using CFD', 'j': 'International Journal of Applied Engineering Research (UGC CARE, Vol.13(2))', 'y': '2018'},
        {'t': 'Impact of Injection Timing on CI Engine using Biodiesel', 'j': 'International Journal of Recent Technology and Engineering (SCOPUS, Vol.7)', 'y': '2019'},
        {'t': 'Performance and Emission Analysis of CI Diesel Engine for Varied Combustion Chamber Designs using Biodiesel', 'j': 'International Journal for Research in Engineering Application & Management (UGC CARE, Vol.5(4))', 'y': '2019'},
        {'t': 'Experimental Investigations on the Impact of EGR for C.I. Diesel Engine Using Biodiesel', 'j': 'International Journal for Research in Engineering Application & Management (UGC CARE, Vol.5(8))', 'y': '2019'},
        {'t': 'Analysis on the effect of pilot injection strategies on combustion of palm-munja biodiesel/diesel blend on CRDI engine', 'j': 'International Journal of Ambient Energy (ESCI)', 'y': '2019'},
        {'t': 'Selecting Optimal Combination of Operating Parameters of VCR Diesel Engine Adopting AHP', 'j': 'Indian Journal of Science and Technology (SCOPUS, Vol.12(33))', 'y': '2019'},
        {'t': 'Performance Evaluation and Effectiveness of Double Pipe Heat Exchanger', 'j': 'International Journal of Mechanical and Production Engineering Research and Development (SCOPUS, Vol.9(6))', 'y': '2019'},
        {'t': 'Experimental Evaluation of Impact Energy on Oobleck Material (Non-Newtonian Fluid)', 'j': 'Materials Today Proceedings (SCOPUS-Elsevier)', 'y': '2020'},
        {'t': 'Experimental investigation of performance and emission characteristics of diesel engine using pine oil blends', 'j': 'AIP Conference Proceedings (2317: 040006)', 'y': '2021'},
        {'t': 'Effect of diphenylamine nano additive with pine oil biodiesel on performance and emission of CI engine', 'j': 'AIP Conference Proceedings (2317: 020041)', 'y': '2021'},
        {'t': 'Bending of Exponentially Graded Plates using new HSDT', 'j': 'Journal of Computational and Applied Research in Mechanical Engineering (SCOPUS-Elsevier)', 'y': '2021'},
    ],
    'conferences': 5, 'books': [], 'patents': [], 'awards': []
}

# ── m-venkateswar-reddy (Mechanical) ─────────────────────────────────────────
updates['m-venkateswar-reddy'] = {
    'name': 'Mr. M. Venkateswar Reddy', 'role': 'Assistant Professor',
    'dept': 'Mechanical Engineering',
    'qual': 'M.Tech (CAD/CAM), B.Tech (Mechanical Engineering)',
    'email': 'mallevreddy@gmail.com',
    'exp': '15 years', 'joined': '',
    'areas': ['CAD/CAM', 'Fracture Mechanics', 'Piping Design', 'FEA', 'Alternative Fuels'],
    'subjects': ['CAD/CAM', 'Strength of Materials', 'Engineering Drawing', 'Thermodynamics'],
    'journals': [
        {'t': 'Fracture Analysis of Single and Two Collinear Square hole Cracks in a Plate under Tension using FEA', 'j': 'International Journal Of Scientific Research And Education (Vol.3(7))', 'y': '2015'},
        {'t': 'An outline of piping design using CAESER II — Case Study', 'j': 'Materials Today: Proceedings (SCOPUS-Elsevier, Vol.4)', 'y': '2017'},
        {'t': 'Investigations on Material Casualty of Plates under Impact Load Conditions', 'j': 'International Journal of Research in Engineering and Technology (Vol.2(9))', 'y': '2013'},
        {'t': 'Effect of Antioxidant and Cetane Improver on Performance and Emissions using Waste Plastic Oil-Diesel Blends', 'j': 'International Journal of Innovative Technology and Exploring Engineering (Vol.9(4))', 'y': '2020'},
    ],
    'conferences': 3, 'books': [], 'patents': [], 'awards': []
}

# ── saiprakash (Aeronautical) ─────────────────────────────────────────────────
updates['saiprakash'] = {
    'name': 'Dr. M. Saiprakash', 'role': 'Associate Professor',
    'dept': 'Aeronautical Engineering',
    'qual': 'Ph.D, M.E, B.E (Aeronautical Engineering)',
    'email': 'iamsaiaero@gmail.com',
    'exp': '4.5 years', 'joined': '',
    'areas': ['Hypersonic Aerodynamics', 'Shock Tunnel Testing', 'Heat Transfer', 'Fluid Dynamics', 'Aerospace'],
    'subjects': ['Aerodynamics', 'Gas Dynamics', 'Heat Transfer', 'Fluid Mechanics'],
    'journals': [
        {'t': 'Visualization of shock wave phenomenon around a sharp cone model at hypersonic Mach Number using high speed Schlieren facility', 'j': 'Journal of Applied Fluid Mechanics (Vol.12(2))', 'y': '2019'},
        {'t': 'Heat transfer rate and surface pressure measurements in short duration hypersonic flow', 'j': 'Aeronautical Journal (ISSN 0001-9240, Vol.123, Issue 1269)', 'y': '2019'},
        {'t': 'Effects of angle of attack and bluntness on heating rate distribution of blunt models at hypersonic speeds', 'j': 'Fluid Dynamics — Springer', 'y': '2019'},
        {'t': 'Convective heat-transfer rate and surface pressure distribution over a cone model at hypersonic speeds', 'j': 'Proc. IMechE Part G: Journal of Aerospace Engineering', 'y': '2018'},
        {'t': 'Investigations of Slender bodies at hypersonic Mach number', 'j': 'Thermal Science', 'y': '2019'},
    ],
    'conferences': 6, 'books': [], 'patents': [], 'awards': []
}

# ── aruna (MBA) ───────────────────────────────────────────────────────────────
updates['aruna'] = {
    'name': 'Dr. G. Aruna', 'role': 'Professor',
    'dept': 'Master of Business Administration',
    'qual': 'Ph.D (Finance), MBA, B.A',
    'email': 'aruna.gudimetla@gmail.com',
    'exp': '14 years', 'joined': '02-01-2020',
    'areas': ['Finance', 'Mutual Funds', 'Investment Analysis', 'Financial Management'],
    'subjects': ['Financial Management', 'Investment Analysis', 'Securities and Portfolio Management'],
    'journals': [
        {'t': 'Performance and Performance Persistence of Indian Thematic Mutual Funds', 'j': 'Sumedha Journal of Management (Vol.7)', 'y': '2018'},
        {'t': 'Performance of Sector-Specific Mutual Fund Schemes — Indian Evidence', 'j': 'Journal of Advanced Research in Dynamical & Control Systems (Vol.10(8))', 'y': '2018'},
        {'t': 'The Performance of Banking Funds in India during the period 2010-2013', 'j': 'Abhinav International Monthly Referred Journal of Research in Management & Technology (Vol.II)', 'y': '2013'},
        {'t': 'Risk-Adjusted Performance Evaluation of Infrastructure Funds in India', 'j': 'International Journal of Research in Commerce, IT & Management (Vol.3(7))', 'y': '2013'},
    ],
    'conferences': 3, 'books': [], 'patents': [], 'awards': []
}

# ── m-tirupalaiah (MBA) ───────────────────────────────────────────────────────
updates['m-tirupalaiah'] = {
    'name': 'Dr. M. Tirupalaiah', 'role': 'Associate Professor',
    'dept': 'Master of Business Administration',
    'qual': 'Ph.D (Economics), MA, BA',
    'email': 'TIRUPALAIAH1963@GMAIL.COM',
    'exp': '20 years', 'joined': '01-07-2009',
    'areas': ['Rural Banking', 'Economics', 'Finance', 'Microfinance'],
    'subjects': ['Managerial Economics', 'Business Environment', 'Financial Management'],
    'journals': [], 'conferences': 3, 'books': [], 'patents': [], 'awards': []
}

# ── t-venkata-nagaraju (CSE/IT) ───────────────────────────────────────────────
updates['t-venkata-nagaraju'] = {
    'name': 'Dr. T. Venkata Nagaraju', 'role': 'Associate Professor',
    'dept': 'Computer Science and Engineering',
    'qual': 'Ph.D (Computer Science & Engineering), M.Tech, B.Tech',
    'email': 'drtvnraju@mlrinstitutions.ac.in',
    'exp': '11 years', 'joined': '13-12-2021',
    'areas': ['Machine Learning', 'Deep Learning', 'Data Science', 'Artificial Intelligence'],
    'subjects': ['Machine Learning', 'Data Structures', 'Python Programming', 'AI'],
    'journals': [], 'conferences': 0, 'books': [], 'patents': [], 'awards': []
}

def js_str(s):
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')

def make_entry(key, d):
    journals_js = ',\n          '.join(
        '{t: "%s", j: "%s", y: "%s"}' % (js_str(j['t']), js_str(j['j']), js_str(j['y']))
        for j in d['journals']
    )
    areas_js = ', '.join('"%s"' % js_str(a) for a in d['areas'])
    subjects_js = ', '.join('"%s"' % js_str(s) for s in d['subjects'])
    return '''name: "%s", role: "%s", dept: "%s",
        photo: "images/%s/%s.jpg", qual: "%s",
        email: "%s", exp: "%s", joined: "%s",
        areas: [%s],
        subjects: [%s],
        journals: [%s],
        conferences: %d, confTitles: [], books: [], patents: [], awards: []''' % (
        js_str(d['name']), js_str(d['role']), js_str(d['dept']),
        dept_folder(key), key,
        js_str(d['qual']), js_str(d['email']), js_str(d['exp']), js_str(d['joined']),
        areas_js, subjects_js,
        '\n          ' + journals_js if journals_js else '',
        d['conferences']
    )

def dept_folder(key):
    dept_map = {
        'sonu-kumar': 'eee', 'sumana-das': 'eee', 'bv-rajanna': 'eee',
        'pramod-kumar': 'mechanical', 'ravi-kiran': 'mechanical', 'm-venkateswar-reddy': 'mechanical',
        'saiprakash': 'aeronautical',
        'aruna': 'mba', 'm-tirupalaiah': 'mba',
        't-venkata-nagaraju': 'cse',
    }
    return dept_map.get(key, 'cse')

changed = 0
for key, data in updates.items():
    # Find the entry in content
    pattern = re.compile(
        r'("%s"\s*:\s*\{)([^}]*(?:\{[^}]*\}[^}]*)*?)(\s*\}\s*[,}])' % re.escape(key),
        re.DOTALL
    )
    m = pattern.search(content)
    if not m:
        print(f'NOT FOUND: {key}')
        continue

    new_body = '\n        ' + make_entry(key, data) + '\n      '
    new_entry = m.group(1) + new_body + m.group(3)
    content = content[:m.start()] + new_entry + content[m.end():]
    print(f'UPDATED: {key}')
    changed += 1

if changed:
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'\nSaved {changed} updates.')
else:
    print('Nothing updated.')
