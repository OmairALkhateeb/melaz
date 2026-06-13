import { resolveMediaUrl } from "./media";
import type { Car, CarImage, CarsListResponse } from "./types";

type RawCarRecord = Car & {
  primary_image?: { url?: string | null; alt?: string | null } | null;
};

type RawCarImage = CarImage & {
  alt_text?: string | null;
};

function normalizeCarImage(image: RawCarImage): CarImage {
  return {
    ...image,
    alt: image.alt ?? image.alt_text ?? null,
    url: resolveMediaUrl(image.url) ?? image.url,
  };
}

function resolveFeaturedImage(car: RawCarRecord): string | null | undefined {
  if (car.featured_image) {
    return resolveMediaUrl(car.featured_image) ?? car.featured_image;
  }

  const primaryUrl = car.primary_image?.url;
  if (primaryUrl) {
    return resolveMediaUrl(primaryUrl) ?? primaryUrl;
  }

  const primaryFromImages = car.images?.find((img) => img.is_primary)?.url;
  if (primaryFromImages) {
    return resolveMediaUrl(primaryFromImages) ?? primaryFromImages;
  }

  return car.images?.[0]?.url
    ? resolveMediaUrl(car.images[0].url) ?? car.images[0].url
    : undefined;
}

/** Ensures image fields are absolute URLs ready for <img src>. */
export function normalizeCar(car: Car): Car {
  const raw = car as RawCarRecord;

  return {
    ...car,
    featured_image: resolveFeaturedImage(raw),
    images: car.images?.map((image) => normalizeCarImage(image as RawCarImage)),
  };
}

export function normalizeCarsList(response: CarsListResponse): CarsListResponse {
  return {
    ...response,
    data: (response.data ?? []).map(normalizeCar),
  };
}
