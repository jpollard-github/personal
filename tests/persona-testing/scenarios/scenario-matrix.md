# Scenario Matrix

Reference: Journey Mode v1

This document is the contract between:

- persona
- archetype
- scenario
- context

It is intentionally small.

The goal is not to model every possible mood or mission.

The goal is to provide a reusable set of scenarios that can drive deterministic journey selection without exploding the number of definitions.

---

## Global Scenarios

These scenarios are reusable across many personas.

### First Visit

- default start: `Homepage`
- goal: `Build orientation`
- target pages: `5`
- max pages: `7`
- common question:
  - what is this place and where should I go next?
- success if:
  - homepage is visited
  - and at least one orientation room is reached:
    - About
    - Updates
    - Search
    - Writings
    - Work With Me
- likely success exit:
  - `Continue Exploring`

### Looking For A Reason To Trust

- default start: `Homepage`
- goal: `Build confidence`
- target pages: `5`
- max pages: `7`
- common question:
  - is this person credible, genuine, or worth investing more attention in?
- success if:
  - About is visited
  - and at least one proof room is reached:
    - Build Log
    - Work With Me
    - Writings
    - Updates
- likely success exit:
  - `Bookmark`

### Looking For Something Specific

- default start: `Homepage`
- goal: `Complete task`
- target pages: `4`
- max pages: `6`
- common question:
  - can I get to the useful thing quickly?
- success if:
  - Search
  - or Work With Me
  - or Build Log
  - is reached
- likely success exit:
  - `Contact`

### Deciding Whether To Return

- default start: `Updates`
- goal: `Assess freshness`
- target pages: `4`
- max pages: `6`
- common question:
  - does this site stay alive enough to revisit?
- success if:
  - Updates is visited
  - and one living room is also visited:
    - Tiny Thoughts
    - Writings
    - Build Log
    - Music
- likely success exit:
  - `Return Later`

### Low Attention Visit

- default start: `Homepage`
- goal: `Avoid bounce`
- target pages: `4`
- max pages: `5`
- common question:
  - can this site orient me before I bounce?
- success if:
  - an orientation room is reached quickly:
    - About
    - Search
    - Work With Me
    - Updates
- likely success exit:
  - `Bookmark`

### Deep Browse

- default start: `Homepage`
- goal: `Reward curiosity`
- target pages: `7`
- max pages: `9`
- common question:
  - if I give this site more time, does it reward me?
- success if:
  - at least one deep or curiosity room is reached:
    - Writings
    - Music
    - Tiny Thoughts
    - Twin Peaks Self
    - Arcade
    - Between Two Lodges
- likely success exit:
  - `Continue Exploring`

### Returning After Time Away

- default start: `Updates`
- goal: `Discover change`
- target pages: `5`
- max pages: `7`
- common question:
  - what changed since I was last here?
- success if:
  - Updates is visited
  - and one freshness room is also visited:
    - Build Log
    - Tiny Thoughts
    - Writings
    - Music
- likely success exit:
  - `Return Later`

---

## Example Combinations

These are examples, not hard-coded one-off scenarios.

| Persona | Scenario | Archetype | Likely Journey |
| --- | --- | --- | --- |
| Potential Client | Looking For Something Specific | Hunter | Home -> Work With Me -> Search -> Build Log -> Updates |
| Potential Client | Looking For A Reason To Trust | Builder | Home -> Work With Me -> Build Log -> About -> Projects |
| Builder | First Visit | Builder | Home -> Build Log -> Search -> Projects -> Updates |
| Builder | Returning After Time Away | Wanderer | Updates -> Build Log -> Projects -> Music -> Home |
| Ideal Partner | First Visit | Romantic Reader | Home -> About -> Cats -> Writings -> Tiny Thoughts |
| Skeptic | Looking For A Reason To Trust | Scanner | Home -> About -> Build Log -> Writings |
| RSS Subscriber | Deciding Whether To Return | Hunter | Updates -> Writings -> Tiny Thoughts -> Build Log |
| Twin Peaks Fan | Deep Browse | Wanderer | Home -> Twin Peaks Self -> Between Two Lodges -> Movies & TV -> Music |

---

## Journey Mode v1 Rules

- cap journeys to roughly 4-7 pages
- let confidence and archetype modify `targetPages` without exceeding `maxPages`
- exclude admin pages by default
- start at homepage unless the scenario says otherwise
- prefer deterministic route selection over emergent behavior
- use persona preferences, ignored rooms, archetype, scenario, and confidence threshold together
- compute whether the scenario goal was actually satisfied
- end in an explicit exit state, not just a stop
- treat this as realistic path planning, not a full crawler

---

## What Comes Later

- context-specific variants like late-night vs lunch-break browsing
- memory for returning visits so repeat journeys can avoid stale repetition
- stronger search term generation
- bounce and trust scoring that reacts to the actual visited path
- AI reflection that evaluates whether the deterministic journey felt emotionally coherent
