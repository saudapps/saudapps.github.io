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

## 2026-08-26 PhoneSpace, Filed, and Dufaat review-cycle sync

- [x] Existing product pages and approved screenshot sets compared with the
      visible app interfaces; no duplicate image replacement was required.
- [x] Shared bilingual font-size inheritance corrected across all four app
      routes, with PhoneSpace, Filed, and Dufaat desktop labels aligned to the
      SShift scale and route-specific mobile sizing preserved.
- [x] Existing App Store, release-history, support, privacy, and terms hooks
      preserved; `releases.json` was not edited manually.
- [x] English/light and Arabic/dark browser checks completed locally with no
      horizontal overflow or console error.
- [x] GitHub Pages publication and live route spot-check; all four app routes
      returned HTTP 200 and the live stylesheet matched the reviewed file.

## 2026-08-11 PhoneSpace 1.2 run

- [x] Local app page copy and current screenshots prepared.
- [x] Existing automated version and release-history hooks preserved; no manual
      `releases.json` edit.
- [x] App Store, support, privacy, and terms links checked in the candidate.
- [x] Privacy copy synchronized with the current app behavior.
- [x] Desktop and 390 × 844 mobile layouts checked with no console errors.
- [x] Independent review completed; `cacbdc8` returned `BLOCK` and the findings
      were recorded for correction.
- [x] Follow-up review of `9f20d06` confirmed seven of eight checks and found
      one Night-theme contrast blocker; the candidate was corrected again.
- [x] Corrected candidate `d79a972` received final independent `PASS`.
- [x] Candidate published through `main` and GitHub Pages completed.
- [x] Live PhoneSpace and privacy routes, screenshots, and automatic version
      behavior verified.
- [x] Original publication hold recorded and independently reviewed.
- [x] Saud explicitly superseded that timing hold and approved immediate
      website publication, accepting that Resize/Convert copy may appear before
      the binary while the existing App Store-driven version stays automatic.

## 2026-08-11 Dufaat 2.2 post-release run

- [x] Apple published Dufaat 2.2; the public Saudi App Store lookup returned
      version 2.2 at `2026-08-11T14:00:45Z`.
- [x] Existing Dufaat product, privacy, terms, pricing, and six screenshot
      materials were already published before review.
- [x] The live App Store badge source now observes the public 2.2 version.
- [x] No manual `releases.json` edit was made; this documentation publication
      triggers the existing release-sync workflow to refresh generated What's
      New history.
