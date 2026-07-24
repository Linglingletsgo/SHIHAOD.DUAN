const prohibitedFields = ['status', 'time', 'applicationContext', 'proficiency'];
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

export function validateSkillData(data) {
  const errors = [];
  const groups = ['domains', 'disciplines', 'skills', 'knowledge', 'tools', 'experiences'];
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
        if (group === 'tools' && field === 'name') {
          if (!hasText(item.name)) errors.push(`tools ${item.id} name is required`);
          continue;
        }
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

  const classifiedSkills = new Set();
  for (const item of data.skillDisciplines ?? []) {
    if (classifiedSkills.has(item.skillId)) errors.push(`duplicate discipline mapping for skill ${item.skillId}`);
    classifiedSkills.add(item.skillId);
    if (!ids.skills.has(item.skillId)) errors.push(`discipline mapping references missing skill ${item.skillId}`);
    if (!item.disciplineIds?.length) errors.push(`skill ${item.skillId} requires at least one discipline`);
    for (const id of item.disciplineIds ?? []) {
      if (!ids.disciplines.has(id)) errors.push(`skill ${item.skillId} references missing discipline ${id}`);
    }
  }
  for (const id of ids.skills) {
    if (!classifiedSkills.has(id)) errors.push(`skill ${id} requires a discipline mapping`);
  }

  const evidencedSkills = new Set();
  for (const item of data.skillEvidence ?? []) {
    if (evidencedSkills.has(item.skillId)) errors.push(`duplicate skill evidence for ${item.skillId}`);
    evidencedSkills.add(item.skillId);
    if (!ids.skills.has(item.skillId)) errors.push(`skill evidence references missing skill ${item.skillId}`);
    if (item.experienceId && !ids.experiences.has(item.experienceId)) errors.push(`skill evidence references missing experience ${item.experienceId}`);
    if (!hasText(item.description?.zh)) errors.push(`skill evidence ${item.skillId} description.zh is required`);
    if (!hasText(item.description?.en)) errors.push(`skill evidence ${item.skillId} description.en is required`);
    if (item.linkText) {
      if (!item.experienceId) errors.push(`skill evidence ${item.skillId} linkText requires experienceId`);
      for (const locale of ['zh', 'en']) {
        if (!hasText(item.linkText[locale])) errors.push(`skill evidence ${item.skillId} linkText.${locale} is required`);
        else if (!item.description?.[locale]?.includes(item.linkText[locale])) errors.push(`skill evidence ${item.skillId} description.${locale} must contain linkText`);
      }
    }
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

  if ((data.tools ?? []).some((tool) => /veo\s*3\.1/i.test(tool.name))) errors.push('Veo 3.1 is case context, not a tool');
  return errors;
}
