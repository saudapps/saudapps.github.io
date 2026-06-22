# Saud Apps Website — Claude Operating Context

Always-loaded context for Claude Code. STABLE facts only.
Running session state lives in Docs/SESSION_LOG.md.

> ⚠️ PUBLIC REPOSITORY. Everything committed here is world-readable.
> - Never commit private app source code, signing assets, API keys, secrets, or `.env` files.
> - Never include private local machine paths (e.g. home-directory / Desktop paths) in any file.
> - Never paste internal-only notes; assume anything here can be read by anyone.

## Identity
| Field | Value |
|---|---|
| Repo | https://github.com/saudapps/saudapps.github.io |
| Domain | https://saud.im |
| Hosting | GitHub Pages (static, served from `main`); custom domain via CNAME `saud.im` |
| Purpose | Public Saud Apps website: landing + app pages, privacy/terms/support, legal, screenshots/assets, release notes |

## Roles
- Claude (chat) — PM / planner. Scopes, designs, writes specs, reviews diffs.
  Discussion-first; explicit approval gates before any implementation.
- Claude Code — executor. Implements approved specs; commits within the gates.
- ChatGPT — external reviewer. Read-only second opinion on plans or diffs.
  No write access; nothing it says overrides the approval gates.
- Discipline: plan before build, discuss before implement, verify before ship.

## Website responsibilities
- Public marketing/landing pages for each app.
- Privacy, terms, and support pages.
- Release notes / "What's New" surfaced from `releases.json`.
- Screenshots and marketing assets.
- Keeping App Store links, status, and copy in sync with each app's actual release state.

## What belongs in this repo
- Static site files: HTML, CSS, JS, images, fonts, icons.
- Per-app public pages and their privacy/terms/support content.
- `releases.json` and the loader that renders release info.
- Site config that is already part of the repo (CNAME, robots.txt, sitemap.xml).
- These operating docs under `Docs/`.

## What must NEVER be placed in this repo
- Private app source code (it lives in the private per-app repos — see Docs/APPS.md).
- Signing certificates, provisioning profiles, API keys, tokens, secrets.
- Private local machine paths or internal-only documents.
- Anything that should not be publicly visible.

## Release sync rule
A website update is required when an app changes in any public-facing way:
new App Store version approved/released, "What's New" changed, screenshots changed,
pricing/IAP changed, app name/positioning changed, or privacy/terms/support links changed.
When any apply, follow Docs/WEBSITE_RELEASE_SYNC.md before calling the release done.

## Pages safety rules
- Do NOT edit `index.html`, `app-data.js`, `releases.json`, `releases-loader.js`,
  `sitemap.xml`, `robots.txt`, `CNAME`, assets, or any privacy/terms page unless the
  task explicitly asks for that change and it is approved.
- Do NOT change GitHub Pages / Jekyll configuration.
- Treat anything that affects the live site as release-sensitive — plan and get approval first.
- Verify the live https://saud.im pages after any site change.

## Where to look
- Docs/APPS.md                 — master public index of all Saud Apps (repos, pages, status).
- Docs/ARCHITECTURE.md         — technical: stack, file map, the two data systems, deploy flow, coverage.
- Docs/ADD_NEW_APP.md          — step-by-step to add an app and wire it Live (both systems).
- Docs/DESIGN_SYSTEM.md        — visual design system: homepage + per-app identities, hero pattern, the app-faithful re-skin recipe + lessons.
- Docs/RELEASES_PIPELINE.md    — how releases.json is produced + how to fix it when What's-New is stale.
- Docs/WEBSITE_RELEASE_SYNC.md — when/how to update the site for an app release.
- Docs/SESSION_LOG.md          — running session log; newest entry on top.

## Session protocol
- Start: read this file + the latest (top) entry of Docs/SESSION_LOG.md.
- End:   append a dated entry to Docs/SESSION_LOG.md.
