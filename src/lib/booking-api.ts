/** Public booking calendar API (AShineBookingAPI). Browser-safe. */

export const BOOKING_ZONE = "Europe/Ljubljana";

export type PublicAvailability = {
  date: string;
  serviceCode: string;
  starts: string[];
};

const KNOWN_SERVICE_CODES = new Set([
  "cleaning-basic",
  "cleaning-full",
  "cleaning-premium",
  "detail-standard",
  "detail-deepshine",
  "detail-showroom",
  "cleaning",
  "custom",
]);

export function getBookingApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BOOKING_API_URL?.trim() ?? "";
  return raw.replace(/\/+$/, "") || "http://localhost:8080";
}

/**
 * Map the Contact form category + package id to the API serviceCode.
 * Cleaning with no package must send `cleaning`, not `custom`.
 */
export function toServiceCode(serviceCategory: string, packageId: string): string {
  if (KNOWN_SERVICE_CODES.has(packageId) && packageId !== "custom") {
    return packageId;
  }
  if (serviceCategory === "cleaning") {
    return "cleaning";
  }
  if (serviceCategory === "custom" || serviceCategory === "detailing") {
    return "custom";
  }
  throw new Error(`Unknown service mapping: ${serviceCategory}/${packageId}`);
}

export function todayInLjubljana(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function formatSlotTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "sl" ? "sl-SI" : "en-GB", {
    timeZone: BOOKING_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export async function fetchAvailability(
  date: string,
  serviceCode: string,
  signal?: AbortSignal
): Promise<PublicAvailability> {
  const params = new URLSearchParams({ date, serviceCode });
  const res = await fetch(
    `${getBookingApiUrl()}/api/public/availability?${params}`,
    { signal }
  );
  if (!res.ok) {
    throw new Error(`Availability ${res.status}`);
  }
  return res.json() as Promise<PublicAvailability>;
}
