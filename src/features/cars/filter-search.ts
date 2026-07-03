import { z } from "zod";
import {
  CAR_SORT_VALUES,
  CAR_STATUS_VALUES,
  DEFAULT_CAR_SORT,
  type CarsListParams,
  type CarsSearchParams,
} from "@/lib/api/types";

const optionalTrimmedString = z
  .union([z.string(), z.number()])
  .optional()
  .catch(undefined)
  .transform((value) => {
    if (value === undefined) return undefined;
    const trimmed = String(value).trim();
    return trimmed.length ? trimmed : undefined;
  });

const optionalPositiveInt = z
  .union([z.coerce.number().int().positive(), z.literal(""), z.null(), z.undefined()])
  .optional()
  .catch(undefined)
  .transform((value) => {
    if (value === "" || value === null || value === undefined || Number.isNaN(value)) {
      return undefined;
    }
    return value;
  });

const optionalNonNegativeInt = z
  .union([z.coerce.number().int().min(0), z.literal(""), z.null(), z.undefined()])
  .optional()
  .catch(undefined)
  .transform((value) => {
    if (value === "" || value === null || value === undefined || Number.isNaN(value)) {
      return undefined;
    }
    return value;
  });

/** Validates and normalizes /cars URL search params. */
export const carsSearchSchema = z.object({
  page: optionalPositiveInt,
  search: optionalTrimmedString,
  brand: optionalTrimmedString,
  model: optionalTrimmedString,
  body_type: optionalTrimmedString,
  color: optionalTrimmedString,
  year_min: optionalNonNegativeInt,
  year_max: optionalNonNegativeInt,
  price_min: optionalNonNegativeInt,
  price_max: optionalNonNegativeInt,
  origin: optionalTrimmedString,
  mileage_min: optionalNonNegativeInt,
  mileage_max: optionalNonNegativeInt,
  transmission: optionalTrimmedString,
  fuel_type: optionalTrimmedString,
  condition: optionalTrimmedString,
  city: optionalTrimmedString,
  sort: z.enum(CAR_SORT_VALUES).optional().catch(undefined),
  status: z.enum(CAR_STATUS_VALUES).optional().catch(undefined),
});

export function parseCarsSearch(raw: unknown): CarsSearchParams {
  return carsSearchSchema.parse(raw ?? {});
}

/** Removes empty values and default sort/page for clean shareable URLs. */
export function cleanCarsSearch(params: CarsSearchParams): CarsSearchParams {
  const cleaned: CarsSearchParams = {};

  for (const [key, value] of Object.entries(params) as [keyof CarsSearchParams, unknown][]) {
    if (value === undefined || value === null || value === "") continue;
    cleaned[key] = value as never;
  }

  if (!cleaned.page || cleaned.page <= 1) delete cleaned.page;
  if (!cleaned.sort || cleaned.sort === DEFAULT_CAR_SORT) delete cleaned.sort;

  return cleaned;
}

/**
 * Price tolerance (USD): the user picks a range, but cars priced up to this
 * much below the minimum or above the maximum are still considered a match.
 * Requested behaviour: "أقل بألف دولار وأغلى بألف دولار مقبول".
 */
export const PRICE_TOLERANCE = 1000;

/** Maps URL search state to GET /api/cars query params. */
export function carsSearchToListParams(search: CarsSearchParams, perPage: number): CarsListParams {
  const params: CarsListParams = {
    page: search.page ?? 1,
    per_page: perPage,
    sort: search.sort ?? DEFAULT_CAR_SORT,
  };

  const copyKeys = [
    "search",
    "brand",
    "model",
    "body_type",
    "color",
    "year_min",
    "year_max",
    "origin",
    "mileage_min",
    "mileage_max",
    "transmission",
    "fuel_type",
    "condition",
    "city",
    "status",
  ] as const satisfies ReadonlyArray<keyof CarsSearchParams & keyof CarsListParams>;

  for (const key of copyKeys) {
    const value = search[key];
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value as never;
    }
  }

  // Price bounds get a ±PRICE_TOLERANCE cushion so near-range cars show up.
  if (search.price_min !== undefined && search.price_min !== null) {
    params.price_min = Math.max(0, search.price_min - PRICE_TOLERANCE);
  }
  if (search.price_max !== undefined && search.price_max !== null) {
    params.price_max = search.price_max + PRICE_TOLERANCE;
  }

  return params;
}

const FILTER_KEYS = [
  "search",
  "brand",
  "model",
  "body_type",
  "color",
  "year_min",
  "year_max",
  "price_min",
  "price_max",
  "origin",
  "mileage_min",
  "mileage_max",
  "transmission",
  "fuel_type",
  "condition",
  "city",
  "status",
  "sort",
] as const satisfies ReadonlyArray<keyof CarsSearchParams>;

export function countActiveFilters(search: CarsSearchParams): number {
  let count = 0;
  for (const key of FILTER_KEYS) {
    const value = search[key];
    if (value === undefined || value === null || value === "") continue;
    if (key === "sort" && value === DEFAULT_CAR_SORT) continue;
    count += 1;
  }
  return count;
}

export function hasActiveFilters(search: CarsSearchParams): boolean {
  return countActiveFilters(search) > 0;
}

export const EMPTY_CARS_SEARCH: CarsSearchParams = {};
