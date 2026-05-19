import {
  GOOGLE_RATING_FALLBACK,
  GOOGLE_REVIEW_COUNT_FALLBACK,
  GOOGLE_REVIEWS_FALLBACK,
} from "@/data/google-reviews-fallback";
import { GEO } from "@/config/site";

export interface GoogleReview {
  id: string;
  /** Original text as written on Google (Slovenian or English). */
  quote: string;
  /** English text for /en (Google translation when needed). */
  quoteEn: string;
  author: string;
  relativeTime: string;
  relativeTimeEn?: string;
  rating: number;
  authorUrl?: string;
}

export interface GoogleReviewsResult {
  reviews: GoogleReview[];
  rating: number;
  total: number;
  mapsUri: string;
  source: "google" | "fallback";
}

const DEFAULT_MAPS_URI =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    "A-Shine Mobile Detailing, Celestrina 19, 2229 Malečnik, Slovenia",
  );

const PLACE_SEARCH_QUERY =
  "A-Shine Mobile Detailing Celestrina 19 Malečnik Slovenia";

type PlacesReview = {
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string };
};

/**
 * Google’s English top-5 often skips some Slovenian reviews. English text only
 * (dates still come from the API). Add an entry if /en shows Slovenian for someone.
 */
const QUOTE_EN_WHEN_MISSING_FROM_EN_BATCH: Readonly<Record<string, string>> = {
  "ljiljana jovanovič": "Very satisfied.",
};

function apiKey(): string | undefined {
  return (
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
  );
}

function placeResourceId(placeId: string): string {
  const id = placeId.trim();
  return id.startsWith("places/") ? id : `places/${id}`;
}

async function placesFetch<T>(
  url: string,
  init: RequestInit,
): Promise<T | null> {
  const key = apiKey();
  if (!key) return null;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      ...init.headers,
    },
    next: { revalidate: 86_400 },
  });

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      const body = await res.text().catch(() => "");
      console.warn("[google-reviews]", res.status, body.slice(0, 300));
    }
    return null;
  }

  return res.json() as Promise<T>;
}

function normalizePlaceId(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.includes("share.google")) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[google-reviews] GOOGLE_PLACE_ID must be ChIJ…, not a share link.",
      );
    }
    return null;
  }
  return value.replace(/^places\//, "");
}

async function resolvePlaceId(): Promise<string | null> {
  const fromEnv = process.env.GOOGLE_PLACE_ID?.trim();
  if (fromEnv) {
    const id = normalizePlaceId(fromEnv);
    if (id) return id;
  }

  const data = await placesFetch<{ places?: { id?: string }[] }>(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: { "X-Goog-FieldMask": "places.id" },
      body: JSON.stringify({
        textQuery: PLACE_SEARCH_QUERY,
        locationBias: {
          circle: {
            center: { latitude: GEO.latitude, longitude: GEO.longitude },
            radius: 5000,
          },
        },
      }),
    },
  );

  return data?.places?.[0]?.id ?? null;
}

function authorKey(r: PlacesReview): string {
  return r.authorAttribution?.displayName?.trim().toLowerCase() || "unknown";
}

function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function localizedText(r: PlacesReview | undefined): string {
  return r?.text?.text?.trim() ?? "";
}

/** Prefer original wording for the Slovenian site (not Google’s English translation). */
function originalWording(r: PlacesReview | undefined): string {
  if (!r) return "";
  return r.originalText?.text?.trim() || r.text?.text?.trim() || "";
}

/** Latest review per author (EN and SL top-5 lists differ). */
function indexByAuthor(reviews: PlacesReview[]): Map<string, PlacesReview> {
  const map = new Map<string, PlacesReview>();
  for (const r of reviews) {
    const key = authorKey(r);
    const existing = map.get(key);
    if (!existing || (r.publishTime ?? "") > (existing.publishTime ?? "")) {
      map.set(key, r);
    }
  }
  return map;
}

function englishQuoteForAuthor(
  authorLower: string,
  enText: string,
  slOnly: boolean,
): string {
  if (enText) return enText;
  if (slOnly) return QUOTE_EN_WHEN_MISSING_FROM_EN_BATCH[authorLower] ?? "";
  return "";
}

/** Build original (quote) + English (quoteEn) from parallel en/sl API responses. */
function mergeBilingualPlacesReviews(
  enReviews: PlacesReview[],
  slReviews: PlacesReview[],
): GoogleReview[] {
  const enByAuthor = indexByAuthor(enReviews);
  const slByAuthor = indexByAuthor(slReviews);
  const authors = new Set([...enByAuthor.keys(), ...slByAuthor.keys()]);

  const merged: GoogleReview[] = [];

  for (const authorLower of authors) {
    const enR = enByAuthor.get(authorLower);
    const slR = slByAuthor.get(authorLower);
    const enText = localizedText(enR);
    const slLocalized = localizedText(slR);
    const slOriginal = originalWording(slR);

    if (!enText && !slLocalized && !slOriginal) continue;

    const source = enR ?? slR!;
    const author =
      source.authorAttribution?.displayName?.trim() || "Google user";
    const rating = Math.min(
      5,
      Math.max(1, Math.round((enR ?? slR)!.rating ?? 5)),
    );

    const slOnly = Boolean(slR && !enR);
    let quote: string;
    let quoteEn: string;

    if (enText && slR) {
      const original = slOriginal || slLocalized;
      if (normalizeText(enText) === normalizeText(original)) {
        quote = enText;
        quoteEn = enText;
      } else {
        quote = original;
        quoteEn = enText;
      }
    } else if (enText) {
      quote = enText;
      quoteEn = enText;
    } else {
      quote = slOriginal || slLocalized;
      quoteEn = englishQuoteForAuthor(authorLower, "", true) || quote;
    }

    merged.push({
      id: source.publishTime ?? `google-${author}`,
      quote,
      quoteEn,
      author,
      relativeTime:
        slR?.relativePublishTimeDescription?.trim() ||
        enR?.relativePublishTimeDescription?.trim() ||
        "",
      relativeTimeEn: enR?.relativePublishTimeDescription?.trim(),
      rating,
      authorUrl: source.authorAttribution?.uri,
    });
  }

  return merged;
}

async function fetchPlaceReviews(
  placeId: string,
  language: "en" | "sl",
): Promise<PlacesReview[]> {
  const data = await placesFetch<{
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: PlacesReview[];
  }>(`https://places.googleapis.com/v1/${placeResourceId(placeId)}`, {
    method: "GET",
    headers: {
      "X-Goog-FieldMask":
        "rating,userRatingCount,reviews,googleMapsUri,reviews.originalText",
      "Accept-Language": language,
    },
  });

  return data?.reviews ?? [];
}

async function fetchFromGoogle(): Promise<GoogleReviewsResult | null> {
  const placeId = await resolvePlaceId();
  if (!placeId) return null;

  const [enReviews, slReviews, meta] = await Promise.all([
    fetchPlaceReviews(placeId, "en"),
    fetchPlaceReviews(placeId, "sl"),
    placesFetch<{
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
    }>(`https://places.googleapis.com/v1/${placeResourceId(placeId)}`, {
      method: "GET",
      headers: {
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri",
        "Accept-Language": "en",
      },
    }),
  ]);

  const reviews = mergeBilingualPlacesReviews(enReviews, slReviews);
  if (!reviews.length) return null;

  const total = meta?.userRatingCount ?? reviews.length;

  return {
    reviews,
    rating: meta?.rating ?? GOOGLE_RATING_FALLBACK,
    total,
    mapsUri: meta?.googleMapsUri ?? DEFAULT_MAPS_URI,
    source: "google",
  };
}

export async function getGoogleReviews(): Promise<GoogleReviewsResult> {
  try {
    const live = await fetchFromGoogle();
    if (live) return live;
  } catch (err) {
    console.error("[google-reviews] fetch failed:", err);
  }

  return {
    reviews: GOOGLE_REVIEWS_FALLBACK.map((r) => ({
      ...r,
      quoteEn: r.quoteEn?.trim() || r.quote,
    })),
    rating: GOOGLE_RATING_FALLBACK,
    total: GOOGLE_REVIEW_COUNT_FALLBACK,
    mapsUri: DEFAULT_MAPS_URI,
    source: "fallback",
  };
}

/** Slovenian site: original on Google. English site: English translation. */
export function reviewQuote(review: GoogleReview, locale: string): string {
  if (locale === "en") return review.quoteEn;
  return review.quote;
}

export function reviewRelativeTime(
  review: GoogleReview,
  locale: string,
): string {
  if (locale === "en" && review.relativeTimeEn?.trim()) {
    return review.relativeTimeEn;
  }
  return review.relativeTime;
}
