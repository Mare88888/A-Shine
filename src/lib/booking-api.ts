/** Public booking calendar API (AShineBookingAPI). Browser-safe. */

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
