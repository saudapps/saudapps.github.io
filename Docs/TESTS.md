# saud.im — Validation and Test Contract

This document records the current validation reality and the minimum review
matrix for website changes. It does not claim an unexecuted check passed.

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
