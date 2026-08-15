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
export const DOCS_URL = "https://docs.memberley.com";
export const CONTACT_EMAIL = "tommy@memberley.com";

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
] as const;
