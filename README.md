# ArcadeGhosts

`arcadeghosts.org` is Jason Pollard's personal site and living portfolio.

It is a Next.js App Router application deployed on Vercel, mixing:

- public portfolio and writing pages
- interactive experiments and playful website features
- music, arcade, movie/TV, and cat collection pages
- small single-user admin tools for keeping the site current
- lightweight storage through Neon Postgres and Vercel Blob
- lightweight editorial workflows for homepage curation and quick content capture

## What The Site Includes

Main public areas:

- `/`
- `/about`
- `/updates`
- `/search`
- `/tiny-thoughts`
- `/writings`
- `/work-with-me`
- `/music`
- `/arcade`
- `/movies-tv`
- `/cats/*`
- `/twin-peaks-self`
- `/writings/[slug]`

Interactive/public features:

- guestbook with moderated submissions
- Tiny Thoughts short-form posts
- homepage `Start Here` section
- homepage spotlight near the top for one curated signal
- RSS feeds for writings and Tiny Thoughts
- related links on writing pages
- Signal Booth random prompt/oracle experience
- faux `80s Dev Terminal` widget in the homepage hero
- custom Twin Peaks-style 404 and 500 pages

Admin areas:

- `/admin`
- `/admin/home-spotlight`
- `/admin/content-inbox`
- `/admin/guestbook`
- `/admin/tiny-thoughts`
- `/admin/writing-drafts`
- `/admin/now`
- `/admin/projects`
- `/admin/social-quest-log`
- `/admin/side-hustle`
- `/admin/context-refresh`
- `/admin/error-previews`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Neon Postgres via `@neondatabase/serverless`
- Vercel Blob for admin image uploads
- Resend for guestbook notifications
- Vercel Analytics
- Playwright for browser e2e coverage

## Repo Notes

Documentation hub:

- `docs/README.md`

Start there for:

- current priorities
- which doc to use for content, website, framework, AI, or operations work
- daily, weekly, and occasional project rhythm

Especially useful companion docs:

- `docs/CONTENT-TODO.md`
- `docs/PERSONA-TESTS-RESULTS-TODO.md`
- `docs/low-friction-content-flow.md`

Note:

- `docs/low-friction-content-flow.md` is rendered directly inside the `Content Inbox` admin page, so editing that file updates the in-app instructions too.

If you are using Codex or another AI coding assistant here, read `docs/README.md` first, then follow its links before inspecting implementation files.

## Important Areas

- `app/`
  Routes, components, layouts, API handlers, and local helpers
- `app/home/`
  Homepage section components and terminal widget pieces
- `app/about/`
  Full About room extracted from the homepage preview
- `app/music/`
  Music page sections and route-local styles
- `app/tiny-thought-admin/`
  Tiny Thoughts admin hook and UI pieces
- `app/lib/`
  Shared auth, DB, upload, Blob, and normalization helpers
- `app/api/admin/`
  Admin JSON routes for session, content, curation, and uploads
- `tests/`
  Regression tests and Playwright coverage
- `docs/`
  Maintenance context for future sessions

## Environment Variables

Create `.env.local` for local development. Equivalent values should exist in Vercel for deployed environments.

Database connection, one of:

```bash
DATABASE_URL=
STORAGE_DATABASE_URL=
POSTGRES_URL=
STORAGE_POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
STORAGE_POSTGRES_URL_NON_POOLING=
STORAGE_DATABASE_URL_UNPOOLED=
NEON_DATABASE_URL=
```

Admin auth:

```bash
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

Guestbook email notifications:

```bash
RESEND_API_KEY=
GUESTBOOK_EMAIL_FROM=
GUESTBOOK_EMAIL_TO=
ADMIN_LINK=
```

Blob uploads:

```bash
BLOB_READ_WRITE_TOKEN=
```

Optional rate-limit salt:

```bash
GUESTBOOK_RATE_LIMIT_SECRET=
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Note:

- if port `3000` is already occupied, Next.js will pick another port such as `3001`

Lint:

```bash
npm run lint
```

Run unit tests:

```bash
npm run test:unit
```

Run the default full test command:

```bash
npm test
```

Install Playwright browser dependencies:

```bash
npm run test:e2e:install
```

Run browser tests:

```bash
npm run test:e2e
```

Build production output:

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

Run lint, then build, then start:

```bash
npm run go
```

`npm run go` is useful when you want a quick production-style local run after the usual safety checks. It will keep running because `npm run start` launches the server.

## VS Code Tasks

This repo includes a simple VS Code task setup in `.vscode/tasks.json` for the most common local workflows:

- `Dev: Start Next.js`
- `Check: Lint`
- `Check: Unit Tests`
- `Check: Playwright`
- `Docs: Open Codex Context`

Open them from:

- `Terminal: Run Task`
- or `Cmd/Ctrl+Shift+P` -> `Tasks: Run Task`

The docs task opens:

- `docs/README.md`
- `docs/CONTENT-TODO.md`
- `docs/PERSONA-TESTS-RESULTS-TODO.md`
- `docs/low-friction-content-flow.md`

Note:

- `Docs: Open Codex Context` uses the VS Code `code` CLI. If that task does nothing on your machine, install the VS Code shell command from the editor first.

## Testing Notes

Current browser coverage includes:

- stable public pages
- homepage terminal behavior
- custom error-page preview routes
- admin login and protected route access
- content inbox draft imports for Now, Projects, Tiny Thoughts, and Writing Drafts

Important caveat:

- the context refresh admin Playwright test performs a real export-creation mutation, so repeated local runs can create persistent `context_refresh_exports` rows if your local env points at a live database

Playwright uses a local `next dev` server bound to `127.0.0.1:3000`.

## Current Architectural Notes

- Homepage composition is split under `app/home/`; extend those modules instead of collapsing logic back into `app/page.tsx`.
- The homepage now intentionally uses a curated top-of-page sequence: intro band, hero, `Start Here`, and spotlight.
- Some homepage sections now preview fuller rooms instead of fully expanding on the homepage, notably `/about`, `/writings`, and `/tiny-thoughts`.
- Music composition is split under `app/music/`.
- Projects admin uses per-project save/delete plus persisted `display_order` for drag-and-drop ordering.
- The homepage terminal is intentionally data-driven through `app/home/terminal-data.ts`.
- The site now has explicit `not-found`, route `error`, and `global-error` surfaces, plus preview routes under `/error-preview/*`.
- Admin content capture is split across `Content Inbox` for raw fragments, `Tiny Thoughts` for short publishable posts, `Writing Drafts` for longer-form shaping, `Projects` for project cards and updates, `Now` for current homepage signals, and `Homepage Spotlight` for top-of-home curation.

## Guestbook And Tiny Thoughts

Guestbook:

- public submissions are saved as pending
- approved entries only are returned publicly
- submitted email addresses stay admin-only
- Resend can notify on new submissions

Tiny Thoughts:

- short public posts with structured attachments
- admin create/edit/delete UI
- optional image uploads through Vercel Blob

## Content Workflow

The site now has a lightweight publishing pipeline:

1. capture fragments in `/admin/content-inbox`
2. route promising items into `Now`, `Tiny Thoughts`, `Projects`, or `Writing Drafts`
3. promote only the strongest material into fuller rooms like `/writings` or `/about`

The goal is to reduce writing friction without publishing every note or every ChatGPT exchange.

## Music Insights

The `/music` page uses curated summary data checked into this repo, not raw Spotify export data at runtime.

The summarized public data lives under:

- `app/music-insights/summary.ts`
- `app/music-insights/curated.ts`
- `app/music-insights/index.ts`

The raw export and analysis workflow lives outside this repo and is copied in as human-reviewed summary data.
