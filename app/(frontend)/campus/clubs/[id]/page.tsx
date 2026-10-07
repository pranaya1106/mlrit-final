import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubById, getAllClubIds } from '@/lib/clubs';
import ClubDetail from '@/components/sections/ClubDetail';

export function generateStaticParams() {
  return getAllClubIds().map((id) => ({ id }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ id: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const club = getClubById(params.id);
  if (!club) return { title: 'Club — MLRIT' };
  return {
    title: `${club.name} | Clubs & Societies — MLRIT`,
    description: club.description,
  };
}

export default async function ClubPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const club = getClubById(params.id);
  if (!club || !club.hasDetailPage) notFound();
  return <ClubDetail club={club} />;
}
