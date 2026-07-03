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

## 2026-07-03 — Dufaat 2.1 website sync (screenshots + copy)
- Done: Synced saud.im/dufaat/ for the live 2.1 (build 3) release. Swapped in the
  real 2.1 App Store screenshots (EN set), resized 1320×2868 → 820×1781 JPG via
  sips: hero = installments.jpg (03), gallery = paysoon.jpg (01) + plan-detail.jpg
  (05) + paysoon-form.jpg (04). Retired the 6 stale 2.0 shots (home, home-light,
  plan-deferred, new-plan, plan-car, settings). Copy: added a "Pay Soon / للتسديد"
  feature card (EN+AR); split the old "Reminders & reports" card into "Reminders"
  + a dedicated "PDF reports" card with the improved-export wording. Bumped the
  hardcoded hero badge fallback v1.0 → v2.1 (app-data.js still overrides it live).
  Feature grid now 8 cards (3-3-2, no orphan); gallery 3 device frames. App repo
  (Desktop/Dufaat) untouched. Commit f5aae96 `dufaat: 2.1 screenshots + copy`.
- Decisions: 02-pdf (PDF report) deliberately NOT placed in a phone frame
  (letterbox bars look wrong) — PDF is covered by copy instead. Site keeps ONE
  image set (EN UI chrome) with bilingual captions, per existing structure — no
  per-language image swap. releases.json NOT hand-edited (hard rule): the push
  re-triggered sync-releases, but the Action had already pulled 2.1 earlier today
  (versions 2.1/2.0/1.0; full EN+AR What's New).
- Open / next: none required. Optional: align the Pay Soon feature-card copy
  closer to the App Store wording ("money you pay off with your monthly salary,
  separate from long-term installments") if desired.
- Deploy state: committed + pushed to main (rebased over accumulated bot sync
  commits). GitHub Pages redeployed ~30s later; new assets live, old ones 404.
- Live-check: saud.im/dufaat/ verified live (desktop, EN + AR/RTL) — hero shows
  new Installments screenshot, 3 gallery shots render, badge reads iOS · v2.1,
  What's New renders Version 2.1 (Pay Soon + improved PDF reports). No console
  errors; all 4 new image URLs 200, all 6 old URLs 404.
- ChatGPT review: none.

## 2026-06-22 — Support: add "Dufaat · Common topics" FAQ
- Done: Added a new "Dufaat · Common topics" section to support/index.html — 7
  bilingual (EN/AR) Q&A drawn from the real app (what Dufaat is, adding a plan,
  marking paid / deferring, reminders, privacy/no-upload, backup & restore,
  receipts & PDF export). Placed between the SShift and PhoneSpace sections,
  matching their exact markup (section--tight > wrap--narrow > eyebrow +
  section-title + collapsible details.faq with data-en/data-ar bodies). Additive
  — one new <section aria-label="Dufaat common topics">; +87 lines, nothing else
  changed. Filed deferred (still coming-soon — no section added).
- Decisions: details kept collapsible (the force-open was preview-only); RTL +
  EN/AR toggle inherited automatically from the matched markup. support page
  only — no app pages / saud.css / data pipeline touched.
- Deploy state: committed + pushed to main; static support page → Pages rebuilds
  saud.im/support/.
- Live-check: PENDING owner — saud.im/support/ desktop + mobile, light AND dark:
  the Dufaat section sits between SShift and PhoneSpace, the 7 FAQs expand/collapse,
  bold in-app names render, and the EN/AR toggle flips them to Arabic/RTL correctly;
  contact form + other sections unchanged.
- ChatGPT review: none.

## 2026-06-22 — Docs: add DESIGN_SYSTEM.md (visual system + re-skin recipe)
- Done: Added Docs/DESIGN_SYSTEM.md (verbatim owner-approved content) documenting
  the visual design system — homepage graphite identity, per-app colour
  identities (SShift/PhoneSpace/Filed/Dufaat), the shared two-column hero +
  brand-lockup pattern, each app's character + WHY they differ, the 5-stage
  app-faithful re-skin recipe (extract → transfer → prompt → preview → apply),
  the hard-won lessons (dormant asset-catalog colours, extract recipes not flat
  hex, each app from its own source, Simulator > real-phone, _v2src is temp,
  don't touch live data hooks), and special cases (PhoneSpace identity
  correction, limited assets; Filed stays flat). Linked it from CLAUDE.md
  "## Where to look" (one column-aligned bullet, after the ADD_NEW_APP.md line).
- Decisions: Docs-only, additive; public-safe (no secrets/internal names/local
  paths). Content written verbatim as approved — not paraphrased.
- Deploy state: committed + pushed to main; docs-only — no site render change
  (no app pages / saud.css / data pipeline touched).
- Live-check: n/a (docs only).
- ChatGPT review: none.

## 2026-06-22 — PhoneSpace Part 2: drill-down sections → code-drawn
- Done: Converted the two PhoneSpace drill-down sections from old v1 screenshots
  to code-drawn, app-faithful, cream+serif visuals (phonespace/index.html only).
  • Photos "Find what you don't need": cream result-row cards — each a green
    #5EC46B 4px leading stripe + monochrome grey SF-style icon + serif count/name/
    sub + right-aligned serif size, hairline + soft shadow; serif "Reclaimable ·
    ~246 MB" footer (green). No screenshot.
  • Compress & convert: a burgundy #740031 Compress card (eyebrow + serif title,
    "Reclaim up to 6.5 GB", quality chips Balanced=filled burgundy+white / Light /
    Maximum, burgundy CTA with soft accent shadow) + a mustard #E7B636 Convert card
    (format chips JPEG=filled mustard+dark ink / HEIC / PNG / PDF, mustard CTA).
    Chips 12px radius, active=filled accent / inactive=clear+hairline. No screenshot.
  • Removed the now-unused old images via git rm: phonespace/assets/screen-photos.jpg
    + screen-compress.jpg (confirmed nothing else referenced them).
  • Section copy/headlines unchanged; flat (only gradients remain the ring conic +
    cream hero-card linear + donut masks); zero blur. PhoneSpace LIVE hooks
    (data-app/data-field, data-releases, app-data.js, releases-loader.js,
    version/What's-New) untouched. saud.css + other apps untouched.
- Deploy state: committed + pushed to main; live HTML change → Pages rebuilds
  /phonespace/. Data pipeline untouched.
- Live-check: PENDING owner — verify saud.im/phonespace/ mobile + desktop, light
  AND dark: the two sections are code-drawn (no old screenshots), green Photos rows
  + burgundy Compress / mustard Convert cards read right, cream+serif consistent;
  badges + What's-New present; sections above/below intact; Dufaat/SShift/Filed
  unchanged.
- ChatGPT review: none.

## 2026-06-22 — PhoneSpace identity CORRECTION: amber → cream + serif
- Done: Applied the owner-approved PhoneSpace re-skin to the app's REAL identity
  (the old warm-amber accent never matched the app). phonespace/index.html +
  privacy.html + terms.html + one saud.css line + new home screenshots.
  • Cream canvas (#FCFBFA / #0F0F0F) + New York SERIF content (Fraunces/New York/
    Georgia stack scoped to html[lang="en"]; Arabic keeps its own font); cards
    #FFFFFF / #1C1C1B, 0.5px hairlines (black@10% / white@20%); chrome/eyebrows
    stay sans. Amber killed: .signal-field background:none, .grad-text flattened
    to plain serif. Gold #B28A29 used ONLY on the App Store button + "Try" pill.
  • Signature CODE-DRAWN storage-ring showcase ("A look inside"): CSS donut —
    conic-gradient fill, per-segment stops colour@55%(edge)→100%(centre)→55%(edge),
    butt-cap joins, 12 o'clock clockwise (the glow); hairline track; serif centre
    count (8,744); legend (8×8 r2 swatches + serif name/value); monochrome storage
    bar (track text@10%, fill text@50% @53.5%). Category rows = 4px colour stripe +
    monochrome grey icon + serif name/count. Category colours Photos #5EC46B /
    Videos #ED9433 / Contacts #5999B8 / Files #8C73B3.
  • Hero = brand lockup + theme-swapped real home screenshot (01-home light ⇄
    02-home dark) → phonespace/assets/screenshots/home-light.jpg + home-dark.jpg.
  • privacy.html + terms.html restyled to cream+serif (content untouched).
  • saud.css: flipped the dormant body.app-phonespace line amber → gold (only that
    one line; the inline per-theme overrides already win — this just removes stale
    amber). No other app tokens touched.
  • Flat: only gradients are the ring conic + the cream hero-card linear (+ the
    donut radial masks); zero blur/glass.
- Decisions: PhoneSpace is LIVE — data-app/data-field badges, data-releases,
  app-data.js, releases-loader.js, version/What's-New all left intact (7 hooks).
  Temp phonespace/_v2src/ deleted, never committed.
- Open / next: the two drill-down sections (Photos "Find what you don't need" /
  Compress "Compress & convert") still use the old v1 pre-redesign marketing
  screenshots — being converted to code-drawn app-faithful visuals as a SEPARATE
  preview for owner review before applying.
- Deploy state: committed + pushed to main; live CSS/HTML + 2 screenshots → Pages
  rebuilds /phonespace/ (+ privacy/terms). Data pipeline untouched.
- Live-check: PENDING owner — verify saud.im/phonespace/ mobile + desktop, light
  AND dark: cream+serif, NO amber; glowing storage ring + category rows + mono bar;
  theme-swapped home hero; badges + What's-New present; privacy/terms cream+serif
  with content intact; Dufaat/SShift/Filed unchanged.
- ChatGPT review: none.

## 2026-06-22 — Filed flat app-faithful re-skin + new simulator screenshots
- Done: Applied the owner-approved Filed refresh (filed/index.html inline <style>
  + filed/assets/screenshots/ only). Filed is FLAT BY DESIGN — reproduced that:
  • Removed un-flat elements: the multi-colour radial-gradient hero wash
    (.signal-field → background:none) and the blue→green gradient hero word
    (.grad-text → solid var(--accent)). Confirmed ZERO linear-gradient/
    radial-gradient/backdrop-filter in the Filed inline style.
  • Real SectionColor palette as flat CSS vars, exact light/dark pairs (blue
    #1A73E8/#6BA5F5, red #E5484D/#FF6166, green #1E8E3E/#4CC76A, yellow
    #E8B400/#F2C744, orange #E8710A/#F59E42, purple #7A5AF8/#9B82FF, teal
    #0E9F9A/#37C7C0, pink #D01884/#E072B8, gray #5F6368/#9AA0A6). Feature icons
    = flat ~14% tint + full-colour glyph, one section colour per card.
  • Tag-chip motif (.fl-chip): capsule, colour@15% fill + colour dot + text, no
    border — incl. the hero "sections" chip row (Invoices/Contracts/Tax/Receipts).
  • Solid cards: .feature → solid --surface + 1px hairline + radius 14 + soft
    shadow 0 4px 10px rgba(0,0,0,.06); no blur. Accent --accent #2D6CDF (light) /
    #5B8DEF (dark); flat Drive-white light canvas; primary button = solid accent
    fill, radius 12 (no gradient).
  • Screenshots (clean 6.9" simulator captures, ~820px JPG ~67–79KB, as-is): hero
    theme-swaps library-light/library-dark; closer-look "Sign by hand" = signature
    (light); gallery = folder, viewer, signature-dark (a dark capture), library-ar
    (Arabic RTL). Removed v1 shots (library, folder-invoices, viewer-service-
    agreement, sign-by-hand, settings-privacy).
- Decisions: Dark primary button kept at #5B8DEF (matches the app). Hero tag-chip
  row kept (showcases the signature motif). Closer-look signature stays the light
  capture (dark one is in the gallery). Filed stays coming-soon — NO data-app/
  data-releases hooks, no app-data.js/releases-loader.js added (0 data hooks).
  Temp filed/_v2src/ deleted, never committed. saud.css + other apps untouched.
- Open / next: none required. (When Filed goes Live, wire it like the others.)
- Deploy state: committed + pushed to main; live CSS/HTML + screenshots → Pages
  rebuilds /filed/. No version/What's-New/data hooks involved (Filed has none).
- Live-check: PENDING owner — verify saud.im/filed/ mobile + desktop, light AND
  dark: flat folder tints + ~15% tag chips + solid hairline cards + #2D6CDF accent,
  NO gradients/aurora/glass; library hero screenshot theme-swaps; gallery includes
  a dark capture + the Arabic shot; sections intact; Filed still shows no live
  badges/data hooks; Dufaat/PhoneSpace/SShift unchanged.
- ChatGPT review: none.

## 2026-06-21 — SShift app-faithful re-skin + new simulator screenshots
- Done: Applied the owner-approved SShift refresh (sshift/index.html inline <style>
  + sshift/assets/screenshots/ only). Reproduced the app's REAL design language:
  • Day-cell recipe (not flat): per-tile --c = the type's DayType.colorHex; fill =
    linear-gradient(180deg, --c@18% → --c@10%) over the theme surface; solid ~4px
    top strip in --c; 1px border --c@~18%; radius 11; soft shadow; day number wt 600
    + short code @55%. Week strip = a real week (15–21): Work #4CAF50 · today(16)
    blue (#ADD1FF→#61A6FF / #3373D9 strip / white) · Training #009688 · Annual
    #FF9800 · Sick #F44336 · Long Cycle #5C6BC0 · Rest #9E9E9E (only Rest grey).
  • Legend chips = the app's edit-day type-grid style: type@12% fill + ~48% type
    border + type dot + code + bilingual name, each in its own colour.
  • Lead accent indigo #6680F2 (dark lift #8AA0F7). Edge-strip motif on feature
    cards (4px rounded-leading left strip in a type colour + matching icon chip);
    cards stay solid (hairline + soft shadow, no blur).
  • Screenshots (clean 6.9" simulator captures, ~820px JPG ~99–114KB, used as-is):
    hero theme-swaps calendar-light/calendar-dark; gallery = dashboard, day-detail,
    calendar-ar (RTL), settings, + dashboard-dark (a dark capture). Removed the v1
    concepts (calendar, dashboard[old], notifications, pdf-report, schedule-pattern).
- Decisions: grey→type was a specificity bug — `.sh-week .tile`/`.sh-legend li`
  (0,2,0) hard-set --c:var(--sh-rest), beating the `.sh-c-*` classes (0,1,0);
  fixed by removing the hard default and using var(--c, var(--sh-rest)) fallbacks so
  the type class is the only thing setting --c. Border kept at ~18% (not literal
  10%) so cell edges read on web. Gallery does NOT auto-swap EN↔AR on the language
  toggle (Arabic calendar is simply included). Temp sshift/_v2src/ deleted, never
  committed. saud.css and other apps untouched (accent lives in SShift inline style).
- Open / next: none required. (Could later add per-language gallery swap if wanted.)
- Deploy state: committed + pushed to main; live CSS/HTML + screenshots → Pages
  rebuilds /sshift/. version / data-releases / What's-New / app-data.js /
  releases-loader.js untouched; badges + hooks intact.
- Live-check: PENDING owner — verify saud.im/sshift/ mobile + desktop, light AND
  dark: week strip shows green/blue/teal/amber/red/indigo/grey (not all-grey);
  legend chips each in their type colour; cells use gradient+strip+border; hero
  calendar theme-swaps; gallery includes a dark capture; What's-New + badges present;
  Dufaat/PhoneSpace/Filed unchanged.
- ChatGPT review: none.

## 2026-06-21 — Dufaat v2 "Luminous Calm, warmed" re-skin + new logo
- Done: Applied the owner-approved Dufaat v2 re-skin (within the existing inline
  <style> token system; assets/saud.css and all other apps untouched).
  • Palette per theme: teal accent #1F9E75 / #67DDC5 (with theme-correct
    --accent-ink), gold #B07D33 / #E3BE86, terracotta alert, canvas
    #F6F3EC / #0B0D14, cream/ink text — no pure black/white; two soft blurred
    aurora glows (static, reduced-motion-safe); glass cards (translucent +
    backdrop-filter blur, 1px luminous hairline, 18px radius); per-theme grad-text.
  • New v2 app icon wired in: dufaat/assets/icon-dufaat.png (brand lockup +
    Dufaat-page OG/Twitter) AND the shared assets/icon-dufaat.png (homepage Dufaat
    card + footer + privacy/terms OG) — owner-approved shared swap.
  • v2 screenshots (home, plan-deferred, plan-car, new-plan, settings, home-light);
    hero = v2 Home; gallery Deferred → New Plan → Car → Settings → Home (light);
    bilingual alt text; removed unused v1 schedule/completed/report.jpg.
  • privacy + terms: v2 token restyle + ambient aurora; legal CONTENT untouched.
  • Kept the PhoneSpace-style two-column hero (re-skin only, no layout teardown).
- Decisions: Did NOT touch the Dufaat version number / data-releases hook /
  releases-loader.js / app-data.js / "What's New" text (the 1.0 in HTML is the
  correct pre-JS fallback). PhoneSpace/SShift/Filed/Promptbook + the shared
  favicon left untouched. Contrast note: the dark app icon is the lowest-contrast
  of the four homepage cards in dark mode, but reads cleanly (card hairline + the
  teal/cream interior define it) — flagged, not redesigned.
- Open / next: after the App Store build is approved + released, no further site
  change needed (the version auto-syncs from releases.json).
- Deploy state: committed + pushed to main → GitHub Pages republishes saud.im
  (homepage Dufaat card, /dufaat, /dufaat/privacy, /dufaat/terms).
- Live-check: verified locally via headless Chrome (light + dark, desktop +
  mobile) — Dufaat palette/aurora/glass/logo/hero/gallery; homepage Dufaat card;
  privacy/terms restyle with content intact; PhoneSpace unchanged (orange identity
  kept). To confirm on saud.im once Pages finishes deploying.
- ChatGPT review: none.

## 2026-06-17 — Dufaat/SShift/Filed: visual refresh applied (heroes + accents)
- Done: Applied the owner-approved full refresh to dufaat, sshift, filed (4 files:
  assets/saud.css + the three app index.html). PhoneSpace 100% untouched.
  • Two-column PhoneSpace-style heroes (.hero > .wrap > .split > [text] + [.device-wrap],
    collapsing to one column on mobile) with the real hero screenshot (Dufaat
    schedule.jpg, SShift calendar.jpg, Filed library.jpg) + a new shared .hero-brand
    lockup (app icon + name) at the top of the text column.
  • Accents: Dufaat emerald (#10A37F/#0B7357, ink #FFF) + hero "settled" grad-text
    (light #1A1F2E→#10A37F, dark #F0EEE8→#5FE0AE); SShift indigo (#5B57E0/#3F39B8,
    dark lift #8B88F2/#6C66E8); Filed vivid blue (#2563EB/#1D4ED8, ink #FFF) + hero
    "filed" grad-text (light #2563EB→#2FA86A, dark #5B8DEF→#4FD08A).
  • SShift week strip + legend recoloured to the app's REAL DayType.colorHex (1:1,
    identical light & dark, no dark-lift): Work #4CAF50, Rest Day #9E9E9E, Training
    #009688, Annual #FF9800, Sick #F44336, Long Cycle Leave #5C6BC0. --sh-leave
    repurposed to LCL, added --sh-sick; tiles render solid exact hex; day labels +
    structure kept; legend bilingual & honest. Indigo stays the page brand accent.
  • 5 polish fixes: shared .hero-brand component; .hero-brand block-level on its own
    line; Dufaat hero meta moved between lede and buttons; removed obsolete inline
    margin-top:48px on Dufaat/Filed device-wrap; Filed centered .fl-appicon relocated
    into the brand lockup (unused .fl-appicon CSS left in place, harmless).
- Decisions: All changes additive/reversible; grad-text overrides use background-image
  (preserves the text clip). No content/section/screenshot/RTL/lang-toggle removed.
  Reproduced exactly from the approved previews.
- Verified (headless Chrome, light+dark, desktop+mobile): all three heroes render
  two-column with brand lockup + real screenshot; emerald/indigo/blue-green identities;
  SShift week strip = real leave hex; mobile = single column; sections below intact;
  PhoneSpace render-checked unchanged (still amber). Only the 4 files changed.
- Open / next: Optionally retune the landing app-card accents to echo these per-app
  identities (cards currently inherit graphite home accent). Not required.
- Deploy state: committed + pushed to main; live CSS/HTML → Pages rebuilds dufaat,
  sshift, filed. (Push also triggers the release sync; no releases.json change.)
- Live-check: PENDING owner — verify saud.im/dufaat/, /sshift/, /filed/ on mobile +
  desktop, light AND dark: two-column hero + brand lockup + real screenshot; correct
  accent; SShift week strip = real leave colours; sections intact; saud.im/phonespace/
  unchanged (amber).
- ChatGPT review: none.

## 2026-06-17 — Homepage accent → graphite (+ dark-mode hero-text fix)
- Done: Applied the owner-approved graphite homepage accent in assets/saud.css
  (ONE file). (1) `body.app-home` accent tokens #5B6CFF/#9A6CFF (iridescent) →
  #3A3F4A/#23272F (graphite). (2) Added a dark-mode-only override for the homepage
  hero gradient text: the graphite stops are near-black and nearly vanish on the
  dark canvas once clipped to text, so in dark mode `body.app-home .grad-text`
  now uses a lifted graphite ramp `linear-gradient(100deg, #8A92A0, #5A6270)`.
- Decisions: Override uses `background-image` (NOT the `background` shorthand) so
  the existing `background-clip: text` is preserved — the shorthand would reset
  clip to border-box and hide the text. Scoped to `body.app-home .grad-text` only;
  mirrored saud.css's dual dark-mode convention (both `@media (prefers-color-scheme:
  dark) :root:not([data-theme="light"])` and `:root[data-theme="dark"]`). Global
  --accent left graphite in dark (buttons/eyebrow/stats unchanged) — only the
  clipped gradient text was rescued. NO app accents touched.
- Verified (headless Chrome): homepage light = strong near-black graphite (hero,
  CTA, stats); homepage dark = hero gradient text now legible, rest still graphite.
  App pages render-checked — PhoneSpace still amber, SShift still navy (no bleed).
  Only assets/saud.css changed.
- Open / next: Retune the dufaat, sshift, and filed accents so they stand out
  cleanly against the new neutral graphite homepage (they currently read as their
  own blues/slate; revisit for contrast/distinction). PhoneSpace amber is fine.
- Deploy state: committed + pushed to main; live CSS change → Pages rebuilds the
  homepage. (Push also triggers the release sync as usual; no releases.json change.)
- Live-check: PENDING owner — verify saud.im homepage on mobile + desktop, light
  AND dark: graphite accent throughout, hero gradient text legible in dark; app
  pages unaffected (PhoneSpace amber).
- ChatGPT review: none.

## 2026-06-17 — Docs: add ARCHITECTURE / ADD_NEW_APP / RELEASES_PIPELINE
- Done: Added three owner-provided reference docs to Docs/ — ARCHITECTURE.md
  (stack, repo map, the two data systems, deploy flow, app coverage, failure
  modes), ADD_NEW_APP.md (Phase 1 coming-soon → Phase 2 going-Live playbook +
  the five edit points), and RELEASES_PIPELINE.md (releases.json sync deep-dive
  + troubleshooting). Linked all three from CLAUDE.md under "## Where to look".
- Decisions: Verified public-safe before committing — no secrets (only secret
  *names*, already present in committed workflow/script), no local machine paths,
  no bundle IDs, no private source. Docs-only change; no site files, code,
  config, or releases.json touched.
- Open / next: None. The push will trigger the usual release sync (push event);
  expect no releases.json change (content already current).
- Deploy state: committed + pushed to main; docs-only, no live-site impact.
- Live-check: N/A (docs only).
- ChatGPT review: none.

## 2026-06-17 — CI: sync releases on every deploy + clear Node 20 warning
- Done: Edited only `.github/workflows/sync-releases.yml`. (1) Added a `push:
  branches: [ main ]` trigger so the release-notes sync runs on every deploy
  (no paths filter — any new App Store version is picked up), keeping the daily
  `schedule` cron (03:00 UTC / 06:00 KSA) as backup and `workflow_dispatch`.
  (2) Cleared the Node 20 deprecation warning: actions/checkout @v4→@v6,
  actions/setup-node @v4→@v6, node-version '20'→'22'. Permissions, Install/Fetch
  steps, env secrets, and the entire "Commit if changed" step left exactly as-is.
- Decisions: Used @v6 for both actions (verified via GitHub API — current latest
  majors are checkout v6.0.3 / setup-node v6.4.0, newer than the @v5 example in
  the brief). Chose Node '22' (current LTS). No extra loop guards added: the bot
  commits releases.json with the default GITHUB_TOKEN (GitHub does not re-trigger
  workflows from GITHUB_TOKEN pushes) and the commit message keeps "[skip ci]" as
  a second safeguard — so the bot's own "chore: sync releases" push will not loop.
- Self-test result: PASSED. The push trigger fires and there is NO loop.
  • The trigger-adding commit (222bbdc) did NOT self-trigger — expected GitHub
    behavior: a push is evaluated against the workflow config that existed BEFORE
    that push, so the commit that first introduces `on: push` never triggers itself.
    (My initial read mistook this latency for a broken trigger — corrected here.)
  • The NEXT push (b6b8c4c, now that main already carried `on: push`) triggered
    run #9 — event=push, conclusion=success.
  • Run #9 produced the bot commit 2e3504d "chore: sync releases [skip ci]"
    (releases.json, 1 line). That bot push did NOT spawn another run — total run
    count stayed at 9 (no #10). Confirms the loop safeguards work: GITHUB_TOKEN
    pushes don't re-trigger Actions, with [skip ci] as the second guard.
- Open / next: Nothing required. Release sync now runs automatically on every push
  to main; daily schedule remains as backup; workflow_dispatch still available.
  (Aside: the daily `schedule` cron had no historical runs before today — GitHub
  schedules can be paused after repo inactivity; not blocking since push now covers
  every deploy. Owner can ignore unless the daily backup is later needed.)
- Deploy state: committed + pushed to main; CI-only change, no site files touched.
  releases.json is the bot's (88f9007 dufaat sync, then 2e3504d) — untouched by me,
  preserved via rebase.
- Live-check: N/A for site pages. Actions self-test verified via the runs API
  (run #9 event=push success; no loop).
- ChatGPT review: none.

## 2026-06-17 — Pic source folders removed (post live-check)
- Done: Owner's live check passed. Removed `dufaat/pic` (tracked) via `git rm` + commit "chore: remove dufaat/pic source screenshots"; `sshift/Pic` was local/untracked and is removed by the owner on their machine. Published optimized shots remain in `dufaat/assets/screenshots/` + `sshift/assets/screenshots/`.

## 2026-06-17 — Dufaat + SShift: real app screenshots (Filed treatment)
- Done: Replaced the coded/SVG device mockups on /dufaat/ and /sshift/ with the
  owner's real app screenshots, mirroring the Filed .device-frame pattern exactly.
  Converted sources with `sips` to ~820px-wide JPGs (~53–119KB each, crisp + light).
  • Dufaat (from tracked dufaat/pic/*.png, 6 of 7 used): new dufaat/assets/screenshots/
    schedule.jpg (hero — a plan's payment schedule), new-plan.jpg, home.jpg,
    completed.jpg, report.jpg, settings.jpg. Hero device now shows the real schedule;
    added an "A look inside Dufaat" 5-up gallery (.df-shots/.df-shot) before What's New.
    Skipped the empty-home shot (0x0ss.png) as weak/redundant.
  • SShift (from local sshift/Pic/*.HEIC, 5 of 11 used): new sshift/assets/screenshots/
    calendar.jpg (hero — color-coded month calendar), dashboard.jpg, schedule-pattern.jpg,
    notifications.jpg, pdf-report.jpg. Hero device now shows the real calendar; added an
    "A look inside SShift" 4-up gallery (.sh-shots/.sh-shot) before What's New. Skipped
    duplicate dashboard, sparse Backup/PDF-export, destructive Data-Management, and a
    duplicate PDF shot.
  Bilingual EN/AR alt text + figcaptions on every shot; hero `.device` no longer
  aria-hidden so the alt is exposed.
- Decisions: Visuals swap ONLY — hero device + new gallery. Every other section
  (hero copy, "A closer look" coded artifacts [Dufaat df-doc receipt, SShift sh-week
  strip + legend], feature grids, badges, What's-New, privacy) left UNCHANGED. Reused
  the site's existing .device CSS; left the now-unused hero-mockup CSS (.df-app / .sh-cal)
  in place (harmless, minimal diff), as done for Filed. Screenshots vetted for sensitive
  data: all clean demo content (Dufaat "Bank Loan" + round AED demo amounts/dates;
  SShift generic leave types + demo dates; only the public developer name appears) —
  nothing personal/financial published.
- Open / next: After owner's live visual check, delete the Pic source folders —
  dufaat/pic is tracked → `git rm` + commit; sshift/Pic is local/untracked → owner
  removes locally (or I remove after OK). sshift/Pic intentionally NOT committed here.
- Deploy state: committed + pushed to main — dufaat/index.html, sshift/index.html, and
  new dufaat/assets/screenshots/* + sshift/assets/screenshots/* added. GitHub Pages
  rebuilds both pages. Docs/APPS.md unchanged (not needed).
- Live-check: PENDING owner — verify saud.im/dufaat/ and saud.im/sshift/ on mobile +
  desktop: real screenshots render in the device frames, no broken images, layout/RTL/
  language toggle hold, and the rest of each page is unchanged.
- ChatGPT review: none.

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
