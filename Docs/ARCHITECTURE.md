# Saud Apps Website — Technical Architecture

How the site is built and how its data flows. Companion to CLAUDE.md (roles,
discipline), WEBSITE_RELEASE_SYNC.md (per-release checklist), ADD_NEW_APP.md
(adding an app) and RELEASES_PIPELINE.md (the release-notes sync deep-dive).
This file is the "how it actually works" reference.

> ⚠️ PUBLIC REPOSITORY. Public-safe only: no secrets, no API keys, no private
> source, no local machine paths. Secret *names* are fine (already referenced in
> committed workflow/script files); secret *values* live only in GitHub secrets.

## Stack
- Static site. No framework, no build step for the pages — plain HTML + CSS +
  vanilla JS, served as-is.
- Hosting: GitHub Pages, served from the `main` branch.
- Custom domain: `saud.im` via the `CNAME` file. Repo: `saudapps.github.io`;
  public site: `https://saud.im`. There is no staging — `main` IS production.

## Repo map
- `index.html` — landing page: app cards + live status/version badges. Loads
  `app-data.js` only (no "What's New" on the landing).
- `<app>/index.html` — one folder per app: `sshift/`, `phonespace/`, `dufaat/`,
  `filed/` (Live), `promptbook/` (not Live). Live app pages load BOTH
  `app-data.js` and `releases-loader.js`.
- `<app>/privacy*`, `<app>/terms*`, `support/`, `legal/`, `about/` — static
  pages. (Path style varies per app — see APPS.md for exact links.)
- `app-data.js` — DATA SYSTEM A (live App Store badges, client-side).
- `releases.json` — DATA SYSTEM B output. Generated; never hand-edit.
- `releases-loader.js` — DATA SYSTEM B renderer (client-side).
- `scripts/fetch-releases.mjs` — DATA SYSTEM B fetcher (runs in CI).
- `.github/workflows/sync-releases.yml` — the job that runs the fetcher.
- `assets/` — shared CSS/JS/icons; per-app media in `<app>/assets/` (incl.
  `<app>/assets/screenshots/` — optimized real screenshots in `.device` frames).
- `assets/og/` — designed 1200×630 social-preview cards (og-home + one per
  Live app), wired on the 5 marketing pages only (see DESIGN_SYSTEM.md).
- `404.html` — branded bilingual not-found page; GitHub Pages serves it
  automatically for any missing path (absolute asset paths; not in sitemap).
- `CNAME`, `robots.txt`, `sitemap.xml` — site config (release-sensitive).
- `Docs/` — these operating docs.

## The two data systems (independent; share nothing; fail independently)
A working badge does NOT imply System B is working, and vice-versa. They are
separate. Both currently cover the four Live apps: sshift, phonespace, dufaat, filed.

### System A — Live badges (`app-data.js`)
- Runs in the visitor's browser on page load.
- Source: PUBLIC iTunes Search API `https://itunes.apple.com/lookup?id=<id>` —
  no auth, no secrets.
- Caches per app in `localStorage` for 30 min; falls back to stale cache, then
  to the page's hardcoded HTML, on failure.
- Hooks: `data-app="<key>"` + `data-field="<status|version|rating|updated>"`.
- App list: the `APPS` map at the top of `app-data.js`
  (currently `sshift`, `phonespace`, `dufaat`, `filed`).
- Effect: version / rating / "Updated …" stay current per visit — no rebuild.

### System B — "What's New" / release notes (`releases.json` pipeline)
Full detail + troubleshooting in RELEASES_PIPELINE.md. In short:
1. **Trigger** — `sync-releases.yml` runs on **`push` to `main` (primary — every
   deploy re-syncs)**, a daily **`schedule`** cron `0 3 * * *` (06:00 KSA,
   backup) and **`workflow_dispatch`** (manual button).
2. **Fetch** — `node scripts/fetch-releases.mjs` calls the authenticated **App
   Store Connect API** (JWT/ES256) for each app in its `APPS` array (sshift,
   phonespace, dufaat, filed) and reads each version's `whatsNew` in en + ar. Auth =
   GitHub secrets `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`. Runner:
   Node 22, `actions/checkout@v6` + `actions/setup-node@v6`.
3. **Commit** — writes `releases.json`; commits + pushes
   `chore: sync releases [skip ci]` only if it changed. (Uses `GITHUB_TOKEN`, so
   the bot's own push does NOT re-trigger the `push` job — no loop.)
4. **Render** — the push rebuilds Pages; `releases-loader.js` reads
   `releases.json`, shows the latest version prominently + older ones under
   "Show all versions", and switches ar/en with `<html lang>`.
- Hook: `<div data-releases="<key>"></div>` on the app page.

## Deployment flow
- Edit locally → commit → `git push` to `main` → Pages rebuilds → live on
  `https://saud.im` in a few minutes. **The push also triggers System B**, so
  every deploy re-syncs release notes automatically.
- Treat every change to a live-site file as release-sensitive (plan + approve
  first — see CLAUDE.md).

## App coverage status (current)
- Wired into BOTH data systems (Live, have App Store IDs): `sshift` (4.2),
  `phonespace` (1.1), `dufaat` (2.1), `filed` (1.0).
- **Parked**: `promptbook` — page exists and is reachable at `/promptbook/`, but
  it is HIDDEN from the landing (its card + footer link are commented out, code
  retained) and not wired into either system. Un-hide by reversing the comments
  in `index.html` and bumping the stats counts.
- To bring an app online, see ADD_NEW_APP.md.

## Known manual touch-point — landing stats strip
The "N apps · M on the App Store · Built for iOS" strip in `index.html`
(`div.cred`) is **hardcoded** (currently `4 apps` / `4 on the App Store`). It does
NOT auto-update — update it by hand whenever an app is added, hidden, or flipped
Live. (Optional future improvement: compute both numbers from the rendered cards.)

## Failure modes
- iTunes API down → badges fall back to cache/hardcoded; page fine.
- ASC fetch fails → that app gets `versions: []` + `error` in `releases.json`;
  loader hides its empty section silently.
- `releases.json` missing/unparseable → loader hides all release sections.
- **Pipeline frozen** (releases.json `updatedAt` stale, newest versions missing
  even though badges are correct) → the scheduled sync is paused or failing.
  This is the most important silent failure — see RELEASES_PIPELINE.md.
