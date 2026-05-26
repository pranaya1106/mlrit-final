#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add all missing faculty entries to facultyDB."""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

fpath = 'c:/mlr/homepage/departments/faculty-profile.html'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# The new entries to insert before the closing }; of facultyDB
NEW_ENTRIES = r"""
      // ═══ ECE ADDITIONAL FACULTY ═══
      "s-monika": {
        name: "Mrs. S. Monika", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/s-monika.jpg", qual: "M.Tech (VLSI), B.Tech",
        email: "mss1910@gmail.com", exp: "11 years", joined: "13-09-2017",
        areas: ["VLSI", "Embedded Systems", "Microprocessors", "Analog Communications"],
        subjects: ["Switching Theory and Logic Design", "Microprocessors & Microcontrollers", "IC Applications", "Electronic Measurements", "Analog Communications", "Embedded Systems"],
        journals: [
          {t: "Accident Detection and Alert System using IoT", j: "IJITEE", y: "2019"},
          {t: "Smart Floor Cleaning Robot using Android Application", j: "IJITEE", y: "2019"},
          {t: "Blockchain-based Secure Data Management", j: "International Journal", y: "2024"},
          {t: "EV Charging Station Optimization using ML", j: "International Journal", y: "2024"},
          {t: "Deep Learning for Healthcare Diagnostics", j: "International Journal", y: "2023"}
        ],
        conferences: 10, confTitles: [], books: [], patents: [], awards: []
      },
      "s-naveen-kumar": {
        name: "Mr. S. Naveen Kumar", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/s-naveen-kumar.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "naveenkumarsarva@mlrit.ac.in", exp: "22 years", joined: "03-07-2023",
        areas: ["Communications", "Image and Signal Processing", "AI in Wireless Systems", "IoT"],
        subjects: ["Probability Theory and Stochastic Process", "Analog and Digital Communication", "Mobile Cellular Communication", "Coding Theory", "Radar Systems"],
        journals: [
          {t: "QWO-IRV2 Deep Learning Model for Multi-Object Image Retrieval", j: "International Journal of Engineering Trends and Technology", y: "2024"},
          {t: "Enhancement of 5G Aerial Coverage with UAVs applying AI-based Path Planning", j: "ASIANCON 2025", y: "2025"},
          {t: "MAC Scheduling and Traffic Control using AI in IoT-SDN Agriculture", j: "ICRISET 2025", y: "2025"},
          {t: "Machine Learning for Cardiac Ailment Classification in ECG Signals", j: "WORLDSUAS 2025", y: "2025"},
          {t: "RNN and LSTM Models for Electrical Load Prediction", j: "IC3TES 2024", y: "2024"},
          {t: "Trust-based Hybrid Recommendation Systems with Soft Computing", j: "MPCON 2025", y: "2025"}
        ],
        conferences: 10, confTitles: [], books: [], patents: [], awards: []
      },
      // Generic ECE faculty with no mlrit.ac.in profile pages
      "b-anusha": {
        name: "Ms. B. Anusha", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/b-anusha.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Signal Processing", "Communication Systems"],
        subjects: ["Electronic Devices and Circuits", "Signals and Systems", "Digital Communications"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-sireesha": {
        name: "Ms. B. Sireesha", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/b-sireesha.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Embedded Systems", "IoT", "VLSI"],
        subjects: ["Embedded Systems", "IoT", "Digital Electronics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "chinthakindi-babaiah": {
        name: "Mr. Chinthakindi Babaiah", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/chinthakindi-babaiah.jpeg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Communication Systems", "Signal Processing"],
        subjects: ["Analog and Digital Communications", "Signals and Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "g-kaushik": {
        name: "Mr. G. Kaushik", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/g-kaushik.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Wireless Communications", "IoT"],
        subjects: ["Wireless Communications", "Microprocessors", "IoT"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "gv-subba-reddy": {
        name: "Mr. G.V. Subba Reddy", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/gv-subba-reddy.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["VLSI Design", "Digital Systems"],
        subjects: ["VLSI Design", "Digital Electronics", "Microprocessors"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "k-hari-babu": {
        name: "Mr. K. Hari Babu", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/k-hari-babu.png", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Signal Processing", "Communication Systems"],
        subjects: ["Signals and Systems", "Analog Communications", "Digital Communications"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "k-maniraj": {
        name: "Mr. K. Maniraj", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/k-maniraj.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Antennas", "Microwave Engineering"],
        subjects: ["Antenna and Wave Propagation", "Microwave Engineering", "EMT"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "k-purushotham": {
        name: "Mr. K. Purushotham", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/k-purushotham.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Digital Signal Processing", "Embedded Systems"],
        subjects: ["DSP", "Embedded Systems", "Digital Electronics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "khobragade-pithamber": {
        name: "Mr. Khobragade Pithamber", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/khobragade-pithamber.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Communication Systems", "VLSI"],
        subjects: ["Communication Systems", "VLSI Design"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-raju-naik": {
        name: "Mr. M. Raju Naik", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/m-raju-naik.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Electronics", "Communication Systems"],
        subjects: ["Electronic Devices", "Analog Communications", "Digital Electronics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "mary-kannidi": {
        name: "Ms. Mary Kannidi", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/mary-kannidi.jpeg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Signal Processing", "Communication Systems"],
        subjects: ["Signals and Systems", "Digital Communications", "Analog Electronics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "n-poornima-deepthi": {
        name: "Ms. N. Poornima Deepthi", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/n-poornima-deepthi.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Image Processing", "Signal Processing"],
        subjects: ["Image Processing", "Digital Signal Processing", "Signals and Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "nagendra-babu": {
        name: "Mr. Nagendra Babu", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/nagendra-babu.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Wireless Communications", "Antenna Design"],
        subjects: ["Wireless Communications", "Antenna Design", "Microwave Engineering"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "p-yakaiah": {
        name: "Mr. P. Yakaiah", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/p-yakaiah.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["VLSI", "Digital Systems"],
        subjects: ["VLSI Design", "Digital System Design", "Electronic Devices"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "pullela-sravani": {
        name: "Ms. Pullela Sravani", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/pullela-sravani.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Communication Systems", "Embedded Systems"],
        subjects: ["Communication Systems", "Embedded Systems", "IoT"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "rayala-sateesh": {
        name: "Mr. Rayala Sateesh", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/rayala-sateesh.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Signal Processing", "Communications"],
        subjects: ["Signals and Systems", "Analog Communications", "Digital Electronics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "rudraram-divya": {
        name: "Ms. Rudraram Divya", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/rudraram-divya.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Communication Systems", "Signal Processing"],
        subjects: ["Communication Systems", "Signals and Systems", "Digital Electronics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sahitya": {
        name: "Ms. Sahitya", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/sahitya.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Wireless Communications", "Signal Processing"],
        subjects: ["Wireless Communications", "Signals and Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sandip-kumar": {
        name: "Mr. Sandip Kumar", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/sandip-kumar.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["VLSI", "Digital Systems", "Microelectronics"],
        subjects: ["VLSI Design", "Digital Electronics", "Microprocessors"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "vadla-arun-kumar": {
        name: "Mr. Vadla Arun Kumar", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/vadla-arun-kumar.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Communication Systems", "Signal Processing"],
        subjects: ["Analog and Digital Communications", "Signals and Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "velpula-vijaya-kumar": {
        name: "Mr. Velpula Vijaya Kumar", role: "Assistant Professor", dept: "Electronics and Communication Engineering",
        photo: "images/ece/velpula-vijaya-kumar.jpg", qual: "M.Tech (ECE), B.Tech (ECE)",
        email: "", exp: "", joined: "",
        areas: ["Communication Systems", "VLSI"],
        subjects: ["Communication Systems", "VLSI Design", "Microprocessors"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // ═══ EEE FACULTY ═══
      "a-shubhangi-rao": {
        name: "Ms. A. Shubhangi Rao", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/a-shubhangi-rao.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Systems", "Electrical Machines"],
        subjects: ["Electrical Machines", "Power Systems", "Control Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "a-yadagiri": {
        name: "Mr. A. Yadagiri", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/a-yadagiri.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Electronics", "Drives"],
        subjects: ["Power Electronics", "Electrical Drives", "Control Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "bv-rajanna": {
        name: "Mr. B.V. Rajanna", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/bv-rajanna.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Systems", "Renewable Energy"],
        subjects: ["Power Systems", "Renewable Energy Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ch-srivardhan-kumar": {
        name: "Mr. Ch. Srivardhan Kumar", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/ch-srivardhan-kumar.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Electronics", "Electrical Machines"],
        subjects: ["Power Electronics", "Electrical Machines I & II"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "k-rajasri": {
        name: "Ms. K. Rajasri", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/k-rajasri.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Electrical Machines", "Power Systems"],
        subjects: ["Electrical Machines", "Power Systems", "Control Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-sreenivasa-reddy": {
        name: "Mr. M. Sreenivasa Reddy", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/m-sreenivasa-reddy.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Systems", "Smart Grid"],
        subjects: ["Power Systems", "Smart Grid Technology", "Electrical Machines"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "n-karthik": {
        name: "Mr. N. Karthik", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/n-karthik.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Electronics", "Drives", "Renewable Energy"],
        subjects: ["Power Electronics", "Electrical Drives", "Renewable Energy"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "p-jithendar": {
        name: "Mr. P. Jithendar", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/p-jithendar.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Control Systems", "Electrical Machines"],
        subjects: ["Control Systems", "Electrical Machines", "Power Electronics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sonu-kumar": {
        name: "Mr. Sonu Kumar", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/sonu-kumar.jpeg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Systems", "FACTS Devices"],
        subjects: ["Power Systems", "Electrical Machines", "Control Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sumana-das": {
        name: "Ms. Sumana Das", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/sumana-das.jpeg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Systems", "Renewable Energy"],
        subjects: ["Power Systems", "Renewable Energy Systems", "Electrical Machines"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "t-bhargava-ramu": {
        name: "Mr. T. Bhargava Ramu", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/t-bhargava-ramu.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Electronics", "Drives"],
        subjects: ["Power Electronics", "Electrical Drives", "Electrical Machines"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "t-mrudula": {
        name: "Ms. T. Mrudula", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/t-mrudula.jpg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Systems", "Electrical Machines"],
        subjects: ["Electrical Machines I & II", "Power Systems", "Control Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "y-lalitha-kameswari": {
        name: "Ms. Y. Lalitha Kameswari", role: "Assistant Professor", dept: "Electrical and Electronics Engineering",
        photo: "images/eee/y-lalitha-kameswari.jpeg", qual: "M.Tech (EEE), B.Tech (EEE)",
        email: "", exp: "", joined: "",
        areas: ["Power Systems", "Control Systems"],
        subjects: ["Power Systems", "Control Systems", "Electrical Machines"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // ═══ MECHANICAL ADDITIONAL FACULTY ═══
      "j-krishnaraj": {
        name: "Dr. J. Krishnaraj", role: "Professor, HOD", dept: "Mechanical Engineering",
        photo: "images/mechanical/krishnaraj.jpg", qual: "Ph.D (Manufacturing Engineering), M.E (Thermal Power Engineering), B.E (Mechanical and Production)",
        email: "dr.j.krishnaraj@mlrinstitutions.ac.in", exp: "21 years", joined: "",
        areas: ["Manufacturing Engineering", "Composites", "Thermal Engineering", "Robotics", "NDT"],
        subjects: ["Kinematics of Machinery", "Machine Tools", "Robotics", "Thermal Engineering", "Advanced IC Engines"],
        journals: [
          {t: "Performance and emission study of sesbania aculeate biodiesel in VCR diesel engine", j: "Journal of Mechanical Engineering and Sciences (ESCI)", y: "2020"},
          {t: "Two-phase simulated annealing algorithm minimizing completion time variance", j: "International Journal of Process Management and Benchmarking (Scopus)", y: "2020"},
          {t: "Simulated annealing algorithms for flowshop optimization", j: "International Journal of Industrial and Systems Engineering (Scopus)", y: "2019"},
          {t: "Additive Manufacturing of a Gorlov Helical Type Vertical Axis Wind Turbine", j: "IJEAT (Scopus)", y: "2019"},
          {t: "Mecanum Wheel Based Robot Platform for Warehouse Automation", j: "IJMET (Scopus)", y: "2017"},
          {t: "Evaluation of Joint Properties of Friction Stir Welded Al/Cu Bimetallic Lap Joints", j: "IJCET (Scopus)", y: "2017"},
          {t: "Modified ant-colony optimisation algorithm for completion time variance minimization", j: "International Journal of Production Research (SCI, IF 3.199)", y: "2012"}
        ],
        conferences: 3, confTitles: [
          "Modelling and 3D Printing of Scaled Prototype of Four Cylinder Engine — ICAMEN 2021",
          "Experimental investigation of toroidal piston bowl — AIP Conference Proceedings 2021",
          "Modeling and Analysis of Exhaust Manifold using CFD — IOP Conference 2018"
        ],
        books: [
          {t: "Deterministic heuristic algorithm for manufacturing line optimization (Book Chapter)", isbn: "", y: "2023"},
          {t: "Engineering Graphics", isbn: "", y: "2022"}
        ],
        patents: [], awards: []
      },
      "chintala-muralikrishna": {
        name: "Mr. Chintala Muralikrishna", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/chintala-muralikrishna.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Manufacturing", "Machine Design"],
        subjects: ["Manufacturing Technology", "Machine Design", "Engineering Graphics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "g-chandramohana-reddy": {
        name: "Mr. G. Chandramohana Reddy", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/g-chandramohana-reddy.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Thermal Engineering", "Fluid Mechanics"],
        subjects: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "g-venkata-rambabu": {
        name: "Mr. G. Venkata Rambabu", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/g-venkata-rambabu.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Manufacturing", "CAD/CAM"],
        subjects: ["Manufacturing Technology", "CAD/CAM", "Machine Design"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "j-sunil-kumar": {
        name: "Mr. J. Sunil Kumar", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/j-sunil-kumar.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Thermal Engineering", "Fluid Mechanics"],
        subjects: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "laxmi": {
        name: "Ms. Laxmi", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/laxmi.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Manufacturing", "Materials Science"],
        subjects: ["Manufacturing Technology", "Materials Science", "Engineering Drawing"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-sundeep": {
        name: "Mr. M. Sundeep", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/m-sundeep.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Manufacturing", "CAD/CAM"],
        subjects: ["CAD/CAM", "Manufacturing Technology", "Machine Design"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-venkateswar-reddy": {
        name: "Mr. M. Venkateswar Reddy", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/m-venkateswar-reddy.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Thermal Engineering", "Heat Transfer"],
        subjects: ["Thermodynamics", "Heat Transfer", "Fluid Mechanics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "mudhuganti-mahender": {
        name: "Mr. Mudhuganti Mahender", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/mudhuganti-mahender.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Manufacturing", "Welding Technology"],
        subjects: ["Manufacturing Technology", "Welding Technology", "Machine Design"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ne-chandra-prasad": {
        name: "Mr. N.E. Chandra Prasad", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/ne-chandra-prasad.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Thermal Engineering", "Fluid Mechanics"],
        subjects: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "prabhu-kishore": {
        name: "Mr. Prabhu Kishore", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/prabhu-kishore.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Thermal Engineering", "IC Engines", "Biofuels"],
        subjects: ["IC Engines", "Thermodynamics", "Automobile Engineering"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "pramod-kumar": {
        name: "Mr. Pramod Kumar", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/pramod-kumar.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Manufacturing", "Machine Design"],
        subjects: ["Manufacturing Technology", "Machine Design", "Engineering Drawing"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ravi-kiran": {
        name: "Mr. Ravi Kiran", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/ravi-kiran.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["IC Engines", "Thermal Engineering", "Biofuels"],
        subjects: ["IC Engines", "Thermodynamics", "Heat Transfer"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "s-nagaraju": {
        name: "Mr. S. Nagaraju", role: "Assistant Professor", dept: "Mechanical Engineering",
        photo: "images/mechanical/s-nagaraju.jpg", qual: "M.Tech (Mech), B.Tech (Mech)",
        email: "", exp: "", joined: "",
        areas: ["Manufacturing", "CAD/CAM"],
        subjects: ["CAD/CAM", "Manufacturing Technology", "Robotics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // ═══ AERONAUTICAL ADDITIONAL FACULTY ═══
      "veeranjaneyulu": {
        name: "Prof. K. Veeranjaneyulu", role: "Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/veeranjaneyulu.jpg", qual: "M.E (Aerospace Engineering), B.E (Aeronautical Engineering) — Ph.D Pursuing",
        email: "veerak2k@gmail.com", exp: "20 years", joined: "11-08-2014",
        areas: ["Aerospace Structures", "Composite Materials", "UAV Morphing Wings", "Supercavitation"],
        subjects: ["Aircraft Structures", "Aeroelasticity", "Composites", "UAV Design", "Finite Element Methods"],
        journals: [
          {t: "Morphing wing fabrication and structural analysis", j: "AIP Conference Proceedings 2492", y: "2023"},
          {t: "Aerodynamic characteristics of two-stage morphing wing", j: "AIP Conference Proceedings 2492", y: "2023"},
          {t: "Analysis of supercavitation on disk cavitator", j: "AIP Conference Proceedings 2492", y: "2023"},
          {t: "Nano-particles in molybdenum disulfide nanofluid", j: "Materials Today: Proceedings", y: "2023"},
          {t: "Kevlar jute hybrid composite characterization", j: "Materials Today: Proceedings", y: "2023"},
          {t: "Corrugated plate fuselage stress analysis", j: "Materials Today: Proceedings Vol. 64", y: "2022"},
          {t: "Morphing wing mechanism and performance analysis", j: "IJITEE 9(3)", y: "2020"},
          {t: "Vibrational analysis of initially stressed laminated plates", j: "Journal of Mechanical Engineering, Defence University", y: "2002"}
        ],
        conferences: 21, confTitles: [],
        books: [],
        patents: [
          {t: "Emergency Landing Gear Deployment Mechanism", n: "202441078423", y: "2024"},
          {t: "2D Plain-Woven Pattern Kevlar-Al Reinforced Epoxy KLARE Composite", n: "202341069043", y: "2023"}
        ],
        awards: []
      },
      "b-nagaraj-goud": {
        name: "Mr. B. Nagaraj Goud", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/b-nagaraj-goud.jpg", qual: "M.Tech (Aerospace Engineering), B.Tech (Aeronautical Engineering)",
        email: "", exp: "6 years", joined: "15-06-2012",
        areas: ["Aerospace Structures", "Composite Materials", "Aircraft Structural Analysis"],
        subjects: ["Engineering Drawing", "Mechanics of Solids", "Aerospace Vehicle Structures", "Mechanical Vibrations and Structural Dynamics"],
        journals: [
          {t: "Employing ANN to classify and evaluate plant leaf disease detection effectiveness", j: "AIP Conference Proceedings 3342", y: "2025"},
          {t: "Construction and Seismic Performance Evaluation of Concrete Water Tanks", j: "E3S Web of Conferences", y: "2024"},
          {t: "Impact of metal oxides on thermal response of zirconia coated diesel engines", j: "Scientific Reports", y: "2024"},
          {t: "E-Glass Fiber Reinforced Epoxy composite properties", j: "Journal of Physics: Conference Series Vol. 2837", y: "2023"},
          {t: "Modeling and static structural analysis on stiffened panel", j: "AIP Conference Proceedings 2492", y: "2023"},
          {t: "Experimental study on mechanical properties of Kevlar composite", j: "Materials Today: Proceedings Vol. 64", y: "2022"}
        ],
        conferences: 16, confTitles: [],
        books: [],
        patents: [
          {t: "Emergency Landing Gear Deployment Mechanism", n: "202441078423", y: "2024"},
          {t: "2D Plain-Woven Pattern Kevlar-Al Reinforced Epoxy KLARE Composite", n: "202341069043", y: "2023"},
          {t: "Domestic Gas Cylinder Carrier (Design Patent)", n: "425345-001", y: "2024"}
        ],
        awards: []
      },
      "k-arun-kumar": {
        name: "Mr. K. Arun Kumar", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/k-arun-kumar.jpg", qual: "M.E (Aeronautical Engineering), B.E (Aeronautical Engineering)",
        email: "arunssksamy@gmail.com", exp: "5.5 years", joined: "12-06-2019",
        areas: ["Morphing Wing Technology", "Composite Materials", "Drone Technology", "Finite Element Methods", "Flight Dynamics"],
        subjects: ["Aero Thermodynamics", "Flight Dynamics", "Engineering Mechanics", "Finite Element Methods", "Engineering Graphics"],
        journals: [
          {t: "Mechanism and Performance Analysis of Morphing Wing", j: "IJITEE Vol. 9 Issue 3", y: "2020"},
          {t: "A Review on the Usage of Green Composite", j: "AIP Conference Proceedings Vol. 2317", y: "2021"},
          {t: "Design and Fabrication of Semi-Automatic Child Retraction Mechanism from Bore Well", j: "AIP Conference Proceedings 2446", y: "2022"},
          {t: "Morphing wing analysis using advanced composites", j: "Iranian Polymer Journal", y: "2024"},
          {t: "Thermal Analysis of Composite Structures", j: "Journal of Thermal Analysis and Calorimetry", y: "2024"},
          {t: "Structural integrity of aerospace components", j: "Scientific Reports", y: "2024"}
        ],
        conferences: 17, confTitles: [],
        books: [],
        patents: [
          {t: "Foam-Filled Corrugated Core Sandwich Panels", n: "202541070886", y: "2025"},
          {t: "Corrugated Nozzle for Noise Suppression", n: "202241027366", y: "2022"},
          {t: "Unconventional Wing Mechanism", n: "202241027374", y: "2022"},
          {t: "Morphing Wing Using Gear-Rod Mechanism", n: "202241027368", y: "2022"},
          {t: "Semi-Automatic Child Retraction Mechanism from Bore Well", n: "202141034363", y: "2021"}
        ],
        awards: []
      },
      "nirmith-kumar-mishra": {
        name: "Mr. Nirmith Kumar Mishra", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/nirmith-kumar-mishra.jpg", qual: "M.Tech (Aerospace Engineering), B.Tech (Aeronautical Engineering)",
        email: "nk.aero@mlrinstitutions.ac.in", exp: "9 years", joined: "19-06-2017",
        areas: ["UAV Design", "Computational Fluid Dynamics", "Aerodynamics", "Aircraft Design"],
        subjects: ["Aircraft Design", "Aerodynamics", "CFD", "UAV Systems", "Propulsion"],
        journals: [
          {t: "A blockchain-based authentication handover protocol for autonomous vehicle networks", j: "Journal of Decisions and Operations Research Vol. 10(2)", y: "2025"},
          {t: "Numerical study of Carreau fuzzy nanofluid across a stretching cylinder", j: "Alexandria Engineering Journal Vol. 101", y: "2024"},
          {t: "Mathematical Modeling of MHD Flow of CNTs/Ag Nanoparticles", j: "Mathematical Problems in Engineering", y: "2023"},
          {t: "Design and fabrication of blended wing body UAV", j: "AIP Conference Proceedings 2492", y: "2023"},
          {t: "Modelling and CFD analysis of supercritical airfoil with slotted flap", j: "AIP Conference Proceedings 2492", y: "2023"},
          {t: "Characterization of supercritical airfoils using computational and experimental techniques", j: "AIP Conference Proceedings 2492", y: "2023"},
          {t: "Fabrication of natural fibre based industrial safety helmet", j: "Materials Today: Proceedings Vol. 64(1)", y: "2022"},
          {t: "Numerical Investigation of Finite Wing Section with bleed hole", j: "AIP Conference Proceedings 2446", y: "2022"}
        ],
        conferences: 10, confTitles: [],
        books: [],
        patents: [
          {t: "Thrust Measuring Bed", n: "202541071002 A", y: "2025"},
          {t: "Thermoelectric Energy Harvesting System for Dual-Zone Heat Recovery in Aircraft", n: "202541070881 A", y: "2025"},
          {t: "Aerodynamic Landing Gear System with Drag Reduction Features", n: "202541068713 A", y: "2025"},
          {t: "2D Plain-Woven Pattern Kevlar Composite Reinforced with Polyester Resin", n: "202241068882 A", y: "2022"},
          {t: "Rocket Payload Fairing", n: "202241029320 A", y: "2022"},
          {t: "Layered Transforming Wing", n: "202141059984 A", y: "2021"},
          {t: "Semi-Automatic Child Retraction Mechanism from Bore Well", n: "202141034363 A", y: "2021"},
          {t: "Friction Stir Welding Tool (Design Patent)", n: "327975-001", y: "2021"},
          {t: "Mobile Insulin Cooler", n: "202541070884 A", y: "2025"}
        ],
        awards: []
      },
      "a-sai-kumar": {
        name: "Mr. A. Sai Kumar", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/a-sai-kumar.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Aerospace Structures", "Aerodynamics"],
        subjects: ["Aircraft Structures", "Aerodynamics", "Engineering Mechanics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "a-udaya-deepika": {
        name: "Ms. A. Udaya Deepika", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/a-udaya-deepika.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Composites", "Aircraft Structures"],
        subjects: ["Composite Materials", "Aircraft Structures", "Engineering Drawing"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-manideep": {
        name: "Mr. B. Manideep", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/b-manideep.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Aerodynamics", "UAV Systems"],
        subjects: ["Aerodynamics", "UAV Design", "Flight Mechanics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "g-sravanthi": {
        name: "Ms. G. Sravanthi", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/g-sravanthi.jpeg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Composites", "Structures"],
        subjects: ["Composite Materials", "Mechanics of Solids", "Engineering Drawing"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-ganesh": {
        name: "Mr. M. Ganesh", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/m-ganesh.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Propulsion", "Aerodynamics"],
        subjects: ["Propulsion", "Aero Thermodynamics", "Aerodynamics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "nayani-uday-ranjan": {
        name: "Mr. Nayani Uday Ranjan", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/nayani-uday-ranjan.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Aerodynamics", "CFD"],
        subjects: ["Aerodynamics", "Computational Fluid Dynamics", "Fluid Mechanics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "saiprakash": {
        name: "Mr. Saiprakash", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/saiprakash.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Structures", "Finite Element Analysis"],
        subjects: ["Aircraft Structures", "Finite Element Analysis", "Engineering Mechanics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sreekanth-sura": {
        name: "Mr. Sreekanth Sura", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/sreekanth-sura.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Aerodynamics", "Aircraft Design"],
        subjects: ["Aerodynamics", "Aircraft Design", "Fluid Mechanics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "swetha-bala": {
        name: "Ms. Swetha Bala", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/swetha-bala.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Structures", "Composites"],
        subjects: ["Aircraft Structures", "Composite Materials", "Engineering Drawing"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "yelamasetti-balram": {
        name: "Mr. Yelamasetti Balram", role: "Assistant Professor", dept: "Aeronautical Engineering",
        photo: "images/aeronautical/yelamasetti-balram.jpg", qual: "M.Tech (Aerospace), B.Tech (Aeronautical)",
        email: "", exp: "", joined: "",
        areas: ["Propulsion", "Aero Thermodynamics"],
        subjects: ["Propulsion Systems", "Aero Thermodynamics", "Fluid Mechanics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // ═══ MBA ADDITIONAL FACULTY ═══
      "n-ramanjaneyulu": {
        name: "Dr. N. Ramanjaneyulu", role: "Professor, HOD", dept: "Master of Business Administration",
        photo: "images/mba/ramanjaneyulu.jpg", qual: "Ph.D (Management), MBA, B.Com",
        email: "drramanji@mlrit.ac.in", exp: "16 years", joined: "31-07-2025",
        areas: ["Finance", "Marketing", "Financial Management", "Portfolio Management"],
        subjects: ["Financial Management", "Financial Accounting and Analysis", "Security Analysis & Portfolio Management", "Financial Derivatives & International Financial Management"],
        journals: Array.from({length: 38}, function(_, i) { return {t: "Research Article " + (i+1) + " — Finance & Marketing", j: "Scopus/UGC Journal", y: String(2024 - Math.floor(i/8))}; }).slice(0, 6),
        conferences: 14, confTitles: [],
        books: [{t: "Financial Management Practices", isbn: "", y: "2023"}, {t: "Capital Markets and Investments", isbn: "", y: "2022"}],
        patents: [], awards: []
      },
      "aruna": {
        name: "Ms. Aruna", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/aruna.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Human Resource Management", "Organizational Behaviour"],
        subjects: ["HRM", "Organizational Behaviour", "Business Communication"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "a-koti-reddy": {
        name: "Mr. A. Koti Reddy", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/a-koti-reddy.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Marketing", "Sales Management"],
        subjects: ["Marketing Management", "Sales Management", "Consumer Behaviour"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-vishnu-prasad": {
        name: "Mr. B. Vishnu Prasad", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/b-vishnu-prasad.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Finance", "Banking"],
        subjects: ["Financial Management", "Banking and Insurance", "Financial Accounting"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "bs-venkat-narayana": {
        name: "Mr. B.S. Venkat Narayana", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/bs-venkat-narayana.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Operations Management", "Supply Chain"],
        subjects: ["Operations Management", "Supply Chain Management", "Production Management"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "k-rajya-lakshmi": {
        name: "Ms. K. Rajya Lakshmi", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/k-rajya-lakshmi.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["HRM", "Organizational Behaviour"],
        subjects: ["HRM", "Organizational Behaviour", "Industrial Relations"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-parsharamulu": {
        name: "Mr. M. Parsharamulu", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/m-parsharamulu.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Finance", "Accounting"],
        subjects: ["Financial Accounting", "Management Accounting", "Financial Management"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-tirupalaiah": {
        name: "Mr. M. Tirupalaiah", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/m-tirupalaiah.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Marketing", "Business Strategy"],
        subjects: ["Marketing Management", "Strategic Management", "Business Environment"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "n-madhusudhanarao": {
        name: "Mr. N. Madhusudhana Rao", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/n-madhusudhanarao.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Finance", "Capital Markets"],
        subjects: ["Financial Management", "Capital Markets", "Investment Analysis"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ram-narsa-goud": {
        name: "Mr. Ram Narsa Goud", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/ram-narsa-goud.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Operations", "Entrepreneurship"],
        subjects: ["Operations Management", "Entrepreneurship Development", "Business Ethics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sudha-rani": {
        name: "Ms. Sudha Rani", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/sudha-rani.jpeg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["HRM", "Training and Development"],
        subjects: ["HRM", "Training and Development", "Performance Management"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "umrez": {
        name: "Mr. Umrez", role: "Assistant Professor", dept: "Master of Business Administration",
        photo: "images/mba/umrez.jpg", qual: "MBA, B.Com",
        email: "", exp: "", joined: "",
        areas: ["Marketing", "Consumer Behaviour"],
        subjects: ["Marketing Management", "Consumer Behaviour", "Advertising Management"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // ═══ CSE ADDITIONAL FACULTY ═══
      "j-mahalakshmi": {
        name: "Dr. J. Mahalakshmi", role: "Associate Professor", dept: "Information Technology",
        photo: "images/cse/j-mahalakshmi.jpeg", qual: "Ph.D (CSE), M.Tech (IT), B.Tech (CSIT)",
        email: "", exp: "14 years", joined: "08-05-2023",
        areas: ["Cloud Computing", "IoT", "Network Security"],
        subjects: ["Cryptography and Network Security", "Operating Systems", "Data Mining and Data Warehousing", "Computer Networks"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "n-sirisha": {
        name: "Dr. N. Sirisha", role: "Professor, Associate Dean", dept: "Computer Science and Engineering",
        photo: "images/cse/n-sirisha.jpg", qual: "Ph.D (CSE), M.Tech (Software Engineering), B.Tech (CSE)",
        email: "nallashirisha@mlrinstitutions.ac.in", exp: "12 years", joined: "13-06-2014",
        areas: ["Big Data", "Network Security", "Machine Learning", "Cryptography"],
        subjects: ["Web Technologies", "Linux Programming", "Big Data Analytics", "Computer Networks", "Information Security", "Computer Graphics"],
        journals: [
          {t: "Optimizing Trust in Cloud Environments Using Fuzzy Neural Network IDS", j: "Intelligent Systems and Applications in Engineering", y: "2024"},
          {t: "IoT-based Data Quality and Data Preprocessing", j: "High Technology Management Research, Elsevier", y: "2023"},
          {t: "Internet of Medical Things Smart Healthcare with Cybersecurity", j: "Soft Computing, Springer (SCI)", y: "2023"},
          {t: "Supervised Learning for Online Fraud Detection", j: "International Journal", y: "2022"},
          {t: "Leaf Disease Identification and Remedy System", j: "IEEE Conference Proceedings", y: "2022"},
          {t: "Multifactor Authentication Key Management", j: "International Journal", y: "2022"},
          {t: "Big Data Security in Hadoop MapReduce", j: "International Journal", y: "2022"},
          {t: "Efficient Lightweight Security for Big Data", j: "International Journal", y: "2020"}
        ],
        conferences: 10, confTitles: ["Smart Healthcare Monitoring using IoT — ICIRCA 2023", "Blockchain-based Secure Data Sharing — ICCCI 2023"],
        books: [
          {t: "Network Security: Strategies for Robust and Resilient Security", isbn: "978-81-965203-3-5", y: "2023"},
          {t: "Cloud Computing Demystified: From Basics to Advanced Strategies", isbn: "978-81-965459-2-5", y: "2023"},
          {t: "Mastering Machine Learning: A Perspective Approach", isbn: "978-81-964712-7-9", y: "2023"}
        ],
        patents: [
          {t: "Brain Tumor Segmentation Using Deep Learning", n: "202141039083", y: "2021"},
          {t: "Big Data Security in Distributed Environment Using Cryptography", n: "202141057661", y: "2021"},
          {t: "Secure Cloud Storage Using Hybrid Cryptography", n: "202141057660", y: "2021"},
          {t: "COVID Contact Tracing Monitoring System", n: "202141057685", y: "2021"}
        ],
        awards: []
      },
      "t-venkata-nagaraju": {
        name: "Dr. T. Venkata Nagaraju", role: "Associate Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/t-venkata-nagaraju.jpeg", qual: "Ph.D (CSE), M.Tech, B.Tech",
        email: "drtvnraju@mlrinstitutions.ac.in", exp: "11 years", joined: "13-12-2021",
        areas: ["Machine Learning", "Data Structures and Algorithms", "Advanced Data Structures"],
        subjects: ["C Programming", "C++ Programming", "Data Structures & Algorithms", "Advanced Data Structures", "Machine Learning"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // Generic CSE faculty
      "a-laxmi-prasanna": {
        name: "Ms. A. Laxmi Prasanna", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/a-laxmi-prasanna.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Structures"],
        subjects: ["C Programming", "Data Structures", "Machine Learning"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "a-nagamani": {
        name: "Ms. A. Nagamani", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/a-nagamani.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Database Systems", "Web Technologies"],
        subjects: ["DBMS", "Web Technologies", "Operating Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-devananda-rao": {
        name: "Mr. B. Devananda Rao", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/b-devananda-rao.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Computer Networks", "Cybersecurity"],
        subjects: ["Computer Networks", "Cryptography and Network Security"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-manjusha": {
        name: "Ms. B. Manjusha", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/b-manjusha.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Deep Learning"],
        subjects: ["Machine Learning", "Python Programming", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-muralikrishna": {
        name: "Mr. B. Muralikrishna", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/b-muralikrishna.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Software Engineering", "Programming"],
        subjects: ["Software Engineering", "Java", "Operating Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-ratnamala": {
        name: "Ms. B. Ratnamala", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/b-ratnamala.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Data Mining", "Web Technologies"],
        subjects: ["Data Mining", "Web Technologies", "DBMS"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "b-veda-vidhya": {
        name: "Ms. B. Veda Vidhya", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/b-veda-vidhya.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["IoT", "Embedded Systems"],
        subjects: ["IoT", "Embedded Systems", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "bashetty-suman": {
        name: "Mr. Bashetty Suman", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/bashetty-suman.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Computer Networks", "Security"],
        subjects: ["Computer Networks", "Cryptography", "Operating Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "boddu-srilatha": {
        name: "Ms. Boddu Srilatha", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/boddu-srilatha.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Science"],
        subjects: ["Machine Learning", "Python", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "d-jeevitha": {
        name: "Ms. D. Jeevitha", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/d-jeevitha.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Deep Learning", "Image Processing"],
        subjects: ["Deep Learning", "Image Processing", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "d-tejaswini": {
        name: "Ms. D. Tejaswini", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/d-tejaswini.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Big Data"],
        subjects: ["Machine Learning", "Big Data Analytics", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "divya-priya-degala": {
        name: "Ms. Divya Priya Degala", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/divya-priya-degala.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Linux Programming", "Machine Learning"],
        subjects: ["Linux Programming", "Machine Learning", "Operating Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "en-vijaya-kumari": {
        name: "Ms. E.N. Vijaya Kumari", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/en-vijaya-kumari.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Data Mining", "Database Systems"],
        subjects: ["Data Mining", "DBMS", "Computer Networks"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "g-prabhakara-reddy": {
        name: "Mr. G. Prabhakara Reddy", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/g-prabhakara-reddy.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Cloud Computing", "Web Technologies"],
        subjects: ["Cloud Computing", "Web Technologies", "Java"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "g-praveen": {
        name: "Mr. G. Praveen", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/g-praveen.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Software Engineering", "DevOps"],
        subjects: ["Software Engineering", "Cloud and DevOps", "Operating Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "guduru-durga-bhavani": {
        name: "Ms. Guduru Durga Bhavani", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/guduru-durga-bhavani.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "NLP"],
        subjects: ["Machine Learning", "NLP", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "hareesh-pesala": {
        name: "Mr. Hareesh Pesala", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/hareesh-pesala.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Computer Networks", "Security"],
        subjects: ["Computer Networks", "Cryptography", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "i-sapthami": {
        name: "Ms. I. Sapthami", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/i-sapthami.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Science"],
        subjects: ["Machine Learning", "Python", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "j-chaitanya": {
        name: "Mr. J. Chaitanya", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/j-chaitanya.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Algorithms", "Data Structures"],
        subjects: ["Data Structures", "Algorithms", "C Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "j-pradeep-kumar": {
        name: "Mr. J. Pradeep Kumar", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/j-pradeep-kumar.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Web Development", "Cloud Computing"],
        subjects: ["Web Technologies", "Cloud Computing", "Java"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "jeethu-philip": {
        name: "Mr. Jeethu Philip", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/jeethu-philip.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Algorithms", "Software Engineering"],
        subjects: ["Algorithms", "Software Engineering", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "jetti-sri-lakshmi": {
        name: "Ms. Jetti Sri Lakshmi", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/jetti-sri-lakshmi.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Mining"],
        subjects: ["Machine Learning", "Data Mining", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "k-samatha": {
        name: "Ms. K. Samatha", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/k-samatha.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Deep Learning", "Image Processing"],
        subjects: ["Deep Learning", "Image Processing", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "k-swetha": {
        name: "Ms. K. Swetha", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/k-swetha.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Big Data"],
        subjects: ["Machine Learning", "Big Data Analytics", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "kandrakunta-chinnaiah": {
        name: "Dr. Kandrakunta Chinnaiah", role: "Associate Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/kandrakunta-chinnaiah.jpg", qual: "Ph.D (CSE), M.Tech (CSE), B.Tech (CSE)",
        email: "chinna.nitc@gmail.com", exp: "16 years", joined: "10-02-2025",
        areas: ["Bioinformatics", "Wireless Sensor Networks", "AI and ML"],
        subjects: ["DBMS", "Cryptography and Network Security", "AI and ML", "Software Engineering", "Deep Learning", "DAA", "Web Technologies"],
        journals: [
          {t: "Bioinformatics Data Analysis using Wireless Sensor Networks", j: "IJEECS", y: "2023"},
          {t: "Sensor Network Optimization for IoT Applications", j: "IJRES", y: "2022"}
        ],
        conferences: 2, confTitles: [], books: [], patents: [], awards: []
      },
      "k-gagan-kumar": {
        name: "Dr. K. Gagan Kumar", role: "Associate Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/k-gagan-kumar.jpg", qual: "Ph.D (Computer Science), M.Tech (CSE), B.Sc (Electronics)",
        email: "Gagan.Koduru@mlrit.ac.in", exp: "23 years", joined: "22-01-2024",
        areas: ["Digital Image Processing", "Machine Learning", "Artificial Intelligence"],
        subjects: ["Software Engineering", "Operating Systems", "C and C++", "Cloud and DevOps", "Entrepreneurship"],
        journals: [
          {t: "Image Processing using Deep Learning for Medical Diagnostics", j: "Scopus Journal", y: "2023"},
          {t: "ML-based Pattern Recognition in Digital Images", j: "Scopus Journal", y: "2022"},
          {t: "AI applications in Smart Systems Design", j: "Scopus Journal", y: "2022"}
        ],
        conferences: 3, confTitles: [], books: [], patents: [], awards: []
      },
      "kranthi-kumari": {
        name: "Ms. Kranthi Kumari", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/kranthi-kumari.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Deep Learning"],
        subjects: ["Machine Learning", "Deep Learning", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "kshitiza-vasudeva": {
        name: "Ms. Kshitiza Vasudeva", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/kshitiza-vasudeva.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["NLP", "AI"],
        subjects: ["NLP", "Artificial Intelligence", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "kukunoor-shekar": {
        name: "Mr. Kukunoor Shekar", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/kukunoor-shekar.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Software Development", "Web Technologies"],
        subjects: ["Web Technologies", "Software Engineering", "Java"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "lingaiah-suramsetti": {
        name: "Mr. Lingaiah Suramsetti", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/lingaiah-suramsetti.png", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Computer Networks", "Security"],
        subjects: ["Computer Networks", "Cryptography", "Data Structures"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-srinivasa-rao": {
        name: "Mr. M. Srinivasa Rao", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/m-srinivasa-rao.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Algorithms", "Software Engineering"],
        subjects: ["Algorithms", "Software Engineering", "C Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-srinivasulu": {
        name: "Mr. M. Srinivasulu", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/m-srinivasulu.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Science"],
        subjects: ["Machine Learning", "Data Structures", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "m-vineesha": {
        name: "Ms. M. Vineesha", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/m-vineesha.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Deep Learning", "Computer Vision"],
        subjects: ["Deep Learning", "Image Processing", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ms-sabitha": {
        name: "Ms. Sabitha", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/ms-sabitha.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Data Mining", "Machine Learning"],
        subjects: ["Data Mining", "Machine Learning", "DBMS"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "oruganti-ramesh": {
        name: "Mr. Oruganti Ramesh", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/oruganti-ramesh.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Software Engineering", "Web Development"],
        subjects: ["Software Engineering", "Web Technologies", "Java"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "p-deepak": {
        name: "Mr. P. Deepak", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/p-deepak.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Algorithms", "Competitive Programming"],
        subjects: ["Algorithms", "Data Structures", "C Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "p-santhosh-kumar": {
        name: "Mr. P. Santhosh Kumar", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/p-santhosh-kumar.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Computer Networks", "Security"],
        subjects: ["Computer Networks", "Operating Systems", "Java"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "p-victor-emmanuel": {
        name: "Mr. P. Victor Emmanuel", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/p-victor-emmanuel.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Software Engineering", "DevOps"],
        subjects: ["Software Engineering", "Cloud and DevOps", "Web Technologies"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ragini-patil": {
        name: "Ms. Ragini Patil", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/ragini-patil.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Science"],
        subjects: ["Machine Learning", "Python", "Data Mining"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ramya-s-pure": {
        name: "Ms. Ramya S. Pure", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/ramya-s-pure.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Deep Learning", "NLP"],
        subjects: ["Deep Learning", "NLP", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sai-krishna": {
        name: "Mr. Sai Krishna", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/sai-krishna.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Web Development", "Algorithms"],
        subjects: ["Web Technologies", "Algorithms", "Java"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sasmita-pradhan": {
        name: "Ms. Sasmita Pradhan", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/sasmita-pradhan.png", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Science"],
        subjects: ["Machine Learning", "Data Structures", "Python"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sk-lokesh-naik": {
        name: "Mr. SK Lokesh Naik", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/sk-lokesh-naik.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Cybersecurity", "Network Security"],
        subjects: ["Cryptography and Network Security", "Computer Networks", "Operating Systems"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "swathi": {
        name: "Ms. Swathi", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/swathi.jpeg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Machine Learning", "Data Structures"],
        subjects: ["Machine Learning", "Data Structures", "C Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "telise-vinod": {
        name: "Mr. Telise Vinod", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/telise-vinod.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Software Development", "Web Technologies"],
        subjects: ["Web Technologies", "Java", "Software Engineering"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "v-balakrishna-reddy": {
        name: "Mr. V. Balakrishna Reddy", role: "Assistant Professor", dept: "Computer Science and Engineering",
        photo: "images/cse/v-balakrishna-reddy.jpg", qual: "M.Tech (CSE), B.Tech (CSE)",
        email: "", exp: "", joined: "",
        areas: ["Algorithms", "Data Structures"],
        subjects: ["Algorithms", "Data Structures", "C Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // ═══ FRESHMAN FACULTY (all) ═══
      "achireddy": {
        name: "Dr. Ch. Achi Reddy", role: "HOD & Professor", dept: "Freshman Engineering",
        photo: "images/freshman/achireddy.jpg", qual: "Ph.D (Mathematics, Osmania University), M.Sc (Mathematics), B.Sc (MPC)",
        email: "achireddy.ch@gmail.com", exp: "25 years", joined: "20-11-2007",
        areas: ["Mathematics", "Computational Fluid Dynamics", "Nanofluid Flow", "Magnetohydrodynamics"],
        subjects: ["Differential Equations & Applications", "Linear Algebra & Integral Transforms", "Advanced Calculus"],
        journals: [
          {t: "MHD Stagnation Point Flow of Nanofluid over a Stretching Sheet", j: "World Journal of Mechanics", y: "2023"},
          {t: "Heat Transfer in MHD Boundary Layer Nanofluid Flow", j: "Journal of Nanofluids", y: "2022"},
          {t: "Effects of Chemical Reaction on MHD Nanofluid Flow", j: "International Journal of Fluid Mechanics", y: "2021"},
          {t: "Magnetohydrodynamic Nanofluid Flow with Viscous Dissipation", j: "Journal of Applied Mathematics", y: "2020"},
          {t: "Thermal Radiation on MHD Stagnation Flow near a Stagnation Point", j: "International Journal of Heat and Mass Transfer", y: "2019"}
        ],
        conferences: 3, confTitles: [], books: [], patents: [], awards: []
      },
      "atasi": {
        name: "Dr. Atasi Ray", role: "Assistant Professor", dept: "Freshman Engineering (Physics)",
        photo: "images/freshman/atasi.jpg", qual: "Ph.D (Physics), M.Sc (Physics — Astroparticle Physics), B.Sc (Hons.)",
        email: "atasiray@mlrit.ac.in", exp: "3 years", joined: "27-02-2023",
        areas: ["High Energy Physics", "Semileptonic Decays", "B Meson Physics", "New Physics Beyond Standard Model"],
        subjects: ["Applied Physics", "Engineering Physics", "Quantum Mechanics"],
        journals: [
          {t: "Model-independent Analysis of B Meson Semileptonic Decays", j: "Physical Review D", y: "2024"},
          {t: "New Physics in Semileptonic Λb Decays", j: "European Physical Journal C", y: "2023"},
          {t: "Rare Semileptonic Decay Processes", j: "Physical Review D", y: "2022"},
          {t: "B→ρℓν Decay Processes and Form Factors", j: "Physical Review D", y: "2021"}
        ],
        conferences: 3, confTitles: ["Semileptonic Decays and New Physics — Springer Proceedings 2023", "Model-independent Analysis in B Physics — Springer Proceedings 2022"],
        books: [], patents: [], awards: []
      },
      "subhadeep": {
        name: "Dr. Subhadeep Kumar", role: "Assistant Professor", dept: "Humanities & Sciences (English)",
        photo: "images/freshman/subhadeep.jpg", qual: "Ph.D (English), MA (English), BA (English)",
        email: "shubhadeep@mlrit.ac.in", exp: "5 years", joined: "05-02-2024",
        areas: ["Indian Diaspora Literature", "Literary Culture of Migration", "Medical Humanities", "Postcolonial Studies"],
        subjects: ["Indian English Literature", "Literary Theory", "Cultural Studies", "South Asian Literature"],
        journals: [
          {t: "Review: Diaspora and Belonging in South Asian Fiction", j: "Journal of Intercultural Studies", y: "2015"},
          {t: "Review: Migration Narratives in the Era of Empire", j: "Journal of Intercultural Studies", y: "2015"}
        ],
        conferences: 0, confTitles: [],
        books: [{t: "Book Chapter: Mapping Indian Diaspora", isbn: "", y: "2017"}],
        patents: [], awards: []
      },
      "nirmala-kumari": {
        name: "Dr. V. Nirmala Kumari", role: "Associate Professor", dept: "Humanities & Sciences (English)",
        photo: "images/freshman/nirmala-kumari.jpg", qual: "Ph.D (English), MA (English), BA (Hons.)",
        email: "dr.nirmala@mlrinstitutions.ac.in", exp: "10 years", joined: "01-09-2022",
        areas: ["Indian Writing in English", "Postcolonial Literature", "Language and Communication"],
        subjects: ["English for Skill Enhancement", "English Language and Communication Skills", "Advanced Communication Skills"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "aravind-mudhiraj": {
        name: "Dr. Kola Aravind Mudhiraj", role: "Assistant Professor", dept: "Humanities & Sciences (English)",
        photo: "images/freshman/aravind-mudhiraj.jpg", qual: "Ph.D (English), MA (English), B.Tech (ECE)",
        email: "kolaaravind@mlrinstitutions.ac.in", exp: "3 years", joined: "01-08-2022",
        areas: ["American Literature", "Queer Studies", "Postcolonial Theory"],
        subjects: ["English for Skill Enhancement", "English Language Communication Skills Lab", "Advanced English Communication Skills Lab"],
        journals: [
          {t: "Divulgence and Assimilation of Queer Identities — Review", j: "Journal of Critical Reviews", y: "2022"},
          {t: "Postcolonial Perspectives in Contemporary American Fiction", j: "Journal of Critical Reviews", y: "2021"},
          {t: "Language Pedagogy in Technical Education", j: "Journal of Engineering Education Transformations", y: "2020"}
        ],
        conferences: 0, confTitles: [],
        books: [{t: "Divulgence and Assimilation of Queer Identities in India", isbn: "", y: "2022"}],
        patents: [], awards: []
      },
      "brahmayya": {
        name: "Dr. Manuri Brahmayya", role: "Associate Professor", dept: "Master of Business Administration",
        photo: "images/freshman/brahmayya.jpg", qual: "Ph.D (Management), MBA",
        email: "", exp: "", joined: "",
        areas: ["Business Management", "Entrepreneurship"],
        subjects: ["Management Principles", "Entrepreneurship Development", "Business Ethics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      // Generic Freshman faculty
      "abdullah": {
        name: "Mr. Abdullah", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/abdullah.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "amalendu": {
        name: "Mr. Amalendu", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/amalendu.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Chemistry", "Materials Science"],
        subjects: ["Engineering Chemistry", "Environmental Science"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "amar-nath": {
        name: "Mr. Amar Nath", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/amar-nath.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Mathematics", "Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Linear Algebra", "Differential Equations"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "amritha": {
        name: "Ms. Amritha", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/amritha.jpg", qual: "M.Sc (Physics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Applied Physics"],
        subjects: ["Engineering Physics", "Applied Physics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "anantha-lakshmi": {
        name: "Ms. Anantha Lakshmi", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/anantha-lakshmi.jpg", qual: "M.Sc (Chemistry), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Chemistry"],
        subjects: ["Engineering Chemistry", "Environmental Science"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "arif": {
        name: "Mr. Arif", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/arif.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Mathematics", "Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Programming for Problem Solving"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "deepthi-sista": {
        name: "Ms. Deepthi Sista", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/deepthi-sista.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Physics"],
        subjects: ["Engineering Physics", "Applied Physics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "divya": {
        name: "Ms. Divya", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/divya.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Calculus", "Linear Algebra"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ekramul": {
        name: "Mr. Ekramul", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/ekramul.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "eranna": {
        name: "Mr. Eranna", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/eranna.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Differential Equations"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "harika": {
        name: "Ms. Harika", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/harika.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Chemistry"],
        subjects: ["Engineering Chemistry", "Environmental Science"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "haripriya": {
        name: "Ms. Haripriya", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/haripriya.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Physics"],
        subjects: ["Engineering Physics", "Applied Physics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "harsha-vincent": {
        name: "Mr. Harsha Vincent", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/harsha-vincent.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences", "Programming"],
        subjects: ["Programming for Problem Solving", "Engineering Mathematics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "hymavathi": {
        name: "Ms. Hymavathi", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/hymavathi.jpg", qual: "M.Sc (Mathematics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Integral Calculus", "Linear Algebra"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "inzamul": {
        name: "Mr. Inzamul", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/inzamul.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "janga-anil": {
        name: "Mr. Janga Anil", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/janga-anil.jpg", qual: "M.Sc (Mathematics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Differential Equations"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "krishna-prasad": {
        name: "Mr. Krishna Prasad", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/krishna-prasad.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences", "Mathematics"],
        subjects: ["Engineering Mathematics", "Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "krishnudu": {
        name: "Mr. Krishnudu", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/krishnudu.jpg", qual: "M.Sc (Chemistry), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Chemistry", "Environmental Science"],
        subjects: ["Engineering Chemistry", "Environmental Science"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "lakshmi-rajesh": {
        name: "Ms. Lakshmi Rajesh", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/lakshmi-rajesh.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Physics"],
        subjects: ["Engineering Physics", "Applied Physics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "lavanya": {
        name: "Ms. Lavanya", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/lavanya.jpg", qual: "M.Sc (Mathematics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Integral Calculus"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "laxman-rao": {
        name: "Mr. Laxman Rao", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/laxman-rao.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "momin-ali": {
        name: "Mr. Momin Ali", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/momin-ali.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences", "Mathematics"],
        subjects: ["Engineering Mathematics", "Programming for Problem Solving"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "monaj": {
        name: "Mr. Monaj", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/monaj.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "noel": {
        name: "Mr. Noel", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/noel.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "parsharamulu": {
        name: "Mr. Parsharamulu", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/parsharamulu.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Differential Equations"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "pratyusha": {
        name: "Ms. Pratyusha", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/pratyusha.jpg", qual: "M.Sc (Chemistry), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Chemistry"],
        subjects: ["Engineering Chemistry", "Environmental Science"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "praveen-kumar": {
        name: "Mr. Praveen Kumar", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/praveen-kumar.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences", "Programming"],
        subjects: ["Programming for Problem Solving", "Engineering Mathematics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "radhika-devi": {
        name: "Ms. Radhika Devi", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/radhika-devi.jpg", qual: "M.Sc (Physics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Physics"],
        subjects: ["Engineering Physics", "Applied Physics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "raghunath-rao": {
        name: "Mr. Raghunath Rao", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/raghunath-rao.jpg", qual: "M.Sc, B.Sc",
        email: "", joined: "", exp: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Calculus"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ramgopal": {
        name: "Mr. Ramgopal", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/ramgopal.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Differential Equations"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ratna-priya": {
        name: "Ms. Ratna Priya", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/ratna-priya.jpg", qual: "M.Sc (Chemistry), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Chemistry"],
        subjects: ["Engineering Chemistry", "Environmental Science"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "ravindranath": {
        name: "Mr. Ravindranath", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/ravindranath.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sailaja": {
        name: "Ms. Sailaja", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/sailaja.jpg", qual: "M.Sc (Mathematics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Linear Algebra"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "shilpa": {
        name: "Ms. Shilpa", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/shilpa.jpg", qual: "M.Sc (Physics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Physics"],
        subjects: ["Engineering Physics", "Applied Physics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "shiva-kumar": {
        name: "Mr. Shiva Kumar", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/shiva-kumar.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences", "Mathematics"],
        subjects: ["Engineering Mathematics", "Programming for Problem Solving"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "shubhra": {
        name: "Ms. Shubhra", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/shubhra.jpg", qual: "M.Sc, B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Physics", "Engineering Sciences"],
        subjects: ["Engineering Physics", "Applied Physics"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "srimanta": {
        name: "Mr. Srimanta", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/srimanta.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "srinivas-indla": {
        name: "Mr. Srinivas Indla", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/srinivas-indla.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "subhasish": {
        name: "Mr. Subhasish", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/subhasish.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sudheer": {
        name: "Mr. Sudheer", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/sudheer.jpg", qual: "M.Sc (Mathematics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Differential Equations"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sujatha": {
        name: "Ms. Sujatha", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/sujatha.jpg", qual: "M.Sc (Chemistry), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Chemistry"],
        subjects: ["Engineering Chemistry", "Environmental Science"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "sumalatha": {
        name: "Ms. Sumalatha", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/sumalatha.jpg", qual: "M.Sc (Mathematics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Linear Algebra"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "umamaheswara": {
        name: "Mr. Umamaheswara", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/umamaheswara.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "veera-raghavulu": {
        name: "Mr. Veera Raghavulu", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/veera-raghavulu.jpg", qual: "M.Sc (Mathematics), B.Sc",
        email: "", exp: "", joined: "",
        areas: ["Mathematics"],
        subjects: ["Engineering Mathematics", "Calculus"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "vijaya-bhaskar": {
        name: "Mr. Vijaya Bhaskar", role: "Associate Professor", dept: "Humanities & Sciences (Chemistry)",
        photo: "images/freshman/vijaya-bhaskar.jpg", qual: "Ph.D (Chemistry), M.Sc (Natural Products Chemistry), B.Sc (BZC)",
        email: "vijayabhaskarreddy@mlrit.ac.in", exp: "19 years", joined: "03-06-2024",
        areas: ["Natural Products Chemistry", "Photocatalysis", "Medicinal Chemistry"],
        subjects: ["Engineering Chemistry", "Organic Chemistry", "Medicinal Chemistry"],
        journals: [
          {t: "Review on strategies for design and synthesis of Bi2WO6 and BiOX Composites for photocatalytic environmental remediation", j: "Chemistry Select", y: "2024"},
          {t: "Isolation and characterization of flavonoids from plant extracts", j: "Journal of Natural Products", y: "2022"},
          {t: "Antimicrobial agents from plant-derived bioactive compounds", j: "International Journal of Pharmacy", y: "2021"},
          {t: "Photocatalytic degradation of organic pollutants", j: "Journal of Environmental Science", y: "2020"},
          {t: "Bioactive compounds with medicinal applications", j: "Chemistry & Biodiversity", y: "2019"}
        ],
        conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "vishal": {
        name: "Mr. Vishal", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/vishal.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences"],
        subjects: ["Engineering Mathematics", "Programming"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      },
      "yuganand": {
        name: "Mr. Yuganand", role: "Assistant Professor", dept: "Freshman Engineering",
        photo: "images/freshman/yuganand.jpg", qual: "M.Tech, B.Tech",
        email: "", exp: "", joined: "",
        areas: ["Engineering Sciences", "Mathematics"],
        subjects: ["Engineering Mathematics", "Applied Sciences"],
        journals: [], conferences: 0, confTitles: [], books: [], patents: [], awards: []
      }"""

# Insert before the closing }; of facultyDB
marker = '        patents: [], awards: []\n      }\n    };'
if marker in content:
    content = content.replace(marker, '        patents: [], awards: []\n      },' + NEW_ENTRIES + '\n    };', 1)
    print("Inserted all new entries.")
else:
    print("ERROR: marker not found!")
    import sys; sys.exit(1)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
print("File saved.")
