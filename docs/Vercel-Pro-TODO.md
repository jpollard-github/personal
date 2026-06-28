# Vercel Pro TODO

Reference: 2026-06-27 22:10 EDT

This document expands the three `Pro ROI Vercel` items into a concrete implementation and review backlog for ArcadeGhosts. The ordering favors highest leverage first, then usefulness, then the more playful experiments.

Practical operating checklist:

- [VERCEL-PRO-OPERATIONS-TODO.md](/Users/jasonp/repos/personal/docs/VERCEL-PRO-OPERATIONS-TODO.md)

## 1. Watch The Right Vercel Metrics

Goal:

- Use Vercel Pro analytics and usage data to make better site decisions, not just to admire dashboards.

Primary execution doc:

- [VERCEL-PRO-OPERATIONS-TODO.md](/Users/jasonp/repos/personal/docs/VERCEL-PRO-OPERATIONS-TODO.md)

### Highest Priority

- [ ] Review Web Analytics weekly for homepage entry clicks.
- [ ] Compare `Start Here` clicks across the three curated doors.
- [ ] Review `Search Performed` versus `Search Result Clicked` counts.
- [ ] Review project click events to see which builds actually attract attention.
- [ ] Review writing, Tiny Thoughts, RSS, and build-log click patterns.
- [ ] Note whether guestbook submissions are rising, flat, or rare.

### Usage And Reliability

- [ ] Review image optimization usage after large media changes.
- [ ] Watch image cache writes and transformations after publishing new galleries or page art.
- [ ] Set Vercel spend alerts or usage notifications if they are not already enabled.
- [ ] Keep a short note in the build log when a site change is likely to affect Vercel usage.

### Decision Loops

- [ ] If search volume is high and result clicks are low, improve search descriptions and synonyms.
- [ ] If project clicks are weak, revise project card imagery and next-step framing.
- [ ] If build-log clicks are healthy, keep treating the build log as a real repeat-visit feature.
- [ ] If one homepage path dominates, sharpen the copy on the weaker paths.

## 2. Pick The First AI Feature Carefully

Goal:

- Use AI Gateway and a smaller low-cost OpenAI model for features that actually improve the site rather than adding generic chatbot noise.

### Best First Candidates

- [ ] Prototype an AI site guide that helps visitors choose a room based on mood, topic, or intent.
- [ ] Prototype an editorial assistant for the Content Inbox that suggests titles, summaries, tags, and next destination.
- [ ] Prototype a related-signals assistant that suggests links between writings, projects, Tiny Thoughts, and fun rooms before publishing.

### Good Second-Wave Features

- [ ] Explore a conversational search layer that answers briefly and then links to real pages.
- [ ] Explore an AI helper for transforming build-log bullets into polished public summaries.
- [ ] Explore an AI helper for summarizing project updates into stronger homepage card copy.

### Fun But Lower Priority

- [ ] Prototype a playful AI guide for `Surprise Me` or the Signal Booth.
- [ ] Prototype an AI “where should I wander next?” feature that offers one strange but relevant recommendation.
- [ ] Prototype a themed media or cat-room recommender that fits the tone of the site.

### Implementation Notes

- [ ] Verify the current AI Gateway model ID in live docs or through the Gateway model list before coding.
- [ ] Prefer low-cost models for curation, summarization, routing, and recommendation features.
- [ ] Keep human-approved publishing in the loop for anything that changes public content.

## 3. Decide Which Pro Features Are Worth Coding Around

Goal:

- Build around the Pro features that genuinely help ArcadeGhosts, and deliberately ignore the ones that do not.

Primary execution doc:

- [VERCEL-PRO-OPERATIONS-TODO.md](/Users/jasonp/repos/personal/docs/VERCEL-PRO-OPERATIONS-TODO.md)

### Worth Using Soon

- [ ] Keep custom events lean and intentional.
- [ ] Keep event payloads within Vercel Analytics pricing constraints.
- [ ] Use Vercel Analytics as the primary place to review visitor behavior.
- [ ] Use AI Gateway if an AI feature is built so routing, usage attribution, and future provider changes stay flexible.
- [ ] Use Vercel usage alerts and spend management for safety.

### Worth Reviewing Before More Work

- [ ] Decide whether Speed Insights or additional performance tooling would add value beyond current testing and image optimization.
- [ ] Decide whether any Vercel observability surface should get its own admin notes page later.
- [ ] Decide whether the site should surface a tiny internal release checklist before deployments.

### Probably Not Worth Overbuilding Right Now

- [ ] Avoid building a big internal analytics UI when Vercel already gives the key dashboard.
- [ ] Avoid adding AI chat just because the integration exists.
- [ ] Avoid platform-specific complexity unless it improves either publishing flow, discovery, or repeat visits.

## Priority Order

1. analytics review rhythm
2. search and homepage improvement loop
3. first AI-assisted editorial or discovery feature
4. usage and spend guardrails
5. fun AI experiments
