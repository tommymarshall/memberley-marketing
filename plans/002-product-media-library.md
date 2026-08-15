# Plan 002: Produce a reusable, truthful product-media library

> **Executor instructions**: Follow this plan step by step. Product screenshots
> must remain exact representations of Memberley; generative tools may create a
> device or environment plate but may never redraw the application UI. Run every
> verification command. Update the status row in `plans/README.md` when done.
>
> **Drift check (run first)**:
> `git diff --stat be3022a..HEAD -- public src/components src/pages/index.astro`
> and `git diff --stat -- public src/components src/pages/index.astro`. The
> uncommitted Household pricing edit in `src/pages/index.astro` is user-owned;
> this plan must not touch that page.

## Status

- **Priority**: P1
- **Effort**: M (asset production and responsive QA, roughly 1–2 days)
- **Risk**: LOW to code, MED to visual quality and page weight
- **Depends on**: plan 001
- **Category**: direction / performance
- **Planned at**: commit `be3022a`, 2026-08-15

## Why this matters

The homepage currently shows one wide, flat roster screenshot
(`public/app-roster.*`) at a size where the interface is difficult to read. The
product is populated and capable, but the presentation makes it feel empty and
generic. A small, reusable media library will give the hero one memorable,
photographic moment while letting lower sections show real workflows at readable
scale.

## Current state

- `public/app-roster.png` and `.webp` are 2880×1800 captures used only in the
  homepage hero.
- `memberley-docs/src/assets/screenshots/` contains current, seeded screenshots
  for dashboard, roster, payments, reservations, front desk, communications,
  programs, reports, settings, waivers, and documents. The docs repository is a
  read-only source; it is not part of this redesign.
- The app's screenshot automation lives in
  `memberley-app/scripts/docs-screenshots/`. Do not modify or run it against
  production data without explicit authorization.
- The visual reference supplied by the product owner uses a warm, faded color
  field, large editorial copy, and a generic aluminum laptop on a stone plinth.
  Recreate the composition principle, not its exact artwork.
- Astro static pages can serve `<picture>` sources directly. No client-side
  image library is needed.

Current homepage rendering (`src/pages/index.astro:724-735`):

```astro
<picture class="block w-full">
  <source srcset="/app-roster.webp" type="image/webp" />
  <img
    src="/app-roster.png"
    width="1440"
    height="900"
    class="w-full rounded-lg bg-white shadow-paper ring-1 ring-stone-950/5"
  />
</picture>
```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run check` | exit 0 |
| Build | `npm run build` | exit 0 |
| List media sizes | `find public/product -type f -maxdepth 1 -exec du -h {} +` | all expected files listed |
| Verify dimensions | `sips -g pixelWidth -g pixelHeight public/product/*` | non-zero dimensions; hero aspect ratios match plan |

## Suggested executor toolkit

- If the `imagegen` skill is available, use it only to create an unbranded,
  blank-screen laptop/environment plate. Composite the exact app capture onto
  the screen afterward with an image editor.
- Use ImageMagick, Sharp, or an equivalent offline raster workflow for
  perspective compositing and WebP/AVIF export. Do not add it as a runtime site
  dependency unless it is deliberately adopted as a repeatable build script.
- Use browser inspection to verify legibility at desktop and mobile sizes.

## Scope

**In scope**:

- `public/product/` (create optimized product media)
- `public/og-image.png` (refresh after the hero direction is approved)
- `src/components/ProductVisual.astro` (create)
- `src/data/product-visuals.ts` (create)
- Optional repeatable asset script under `scripts/` only if the exact workflow
  can be deterministic and documented in code comments

**Read-only source material**:

- `/Users/tommymarshall/Sites/memberley-docs/src/assets/screenshots/`
- `/Users/tommymarshall/Sites/memberley-app/scripts/docs-screenshots/`

**Out of scope**:

- Any edit to `memberley-docs` or `memberley-app`.
- Homepage or landing-page markup; plans 003 and 004 consume these assets.
- Fake UI, invented member data, Apple logos, or unlicensed device photography.
- A video production pipeline.

## Git workflow

- Suggested branch: `codex/marketing-refresh-media`
- Commit example: `[add] create marketing product media library`
- Review binary assets visually before any commit. Do not push unless the active
  workflow explicitly asks for it.

## Steps

### Step 1: Select six truthful product stories

Use only seeded demo content and select a final inventory with these roles:

1. **Hero / member operations** — roster with populated people, tiers, statuses,
   filters, and navigation.
2. **Front desk** — check-in or register surface that reads well at a glance.
3. **Reservations** — calendar/requests view showing pool lanes or courts.
4. **Money** — payments, payouts, or revenue report with meaningful rows/chart.
5. **Programs** — offerings or class detail with sessions/roster.
6. **Communications** — campaign list/report or segment builder.

Prefer the existing docs captures when current. If any capture contains stale
copy, broken layout, blank states, real personal data, secrets, or a UI that no
longer exists, STOP and request a fresh seeded-demo capture rather than editing
the screenshot into a false state.

Record the source path and capture date in code comments in
`src/data/product-visuals.ts`, not in visible page copy.

**Verify**: all six source files open successfully and show seeded/non-sensitive
data.

### Step 2: Build one cinematic hero composite

Create a wide desktop hero image using:

- an unbranded aluminum laptop (no Apple logo) at a slight three-quarter angle;
- the exact roster screenshot perspective-mapped into the display;
- a simple stone/plaster plinth or tabletop;
- large negative space and an edge-faded warm/gradient atmosphere compatible
  with all three palette directions;
- soft natural shadow, no floating glass cards, no illegible decorative UI.

Generate the blank scene or use commercially licensed source photography. Keep
proof of source/license outside the public bundle if external stock is used.
Never ask an image model to render the Memberley screen—generated text and rows
would be false product evidence.

Export:

- `public/product/hero-laptop.avif`
- `public/product/hero-laptop.webp`
- a PNG master only if required for future editing; do not ship a multi-megabyte
  master in the public folder unless necessary.

Target a display aspect ratio near 16:10 or a composition that crops safely to
4:3 on tablets. Keep the primary WebP under roughly 500 KB and AVIF under roughly
350 KB without visible UI smearing. UI text does not have to be readable in this
cinematic image; authenticity and product silhouette do.

**Verify**: inspect both formats at 1× and 2× display sizes; laptop edges are
clean, the screen has correct perspective, and no generated artifacts appear in
the UI.

### Step 3: Produce readable browser and focused-crop assets

For the remaining five stories:

- keep exact application pixels;
- use a minimal browser/window frame or crop—no repeated laptop shell;
- crop around the task while retaining enough navigation/context to show it is
  one product;
- export AVIF and WebP, with a PNG fallback only where sharp text needs it;
- provide explicit width and height in `product-visuals.ts`;
- keep each optimized asset around or below 200–250 KB where possible.

Use predictable names such as `front-desk`, `reservations`, `payments`,
`programs`, and `communications`. Do not bake marketing labels into the images;
page components supply accessible text in HTML.

**Verify**: at a rendered width of roughly 560–720 CSS pixels, the focal UI is
legible and no crop hides the action being described.

### Step 4: Create a small media component and typed manifest

Create `src/data/product-visuals.ts` with a typed record containing source
variants, intrinsic dimensions, alt text, focal-position hints, and treatment
(`cinematic`, `browser`, or `crop`).

Create `src/components/ProductVisual.astro` that:

- renders `<picture>` with AVIF, WebP, and fallback sources;
- always emits `width`, `height`, and useful alt text (or empty alt only when a
  neighboring heading fully describes the same image);
- accepts `priority`; only the hero uses eager loading and high fetch priority;
- lazily loads lower images;
- supports a CSS-only browser-frame treatment and responsive crop positioning;
- uses semantic palette tokens and reduced-motion-safe decorative transforms.

Do not create separate components per screenshot.

**Verify**: `npm run check` and `npm run build` both exit 0 after rendering the
component on a temporary local scratch branch or once plan 003 consumes it. Do
not commit throwaway page markup.

### Step 5: Refresh social preview art

After the hero direction is approved, update `public/og-image.png` to use the
same visual language at exactly 1200×630. Keep text large and sparse, include the
Memberley mark, and avoid a tiny full-product screenshot. `Layout.astro` already
declares the expected dimensions.

**Verify**: `sips -g pixelWidth -g pixelHeight public/og-image.png` → 1200×630.

## Test plan

- Run Astro typecheck/build after manifest and component creation.
- Confirm every `<img>` emitted by `ProductVisual` has intrinsic dimensions.
- Confirm only the homepage hero uses eager/high-priority loading.
- Confirm missing manifest keys fail typecheck rather than rendering a broken
  path.
- Inspect at 390, 768, 1280, and 1440 CSS-pixel widths when pages consume the
  component in plans 003–004.

## Done criteria

- [ ] Six approved, truthful product stories exist in `public/product/`.
- [ ] The hero uses exact UI composited into an unbranded laptop scene.
- [ ] Lower assets favor legibility over device chrome.
- [ ] No source image contains real customer data or secrets.
- [ ] AVIF/WebP sources and intrinsic dimensions are declared in one manifest.
- [ ] Hero optimized files meet the approximate 500/350 KB WebP/AVIF budgets;
  lower visuals stay near 250 KB or document why not.
- [ ] `public/og-image.png` is 1200×630.
- [ ] `npm run check` and `npm run build` pass once the component is consumed.
- [ ] No files in `memberley-docs` or `memberley-app` changed.

## STOP conditions

Stop and report if:

- Only production/customer data is available for a needed screenshot.
- A source screenshot is stale and cannot be recaptured from seeded demo data.
- Device imagery has unclear commercial rights.
- Achieving acceptable text clarity requires shipping an unreasonably large
  image; request a tighter crop instead.
- The approved hero composition requires generative recreation of the Memberley
  interface.

## Maintenance notes

Treat `product-visuals.ts` as the source of truth when UI captures are replaced.
The app already has screenshot automation for docs, so future marketing updates
should start from those seeded captures rather than manual production-account
screenshots. Re-check image weight whenever a source is replaced; raster masters
can silently erase the refresh's performance gains.
