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
  - shared helpers for persona parsing, route coverage, manifests, and report generation
- `tests/persona-testing/<persona-slug>/`
  - one folder per persona
  - include a standardized `profile.md`
- `tests/persona-testing/templates/`
  - reusable persona markdown templates and starter examples
- `tests/persona-testing/all-personas.spec.ts`
  - one manifest-driven Playwright suite that runs every persona and writes the combined aggregate report

## Recommended Persona Markdown Sections

These headings are optional, but keeping them roughly consistent will help future personas compare cleanly:

- `Who this person is`
- `Personality`
- `Emotional style`
- `Interests`
- `Work / curiosity`
- `Lifestyle`
- `Conversation starters`
- `Deal breakers`
- `Visual or usability preferences`

The current parser is forgiving. It only requires a title and plain markdown headings.

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

Good next personas for this site:

- `Fellow Programmer`
- `Reading Enthusiast`
- `Local Coffee / Bookstore Person`
- `Retro Arcade Friend`
- `Curious First-Date Visitor`
- `Potential Client`
- `Music Nerd`
- `Thoughtful Introvert`
- `Creative Technologist`
- `Returning Fan`

Each one should have distinct tastes, friction points, and things they hope to find quickly.

## How To Run

Run all persona suites:

```bash
npm run test:personas
```

Run only the current ideal partner persona:

```bash
npm run test:persona:ideal-partner
```

## Output

Persona reports are written to:

- `test-results/personas/<persona-slug>/report.md`
- `test-results/personas/<persona-slug>/summary.json`
- `test-results/personas/overall-persona/report.md`
- `test-results/personas/overall-persona/summary.json`

Screenshots for each visited surface are also stored in that folder.

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
