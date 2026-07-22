# Project Memory

## Snapshot
- Date: 2026-07-22
- Project root: `/Users/dominicduan/_gitdevelop/my-nextjs-app`
- Current status: Next.js 16 personal portfolio for Shihao D. Duan / Dominic Duan. The `/skills` content spec is approved. The implementation plan is at `docs/superpowers/plans/2026-07-22-skills-page.md` and awaits execution-method selection. No feature code has been written yet.

## Project State
- `src/app/page.tsx`: animated landing page.
- `src/app/home/page.tsx`: portfolio/Fashion Lab directory. Portfolio includes WaveSync, SonySIE, GLITCH IN THE HIVE, Obfuscation Identity Archive, and Digital Alchemy.
- `src/components/Navigation.tsx`: visible top nav is HOME, TOOLS, ABOUT; `/music` and `/misc` remain accessible but hidden from nav.
- `src/app/about/page.tsx`: biography, education, portrait, and contact links.
- `src/app/projects/project-a|b|c|d`: Fashion Lab PDF projects.
- `src/app/other-works/*`: WaveSync, SonySIE, and GLITCH IN THE HIVE pages.
- `src/app/music/*`: albums and lyrics; use `.agent/skills/update_music/SKILL.md` for music updates.
- `src/app/tools/page.tsx`, `mediatool`, `spectrafilm`, `rhymer`: creative tools.
- Static content is hard-coded; there is no CMS/database.
- Next/React versions: Next 16.2.4, React/React DOM 19.2.5. ESLint uses Next 16 flat config.

## Active Goal: Public Skills Database
- Add top-navigation label `技能 SKILLS` linking to independent route `/skills`.
- Purpose: maintain a comprehensive database of skills the user is willing to publish, while making it legible to collaborators, institutions, professional teams, and general audiences.
- Content comes before frontend/visual design. User declined the visual brainstorming companion.
- Public page is fully bilingual Chinese/English with a button switching languages; translations must be semantically equivalent and maintained together.
- Database content equals public content: no Public/Summary/Private visibility system.
- Do not publish proficiency ratings. Cases demonstrate ability.

### Confirmed Content Model
- Four separate object types: `Skill`, `Knowledge`, `Tool`, `Experience`; Skill is central.
- Store each type separately and connect objects through stable IDs.
- Skill granularity: independently applicable capability units, not broad identities or microscopic operations.
- Fixed top-level domains with extensible subdomains:
  1. Cognitive
  2. Creative
  3. Technical
  4. Physical
  5. Interpersonal
  6. Organizational
  7. Personal
  8. Practical Life
- Skill-to-skill relationships: `Prerequisite`, `Related`, `Combined Practice`.
- Other relations: Skill requires Knowledge, uses Tool, and is demonstrated by Experience.
- Keep Domain, Subdomain, Mode, Transferability, Evidence Type, and Language where relevant.
- Explicitly exclude Status, Time, first/last used, and Application Context. Case descriptions already communicate context.
- Cases without links may show a name and short description. Describe the user’s actual role rather than inferring every skill from project participation.
- Case description standard: context -> specific action/role -> result.
- Avoid unverifiable self-praise; convert claims such as “learns quickly” into evidenced abilities.
- Avoid publishing illegal-resource framing. Describe compliant research, open-source discovery, source evaluation, and resource verification.
- Health knowledge must be framed as basic health information literacy, not diagnosis, prescribing, or professional medical expertise.

### Approved First-Version Inventory
- Cognitive/research: cross-source research, resource discovery and verification, frontier-tech monitoring, data collection/cleaning/analysis/visualization, first-principles reasoning, philosophical concepts applied to design, cultural/ethnic/religious research, speculative/provocative design, literary criticism, basic economics/finance knowledge.
- Fashion/material: fashion design, pattern cutting, flat cutting, draping, fitting, sewing, fashion illustration, CLO3D, knitting/hand flat knitting machine, textile modification, yarn reconstruction, botanical dyeing, origami-to-silhouette/pattern translation, wearable installations, leathercraft, mixed-media painting, light clay, silver-clay jewellery design/forming/firing/setting/finishing.
- Image/film: photography, cinematography/DP, directing, screenwriting/dialogue, performance, fashion shoot direction, reference research, location scouting, makeup/styling direction, media organisation, DaVinci editing/project-server collaboration, colour grading, VFX, voice recording/AI voice change, sound/music design.
- Music/sound/stage: composition, arranging, lyrics, music production, mixing, recording-system design, microphone selection, basic acoustics, EQ/dynamics/signal-chain knowledge, audio-reactive visuals, audio-hardware interaction, real-time audiovisual and interactive stage systems. DJ remains Knowledge only; user owns a deck but does not claim DJ performance ability. Some stage performance experience.
- 3D/interactive: Blender modelling, Geometry Nodes, sculpting, scenes, animation, materials, rendering; 3D scanning/printing/material and cost estimation; COMSOL multiphysics simulation; Processing code art; TouchDesigner; Three.js; Unity–TouchDesigner OSC/MIDI communication; serial/UART; Arduino/ESP32/STM32; sensors, lighting, fashion interaction; Unity/web LLM API integration.
- AI/software: AIGC workflows, text-to-image, image-to-video, text-to-video, first/last-frame generation, prompting, consistency and post-processing; AI Agents, API integration, MCP tools, web development/UI/UX, open-source research/code reading/customisation, Git/GitHub, utility development, automation, Wiki Agent + local wiki + Zotero via MCP for academic writing.
- Full-stack evidence: survey website workflow using SurveyJS, GitHub data/image archival, image-generation API, frontend updates, Vercel deployment, custom domain, and Three.js interaction.
- Infrastructure/hardware: component selection, PC/ITX building and clean cable management, upgrades, OS installation/troubleshooting, data protection/migration, NAS, soft router, home server, virtual machines, set-top-box repurposing, VPS/Linux service deployment, secure remote access, media library automation, backups, filesystems/interfaces, smart-home/HomeKit principles, small appliance repair/battery replacement/soldering, keyboard assembly, furniture assembly.
- Practical/physical: driving with Norway and Zakynthos self-drive evidence; broad cooking practice; coffee brewing and equipment knowledge; food/drink flavour appreciation; independent travel/living; visa preparation; five-day Hangzhou–Nanjing cycling; running, aerobic exercise, table tennis, long-term fitness, sleep/recovery practice, plant care/pest management, fire-extinguisher operation, Go amateur 3-dan.
- Language: native Chinese; IELTS 7.0 overall, Listening 8.5.
- Education/evidence: Zhejiang Sci-Tech University BA/BEng-related Fashion Design and Engineering; London College of Fashion Fashion Futures postgraduate study; undergraduate thesis on embodied carbon in Chinese garment exports using data analysis and visualisation; Sony interactive project; STM32 automatic watering; Arduino garment lighting; personal website and GitHub projects; taught basic CLO3D.
- Tool names confirmed: Blender, Geometry Nodes, CLO3D, COMSOL, TouchDesigner, Processing, Three.js, Unity, DaVinci Resolve, DaVinci Resolve Project Server, SurveyJS, Arduino, ESP32, STM32, OSC, MIDI, Serial/UART, GitHub, Vercel, Zotero, wiki-agent, MCP, Linux, VPS, NAS, HomeKit, 3D scanner/printer, hand flat knitting machine, DJ deck, coffee equipment, and silver-clay equipment. Do not infer or solicit additional tools for the first version.

## Workflow and Constraints
- Use `superpowers:brainstorming` before implementation; design must be approved before code.
- After approved spec, use `superpowers:writing-plans`; implement React/Next work with `vercel-react-best-practices`.
- User requested one question at a time during discovery. Free-list collection and targeted verification are complete for the first version; do not resume exhaustive tool collection unless asked.
- Follow KISS, narrow changes, existing visual intent, and Chinese user-facing replies.
- Do not create unrelated documentation. The brainstorming skill will require a reviewed design spec before implementation.

## Verification and Known Issues
- Prior checks: `npm run type-check` passes; `npm run lint` exits 0 with seven pre-existing warnings.
- Dev routes previously returned HTTP 200.
- `npm run build` repeatedly hangs at optimized production build under Next 15 and 16; terminated runs exited 143.
- `npm audit` previously reported 21 vulnerabilities; do not run force fixes automatically.
- Current Skills work has not changed application code and has not yet required code verification.

## Next Steps
- Ask the user to choose subagent-driven or inline plan execution.
- During implementation, create the validated local JSON content graph, server-rendered `/skills` page, small client-only language shell, and navigation entry in the task order defined by the plan.
- Verify with skills data tests, data validation, type-check, lint, dev route checks, and an attempted production build.
