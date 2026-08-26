# saud.im — Current State

This is the first current-state reference for the public Saud Apps website. It
separates verified repository and network facts from reported state and
unknowns.

## 2026-08-26 Product-page typography follow-up

- `VERIFIED`: The four primary app pages share the final Product Cinema
  readability layer. Bilingual `data-en` / `data-ar` wrappers are
  typographically transparent, so route-local `span` rules cannot shrink
  meaningful headings or body copy below their component scale.
- `VERIFIED`: PhoneSpace, Filed, and Dufaat compact labels use the same
  restrained desktop scale as SShift while route-specific mobile composition
  and decorative notation remain intact.
- `VERIFIED`: The current PhoneSpace, Filed, and Dufaat product captures remain
  accurate for the visible interface. No duplicate screenshot replacement is
  required for this site change.
- `VERIFIED`: Release hooks, generated release data, public App Store links,
  legal routes, and app copy are unchanged.
- `VERIFIED`: Approved commit `56d1b34` was fast-forwarded to `main`. Release
  sync run `32981323062` succeeded and created generated descendant `4d3ba42`;
  Pages deployment `32981349569` then succeeded.
- `VERIFIED`: All four live app routes returned HTTP 200 with the new stylesheet
  cache version. The live stylesheet matched the reviewed bytes, and Arabic
  Night-mode browser checks on PhoneSpace, Filed, and Dufaat showed no font-size
  mismatch, horizontal overflow, or console error.

## 2026-08-11 PhoneSpace 1.2 release candidate

- `VERIFIED`: The local PhoneSpace Product Cinema candidate replaces obsolete
  Compress positioning with the release-candidate Resize and Convert workflows,
  adds current interface captures, and updates the privacy page to match the
  app's on-device processing, metadata choice, Files access, deletion, and local
  usage-counter behavior.
- `VERIFIED`: The page preserves its `v1.1` static fallback and the existing
  `data-app="phonespace"` / release-loader hooks. Public version and release
  history therefore remain automated and will move to 1.2 only when their
  existing App Store-backed systems observe Apple's published release.
- `VERIFIED`: `releases.json`, `app-data.js`, `releases-loader.js`, GitHub Pages
  configuration, and other app routes are outside this candidate and unchanged.
- `VERIFIED`: Independent reviews of `cacbdc8` and `9f20d06` returned `BLOCK`;
  their findings were resolved in the reviewed candidate `d79a972`.
- `VERIFIED`: Final independent follow-up of `d79a972` returned `PASS`. It
  measured both themes at 901, 1280, and 1500 px and found no release blocker.
- `VERIFIED`: On 2026-08-11 Saud explicitly superseded the earlier timing hold
  and approved immediate website publication. The approved release keeps the
  existing App Store-driven version automation unchanged, so the feature copy
  may precede the binary while the visible version remains the public App Store
  version.
- `VERIFIED`: Approved publication commit `aa0df4c` was fast-forwarded to
  `main`. Release sync run `31495780955` succeeded and created descendant
  `9250eaa`, changing only generated `releases.json`; Pages deployment
  `31495798046` then succeeded.
- `VERIFIED`: At `2026-08-11T13:26:05Z`, the live homepage, PhoneSpace page,
  privacy page, route stylesheet, three new screenshots, `app-data.js`, and
  `releases.json` returned HTTP 200. The changed site files matched the approved
  repository bytes, the browser showed no console warnings/errors or horizontal
  overflow, and both the homepage and app page correctly remained on Apple's
  public `v1.1` until the automated sources observe a newer public release.

## 2026-08-11 Dufaat 2.2 website sync

- `VERIFIED`: The Dufaat Product Cinema page now presents the 2.2 feature
  chapters, six approved screenshots, and clear Dufaat Plus positioning as a
  one-time in-app purchase with no subscription.
- `VERIFIED`: Dufaat privacy and terms pages describe the local-only data
  model, StoreKit purchase handling, and App Lock behavior.
- `VERIFIED`: The approved site commits were published through `main`; the
  Pages deployment completed successfully and the homepage, Dufaat, privacy,
  terms, and six screenshot routes returned successful live responses.
- `VERIFIED`: `releases.json` remains workflow-owned. The post-push release
  sync changed only its generated timestamp; no release version or notes were
  edited manually.
- `VERIFIED`: Apple published Dufaat 2.2 on 2026-08-11. The public Saudi App
  Store lookup reports version 2.2, so the runtime badge can now correctly
  present the new public version.
- `VERIFIED`: Runtime release history remains independently workflow-owned;
  its generated version and What's New data are never edited manually.

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
  bilingual English/Arabic pages with `<html lang="en" dir="ltr">` as the
  served default.
- Every primary route carries paired `data-en`/`data-ar` content, a static
  `.pc-site-lang` control in its header, and a static `.pc-site-skip` link.
- Arabic selection swaps visible pairs via CSS under `html[lang="ar"]`,
  applies `dir="rtl"` with mirrored rails/arrows per route stylesheet, and is
  persisted in `localStorage['saudapps-lang']`.
- About, support, legal, 404, and the preserved Promptbook pages contain paired
  English/Arabic content and language controls.
- `assets/saud.js` can set `lang="ar"` and `dir="rtl"` when Arabic is selected.
- `assets/product-cinema-core.js` applies the saved theme and saved language,
  dispatches `saudapps:langchange`, and swaps `data-aria-en`/`data-aria-ar`
  labels; an early inline head script adds `pc-site-js` so non-functional
  language controls stay hidden without JavaScript.

### Unknown

- Deep visual RTL parity for decorative compositions (hero art, grids beyond
  mirrored rails) has not been exhaustively designed or tested; the shipped
  RTL blocks cover text-bearing components and reading-direction cues.

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
