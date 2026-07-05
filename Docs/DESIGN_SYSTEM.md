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

## Motion (Stage 1 foundation)
Shipped as infrastructure in `assets/saud.css` (+ the existing observer in
`assets/saud.js`); consumed by pages starting Stage 2. Adding it changed no
rendered pixel — the tokens/variants were unused on existing pages.

**Tokens** (in `:root` only — durations/easings are theme-independent, so no
dark-path duplication). A richer scale that coexists with the older
`--t-fast/-mid/-slow` (.16/.24/.4s):
- Durations: `--dur-xs: 120ms`, `--dur-s: 200ms`, `--dur-m: 320ms`, `--dur-l: 560ms`.
- Easings: `--ease-out` (reused: `cubic-bezier(0.16,1,0.3,1)`),
  `--ease-in-out: cubic-bezier(0.42,0,0.58,1)`,
  `--ease-spring: cubic-bezier(0.34,1.56,0.64,1)` (gentle overshoot).
- Reveal inputs: `--reveal-distance: 14px`, `--stagger-step: 60ms`.

**Reveal attribute API** (extends the existing `[data-reveal]` +
IntersectionObserver; the observer just adds `.in` and is unchanged):
- `data-reveal` — value optional. `up` (default) · `fade` · `scale` · `left` · `right`.
  Plain `data-reveal` and `data-reveal="up"` behave EXACTLY as before
  (`translateY(14px)`, `.6s`, `--ease-out`).
- `data-reveal-group` on a parent — its direct `[data-reveal]` children get an
  incremental `transition-delay` of `n × --stagger-step` (60ms each), **capped
  at child 8** (the 9th onward hold the cap, `7 × step`). Pure CSS (`nth-child`);
  direct children are expected to be the reveal items.
- `data-reveal-delay="1".."4"` — per-element delay multiplier for standalone reveals.
- **Mechanism:** each variant only sets one custom property, `--reveal-t` (the
  START transform). The base rule is
  `transform: var(--reveal-t, translateY(var(--reveal-distance)))`; the revealed
  state (`.in`) sets `transform: none` and is shared by all variants — so there
  is no per-variant specificity war.
- **RTL:** `left`/`right` are physical, so their start offset mirrors under **any**
  `[dir="rtl"]` ancestor (the site sets `dir` on `<html>`, but nested RTL
  containers work too).

**Reduced-motion guarantee.** The global `@media (prefers-reduced-motion: reduce)`
block forces `[data-reveal]` **and** `[data-reveal-group] > [data-reveal]` to the
final visible state — `opacity:1; transform:none; transition:none;
transition-delay:0` — so every variant and every staggered child appears
instantly with no motion and no delay. Any NEW animation added later must stay
covered by this block (extend it explicitly; don't assume).

**Cache-busting convention.** Both shared files are referenced with a query
version: `assets/saud.css?v=YYYYMMDD-N` and `assets/saud.js?v=YYYYMMDD-N` (current:
`?v=20260705-1`), on all 18 pages (root pages use the relative `assets/…`, nested
pages the absolute `/assets/…` — only the query string carries the version).
**Deploy ritual: bump `N` (or the date) whenever the CONTENT of `saud.css` or
`saud.js` changes**, so returning visitors fetch the new file instead of a cached
one. `app-data.js` / `releases-loader.js` are deliberately NOT versioned yet.

## Homepage identity (Stage 2 — bold motion landing)
The landing is a **choreographed, atmosphere-first page**: neutral graphite
canvas, cinematic entrance, living background — and the coloured app cards as
the only colour voices. Everything below lives page-locally in `index.html`'s
inline `<style>`/inline scripts (saud.css/saud.js untouched); all of it is
transform/opacity (plus the sanctioned small-moment techniques noted below),
dual-theme, RTL-mirrored, and fully neutralized by the page's
reduced-motion block.

- **Accent:** neutral **graphite** — `#3A3F4A` / `#23272F`. Dark-mode hero
  wordmark: `.grad-text` uses a lifted graphite ramp (`#8A92A0 → #5A6270`) via
  `background-image`, preserving `background-clip:text`.

- **Atmosphere layer ("living grid").** A fixed, negative-z decorative layer
  behind the whole page (`.atm`, aria-hidden): a fine 56px neutral grid with
  micro-parallax, a slow diagonal light band sweeping over 18s
  (ease-in-out alternate), and a cursor luminance spot. Pointer physics:
  a tiny inline script writes raw `--pxr/--pyr` percentages on pointermove;
  each layer maps them to its own registered `@property` `--px/--py` with a
  different CSS transition duration (1.5s spot / 1.9s grid) — soft lagged
  follow and depth with **no rAF loop**. Gated to `(pointer:fine)` and off
  under reduced motion (layer freezes to its designed static state — never
  removed). Strictly **graphite/ink + white alpha luminance** on both theme
  paths — no new hues, ever. Vertical falloff mask keeps it strongest in the
  upper third. It blooms in with the page's 0s stage-light beat.

- **Entrance choreography** (~1.6s tail, overlapping musical beats; headline
  readable by ~1s; never blocks scroll/clicks): signal-field + atmosphere
  bloom (0s, opacity-only so `field-drift` survives) → **the wordmark moment**:
  per-line masked rise through `overflow:clip` line wrappers (`.hl`/`.hli`,
  with `.18em` clip headroom so Arabic diacritics never shear), expo-out →
  eyebrow fades in above with its dash drawing (scaleX, RTL-mirrored origin)
  → lede rises → buttons pop (spring) → stats strip lands as the tail.
  **Pattern rule:** every entrance keyframe is *from-only with
  `fill: backwards`* — elements animate TO their natural styles, so hover
  transforms stay alive afterwards.

- **Cards as an event.** The grid uses the Stage-1 system verbatim
  (`data-reveal-group` + `data-reveal="scale"`); a `transition-timing-function`
  longhand injects `--ease-spring` into the reveal transform without touching
  the group's stagger delays. Each card carries `--slot`/`--sig-d` so its
  signature plays right as it lands. Hover/focus expression is shadow +
  accent border + inner glow + icon tilt (RTL-mirrored) — no card-level hover
  transform (nothing fights the reveal transition); `:focus-within` gets the
  full hover treatment.

- **Card signature elements** (medium identity dose — one motif per Live app,
  drawn from each app's documented character; entrance + hover both):
  - **SShift** — a 7-cell week strip in the real day-cell recipe (gradient
    fill + 3px top strip, real DayType hexes, today-blue cell). Entrance:
    cells cascade/pop in sequence; hover: ripple wave.
  - **PhoneSpace** — serif card title + the conic category ring
    (edge-soft glow stops; paint on `::before`, masked by a registered
    `@property --ring-a` conic) + monochrome storage capsule. Entrance: the
    ring **draws itself** (sweep; falls back to a full ring where
    unsupported), the capsule fill grows; hover: ring rotates. The whole ring
    is flipped in RTL so segments and the draw sweep counter-clockwise.
  - **Filed** — strictly flat: 6 folder-palette tiles + a "PDF" tag-chip
    capsule (15% fill + dot, no border). Entrance: tiles file into place with
    crisp sharp timing (position/opacity only); hover: tiles lift in
    sequence. **No gradients, no glow, no glass — ever.**
  - **Dufaat** — the only glass/aurora card: static teal+gold aurora
    (`::after`, blurred, RTL-mirrored corners, per-theme opacity var) behind a
    true glass meta panel (backdrop-blur, luminous teal hairline,
    fit-content). Entrance: the aurora blooms up from dark; hover: it
    brightens.
  - **Promptbook** (parked, commented card) — neutral treatment, violet
    `#8A6CFF` accent; markup kept in the new card shape so the documented
    un-hide still works.

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
- Auto-compute the hardcoded landing stats numbers (currently manual).
