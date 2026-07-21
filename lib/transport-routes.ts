/**
 * MLRIT Bus Route Data — Official Source
 *
 * Source: https://mlrit.ac.in/campus-life/transport-facility/
 * Last verified: 2026-07-17
 *
 * All 27 routes with official bus incharge and driver details.
 */

export interface BusRoute {
  id: string;
  routeNumber: number;
  stops: string[];
  inchargeName: string;
  inchargeContact: string;
  driverName: string;
  driverContact: string;
  source: string;
  lastVerified: string;
}

const SOURCE = 'https://mlrit.ac.in/campus-life/transport-facility/';
const VERIFIED = '2026-07-20';

export const BUS_ROUTES: BusRoute[] = [
  {
    id: 'route-1',
    routeNumber: 1,
    stops: [
      'L.B. Nagar Ring Road', 'Kothapet', 'Fruit Market', 'Dilsukhnagar',
      'TV Tower', 'Amberpet', 'Shivam Road', 'Vidyanagar', 'RTC X Roads',
      'Musheerabad', 'Chilakalaguda X Road', 'JBS', 'Diamond Point',
      'Sowjanya Colony', 'MMR Gardens', 'Dhulapally', 'Suchitra', 'MLRIT',
    ],
    inchargeName: 'Mr. O. Venkanna',
    inchargeContact: '9177323882',
    driverName: 'Mr. Padmaiah',
    driverContact: '9666434106',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-2',
    routeNumber: 2,
    stops: [
      'BN Reddy Nagar', 'NGOs Colony', 'Vanasthalipuram', 'L B Nagar',
      'Nagole', 'Uppal X Road', 'Habsiguda', 'Tarnaka', 'NIN', 'Sangeeth',
      'JBS', 'Vikrampuri', 'Tirumalgiri', 'Dairy Farm', 'Suchitra',
      'Pet Basheerabad', 'Kompally', 'MLRIT',
    ],
    inchargeName: 'Mr. K. Pitamber',
    inchargeContact: '9490967918',
    driverName: 'Mr. Venkatesh',
    driverContact: '9951926864',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-3',
    routeNumber: 3,
    stops: [
      'Sangareddy Old Bus Stop', 'Sangareddy New Bus Stop', 'Collector Office',
      'Kowlampet', 'Rudraram', 'Isnapur', 'Muthangi', 'MLRIT',
    ],
    inchargeName: 'Mr. Shiva raj',
    inchargeContact: '9951781050',
    driverName: 'Mr. Raheem',
    driverContact: '9030347995',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-4',
    routeNumber: 4,
    stops: [
      'Attapur', 'Ring Road', 'Rethibowli', 'Mehdipatnam', 'NMDC',
      'Mahaveer', 'Lakdikapool', 'Khairathabad', 'Punjagutta', 'Ameerpet',
      'Mythrivanam', 'SR Nagar', 'Erragadda', 'Bharat Nagar', 'JNTU',
      'HMT Hills', 'Pragathi Nagar', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mr. B. Kiran Kumar',
    inchargeContact: '9393353556',
    driverName: 'Mr. MD Miskin',
    driverContact: '9346803078',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-5',
    routeNumber: 5,
    stops: [
      'Zoo Park', 'City College', 'Goshamahal', 'Moazzam Jahi Market',
      'Public Gardens', 'Tankbund', 'Ranigunj', 'Begumpet', 'HPS',
      'Greenlands', 'Dharmakaram', 'Balkampet', 'Fathenagar',
      'Balanagar X Road', 'Chintal', 'Shahpur', 'Suraram', 'MLRIT',
    ],
    inchargeName: 'Ms. Lakshmi Prasanna',
    inchargeContact: '9160848766',
    driverName: 'Mr. Rahamath',
    driverContact: '9381523389',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-6',
    routeNumber: 6,
    stops: [
      'Borabanda', 'Moti Nagar', 'Rahmatnagar', 'Yousufguda Check Post',
      'Krishnakanth Park', 'AG Quarters', 'ESI', 'Moosapet', 'Y Junction',
      'KPHB', 'Pragathi Nagar', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mr. Naveen',
    inchargeContact: '7993048581',
    driverName: 'Mr. Babumia',
    driverContact: '9603968020',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-7',
    routeNumber: 7,
    stops: [
      'Malkajgiri', 'Anutex', 'Anand Bagh', 'Neredmet', 'CDMA',
      'Alwal', 'Suchitra', 'Kompally', 'Gundlapochampally', 'MLRIT',
    ],
    inchargeName: 'Mr. Naveen',
    inchargeContact: '9989241230',
    driverName: 'Mr. Pentaiah',
    driverContact: '8008890838',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-8',
    routeNumber: 8,
    stops: [
      'Sagar Ring Road', 'IS Sadan', 'Govt Press', 'Malakpet',
      'Chanderghat', 'Kachiguda', 'YMC', 'Narayanaguda X Road',
      'Chikkadpally', 'RTC X Roads', 'Indira Park', 'Lowe Tank Bund',
      'Ranigunj', 'Paradise', 'Tadbund', 'Bowenpally', 'Dairy Farm',
      'Suchitra', 'Pet Basheerabad', 'Dhulapally', 'Kompally',
      'Gundlapochampally', 'MLRIT',
    ],
    inchargeName: 'Mrs. P. Zohanna',
    inchargeContact: '7842793307',
    driverName: 'Mr. Sreenivasa Reddy',
    driverContact: '9550411539',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-9',
    routeNumber: 9,
    stops: [
      'Image Hospital Hitech City', 'Shilparamam', 'Hitech City',
      'Malaysian Township', 'KPHB Temple Bus Stop', 'KPHB Main Road (Remedy)',
      'JNTUH', 'HMT Hills', 'Pragathi Nagar', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Ms. Vineesha',
    inchargeContact: '9493581102',
    driverName: 'Mr. Parmeshwar Rao',
    driverContact: '7671982513',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-10',
    routeNumber: 10,
    stops: [
      'Kukatpally', 'Vivekananda Nagar', 'Allwyn Colony', 'Jagadgirigutta',
      'Gajularamaram', 'Shapur X Road', 'Jeedimetla', 'Suraram',
      'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Ms. A. Shilpa',
    inchargeContact: '9160767550',
    driverName: 'Mr. Sridhar',
    driverContact: '8179182892',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-11',
    routeNumber: 11,
    stops: [
      'BHEL Old LIG', 'BHEL New MIG', 'BHEL Kaman', 'Madinaguda',
      'Allwyn Colony', 'Miyapur', 'Miyapur X Roads', 'Bollaram',
      'Bachupally', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mr. M. Thirupalaiah',
    inchargeContact: '9959910282',
    driverName: 'Mr. Chandraiah',
    driverContact: '9701334868',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-12',
    routeNumber: 12,
    stops: [
      'Rampally X Roads', 'Nagaram', 'Dammaiguda', 'Saket', 'Kapra',
      'Radhika Theatre', 'Neredmet X Road', 'Lal Bazar', 'Lothkunta',
      'Lakadawla', 'Risala Bazar', 'Bollaram', 'Kompally', 'MLRIT',
    ],
    inchargeName: 'Mr. Srinivas',
    inchargeContact: '8008196123',
    driverName: 'Mr. Mosin',
    driverContact: '9502193525',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-13',
    routeNumber: 13,
    stops: [
      'Kukatpally Metro', 'KPHB', 'JNTU', 'Pragathi Nagar', 'MLRIT',
    ],
    inchargeName: 'Ms. N. Vijayasri',
    inchargeContact: '6300867575',
    driverName: 'Mr. Saidulu',
    driverContact: '8886871545',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-14',
    routeNumber: 14,
    stops: [
      'Kukatpally', 'Vivekananda Nagar', 'Reliance Park', 'Nizampet X Road',
      'Sangamithra', 'Nizampet Village', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mr. J. Pradeep Kumar',
    inchargeContact: '8309884369',
    driverName: 'Mr. Kishan Rao',
    driverContact: '9390102882',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-15',
    routeNumber: 15,
    stops: [
      'Gachibowli', 'AMB Mall', 'Kondapur', 'Allwyn Colony', 'Miyapur',
      'Miyapur X Roads', 'Miyapur HDFC', 'Bollaram', 'Chaitanya College',
      'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mrs. S. Parvathi',
    inchargeContact: '8897052582',
    driverName: 'Mr. Raghu',
    driverContact: '9959279700',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-16',
    routeNumber: 16,
    stops: [
      'Kukatpally Metro', 'Kukatpally', 'Vivekananda Nagar Main Road',
      'KPHB Road No.1', 'Sri Chaitanya College KPHB', 'JNTUH',
      'Nizampet X Road', 'Sangamithra', 'Nizampet Village',
      'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mrs. Madhuri Reddy',
    inchargeContact: '8008741831',
    driverName: 'Mr. Ramdas',
    driverContact: '9908019756',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-17',
    routeNumber: 17,
    stops: [
      'Boduppla', 'Uppal', 'Habsiguda', 'Tarnaka', 'NIN',
      'Chilkalaguda X Roads', 'Sangeetha', 'Patny', 'Tadbund',
      'New Bowenpally', 'Ferozguda', 'Balanagar BBR Hospital', 'HAL',
      'IDPL', 'Ganesh Nagar (Sha Theatre)', 'Jeedimetla', 'MLRIT',
    ],
    inchargeName: 'Mr. R. Madhu',
    inchargeContact: '9701140893',
    driverName: 'Mr. Sudhakar Rao',
    driverContact: '9640113978',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-18',
    routeNumber: 18,
    stops: [
      'Beeramguda Kaman', 'Lingampally', 'Chandanagar', 'Gangaram',
      'Madinaguda', 'Miyapur', 'Hydernagar', 'JNTU', 'HMT Hills',
      'Pragathi Nagar', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Ms. Nagamani',
    inchargeContact: '9676837194',
    driverName: 'Mr. Mahender Reddy',
    driverContact: '9948382042',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-19',
    routeNumber: 19,
    stops: [
      'KPHB Temple Bus Stop', 'KPHB Main Road (Remedy)',
      'South India Shopping Mall', 'Mahadevpuram', 'Gajularamaram',
      'Shapur', 'Suraram', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Ms. V. Divya',
    inchargeContact: '8523875394',
    driverName: 'Mr. Suresh',
    driverContact: '7032122001',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-20',
    routeNumber: 20,
    stops: [
      'Lingampally', 'Chandanagar', 'Gangaram', 'HUDA Colony',
      'Miyapur HDFC', 'Bollaram', 'Chaitanya College', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mr. P. Srinivas Reddy',
    inchargeContact: '9704132588',
    driverName: 'Mr. Shiva',
    driverContact: '9440123727',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-21',
    routeNumber: 21,
    stops: [
      'AG Quarters', 'ESI', 'Bharat Nagar', 'Moosapet', 'Kukatpally',
      'Vivekananda Nagar Main Road', 'JNTUH', 'HMT Hills',
      'Pragathi Nagar Bus Stop', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Ms. Laxmi Shilpa',
    inchargeContact: '9390143745',
    driverName: 'Mr. KR Reddy',
    driverContact: '7382817402',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-22',
    routeNumber: 22,
    stops: [
      'IDPL', 'Ganesh Nagar (Sha Theater)', 'Jeedimetla',
      'Suraram', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Dr. Jostna Kumar G',
    inchargeContact: '9440037697',
    driverName: 'Mr. Chakrapani',
    driverContact: '7382817451',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-23',
    routeNumber: 23,
    stops: [
      'Vivekananda Nagar', 'Allwyn Colony', 'Jagadgirigutta',
      'Asbestos Colony Kaman', 'Gandhi Nagar', 'Chintal',
      'Shahpur', 'Suraram', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Ms. Y. Geetha',
    inchargeContact: '9032546457',
    driverName: 'Mr. Chary',
    driverContact: '9640042748',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-24',
    routeNumber: 24,
    stops: [
      'Patancheru', 'RC Puram', 'Beeramguda Kaman', 'Ashoknagar',
      'Lingampally', 'Chandanagar', 'Gangaram', 'HUDA Colony',
      'Miyapur HDFC', 'Bollaram', 'Chaitanya College', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mrs. D. Jeevitha',
    inchargeContact: '7673946498',
    driverName: 'Mr. Durgesh',
    driverContact: '8143662483',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-25',
    routeNumber: 25,
    stops: [
      'New Bowenpally', 'Ferozguda', 'Balanagar BBR Hospital', 'HAL',
      'IDPL', 'Ganesh Nagar (Sha Theatre)', 'Jeedimetla',
      'Suraram', 'Gandimaisamma', 'MLRIT',
    ],
    inchargeName: 'Mrs. Babaiah',
    inchargeContact: '9705631211',
    driverName: 'Mr. Shyam',
    driverContact: '9010087009',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-26',
    routeNumber: 26,
    stops: [
      'Sangareddy X Roads', 'Rudraram', 'Isnapur', 'Muthangi',
      'Beeramguda Market', 'Vijetha Super Market', 'Raghavendra Colony',
      'BSR Colony', 'Krishnareddypeta', 'Sultanpur Ring Road',
      'Shambirpur', 'MLRIT',
    ],
    inchargeName: 'Mr. Anwar Ali',
    inchargeContact: '9490704264',
    driverName: 'Mr. Md. Gouse Pasha',
    driverContact: '9866130703',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
  {
    id: 'route-27',
    routeNumber: 27,
    stops: [
      'Lothkunta', 'Alwal', 'Suchitra', 'Pet Basheerabad',
      'Dhulapally', 'Kompally', 'Gundlapochampally', 'MLRIT',
    ],
    inchargeName: 'Ms. Nireesha',
    inchargeContact: '6300446863',
    driverName: 'Mr. Ismail',
    driverContact: '9705224260',
    source: SOURCE,
    lastVerified: VERIFIED,
  },
];

export function searchRoutes(query: string): BusRoute[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return BUS_ROUTES;
  return BUS_ROUTES.filter((r) => {
    if (r.routeNumber.toString().includes(q)) return true;
    if (r.driverName.toLowerCase().includes(q)) return true;
    if (r.inchargeName.toLowerCase().includes(q)) return true;
    return r.stops.some((s) => s.toLowerCase().includes(q));
  });
}
