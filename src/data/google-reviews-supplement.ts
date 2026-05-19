/**
 * Reviews not in the Places API top 5 (merged by author; duplicates skipped).
 */
import type { GoogleReview } from "@/lib/google-reviews";

export const GOOGLE_REVIEWS_SUPPLEMENT: GoogleReview[] = [
  {
    id: "ljiljana-jovanovic",
    quote: "Zelo zadovoljna.",
    quoteEn: "Very satisfied.",
    author: "Ljiljana Jovanovič",
    relativeTime: "pred 7 meseci",
    relativeTimeEn: "7 months ago",
    rating: 5,
  },
  {
    id: "marko",
    quote: "Sedeži kot novi. Hvala!",
    quoteEn: "Seats like new. Thanks!",
    author: "Marko",
    relativeTime: "pred 5 urami",
    relativeTimeEn: "5 hours ago",
    rating: 5,
  },
];
