'use client';

import disciplineData from '@/data/skills/disciplines.json';
import skillDisciplineData from '@/data/skills/skill-disciplines.json';
import type { Discipline, DisciplineId } from '@/data/skills/types';
import { useSkillsView } from './SkillsLanguageShell';

const disciplines = disciplineData as readonly Discipline[];
const skillDisciplines = skillDisciplineData as readonly Readonly<{ skillId: string; disciplineIds: readonly DisciplineId[] }>[];
const totalSkillCount = new Set(skillDisciplines.map((item) => item.skillId)).size;
const skillCountByDiscipline = new Map(disciplines.map((item) => [item.id, skillDisciplines.filter((mapping) => mapping.disciplineIds.includes(item.id)).length]));

export default function DisciplineFilter() {
  const { discipline, setDiscipline } = useSkillsView();
  const filters: readonly (DisciplineId | 'all')[] = ['all', ...disciplines.map((item) => item.id)];
  const selectedDiscipline = discipline === 'all' ? undefined : disciplines.find((item) => item.id === discipline);
  const selectedCount = discipline === 'all' ? totalSkillCount : skillCountByDiscipline.get(discipline) ?? 0;

  return (
    <nav className="mb-10 border-y border-zinc-800 py-6" aria-label="Discipline filters">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
        <span data-content-locale="zh">按学科查看</span>
        <span data-content-locale="en">Browse by discipline</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {filters.map((id) => {
          const item = id === 'all' ? undefined : disciplines.find((candidate) => candidate.id === id);
          const count = id === 'all' ? totalSkillCount : skillCountByDiscipline.get(id) ?? 0;
          return (
            <button key={id} type="button" aria-pressed={discipline === id} onClick={() => setDiscipline(id)} className="rounded-full border border-zinc-800 px-3 py-2 text-left font-mono text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white aria-pressed:border-zinc-200 aria-pressed:bg-zinc-900 aria-pressed:text-white">
              {id === 'all' ? <><span data-content-locale="zh">全部</span><span data-content-locale="en">ALL</span></> : item && <><span data-content-locale="zh">{item.name.zh}</span><span data-content-locale="en">{item.name.en}</span></>}
              <span className="ml-2 text-zinc-600" aria-hidden="true">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        <span data-content-locale="zh">{discipline === 'all' ? '已显示全部技能' : `已选择${selectedDiscipline?.name.zh}`}，共{selectedCount}项。</span>
        <span data-content-locale="en">{discipline === 'all' ? 'All skills shown' : `${selectedDiscipline?.name.en} selected`}. {selectedCount} skills shown.</span>
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-zinc-900 pt-5 font-mono text-xs">
        <span className="text-zinc-500"><span data-content-locale="zh">知识范围</span><span data-content-locale="en">Knowledge Areas</span></span>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300"><span data-content-locale="zh">工具与系统</span><span data-content-locale="en">Tools &amp; Systems</span></span>
      </div>
    </nav>
  );
}
