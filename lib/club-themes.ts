export interface ClubTheme {
  slug:       string;
  name:       string;
  /** Absolute path from /public */
  logo?:      string;
  /** Short initials shown in nav when no logo image */
  initials:   string;
  primary:    string;
  background: string;
}

export const CLUB_THEMES: ClubTheme[] = [
  {
    slug:       'apex',
    name:       'APEX',
    initials:   'APEX',
    primary:    '#D80000',
    background: '#080808',
  },
  {
    slug:       'scope',
    name:       'SCOPE',
    logo:       '/images/clubs/scope-logo.png',
    initials:   'SCOPE',
    primary:    '#00C2FF',
    background: '#07090b',
  },
  {
    slug:       'came',
    name:       'CAME',
    logo:       '/images/clubs/came-logo.png',
    initials:   'CAME',
    primary:    '#F5760A',
    background: '#0a0705',
  },
  {
    slug:       'robotics',
    name:       'Robotics',
    logo:       '/images/clubs/robotics-logo.png',
    initials:   'ROB',
    primary:    '#10b981',
    background: '#071209',
  },
  {
    slug:       'code',
    name:       'CODE',
    initials:   'CODE',
    primary:    '#3DDC5A',
    background: '#050d07',
  },
  {
    slug:       'ewb',
    name:       'EWB',
    initials:   'EWB',
    primary:    '#3FAE5C',
    background: '#041009',
  },
  {
    slug:       'aim',
    name:       'AIM',
    logo:       '/images/clubs/aim-logo.png',
    initials:   'AIM',
    primary:    '#8b5cf6',
    background: '#07040f',
  },
  {
    slug:       'cie',
    name:       'CIE',
    logo:       '/images/clubs/cie-logo-white.svg',
    initials:   'CIE',
    primary:    '#f59e0b',
    background: '#0d0a03',
  },
];

export function getClubTheme(pathname: string): ClubTheme | null {
  const match = pathname.match(/\/campus\/clubs\/([^/]+)/);
  if (!match) return null;
  return CLUB_THEMES.find(t => t.slug === match[1]) ?? null;
}
