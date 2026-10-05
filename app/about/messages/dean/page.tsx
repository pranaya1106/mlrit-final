import { notFound } from 'next/navigation';
import InfoPageRenderer from '@/components/InfoPageRenderer';
import { getInfoPage } from '@/lib/info-pages';
import { getInfoPageContent } from '@/lib/content/info-pages-cms';

const SLUG = 'about/messages/dean';

export const metadata = (() => {
  const p = getInfoPage(SLUG);
  if (!p) return { title: 'MLRIT' };
  return {
    title: `${p.title}${p.italic ? ' ' + p.italic : ''} — MLRIT`,
    description: p.dek,
  };
})();

export const revalidate = 60;

export default async function Page() {
  const page = await getInfoPageContent(SLUG);
  if (!page) notFound();
  return <InfoPageRenderer page={page} />;
}
