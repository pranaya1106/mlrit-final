import PageHeader from './PageHeader';

type Stat = { num: string; label: string };

export default function ExaminationsHero({
  title,
  italic,
  dek,
  crumbs,
}: {
  title: string;
  italic?: string;
  dek: string;
  crumbs: { label: string; href?: string }[];
  stats?: Stat[];
}) {
  return (
    <PageHeader
      eyebrow="Examinations"
      title={title}
      italic={italic}
      dek={dek}
      crumbs={crumbs}
      variant="green"
    />
  );
}
