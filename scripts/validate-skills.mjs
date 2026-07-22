import { validateSkillData } from './skills-data.mjs';
import { skillData } from './skills-data-manifest.mjs';

const errors = validateSkillData(skillData);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Skills data is valid.');
}
