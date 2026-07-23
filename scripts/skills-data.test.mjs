import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSkillData } from './skills-data.mjs';

const validData = () => ({
  domains: [{ id: 'cognitive', name: { zh: '认知', en: 'Cognitive' }, description: { zh: '研究与推理。', en: 'Research and reasoning.' } }],
  skills: [{ id: 'research', domainId: 'cognitive', subdomain: { zh: '研究', en: 'Research' }, name: { zh: '跨来源调研', en: 'Cross-source Research' }, definition: { zh: '从多个来源检索并验证资料。', en: 'Finds and verifies information across multiple sources.' }, knowledgeIds: ['source-evaluation'], toolIds: [], experienceIds: ['research-education'], prerequisiteSkillIds: [], relatedSkillIds: [], combinedPracticeIds: [], mode: ['individual'], transferability: 'universal', evidenceType: ['education'] }],
  knowledge: [{ id: 'source-evaluation', name: { zh: '来源评估', en: 'Source Evaluation' }, definition: { zh: '判断来源可靠性。', en: 'Assessment of source reliability.' }, relatedSkillIds: ['research'] }],
  tools: [],
  experiences: [{ id: 'research-education', name: { zh: '研究教育', en: 'Research Education' }, description: { zh: '以研究项目形成证据。', en: 'Evidence developed through research projects.' }, relatedSkillIds: ['research'], evidenceType: 'education' }],
  skillEvidence: [{ skillId: 'research', experienceId: 'research-education', description: { zh: '我在研究项目中检索并验证资料。', en: 'I found and verified sources in a research project.' } }],
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

test('rejects repeated evidence for the same skill', () => {
  const data = validData();
  data.skillEvidence.push({ ...data.skillEvidence[0] });
  assert.match(validateSkillData(data).join('\n'), /duplicate skill evidence for research/);
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

test('declares every fixed domain and required evidence hub', async () => {
  const [domains, experiences] = await Promise.all([
    readFile(new URL('../src/data/skills/domains.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/experiences.json', import.meta.url), 'utf8').then(JSON.parse),
  ]);
  assert.deepEqual(domains.map(({ id }) => id), ['cognitive', 'creative', 'technical', 'physical', 'interpersonal', 'organizational', 'personal', 'practical-life']);
  for (const id of ['fashion-lab', 'huan-3d', 'glitch-in-the-hive', 'sony-sie', 'music-portfolio', 'github', 'obfuscation-archive', 'digital-alchemy', 'education-research', 'practical-experiences']) assert.ok(experiences.some((item) => item.id === id));
});

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

test('validates the production skills manifest', async () => {
  const { skillData } = await import('./skills-data-manifest.mjs');
  assert.deepEqual(validateSkillData(skillData), []);
});

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

test('skills route presents experience as sentences without a case label', async () => {
  const content = await readFile(new URL('../src/app/skills/SkillsContent.tsx', import.meta.url), 'utf8');
  assert.match(content, /evidence\.description/);
  assert.doesNotMatch(content, />案例</);
  assert.doesNotMatch(content, /experience\.name/);
});

test('top navigation exposes the skills route', async () => {
  const source = await readFile(new URL('../src/components/Navigation.tsx', import.meta.url), 'utf8');
  assert.match(source, /href: '\/skills', label: '技能 SKILLS'/);
});
