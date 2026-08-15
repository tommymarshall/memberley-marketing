# Plan 003: Rebuild the homepage around demo and 45-day-trial conversion

> **Executor instructions**: This is a focused rewrite, not a reskin. Preserve
> accurate product/pricing facts and the user's in-progress Household pricing
> work, but remove repetition and long feature prose. Run every verification
> gate. Update the status row in `plans/README.md` when done.
>
> **Drift check (run first)**:
> `git diff --stat be3022a..HEAD -- src/pages/index.astro src/components src/data public/product public/og-image.png`
> and `git diff -- src/pages/index.astro`. At plan time, the uncommitted diff adds
> Household pricing as a primary and secondary feature. Preserve that capability
> in the new information architecture; do not discard or overwrite the diff.

## Status

- **Priority**: P1
- **Effort**: L (multi-day editorial, UI, and responsive work)
- **Risk**: MED — homepage is the current paid-ad destination
- **Depends on**: plans 001 and 002
- **Category**: direction / performance / tests
- **Planned at**: commit `be3022a`, 2026-08-15

## Why this matters

The live homepage's first viewport has a strong headline but presents a flat,
small product screenshot and then expands into roughly 1,600 lines of dense
feature, comparison, pricing, and module copy. That encourages scanning without
creating a memorable reason to continue. Broad paid ads currently land here, so
the page needs to identify pool/swim-and-tennis buyers immediately and drive two
measurable actions: enter the seeded demo or start the verified 45-day trial.

## Current state

- `src/pages/index.astro:647-738` renders a five/seven-column hero inside an
  80rem container with the roster screenshot in a flat rounded rectangle.
- The current H1, “Run your community like it runs itself,” is approved as a
  viable brand line. Keep it unless the product owner explicitly approves a
  replacement during implementation.
- `src/pages/index.astro:741-1454` includes platform positioning, seven long
  feature cards, dozens of secondary features, demo, comparison table, switch
  cards, use cases, plans, and add-ons. Much of the same value proposition is
  repeated in multiple formats.
- `src/pages/index.astro:632-637`, 1268, and 1448 still say 14-day trial. All
  visible trial-duration claims must become 45 days, but only after confirming
  the deployed signup/Stripe flow already matches (the product owner says it
  does).
- Pricing is fetched at build time from `${APP_URL}/api/v1/plans`, with safe
  fallback data at lines 174-195. Preserve this behavior and the Base→Community
  normalization.
- Layout contains PostHog and Meta Pixel. Meta `Lead` currently fires on register
  link clicks. Do not remove that event.
- There is no customer proof. The product owner requested fake quotes for layout
  review only and approved a guard that prevents them from shipping.

Approved headline and stale trial token (`src/pages/index.astro:675-679` and
632-637):

```astro
<h1>Run your community like it runs itself.</h1>
```

```ts
const signupPerks = [
  "14-day free trial, no card",
  "Setup in under 10 minutes",
  "Import members via CSV",
  "Cancel anytime",
];
```

Preserve the current pricing failure mode (`src/pages/index.astro:207-247`): it
fetches `/api/v1/plans`, maps non-empty API data, and otherwise leaves
`fallbackPlans` in place rather than rendering an empty grid.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run check` | exit 0 |
| Build | `npm run build` | exit 0, seven pages |
| Find stale trial copy | `rg -n '14-day|14 day' src` | no matches |
| Production placeholder check | `rg -n 'PLACEHOLDER TESTIMONIAL|placeholder-testimonial' dist` | no matches |
| Inspect scope | `git status --short` | only in-scope files plus plan status |

## Suggested executor toolkit

- Use `impeccable` in craft mode or the local `ui` skill if available for the
  section composition and responsive implementation.
- Use `tailwindcss-development` for Tailwind v4 component/layout work.
- Use `apple-design` or `emil-design-eng` for restrained motion and reduced
  motion behavior.
- Do not generate new raster imagery in this plan; consume plan 002's approved
  assets.

## Scope

**In scope**:

- `src/pages/index.astro`
- `src/components/HomeHero.astro` (create if it keeps the page readable)
- `src/components/ProductStory.astro` (create)
- `src/components/ConversionCta.astro` (create only if reused by alternatives)
- `src/components/Testimonials.astro` (create)
- `src/data/testimonials.ts` (create with guarded placeholder records)
- `src/layouts/Layout.astro` only for shared delegated analytics hooks that
  cannot live in the page
- `src/config/site.ts` if CTA metadata must be centralized

**Out of scope**:

- Alternative-page body redesign (plan 004), Help/legal pages (plan 005), app
  trial behavior, Stripe configuration, and docs-site changes.
- New customer claims, logos, adoption counts, or performance statistics.
- A new pricing model or modifications to the plans API.
- Replacing PostHog or Meta.

## Git workflow

- Suggested branch: `codex/marketing-refresh-homepage`
- Commit example: `[update] rebuild homepage around demo conversion`
- Preserve the pre-existing Household pricing diff through the rewrite. If it
  was committed after this plan was written, preserve the committed capability.

## Steps

### Step 1: Lock the conversion and copy hierarchy

Rewrite the page outline before styling. The final order should be:

1. **Hero** — pool/swim-and-tennis audience, approved brand line, concise value
   statement, Live demo primary CTA, `Start a 45-day free trial` secondary CTA,
   no-card/setup reassurance, cinematic laptop visual.
2. **Three outcomes** — Run membership, collect money, and operate the gate;
   short benefit statements rather than an exhaustive feature grid.
3. **Product story** — three alternating narrative blocks using five exact UI
   visuals: members/money, reservations/front desk, and programs/comms. Keep
   descriptions to roughly 45–70 words per block.
4. **Demo invitation** — make the seeded Lakeside club concrete and explain that
   no account is required. Offer admin and member paths only if both URLs are
   verified.
5. **Compare teaser** — three concise cards linked to Member Splash, PoolDues,
   and CourtReserve pages. Keep the honest “who the competitor is good for” tone;
   move the large comparison matrix off the homepage.
6. **Testimonials** — guarded placeholder layout in development; verified quotes
   later. In production with no verified quotes, replace the entire section with
   a truthful proof strip (own Stripe account, free migration, no-card 45-day
   trial) so spacing does not collapse awkwardly.
7. **Pricing summary** — preserve API-driven plans and modules, but reduce copy
   and make 45-day free trial/no card explicit. Detailed inclusions may use a
   disclosure rather than a wall of bullets.
8. **Final conversion** — Live demo primary, 45-day free trial secondary, contact
   as a quiet tertiary path.

Keep pool/swim-and-tennis language primary. Mention HOAs/private clubs once as
adjacent fit, not in every paragraph. Retain the Household pricing capability in
the product story or supporting feature list.

**Verify**: the source contains one H1 and exactly the intended top-level section
order. There is no orphan `#platform`, `#demo`, `#compare`, or `#pricing` anchor
referenced by Header/Footer.

### Step 2: Compose the atmospheric, narrow hero

Build a first viewport that combines the three reference principles without
copying any reference site:

- content canvas roughly 68–72rem, with headline copy constrained to a readable
  measure;
- a Native-like faded atmosphere made from semantic gradient tokens, masks, and
  subtle grain/noise only if it remains cheap and accessible;
- a Stripe-like light base with one expressive multi-stop gesture rather than
  many decorative cards;
- a Family-like simple center of gravity: one message, two actions, one visual;
- the cinematic laptop image from plan 002, allowed to extend beyond the narrow
  content grid on large screens but cropped safely on mobile.

Use `clamp()` typography that fits 320px-wide screens without forced line breaks.
At 390px, both CTAs must remain visible without horizontal scrolling. Do not use
auto-playing video, parallax tied to scroll position, or cursor-following effects.

Motion may include a soft one-time hero reveal and a very slow background drift,
but disable both for reduced motion and avoid delaying CTA interactivity.

**Verify**: at 390×844, 768×1024, 1280×720, and 1440×900, the H1, audience/value
copy, demo CTA, 45-day CTA, and a meaningful portion of the product visual appear
without horizontal overflow.

### Step 3: Replace feature inventory with outcome-led product stories

Use `ProductStory.astro` for the repeating story pattern. It should accept
eyebrow, heading, body, compact feature points, visual manifest key, side, and
optional CTA. Alternate layout direction on desktop; keep copy before imagery in
DOM order on mobile.

Map current product facts as follows:

- **Membership and money**: tiers, Household pricing, roster import, own Stripe,
  card/ACH, renewals, and payment plans.
- **Reservations and front desk**: pool lanes/courts/rooms, approvals, QR check-in,
  guest passes, and POS.
- **Programs and communication**: classes/events, enrollments, email/SMS,
  segments, and announcements.

Do not list every edge feature. Retain a compact “also included” row only if it
adds decision value. Avoid four-column icon grids and long cards with paragraphs.
The page should feel edited by a person with priorities.

Use focused screenshot crops from plan 002 and HTML annotations outside the
image. No floating made-up metrics or decorative fake notifications.

**Verify**: each product story contains a distinct benefit, an exact product
visual, and no paragraph longer than roughly 80 words.

### Step 4: Add production-safe testimonial placeholders

Create typed testimonial records with `verified: boolean`. Include three clearly
fictional placeholders for layout review, using labels such as “Placeholder club
operator” rather than realistic names or organizations.

Behavior:

- in local development, render the designed section with a visible internal
  banner: `PLACEHOLDER TESTIMONIALS — NOT FOR PRODUCTION`;
- in production, render only records where `verified === true`;
- when there are zero verified records, render the truthful proof strip instead;
- if a build-time flag attempts to force unverified quotes into a production
  build, throw a build error rather than silently publishing them.

Never put placeholder quote text in SEO metadata or structured data.

**Verify**:

- `npm run dev` shows the placeholder section and warning locally.
- `npm run build` succeeds with placeholders disabled.
- `rg -n 'PLACEHOLDER TESTIMONIAL|placeholder-testimonial' dist` returns no
  matches.

### Step 5: Preserve accurate pricing while simplifying its presentation

Keep the plans API fetch, fallback plans, and plan/module mapping logic. Extract
pricing presentation into local helper components only if it materially reduces
the homepage size; do not hide network/fallback behavior inside a generic card.

Update all trial copy to `45-day free trial` or `45 days free`, consistently
paired with `no card required` where space allows. Do not say “free for 45 days”
until confirming the deployed registration flow exposes the same duration.

Keep standard Stripe processing-fee disclosure and the $17,000 Community-plan
rule of thumb if the API/catalog math still supports it. Do not change plan or
module prices in this design task.

**Verify**:

- Build once with the plans API reachable and once with a deliberately invalid
  local `PUBLIC_MEMBERLEY_APP_URL`; both builds render a non-empty pricing area.
- `rg -n '14-day|14 day' src/pages/index.astro` returns no matches.

### Step 6: Add conversion event semantics

Add stable `data-marketing-event` and `data-marketing-location` attributes to all
demo, trial, compare, and contact links. Use one delegated handler (preferably in
`Layout.astro`) to emit PostHog events only when PostHog is available:

- `marketing_demo_clicked`
- `marketing_trial_clicked`
- `marketing_alternative_clicked`
- `marketing_contact_clicked`

Include page path and location (`header`, `hero`, `story`, `pricing`, `footer`,
etc.). Preserve the existing Meta Pixel PageView and Lead behavior; do not
double-fire Lead.

Document the intended funnel in code comments: homepage view → demo or trial
click. Do not invent a numerical conversion target without a baseline. After
launch, compare before/after by device class and paid-source campaign in PostHog.

**Verify**: a local stubbed `window.posthog.capture` records one event per CTA
click with the correct event name and location. Meta Lead still fires once for a
registration URL.

## Test plan

Plan 005 adds end-to-end tests; this plan must at minimum:

- typecheck and build all routes;
- statically assert zero 14-day references;
- assert placeholder quotes are absent from production output;
- verify pricing fallback with an unavailable API;
- exercise palette variants at the four target viewports;
- test reduced-motion mode and keyboard focus order manually before handing off.

## Done criteria

- [ ] First viewport identifies pool/swim-and-tennis clubs and exposes both
  conversion actions.
- [ ] Live demo is the primary visual CTA; 45-day/no-card trial is unmistakable.
- [ ] Homepage is materially shorter and no longer repeats the same feature set
  as cards, list, matrix, and use-case grid.
- [ ] Household pricing remains represented.
- [ ] All product imagery comes from plan 002's exact capture manifest.
- [ ] Production output contains no fictional quote or placeholder identity.
- [ ] Pricing still works with live API and fallback data.
- [ ] `rg -n '14-day|14 day' src/pages/index.astro` returns no matches.
- [ ] `npm run check` and `npm run build` pass.
- [ ] No horizontal overflow exists at 390, 768, 1280, or 1440 widths.
- [ ] CTA analytics events have stable names and location properties.

## STOP conditions

Stop and report if:

- The deployed signup flow does not actually grant 45 days.
- Plan 002's hero or product assets are missing, stale, or contain real data.
- Preserving Household pricing conflicts with a newer product decision.
- Pricing API shapes or fallback plan names differ from the current types.
- The requested layout can be achieved only by publishing unverified quotes.
- A proposed copy change introduces a factual claim not already supported by
  product behavior or source material.

## Maintenance notes

The homepage should remain an edited sales narrative, not become the canonical
feature inventory. When a feature ships, update the story only if it changes a
buyer's decision; otherwise place the detail in Help or docs. Once real quotes
arrive, record the approver/source internally, set `verified: true`, remove the
development placeholder, and review whether the truthful proof-strip fallback
is still needed.
