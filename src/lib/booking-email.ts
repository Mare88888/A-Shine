/** Server-only helpers for the booking API (read env at request time). */

const DEFAULT_INBOX = "info.ashine@gmail.com";
const DEFAULT_FROM = "A-Shine <bookings@ashine.si>";

/** Strip wrapping quotes Vercel/users sometimes add in env values. */
function stripEnvQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function getBookingInboxEmail(): string {
  return (
    stripEnvQuotes(process.env.BOOKING_TO_EMAIL ?? "") ||
    stripEnvQuotes(process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "") ||
    DEFAULT_INBOX
  );
}

export function getResendFromAddress(): string {
  const from = stripEnvQuotes(process.env.RESEND_FROM ?? "");
  return from || DEFAULT_FROM;
}

export function getResendApiKey(): string | undefined {
  const key = stripEnvQuotes(process.env.RESEND_API_KEY ?? "");
  return key || undefined;
}

export function resendErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return "";
}
