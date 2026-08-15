# Plan 004: Turn all three alternative pages into targeted landing pages

> **Executor instructions**: Build one reusable landing-page structure with
> competitor-specific data; do not clone and drift three large page files.
> Preserve factual nuance and FAQ structured data. Run every verification gate
> and update this plan's status in `plans/README.md` when done.
>
> **Drift check (run first)**:
> `git diff --stat be3022a..HEAD -- src/pages/alternatives src/components src/data public/competitors public/sitemap.xml`
> and
> `git diff --stat -- src/pages/alternatives src/components src/data public/competitors public/sitemap.xml`.
> If competitor content changed since this plan was authored, use the latest
> verified claims as the baseline.

## Status

- **Priority**: P2
- **Effort**: L (three content-heavy routes plus shared template)
- **Risk**: MED — comparative claims and SEO pages are easy to over-generalize
- **Depends on**: plans 001 and 002
- **Category**: direction / tech debt / tests
- **Planned at**: commit `be3022a`, 2026-08-15

## Why this matters

Member Splash, PoolDues, and CourtReserve pages already exist and have useful,
carefully qualified content, but each is a roughly 500-line near-copy with the
old wide design. They are not yet used as ad destinations, but the product owner
intends to run targeted competitor campaigns later. A shared template will give
those campaigns focused message match, consistent conversion behavior, and a
single place to improve comparison-page UX without allowing factual content to
drift.

## Current state

- Route files:
  - `src/pages/alternatives/member-splash.astro`
  - `src/pages/alternatives/pooldues.astro`
  - `src/pages/alternatives/courtreserve.astro`
- Each page repeats URL setup, class tokens, hero, four switch reasons,
  comparison table, “honest take,” built-in extras, FAQ, CTA, and FAQPage JSON-LD.
- All three heroes currently lead with Start free trial and use the comparison
  anchor as secondary. The agreed hierarchy is Live demo primary and 45-day
  free trial secondary.
- Member Splash and PoolDues include optional `badge` rendering that currently
  contributes to the Astro typecheck failure addressed in plan 001.
- `public/competitors/` contains the current competitor logos. Preserve their
  aspect ratios and avoid making their brands look intentionally degraded.
- The homepage and `public/sitemap.xml` already link all three routes.
- Comments at the top of each route say competitor details must be re-verified
  before publishing. This remains a release requirement.

The repeated route shape begins like this in every file (example:
`src/pages/alternatives/member-splash.astro:6-26`):

```ts
const SIGNUP_URL = `${APP_URL}/register`;
const DEMO_URL = "https://demo.memberley.com";
const eyebrow =
  "font-mono text-[0.6875rem] font-medium tracking-wide text-brand-800 uppercase";
const display = "font-serif font-semibold tracking-tight";
```

Each route separately maps the same visual sections and separately emits
FAQPage JSON-LD from local `faqs`; the shared template must keep that visible and
structured content coupled.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run check` | exit 0 |
| Build | `npm run build` | exit 0; all three routes generated |
| Trial-copy check | `rg -n '14-day|14 day' src/pages/alternatives` | no matches |
| Route check | `find dist/alternatives -name index.html | sort` | exactly three files |
| Schema check | `rg -n 'FAQPage' dist/alternatives` | one valid block per page |

## Suggested executor toolkit

- Use `impeccable` or `ui` for the landing-page composition and
  `tailwindcss-development` for responsive tables/cards.
- Use web research only during the explicit claim re-verification gate and cite
  primary competitor pages internally in code comments or review notes. Do not
  use search snippets as evidence.
- No new runtime UI dependency is necessary.

## Scope

**In scope**:

- `src/pages/alternatives/member-splash.astro`
- `src/pages/alternatives/pooldues.astro`
- `src/pages/alternatives/courtreserve.astro`
- `src/components/AlternativePage.astro` (create)
- `src/components/ComparisonTable.astro` (create if reused cleanly)
- `src/data/alternatives.ts` (create)
- `src/config/site.ts` for shared nav metadata only
- `public/competitors/` only if optimized formats are needed
- `public/sitemap.xml` only if routes/canonical URLs change (they should not)

**Out of scope**:

- New competitor pages, docs-site changes, app changes, new pricing, or unverified
  comparative claims.
- Changing Privacy/Terms or the homepage body.
- Publishing future ad campaigns; this plan only makes the pages campaign-ready.

## Git workflow

- Suggested branch: `codex/marketing-refresh-alternatives`
- Commit example: `[update] refresh competitor alternative landing pages`
- Keep content refactor and visual refactor reviewable; a reviewer must be able
  to distinguish moved claims from newly worded claims.

## Steps

### Step 1: Model competitor content explicitly

Create typed data in `src/data/alternatives.ts` for:

- slug, competitor name/logo, page title, meta description, eyebrow, H1, lead;
- hero proof line and CTA event identifier;
- four switch reasons;
- comparison rows using a shared `Cell = string | boolean | null` type;
- honest-fit paragraph (when the competitor may be the better choice);
- built-in extras;
- FAQ records;
- source-review date and primary-source URLs for release review.

Do not mechanically force every page to have the same number of facts if the
source material differs. The template may support optional sections. Preserve
the current nuanced positioning:

- Member Splash: maturity/pool-specific depth versus cost, own Stripe, and brand;
- PoolDues: simple hosted site/PayPal proposition versus own Stripe, modular
  pricing, and integrations;
- CourtReserve: deep court focus versus pool-first seasonal operations and
  flat-priced communications/branding.

Do not strengthen “not advertised” into “does not support.” Retain `null` for
unknown/not advertised cells.

**Verify**: TypeScript enforces one complete config per route, and all existing
FAQ questions/comparison rows can be accounted for during review.

### Step 2: Build one conversion-led alternative template

Create `AlternativePage.astro` with this order:

1. compact atmospheric hero with exact alternative intent in H1;
2. Live demo primary CTA and `Start a 45-day free trial` secondary CTA;
3. short migration/no-card reassurance;
4. “Why clubs switch” outcome cards;
5. responsive head-to-head comparison;
6. an honest-fit section that explains where the competitor remains strong;
7. selected Memberley product visual and extras, not a generic icon wall;
8. FAQ and preserved FAQPage structured data;
9. final demo/trial conversion band.

Use the shared narrow canvas and palette tokens from plan 001. Each page may use
one accent/gradient variation derived from the semantic palette, but the markup
and CTA hierarchy remain consistent.

Use one relevant exact product visual from plan 002 per page:

- Member Splash: roster or front desk;
- PoolDues: payments/integrations or membership;
- CourtReserve: reservations/facilities.

Avoid turning competitor logos grayscale merely to diminish them. Comparison
content should feel confident and fair.

**Verify**: all three route pages can be reduced to config selection plus the
shared template, with no duplicated full-section markup.

### Step 3: Make comparison data usable on mobile

At widths below the table's readable minimum, do not rely solely on a horizontally
scrollable desktop matrix. Use one of these accessible patterns:

- sticky first column plus clearly announced horizontal overflow; or
- stacked feature rows that repeat the Memberley/competitor labels.

Choose one shared pattern and test it with long cells such as the starting-price
and payment descriptions. Preserve real `<table>` semantics on desktop. Boolean
icons need text alternatives; `null` must be labelled “Not advertised” rather
than visually represented by an unexplained dash.

**Verify**: at 390px, every row can be understood without clipping and keyboard
focus remains visible on any links.

### Step 4: Wire routes, metadata, analytics, and schema

Each route file should import its typed config and pass it to the template. Keep
the existing canonical paths and page-specific titles/descriptions. Continue
emitting FAQPage JSON-LD from the same FAQ data that appears visually; there must
be no schema-only answer or stale duplicate.

Add stable analytics properties to all major CTAs:

- page type `alternative`;
- competitor slug;
- action (`demo`, `trial`, `compare`, `contact`);
- location (`hero`, `table`, `footer`).

Reuse the delegated analytics behavior from plan 003; do not add page-specific
analytics scripts.

Update every visible 14-day reference to 45-day/no-card language only after the
deployed trial prerequisite is re-confirmed.

**Verify**:

- `npm run build` generates all three unchanged canonical routes.
- Each built file has exactly one H1, canonical tag, description, and FAQPage
  block.
- `rg -n '14-day|14 day' src/pages/alternatives` returns no matches.

### Step 5: Perform claim-by-claim release review

Before release, review each price, fee, integration, platform, app, contract,
and feature claim against the competitor's current primary site/documentation.
Record the review date and URLs in the typed config comments or PR notes. When a
claim cannot be verified:

- qualify it as “not advertised” if that is accurate;
- remove it if it no longer helps;
- never infer absence from a missing marketing-page mention.

Do not let visual redesign hide this gate. A claim that was correct in July 2026
may still be stale in a later execution.

**Verify**: every comparative string has a current primary-source review note;
no unverifiable absolute claim remains.

## Test plan

- Typecheck all typed config variants.
- Build the three routes and assert their canonical paths.
- Verify each page has one H1 and one FAQ JSON-LD block.
- Verify CTA hrefs point to exact demo/register URLs and carry competitor/action
  analytics properties.
- Test comparison usability at 390, 768, and 1280 widths.
- Test the shared Header Compare dropdown from each alternative route; homepage
  anchors such as Features/Pricing must include the leading `/` and still work.
- Check no page renders content belonging to another competitor.

## Done criteria

- [ ] All three alternatives use one shared template and typed data.
- [ ] Member Splash, PoolDues, and CourtReserve each retain distinct, nuanced
  positioning.
- [ ] Live demo is primary and 45-day trial is secondary in hero/final CTA.
- [ ] Desktop comparison semantics and mobile comprehension are both preserved.
- [ ] Competitor logos remain clear and proportionate.
- [ ] FAQ visible copy and JSON-LD derive from the same data.
- [ ] All comparative claims have been re-verified against current primary
  sources immediately before release.
- [ ] No `14-day`/`14 day` text remains.
- [ ] `npm run check` and `npm run build` pass.
- [ ] Exactly three `dist/alternatives/*/index.html` files exist.

## STOP conditions

Stop and report if:

- A competitive price/feature claim cannot be verified from a primary source.
- The new design would remove or materially change a legal/comparative qualifier.
- A route slug or canonical URL must change; SEO redirects require a separate
  decision.
- Plan 001's Header/config contract or plan 002's asset manifest is unavailable.
- The shared template requires substantial per-page conditional markup; revisit
  the data model rather than cloning the page again.

## Maintenance notes

Competitive pages age faster than the rest of the site. Keep source-review date
and URLs close to the data, schedule quarterly verification once paid campaigns
start, and treat “not advertised” as intentionally different from “unsupported.”
Future alternative pages should be one config entry plus a route wrapper, not a
copied 500-line page.
