import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEPARTMENTS, getDepartment } from '@/lib/departments';
import DepartmentDetail from '@/components/sections/DepartmentDetail';

export function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const d = getDepartment(params.slug);
  if (!d) return { title: 'Department — MLRIT' };
  return { title: `${d.name} — MLRIT`, description: d.tagline };
}

export default async function DepartmentPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const d = getDepartment(params.slug);
  if (!d) notFound();
  return <DepartmentDetail department={d} />;
}
