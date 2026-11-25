# A-Shine website

Bilingual marketing site for A-Shine Mobile Detailing. Slovenian is the default (`/`). English uses the `/en` prefix. Legal pages, the map, reviews, and the booking form live here. The calendar itself is a separate API.

**Stack:** Next.js 15 · React 18 · TypeScript · Tailwind · next-intl · Framer Motion

## Layout

```
src/
├── app/
│   ├── [locale]/          # home, privacy, terms, cookies
│   ├── api/booking/       # older email route; the form does not use it
│   ├── sitemap.ts
│   ├── robots.ts
│   └── llms.txt/route.ts
├── components/            # page sections
├── config/site.ts         # name, URL, contact, map centre
├── i18n/                  # Slovenian default, English under /en
└── lib/                   # booking client, reviews, SEO
strings/                   # sl.json and en.json
```

## Routes

| Route | Page |
| ----- | ---- |
| `/` | Home, Slovenian |
| `/en` | Home, English |
| `/privacy`, `/terms`, `/cookies` | Legal pages, plus `/en/...` |
| `/sitemap.xml`, `/robots.txt` | SEO |

Home anchors: `#about` · `#gallery` · `#pricing` · `#map` · `#testimonials` · `#contact`

Order on the page: Hero, stats, about, gallery, pricing, map, reviews, booking form, footer. A call and book bar stays fixed on small screens.

## Booking

The form in `Contact.tsx` calls the booking API:

1. After a service is chosen, it loads which days can be booked.
2. After a day is chosen, it loads free start times.
3. **We come to you** asks for a street address. A visit at the studio does not.
4. Submit sends the request to `POST /api/public/bookings`.

The API holds the time, stores the appointment, and sends the owner and customer emails. This site does not write appointments to its own database.

Set `NEXT_PUBLIC_BOOKING_API_URL` to the API origin, with no trailing slash.

## Map and reviews

The service-area map loads with the page through the Maps JavaScript API. Reviews are fetched on the server from Google Places, with a static fallback if that request fails.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
