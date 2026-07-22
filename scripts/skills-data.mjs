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

  if ((data.tools ?? []).some((tool) => /veo\s*3\.1/i.test(tool.name))) errors.push('Veo 3.1 is case context, not a tool');
  return errors;
}
