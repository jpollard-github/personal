I added the handoff packet at [persona-review-packet.md](/Users/jasonp/repos/personal/test-results/personas/overall-persona/persona-review-packet.md) and updated [AI-TODO.md](/Users/jasonp/repos/personal/docs/AI-TODO.md) with the AI-specific notes: use AI as a second-pass interpreter, keep deterministic Playwright/heuristic capture as the source of truth, and add a follow-up task for persona-specific weighting after review.

For the weighting improvement, ChatGPT is the best next step right now. I’d use it as a reviewer, not as the thing that directly changes scoring logic. The practical workflow is:

1. Give ChatGPT the packet in [test-results/personas/overall-persona](/Users/jasonp/repos/personal/test-results/personas/overall-persona), especially `persona-bundle.json`, `summary.json`, `persona-summary.csv`, and `chatgpt-prompts.md`.
2. Ask it to suggest sharper persona distinctions and explicit weighting recommendations like “music-nerd should strongly prefer `/music` and lightly discount `/movies`.”
3. We then translate the good suggestions into the manifest-based fields we already added, like `preferredTags`, `preferredSurfaceIds`, and `deEmphasizedSurfaceIds`.
4. Re-run `npm run test:personas` and compare whether the outputs feel more persona-specific and less repetitive.

So yes: use ChatGPT first, then codify the results in-repo. Later, if you want this built into the site/tooling, that becomes a very solid first Vercel AI feature: an AI review pass that reads the persona bundle and produces better-ranked, less heuristic-feeling feedback.

One small note: the active multi-persona runner is now centered on [all-personas.spec.ts](/Users/jasonp/repos/personal/tests/persona-testing/all-personas.spec.ts), even though you may still have the older persona file open in a tab.
