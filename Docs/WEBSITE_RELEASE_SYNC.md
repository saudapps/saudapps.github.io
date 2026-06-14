# Website Release Sync

Authoritative checklist for keeping the public site (https://saud.im) in sync with an
app's real release state. Run this whenever an app changes in a public-facing way.

## When a website update is required
Trigger the sync when ANY of these is true for an app:
- A new App Store version is approved / released.
- The "What's New" / release-notes text changed.
- Screenshots changed.
- Pricing or IAP changed.
- The app name or positioning changed.
- Privacy, terms, or support links changed.

## Sync checklist
- [ ] **App page** — the app's page (e.g. /sshift/, /phonespace/, /promptbook/, /filed/, /dufaat/)
      reflects the current version, copy, and screenshots.
- [ ] **releases.json** — picked up the new version (or the deploy/Action that updates it ran).
- [ ] **What's New (EN/AR)** — present and correct on the page, if the app ships localized notes.
- [ ] **App Store ID / link** — correct and resolving (only for Live apps; "Coming soon" apps have none yet).
- [ ] **Support email** — present and correct.
- [ ] **Privacy / terms links** — present and resolve (match Docs/APPS.md).
- [ ] **Mobile + desktop layout** — page renders correctly on both.
- [ ] **GitHub Pages deploy** — build is green and the change is published.
- [ ] **Live spot-check** — open the live https://saud.im page and verify the change is visible.

## Notes
- Editing live site files (index.html, app-data.js, releases.json, releases-loader.js,
  privacy/terms pages, assets) is release-sensitive — plan and get approval first.
- Do not change GitHub Pages / Jekyll configuration as part of a routine release sync.
- For per-app status and links, see Docs/APPS.md.
