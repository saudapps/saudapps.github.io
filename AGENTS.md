# saud.im — AI Entry Point

These instructions apply to every AI agent, automation, and work session in
this public website repository.

## Mission

Maintain `saud.im` as the accurate, accessible, public home of Saud Apps.
Work must be evidence-driven, preserve the current Product Cinema experience,
protect the public/private boundary, and follow the Saud Apps OS approval
model.

## Required reading

Before proposing or changing anything, read these files in order:

1. [`Docs/STATE.md`](Docs/STATE.md)
2. [`Docs/ARCHITECTURE.md`](Docs/ARCHITECTURE.md)
3. [`Docs/DESIGN_SYSTEM.md`](Docs/DESIGN_SYSTEM.md)
4. [`Docs/DECISIONS.md`](Docs/DECISIONS.md)
5. [`Docs/APPS.md`](Docs/APPS.md)
6. [`Docs/KNOWN_ISSUES.md`](Docs/KNOWN_ISSUES.md)
7. [`Docs/TESTS.md`](Docs/TESTS.md)
8. [`Docs/RELEASES.md`](Docs/RELEASES.md)
9. [`Docs/RELEASES_PIPELINE.md`](Docs/RELEASES_PIPELINE.md)
10. [`Docs/ADD_NEW_APP.md`](Docs/ADD_NEW_APP.md)

Then inspect the current Git state, relevant HTML/CSS/JavaScript, workflow, and
public configuration. Historical documents remain evidence, but do not
override current code or current-state documentation.

## Source-of-truth order

1. A verified Git commit and the current code/configuration at that commit.
2. Current product documentation listed above.
3. Historical Git commits and preserved milestone tags.
4. Memory or inference.

When evidence conflicts, do not guess. Record the conflict and label material
facts as `VERIFIED`, `REPORTED`, `PROPOSED`, `SUPERSEDED`, `CONFLICT`, or
`UNKNOWN`.

## Authority and roles

- Saud is the owner and final approver.
- The Saud Apps OS Command Center is the single intake point for new work.
- Codex is the sole role allowed to implement or modify website code.
- Product, UX, architecture, data, security, QA, red-team, reviewer, release,
  and knowledge roles analyze or review; they do not silently modify website
  code.
- Codex cannot approve its own implementation.
- QA does not replace independent code review.
- A failed or missing required review blocks progression.

## Approval gates

- **Scope:** required before a behavior-changing implementation.
- **Design:** required when visible UX, interaction, branding, language,
  accessibility, responsive behavior, or motion changes.
- **Data Safety:** required before release-data sources, workflows, identifiers,
  privacy/legal behavior, generated public data, or destructive changes.
- **Release:** required before merge to `main`, GitHub Pages publication,
  production configuration, workflow dispatch, or another public change.

The Command Center cannot waive Scope, Design when triggered, Data Safety, or
Release gates.

## Work isolation

- Every work order uses a dedicated branch or worktree.
- Only one implementation writer may operate on a branch or worktree.
- No two Codex threads may edit the same branch or worktree.
- The Command Center must prevent conflicting active work orders.
- Existing owner changes, local AI settings, untracked evidence, branches,
  tags, and worktrees must be preserved.

## Git and production rules

- `main` is production. There is no staging branch or staging deployment.
- Never work directly on `main`.
- Fetch before work and again before push.
- Inspect remote-only changes and reconcile them safely before push.
- Release-sync bot commits are expected; do not overwrite them.
- Never force-push.
- Never use `git reset --hard` or `git clean`.
- Never delete or move branches, tags, worktrees, or published history as
  routine cleanup.
- Merge, Pages publication, workflow dispatch, and production changes require
  Saud's explicit approval.

## Public repository boundary

Everything committed here is world-readable.

Allowed:

- Public static site files and public marketing assets.
- Public support, privacy, terms, and release information.
- Public-safe operating documentation.

Never include:

- Application source code from product repositories.
- Private repository details or internal product names.
- Secrets, tokens, keys, certificates, signing assets, or `.env` values.
- Personal filesystem paths, local-only settings, user data, or private
  archives.
- Internal-only audits, work orders, commercial plans, or unreleased product
  details.

Use only the public product name `Filed`.

## Protected website contracts

Do not casually change:

- `data-app`, `data-field`, or `data-releases` hooks.
- App Store links or public app identifiers.
- `CNAME`, `robots.txt`, or `sitemap.xml`.
- `.github/workflows/sync-releases.yml`.
- `app-data.js`, `releases-loader.js`, or
  `scripts/fetch-releases.mjs`.
- Privacy, terms, support, or other public legal routes.
- Product Cinema shared assets, route-local Product Cinema assets, screenshots,
  icons, Open Graph assets, or data hooks.

`releases.json` is generated. Never edit it by hand.

Any public-facing app change—release state, copy, screenshots, pricing,
positioning, privacy, terms, or support—must follow
[`Docs/WEBSITE_RELEASE_SYNC.md`](Docs/WEBSITE_RELEASE_SYNC.md).

## Current design and language contract

- Product Cinema is the current visual system.
- Pre-Product-Cinema design guidance remains historical and recoverable in Git,
  but is not current implementation guidance.
- Preserve each app's distinct Product Cinema chapter and the shared site
  shell.
- Preserve the current route-language behavior until Saud separately approves
  a change.
- Primary Product Cinema marketing routes are currently English-only.
- Information and legal routes contain bilingual English/Arabic content and
  language controls.
- Do not claim or assume full-site RTL parity.
- Preserve light/dark behavior, reduced-motion behavior, responsive edits,
  pointer fallbacks, and static no-JavaScript fallbacks.

## Promptbook

Promptbook is `Stopped / Parked`.

- Preserve its existing pages as inactive historical public material.
- Do not restore it to the active product portfolio.
- Do not add it to the landing, active navigation, sitemap, release systems, or
  indexing.
- Do not delete or revive it without Saud's explicit approval and a dedicated
  work order.

## Release-data contract

Two independent public systems exist:

1. `app-data.js` uses the public iTunes API for live badges.
2. `releases.json` is generated by the App Store Connect workflow and rendered
   by `releases-loader.js`.

One system working does not prove the other works. Preserve their independent
hooks, fallbacks, and app-key mappings. Never infer a deployment, App Store
state, or release result from only one system.

## Implementation contract

Before implementation:

1. Verify repository identity, remote, branch/worktree, base commit, and status.
2. Link the approved Saud Apps OS work order.
3. Define scope, risk, approval gates, validation plan, rollback marker, and
   exit conditions.
4. Inspect current code before proposing changes.

During implementation:

1. Stay inside approved scope.
2. Work in reviewable slices.
3. Preserve public contracts and privacy boundaries.
4. Preview visible work before release approval.
5. Record deviations instead of silently widening scope.

After implementation:

1. Produce exact diff, validation, and preview evidence.
2. Obtain independent QA and code-review results.
3. Complete security/data review when triggered.
4. Update current knowledge wherever implementation reality changed.
5. Fetch again and inspect remote bot or human changes before push.
6. After an approved production change, verify the affected live routes and
   record what was actually observed.

A change is not complete until product knowledge matches verified
implementation and public release state is either verified or explicitly left
pending.
