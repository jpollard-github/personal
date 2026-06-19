# Jason's Awesome 80s Site

A warm, weird, slightly spooky personal website built with Next.js App Router and deployed on Vercel.

The site is a personal hub for projects, writing, music, arcade memories, movies and TV, cat photo rooms, a random Signal Booth, and a moderated guestbook.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Neon Postgres through `@neondatabase/serverless`
- Resend for guestbook approval notifications
- Vercel for hosting and environment management

## Main Features

- Homepage with hero, about, projects, Signal Booth, Tiny Thoughts, section doorway cards, music, guestbook, a GitHub repo link, and a hidden coffee-cup admin link
- Projects section with Between Two Lodges and the Codex Prompt Pack for VS Code repo
- Signal Booth with 200 randomized prompts and generated image assets
- Standalone collection pages:
  - `/arcade`
  - `/music`
  - `/movies-tv`
  - `/cats/beverly-and-lucinda`
  - `/cats/thomas-jones-missy-cass`
- Writing pages under `/writings/[slug]`
- Guestbook with:
  - required name and note
  - 500 character message limit
  - server-side validation, not just browser validation
  - escaped public display fields
  - public responses that do not expose submitted email addresses
  - pending approval workflow
  - shared password-protected admin dashboard at `/admin`
  - password-protected admin review at `/admin/guestbook`
  - automatic Resend notification when a note is submitted for approval
  - optional clickable admin-dashboard link in notification emails via `ADMIN_LINK`
  - database-backed rate limiting of 5 submissions per hour per IP hash
- Tiny Thoughts with:
  - short 50-200 word posts
  - categories such as lesson, observation, funny, opinion, arcade, music, cat, Twin Peaks, and other
  - automatic link rendering for `http` and `https` URLs
  - structured attachments for Vercel Blob image uploads and external links with optional titles
  - optional inspired-by category and inspired-by note
  - emoji-friendly text input
  - password-protected admin create/edit/view/delete at `/admin/tiny-thoughts`
- Fixed site logo from `public/images/logo.png`
- Favicon generated at `app/favicon.ico`

## Project Map

- `app/page.tsx` - homepage layout and homepage-only content
- `app/music/page.tsx` - music collection page with Spotify embeds and summarized listening insights
- `app/music-data.ts` - Spotify playlist embed metadata
- `app/music-insights-data.ts` - public, summarized Spotify listening insights generated from the local export workflow
- `app/site-data.ts` - shared arcade, movies/TV, and cat gallery data
- `app/signal-booth-data.ts` - Signal Booth prompt/image data
- `app/SignalBooth.tsx` - interactive random signal component
- `app/Guestbook.tsx` - public guestbook form and approved entries
- `app/AdminDashboard.tsx` - shared admin login/dashboard linking to admin tools
- `app/TinyThoughts.tsx` - public Tiny Thoughts display
- `app/AdminGuestbook.tsx` - admin approval interface
- `app/AdminTinyThoughts.tsx` - admin Tiny Thoughts editor
- `app/admin/page.tsx` - admin dashboard route
- `app/api/guestbook/route.ts` - public guestbook API
- `app/api/admin/guestbook/route.ts` - admin moderation API
- `app/api/admin/session/route.ts` - admin login/session API
- `app/api/tiny-thoughts/route.ts` - public Tiny Thoughts API
- `app/api/admin/tiny-thoughts/route.ts` - admin Tiny Thoughts CRUD API
- `app/api/admin/tiny-thoughts/upload/route.ts` - admin Vercel Blob image upload API
- `app/lib/guestbook.ts` - Neon connection, schema bootstrap, guestbook serializers
- `app/lib/guestbook-email.ts` - shared Resend guestbook notification helper
- `app/lib/admin-auth.ts` - simple username/password admin session helper
- `db/guestbook.sql` - reference SQL for guestbook tables
- `app/globals.css` - visual system and responsive layout
- `public/images/` - site images, generated Signal Booth art, cat galleries, arcade/media art, logo
- `public/games/between-two-lodges/` - static browser game project
- `public/writings/` - markdown source for writing pages

## Environment Variables

Create `.env.local` for local development. The same keys should exist in Vercel for deployed environments.

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

Guestbook admin:

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

`ADMIN_LINK` is used inside guestbook notification emails as the clickable admin-dashboard URL. For local development it can point to `http://localhost:3000/admin`; in production it should point to the deployed `/admin` URL.

Tiny Thoughts image uploads:

```bash
BLOB_READ_WRITE_TOKEN=
```

Optional rate-limit salt:

```bash
GUESTBOOK_RATE_LIMIT_SECRET=
```

If `GUESTBOOK_RATE_LIMIT_SECRET` is not set, the app falls back to other server-only secrets for IP hashing. Setting a dedicated secret is cleaner for production.

## Guestbook Behavior

Public visitors can submit a name, optional email, category, and note. Submissions are saved as `pending` and do not appear publicly until approved.

When a note is submitted for approval, the public API saves it first, then attempts to send a Resend notification so Jason knows there is something to review. Notification emails include submitted details and, when `ADMIN_LINK` is set, a clickable link to the admin dashboard. If the notification fails, the saved pending entry remains available for review; approval can retry an unsent notification.

The public guestbook API only returns approved entries and excludes email addresses. Admin-only routes can see submitted emails for moderation and Resend reply-to behavior.

The guestbook database schema is bootstrapped automatically by `ensureGuestbookTable()` when the guestbook APIs run. The reference SQL lives in `db/guestbook.sql`.

## Tiny Thoughts

Tiny Thoughts are short posts intended for quick observations, lessons learned, funny experiences, and opinions. The public site displays them newest first.

Admin starts at:

```text
http://localhost:3000/admin
```

Links can be embedded by typing full `http` or `https` URLs in the thought body. The admin form also supports structured attachments:

```ts
type Attachment =
  | { type: "image"; url: string }
  | { type: "link"; url: string; title?: string };
```

Image attachments are uploaded through the password-protected admin UI and stored in Vercel Blob. Link attachments remain external URLs with optional display titles. Tiny Thoughts can also include an inspired-by category such as article link, song, video, conversation, or other, plus a short inspired-by value. Emojis are stored as normal text.

## Music Insights Data

The `/music` page combines hand-curated Spotify playlist embeds with summarized listening-history data from the separate local repository at:

```text
~/spotify-export
```

The website does not read raw Spotify exports at runtime and does not ship the raw stream archive. The local export workflow is:

```text
Spotify extended streaming-history JSON
  -> ~/spotify-export/raw/
  -> npm run spotify:analyze
  -> npm run lastfm:enrich
  -> npm run music:report
  -> summarized values copied into app/music-insights-data.ts
```

The important generated files in `~/spotify-export/output/` are:

- `stream-events.ndjson` - normalized event archive used locally for deeper analysis
- `yearly-trends.json` and `monthly-trends.json` - listening totals over time
- `top-artists.json`, `top-songs.json`, `top-albums.json`, and `top-videos.json` - all-time rankings by listening time
- `artist-genres.lastfm.json` - Last.fm genre tags matched to artists
- `odd-findings.json` - repeat tracks, album fixation weeks, long artist lifespans, and audio/video ratio
- `music-report/index.html` - local static prototype used as the review surface for deciding what belongs on the website

`app/music-insights-data.ts` is intentionally a small public summary, not a database import. It includes high-level totals, the recent listening window, yearly/monthly signals, genre weather, era cards, musical DNA panels, mood-color summaries, all-time leaders, and fixation oddities. If the Spotify export is refreshed, regenerate the local report in `~/spotify-export`, review `output/music-report/index.html`, then update `app/music-insights-data.ts` with only the public-facing summary values.

## Run Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

## Admin

The admin dashboard lives at `/admin` and links to both Guestbook Review and Tiny Thoughts. It uses the shared `arcadeghosts_admin` session cookie set by `/api/admin/session`, and the individual admin pages still require a successful session before loading protected data.

Local URL:

```text
http://localhost:3000/admin
```

Use `ADMIN_USERNAME` and `ADMIN_PASSWORD` to sign in.

The public homepage includes a small coffee-cup link to `/admin` at the end of the intro band line.

## Deployment

Deploy the project on Vercel with the default Next.js settings.

Before deploying, make sure the Vercel project has:

- Neon database connection variables
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Resend variables if guestbook email notifications should work
- `ADMIN_LINK` for the review link inside guestbook emails
- Optional `GUESTBOOK_RATE_LIMIT_SECRET`

## Notes

- `app/favicon.ico` was generated from `public/images/logo.png`.
- The production server defaults to `http://localhost:3000`.
- Guestbook test rows should be cleaned up after manual API testing.
