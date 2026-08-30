---
name: curate-skills-inventory
description: Turn the owner's spoken or loosely written capability notes into the project's raw inventory and bilingual Skills database. Use when capturing, organising, translating, expanding, or publishing personal skills, knowledge, tools, and practice evidence for the Skills page.
metadata:
  short-description: Curate spoken notes into the Skills database
---

# Curate Skills Inventory

Convert the owner's own account of their capabilities into a traceable raw record and an externally understandable Skills page without inflating claims or replacing their language with generic portfolio copy.

## Establish the editing mode

Determine whether the owner is still dictating, asking for an interim organisation, or authorising publication.

- While they say they are continuing, have not finished, or ask only for a raw document, update `docs/skills/skills-raw-inventory.zh.md` only. Do not prematurely convert every statement into public database entries.
- Treat “整理这些” as permission to organise the material supplied so far, not automatically as permission to invent missing examples or publish unrelated changes.
- Publish to `src/data/skills/` when the owner asks to add the material to Skills or otherwise clearly authorises execution.
- Ask only questions whose answers would materially change the factual claim, classification, public wording, link, or privacy boundary. Batch closely related questions when possible.

## Capture the raw account first

Preserve the owner's factual scope and characteristic wording. Apply only basic deduplication, typo correction, and logical grouping.

- Record concrete methods, tools, protocols, scale, timings, outputs, education, and first-hand examples.
- Keep uncertain or unfinished statements visibly provisional instead of completing them by inference.
- Do not add competence, ownership, collaboration, seniority, commercial impact, legality, publication, or proficiency claims that the owner did not make.
- When a workflow touches third-party content, credentials, networks, automation, health, finance, or other sensitive areas, use accurate bounded language. For example, describe collection as public or authorised when that is the supported scope; do not imply bypassing access controls.
- Do not turn incidental context into a tool or skill. A model version that dates a project belongs in the experience description unless the owner explicitly presents model operation itself as a reusable capability.

## Separate the four record types

Classify the material around the capability, then connect supporting records:

- **Skill:** a reusable ability the owner can perform, such as Web 3D asset optimisation.
- **Knowledge:** an understood body of concepts that may support several skills, such as colour spaces or signal flow.
- **Tool:** software, hardware, protocol, platform, equipment, or file format actually used.
- **Experience:** a project, work activity, education, or practice that provides factual evidence.

Prefer a broad, externally legible skill title and a detailed definition. Do not create several near-duplicate skills merely because one workflow names several tools. Conversely, do not hide a distinct end-to-end capability inside a generic existing skill when its decisions, infrastructure, and evidence are materially different.

## Edit for public understanding

Write complete, corresponding Chinese and English rather than a short translation paired with a longer original.

- Default public copy should be understandable to clients, collaborators, recruiters, and academic readers without requiring tool-specific background.
- Keep technical nouns, quantities, constraints, and the owner's role. Polish grammar and remove repetition, but do not broaden the claim.
- Use active capability definitions. Use first person for evidence sentences when describing what the owner did.
- Do not publish proficiency levels, rankings, status, time fields, or a separate application-context field.
- Keep `Prerequisite`, `Related`, and `Combined Practice` relations in data when they are useful, but do not expose them in the current interface.
- Maintain the fixed top-level capability domains. Extend discipline filters or subdomains only when the new material cannot be classified accurately with the existing set.
- For a substantial batch, keep hard, specific, externally demonstrable capabilities ahead of softer or generic abilities while preserving any explicit user ordering.

## Integrate evidence as prose

The page presents evidence inside the skill description flow, not in a separate “Case” column.

- Give each evidenced skill one concise, skill-specific sentence describing what was actually done.
- Embed a confirmed project title as an inline link only when the experience has an appropriate `href` and the title appears verbatim in both language versions of the sentence.
- Do not repeat one generic case sentence across multiple skills. If the same project supports several skills, describe the distinct action relevant to each skill.
- If no suitable first-hand evidence was supplied, do not invent one or force an unrelated experience. Omit the evidence relation until the owner provides it.
- Do not expose private source files merely to prove a skill. Link only public routes or resources the owner has approved.

## Update the project database

Before editing structured data, read [references/project-schema.md](references/project-schema.md). Inspect current records and reuse valid existing IDs before creating new ones.

Make the smallest coherent update:

1. Update the raw inventory with the source account and editorial grouping.
2. Add or revise knowledge, tools, and experiences required by the new capability.
3. Add or revise the skill definition and its relations.
4. Add exactly one discipline mapping for every new skill.
5. Add at most one evidence record for each skill, following the evidence rules above.
6. Update TypeScript unions only when introducing a genuinely new supported record type.
7. Add tests only for durable data constraints or important factual boundaries, not merely to lock generated prose word-for-word.

Preserve unrelated records and existing user edits. Do not redesign the Skills page or change its public information architecture unless requested.

## Verify before reporting completion

Run the project validation sequence in [references/project-schema.md](references/project-schema.md). Confirm that the `/skills` route renders the new English titles because English is the default locale; rely on the same bilingual records for the Chinese toggle.

Report:

- what capabilities and supporting records were added or revised;
- any wording that was deliberately bounded for accuracy, privacy, or compliance;
- validation results and unrelated baseline failures;
- whether the changes remain uncommitted and unpushed.

Do not commit or push unless the owner asks.
