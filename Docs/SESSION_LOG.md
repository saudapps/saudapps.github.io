# Saud Apps Website — Session Log

Running log of work sessions. Newest entry on top. English only.
Public repo: keep entries free of secrets and private local machine paths.

## End-of-session checklist (run every session)
1. Append a new dated entry below using the template (Done / Decisions /
   Open-next / Deploy state / Live-check).
2. Record deploy state honestly — did the change publish to GitHub Pages?
3. Commit + push, or write explicitly why not. Working tree clean or intentionally stashed.
4. If a site/page change went live → note the live-check result for the affected saud.im page(s).
5. Note anything handed to ChatGPT for review.
6. Write the single most important NEXT action so the next session starts cold
   without re-discovery.

<!-- TEMPLATE — copy for each new session
## YYYY-MM-DD — <short title>
- Done:
- Decisions:
- Open / next:     <single most important next action>
- Deploy state:    published to Pages? which pages changed?
- Live-check:      which saud.im pages verified live, and result
- ChatGPT review:  <what was sent out, if anything>
-->

## 2026-06-14 — Operating-system docs added
- Done: Added CLAUDE.md, Docs/APPS.md, Docs/WEBSITE_RELEASE_SYNC.md,
  Docs/SESSION_LOG.md using the Saud Apps operating-system pattern. Docs only —
  no site pages, index.html, app-data.js, releases.json, releases-loader.js,
  assets, CNAME, sitemap.xml, or Pages/Jekyll config touched.
- Decisions: This completes the operating-system rollout — all five private app
  repos plus the public website repo now carry operating-system docs. Website docs
  are written public-safe (no private source, no secrets, no local machine paths).
- Open / next: Use Docs/WEBSITE_RELEASE_SYNC.md whenever an app release needs the
  site updated; keep Docs/APPS.md current as apps move from "Coming soon" to "Live".
- Deploy state: docs only — no live site pages changed; no functional deploy impact.
- Live-check: n/a (no public page modified).
- ChatGPT review: none.
