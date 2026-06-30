# ZIP-TODO.md

Purpose:

Track small, useful improvements to the ChatGPT/repo packet tooling without turning it into a larger packaging system.

## Suggested Next Improvements

1. Add named profiles such as:
   - `repo-review`
   - `standard-review`
   - `docs-review`

2. Switch the archive tool to `git ls-files` later so archive contents follow tracked source files more cleanly than exclusion rules.

3. Let the tool accept `--profile` and `--name` together, so future requests can be as short as:
   - `npm run zip:chatgpt:repo -- --profile repo-review`
   - `npm run zip:chatgpt:repo -- --profile repo-review --name brand-work-with-me.zip`

4. Print the final archive path in one short copy-paste-friendly line for easier handoff to ChatGPT or other review tools.

5. Improve the site review packet tooling with:
   - deeper mobile screenshot comparison
   - route discovery from the App Router
   - Lighthouse/accessibility reports
   - richer persona-test summary inclusion
   - deployed-site review mode
   - optional visual diffing between packets

## Notes

- Keep this tooling small and maintenance-light.
- The goal is convenience and consistency, not a full packaging framework.
