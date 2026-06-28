# REPO-ARCHITECTURE-NOTES.md

Purpose:

Capture concise, actionable architecture observations without turning the repo into a refactor wishlist.

## Immediate

- Legacy docs now need stronger status labeling:
  - `docs/TODO.md` should be treated as historical
  - `docs/ChatGPT-TODO.md` should be treated as historical handoff context
- The admin naming pattern is mostly consistent:
  - route wrappers in `app/admin/*/page.tsx`
  - top-level client/admin components in `app/Admin*.tsx`
  The pattern works, but it should stay documented because it is not obvious at first glance.
- The Vercel docs split is acceptable as long as `docs/VERCEL-PRO-OPERATIONS-TODO.md` remains the default operational doc and `docs/Vercel-Pro-TODO.md` stays broader and less active.

## Medium-term

- Admin surfaces likely share repeated dashboard-card, auth-gate, and tool-entry patterns that could be simplified later if the admin area grows much more.
- Naming across content and data files is slightly uneven:
  - `app/site-content/*`
  - `app/music-data.ts`
  - `app/music-insights-data.ts`
  - `app/writings.ts`
  This is not urgent, but a later consistency pass could make content locations easier to predict.
- The docs set is still manageable flat. If it grows enough to become noisy, the first future split should be conceptual rather than by owner:
  - principles
  - roadmaps
  - guides
  - results

## Someday

- If the admin area becomes central to daily publishing, consider making the distinction between public-site components and admin-tool components more visible in the filesystem.
- If content systems continue expanding, a calmer naming convention for content source files, derived content data, and stores would help long-term maintainability.
- If repo review packets become a frequent workflow, moving packet generation toward a tracked-file approach such as `git ls-files` would likely age better than exclusion-based packaging.
