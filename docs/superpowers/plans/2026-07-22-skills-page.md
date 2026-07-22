# SKILLS Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public bilingual `/skills` capability database, add `技能 SKILLS` to the top navigation, and connect skills to knowledge, tools, and portfolio evidence.

**Architecture:** Keep all content in typed, local, read-only data modules grouped by object type. Render the page as a Server Component and isolate only the Chinese/English toggle in a small Client Component that receives server-rendered children, avoiding serialization of the full database into client JavaScript. Use a dependency-free Node validator and tests to enforce bilingual fields, unique IDs, and valid cross-object references.

**Tech Stack:** Next.js 16.2.4 App Router, React 19.2.5, TypeScript 5, Tailwind CSS 4, Node `node:test`, existing Framer Motion navigation.

## Global Constraints

- Route and page title: `/skills` and `SKILLS`.
- Top navigation label: `技能 SKILLS`.
- Public content must provide complete, semantically equivalent Chinese and English copy.
- Do not display proficiency, Status, Time, Application Context, stars, percentages, or Expert labels.
- Content is public-only; do not add authentication, CMS, database services, or hidden records.
- Store Skills, Knowledge, Tools, and Experiences separately and connect them with stable IDs.
- Top-level domains are fixed: Cognitive, Creative, Technical, Physical, Interpersonal, Organizational, Personal, Practical Life.
- Cases may have no link; linked evidence must preserve existing routes and external URLs.
- Veo 3.1 is case context for Digital Alchemy, not a Tool.
- DJ is Knowledge only, not a performance Skill.
- Health-related copy must describe basic information literacy, not diagnosis, prescribing, or medical expertise.
- Preserve the existing dark visual language, layout intent, content, links, routes, metadata, images, and alt text outside this feature.
- Add no new runtime dependency.
- Follow `vercel-react-best-practices`: server-render static data and keep the locale toggle as the only new client state.

---

## File Structure

- `src/data/skills/types.ts`: shared immutable TypeScript contracts and literal unions.
- `src/data/skills/domains.json`: eight fixed domain definitions.
- `src/data/skills/skills.json`: bilingual Skill records and relations.
- `src/data/skills/knowledge.json`: bilingual Knowledge records.
- `src/data/skills/tools.json`: Tool records; no inferred tools.
- `src/data/skills/experiences.json`: bilingual evidence/case records and links.
- `src/data/skills/index.ts`: direct exports and lookup maps used by the page.
- `scripts/skills-data.mjs`: dependency-free data validation functions for Node tests and CI-style validation.
- `scripts/skills-data.test.mjs`: validator unit tests using `node:test`.
- `scripts/validate-skills.mjs`: executable validation entry point.
- `src/app/skills/SkillsLanguageShell.tsx`: small Client Component controlling visible locale.
- `src/app/skills/SkillsContent.tsx`: Server Component that resolves ID relations and renders domains, skills, tools, knowledge, and evidence.
- `src/app/skills/page.tsx`: route metadata and page composition.
- `src/components/Navigation.tsx`: add the new navigation entry.
- `package.json`: add `test:skills` and `validate:skills` scripts.

### Task 1: Define and Test the Content Contract

**Files:**
- Create: `src/data/skills/types.ts`
- Create: `scripts/skills-data.mjs`
- Create: `scripts/skills-data.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `BilingualText`, `DomainId`, `Skill`, `Knowledge`, `SkillTool`, `Experience`, `SkillDataSet`.
- Produces: `validateSkillData(data): string[]` in `scripts/skills-data.mjs`.
- Consumes: no feature files; tests use in-memory fixtures.

- [ ] **Step 1: Write validator tests**

Create `scripts/skills-data.test.mjs` with tests for a valid fixture, missing Chinese/English copy, duplicate IDs, missing referenced IDs, prohibited fields, Veo as a Tool, and DJ as a Skill:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSkillData } from './skills-data.mjs';

const validData = () => ({
  domains: [{ id: 'cognitive', name: { zh: '认知', en: 'Cognitive' }, description: { zh: '研究与推理。', en: 'Research and reasoning.' } }],
  skills: [{ id: 'research', domainId: 'cognitive', subdomain: { zh: '研究', en: 'Research' }, name: { zh: '跨来源调研', en: 'Cross-source Research' }, definition: { zh: '从多个来源检索并验证资料。', en: 'Finds and verifies information across multiple sources.' }, knowledgeIds: ['source-evaluation'], toolIds: [], experienceIds: ['research-education'], prerequisiteSkillIds: [], relatedSkillIds: [], combinedPracticeIds: [], mode: ['individual'], transferability: 'universal', evidenceType: ['education'] }],
  knowledge: [{ id: 'source-evaluation', name: { zh: '来源评估', en: 'Source Evaluation' }, definition: { zh: '判断来源可靠性。', en: 'Assessment of source reliability.' }, relatedSkillIds: ['research'] }],
  tools: [],
  experiences: [{ id: 'research-education', name: { zh: '研究教育', en: 'Research Education' }, description: { zh: '以研究项目形成证据。', en: 'Evidence developed through research projects.' }, relatedSkillIds: ['research'], evidenceType: 'education' }],
});

test('accepts a complete bilingual data set', () => {
  assert.deepEqual(validateSkillData(validData()), []);
});

test('rejects missing bilingual copy', () => {
  const data = validData();
  data.skills[0].name.en = '';
  assert.match(validateSkillData(data).join('\n'), /skills research name\.en/);
});

test('rejects duplicate IDs', () => {
  const data = validData();
  data.skills.push({ ...data.skills[0] });
  assert.match(validateSkillData(data).join('\n'), /duplicate skill id research/);
});

test('rejects missing relations', () => {
  const data = validData();
  data.skills[0].toolIds = ['missing-tool'];
  assert.match(validateSkillData(data).join('\n'), /missing tool missing-tool/);
});

test('rejects prohibited public fields', () => {
  const data = validData();
  data.skills[0].status = 'active';
  assert.match(validateSkillData(data).join('\n'), /prohibited field status/);
});

test('keeps Veo 3.1 out of tools', () => {
  const data = validData();
  data.tools.push({ id: 'veo-3-1', name: 'Veo 3.1', type: 'platform', relatedSkillIds: [] });
  assert.match(validateSkillData(data).join('\n'), /Veo 3\.1 is case context/);
});

test('keeps DJ as knowledge rather than a skill', () => {
  const data = validData();
  data.skills.push({ ...data.skills[0], id: 'dj-performance', name: { zh: 'DJ 表演', en: 'DJ Performance' } });
  assert.match(validateSkillData(data).join('\n'), /DJ must remain knowledge-only/);
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `node --test scripts/skills-data.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/skills-data.mjs`.

- [ ] **Step 3: Implement the validator**

Create `scripts/skills-data.mjs`. Export `validateSkillData`; check required bilingual strings, duplicate IDs within each object type, every relation, prohibited keys `status`, `time`, `applicationContext`, `proficiency`, and the two content-specific constraints:

```js
const prohibitedFields = ['status', 'time', 'applicationContext', 'proficiency'];

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export function validateSkillData(data) {
  const errors = [];
  const groups = ['domains', 'skills', 'knowledge', 'tools', 'experiences'];
  const ids = Object.fromEntries(groups.map((group) => [group, new Set()]));

  for (const group of groups) {
    for (const item of data[group] ?? []) {
      if (ids[group].has(item.id)) errors.push(`duplicate ${group.replace(/s$/, '')} id ${item.id}`);
      ids[group].add(item.id);
      for (const field of prohibitedFields) {
        if (field in item) errors.push(`${group} ${item.id} has prohibited field ${field}`);
      }
      for (const field of ['name', 'description', 'definition', 'subdomain']) {
        if (!(field in item)) continue;
        if (!hasText(item[field]?.zh)) errors.push(`${group} ${item.id} ${field}.zh is required`);
        if (!hasText(item[field]?.en)) errors.push(`${group} ${item.id} ${field}.en is required`);
      }
    }
  }

  for (const skill of data.skills ?? []) {
    if (!ids.domains.has(skill.domainId)) errors.push(`skill ${skill.id} references missing domain ${skill.domainId}`);
    for (const id of skill.knowledgeIds ?? []) if (!ids.knowledge.has(id)) errors.push(`skill ${skill.id} references missing knowledge ${id}`);
    for (const id of skill.toolIds ?? []) if (!ids.tools.has(id)) errors.push(`skill ${skill.id} references missing tool ${id}`);
    for (const id of skill.experienceIds ?? []) if (!ids.experiences.has(id)) errors.push(`skill ${skill.id} references missing experience ${id}`);
    for (const field of ['prerequisiteSkillIds', 'relatedSkillIds', 'combinedPracticeIds']) {
      for (const id of skill[field] ?? []) if (!ids.skills.has(id)) errors.push(`skill ${skill.id} references missing skill ${id}`);
    }
    if (/^dj-performance$/i.test(skill.id)) errors.push('DJ must remain knowledge-only');
  }

  for (const item of data.knowledge ?? []) {
    for (const id of item.relatedSkillIds ?? []) if (!ids.skills.has(id)) errors.push(`knowledge ${item.id} references missing skill ${id}`);
  }
  for (const item of data.tools ?? []) {
    for (const id of item.relatedSkillIds ?? []) if (!ids.skills.has(id)) errors.push(`tool ${item.id} references missing skill ${id}`);
  }
  for (const item of data.experiences ?? []) {
    for (const id of item.relatedSkillIds ?? []) if (!ids.skills.has(id)) errors.push(`experience ${item.id} references missing skill ${id}`);
  }

  if ((data.tools ?? []).some((tool) => /veo\s*3\.1/i.test(tool.name))) {
    errors.push('Veo 3.1 is case context, not a tool');
  }

  return errors;
}
```

- [ ] **Step 4: Define immutable TypeScript contracts**

Create `src/data/skills/types.ts` with exact literal types matching the validator fixture:

```ts
export type BilingualText = Readonly<{ zh: string; en: string }>;
export type DomainId = 'cognitive' | 'creative' | 'technical' | 'physical' | 'interpersonal' | 'organizational' | 'personal' | 'practical-life';
export type WorkMode = 'individual' | 'collaborative' | 'teaching' | 'support';
export type Transferability = 'domain-specific' | 'cross-disciplinary' | 'universal';
export type EvidenceType = 'project' | 'work' | 'education' | 'publication' | 'practice' | 'recognition';

export type Domain = Readonly<{ id: DomainId; name: BilingualText; description: BilingualText }>;
export type Knowledge = Readonly<{ id: string; name: BilingualText; definition: BilingualText; relatedSkillIds: readonly string[] }>;
export type SkillTool = Readonly<{ id: string; name: string; type: 'software' | 'hardware' | 'protocol' | 'platform' | 'equipment'; relatedSkillIds: readonly string[] }>;
export type Experience = Readonly<{ id: string; name: BilingualText; description: BilingualText; href?: string; relatedSkillIds: readonly string[]; evidenceType: EvidenceType }>;
export type Skill = Readonly<{ id: string; domainId: DomainId; subdomain: BilingualText; name: BilingualText; definition: BilingualText; knowledgeIds: readonly string[]; toolIds: readonly string[]; experienceIds: readonly string[]; prerequisiteSkillIds: readonly string[]; relatedSkillIds: readonly string[]; combinedPracticeIds: readonly string[]; mode: readonly WorkMode[]; transferability: Transferability; evidenceType: readonly EvidenceType[]; language?: readonly ('zh' | 'en')[] }>;
```

- [ ] **Step 5: Add the validator test package script**

Add only the validator unit-test command; real-data validation is added after the JSON content exists in Task 4:

```json
"test:skills": "node --test scripts/skills-data.test.mjs"
```

Do not add `validate:skills` until Task 4.

- [ ] **Step 6: Run tests and static checks**

Run: `npm run test:skills && npm run type-check`

Expected: validator tests PASS and TypeScript exits 0.

- [ ] **Step 7: Commit**

```bash
git add package.json scripts/skills-data.mjs scripts/skills-data.test.mjs src/data/skills/types.ts
git commit -m "Add skills data contract"
```

### Task 2: Add Domains and Portfolio Evidence

**Files:**
- Create: `src/data/skills/domains.json`
- Create: `src/data/skills/experiences.json`

**Interfaces:**
- Consumes: the `Domain` and `Experience` shapes documented in `types.ts`.
- Produces: JSON arrays imported and typed by `index.ts` in Task 3.

- [ ] **Step 1: Add a failing source contract test**

Extend `scripts/skills-data.test.mjs` to parse the two JSON files and assert all fixed IDs and required evidence IDs are present:

```js
import { readFile } from 'node:fs/promises';

test('declares every fixed domain and required evidence hub', async () => {
  const [domains, experiences] = await Promise.all([
    readFile(new URL('../src/data/skills/domains.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/experiences.json', import.meta.url), 'utf8').then(JSON.parse),
  ]);
  assert.deepEqual(domains.map(({ id }) => id), ['cognitive', 'creative', 'technical', 'physical', 'interpersonal', 'organizational', 'personal', 'practical-life']);
  for (const id of ['fashion-lab', 'huan-3d', 'glitch-in-the-hive', 'sony-sie', 'music-portfolio', 'github', 'obfuscation-archive', 'digital-alchemy', 'education-research', 'practical-experiences']) assert.ok(experiences.some((item) => item.id === id));
});
```

- [ ] **Step 2: Run the new test and verify failure**

Run: `npm run test:skills`

Expected: FAIL with `ENOENT` for `src/data/skills/domains.json`.

- [ ] **Step 3: Add all eight bilingual domains**

Create `domains.json` as a JSON array using the exact IDs and bilingual definitions from design spec section 4.

- [ ] **Step 4: Add evidence hubs with exact links**

Create `experiences.json` with the ten IDs in Step 1. Use these links:

```json
{
  "fashion-lab": "/home",
  "huan-3d": "/projects/project-a",
  "glitch-in-the-hive": "/other-works/glitch-in-the-hive",
  "sony-sie": "/other-works/sony-sie",
  "music-portfolio": "/music",
  "github": "https://github.com/Linglingletsgo",
  "obfuscation-archive": "https://archive.dominicduan.com/",
  "digital-alchemy": "https://digitalalchemy.dominicduan.com"
}
```

Describe 《墙》《灵》《根》 under `fashion-lab` as independently completed end-to-end garment projects. Describe 《幻》 under `huan-3d` as an end-to-end 3D design, modelling, scene, material, animation, and rendering case. In `digital-alchemy`, mention Veo 3.1 only as period context.

- [ ] **Step 5: Run tests and TypeScript**

Run: `npm run test:skills && npm run type-check`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/skills/domains.json src/data/skills/experiences.json scripts/skills-data.test.mjs
git commit -m "Add skills domains and evidence"
```

### Task 3: Populate Knowledge, Tools, and Skills

**Files:**
- Create: `src/data/skills/knowledge.json`
- Create: `src/data/skills/tools.json`
- Create: `src/data/skills/skills.json`
- Create: `src/data/skills/index.ts`

**Interfaces:**
- Consumes: contracts from `types.ts`, domains and experiences from Task 2.
- Produces: `knowledge`, `tools`, `skills`, and maps `domainById`, `knowledgeById`, `toolById`, `experienceById`, `skillById`.

- [ ] **Step 1: Add failing source and relation tests**

Extend `scripts/skills-data.test.mjs` to assert the JSON files exist, every domain has a Skill, Tools does not contain Veo 3.1, and Knowledge contains `dj-fundamentals`:

```js
test('keeps first-version content boundaries in source data', async () => {
  const [skills, tools, knowledge] = await Promise.all([
    readFile(new URL('../src/data/skills/skills.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/tools.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/knowledge.json', import.meta.url), 'utf8').then(JSON.parse),
  ]);
  for (const id of ['cognitive', 'creative', 'technical', 'physical', 'interpersonal', 'organizational', 'personal', 'practical-life']) assert.ok(skills.some((item) => item.domainId === id));
  assert.ok(tools.every((item) => !/Veo 3\.1/i.test(item.name)));
  assert.ok(knowledge.some((item) => item.id === 'dj-fundamentals'));
  assert.ok(skills.every((item) => item.id !== 'dj-performance'));
});
```

- [ ] **Step 2: Verify failure**

Run: `npm run test:skills`

Expected: FAIL with `ENOENT` for `skills.json`.

- [ ] **Step 3: Add bilingual Knowledge records**

Create `knowledge.json` records for the knowledge clusters in design spec section 5: source evaluation; data analysis; first-principles reasoning; philosophy/futures; cultural/religious research; garment structure; textile/knit/materials; image/colour; music theory/audio signal chain/acoustics; 3D/procedural geometry/physical simulation; web/open source/APIs; AI/AIGC/MCP knowledge systems; computer hardware/network/storage; smart home; food/flavour; plant care; basic health information literacy; literature; economics/finance; Go strategy; `dj-fundamentals`.

- [ ] **Step 4: Add the confirmed Tool records**

Create `tools.json` with one record for every tool in design spec section 8. Use stable kebab-case IDs. Keep `Veo 3.1` absent. Classify OSC, MIDI, Serial/UART, and MCP as `protocol`; GitHub, Vercel, VPS, and HomeKit as `platform`; named applications as `software`; boards/scanners/printers/decks/machines as `hardware` or `equipment`.

- [ ] **Step 5: Add bilingual Skill records by domain**

Populate independently applicable Skill units from design spec section 5 rather than one record per bullet phrase. Use these mandatory representative IDs so Combined Practice relations remain stable:

```json
const requiredSkillIds = [
  'cross-source-research', 'data-analysis-visualization', 'first-principles-reasoning',
  'end-to-end-garment-development', 'textile-material-practice', 'silver-clay-jewellery',
  'film-direction', 'cinematography', 'screenwriting', 'post-production',
  'music-composition-arrangement', 'mixing-sound-design', 'end-to-end-3d-production',
  'creative-coding', 'speculative-design', 'aigc-video-production',
  'web-development', 'open-source-customisation', 'llm-api-integration',
  'realtime-system-integration', 'embedded-interaction', 'computer-building',
  'home-server-networking', 'device-repair', 'recording-system-design',
  'audiovisual-collaboration', 'clo3d-teaching', 'production-workflow-design',
  'self-directed-learning', 'driving', 'independent-travel', 'cooking',
  'coffee-brewing', 'fitness-endurance', 'go-strategy', 'fire-extinguisher-operation',
  'interactive-wearables', 'audio-reactive-3d', 'interactive-stage-systems',
  'automated-web-archive', 'ai-academic-research-system', 'structural-fashion-development',
]
```

Use `combinedPracticeIds` only to point to the combined skills at the end of this list. Attach the approved evidence hubs instead of creating dense per-technique mappings.

- [ ] **Step 6: Add lookup maps**

Create `index.ts` with JSON imports, read-only exports, and module-level maps:

```ts
import domainData from './domains.json';
import experienceData from './experiences.json';
import knowledgeData from './knowledge.json';
import skillData from './skills.json';
import toolData from './tools.json';
import type { Domain, Experience, Knowledge, Skill, SkillTool } from './types';

export const domains = domainData as unknown as readonly Domain[];
export const experiences = experienceData as unknown as readonly Experience[];
export const knowledge = knowledgeData as unknown as readonly Knowledge[];
export const skills = skillData as unknown as readonly Skill[];
export const tools = toolData as unknown as readonly SkillTool[];

export const domainById = new Map(domains.map((item) => [item.id, item]));
export const experienceById = new Map(experiences.map((item) => [item.id, item]));
export const knowledgeById = new Map(knowledge.map((item) => [item.id, item]));
export const skillById = new Map(skills.map((item) => [item.id, item]));
export const toolById = new Map(tools.map((item) => [item.id, item]));
```

- [ ] **Step 7: Run tests, type-check, and lint**

Run: `npm run test:skills && npm run type-check && npm run lint`

Expected: all commands exit 0; existing lint warnings may remain unchanged.

- [ ] **Step 8: Commit**

```bash
git add src/data/skills scripts/skills-data.test.mjs
git commit -m "Add bilingual skills content"
```

### Task 4: Validate the Real Data Graph

**Files:**
- Create: `scripts/skills-data-manifest.mjs`
- Create: `scripts/validate-skills.mjs`
- Modify: `scripts/skills-data.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: content source files from Task 3.
- Produces: `npm run validate:skills` that exits non-zero on malformed or broken relations.

- [ ] **Step 1: Write a failing real-data validation test**

Add a test that imports `skills-data-manifest.mjs` and expects no validator errors:

```js
test('validates the production skills manifest', async () => {
  const { skillData } = await import('./skills-data-manifest.mjs');
  assert.deepEqual(validateSkillData(skillData), []);
});
```

- [ ] **Step 2: Verify failure**

Run: `npm run test:skills`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `skills-data-manifest.mjs`.

- [ ] **Step 3: Implement a dependency-free JSON manifest**

Read the same JSON files used by Next so validation has one source of truth and no TypeScript runtime dependency:

```js
import { readFile } from 'node:fs/promises';

const read = async (name) => JSON.parse(await readFile(new URL(`../src/data/skills/${name}.json`, import.meta.url), 'utf8'));

export const skillData = {
  domains: await read('domains'),
  skills: await read('skills'),
  knowledge: await read('knowledge'),
  tools: await read('tools'),
  experiences: await read('experiences'),
};
```

This plan intentionally locks the final content format to JSON so Node validation and Next imports share one source of truth with no test-only runtime dependency.

- [ ] **Step 4: Add the CLI and package script**

```js
// scripts/validate-skills.mjs
import { validateSkillData } from './skills-data.mjs';
import { skillData } from './skills-data-manifest.mjs';

const errors = validateSkillData(skillData);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Skills data is valid.');
}
```

Add:

```json
"validate:skills": "node scripts/validate-skills.mjs"
```

- [ ] **Step 5: Run full data checks**

Run: `npm run test:skills && npm run validate:skills && npm run type-check`

Expected: tests PASS, output includes `Skills data is valid.`, TypeScript exits 0.

- [ ] **Step 6: Commit**

```bash
git add package.json scripts src/data/skills
git commit -m "Validate skills content graph"
```

### Task 5: Build the Server-rendered Skills Page

**Files:**
- Create: `src/app/skills/SkillsLanguageShell.tsx`
- Create: `src/app/skills/SkillsContent.tsx`
- Create: `src/app/skills/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `domains`, `skills`, and lookup maps from `@/data/skills`.
- Produces: route `/skills`; `SkillsLanguageShell({ children })`; `SkillsContent()`.

- [ ] **Step 1: Add a failing page source contract test**

Add to `scripts/skills-data.test.mjs`:

```js
test('skills route keeps content server-rendered and isolates locale state', async () => {
  const [page, content, shell] = await Promise.all([
    readFile(new URL('../src/app/skills/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/skills/SkillsContent.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/skills/SkillsLanguageShell.tsx', import.meta.url), 'utf8'),
  ]);
  assert.doesNotMatch(page, /^['"]use client['"]/m);
  assert.doesNotMatch(content, /^['"]use client['"]/m);
  assert.match(shell, /^['"]use client['"]/m);
  assert.match(shell, /useState<'zh' \| 'en'>/);
});
```

- [ ] **Step 2: Verify failure**

Run: `npm run test:skills`

Expected: FAIL with `ENOENT` for `src/app/skills/page.tsx`.

- [ ] **Step 3: Implement the locale shell**

Create a focused Client Component. It owns only the locale and renders server-provided children:

```tsx
'use client';

import { useState, type ReactNode } from 'react';

export default function SkillsLanguageShell({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');

  return (
    <div className="skills-language-shell" data-locale={locale}>
      <div className="mb-10 flex justify-end gap-2" role="group" aria-label="Language / 语言">
        {(['zh', 'en'] as const).map((value) => (
          <button key={value} type="button" aria-pressed={locale === value} onClick={() => setLocale(value)} className="rounded border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-300 aria-pressed:border-zinc-200 aria-pressed:text-white">
            {value === 'zh' ? '中文' : 'EN'}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Implement the Server Component content**

Render a title, concise introduction, eight domain sections, and skill entries. Each skill displays bilingual name/definition, related Knowledge, Tools, and Experiences resolved from maps. Use semantic headings, lists, links, and native `<details>` for relations; do not add filtering, search, animation libraries, or client data state.

Every localized text node must use paired spans:

```tsx
function LocalizedText({ text }: { text: BilingualText }) {
  return <><span data-content-locale="zh">{text.zh}</span><span data-content-locale="en">{text.en}</span></>;
}
```

External links use `target="_blank" rel="noreferrer"`; internal links use `next/link`.

- [ ] **Step 5: Add locale visibility CSS**

Append to `globals.css`:

```css
.skills-language-shell [data-content-locale="en"] { display: none; }
.skills-language-shell[data-locale="en"] [data-content-locale="zh"] { display: none; }
.skills-language-shell[data-locale="en"] [data-content-locale="en"] { display: revert; }
```

- [ ] **Step 6: Add the route page and metadata**

`page.tsx` exports metadata title `Skills | Shihao D. Duan`, composes the shell and server content, and uses the existing black background and centered width conventions.

- [ ] **Step 7: Run tests and static checks**

Run: `npm run test:skills && npm run validate:skills && npm run type-check && npm run lint`

Expected: all exit 0; no new lint warnings in the new files.

- [ ] **Step 8: Commit**

```bash
git add src/app/skills src/app/globals.css scripts/skills-data.test.mjs
git commit -m "Add bilingual skills page"
```

### Task 6: Add Navigation and Verify the Route

**Files:**
- Modify: `src/components/Navigation.tsx`
- Modify: `scripts/skills-data.test.mjs`

**Interfaces:**
- Consumes: existing `navItems` rendering.
- Produces: visible `技能 SKILLS` link to `/skills`.

- [ ] **Step 1: Add a failing navigation source test**

```js
test('top navigation exposes the skills route', async () => {
  const source = await readFile(new URL('../src/components/Navigation.tsx', import.meta.url), 'utf8');
  assert.match(source, /href: '\/skills', label: '技能 SKILLS'/);
});
```

- [ ] **Step 2: Verify failure**

Run: `npm run test:skills`

Expected: FAIL because the navigation item is absent.

- [ ] **Step 3: Add the navigation item**

Insert after HOME and before TOOLS:

```ts
{ href: '/skills', label: '技能 SKILLS' },
```

Do not change any other nav label or route.

- [ ] **Step 4: Run automated verification**

Run: `npm run test:skills && npm run validate:skills && npm run type-check && npm run lint && git diff --check`

Expected: all exit 0; only existing unrelated lint warnings may remain.

- [ ] **Step 5: Start the dev server and verify HTTP routes**

Run: `npm run dev`

In another terminal:

```bash
curl -I http://localhost:3000/skills
curl -I http://localhost:3000/home
```

Expected: both return HTTP 200. Inspect `/skills` at desktop and mobile widths; confirm all eight domains, Chinese/English switch, internal/external evidence links, and no mixed-language rows.

- [ ] **Step 6: Attempt the production build**

Run: `npm run build`

Expected: PASS, or reproduce the known pre-existing hang at `Creating an optimized production build ...`. If it hangs, terminate the process, record exit 143, and do not claim build success.

- [ ] **Step 7: Commit**

```bash
git add src/components/Navigation.tsx scripts/skills-data.test.mjs
git commit -m "Add skills navigation entry"
```

### Task 7: Update Durable Project Memory

**Files:**
- Modify: `.agent/memory.md`

**Interfaces:**
- Consumes: actual implementation and verification results from Tasks 1–6.
- Produces: current project state under the 12,000-character memory limit.

- [ ] **Step 1: Replace planning state with actual implementation state**

Record `/skills`, the content file structure, language shell architecture, navigation entry, validation commands, exact pass/fail results, and any build hang. Remove stale “awaiting implementation” wording instead of appending a chronological log.

- [ ] **Step 2: Verify memory and repository state**

Run:

```bash
wc -m .agent/memory.md
git diff --check
git status --short
```

Expected: memory is below 12,000 characters; no whitespace errors; only expected files are modified.

- [ ] **Step 3: Commit**

```bash
git add .agent/memory.md
git commit -m "Update skills project memory"
```
