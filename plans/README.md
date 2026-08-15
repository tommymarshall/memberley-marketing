# Memberley marketing refresh plans

Generated with the `improve` skill on 2026-08-15 against commit `be3022a`.
These plans cover the complete `memberley-marketing` repository: the homepage,
shared header/footer, Help, Privacy, Terms, and all three alternative pages
(Member Splash, PoolDues, and CourtReserve). The separate `memberley-docs`
website and all `memberley-app` product code are out of scope.

The immediate business goal is to reduce paid-traffic bounce from the homepage.
The primary audience is neighborhood pools and swim-and-tennis clubs. The live
demo is the main conversion path; a verified 45-day, no-card free trial is the
strong secondary path. Broad ads continue to land on the homepage for now;
future competitor-intent ads should land directly on the matching alternative
page.

The visual direction combines:

- Stripe's clear navigation hierarchy, pale multi-stop gradients, and restrained
  motion;
- Native's atmospheric, edge-faded hero backdrop;
- Family's narrow content width and editorial simplicity;
- Memberley's existing ampersand mark and terracotta as the default identity,
  while exposing semantic palette tokens so alternate color directions can be
  reviewed without component rewrites.

## Execution order and status

| Plan | Title | Priority | Effort | Depends on | Status |
|---|---|---:|---:|---|---|
| 001 | Establish the visual system and conversion-led shared navigation | P1 | M | — | TODO |
| 002 | Produce a reusable, truthful product-media library | P1 | M | 001 | TODO |
| 003 | Rebuild the homepage around demo and 45-day-trial conversion | P1 | L | 001, 002 | TODO |
| 004 | Turn all three alternative pages into targeted landing pages | P2 | L | 001, 002 | TODO |
| 005 | Align supporting pages, analytics, accessibility, and release checks | P2 | M | 003, 004 | TODO |

Status values: TODO | IN PROGRESS | DONE | BLOCKED (with a one-line reason) |
REJECTED (with a one-line rationale)

Plans 003 and 004 can be implemented in parallel after 001 and 002, but they
both consume the same shared design system and media inventory. Avoid editing
the same shared component from both branches; merge 001 and 002 first.

## Decisions already made

- Refresh every page in `memberley-marketing`; do not redesign
  `memberley-docs`.
- Include Member Splash, PoolDues, and CourtReserve in a Stripe-inspired
  desktop hover/focus menu and in the mobile navigation.
- Put Live demo in the top-right utility cluster beside Sign in/Dashboard.
- Lead with pool and swim-and-tennis clubs; mention HOAs and other community
  organizations as adjacent audiences, not as the hero's primary audience.
- Use a mix of one cinematic laptop hero and cleaner browser/device crops
  farther down the page.
- Shorten and rewrite the homepage rather than preserving its current dense
  feature inventory verbatim.
- Keep the logo and terracotta as the default, but make palettes swappable with
  semantic tokens and a review-only palette selector.
- Design a testimonial section with fictional placeholder content for layout
  review only. A production guard must prevent those placeholders from shipping.
- Stripe and `memberley-app` already contain the separate 45-day-trial changes.
  This repository may advertise 45 days only after that prerequisite is
  verified in the deployed signup flow.

## Known baseline and ownership constraints

- `npm run build` passes at `be3022a` and produces seven static pages.
- `npx astro check` currently fails with four `f.badge` type errors in
  `src/pages/alternatives/member-splash.astro` and
  `src/pages/alternatives/pooldues.astro`. Plan 001 establishes a green typecheck
  before the redesign proceeds.
- `src/pages/index.astro` has an uncommitted user change adding Household
  pricing to the feature inventory. It belongs to the user. Plan 003 must retain
  that product capability and must not overwrite the change blindly.
- Existing competitive claims are dated 2026 and carry comments requiring
  re-verification. These plans may reorganize the claims but must not invent new
  claims or silently strengthen existing ones.
- `memberley-docs/src/assets/screenshots/` may be read as an asset source, but no
  files in the docs repository may be modified.

## Not audited or changed by these plans

- The Laravel/Inertia product implementation, billing behavior, Stripe trial
  configuration, or demo seeding.
- The separate docs site's layout, content, or deployment.
- A fresh legal review of Privacy or Terms; their body copy is preserved.
- A fresh factual audit of competitor pricing/features. Re-verification is a
  release prerequisite in plan 005.

## Definition of the finished refresh

- Every public route uses the same header, footer, palette tokens, typography,
  spacing, focus styles, and motion rules.
- The desktop Compare menu works with hover and keyboard focus; the mobile menu
  exposes all three alternative pages without hover.
- The homepage communicates audience, outcome, demo, and 45-day-trial offer in
  the first viewport on common laptop and mobile sizes.
- Exact Memberley UI remains legible in all product imagery; generative tools
  never redraw or hallucinate interface content.
- Placeholder testimonials are visible only in local/design-review mode and are
  absent from production output.
- Demo clicks, trial clicks, and alternative-page visits are distinguishable in
  analytics without adding a new analytics vendor.
- Astro typecheck, static build, and browser smoke tests pass for all seven
  routes at desktop and mobile viewports.

## Findings considered and rejected

- **A total rebrand:** unnecessary. The existing ampersand and terracotta are
  recognizable assets; the problem is composition, hierarchy, density, and
  media treatment rather than the absence of a brand.
- **Put every screenshot in a laptop:** rejected because repeated device chrome
  makes the product smaller and harder to evaluate. One cinematic hero earns
  attention; subsequent crops should optimize legibility.
- **Publish fabricated testimonials temporarily:** rejected. Layout placeholders
  are allowed only behind an explicit production guard until real, approved
  quotes exist.
- **Add a large animation framework:** rejected. The site is static Astro and
  already uses small inline scripts; CSS transitions plus minimal vanilla JS
  are sufficient for the requested motion.
