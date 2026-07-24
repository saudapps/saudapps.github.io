# saud.im — Website Release History and Process

This document records verified Git lineage and the current safe release
process. It does not claim App Store or GitHub Pages state unless separately
verified.

## Current baseline

| Field | Status | Value |
|---|---|---|
| Foundation source | `VERIFIED` | `e3921fbd32d1fdc6bffe48531d67a46c863a2275` |
| Source branch | `VERIFIED` | `origin/main` after fetch on 2026-07-24 |
| Commit type | `VERIFIED` | Release-sync bot commit changing only `releases.json` |
| Historical audit source | `VERIFIED` | `7e2200becbff813fc3a87e988834d4c2f58cddf9` |
| Live content sample | `VERIFIED` | Selected live responses matched current files at `2026-07-24T12:31:11Z` |
| Exact deployed commit | `UNKNOWN` | Pages headers did not expose commit identity |

## Verified pre-Product-Cinema lineage

### Pre-redesign marker

- Tag: `pre-redesign-2026-07-05`
- Commit:
  `e5b7948c16b0ba0386c48f084ad51081847abe5e`
- Type: annotated baseline tag on a release-sync commit.

### Stage 0 — cleanup and indexing baseline

Feature/documentation range:

- `91b721055ee0f16dad4bdced99ba9e716d4205a0` — public-safe comment cleanup.
- `b8007eb655088a4e4817512c6790b9ac2986fab9` — unused stylesheet removal.
- `48fc48d1f395dbd3eb9887650c1305d8a2315cba` and
  `0cf24ce15e334347dff74faf12423e379010188c` — static version fallbacks.
- `03cb525c5bdcf10298868aa159e9bcea8d5f3ee5` — then-current docs sync.
- `4e2d980917186cc7fad545516bf78381a112d8e1` — public icon optimization.
- `79ff35bdad0ddb507ca92e27a6401709fb2d09e1` — Promptbook noindex/sitemap
  parking.
- `b6b721516ddc67367f3f0accd675d34a00ac4ee3` — Stage 0 session record.

### Stage 1 — motion foundation

- `596593428b40ae695935de9718722acbe414d3d7` — motion tokens.
- `b322a73a7b75fac43f89821c7e2f13d303bc16b4` — reveal variants and
  stagger.
- `c559bfda6f22ed8b00beaf89c78e4907559943ec` — shared asset cache
  versions.
- `332f8fdbdbe00be6cad9fd3e5f2f718f1be831ef` — Stage 1 documentation.

### Stage 2 — pre-cinematic landing

- `0021971fcfeca57f76d30277d02e0974864ddd41` — living-atmosphere
  landing.
- `7e08ea98e77c72f7d7510db5aeb5f7344576433d` — Stage 2 documentation.

### Stage 3 — pre-cinematic app pages

- SShift:
  `5be83a8944c7657cb1d3d334f42da7cd2d1bbd92`
- Dufaat:
  `6e3a9af77eca7879c73f64a8d7d6d19de3fbb521`
- PhoneSpace:
  `f9e803d639e65bee4bab574bb3964cdf48ae14d6`
- Filed:
  `6ff4c9d18a23c79d7f8f2a3ad019a3795843d009`

Their adjacent documentation commits remain in history.

### Final pre-cinematic stage

- `b18eb3dacd020d79a56a84d54b9d8797ebb5aac7` — studio/information-page
  motion.
- `083b0a102402b5f355500fb97ee00e180a3c0509` — bilingual 404.
- `2ce3a85bb1a381cba02cf795f607c37f7341ef36` — Open Graph cards.
- `8d84340426615a15d7a6a1f7c6aaaa07071ce0c9` — sitemap dates.
- `5799e26124627bbce615981cfa670350c8fcde49` — final documentation.

Preserved markers:

- `baseline/pre-cinematic-local-2026-07-13`
- `baseline/pre-cinematic-local-2026-07-13-remote`

Both dereference to `5799e26124627bbce615981cfa670350c8fcde49`.

The production baseline tags:

- `baseline/pre-cinematic-production-2026-07-13`
- `baseline/pre-cinematic-production-2026-07-13-remote`

both dereference to
`f1f3336040e716928abf3a8b4c84d8dc1b4045a0`.

## Verified Product Cinema lineage

| Stage | Commit | Type | Preserved tag |
|---|---|---|---|
| Prototype / approved phase | `0edc445bcfb3184d296105ec88bb13b281e4d39a` | Feature commit | `milestone/product-cinema-phase2f-approved-2026-07-14` |
| PhoneSpace chapter | `c2d5bb8176750e59db4c8c0a5d59886201f48e94` | Feature commit | `milestone/product-cinema-phonespace-approved-2026-07-14` |
| Filed chapter | `078d5b9bc3f73f094721b97268b41a9bfda408d6` | Feature commit | `milestone/product-cinema-filed-approved-2026-07-14` |
| Full-site launch candidate | `8445cfe48c50e3f6f6c1ca40c8363d9eed245585` | Feature commit | — |
| Full-site merge | `42ab856257eae18f1449c579268a02dc60252b9f` | Two-parent merge commit | `milestone/product-cinema-full-site-live-2026-07-15` |
| First recorded sync descendant | `7e2200becbff813fc3a87e988834d4c2f58cddf9` | Bot release-sync commit | — |
| Current foundation source | `e3921fbd32d1fdc6bffe48531d67a46c863a2275` | Bot release-sync descendant | — |

The full-site merge parents are:

- `8445cfe48c50e3f6f6c1ca40c8363d9eed245585`
- `86926232d76b296edb3e3051c8fc6348513fd45d`

Every commit after `7e2200b` through the current foundation source is a
`chore: sync releases [skip ci]` descendant that changes only
`releases.json`.

## Commit and tag meanings

- **Feature commit:** reviewed site implementation or content change.
- **Documentation commit:** knowledge update; not deployment verification.
- **Merge commit:** combines reviewed history; preserve both parents.
- **Bot release-sync commit:** generated `releases.json` update; not a manual
  design/content release.
- **Annotated tag:** immutable provenance or rollback marker.
- **Live verification:** separate network/browser evidence. A tag name or Git
  commit alone does not prove current Pages state.

Do not move or delete the existing tags. Do not invent historical release
markers retroactively.

## Safe website release process

1. Create an approved Saud Apps OS work order.
2. Fetch and record `origin/main`, local state, worktrees, and protected
   untracked files.
3. Create one isolated branch/worktree from the approved current base.
4. Implement only the approved scope.
5. Preview visible work in the required browser/theme/language/motion matrix.
6. Run structural checks, link/asset checks, hook checks, privacy scans, and
   relevant manual verification.
7. Synchronize current documentation.
8. Obtain independent QA and code-review verdicts.
9. Fetch again and inspect remote bot/human changes.
10. Rebase or merge only under the approved Git policy; never force-push.
11. Obtain Saud's Release approval.
12. Perform one reviewed merge/push to `main`.
13. Verify GitHub Pages and affected `saud.im` routes.
14. Verify System A and System B independently when release data is involved.
15. Preserve an approved milestone/rollback marker when required.
16. Record exact release evidence and close knowledge.

## Rollback principles

- Prefer a reviewed revert or movement to a pre-approved forward recovery
  commit.
- Preserve history and existing annotated tags.
- Do not use destructive reset, force-push, or tag movement.
- A visual rollback must preserve public data hooks and release configuration.
- A release-data rollback must account for the bot's generated descendants and
  must never hand-edit `releases.json`.
