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
const VERIFIED = '2026-07-17';

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
    driverName: 'Laxma Reddy',
    driverContact: '9701788665',
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
    inchargeName: 'Dr. P. Yakaiah',
    inchargeContact: '9885010188',
    driverName: 'Venkatesh',
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
    inchargeName: 'Mr. Shivaraj',
    inchargeContact: '9951781050',
    driverName: 'Md. Ghouse',
    driverContact: '9866130703',
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
    inchargeName: 'Mr. B. Varija',
    inchargeContact: '9603367599',
    driverName: 'Md. Maqbul',
    driverContact: '9177410056',
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
    inchargeName: 'Mr. Narendar Rao',
    inchargeContact: '7981499483',
    driverName: 'Rehmath',
    driverContact: '9704209280',
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
    inchargeName: 'Mrs. Lakshmi',
    inchargeContact: '9550433259',
    driverName: 'Baba Fakruddin',
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
    inchargeName: 'Mr. Barath',
    inchargeContact: '7799647909',
    driverName: 'Shekar',
    driverContact: '9989867433',
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
    inchargeName: 'Mrs. Zohanna',
    inchargeContact: '7842793307',
    driverName: 'Shankar Naik',
    driverContact: '9603710075',
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
    inchargeName: 'Mrs. Vineasha',
    inchargeContact: '9493581102',
    driverName: 'Parameshwar Rao',
    driverContact: '7382821303',
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
    inchargeName: 'A. Shilpa',
    inchargeContact: '9160767550',
    driverName: 'Krishna',
    driverContact: '6303268173',
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
    driverName: 'Srishailam',
    driverContact: '8247598910',
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
    inchargeName: 'Mr. A. Sai Kumar',
    inchargeContact: '7893974728',
    driverName: 'Mosinuddin',
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
    inchargeName: 'Mrs. Vijaya Sree',
    inchargeContact: '6300807575',
    driverName: 'Saidulu',
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
    inchargeName: 'Mr. Pradeep Kumar',
    inchargeContact: '9703995722',
    driverName: 'Sridhar Goud',
    driverContact: '7671812530',
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
    inchargeName: 'Ms. Alankruthi',
    inchargeContact: '9704855040',
    driverName: 'Raghu',
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
    inchargeName: 'Mrs. Durga Bhavani',
    inchargeContact: '9912965806',
    driverName: 'Rama Krishna',
    driverContact: '9550584271',
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
    inchargeName: 'Mr. Parsha Ramu',
    inchargeContact: '9000444614',
    driverName: 'Sudhakar',
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
    inchargeName: 'Mrs. Nagamani',
    inchargeContact: '9676837194',
    driverName: 'Mahendar',
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
    inchargeName: 'Dr. Jyothi',
    inchargeContact: '8106256781',
    driverName: 'Suresh',
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
    inchargeContact: '9570412588',
    driverName: 'Shankar',
    driverContact: '7801068145',
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
    inchargeName: 'Mrs. Shruthi Patel',
    inchargeContact: '9886338486',
    driverName: 'Lakki Ram',
    driverContact: '9912939397',
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
    inchargeName: 'Mr. CH. Babaiah',
    inchargeContact: '9705631211',
    driverName: 'Chakrapani',
    driverContact: '9010323344',
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
    inchargeName: 'Mr. Hanmandulu',
    inchargeContact: '9160404652',
    driverName: 'Chari',
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
    inchargeName: 'Mr. Gopal Krishna',
    inchargeContact: '9390025850',
    driverName: 'Krishna Reddy',
    driverContact: '9849104426',
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
    inchargeName: 'Mrs. Usharani',
    inchargeContact: '9063226274',
    driverName: 'Mallesh',
    driverContact: '7382817336',
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
    inchargeName: 'Mr. Krishnudu',
    inchargeContact: '9701140893',
    driverName: 'Vittal',
    driverContact: '7661020931',
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
    inchargeName: 'Mrs. Nirisha',
    inchargeContact: '8019191471',
    driverName: 'Chandram',
    driverContact: '9000494401',
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
