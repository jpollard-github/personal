# MANUAL-QA

Use this document for Phase 11 final QA evidence and notes.

Scope:

- final sanity pass only
- no redesign work
- record clear pass/fail evidence
- capture only issues that are real, reproducible, and worth fixing before calling mobile done

## Phase 11 Route Set

- `/`
- `/work-with-me`
- `/search`
- `/updates`
- `/writings`
- `/tiny-thoughts`
- `/music`
- `/about`
- `/arcade`
- `/movies-tv`
- `/cats/beverly-and-lucinda`

## What To Check On Every Route

- horizontal overflow
- clipped text
- blocked taps
- nav/header comfort
- CTA tap comfort
- fixed logo/floating chrome interference
- long-scroll readability
- card/image layout stability

## How To Use This File

For each browser/device section below:

1. Check the route list in priority order.
2. Mark `Pass`, `Issue`, or `Not Checked`.
3. Add one short note only when something is worth preserving as evidence.
4. Link screenshots, videos, or exported notes when available.

Suggested verdict labels:

- `Pass`
- `Pass with minor notes`
- `Issue found`
- `Not checked`

## Result Template

Copy this block when you need extra device rows or a follow-up rerun.

```md
### Device / Browser

Date:
Tester:
Build / URL:
Verdict:
Assets:

| Route | Verdict | Notes |
| --- | --- | --- |
| `/` |  |  |
| `/work-with-me` |  |  |
| `/search` |  |  |
| `/updates` |  |  |
| `/writings` |  |  |
| `/tiny-thoughts` |  |  |
| `/music` |  |  |
| `/about` |  |  |
| `/arcade` |  |  |
| `/movies-tv` |  |  |
| `/cats/beverly-and-lucinda` |  |  |

#### Issues To Fix

- None yet.
```

## iPhone Safari

### Target

- smallest available iPhone Safari
- standard-size iPhone Safari
- large iPhone Safari if available

### Results

Date:
Tester:
Build / URL:
Verdict:
Assets:

| Route | Verdict | Notes |
| --- | --- | --- |
| `/` | Not checked |  |
| `/work-with-me` | Not checked |  |
| `/search` | Not checked |  |
| `/updates` | Not checked |  |
| `/writings` | Not checked |  |
| `/tiny-thoughts` | Not checked |  |
| `/music` | Not checked |  |
| `/about` | Not checked |  |
| `/arcade` | Not checked |  |
| `/movies-tv` | Not checked |  |
| `/cats/beverly-and-lucinda` | Not checked |  |

### Issues To Fix

- None recorded yet.

## iPhone Chrome

### Results

Date:
Tester:
Build / URL:
Verdict:
Assets:

| Route | Verdict | Notes |
| --- | --- | --- |
| `/` | Not checked |  |
| `/work-with-me` | Not checked |  |
| `/search` | Not checked |  |
| `/updates` | Not checked |  |
| `/writings` | Not checked |  |
| `/tiny-thoughts` | Not checked |  |
| `/music` | Not checked |  |
| `/about` | Not checked |  |
| `/arcade` | Not checked |  |
| `/movies-tv` | Not checked |  |
| `/cats/beverly-and-lucinda` | Not checked |  |

### Issues To Fix

- None recorded yet.

## Desktop Chrome

### Results

Date:
Tester:
Build / URL:
Verdict:
Assets:

| Route | Verdict | Notes |
| --- | --- | --- |
| `/` | Not checked |  |
| `/work-with-me` | Not checked |  |
| `/search` | Not checked |  |
| `/updates` | Not checked |  |
| `/writings` | Not checked |  |
| `/tiny-thoughts` | Not checked |  |
| `/music` | Not checked |  |
| `/about` | Not checked |  |
| `/arcade` | Not checked |  |
| `/movies-tv` | Not checked |  |
| `/cats/beverly-and-lucinda` | Not checked |  |

### Issues To Fix

- None recorded yet.

## Desktop Safari

### Results

Date:
Tester:
Build / URL:
Verdict:
Assets:

| Route | Verdict | Notes |
| --- | --- | --- |
| `/` | Not checked |  |
| `/work-with-me` | Not checked |  |
| `/search` | Not checked |  |
| `/updates` | Not checked |  |
| `/writings` | Not checked |  |
| `/tiny-thoughts` | Not checked |  |
| `/music` | Not checked |  |
| `/about` | Not checked |  |
| `/arcade` | Not checked |  |
| `/movies-tv` | Not checked |  |
| `/cats/beverly-and-lucinda` | Not checked |  |

### Issues To Fix

- None recorded yet.

## Desktop Firefox

### Results

Date:
Tester:
Build / URL:
Verdict:
Assets:

| Route | Verdict | Notes |
| --- | --- | --- |
| `/` | Not checked |  |
| `/work-with-me` | Not checked |  |
| `/search` | Not checked |  |
| `/updates` | Not checked |  |
| `/writings` | Not checked |  |
| `/tiny-thoughts` | Not checked |  |
| `/music` | Not checked |  |
| `/about` | Not checked |  |
| `/arcade` | Not checked |  |
| `/movies-tv` | Not checked |  |
| `/cats/beverly-and-lucinda` | Not checked |  |

### Issues To Fix

- None recorded yet.

## Optional Sauce Labs / Cloud Device Pass

Use this only if you want extra device confidence beyond local manual QA.

### Suggested Devices

- iPhone Safari, smallest available
- iPhone Safari, standard-size
- iPhone Safari, large-size
- Android Chrome baseline

### Results

Date:
Tester:
Build / URL:
Verdict:
Assets:

| Device / Browser | Routes checked | Verdict | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

### Asset Location

- `reports/manual-device-qa/phase-11-saucelabs/`

### Issues To Fix

- None recorded yet.

## Phase 11 Completion Rule

Do not mark Phase 11 complete in `docs/MOBILE-TODO.md` until at least one real manual results section above is filled in with actual verdicts and evidence.

## Phase 12 Reminder

Phase 12 stays provisional until Phase 11 is completed and any final mobile fixes are rechecked against desktop.
