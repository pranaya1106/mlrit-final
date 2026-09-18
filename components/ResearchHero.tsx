import PageHeader from './PageHeader';

export default function ResearchHero({
  title,
  italic,
  dek,
  crumbs,
}: {
  title: string;
  italic?: string;
  dek: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <PageHeader
      eyebrow="Research & Innovation"
      title={title}
      italic={italic}
      dek={dek}
      crumbs={crumbs}
      variant="green"
    />
  );
}
