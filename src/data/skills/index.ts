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
