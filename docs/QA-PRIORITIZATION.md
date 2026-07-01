# QA PRIORITIZATION

Browser and device QA should be guided by real visitor behavior, not just guesswork.

## Why

ArcadeGhosts already has strong screenshot review and route-by-route QA habits. The next improvement is deciding where to spend manual testing time based on actual traffic and interaction patterns.

## Primary Inputs

Use these in order:

1. `Vercel Analytics`
   High-level traffic and route popularity.
2. `PostHog`
   CTA clicks, route flow, browser/device mix, and viewport context.
3. `docs/MANUAL-QA.md`
   Final manual evidence and pass/fail notes.
4. `review-packets/latest-site-review`
   Visual baseline and screenshot history.

## What To Look For

Prioritize extra QA when data shows:

- a route gets meaningful traffic
- a route gets strong CTA interest
- a route has many mobile visitors
- one browser family dominates
- one viewport range appears often
- a route is part of the professional funnel such as `/work-with-me`

## Suggested QA Priority Order

- highest traffic routes first
- highest CTA/conversion-intent routes next
- browser/device combinations with meaningful real traffic next
- low-traffic novelty rooms last unless they visibly break

## Examples

- If `/work-with-me` gets recurring mobile visits but weak `intake_form_click` activity, re-check mobile CTA visibility and tap comfort before redesigning copy.
- If homepage project cards get clicks mostly from mobile Safari, prioritize iPhone Safari QA on `/` and downstream project destinations.
- If `/search` is heavily used on narrow viewports, give keyboard, input, and result-card comfort more testing attention.
- If guestbook interaction is close to zero for a long period, do not keep giving it outsized QA time.

## Review Rhythm

- after major UX or mobile phases
- after notable traffic shifts
- before spending money on broader device-cloud testing
- before broad redesign work triggered by hunches alone

## Rule Of Thumb

Use taste to shape the site, and use analytics to decide where QA attention is worth the time.
