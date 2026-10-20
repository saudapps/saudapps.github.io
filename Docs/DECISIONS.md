# saud.im — Current Decisions

This log records current public-safe operating and architecture decisions.
Historical Git remains available for provenance, but superseded decisions are
not current guidance.

## Decision register

| ID | Decision | Status | Provenance |
|---|---|---|---|
| WEB-001 | Product Cinema is the current visual system. Pre-Product-Cinema design guidance is historical, not current. | `CURRENT` | Current code plus Product Cinema milestone commits/tags |
| WEB-002 | `main` is production; there is no staging environment. Work uses an isolated branch/worktree and requires Release approval before merge. | `PROTECTED` | Current Pages architecture and Saud Apps OS |
| WEB-003 | This repository is public. Private app source, private repository details, internal product names, secrets, personal paths, and user data stay out. | `PROTECTED` | Repository purpose and owner policy |
| WEB-004 | `releases.json` is generated and must never be edited by hand. | `PROTECTED` | Current workflow and fetcher |
| WEB-005 | Live App Store badges and generated release history are independent systems. One cannot verify the other. | `CURRENT` | `app-data.js`, `releases-loader.js`, and release workflow |
| WEB-006 | `data-app`, `data-field`, `data-releases`, public App Store links, CNAME, robots, sitemap, and release workflow are protected compatibility/release contracts. | `PROTECTED` | Current code and operating policy |
| WEB-007 | Current route-language behavior remains unchanged until a separately approved task. Full-site Arabic/RTL parity is not assumed. | `CURRENT` | Current route markup and scripts |
| WEB-008 | Promptbook is Stopped/Parked. Preserve its pages, keep them inactive and unindexed, and neither delete nor revive it without approval. | `CURRENT` | Current code, sitemap, noindex metadata, and owner decision |
| WEB-009 | Use `Filed` as the only public product name. | `PROTECTED` | Public naming policy |
| WEB-010 | Release-sync bot commits are expected. Fetch and reconcile before push; never force-push over them. | `PROTECTED` | Current workflow and Git history |
| WEB-011 | Existing milestone and baseline tags are immutable rollback/provenance markers. | `PROTECTED` | Current annotated tags |
| WEB-012 | Application source code does not belong in this website repository. | `PROTECTED` | Public/private architecture boundary |
| WEB-013 | Dabta pre-launch pages are hidden: `/dabta/`, `/dabta/privacy/` and `/dabta/terms/` carry `noindex` and stay out of the landing page, navigation, sitemap, `Docs/APPS.md`, `app-data.js` and the release systems until the App Store release. Support is the last section of `/dabta/` (`#support`), not a separate route. | `CURRENT` | Owner decision, 2026-10-20 |
| WEB-014 | One-time implementer exception: Claude Code implements the Dabta pre-launch pages (WEB-013) for this task only. Codex remains the sole website implementer otherwise; independent review and owner Release approval still apply. | `CURRENT` | Owner decision, 2026-10-20 |

## WEB-001 — Product Cinema is current

Current:

- homepage Product Film;
- shared Product Cinema shell and atmosphere;
- product-specific chapters;
- reading-first information tier.

Superseded as current guidance:

- Stage 1/2/3 pre-cinematic homepage and app-page recipes;
- the older quiet-tier design as the primary site contract.

Historical guidance may be studied through Git but must not be reapplied
without a new approved Design decision.

## WEB-002 — production branch

- `main` is served by GitHub Pages.
- There is no staging deployment.
- Do not work directly on `main`.
- A branch push is not a production release unless Pages is configured to serve
  it; a merge/push to `main` is production-sensitive.
- Saud must approve merge/publication.

## WEB-003 — public/private boundary

Public documentation may explain architecture and public release behavior. It
must not reveal:

- private product repository topology;
- internal or legacy app names;
- signing/configuration secrets;
- personal paths or machine state;
- unreleased commercial/product details;
- private app code or user data.

Secret variable names already required by a public workflow may be documented;
secret values may not.

## WEB-004 and WEB-005 — release data

System A:

- public iTunes API;
- browser-side cache/fallback;
- `data-app` and `data-field`.

System B:

- authenticated App Store Connect workflow;
- generated `releases.json`;
- `data-releases`.

They share public app keys by convention, not state. Any change to an app key
must be applied and verified independently in both systems.

## WEB-007 — language contract

- Primary Product Cinema routes are bilingual English/Arabic. The served
  default is `<html lang="en" dir="ltr">`; Arabic swaps `data-en`/`data-ar`
  pairs, sets `dir="rtl"` with mirrored text-bearing components, and persists
  in `localStorage['saudapps-lang']`.
- Information and legal routes keep their preserved source shells with paired
  content and language segments; both shell families share one language key.
- Without JavaScript the language controls are hidden (`html:not(.pc-site-js)`
  guards) and every route still serves a complete readable fallback with a
  static skip link and a real `<main id="main">` target.
- Decorative compositions remain non-mirrored by design; no document may claim
  exhaustive full-site RTL parity for decorative art.

A deeper RTL redesign (decorative mirroring, new compositions) needs Scope,
Design, accessibility, and regression review.

## WEB-008 — Promptbook

Promptbook remains directly reachable historical public material, but is not an
active portfolio product:

- no landing presence;
- no active Product Cinema navigation;
- no sitemap entries;
- `noindex` on its three pages;
- no release-data wiring;
- no active roadmap.

Removal, indexing, launch, or revival are separate owner decisions.

## WEB-010 and WEB-011 — remote history

The release workflow can append `chore: sync releases [skip ci]` commits to
`main`. Before push:

1. fetch;
2. inspect remote-only commits;
3. confirm whether they are expected bot-only release updates;
4. rebase or merge according to the approved work order;
5. stop on conflicts or unexpected human changes.

Never force-push. Preserve current annotated baseline and Product Cinema
milestone tags.

## WEB-013 — Dabta pre-launch pages

Dabta is a new app that is not yet on the App Store. Its pages are public but
hidden, in the same way as WEB-008:

- three routes only: `/dabta/` (Product Cinema chapter with a `#support`
  section at the end), `/dabta/privacy/` and `/dabta/terms/`;
- `noindex` on all three pages;
- no link from any other page or from the shared navigation; the Dabta pages
  link only to each other, to the support email, to Apple's standard licence
  agreement from the terms and, through the brand mark, to the homepage;
- no sitemap entry, no `Docs/APPS.md` row, no `app-data.js` or release-data
  wiring, no App Store link or public app identifier;
- the pages do not name or link other Saud Apps products;
- bilingual English/Arabic per WEB-007, light and dark, with route-local
  `dabta/product-cinema.css` and `dabta/product-cinema.js`; no shared file is
  changed;
- Arabic text uses a self-hosted Noto Kufi Arabic subset shipped with its OFL
  licence in `dabta/assets/fonts/`;
- app screens are drawn in HTML and CSS with example numbers until real
  screenshots exist;
- the seller name and the effective date of the privacy policy and terms are
  filled in on the day the pages are published.

At the App Store release (phase 2 of `Docs/ADD_NEW_APP.md`): real
screenshots, the App Store link and release data, removal of `noindex`, and
the sitemap, `Docs/APPS.md` and landing-page entries, each with owner
approval.

## WEB-014 — implementer exception for WEB-013

The owner approved Claude Code as the implementer of the Dabta pre-launch
pages for this task only. The exception does not extend to other routes or
later tasks. Independent review, owner preview and Release approval remain
required, and the shared Product Cinema files stay untouched.
