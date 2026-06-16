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

## 2026-06-16 — Filed pages prepped for App Store submission
- Done: Reframed Filed pages ahead of submission. (1) /filed/ — replaced the
  "Coming soon to the App Store" disabled button with a Contact-support primary
  CTA (mailto:support@saud.im) and added a Terms ghost link beside Privacy;
  marketing layout/design otherwise untouched. (2) /filed/privacy/ — rewrote §8
  to remove the explicit iCloud reference (iCloud is hidden in v1.0) while keeping
  the no-cloud-sync / no-accounts / local-only substance; rest of policy intact.
  (3) /filed/terms/ — left as-is; verified all four required points are covered
  (local PDF management, visual signature ≠ certified/PKI digital signature, user
  responsible for documents, no data-loss/recovery guarantee + backups are user's).
- Decisions: Per owner, kept the existing marketing landing page (Option 1) rather
  than replacing it with a bare support page; the real App Store link will be added
  post-release. No general site design changed outside Filed pages. No iOS app changes.
- Open / next: After App Store approval, add the real App Store link to /filed/ and
  flip Filed to "Live" in Docs/APPS.md per WEBSITE_RELEASE_SYNC.md.
- Deploy state: published to Pages from main — filed/index.html, filed/privacy/index.html changed.
- Live-check: verify saud.im/filed/, /filed/privacy/, /filed/terms/ after Pages rebuild.
- ChatGPT review: none.

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
