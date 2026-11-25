# A-Shine

Public website for [A-Shine Mobile Detailing](https://ashine.si). Slovenian is the default language. English is at `/en`.

The home page covers the service, gallery, prices, service-area map, Google reviews, and a booking form. Appointments are stored by a separate booking API. This repository is the marketing site only.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in the values you need. The form talks to the booking API at `NEXT_PUBLIC_BOOKING_API_URL` (local default `http://localhost:8080`).

```bash
npm run build
npm start
```

## Stack

- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- next-intl
- Framer Motion

## Docs

- [Project documentation](./DOCUMENTATION.md) — structure, routes, booking
- [Deployment](./DEPLOYMENT.md) — Vercel and environment variables
- [Design system](./DESIGN-SYSTEM.md) — colours and type
- [Animations](./ANIMATIONS.md) — motion used on the page
