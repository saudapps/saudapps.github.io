# Saud Apps Website — Session Log

Running log of work sessions. Newest entry on top. English only.
Public repo: keep entries free of secrets and private local machine paths.

## End-of-session checklist (run every session)
1. Append a new dated entry below using the template (Done / Decisions /
   Open-next / Deploy state / Live-check).
2. Record deploy state honestly — did the change publish to GitHub Pages?
3. Commit + push, or write explicitly why not. Working tree clean or intentionally stashed.
4. If a site/page change went live → note the live-check result for the affected saud.im page(s).
5. Note anything handed to ChatGPT for review.
6. Write the single most important NEXT action so the next session starts cold
   without re-discovery.

<!-- TEMPLATE — copy for each new session
## YYYY-MM-DD — <short title>
- Done:
- Decisions:
- Open / next:     <single most important next action>
- Deploy state:    published to Pages? which pages changed?
- Live-check:      which saud.im pages verified live, and result
- ChatGPT review:  <what was sent out, if anything>
-->

## 2026-06-17 — Landing: hide Promptbook + fix stats strip
- Done: Landing page only (index.html). Hid Promptbook from the landing WITHOUT
  deleting code: wrapped the whole `<article class="app-card promptbook">` block
  in a single HTML comment (folded its inner `<!-- Promptbook -->` marker into the
  wrapper opening so comments don't nest; restore by removing the wrapper lines),
  and commented out the footer `<a href="/promptbook/">Promptbook</a>` link.
  Updated the hardcoded stats strip (div.cred): "5 apps"→"4 apps"
  (٥ تطبيقات→٤ تطبيقات), "2 on the App Store"→"3", "Built for iOS" unchanged →
  now reads "4 apps · 3 on the App Store · Built for iOS". Docs/APPS.md Promptbook
  row annotated as parked/hidden (code retained, status still Coming soon).
- Decisions: HTML comments can't nest, so the card's existing `<!-- Promptbook -->`
  label became the opening line of the wrapping comment — one comment span, cleanly
  reversible. Did NOT touch promptbook/ folder, its pages/assets, or sitemap.xml —
  /promptbook/ stays directly reachable; only removed from the landing surface.
- Open / next: When Promptbook is ready to relaunch, un-hide by removing the two
  comment wrappers (card + footer link) and bump the stats strip back (apps count
  + App Store count).
- Deploy state: committed + pushed to main; GitHub Pages rebuilds the landing.
  No other pages changed.
- Live-check: PENDING owner — verify saud.im shows 4 cards (no Promptbook), strip
  reads "4 apps · 3 on the App Store", and saud.im/promptbook/ still loads directly.
- ChatGPT review: none.

## 2026-06-17 — Dufaat: Coming soon → Live
- Done: Took Dufaat live across the site, mirroring SShift/PhoneSpace exactly.
  Wired key `dufaat` (App Store ID 6780440703) into BOTH data systems:
  app-data.js APPS map and scripts/fetch-releases.mjs APPS array. On
  /dufaat/index.html replaced the coming-soon hero block with a real "Download
  on the App Store" button (https://apps.apple.com/ae/app/dufaat/id6780440703)
  + the live badge set (data-field status / version="iOS · v1.0" / rating hidden
  / updated hidden), kept the Privacy link, added a "What's New" section with
  `<div data-releases="dufaat">`, and loaded /app-data.js + /releases-loader.js.
  On the landing (index.html) flipped the Dufaat card from coming-soon to live
  (App Store button + live badges, rating hidden). Docs/APPS.md Dufaat row → Live.
- Decisions: Hardcoded fallback v1.0 confirmed via itunes lookup id=6780440703
  (Dufaat, Finance, Free, version 1.0). After wiring, status/version/rating/
  "Updated …"/What's-New populate automatically (app-data.js per-visit fetch +
  daily sync-releases pipeline) — no manual version/notes upkeep. Used the AE
  storefront URL per the verified App Store URL. ADD_NEW_APP.md / ARCHITECTURE.md
  do not exist in this repo, so those steps were N/A.
- Open / next: After push, manually run GitHub → Actions → "Sync App Releases" →
  Run workflow (workflow_dispatch); confirm releases.json gains a `dufaat` entry
  with versions (not an error). gh CLI is not installed locally, so this dispatch
  must be done from the GitHub UI. Never hand-edit releases.json.
- Deploy state: committed + pushed to main; GitHub Pages will rebuild /dufaat/
  and the landing. releases.json unchanged until the workflow is dispatched.
- Live-check: PENDING owner — verify saud.im/dufaat/ (mobile + desktop): status
  live, version + "Updated …" populate, rating hidden, What's-New renders and
  toggles EN/AR, App Store button resolves; verify landing Dufaat card shows live
  badges.
- ChatGPT review: none.

## 2026-06-17 — Filed landing: real app screenshots
- Done: Replaced coded illustrations on /filed/ with real in-app screenshots
  (owner-confirmed demo/clean data — no sensitive info). Converted 5 HEIC shots
  (filed/Pic/{1,2,4,5,6}.HEIC) → optimized JPGs (~820px, 72–124KB) in new
  filed/assets/screenshots/ as library.jpg, folder-invoices.jpg,
  viewer-service-agreement.jpg, sign-by-hand.jpg, settings-privacy.jpg. Added a
  256px app-icon tile (filed/assets/app-icon.png, from assets/icon-filed.png) to
  the hero. Hero device now shows the real Library; the "Sign it, by hand" split
  shows the real signing screen; added a new "A look inside Filed" 3-up gallery
  (folders / reader / Face ID settings) reusing the site's .device frame pattern.
  Feature grid and page identity unchanged. Pic/3.HEIC unused (redundant).
- Decisions: Reused existing .device frame CSS (same as PhoneSpace) for theme/RTL/
  responsive consistency; left now-unused .fl-* coded-mockup CSS in place (harmless,
  minimal diff). filed/Pic/ intentionally NOT deleted — owner verifies live first.
- Open / next: After owner's visual check, delete filed/Pic/ (or owner removes it).
  Post App Store approval, add the real App Store link + flip Filed to Live in APPS.md.
- Deploy state: published to Pages from main — filed/index.html + new filed/assets/* added.
- Live-check: verify saud.im/filed/ renders all real screenshots after Pages rebuild.
- ChatGPT review: none.

## 2026-06-16 — Filed pages prepped for App Store submission
- Done: Reframed Filed pages ahead of submission. (1) /filed/ — replaced the
  "Coming soon to the App Store" disabled button with a Contact-support primary
  CTA (mailto:support@saud.im) and added a Terms ghost link beside Privacy;
  marketing layout/design otherwise untouched. (2) /filed/privacy/ — rewrote §8
  to remove the explicit iCloud reference (iCloud is hidden in v1.0) while keeping
  the no-cloud-sync / no-accounts / local-only substance; rest of policy intact.
  (3) /filed/terms/ — left as-is; verified all four required points are covered
  (local PDF management, visual signature ≠ certified/PKI digital signature, user
  responsible for documents, no data-loss/recovery guarantee + backups are user's).
- Decisions: Per owner, kept the existing marketing landing page (Option 1) rather
  than replacing it with a bare support page; the real App Store link will be added
  post-release. No general site design changed outside Filed pages. No iOS app changes.
- Open / next: After App Store approval, add the real App Store link to /filed/ and
  flip Filed to "Live" in Docs/APPS.md per WEBSITE_RELEASE_SYNC.md.
- Deploy state: published to Pages from main — filed/index.html, filed/privacy/index.html changed.
- Live-check: verify saud.im/filed/, /filed/privacy/, /filed/terms/ after Pages rebuild.
- ChatGPT review: none.

## 2026-06-14 — Operating-system docs added
- Done: Added CLAUDE.md, Docs/APPS.md, Docs/WEBSITE_RELEASE_SYNC.md,
  Docs/SESSION_LOG.md using the Saud Apps operating-system pattern. Docs only —
  no site pages, index.html, app-data.js, releases.json, releases-loader.js,
  assets, CNAME, sitemap.xml, or Pages/Jekyll config touched.
- Decisions: This completes the operating-system rollout — all five private app
  repos plus the public website repo now carry operating-system docs. Website docs
  are written public-safe (no private source, no secrets, no local machine paths).
- Open / next: Use Docs/WEBSITE_RELEASE_SYNC.md whenever an app release needs the
  site updated; keep Docs/APPS.md current as apps move from "Coming soon" to "Live".
- Deploy state: docs only — no live site pages changed; no functional deploy impact.
- Live-check: n/a (no public page modified).
- ChatGPT review: none.
