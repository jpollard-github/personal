# Decisions

These notes mix auto-generated repo facts with human-maintained context.

## Human Notes
- Browser e2e coverage now uses Playwright with a local `next dev` server bound to `127.0.0.1:3000`. This avoids localhost binding issues seen with broader host defaults in the current environment.
- Initial Playwright coverage is intentionally scoped to stable public pages plus admin session and protected-route access. It is meant as a lightweight regression net, not a full seeded integration harness.
- Admin e2e login reads `ADMIN_USERNAME` and `ADMIN_PASSWORD` from runtime env or `.env.local` so local runs work without extra wiring.
- Current caveat: the context refresh e2e test performs a real export-creation mutation, so future test expansion should prefer isolated test data or explicit cleanup for DB-backed admin mutations.

<!-- codex-session-kit:auto-start -->
> Auto-generated snapshot. Refreshed 6/20/2026, 4:27:34 PM. This section is managed by Codex Session Kit.

## Auto Snapshot

### Durable facts worth confirming
- Package name: `jasons-awesome-80s-site`
- Current branch during scan: `main`

### Suggested human follow-up
- Promote important implementation choices from current work into explicit decision log entries.
- Use this file for decisions and consequences that cannot be inferred safely from code scanning alone.
<!-- codex-session-kit:auto-end -->
