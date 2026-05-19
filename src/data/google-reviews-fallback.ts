/**
 * Curated Google reviews shown when Places API is unavailable.
 * Update after fetching from Google Business (or enable GOOGLE_PLACE_ID + Places API).
 */
import type { GoogleReview } from "@/lib/google-reviews";

export const GOOGLE_REVIEWS_FALLBACK: GoogleReview[] = [
  {
    id: "tjasa-soko",
    quote:
      "Z avto detailing storitvijo sem bila izredno zadovoljna. Naredili so mi globinsko čiščenje in keramično zaščito, rezultat pa je bil naravnost odličen.",
    quoteEn:
      "I was extremely satisfied with the car detailing service. They did a deep clean and ceramic coating for me, and the result was excellent.",
    author: "Tjasa Soko",
    relativeTime: "pred 8 meseci",
    relativeTimeEn: "8 months ago",
    rating: 5,
  },
];

export const GOOGLE_RATING_FALLBACK = 5;
export const GOOGLE_REVIEW_COUNT_FALLBACK = 8;
