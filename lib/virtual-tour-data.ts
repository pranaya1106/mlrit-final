export type VirtualTourCategory =
  | 'campus'
  | 'departments'
  | 'sports-events'
  | 'facilities'
  | 'student-spaces';

export interface VirtualTourLocation {
  id: string;
  title: string;
  category: VirtualTourCategory;
  embedUrl: string;
  iframeTitle: string;
  allowFullScreen: boolean;
}

export const VIRTUAL_TOUR_CATEGORIES: {
  id: VirtualTourCategory;
  label: string;
}[] = [
  { id: 'campus',         label: 'Campus' },
  { id: 'departments',    label: 'Departments' },
  { id: 'sports-events',  label: 'Sports & Events' },
  { id: 'facilities',     label: 'Facilities' },
  { id: 'student-spaces', label: 'Student Spaces' },
];

export const VIRTUAL_TOUR_LOCATIONS: VirtualTourLocation[] = [
  // ── Campus Tour ──────────────────────────────────────────────────────────
  {
    id: 'campus-main-block',
    title: 'Main Block',
    category: 'campus',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665325084925!6m8!1m7!1sCAoSLEFGMVFpcE9EWFlEMTNqYXYyZ1lvR1RGdUhJaFhuQUp1SmJ0dk9SUW9HcGtt!2m2!1d17.594524910812!2d78.44135726940141!3f111.84743!4f-4.22578!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Main Block',
    allowFullScreen: true,
  },
  {
    id: 'campus-director-chamber',
    title: 'Director & Principal Chamber',
    category: 'campus',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366665437!6m8!1m7!1sCAoSLEFGMVFpcE5ZbC1xQXl5amJaUUFCN3VkQmtXbTh2aEgtMGJPTUZGU1prNUN3!2m2!1d17.59447927926697!2d78.44139867841977!3f109.839645!4f-5.861469999999997!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Director & Principal Chamber',
    allowFullScreen: true,
  },
  {
    id: 'campus-admin-office',
    title: 'Administrative Office',
    category: 'campus',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366412037!6m8!1m7!1sCAoSLEFGMVFpcE5rRjYyTTdjNlNmZjdmV0tCaExhR0J6dWN2V0VUUm5QdjV6RnBC!2m2!1d17.59455368866001!2d78.44143184020649!3f111.44516!4f3.3629459999999938!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Administrative Office',
    allowFullScreen: true,
  },
  {
    id: 'campus-conference-room',
    title: 'Conference Room',
    category: 'campus',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366551100!6m8!1m7!1sCAoSLEFGMVFpcE0wak1uRkxrN1Y5eFpMY1Q4enNwNjhISS1BTUhHMUJVclpndW9h!2m2!1d17.59445822601202!2d78.44145436883561!3f18.644022!4f-11.184359999999998!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Conference Room',
    allowFullScreen: true,
  },
  {
    id: 'campus-innovation-cell',
    title: 'Center of Innovation & Entrepreneurship Cell',
    category: 'campus',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367855272!6m8!1m7!1sCAoSLEFGMVFpcE5KcDAxakQweG1uQkhKQ2J0LWVOM2hqVzByd1J3VkxRMW53dzc0!2m2!1d17.59441819442004!2d78.44118758732753!3f3.293519!4f-3.2401200000000046!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Center of Innovation & Entrepreneurship Cell',
    allowFullScreen: true,
  },
  {
    id: 'campus-career-center',
    title: 'Career Development Center',
    category: 'campus',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368386194!6m8!1m7!1sCAoSLEFGMVFpcFA3NVlweXpDRURTNFI4MzBkVzFuM184WWw0YURtNC1BT3ZocU5m!2m2!1d17.59444638958327!2d78.44118133221974!3f248.3611!4f-4.018529999999998!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Career Development Center',
    allowFullScreen: true,
  },
  {
    id: 'campus-crt-block',
    title: 'Campus Recruitment & Training Block',
    category: 'campus',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368191990!6m8!1m7!1sCAoSLEFGMVFpcE85YmRVZngyQTlaSG1HOUxXeXA0RWg4TmF5SzkyQ0tENi1EaV9f!2m2!1d17.59441861650087!2d78.44118396537621!3f106.78493!4f-2.267089999999996!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Campus Recruitment & Training Block',
    allowFullScreen: true,
  },

  // ── Department Tour ───────────────────────────────────────────────────────
  {
    id: 'dept-aeronautical',
    title: 'Aeronautical Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367605463!6m8!1m7!1sCAoSLEFGMVFpcE81bHR4MnlweUQ5Z1VDTHc5SVBxbWZIcTdVejhwQlFiRTJ1UUdu!2m2!1d17.5944451!2d78.4411892!3f11.62699!4f3.9700399999999973!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Aeronautical Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-cse',
    title: 'CSE Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366939436!6m8!1m7!1sCAoSLEFGMVFpcFBhdGpTdi1CY0p2V3RkNWVwZmFxemxoNDJHR3ZOYnlsYk44eW1W!2m2!1d17.5944451!2d78.4411892!3f134.10452!4f-3.668526!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT CSE Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-cse-aiml',
    title: 'CSE – AI & ML Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367032395!6m8!1m7!1sCAoSLEFGMVFpcE5CdWc0Ujd3STdrSnZ4YllUYVVSUkozYURucTQ4VWhDcXJQOEJi!2m2!1d17.5944451!2d78.4411892!3f49.30874!4f-2.094695999999999!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT CSE AI & ML Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-cse-cs',
    title: 'CSE – Cyber Security Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367101075!6m8!1m7!1sCAoSLEFGMVFpcE5XOV85amtYMXdoSnFyS0YzSTJ0S0xLZkw5OEh6SGI0bWtjQkpO!2m2!1d17.5944451!2d78.4411892!3f189.89525!4f-5.388756000000001!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT CSE Cyber Security Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-cse-ds',
    title: 'CSE – Data Science Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367208764!6m8!1m7!1sCAoSLEFGMVFpcFBRVFdfRXJJZ3JoX0V6Y1gzek5keEM4M1VYcFRKR3kzSGYtcFNk!2m2!1d17.5944451!2d78.4411892!3f197.88542!4f-3.157730000000001!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT CSE Data Science Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-csit',
    title: 'CSIT Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367272243!6m8!1m7!1sCAoSLEFGMVFpcE4wWlRuY181SDJlR1pzRDFfS2hNNHBJS0lZTUtLZFBuTDFPeWlr!2m2!1d17.5944451!2d78.4411892!3f171.25098!4f-6.232919999999993!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT CSIT Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-ece',
    title: 'ECE Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367473941!6m8!1m7!1sCAoSLEFGMVFpcE9icjNFcFJBZzNtYU1fWXd0Vm5wNUJ1LUVWOG216OHB6bVVVQ21v!2m2!1d17.5944451!2d78.4411892!3f3.886003!4f-0.32079000000000235!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT ECE Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-eee',
    title: 'EEE Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367326749!6m8!1m7!1sCAoSLEFGMVFpcE0xSWFCaWJmazh3a19rQUZZQ3phOXUwbm8xZk52SzlHY0FIdXJ6!2m2!1d17.5944451!2d78.4411892!3f172.72867!4f-4.218010000000007!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT EEE Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-it',
    title: 'IT Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367543299!6m8!1m7!1sCAoSLEFGMVFpcE9XQll2SWs2Y0pnb2J6bU5FRkUzcmt2M2VkNWZEMENGVzZITTdY!2m2!1d17.5944451!2d78.4411892!3f346.5866!4f-2.6824299999999965!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT IT Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-mechanical',
    title: 'Mechanical Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367711254!6m8!1m7!1sCAoSLEFGMVFpcE1jWGs4MmJFZTE4OXBvaDIxanFXdEt4TEVJcWx4X0NtXzRWOVM0!2m2!1d17.59447726172302!2d78.44117046676043!3f258.45465!4f-1.098595000000003!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Mechanical Department',
    allowFullScreen: true,
  },
  {
    id: 'dept-mba',
    title: 'MBA Department',
    category: 'departments',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665325318725!6m8!1m7!1sCAoSLEFGMVFpcE03QjQwcVRmZzRFZ2FFV2ttbjk0MWlEQXZQWW42bU1mSzJzZG8w!2m2!1d17.5944451!2d78.4411892!3f177.42152!4f-6.594350000000006!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT MBA Department',
    allowFullScreen: true,
  },

  // ── Sports & Events Tour ──────────────────────────────────────────────────
  {
    id: 'sports-indoor-stadium',
    title: 'Indoor Stadium',
    category: 'sports-events',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368704159!6m8!1m7!1sCAoSLEFGMVFpcE4tcWlBQm5kYUtmajluQ2s5ZmN2RU1SVzhUdmJEZzFIQ0ZoSWtT!2m2!1d17.5944451!2d78.4411892!3f353.76337!4f-11.924639999999997!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Indoor Stadium',
    allowFullScreen: true,
  },
  {
    id: 'sports-achievements-hall',
    title: 'Sports Achievements',
    category: 'sports-events',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366154604!6m8!1m7!1sCAoSLEFGMVFpcFBDeEdYQ0Q3TlVhcDhqek5tR2FvR0F4emVtalBSVVFsaTV3djVZ!2m2!1d17.59442056652378!2d78.44124797262555!3f349.69992!4f-4.659180000000006!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Sports Achievements Hall',
    allowFullScreen: true,
  },
  {
    id: 'sports-snooker-room',
    title: 'Snooker Room',
    category: 'sports-events',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368604126!6m8!1m7!1sCAoSLEFGMVFpcFAxWS1Hc2lnS0dheWpkNU5aRUFwamNCXzBFM3lCaDhHdk1zTE5R!2m2!1d17.59450071239213!2d78.44121419828382!3f84.189575!4f-0.1525400000000019!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Snooker Room',
    allowFullScreen: true,
  },
  {
    id: 'sports-table-tennis',
    title: 'Table Tennis Court',
    category: 'sports-events',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368651981!6m8!1m7!1sCAoSLEFGMVFpcFBQQmRCNmdJVDFzYXR5M1dJNV9MN0RNQk42TDluSmJXYnFXODlJ!2m2!1d17.59447381406491!2d78.4412159390255!3f87.04698!4f5.016914!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Table Tennis Court',
    allowFullScreen: true,
  },
  {
    id: 'sports-gym',
    title: 'Gym',
    category: 'sports-events',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368748573!6m8!1m7!1sCAoSLEFGMVFpcE9FRXgxb3hza0pscUx5U2c0LXoyTXM0OGpnMDVQeEc3cjVUR1VH!2m2!1d17.5944451!2d78.4411892!3f2.224606!4f1.8428650000000033!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Gym',
    allowFullScreen: true,
  },
  {
    id: 'sports-basketball-court',
    title: 'Basketball Court',
    category: 'sports-events',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366798811!6m8!1m7!1sCAoSLEFGMVFpcE9wWFFoejBYZldoaG1IN0NaRTRaQjh5UUpsTlFreHR1RTVaQWxx!2m2!1d17.59453518844612!2d78.44124212122102!3f55.40589!4f3.794390000000007!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Basketball Court',
    allowFullScreen: true,
  },
  {
    id: 'sports-playground',
    title: 'Campus Playground',
    category: 'sports-events',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366333117!6m8!1m7!1sCAoSLEFGMVFpcE5XQjRpNTJxTFRsbURaVUNhbWx3U3QtM0Q2UGVqSlBsdlFOUWhm!2m2!1d17.59452592580098!2d78.44119078863959!3f41.835537!4f-8.740584999999996!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Campus Playground',
    allowFullScreen: true,
  },

  // ── Facilities Tour ───────────────────────────────────────────────────────
  {
    id: 'facilities-library',
    title: 'Library',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665369164607!6m8!1m7!1sCAoSLEFGMVFpcE9WQTB1NTNvUXplYUgxWTRyVXhuc1E2Q0tBbnZxVUZydVZSUEdM!2m2!1d17.59441825849064!2d78.44118667203438!3f5.78328!4f-2.4746399999999937!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Library',
    allowFullScreen: true,
  },
  {
    id: 'facilities-digital-classroom',
    title: 'Digital Classroom',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665367764229!6m8!1m7!1sCAoSLEFGMVFpcE5zUFh0dXZzanh4TWE1aVJEU2VGWlVBM3lYNzFJWEdjSFF0WkFo!2m2!1d17.59444616742859!2d78.44116095016129!3f3.484458!4f-6.689514000000003!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Digital Classroom',
    allowFullScreen: true,
  },
  {
    id: 'facilities-humanities-sciences',
    title: 'Humanities & Sciences',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366862596!6m8!1m7!1sCAoSLEFGMVFpcE9IaWRnSUlqWlRMbnlKSThZVGppVW5nRmZrX2hROHIxYlhLVUJY!2m2!1d17.5944451!2d78.4411892!3f164.45975!4f-1.507639999999995!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Humanities & Sciences',
    allowFullScreen: true,
  },
  {
    id: 'facilities-cafeteria',
    title: 'Cafeteria',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368558573!6m8!1m7!1sCAoSLEFGMVFpcE9yUnFHMHh0dWdQc2xhdmpqTkdBYWxaV0JKaXQ4dGhTZERraE5s!2m2!1d17.5944451!2d78.4411892!3f348.42618!4f-13.022605999999996!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Cafeteria',
    allowFullScreen: true,
  },
  {
    id: 'facilities-hostel-room',
    title: 'Hostel Room',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368841360!6m8!1m7!1sCAoSLEFGMVFpcE1tbVU1ZHFNTUVBVk9KQzZtMDlZR2xLOWRkVzFwZHAwMTY3QW9O!2m2!1d17.59441828519632!2d78.4411920226996!3f80.0125!4f-3.126279999999994!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Hostel Room',
    allowFullScreen: true,
  },
  {
    id: 'facilities-hostel-mess',
    title: 'Hostel Mess',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368927212!6m8!1m7!1sCAoSLEFGMVFpcFBXZzFMN0NNSExWcE9hdnZvbXRwdU5xcDluMm9sVzRTdDd6T2Ns!2m2!1d17.5944451!2d78.4411892!3f200.29245!4f-11.485275000000001!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Hostel Mess',
    allowFullScreen: true,
  },
  {
    id: 'facilities-hospital',
    title: 'Hospital',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368803769!6m8!1m7!1sCAoSLEFGMVFpcFBmdEpLQlllQlpUcVdOVzRqNVVqOG9XMkpBWTNvamZUYXB6Qlc3!2m2!1d17.5944451!2d78.4411892!3f183.81375!4f-12.889229999999998!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Hospital',
    allowFullScreen: true,
  },
  {
    id: 'facilities-entrance',
    title: 'MLRIT Entrance',
    category: 'facilities',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665366014502!6m8!1m7!1sCAoSLEFGMVFpcE9Mbk9pRVotOVltUTFtaVVTenhkdHZoT3kyajlLMUNOZzVSQ1dk!2m2!1d17.59441815123146!2d78.44118899769138!3f352.0214!4f-8.169470000000004!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Entrance',
    allowFullScreen: true,
  },

  // ── Student Spaces Tour ───────────────────────────────────────────────────
  {
    id: 'student-rnd-cell',
    title: 'Research & Development Cell',
    category: 'student-spaces',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665325558258!6m8!1m7!1sCAoSLEFGMVFpcE5yc1ZtZGlYQWRySlo1X1RBaFBUYlNCanB1REJzam1CM19hQmMz!2m2!1d17.59452890366131!2d78.4414207389584!3f140.59183!4f-3.0932540000000017!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Research & Development Cell',
    allowFullScreen: true,
  },
  {
    id: 'student-clubs',
    title: 'Student Clubs',
    category: 'student-spaces',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368330879!6m8!1m7!1sCAoSLEFGMVFpcE43YVp5YXk5dUJOQXEtc3lycW1LTm1DclMzQXQySjd6bWtEeXIz!2m2!1d17.5944451!2d78.4411892!3f131.60223!4f-10.796530000000004!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Student Clubs',
    allowFullScreen: true,
  },
  {
    id: 'student-auditorium',
    title: 'Auditorium',
    category: 'student-spaces',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368034202!6m8!1m7!1sCAoSLEFGMVFpcE1sUjZLeV9xaDlsMng2ODRBS1NuTHBKWVJuV2FDQkpwdmFNMl9Q!2m2!1d17.5944184620495!2d78.44119348620396!3f347.23996!4f-3.7720900000000057!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Auditorium',
    allowFullScreen: true,
  },
  {
    id: 'student-seminar-hall',
    title: 'Seminar Hall',
    category: 'student-spaces',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!4v1665368498257!6m8!1m7!1sCAoSLEFGMVFpcE1UR1d4YXZoS2tIQUFnczkycjV1ZW5GLW8weFB3RnNCLXc0dUlv!2m2!1d17.59438142569758!2d78.44115228935172!3f310.8817!4f-1.7646900000000016!5f0.4000000000000002',
    iframeTitle: 'Virtual tour of MLRIT Seminar Hall',
    allowFullScreen: true,
  },
];

export function getLocationsByCategory(category: VirtualTourCategory): VirtualTourLocation[] {
  return VIRTUAL_TOUR_LOCATIONS.filter((l) => l.category === category);
}

export function getDefaultLocation(category: VirtualTourCategory): VirtualTourLocation {
  return getLocationsByCategory(category)[0];
}
