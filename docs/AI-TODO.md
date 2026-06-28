# AI TODO

Reference: 2026-06-27 20:45 EDT

This document collects AI-specific backlog items for ArcadeGhosts, with persona testing as the most likely first real feature.

Key docs:

- Vercel AI SDK: `https://vercel.com/docs/ai-sdk`
- Vercel AI Gateway: `https://vercel.com/docs/ai-gateway`

## 1. First AI Feature: Persona Testing Summaries

Goal:

- Add AI only where it materially improves the current deterministic persona-testing flow.

### Highest Priority

- [ ] Investigate how to wire Vercel AI into the persona-testing pipeline without replacing the current Playwright + heuristic report.
- [ ] Decide whether the AI step should run:
  - after Playwright as an offline summarizer
  - inside an admin page
  - or both
- [ ] Define the exact inputs for AI summarization:
  - `summary.json`
  - page screenshots
  - persona profile markdown
  - optional route metadata
- [ ] Define the exact outputs for AI summarization:
  - richer narrative report
  - ranked design/usability findings
  - copy suggestions
  - screenshot-aware notes
  - checkbox TODOs
- [ ] Decide whether persona AI output should be saved into `test-results/personas/...`, a database table, or both.
- [ ] Create an AI review pass whose main job is to separate:
  - persona-specific findings
  - broad structural site issues
  - scoring / heuristic artifacts

### Model / Cost Investigation

- [ ] Investigate Vercel AI SDK + Gateway setup steps for this repo.
- [ ] Investigate the current recommended model choices for low-cost summarization and screenshot-aware critique.
- [ ] Compare at least 2-3 candidate models for:
  - text summarization quality
  - screenshot reasoning quality
  - cost
  - latency
  - structured JSON reliability
- [ ] Estimate the likely cost of one persona run:
  - profile text only
  - profile + structured page summaries
  - profile + screenshot review
  - one persona versus several personas per deploy
- [ ] Decide whether persona AI should run:
  - manually
  - on demand from admin
  - per branch
  - or only before production deploys

### Implementation Notes

- [ ] Keep the non-AI persona report as the factual base layer.
- [ ] Treat AI as a second-pass interpreter, not the primary truth source.
- [ ] Require structured output so persona reports stay comparable over time.
- [ ] Keep screenshots optional at first if visual-model cost is too high.
- [ ] Use AI to explain and deduplicate findings more than to replace the deterministic capture pipeline.
- [ ] Let AI review the full persona bundle:
  - persona markdown text
  - weighted outputs
  - aggregate output
  - optional screenshots
- [ ] Preserve deterministic facts such as route coverage, link counts, button counts, and screenshot capture outside the AI layer.

### Weighting Follow-Up

- [ ] After ChatGPT reviews the current personas and outputs, use its suggestions to sharpen persona-specific weighting.
- [ ] Revisit `preferredTags`, `preferredSurfaceIds`, and `deEmphasizedSurfaceIds` in the persona manifest based on that review.
- [ ] Investigate whether some personas need explicit negative weighting, such as:
  - `music-nerd` caring much more about `/music`
  - `potential-client` caring much more about `/work-with-me`
  - `reading-enthusiast` caring much more about writing detail pages
- [ ] Decide whether weighting should stay hand-authored in repo metadata, be partially AI-suggested, or both.

## 2. Candidate First Models To Evaluate

These are investigation targets, not final decisions:

- [ ] Small low-cost text model for summarizing deterministic persona JSON into stronger prose.
- [ ] Slightly stronger reasoning model for ranking design and usability issues.
- [ ] Vision-capable model for screenshot-aware critique if the cost is acceptable.

Questions to answer:

- [ ] Is one model enough for both narrative and visual feedback?
- [ ] Should text-only and vision review be split into two passes?
- [ ] Can the cheaper model do the first pass, with the stronger model only for final synthesis?

## 3. Vercel Pro AI Items Pulled Forward

These are the AI-related TODOs already implied by the Vercel Pro backlog and worth tracking here too.

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

## 4. Setup And Architecture

### Basic Decisions

- [ ] Decide whether Vercel AI lives only in server routes or also gets an admin UI.
- [ ] Decide where prompts, schemas, and report templates should live in the repo.
- [ ] Decide whether AI prompts should be versioned alongside the persona-testing framework.
- [ ] Decide whether AI outputs should be cached to reduce rerun costs.

### Gateway Questions

- [ ] Verify the current Gateway model IDs from live Vercel docs before coding.
- [ ] Decide whether AI Gateway should be the default abstraction layer even if the first feature only uses one provider.
- [ ] Define a fallback plan if a chosen model is unavailable or too expensive.

### Safety / Quality

- [ ] Keep human review in the loop for any AI output that changes public copy.
- [ ] Mark AI-generated findings clearly in persona reports and admin tools.
- [ ] Avoid turning the site into generic chatbot noise.

## 5. Suggested Order

1. investigate SDK + Gateway setup for this repo
2. compare model options and estimate per-run persona-testing cost
3. ship AI as a second-pass persona report summarizer
4. use AI to critique persona weighting and aggregate ranking logic
5. add screenshot-aware critique if the cost looks reasonable
6. then expand into editorial and discovery features
