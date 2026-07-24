# saud.im — Known Issues

Only directly verified repository or runtime issues belong here. Proposed
features and unverified concerns are not defects.

## WEB-KI-001 — documentation drift

**Status:** In correction on the Product-Local Foundation branch.

The previously committed architecture and design documents describe the
pre-Product-Cinema system as current. `Docs/SESSION_LOG.md` also ends before
Product Cinema. Current code and Git history establish Product Cinema as the
active lineage.

Risk: an AI or contributor may restore superseded layouts, motion, language
claims, or Promptbook guidance.

Mitigation: current entry/state/design documents take precedence. Leave the
historical session log unchanged until a separately reviewed knowledge-history
task decides how to preserve it without rewriting history.

## WEB-KI-002 — mixed language behavior

**Status:** Open; behavior intentionally unchanged in this documentation pass.

- Primary Product Cinema routes are English-only.
- Information/legal routes contain English/Arabic content and controls.
- `assets/saud.js` applies Arabic/RTL.
- `assets/product-cinema-core.js` initializes its shell as English/LTR.

Risk: full-site Arabic/RTL capability may be claimed or assumed when current
code does not provide one uniform contract.

Required next step: dedicated language/RTL discovery, Design review, and
browser regression matrix before any implementation.

## WEB-KI-003 — production commit identity

**Status:** Reverify before each release decision.

At `2026-07-24T12:31:11Z`, the homepage, four primary app routes, three
information routes, release data, sitemap, and robots responses matched the
current foundation files byte-for-byte and returned HTTP `200`.

GitHub Pages response headers did not identify the deployed commit. The exact
production commit identity therefore remains unknown from the network response
alone.

## WEB-KI-004 — local AI configuration

**Status:** Controlled.

Local AI configuration is ignored and outside Git. It must remain
machine-specific and must not enter this public repository.

## WEB-KI-005 — local main lag and historical worktrees

**Status:** Operating hygiene issue; no lost code was identified.

At foundation preflight:

- local `main` was 25 commits behind current `origin/main`;
- the current foundation branch was correctly created from fetched
  `origin/main`;
- historical Product Cinema worktree records remained registered.

Do not clean worktrees or move local `main` casually. Future tasks must fetch,
record the actual remote base, and work in an isolated branch/worktree.

## WEB-KI-006 — Promptbook state exists in two layers

**Status:** Open synchronization risk; public runtime is parked.

Verified parked behavior:

- absent from the Product Cinema landing;
- excluded from generated Product Cinema navigation/footer;
- information-shell JavaScript removes preserved Promptbook rows/links;
- all three direct pages use `noindex`;
- absent from sitemap and both release-data systems.

Some supporting/historical source HTML still contains Promptbook links, and the
preserved Promptbook pages link within their own inactive section.

Risk: a static source audit that ignores runtime shell behavior may report
Promptbook as active, while a runtime-only audit may miss the preserved markup.

## WEB-KI-007 — no committed browser regression suite

**Status:** Open.

The repository contains no committed:

- browser automation suite;
- visual-regression suite;
- full-site RTL regression suite;
- `package.json` test runner.

The release workflow synchronizes public release data; it is not a website test
suite. Current site validation depends on structural checks and a manual browser
matrix.

## WEB-KI-008 — release systems can drift independently

**Status:** Known architecture risk with documented fallback.

The live badge system and generated release-history system are independent.
Badges can be current while `releases.json` is stale or unavailable. The
generated release history can render while the visitor's public iTunes request
fails.

Use [`RELEASES_PIPELINE.md`](RELEASES_PIPELINE.md) for diagnosis. Never treat
one successful system as verification of the other.
