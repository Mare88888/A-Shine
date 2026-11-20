import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import {
  getBookingInboxEmail,
  getResendApiKey,
  getResendFromAddress,
  resendErrorMessage,
} from "@/lib/booking-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const RATE_LIMIT_KEY_PREFIX = "booking:";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Server-side required fields.
const REQUIRED_FIELDS = [
  "name",
  "email",
  "service",
  "locationType",
  "date",
] as const;

type SupportedLocale = "sl" | "en";

export type BookingPayload = {
  name: string;
  email: string;
  phone?: string;
  carType?: string;
  service: string;
  locationType?: string;
  distance?: string;
  date?: string;
  message?: string;
  locale?: SupportedLocale;
};

const EMAIL_TEXT = {
  en: {
    ownerSubject: (name: string, service: string) =>
      `Booking request from ${name} - ${service}`,
    customerSubject: "We received your booking request - A-Shine",
    ownerHeading: "New booking request",
    customerHeading: "We received your booking request",
    greeting: (name: string) => `Hi ${name},`,
    intro:
      "Thank you for getting in touch. We've received your request and will get back to you soon to confirm your booking.",
    summaryTitle: "Summary of your request:",
    labels: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      car: "Car type / model",
      service: "Service",
      location: "Location",
      date: "Preferred date",
      message: "Message",
    },
    locationOur: "At our location",
    locationMobileNoDistance: "We come to you",
    locationMobileWithDistance: (d: string) => `We come to you (−${d} km)`,
    closingIntro:
      "If you have any questions in the meantime, just reply to this email or give us a call.",
    closingSignoff: "Best regards,<br>A-Shine",
    errors: {
      rateLimited: "Too many requests. Please try again in a few minutes.",
      invalidEmail: "Please enter a valid email address.",
      missingLocation: "Please choose where the service will be",
      missingDate: "Please choose a preferred date",
      missingDistance: "Please select distance",
      datePast: "Preferred date cannot be in the past.",
      dateYearHigh: "Try a sooner date.",
      generic: "Something went wrong. Please try again.",
    },
  },
  sl: {
    ownerSubject: (name: string, service: string) =>
      `Novo povpraševanje od ${name} - ${service}`,
    customerSubject: "Prejeli smo vaše povpraševanje - A-Shine",
    ownerHeading: "Novo povpraševanje",
    customerHeading: "Prejeli smo vaše povpraševanje",
    greeting: (name: string) => `Pozdravljeni ${name},`,
    intro:
      "Hvala za vaše sporočilo. Prejeli smo vaše povpraševanje in vas bomo kmalu kontaktirali za potrditev termina.",
    summaryTitle: "Povzetek vašega povpraševanja:",
    labels: {
      name: "Ime",
      email: "E-pošta",
      phone: "Telefon",
      car: "Tip / model vozila",
      service: "Storitev",
      location: "Lokacija",
      date: "Želeni datum",
      message: "Sporočilo",
    },
    locationOur: "Pri nas",
    locationMobileNoDistance: "Pridevamo do vas",
    locationMobileWithDistance: (d: string) => `Pridevamo do vas (−${d} km)`,
    closingIntro:
      "Če imate vmes kakršna koli vprašanja, nam preprosto odgovorite na to e-pošto ali nas pokličite.",
    closingSignoff: "Lep pozdrav,<br>A-Shine",
    errors: {
      rateLimited: "Preveč zahtev. Poskusite znova čez nekaj minut.",
      invalidEmail: "Vnesite veljaven e-poštni naslov.",
      missingLocation: "Izberite, kje naj opravimo storitev",
      missingDate: "Izberite želeni datum",
      missingDistance: "Izberite razdaljo",
      datePast: "Želeni datum ne sme biti v preteklosti.",
      dateYearHigh: "Poskusite z manjšim datumom.",
      generic: "Prišlo je do napake. Poskusite znova.",
    },
  },
} as const;

function getLocationLabelLocalized(
  lang: SupportedLocale,
  locationType?: string,
  distance?: string,
): string {
  const text = EMAIL_TEXT[lang];
  if (!locationType) return "";
  if (locationType === "our-location") return text.locationOur;
  if (!distance) return text.locationMobileNoDistance;
  return text.locationMobileWithDistance(distance);
}

function formatDateForDisplay(raw?: string): string {
  const trimmed = raw?.trim();
  if (!trimmed) return "";
  // Expecting YYYY-MM-DD from the <input type="date">
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

function isDateInPast(raw?: string): boolean {
  const trimmed = raw?.trim();
  if (!trimmed) return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return false;
  const [, year, month, day] = match;
  const selected = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    0,
    0,
    0,
    0,
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
}

function isYearTooHigh(raw?: string, maxYear = 2050): boolean {
  const trimmed = raw?.trim();
  if (!trimmed) return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return false;
  const [year] = match.slice(1, 2);
  const yr = Number(year);
  if (Number.isNaN(yr)) return false;
  return yr > maxYear;
}

export async function POST(request: Request) {
  let errorLocale: SupportedLocale = "sl";
  try {
    const body = (await request.json()) as BookingPayload;
    const {
      name,
      email,
      phone,
      carType,
      service,
      locationType,
      distance,
      date,
      message,
      locale,
    } = body;

    const lang: SupportedLocale = locale === "en" ? "en" : "sl";
    errorLocale = lang;
    const TEXT = EMAIL_TEXT[lang];

    const ip = getClientIp(request);
    if (isRateLimited(`${RATE_LIMIT_KEY_PREFIX}${ip}`)) {
      return NextResponse.json(
        { error: TEXT.errors.rateLimited },
        { status: 429 },
      );
    }

    const missing = REQUIRED_FIELDS.filter((field) => !body[field]?.trim());
    if (missing.length > 0) {
      if (missing.includes("locationType")) {
        return NextResponse.json(
          { error: TEXT.errors.missingLocation },
          { status: 400 },
        );
      }
      if (missing.includes("date")) {
        return NextResponse.json(
          { error: TEXT.errors.missingDate },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: TEXT.errors.invalidEmail },
        { status: 400 },
      );
    }
    if (isYearTooHigh(date)) {
      return NextResponse.json(
        { error: TEXT.errors.dateYearHigh },
        { status: 400 },
      );
    }
    if (isDateInPast(date)) {
      return NextResponse.json(
        { error: TEXT.errors.datePast },
        { status: 400 },
      );
    }

    const resendApiKey = getResendApiKey();
    if (!resendApiKey) {
      console.error(
        "RESEND_API_KEY is not set (add it in Vercel → Settings → Environment Variables → Production, then redeploy).",
      );
      return NextResponse.json({ error: TEXT.errors.generic }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const bookingInbox = getBookingInboxEmail();
    const fromAddress = getResendFromAddress();

    const locationLabel = getLocationLabelLocalized(
      lang,
      locationType,
      distance,
    );
    const phoneLine = phone?.trim()
      ? `<p><strong>${TEXT.labels.phone}:</strong> ${escapeHtml(phone.trim())}</p>`
      : "";
    const carLine = carType?.trim()
      ? `<p><strong>${TEXT.labels.car}:</strong> ${escapeHtml(
          carType.trim(),
        )}</p>`
      : "";
    const locationLine = locationLabel
      ? `<p><strong>${TEXT.labels.location}:</strong> ${locationLabel}</p>`
      : "";
    const messageSection = message?.trim()
      ? `<p><strong>${TEXT.labels.message}:</strong></p><p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>`
      : "";
    const formattedDate = formatDateForDisplay(date);
    const html = `
      <h2>${TEXT.ownerHeading}</h2>
      <p><strong>${TEXT.labels.name}:</strong> ${escapeHtml(name)}</p>
      <p><strong>${TEXT.labels.email}:</strong> ${escapeHtml(email)}</p>
      ${phoneLine}
      ${carLine}
      <p><strong>${TEXT.labels.service}:</strong> ${escapeHtml(service)}</p>
      ${locationLine}
      ${
        formattedDate
          ? `<p><strong>${TEXT.labels.date}:</strong> ${escapeHtml(
              formattedDate,
            )}</p>`
          : ""
      }
      ${messageSection}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [bookingInbox],
      replyTo: email.trim(),
      subject: TEXT.ownerSubject(name.trim(), service.trim()),
      html,
    });

    if (error) {
      const errMsg = resendErrorMessage(error);
      console.error("Resend owner email failed:", {
        error,
        from: fromAddress,
        to: bookingInbox,
        message: errMsg,
      });
      if (errMsg.includes("not verified")) {
        console.error(
          "Resend: domain not verified - finish DNS at https://resend.com/domains and redeploy.",
        );
      }
      const clientError =
        process.env.NODE_ENV === "development" && errMsg
          ? errMsg
          : TEXT.errors.generic;
      return NextResponse.json({ error: clientError }, { status: 500 });
    }

    // Send confirmation email to the customer
    const confirmationHtml = `
      <h2>${TEXT.customerHeading}</h2>
      <p>${escapeHtml(TEXT.greeting(name.trim()))}</p>
      <p>${TEXT.intro}</p>
      <p><strong>${TEXT.summaryTitle}</strong></p>
      <ul>
        <li>${TEXT.labels.service}: ${escapeHtml(service)}</li>
        ${
          carType?.trim()
            ? `<li>${TEXT.labels.car}: ${escapeHtml(carType.trim())}</li>`
            : ""
        }
        ${
          locationLabel
            ? `<li>${TEXT.labels.location}: ${escapeHtml(locationLabel)}</li>`
            : ""
        }
        ${
          formattedDate
            ? `<li>${TEXT.labels.date}: ${escapeHtml(formattedDate)}</li>`
            : ""
        }
      </ul>
      <p>${TEXT.closingIntro}</p>
      <p>${TEXT.closingSignoff}</p>
    `.trim();

    const confirmResult = await resend.emails.send({
      from: fromAddress,
      to: [email.trim()],
      subject: TEXT.customerSubject,
      html: confirmationHtml,
    });

    if (confirmResult.error) {
      console.error("Confirmation email error:", confirmResult.error);
      // Still return success - the booking was received by the business
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json(
      { error: EMAIL_TEXT[errorLocale].errors.generic },
      { status: 500 },
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
