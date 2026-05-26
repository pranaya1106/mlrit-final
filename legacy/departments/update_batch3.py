#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update facultyDB - ECE remaining faculty batch."""
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

def make_body(key, d):
    folder = d.get('folder','ece')
    photo = d.get('photo', f'images/{folder}/{key}.jpg')
    areas = ', '.join('"%s"'%js_str(a) for a in d['areas'])
    subjs = ', '.join('"%s"'%js_str(s) for s in d['subjects'])
    return (
        'name:"%s", role:"%s", dept:"%s",\n'
        '        photo:"%s", qual:"%s",\n'
        '        email:"%s", exp:"%s", joined:"%s",\n'
        '        areas:[%s],\n'
        '        subjects:[%s],\n'
        '        journals:[%s],\n'
        '        conferences:%d, confTitles:[], books:[%s], patents:[], awards:[]'
    ) % (
        js_str(d['name']),js_str(d['role']),js_str(d['dept']),
        photo,js_str(d['qual']),
        js_str(d['email']),js_str(d['exp']),js_str(d['joined']),
        areas, subjs,
        journals_js(d['journals']),
        d['conferences'], books_js(d.get('books',[]))
    )

updates = {

'mary-kannidi': dict(
    name='Ms. Mary Kannidi', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (ECE), B.Tech (ECE)', email='marykannidi@mlrit.ac.in',
    exp='2 years', joined='19-02-2024',
    areas=['VLSI', 'Embedded Systems', 'Digital Electronics'],
    subjects=['VLSI Design', 'Digital Electronics', 'Electronic Devices'],
    journals=[], conferences=4, folder='ece'
),

'n-poornima-deepthi': dict(
    name='Mrs. N. Poornima Deepthi', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (Digital Electronics and Communication Systems), B.Tech (ECE)',
    email='nandigampoornimadeepthi@gmail.com', exp='4 years', joined='12-02-2022',
    areas=['Image Processing', 'Cybersecurity', 'IoT', 'AI'],
    subjects=['Digital Image Processing', 'Signals and Systems', 'Electronic Devices'],
    journals=[], conferences=4, folder='ece'
),

'nagendra-babu': dict(
    name='Mr. Manchikatla Nagendra Babu', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (DECE), B.Tech (ECE)', email='nagmanchikatla43@gmail.com',
    exp='3.5 years', joined='01-07-2022',
    areas=['Digital Communications', 'Signal Processing', 'ECE'],
    subjects=['Digital Communications', 'Analog Communications', 'Signals and Systems'],
    journals=[], conferences=0, folder='ece'
),

'p-yakaiah': dict(
    name='Dr. P. Yakaiah', role='Associate Professor', dept='Electronics and Communication Engineering',
    qual='M.E (VLSI), B.Tech', email='potharaju.yakaiah@mlrinstitutions.ac.in',
    exp='21 years', joined='18-06-2008',
    areas=['VLSI', 'Image Processing', 'Signal Processing', 'Embedded Systems'],
    subjects=['VLSI Design', 'Digital Image Processing', 'Electronic Devices', 'Microprocessors'],
    journals=[
        {'t':'Classification of ontological violence content detection through audio features','j':'International Journal of Intelligent Engineering & Systems','y':'2019'},
        {'t':'A novel analysis of GNSS for monitoring the position of trains','j':'International Journal of Engineering & Technology','y':'2018'},
        {'t':'Image compression based on multi-level thresholding using Shannon entropy','j':'Global Journal of Advanced Engineering Technologies','y':'2015'},
        {'t':'Vehicle remote control system based on RF using ARM7 (LPC2148)','j':'International Journal of Engineering, Science and Mathematics','y':'2017'},
        {'t':'Classification of ontological violence content through spatio-temporal localized human actions','j':'International Journal of Management, Technology and Engineering','y':'2019'},
        {'t':'A novel object detection approach using circular Hough transform','j':'Journal of Advanced Research in Dynamical and Control Systems','y':'2017'},
        {'t':'Wavelet-based medical image compression using region of interest','j':'International Journal of Applied Sciences, Engineering and Management','y':'2014'},
        {'t':'Digital image compression and analysis','j':'International Journal of Science and Research (IJSR)','y':'2013'},
    ],
    conferences=1, folder='ece'
),

'pullela-sravani': dict(
    name='Ms. Pullela Sravani', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech, B.Tech (ECE)', email='sravanipullela1999@gmail.com',
    exp='10 months', joined='09-06-2025',
    areas=['VLSI Design', 'Digital Electronics'],
    subjects=['VLSI Design', 'Digital Electronics', 'Electronic Devices'],
    journals=[], conferences=0, folder='ece'
),

'rayala-sateesh': dict(
    name='Mr. Rayala Sateesh', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (Systems and Signal Processing), B.Tech (ECE)',
    email='sateesh_ece@mlrinstitutions.ac.in', exp='12 years', joined='05-12-2016',
    areas=['Signal Processing', 'VLSI', 'Image Processing', 'IoT'],
    subjects=['Signals and Systems', 'Digital Signal Processing', 'VLSI Design', 'Communication Systems'],
    journals=[
        {'t':'Compressed sensing performance evaluation','j':'International Journal of Engineering & Technology','y':'2018'},
        {'t':'Human face detection using contour algorithms','j':'Indonesian Journal of Electrical Engineering','y':'2019'},
        {'t':'Railway level crossing automation via LoRa','j':'Materials Today: Proceedings','y':'2023'},
        {'t':'Grid-connected SEPIC converter for railway applications','j':'Scientific Reports','y':'2025'},
    ],
    conferences=9, folder='ece'
),

'rudraram-divya': dict(
    name='Ms. Rudraram Divya', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech, B.Tech (ECE)', email='divyareddy@mlrit.ac.in',
    exp='4 months', joined='24-10-2025',
    areas=['Embedded Systems', 'IoT', 'Signal Processing'],
    subjects=['Embedded Systems', 'Microcontrollers', 'Digital Electronics'],
    journals=[], conferences=0, folder='ece'
),

'sahitya': dict(
    name='Mrs. Pinnamaraju Sahitya', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='Ph.D (pursuing, NIT-Warangal), M.Tech (VLSI & Embedded Systems), B.Tech (ECE)',
    email='sahityapinnamaraju39@gmail.com', exp='7 years', joined='11-06-2022',
    areas=['Image Processing', 'VLSI', 'Built-in Self-Test', 'AI in Healthcare', '5G Networks'],
    subjects=['Digital Image Processing', 'VLSI Design', 'Electronic Devices', 'Signals and Systems'],
    journals=[
        {'t':'Materials for semiconductor nanowires','j':'Journal of Physics: Conference Series 2837(1)','y':'2024'},
        {'t':'Sentiment analysis with extreme learning machine for stock prediction','j':'International Conference Proceedings','y':'2025'},
        {'t':'Cybersecurity applications via knowledge graphs','j':'ASIANCON','y':'2024'},
        {'t':'Deep learning for glaucoma classification using RIG-Net','j':'International Journal','y':'2025'},
        {'t':'Quantum-TinyML neural compression for medical imaging','j':'International Journal','y':'2025'},
        {'t':'Intelligent channel allocation for 5G networks','j':'ISCS Conference Proceedings','y':'2024'},
        {'t':'Brain tumor classification','j':'International Journal of Microsystems and IoT (Vol.2(9))','y':'2024'},
        {'t':'Power optimized functional broadside tests','j':'IJVDCS (Vol.2)','y':'2014'},
    ],
    conferences=6, folder='ece'
),

'sandip-kumar': dict(
    name='Mr. Ladi Sandip Kumar Patra', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (Telecommunication), B.Tech (Electronics and Telecommunication)',
    email='sandip2010@gmail.com', exp='11 years', joined='19-08-2022',
    areas=['Time Series Prediction', 'Geo-spatial Prediction', 'Signal Estimation', 'Wireless Communications'],
    subjects=['Analog and Digital Communications', 'Signals and Systems', 'Mobile Communications'],
    journals=[], conferences=1, folder='ece'
),

'vadla-arun-kumar': dict(
    name='Mr. Vadla Arun Kumar', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (DSCE), B.Tech (ECE)', email='arun58627.ak@gmail.com',
    exp='2 years', joined='18-04-2023',
    areas=['Digital Signal Processing', 'Communications', 'Embedded Systems'],
    subjects=['Digital Communications', 'Signals and Systems', 'Electronic Devices'],
    journals=[], conferences=1, folder='ece'
),

'velpula-vijaya-kumar': dict(
    name='Dr. Velpula Vijaya Kumar', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='Ph.D (Medical Image Processing), M.Tech (Embedded Systems), B.Tech',
    email='vijaykumarv@mlrit.ac.in', exp='8 years', joined='09-11-2023',
    areas=['Medical Image Processing', 'Deep Learning', 'Glaucoma Detection', 'CNN', 'Embedded Systems'],
    subjects=['Digital Image Processing', 'Machine Learning', 'Neural Networks', 'Embedded Systems'],
    journals=[
        {'t':'Glaucoma detection with explainable AI using CNNs','j':'IET Image Processing','y':'2024'},
        {'t':'Automatic glaucoma detection using deep CNNs and visualization','j':'SN Computer Science','y':'2023'},
        {'t':'Multi-stage glaucoma classification using pre-trained CNNs','j':'Frontiers in Physiology','y':'2023'},
        {'t':'Enhanced brain tumor classification using CNNs and ensemble voting','j':'Computers and Electrical Engineering','y':'2025'},
        {'t':'Deep learning-based water-body segmentation using time-frequency attention networks','j':'Engineering Proceedings','y':'2026'},
        {'t':'Glaucoma detection via custom CNN on retinal fundus datasets','j':'MDPI','y':'2025'},
        {'t':'Brain tumor classification integrating deep learning and hyperparameter tuning','j':'Engineering Proceedings','y':'2025'},
        {'t':'Automated glaucoma detection in fundus images','j':'Engineering Proceedings','y':'2024'},
        {'t':'Metamaterial integration effects on antenna structures','j':'Journal of Physics: Conference Series','y':'2024'},
    ],
    conferences=7, folder='ece'
),

'nagarjuna-tandra': dict(
    name='Mr. Nagarjuna Tandra', role='Associate Professor', dept='Computer Science and Engineering',
    qual='M.Tech (Software Engineering), B.Tech (CSE)', email='nagarjunatandra@mlrit.ac.in',
    exp='12 years', joined='20-06-2023',
    areas=['Software Engineering', 'DBMS', 'Computer Networks', 'Operating Systems', 'Software Project Management'],
    subjects=['Software Engineering', 'Database Management Systems', 'Computer Networks', 'Operating Systems'],
    journals=[], conferences=2, folder='cse'
),

'g-kaushik': dict(
    name='Mr. G. Kaushik', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech, B.Tech', email='gundagani.kaushik@mlrinstitutions.ac.in',
    exp='6 years', joined='26-08-2019',
    areas=['Embedded Systems', 'IoT', 'Deep Learning', 'AI in Healthcare'],
    subjects=['Embedded Systems', 'Microcontrollers', 'IoT', 'Digital Electronics'],
    journals=[
        {'t':'Deep learning lung nodule identification','j':'IEEE ICSSAS','y':'2023'},
        {'t':'6G communication technologies','j':'IEEE ICONAT','y':'2024'},
        {'t':'Breast cancer classification using mammograms','j':'IEEE MEDCOM','y':'2025'},
        {'t':'Stock price forecasting with extreme learning machines','j':'IEEE ICTBIG','y':'2025'},
        {'t':'ResNet CNN performance enhancement via ASIC','j':'Springer Conference Proceedings','y':'2023'},
        {'t':'Smart CO2 monitoring device with IoT','j':'IEEE ASSIC','y':'2022'},
        {'t':'Smart stick for visually impaired using Raspberry Pi','j':'AIP Conference Proceedings','y':'2023'},
        {'t':'Brain tumor identification using 3D-MRI','j':'AIP Conference Proceedings','y':'2023'},
    ],
    conferences=14, folder='ece'
),

'gv-subba-reddy': dict(
    name='Mr. G. Venkata Subba Reddy', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (VLSI Design), B.Tech (ECE)', email='subbareddy@mlrit.ac.in',
    exp='17 years', joined='01-07-2019',
    areas=['Signal and Image Processing', 'VLSI Design', 'Deep Learning', 'Speaker Recognition'],
    subjects=['VLSI Design', 'Digital Signal Processing', 'Image Processing', 'Microprocessors'],
    journals=[
        {'t':'Facial emotion recognition using CNNs','j':'Materials Today: Proceedings','y':'2022'},
        {'t':'LSTM-based stuttered speech recognition','j':'Signal, Image and Video Processing (Springer)','y':'2023'},
        {'t':'BMO-based Lite Swin transformer for brain tumors','j':'Biomedical Signal Processing and Control','y':'2024'},
        {'t':'Speaker recognition using butterfly optimization','j':'Multimedia Tools and Applications (Springer)','y':'2024'},
        {'t':'Attention-based hybrid framework for speaker identification','j':'Multimedia Tools and Applications (Springer)','y':'2025'},
        {'t':'Smart antenna sample matrix inversion','j':'Indian Journal of Science and Technology','y':'2016'},
        {'t':'Speaker recognition in electric vehicles','j':'IEEE Conference Proceedings','y':'2022'},
        {'t':'Liver tumor detection using CNN/MobileNet','j':'IEEE Conference Proceedings','y':'2023'},
        {'t':'Brain tumor detection with YOLO and Faster R-CNN','j':'IEEE Conference Proceedings','y':'2023'},
    ],
    conferences=17, folder='ece'
),

'k-hari-babu': dict(
    name='Mr. K. Hari Babu', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='Ph.D, M.Tech (Digital Systems), B.Tech', email='haribabu1982@gmail.com',
    exp='12 years', joined='07-12-2012',
    areas=['Digital Systems', 'Embedded Systems', 'IoT', 'Cybersecurity', 'Wireless Sensor Networks'],
    subjects=['Embedded Systems', 'Microprocessors', 'Digital Electronics', 'IoT'],
    journals=[
        {'t':'IoT-based security system using Raspberry PI and mail server','j':'International Journal of Innovative Technology and Exploring Engineering','y':'2019'},
        {'t':'IoT detection of milk parameters using Raspberry PI and GSM for dairy farmers','j':'International Journal of Innovative Technology and Exploring Engineering','y':'2019'},
        {'t':'IoT-based smart home automation using LabVIEW','j':'Journal of Engineering and Applied Sciences','y':'2018'},
        {'t':'Performance evaluation of CDMA/MIMO communication system using permutation spreading','j':'Journal of Engineering and Applied Sciences','y':'2018'},
        {'t':'Unmanned soldier assistance vehicle with autonomous path tracking','j':'Journal of Advanced Research in Dynamical and Control Systems','y':'2018'},
        {'t':'Novel image cryptography using nearest prime pixel algorithm','j':'Journal of Advanced Research in Dynamical and Control Systems','y':'2018'},
        {'t':'Metamaterial antenna for wireless systems','j':'Journal of Physics: Conference Series 2837(1)','y':'2024'},
    ],
    conferences=5, folder='ece'
),

'k-maniraj': dict(
    name='Mr. K. Maniraj', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (Embedded Systems), B.Tech (ECE)', email='kastoorimani@gmail.com',
    exp='11 years', joined='04-02-2015',
    areas=['Embedded Systems', 'IoT', 'RFID', 'Wireless Networks'],
    subjects=['Embedded Systems', 'Microcontrollers', 'Digital Electronics', 'IoT'],
    journals=[
        {'t':'The design of intelligent campus security based on RFID and ZigBee','j':'International Journal of Trend in Scientific Research and Development','y':'2014'},
    ],
    conferences=6, folder='ece'
),

'k-purushotham': dict(
    name='Mr. K. Purushotham', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (Signal Processing), B.Tech (ECE); Ph.D pursuing at Osmania University',
    email='purush.mtech@gmail.com', exp='17 years', joined='20-02-2024',
    areas=['Signal Processing', 'Image Processing', '5G Massive MIMO', 'Digital Signal Processing'],
    subjects=['Digital Signal Processing', 'Signals and Systems', 'Communications', 'Image Processing'],
    journals=[
        {'t':'Face recognition study using visible and thermal infrared imagery','j':'International Journal of Engineering Trends and Technology (IJETT)','y':'2013'},
        {'t':'FIR and IIR filter design for transmission systems','j':'International Journal of Engineering, Agriculture and Medicine (IJEAM)','y':'2013'},
        {'t':'Wavelet transform, DPCM, and neural network for image compression','j':'International Journal of Engineering and Computer Science (Vol.2(8))','y':'2013'},
        {'t':'Image denoising using complex ridgelet transform','j':'International Journal of Engineering Research and Technology (IJERT, Vol.2(10))','y':'2013'},
        {'t':'Device for position estimation of surface moving vehicles','j':'International Journal of Management, IT and Engineering (IJMIE, Vol.3(11))','y':'2013'},
    ],
    conferences=2,
    books=[{'t':'Digital Signal Processing','pub':'LAP Lambert Academic Publishing','y':'2014','isbn':'978-3-659-68749-5'}],
    folder='ece'
),

'khobragade-pithamber': dict(
    name='Mr. Khobragade Pithamber', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (ECE), B.Tech (ECE)', email='pithamberk@gmail.com',
    exp='16 years', joined='19-02-2024',
    areas=['VLSI', 'Image Processing', 'AI in Healthcare', 'Embedded Systems'],
    subjects=['VLSI Design', 'Digital Electronics', 'Microprocessors', 'Signals and Systems'],
    journals=[
        {'t':'ECG de-noising using wavelet filter for heartbeat signals','j':'NCET-ICT Conference','y':'2018'},
        {'t':'Hardware implementation of virtual telepresence robot','j':'International Conference on Intelligent Systems','y':'2023'},
        {'t':'Image forensics and forgery detection methodology','j':'IC2SDT Conference','y':'2024'},
        {'t':'Dermatoscopic image classification for skin cancer','j':'IC3I Conference','y':'2024'},
        {'t':'Early heart failure recognition in infants','j':'International Conference on Smart Electronics','y':'2024'},
        {'t':'Machine learning accessibility framework for visually impaired banking users','j':'ICERECT Conference','y':'2025'},
    ],
    conferences=8, folder='ece'
),

'm-raju-naik': dict(
    name='Mr. M. Raju Naik', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (Embedded Systems), B.Tech (ECE)', email='naik.raju1991@gmail.com',
    exp='9.5 years', joined='15-06-2016',
    areas=['Embedded Systems', 'Robotics', 'IoT', 'AI in Agriculture'],
    subjects=['Embedded Systems', 'Microcontrollers', 'IoT', 'Robotics'],
    journals=[
        {'t':'Health monitoring system based on IoT','j':'5th International Conference on Trends in Electronics and Informatics','y':'2021'},
        {'t':'Missing children identification using face recognition','j':'International Conference on Advancements in Smart, Secure and Intelligent Systems','y':'2022'},
        {'t':'Design of brain-controlled robotic car using Raspberry Pi','j':'5th International Conference on Trends in Electronics and Informatics','y':'2021'},
        {'t':'Smart attendance management system','j':'International Journal of Microsystems and IoT','y':'2024'},
        {'t':'Enhanced soldier support system (ES3) utilizing LoRa technology','j':'International Conference Proceedings','y':'2024'},
    ],
    conferences=12, folder='ece'
),

'chinthakindi-babaiah': dict(
    name='Mr. Chinthakindi Babaiah', role='Assistant Professor', dept='Electronics and Communication Engineering',
    qual='M.Tech (Embedded Systems), B.Tech (ECE)', email='ch.babaiah@mlrinstitutions.ac.in',
    exp='9 years', joined='02-12-2014',
    areas=['Embedded Systems', 'Antenna Design', 'IoT', 'AI/ML', 'Wireless Communications'],
    subjects=['Embedded Systems', 'Antenna and Wave Propagation', 'Microcontrollers', 'IoT'],
    journals=[
        {'t':'Antenna optimization using metamaterials','j':'Journal of Physics: Conference Series 2837(1)','y':'2024'},
        {'t':'Intelligent fault detection in wireless sensor networks using AI','j':'IEEE 5th International Conference on ICT in Business Industry','y':'2025'},
        {'t':'Predictive maintenance in industrial IoT','j':'4th Asian Conference on Innovation in Technology (ASIANCON)','y':'2024'},
        {'t':'Lung cancer detection using convolutional neural networks','j':'3rd Asian Conference on Innovation in Technology','y':'2023'},
        {'t':'CPW fed UWB antenna design','j':'ICAAMM International Conference','y':'2023'},
        {'t':'Fire detection using Raspberry Pi','j':'ICAAMM International Conference','y':'2023'},
    ],
    conferences=12, folder='ece'
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
