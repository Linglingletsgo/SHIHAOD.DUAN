import type { Metadata } from 'next';
import SkillsContent from './SkillsContent';
import SkillsLanguageShell from './SkillsLanguageShell';
import { disciplineById } from '@/data/skills';
import type { DisciplineId } from '@/data/skills/types';

export const metadata: Metadata = {
  title: 'Skills | Shihao D. Duan',
  description: 'A bilingual interdisciplinary index of skills, knowledge, tools and evidence.',
  alternates: { canonical: '/skills' },
};

export default async function SkillsPage({ searchParams }: { searchParams: Promise<{ discipline?: string }> }) {
  const requestedDiscipline = (await searchParams).discipline;
  const initialDiscipline = requestedDiscipline && disciplineById.has(requestedDiscipline as DisciplineId) ? requestedDiscipline as DisciplineId : 'all';
  return <main className="min-h-screen bg-black px-6 pb-24 pt-20 text-zinc-100 md:px-10 md:pt-28"><div className="mx-auto max-w-6xl"><SkillsLanguageShell initialDiscipline={initialDiscipline}><SkillsContent /></SkillsLanguageShell></div></main>;
}
