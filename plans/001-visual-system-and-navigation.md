# Plan 001: Establish the visual system and conversion-led shared navigation

> **Executor instructions**: Read this plan fully before editing. Follow each
> step in order and run every verification command. Preserve all user-owned
> uncommitted changes. If a STOP condition occurs, report it instead of
> improvising. When complete, update this plan's status in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat be3022a..HEAD -- package.json package-lock.json src/styles/global.css src/layouts/Layout.astro src/components/SiteHeader.astro src/components/SiteFooter.astro src/pages/alternatives/member-splash.astro src/pages/alternatives/pooldues.astro`
> and then
> `git diff --stat -- package.json package-lock.json src/styles/global.css src/layouts/Layout.astro src/components/SiteHeader.astro src/components/SiteFooter.astro src/pages/alternatives/member-splash.astro src/pages/alternatives/pooldues.astro`.
> Compare live code with the current state below before proceeding.

## Status

- **Priority**: P1
- **Effort**: M (roughly 1–2 focused days)
- **Risk**: MED — every public route consumes the shared shell
- **Depends on**: none
- **Category**: direction / tech debt / tests
- **Planned at**: commit `be3022a`, 2026-08-15

## Why this matters

The current site has a competent but generic wide paper-theme treatment and a
header that hides the real alternative pages behind a homepage Compare anchor.
Live demo is in the center navigation even though it is the primary conversion
path. Color and spacing are encoded directly as `stone-*` and `brand-*` classes,
which makes comparing coherent design directions expensive. This plan creates a
narrower, swappable visual foundation and a single accessible navigation model
before page-level redesign begins.

## Current state

- `src/components/SiteHeader.astro:17-23` defines flat links for Features, Live
  demo, Compare, Pricing, and Help. There is no alternatives dropdown.
- `src/components/SiteHeader.astro:75-89` renders Sign in plus Start free trial
  on the right. `applyAuthenticatedNav()` at lines 180-191 removes Sign in and
  turns the trial CTA into Dashboard.
- `src/components/SiteFooter.astro:8-35` already exposes all three alternative
  pages and is the source of truth for their URLs.
- `src/styles/global.css:9-50` couples components to a terracotta `brand-*`
  scale and stone neutrals. The aesthetic utilities at lines 68-126 are useful
  but cannot switch palette as a unit.
- `src/layouts/Layout.astro:84-89` loads Besley, Geist, and Spline Sans Mono.
  Keep the ampersand identity; typography may be tuned, but do not add more than
  two font families plus an optional mono accent.
- `src/pages/alternatives/member-splash.astro:409-411` and
  `src/pages/alternatives/pooldues.astro:406-408` read an optional `badge` field
  from inferred objects whose type lacks it. `npx astro check` currently reports
  four errors while `npm run build` passes.
- The repository uses Astro 5, Tailwind CSS 4, TypeScript, static output, and
  small dependency-free inline scripts. Match that architecture.

Current header shape (`src/components/SiteHeader.astro:17-23`):

```ts
const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#demo", label: "Live demo", highlight: true },
  { href: "/#compare", label: "Compare" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/help", label: "Help" },
];
```

Current authenticated behavior (`src/components/SiteHeader.astro:180-191`)
removes Sign in and rewrites the only CTA to Dashboard:

```js
if (signin) signin.remove();
if (cta) {
  cta.textContent = "Dashboard";
  cta.setAttribute("href", appUrl + "/dashboard");
}
```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm ci` | exit 0 |
| Typecheck | `npm run check` | exit 0, zero diagnostics |
| Build | `npm run build` | exit 0, seven pages generated |
| Inspect changes | `git status --short` | only in-scope files plus `plans/README.md` |

## Suggested executor toolkit

- Use the local `tailwindcss-development` skill if available when defining
  Tailwind v4 semantic tokens and responsive navigation classes.
- Use the local `apple-design` or `emil-design-eng` skill if available to review
  hover timing, focus behavior, reduced motion, and header polish.
- Do not add a runtime UI or animation package for this plan.

## Scope

**In scope**:

- `package.json`
- `package-lock.json` only if an existing script update changes it (normally it
  should not)
- `src/styles/global.css`
- `src/layouts/Layout.astro`
- `src/components/SiteHeader.astro`
- `src/components/SiteFooter.astro`
- `src/config/site.ts` (create)
- `src/pages/alternatives/member-splash.astro` (typecheck baseline only)
- `src/pages/alternatives/pooldues.astro` (typecheck baseline only)

**Out of scope**:

- Page-section redesign, homepage copy, pricing structure, and product images;
  those belong to plans 002–005.
- Legal copy, competitor claims, `memberley-app`, and `memberley-docs`.
- New runtime dependencies.

## Git workflow

- Suggested branch: `codex/marketing-refresh-foundation`
- Commit subjects follow the repository's bracketed convention, for example
  `[update] establish marketing design system and navigation`.
- Do not commit, push, or merge merely because this plan exists; do so only when
  this plan is explicitly executed under the repository's active git workflow.

## Steps

### Step 1: Restore a green verification baseline

1. Add `"check": "astro check"` to `package.json` scripts.
2. Define and apply a `BuiltInExtra` shape with `title`, `desc`, `icon`, and
   optional `badge` in the two failing alternative pages. Do not change their
   rendered content. Plan 004 may later replace these local shapes with shared
   data types.
3. Run typecheck before making visual changes so later failures can be attributed
   to the refresh.

**Verify**: `npm run check` → zero errors, warnings, or hints.

### Step 2: Centralize stable site URLs and navigation data

Create `src/config/site.ts` containing:

- `APP_URL`, `SIGNUP_URL`, `LOGIN_URL`, `DEMO_URL`, `DOCS_URL`, and the contact
  email, preserving the current `PUBLIC_MEMBERLEY_APP_URL` development fallback;
- three typed alternatives with exact routes:
  `/alternatives/member-splash`, `/alternatives/pooldues`, and
  `/alternatives/courtreserve`;
- concise dropdown labels and one factual descriptor per alternative. Use only
  claims already present on those pages; do not add prices to the nav.

Update Header and Footer to consume this config. Do not yet migrate page-local
constants; plans 003–005 will do that as they touch each page.

**Verify**: `rg -n 'alternatives/(member-splash|pooldues|courtreserve)' src/components src/config`
→ each route is defined once in config and consumed by Header/Footer.

### Step 3: Replace brand-specific component colors with semantic tokens

In `global.css`, keep the existing terracotta values as the default `ember`
palette but introduce runtime semantic variables for at least:

- canvas, elevated canvas, ink, muted ink, hairline border;
- accent, accent-hover, accent-ink, accent-soft;
- hero gradient stops/glow;
- dark-section canvas/ink;
- small/medium/large radii, content widths, shadows;
- fast/normal/slow motion durations and one strong ease-out curve.

Expose the semantic colors through Tailwind v4 `@theme inline` aliases so page
classes can use names such as `bg-canvas`, `text-ink`, `text-muted`,
`border-hairline`, and `bg-accent` rather than hardcoded palette shades.

Add two coherent review alternatives in addition to `ember`:

- `poolside`: cool pool blue/teal with warm neutral supporting colors;
- `prism`: restrained sky/lilac/coral stops inspired by Stripe, not a direct
  reproduction.

Set `<html data-palette="ember">` by default in `Layout.astro`. Add a tiny early
inline script that accepts only `?palette=ember|poolside|prism` and updates the
attribute before body paint. Do not persist the query choice or collect it in
analytics. This mechanism is for review and future testing; components must not
branch by palette.

Preserve the existing ampersand logo. Choose one display face and one body face;
if Besley is retained, use it more selectively. Do not introduce a third remote
font request.

**Verify**:

- `rg -n 'data-palette|poolside|prism' src/layouts src/styles` → all three
  palettes and the whitelist are present.
- `npm run check` → exit 0.

### Step 4: Rebuild the shared header around conversion intent

Desktop information architecture:

- left: Memberley logo/wordmark;
- center: Features, Pricing, Compare (dropdown trigger), Help;
- right utility cluster: Sign in/Dashboard, Live demo, and a prominent
  `45-day free trial` CTA for signed-out visitors.

The Compare dropdown must:

- open on pointer hover and on keyboard focus/click;
- contain three distinct hover cards for Member Splash, PoolDues, and
  CourtReserve, each with title, one-line descriptor, and arrow affordance;
- use a restrained fade/translate/scale transition (roughly 140–180ms) with a
  forgiving pointer bridge so it does not collapse while moving into the card;
- update `aria-expanded`, reference the popup via `aria-controls`, close on
  Escape and outside click, and never trap focus;
- remain fully usable when `prefers-reduced-motion: reduce` is active.

Mobile behavior:

- retain one menu button;
- show Compare as a disclosure group with the same three links, not a hover
  surface;
- keep Demo and 45-day trial visible as the strongest actions;
- prevent background page scroll only while the menu is open, restoring it on
  close and viewport change.

Authenticated probe behavior:

- preserve the existing `/marketing/session.js` probe;
- change the account link's label/href from Sign in to Dashboard when
  authenticated;
- hide the trial CTA for authenticated users instead of converting that CTA
  into Dashboard;
- never remove or rewrite the Live demo action.

Keep the header compact and translucent. Use a narrow main container (target
roughly 68–72rem rather than 80rem) and only add elevation after scrolling.

**Verify**:

- `npm run check` → exit 0.
- `npm run build` → all seven routes generated.
- Static assertions:
  `rg -n 'Member Splash|PoolDues|CourtReserve|45-day free trial|Live demo' dist/index.html`
  → all labels are present in built HTML.

### Step 5: Align the shared footer without redesigning page bodies

Update the footer to use the new container/tokens and the centralized link
config. Keep Product, Compare, and Company groupings, but make Live demo and
45-day free trial visually easier to find. Preserve all legal and docs links.
Do not add fictional company or support claims.

**Verify**: `npm run build` → exit 0 and Footer links appear on homepage, Help,
and all three alternatives.

## Test plan

This plan establishes build/typecheck coverage only. Browser interaction tests
are added after the page architecture stabilizes in plan 005.

- Typecheck the optional badge regression.
- Build all seven pages.
- Inspect built HTML for the three alternative URLs and both conversion actions.
- Manually keyboard-smoke the Compare popup only as an interim check; plan 005
  makes this programmatic.

## Done criteria

- [ ] `npm run check` exits 0 with zero diagnostics.
- [ ] `npm run build` exits 0 and reports seven pages.
- [ ] `?palette=ember`, `?palette=poolside`, and `?palette=prism` swap only
  semantic tokens without changing markup.
- [ ] Desktop Compare exposes all three alternative pages on hover and focus.
- [ ] Mobile Compare exposes all three pages without hover.
- [ ] Escape and outside click close the desktop dropdown.
- [ ] Reduced-motion users do not receive transform-based popup animation.
- [ ] Sign in becomes Dashboard when the session probe authenticates; Live demo
  remains, and the signed-out trial CTA does not become a duplicate Dashboard.
- [ ] No new runtime dependency was added.
- [ ] `git status --short` shows only in-scope work and the plan status update.

## STOP conditions

Stop and report if:

- `PUBLIC_MEMBERLEY_APP_URL` or the session probe contract has changed from the
  current implementation.
- A usable hover/focus popup appears to require a new component library; do not
  add one without approval.
- Fixing the four baseline type errors requires changing visible competitor
  content.
- Any route disappears from the static build.
- Existing uncommitted user work appears in an in-scope file and cannot be
  preserved cleanly.

## Maintenance notes

Future palette experiments should add or tune only semantic token sets. Do not
reintroduce page-level brand shade decisions. When new competitor pages are
added, update the typed alternatives config once; Header and Footer should pick
them up automatically. Review dropdown timing on both mouse and trackpad—hover
menus fail more often from pointer gaps than from insufficient animation.
