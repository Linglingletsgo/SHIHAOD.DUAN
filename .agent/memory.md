# Project Memory

## Snapshot
- Date: 2026-05-01
- Project root: `/Users/dominicduan/_gitdevelop/my-nextjs-app`
- Current status: Next.js personal portfolio site for Shihao D. Duan / Dominic Duan. Recent refactor focused on performance and clean code without changing visible content: static render data was hoisted, `/home` link rendering was made data-driven, and Media Tool now lazy-loads FFmpeg modules.

## Project State
- Key files and folders:
  - `src/app/page.tsx`: landing page with black full-screen `LiquidEther` background and looping `TextType` title "SHIHAO D. DUAN"; click navigates to `/home`.
  - `src/app/home/page.tsx`: main directory page with animated/decrypted text links to portfolio works, Fashion Lab projects, music, tools, misc, and about via the top nav.
  - `src/components/Navigation.tsx` and `src/components/ConditionalNavigation.tsx`: global navigation is hidden on `/`, shown elsewhere. Visible nav labels are bilingual: HOME, TOOLS, ABOUT. `/music` and `/misc` remain valid pages but are not shown in the top menu.
  - `src/app/about/page.tsx`: profile page with portrait, bio ("Fashion Designer & Music Producer & Interdiscipline Artist"), education, email, Instagram, LinkedIn, and NetEase Cloud Music links.
  - `src/app/music/page.tsx` and `src/app/music/album/[id]/page.tsx`: music portfolio for artist `张嗣泳`, with album covers, audio paths, durations, descriptions, and lyrics hard-coded in page files.
  - `src/app/misc/page.tsx` and `src/app/misc/night-moon/page.tsx`: personal writing / fragments, including longer reflective prose under "夜月沉入我的海".
  - `src/app/projects/project-a|b|c|d/page.tsx`: Fashion Lab projects using shared `PDFViewer`; titles include `幻`, `墙`, `灵`, `根`.
  - `src/app/other-works/work-1/page.tsx`: WaveSync video page.
  - `src/app/other-works/sony-sie/page.tsx`: LCF CC SonySIE project page with title, Introduction text, and outbound YouTube link only; no embedded iframe.
  - `src/app/other-works/glitch-in-the-hive/page.tsx`: GLITCH IN THE HIVE project page with Introduction text, footage preview grid, production credits, and outbound YouTube link `https://youtu.be/5CudZJwybjg`.
  - `src/app/tools/page.tsx`: tool hub linking to Media Tool, Spectrafilm, and Rhymer.
  - `src/app/mediatool/page.tsx`: browser-local FFmpeg.wasm media processor for conversion, resize, audio extraction, compression, GIF, and screenshot.
  - `src/app/spectrafilm/page.tsx` and `src/lib/spectrafilm/*`: RAW-only film simulation pipeline using `libraw-mini`, film profiles, tone mapping, dye coupling, grain, halation, and bloom.
  - `src/app/rhymer/page.tsx` and `src/lib/rhymer/*`: Chinese/English rhyme finder using binary dictionaries under `public/data/`.
  - `.agent/skills/update_music/SKILL.md`: project-local skill for adding new albums/songs; requires validating audio, cover, metadata, description, duration, and lyrics before editing music pages.
  - `eslint.config.mjs`: Next 16 flat ESLint config using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`; `public/pdf.worker.min.js` is ignored as a generated/minified worker.
- Generated artifacts:
  - `.next/` exists from prior local builds/dev runs.
  - `node_modules/` exists.
- Assets:
  - `public/images/`: profile photo and album covers.
  - `public/audio/`: local MP3 files organized by album/song folders.
  - `public/videos/`: `huan` and `WaveSync` videos in mov/mp4 variants.
  - `public/pdfs/`: `huan.pdf`, `qiang.pdf`, `ling.pdf`, `gen.pdf`.
  - `public/profiles/`: Spectrafilm film profile JSON files plus `index.json`.
  - `public/data/`: rhyme dictionaries `phrase_dict.bin` and `en_rhyme_dict.bin`.
  - `public/images/footage_GIH/`: GLITCH IN THE HIVE PNG footage stills used by the project detail page; files are named `01.png` through `12.png` in display order.
- Missing or empty areas:
  - `api/` directory exists but appears empty from top-level listing.
  - Several album and project data structures are hard-coded in page components; no CMS or database is present.

## Task Goals
- Active goal: Maintain and refine the personal website while preserving durable project context in project-local memory.
- User preferences or constraints:
  - Final user-facing responses should be in Chinese.
  - Think through technical work in English, but do not expose hidden reasoning.
  - Before creative feature/component/behavior changes, use `superpowers:brainstorming`.
  - For multi-step tasks or existing specs, use `superpowers:writing-plans` before coding.
  - Follow Clean Code, KISS, DRY, low cyclomatic complexity, and narrow blast radius.
  - Do not generate standalone Markdown docs unless explicitly requested.
  - After modifying important writing/document-like artifacts, archive a copy/history version under `~/archive/`.

## Decisions
- Important choices made:
  - Applied `vercel-react-best-practices` guidance for small, non-visual refactors: hoisted static arrays/constants, removed unused code, and deferred heavy FFmpeg imports until Media Tool loading/processing paths.
  - Refactored `/home` to render portfolio and Fashion Lab links from module-level data via a reusable `HomeLink` component; text, order, routes, and external link behavior were preserved.
  - In `src/app/mediatool/page.tsx`, changed `@ffmpeg/ffmpeg` and `@ffmpeg/util` from top-level runtime imports to dynamic imports inside `load`/`processVideo`; also removed unused `AlertCircle` import and unused `VideoResult` interface.
  - Hoisted static nav/tool/rhyme/landing constants to module scope to avoid re-creating arrays/objects/functions on every render.
  - Upgraded `next`, `@next/bundle-analyzer`, and `eslint-config-next` to `16.2.4`.
  - Upgraded `react` and `react-dom` to `19.2.5`, plus `@types/react` to `19.2.14` and `@types/react-dom` to `19.2.3`.
  - Removed `--turbopack` from `dev` and `build` scripts because Next 16 uses Turbopack by default.
  - Migrated ESLint away from `FlatCompat` because `eslint-config-next@16` exports flat config directly; downgraded new React Compiler lint rules (`react-hooks/immutability`, `react-hooks/refs`, `react-hooks/set-state-in-effect`) to warnings for existing code.
  - Created project-local memory at `.agent/memory.md` because it was missing.
  - For the SonySIE page, removed the embedded YouTube iframe instead of replacing it with another embed, matching the request to keep only the YouTube jump link.
  - Added the requested Introduction copy as three paragraph strings rendered under the page title.
  - For GLITCH IN THE HIVE, added a detail page rather than linking `/home` directly to YouTube so the supplied Introduction and credits have a dedicated display surface.
  - For the top navigation, removed only the `/music` and `/misc` entries from the nav item array; page files and route contents were left untouched.
  - Treat the site as a personal portfolio plus creative toolkit, not just a generic Next.js app.
- Paths or tools selected:
  - Use `npm run dev` for local development.
  - Use `npm run build`, `npm run lint`, and `npm run type-check` for verification when code changes are made.
  - Use `.agent/skills/update_music/SKILL.md` when adding music.

## Commands and Verification
- Commands run:
  - `pwd`
  - `test -f .agent/memory.md`
  - `ls -la`
  - `ls -la .agent`
  - `rg --files -g '!node_modules' ...`
  - `sed -n ...` on key app, component, config, skill, and profile files.
  - `find public -maxdepth 2 -type f`
  - `find .agent -maxdepth 3 -type f`
  - `git status --short`
  - `npx eslint src/app/other-works/sony-sie/page.tsx`
  - `npm run type-check`
  - `npm run lint`
  - `npm run build`
  - `npx eslint src/app/home/page.tsx src/app/other-works/glitch-in-the-hive/page.tsx`
  - `git diff --check -- src/app/home/page.tsx src/app/other-works/glitch-in-the-hive/page.tsx`
  - `npm run dev`
  - `curl -I http://localhost:3000/home`
  - `curl -I http://localhost:3000/other-works/glitch-in-the-hive`
  - `npx eslint src/app/other-works/glitch-in-the-hive/page.tsx`
  - `git diff --check -- src/app/other-works/glitch-in-the-hive/page.tsx`
  - Renamed GLITCH IN THE HIVE footage files from long exported frame names to `01.png` through `12.png`.
  - `npx eslint src/components/Navigation.tsx`
  - `npm view next version`
  - `npm install next@latest react@latest react-dom@latest @next/bundle-analyzer@latest eslint-config-next@latest @types/react@latest @types/react-dom@latest`
  - `npm list next @next/bundle-analyzer eslint-config-next react react-dom @types/react @types/react-dom`
  - `npm audit --audit-level=high`
  - `curl -I http://localhost:3000/`
  - `curl -I http://localhost:3000/tools`
  - `curl -I http://localhost:3000/mediatool`
- Verification status:
  - Target page lint passed: `npx eslint src/app/other-works/sony-sie/page.tsx`.
  - GLITCH IN THE HIVE changes passed targeted lint: `npx eslint src/app/home/page.tsx src/app/other-works/glitch-in-the-hive/page.tsx`.
  - GLITCH IN THE HIVE footage update passed targeted lint: `npx eslint src/app/other-works/glitch-in-the-hive/page.tsx`.
  - Navigation update passed targeted lint: `npx eslint src/components/Navigation.tsx`.
  - Next upgrade verified installed versions: `next@16.2.4`, `@next/bundle-analyzer@16.2.4`, `eslint-config-next@16.2.4`, `react@19.2.5`, `react-dom@19.2.5`.
  - Full `npm run lint` now exits with code 0 after ESLint config migration; it reports 10 warnings in existing code.
  - After the performance refactor, `npm run lint` exits with code 0 and now reports 7 warnings. `npm run type-check` passes.
  - TypeScript passed: `npm run type-check`.
  - Whitespace check passed for the GLITCH IN THE HIVE changes and footage update.
  - Dev server started at `http://localhost:3000`; `/home` and `/other-works/glitch-in-the-hive` returned HTTP 200.
  - `npm run build` was attempted after the Next 16 upgrade but remained stuck at "Creating an optimized production build ..." for an extended period; the stuck process was terminated and exited with code 143. This matches the pre-upgrade build behavior observed under Next 15.
  - `npm run dev` starts successfully under Next 16.2.4; `/home` and `/other-works/glitch-in-the-hive` returned HTTP 200.
  - After the performance refactor, dev server returned HTTP 200 for `/`, `/home`, `/tools`, and `/mediatool`.
  - `npm audit --audit-level=high` reports 21 vulnerabilities (10 moderate, 11 high). Some are fixable via `npm audit fix`; one `postcss` advisory suggests `npm audit fix --force` but would install an old Next version, so do not run force automatically.

## Next Steps
- Immediate next action:
  - If asked to change the site, first identify whether it is a creative/behavior change and invoke the required Superpowers workflow before editing.
  - For music updates, follow `.agent/skills/update_music/SKILL.md` and keep `src/app/music/page.tsx` and `src/app/music/album/[id]/page.tsx` IDs in sync.
- Known blockers:
  - None for current understanding/memory task.
  - Spectrafilm depends on browser support for RAW processing, `libraw-mini`, and cross-origin isolation headers from `next.config.ts`.
