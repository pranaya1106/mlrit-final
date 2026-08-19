import { asGalleryItems } from '@/lib/content/sections';
import { recruiterLogosFrom } from '@/lib/placements';

import RecruitersPage from './RecruitersPage';

// Logos come from the same CMS field the homepage marquee reads, so the two
// cannot drift. ISR window matches the homepage; an unsaved gallery falls back
// to the bundled list inside recruiterLogosFrom().
export const revalidate = 60;

/** Never let a CMS lookup take the page down — fall back to bundled logos. */
async function getRecruiterLogos() {
  try {
    const { getSection } = await import('@/lib/content/client');
    const row = await getSection('placements', 'recruiters');
    return recruiterLogosFrom(asGalleryItems((row?.content as Record<string, unknown>)?.logos));
  } catch {
    return recruiterLogosFrom(undefined);
  }
}

export default async function PlacementsRecruitersRoute() {
  return <RecruitersPage logos={await getRecruiterLogos()} />;
}
