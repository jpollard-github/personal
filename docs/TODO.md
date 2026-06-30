# Website TODO

Status:

- Historical document kept for context.
- Use `docs/PERSONA-TESTS-RESULTS-TODO.backup.md` for the active website backlog.
- Use `docs/CONTENT-TODO.md` for the active publishing backlog.

This checklist prioritizes changes that are most likely to improve first impressions, repeat visits, and overall enjoyment without diluting the site's personality.

## Priority 1

- [x] Add a clear `Start Here` section on the homepage for first-time visitors.
- [x] Pick and ship one recurring content format so the site feels alive on repeat visits.
- [x] Add RSS feeds for writings, tiny thoughts, and other update-style content.
- [x] Add related links at the bottom of writings and key feature pages.
- [x] Improve project cards so each one communicates why it matters, what state it is in, and where to go next.

## Priority 2

- [x] Add an `/updates` or `/changelog` page that shows what is new across the site.
- [x] Add richer structured data for writings and projects, not just `Person` and `WebSite`.
- [x] Add lightweight site search across writings, projects, tiny thoughts, and other browsable content.
- [x] Review whether the homepage really needs `force-dynamic` or could be static/revalidated for better performance.
- [ ] Add event tracking for key interactions so future changes can follow real visitor behavior.

## Priority 3

- [x] Add a `Surprise Me` button that sends visitors to a random page, writing, game, or signal.
- [x] Add a rotating homepage spotlight such as current signal, current fixation, featured project, or featured essay.
- [x] Surface a few recent guestbook messages higher on the homepage so community activity is easier to notice.
- [x] Add custom Open Graph images for major pages so shared links feel more polished and clickable.
- [ ] Add small connective transitions or micro-copy between sections so the homepage feels even more like one world.

## Priority 4

- [x] Reduce homepage overwhelm by making the top of the site feel more curated than comprehensive.
- [x] Create a low-friction content inbox so good fragments can be captured before they evaporate.
- [x] Add a homepage spotlight module for one current signal, featured project, or featured essay.
- [x] Decide which homepage sections should preview content versus fully expand it.
- [x] Add a lightweight editorial rhythm for `Tiny Thoughts`, project updates, and occasional longer writing.

## Longer-Term Ideas

- [ ] Create a visual signal map that connects projects, writing, music, games, cats, and media pages by theme.
- [ ] Add a public build log or work log that makes ongoing changes more visible to returning visitors.
- [ ] Add tiny collectible artifacts, badges, or stamps for visitors who explore different rooms of the site.
- [ ] Add seasonal or occasional homepage variations that keep the atmosphere fresh without changing the site's identity.
- [ ] Create more bridges between emotional/personal pages and technical/project pages so visitors discover both sides of the site.

## Content Workflow Notes

- Treat the site as a layered publishing system:
- raw capture
- light publishable post
- full writing or room
- Not everything from ChatGPT belongs on the site. Save fragments that sound like you, then decide later what form they deserve.
- Favor frequent capture and occasional publishing over waiting for the perfect essay-writing block.

## New Implementation Roadmap

### 4. Reduce Overwhelm At The Top Of The Homepage

Goal:

- Help first-time visitors feel guided instead of flooded by making the top of the homepage more curated than comprehensive.

Suggested approach:

- Keep only a few high-signal decisions near the top.
- Add a single spotlight block such as `Current Signal`, `Featured Project`, or `Start Here This Week`.
- Convert some lower sections into previews with `See more` links rather than full expansions.
- Let the homepage imply there is a bigger world without asking people to take in the whole map immediately.

Definition of done:

- A new visitor can understand the site's shape quickly
- The homepage feels intentional instead of exhaustive
- At least one section lower on the page becomes a preview rather than full-detail content

Status:

- Done: homepage spotlight module added near the top
- Done: writing section turned into a preview with a dedicated `/writings` room
- Done: about section turned into a preview with a dedicated `/about` room

### 5. Low-Friction Content Inbox And Draft Pipeline

Goal:

- Make it easy to capture worthwhile fragments from ChatGPT, daily life, and project work without needing a formal writing session every time.

Suggested approach:

- Add a private admin `Content Inbox` page for quick capture.
- Each inbox entry should support:
- raw content
- source
- bucket
- short note about why it matters
- status such as `Inbox`, `Drafted`, or `Archived`
- Add a shortcut to send promising entries into the Tiny Thoughts editor as a draft.
- Write down the workflow so future-you does not have to rediscover it.

Definition of done:

- There is one obvious place to paste good fragments fast
- A saved inbox item can be turned into a Tiny Thought draft with minimal friction
- The workflow is documented either on the page, in `docs`, or both

Status:

- Done: admin `Content Inbox` page exists with source, bucket, notes, and status
- Done: inbox items can be sent into `Tiny Thoughts` drafts
- Done: inbox items can now also be sent into `Projects` drafts
- Done: workflow is documented on the page and in `docs/low-friction-content-flow.md`

## Recommended First Three

- [x] `Start Here` block on the homepage
- [x] RSS plus at least one recurring update format
- [x] Related-links network between writings, projects, and playful side pages

## Implementation Roadmap

### 1. `Start Here` Block On The Homepage

Goal:

- Reduce choice overload for first-time visitors and make the site's personality easier to grasp within a few seconds.

Suggested approach:

- Add a compact homepage section near the top that says what kind of visitor each entry point is for.
- Pick three paths only, so the choice feels curated rather than like another grid.
- Good candidates:
- `See Projects` for people evaluating your work
- `Read Writing` for people who want voice and perspective
- `Try Something Weird` for people who want the playful side of the site

Likely files to update:

- `app/page.tsx`
- `app/home/HomeHero.tsx`
- `app/home/HomeIntroBand.tsx`
- `app/home/data.ts`
- `app/globals.css`

Possible implementation shape:

- Create `app/home/HomeStartHere.tsx`
- Render it directly after `HomeHero` or `HomeIntroBand`
- Store card copy in `app/home/data.ts` so the section stays easy to tune

Definition of done:

- A new visitor can understand the site in under 10 seconds
- The section has only 3 curated links
- The section feels like part of ArcadeGhosts, not generic SaaS onboarding

### 2. RSS Plus One Recurring Update Format

Goal:

- Give people a reason to return and a way to subscribe without relying on social platforms.

Suggested recurring format:

- Start with `Tiny Thoughts` as the recurring format because it already exists and naturally supports frequent publishing.
- Optionally add a lightweight `/updates` page later that combines new writings, tiny thoughts, and project changes in one stream.

RSS scope:

- Feed 1: writings
- Feed 2: tiny thoughts
- Optional Feed 3: site-wide updates later if you introduce `/updates`

Likely files to update:

- `app/writings.ts`
- `app/TinyThoughts.tsx`
- `app/lib/tiny-thoughts.ts`
- `app/page.tsx`
- `app/seo.ts`

Possible implementation shape:

- Add routes such as `app/writings/rss.xml/route.ts` and `app/tiny-thoughts/rss.xml/route.ts`
- Use existing writing metadata from `app/writings.ts`
- Pull public tiny-thought entries from the same source already used by the homepage
- Add visible RSS links somewhere real people will notice:
- homepage intro band
- writing section
- tiny-thought section

Definition of done:

- At least one feed validates and returns real content
- There is at least one visible subscribe link on the site
- A new tiny thought or writing can appear in the feed without extra manual formatting work

### 3. Related-Links Network Between Writings, Projects, And Playful Pages

Goal:

- Increase page depth and make the site feel like an interconnected world instead of isolated rooms.

Suggested approach:

- Add a small related-links block at the bottom of each writing first.
- Curate the links manually at the beginning rather than building a recommendation system.
- Use thematic bridges, not only same-type links.

Examples:

- a cat/grief writing can link to cat rooms and a more personal project or reflection page
- a Twin Peaks page can link to `The Lodges Within` and strange-media pages
- a project page can link to a writing that explains the impulse behind the build

Likely files to update:

- `app/writings.ts`
- `app/writings/[slug]/page.tsx`
- `app/home/HomeProjects.tsx`
- `app/home/HomeFunAndGames.tsx`
- `app/home/data.ts`
- `app/globals.css`

Possible implementation shape:

- Add a `related` array to each writing entry in `app/writings.ts`
- Each entry can include label, href, and optional reason
- Render a `RelatedSignals` block beneath the writing body
- Expand the pattern later to projects or feature pages if it feels good

Definition of done:

- Every writing page ends with 2 to 4 relevant next clicks
- At least some links cross categories instead of staying within writing only
- The related block feels editorial and intentional, not automated and random

## Suggested Order Of Work

- [x] Ship `Start Here` first because it improves the homepage immediately
- [x] Ship writing RSS second because it is small, useful, and low-risk
- [x] Add manual related links to writings third because it improves exploration without heavy infrastructure
- [x] Expand recurring updates around `Tiny Thoughts` once the feed and navigation path exist

## Next Candidate Items

These came out of the latest homepage and workflow pass and are worth returning to next.

- [x] Add a `Send To Writing Draft` flow from the Content Inbox for longer-form ideas that deserve a fuller draft path.
- [x] Convert one more content-heavy homepage section into a preview plus dedicated room if the homepage still feels too dense.
- [x] Add simple spotlight freshness support such as rotation, history, or a short queue so the homepage spotlight changes more easily over time.

Status:

- Done: Content Inbox can now hand off to `Writing Drafts`, `Now`, `Projects`, and `Tiny Thoughts`
- Done: Tiny Thoughts now has a dedicated `/tiny-thoughts` room while the homepage shows a shorter preview
- Done: Homepage Spotlight now supports a rotating queue of alternate spotlight cards

## Next Steps

Reference: 2026-06-27 18:47 EDT

These are the remaining TODO ideas that still look worthwhile right now, ordered by likely value versus effort.

- [x] Add event tracking for key interactions so future changes can be guided by real visitor behavior.
Reason: Now that the site has stronger structure, search, spotlighting, feeds, and content funnels, lightweight analytics on things like `Start Here`, `Surprise Me`, project clicks, RSS clicks, search usage, and admin content handoffs would help you decide what is actually working.

- [x] Add small connective transitions or micro-copy between sections so the homepage feels even more like one world.
Reason: This is still a good polish item, but it is less urgent than analytics because the homepage is already much more curated than before. Worth doing when you want a quality-of-feel pass rather than a capability pass.

- [x] Add a public build log or work log that makes ongoing changes more visible to returning visitors.
Reason: This is probably the strongest of the longer-term ideas because it matches your current pace of iteration and would create an easier publishing path than full essays.

- [ ] Create a visual signal map that connects projects, writing, music, games, cats, and media pages by theme.
Reason: interesting, but higher effort and easy to overbuild before the site's information architecture fully settles.

- [ ] Add tiny collectible artifacts, badges, or stamps for visitors who explore different rooms of the site.
Reason: fun, but more novelty than leverage at the moment.

- [ ] Add seasonal or occasional homepage variations that keep the atmosphere fresh without changing the site's identity.
Reason: nice atmospheric polish, but not as useful as improving repeat-visit content loops.

- [ ] Create more bridges between emotional/personal pages and technical/project pages so visitors discover both sides of the site.
Reason: partly already happening through related links, preview rooms, spotlighting, and search. Revisit later if discovery still feels siloed.

## Pro ROI Vercel

Reference: 2026-06-27 21:30 EDT

- [ ] Watch the most decision-useful Vercel metrics after a Pro upgrade.
Reason: pay attention to custom events, image optimization usage, top clicked homepage paths, search usage, and repeat-visit behavior so the subscription changes real decisions instead of just adding a bill.

- [ ] Pick the first Vercel AI feature to build only after the traffic and interaction data settles a little.
Reason: a small practical AI surface such as guided discovery, smarter search, or a content-assist workflow will be easier to choose once the new analytics show where visitors actually engage.

- [ ] Separate Vercel Pro features worth coding around from features that are nice but unnecessary.
Reason: custom events, spend controls, and AI Gateway are likely high-value for this site; a short keep/ignore list will help avoid building around platform features just because they exist.
