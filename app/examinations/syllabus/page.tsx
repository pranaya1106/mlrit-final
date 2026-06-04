'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';
import SideQuickNav from '@/components/SideQuickNav';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Branch = 'CSE' | 'AIML' | 'ECE' | 'EEE' | 'MECH' | 'AERO' | 'IT' | 'CSE-CS' | 'CSE-DS' | 'CSIT';
type Regulation = 'R25' | 'R22' | 'MLR20' | 'MLR18';
type Year = 1 | 2 | 3 | 4;
type Sem = 1 | 2;

interface Subject {
  code: string;
  name: string;
  type: 'Theory' | 'Lab' | 'Elective' | 'Mandatory';
  credits: number;
  pdfFile?: string; // filename only — resolved to full path in render
}

// ─────────────────────────────────────────────
// Branch → available regulations
// ─────────────────────────────────────────────
const BRANCH_REGS: Record<Branch, Regulation[]> = {
  CSE:     ['R25', 'R22', 'MLR20', 'MLR18'],
  AIML:    ['R25', 'R22', 'MLR20'],
  ECE:     ['R25', 'R22', 'MLR20'],
  EEE:     ['R25', 'R22', 'MLR20', 'MLR18'],
  MECH:    ['R25', 'R22', 'MLR20', 'MLR18'],
  AERO:    ['R25', 'R22', 'MLR18'],
  IT:      ['R22', 'MLR20', 'MLR18'],
  'CSE-CS': ['R22', 'MLR20'],
  'CSE-DS': ['R25', 'R22', 'MLR20'],
  CSIT:    ['R22', 'MLR20'],
};

// ─────────────────────────────────────────────
// Bulk PDF lookup: /syllabus/{branch-slug}-{reg-slug}-syllabus.pdf
// ─────────────────────────────────────────────
const branchSlug: Record<Branch, string> = {
  CSE: 'cse', AIML: 'aiml', ECE: 'ece', EEE: 'eee', MECH: 'mech',
  AERO: 'aero', IT: 'it', 'CSE-CS': 'cse-cs', 'CSE-DS': 'cse-ds', CSIT: 'csit',
};
const regSlug: Record<Regulation, string> = {
  R25: 'r25', R22: 'r22', MLR20: 'mlr20', MLR18: 'mlr18',
};

function bulkPdf(branch: Branch, reg: Regulation) {
  return `/syllabus/${branchSlug[branch]}-${regSlug[reg]}-syllabus.pdf`;
}

// ─────────────────────────────────────────────
// Individual PDF base paths
// The page resolves: basePath + '/' + pdfFile
// ─────────────────────────────────────────────
function subjectPdfBase(branch: Branch, reg: Regulation): string | null {
  if (branch === 'CSE' && reg === 'R22') return '/syllabus/r22';
  if (branch === 'MECH' && reg === 'R22') return '/syllabus/mech-r22';
  if (branch === 'AERO' && reg === 'R22') return '/syllabus/aero-r22';
  if (reg === 'MLR18') return '/syllabus/mlr18';
  if (reg === 'MLR20') return '/syllabus/mlr20';
  return null;
}

// ─────────────────────────────────────────────
// Subject data
// Keys: `${branch}-${reg}-${year}-${sem}`
// ─────────────────────────────────────────────
type SubjectKey = string;
const SUBJECTS: Record<SubjectKey, Subject[]> = {

  // ════════════════════════════════════════════
  // CSE · R22
  // ════════════════════════════════════════════
  'CSE-R22-1-1': [
    { code: 'BS101', name: 'Linear Algebra & Calculus',               type: 'Theory',    credits: 4, pdfFile: 'LINEAR-ALGEBRA-AND-CALCULUS.pdf' },
    { code: 'BS102', name: 'Applied Physics',                          type: 'Theory',    credits: 4, pdfFile: 'APPLIED-PHYSICS.pdf' },
    { code: 'ES101', name: 'Programming for Problem Solving',          type: 'Theory',    credits: 3, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING.pdf' },
    { code: 'ES102', name: 'Engineering Drawing',                      type: 'Theory',    credits: 3, pdfFile: 'ENGINEERING-DRAWING.pdf' },
    { code: 'HS101', name: 'English Language & Communication Skills',  type: 'Theory',    credits: 2, pdfFile: 'ENGLISH-LANGUAGE-AND-COMMUNICATION-SKILLS-LAB.pdf' },
    { code: 'LB101', name: 'Programming for Problem Solving Lab',      type: 'Lab',       credits: 1, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING-LAB.pdf' },
    { code: 'LB102', name: 'Applied Physics Lab',                      type: 'Lab',       credits: 1, pdfFile: 'APPLIED-PHYSICS-LAB.pdf' },
    { code: 'MC101', name: 'Elements of Computer Science & Engg.',     type: 'Mandatory', credits: 0, pdfFile: 'ELEMENTS-OF-COMPUTER-SCIENCE-AND-ENGINEERING.pdf' },
  ],
  'CSE-R22-1-2': [
    { code: 'BS201', name: 'Discrete Mathematics',                     type: 'Theory',    credits: 4, pdfFile: 'DISCRETE-MATHEMATICS.pdf' },
    { code: 'BS202', name: 'Engineering Chemistry',                    type: 'Theory',    credits: 4, pdfFile: 'ENGINEERING-CHEMISTRY.pdf' },
    { code: 'ES201', name: 'Digital Electronics & Computer Organization', type: 'Theory', credits: 3, pdfFile: 'DIGITAL-ELECTRONICS-AND-COMPUTER-ORGANIZATION.pdf' },
    { code: 'ES202', name: 'Electronic Devices & Applications',        type: 'Theory',    credits: 3, pdfFile: 'ELECTRONIC-DEVICES-AND-APPLICATIONS.pdf' },
    { code: 'HS201', name: 'English for Skill Enhancement',            type: 'Theory',    credits: 2, pdfFile: 'ENGLISH-FOR-SKILL-ENHANCEMENT.pdf' },
    { code: 'LB201', name: 'Data Structures Lab',                      type: 'Lab',       credits: 1, pdfFile: 'DATA-STRUCTURES-LAB.pdf' },
    { code: 'MC201', name: 'Constitution of India',                    type: 'Mandatory', credits: 0, pdfFile: 'CONSTITUTION-OF-INDIA.pdf' },
    { code: 'MC202', name: 'Gender Sensitization',                     type: 'Mandatory', credits: 0, pdfFile: 'GENDER-SENSITIZATION.pdf' },
  ],
  'CSE-R22-2-1': [
    { code: 'PC301', name: 'Data Structures',                          type: 'Theory',    credits: 4, pdfFile: 'DATA-STRUCTURES.pdf' },
    { code: 'PC302', name: 'Object-Oriented Programming through Java', type: 'Theory',    credits: 3, pdfFile: 'OBJECT-ORIENTED-PROGRAMMING-THROUGH-JAVA.pdf' },
    { code: 'PC303', name: 'Database Management Systems',              type: 'Theory',    credits: 3, pdfFile: 'DATABASE-MANAGEMENT-SYSTEMS.pdf' },
    { code: 'BS301', name: 'Probability, Statistics & Complex Analysis',type: 'Theory',   credits: 4, pdfFile: 'COMPUTER-ORIENTED-STATISTICAL-METHODS.pdf' },
    { code: 'BS302', name: 'Basic Electrical & Electronics Engg.',     type: 'Theory',    credits: 3, pdfFile: 'BASIC-ELECTRICAL-AND-ELECTRONICS-ENGINEERING.pdf' },
    { code: 'LB301', name: 'Object-Oriented Programming through Java Lab', type: 'Lab',  credits: 1, pdfFile: 'OBJECT-ORIENTED-PROGRAMMING-THROUGH-JAVA-LAB.pdf' },
    { code: 'LB302', name: 'Database Management Systems Lab',          type: 'Lab',       credits: 1, pdfFile: 'DATABASE-MANAGEMENT-SYSTEMS-LAB.pdf' },
    { code: 'MC301', name: 'Environmental Science',                    type: 'Mandatory', credits: 0, pdfFile: 'ENVIRONMENTAL-SCIENCE.pdf' },
  ],
  'CSE-R22-2-2': [
    { code: 'PC401', name: 'Operating Systems',                        type: 'Theory',    credits: 4, pdfFile: 'OPERATING-SYSTEMS.pdf' },
    { code: 'PC402', name: 'Design & Analysis of Algorithms',          type: 'Theory',    credits: 4, pdfFile: 'DESIGN_AND_ANALYSIS_OF_ALGORITHMS.pdf' },
    { code: 'PC403', name: 'Computer Networks',                        type: 'Theory',    credits: 3, pdfFile: 'COMPUTER_NETWORKS.pdf' },
    { code: 'BS401', name: 'Numerical Methods & Integral Transforms',  type: 'Theory',    credits: 4, pdfFile: 'NUMERICAL-METHODS-AND-INTEGRAL-TRANSFORMS.pdf' },
    { code: 'LB401', name: 'Operating Systems Lab',                    type: 'Lab',       credits: 1, pdfFile: 'OPERATING-SYSTEMS-LAB.pdf' },
    { code: 'LB402', name: 'Computer Networks Lab',                    type: 'Lab',       credits: 1, pdfFile: 'COMPUTER_NETWORKS_LAB.pdf' },
    { code: 'PE401', name: 'Python Programming Lab',                   type: 'Lab',       credits: 1, pdfFile: 'PYTHON-PROGRAMMING-LAB.pdf' },
    { code: 'MC401', name: 'Business Economics & Financial Analysis',  type: 'Mandatory', credits: 2, pdfFile: 'BUSINESS-ECONOMICS-AND-FINANCIAL-ANALYSIS.pdf' },
  ],
  'CSE-R22-3-1': [
    { code: 'PC501', name: 'Software Engineering',                     type: 'Theory',    credits: 3, pdfFile: 'SOFTWARE-ENGINEERING.pdf' },
    { code: 'PC502', name: 'Automata & Compiler Design',               type: 'Theory',    credits: 4, pdfFile: 'AUTOMATA_AND_COMPILER_DESIGN.pdf' },
    { code: 'PC503', name: 'Introduction to Artificial Intelligence',  type: 'Theory',    credits: 3, pdfFile: 'INTRODUCTION_TO_ARTIFICIAL_INTELLIGENCE.pdf' },
    { code: 'PE501', name: 'Introduction to Internet of Things',       type: 'Elective',  credits: 3, pdfFile: 'INTRODUCTION-TO-INTERNET-OF-THINGS.pdf' },
    { code: 'PE502', name: 'Skill Development Course',                 type: 'Elective',  credits: 2, pdfFile: 'SKILL-DEVELOPMENT-COURSE.pdf' },
    { code: 'LB501', name: 'Cloud & DevOps Lab',                      type: 'Lab',       credits: 1, pdfFile: 'CLOUD_AND_DEVOPS_LAB.pdf' },
    { code: 'MC501', name: 'Human Values & Professional Ethics',       type: 'Mandatory', credits: 0, pdfFile: 'HUMAN_VALUES_AND_PROFESSIONAL_ETHICS.pdf' },
  ],
  'CSE-R22-3-2': [
    { code: 'PC601', name: 'Cloud & DevOps',                          type: 'Theory',    credits: 3, pdfFile: 'CLOUD_AND_DEVOPS.pdf' },
    { code: 'PC602', name: 'Cryptography & Network Security',          type: 'Theory',    credits: 3, pdfFile: 'CRYPTOGRAPHY_AND_NETWORK_SECURITY.pdf' },
    { code: 'PC603', name: 'Data Mining & Machine Learning',           type: 'Theory',    credits: 3, pdfFile: 'DATA_MINING_AND_MACHINE_LEARNING.pdf' },
    { code: 'PC604', name: 'Distributed Computing',                    type: 'Theory',    credits: 3, pdfFile: 'DISTRIBUTED_COMPUTING.pdf' },
    { code: 'PE601', name: 'Skill Development (Data Visualization)',   type: 'Elective',  credits: 2, pdfFile: 'SKILL-DEVELOPMENT-(DATA-VISUALIZATION-USING-R).pdf' },
    { code: 'LB601', name: 'Cryptography & Network Security Lab',      type: 'Lab',       credits: 1, pdfFile: 'CRYPTOGRAPHY_AND_NETWORK_SECURITY_LAB.pdf' },
    { code: 'LB602', name: 'Data Mining & Machine Learning Lab',       type: 'Lab',       credits: 1, pdfFile: 'DATA_MINING_AND_MACHINE_LEARNING_LAB.pdf' },
    { code: 'MC601', name: 'Advanced Communication Skills Lab',        type: 'Lab',       credits: 1, pdfFile: 'ADVANCED_COMMUNICATION_SKILLS_LAB.pdf' },
  ],
  'CSE-R22-4-1': [
    { code: 'PE701', name: 'Software Testing Fundamentals',            type: 'Theory',    credits: 3, pdfFile: 'SOFTWARE-TESTING-FUNDAMENTALS.pdf' },
    { code: 'PE702', name: 'Seminar',                                  type: 'Mandatory', credits: 2, pdfFile: 'SEMINAR.pdf' },
  ],
  'CSE-R22-4-2': [
    { code: 'PE801', name: 'Skill Development Course',                 type: 'Elective',  credits: 2, pdfFile: 'SKILL-DEVELOPMENT-COURSE.pdf' },
  ],

  // ════════════════════════════════════════════
  // CSE · R25 — I Year (common across branches)
  // ════════════════════════════════════════════
  'CSE-R25-1-1': [
    { code: 'MA101', name: 'Linear Algebra & Calculus',                type: 'Theory',    credits: 4 },
    { code: 'PH101', name: 'Applied Physics',                          type: 'Theory',    credits: 4 },
    { code: 'CS101', name: 'Programming for Problem Solving',          type: 'Theory',    credits: 3 },
    { code: 'ME101', name: 'Engineering Graphics',                     type: 'Theory',    credits: 3 },
    { code: 'EN101', name: 'English Language & Communication Skills',  type: 'Theory',    credits: 2 },
    { code: 'CS191', name: 'Programming Lab',                          type: 'Lab',       credits: 1 },
    { code: 'PH191', name: 'Applied Physics Lab',                      type: 'Lab',       credits: 1 },
    { code: 'MC101', name: 'Induction Programme',                      type: 'Mandatory', credits: 0 },
  ],
  'CSE-R25-1-2': [
    { code: 'MA102', name: 'Discrete Mathematics',                     type: 'Theory',    credits: 4 },
    { code: 'CH101', name: 'Engineering Chemistry',                    type: 'Theory',    credits: 4 },
    { code: 'CS102', name: 'Digital Electronics & Computer Organization', type: 'Theory', credits: 3 },
    { code: 'EE101', name: 'Basic Electrical & Electronics Engg.',     type: 'Theory',    credits: 3 },
    { code: 'EN102', name: 'English for Skill Enhancement',            type: 'Theory',    credits: 2 },
    { code: 'CS192', name: 'Data Structures Lab',                      type: 'Lab',       credits: 1 },
    { code: 'CH191', name: 'Engineering Chemistry Lab',                type: 'Lab',       credits: 1 },
    { code: 'MC102', name: 'Constitution of India',                    type: 'Mandatory', credits: 0 },
  ],
  'CSE-R25-2-1': [
    { code: 'CS301', name: 'Data Structures',                          type: 'Theory',    credits: 4 },
    { code: 'CS302', name: 'Object-Oriented Programming through Java', type: 'Theory',    credits: 3 },
    { code: 'CS303', name: 'Database Management Systems',              type: 'Theory',    credits: 3 },
    { code: 'MA301', name: 'Probability & Statistics',                 type: 'Theory',    credits: 4 },
    { code: 'CS391', name: 'OOP through Java Lab',                     type: 'Lab',       credits: 1 },
    { code: 'CS392', name: 'DBMS Lab',                                 type: 'Lab',       credits: 1 },
    { code: 'MC301', name: 'Environmental Science',                    type: 'Mandatory', credits: 0 },
  ],
  'CSE-R25-2-2': [
    { code: 'CS401', name: 'Operating Systems',                        type: 'Theory',    credits: 4 },
    { code: 'CS402', name: 'Design & Analysis of Algorithms',          type: 'Theory',    credits: 4 },
    { code: 'CS403', name: 'Computer Networks',                        type: 'Theory',    credits: 3 },
    { code: 'MA401', name: 'Numerical Methods & Integral Transforms',  type: 'Theory',    credits: 4 },
    { code: 'CS491', name: 'Operating Systems Lab',                    type: 'Lab',       credits: 1 },
    { code: 'CS492', name: 'Python Programming Lab',                   type: 'Lab',       credits: 1 },
  ],

  // ════════════════════════════════════════════
  // CSE · MLR20
  // ════════════════════════════════════════════
  'CSE-MLR20-1-1': [
    { code: 'MA101', name: 'Linear Algebra & Calculus',                type: 'Theory',    credits: 4, pdfFile: 'linear-algebra-and-calculus.pdf' },
    { code: 'PH101', name: 'Applied Physics',                          type: 'Theory',    credits: 4, pdfFile: 'Applied-Physics.pdf' },
    { code: 'CS101', name: 'Programming for Problem Solving',          type: 'Theory',    credits: 3, pdfFile: 'Programming-for-Problem-Solving.pdf' },
    { code: 'ME101', name: 'Engineering Graphics',                     type: 'Theory',    credits: 3, pdfFile: 'Engineering-Graphics.pdf' },
    { code: 'EN101', name: 'English',                                  type: 'Theory',    credits: 2, pdfFile: 'English.pdf' },
    { code: 'CS191', name: 'Programming for Problem Solving Lab',      type: 'Lab',       credits: 1, pdfFile: 'Programming-for-problem-solving-Lab.pdf' },
    { code: 'PH191', name: 'Applied Physics Lab',                      type: 'Lab',       credits: 1, pdfFile: 'Applied-Physics-Lab.pdf' },
  ],
  'CSE-MLR20-1-2': [
    { code: 'MA102', name: 'Advanced Calculus',                        type: 'Theory',    credits: 4, pdfFile: 'Advanced-Calculus.pdf' },
    { code: 'CH101', name: 'Applied Chemistry',                        type: 'Theory',    credits: 4, pdfFile: 'Applied-Chemistry.pdf' },
    { code: 'CS102', name: 'Digital Electronics & Computer Organization', type: 'Theory', credits: 3, pdfFile: 'Digital-Electronics-and-Computer-Organization.pdf' },
    { code: 'EE101', name: 'Basic Electrical & Electronics Engg.',     type: 'Theory',    credits: 3, pdfFile: 'Basic-Electrical-and-Electronics-Engineering.pdf' },
    { code: 'CS192', name: 'Data Structures Lab',                      type: 'Lab',       credits: 1, pdfFile: 'Data-Structures-Lab.pdf' },
    { code: 'CH191', name: 'Applied Chemistry Lab',                    type: 'Lab',       credits: 1, pdfFile: 'Applied-Chemistry-Lab.pdf' },
    { code: 'EN191', name: 'English Language & Communication Skills Lab', type: 'Lab',    credits: 1, pdfFile: 'English-Language-and-Communication-Skills-Lab.pdf' },
  ],
  'CSE-MLR20-2-1': [
    { code: 'CS301', name: 'Object-Oriented Programming',              type: 'Theory',    credits: 3, pdfFile: 'Object-oriented-Programming.pdf' },
    { code: 'CS302', name: 'Discrete Mathematics',                     type: 'Theory',    credits: 4, pdfFile: 'Discrete-Mathematics.pdf' },
    { code: 'CS303', name: 'Database Management System',               type: 'Theory',    credits: 3, pdfFile: 'Database-Management-System.pdf' },
    { code: 'MA301', name: 'Probability & Statistics',                 type: 'Theory',    credits: 4, pdfFile: 'Probability-and-Statistics.pdf' },
    { code: 'CS391', name: 'OOP Lab',                                  type: 'Lab',       credits: 1, pdfFile: 'Object-oriented-programming-lab.pdf' },
    { code: 'CS392', name: 'Database Management Systems Lab',          type: 'Lab',       credits: 1, pdfFile: 'Database-Management-Systems-Lab.pdf' },
    { code: 'MC301', name: 'Environmental Studies',                    type: 'Mandatory', credits: 0, pdfFile: 'Environmental-Studies.pdf' },
  ],
  'CSE-MLR20-2-2': [
    { code: 'CS401', name: 'Operating Systems',                        type: 'Theory',    credits: 3, pdfFile: 'Operating-systems.pdf' },
    { code: 'CS402', name: 'Design & Analysis of Algorithms',          type: 'Theory',    credits: 4, pdfFile: 'Design-and-Analysis-of-Algorithms.pdf' },
    { code: 'CS403', name: 'Computer Networks',                        type: 'Theory',    credits: 3, pdfFile: 'Computer-Networks.pdf' },
    { code: 'CS404', name: 'Software Engineering',                     type: 'Theory',    credits: 3, pdfFile: 'Software-Engineering.pdf' },
    { code: 'CS491', name: 'Advanced Data Structures Lab',             type: 'Lab',       credits: 1, pdfFile: 'Advanced-Data-Structures-Lab.pdf' },
    { code: 'CS492', name: 'Network Simulation Lab',                   type: 'Lab',       credits: 1, pdfFile: 'Network-Simulation-lab.pdf' },
    { code: 'MC401', name: 'Gender Sensitization',                     type: 'Mandatory', credits: 0, pdfFile: 'Gender-Sensitization.pdf' },
  ],
  'CSE-MLR20-3-1': [
    { code: 'CS501', name: 'Python Programming',                       type: 'Theory',    credits: 3, pdfFile: 'Python-Programming.pdf' },
    { code: 'CS502', name: 'Web Technologies',                         type: 'Theory',    credits: 3, pdfFile: 'Web-technologies.pdf' },
    { code: 'CS503', name: 'Machine Learning',                         type: 'Theory',    credits: 3, pdfFile: 'Machine-Learning.pdf' },
    { code: 'CS591', name: 'Web Technologies Lab',                     type: 'Lab',       credits: 1, pdfFile: 'Web-echnologies-lab.pdf' },
    { code: 'CS592', name: 'Machine Learning Lab',                     type: 'Lab',       credits: 1, pdfFile: 'Machine-Learning-Lab.pdf' },
    { code: 'MC501', name: 'Human Values & Professional Ethics',       type: 'Mandatory', credits: 0, pdfFile: 'Human-Values-and-Professional-Ethics.pdf' },
  ],
  'CSE-MLR20-3-2': [
    { code: 'CS601', name: 'Automata & Compiler Design',               type: 'Theory',    credits: 4, pdfFile: 'Automata-and-compiler-design.pdf' },
    { code: 'CS602', name: 'Big Data Analytics',                       type: 'Theory',    credits: 3, pdfFile: 'Bid-data-Analytics.pdf' },
    { code: 'CS603', name: 'Introduction to IoT',                      type: 'Theory',    credits: 3, pdfFile: 'Introduction-to-Internet-of-Things.pdf' },
    { code: 'CS691', name: 'Linux Programming Lab',                    type: 'Lab',       credits: 1, pdfFile: 'Linux-Programming-Lab.pdf' },
    { code: 'CS692', name: 'Big Data Analytics Lab',                   type: 'Lab',       credits: 1, pdfFile: 'Big-Data-Analytics-Lab.pdf' },
  ],

  // ════════════════════════════════════════════
  // CSE · MLR18
  // ════════════════════════════════════════════
  'CSE-MLR18-1-1': [
    { code: 'MA101', name: 'Linear Algebra & Calculus',                type: 'Theory',    credits: 4, pdfFile: 'LINEAR--ALGEBRA-AND-CALCULUS.pdf' },
    { code: 'PH101', name: 'Applied Physics',                          type: 'Theory',    credits: 4, pdfFile: 'APPLIED-PHYSICS.pdf' },
    { code: 'CS101', name: 'Programming for Problem Solving',          type: 'Theory',    credits: 3, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING.pdf' },
    { code: 'EN101', name: 'English',                                  type: 'Theory',    credits: 2, pdfFile: 'ENGLISH.pdf' },
    { code: 'ME101', name: 'Engineering Exploration',                  type: 'Theory',    credits: 2, pdfFile: 'ENGINEERING-EXPLORATION.pdf' },
    { code: 'CS191', name: 'Programming for Problem Solving Lab',      type: 'Lab',       credits: 1, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING-LAB.pdf' },
    { code: 'PH191', name: 'Applied Physics Laboratory',               type: 'Lab',       credits: 1, pdfFile: 'APPLIED-PHYSICS-LABORATORY.pdf' },
    { code: 'EN191', name: 'English Language & Communication Skills Lab', type: 'Lab',    credits: 1, pdfFile: 'ENGLISH-LANGUAGE-AND-COMMUNICATION-SKILLS-LABORATORY.pdf' },
  ],
  'CSE-MLR18-1-2': [
    { code: 'MA102', name: 'Advanced Calculus',                        type: 'Theory',    credits: 4, pdfFile: 'ADVANCED-CALCULAS.pdf' },
    { code: 'CH101', name: 'Chemistry',                                type: 'Theory',    credits: 4, pdfFile: 'CHEMISTRY.pdf' },
    { code: 'CS102', name: 'Digital Electronics',                      type: 'Theory',    credits: 3, pdfFile: 'DIGITAL-ELECTRONICS.pdf' },
    { code: 'EE101', name: 'Basic Electrical Engineering',             type: 'Theory',    credits: 3, pdfFile: 'BASIC-ELECTRICAL-ENGINEERING.pdf' },
    { code: 'ME101', name: 'Engineering Graphics & Design',            type: 'Theory',    credits: 3, pdfFile: 'ENGINEERING-GRAPHICS-AND-DESIGN.pdf' },
    { code: 'CH191', name: 'Chemistry Lab',                            type: 'Lab',       credits: 1, pdfFile: 'CHEMISTRY-LAB.pdf' },
    { code: 'EE191', name: 'Basic Electrical Engineering Lab',         type: 'Lab',       credits: 1, pdfFile: 'BASIC-ELECTRICAL-ENGINEERING-LAB.pdf' },
    { code: 'EN191b', name: 'Advanced English Communication Skills Lab', type: 'Lab',     credits: 1, pdfFile: 'ADVANCED-ENGLISH-COMMUNICATION-SKILLS-LAB.pdf' },
  ],
  'CSE-MLR18-2-1': [
    { code: 'CS301', name: 'Data Structures',                          type: 'Theory',    credits: 4, pdfFile: 'DATA-STRUCTURES.pdf' },
    { code: 'CS302', name: 'Discrete Structures',                      type: 'Theory',    credits: 4, pdfFile: 'DISCRETE-STRUCTURES.pdf' },
    { code: 'CS303', name: 'Electronic Devices',                       type: 'Theory',    credits: 3, pdfFile: 'ELECTRONIC-DEVICES.pdf' },
    { code: 'CS304', name: 'Object-Oriented Programming',              type: 'Theory',    credits: 3, pdfFile: 'OBJECT-ORIENTED-PROGRAMMING.pdf' },
    { code: 'CS391', name: 'Data Structures Lab',                      type: 'Lab',       credits: 1, pdfFile: 'DATA-STRUCTURES-LAB.pdf' },
    { code: 'CS392', name: 'Electronic Devices & Digital Logic Lab',   type: 'Lab',       credits: 1, pdfFile: 'ELECTRONIC-DEVICES-AND-DIGITAL-LOGIC-LAB.pdf' },
    { code: 'CS393', name: 'OOP Lab',                                  type: 'Lab',       credits: 1, pdfFile: 'OBJECT-ORIENTED-PROGRAMMING-LAB.pdf' },
    { code: 'ME301', name: 'Workshop Practices',                       type: 'Mandatory', credits: 1, pdfFile: 'WORKSHOP-PRACTICES.pdf' },
  ],
  'CSE-MLR18-2-2': [
    { code: 'CS401', name: 'Database Management Systems',              type: 'Theory',    credits: 4, pdfFile: 'DATABASE-MANAGEMENT-SYSTEMS.pdf' },
    { code: 'CS402', name: 'Computer Organization & Architecture',     type: 'Theory',    credits: 4, pdfFile: 'COMPUTER-ORGANIZATION-AND-ARCHITECTURE.pdf' },
    { code: 'CS403', name: 'Design & Analysis of Algorithms',          type: 'Theory',    credits: 4, pdfFile: 'DESIGN-AND-ANALYSIS-OF-ALGORITHMS.pdf' },
    { code: 'MA401', name: 'Probability & Statistics',                 type: 'Theory',    credits: 4, pdfFile: 'PROBABILITY-AND-STATISTICS.pdf' },
    { code: 'CS491', name: 'Database Management Systems Lab',          type: 'Lab',       credits: 1, pdfFile: 'DATABASE-MANAGEMENT-SYSTEMS-LAB.pdf' },
    { code: 'MC401', name: 'Environmental Science',                    type: 'Mandatory', credits: 0, pdfFile: 'ENVIRONMENTAL-SCIENCE.pdf' },
    { code: 'MC402', name: 'Constitution of India',                    type: 'Mandatory', credits: 0, pdfFile: 'CONSTITUTION-OF-INDIA.pdf' },
  ],
  'CSE-MLR18-3-1': [
    { code: 'CS501', name: 'Formal Language & Automata Theory',        type: 'Theory',    credits: 4, pdfFile: 'FORMAL-LANGUAGE-AND-AUTOMATA-THEORY.pdf' },
    { code: 'CS502', name: 'Operating Systems',                        type: 'Theory',    credits: 4, pdfFile: 'OPERATING-SYSTEMS.pdf' },
    { code: 'CS503', name: 'Computer Networks',                        type: 'Theory',    credits: 4, pdfFile: 'COMPUTER-NETWORKS.pdf' },
    { code: 'CS591', name: 'Linux Programming',                        type: 'Theory',    credits: 3, pdfFile: 'LINUX-PROGRAMMING.pdf' },
    { code: 'CS592', name: 'Linux Programming Lab',                    type: 'Lab',       credits: 1, pdfFile: 'LINUX-PROGRAMMING-LAB.pdf' },
    { code: 'MC501', name: 'Gender Sensitization',                     type: 'Mandatory', credits: 0, pdfFile: 'GENDER-SENSITIZATION.pdf' },
  ],
  'CSE-MLR18-3-2': [
    { code: 'CS601', name: 'Compiler Design',                          type: 'Theory',    credits: 4, pdfFile: 'COMPLIER-DESIGN.pdf' },
    { code: 'CS602', name: 'Web Technologies',                         type: 'Theory',    credits: 3, pdfFile: 'WEB-TECHNOLOGIES.pdf' },
    { code: 'CS603', name: 'Operations Research',                      type: 'Theory',    credits: 3, pdfFile: 'OPERATIONS-RESEARCH.pdf' },
    { code: 'CS604', name: 'Social Innovation',                        type: 'Theory',    credits: 2, pdfFile: 'SOCIAL-INNOVATION.pdf' },
    { code: 'CS691', name: 'Web Technologies Lab',                     type: 'Lab',       credits: 1, pdfFile: 'WEB-TECHNOLOGIES-LAB.pdf' },
    { code: 'CS692', name: 'Network Simulation Lab',                   type: 'Lab',       credits: 1, pdfFile: 'NETWORK-SIMULATION-LAB.pdf' },
  ],
  'CSE-MLR18-4-1': [
    { code: 'CS701', name: 'Big Data Analytics',                       type: 'Theory',    credits: 3, pdfFile: 'BIG-DATA-ANALYTICS.pdf' },
    { code: 'CS702', name: 'Business Economics & Financial Analysis',  type: 'Theory',    credits: 3, pdfFile: 'BUSINESS-ECONOMICS-AND-FINANCIAL-ANALYSIS.pdf' },
    { code: 'CS791', name: 'Big Data Analytics Lab',                   type: 'Lab',       credits: 1, pdfFile: 'BIG-DATA-ANALYTICS-LAB.pdf' },
    { code: 'MC701', name: 'Essence of Indian Traditional Knowledge',  type: 'Mandatory', credits: 0, pdfFile: 'ESSENCE-OF-INDIAN-TRADITIONAL-KNOWLEDGE.pdf' },
  ],
  'CSE-MLR18-4-2': [
    { code: 'CS801', name: 'Social Innovation',                        type: 'Theory',    credits: 2, pdfFile: 'SOCIAL-INNOVATION.pdf' },
  ],

  // ════════════════════════════════════════════
  // MECH · R22  (sample — Year 1 & 2)
  // ════════════════════════════════════════════
  'MECH-R22-1-1': [
    { code: 'MA101', name: 'Linear Algebra & Calculus',                type: 'Theory',    credits: 4, pdfFile: 'LINEAR-ALGEBRA-&-CALCULUS.pdf' },
    { code: 'PH101', name: 'Applied Physics',                          type: 'Theory',    credits: 4, pdfFile: 'APPLIED-PHYSICS.pdf' },
    { code: 'CS101', name: 'Programming for Problem Solving',          type: 'Theory',    credits: 3, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING.pdf' },
    { code: 'ME101', name: 'Engineering Graphics',                     type: 'Theory',    credits: 3, pdfFile: 'ENGINEERING-GRAPHICS.pdf' },
    { code: 'EN101', name: 'English Language & Communication Skills',  type: 'Theory',    credits: 2, pdfFile: 'ENGLISH-LANGUAGE-AND-COMMUNICATION-SKILLS-LAB.pdf' },
    { code: 'CS191', name: 'Programming for Problem Solving Lab',      type: 'Lab',       credits: 1, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING-LAB.pdf' },
    { code: 'PH191', name: 'Applied Physics Lab',                      type: 'Lab',       credits: 1, pdfFile: 'APPLIED-PHYSICS-LAB.pdf' },
  ],
  'MECH-R22-1-2': [
    { code: 'MA102', name: 'Numerical Methods & Integral Transforms',  type: 'Theory',    credits: 4, pdfFile: 'NUMERICAL-METHODS-AND-INTEGRAL-TRANSFORMS.pdf' },
    { code: 'CH101', name: 'Engineering Chemistry',                    type: 'Theory',    credits: 4, pdfFile: 'ENGINEERING-CHEMISTRY.pdf' },
    { code: 'ME102', name: 'Engineering Mechanics',                    type: 'Theory',    credits: 3, pdfFile: 'ENGINEERING-MECHANICS.pdf' },
    { code: 'ME103', name: 'Manufacturing Processes',                  type: 'Theory',    credits: 3, pdfFile: 'MANUFACTURING-PROCESSES.pdf' },
    { code: 'EE101', name: 'Basic Electrical & Electronics Engg.',     type: 'Theory',    credits: 3, pdfFile: 'BASIC-ELECTRICAL-AND-ELECTRONICS-ENGINEERING.pdf' },
    { code: 'CH191', name: 'Engineering Chemistry Lab',                type: 'Lab',       credits: 1, pdfFile: 'ENGINEERING-CHEMISTRY-LAB.pdf' },
    { code: 'ME191', name: 'Engineering Workshop Practices',           type: 'Lab',       credits: 1, pdfFile: 'ENGINEERING-WORKSHOP-PRACTICES.pdf' },
    { code: 'EE191', name: 'Basic Electrical & Electronics Engg. Lab', type: 'Lab',       credits: 1, pdfFile: 'BASIC-ELECTRICAL-AND-ELECTRONICS-ENGINEERING-LAB.pdf' },
  ],
  'MECH-R22-2-1': [
    { code: 'ME301', name: 'Thermodynamics',                           type: 'Theory',    credits: 4, pdfFile: 'THERMODYNAMICS.pdf' },
    { code: 'ME302', name: 'Strength of Materials',                    type: 'Theory',    credits: 4, pdfFile: 'STRENGTH-OF-MATERIALS.pdf' },
    { code: 'ME303', name: 'Material Science & Metallurgy',            type: 'Theory',    credits: 3, pdfFile: 'MATERIAL-SCIENCE-AND-METALLURGY.pdf' },
    { code: 'MA301', name: 'Probability Statistics & Complex Analysis',type: 'Theory',    credits: 4, pdfFile: 'PROBABILITY-STATISTICS-AND-COMPLEX-ANALYSIS.pdf' },
    { code: 'ME391', name: 'Manufacturing Processes Lab',              type: 'Lab',       credits: 1, pdfFile: 'MANUFACTURING-PROCESSES-LAB.pdf' },
    { code: 'ME392', name: 'Strength of Materials & Metallurgy Lab',   type: 'Lab',       credits: 1, pdfFile: 'STRENGTH-OF-MATERIALS-AND-MATERIAL-SCIENCE-AND-METALLURGY-LAB.pdf' },
  ],
  'MECH-R22-2-2': [
    { code: 'ME401', name: 'Fluid Mechanics & Hydraulic Machines',     type: 'Theory',    credits: 4, pdfFile: 'FLUID-MECHANICS-AND-HYDRAULIC-MACHINES.pdf' },
    { code: 'ME402', name: 'Theory of Machines – I',                   type: 'Theory',    credits: 4, pdfFile: 'THEORY-OF-MACHINES--I.pdf' },
    { code: 'ME403', name: 'Design of Machine Elements',               type: 'Theory',    credits: 3, pdfFile: 'DESIGN-OF--MACHINE-ELEMENTS.pdf' },
    { code: 'MC401', name: 'Business Economics & Financial Analysis',  type: 'Mandatory', credits: 2, pdfFile: 'BUSINESS_ECONOMICS_AND_FINANCIAL_ANALYSIS.pdf' },
    { code: 'ME491', name: 'Fluid Mechanics & Hydraulic Machines Lab', type: 'Lab',       credits: 1, pdfFile: 'FLUID-MECHANICS-AND-HYDRAULIC-MACHINES-LAB.pdf' },
    { code: 'ME492', name: 'CAD Lab',                                  type: 'Lab',       credits: 1, pdfFile: 'CAD_LAB.pdf' },
  ],
  'MECH-R22-3-1': [
    { code: 'ME501', name: 'Thermal Engineering – I',                  type: 'Theory',    credits: 4, pdfFile: 'THERMAL-ENGINEERING--I.pdf' },
    { code: 'ME502', name: 'Theory of Machines – II',                  type: 'Theory',    credits: 4, pdfFile: 'THEORY_OF_MACHINES-II.pdf' },
    { code: 'ME503', name: 'Engineering Metrology & Instrumentation',  type: 'Theory',    credits: 3, pdfFile: 'ENGINEERING_METROLOGY_&_INSTRUMENTATION.pdf' },
    { code: 'ME591', name: 'Engineering Metrology & Instrumentation Lab', type: 'Lab',    credits: 1, pdfFile: 'ENGINEERING_METROLOGY_&_INSTRUMENTATION_LAB.pdf' },
    { code: 'ME592', name: 'Computer-Aided Machine Drawing Lab',       type: 'Lab',       credits: 1, pdfFile: 'COMPUTER-AIDED-MACHINE-DRAWING-LAB.pdf' },
  ],
  'MECH-R22-3-2': [
    { code: 'ME601', name: 'Thermal Engineering – II',                 type: 'Theory',    credits: 4, pdfFile: 'THERMAL_ENGINEERING-II.pdf' },
    { code: 'ME602', name: 'Machine Tools',                            type: 'Theory',    credits: 3, pdfFile: 'MACHINE_TOOLS.pdf' },
    { code: 'ME603', name: 'Finite Element Analysis',                  type: 'Theory',    credits: 3, pdfFile: 'FINITE_ELEMENT_ANALYSIS.pdf' },
    { code: 'ME691', name: 'Thermal Engineering Lab',                  type: 'Lab',       credits: 1, pdfFile: 'THERMAL_ENGINEERING_LAB.pdf' },
    { code: 'ME692', name: 'Machine Tools Lab',                        type: 'Lab',       credits: 1, pdfFile: 'MACHINE_TOOLS_LAB.pdf' },
  ],
  'MECH-R22-4-1': [
    { code: 'ME701', name: 'CADCAM',                                   type: 'Theory',    credits: 3, pdfFile: 'CADCAM.pdf' },
    { code: 'ME702', name: 'Heat Transfer',                            type: 'Theory',    credits: 4, pdfFile: 'HEAT_TRANSFER.pdf' },
    { code: 'ME703', name: 'Machine Design',                           type: 'Theory',    credits: 3, pdfFile: 'MACHINE_DESIGN.pdf' },
    { code: 'ME791', name: 'Heat Transfer Lab',                        type: 'Lab',       credits: 1, pdfFile: 'HEAT_TRANSFER_LAB.pdf' },
  ],

  // ════════════════════════════════════════════
  // AERO · R22  (sample subjects)
  // ════════════════════════════════════════════
  'AERO-R22-1-1': [
    { code: 'MA101', name: 'Linear Algebra & Calculus',                type: 'Theory',    credits: 4, pdfFile: 'LINEAR-ALGEBRA-&-CALCULUS.pdf' },
    { code: 'PH101', name: 'Applied Physics',                          type: 'Theory',    credits: 4, pdfFile: 'APPLIED-PHYSICS.pdf' },
    { code: 'CS101', name: 'Programming for Problem Solving',          type: 'Theory',    credits: 3, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING.pdf' },
    { code: 'ME101', name: 'Engineering Graphics',                     type: 'Theory',    credits: 3, pdfFile: 'ENGINEERING-GRAPHICS.pdf' },
    { code: 'EN101', name: 'English Language & Communication Skills',  type: 'Theory',    credits: 2, pdfFile: 'ENGLISH-LANGUAGE-AND-COMMUNICATION-SKILLS.pdf' },
    { code: 'CS191', name: 'Programming for Problem Solving Lab',      type: 'Lab',       credits: 1, pdfFile: 'PROGRAMMING-FOR-PROBLEM-SOLVING-LAB.pdf' },
    { code: 'PH191', name: 'Applied Physics Lab',                      type: 'Lab',       credits: 1, pdfFile: 'APPLIED-PHYSICS-LAB.pdf' },
  ],
  'AERO-R22-1-2': [
    { code: 'MA102', name: 'Numerical Methods & Integral Transforms',  type: 'Theory',    credits: 4, pdfFile: 'NUMERICAL-METHODS-AND-INTEGRAL-TRANSFORMS.pdf' },
    { code: 'CH101', name: 'Engineering Chemistry',                    type: 'Theory',    credits: 4 },
    { code: 'AE101', name: 'Engineering Mechanics',                    type: 'Theory',    credits: 3, pdfFile: 'ENGINEERING-MECHANICS.pdf' },
    { code: 'EE101', name: 'Basic Electrical & Electronics Engg.',     type: 'Theory',    credits: 3, pdfFile: 'BASIC-ELECTRICAL-AND-ELECTRONICS-ENGINEERING.pdf' },
    { code: 'AE191', name: 'Elements of Aeronautical Engineering Lab', type: 'Lab',       credits: 1, pdfFile: 'ELEMENTS-OF-AERONAUTICAL-ENGINEERING-LAB.pdf' },
    { code: 'EE191', name: 'Basic Electrical & Electronics Engg. Lab', type: 'Lab',       credits: 1, pdfFile: 'BASIC-ELECTRICAL-AND-ELECTRONICS-ENGINEERING-LAB.pdf' },
    { code: 'AE192', name: 'Engineering Workshop Practices',           type: 'Lab',       credits: 1, pdfFile: 'ENGINEERING-WORKSHOP-PRACTICES.pdf' },
  ],
  'AERO-R22-2-1': [
    { code: 'AE301', name: 'Aerospace Structures',                     type: 'Theory',    credits: 4, pdfFile: 'AEROSPACE-STRUCTURES.pdf' },
    { code: 'AE302', name: 'Aerodynamics',                             type: 'Theory',    credits: 4, pdfFile: 'AERODYNAMICS.pdf' },
    { code: 'AE303', name: 'Aero Thermodynamics',                      type: 'Theory',    credits: 3, pdfFile: 'AERO-THERMODYNAMICS.pdf' },
    { code: 'MA301', name: 'Probability, Statistics & Complex Analysis',type: 'Theory',   credits: 4, pdfFile: 'PROBABILITY,-STATISTICS-AND-COMPLEX.pdf' },
    { code: 'AE391', name: 'Solid Mechanics for Aeronautics Lab',      type: 'Lab',       credits: 1, pdfFile: 'SOLID-MECHANICS-FOR-AERONAUTICS-LAB.pdf' },
    { code: 'AE392', name: 'Aerodynamics Lab',                         type: 'Lab',       credits: 1, pdfFile: 'AERODYNAMICS-LAB.pdf' },
  ],
  'AERO-R22-2-2': [
    { code: 'AE401', name: 'Airplane Performance',                     type: 'Theory',    credits: 4, pdfFile: 'AIRPLANE-PERFORMANCE.pdf' },
    { code: 'AE402', name: 'Aerospace Propulsion',                     type: 'Theory',    credits: 4, pdfFile: 'AEROSPACE-PROPULSION.pdf' },
    { code: 'AE403', name: 'Aircraft Stability & Control',             type: 'Theory',    credits: 3, pdfFile: 'AIRCRAFT-STABILITY-AND-CONTROL.pdf' },
    { code: 'AE491', name: 'Aerospace Structures Lab',                 type: 'Lab',       credits: 1, pdfFile: 'AEROSPACE-STRUCTURES-LAB.pdf' },
    { code: 'CS491', name: 'Python Computing Lab',                     type: 'Lab',       credits: 1, pdfFile: 'PYTHON-COMPUTING-LAB.pdf' },
    { code: 'MC401', name: 'Environmental Science',                    type: 'Mandatory', credits: 0, pdfFile: 'ENVIRONMENTAL-SCIENCE.pdf' },
  ],
  'AERO-R22-3-1': [
    { code: 'AE501', name: 'Computational Fluid Dynamics',             type: 'Theory',    credits: 4, pdfFile: 'COMPUTATIONAL-FLUID-DYNAMICS.pdf' },
    { code: 'AE502', name: 'Avionics',                                 type: 'Theory',    credits: 3, pdfFile: 'AVIONICS.pdf' },
    { code: 'AE503', name: 'Aircraft Production Technology',           type: 'Theory',    credits: 3, pdfFile: 'AIRCRAFT-PRODUCTION-TECHNOLOGY.pdf' },
    { code: 'AE591', name: 'Computational Fluid Dynamics Lab',         type: 'Lab',       credits: 1, pdfFile: 'COMPUTATIONAL-FLUID-DYNAMICS-LAB.pdf' },
    { code: 'AE592', name: 'Aircraft Production Technology Lab',       type: 'Lab',       credits: 1, pdfFile: 'AIRCRAFT-PRODUCTION-TECHNOLOGY-LAB.pdf' },
    { code: 'CS591', name: 'IoT Lab',                                  type: 'Lab',       credits: 1, pdfFile: 'IOT-LAB.pdf' },
  ],
  'AERO-R22-3-2': [
    { code: 'AE601', name: 'Finite Element Analysis',                  type: 'Theory',    credits: 3, pdfFile: 'FINITE-ELEMENT-ANALYSIS.pdf' },
    { code: 'AE602', name: 'UAV Design',                               type: 'Theory',    credits: 3, pdfFile: 'UAV-DESIGN.pdf' },
    { code: 'AE603', name: 'Advanced Propulsion',                      type: 'Theory',    credits: 3, pdfFile: 'ADVANCED-PROPULSION.pdf' },
    { code: 'AE691', name: 'UAV Design Lab',                           type: 'Lab',       credits: 1, pdfFile: 'UAV-DESIGN-LAB.pdf' },
    { code: 'AE692', name: 'Computational Structural Analysis Lab',    type: 'Lab',       credits: 1, pdfFile: 'COMPUTATIONAL-STRUCTURAL-ANALYSIS-LAB.pdf' },
  ],
};

// ─────────────────────────────────────────────
// Generic subject scaffolding for combos without specific data
// ─────────────────────────────────────────────
function genericSubjects(branch: Branch, year: Year, sem: Sem): Subject[] {
  const semNum = (year - 1) * 2 + sem;
  return [
    { code: `MA${semNum}01`, name: 'Mathematics',                      type: 'Theory',    credits: 4 },
    { code: `PC${semNum}01`, name: `${branch} Core Subject I`,         type: 'Theory',    credits: 3 },
    { code: `PC${semNum}02`, name: `${branch} Core Subject II`,        type: 'Theory',    credits: 3 },
    { code: `PE${semNum}01`, name: 'Professional Elective',            type: 'Elective',  credits: 3 },
    { code: `LB${semNum}01`, name: 'Core Laboratory I',                type: 'Lab',       credits: 1 },
    { code: `LB${semNum}02`, name: 'Core Laboratory II',               type: 'Lab',       credits: 1 },
  ];
}

// ─────────────────────────────────────────────
// Nav items
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'selector', label: 'Select Course' },
  { id: 'results',  label: 'Subjects'      },
];

// ─────────────────────────────────────────────
// Design helpers
// ─────────────────────────────────────────────
const typeColors: Record<Subject['type'], string> = {
  Theory:    'bg-green-50 border-green-200 text-secondary',
  Lab:       'bg-blue-50 border-blue-200 text-blue-700',
  Elective:  'bg-orange-50 border-orange-200 text-primary',
  Mandatory: 'bg-neutral-100 border-neutral-200 text-neutral-600',
};

const YEAR_LABELS: Record<Year, string> = { 1: 'I Year', 2: 'II Year', 3: 'III Year', 4: 'IV Year' };
const BRANCHES: Branch[] = ['CSE', 'AIML', 'ECE', 'EEE', 'MECH', 'AERO', 'IT', 'CSE-CS', 'CSE-DS', 'CSIT'];

// ─────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────
export default function SyllabusPage() {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [reg, setReg]       = useState<Regulation | null>(null);
  const [year, setYear]     = useState<Year | null>(null);
  const [sem, setSem]       = useState<Sem | null>(null);

  // Reset downstream when upstream changes
  const handleBranch = (b: Branch) => {
    setBranch(b);
    const regs = BRANCH_REGS[b];
    if (reg && !regs.includes(reg)) setReg(null);
    setYear(null);
    setSem(null);
  };
  const handleReg = (r: Regulation) => { setReg(r); setYear(null); setSem(null); };
  const handleYear = (y: Year)       => { setYear(y); setSem(null); };

  const availableRegs = branch ? BRANCH_REGS[branch] : [];

  const subjects = useMemo<Subject[]>(() => {
    if (!branch || !reg || !year || !sem) return [];
    const key: SubjectKey = `${branch}-${reg}-${year}-${sem}`;
    return SUBJECTS[key] ?? genericSubjects(branch, year, sem);
  }, [branch, reg, year, sem]);

  const pdfBase = branch && reg ? subjectPdfBase(branch, reg) : null;
  const bulk    = branch && reg ? bulkPdf(branch, reg)        : null;

  const hasResults = branch && reg && year && sem;

  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Syllabus"
        italic="explorer."
        dek="Browse and download the complete syllabus for your branch, regulation, year and semester."
        crumbs={[
          { label: 'Home',         href: '/' },
          { label: 'Examinations', href: '/examinations' },
          { label: 'Syllabus' },
        ]}
        variant="green"
      />

      <div className="lg:flex items-start bg-white">
        {/* Side nav */}
        <aside className="hidden lg:block lg:w-56 shrink-0 sticky top-28 pt-12 pl-6">
          <SideQuickNav items={NAV_ITEMS} />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 py-16 md:py-24 px-6 md:px-12 lg:px-16">

          {/* ── Selector section ── */}
          <section id="selector">
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              Step 1 of 4
            </span>
            <h2 className="mt-2 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
              Select your <span className="font-display italic font-medium text-secondary">course.</span>
            </h2>
            <p className="mt-2 text-muted text-[0.95rem]">
              Choose your branch, regulation, year and semester to view subjects.
            </p>

            <div className="mt-10 space-y-9">

              {/* Branch */}
              <div>
                <p className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted mb-3">
                  Branch
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {BRANCHES.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleBranch(b)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition-all duration-200 ${
                        branch === b
                          ? 'bg-secondary text-white border-secondary shadow-secondary-glow scale-105'
                          : 'bg-white border-border text-foreground hover:border-secondary hover:text-secondary'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regulation */}
              {branch && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted mb-3">
                    Regulation
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {availableRegs.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleReg(r)}
                        className={`px-4 py-2 rounded-full border text-sm font-bold transition-all duration-200 ${
                          reg === r
                            ? 'bg-primary text-white border-primary shadow-primary-glow scale-105'
                            : 'bg-white border-border text-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Year */}
              {reg && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted mb-3">
                    Year
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {([1, 2, 3, 4] as Year[]).map((y) => (
                      <button
                        key={y}
                        onClick={() => handleYear(y)}
                        className={`px-5 py-2 rounded-full border text-sm font-bold transition-all duration-200 ${
                          year === y
                            ? 'bg-secondary text-white border-secondary shadow-secondary-glow scale-105'
                            : 'bg-white border-border text-foreground hover:border-secondary hover:text-secondary'
                        }`}
                      >
                        {YEAR_LABELS[y]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Semester */}
              {year && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-muted mb-3">
                    Semester
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {([1, 2] as Sem[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSem(s)}
                        className={`px-5 py-2 rounded-full border text-sm font-bold transition-all duration-200 ${
                          sem === s
                            ? 'bg-primary text-white border-primary shadow-primary-glow scale-105'
                            : 'bg-white border-border text-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        Sem {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Divider ── */}
          <div className={`my-14 h-px bg-border transition-opacity duration-500 ${hasResults ? 'opacity-100' : 'opacity-0'}`} />

          {/* ── Results section ── */}
          {hasResults && (
            <section
              id="results"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 justify-between mb-8">
                <div>
                  <span className="font-mono text-[0.68rem] font-bold tracking-[0.18em] uppercase text-secondary">
                    {branch} · {reg} · {YEAR_LABELS[year!]} · Sem {sem}
                  </span>
                  <h2 className="mt-1 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.4rem,2.5vw,2rem)] leading-tight">
                    {subjects.length} Subject{subjects.length !== 1 ? 's' : ''}
                    <span className="font-display italic font-medium text-secondary ml-2">listed.</span>
                  </h2>
                </div>

                {/* Bulk download */}
                {bulk && (
                  <a
                    href={bulk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-[0.84rem] hover:bg-secondary-hover transition-all shadow-secondary-glow hover:scale-105 whitespace-nowrap"
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                      <path d="M7.5 2v8M4.5 8l3 3 3-3M2 13h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download Full Syllabus PDF
                  </a>
                )}
              </div>

              {/* Subject grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => {
                  const pdfHref = subject.pdfFile && pdfBase
                    ? `${pdfBase}/${subject.pdfFile}`
                    : bulk ?? '#';

                  return (
                    <div
                      key={subject.code}
                      className="group flex flex-col gap-4 rounded-2xl border-2 border-border bg-white p-6 hover:border-secondary hover:-translate-y-0.5 hover:shadow-card-soft transition-all duration-200"
                    >
                      {/* Type badge + credits */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[0.6rem] font-mono font-bold tracking-widest uppercase ${typeColors[subject.type]}`}
                        >
                          {subject.type}
                        </span>
                        {subject.credits > 0 && (
                          <span className="font-mono text-[0.65rem] text-muted font-bold tracking-wide">
                            {subject.credits} CR
                          </span>
                        )}
                      </div>

                      {/* Subject name & code */}
                      <div className="flex-1">
                        <p className="font-mono text-[0.7rem] text-muted tracking-wide uppercase mb-1">
                          {subject.code}
                        </p>
                        <h3 className="font-sans font-extrabold text-foreground text-[0.97rem] leading-snug group-hover:text-secondary transition-colors">
                          {subject.name}
                        </h3>
                      </div>

                      {/* Download button */}
                      <a
                        href={pdfHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-green-50 border border-green-200 text-secondary font-bold text-[0.78rem] hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-200"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path d="M6 1.5v6M3.5 6l2.5 2.5L8.5 6M1.5 10.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download PDF
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Credit summary */}
              <div className="mt-8 p-5 rounded-xl border border-border bg-warm-light flex flex-wrap gap-6">
                <div>
                  <p className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted">Total Subjects</p>
                  <p className="font-sans font-black text-foreground text-xl mt-0.5">{subjects.length}</p>
                </div>
                <div>
                  <p className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted">Total Credits</p>
                  <p className="font-sans font-black text-foreground text-xl mt-0.5">
                    {subjects.reduce((acc, s) => acc + s.credits, 0)}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted">Theory</p>
                  <p className="font-sans font-black text-foreground text-xl mt-0.5">
                    {subjects.filter(s => s.type === 'Theory').length}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted">Labs</p>
                  <p className="font-sans font-black text-foreground text-xl mt-0.5">
                    {subjects.filter(s => s.type === 'Lab').length}
                  </p>
                </div>
                {subjects.some(s => s.type === 'Elective') && (
                  <div>
                    <p className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-muted">Electives</p>
                    <p className="font-sans font-black text-foreground text-xl mt-0.5">
                      {subjects.filter(s => s.type === 'Elective').length}
                    </p>
                  </div>
                )}
              </div>

              {/* Info note */}
              <div className="mt-4 p-4 rounded-xl border border-border bg-white flex items-start gap-3">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-secondary shrink-0 mt-0.5" aria-hidden>
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M7.5 6.5v4M7.5 4.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <p className="text-muted text-[0.84rem] leading-relaxed">
                  Individual PDFs are available where listed. For subjects showing a bulk download link, refer to the{' '}
                  <a href={bulk ?? '#'} target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline">
                    full {branch} {reg} syllabus PDF
                  </a>.
                  Contact the{' '}
                  <a href="/examinations" className="text-secondary font-semibold hover:underline">Examinations Office</a>{' '}
                  for any queries.
                </p>
              </div>
            </section>
          )}

          {/* Empty state — nothing selected yet */}
          {!hasResults && (
            <div className="mt-8 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-2xl bg-warm-light/40">
              <div className="w-16 h-16 rounded-2xl bg-white border border-border flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-muted" aria-hidden>
                  <path d="M5 4h18a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M9 10h10M9 14h10M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="font-sans font-extrabold text-foreground text-[1.05rem]">No syllabus selected</p>
              <p className="text-muted text-[0.88rem] mt-1.5 max-w-[340px] leading-relaxed">
                Use the selectors above to pick your branch, regulation, year and semester to view subject cards.
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
