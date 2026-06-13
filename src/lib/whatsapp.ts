import { links, type Lang } from "@/lib/i18n";

const FALLBACK_WHATSAPP_PHONE = "963994396648";

export type BuildCarWhatsAppUrlOptions = {
  carTitle: string;
  carUrl?: string;
  lang: Lang;
  /** Car-specific broker number; falls back to site default when absent. */
  whatsappNumber?: string | null;
};

/**
 * Strips formatting and returns digits-only international number for wa.me (no + prefix).
 * Converts common local Syrian format 09xxxxxxxx → 9639xxxxxxxx.
 */
export function normalizeWhatsAppPhone(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("0") && digits.length >= 10) {
    digits = `963${digits.slice(1)}`;
  }

  return digits.length >= 8 ? digits : null;
}

/** Default business WhatsApp number from env, then i18n links fallback. */
export function getDefaultWhatsAppPhone(): string {
  const fromEnv = normalizeWhatsAppPhone(import.meta.env.VITE_WHATSAPP_NUMBER);
  if (fromEnv) return fromEnv;

  const fromLink = normalizeWhatsAppPhone(links.whatsapp.replace(/^https?:\/\/wa\.me\//, ""));
  return fromLink ?? FALLBACK_WHATSAPP_PHONE;
}

/**
 * Resolves the phone to use for a car inquiry.
 *
 * The business uses a single WhatsApp line for every car across the whole
 * site, so per-car numbers are intentionally ignored — every inquiry routes
 * to the owner's number (VITE_WHATSAPP_NUMBER / FALLBACK_WHATSAPP_PHONE).
 */
export function resolveCarWhatsAppPhone(_whatsappNumber?: string | null): string {
  return getDefaultWhatsAppPhone();
}

export function buildCarWhatsAppMessage({
  carTitle,
  carUrl,
  lang,
}: Pick<BuildCarWhatsAppUrlOptions, "carTitle" | "carUrl" | "lang">): string {
  const title = carTitle.trim() || (lang === "ar" ? "سيارة" : "a car");

  const intro =
    lang === "ar"
      ? `مرحبا، أريد الاستفسار عن السيارة: ${title}`
      : `Hi, I'm interested in this car: ${title}`;

  return carUrl?.trim() ? `${intro}\n${carUrl.trim()}` : intro;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalizedPhone = normalizeWhatsAppPhone(phone) ?? getDefaultWhatsAppPhone();
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

/** Builds a wa.me link for a car inquiry with encoded message text. */
export function buildCarWhatsAppUrl(options: BuildCarWhatsAppUrlOptions): string {
  const phone = resolveCarWhatsAppPhone(options.whatsappNumber);
  const message = buildCarWhatsAppMessage(options);
  return buildWhatsAppUrl(phone, message);
}

/** Absolute car page URL for WhatsApp messages and sharing. */
export function buildCarPageUrl(slug: string): string {
  const path = `/cars/${encodeURIComponent(slug)}`;
  const siteUrl = import.meta.env.VITE_SITE_URL?.trim().replace(/\/+$/, "");

  if (siteUrl) return `${siteUrl}${path}`;
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  return path;
}
