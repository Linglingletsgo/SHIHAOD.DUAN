# Project Memory

## Snapshot
- Date: 2026-04-25
- Project root: `/Users/dominicduan/_gitdevelop/my-nextjs-app`
- Current status: Next.js personal portfolio site for Shihao D. Duan / Dominic Duan. The SonySIE page was updated in this session to remove the embedded YouTube iframe, keep a YouTube outbound link, and add the requested Introduction copy.

## Project State
- Key files and folders:
  - `src/app/page.tsx`: landing page with black full-screen `LiquidEther` background and looping `TextType` title "SHIHAO D. DUAN"; click navigates to `/home`.
  - `src/app/home/page.tsx`: main directory page with animated/decrypted text links to portfolio works, Fashion Lab projects, music, tools, misc, and about via the top nav.
  - `src/components/Navigation.tsx` and `src/components/ConditionalNavigation.tsx`: global navigation is hidden on `/`, shown elsewhere. Nav labels are bilingual: HOME, ALBUMS, MISC, TOOLS, ABOUT.
  - `src/app/about/page.tsx`: profile page with portrait, bio ("Fashion Designer & Music Producer & Interdiscipline Artist"), education, email, Instagram, LinkedIn, and NetEase Cloud Music links.
  - `src/app/music/page.tsx` and `src/app/music/album/[id]/page.tsx`: music portfolio for artist `张嗣泳`, with album covers, audio paths, durations, descriptions, and lyrics hard-coded in page files.
  - `src/app/misc/page.tsx` and `src/app/misc/night-moon/page.tsx`: personal writing / fragments, including longer reflective prose under "夜月沉入我的海".
  - `src/app/projects/project-a|b|c|d/page.tsx`: Fashion Lab projects using shared `PDFViewer`; titles include `幻`, `墙`, `灵`, `根`.
  - `src/app/other-works/work-1/page.tsx`: WaveSync video page.
  - `src/app/other-works/sony-sie/page.tsx`: LCF CC SonySIE project page with title, Introduction text, and outbound YouTube link only; no embedded iframe.
  - `src/app/tools/page.tsx`: tool hub linking to Media Tool, Spectrafilm, and Rhymer.
  - `src/app/mediatool/page.tsx`: browser-local FFmpeg.wasm media processor for conversion, resize, audio extraction, compression, GIF, and screenshot.
  - `src/app/spectrafilm/page.tsx` and `src/lib/spectrafilm/*`: RAW-only film simulation pipeline using `libraw-mini`, film profiles, tone mapping, dye coupling, grain, halation, and bloom.
  - `src/app/rhymer/page.tsx` and `src/lib/rhymer/*`: Chinese/English rhyme finder using binary dictionaries under `public/data/`.
  - `.agent/skills/update_music/SKILL.md`: project-local skill for adding new albums/songs; requires validating audio, cover, metadata, description, duration, and lyrics before editing music pages.
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
  - Created project-local memory at `.agent/memory.md` because it was missing.
  - For the SonySIE page, removed the embedded YouTube iframe instead of replacing it with another embed, matching the request to keep only the YouTube jump link.
  - Added the requested Introduction copy as three paragraph strings rendered under the page title.
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
- Verification status:
  - Target page lint passed: `npx eslint src/app/other-works/sony-sie/page.tsx`.
  - TypeScript passed: `npm run type-check`.
  - Full `npm run lint` currently fails on existing unrelated issues in `public/pdf.worker.min.js` and warnings in `src/app/mediatool/page.tsx`; no target-page lint errors were found.
  - `npm run build` was attempted but remained stuck at "Creating an optimized production build ..." for an extended period; the stuck process was terminated and exited with code 143.

## Next Steps
- Immediate next action:
  - If asked to change the site, first identify whether it is a creative/behavior change and invoke the required Superpowers workflow before editing.
  - For music updates, follow `.agent/skills/update_music/SKILL.md` and keep `src/app/music/page.tsx` and `src/app/music/album/[id]/page.tsx` IDs in sync.
- Known blockers:
  - None for current understanding/memory task.
  - Spectrafilm depends on browser support for RAW processing, `libraw-mini`, and cross-origin isolation headers from `next.config.ts`.
