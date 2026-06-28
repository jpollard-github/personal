# Docs README

This index is here to help future Jason open the right document first.

## Current Priority Order

1. `docs/CONTENT-TODO.md` — publish and improve ArcadeGhosts content
2. `docs/PERSONA-TESTS-RESULTS-TODO.md` — website and product improvements from persona testing
3. `docs/VERCEL-PRO-OPERATIONS-TODO.md` — weekly analytics, spend, and operations rhythm
4. Brand Kit repo TODO — separate repo, do not mix it into this site repo
5. `docs/AI-TODO-FIRST.md` — deferred until deterministic and content workflows are stable
6. `docs/PERSONA-TODO.md` — framework roadmap, dormant unless real use exposes a limitation

Daily work should usually start with `CONTENT-TODO.md`, then check `PERSONA-TESTS-RESULTS-TODO.md`.

Framework and AI docs are reference or future docs, not today’s default work queue.

## Current Priorities

1. Publish content from `CONTENT-TODO.md`
2. Improve existing rooms and pages with meaningful content
3. Keep Build Log active
4. Run persona tests after meaningful website changes
5. Review Vercel Analytics weekly
6. Begin AI implementation only after real analytics are available
7. Framework work only if real usage reveals a limitation

## Project Phases

Phase 1:
Infrastructure

Phase 2:
Framework

Phase 3:
Publishing (current)

Future:
Analytics-driven improvement

## Working Rhythm

### Every Session

- `docs/CONTENT-TODO.md`
- `docs/PERSONA-TESTS-RESULTS-TODO.md` if content, navigation, or UX changed

### Weekly

- Publish Build Log updates
- Publish Tiny Thoughts
- Review `docs/VERCEL-PRO-OPERATIONS-TODO.md`
- Check Vercel Analytics and Speed Insights

### Monthly / As Needed

- `docs/PERSONA-TODO.md`
- `docs/PERSONA-DESIGN-PRINCIPLES.md`
- `docs/AI-TODO-FIRST.md`

The framework should become quieter over time while publishing becomes the primary activity.

## Website Work

### `PERSONA-TESTS-RESULTS-TODO.md`

Purpose:

- Active website backlog informed by persona testing and human review.

When to use it:

- When deciding the next ArcadeGhosts website improvement.
- When updating priorities after a retest.

When not to use it:

- When planning future framework changes.
- When managing long-term content publishing ideas.

## Publishing

### `CONTENT-TODO.md`

Purpose:

- Active content backlog and lightweight editorial pipeline.

When to use it:

- For day-to-day publishing decisions.
- When deciding what to draft, polish, or publish next.

When not to use it:

- For framework work.
- For navigation-only or analytics-only tasks.

### `EDITORIAL-GUIDE.md`

Purpose:

- Short reference for ArcadeGhosts voice and publishing philosophy.

When to use it:

- Before drafting or editing content.
- When the site starts sounding too generic or too polished.

When not to use it:

- As a task list.
- As the main publishing backlog.

### `low-friction-content-flow.md`

Purpose:

- Current lightweight publishing flow.

When to use it:

- When you want to publish without overcomplicating the process.

When not to use it:

- As the place to store all long-term content ideas.

## Admin

### `ADMIN-VISION.md`

Purpose:

- Concise vision for what the admin area is for and what should stay out of it.

When to use it:

- When adding or evaluating admin-facing tools.
- When the admin area starts feeling like a loose pile of utilities.

When not to use it:

- As a feature backlog.
- As a replacement for implementation-specific admin docs.

## Framework

### `PERSONA-DESIGN-PRINCIPLES.md`

Purpose:

- Stable philosophy for what the persona framework is for.

When to use it:

- When framework direction feels fuzzy.
- When docs start drifting into route-optimization for its own sake.

When not to use it:

- As a work queue.

### `PERSONA-TODO.md`

Purpose:

- Future framework roadmap and deferred ideas.

When to use it:

- When a real website limitation suggests the framework needs to evolve.

When not to use it:

- For day-to-day site changes.
- For publishing work.

## AI

### `AI-TODO-FIRST.md`

Purpose:

- First practical AI plan, kept explicitly deferred.

When to use it:

- When revisiting the first admin/offline AI workflow later.

When not to use it:

- As a reason to add AI right now.

## Operations

### `VERCEL-PRO-OPERATIONS-TODO.md`

Purpose:

- Operating checklist for analytics, spend, and review rhythm.

When to use it:

- During weekly Vercel review and operations planning.

When not to use it:

- As the main website backlog.
- As a place to design new product features.

## Document Lifecycle

Active working documents:

- `PERSONA-TESTS-RESULTS-TODO.md`
- `CONTENT-TODO.md`

Reference documents:

- `PERSONA-DESIGN-PRINCIPLES.md`
- `EDITORIAL-GUIDE.md`
- `low-friction-content-flow.md`
- `VERCEL-PRO-OPERATIONS-TODO.md`
- `AI-TODO-FIRST.md`

Historical documents:

- migration or one-off planning docs such as `pnpm-migration.md`
- older backlog docs that remain useful for context but are not part of the daily loop
- `docs/TODO.md` is now a historical legacy backlog, not the active website or content queue
- `docs/ChatGPT-TODO.md` is historical handoff context, not an active operating document

Generated documents:

- outputs under `persona-results/`
- generated review packets under `chatgpt-zip-packets/`

## What To Work On Next

Current recommendation:

1. Publish or draft one Build Log entry.
2. Publish or draft one Tiny Thought.
3. Pick one item from `PERSONA-TESTS-RESULTS-TODO.md` only after content work.
4. Do not reopen persona framework work unless a real limitation appears.
5. Do not start AI work yet.

## Organization Recommendation

Current `docs/` size is still manageable at the top level.

Recommendation:

- Do not reorganize immediately.
- Add subfolders later only if the flat structure starts causing search friction.

If that happens, the most useful future categories would likely be:

- `principles/`
- `roadmaps/`
- `results/`
- `guides/`

Why not now:

- the current doc count is still small enough to scan quickly
- moving files now would create churn without much payoff
- the main problem was discoverability, which this index now solves more cheaply
