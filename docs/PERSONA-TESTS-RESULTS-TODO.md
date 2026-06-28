# PERSONA-TESTS-RESULTS-TODO.md

Generated: 2026-06-28T16:20:16.703Z

Website work starts here.

Framework work lives in `docs/PERSONA-TODO.md`.

Use `docs/README.md` if you need the broader documentation map.

The primary purpose of this document is improving the website for real visitors.

Deterministic journey metrics are evidence, not absolute truth.

If repeated human review and future analytics indicate the site has improved while specific route metrics remain flat, website quality should take precedence over optimizing individual planner routes.

When navigation improvements stabilize, shift primary development effort toward:

- new content
- better writing
- richer Build Log entries
- creative rooms
- ongoing publishing

Navigation should become incremental rather than continuous.

Use `docs/CONTENT-TODO.md` for the long-term publishing backlog.

## Current Read

- The framework is stable enough for ongoing website work.
- The first homepage/trust batches landed.
- Movies & TV reframing landed.
- Search and Twin Peaks improvements landed.
- Human review suggests several of these changes are useful even where deterministic metrics stayed flat.
- Do not spend more time forcing `/about` metrics unless human review shows a real discoverability problem.

## Current State

Framework:
Stable v1

Website:
Active development

Primary effort:
Content and website improvements

Future framework work:
Only when website use or analytics reveal a genuine limitation.

## Current Website Priorities

- New content
- Build Log updates
- Homepage polish
- Search refinement
- Creative-room cross-linking
- Better writing

## Recommended Work Order

1. New content
2. Build Log updates
3. Homepage polish
4. Search refinement
5. Creative-room cross-linking
6. Retest after each small batch

Why this order:

Navigation has improved enough that richer content will now provide greater value than additional navigation optimization.

## Validation Sources

Suggested priority:

1. Human review
2. Real visitor behavior (Vercel Analytics)
3. Persona simulation
4. Individual route metrics

If these disagree, investigate the disagreement rather than optimizing a single metric.

## Recommendation Lifecycle

Use these states when reviewing or updating recommendations:

- `Active`: currently worth implementing
- `Implemented`: shipped in the UI
- `Awaiting Retest`: shipped, but not yet re-evaluated
- `Validated`: shipped and supported by later evidence
- `Deferred`: intentionally not in the current batch
- `Planner Artifact`: likely driven more by route heuristics than real visitor friction

This keeps repeated recommendations from cluttering the active queue forever.

## Orientation

Goal:

Help first-time visitors quickly understand what ArcadeGhosts is and where to start.

Current status:

- `Implemented`: Homepage Start Here / calmer first screen
- `Implemented`: Homepage proof path improvements
- `Awaiting Retest`: homepage near-bounce pressure is still concentrated on `/`

Current TODOs:

- Review the first screen occasionally for density creep.
- Keep the opening summary plain-language and short.
- Keep the strongest personal, professional, and creative paths visible before denser room clusters.

## Trust

Goal:

Make Jason easy to understand as a person, not just a set of pages.

Current status:

- `Implemented`: About as trust hub
- `Implemented`: About ↔ Work With Me ↔ Build Log trust cluster
- `Implemented`: Work With Me → About
- `Implemented`: Build Log → About
- `Planner Artifact or Awaiting Retest`: `/about` misses remain flat even though human review says the path is clear

Current TODOs:

- Do not force `/about` harder unless fresh human review shows actual confusion.
- Keep About warm, reachable, and clearly linked to proof and next-step pages.
- Let multiple good trust paths exist.

## Professional Confidence

Goal:

Help potential clients, hiring managers, and skeptical professional visitors connect personality, proof, and next step.

Current status:

- `Implemented`: trust-cluster links
- `Implemented`: Build Log as proof path
- `Awaiting Retest`: Potential Client and Hiring Manager still resolve as `partial`

Current TODOs:

- Keep Work With Me, About, and Build Log coherent as a cluster.
- Refine practical proof and next-step language when website work naturally touches those pages.
- Treat flat trust-route metrics as mixed evidence, not automatic failure.

## Discovery

Goal:

Help visitors naturally find useful or intriguing rooms without relying on Search for everything.

Current TODOs:

- Keep homepage paths distinct and scannable.
- Use cross-links to connect related rooms with intention.
- Add new content that gives the site more natural discovery value.

## Search

Goal:

Keep Search useful for hunters and returning visitors without making it the only efficient way to navigate.

Current status:

- `Implemented`: Search helper framing and quick links

Current TODOs:

- Watch whether Search still substitutes for weak navigation.
- Refine suggested searches or helper language if later evidence says it needs another pass.
- Keep professional paths reachable without Search.
- Keep returning-visitor paths reachable without Search.

## Creative Rooms

Goal:

Make the strange, personal, and niche parts of ArcadeGhosts feel connected rather than isolated.

Current status:

- `Implemented`: Movies & TV reframing
- `Implemented`: first Twin Peaks cross-linking pass
- `Deferred or niche by design`: arcade/game routes may stay intentionally less central

Current TODOs:

- Keep Twin Peaks Self, Between Two Lodges, Movies & TV, and related weird rooms cross-linked with taste.
- Review whether `/arcade` should stay niche or get one clearer path from a related room.
- Prefer a few meaningful cross-links over heavy-handed route forcing.

## Returning Visitors

Goal:

Give people reasons to come back and easy ways to find what is new.

Current TODOs:

- Add new writing and essays.
- Keep Build Log active and visible.
- Keep updates, Tiny Thoughts, and related freshness paths easy to reach.
- Later compare returning-visitor behavior against persona assumptions.

## Future Retests

Working rhythm:

1. Pick one navigation improvement OR one content improvement.
2. Implement them.
3. Run `npm run test:users:fast`.
4. Review recommendations.
5. Update TODOs.
6. Perform human review.
7. Later compare against Vercel Analytics.
8. Repeat.

When reviewing results:

- Prefer real website quality over route obedience.
- Treat repeated flat metrics as a possible planner artifact when human review says the experience is clear.
- Only reopen old recommendations if new evidence shows real friction.
- Avoid implementing many unrelated changes before retesting.

## Current Completed Work

- Homepage Start Here / calmer first screen
- About as trust hub
- About ↔ Work With Me ↔ Build Log trust cluster
- Work With Me → About
- Build Log → About
- Homepage proof path improvements
- Movies & TV reframing
- Search support first pass
- Twin Peaks cross-linking first pass

## Recommended Next Website Batch

- Publish new writing or a new essay
- Add a richer Build Log entry
- Polish homepage density only where it starts to creep back in
- Add or improve one tasteful creative-room cross-link
