# Vercel Pro Operations TODO

Reference: 2026-06-28 12:10 PM EDT

Purpose:

Turn the broader Vercel Pro ideas into a practical operating checklist for ArcadeGhosts.

This document is for review rhythm, guardrails, and small automation planning. It is not a mandate to build analytics-heavy features or a custom dashboard.

Related docs:

- Broader Vercel backlog: [Vercel-Pro-TODO.md](/Users/jasonp/repos/personal/docs/Vercel-Pro-TODO.md)
- First AI implementation plan: [AI-TODO-FIRST.md](/Users/jasonp/repos/personal/docs/AI-TODO-FIRST.md)
- Broader AI backlog: [AI-TODO.md](/Users/jasonp/repos/personal/docs/AI-TODO.md)
- Website backlog informed by persona testing: [PERSONA-TESTS-RESULTS-TODO.backup.md](/Users/jasonp/repos/personal/docs/PERSONA-TESTS-RESULTS-TODO.backup.md)

## Current Manual Setup Priorities

Do these first:

- [ ] Verify Vercel Web Analytics is enabled and visible.
- [ ] Verify Vercel Speed Insights is enabled and visible.
- [ ] Verify Vercel spend alerts and usage notifications are enabled.
- [ ] Define the first custom events to support homepage, search, Work With Me, and Build Log decisions.

These are the highest-value manual setup tasks because they unlock real feedback loops before any new analytics code or automation work.

## Guiding Principles

- Analytics should answer product questions.
- Track only events Jason will act on.
- Vercel dashboard remains the primary analytics UI.
- ArcadeGhosts should not grow a large custom analytics dashboard yet.
- Spend and usage guardrails matter because Vercel Pro and AI credits can cost real money.
- Performance work should be driven by actual Speed Insights and Web Analytics data, not premature optimization.
- Persona findings and Vercel analytics should both inform homepage, search, and navigation improvements.

## Priority 0: Safety And Spend Guardrails

Immediate / near-term:

- [ ] Confirm Vercel spend alerts and usage notifications are enabled.
- [ ] Confirm AI Gateway API key budgets before any AI feature launches.
- [ ] Keep AI Gateway usage manual or admin-only at first.
- [ ] Add a deployment or build-log note when a change may affect image optimization, analytics events, AI usage, or traffic.
- [ ] Avoid screenshots, AI, or analytics-heavy features running automatically on every deploy.

Notes:

- Web Analytics and Speed Insights client scripts can add usage or cost overhead.
- Custom events should stay lean.
- AI Gateway budgets should be set before experiments.

## Priority 1: Analytics Review Rhythm

Weekly checklist:

- [ ] Review top pages.
- [ ] Review top referrers.
- [ ] Review homepage entry behavior.
- [ ] Review `Start Here` path clicks.
- [ ] Review `Search Performed` versus `Search Result Clicked`.
- [ ] Review `Work With Me` visits and clicks.
- [ ] Review `Build Log` visits and clicks.
- [ ] Review Writing, Tiny Thoughts, Music, and Cats patterns.
- [ ] Review RSS or returning-visitor signals if available.
- [ ] Review guestbook activity if it is still present and relevant.
- [ ] Review unexpected traffic spikes or usage changes.

TODOs:

- [ ] Create a recurring weekly Vercel review note from [docs/analytics/vercel-review-template.md](/Users/jasonp/repos/personal/docs/analytics/vercel-review-template.md).
- [ ] Keep review notes lightweight and decision-oriented, not dashboard screenshots.

## Priority 2: Custom Events Worth Tracking

Keep events minimal and intentional.

Recommended events:

- `start_here_clicked`
- `search_performed`
- `search_result_clicked`
- `work_with_me_clicked`
- `build_log_clicked`
- `project_clicked`
- `writing_clicked`
- `tiny_thought_clicked`
- `rss_clicked`
- `guestbook_started`
- `guestbook_submitted`

Event checklist:

- `start_here_clicked`
  Page/source: homepage `Start Here`
  Destination/target: selected path
  Why this matters: shows whether first-visit orientation is working
  Decision it can influence: revise labels, order, or emphasis of homepage paths
- `search_performed`
  Page/source: search page or search entrypoint
  Destination/target: query term category or source context
  Why this matters: shows how often navigation falls back to search
  Decision it can influence: improve homepage paths, synonyms, or search UX
- `search_result_clicked`
  Page/source: search results
  Destination/target: clicked result
  Why this matters: distinguishes curiosity from useful search success
  Decision it can influence: tune titles, descriptions, ranking, and synonyms
- `work_with_me_clicked`
  Page/source: homepage, About, Build Log, or other CTA source
  Destination/target: `/work-with-me` or outbound action
  Why this matters: shows whether professional interest is forming
  Decision it can influence: improve CTA copy, trust proof, or page placement
- `build_log_clicked`
  Page/source: homepage, About, Work With Me, or related CTA source
  Destination/target: `/build-log`
  Why this matters: shows whether proof-of-active-work is attractive
  Decision it can influence: promote or reframe Build Log visibility
- `project_clicked`
  Page/source: homepage or projects surface
  Destination/target: project slug or external repo
  Why this matters: shows which builds attract actual attention
  Decision it can influence: revise project ordering, imagery, or summaries
- `writing_clicked`
  Page/source: homepage, About, search, or related links
  Destination/target: writing slug
  Why this matters: shows which essays actually pull people deeper
  Decision it can influence: surface stronger writing paths or cross-links
- `tiny_thought_clicked`
  Page/source: homepage, feed, or search
  Destination/target: thought slug or detail target
  Why this matters: shows whether shorter-form content has pull
  Decision it can influence: adjust feed framing or promote writing follow-through
- `rss_clicked`
  Page/source: homepage, writing, or footer/source area
  Destination/target: RSS feed
  Why this matters: signals repeat-visit intent
  Decision it can influence: prioritize returning-visitor features
- `guestbook_started`
  Page/source: guestbook entrypoint
  Destination/target: guestbook form interaction
  Why this matters: distinguishes passive interest from actual participation
  Decision it can influence: simplify guestbook framing or submission flow
- `guestbook_submitted`
  Page/source: guestbook form
  Destination/target: submission success
  Why this matters: measures real community interaction
  Decision it can influence: decide whether guestbook stays prominent

TODOs:

- [ ] Use [docs/analytics/custom-events.md](/Users/jasonp/repos/personal/docs/analytics/custom-events.md) as the canonical event reference before adding or changing analytics code.
- [ ] Keep payloads small.
- [ ] Avoid personal or private data.
- [ ] Avoid high-cardinality values unless needed.
- [ ] Do not track anything creepy.
- [ ] Do not track mood or free-text inputs without explicit reason and review.

## Priority 3: Decision Loops

Metrics should trigger website changes, not passive observation.

- [ ] If `search_performed` is high but `search_result_clicked` is low, improve result titles, descriptions, synonyms, or ranking.
- [ ] If `start_here_clicked` is weak, revise Start Here labels and placement.
- [ ] If one Start Here path dominates, sharpen weaker paths.
- [ ] If `work_with_me_clicked` gets visits but no downstream action, improve CTA or trust proof.
- [ ] If `build_log_clicked` gets traffic, promote Build Log more.
- [ ] If Movies & TV or Music gets traffic but low follow-through, improve intro, hook, or cross-links.
- [ ] If RSS clicks are nonzero, make returning-visitor features more visible.
- [ ] If image usage spikes after galleries or media changes, review image sizes and optimization settings.

## Priority 4: Speed Insights / Performance Use

Do not over-optimize blindly.

Use Speed Insights to watch:

- mobile versus desktop performance
- homepage performance
- image-heavy pages
- pages with dynamic widgets
- pages recently changed

TODOs:

- [ ] Verify `@vercel/speed-insights` setup if it is not already present.
- [ ] Review Speed Insights after large media or homepage changes.
- [ ] Add performance notes to release notes or the build log when relevant.

## Priority 5: Automation Opportunities

Do not build a large analytics UI.

Prefer small automation.

Good automation candidates:

- `npm run analytics:notes` creates a dated Markdown review template.
- `npm run analytics:events-audit` checks that documented custom events match code.
- `npm run vercel:ops-checklist` prints deploy or review reminders.
- `npm run chatgpt:packet -- --profile vercel-ops` eventually bundles Vercel Pro docs, analytics notes, and relevant TODOs.

TODOs:

- [ ] Consider `npm run analytics:notes`.
- [ ] Consider `npm run analytics:events-audit`.
- [ ] Consider `npm run vercel:ops-checklist`.
- [ ] Consider `npm run chatgpt:packet -- --profile vercel-ops`.
- [ ] Only implement these if they stay small and maintenance-light.

## Priority 6: AI Gateway Later

Do not launch public AI first.

Preferred first AI use:

- admin or offline persona-test summarizer

Before AI launch:

- [ ] Verify current model IDs from Vercel docs.
- [ ] Set AI Gateway budget.
- [ ] Log model and cost metadata.
- [ ] Keep human review in the loop.
- [ ] Avoid public chatbot noise.

Cross-links:

- First-pass AI plan: [AI-TODO-FIRST.md](/Users/jasonp/repos/personal/docs/AI-TODO-FIRST.md)
- Broader AI backlog: [AI-TODO.md](/Users/jasonp/repos/personal/docs/AI-TODO.md)

## Priority 7: What Not To Build Yet

- [ ] Large internal analytics dashboard
- [ ] Generic public chatbot
- [ ] Automatic AI copy publishing
- [ ] Over-detailed behavioral tracking
- [ ] Analytics features that require constant maintenance
