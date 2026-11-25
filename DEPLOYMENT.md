# Deployment

The site is a Next.js app on Vercel. Production host: `https://ashine.si` (`www` redirects there).

The booking calendar is not part of this deploy. Point `NEXT_PUBLIC_BOOKING_API_URL` at the running API (`https://api.ashine.si` in production).

## Vercel

1. Import this GitHub repository in Vercel. Next.js is detected automatically.
2. Set the environment variables below for **Production**.
3. Add the domain `ashine.si` under **Project → Settings → Domains**, and follow the DNS instructions.
4. Deploy. Later pushes to the production branch deploy again.

Check `https://ashine.si/sitemap.xml` and `https://ashine.si/robots.txt` after a deploy. Both should use `https://ashine.si` when `NEXT_PUBLIC_SITE_URL` is set.

`.env.local` is for your machine only. It is gitignored. Do not commit API keys.

## Environment variables

Copy `.env.example` for the comments. Values:

| Variable | Where it is used |
| -------- | ---------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, Open Graph. Use `https://ashine.si`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Footer, legal pages, and structured data. |
| `NEXT_PUBLIC_BOOKING_API_URL` | Slot lookup and booking submit. No trailing slash. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser key for the map. Restrict it by HTTP referrer. |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Map ID for the advanced marker. |
| `GOOGLE_PLACE_ID` | Server-side Google reviews. |
| `GOOGLE_MAPS_API_KEY` | Server key for Places. Do not expose this in the browser. |
| `RESEND_API_KEY` | Only if something still sends mail from this app. Booking mail is sent by the API. |
| `RESEND_FROM` | From address for that mail path. |
| `BOOKING_TO_EMAIL` | Inbox for that mail path. |

Maps needs **Maps JavaScript API** and **Geocoding API** enabled, with billing on. Reviews need **Places API (New)** on the server key.

Referrer restrictions for the browser map key should include:

- `https://ashine.si/*`
- `https://www.ashine.si/*`
- `http://localhost:3000/*`

## Local check before pushing

```bash
npm run build
```
