# Release-Notes Pipeline (`releases.json`) — how it works & how to fix it

Deep-dive + troubleshooting for the "What's New" auto-sync. Companion to
ARCHITECTURE.md (big picture) and WEBSITE_RELEASE_SYNC.md (per-release
checklist). Read this when an app's "What's New" is missing or stale.

> ⚠️ PUBLIC REPOSITORY. Public-safe only — no secrets, no private source, no
> local machine paths. Secret *names* are fine; secret *values* live only in
> GitHub Actions secrets.

## What this pipeline does (and what it is NOT)
It generates `releases.json` — the per-version "What's New" text (en + ar) that
`releases-loader.js` renders on each app page. It is SEPARATE from the live
App Store badges (`app-data.js`), which fetch the public iTunes API in the
browser and never touch this pipeline. **A correct version badge does NOT mean
this pipeline is working** — they are two independent systems. (This distinction
caused real confusion once: badges showed the right version while What's New was
silently frozen.)

## The four stages
1. **Trigger** — `.github/workflows/sync-releases.yml` runs on:
   - **`push` to `main`** — PRIMARY. Every deploy re-syncs, so a new App Store
     version is picked up automatically whenever you push anything to the site.
   - **`schedule`** cron `0 3 * * *` (03:00 UTC / 06:00 KSA) — daily BACKUP.
   - **`workflow_dispatch`** — manual "Run workflow" button in the Actions tab.
2. **Fetch** — `node scripts/fetch-releases.mjs` calls the App Store Connect API
   (JWT/ES256) for every app in its `APPS` array (currently `sshift`,
   `phonespace`, `dufaat`, `filed`) and reads each version's `whatsNew` in en + ar.
   Auth = GitHub secrets `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`.
   Runner: Node 22, `actions/checkout@v6` + `actions/setup-node@v6`.
3. **Commit** — writes `releases.json` (always a fresh `updatedAt`); if changed,
   commits + pushes `chore: sync releases [skip ci]`.
4. **Publish** — that push rebuilds GitHub Pages; `releases-loader.js` fetches
   the new `releases.json` and renders it.

## Why it does not loop
Stage 3 commits with the default `GITHUB_TOKEN`. GitHub does NOT start new
workflow runs from `GITHUB_TOKEN` pushes, so the bot's own commit never
re-triggers the `push` job. The `[skip ci]` in the message is a second
safeguard. (Verified: a sync run's bot commit does not spawn another run.)

## Healthy looks like
- `releases.json` `updatedAt` is recent, and
- recent `chore: sync releases [skip ci]` commits exist in history, and
- each Live app's newest App Store version appears under its key.

## Symptom: an app's "What's New" is missing or stale
What happened ~2026-05-24 → 2026-06-17: `releases.json` froze — Dufaat absent,
`updatedAt` stuck in May, and the real SShift 4.2 / PhoneSpace 1.1 missing —
even though the page badges showed correct versions.

Diagnose in order:
1. GitHub → **Actions** → **"Sync App Releases"**; look at the run list.
   - **All runs say "Manually run", none scheduled** → the daily cron is NOT
     firing. GitHub auto-pauses scheduled workflows after ~60 days of repo
     inactivity. This was the root cause. The `push` trigger now covers every
     deploy; for true hands-off on App-Store-ONLY releases (when you don't push
     to the site), re-enable the schedule from the Actions tab.
   - **Red ✗ runs** → open the latest failed run → step "Fetch releases from App
     Store Connect" → read the error. Usually an App Store Connect auth failure
     (expired/rotated key). Fix: update the GitHub secret(s) under repo
     **Settings → Secrets and variables → Actions**. The owner does this; never
     paste secret values anywhere public.
2. **Populate now:** click **"Run workflow"** on `main`, or just push any commit.
   Confirm a green run, then check `releases.json` has a new `updatedAt` and the
   expected versions.

## A v1.0 with empty notes is normal
First releases often have no release-notes text on the App Store, so `whatsNew`
is empty. The loader still shows the version with a "no notes" line — that is
expected, not a failure (e.g. Dufaat 1.0, PhoneSpace 1.0).

## Hard rules
- **Never hand-edit `releases.json`** — it is regenerated; your edit is lost.
- Adding an app = add `{ key, appStoreId }` to the `APPS` array in
  `scripts/fetch-releases.mjs` (see ADD_NEW_APP.md). The key must match the app
  folder and the `data-releases="<key>"` hook on the page.
- The workflow file is release-sensitive CI — plan + approve before editing.
