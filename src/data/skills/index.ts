import domainData from './domains.json';
import disciplineData from './disciplines.json';
import experienceData from './experiences.json';
import skillDisciplineData from './skill-disciplines.json';
import skillEvidenceData from './skill-evidence.json';
import knowledgeData from './knowledge.json';
import skillData from './skills.json';
import toolData from './tools.json';
import type { Discipline, Domain, Experience, Knowledge, Skill, SkillDiscipline, SkillEvidence, SkillTool } from './types';

export const domains = domainData as unknown as readonly Domain[];
export const disciplines = disciplineData as unknown as readonly Discipline[];
export const experiences = experienceData as unknown as readonly Experience[];
export const skillEvidence = skillEvidenceData as unknown as readonly SkillEvidence[];
export const knowledge = knowledgeData as unknown as readonly Knowledge[];
export const skills = skillData as unknown as readonly Skill[];
export const skillDisciplines = skillDisciplineData as unknown as readonly SkillDiscipline[];
export const tools = toolData as unknown as readonly SkillTool[];

export const domainById = new Map(domains.map((item) => [item.id, item]));
export const disciplineById = new Map(disciplines.map((item) => [item.id, item]));
export const experienceById = new Map(experiences.map((item) => [item.id, item]));
export const skillEvidenceBySkillId = new Map(skillEvidence.map((item) => [item.skillId, item]));
export const knowledgeById = new Map(knowledge.map((item) => [item.id, item]));
export const skillById = new Map(skills.map((item) => [item.id, item]));
export const disciplineIdsBySkillId = new Map(skillDisciplines.map((item) => [item.skillId, item.disciplineIds]));
export const toolById = new Map(tools.map((item) => [item.id, item]));
