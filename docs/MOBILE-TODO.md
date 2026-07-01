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

## Cross-Phase Issues

Recurring issues from multiple mobile passes should live here once they stop being one-off observations.

### Checklist

- [x] `[P1]` Revisit the homepage nav strip on very small screens and confirm it still feels comfortable at the right edge on real devices.
- [ ] `[P1]` Keep checking desktop after each mobile pass because many layout primitives and spacing rules are still shared.
- [x] `[P1]` Manually verify changed visual routes even when automated overflow tests pass.
- [ ] `[P2]` Revisit very tall pages and trim or compress sections that add more scroll cost than decision value.
- [x] `[P2]` Decide whether fixed decorative chrome should be reduced further for mobile review clarity or real-device comfort.
- [ ] `[P2]` Improve screenshot reliability where full-page capture or fixed chrome makes review evidence noisy.

### Notes

- Homepage full-page capture has needed fallbacks because the route is extremely tall on mobile.
- `/work-with-me` still places the secondary CTA just below the fold on the smallest viewport.
- The floating ghost logo is less intrusive after the latest small-screen reduction, but it still appears in screenshots and should keep being judged against real-device comfort.
- Review packets and automated checks help, but they do not replace intentional visual review.

Status:

In Progress

## Ongoing Mobile Safety

### Goal

Make mobile responsiveness a permanent repo-level habit so future UI work stays safe by default instead of relying on memory or repeated prompting.

### Checklist

- [x] `[P0]` Add review packet screenshot coverage for `375px`, `390px`, `430px`, tablet, and desktop widths.
- [x] `[P1]` Add shared responsive layout primitives for future pages and section work.
- [ ] `[P1]` Track pages that still need manual mobile verification after visual changes.
- [x] `[P2]` Add lightweight automated overflow guardrails where they stay trustworthy.

### Review Criteria

- Future Codex sessions can discover the repo’s mobile rules without extra prompting.
- UI changes have a standard checklist and default screenshot evidence.
- Shared primitives are available for future page and section work.
- Mobile regressions become easier to spot before deployment.

### Evidence

- `docs/MOBILE-GUIDELINES.md`
- `docs/CHANGE-CHECKLIST.md`
- `AGENTS.md`
- `reports/screenshot-summary.json`
- `tests/e2e/mobile-safety.spec.ts`

### Known Issues

- Existing routes still use mostly legacy layout wrappers and will adopt shared primitives gradually.
- Automated checks can catch overflow, but they cannot replace actual visual review.
- Tablet and desktop screenshot coverage now exists in the packet flow, but future sessions still need to review the changed route set intentionally instead of trusting raw screenshot volume.

### Future Ideas

- Expand route coverage in the mobile-safety Playwright spec as more pages stabilize.
- Add focused changed-route packets with `--routes` more often when visual work is isolated.

### Exit Criteria

- The repo docs, instructions, review packets, and basic tests all reinforce mobile safety without extra reminders.

Status:

In Progress

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

- [x] `[P0]` Keep the page header readable without giant line breaks.
- [x] `[P0]` Improve first-screen clarity of what Jason does and who the page is for.
- [x] `[P1]` Make CTA blocks, proof, and trust signals easy to scan.
- [x] `[P1]` Check whether sticky or fixed UI interrupts reading.
- [x] `[P2]` Tighten any sections that feel more decorative than persuasive on mobile.

### Review Criteria

- A compatible client should understand the offer quickly.
- The first CTA path should be visible and non-awkward on mobile.
- The page should feel personal and human, not salesy or confused.
- The typography should not force dramatic line breaks in the header.

### Evidence

- `screenshots/viewport/mobile-work-with-me.jpg`
- `screenshots/mobile-work-with-me.jpg`
- `reports/mobile-review-index.json`
- Local verification screenshots captured during this pass at `375px`, `390px`, `430px`, and desktop against `http://127.0.0.1:3000/work-with-me`

### Known Issues

- The page is still very tall on mobile, so later sections need continued judgment about what earns its space.
- Desktop and tablet should still be spot-checked after future content-heavy changes because the route uses shared spacing rules.

### Future Ideas

- Add a mobile-first CTA/proof order if the current desktop-first sequence keeps underperforming.
- Consider simplifying or compressing supporting sections for smaller screens.

### Exit Criteria

- A compatible client can understand the offer and reach the primary CTA without heavy scrolling.
- The hero feels deliberate instead of oversized or crowded on `375px`, `390px`, and `430px` widths.
- Proof, trust, pricing, and contact sections scan cleanly on mobile without feeling like desktop cards stacked vertically.
- No obvious desktop regression appears in the page header, CTA row, or supporting panels.

Next recommended work:

- Move to Phase 4 and improve About, Music, and Writings readability on mobile while keeping an eye out for any final `/work-with-me` trimming opportunities.

Status:

Complete

## Phase 4 — About / Music / Writings Readability

### Goal

Improve the reading experience on the more text-driven personality pages so they stay expressive without becoming tiring on mobile. These pages should preserve voice while making long-form reading, section hierarchy, and media rhythm feel thoughtful.

### Checklist

- [x] `[P0]` Tighten long-form typography where needed.
- [x] `[P1]` Review heading sizes and section spacing.
- [x] `[P1]` Make sure cards, lists, and dense modules still breathe.
- [x] `[P1]` Review whether decorative or side content pushes core reading too far down.
- [x] `[P2]` Normalize inconsistencies between content-heavy pages where it helps comprehension.

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

- About is better paced now, but it is still the most text-forward of the Phase 4 routes and should be watched if new copy gets added.
- Music is now much safer on small phones, but it is still the densest personality page and may deserve route-specific polish later if new modules or data-heavy sections get added.
- Writings is the calmest of these pages, so the risk there is mostly keeping future cards and metadata from regressing into cramped layouts.
- There is a risk of overcorrecting personality pages into generic text columns.

### Future Ideas

- Add page-specific mobile refinements rather than forcing one universal content layout.
- Revisit image/text sequencing on the most editorial pages.

### Exit Criteria

- About reads like guided field notes instead of a text wall.
- Music feels intentional on phone widths rather than like a compressed desktop dashboard.
- Writings keeps a clean editorial rhythm with readable headers, CTA links, and card spacing.
- These pages still feel distinct from one another rather than sharing one flattened mobile template.

Next recommended work:

- Phase 5 can begin. Start with the playful route-specific pages while keeping an eye on Music if future content pushes density back up.

Status:

Ready For Review

## Phase 5 — Cats / Arcade / Personality Pages

### Goal

Protect the site’s playful, weird, and personal pages on mobile while reducing clutter and accidental awkwardness. These routes should still feel charming and specific, but with better spacing, less intrusion, and stronger content hierarchy.

### Checklist

- [x] `[P0]` Preserve personality without turning the pages into mobile clutter across the main personality routes.
- [x] `[P1]` Check image, gallery, and card density on narrow screens for `/arcade`, `/cats/beverly-and-lucinda`, and `/movies-tv`.
- [x] `[P1]` Review playful fixed or floating elements for intrusion during personality-page mobile review.
- [x] `[P2]` Tighten route-specific oddities that weaken readability on the first reviewed routes.
- [x] `[P1]` Re-review `twin-peaks-self`, `tiny-thoughts`, `updates`, and `/cats/thomas-jones-missy-cass` on mobile and fold the survivable fixes back into shared CSS.

### Review Criteria

- The pages feel fun and alive, not chaotic or cramped.
- Media-heavy areas are still navigable with thumbs.
- Floating ornaments do not block reading or taps.

### Evidence

- `screenshots/mobile-cats-beverly-and-lucinda.jpg`
- `screenshots/mobile-arcade.jpg`
- `screenshots/mobile-movies-tv.jpg`
- Local verification screenshots captured during this pass at `375px`, `390px`, and `430px` against `http://127.0.0.1:3000/arcade`, `http://127.0.0.1:3000/cats/beverly-and-lucinda`, and `http://127.0.0.1:3000/movies-tv`
- Local verification screenshots captured during the follow-up pass at `390px` against `http://127.0.0.1:3000/twin-peaks-self`, `http://127.0.0.1:3000/tiny-thoughts`, `http://127.0.0.1:3000/updates`, and `http://127.0.0.1:3000/cats/thomas-jones-missy-cass`
- `tests/e2e/mobile-safety.spec.ts`

### Known Issues

- These pages are likely to expose route-specific quirks that shared mobile fixes will not solve.
- `/arcade` and `/movies-tv` needed single-column treatment on smaller phones to stop poster and cabinet art from feeling thumbnail-dense.
- The floating ghost/logo no longer dominates these routes, but it still appears in screenshots and should keep being judged against real-device comfort.
- `twin-peaks-self` still has intentionally dramatic hero scale on mobile; it is cleaner now, but it should keep being judged against real-device comfort rather than being “optimized” into blandness.
- `tiny-thoughts` density will keep depending partly on whatever lead image or attachment mix a thought carries, so future content changes still need human screenshot review even when overflow tests pass.

### Future Ideas

- Create route-local mobile exceptions where personality depends on layout.
- Explore lighter decorative treatments on smaller screens.
- Revisit whether `430px` devices should ever regain two-column media on selected routes, but only if it improves browsing more than it increases clutter.

### Exit Criteria

- The reviewed personality pages still feel playful and specific on `375px`, `390px`, and `430px` widths.
- Media and gallery sections feel intentionally browseable instead of miniature desktop grids.
- Floating decorative chrome stays atmospheric without repeatedly stealing attention from content.
- Remaining personality-route follow-up is explicit enough that Phase 6 does not begin prematurely.

Next recommended work:

- Move to Phase 6 and focus on accessibility, tap targets, overflow, and cross-route interaction comfort now that the main personality routes have had their mobile readability pass.

Status:

Ready For Review

## Phase 6 — Accessibility, Performance, Tap Targets, Horizontal Overflow

### Goal

Catch the usability issues that visual review can miss: uncomfortable tap targets, clipped content, unexpected overflow, and mobile-only performance strain. This phase should make the site safer to use across real devices without changing its overall visual language.

### Checklist

- [x] `[P0]` Check for accidental overflow, clipping, and hidden text across the actively reviewed public routes.
- [x] `[P0]` Check all primary taps and pills for usable touch targets.
- [x] `[P1]` Check text sizing and line length on small screens across the denser editorial and directory routes.
- [x] `[P1]` Watch for large decorative modules that may create mobile-only performance issues and trim the heaviest small-screen treatment where it does not earn its weight.
- [x] `[P2]` Note routes that need dedicated accessibility follow-up later.

### Review Criteria

- No obvious clipped text or off-screen controls remain.
- Primary interactions are finger-friendly.
- Text stays readable without zooming.
- No route feels unusually heavy or janky compared with the rest of the site.

### Evidence

- `reports/screenshot-summary.json`
- `reports/route-status.json`
- browser/device spot checks
- `tests/e2e/mobile-safety.spec.ts`
- Local verification screenshots at `390px` against `http://127.0.0.1:3000/search` and `http://127.0.0.1:3000/`
- Local verification screenshots at `375px`, `390px`, and `430px` against `http://127.0.0.1:3000/about`, `http://127.0.0.1:3000/writings`, `http://127.0.0.1:3000/updates`, `http://127.0.0.1:3000/tiny-thoughts`, and `http://127.0.0.1:3000/search`
- Local verification screenshots at `390px` against `http://127.0.0.1:3000/music` and desktop spot-check capture against `http://127.0.0.1:3000/`

### Known Issues

- Screenshot review alone will not catch every tap-target or scrolling issue.
- Taller pages may need direct device checks to confirm comfort.
- The floating ghost/logo still appears in lower-left screenshots, so it can make visual evidence noisier even when it is not blocking interaction.
- The route-level text-comfort and decorative-weight pass is now safer, but future content edits can still reintroduce density on editorial pages and Tiny Thoughts cards.

### Future Ideas

- Add accessibility and performance-specific tooling to the review packet later.
- Include route-level notes for reduced-motion and keyboard sanity checks.

Next recommended work:

- Move to Phase 7 and generate a fresh comparison packet now that the safety, text-comfort, and decorative-weight checks have all had a dedicated pass.

Status:

Ready For Review

## Phase 7 — Regression Review And Screenshot Comparison

### Goal

Make each mobile change easy to verify and easy to trust. This phase is about disciplined comparison between packets so progress stays incremental, clear, and safe for both mobile and desktop.

### Checklist

- [x] `[P0]` Generate a fresh local mobile packet after each meaningful batch.
- [x] `[P0]` Compare viewport screenshots first, then full-page screenshots.
- [x] `[P1]` Record what changed in `reports/codex-report.md`.
- [x] `[P1]` Confirm desktop still looks intentional after mobile changes.
- [x] `[P2]` Keep packet notes clear enough that the next session can resume quickly.

### Review Criteria

- Each pass produces evidence, not just code changes.
- Desktop regressions are caught early.
- The current packet clearly communicates what improved and what still needs work.

### Evidence

- `reports/codex-report.md`
- latest mobile review packet screenshots
- desktop viewport screenshots for comparison
- `review-packets/2026-06-30/site-review-0837`
- `review-packets/latest-site-review`
- `review-packets/arcadeghosts-site-review-2026-06-30-0837.zip`

### Known Issues

- This discipline is easy to skip when visual fixes seem small.
- The generated packet covers the current focus routes well, but future route-specific passes should keep narrowing the route set when changes are isolated so comparison stays easy to scan.

### Future Ideas

- Add side-by-side diff helpers later if packets become numerous.

Next recommended work:

- Move to Phase 8 and use the new packet as the baseline for typography polish rather than reopening broad mobile safety work first.

Status:

Complete

## Phase 8 — Typography Polish

### Goal

Polish the site’s mobile typography so it feels more deliberate and consistent across routes. This phase should refine the reading experience and CTA hierarchy without neutralizing the site’s voice.

### Checklist

- [x] `[P1]` Normalize heading scale across key routes.
- [x] `[P1]` Review paragraph width and long-line discomfort.
- [x] `[P1]` Tighten spacing rhythm around headings, copy, and calls to action.
- [x] `[P1]` Review line-height for both hero copy and longer editorial sections.
- [x] `[P2]` Refine CTA hierarchy where type weight or size competes awkwardly.
- [x] `[P2]` Review icon sizing relative to adjacent text and pills.
- [x] `[P1]` Calm the most aggressive small-screen hero headings on `/search`, `/updates`, `/work-with-me`, and `/music` without making them interchangeable.
- [x] `[P1]` Tighten intro-copy rhythm on `/about`, `/writings`, `/tiny-thoughts`, and `/cats/beverly-and-lucinda` where long paragraphs still feel a little airy.
- [x] `[P2]` Recheck uppercase CTA and pill typography on `/writings`, `/updates`, `/search`, and `/work-with-me` so emphasis comes from hierarchy, not just bulk.

### Review Criteria

- Heading hierarchy feels consistent without flattening route personality.
- Long-form text is easier to read for sustained scrolling.
- CTA emphasis feels intentional rather than oversized by accident.

### Evidence

- `screenshots/viewport/mobile-home.jpg`
- `screenshots/viewport/mobile-about.jpg`
- `screenshots/viewport/mobile-writings.jpg`
- `screenshots/mobile-work-with-me.jpg`
- `review-packets/2026-06-30/site-review-0837`
- `review-packets/2026-06-30/site-review-0852`
- `review-packets/latest-site-review`
- Local post-change verification screenshots at `375px`, `390px`, and `430px` for `/search`, `/updates`, and `/tiny-thoughts`

### Known Issues

- Type problems are likely to overlap with Phase 2 and Phase 3 fixes.
- Home and Work With Me still use intentionally large first-screen type, so the goal here is proportion, not restraint for its own sake.
- The packet script's default route set still omits `/search` and `/updates`, so focused typography passes should keep supplementing packet output with route-local captures when those pages change.

### Future Ideas

- Introduce route-local typography tweaks where tone demands it.

Next recommended work:

- Move to Phase 9 for navigation polish, but keep the Phase 8 packet and the Search/Updates/Tiny Thoughts spot-checks as the typography baseline.

Status:

Ready For Review

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
