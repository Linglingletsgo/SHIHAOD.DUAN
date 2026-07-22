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
