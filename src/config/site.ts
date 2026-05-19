/**
 * Shared site configuration: base URL and brand.
 * Used by layout, page metadata, sitemap, robots, JsonLd.
 */

/** Remove trailing slashes so paths like `${SITE_URL}/privacy` never become `//privacy`. */
export function normalizeSiteUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    const normalized = normalizeSiteUrl(fromEnv);
    // Production deploys sometimes keep an old *.vercel.app value in NEXT_PUBLIC_SITE_URL.
    if (
      process.env.VERCEL_ENV === "production" &&
      /\.vercel\.app$/i.test(new URL(normalized).hostname)
    ) {
      const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
      if (vercelProd) {
        const host = vercelProd
          .replace(/^https?:\/\//i, "")
          .replace(/\/+$/, "");
        return normalizeSiteUrl(`https://${host}`);
      }
    }
    return normalized;
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd && process.env.VERCEL_ENV === "production") {
    const host = vercelProd.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    return normalizeSiteUrl(`https://${host}`);
  }

  return "https://ashine.si";
}

export const SITE_URL = resolveSiteUrl();
/** Shown on legal pages and used as fallback booking inbox. Set `NEXT_PUBLIC_CONTACT_EMAIL` on Vercel. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "info.ashine@gmail.com";

/** Server-only: where booking notifications are sent. Falls back to `CONTACT_EMAIL`. */
export const BOOKING_INBOX_EMAIL =
  process.env.BOOKING_TO_EMAIL?.trim() || CONTACT_EMAIL;

export const BRAND = {
  name: "A-Shine Mobile Detailing",
  /** Nav / header logo (public/NavbarLogoTransparent.webp). */
  logoSrc: "/NavbarLogoTransparent.webp",
  /** Search / schema aliases (brand query “ashine”, domain). */
  alternateNames: [
    "ashine",
    "ashine.si",
    "A-Shine",
    "ashine mobile",
    "ashinemobile",
  ] as const,
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
