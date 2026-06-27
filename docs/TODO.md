# Website TODO

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
- [ ] Add a rotating homepage spotlight such as current signal, current fixation, featured project, or featured essay.
- [x] Surface a few recent guestbook messages higher on the homepage so community activity is easier to notice.
- [x] Add custom Open Graph images for major pages so shared links feel more polished and clickable.
- [ ] Add small connective transitions or micro-copy between sections so the homepage feels even more like one world.

## Longer-Term Ideas

- [ ] Create a visual signal map that connects projects, writing, music, games, cats, and media pages by theme.
- [ ] Add a public build log or work log that makes ongoing changes more visible to returning visitors.
- [ ] Add tiny collectible artifacts, badges, or stamps for visitors who explore different rooms of the site.
- [ ] Add seasonal or occasional homepage variations that keep the atmosphere fresh without changing the site's identity.
- [ ] Create more bridges between emotional/personal pages and technical/project pages so visitors discover both sides of the site.

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
