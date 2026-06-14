# Neon Forest Personal Site

A warm, weird, slightly spooky personal website built with Next.js App Router and deployed on Vercel.

The site is a personal hub for projects, writing, music, arcade memories, movies and TV, cat photo rooms, a random Signal Booth, and a moderated guestbook.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Neon Postgres through `@neondatabase/serverless`
- Resend for optional guestbook email notifications
- Vercel for hosting and environment management

## Main Features

- Homepage with hero, about, projects, Signal Booth, section doorway cards, music, guestbook, and a GitHub repo link
- Signal Booth with 200 randomized prompts and generated image assets
- Standalone collection pages:
  - `/arcade`
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
  - password-protected admin review at `/admin/guestbook`
  - optional email notification on approval
  - database-backed rate limiting of 5 submissions per hour per IP hash
- Fixed site logo from `public/images/logo.png`
- Favicon generated at `app/favicon.ico`

## Project Map

- `app/page.tsx` - homepage layout and homepage-only content
- `app/site-data.ts` - shared arcade, movies/TV, and cat gallery data
- `app/signal-booth-data.ts` - Signal Booth prompt/image data
- `app/SignalBooth.tsx` - interactive random signal component
- `app/Guestbook.tsx` - public guestbook form and approved entries
- `app/AdminGuestbook.tsx` - admin approval interface
- `app/api/guestbook/route.ts` - public guestbook API
- `app/api/admin/guestbook/route.ts` - admin moderation API
- `app/api/admin/session/route.ts` - admin login/session API
- `app/lib/guestbook.ts` - Neon connection, schema bootstrap, guestbook serializers
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
```

Optional rate-limit salt:

```bash
GUESTBOOK_RATE_LIMIT_SECRET=
```

If `GUESTBOOK_RATE_LIMIT_SECRET` is not set, the app falls back to other server-only secrets for IP hashing. Setting a dedicated secret is cleaner for production.

## Guestbook Behavior

Public visitors can submit a name, optional email, category, note, and optional request to email Jason. Submissions are saved as `pending` and do not appear publicly until approved.

The public guestbook API only returns approved entries and excludes email addresses. Admin-only routes can see submitted emails for moderation and optional Resend reply-to behavior.

The guestbook database schema is bootstrapped automatically by `ensureGuestbookTable()` when the guestbook APIs run. The reference SQL lives in `db/guestbook.sql`.

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

The guestbook admin page is intentionally not linked from the public homepage.

Local URL:

```text
http://localhost:3000/admin/guestbook
```

Use `ADMIN_USERNAME` and `ADMIN_PASSWORD` to sign in.

## Deployment

Deploy the project on Vercel with the default Next.js settings.

Before deploying, make sure the Vercel project has:

- Neon database connection variables
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Resend variables if guestbook email notifications should work
- Optional `GUESTBOOK_RATE_LIMIT_SECRET`

## Notes

- `app/favicon.ico` was generated from `public/images/logo.png`.
- The production server defaults to `http://localhost:3000`.
- Guestbook test rows should be cleaned up after manual API testing.
