import { readFile } from 'node:fs/promises';

const read = async (name) => JSON.parse(await readFile(new URL(`../src/data/skills/${name}.json`, import.meta.url), 'utf8'));

export const skillData = {
  domains: await read('domains'),
  disciplines: await read('disciplines'),
  skills: await read('skills'),
  skillDisciplines: await read('skill-disciplines'),
  knowledge: await read('knowledge'),
  tools: await read('tools'),
  experiences: await read('experiences'),
  skillEvidence: await read('skill-evidence'),
};
