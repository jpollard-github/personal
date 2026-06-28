# PERSONA-TODO.md

Reference: 2026-06-28 8:10 PM EDT

This file is the persona-testing framework roadmap.

Do not use this as the primary website work queue.

Use `docs/PERSONA-TESTS-RESULTS-TODO.md` for day-to-day ArcadeGhosts website work.

Use `docs/CONTENT-TODO.md` for long-term publishing and content growth.

Use `docs/README.md` when you need the broader documentation map.

The framework is now considered stable v1.

## Current State

Framework:
Stable v1

Website:
Active development

Primary effort:
Content and website improvements

Future framework work:
Only when website use or analytics reveal a genuine limitation.

## How To Use This File

- Treat this file as future framework guidance, not the active website backlog.
- Keep website improvement work ahead of framework expansion.
- Resume framework work only when real website use exposes a limitation.
- Read `docs/PERSONA-DESIGN-PRINCIPLES.md` for the stable intent of the system.

## Current Direction

The next development cycles should primarily improve ArcadeGhosts itself.

Current priority order:

1. Improve ArcadeGhosts website.
2. Compare persona recommendations against human judgment.
3. Eventually compare persona recommendations against Vercel Analytics.
4. Only then evolve the framework further.

Framework work should only resume when:

- website improvements expose limitations
- analytics contradict planner assumptions
- real users reveal missing behaviors

## Measuring Understanding Instead of Routes

The current framework is strongest at measuring:

- routes visited
- expected routes
- route counts
- journey paths

That evidence is useful, but it is not the end goal.

The longer-term goal is to evaluate:

- orientation
- trust
- professional confidence
- curiosity
- emotional connection
- willingness to continue exploring
- identity clarity

Routes are a means, not the goal.

The framework should not encourage repeatedly forcing one route, including `/about`, if trust is already communicated, navigation is already clear, and multiple good paths exist.

## Website Iteration Workflow

1. Select 1–3 website improvements.
2. Implement them.
3. Run persona tests.
4. Review reports.
5. Update `docs/PERSONA-TESTS-RESULTS-TODO.md`.
6. Perform human review.
7. Later compare against Vercel Analytics.
8. Repeat.

## Future Framework Ideas

These are future ideas, not active work.

### Human Experience Summary

Future reports should summarize the website in human terms such as:

- Orientation
- Trust
- Professional Confidence
- Curiosity
- Emotional Connection

### Route Exposed Vs Route Visited

Future reports may need to distinguish:

- a route the planner actually visited
- a route the page strongly exposed as the next step

This matters when human review says a path is clear but deterministic route metrics stay flat.

### Validation Against Other Signals

Future framework work should compare persona findings against:

- human review
- Vercel Analytics
- search usage
- returning visitors
- contact behavior
- guestbook activity if still relevant

No single metric should dominate.

### Memory

- Add a small memory layer for returning visits so repeat journeys avoid replaying the same rooms by default.

### AI Interpretation

AI remains deferred.

If AI arrives later, its job should be to:

- summarize deterministic findings
- identify recurring recommendations
- compare historical runs
- explain tradeoffs

AI should interpret reports, not replace deterministic evaluation.

### Semantic Room Catalog

- Define semantic tags for public pages.
- Separate page identity from page URL.
- Let the planner choose pages by semantic intent instead of direct route references.

Do not work on this during the current website-improvement phase.

### Page Metadata v3

- Keep Page Metadata v3 as a later successor phase after real website cycles reveal a clear need.

## Historical Completed Framework Work

Stable v1 already includes:

- Persona v2 foundation
- Audit Mode and Journey Mode split
- scenario, archetype, and context-aware deterministic journeys
- explicit journey outcomes beyond boolean success
- overall audit, overall journeys, and combined handoff reports
- recommendation confidence and aggregate report summaries
- route-catalog validation
- richer route-skip, trust-signal, and outcome reporting

## Pause Framework Growth

Do not significantly expand Journey Mode or Audit Mode during the current phase.

Do not add:

- new personas
- new archetypes
- new scenarios
- AI features
- Semantic Room Catalog
- Page Metadata v3

Until real website work reveals a need, the framework should stay stable and quiet in the background.
