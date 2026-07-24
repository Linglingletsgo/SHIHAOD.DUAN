'use client';

import { useState, type ReactNode } from 'react';

export default function SkillsLanguageShell({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<'zh' | 'en'>('en');
  return (
    <div className="skills-language-shell" data-locale={locale}>
      <div className="mb-10 flex justify-end gap-2" role="group" aria-label="Language / 语言">
        {(['en', 'zh'] as const).map((value) => (
          <button key={value} type="button" aria-pressed={locale === value} onClick={() => setLocale(value)} className="rounded border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white aria-pressed:border-zinc-200 aria-pressed:text-white">
            {value === 'zh' ? '中文' : 'EN'}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
