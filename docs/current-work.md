# Current Work

This file is a snapshot of where the repo stands right now so future sessions can re-enter quickly.

## Current State

The site is in a healthier structure than it was before the recent cleanup pass.

What is now in place:

- homepage split into section components
- music page split into section components
- route-specific music and admin CSS extracted from `app/globals.css`
- shared admin route helpers created
- shared upload validation/path helpers created
- Tiny Thoughts admin split into a hook plus focused UI pieces
- curated music/site data split into smaller modules
- lightweight regression tests added
- Playwright e2e coverage added for stable public pages and admin session-protected routes
- README local setup updated with unit and Playwright test commands
- `docs/pnpm-migration.md` added as a repo-specific note about switching from `npm` to `pnpm`

The app currently passes:

- `npm run lint`
- `npm test`
- `npm run test:e2e`
- `npm run build`

## Recently Stabilized Areas

### Homepage

The homepage is now mostly composition in `app/page.tsx`, with the implementation split under `app/home/`.

That means future homepage edits should usually happen in:

- `app/home/data.ts`
- one of the `Home*.tsx` section components

instead of putting everything back into `app/page.tsx`.

### Music

The music page now composes focused sections under `app/music/`.

Public music insight data is now split across:

- `app/music-insights/summary.ts`
- `app/music-insights/curated.ts`
- `app/music-insights/index.ts`

Use those instead of growing `app/music-insights-data.ts` again.

### Tiny Thoughts

Tiny Thoughts now has:

- public display component: `app/TinyThoughts.tsx`
- display helpers: `app/lib/tiny-thought-display.tsx`
- admin container: `app/AdminTinyThoughts.tsx`
- admin hook/UI split under `app/tiny-thought-admin/`

Upload and admin route behavior now shares helpers instead of duplicating validation logic.

## Known Patterns To Preserve

- checked-in curated data is preferred over runtime external fetching for music insights
- admin tools are intentionally simple and single-user
- Blob uploads should go through `app/lib/upload.ts` and `app/lib/blob.ts`
- admin route auth/error patterns should go through `app/lib/admin-route.ts`
- route-specific CSS should stay local when a feature gets large

## Current Risk Areas

These are the files or areas most likely to need attention next if they grow:

- `app/AdminProjects.tsx`
- `app/AdminNow.tsx`
- `app/AdminContextRefresh.tsx`
- `app/lib/context-refresh.ts`
- `app/twin-peaks-self/journey-data.ts`
- remaining large shared styling in `app/globals.css`

None of these are immediate breakage points, but they are the next likely maintenance hotspots.

## Existing Test Coverage

Current tests live in `tests/` and cover:

- upload validation helpers
- project normalization helpers
- Tiny Thoughts normalization helpers
- selected music formatting helpers
- Playwright public route coverage for `/`, `/music`, `/work-with-me`, `/arcade`, and `/movies-tv`
- Playwright admin coverage for login/logout plus `/admin/guestbook`, `/admin/projects`, `/admin/now`, and `/admin/context-refresh`

Run them with:

```bash
npm test
```

Playwright commands:

```bash
npm run test:e2e:install
npm run test:e2e
```

Current e2e caveat:

- the context refresh admin test performs a real export creation request, so repeated local runs can create persistent `context_refresh_exports` rows when the repo points at a live local database

## Practical “How To Change Things” Notes

### If updating homepage content

Start in:

- `app/home/data.ts`
- relevant `app/home/Home*.tsx`

### If updating music content or presentation

Start in:

- `app/music/page.tsx`
- relevant `app/music/*.tsx`
- `app/music-insights/*`
- `app/music/music.css`

### If updating Tiny Thoughts admin or uploads

Start in:

- `app/tiny-thought-admin/*`
- `app/lib/upload.ts`
- `app/lib/blob.ts`
- `app/api/admin/tiny-thoughts/*`

### If updating project or Now admin persistence

Start in:

- `app/lib/projects.ts`
- `app/lib/now.ts`
- matching `app/api/admin/*/route.ts`
- matching admin component

## Suggested Next Improvements

If more cleanup happens later, the best next candidates are:

1. Split `AdminProjects.tsx` the same way Tiny Thoughts was split
2. Split `AdminNow.tsx` if it continues to grow
3. Add mutation-focused e2e coverage for admin flows that save real data, ideally with cleanup or isolated test data
4. Add a few more tests around admin route normalization and payload validation
5. Reduce `app/globals.css` further for other large feature areas

## Short Re-entry Summary

If another session needs a 30-second orientation:

- this is a Next.js personal-site platform with small admin CMS features
- homepage and music refactors are already done
- Tiny Thoughts admin/upload cleanup is already done
- unit tests, e2e tests, build, and lint are green
- future work should extend the split module patterns, not collapse them back into giant files

<!-- codex-session-kit:auto-start -->
> Auto-generated snapshot. Refreshed 6/20/2026, 4:27:34 PM. This section is managed by Codex Session Kit.

## Auto Snapshot

### Current repo activity
- Active git branch: `main`
- Working tree has 6 changed file(s).

### Changed files
- M docs/architecture.md
- M docs/current-work.md
- M docs/refactor-roadmap.md
- M docs/repo-summary.md
- ?? .vscode/
- ?? docs/decisions.md

### Open editors
- No visible editors detected.

### Recently modified files
- .vscode/ai-context-state.json (6/20/2026, 4:27:21 PM)
- docs/decisions.md (6/20/2026, 4:27:21 PM)
- docs/refactor-roadmap.md (6/20/2026, 4:27:21 PM)
- docs/architecture.md (6/20/2026, 4:27:21 PM)
- docs/current-work.md (6/20/2026, 4:27:21 PM)
- docs/repo-summary.md (6/20/2026, 4:27:21 PM)
- .vscode/ai-context.json (6/20/2026, 4:27:21 PM)
- README.md (6/20/2026, 3:27:57 PM)
- app/TinyThoughts.tsx (6/20/2026, 3:18:50 PM)
- app/site-content/visual-media.ts (6/20/2026, 3:18:27 PM)
- tests/upload.test.ts (6/20/2026, 3:18:11 PM)
- app/lib/upload.ts (6/20/2026, 3:18:11 PM)
<!-- codex-session-kit:auto-end -->
