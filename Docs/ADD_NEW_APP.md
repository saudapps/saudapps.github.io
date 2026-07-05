# Adding a New App to the Site

Step-by-step playbook for putting a new Saud app on the website and, when it
goes Live, wiring it into both data systems. Pairs with ARCHITECTURE.md (how the
systems work), RELEASES_PIPELINE.md (the release-notes sync) and
WEBSITE_RELEASE_SYNC.md (release verification).

> ⚠️ PUBLIC REPOSITORY. Public-safe only — no secrets, no private source, no
> bundle IDs, no local machine paths.

Two phases: a new app starts in Phase 1 (Coming soon), then moves to Phase 2
once it's approved on the App Store.

## Phase 1 — Coming-soon page (no App Store ID yet)
No live data, so wired into NEITHER system. Model it on an existing coming-soon
app (e.g. `promptbook/`).
1. Create `<app>/index.html` (marketing/landing). Copy an existing app page for
   the shared layout, `.device` frame pattern, RTL, and language toggle.
2. Add legal pages as needed: `<app>/privacy*`, `<app>/terms*`. Match the path
   style you record in APPS.md.
3. Do NOT add `data-app` / `data-releases` hooks and do NOT load `app-data.js`
   or `releases-loader.js` — nothing to fetch yet.
4. Register in `APPS.md` with status "Coming soon / in development".
5. Add the new public URLs to `sitemap.xml` (confirm `robots.txt` is fine).
6. Add a card on the landing `index.html` if it should appear (coming-soon
   styling, no live badges). If you add a card, update the hardcoded stats strip
   count in `div.cred` (see below).
7. Verify locally, then deploy and spot-check the live `saud.im` pages.

## Phase 2 — Going Live (app approved, has a numeric App Store ID)
Wire it into both systems. Reference implementation: `sshift/index.html` and the
SShift card in `index.html` — every hook is in place there. (Filed was the most
recent app taken Live this way.)

**System A — live badges (`app-data.js`):**
1. Add to the `APPS` map at the top of `app-data.js`: `<key>: '<appStoreId>'`
   (already has sshift, phonespace, dufaat, filed).
2. On the app page (and its landing card), add badge elements:
   - `data-app="<key>" data-field="status"`  (live/hidden)
   - `data-app="<key>" data-field="version"` (e.g. `iOS · v1.0`)
   - `data-app="<key>" data-field="rating"`  (start `style="display:none"`)
   - `data-app="<key>" data-field="updated"` (start `style="display:none"`)
3. Ensure the app page loads `app-data.js` (landing already loads it).

**System B — "What's New" (`releases.json` pipeline):**
4. Add to the `APPS` array at the top of `scripts/fetch-releases.mjs`:
   `{ key: '<key>', appStoreId: '<appStoreId>' }`.
5. On the app page, add the render target: `<div data-releases="<key>"></div>`.
6. Ensure the app page loads `releases-loader.js`.
7. **Populate `releases.json`:** the pipeline runs on every push to `main`, so
   committing this wiring will itself trigger a sync. (You can also click
   "Run workflow" in Actions to be immediate.) Confirm the new app appears in
   `releases.json` with versions, not an `error`. See RELEASES_PIPELINE.md if it
   doesn't show. Note: a v1.0 with no release-notes text is normal — the section
   shows the version with a "no notes" line.

**Bookkeeping:**
8. In `APPS.md`, flip the app to **Live**: add the App Store ID + real link.
9. Add/confirm the App Store download button on the app page.
10. Update the hardcoded stats strip in landing `index.html` (`div.cred`):
    bump "N apps" and "M on the App Store" to the new totals (these are manual).
11. Run the WEBSITE_RELEASE_SYNC.md checklist + live spot-check `saud.im/<app>/`
    on mobile + desktop.
12. Log the change in SESSION_LOG.md.

## Real screenshots on a page (optional, any phase)
Owner drops shots into a scratch `<app>/Pic/` folder. Convert/optimize to
~820px-wide JPGs (~60–120KB) in `<app>/assets/screenshots/`, then place them in
`.device` frames (hero + an "A look inside" gallery), mirroring Filed/Dufaat/
SShift. Use only clean/demo data — no real personal/financial info. Delete the
`Pic/` source only AFTER the owner verifies the live pages.

## Quick reference — the five edit points for a Live app
| What | File | Edit |
|---|---|---|
| Live badges list | `app-data.js` | add `<key>: '<id>'` to `APPS` |
| Release-notes list | `scripts/fetch-releases.mjs` | add `{ key, appStoreId }` to `APPS` |
| Badge hooks | `<app>/index.html` (+ landing card) | `data-app` / `data-field` spans |
| What's-New hook | `<app>/index.html` | `<div data-releases="<key>">` |
| Scripts | `<app>/index.html` | load `app-data.js` + `releases-loader.js` |
| Status of record | `APPS.md` | Coming soon → Live + App Store ID/link |
| Landing count | `index.html` `div.cred` | bump the hardcoded N/M (manual) |

## Common pitfalls
- Brand vs internal name: always use the public brand (e.g. "Filed"); the app's
  internal repo name must never appear in this public repo or on the site. See
  APPS.md naming notes.
- `<key>` must be identical everywhere (folder, both `APPS` lists, both `data-*`
  hooks). A mismatch silently shows nothing.
- Don't hand-edit `releases.json` — regenerated; your edit is lost.
- Landing stats strip is hardcoded — easy to forget; update it (step 10).
- All the above are release-sensitive live-site files: plan + get approval
  before implementing, per CLAUDE.md.
