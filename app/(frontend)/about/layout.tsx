import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About MLRIT — Marri Laxman Reddy Institute of Technology',
  description:
    'Founded in 2005, MLRIT is a premier autonomous engineering institution under KMR Educational Society — JNTUH affiliated, AICTE approved, NAAC accredited. Twenty years, eleven thousand students, seven thousand alumni placed worldwide.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
