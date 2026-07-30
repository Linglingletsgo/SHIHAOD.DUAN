import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSkillData } from './skills-data.mjs';

const validData = () => ({
  domains: [{ id: 'cognitive', name: { zh: '认知', en: 'Cognitive' }, description: { zh: '研究与推理。', en: 'Research and reasoning.' } }],
  disciplines: [{ id: 'research-sustainability', name: { zh: '研究', en: 'Research' } }],
  skills: [{ id: 'research', domainId: 'cognitive', subdomain: { zh: '研究', en: 'Research' }, name: { zh: '跨来源调研', en: 'Cross-source Research' }, definition: { zh: '从多个来源检索并验证资料。', en: 'Finds and verifies information across multiple sources.' }, knowledgeIds: ['source-evaluation'], toolIds: [], experienceIds: ['research-education'], prerequisiteSkillIds: [], relatedSkillIds: [], combinedPracticeIds: [], mode: ['individual'], transferability: 'universal', evidenceType: ['education'] }],
  skillDisciplines: [{ skillId: 'research', disciplineIds: ['research-sustainability'] }],
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

test('requires every skill to have a valid discipline mapping', () => {
  const data = validData();
  data.skillDisciplines[0].disciplineIds = ['missing-discipline'];
  assert.match(validateSkillData(data).join('\n'), /missing discipline missing-discipline/);
  data.skillDisciplines = [];
  assert.match(validateSkillData(data).join('\n'), /requires a discipline mapping/);
});

test('rejects repeated evidence for the same skill', () => {
  const data = validData();
  data.skillEvidence.push({ ...data.skillEvidence[0] });
  assert.match(validateSkillData(data).join('\n'), /duplicate skill evidence for research/);
});

test('requires linked case text to appear in its sentence', () => {
  const data = validData();
  data.skillEvidence[0].linkText = { zh: '不存在', en: 'Missing' };
  assert.match(validateSkillData(data).join('\n'), /must contain linkText/);
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

test('requires complete bilingual labels for generic tools', () => {
  const data = validData();
  data.tools.push({ id: 'scanner', name: 'Scanner', label: { zh: '', en: 'Scanner' }, type: 'hardware', relatedSkillIds: [] });
  assert.match(validateSkillData(data).join('\n'), /tools scanner label\.zh is required/);
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
  assert.deepEqual(domains.map(({ id }) => id), ['technical', 'creative', 'cognitive', 'organizational', 'interpersonal', 'physical', 'practical-life', 'personal']);
  for (const id of ['fashion-lab', 'huan-3d', 'glitch-in-the-hive', 'sony-sie', 'music-portfolio', 'github', 'obfuscation-archive', 'digital-alchemy', 'education-research', 'practical-experiences']) assert.ok(experiences.some((item) => item.id === id));
});

test('declares every public discipline and classifies every skill', async () => {
  const [disciplines, skills, mappings] = await Promise.all([
    readFile(new URL('../src/data/skills/disciplines.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/skills.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/skill-disciplines.json', import.meta.url), 'utf8').then(JSON.parse),
  ]);
  assert.deepEqual(disciplines.map(({ id }) => id), ['ai-web-software', 'computing-infrastructure', 'creative-technology', 'fashion-textiles', 'film-photography', 'music-sound', 'research-sustainability', 'life-practical']);
  assert.deepEqual(new Set(mappings.map(({ skillId }) => skillId)), new Set(skills.map(({ id }) => id)));
  const mappingBySkillId = new Map(mappings.map((item) => [item.skillId, item.disciplineIds]));
  assert.deepEqual(mappingBySkillId.get('cross-source-research'), ['research-sustainability']);
  assert.deepEqual(mappingBySkillId.get('engineering-quantitative-coursework'), ['computing-infrastructure']);
  assert.ok(mappingBySkillId.get('academic-research-writing').includes('fashion-textiles'));
  assert.ok(mappingBySkillId.get('data-analysis-visualization').includes('fashion-textiles'));
});

test('keeps first-version content boundaries in source data', async () => {
  const [skills, tools, knowledge, experiences, skillEvidence] = await Promise.all([
    readFile(new URL('../src/data/skills/skills.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/tools.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/knowledge.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/experiences.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../src/data/skills/skill-evidence.json', import.meta.url), 'utf8').then(JSON.parse),
  ]);
  for (const id of ['cognitive', 'creative', 'technical', 'physical', 'interpersonal', 'organizational', 'personal', 'practical-life']) assert.ok(skills.some((item) => item.domainId === id));
  assert.ok(tools.every((item) => !/Veo 3\.1/i.test(item.name)));
  for (const id of ['zed', 'codex']) assert.ok(tools.some((item) => item.id === id));
  assert.ok(knowledge.some((item) => item.id === 'dj-fundamentals'));
  assert.ok(skills.every((item) => item.id !== 'dj-performance'));
  for (const id of ['academic-research-writing', 'engineering-quantitative-coursework', 'fashion-engineering-education', 'art-theory-criticism']) assert.ok(skills.some((item) => item.id === id));
  const artTheory = skills.find((item) => item.id === 'art-theory-criticism');
  assert.equal(artTheory.name.en, 'Artistic Practice, Theory and Criticism');
  assert.match(artTheory.definition.zh, /^以艺术创作为核心/);
  assert.doesNotMatch(`${artTheory.definition.zh} ${artTheory.definition.en}`, /发表|published|publication/i);
  assert.ok(artTheory.experienceIds.includes('education-research'));
  assert.ok(skills.every((item) => !/(GPA|成绩为|得分|score of)/i.test(`${item.definition.zh} ${item.definition.en}`)));
  const educationEvidence = skillEvidence.find((item) => item.skillId === 'academic-research-writing');
  assert.match(educationEvidence.description.en, /University of the Arts London/);
  assert.match(educationEvidence.description.en, /received an offer.*Royal College of Art/);
  const artTheoryEvidence = skillEvidence.find((item) => item.skillId === 'art-theory-criticism');
  assert.match(artTheoryEvidence.description.en, /educational foundation/);
  const utilityEvidence = skillEvidence.find((item) => item.skillId === 'software-utility-development');
  assert.equal(utilityEvidence.linkText.en, 'RightClick');
  assert.match(utilityEvidence.description.en, /macOS Finder/);
  const openSourceEvidence = skillEvidence.find((item) => item.skillId === 'open-source-customisation');
  assert.match(openSourceEvidence.description.en, /French visa appointment workflow/);
  assert.doesNotMatch(openSourceEvidence.description.en, /bypass|circumvent|guarantee/i);
  const thesis = experiences.find((item) => item.id === 'undergraduate-thesis');
  assert.equal(thesis.href, '/research/undergraduate-thesis');
  for (const skillId of ['academic-research-writing', 'data-analysis-visualization', 'sustainable-fashion-industry-research', 'engineering-quantitative-coursework']) {
    const evidence = skillEvidence.find((item) => item.skillId === skillId);
    assert.equal(evidence.experienceId, 'undergraduate-thesis');
    assert.ok(evidence.linkText.zh);
    assert.ok(evidence.linkText.en);
  }
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
  assert.match(shell, /useState<'zh' \| 'en'>\('en'\)/);
});

test('skills route presents experience as sentences without a case label', async () => {
  const content = await readFile(new URL('../src/app/skills/SkillsContent.tsx', import.meta.url), 'utf8');
  assert.match(content, /evidence\.description/);
  assert.match(content, /EvidenceSentence/);
  assert.doesNotMatch(content, />案例</);
  assert.doesNotMatch(content, /experience\.name/);
});

test('skills route keeps skill relations in data without displaying them', async () => {
  const content = await readFile(new URL('../src/app/skills/SkillsContent.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(content, /关联能力|Related Skills|relatedSkills/);
});

test('skills route keeps subdomains in data without displaying them', async () => {
  const content = await readFile(new URL('../src/app/skills/SkillsContent.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(content, /skill\.subdomain/);
});

test('skills route exposes shareable discipline filters', async () => {
  const [page, content, filter, shell] = await Promise.all([
    readFile(new URL('../src/app/skills/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/skills/SkillsContent.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/skills/DisciplineFilter.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/skills/SkillsLanguageShell.tsx', import.meta.url), 'utf8'),
  ]);
  assert.match(page, /searchParams/);
  assert.match(content, /data-disciplines/);
  assert.match(filter, /Browse by discipline/);
  assert.match(filter, /skillCountByDiscipline/);
  assert.match(filter, /aria-live="polite"/);
  assert.match(shell, /searchParams\.set\('discipline'/);
});

test('skills route distinguishes capability navigation, tool tags and external links', async () => {
  const [page, content] = await Promise.all([
    readFile(new URL('../src/app/skills/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/skills/SkillsContent.tsx', import.meta.url), 'utf8'),
  ]);
  assert.match(page, /canonical: '\/skills'/);
  assert.match(content, /Browse by capability type/);
  assert.match(content, /Tools and Systems/);
  assert.match(content, /opens in a new tab/);
});

test('top navigation exposes the skills route', async () => {
  const source = await readFile(new URL('../src/components/Navigation.tsx', import.meta.url), 'utf8');
  assert.match(source, /href: '\/skills', label: '技能 SKILLS'/);
});
