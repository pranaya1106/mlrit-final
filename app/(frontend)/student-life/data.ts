export interface MemoryLaneItem {
  id: string;
  src: string;
  alt: string;
}

// NOTE: Only hero.jpg is available. Replace with distinct student-life photos.
// Drop files in /public/images/student-life/ and update src values here.
export const MEMORY_LANE_ITEMS: MemoryLaneItem[] = [
  { id: 'm1', src: '/images/student-life/hero.jpg', alt: 'MLRIT students at campus event' },
  { id: 'm2', src: '/images/student-life/hero.jpg', alt: 'Students on the MLRIT green lawn' },
  { id: 'm3', src: '/images/student-life/hero.jpg', alt: 'MLRIT campus life moment' },
  { id: 'm4', src: '/images/student-life/hero.jpg', alt: 'Students capturing memories' },
  { id: 'm5', src: '/images/student-life/hero.jpg', alt: 'MLRIT student community' },
  { id: 'm6', src: '/images/student-life/hero.jpg', alt: 'Campus event at MLRIT' },
  { id: 'm7', src: '/images/student-life/hero.jpg', alt: 'Student life at MLRIT' },
];
