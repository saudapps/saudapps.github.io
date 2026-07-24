# Saud Apps — Public App Index

This is the public-safe index of products represented on `saud.im`. It contains
no private repository details, private identifiers, or internal product names.

## Active public products

| App | Website | Privacy | Terms | Public App Store state |
|---|---|---|---|---|
| SShift | [saud.im/sshift](https://saud.im/sshift/) | [Privacy](https://saud.im/sshift/privacy/) | Not currently published | Live · App Store ID `6751362215` |
| PhoneSpace | [saud.im/phonespace](https://saud.im/phonespace/) | [Privacy](https://saud.im/phonespace/privacy.html) | [Terms](https://saud.im/phonespace/terms.html) | Live · App Store ID `6765632161` |
| Filed | [saud.im/filed](https://saud.im/filed/) | [Privacy](https://saud.im/filed/privacy/) | [Terms](https://saud.im/filed/terms/) | Live · App Store ID `6781196551` |
| Dufaat | [saud.im/dufaat](https://saud.im/dufaat/) | [Privacy](https://saud.im/dufaat/privacy/) | [Terms](https://saud.im/dufaat/terms/) | Live · App Store ID `6780440703` |

The four active products are present in both public data systems:

- the public iTunes badge map in `app-data.js`;
- the App Store Connect release map in
  `scripts/fetch-releases.mjs`.

Their primary routes contain the required `data-app`, `data-field`, and
`data-releases` hooks.

## Promptbook

| Field | Current state |
|---|---|
| Lifecycle | `Stopped / Parked` |
| Active roadmap | None |
| Main page | [saud.im/promptbook](https://saud.im/promptbook/) |
| Privacy | [saud.im/promptbook/privacy](https://saud.im/promptbook/privacy/) |
| Terms | [saud.im/promptbook/terms](https://saud.im/promptbook/terms/) |
| Indexing | All three pages use `noindex`; all are absent from `sitemap.xml` |
| Active discovery | Absent from the Product Cinema landing and generated Product Cinema navigation |
| Release data | Not wired into either release-data system |

Promptbook is preserved as inactive historical public material. Do not delete,
index, feature, wire, or revive it without Saud's explicit approval and a
dedicated work order.

## Naming rule

Use public product names only. In particular:

- always use `PhoneSpace`;
- always use `Filed`;
- never publish internal or legacy repository, project, target, storage, or
  identifier names.

## Maintenance rules

- A public app release, positioning change, pricing change, screenshot change,
  or legal/support change must follow
  [`WEBSITE_RELEASE_SYNC.md`](WEBSITE_RELEASE_SYNC.md).
- `releases.json` is generated; never edit it by hand.
- App Store state in this index must be reverified before a release decision.
- A live badge does not verify generated release history, and generated release
  history does not verify the live badge.
