'use client';

import { useState } from 'react';

const versions = [
  {
    id: 'zh',
    label: 'Chinese Original / 中文原版',
    openLabel: 'Open Chinese PDF / 打开中文 PDF',
    url: '/pdfs/undergraduate-thesis-embodied-carbon.pdf',
  },
  {
    id: 'en',
    label: 'English Translation / 英文翻译版',
    openLabel: 'Open English PDF / 打开英文 PDF',
    url: '/pdfs/undergraduate-thesis-embodied-carbon-en.pdf',
  },
] as const;

export default function ThesisPdfPreview() {
  const [selectedId, setSelectedId] = useState<(typeof versions)[number]['id']>('zh');
  const selectedVersion = versions.find((version) => version.id === selectedId) ?? versions[0];

  return (
    <section aria-label="Thesis PDF preview">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="PDF language">
          {versions.map((version) => (
            <button
              key={version.id}
              type="button"
              aria-pressed={selectedId === version.id}
              onClick={() => setSelectedId(version.id)}
              className="rounded border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 transition-colors hover:border-zinc-400 hover:text-white aria-pressed:border-zinc-200 aria-pressed:text-white"
            >
              {version.label}
            </button>
          ))}
        </div>
        <a
          href={selectedVersion.url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-sm text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-white"
        >
          {selectedVersion.openLabel}
        </a>
      </div>

      <object
        key={selectedVersion.id}
        data={`${selectedVersion.url}#view=FitH`}
        type="application/pdf"
        className="h-[75vh] min-h-[640px] w-full border border-zinc-800 bg-zinc-950"
      >
        <p className="p-8 text-center text-zinc-400">
          PDF preview is unavailable in this browser.{' '}
          <a href={selectedVersion.url} className="underline underline-offset-4">
            Open the PDF directly.
          </a>
        </p>
      </object>
    </section>
  );
}
