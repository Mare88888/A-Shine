# A-Shine - Project Documentation

Production website for **A-Shine Mobile Detailing**: bilingual marketing site with booking, Google reviews, and a service-area map.

**Stack:** Next.js 15 · React 18 · TypeScript · Tailwind · next-intl · Framer Motion · Resend · Google Maps / Places

---

## Folder structure

```
Car Website/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localised pages (home, privacy, terms, cookies)
│   │   ├── api/booking/       # Booking API (Resend)
│   │   ├── layout.tsx         # Root layout, fonts, metadata
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/            # UI sections (Hero, About, Gallery, …)
│   ├── config/site.ts         # Brand, URL, contact, geo
│   ├── data/                  # Google reviews fallbacks
│   ├── i18n/                  # next-intl routing & loaders
│   └── lib/                   # Booking, reviews, SEO, rate-limit, motion
├── strings/                   # sl.json · en.json
├── public/                    # Images, video, favicon
├── .env.example
├── DEPLOYMENT.md
└── DOCUMENTATION.md
```

---

## Routes

| Route | Description |
| ----- | ----------- |
| `/` · `/en` | Home (single-page sections) |
| `/privacy` · `/en/privacy` | Privacy policy |
| `/terms` · `/en/terms` | Terms of use |
| `/cookies` · `/en/cookies` | Cookie policy |
| `POST /api/booking` | Booking form handler |

Home sections (anchors): `#about` · `#gallery` · `#pricing` · `#map` · `#testimonials` · `#contact`

Default locale is **Slovenian** (`as-needed` prefix - no `/sl` in the URL).

---

## Page flow

```
Hero → Stats → About → Gallery → Pricing → Map → Testimonials → Contact → Footer
```

| Section | Role |
| ------- | ---- |
| **Nav** | Sticky header, language switcher, mobile menu |
| **Hero** | Full-bleed video, headline, primary CTA |
| **About** | Story, certificates, why-us, commitment |
| **Gallery** | Before/after comparisons + lightbox |
| **Pricing** | Packages and à-la-carte services |
| **Map** | Service area (Google Maps) |
| **Testimonials** | Live Google reviews carousel |
| **Contact** | Booking form → `/api/booking` |
| **MobileCTABar** | Sticky call / book bar on small screens |

---

## Booking flow

1. User submits the form in `Contact.tsx`
2. `POST /api/booking` validates input and applies IP rate limiting
3. **Resend** sends:
   - notification to the business inbox
   - confirmation to the customer (SL / EN)

Env (server-only): `RESEND_API_KEY` · `RESEND_FROM` · `BOOKING_TO_EMAIL`  
See `.env.example` for the full list (Maps, Places, site URL).

---

## Design

- Dark premium palette (near-black / charcoal) with cyan accent (`#00b8db`)
- Mobile-first layout, sticky nav, smooth anchor scrolling
- Motion via Framer Motion (section entrances, carousel, gallery)
- Semantic HTML, focus states, bilingual copy throughout

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start   # production build
```

For Vercel deploy, env vars, and domain setup → [`DEPLOYMENT.md`](./DEPLOYMENT.md)
