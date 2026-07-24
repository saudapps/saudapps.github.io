# saud.im — Product Cinema Design System

Product Cinema is the current visual contract for the Saud Apps website. This
document describes what the current code implements; it does not invent
meaning beyond the visible interface and committed design structure.

> This is a public repository. Use public product names only and keep private
> product, repository, and machine information out of this document.

## Current versus historical guidance

The earlier Stage 1/2/3 system—living-grid homepage, app-faithful motion pages,
quiet studio pages, and its associated design recipes—remains recoverable in
Git history and pre-cinematic baseline tags.

It is `SUPERSEDED` as current design guidance.

Do not copy pre-Product-Cinema layout, motion, color, typography, or language
assumptions into current work unless a new approved design explicitly restores
them.

## Product Cinema structure

The current site has three presentation tiers:

1. **Homepage / Product Film** — the visible `PRODUCT FILM 02` opening, four
   product cast cards, a directed sequence, SShift arrival, and studio
   continuity.
2. **Product chapters** — one distinct marketing chapter for SShift,
   PhoneSpace, Filed, and Dufaat.
3. **Information tier** — reading-first About, Support, Legal, 404, and legal
   document presentation.

All tiers share the public Saud Apps identity but do not collapse the four
products into one visual treatment.

## Shared site shell

The current shared shell includes:

- a skip link;
- the four-part Saud Apps brand mark;
- Saud Apps identity text;
- desktop and mobile navigation;
- Day/Night controls;
- responsive header and footer;
- visible keyboard focus;
- public support contact.

The shell uses a warm paper/ink foundation in light mode and a near-black,
warm-ink foundation in dark mode. Shared tokens live in
`assets/product-cinema-site.css`.

The brand mark, favicon, and Apple touch icon are site-level identity elements.
Do not replace them as incidental cleanup.

## Typography

The shared Product Cinema tokens provide:

- a system sans-serif stack for interface and body copy;
- an editorial serif stack;
- a narrow/display stack for large directed typography.

Routes combine these stacks according to their current chapter. Do not
standardize every route onto one family without a Design gate and visual
proof.

## Homepage / Product Film

The homepage currently presents:

- an edition line with `PRODUCT FILM 02`, four live products, and location/year
  copy;
- a large Saud Apps opening;
- four product cast cards;
- a directed sequence that resolves into a visible SShift week;
- a mobile-specific edit of that sequence;
- a studio section about the independent maker;
- links to the four product chapters, About, Support, and Legal.

The homepage is not a generic card grid. Its order, sequence, labels, static
fallback, and mobile edit are part of the current composition.

Visible film/chapter phrases are interface copy. Their presence does not create
an undocumented product taxonomy or formal operating model.

## Product chapter identities

### SShift

SShift uses the shared Product Cinema chapter files and an icy calendar field:

- indigo depth and cyan light;
- week/day structures;
- shift-calendar screenshots;
- time and calendar progression;
- a directed but readable motion chapter.

### PhoneSpace

PhoneSpace uses its route-local Product Cinema files:

- warm cream and amber atmosphere;
- storage pressure opening into room and clarity;
- category rows, storage measures, and tool chapters;
- fine-pointer effects only where supported;
- a static resolved layout and reduced-motion alternative.

### Filed

Filed uses its route-local Product Cinema files and must remain visually flat
and disciplined:

- cool document-network atmosphere;
- filing, organization, reading, signature, sharing, and privacy chapters;
- crisp panels, restrained borders, and document evidence;
- no generic glass/aurora treatment copied from another product;
- static readable and reduced-motion alternatives.

Filed's public identity is `Filed`. No internal name belongs in this public
repository.

### Dufaat

Dufaat uses its route-local Product Cinema files:

- mint-to-copper settlement atmosphere;
- progression from plan to due, paid, proof, and record;
- Pay Soon, progress, proof, reports, reminders, backup, and privacy chapters;
- diagonal/progressive motion where supported;
- static readable and reduced-motion alternatives.

## Information tier

About, Support, Legal, and 404 use a calmer reading-first tier:

- the shared Product Cinema shell;
- restrained information surfaces;
- existing bilingual content;
- minimal enhancement rather than product-film sequences;
- the same theme controls and public brand mark.

The information shell is generated at runtime over preserved document markup.
Changes must be tested with JavaScript enabled and disabled because the raw
source and runtime shell are not identical.

## Theme behavior

The site supports light and dark themes:

- stored choice uses `localStorage`;
- absent a stored choice, the system color preference is used;
- route images may switch through theme-specific data attributes;
- theme color metadata updates with the selected theme;
- route-specific atmospheres include dark variants.

Every visual change must be reviewed in both themes.

## Motion and progressive enhancement

Product Cinema uses motion as progressive enhancement:

- shared and route-local reveal observers;
- scroll-directed sequences;
- fine-pointer effects;
- theme-aware atmosphere;
- requestAnimationFrame only in supported enhanced paths.

The required contract:

- meaningful content exists in HTML before enhancement;
- static layout remains readable;
- reduced-motion media queries remove or simplify animation;
- coarse-pointer and mobile layouts do not depend on hover;
- no content or action may be available only through motion.

## Responsive behavior

Product Cinema contains explicit desktop, tablet, phone, narrow-phone, and
coarse-pointer adjustments. The homepage includes a separately directed mobile
edit rather than merely shrinking the desktop sequence.

Review at minimum:

- wide desktop;
- standard desktop/laptop;
- tablet;
- mobile;
- narrow mobile;
- fine and coarse pointers;
- light and dark themes;
- default and reduced motion.

## Language and direction

The current route split must be documented honestly:

- the homepage and four primary Product Cinema app routes are English-only and
  initialize as LTR;
- information and legal routes contain English/Arabic pairs and language
  controls;
- Arabic selection in the older controller applies RTL;
- Product Cinema core initialization also applies English/LTR;
- full-site Arabic/RTL parity is not a current verified capability.

Do not add Arabic labels, claim RTL parity, remove bilingual support, or change
initial language behavior without a separate approved Scope and Design task.

## Product imagery and social identity

- Public app screenshots live under route-local asset folders.
- Shared Product Cinema icons/field art live under
  `assets/product-cinema-v2/`.
- The homepage and four primary app routes use designed 1200×630 Open Graph
  cards under `assets/og/`.
- The site uses `assets/favicon.svg` and
  `assets/saudapps-favicon.png`.

Use only clean public/demo imagery. Never introduce personal or user data.

## Protected implementation hooks

Design work must preserve:

- `data-app` and `data-field` badge hooks;
- `data-releases` targets;
- App Store and public legal/support links;
- theme controls and theme-image hooks;
- reveal attributes and reduced-motion fallbacks;
- sitemap, robots, CNAME, workflow, and generated release contracts;
- static HTML fallbacks.

Visual approval does not authorize changing release data, public identifiers,
language behavior, legal content, or deployment configuration.

## Design workflow

1. Inspect the current route and its shared/route-local Product Cinema files.
2. Define a public-safe work order and exact route scope.
3. Obtain Scope approval.
4. Produce previews for affected viewports, themes, motion settings, and
   languages where applicable.
5. Obtain Design approval.
6. Implement only on an isolated branch/worktree.
7. Validate content, hooks, links, accessibility, theme, motion, and responsive
   behavior.
8. Obtain independent QA and code review.
9. Obtain Release approval before `main` or Pages changes.
10. Verify the live route after publication and synchronize knowledge.

## Non-goals

Product Cinema does not authorize:

- making all app pages visually identical;
- applying another app's atmosphere to Filed;
- treating animation as required content;
- restoring pre-cinematic design by default;
- changing primary-route language behavior;
- reviving Promptbook;
- editing generated release data;
- exposing private app information.
