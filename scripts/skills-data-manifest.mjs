import { readFile } from 'node:fs/promises';

const read = async (name) => JSON.parse(await readFile(new URL(`../src/data/skills/${name}.json`, import.meta.url), 'utf8'));

export const skillData = {
  domains: await read('domains'),
  skills: await read('skills'),
  knowledge: await read('knowledge'),
  tools: await read('tools'),
  experiences: await read('experiences'),
};
