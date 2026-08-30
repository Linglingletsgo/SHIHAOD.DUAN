# Skills Project Schema

Read this reference when converting approved raw material into the structured Skills database.

## Sources and roles

- `docs/skills/skills-raw-inventory.zh.md`: owner-supplied source record, organised with minimal editorial intervention.
- `src/data/skills/domains.json`: fixed system-level capability domains.
- `src/data/skills/disciplines.json`: public discipline filters.
- `src/data/skills/skills.json`: bilingual capability definitions and record relations.
- `src/data/skills/knowledge.json`: conceptual knowledge shared by skills.
- `src/data/skills/tools.json`: used software, hardware, protocols, platforms, equipment, and formats.
- `src/data/skills/experiences.json`: projects, work, education, and practice; `href` is optional and must be approved.
- `src/data/skills/skill-evidence.json`: at most one public evidence sentence per skill.
- `src/data/skills/skill-disciplines.json`: exactly one mapping entry per skill, containing one or more public disciplines.
- `src/data/skills/types.ts`: TypeScript unions and record shapes.
- `scripts/skills-data.mjs`: authoritative relationship and content validation.
- `scripts/skills-data.test.mjs`: durable project invariants and production-manifest tests.

Use lowercase kebab-case IDs. Reuse an existing record when its meaning truly matches; do not reuse an ID merely because its label is adjacent.

## Skill relations

Every skill references existing IDs only:

- `knowledgeIds`: conceptual foundations used by the skill.
- `toolIds`: tools actually used in the described capability.
- `experienceIds`: evidence hubs that support the claim.
- `prerequisiteSkillIds`: abilities normally required before this skill.
- `relatedSkillIds`: adjacent but non-dependent abilities.
- `combinedPracticeIds`: named abilities produced by combining this skill with others.

Relations must describe real structure rather than filling empty arrays. The current page deliberately stores but does not display skill-to-skill relations or subdomain labels.

## Evidence and links

`skill-evidence.json` accepts one entry per skill. Each entry requires complete `zh` and `en` descriptions.

When `linkText` is present:

- `experienceId` must point to an existing experience;
- the corresponding experience must have an approved `href` before the page can create a useful link;
- `linkText.zh` must occur exactly in the Chinese sentence;
- `linkText.en` must occur exactly in the English sentence.

If there is no suitable evidence, omit the evidence entry. Never create a placeholder case or a link to a private raw file.

## Existing public constraints

- The public page defaults to English and switches to fully corresponding Chinese.
- The database itself is the displayed content; there is no separate hidden proficiency database.
- Prohibited fields include `status`, `time`, `applicationContext`, and `proficiency`.
- Do not create a standalone DJ-performance skill from basic knowledge.
- Veo 3.1 is retained as historical project context, not listed as a tool.
- Case material appears as prose, without a “Case” or “案例” heading.
- Every skill requires exactly one discipline mapping entry.

Inspect the current validator and tests before assuming these constraints are exhaustive; the code is authoritative when the schema evolves.

## Verification

Run from the repository root:

```bash
npm run validate:skills
node --test scripts/skills-data.test.mjs
npm run type-check
npm run lint
git diff --check
```

If full lint fails only because it scans unrelated generated output or another worktree, do not change lint configuration as part of a content update. Run targeted lint on files that ESLint supports, record the exact baseline cause, and keep the scope surgical.

When runtime verification is warranted, start the existing development server and request `/skills`. Confirm an HTTP 200 response and that the new default-English skill titles occur in the server-rendered HTML. Stop the server afterwards.
