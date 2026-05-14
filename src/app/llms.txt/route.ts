import { SITE_URL, CONTACT_EMAIL, GEO } from "@/config/site";

export const dynamic = "force-static";
export const revalidate = false;

const lat = GEO.latitude.toFixed(4);
const lng = GEO.longitude.toFixed(4);

const CONTENT = `# AShine

> Mobile car detailing and valeting in Slovenia. Ceramic coating, paint correction, and full detailing packages. Based in Malečnik (near Maribor) with a 25–200 km mobile service area.

AShine is a mobile car detailing business operating across Slovenia from Celestrina 19, Malečnik. The website is bilingual: Slovenian (default at /) and English (under /en). Customers book by submitting the contact form, which sends an email to the business. The home page includes an interactive map that shows the service area as three concentric travel zones around the base.

## Services

- Cleaning packages — interior, exterior, and full cleaning options.
- Detailing packages — paint correction, ceramic coating, and full detailing.
- Mobile service — the technician travels to the client's location within the service area.

## Service area and travel pricing

- 0–25 km from Malečnik: travel included (free).
- 25–100 km: €0.50 per km.
- 100–200 km: €0.40 per km.

## Contact

- Email: ${CONTACT_EMAIL}
- Phone: +386 70 742 363
- Address: Celestrina 19, 2229 Malečnik, Slovenia (≈ ${lat}° N, ${lng}° E)
- Instagram: https://www.instagram.com/ashinemobile/
- Facebook: https://www.facebook.com/people/A-Shine/61576376247443/

## Pages

- [Home — Slovenian (default)](${SITE_URL}/): Overview, services, gallery, pricing, map, testimonials, booking form.
- [Home — English](${SITE_URL}/en): Same page in English.
- [Privacy Policy — Slovenian](${SITE_URL}/privacy)
- [Privacy Policy — English](${SITE_URL}/en/privacy)
- [Terms of Service — Slovenian](${SITE_URL}/terms)
- [Terms of Service — English](${SITE_URL}/en/terms)
- [Cookie Policy — Slovenian](${SITE_URL}/cookies)
- [Cookie Policy — English](${SITE_URL}/en/cookies)

## Optional

- [XML sitemap](${SITE_URL}/sitemap.xml)
- [robots.txt](${SITE_URL}/robots.txt)
`;

export function GET() {
  return new Response(CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
