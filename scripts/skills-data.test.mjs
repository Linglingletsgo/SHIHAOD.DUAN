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
