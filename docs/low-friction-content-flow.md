# Low-Friction Content Flow

This file is rendered inside the `/admin/content-inbox` page as the in-app Instructions panel.
If you update the workflow guidance here, the admin page will reflect it automatically.

This is the lightweight publishing system for ArcadeGhosts.

## Goal

Make it easy to capture good raw material without forcing every idea to become a polished essay right away.

## Core Idea

Use three levels of content:

1. Raw capture
2. Light publishable post
3. Full writing or page

Not every ChatGPT exchange, note, or observation needs to become site content. The job is to save the parts that actually sound like you, then decide later what form they deserve.

## Recommended Workflow

1. When a useful line, idea, reflection, or project note appears, paste it into the admin Content Inbox.
2. Pick the nearest source and bucket without overthinking it.
3. Add a short note about why it felt worth saving.
4. Leave it in `Inbox` unless you are ready to use it immediately.
5. When something feels publishable as a short post, use `Send To Tiny Thought`.
6. When something is really a build note or project update, use `Send To Project Draft`.
7. When something belongs in the homepage `Now` section, use `Send To Now Draft`.
8. When something clearly wants a longer-form shape, use `Send To Writing Draft`.
9. Only turn a fragment into a full public writing piece if it still feels alive after sitting for a while.

## Current Admin Shortcuts

- `Send To Tiny Thought`: good for compact reflections, short observations, funny lines, or quick publishable thoughts
- `Send To Project Draft`: good for build notes, project updates, next steps, blockers, or ideas that belong on a project card first
- `Send To Now Draft`: good for current-focus notes that should show up in the homepage `Now` section
- `Send To Writing Draft`: good for ideas that want more room, structure, or patience before becoming public writing

These shortcuts are meant to reduce retyping, not to skip editing. Treat the imported draft as a head start.

## Writing Drafts Workflow

- `Writing Drafts` is the staging area for anything that wants more than a Tiny Thought.
- The draft editor now shows when a slug already matches an existing public writing and links straight to that live page.
- `Export Publish Bundle` writes the markdown file into `public/writings/{slug}.md` and generates the metadata snippet you can paste into `app/writings.ts`.
- That export path is intentionally half-automated: it removes the tedious parts without silently rewriting your public writing index.

## Good Buckets

- `good-line`: a phrase, framing, or paragraph worth keeping
- `site-idea`: homepage, structure, UX, feature, or editorial idea
- `tiny-thought`: likely a short publishable post with light editing
- `essay`: probably wants real writing time later
- `now`: current-focus material that belongs in the homepage `Now` section
- `project-update`: build log material, project note, progress update
- `not-sure`: worth saving, unclear future use

## Good Questions To Ask

- Does this sound like me, or just polished filler?
- Is there one sentence here that feels true enough to keep?
- Would this work as a Tiny Thought with light editing?
- Is this actually better as a project update than a post?
- Is this really a `Now` signal rather than a standalone post?
- Does this want a fuller draft before it deserves a public writing page?
- Is this a private processing note instead of public site content?
- Does this help the site feel more alive, more human, or easier to revisit?

## Good Tiny Thought Candidates

- a short realization
- a funny or strange moment
- a compact opinion
- a project note with personality
- a single useful paragraph from a longer ChatGPT conversation

## Things To Avoid Publishing Too Fast

- text that sounds competent but not personal
- emotionally real material that still feels too hot
- generic summaries
- notes that only make sense inside the original conversation

## Healthy Target

Aim for:

- frequent capture
- occasional Tiny Thoughts
- rare but meaningful essays

The inbox is supposed to reduce pressure, not create another homework system.
