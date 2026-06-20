# Converting This Repo To `pnpm`

This document outlines what it would take to migrate this project from `npm` to `pnpm`, plus whether the change is actually worth making.

## Short Answer

For this repo, switching to `pnpm` is optional rather than urgent.

Why it could be worthwhile:

- faster repeat installs in active development
- stricter dependency resolution, which can expose hidden package issues earlier
- cleaner workspace if this repo ever grows into a multi-package setup

Why it may not be worth the churn right now:

- the project is currently simple and single-package
- the existing `npm` setup is already stable
- multiple docs currently assume `npm`
- the practical gain will be modest unless installs are a regular pain point

Recommendation:

- stay on `npm` unless you specifically want `pnpm` consistency across your machines/projects or you expect this repo to become a monorepo/workspace later
- if you do switch, do it as a small focused maintenance task, not mixed into feature work

## Current Repo State

As of this note:

- the repo uses `package.json`
- `package-lock.json` is committed
- there is no `pnpm-lock.yaml`
- there is no existing `pnpm` config file such as `.npmrc`
- docs and README currently reference `npm` commands

Known places that will need wording updates:

- `README.md`
- `docs/repo-summary.md`
- `docs/current-work.md`
- `docs/refactor-roadmap.md`

## Migration Steps

### 1. Install and pin `pnpm`

Pick one of these approaches:

- use Corepack with the Node version already required by the repo
- install `pnpm` globally and pin the version in the repo

Recommended approach:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Then add the package manager field to `package.json` so future installs use the same tool/version family.

Example:

```json
"packageManager": "pnpm@10"
```

Use the exact version you decide to standardize on.

### 2. Remove the npm lockfile and generate a pnpm lockfile

Delete:

- `package-lock.json`

Then generate:

```bash
pnpm install
```

This should create:

- `pnpm-lock.yaml`

### 3. Verify dependency behavior

Run the normal checks:

```bash
pnpm lint
pnpm test
pnpm build
```

Also verify local development:

```bash
pnpm dev
```

Because `pnpm` is stricter about dependency access, this is the point where any undeclared dependency issues would show up.

### 4. Update repo documentation

Replace npm-specific commands in:

- `README.md`
- `docs/repo-summary.md`
- `docs/current-work.md`
- `docs/refactor-roadmap.md`

Examples:

- `npm install` -> `pnpm install`
- `npm run dev` -> `pnpm dev`
- `npm run build` -> `pnpm build`
- `npm run lint` -> `pnpm lint`
- `npm test` -> `pnpm test`

One nuance:

- `pnpm` usually does not need `run` for standard scripts

If you want to keep docs tool-agnostic, another option is to phrase commands as "run the `dev` script" instead of naming the package manager everywhere.

### 5. Check deployment assumptions

If Vercel sees `pnpm-lock.yaml`, it will typically use `pnpm` automatically.

Before merging the change, confirm:

- the project has no deployment config forcing `npm`
- local and hosted installs use the same Node version expectations

This repo already declares:

- `node >=20.9.0`

That should be compatible with modern `pnpm`, but it is still worth verifying in Vercel project settings.

### 6. Clean install from scratch

Before considering the migration done, validate a cold start:

1. remove `node_modules`
2. run `pnpm install`
3. run `pnpm lint`
4. run `pnpm test`
5. run `pnpm build`

That catches most migration mistakes quickly.

## Risks And Gotchas

### Hidden dependency access

`pnpm` is better at surfacing packages that are being used without being declared directly. If anything in the repo relies on a transitive dependency by accident, the migration may break until the correct package is added explicitly.

### Tooling muscle memory

This repo's maintenance docs currently use `npm` language. That is easy to update, but it creates a temporary mismatch until the docs are refreshed.

### Mixed-package-manager confusion

Do not keep both lockfiles long-term. Once migrated, commit `pnpm-lock.yaml` and remove `package-lock.json`.

### Future contributor friction

If this repo is mostly maintained by one person, this is small. If other people occasionally jump in, make sure the package manager choice is obvious in `README.md` and `package.json`.

## When The Switch Is Worth It

The migration is more justified if any of these are true:

- you already use `pnpm` on most other projects
- install speed or disk usage is annoying often enough to notice
- you expect to introduce a workspace/monorepo structure
- you want stricter dependency boundaries as a guardrail

## When It Is Not Worth It

The migration is probably not worth prioritizing if:

- the repo is working fine and installs are not a problem
- you want to minimize maintenance churn
- there is no near-term plan for workspaces or multi-package tooling

## Suggested Decision For This Repo

My recommendation is:

- do not switch purely for theoretical cleanliness
- switch if you personally prefer `pnpm` and want to standardize your local workflow

In other words, this is a reasonable quality-of-life migration, not a high-value architectural improvement.
