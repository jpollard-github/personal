# Refactor Roadmap

This file exists to make follow-up maintenance work easy to request in small,
safe chunks.

Use it as:

- a roadmap for the next maintainability improvements
- a checklist for completed refactors
- a source of copy-paste prompts for future Codex sessions

## Goals

- Reduce the size and risk of large files
- Make route/page code easier to read
- Centralize repeated admin and upload logic
- Add just enough testing and guardrails to catch regressions
- Preserve the site's current visual voice while making future edits safer

## Current Pressure Points

Highest-maintenance files right now:

- `app/globals.css`
- `app/page.tsx`
- `app/music/page.tsx`
- `app/music-insights-data.ts`
- `app/AdminTinyThoughts.tsx`
- `app/AdminProjects.tsx`
- `app/lib/context-refresh.ts`
- `app/twin-peaks-self/journey-data.ts`

## Phase 1: Music Page Component Split

Status: `done`

Why:

- `app/music/page.tsx` is already rich and still growing
- the music page now has multiple distinct section types
- this is the easiest high-value split with low architectural risk

Target outcome:

- Move each major section into a focused component under `app/music/`
- Keep `app/music/page.tsx` mostly as composition and metadata

Suggested component split:

- `MusicConsole.tsx`
- `MusicCurrentSignal.tsx`
- `MusicListeningTimeMachine.tsx`
- `MusicOddFindingsArcade.tsx`
- `MusicSignalHistory.tsx`
- `MusicGenreWeather.tsx`
- `MusicEras.tsx`
- `MusicMusicalDna.tsx`
- `MusicMood.tsx`
- `MusicAllTimeLeaders.tsx`
- `MusicFixations.tsx`
- `MusicPlaylists.tsx`

Acceptance criteria:

- `app/music/page.tsx` becomes a small composition file
- no visual regressions on `/music`
- no changes to public URLs
- `npm run lint` passes

Completed:

- split the music page into focused section components under `app/music/`
- moved shared formatting and ranking helpers into `app/music/shared.tsx`
- kept the existing `ListeningTimeMachine` client component and wrapped it in a route section component

Copy-paste prompt:

```text
Please do Phase 1 from docs/refactor-roadmap.md: split the music page into section components, keep behavior the same, and leave the page easier to extend.
```

## Phase 2: Homepage Component Split

Status: `done`

Why:

- `app/page.tsx` contains many unrelated concerns
- homepage changes are now more frequent
- section-level components will reduce accidental breakage

Target outcome:

- Turn the homepage into a small composition route

Suggested component split:

- `HomeHero.tsx`
- `HomeIntroBand.tsx`
- `HomeNow.tsx`
- `HomeProjects.tsx`
- `HomeWriting.tsx`
- `HomeTinyThoughts.tsx`
- `HomeFunAndGames.tsx`
- `HomeAbout.tsx`
- `HomeCats.tsx`
- `HomeGuestbook.tsx`

Acceptance criteria:

- `app/page.tsx` mostly composes imported sections
- shared helper functions either stay local to a component or move to a small home helper module
- no visual or link regressions
- `npm run lint` passes

Completed:

- split the homepage into focused section components under `app/home/`
- moved shared home constants into `app/home/data.ts`
- moved project presentation helpers into `app/home/project-helpers.ts`

Copy-paste prompt:

```text
Please do Phase 2 from docs/refactor-roadmap.md: split the homepage into section components and keep the rendered output the same.
```

## Phase 3: Shared Admin Upload + Route Helpers

Status: `done`

Why:

- upload logic is duplicated between Tiny Thoughts and Projects
- admin route patterns repeat
- Blob/env checks should live in fewer places

Target outcome:

- Create shared helpers for:
  - admin auth response handling
  - image upload validation
  - Blob upload path creation and error formatting

Suggested files:

- `app/lib/admin-route.ts`
- `app/lib/upload.ts`
- extend `app/lib/blob.ts`

Acceptance criteria:

- less duplication across admin upload routes
- clearer upload errors
- no behavioral regressions in Tiny Thoughts or Project uploads
- `npm run lint` passes

Completed:

- added shared admin route helpers in `app/lib/admin-route.ts`
- added shared upload validation/path helpers in `app/lib/upload.ts`
- centralized Blob put/delete plumbing in `app/lib/blob.ts`
- updated admin project and tiny-thought routes to use the shared helpers

Copy-paste prompt:

```text
Please do Phase 3 from docs/refactor-roadmap.md: centralize admin route and upload helper logic without changing user-facing behavior.
```

## Phase 4: AdminTinyThoughts Cleanup

Status: `done`

Why:

- `app/AdminTinyThoughts.tsx` is one of the largest interactive files
- it mixes form state, attachment workflows, persistence, and rendering

Target outcome:

- Split stateful logic from UI pieces

Suggested split:

- `useTinyThoughtAdmin.ts`
- `TinyThoughtForm.tsx`
- `TinyThoughtAttachmentEditor.tsx`
- `TinyThoughtAdminList.tsx`

Acceptance criteria:

- smaller file sizes
- same admin workflow
- easier attachment/upload debugging
- `npm run lint` passes

Completed:

- split `AdminTinyThoughts` into a state hook plus focused UI pieces under `app/tiny-thought-admin/`
- moved repeated tiny-thought display helpers into `app/lib/tiny-thought-display.tsx`
- kept the existing admin workflow while reducing the size of `app/AdminTinyThoughts.tsx`

Copy-paste prompt:

```text
Please do Phase 4 from docs/refactor-roadmap.md: refactor AdminTinyThoughts into smaller components/hooks without changing behavior.
```

## Phase 5: Curated Data Module Cleanup

Status: `done`

Why:

- curated display data is becoming dense
- mixed concerns make edits harder

Target outcome:

- split large content/config files into smaller purpose-built modules

Suggested targets:

- `app/music-insights-data.ts`
- `app/site-data.ts`
- possibly `app/twin-peaks-self/journey-data.ts`

Suggested strategy:

- separate summary data from curated narrative modules
- keep page contracts stable while reducing file size

Acceptance criteria:

- same public output
- easier targeted edits to specific content areas
- `npm run lint` passes

Completed:

- split `app/music-insights-data.ts` into `app/music-insights/summary.ts`, `app/music-insights/curated.ts`, and `app/music-insights/index.ts`
- split `app/site-data.ts` into focused modules under `app/site-content/` while preserving the old import surface

Copy-paste prompt:

```text
Please do Phase 5 from docs/refactor-roadmap.md: split curated data modules into smaller files while keeping the current output unchanged.
```

## Phase 6: CSS Structure Cleanup

Status: `done`

Why:

- `app/globals.css` is large and now acts as the stylesheet for almost everything
- style changes can have surprising blast radius

Target outcome:

- reduce the risk of unrelated style breakage

Possible approaches:

- keep plain CSS but split by feature or route
- or introduce CSS modules selectively for large route-specific areas

Recommended first step:

- move music-specific styles out of `globals.css`
- then move admin-specific styles
- keep true global primitives in `globals.css`

Acceptance criteria:

- smaller `globals.css`
- clearer ownership of route-specific styles
- no visual regressions

Completed:

- moved music-specific styles into `app/music/music.css` via `app/music/layout.tsx`
- moved admin-specific styles into `app/admin/admin.css` via `app/admin/layout.tsx`
- reduced `app/globals.css` so route-specific styling has clearer ownership

Copy-paste prompt:

```text
Please do Phase 6 from docs/refactor-roadmap.md: reduce globals.css by moving route-specific styles into a more maintainable structure.
```

## Phase 7: Guardrails And Tests

Status: `done`

Why:

- a few small tests would catch the most annoying regressions

Recommended first targets:

- project loading behavior
- upload validation helpers
- tiny-thought content normalization
- selected formatting helpers

Acceptance criteria:

- lightweight test setup added
- at least a few targeted regression tests
- tests are easy to run locally

Completed:

- added a lightweight TypeScript test runner with `tsx`
- added regression tests for upload validation, tiny-thought normalization, project normalization, and selected music formatting helpers
- tests live under `tests/` and run with a single command

Copy-paste prompt:

```text
Please do Phase 7 from docs/refactor-roadmap.md: add a lightweight test setup and a few high-value regression tests.
```

## Suggested Order

Recommended sequence:

1. Phase 1: Music page split
2. Phase 2: Homepage split
3. Phase 3: Shared admin/upload helpers
4. Phase 4: AdminTinyThoughts cleanup
5. Phase 5: Curated data split
6. Phase 6: CSS structure cleanup
7. Phase 7: Tests

## Safe Request Formats

If you want to keep future asks very short, any of these are enough:

- `Please do Phase 1 from docs/refactor-roadmap.md`
- `Please do the next pending phase from docs/refactor-roadmap.md`
- `Please do Phase 3 only, no extra cleanup`
- `Please do Phase 1 and stop after lint`
- `Please do Phase 4, but preserve behavior exactly`

## Notes

- Prefer small refactors that preserve behavior and visual output
- Run `npm run lint` after each phase
- Browser verification is especially valuable after CSS or page-composition refactors
