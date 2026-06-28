# AI-TODO-FIRST.md

Reference: 2026-06-28 9:25 PM EDT

Purpose:

Capture the first practical AI implementation plan for ArcadeGhosts, based on the existing `docs/AI-TODO.md`, persona-testing work, and the current Vercel AI direction.

This is a planning document only. It does not authorize immediate code changes by itself.

## Core Principle

AI should be a second-pass interpreter, not the primary truth source.

The deterministic Playwright + persona audit + journey reports remain the factual base layer.

AI should:

- summarize
- deduplicate
- explain
- rank
- suggest improvements

AI should not:

- decide where personas click
- automatically change public copy
- become generic chatbot noise

## Best First AI Feature

### Admin / Offline Persona Testing Summarizer

Build an AI review pass that reads the latest persona testing outputs and produces a clearer human-facing synthesis.

Suggested command:

```bash
npm run persona:ai-review
```

Suggested inputs:

- `persona-results/personas/overall-audit/summary.json`
- `persona-results/personas/overall-audit/report.md`
- `persona-results/personas/overall-journeys/summary.json`
- `persona-results/personas/overall-journeys/report.md`
- `persona-results/personas/overall-personas-and-journeys/combined-bundle.json`
- `docs/PERSONA-TODO.md`
- `docs/PERSONA-TESTS-RESULTS-TODO.md`

Suggested outputs:

- `persona-results/personas/ai-review/report.md`
- `persona-results/personas/ai-review/summary.json`
- a draft or update section for `docs/PERSONA-TESTS-RESULTS-TODO.md`

The AI review should answer:

- Which findings are real website issues?
- Which findings are probably heuristic artifacts?
- What are the top 5-10 actual site improvements?
- Which TODOs are duplicates?
- Which personas or scenarios improved or worsened?
- Which copy changes might help?
- Which findings should be ignored for now?

## Future Editorial Assistant

Optional later AI use:

- review Content Inbox items or near-publish drafts against `docs/EDITORIAL-GUIDE.md`
- suggest whether a piece sounds specific, alive, and personal enough to publish
- suggest likely destination such as Tiny Thought, Writing Draft, Project Draft, or Now update

Important constraint:

- this should remain advisory
- human editorial judgment stays final
- do not add this until the manual editorial workflow feels stable

## Vercel AI Role

Use Vercel AI Gateway and AI SDK as the integration layer.

Reasons:

- one abstraction over multiple models
- easier model experimentation
- usage monitoring
- budgets
- fallback options
- less provider lock-in

Investigate official Vercel docs before coding:

- Vercel AI SDK: `https://vercel.com/docs/ai-sdk`
- Vercel AI Gateway: `https://vercel.com/docs/ai-gateway`

Do not hardcode model IDs until verified against current docs.

## Model Strategy

Use a staged approach.

### Cheap / Fast Text Model

Use for:

- summarizing deterministic JSON
- deduplicating TODOs
- producing structured findings
- first-pass report cleanup

### Stronger Reasoning Model

Use for:

- final synthesis
- priority ranking
- nuanced persona-specific interpretation
- copy suggestions
- separating real issues from artifacts

### Vision Model

Use later only for:

- homepage density review
- screenshot-aware critique
- before/after visual comparison
- brand-kit / OG / card-style visual checks

Do not start with screenshot AI.

Keep screenshots optional because of cost, latency, and noise.

## Implementation Shape

Preferred order:

1. deterministic persona tests produce audit and journey facts
2. AI reads the combined packet
3. AI produces structured JSON and Markdown
4. human reviews the result
5. human-approved changes go into website TODOs

Do not let AI mutate source files automatically in the first version.

## Structured Output Requirements

AI output should be structured and comparable over time.

Suggested JSON fields:

- `generatedAt`
- `model`
- `inputPacketHash`
- `topFindings`
- `likelyRealIssues`
- `likelyHeuristicArtifacts`
- `recommendedWebsiteChanges`
- `recommendedFrameworkChanges`
- `copySuggestions`
- `ignoredFindings`
- `confidence`
- `costEstimate`

Each recommended website change should include:

- `title`
- `priority`
- `confidence`
- `affectedPages`
- `supportingPersonas`
- `supportingScenarios`
- `evidenceSummary`
- `suggestedFix`
- `expectedBenefit`

## Public AI Feature Later

After the admin or offline AI review works, consider a public AI site guide.

This should not be a generic chatbot.

It should be a guided room recommender.

Example prompts:

- "I want to know Jason."
- "I'm here for projects."
- "I want something weird."
- "I want music."
- "I want Twin Peaks energy."
- "I'm thinking about working with you."

The response should:

- link to real pages
- explain why those rooms fit
- avoid hallucinated site content
- keep the ArcadeGhosts voice
- be optional, playful, and lightweight

This directly supports the recurring persona-test finding that the homepage needs better first-visit orientation.

## Things Not To Do First

Do not start with:

- public chatbot
- screenshot AI
- automatic public copy rewriting
- AI-controlled persona navigation
- AI-generated pages
- AI replacing deterministic reports

These would add cost and ambiguity before the core workflow proves useful.

## Cost / Safety Questions To Answer Before Coding

- Which Vercel AI model is best for cheap structured summarization?
- Which model is best for final synthesis?
- What is the expected cost of one AI review pass?
- Should the AI review run manually only?
- Should AI outputs be cached by packet hash?
- Where should AI prompts live?
- Where should AI outputs live?
- How should failed model calls be handled?
- How should model and cost metadata be recorded?
- Should AI review ever run in CI, or only locally or via admin?

## Recommended First Implementation

Do this first:

```bash
npm run persona:ai-review
```

It should:

1. Load the latest persona result packet.
2. Build a compact AI input object.
3. Send the input through Vercel AI.
4. Require structured JSON output.
5. Write Markdown and JSON outputs.
6. Never modify public site content automatically.
7. Clearly label output as AI-generated review.

## Success Criteria

The first AI feature succeeds if it helps Jason answer:

- What should I actually change on the website?
- Which findings are repeated enough to trust?
- Which findings are probably noise?
- What should I ignore?
- Did the latest site change make persona journeys better?

If it does not improve those decisions, it should not expand further yet.

## Future Integration Ideas

Later candidates:

- Admin button: "Run AI Persona Review"
- Admin UI showing ranked findings
- AI-assisted update to `PERSONA-TESTS-RESULTS-TODO.md`
- AI review comparing before and after persona runs
- AI copy suggestions for page hooks and summaries
- AI related-link suggestions before publishing
- AI editorial assistant for Content Inbox
- public "Where should I start?" room guide
- public "Surprise me, but make it relevant" guide

## Immediate TODOs

- [x] Create `docs/AI-TODO-FIRST.md`
- [x] Keep `docs/AI-TODO.md` as the broader backlog
- [x] Add a note in `docs/AI-TODO.md` pointing to this first implementation plan
- [ ] Do not implement AI until deterministic persona stabilization is complete
- [x] Revisit this once `PERSONA-TESTS-RESULTS-TODO.md` is being generated reliably
