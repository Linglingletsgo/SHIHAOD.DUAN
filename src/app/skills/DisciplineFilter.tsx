'use client';

import disciplineData from '@/data/skills/disciplines.json';
import type { Discipline, DisciplineId } from '@/data/skills/types';
import { useSkillsView } from './SkillsLanguageShell';

const disciplines = disciplineData as readonly Discipline[];

export default function DisciplineFilter() {
  const { discipline, setDiscipline } = useSkillsView();
  const filters: readonly (DisciplineId | 'all')[] = ['all', ...disciplines.map((item) => item.id)];

  return (
    <nav className="mb-16 border-y border-zinc-800 py-6" aria-label="Discipline filters">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
        <span data-content-locale="zh">按学科查看</span>
        <span data-content-locale="en">Browse by discipline</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {filters.map((id) => {
          const item = id === 'all' ? undefined : disciplines.find((candidate) => candidate.id === id);
          return (
            <button key={id} type="button" aria-pressed={discipline === id} onClick={() => setDiscipline(id)} className="rounded-full border border-zinc-800 px-3 py-2 text-left font-mono text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white aria-pressed:border-zinc-200 aria-pressed:text-white">
              {id === 'all' ? <><span data-content-locale="zh">全部</span><span data-content-locale="en">ALL</span></> : item && <><span data-content-locale="zh">{item.name.zh}</span><span data-content-locale="en">{item.name.en}</span></>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
