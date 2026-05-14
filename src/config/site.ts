/**
 * Shared site configuration: base URL and brand.
 * Used by layout, page metadata, sitemap, robots, JsonLd.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ashine.si";

/** Shown on legal pages and used as fallback booking inbox. Set `NEXT_PUBLIC_CONTACT_EMAIL` on Vercel. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "info.ashine@gmail.com";

/** Server-only: where booking notifications are sent. Falls back to `CONTACT_EMAIL`. */
export const BOOKING_INBOX_EMAIL =
  process.env.BOOKING_TO_EMAIL?.trim() || CONTACT_EMAIL;

export const BRAND = {
  name: "AShine",
  /** Tailwind premium-black equivalent */
  bg: "#08080a",
  /** Tailwind premium-accent equivalent */
  accent: "#00b8db",
} as const;

/** Celestrina 19, Malečnik – used by MapSection and JsonLd */
export const GEO = {
  latitude: 46.56174661845999,
  longitude: 15.717263781943037,
} as const;
