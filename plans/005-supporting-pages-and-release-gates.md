# Plan 005: Align supporting pages, analytics, accessibility, and release checks

> **Executor instructions**: This is the integration and release plan. Do not
> rewrite legal substance or bypass the testimonial/competitor gates to make a
> build pass. Run every verification command and update the status row in
> `plans/README.md` when complete.
>
> **Drift check (run first)**:
> `git diff --stat be3022a..HEAD -- package.json package-lock.json playwright.config.ts tests src/pages/help.astro src/pages/privacy.astro src/pages/terms.astro src/layouts/Layout.astro src/components public/sitemap.xml public/robots.txt`
> and
> `git diff --stat -- package.json package-lock.json playwright.config.ts tests src/pages/help.astro src/pages/privacy.astro src/pages/terms.astro src/layouts/Layout.astro src/components public/sitemap.xml public/robots.txt`.
> Plans 001–004 must already be merged.

## Status

- **Priority**: P2
- **Effort**: M (roughly 1–2 days)
- **Risk**: MED — shared analytics, legal-shell integration, and release gates
- **Depends on**: plans 003 and 004
- **Category**: tests / dx / direction
- **Planned at**: commit `be3022a`, 2026-08-15

## Why this matters

A homepage refresh is incomplete if Help and legal pages drop visitors into a
different visual system, or if the new hover menu cannot be verified on mobile
and keyboard. The repository currently has a successful static build but no
browser test command, and Astro typecheck starts red. This plan gives all seven
routes a coherent shell, makes the 45-day offer consistent, verifies conversion
events, and prevents placeholders or stale competitor copy from slipping through
release review.

## Current state

- `src/pages/help.astro` uses the shared Header/Footer but the old 80rem layout
  and contains a 14-day trial answer at line 38.
- `src/pages/privacy.astro:107-241` and `src/pages/terms.astro:104-238` each
  duplicate a simplified local header/footer instead of using the shared shell.
  Their legal body copy and last-updated dates must not change in a design pass.
- `public/sitemap.xml` already lists all seven public routes. `public/robots.txt`
  exists.
- `Layout.astro` owns PostHog, Meta Pixel, canonical metadata, and the PageView /
  register-click Lead behavior.
- The repo has `@astrojs/check` but no `check` script before plan 001, no test
  runner, and no browser smoke suite.
- `README.md` documents development/build but not typecheck or tests.

The stale Help claim (`src/pages/help.astro:37-39`) is currently embedded in FAQ
data and therefore also flows into JSON-LD:

```ts
{
  q: "How long does setup take?",
  a: "... Every plan starts with a 14-day free trial — no card required.",
}
```

Privacy and Terms each duplicate a local `<header>` and `<footer>` instead of
importing `SiteHeader`/`SiteFooter`; replacing that wrapper must not alter their
`sections` arrays.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm ci` | exit 0 |
| Typecheck | `npm run check` | exit 0, zero diagnostics |
| Build | `npm run build` | exit 0, seven pages |
| Browser tests | `npm run test:e2e` | all tests pass |
| Full gate | `npm run verify` | check, build, and browser tests all pass |
| Trial-copy audit | `rg -n '14-day|14 day' src` | no matches |
| Placeholder audit | `rg -n 'PLACEHOLDER TESTIMONIAL|placeholder-testimonial' dist` | no matches |

## Suggested executor toolkit

- Use the browser-control skill for visual/interactive QA after automated tests.
- Use `tailwindcss-development` for supporting-page layout changes.
- Use `critique` or `polish` only for a final visual pass after the test gates
  are green; do not let it broaden scope.

## Scope

**In scope**:

- `src/pages/help.astro`
- `src/pages/privacy.astro`
- `src/pages/terms.astro`
- `src/layouts/Layout.astro`
- shared components introduced by plans 001–004
- `package.json`, `package-lock.json`
- `playwright.config.ts` (create)
- `tests/marketing-site.spec.ts` (create)
- `README.md` (update commands only)
- `public/sitemap.xml`, `public/robots.txt` for verification/corrections only

**Out of scope**:

- Legal wording or legal dates, except replacing an offer duration outside the
  legal body if one exists.
- Docs-site pages, app code, Stripe configuration, or publishing ad campaigns.
- Adding cookie-consent behavior or changing analytics vendors; those require a
  separate privacy/product decision.
- Inventing conversion targets before baseline data is available.

## Git workflow

- Suggested branch: `codex/marketing-refresh-release`
- Commit example: `[add] verify refreshed marketing experience`
- Keep automated-test additions and supporting-page visual changes in separate
  commits if possible for easier review.

## Steps

### Step 1: Refresh Help without turning it into documentation

Apply the shared narrow canvas, semantic tokens, typography, and conversion CTA
hierarchy to `help.astro`. Keep it a sales/pre-purchase FAQ, and keep the existing
link to `docs.memberley.com` for product documentation.

Maintain FAQ groups and FAQPage structured data. Update the setup answer and CTA
copy from 14 days to the verified 45-day/no-card offer. Make Live demo primary in
the final CTA and trial secondary; contact remains available for boards that need
a person.

Use disclosure/accordion behavior only if it improves mobile scanability and is
fully keyboard accessible. Native `<details>/<summary>` is preferred over a new
dependency.

**Verify**:

- Visible FAQ count equals JSON-LD question count.
- `rg -n '14-day|14 day' src/pages/help.astro` returns no matches.
- `npm run check` exits 0.

### Step 2: Bring Privacy and Terms into the shared shell

Replace each duplicated local header/footer with the shared Header/Footer from
plan 001. Keep the pages visually quieter than sales pages:

- narrow readable legal column;
- optional sticky contents on large screens;
- visible last-updated date;
- semantic heading hierarchy and anchor focus/scroll offsets;
- no hero product imagery, testimonials, or aggressive conversion band.

Do not alter any legal sentence, section order, section number, contact address,
or last-updated value. A formatting-only diff should make the legal text
byte-for-byte recognizable.

**Verify**:

- Compare extracted paragraph text before/after (ignore whitespace/markup) and
  confirm it is identical.
- Both pages render the shared Compare dropdown and Footer legal links.
- Each page contains exactly one H1 and sequential H2 section structure.

### Step 3: Harden delegated analytics without changing vendors

Review the delegated CTA capture introduced in plan 003 across every route.
Requirements:

- PostHog events do nothing safely when PostHog is unavailable or blocked.
- One user click emits no more than one custom event.
- All demo/trial links include page path and stable location.
- Alternative-page events include competitor slug.
- Header account, docs, privacy, and terms navigation is not misclassified as a
  conversion.
- Existing Meta PageView and one-time register-click Lead remain intact.

Add no session data, emails, names, or screenshot content to analytics props.

Use PostHog to define the post-launch funnel operationally (do not hardcode a
target in the site): homepage view → demo click or trial click, segmented by
mobile/desktop and paid campaign. Record a baseline before launch and compare the
same-length period after launch when traffic volume permits.

**Verify**: browser tests stub `posthog.capture` and `fbq`, click each CTA class,
and assert exact event counts/names without network calls.

### Step 4: Add browser-level regression coverage

Add `@playwright/test` as a development dependency, not a runtime dependency.
Configure Playwright's `webServer` to run `npm run preview -- --host 127.0.0.1`
against a production build. Add scripts with this exact responsibility split:

- `test:e2e`: run `npm run build && playwright test`, so it is valid on its own;
- `verify`: run `npm run check && npm run test:e2e`, which covers typecheck,
  production build, and browser tests without a redundant explicit build.

The suite in `tests/marketing-site.spec.ts` must cover:

1. all seven routes return successfully and have one visible H1;
2. desktop Compare opens by hover and keyboard, links all three alternatives,
   closes on Escape, and does not close while moving into the popup;
3. mobile menu opens, exposes the three alternatives, Demo, and 45-day trial,
   then restores page scrolling when closed;
4. no route has horizontal overflow at 390×844, 768×1024, and 1280×720;
5. homepage hero exposes demo and 45-day trial in the first viewport;
6. all internal links used in Header/Footer resolve without 404;
7. production build contains no placeholder testimonial warning/copy;
8. CTA analytics stubs receive exactly one appropriate event;
9. reduced-motion emulation leaves all content visible and popup behavior usable;
10. FAQ visual and JSON-LD counts agree on Help and all alternatives.

Avoid pixel snapshots for the initial suite; they are brittle during palette
review. Use semantic roles, accessible names, dimensions, URLs, and visibility.

**Verify**: `npm run test:e2e` → all tests pass in Chromium.

### Step 5: Enforce content, SEO, and performance release gates

Before release:

- verify all seven canonical URLs and sitemap entries match;
- confirm `robots.txt` permits indexing of public pages;
- confirm title/description/OG image exists per route (shared default is allowed
  for Help/legal; alternatives should remain specific);
- run the 14-day and placeholder audits;
- confirm plan 004's competitor source-review date is current;
- confirm production registration actually grants 45 days;
- inspect image transfer size: hero and critical CSS/JS should stay within plan
  002's budgets; no animation dependency should appear in the bundle;
- audit keyboard focus, contrast for all three palettes, and reduced motion;
- check mobile Safari/Chrome and desktop Safari/Chrome manually after the
  Chromium suite passes.

Do not choose a palette solely on taste. Capture the same homepage view for
`ember`, `poolside`, and `prism`, review headline/CTA contrast and product-image
fit, then set one default in `Layout.astro`. Keep the alternatives available for
future experiments.

**Verify**:

- `npm run verify` exits 0.
- `find dist -name index.html | wc -l` returns `7`.
- `rg -n '14-day|14 day|PLACEHOLDER TESTIMONIAL|placeholder-testimonial' dist`
  returns no matches.

### Step 6: Update contributor commands and conduct a clean build

Update `README.md` with `npm run check`, `npm run test:e2e`, and
`npm run verify`, including the one-time Playwright browser installation command.
Do not add design rationale documentation; the implementation and these plans
are sufficient.

From a clean dependency install, run the full verification gate. Review
`git status --short` to ensure generated `dist/`, `.astro/`, reports, and test
artifacts remain ignored.

**Verify**: `npm ci && npm run verify` → exit 0 from a clean checkout/environment.

## Test plan

The automated suite is part of this plan and is a release requirement. It covers
route health, H1/metadata, dropdown/mobile navigation behavior, CTA visibility,
overflow, analytics calls, reduced motion, and structured-data parity.

Manual checks remain necessary only for visual quality, cross-browser font
rendering, palette choice, and the laptop composite. Record those observations in
the PR description rather than adding brittle screenshot snapshots.

## Done criteria

- [ ] Help, Privacy, and Terms use the refreshed shared shell.
- [ ] Privacy/Terms legal substance and dates are unchanged.
- [ ] No 14-day claim remains anywhere under `src/` or `dist/`.
- [ ] No placeholder testimonial content exists in production output.
- [ ] All three competitor configs have current source-review notes.
- [ ] Demo/trial analytics fire once with no personal data.
- [ ] Meta PageView and Lead behavior still works.
- [ ] `npm run check`, `npm run build`, `npm run test:e2e`, and
  `npm run verify` all pass.
- [ ] Exactly seven static routes are built and listed appropriately in sitemap.
- [ ] Mobile, keyboard, reduced-motion, and no-horizontal-overflow browser tests
  pass.
- [ ] One palette is deliberately chosen as default; the other two remain easy
  to preview.

## STOP conditions

Stop and report if:

- Legal paragraph text or effective dates appear to require substantive edits.
- The deployed signup flow cannot verify a 45-day trial.
- Competitor claims cannot pass current primary-source review.
- Browser tests require a runtime dependency or a change to hosting architecture.
- Placeholder quote text appears anywhere in `dist/`.
- Any analytics event would include personal data or duplicate Meta Lead.
- Static route count differs from seven without an explicitly approved route
  change.

## Maintenance notes

Run `npm run verify` before every marketing deploy. Once real testimonials are
approved, add them through the typed testimonial data and extend the browser test
to assert verified production copy rather than weakening the guard. Once
competitor-specific ads begin, add campaign naming and conversion analysis in the
analytics tool—not hardcoded marketing-site logic—and re-verify competitor pages
quarterly.
