# saud.im — Technical Architecture

This document describes the current Product Cinema implementation and public
release-data flow. Current Git and code override historical documentation when
they conflict.

> This is a public repository. Keep this document free of secrets, private app
> source, internal product names, personal paths, and private operational data.

## Platform and deployment

- Static site: plain HTML, CSS, and vanilla JavaScript.
- Hosting: GitHub Pages.
- Production branch: `main`.
- Custom domain: `saud.im`, configured by `CNAME`.
- Build step: none for the website pages.
- Staging environment: none.

Because `main` is production, every merge or direct change to it is a release
action. Work belongs on an isolated branch/worktree and requires the Release
gate before merge.

## Route map

### Primary Product Cinema marketing routes

| Route | Current presentation |
|---|---|
| `/` | Product Cinema homepage / visible `PRODUCT FILM 02` experience |
| `/sshift/` | Shared Product Cinema SShift chapter |
| `/phonespace/` | Route-local PhoneSpace chapter |
| `/filed/` | Route-local Filed chapter |
| `/dufaat/` | Route-local Dufaat chapter |

### Supporting routes

- `/about/`
- `/support/`
- `/legal/`
- `404.html`
- per-app privacy and terms routes recorded in
  [`APPS.md`](APPS.md)
- preserved Promptbook routes, which are parked and excluded from active
  discovery

The exact privacy/terms path style is historical and varies by app. Treat the
recorded public URLs as compatibility contracts.

## Product Cinema presentation layers

### Shared site shell

`assets/product-cinema-site.css` defines the common Product Cinema foundation:

- light/dark tokens;
- shared header, brand mark, navigation, menu, theme controls, skip link, and
  footer;
- focus-visible treatment;
- responsive layouts down to the supported narrow viewport;
- reduced-motion overrides.

`assets/product-cinema-core.js` provides shared behavior:

- stored/system light-dark theme resolution;
- theme-aware image swapping through `data-pc-theme-image`;
- shared reveal enhancement using `IntersectionObserver`;
- reduced-motion fallback;
- Product Cinema shell initialization.

### Shared homepage and SShift layer

`assets/product-cinema.css` and `assets/product-cinema.js` contain the current
homepage and SShift Product Cinema composition. They include:

- homepage opening, four-product cast, directed sequence, SShift arrival, and
  studio continuity;
- the SShift chapter system;
- fine-pointer enhancements;
- separate mobile editing;
- static/readable and reduced-motion alternatives.

The visible phrases and chapter labels in this layer are interface copy. Do not
assign additional formal product meaning that the code does not establish.

### Shared atmosphere

`assets/product-cinema-atmosphere.css` defines route-specific decorative
atmospheres for the homepage, SShift, PhoneSpace, Filed, and Dufaat.

`assets/product-cinema-atmosphere.js` enhances that decoration for supported
devices and respects:

- theme changes;
- fine versus coarse pointers;
- reduced motion;
- page visibility and animation-frame scheduling.

The atmosphere is decorative. Content must remain understandable when it is
static or JavaScript is unavailable.

### Route-local chapters

PhoneSpace, Filed, and Dufaat each add a route-local pair:

- `<app>/product-cinema.css`
- `<app>/product-cinema.js`

These files direct each product's chapter without changing the shared shell:

- PhoneSpace: pressure-to-room storage composition.
- Filed: filing, reading, signing, and sharing composition.
- Dufaat: settlement, Pay Soon, proof, reports, and record composition.

Route-local scripts enhance sequences and reveals but preserve readable static
HTML.

### Information tier

About, support, legal, and 404 retain the older document markup and load:

- `assets/saud.css`
- `assets/saud.js`
- `assets/product-cinema-site.css`
- `assets/product-cinema-atmosphere.css`
- `assets/product-cinema-info.css`
- `assets/product-cinema-info.js`
- `assets/product-cinema-core.js`

`product-cinema-info.js` replaces the visible header/footer with the current
Product Cinema shell, creates a consistent main landmark, and removes parked
Promptbook discovery links at runtime. The underlying bilingual document
content remains in the route HTML.

## Current language split

The current website does not have one uniform language contract.

### Primary Product Cinema routes

The homepage and four primary app routes are authored as:

```html
<html lang="en" dir="ltr">
```

They do not contain `data-en`, `data-ar`, or `data-lang-btn` controls. They are
currently English-only.

### Information and legal routes

About, support, legal, 404, and preserved legal/support pages contain paired
English/Arabic content and language controls. `assets/saud.js` changes the
document language and direction for Arabic. The Product Cinema core also
initializes its shell as English/LTR.

This mixed implementation is current code, not proof of full-site Arabic/RTL
parity. Any unification requires a separate approved Scope and Design task.

## Public assets

- `assets/product-cinema-v2/` contains shared Product Cinema icons and field
  art used by the homepage/SShift composition.
- `<app>/assets/` contains public app icons, screenshots, and route media.
- `assets/og/` contains the 1200×630 homepage and four live-app Open Graph
  cards.
- `assets/favicon.svg` and `assets/saudapps-favicon.png` provide the site icon
  and Apple touch icon.

The homepage and four primary app routes use their designed Open Graph cards.
Information routes use the Saud Apps icon where configured. `404.html` uses
absolute asset paths so GitHub Pages can serve it for nested missing routes.

## Data System A — live App Store badges

File: `app-data.js`

This system:

- runs in the visitor's browser;
- calls the public iTunes lookup API;
- covers SShift, PhoneSpace, Dufaat, and Filed;
- caches each result in `localStorage` for 30 minutes;
- uses an eight-second request timeout;
- falls back to stale cache, then to hardcoded HTML.

Protected hooks:

```html
data-app="<key>"
data-field="status|version|rating|updated"
```

The homepage and primary app routes contain static fallback copy so the site
remains useful without the API.

## Data System B — generated release history

Files:

- `.github/workflows/sync-releases.yml`
- `scripts/fetch-releases.mjs`
- `releases.json`
- `releases-loader.js`

Flow:

1. The workflow runs on pushes to `main`, daily at `03:00 UTC`, or by an
   explicitly approved manual dispatch.
2. The workflow provides Node.js 22 and calls the authenticated App Store
   Connect API for the four live apps.
3. The fetcher writes a fresh `releases.json`.
4. If the generated file changed, the workflow commits only that file with
   `chore: sync releases [skip ci]` and pushes it using the workflow token.
5. `releases-loader.js` fetches the JSON and renders:

```html
<div data-releases="<key>"></div>
```

The loader has root and relative URL fallbacks, safely escapes public release
copy, supports English/Arabic release-note selection where data exists, and
hides the release section if the JSON cannot be loaded.

`releases.json` is generated and must never be edited manually.

## Independence of the two data systems

The systems share app keys by convention but do not share execution,
authentication, caching, or failure state:

- System A may show a correct live version while System B is stale.
- System B may render release history while the public iTunes request fails.
- A working system does not verify the other.

When adding or renaming a public app key, inspect both app lists and all
`data-*` hooks. Follow [`ADD_NEW_APP.md`](ADD_NEW_APP.md) and
[`RELEASES_PIPELINE.md`](RELEASES_PIPELINE.md).

## Public/private release boundary

Public in this repository:

- app keys and public App Store identifiers;
- public release notes and dates;
- generated `releases.json`;
- workflow and fetcher logic;
- names of required secret variables already referenced by the workflow.

Private:

- secret values;
- App Store Connect credentials;
- signing material;
- private app source and repository details;
- unpublished product or commercial information.

GitHub Actions secrets supply credentials at runtime. Never write their values
to code, logs, documentation, or local artifacts intended for Git.

## Promptbook architecture

Promptbook is preserved but `Stopped / Parked`:

- its pages remain directly reachable;
- all three pages use `noindex`;
- its URLs are absent from `sitemap.xml`;
- it is absent from the active Product Cinema landing and generated shell;
- the information shell removes preserved Promptbook rows/links at runtime;
- it is not present in either release-data app list;
- it has no `data-app` or `data-releases` contract.

Do not delete, index, feature, or wire Promptbook into release systems without
Saud's explicit approval.

## Failure modes

- Public iTunes API unavailable: badges use cache or hardcoded fallback.
- `releases.json` unavailable or invalid: release sections hide.
- One app fails during generation: its generated versions may be empty and the
  release section may hide.
- Workflow stopped or credentials invalid: badges may remain current while
  release history freezes.
- JavaScript unavailable: primary HTML, static app facts, and static release
  fallbacks remain the only visible source.
- Product Cinema enhancement unavailable: static route content remains the
  required baseline.

## Release flow

1. Approved Saud Apps OS work order.
2. Isolated branch/worktree from fetched `origin/main`.
3. Implementation and local preview.
4. Structural, responsive, theme, motion, accessibility, language, and data-hook
   checks as applicable.
5. Independent QA and code review.
6. Fetch again; inspect bot and human remote changes.
7. Saud approves Release gate.
8. One reviewed merge/push to `main`.
9. Verify GitHub Pages and affected live routes.
10. Verify both release-data systems when triggered.
11. Preserve approved milestone/rollback evidence and close knowledge.
