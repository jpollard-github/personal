# MOBILE-TODO

`docs/MOBILE-TODO.md` is the single source of truth for ArcadeGhosts mobile work.

Use it to decide what to fix next, what evidence to review, and what should be considered complete before moving on. Each packet should represent one focused, reviewable improvement pass rather than a broad redesign.

Guiding principles:

- preserve personality
- preserve the Twin Peaks / retro / arcade identity
- do not over-polish into a generic portfolio
- prioritize readability
- prioritize accessibility
- prefer many small improvements over one giant redesign

Current sequence for review:

1. `docs/MOBILE-TODO.md`
2. `review-packets/latest-site-review/MOBILE-REVIEW.md`
3. `review-packets/latest-site-review/screenshots/viewport/mobile-home.jpg`
4. `review-packets/latest-site-review/REVIEW.md`

## Phase 1 — Homepage First Viewport

### Goal

Make the opening mobile homepage feel readable, deliberate, and emotionally legible within 10 seconds without flattening the site’s personality. The top of the page should signal who Jason is, what kind of site this is, and where to go next without logo/nav/hero collisions or CTA confusion.

### Checklist

- [x] `[P0]` Reduce top-of-page crowding on mobile.
- [x] `[P0]` Keep the logo, nav, and hero from colliding visually.
- [x] `[P0]` Make the homepage message understandable within 10 seconds.
- [x] `[P0]` Ensure the first CTA group is readable and tappable.
- [x] `[P1]` Verify no obvious horizontal overflow in the opening viewport.

### Review Criteria

- The first viewport reads as one intentional composition instead of a stack of competing chrome.
- The hero headline is large but not chaotic.
- The top CTA group is fully visible and clearly tappable.
- The nav feels present without overwhelming the hero.
- The page still feels like ArcadeGhosts instead of a generic portfolio template.

### Evidence

- `screenshots/viewport/mobile-home.jpg`
- `screenshots/viewport/mobile-work-with-me.jpg`
- `reports/mobile-review-index.json`
- `reports/screenshot-summary.json`

### Known Issues

- The homepage full-page screenshot is now intentionally height-capped in packets because the page is extremely tall on mobile.
- The horizontal nav strip should still be spot-checked on real devices as future changes land.
- Desktop should keep being checked after each mobile pass because layout primitives are still shared.

### Future Ideas

- Replace the horizontal pill strip with a stronger mobile-specific navigation pattern if the current strip keeps feeling crowded after later polish.
- Revisit whether the hero needs a lighter-weight secondary CTA on very small devices.

Status:

Complete

## Phase 2 — Homepage Full Scroll

### Goal

Make the full mobile homepage scroll feel paced and intentional from hero through deeper sections. Success here means the page stays readable, sections breathe, and the long scroll feels curated rather than dense or repetitive.

### Checklist

- [x] `[P0]` Review section spacing rhythm across the homepage long scroll.
- [x] `[P0]` Reduce dense stacks or abrupt transitions between adjacent sections.
- [x] `[P1]` Confirm cards, grids, and bridges do not feel cramped on narrow screens.
- [x] `[P1]` Decide whether any homepage modules should collapse, preview, or reorder differently on small screens.
- [ ] `[P2]` Trim any decorative content that adds noise before it adds value.

### Review Criteria

- Scrolling the homepage should feel smooth and digestible instead of exhausting.
- No section should feel accidentally glued to the previous one.
- Dense content blocks should still be scannable on iPhone-sized screens.
- Important sections should appear in a sensible order for first-time visitors.

### Evidence

- `screenshots/mobile-home.jpg`
- `screenshots/viewport/mobile-home.jpg`
- `screenshots/mobile-about.jpg`
- `screenshots/mobile-music.jpg`
- `screenshots/mobile-writings.jpg`

### Known Issues

- The homepage is tall enough that packet full-page capture uses a capped-height fallback.
- Later homepage modules have not yet had the same mobile attention as the hero area.
- The featured project spotlight card is still text-heavy on mobile even after the spacing pass.
- Section screenshots still show the floating ghost logo because it is fixed; that is a capture artifact to keep in mind during isolated section review.

### Future Ideas

- Experiment with shortened previews for some homepage modules on mobile.
- Consider whether one or two sections should move behind “continue exploring” style transitions.

### Exit Criteria

- The homepage scroll feels paced instead of sprawling.
- Major homepage sections read as previews instead of overloaded archives.
- Section spacing feels intentional on a phone-sized screen.
- No obvious desktop regression appears in the homepage hero or early section rhythm.

### Known Dependencies

- Phase 2 should settle before Phase 3, because the homepage is still the main orientation path into `/work-with-me`.
- Phase 6 will still need to validate any spacing/tap-target assumptions from this phase on real devices.

Next recommended work:

- Start Phase 3 with the `/work-with-me` mobile header, first-screen offer clarity, and CTA hierarchy.

Status:

Ready For Review

## Phase 3 — Work With Me Mobile Conversion Path

### Goal

Make `/work-with-me` feel clear, confident, and easy to act on from the first mobile screen through the primary CTA path. The page should communicate what Jason helps with, who should reach out, and what action to take without heavy scanning effort.

### Checklist

- [ ] `[P0]` Keep the page header readable without giant line breaks.
- [ ] `[P0]` Improve first-screen clarity of what Jason does and who the page is for.
- [ ] `[P1]` Make CTA blocks, proof, and trust signals easy to scan.
- [ ] `[P1]` Check whether sticky or fixed UI interrupts reading.
- [ ] `[P2]` Tighten any sections that feel more decorative than persuasive on mobile.

### Review Criteria

- A compatible client should understand the offer quickly.
- The first CTA path should be visible and non-awkward on mobile.
- The page should feel personal and human, not salesy or confused.
- The typography should not force dramatic line breaks in the header.

### Evidence

- `screenshots/viewport/mobile-work-with-me.jpg`
- `screenshots/mobile-work-with-me.jpg`
- `reports/mobile-review-index.json`

### Known Issues

- This page has only had light first-viewport review so far.
- It is still likely carrying desktop spacing assumptions in deeper sections.

### Future Ideas

- Add a mobile-first CTA/proof order if the current desktop-first sequence keeps underperforming.
- Consider simplifying or compressing supporting sections for smaller screens.

Status:

Not Started

## Phase 4 — About / Music / Writings Readability

### Goal

Improve the reading experience on the more text-driven personality pages so they stay expressive without becoming tiring on mobile. These pages should preserve voice while making long-form reading, section hierarchy, and media rhythm feel thoughtful.

### Checklist

- [ ] `[P0]` Tighten long-form typography where needed.
- [ ] `[P1]` Review heading sizes and section spacing.
- [ ] `[P1]` Make sure cards, lists, and dense modules still breathe.
- [ ] `[P1]` Review whether decorative or side content pushes core reading too far down.
- [ ] `[P2]` Normalize inconsistencies between content-heavy pages where it helps comprehension.

### Review Criteria

- Long text blocks remain readable without giant walls of copy.
- Headings create a clear reading ladder.
- Media and cards support the reading flow instead of interrupting it.
- Each page still feels like itself rather than being over-normalized.

### Evidence

- `screenshots/viewport/mobile-about.jpg`
- `screenshots/viewport/mobile-music.jpg`
- `screenshots/viewport/mobile-writings.jpg`
- `screenshots/mobile-about.jpg`
- `screenshots/mobile-music.jpg`
- `screenshots/mobile-writings.jpg`

### Known Issues

- These routes have not been deeply reviewed yet after the homepage pass.
- There is a risk of overcorrecting personality pages into generic text columns.

### Future Ideas

- Add page-specific mobile refinements rather than forcing one universal content layout.
- Revisit image/text sequencing on the most editorial pages.

Status:

Not Started

## Phase 5 — Cats / Arcade / Personality Pages

### Goal

Protect the site’s playful, weird, and personal pages on mobile while reducing clutter and accidental awkwardness. These routes should still feel charming and specific, but with better spacing, less intrusion, and stronger content hierarchy.

### Checklist

- [ ] `[P0]` Preserve personality without turning the pages into mobile clutter.
- [ ] `[P1]` Check image, gallery, and card density on narrow screens.
- [ ] `[P1]` Review playful fixed or floating elements for intrusion.
- [ ] `[P2]` Tighten route-specific oddities that weaken readability.

### Review Criteria

- The pages feel fun and alive, not chaotic or cramped.
- Media-heavy areas are still navigable with thumbs.
- Floating ornaments do not block reading or taps.

### Evidence

- `screenshots/mobile-cats-beverly-and-lucinda.jpg`
- `screenshots/mobile-arcade.jpg`
- `screenshots/mobile-movies-tv.jpg`

### Known Issues

- These pages are likely to expose route-specific quirks that shared mobile fixes will not solve.

### Future Ideas

- Create route-local mobile exceptions where personality depends on layout.
- Explore lighter decorative treatments on smaller screens.

Status:

Not Started

## Phase 6 — Accessibility, Performance, Tap Targets, Horizontal Overflow

### Goal

Catch the usability issues that visual review can miss: uncomfortable tap targets, clipped content, unexpected overflow, and mobile-only performance strain. This phase should make the site safer to use across real devices without changing its overall visual language.

### Checklist

- [ ] `[P0]` Check for accidental overflow, clipping, and hidden text.
- [ ] `[P0]` Check all primary taps and pills for usable touch targets.
- [ ] `[P1]` Check text sizing and line length on small screens.
- [ ] `[P1]` Watch for large decorative modules that may create mobile-only performance issues.
- [ ] `[P2]` Note routes that need dedicated accessibility follow-up later.

### Review Criteria

- No obvious clipped text or off-screen controls remain.
- Primary interactions are finger-friendly.
- Text stays readable without zooming.
- No route feels unusually heavy or janky compared with the rest of the site.

### Evidence

- `reports/screenshot-summary.json`
- `reports/route-status.json`
- browser/device spot checks

### Known Issues

- Screenshot review alone will not catch every tap-target or scrolling issue.
- Taller pages may need direct device checks to confirm comfort.

### Future Ideas

- Add accessibility and performance-specific tooling to the review packet later.
- Include route-level notes for reduced-motion and keyboard sanity checks.

Status:

Not Started

## Phase 7 — Regression Review And Screenshot Comparison

### Goal

Make each mobile change easy to verify and easy to trust. This phase is about disciplined comparison between packets so progress stays incremental, clear, and safe for both mobile and desktop.

### Checklist

- [ ] `[P0]` Generate a fresh local mobile packet after each meaningful batch.
- [ ] `[P0]` Compare viewport screenshots first, then full-page screenshots.
- [ ] `[P1]` Record what changed in `reports/codex-report.md`.
- [ ] `[P1]` Confirm desktop still looks intentional after mobile changes.
- [ ] `[P2]` Keep packet notes clear enough that the next session can resume quickly.

### Review Criteria

- Each pass produces evidence, not just code changes.
- Desktop regressions are caught early.
- The current packet clearly communicates what improved and what still needs work.

### Evidence

- `reports/codex-report.md`
- latest mobile review packet screenshots
- desktop viewport screenshots for comparison

### Known Issues

- This discipline is easy to skip when visual fixes seem small.

### Future Ideas

- Add side-by-side diff helpers later if packets become numerous.

Status:

In Progress

## Phase 8 — Typography Polish

### Goal

Polish the site’s mobile typography so it feels more deliberate and consistent across routes. This phase should refine the reading experience and CTA hierarchy without neutralizing the site’s voice.

### Checklist

- [ ] `[P1]` Normalize heading scale across key routes.
- [ ] `[P1]` Review paragraph width and long-line discomfort.
- [ ] `[P1]` Tighten spacing rhythm around headings, copy, and calls to action.
- [ ] `[P1]` Review line-height for both hero copy and longer editorial sections.
- [ ] `[P2]` Refine CTA hierarchy where type weight or size competes awkwardly.
- [ ] `[P2]` Review icon sizing relative to adjacent text and pills.

### Review Criteria

- Heading hierarchy feels consistent without flattening route personality.
- Long-form text is easier to read for sustained scrolling.
- CTA emphasis feels intentional rather than oversized by accident.

### Evidence

- `screenshots/viewport/mobile-home.jpg`
- `screenshots/viewport/mobile-about.jpg`
- `screenshots/viewport/mobile-writings.jpg`
- `screenshots/mobile-work-with-me.jpg`

### Known Issues

- Type problems are likely to overlap with Phase 2 and Phase 3 fixes.

### Future Ideas

- Introduce route-local typography tweaks where tone demands it.

Status:

Not Started

## Phase 9 — Navigation Polish

### Goal

Refine mobile navigation until it feels lighter, clearer, and more touch-friendly. This phase should reduce friction without overengineering a new nav system before it is necessary.

### Checklist

- [ ] `[P1]` Review active state clarity.
- [ ] `[P1]` Tighten scrolling behavior and momentum feel.
- [ ] `[P1]` Recheck overflow and clipped-edge perception.
- [ ] `[P1]` Confirm touch friendliness on smaller devices.
- [ ] `[P2]` Reduce visual weight where the nav competes too much with page content.

### Review Criteria

- The nav is easy to use without dominating the viewport.
- The active/current state is obvious enough.
- Horizontal navigation feels intentional instead of compromised.

### Evidence

- `screenshots/viewport/mobile-home.jpg`
- direct device spot checks on the homepage and other top-level pages

### Known Issues

- The current nav strip is working better but is still a compromise pattern.

### Future Ideas

- Move to a different mobile nav model if later phases show the strip is still too heavy.

Status:

Not Started

## Phase 10 — Component Consistency

### Goal

Review reusable UI building blocks across mobile routes so the site feels cohesive without becoming monotonous. The goal is consistency of behavior and spacing, not sameness of personality.

### Checklist

- [ ] `[P1]` Review cards.
- [ ] `[P1]` Review buttons.
- [ ] `[P1]` Review pills and badges.
- [ ] `[P1]` Review panels and surface treatments.
- [ ] `[P1]` Review quote blocks and code blocks.
- [ ] `[P1]` Review media sections and image layouts.
- [ ] `[P2]` Note which inconsistencies are intentional and should stay.

### Review Criteria

- Shared components feel related across routes.
- Interaction and spacing patterns repeat in useful ways.
- Deliberate weirdness survives where it adds character.

### Evidence

- source component review
- cross-route viewport screenshots
- packet `source/` and `screenshots/`

### Known Issues

- Some inconsistencies may be route-specific choices rather than bugs.

### Future Ideas

- Create a lightweight component audit doc if this phase grows too large.

Status:

Not Started

## Phase 11 — Final Mobile QA

### Goal

Perform a final mobile sanity pass across representative devices and browsers so the site is ready for confident deployment. This phase is about catching stubborn real-world issues that packet review and code inspection can miss.

### Checklist

- [ ] `[P0]` Check iPhone SE.
- [ ] `[P0]` Check iPhone 13.
- [ ] `[P0]` Check iPhone 15 Pro Max.
- [ ] `[P0]` Check Android Pixel.
- [ ] `[P0]` Check Safari.
- [ ] `[P0]` Check Chrome.
- [ ] `[P0]` Confirm no overflow.
- [ ] `[P0]` Confirm no clipped text.
- [ ] `[P0]` Confirm no hidden controls.
- [ ] `[P0]` Confirm no unreadable sections.
- [ ] `[P1]` Confirm no accidental desktop spacing survives on mobile.

### Review Criteria

- The site is comfortable across small, medium, and larger mobile screens.
- Safari and Chrome both feel trustworthy.
- No severe usability bugs remain.

### Evidence

- packet screenshots
- device/browser spot checks
- final review notes

### Known Issues

- Emulator confidence is not the same as real-device confidence.

### Future Ideas

- Capture a final short QA checklist result inside a packet artifact.

Status:

Not Started

## Phase 12 — Desktop Regression

### Goal

After mobile work settles, verify that the shared layout system still protects desktop quality. This phase ensures mobile improvements did not quietly flatten or destabilize the desktop experience.

### Checklist

- [ ] `[P0]` Compare desktop screenshots before and after major mobile passes.
- [ ] `[P0]` Verify the homepage hero still lands correctly.
- [ ] `[P1]` Verify homepage spacing.
- [ ] `[P1]` Verify Work With Me.
- [ ] `[P1]` Verify About.
- [ ] `[P1]` Verify Music.
- [ ] `[P1]` Verify Writings.

### Review Criteria

- Desktop hero, spacing, and section hierarchy still feel intentional.
- Shared changes have not introduced awkward desktop spacing or density issues.
- The site still feels like one design system across breakpoints.

### Evidence

- `screenshots/viewport/desktop-home.jpg`
- `screenshots/viewport/desktop-work-with-me.jpg`
- `screenshots/viewport/desktop-about.jpg`
- desktop packet screenshots and visual comparison

### Known Issues

- Desktop regressions are easy to miss if mobile review becomes the only habit.

### Future Ideas

- Add a compact desktop regression checklist to packets once mobile work nears completion.

Status:

Not Started
