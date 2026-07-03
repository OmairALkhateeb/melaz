import type { Lang } from "@/lib/i18n";
import type { Car } from "@/lib/api/types";
import { resolveLocalized } from "@/lib/api/types";

export const CARS_PER_PAGE = 12;

/** Resolves the route slug for car details — prefers slug, falls back to string id. */
export function getCarDetailSlug(car: Pick<Car, "slug" | "id">): string | null {
  const slug = car.slug?.trim();
  if (slug) return slug;
  if (car.id != null) return String(car.id);
  return null;
}

export function getCarTitle(car: Car, lang: Lang): string {
  const title = resolveLocalized(car.title, lang);
  if (title) return title;

  const parts = [car.brand, car.model, car.year?.toString()].filter(Boolean);
  return parts.join(" ") || car.slug;
}

export function getCarPrimaryImage(car: Car): string | null {
  if (car.featured_image) return car.featured_image;
  const primary = car.images?.find((img) => img.is_primary);
  if (primary?.url) return primary.url;
  return car.images?.[0]?.url ?? null;
}

export function getCarCity(car: Car): string | null {
  const record = car as unknown as Record<string, unknown>;
  const cityLabel = record.city_label;
  if (typeof cityLabel === "string" && cityLabel.trim()) return cityLabel.trim();
  return car.city ?? car.location ?? null;
}

export function formatCarPrice(
  price: number | null | undefined,
  currency: string | null | undefined,
  lang: Lang,
  onRequestLabel: string,
): string {
  if (price == null) return onRequestLabel;

  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-SY" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);

  const unit = currency?.trim() || (lang === "ar" ? "ل.س" : "SYP");
  return lang === "ar" ? `${formatted} ${unit}` : `${unit} ${formatted}`;
}

export function formatMileage(
  mileage: number | null | undefined,
  lang: Lang,
  unit: string,
): string | null {
  if (mileage == null) return null;
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-SY" : "en-US").format(mileage);
  return `${formatted} ${unit}`;
}

export function getStatusKey(status: string | null | undefined): string | null {
  if (!status) return null;
  const normalized = status.toLowerCase().replace(/\s+/g, "_");
  if (["available", "sold", "reserved", "pending"].includes(normalized)) return normalized;
  return null;
}

export function isCarSold(car: Pick<Car, "status">): boolean {
  return getStatusKey(car.status) === "sold";
}

/** Prefers API status_label, then i18n fallback from status key. */
export function getCarStatusLabel(
  car: Pick<Car, "status" | "status_label">,
  lang: Lang,
  fallbackLabels?: Record<string, { ar: string; en: string }>,
): string | null {
  if (car.status_label?.trim()) return car.status_label.trim();

  const key = getStatusKey(car.status);
  if (key && fallbackLabels?.[key]) return fallbackLabels[key][lang];

  return car.status?.trim() || null;
}

/** Reads a car field from top-level properties, localized labels, or nested specs. */
export function getCarField(car: Car, field: keyof Car, specKeys?: string[]): string | null {
  const record = car as unknown as Record<string, unknown>;
  const labelValue = record[`${String(field)}_label`];
  if (typeof labelValue === "string" && labelValue.trim()) {
    return labelValue.trim();
  }

  const direct = car[field];
  if (direct != null && typeof direct !== "object") {
    const text = String(direct).trim();
    if (text) return text;
  }

  const keys = specKeys ?? [String(field)];
  for (const key of keys) {
    const specValue = car.specs?.[key];
    if (specValue != null && specValue !== "") {
      return String(specValue);
    }
  }

  return null;
}

export type GalleryImage = {
  url: string;
  alt: string;
};

/** Builds a de-duplicated gallery list with accessible alt text. */
export function getCarGalleryImages(car: Car, lang: Lang): GalleryImage[] {
  const fallbackAlt = getCarTitle(car, lang);
  const seen = new Set<string>();
  const images: GalleryImage[] = [];

  const add = (url: string | null | undefined, alt?: string | null) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push({ url, alt: alt?.trim() || fallbackAlt });
  };

  const sorted = [...(car.images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  add(car.featured_image, fallbackAlt);
  for (const image of sorted) {
    add(image.url, image.alt ?? fallbackAlt);
  }

  return images;
}

export function getCarDescription(car: Car, lang: Lang): string | null {
  const description = resolveLocalized(car.description, lang).trim();
  return description || null;
}
