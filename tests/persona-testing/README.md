# Persona Testing

Persona testing sits beside normal regression tests.

Use it when you want a simulated kind of visitor to walk the site, inspect public and admin surfaces, and produce a structured feedback report instead of only pass/fail assertions.

## Why This Exists

Normal e2e tests answer:

- does the page load?
- does the main flow still work?

Persona tests answer:

- would this kind of person feel oriented here?
- what looks interesting, overwhelming, cold, confusing, or inviting?
- what should be improved next for this audience?

## Current Structure

- `tests/persona-testing/support/`
  - shared helpers for persona parsing, route coverage, manifests, scenarios, journey planning, and report generation
- `tests/persona-testing/archetypes/`
  - reusable browsing behavior layers such as `hunter`, `reader`, `scanner`, `wanderer`, `builder`, and `romantic`
- `tests/persona-testing/scenarios/`
  - reusable scenario docs such as the Journey Mode v1 scenario matrix
- `tests/persona-testing/personas/<persona-slug>/`
  - one folder per persona
  - include a standardized `profile.md`
- `tests/persona-testing/templates/`
  - reusable persona markdown templates and starter examples
- `tests/persona-testing/all-personas.spec.ts`
  - one manifest-driven Playwright suite that runs every persona and writes the combined aggregate report
- `tests/persona-testing/journey-mode.spec.ts`
  - focused end-to-end checks for deterministic journey mode

## Recommended Persona Markdown Sections

These headings are optional, but the system is now moving toward a v2 split:

- `Identity Fields`
- `Behavior Fields`
- `Evaluation Fields`

Good subsections inside those areas include:

- `Default archetype`
- `Scenario`
- `Context`
- `Confidence threshold`
- `Preferred rooms`
- `Ignored rooms`
- `First-visit behavior`
- `Trust signals`
- `Red flags`
- `Return triggers`

The current parser is forgiving. It only requires a title and plain markdown headings.

Archetypes are stored separately from personas on purpose.

The long-term direction is:

- persona = who this person is
- archetype = how they browse
- scenario = why they are here today
- context = what conditions shape this session

## What Gets Covered

The persona runner is no longer limited to a short fixed route list.

It now covers:

- core public rooms
- admin rooms
- writing detail pages discovered from `app/writings.ts`
- internal project destinations discovered from the public project registry
- error preview pages

This keeps future persona runs closer to "walk the real site" instead of "walk a hand-picked demo subset."

## Persona Ideas To Generate Next

Current persona set:

- `Ideal Partner`
- `Potential Client`
- `Skeptic`
- `Builder`
- `Creative Technologist`
- `Fellow Programmer`
- `Hiring Manager`
- `Reading Enthusiast`
- `Local Coffee / Bookstore Person`
- `Lonely Internet Person`
- `Retro Arcade Friend`
- `Curious First-Date Visitor`
- `Music Nerd`
- `RSS Subscriber`
- `Thoughtful Introvert`
- `Returning Fan`
- `Twin Peaks Fan`

Starter archetypes currently imported:

- `Hunter`
- `Reader`
- `Scanner`
- `Wanderer`
- `Builder`
- `Romantic`

## How To Run

Run all persona suites:

```bash
npm run test:personas
```

Run a faster public-only audit pass:

```bash
npm run test:personas:fast
```

Run both user-facing persona suites together:

```bash
npm run test:users
```

Run a faster public-only user-facing pass:

```bash
npm run test:users:fast
```

Run only the current ideal partner persona:

```bash
npm run test:persona:ideal-partner
```

Run the journey-mode spec directly:

```bash
npx playwright test -c playwright.personas.config.ts tests/persona-testing/journey-mode.spec.ts
```

## Output

Persona reports are written to the durable `persona-results/` folder:

- `persona-results/personas/<persona-slug>/report.md`
- `persona-results/personas/<persona-slug>/summary.json`
- `persona-results/personas/overall-audit/report.md`
- `persona-results/personas/overall-audit/summary.json`

Screenshots for each visited surface are also stored in that folder.

Journey reports are written to:

- `persona-results/personas/<persona-slug>/journeys/<scenario-id>.md`
- `persona-results/personas/<persona-slug>/journeys/<scenario-id>.json`
- `persona-results/personas/overall-journeys/report.md`
- `persona-results/personas/overall-journeys/summary.json`

Combined handoff artifacts are written to:

- `persona-results/personas/overall-personas-and-journeys/report.md`
- `persona-results/personas/overall-personas-and-journeys/summary.json`
- `persona-results/personas/overall-personas-and-journeys/combined-bundle.json`

Playwright still writes its own transient traces and test artifacts under `test-results/`. The persona reports live separately so a later Playwright run does not wipe long-running persona output.

## Notes On AI

AI is optional for the first version.

This framework is intentionally useful without AI:

- route coverage is deterministic
- page observations are reproducible
- report structure is stable

AI becomes valuable later if you want:

- richer narrative feedback
- screenshot-aware visual critique
- automated tone or copy suggestions
- comparative summaries across multiple personas

## Current Limitation

Right now the system has both:

- full-surface audit mode
- a first deterministic Journey Mode v1

Journey Mode v1 is intentionally small:

- public-only by default
- representative fast-suite coverage across practical, personality, trust, return, and fandom journeys
- confidence-sensitive page budgets:
  - low: roughly 5-7 pages
  - medium: roughly 4-6 pages
  - high: roughly 2-5 pages
- scenario-driven start point
- optional but behavior-sensitive search use
- confidence-sensitive action gating for routes like `Work With Me` or `Updates`
- scenario goals and success conditions
- explicit exit states like `bookmark`, `contact`, or `return-later`
- deterministic route selection

It is useful, but still early.

The next architectural step is to make journey behavior more expressive through stronger archetype modules, context handling, and richer scenario coverage while keeping the full audit intact.

Both modes are now driven by:

- persona
- archetype
- scenario
- context

## Speed Controls

Persona screenshots are now off by default.

If you want screenshot capture for visual review, run persona tests with:

```bash
PERSONA_CAPTURE_SCREENSHOTS=1 npm run test:personas
```

Admin surfaces are included in the normal audit path and skipped in the `:fast` scripts.

## Recommended Rhythm

Use:

```bash
npm run test:users:fast
```

for normal iteration.

Use:

```bash
npm run test:personas
```

periodically for fuller audit coverage, including admin surfaces.

Use:

```bash
PERSONA_CAPTURE_SCREENSHOTS=1 npm run test:users
```

only when you want a deeper visual review packet.

Screenshots are best reserved for:

- visual design reviews
- homepage density or layout questions
- brand / OG / card-style checks
- before / after comparisons
- occasional full review packets

Admin pages are useful for private system health and regression checking, not normal public-visitor simulation.
