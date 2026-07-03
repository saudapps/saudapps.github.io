# Saud Apps — Public App Index

Master index of all Saud Apps as represented on the public website. Public-safe:
no private source, no bundle IDs, no local machine paths.

| App | Private repo | Website page | Privacy | Terms | App Store status |
|---|---|---|---|---|---|
| SShift | https://github.com/saudapps/SShift | https://saud.im/sshift/ | https://saud.im/sshift/privacy/ | not present yet | Live (App Store ID 6751362215) |
| PhoneSpace | https://github.com/saudapps/PhoneSpace | https://saud.im/phonespace/ | https://saud.im/phonespace/privacy.html | https://saud.im/phonespace/terms.html | Live (App Store ID 6765632161) |
| Promptbook | https://github.com/saudapps/Promptbook | https://saud.im/promptbook/ | https://saud.im/promptbook/privacy/ | https://saud.im/promptbook/terms/ | Coming soon / in development — parked: hidden from the landing (card + footer link commented out, code retained); page still reachable at /promptbook/ |
| Filed | https://github.com/saudapps/PDFHub | https://saud.im/filed/ | https://saud.im/filed/privacy/ | https://saud.im/filed/terms/ | Live (App Store ID 6781196551) — https://apps.apple.com/ae/app/filed-pdf-organizer/id6781196551 |
| Dufaat | https://github.com/saudapps/Dufaat | https://saud.im/dufaat/ | https://saud.im/dufaat/privacy/ | https://saud.im/dufaat/terms/ | Live (App Store ID 6780440703) — https://apps.apple.com/ae/app/dufaat/id6780440703 |

## Naming anomaly notes (public-safe)
- **PhoneSpace** — the public brand and website use **PhoneSpace**. Its private repo
  carries legacy folder/bundle naming from an earlier name; that is an internal
  detail only and does not affect the public site. Always present the app as PhoneSpace.
- **Filed** — the public/site brand is **Filed**, but the private repository and the
  app's internal project identity are **PDFHub** (repo: saudapps/PDFHub). On the
  website, always use "Filed"; "PDFHub" is internal only.
- **SShift** — there is a known internal identifier anomaly in its private repo. It is
  internal only and intentionally not documented here; the public site uses "SShift".

## Notes
- "Live" apps have an App Store ID and a public listing; keep version/links in sync
  via Docs/WEBSITE_RELEASE_SYNC.md.
- "Coming soon / in development" apps have website pages but no App Store ID yet.
  Keep them in the "Coming soon" state until their App Store release is approved.
- Bundle IDs and other internal identifiers are intentionally omitted here to keep
  this index public-safe; they live in each app's private repo.
