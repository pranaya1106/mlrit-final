#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update facultyDB - Mechanical, Aeronautical, MBA faculty."""
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = 'c:/mlr/homepage/departments/faculty-profile.html'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

def js_str(s):
    return s.replace('\\','\\\\').replace('"','\\"').replace('\n',' ')

def journals_js(lst):
    if not lst: return ''
    items = ',\n          '.join('{t:"%s",j:"%s",y:"%s"}' % (js_str(j['t']),js_str(j['j']),js_str(j['y'])) for j in lst)
    return '\n          '+items

def books_js(lst):
    if not lst: return ''
    return ', '.join('{t:"%s",pub:"%s",y:"%s",isbn:"%s"}' % (js_str(b.get('t','')),js_str(b.get('pub','')),js_str(b.get('y','')),js_str(b.get('isbn',''))) for b in lst)

def patents_js(lst):
    if not lst: return ''
    return ', '.join('{t:"%s",no:"%s",y:"%s"}' % (js_str(p.get('t','')),js_str(p.get('no','')),js_str(p.get('y',''))) for p in lst)

def make_body(key, d):
    folder = d.get('folder','mechanical')
    photo = f'images/{folder}/{key}.jpg'
    areas = ', '.join('"%s"'%js_str(a) for a in d['areas'])
    subjs = ', '.join('"%s"'%js_str(s) for s in d['subjects'])
    return (
        'name:"%s", role:"%s", dept:"%s",\n'
        '        photo:"%s", qual:"%s",\n'
        '        email:"%s", exp:"%s", joined:"%s",\n'
        '        areas:[%s],\n'
        '        subjects:[%s],\n'
        '        journals:[%s],\n'
        '        conferences:%d, confTitles:[], books:[%s], patents:[%s], awards:[]'
    ) % (
        js_str(d['name']),js_str(d['role']),js_str(d['dept']),
        photo,js_str(d['qual']),
        js_str(d['email']),js_str(d['exp']),js_str(d['joined']),
        areas, subjs,
        journals_js(d['journals']),
        d['conferences'], books_js(d.get('books',[])), patents_js(d.get('patents',[]))
    )

updates = {

# ── MECHANICAL ────────────────────────────────────────────────────────────────
'chintala-muralikrishna': dict(
    name='Mr. Chintala Muralikrishna', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech, B.Tech (Mechanical Engineering)', email='krishnamurali597@gmail.com',
    exp='2 years', joined='',
    areas=['Mechanical Engineering', 'Manufacturing', 'Thermal Engineering'],
    subjects=['Engineering Mechanics', 'Manufacturing Technology', 'Thermodynamics'],
    journals=[], conferences=0, books=[], patents=[], folder='mechanical'
),

'j-sunil-kumar': dict(
    name='Mr. J. Sunil Kumar', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech, B.Tech (Mechanical Engineering)', email='jyothula92@gmail.com',
    exp='1 year', joined='',
    areas=['Machine Design', 'CAD/CAM', 'Mechanical Design'],
    subjects=['Machine Design', 'Engineering Drawing', 'Strength of Materials'],
    journals=[], conferences=0, books=[], patents=[], folder='mechanical'
),

'laxmi': dict(
    name='Mrs. Laxmi', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech (Thermal Engineering), B.Tech (Mechanical Engineering)', email='laxmi.g@mlrit.ac.in',
    exp='1 year', joined='01-07-2021',
    areas=['Thermal Engineering', 'Heat Transfer', 'Fluid Mechanics'],
    subjects=['Thermodynamics', 'Heat Transfer', 'Fluid Mechanics'],
    journals=[], conferences=0, books=[], patents=[], folder='mechanical'
),

'm-sundeep': dict(
    name='Mr. M. Sundeep', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech (Engineering Design), B.Tech (Mechanical Engineering)', email='moyya.sundeep@gmail.com',
    exp='5 years', joined='',
    areas=['Engineering Design', 'Manufacturing', 'CAD/CAM'],
    subjects=['Engineering Design', 'CAD/CAM', 'Manufacturing Technology'],
    journals=[
        {'t':'Planning and scheduling of manufacturing process analysis','j':'International Journal for Innovative Engineering & Management Research (Vol.9, Issue 3)','y':'2020'},
    ],
    conferences=2, books=[], patents=[], folder='mechanical'
),

'mudhuganti-mahender': dict(
    name='Mr. Mudhuganti Mahender', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech, B.Tech (Mechanical Engineering)', email='mahenderreddy@mlrinstituions.ac.in',
    exp='4 years', joined='',
    areas=['CAD/CAM', 'Heat Transfer', 'Thermal Engineering'],
    subjects=['CAD/CAM', 'Heat Transfer', 'Fluid Mechanics'],
    journals=[
        {'t':'Experimental Analysis of Convective Heat Transfer and Second Law Analysis in a Helical Coil under Turbulent Condition','j':'International Journal of Mechanical Engineering and Technology (Vol.8, Issue 8)','y':'2017'},
    ],
    conferences=2, books=[], patents=[], folder='mechanical'
),

'ne-chandra-prasad': dict(
    name='Mr. N.E. Chandra Prasad', role='Assistant Professor', dept='Mechanical Engineering',
    qual='Ph.D (KL University), M.Tech, B.Tech', email='prasadmlr555@gmail.com',
    exp='6 years', joined='06-04-2015',
    areas=['Manufacturing', 'Biodiesel', 'Biomechanics', 'IC Engines'],
    subjects=['Manufacturing Technology', 'Internal Combustion Engines', 'Thermodynamics'],
    journals=[
        {'t':'Effect Of Mahua Oil Methyl Ester With Additive As An IC Engine Fuel In Combination With Diesel In CI Engine','j':'International Journal of Mechanical Engineering and Technology (Vol.8, Issue 5)','y':'2017'},
        {'t':'Finite Element Modeling And Analysis Of Hip Joint Prosthesis With Modular Stems','j':'International Journal of Mechanical Engineering and Technology (Vol.8, Issue 6)','y':'2017'},
        {'t':'Performance and Emission Analysis of CI Engine Fuelled with the Blends of Palm Methyl Esters and Diesel','j':'International Journal of Mechanical Engineering and Technology (Vol.8, Issue 6)','y':'2017'},
        {'t':'Experimental Investigation On CI Engine Fuelled With The Blends Of Olive Oil Methyl Ester And Diesel','j':'International Journal of Mechanical Engineering and Technology (Vol.8, Issue 7)','y':'2017'},
    ],
    conferences=3, books=[], patents=[], folder='mechanical'
),

'prabhu-kishore': dict(
    name='Dr. N. Prabhu Kishore', role='Associate Professor', dept='Mechanical Engineering',
    qual='Ph.D, M.Tech (Production Engineering), B.Tech (Mechanical Engineering)',
    email='n.prabhukishore@mlrinstitutions.ac.in', exp='12 years', joined='08-09-2012',
    areas=['Production Engineering', 'Biodiesel', 'Aerospace Propulsion', 'Active Learning'],
    subjects=['Manufacturing Technology', 'Production Engineering', 'Operations Research', 'IC Engines'],
    journals=[
        {'t':'Performance Comparison Of GFRP Composite I Section With An Aluminum I Section','j':'International Journal (Mechanical Engineering)','y':'2015'},
        {'t':'Experimental Analysis of Calophyllum Inophyllum Biodiesel Blends On Variable Compression Ratio Diesel Engine','j':'International Journal (Mechanical Engineering)','y':'2017'},
        {'t':'Performance Analysis Of Variable Compression Ratio Diesel Engine Using Calophyllum Inophyllum Biodiesel','j':'International Journal (Mechanical Engineering)','y':'2017'},
        {'t':'Effect of Antioxidant and Cetane Improver on Performance and Emissions using Waste Plastic Oil-Diesel Blends as Fuel','j':'International Journal of Innovative Technology and Exploring Engineering (Vol.9, Issue 4)','y':'2020'},
        {'t':'Dynamic fluid flow characteristics in the hydrogen-fuelled scramjet combustor with transverse fuel injection','j':'International Journal (Aerospace Engineering)','y':'2018'},
        {'t':'Experimental Investigation By Varying Fuel Injection Pressure On CI Engine','j':'International Journal (Mechanical Engineering)','y':'2016'},
    ],
    conferences=4,
    books=[{'t':'An Introduction to Active Learning Strategies','pub':'','y':'','isbn':''},{'t':'Aircraft Computer Aided Drafting','pub':'','y':'','isbn':''}],
    patents=[], folder='mechanical'
),

's-nagaraju': dict(
    name='Mr. S. Nagaraju', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech (Industrial Engineering), B.Tech (Mechanical Engineering)', email='nagarajusunnam@mlristitutions.ac.in',
    exp='10 years', joined='',
    areas=['Industrial Engineering', 'Operations Research', 'Manufacturing Systems'],
    subjects=['Industrial Engineering', 'Operations Research', 'Manufacturing Technology'],
    journals=[], conferences=3, books=[], patents=[], folder='mechanical'
),

'g-venkata-rambabu': dict(
    name='Mr. Gottipati Venkata Rambabu', role='Assistant Professor', dept='Mechanical Engineering',
    qual='M.Tech (Thermal Engineering), B.E (Mechanical Engineering)', email='rambabu@mlrinstitutions.ac.in',
    exp='23 years', joined='08-07-2019',
    areas=['Thermal Engineering', 'Heat Transfer', 'Fluid Mechanics', 'IC Engines'],
    subjects=['Thermodynamics', 'Heat Transfer', 'Fluid Mechanics', 'IC Engines'],
    journals=[], conferences=3, books=[], patents=[], folder='mechanical'
),

'g-chandramohana-reddy': dict(
    name='Dr. G. Chandramohana Reddy', role='Assistant Professor', dept='Mechanical Engineering',
    qual='Ph.D, M.Tech, AMIE', email='cmreddy115@gmail.com',
    exp='5 years', joined='09-11-2015',
    areas=['CAD/CAM', 'Welding Technology', 'Renewable Energy', 'Biodiesel'],
    subjects=['CAD/CAM', 'Manufacturing Technology', 'Thermodynamics', 'Engineering Mechanics'],
    journals=[
        {'t':'Design And Analysis of Spillway Radial Gate','j':'International Journal of Scientific Research and Education','y':'2016'},
        {'t':'Modeling and Analysis of Automotive Fuel Cell','j':'International Journal of Innovative Research in Science, Engineering and Technology','y':'2016'},
        {'t':'Evaluation of Joint Properties of Friction Stir Welded AL/CU Bimetallic Lap Joints','j':'International Journal of Civil Engineering and Technology (IJCIET)','y':'2017'},
        {'t':'Multi Response Objective Optimization of Friction Stir Welding Parameters of Dissimilar Metals','j':'International Journal of Mechanical and Production Engineering Research and Development (IJMPERD)','y':'2018'},
        {'t':'Effect of Emulsifier on Performance and Emission Characteristics of Diesel Engine using Palm Biodiesel','j':'International Journal of Mechanical and Production Engineering Research and Development (IJMPERD)','y':'2018'},
    ],
    conferences=3, books=[], patents=[], folder='mechanical'
),

# ── AERONAUTICAL ──────────────────────────────────────────────────────────────
'sreekanth-sura': dict(
    name='Mr. Sreekanth Sura', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Advanced Design and Manufacturing), B.Tech (Aeronautical Engineering)',
    email='sreekanthsuramlrit@gmail.com', exp='3 years', joined='',
    areas=['Aeronautical Design', 'Composite Materials', 'UAV Design', 'Propulsion', 'Fluid Mechanics'],
    subjects=['Aircraft Structures', 'Aerodynamics', 'Composite Materials', 'Propulsion Systems'],
    journals=[
        {'t':'3-Blade Propeller Design and Acoustical Analysis','j':'Journal of Physics: Conference Series (Vol.2837, Issue 1)','y':'2024'},
        {'t':'Analysis and Fabrication of Aluminium Composite with SiC and Graphite Using Stir Casting','j':'Journal of Physics: Conference Series (Vol.2837, Issue 1)','y':'2024'},
        {'t':'Design and fabrication of micro class aerial vehicle with elliptical wing tips','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Design and analysis of propeller','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Modeling and static structural analysis on stiffened panel for an aircraft structure','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'An experimental study on mechanical properties of Kevlar composite for aircraft structural applications','j':'Materials Today: Proceedings','y':'2022'},
        {'t':'Design and fabrication of micro air vehicle (MAV) with double-bubble fuselage','j':'International Journal of Recent Technology and Engineering (IJRTE, Vol.8, Issue 4)','y':'2019'},
        {'t':'Stress analysis of high speed four bar mechanism','j':'International Journal of Mechanical and Production Engineering Research and Development (IJMPERD, Vol.8)','y':'2018'},
    ],
    conferences=10,
    books=[],
    patents=[
        {'t':'Method to Detect Soil Moisture Using UAV','no':'202141059725 A','y':'2021'},
        {'t':'2D Plain-Woven Pattern Kevlar Composite Reinforced with Polyester Resin','no':'202241068882 A','y':'2022'},
        {'t':'Morphing Wing for UAV','no':'202341066779 A','y':'2023'},
        {'t':'Co-Axial Propeller for Morphing Wing UAV','no':'202341066778 A','y':'2023'},
        {'t':'Water-Can with Mouth-Piece','no':'202441082643 A','y':'2024'},
        {'t':'Emergency Landing Gear Deployment Mechanism','no':'202441078423 A','y':'2024'},
    ],
    folder='aeronautical'
),

'swetha-bala': dict(
    name='Dr. Swetha Bala MNVS', role='Associate Professor & Associate Dean', dept='Aeronautical Engineering',
    qual='Ph.D, M.Tech (Aerospace Engineering), B.Tech (Aeronautical Engineering)',
    email='swethabala@mlrinstitutions.ac.in', exp='13 years', joined='13-06-2019',
    areas=['Aerospace Structures', 'Composite Materials', 'MAV Design', 'UAV Aerodynamics', 'Winglet Design'],
    subjects=['Aircraft Structures', 'Aerodynamics', 'Composite Materials', 'Engineering Drawing'],
    journals=[
        {'t':'Polymer Matrix Composite materials for Aerospace Applications','j':'International Journal of Emerging Research in Management & Technology (Vol.5)','y':'2016'},
        {'t':'Numerical Analysis of Wings for UAV Based on High Lift Airfoils','j':'International Journal of Innovations in Engineering & Technology (Vol.5)','y':'2015'},
        {'t':'A Development Scheme For MAV Mimicking the Insect Flight','j':'ICRAMAV 2013 Conference Proceedings (ISBN 9789351071693)','y':'2013'},
    ],
    conferences=5,
    books=[{'t':'Engineering Drawing','pub':'Tata McGraw Hill','y':'2016','isbn':''}],
    patents=[], folder='aeronautical'
),

'yelamasetti-balram': dict(
    name='Mr. Yelamasetti Balram', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Aeronautical/Aerospace Engineering), B.Tech', email='',
    exp='3 years', joined='',
    areas=['Aeronautical Engineering', 'Aircraft Structures', 'Aerodynamics'],
    subjects=['Aircraft Structures', 'Aerodynamics', 'Flight Mechanics'],
    journals=[], conferences=0, books=[], patents=[], folder='aeronautical'
),

'a-sai-kumar': dict(
    name='Mr. A. Sai Kumar', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Aerospace Engineering), B.Tech (Aeronautical Engineering)',
    email='ask.mraj@mlrinstitutions.ac.in', exp='9 years', joined='22-02-2017',
    areas=['UAV Design', 'CFD Analysis', 'Aerodynamics', 'Aerospace Structures', 'Propulsion'],
    subjects=['Aerodynamics', 'Aircraft Structures', 'CFD', 'UAV Design', 'Gas Dynamics'],
    journals=[
        {'t':'Exhaust manifold performance enhancement using nano fluids','j':'Scientific Reports (Vol.15, No.1)','y':'2025'},
        {'t':'Comprehensive comparative study of the durability wear assessment','j':'ACS Omega (Vol.9, No.43)','y':'2024'},
        {'t':'Design and fabrication of blended wing body UAV','j':'AIP Conference Proceedings (Vol.2492)','y':'2023'},
        {'t':'Modelling and CFD analysis of supercritical airfoil with slotted flap','j':'AIP Conference Proceedings (Vol.2492)','y':'2023'},
        {'t':'Numerical simulation of a blunt body to investigate drag characteristics','j':'AIP Conference Proceedings (Vol.2492)','y':'2023'},
        {'t':'High-speed aerodynamic analysis of a ducted re-entry vehicle','j':'AIP Conference Proceedings (Vol.2492)','y':'2023'},
        {'t':'Flow investigation of a multiple winglet wing model','j':'AIP Conference Proceedings (Vol.2492)','y':'2023'},
        {'t':'A review on the sustainable procurement of microalgal biomass','j':'Chemosphere (Vol.311)','y':'2023'},
        {'t':'Mechanical characterization of friction stir welded dissimilar aluminium alloy','j':'Materials Today: Proceedings','y':'2023'},
        {'t':'Design of a canard-wing UAV','j':'Graduate Research in Engineering and Technology','y':'2022'},
        {'t':'Field study of remote controlled Agrobot','j':'Materials Today: Proceedings (Vol.64)','y':'2022'},
        {'t':'Conceptual design of UAV using modular approach','j':'AIP Conference Proceedings (Vol.2317)','y':'2021'},
        {'t':'Design and analysis of UAV for high payload','j':'International Journal of Innovative Technology and Exploring Engineering (Vol.9, No.2)','y':'2019'},
        {'t':'Design and development of man portable back packable multi-purpose drone','j':'International Journal of Engineering and Advanced Technology (Vol.9, No.2)','y':'2019'},
        {'t':'Design of minimum length supersonic nozzle using the method of characteristics','j':'International Journal of Innovative Technology and Exploring Engineering (Vol.9, No.2)','y':'2019'},
        {'t':'Design of airship for aerial surveillance and communication','j':'International Journal of Mechanical and Production Engineering Research and Development (Vol.8, No.1)','y':'2018'},
        {'t':'Evaluation of effect of shape and length of spike on aerodynamics','j':'International Journal of Mechanical and Production Engineering Research and Development (Vol.8, No.1)','y':'2018'},
        {'t':'Modeling and analysis of a composite wing for missile structure','j':'International Journal of Mechanical Engineering and Technology (Vol.8, No.6)','y':'2017'},
        {'t':'Design and CFD analysis of gas turbine engine chamber','j':'IJSR (Vol.4, No.7)','y':'2015'},
        {'t':'Thermo-structure analysis of dual-bell nozzle','j':'International Journal of Engineering and Innovative Technology (Vol.4, No.11)','y':'2015'},
    ],
    conferences=15,
    books=[],
    patents=[
        {'t':'Layered Transforming Wing','no':'','y':'2021'},
        {'t':'RC Agrobot','no':'','y':'2022'},
        {'t':'Method to Rescue Child from Borewell','no':'','y':'2022'},
        {'t':'Method to use Survey Drones for Agricultural Land','no':'','y':'2022'},
        {'t':'Water-Can with Mouth-Piece','no':'','y':'2024'},
        {'t':'Thrust Measuring Bed','no':'','y':'2025'},
    ],
    folder='aeronautical'
),

'k-arun-kumar': dict(
    name='Mr. K. Arun Kumar', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.E (Aeronautical Engineering), B.E (Aeronautical Engineering)',
    email='arunssksamy@gmail.com', exp='5.5 years', joined='12-06-2019',
    areas=['Morphing Wing', 'Composite Materials', 'Aerodynamics', 'UAV Design', 'Tribology'],
    subjects=['Aircraft Structures', 'Composite Materials', 'Aerodynamics', 'Manufacturing Technology'],
    journals=[
        {'t':'Mechanism and Performance Analysis of Morphing Wing','j':'International Journal of Innovative Technology and Exploring Engineering (Vol.9, Issue 3)','y':'2020'},
        {'t':'Experimental analysis on feed force reduction performance by nano fluid','j':'Materials Today: Proceedings (Vol.64)','y':'2022'},
        {'t':'Influences of basalt fiber position and addition on mechanical properties','j':'Iranian Polymer Journal','y':'2024'},
        {'t':'Development of statistical and soft computing regression models for WEDM','j':'International Journal on Interactive Design and Manufacturing (IJIDeM)','y':'2024'},
        {'t':'Multi-perspective structural integrity investigations on airframe of Gyrodyne','j':'Reviews on Advanced Materials Science','y':'2023'},
        {'t':'Design, control, aerodynamic performances, and structural integrity investigations of compact ducted drone','j':'Scientific Reports','y':'2024'},
        {'t':'Design, aerodynamic, and structural integrity investigations of advanced three bladed propeller','j':'Results in Engineering','y':'2025'},
        {'t':'Multi-Perspective Behavioural Investigations on Coolant of Battery Thermal Management','j':'Energy Science and Engineering','y':'2025'},
        {'t':'Multiperspective Structural Integrity Investigations on Rotor Blade of Axial Flow Compressor','j':'International Journal of Aerospace Engineering','y':'2025'},
        {'t':'Thermo-mechanical and mechanical performance of interlaced glass fiber epoxy hybrid composites','j':'Journal of Polymer Research','y':'2025'},
        {'t':'Experimental studies on electrostatic removal of particulate matter emission','j':'Results in Engineering','y':'2025'},
        {'t':'Experimental investigation on mechanical and vibrational analysis of kevlar/jute fiber','j':'Journal of Polymer Research','y':'2025'},
    ],
    conferences=3,
    books=[],
    patents=[
        {'t':'Foam-Filled Corrugated Core Sandwich Panels For Enhanced Structural Performance','no':'202541070886','y':'2025'},
        {'t':'Corrugated Nozzle to Enhance Noise Suppression in Ramjet Powered Helicopter','no':'202241027366','y':'2022'},
        {'t':'Unconventional Wing Mechanism to Enhance Optimum Thickness to Chord Ratio','no':'202241027374','y':'2022'},
        {'t':'Morphing Wing Using Gear-Rod Mechanism','no':'202241027368','y':'2022'},
        {'t':'Semi-Automatic Child Retraction Mechanism from Bore Well','no':'202141034363','y':'2021'},
    ],
    folder='aeronautical'
),

'b-nagaraj-goud': dict(
    name='Mr. B. Nagaraj Goud', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Aerospace Engineering), B.Tech (Aeronautical Engineering)',
    email='nagaraj2107@gmail.com', exp='6 years', joined='15-06-2012',
    areas=['Aerospace Structures', 'Composite Materials', 'UAV Design', 'CFD Analysis'],
    subjects=['Aircraft Structures', 'Composite Materials', 'Aerodynamics', 'Finite Element Analysis'],
    journals=[
        {'t':'An Experimental Study on E-Glass Fiber Reinforced Epoxy with Nano-Silica for Aircraft Structural Applications','j':'Journal of Physics: Conference Series (Vol.2837)','y':'2024'},
        {'t':'Design and Structural Analysis of an Aircraft Landing Gear strut under Static Loading Condition','j':'Journal of Physics: Conference Series (Vol.2837)','y':'2024'},
        {'t':'Compressor Design optimization for a High speed Jet engine','j':'IOP Publishing (SCOPUS, Vol.455)','y':'2018'},
        {'t':'Investigation of Vehicle Rear under Run Protection Device (RUPD) Using Aluminum Foam','j':'IOP Publishing (SCOPUS, Vol.225)','y':'2017'},
        {'t':'Drag reduction over a circular Cylinder','j':'International Journal of Civil Engineering and Technology (IJCIET, SCOPUS, Vol.8, Issue 8)','y':'2017'},
        {'t':'Dynamic Aero elastic (Flutter) Instability Characteristics of an Aircraft Wing','j':'International Journal of Engineering and Innovative Technology (IJEIT, Vol.4, Issue 12)','y':'2015'},
        {'t':'Experimental Test on Glare Composite of an Aircraft Structure under Tensile Strength Failure','j':'International Journal of Engineering and Advanced Technology (IJEAT, Vol.9, Issue 2)','y':'2019'},
        {'t':'An UAV with Twin Propellers Driven by Single Motor','j':'International Journal of Innovative Technology and Exploring Engineering (IJITEE, Vol.9, Issue 2)','y':'2019'},
        {'t':'Implementing Micropatterned Surface for Drag Reduction in UAV','j':'International Journal of Recent Technology and Engineering (IJRTE, Vol.8, Issue 4)','y':'2019'},
        {'t':'Modeling and static structural analysis on stiffened panel for an aircraft structure','j':'AIP Conference Proceedings (Vol.2492)','y':'2023'},
        {'t':'Impact of metal oxides on thermal response of zirconia coated diesel engines fueled by Momordica biodiesel','j':'Scientific Reports (Vol.15)','y':'2025'},
    ],
    conferences=5,
    books=[],
    patents=[
        {'t':'Emergency Landing Gear Deployment Mechanism','no':'202441078423','y':'2024'},
        {'t':'2D Plain-Woven Pattern Kevlar-Al Based Reinforced Epoxy Klare Composite','no':'202341069043','y':'2023'},
        {'t':'Domestic Gas Cylinder Carrier (Design No: 425345-001)','no':'425345-001','y':'2024'},
    ],
    folder='aeronautical'
),

'nirmith-kumar-mishra': dict(
    name='Mr. Nirmith Kumar Mishra', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Aerospace Engineering), B.Tech (Aeronautical Engineering)',
    email='nk.aero@mlrinstitutions.ac.in', exp='9 years', joined='19-06-2017',
    areas=['Aerospace Engineering', 'UAV Design', 'Aerodynamics', 'Propulsion Systems', 'Computational Fluid Dynamics'],
    subjects=['Aerodynamics', 'Gas Dynamics', 'Aircraft Structures', 'Propulsion Systems'],
    journals=[
        {'t':'Computational study on rocket payload fairing','j':'Materials Today: Proceedings','y':'2023'},
        {'t':'Performance investigation of finite wing section with bleed hole','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Modelling and CFD analysis of supercritical airfoil with slotted flap','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Design and fabrication of blended wing body UAV','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Design and analysis of gas turbine blade','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Characterization of supercritical airfoils using computational and experimental techniques','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Mathematical Modeling of MHD Flow of CNTs/Ag Nanoparticles','j':'Mathematical Problems in Engineering','y':'2023'},
        {'t':'Numerical investigation of supersonic flow past circular cross-section bodies','j':'AIP Conference Proceedings','y':'2022'},
        {'t':'Fabrication of natural fibre based industrial safety helmet','j':'Materials Today: Proceedings','y':'2022'},
        {'t':'Numerical study of Carreau fuzzy nanofluid across a stretching cylinder','j':'Alexandria Engineering Journal','y':'2024'},
    ],
    conferences=8,
    books=[],
    patents=[
        {'t':'Thrust Measuring Bed','no':'202541071002 A','y':'2025'},
        {'t':'Thermoelectric Energy Harvesting System','no':'202541070881 A','y':'2025'},
        {'t':'Mobile Insulin Cooler','no':'202541070884 A','y':'2025'},
        {'t':'Aerodynamic Landing Gear System with Drag Reduction Features','no':'202541068713 A','y':'2025'},
        {'t':'2D Plain-Woven Pattern Kevlar Composite Reinforced with Polyester Resin','no':'202241068882 A','y':'2022'},
        {'t':'Rocket Payload Fairing','no':'202241029320 A','y':'2022'},
        {'t':'Layered Transforming Wing','no':'202141059984 A','y':'2021'},
        {'t':'Semi-Automatic Child Retraction Mechanism from Bore Well','no':'202141034363 A','y':'2021'},
    ],
    folder='aeronautical'
),

'nayani-uday-ranjan': dict(
    name='Mr. Nayani Uday Ranjan Goud', role='Associate Professor', dept='Aeronautical Engineering',
    qual='Ph.D (pursuing, GITAM University), M.Tech (Aerospace Engineering), B.E (Aeronautical Engineering)',
    email='UDAYAERO@GMAIL.COM', exp='5 years', joined='',
    areas=['Aerospace Structures', 'Buckling Analysis', 'Composite Plates', 'Structural Mechanics'],
    subjects=['Aircraft Structures', 'Strength of Materials', 'Finite Element Analysis', 'Aerodynamics'],
    journals=[
        {'t':'Buckling Load Predictions of Panel and Shell using Vibration Correlation Technique','j':'International Journal of Engineering and Advanced Technology (IJEAT, Vol.9, Issue 2)','y':'2019'},
        {'t':'Experimental Analysis of Stress Concentration on V-Notched Plate','j':'International Journal of Innovative Technology and Exploring Engineering (IJITEE, Vol.9, Issue 2)','y':'2019'},
        {'t':'Investigation on Buckling of Laminated Composite Plate','j':'IOSR Journal of Mechanical and Civil Engineering (IOSR-JMCE)','y':'2017'},
    ],
    conferences=3, books=[], patents=[], folder='aeronautical'
),

'g-sravanthi': dict(
    name='Ms. G. Sravanthi', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech (Aerospace Engineering), B.Tech (Aeronautical Engineering)',
    email='grandhamalasravanthi@gmail.com', exp='7 years', joined='08-07-2019',
    areas=['Aerospace Engineering', 'Composite Materials', 'UAV Design', 'Fluid Mechanics'],
    subjects=['Aircraft Structures', 'Aerodynamics', 'Composite Materials', 'Fluid Mechanics'],
    journals=[
        {'t':'Supercavitation analysis on disk cavitator','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'UAV optimization using tubercles wing configuration','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Thin-walled zig-zag section elastic buckling','j':'AIP Conference Proceedings','y':'2022'},
        {'t':'Corrugated plate fuselage stress analysis','j':'Materials Today Proceedings','y':'2022'},
    ],
    conferences=7,
    books=[],
    patents=[
        {'t':'Weed identifying Rover','no':'347292001','y':'2021'},
        {'t':'Morphing Wing for UAV','no':'202341066779 A','y':'2023'},
    ],
    folder='aeronautical'
),

'b-manideep': dict(
    name='Mr. B. Manideep', role='Assistant Professor', dept='Aeronautical Engineering',
    qual='M.Tech, B.Tech (Aeronautical Engineering)', email='manideepaeroblue@gmail.com',
    exp='4 years', joined='',
    areas=['Aeronautical Engineering', 'Aircraft Structures', 'Composite Materials'],
    subjects=['Aircraft Structures', 'Aerodynamics', 'Composite Materials'],
    journals=[
        {'t':'Factor of Safety and Stress Analysis of Fuselage Bulkhead using Composite Materials','j':'International Journal of Scientific Engineering and Technology Research (IJSETR, Vol.04, Issue 32)','y':'2015'},
    ],
    conferences=2, books=[], patents=[], folder='aeronautical'
),

'm-ganesh': dict(
    name='Mr. M. Ganesh', role='Associate Professor', dept='Aeronautical Engineering',
    qual='Ph.D (pursuing), M.Tech (Aerospace Engineering), B.Tech (Mechanical Engineering)',
    email='ganesh.manikonda@gmail.com', exp='15 years', joined='19-01-2011',
    areas=['Manufacturing', 'UAV Design', 'Aerospace Structures', 'CFD Analysis'],
    subjects=['Manufacturing Technology', 'Aircraft Structures', 'Aerodynamics', 'CAD/CAM'],
    journals=[
        {'t':'Design and Analysis of UAV for High Payload','j':'International Journal of Innovative Technology and Exploring Engineering (IJITEE, Vol.9, Issue 2)','y':'2019'},
        {'t':'Design and Development of Man Portable Back Packable Multi-Purpose Drone','j':'International Journal of Engineering and Advanced Technology (IJEAT, Vol.10, Issue 10)','y':'2019'},
        {'t':'Design of Airship for Aerial Surveillance and Communication','j':'International Journal of Mechanical and Production Engineering Research and Development (IJMPERD, Vol.8, Issue 1)','y':'2018'},
        {'t':'Evaluation of Effect of Shape and Length of Spike on Aerodynamics Performance','j':'International Journal of Mechanical and Production Engineering Research and Development (IJMPERD, Vol.8, Issue 1)','y':'2018'},
        {'t':'Modeling And Analysis Of a Composite Wing For Missile Structure','j':'International Journal of Mechanical Engineering and Technology (IJMET, Vol.8, Issue 6)','y':'2017'},
        {'t':'Modeling, Analysis And Fabrication Of a Piston Engine Crank Shaft','j':'International Journal of Civil Engineering and Technology (IJCIET, Vol.8, Issue 5)','y':'2017'},
        {'t':'Application Of CNC Milling In Manufacturing Turbine Blades','j':'International Journal of Civil Engineering and Technology (IJCIET, Vol.8, Issue 5)','y':'2017'},
        {'t':'Modeling And Analysis Of Outer Shell Of Cruise Missile','j':'International Journal of Research in Engineering and Technology (IJRET, Vol.5, Issue 3)','y':'2016'},
    ],
    conferences=5, books=[], patents=[], folder='aeronautical'
),

# ── MBA ───────────────────────────────────────────────────────────────────────
'umrez': dict(
    name='Dr. M. Umrez', role='Associate Professor', dept='Master of Business Administration',
    qual='Ph.D, MBA, B.Sc', email='umrez@mlrinstitutions.ac.in',
    exp='10 years', joined='12-02-2021',
    areas=['Human Resources', 'Marketing', 'Organizational Behavior'],
    subjects=['Human Resource Management', 'Marketing Management', 'Organizational Behavior'],
    journals=[], conferences=3, books=[], patents=[], folder='mba'
),

'a-koti-reddy': dict(
    name='Mr. A. Koti Reddy', role='Assistant Professor', dept='Master of Business Administration',
    qual='MBA, B.Com (Computers)', email='kotireddy.alugubelli@gmail.com',
    exp='10 years', joined='12-12-2013',
    areas=['Finance', 'Marketing', 'Financial Management'],
    subjects=['Financial Management', 'Marketing Management', 'Business Statistics'],
    journals=[], conferences=2, books=[], patents=[], folder='mba'
),

'm-parsharamulu': dict(
    name='Mr. M. Parsharamulu', role='Assistant Professor', dept='Master of Business Administration',
    qual='M.A, B.A', email='medichelmiparsharamulu@mlrinstitutions.ac.in',
    exp='3 years', joined='04-04-2017',
    areas=['Management', 'Business Administration', 'Economics'],
    subjects=['Business Environment', 'Managerial Economics', 'Business Communication'],
    journals=[], conferences=1, books=[], patents=[], folder='mba'
),

'bs-venkat-narayana': dict(
    name='Mr. B.S. Venkat Narayana', role='Assistant Professor', dept='Master of Business Administration',
    qual='MBA, B.Com', email='venkatnarayan0004@gmail.com',
    exp='6 years', joined='23-08-2017',
    areas=['Finance', 'Accounting', 'Financial Analysis'],
    subjects=['Financial Management', 'Accounting for Managers', 'Business Finance'],
    journals=[], conferences=2, books=[], patents=[], folder='mba'
),

'b-vishnu-prasad': dict(
    name='Mr. B. Vishnu Prasad', role='Assistant Professor', dept='Master of Business Administration',
    qual='MBA', email='vishnubattila594@gmail.com',
    exp='2 years', joined='17-10-2022',
    areas=['Finance', 'Investment Management'],
    subjects=['Financial Management', 'Investment Analysis', 'Business Finance'],
    journals=[], conferences=0, books=[], patents=[], folder='mba'
),

'k-rajya-lakshmi': dict(
    name='Dr. K. Rajya Lakshmi', role='Assistant Professor', dept='Master of Business Administration',
    qual='Ph.D, MA', email='rajyalakshmi.kannem@gmail.com',
    exp='6 years', joined='02-03-2022',
    areas=['English', 'Communication', 'Business English'],
    subjects=['Business Communication', 'English for Managers', 'Communication Skills'],
    journals=[], conferences=2, books=[], patents=[], folder='mba'
),

'sudha-rani': dict(
    name='Mrs. Sudha Rani N', role='Assistant Professor', dept='Master of Business Administration',
    qual='MBA, BA', email='sudharani.rani782@gmail.com',
    exp='1 year', joined='02-11-2023',
    areas=['Human Resources', 'Organizational Behavior'],
    subjects=['Human Resource Management', 'Organizational Behavior', 'Business Communication'],
    journals=[], conferences=0, books=[], patents=[], folder='mba'
),

'n-madhusudhanarao': dict(
    name='Mr. N. Madhusudhana Rao', role='Assistant Professor', dept='Master of Business Administration',
    qual='MBA, B.Com (Computers)', email='nidumolumadhu@gmail.com',
    exp='4 years', joined='16-12-2021',
    areas=['Finance', 'Marketing', 'Financial Analysis'],
    subjects=['Financial Management', 'Marketing Management', 'Business Statistics'],
    journals=[], conferences=1, books=[], patents=[], folder='mba'
),

'ram-narsa-goud': dict(
    name='Mr. Ram Narsa Goud', role='Assistant Professor', dept='Master of Business Administration',
    qual='MBA, BA', email='ramsepl@gmail.com',
    exp='1 year', joined='02-11-2023',
    areas=['Human Resources', 'Marketing'],
    subjects=['Human Resource Management', 'Marketing Management', 'Business Communication'],
    journals=[], conferences=0, books=[], patents=[], folder='mba'
),

}

changed = 0
for key, data in updates.items():
    start_pat = re.compile(r'"%s"\s*:\s*\{' % re.escape(key))
    m = start_pat.search(content)
    if not m:
        print(f'NOT FOUND: {key}')
        continue
    brace_start = m.end()-1
    depth=0; i=brace_start
    while i < len(content):
        if content[i]=='{': depth+=1
        elif content[i]=='}':
            depth-=1
            if depth==0: break
        i+=1
    new_body = '{\n        '+make_body(key,data)+'\n      }'
    content = content[:brace_start]+new_body+content[i+1:]
    print(f'UPDATED: {key}')
    changed+=1

if changed:
    with open(fpath,'w',encoding='utf-8') as f:
        f.write(content)
    print(f'\nSaved {changed} updates.')
else:
    print('Nothing updated.')
