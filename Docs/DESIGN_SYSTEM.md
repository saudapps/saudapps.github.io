# Saud Apps Website — Design System

The site's visual language: the homepage identity, each app's colour identity,
the shared hero pattern, and — most importantly — the **app-faithful re-skin
recipe** used to make each app page feel like you're inside that app. Companion
to CLAUDE.md (roles, discipline), ARCHITECTURE.md (how the site is built),
ADD_NEW_APP.md (adding an app) and RELEASES_PIPELINE.md (release-notes sync).
This file is the "how the site looks and how we make it look that way" reference.

> ⚠️ PUBLIC REPOSITORY. Public-safe only: no secrets, no API keys, no private
> source, no local machine paths, no internal app names. Use public brand names
> only (e.g. "Filed", "PhoneSpace") — internal repo/project names stay out.

## How theming works (the mechanics)
- Shared base + per-app accent live in `assets/saud.css`. Each app sets its
  identity via `body.app-<name> { --accent; --accent-2; --accent-ink }`.
- **Each app page also has an inline `<style>` block for page-local recipes**
  (gradients, the storage-ring, glass cards, day-cell recipes, etc.). Inline
  styles are higher-specificity, so **the page's own inline rules win over the
  `saud.css` accent line**. In several apps the real, shipped identity lives in
  the page's inline style; the `saud.css` line is the base/fallback. Keep the
  `saud.css` line *truthful* anyway (don't leave a stale colour that contradicts
  the page) — but the page inline is the source of the rendered look.
- Dark mode is keyed off both `:root[data-theme="dark"]` and
  `@media (prefers-color-scheme: dark)`. Every identity below is defined for
  light **and** dark.

## Homepage identity
- Accent: neutral **graphite** — `#3A3F4A` / `#23272F` (replaced an earlier
  indigo). The landing is deliberately neutral so the coloured app cards stand
  out against it.
- Dark-mode hero wordmark: the `.grad-text` uses a lifted graphite ramp
  (`#8A92A0 → #5A6270`) via `background-image` so it stays legible on the dark
  hero while preserving `background-clip:text`.

## Per-app colour identities (final)
Each app leads with its own accent; **the identity comes from that app's own
source, not from a shared template**. Values are the `saud.css` base line; the
page inline `<style>` may refine them per theme (and wins).

| App        | Accent (light) | Accent-2 | Character (see below) |
|------------|----------------|----------|-----------------------|
| SShift     | `#5B57E0` indigo (dark lift `#8B88F2`) | `#3F39B8` | gradient leave-type cells |
| PhoneSpace | `#B28A29` gold | `#94701E` | cream + serif, editorial |
| Filed      | `#2563EB` blue | `#1D4ED8` | flat, multi-colour folders |
| Dufaat     | `#10A37F` emerald | `#0B7357` | "Luminous Calm" glass/aurora |

(SShift also uses its real in-app leave-type palette as data-viz colour, not
just the indigo accent — see its character note.)

## Shared hero pattern
All four app pages use the same two-column hero (it originated on PhoneSpace):
`.hero > .wrap > .split > [text column] + [.device-wrap]`.
- Left: text column with a **brand lockup** (`.hero-brand` = app icon + name) on
  its own line at the top, then eyebrow, headline, lede, cred/badges, buttons.
- Right: a **real simulator screenshot** in a `.device` frame (often theme-
  swapped — a light capture in light mode, a dark capture in dark mode).
- Collapses to a single column on mobile. RTL + the EN/AR language toggle are
  preserved on every page.
- `.hero-brand` is a shared, additive component in `saud.css`; only the pages
  that opt in reference it.

## Each app's character (and WHY they differ)
The guiding rule: **each app's look is extracted from that app's own design — we
do NOT copy one app's style onto another.** The apps look different on the site
because the apps themselves are different. Reproduce the app's *real* rendering
recipes (gradients, opacity, borders, shapes), not just flat colour values.

- **Dufaat — "Luminous Calm, warmed."** Warm editorial finance look. Teal accent
  `#1F9E75`/`#67DDC5`, gold `#B07D33`/`#E3BE86`, terracotta alert; canvas
  `#F6F3EC`/`#0B0D14`; two soft blurred **aurora glows** (teal top-leading, gold
  bottom-trailing; static, reduced-motion-safe); **glass cards** (translucent +
  `backdrop-filter` blur, 1px luminous hairline, 18px radius); Amiri for Arabic
  headings. Dufaat is the only app that uses glass/blur + aurora.
- **SShift — real leave-type colour, gradient cells.** Indigo lead `#6680F2`
  (page) / `#5B57E0` (saud.css base). The signature is the **day-cell recipe**
  (NOT flat): `linear-gradient(180deg, BASE@18% → BASE@10%)` over the surface +
  a solid ~4px top accent strip + 1px `BASE@~18%` border + radius 11; today cell
  is the app's blue (`#ADD1FF→#61A6FF`, `#3373D9` strip). Leave-type palette
  (1:1 from the app's `DayType.colorHex`, single hex per type, identical in
  light & dark — opacity does the adapting): Work `#4CAF50`, Rest `#9E9E9E`,
  Long Cycle `#5C6BC0`, National Service `#2196F3`, Annual `#FF9800`, Sick
  `#F44336`, Force Majeure `#9C27B0`, Training `#009688`, Escort `#E91E63`,
  Business `#795548`, Special Event `#00BCD4`, Other `#757575`. The legend uses
  the app's "edit-day" chip style (type@12% fill + type border + dot). An "edge
  strip" motif (a coloured rounded-leading left strip) appears on feature cards.
- **Filed — flat by design.** Filed uses **flat full-strength icon tints, ~15%
  tag-chip fills, solid hairline cards, and NO gradients anywhere** — do not add
  gradients/aurora/glass to Filed; that would betray its identity. Drive-style
  accent `#2D6CDF`/`#5B8DEF`. Real folder palette (`SectionColor`, light/dark
  pairs): blue `#1A73E8`/`#6BA5F5`, red `#E5484D`/`#FF6166`, green
  `#1E8E3E`/`#4CC76A`, yellow `#E8B400`/`#F2C744`, orange `#E8710A`/`#F59E42`,
  purple `#7A5AF8`/`#9B82FF`, teal `#0E9F9A`/`#37C7C0`, pink `#D01884`/`#E072B8`,
  gray `#5F6368`/`#9AA0A6`. Tag chip = capsule, colour@15% fill + colour dot +
  colour text, no border. Cards = solid surface + 0.5px hairline + radius 14.
- **PhoneSpace — cream + serif, editorial.** Neutral canvas `#FCFBFA`/`#0F0F0F`
  + **New York / serif** content type (sans for chrome/eyebrows); gold `#B28A29`
  used only as a small accent (App Store button + "Try" pill). The signature is
  a **glowing storage ring** (code-drawn): a 4-segment proportional donut where
  each segment is a **conic gradient** with stops `colour@55%(edge) →
  colour@100%(centre) → colour@55%(edge)`, butt caps, 12 o'clock clockwise —
  giving an edge-soft, centre-bright glow. Category colours: Photos `#5EC46B`,
  Videos `#ED9433`, Contacts `#5999B8`, Files `#8C73B3`; tool accents Compress
  burgundy `#740031`, Convert mustard `#E7B636`, upgrade gold `#B28A29`.
  Category rows = 4px colour stripe + monochrome icon + serif text; the device
  storage bar is a deliberately monochrome capsule. The ONLY gradients on the
  page are the ring conic + one warm cream hero-card linear; everything else is
  flat. No blur/glass.

## The app-faithful re-skin recipe (five stages)
Proven across Dufaat (v2), SShift, Filed, PhoneSpace. To re-skin an app page so
it feels like the app:

1. **Extract — in the app project (Code terminal on the iOS app, not the site).**
   Pull the app's **full design language**, not just colour values: exact
   *recipes* (gradient stops + opacity, borders, radii, shapes, shadows),
   typography, and any signature motif (storage ring, day cell, folder glyph,
   etc.), for **light AND dark**. ALSO generate **clean screenshots from the iOS
   Simulator** (6.9" iPhone 16 Pro Max, clean 9:41 status bar via
   `xcrun simctl status_bar … override`, fake/demo data only, EN + Arabic/RTL +
   light/dark where the app supports them). Seed demo data throwaway-style
   (DEBUG-gated) and revert it; commit nothing to the app repo.
2. **Transfer.** The owner copies the screenshots into the site repo under
   `<app>/_v2src/` (a temporary source folder). For paths with spaces, copy with
   a trailing `/.` and quotes.
3. **Website prompt.** Claude writes a *preview-only* spec for Code (on the site
   repo) that reproduces the extracted recipes faithfully + swaps in the
   screenshots (optimized to ~820px JPGs, ~60–120KB, used **as-is**, never
   redrawn), keeping the shared hero/layout and the app's data hooks.
4. **Preview.** Code renders screenshots (desktop + mobile, light + dark) to
   `/tmp`; the owner opens them locally and approves. **Preview before commit is
   non-negotiable** — anything not seen (e.g. a newly code-drawn section) gets
   its own preview before it ships.
5. **Apply + clean up.** On approval, Code commits + pushes, then **deletes
   `<app>/_v2src/`**. Claude independently verifies the commit by cloning the
   public repo and running grep/Python checks (filenames-only diff, forbidden
   files absent, data hooks intact, `_v2src` not committed).

## Hard-won lessons
- **Asset-catalog colours are often dormant.** In SShift, Dufaat, Filed AND
  PhoneSpace, the asset-catalog colours were unused; the app rendered from
  code-defined `Color` tokens / system colours. **Extract from the code the app
  actually uses, not the asset catalog.** Confirm live-vs-dormant every time.
- **Extract recipes, not flat colours.** The first SShift pass captured flat
  hex and rendered flat tiles — wrong. The real cells were gradient + strip +
  border. Always capture *how* a colour is rendered.
- **Each app from its own source.** Don't reuse one app's treatment on another.
  Filed must stay flat even though SShift/Dufaat are not; PhoneSpace is cream +
  serif, not glassy. Different apps, different looks — on purpose.
- **Simulator > real-phone screenshots.** Simulator captures (clean status bar,
  demo data, correct 6.9" size) look professional; real-phone shots look messy.
  Always use the Simulator, with clean demo data (including a fake populated
  calendar for SShift-style apps).
- **`_v2src/` is always temporary** — deleted after the owner verifies.
- **Live apps:** never touch the version / "What's New" / `data-releases` hook /
  `app-data.js` / `releases-loader.js` during a re-skin (they're auto-managed;
  see RELEASES_PIPELINE.md). Coming-soon apps (e.g. Promptbook) have no data hooks —
  don't add any.
- **`releases.json` is generated — never hand-edit.** The landing stats strip
  (`div.cred`) is hardcoded — update it by hand when app counts change
  (see ARCHITECTURE.md / ADD_NEW_APP.md).

## Special cases worth remembering
- **PhoneSpace was an identity *correction*, not just a re-skin.** Its old site
  accent (amber `#E0A23B`) did not exist in the app at all; the real app is
  cream + serif. The re-skin replaced the wrong identity with the true one, and
  flipped the dormant `saud.css` amber line to the truthful gold `#B28A29`.
- **PhoneSpace has limited assets:** the app has no Arabic localization, so its
  screenshots are English-only (the page copy is still bilingual — that's fine,
  don't fake an Arabic screenshot). Only the home screen could be cleanly
  captured (the Photos/Compress screens need real-device photo permission), so
  its drill-down sections are **code-drawn** in the app's style rather than
  screenshots.
- **Filed stays flat** — documented above, but it bears repeating: no gradients.

## Open / future (optional)
- Landing app-card accents could echo these per-app identities (currently
  neutral on the graphite landing).
- Auto-compute the hardcoded landing stats numbers (currently manual).
