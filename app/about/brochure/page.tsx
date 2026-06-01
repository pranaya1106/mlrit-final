import { notFound } from 'next/navigation';
import InfoPageRenderer from '@/components/InfoPageRenderer';
import { getInfoPage } from '@/lib/info-pages';

const SLUG = 'about/brochure';

export const metadata = (() => {
  const p = getInfoPage(SLUG);
  if (!p) return { title: 'MLRIT' };
  return {
    title: `${p.title}${p.italic ? ' ' + p.italic : ''} — MLRIT`,
    description: p.dek,
  };
})();

export default function Page() {
  const page = getInfoPage(SLUG);
  if (!page) notFound();
  return <InfoPageRenderer page={page} />;
}
