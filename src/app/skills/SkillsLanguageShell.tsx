'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DisciplineId } from '@/data/skills/types';

type DisciplineFilter = DisciplineId | 'all';
type SkillsViewContextValue = Readonly<{
  discipline: DisciplineFilter;
  setDiscipline: (discipline: DisciplineFilter) => void;
}>;

const SkillsViewContext = createContext<SkillsViewContextValue | null>(null);

export function useSkillsView() {
  const context = useContext(SkillsViewContext);
  if (!context) throw new Error('useSkillsView must be used within SkillsLanguageShell');
  return context;
}

export default function SkillsLanguageShell({ children, initialDiscipline = 'all' }: { children: ReactNode; initialDiscipline?: DisciplineFilter }) {
  const [locale, setLocale] = useState<'zh' | 'en'>('en');
  const [discipline, setDisciplineState] = useState<DisciplineFilter>(initialDiscipline);
  const setDiscipline = (value: DisciplineFilter) => {
    setDisciplineState(value);
    const url = new URL(window.location.href);
    if (value === 'all') url.searchParams.delete('discipline');
    else url.searchParams.set('discipline', value);
    window.history.replaceState(null, '', url);
  };

  return (
    <SkillsViewContext value={{ discipline, setDiscipline }}>
      <div className="skills-language-shell" data-locale={locale} data-discipline={discipline}>
        <div className="mb-10 flex justify-end gap-2" role="group" aria-label="Language / 语言">
          {(['en', 'zh'] as const).map((value) => (
            <button key={value} type="button" aria-pressed={locale === value} onClick={() => setLocale(value)} className="rounded border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white aria-pressed:border-zinc-200 aria-pressed:text-white">
              {value === 'zh' ? '中文' : 'EN'}
            </button>
          ))}
        </div>
        {children}
      </div>
    </SkillsViewContext>
  );
}
