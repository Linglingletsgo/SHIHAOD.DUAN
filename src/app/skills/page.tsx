import type { Metadata } from 'next';
import SkillsContent from './SkillsContent';
import SkillsLanguageShell from './SkillsLanguageShell';

export const metadata: Metadata = {
  title: 'Skills | Shihao D. Duan',
  description: 'A bilingual interdisciplinary index of skills, knowledge, tools and evidence.',
};

export default function SkillsPage() {
  return <main className="min-h-screen bg-black px-6 pb-24 pt-20 text-zinc-100 md:px-10 md:pt-28"><div className="mx-auto max-w-6xl"><SkillsLanguageShell><SkillsContent /></SkillsLanguageShell></div></main>;
}
