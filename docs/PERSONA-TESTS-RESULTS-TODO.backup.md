# PERSONA-TESTS-RESULTS-TODO.backup.md

Generated: 2026-06-30T01:29:44.787Z

Website work starts here.

Framework work lives in `docs/PERSONA-TODO.md`.

Start with the highest-confidence active website items.

Pick 1–3 website TODOs, implement them, then re-run `npm run test:users:fast`.

Address high-confidence website TODOs before expanding the persona engine.

This is the canonical handoff from persona testing into ArcadeGhosts website work.

The goal is not to preserve every raw audit note. The goal is to turn repeated evidence into a practical product backlog that can be implemented, re-tested, and measured over time.

## Recommended Work Order

1. Search support without over-reliance
2. Twin Peaks cross-linking
3. Arcade / games visibility if still relevant
4. Retest after each small batch
5. Lower-confidence items only after retesting

## Current Status

- First website batch: completed
- Second trust-routing pass: completed
- Movies & TV reframing: completed
- Human review says the trust links are clearly exposed enough for real visitors.
- The deterministic trust-route metrics may still reflect planner expectations, route-budget behavior, and the difference between route visited versus route exposed.
- Pause additional `/about` route forcing unless future evidence shows a real discoverability problem.

## Current Focus

Keep the next pass focused on:

- Search support without over-reliance
- Twin Peaks cross-linking
- Arcade / games visibility if still relevant
- retest after each small batch

## First Implementation Batch

Recommended first batch:

- Homepage Start Here block
- About trust-hub links
- Trust Cluster links among About, Work With Me, and Build Log

This batch is intentionally small so results can be measured cleanly on the next persona rerun.

Status note:

- [x] Homepage Start Here / calmer first screen landed in the UI
- [x] About trust-hub links landed in the UI
- [x] Trust-cluster links among About, Work With Me, and Build Log landed in the UI
- [x] First website batch completed
- [ ] Deterministic trust-route metrics have not improved yet

## Second Trust-Routing Pass

- [x] Work With Me → About was strengthened
- [x] Build Log → About was strengthened
- [x] Homepage proof path now points toward `/build-log`
- [x] Human review says this path is clear
- [ ] Deterministic trust-route metrics have not improved yet

## Completed But No Longer Active

- Homepage Start Here / calmer first screen
- Trust cluster initial implementation
- Work With Me → About
- Build Log → About
- Movies & TV reframing

## Retest Workflow

1. Pick 1–3 website TODOs.
2. Implement them.
3. Run `npm run test:users:fast`.
4. Compare new results against prior results.
5. Update `docs/PERSONA-TESTS-RESULTS-TODO.backup.md`.
6. Only then consider framework changes.

## Retest Target

After the first implementation batch, run:

`npm run test:users:fast`

Expected improvements:

- lower homepage near-bounce pressure
- fewer `/about` expected-route misses
- stronger Potential Client / Hiring Manager trust journeys
- clearer professional path without relying entirely on Search
- improved confidence in `docs/PERSONA-TESTS-RESULTS-TODO.backup.md` priorities

Current read after this pass:

- The major homepage, trust-cluster, and Movies & TV UI work is implemented.
- Some deterministic recommendations may still reference already-completed work.
- When that happens, interpret them as "implemented but not yet reflected in deterministic metrics" unless fresh human review shows continued friction.

## Homepage

- [ ] No recurring action item is strong enough here yet.

## About

- [x] High Priority · Low Confidence · Evidence count: `2`
  Affected visitors: `Potential Client`; scenarios: `Looking For A Reason To Trust`
  Suggested improvement: Make the About page easier to reach from the homepage, Work With Me, and Build Log; position it as the human trust hub; and add clear paths onward to writing, cats, music, projects, and Work With Me.
  Expected benefit: Improves credibility for trust-seeking visitors and makes professional journeys feel more complete before they decide whether to continue.
  Acceptance criteria:
  - [ ] About is easy to reach from homepage.
  - [ ] About links to Writings, Cats, Music, Projects, Build Log, and Work With Me.
  - [ ] About explains Jason as both person and builder.
  - [ ] Professional visitors can move from About to proof or next-step pages.
  - [ ] Personal visitors can move from About to warm or creative pages.
  Current note:
  - Human review says this path is clear. Treat this as implemented but not yet reflected in deterministic metrics, and pause unless future evidence shows continued friction.

## Projects

- [ ] No recurring action item is strong enough here yet.

## Build Log

- [ ] No recurring action item is strong enough here yet.

## Music

- [ ] No recurring action item is strong enough here yet.

## Writings

- [ ] No recurring action item is strong enough here yet.

## Tiny Thoughts

- [ ] No recurring action item is strong enough here yet.

## Cats

- [ ] No recurring action item is strong enough here yet.

## Twin Peaks

- [ ] No recurring action item is strong enough here yet.

## Search

- [ ] No recurring action item is strong enough here yet.

## Navigation

- [ ] No recurring action item is strong enough here yet.

## Cross-linking

- [x] High Priority · Low Confidence · Evidence count: `2`
  Affected visitors: `Potential Client`; scenarios: `Looking For A Reason To Trust`
  Suggested improvement: Treat About, Work With Me, and Build Log as one trust cluster with visible cross-links, and make each page explain why the others matter so proof, personality, and next steps reinforce each other.
  Expected benefit: Makes client and hiring-manager journeys feel more coherent and lowers the odds of a technically impressive but emotionally incomplete visit.
  Current note:
  - Implemented but not yet reflected in deterministic metrics. Human review says this trust cluster is clear, so pause unless future evidence shows continued friction.

## Overall UX

- [ ] No recurring action item is strong enough here yet.

## Trust Cluster

The trust cluster is:

- About
- Work With Me
- Build Log
- Projects / Updates when relevant

Working definition:

- Professional visitors should not have to rely on Search to connect proof, personality, and next steps.

TODOs:

- [ ] Add visible cross-links between About, Work With Me, Build Log, and relevant Projects / Updates surfaces.
- [ ] Make each trust-cluster page explain why the other pages matter.
- [ ] Make it easy to move from personality to proof to next step without losing context.
- [ ] Professional visitors should not have to rely on Search to connect personality, proof, and next step.

Acceptance criteria:

- [ ] About, Work With Me, and Build Log cross-link visibly.
- [ ] Work With Me points to proof of active building.
- [ ] Build Log points to human context / About.
- [ ] About points to Work With Me without becoming salesy.
- [ ] Professional visitors do not have to rely on Search to connect personality, proof, and next step.
