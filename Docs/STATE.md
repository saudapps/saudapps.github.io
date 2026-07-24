# saud.im — Current State

This is the first current-state reference for the public Saud Apps website. It
separates verified repository and network facts from reported state and
unknowns.

## Baseline

| Field | Status | Value |
|---|---|---|
| Audit baseline date | `VERIFIED` | 2026-07-23 |
| Historical audit source | `VERIFIED` | `7e2200becbff813fc3a87e988834d4c2f58cddf9`; superseded as the current remote baseline |
| Current foundation baseline | `VERIFIED` | `e3921fbd32d1fdc6bffe48531d67a46c863a2275` from `origin/main` after fetch on 2026-07-24 |
| Foundation branch | `VERIFIED` | `setup/product-local-foundation-saud-im`, created directly from current `origin/main` |
| Portfolio status | `VERIFIED` | Public website maintained |
| Current visual lineage | `VERIFIED` | Product Cinema |
| Hosting model | `VERIFIED` | Static GitHub Pages from `main`; no staging environment |

At preflight, local `main` remained at
`5799e26124627bbce615981cfa670350c8fcde49`, 25 commits behind the fetched
`origin/main`. Its pointer was not moved. The foundation branch was created
directly from current `origin/main`, and its `HEAD` matched the remote baseline
with `0 ahead / 0 behind`.

No tracked or staged product-code changes existed at foundation preflight. One
pre-existing local, untracked `AGENTS.md` and ignored local AI configuration
were inspected and preserved as evidence before the current foundation file was
prepared.

## Production verification

### Verified

A read-only network check at `2026-07-24T12:31:11Z` returned HTTP `200` for:

- `https://saud.im/`
- the four primary app routes;
- `/about/`, `/support/`, and `/legal/`;
- `/promptbook/`;
- `/releases.json`, `/sitemap.xml`, and `/robots.txt`.

During that check, the response bytes for the homepage, four primary app
routes, three information routes, `releases.json`, `sitemap.xml`, and
`robots.txt` matched the files at the current foundation baseline.

### Unknown

GitHub Pages response headers do not identify the deployed Git commit.
Therefore the exact production commit identity remains `UNKNOWN`, despite the
verified byte matches above. Repeat the live check immediately before a release
decision.

## Current route map

### Primary Product Cinema routes

- `/`
- `/sshift/`
- `/phonespace/`
- `/filed/`
- `/dufaat/`

These routes use the current Product Cinema marketing system. The homepage and
SShift use the shared Product Cinema presentation files; PhoneSpace, Filed, and
Dufaat add route-local Product Cinema CSS and JavaScript.

### Supporting routes

- `/about/`
- `/support/`
- `/legal/`
- `404.html`
- per-app privacy and terms routes recorded in
  [`APPS.md`](APPS.md)

The main information routes use a reading-first Product Cinema shell over the
older bilingual document structure. Legal and support documents remain static
public content.

## Current language behavior

### Verified

- The homepage and four primary Product Cinema app routes are authored as
  English-only pages with `<html lang="en" dir="ltr">`.
- Those primary routes do not contain the shared `data-en`, `data-ar`, or
  `data-lang-btn` bilingual controls.
- Full-site Arabic/RTL parity is not implemented on the five primary Product
  Cinema routes; their current markup is English/LTR and does not include the
  shared bilingual controls.
- About, support, legal, 404, and the preserved Promptbook pages contain paired
  English/Arabic content and language controls.
- `assets/saud.js` can set `lang="ar"` and `dir="rtl"` when Arabic is selected.
- `assets/product-cinema-core.js` applies the Product Cinema theme and resets
  its initialized shell to English/LTR.

### Unknown

- The intended future language contract for the primary Product Cinema routes
  is not yet decided.
- The initialization and persistence contract for supporting Product Cinema
  routes requires a dedicated review; current code contains both the bilingual
  controller and an English/LTR initialization.
- Future visual RTL parity, if implemented, has not been designed or tested.

Do not change or reinterpret this behavior in a documentation-only task.

## Product Cinema state

Product Cinema is the current code and design lineage:

- the homepage presents the visible `PRODUCT FILM 02` experience;
- SShift uses the shared Product Cinema chapter system;
- PhoneSpace, Filed, and Dufaat have distinct route-local chapters;
- the shared shell, atmosphere, theme, reveals, responsive behavior, and
  reduced-motion fallbacks are active;
- information routes use the quieter Product Cinema information tier.

The earlier Stage 1/2/3 design is preserved in Git history and milestone
baselines, but it is `SUPERSEDED` as current visual guidance.

## Promptbook state

### Verified

- Lifecycle: `Stopped / Parked`.
- Promptbook is absent from the Product Cinema homepage and active Product
  Cinema navigation.
- The information-shell JavaScript excludes Promptbook from its generated
  header/footer and removes preserved Promptbook rows from information pages at
  runtime.
- `/promptbook/`, `/promptbook/privacy/`, and `/promptbook/terms/` remain
  directly reachable.
- All three pages contain `noindex`.
- Promptbook URLs are absent from `sitemap.xml`.
- Promptbook is not wired into either release-data system.

The source HTML of some supporting and historical pages still contains
Promptbook links that are removed or replaced at runtime. This is preserved
code, not an active-product signal.

## Release-data state

Two independent systems are active for the four live apps:

1. `app-data.js` fetches public iTunes data in the visitor's browser and updates
   `data-app` / `data-field` hooks.
2. The App Store Connect workflow generates `releases.json`, and
   `releases-loader.js` renders `data-releases` targets.

The current `releases.json` records an `updatedAt` value of
`2026-07-24T05:48:11.257Z`. The commits after the historical audit source
`7e2200b` through the current baseline are release-sync bot descendants and
change only `releases.json`.

One system working does not verify the other.

## Current risks

See [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md). The highest current operating risks
are:

1. pre-Product-Cinema documentation can be mistaken for current design truth;
2. primary and supporting routes have different language behavior;
3. production commit identity is not exposed by Pages and must be verified
   through approved release evidence;
4. Promptbook's parked state depends partly on runtime filtering of preserved
   source markup;
5. the repository has no committed automated browser, visual-regression, or
   RTL test suite;
6. release badges and generated release notes can fail independently.

## Current next action

1. Complete this Product Cinema knowledge synchronization.
2. Review the documentation diff independently and keep it documentation-only.
3. Verify the live production and route-language contract before any future
   design or localization work.
4. Complete and review the first controlled SShift pilot through Saud Apps OS.
5. After the operating model is proven and Saud approves scope, create a
   dedicated work order for any future saud.im maintenance or language work.

## Related references

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)
- [`DECISIONS.md`](DECISIONS.md)
- [`APPS.md`](APPS.md)
- [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md)
- [`TESTS.md`](TESTS.md)
- [`RELEASES.md`](RELEASES.md)
- [`RELEASES_PIPELINE.md`](RELEASES_PIPELINE.md)
