# Decisions

These notes mix auto-generated repo facts with human-maintained context.

## Human Notes
- Browser e2e coverage now uses Playwright with a local `next dev` server bound to `127.0.0.1:3000`. This avoids localhost binding issues seen with broader host defaults in the current environment.
- Initial Playwright coverage is intentionally scoped to stable public pages plus admin session and protected-route access. It is meant as a lightweight regression net, not a full seeded integration harness.
- Admin e2e login reads `ADMIN_USERNAME` and `ADMIN_PASSWORD` from runtime env or `.env.local` so local runs work without extra wiring.
- Current caveat: the context refresh e2e test performs a real export-creation mutation, so future test expansion should prefer isolated test data or explicit cleanup for DB-backed admin mutations.
- Projects admin now follows a desktop-first interaction model: cards are collapsed by default, each project saves independently, and drag-and-drop reorder is only enabled for saved collapsed cards.
- Projects admin reorder/save was implemented without adding a drag-and-drop library. The current behavior relies on native desktop drag events and is not intended to be the final touch/mobile solution.
- Projects admin mutations now use `PATCH /api/admin/projects` for single-project saves and order-only updates, while `DELETE /api/admin/projects` removes a single saved project.
- The repo still treats checked-in `defaultProjects` as the empty-state fallback. Because of that, the first single-project mutation seeds those defaults into `site_projects` if the table is empty before applying the requested change.

<!-- codex-session-kit:auto-start -->
> Auto-generated snapshot. Refreshed 6/20/2026, 5:21:50 PM. This section is managed by Codex Session Kit.

## Auto Snapshot

### Durable facts worth confirming
- Package name: `jasons-awesome-80s-site`
- Current branch during scan: `main`

### Suggested human follow-up
- Promote important implementation choices from current work into explicit decision log entries.
- Use this file for decisions and consequences that cannot be inferred safely from code scanning alone.
<!-- codex-session-kit:auto-end -->
