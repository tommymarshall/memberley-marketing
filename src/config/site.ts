const configuredAppUrl = (
  import.meta.env.PUBLIC_MEMBERLEY_APP_URL as string | undefined
)
  ?.trim()
  .replace(/\/$/, "");

export const APP_URL =
  configuredAppUrl && configuredAppUrl.length > 0
    ? configuredAppUrl
    : import.meta.env.DEV
      ? "http://memberley-app.test"
      : "https://app.memberley.com";

export const SIGNUP_URL = `${APP_URL}/register`;
export const LOGIN_URL = `${APP_URL}/login`;
export const DASHBOARD_URL = `${APP_URL}/dashboard`;
export const DEMO_URL = "https://demo.memberley.com";

// Where every "try the demo" CTA points. The demo app signs the visitor into
// the seeded owner account and drops them on the admin dashboard, so nobody
// has to get past a sign-in screen to look around. The route exists only when
// the app is running in demo mode — on app.memberley.com it is a 404, which is
// exactly why this is hardcoded to the demo host rather than built from
// APP_URL.
export const DEMO_LOGIN_URL = `${DEMO_URL}/demo/login`;
export const DOCS_URL = "https://docs.memberley.com";
export const CONTACT_EMAIL = "tommy@memberley.com";

// The one label every trial CTA uses (header, hero, pricing cards, footer,
// help, alternatives). The 45-day / no-card terms live in the caption next to
// the button, not in the label, so the buttons read the same everywhere.
export const TRIAL_CTA_LABEL = "Start your free trial";
export const TRIAL_TERMS = "45-day free trial, no card required";

export const alternatives = [
  {
    href: "/alternatives/member-splash",
    name: "Member Splash",
    description: "For neighborhood pools that want modern tools and lower fees.",
    monogram: "MS",
  },
  {
    href: "/alternatives/pooldues",
    name: "PoolDues",
    description: "For clubs ready to bring dues, check-in, and programs together.",
    monogram: "PD",
  },
  {
    href: "/alternatives/courtreserve",
    name: "CourtReserve",
    description: "For swim-and-tennis clubs that need more than reservations.",
    monogram: "CR",
  },
  {
    href: "/alternatives/wild-apricot",
    name: "Wild Apricot",
    description: "For clubs that outgrew contact tiers and need a front gate.",
    monogram: "WA",
  },
  {
    href: "/alternatives/clubexpress",
    name: "ClubExpress",
    description: "For clubs done with per-member fees and setup packages.",
    monogram: "CE",
  },
] as const;
