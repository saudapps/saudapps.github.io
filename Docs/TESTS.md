# saud.im — Validation and Test Contract

This document records the current validation reality and the minimum review
matrix for website changes. It does not claim an unexecuted check passed.

## 2026-08-11 Dufaat 2.2 publication evidence

- `git diff --check` passed for the reviewed site range.
- `releases.json` was verified unchanged by the feature branch.
- The local homepage, Dufaat, privacy, terms, and six screenshot routes
  returned HTTP 200 before publication.
- The six Dufaat screenshots were verified as 820 x 1781 JPEG assets without
  alpha.
- Public-safety scans found no personal filesystem paths and no static claim
  that 2.2 was already the current App Store release.
- GitHub Pages deployment run `31453049991` completed successfully.
- Live checks passed for the homepage, Dufaat, privacy, terms, and all six
  screenshot routes. Live Dufaat content exposed the one-time purchase, SAR
  24.99 base price, no-subscription wording, StoreKit, and App Lock details.
- The release-sync workflow completed successfully and its descendant changed
  only the generated `updatedAt` value in `releases.json`.
- After Apple publication, the public Saudi App Store lookup returned version
  2.2 with release timestamp `2026-08-11T14:00:45Z` and the approved English
  What's New text. This independently verifies the live badge source.
- The generated release-history source remains workflow-owned; the next
  GitHub Pages publication triggers its normal App Store Connect sync without
  a manual `releases.json` edit.

## Current automated-test reality

### Verified present

- `.github/workflows/sync-releases.yml`
- `scripts/fetch-releases.mjs`
- public runtime fallback behavior in `app-data.js` and
  `releases-loader.js`

The workflow is release-data automation, not a site test suite.

### Verified absent

At the 2026-07-24 foundation inspection, the repository had no committed:

- `package.json`;
- browser automation suite;
- visual-regression suite;
- accessibility test runner;
- full-site RTL test suite;
- site validation workflow.

The inspection shell did not expose `node` or `npm`, so the release fetcher was
not executed locally. The committed GitHub workflow supplies Node.js 22.

## Safe read-only checks

Run from the repository root.

### Git scope

```sh
git status --short --branch
git diff --name-only
git diff --check
```

Confirm only the approved work-order files changed. Before push, fetch and
inspect ahead/behind and remote-only commits.

### Generated release JSON

```sh
jq empty releases.json
jq -r '.updatedAt, (.apps | keys[])' releases.json
```

Never fix a validation failure by editing `releases.json` manually.

### Sitemap XML

```sh
xmllint --noout sitemap.xml
rg -n '<loc>' sitemap.xml
```

Confirm only approved public routes are present and Promptbook is absent while
parked.

### Promptbook parking

```sh
rg -n '<meta name="robots" content="noindex">' \
  promptbook/index.html \
  promptbook/privacy/index.html \
  promptbook/terms/index.html
rg -n -i 'promptbook' sitemap.xml
```

The second command should return no sitemap match while Promptbook is parked.
Also inspect the homepage and the runtime Product Cinema information shell;
raw supporting-page markup alone does not represent the final runtime shell.

### Data hooks

Inspect:

```text
data-app
data-field
data-releases
```

Expected current structure:

- homepage: four apps with badge hooks and no release-history target;
- each primary app page: four badge fields and one matching release target;
- Promptbook: no release-data hooks.

Verify that keys match in:

- `app-data.js`;
- `scripts/fetch-releases.mjs`;
- route markup;
- `releases.json`.

### Language structure

Primary Product Cinema routes currently have no bilingual pairs or language
buttons.

Current source counts for supporting routes:

| Route | `data-en` | `data-ar` | Language buttons |
|---|---:|---:|---:|
| About | 21 | 21 | 2 |
| Support | 82 | 82 | 2 |
| Legal | 42 | 42 | 2 |
| 404 | 10 | 10 | 2 |
| Promptbook main | 26 | 26 | 2 |
| Promptbook privacy | 27 | 27 | 2 |
| Promptbook terms | 24 | 24 | 2 |

Counts prove paired source markers, not visual RTL correctness.

### Public/private scan

Review changed text for:

- secrets, tokens, private keys, certificates, or credentials;
- personal filesystem paths;
- private repository URLs/details;
- internal or legacy product names;
- user data;
- unreleased product/commercial information.

Only the public name `Filed` may appear.

### Internal links and asset references

For every changed page or document:

- resolve repository-relative links;
- verify referenced local images, stylesheets, and scripts exist;
- verify canonical, App Store, privacy, terms, support, and navigation links;
- verify CNAME, robots, sitemap, and workflow remain unchanged unless explicitly
  in scope.

## Structural route matrix

### Primary routes

- `/`
- `/sshift/`
- `/phonespace/`
- `/filed/`
- `/dufaat/`

Verify:

- header/footer and brand mark;
- static content without JavaScript;
- Product Cinema CSS/JS loads;
- badge fallbacks;
- App Store links;
- release sections on app pages;
- route-specific screenshots/assets;
- Open Graph card references.

### Supporting routes

- `/about/`
- `/support/`
- `/legal/`
- `404.html`
- per-app privacy/terms routes;
- preserved Promptbook routes.

Verify raw HTML and the JavaScript-generated information shell.

## Manual browser matrix

### Viewports and input

- wide desktop;
- standard laptop;
- tablet;
- mobile;
- narrow mobile;
- fine pointer/hover;
- coarse pointer/touch.

### Theme and motion

- light;
- dark;
- system theme with no stored override;
- reduced motion;
- normal motion;
- JavaScript disabled/static fallback where practical.

### Language and direction

- primary Product Cinema routes remain correct as English/LTR;
- information/legal routes switch English ↔ Arabic;
- Arabic uses RTL on routes that support it;
- refresh/persistence behavior is recorded rather than assumed;
- no claim of full-site RTL parity.

### Content and navigation

- all primary routes;
- About, Support, Legal;
- 404 through a missing nested path;
- privacy/terms routes;
- Promptbook direct routes remain reachable but inactive/noindex;
- Promptbook does not appear in active landing/generated navigation;
- App Store links open the intended public listing;
- email/support links work.

### Product Cinema behavior

- homepage desktop sequence and separately directed mobile edit;
- each product chapter's static and enhanced state;
- no content available only through hover or animation;
- Filed remains flat and product-specific;
- theme-specific images and atmospheres;
- reduced-motion fallback;
- no console errors.

## Release-data verification

System A:

- test fresh public response where network permits;
- test hardcoded fallback with network unavailable;
- verify stale cache behavior where practical;
- verify version/rating/updated fields independently.

System B:

- validate JSON syntax;
- inspect recent `updatedAt`;
- confirm all four app keys and version arrays;
- verify latest and older release rendering;
- verify missing/empty notes behavior;
- verify failure hides only the affected release UI;
- inspect workflow result and bot commit after an approved release action.

Never trigger the workflow during a read-only validation task.

## Live verification

Read-only checks may use:

```sh
curl -I https://saud.im/
curl -I https://saud.im/sshift/
curl -I https://saud.im/releases.json
```

Record:

- UTC timestamp;
- final URL;
- HTTP status;
- content type;
- affected route content;
- whether response bytes or visible behavior match the approved candidate.

Do not infer the deployed commit from Pages headers unless an authoritative
source exposes it.

## Foundation evidence

At `2026-07-24T12:31:11Z`, read-only checks returned HTTP `200` for the
homepage, primary app routes, key information routes, Promptbook main page,
release JSON, sitemap, and robots. Selected route/config responses matched the
current foundation files byte-for-byte.

This evidence is time-bound and must be repeated before a future release.

## 2026-08-11 PhoneSpace 1.2 website candidate

- `VERIFIED`: Desktop local preview rendered the updated Product Cinema hero,
  feature copy, four-screen evidence gallery, theme-specific Home capture, and
  current App Store-backed `v1.1` runtime label with no console errors.
- `VERIFIED`: The English privacy copy rendered and the paired Arabic source
  remained present; canonical, App Store, privacy, terms, support, stylesheet,
  script, and screenshot targets were checked against repository paths.
- `VERIFIED`: The candidate screenshot assets are 820 × 1781 JPEG files and the
  changed route CSS is cache-busted.
- `VERIFIED`: `git diff --check` passed and no manual change to
  `releases.json` or the release-data JavaScript was present.
- `VERIFIED`: A 390 × 844 browser viewport rendered the compact Menu header,
  responsive hero, Resize/Convert tool cards, and alternating real-screen
  gallery without console errors or horizontal clipping in the inspected
  states.
- `VERIFIED`: The corrected gallery rendered two readable columns at 901 px,
  three at 1280 px, and four at 1500 px. The corrected Tools chapter rendered
  with the same dark gradient and light text in both Day and Night themes; the
  Resize badge color was raised above the 4.5:1 small-text threshold against
  the darkest relevant gradient stop. No console errors were recorded.
- `VERIFIED`: Independent review of `cacbdc8` returned `BLOCK`, including
  publication-ordering, privacy-scope, contact-trash, screenshot, responsive
  gallery, and pre-existing light-theme contrast findings.
- `VERIFIED`: Final independent review of corrected candidate `d79a972`
  returned `PASS`. Computed-style and WCAG measurements covered Day and Night at
  901, 1280, and 1500 px; all tested text, badge, glyph, and border contrasts
  passed their applicable thresholds.
- `VERIFIED`: Saud accepted the temporary feature-copy/binary timing difference
  and approved immediate publication while the automated version label remains
  tied to Apple's current public App Store version.
- `VERIFIED`: Release sync run `31495780955` and Pages deployment
  `31495798046` completed successfully. The expected sync descendant `9250eaa`
  changed only `releases.json`.
- `VERIFIED`: At `2026-08-11T13:26:05Z`, the homepage, PhoneSpace page, privacy
  page, route CSS, three new screenshots, `app-data.js`, and `releases.json`
  returned HTTP 200 with the expected content types. The changed HTML, CSS, and
  image responses matched repository bytes.
- `VERIFIED`: The live 1280 × 720 browser session rendered the PhoneSpace hero,
  dark Tools chapter, four-screen evidence gallery, and homepage without
  horizontal overflow or console warnings/errors. All four gallery images
  loaded at 820 × 1781. PhoneSpace showed `iOS · v1.1` on both the app page and
  homepage, and generated release history also remained at 1.1 as expected.

## 2026-08-25 bilingual Product Cinema candidate

- `VERIFIED`: Static bilingual contract checks (see
  `scripts/check_bilingual.py`, standard library only) must pass on all sixteen routes: paired
  `data-en`/`data-ar` balance, one `.pc-site-lang` group with EN/AR buttons per
  primary header, one static skip link plus `<main id="main">` per route, early
  `pc-site-js` head class, and balanced CSS braces in every touched stylesheet.
- `VERIFIED`: Local in-app Chromium checks at 1280 px and 340 px covered all
  five primary routes plus all eleven information/legal routes in Arabic.
  Language persisted across navigation/reload, EN restored `ltr`, theme changes
  did not change language, direct header/main/footer landmark counts stayed at
  one on enhanced information routes, horizontal overflow stayed at zero, and
  the browser console remained empty. Representative homepage, PhoneSpace,
  Dufaat, and Support captures were inspected visually in Arabic.
- `VERIFIED (static fallback)`: With scripts absent, source markup retains one
  visible topbar, footer, skip link, navigation, and `<main id="main">`; dead
  language buttons are hidden by `html:not(.pc-site-js)`. The in-app browser did
  not expose its optional CDP capability, so script execution could not be
  disabled for a second visual run; the permanent checker enforces this source
  contract instead.
- `PENDING`: Independent QA + code review before any Release-gate approval;
  this candidate has not been merged or published.

## 2026-08-25 Phase C SShift v5.0 fallback and sitemap remediation

- `VERIFIED`: Exactly five stale visible SShift references were replaced at a
  clean HEAD (`c675db0`): three homepage badge fallbacks (`index.html` lines
  124, 242, 277), the SShift route edition line, and the SShift route badge
  fallback (`sshift/index.html` lines 105 and 124). All now read `v5.0` /
  `5.0`. No other occurrence of `4.2` remains in either file.
- `VERIFIED`: `releases.json`, `app-data.js`, `releases-loader.js`, workflow
  files, and app version/build sources were untouched; `git diff --stat`
  confirmed only `index.html`, `sshift/index.html`, and `sitemap.xml` changed.
- `VERIFIED`: Sitemap `lastmod` values were updated only for `/`,
  `/phonespace/`, and `/dufaat/` to `2026-08-11`, each evidenced by Git
  history as that route's latest product publication commit on `origin/main`
  (homepage and Dufaat: `d9444ef`; PhoneSpace: `d79a972`). The 2026-08-25
  bilingual candidate commit is unpublished and was not used as a publication
  date. All twelve other sitemap entries are byte-identical.
- `VERIFIED`: Static checks passed after the edit:
  `scripts/check_bilingual.py` (16 routes OK), `xmllint --noout sitemap.xml`,
  `node --check app-data.js`, `node --check releases-loader.js`, and
  `git diff --check`.
- `PENDING`: Live-route verification, independent review, and Release-gate
  approval; no network access, commit, or push occurred in this phase.

## 2026-08-25 Phase E release supply-chain hardening

- `VERIFIED`: `jsonwebtoken` was confirmed at exactly `9.0.3` (latest stable)
  against the official npm registry before pinning.
- `VERIFIED`: A minimal private-root `package.json` was added with the single
  exact dependency `jsonwebtoken` `9.0.3`, a `node --test` script, and a
  Node `>=22` engine floor. The website itself remains static; the dependency
  serves only the release-sync workflow.
- `VERIFIED`: `package-lock.json` (lockfileVersion 3) was generated only by the
  official npm CLI (12.0.2, downloaded from `registry.npmjs.org` into a
  temporary worktree-local directory). All 15 locked packages resolve from
  `https://registry.npmjs.org/` with sha512 integrity hashes. No `node_modules`
  directory was created or committed in the repository root.
- `VERIFIED`: `.github/workflows/sync-releases.yml` now installs with
  `npm ci --ignore-scripts` (no ad-hoc `npm install jsonwebtoken`), declares a
  `sync-releases` concurrency group with `cancel-in-progress: false`, and on
  change re-fetches `main`, rebases onto it, and pushes explicitly with
  `git push origin HEAD:main`. No force-push flags are present. Protected site,
  data hooks, `releases.json`, and fetcher logic were untouched.
- `VERIFIED`: New static offline tests in `tests/supply-chain.test.mjs`
  enforce the pin, lockfile registry/integrity coverage, the `npm ci
  --ignore-scripts` step, the serialized concurrency setting, and the safe
  no-force push sequence. Full suite (`npm test`) passed: 19 tests, 0 failures,
  run entirely offline.
- `VERIFIED`: An isolated `npm ci --ignore-scripts` from the generated
  lockfile ran in the worktree-local `.phase-e-tmp/ci-check` sandbox and
  succeeded (15 packages); `jsonwebtoken` 9.0.3 signed and verified a token
  in that sandbox, which was removed afterwards along with its
  `node_modules`.
- `PENDING`: Independent review and Release-gate approval; no commit or push
  occurred in this phase, so the workflow change has not yet run on GitHub
  Actions.

## 2026-08-25 narrow-viewport header overflow remediation (340 px)

- `REPORTED`: Browser QA at clean HEAD `c56b1d0` found `html scrollWidth=352`
  at a 340 px English viewport on all five primary Product Cinema routes: the
  `.pc-site-header` grid columns (brand track 61.1 px + 4 px gap +
  `.pc-site-tools` 276.9 px inside 320 px of content width) overflowed the
  viewport. Arabic reportedly passed at the same width.
- `VERIFIED`: The smallest shared fix was applied in
  `assets/product-cinema-site.css` inside the existing
  `@media (max-width: 340px)` block:
  `.pc-site-brand > span:last-child { display: none; }`. Only the brand text
  span is hidden; the mark, the link, its `aria-label`, and the 44 px minimum
  target remain intact, and the rule applies identically to the static no-JS
  header and the JS-generated shell because both share the same markup shape.
  Arithmetic against the reported measurements gives a right content edge of
  ~315 px at 320 px and at 340 px viewports, inside both widths. This is
  arithmetic against reported numbers, not a fresh browser measurement.
- `VERIFIED`: The cache-bust query for `product-cinema-site.css` was bumped
  from `?v=20260825-bilingual1` to `?v=20260825-narrowfix1` in all sixteen
  routes that reference it. Other assets keep their existing queries because
  their files did not change.
- `VERIFIED`: `scripts/check_bilingual.py` gained two static contracts:
  the ≤340 px block must hide the brand text span while keeping the mark and
  link rules present, and every route must carry exactly one
  `product-cinema-site.css` versioned reference with a consistent version
  across all sixteen routes. The checker passed with `--git` (16 routes OK,
  forbidden scope untouched).
- `VERIFIED`: `node --check` passed for `app-data.js`,
  `releases-loader.js`, `assets/product-cinema-core.js`,
  `assets/product-cinema-info.js`, `assets/product-cinema.js`, and
  `scripts/fetch-releases.mjs`; `node --test tests/*.test.mjs` passed
  19/0.
- `VERIFIED`: Independent supervisor-supplied browser QA covered all five
  primary routes at both 320 × 760 and 340 × 760 in EN/LTR and AR/RTL,
  20 cases total. Every case measured `scrollWidth <= clientWidth` (no
  horizontal overflow), the correct `lang`/`dir` attributes, hidden narrow
  brand text inside the ≤340 px block, and every theme/language/menu target
  measuring at least 44 × 44 px.
- `PENDING`: Independent review and Release-gate approval; no network access,
  commit, or push occurred in this phase.
