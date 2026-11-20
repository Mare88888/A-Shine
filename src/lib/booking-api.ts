/** Public booking calendar API (AShineBookingAPI). Browser-safe. */

/** Maribor local time. Slovenia's zone id is Europe/Ljubljana. */
export const BOOKING_ZONE = "Europe/Ljubljana";

export type PublicAvailability = {
  date: string;
  serviceCode: string;
  starts: string[];
};

export type DayClosureReason = "closed" | "blocked" | "full" | "passed";

export type PublicAvailabilityDay = {
  date: string;
  available: boolean;
  reason?: DayClosureReason | null;
};

export type PublicAvailabilityDays = {
  serviceCode: string;
  from: string;
  to: string;
  days: PublicAvailabilityDay[];
};

export type CreateBookingPayload = {
  name: string;
  email: string;
  phone?: string | null;
  carType?: string | null;
  serviceCategory: string;
  serviceCode: string;
  locationType: string;
  distance?: string | null;
  streetAddress?: string | null;
  date: string;
  startsAt: string;
  message?: string | null;
  locale: "sl" | "en";
};

export type CreateBookingResult = {
  id: number;
  status: string;
  startsAt: string;
  endsAt: string;
  serviceCode: string;
};

export type BookingApiErrorCode =
  | "SLOT_TAKEN"
  | "VALIDATION"
  | "RATE_LIMITED"
  | "UNKNOWN";

export class BookingApiError extends Error {
  readonly code: BookingApiErrorCode;
  readonly status: number;

  constructor(code: BookingApiErrorCode, message: string, status: number) {
    super(message);
    this.name = "BookingApiError";
    this.code = code;
    this.status = status;
  }
}

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

export function todayInMaribor(): string {
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

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
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

/** Inclusive day grid. Unavailable days include reason: closed, blocked, full, or passed. */
export async function fetchAvailabilityDays(
  from: string,
  to: string,
  serviceCode: string,
  signal?: AbortSignal
): Promise<PublicAvailabilityDays> {
  const params = new URLSearchParams({ from, to, serviceCode });
  const res = await fetch(
    `${getBookingApiUrl()}/api/public/availability/days?${params}`,
    { signal }
  );
  if (!res.ok) {
    throw new Error(`Availability days ${res.status}`);
  }
  return res.json() as Promise<PublicAvailabilityDays>;
}

export function addDaysIso(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function startOfMonthIso(isoDate: string): string {
  return `${isoDate.slice(0, 7)}-01`;
}

export function endOfMonthIso(isoDate: string): string {
  const [y, m] = isoDate.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResult> {
  const body = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: emptyToNull(payload.phone ?? undefined),
    carType: emptyToNull(payload.carType ?? undefined),
    serviceCategory: payload.serviceCategory,
    serviceCode: payload.serviceCode,
    locationType: payload.locationType,
    distance:
      payload.locationType === "mobile"
        ? emptyToNull(payload.distance ?? undefined)
        : null,
    streetAddress:
      payload.locationType === "mobile"
        ? emptyToNull(payload.streetAddress ?? undefined)
        : null,
    date: payload.date,
    startsAt: payload.startsAt,
    message: emptyToNull(payload.message ?? undefined),
    locale: payload.locale,
  };

  const res = await fetch(`${getBookingApiUrl()}/api/public/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    return res.json() as Promise<CreateBookingResult>;
  }

  const data = (await res.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
  };
  const code =
    data.code === "SLOT_TAKEN" ||
    data.code === "VALIDATION" ||
    data.code === "RATE_LIMITED"
      ? data.code
      : "UNKNOWN";

  throw new BookingApiError(
    code,
    data.message ?? `Booking failed (${res.status})`,
    res.status
  );
}
