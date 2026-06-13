import { apiGet } from "./client";
import { normalizeCar, normalizeCarsList } from "./normalize-car";
import { normalizeCarFilters } from "./normalize-filters";
import { mapSortToApi } from "./sort-map";
import { carResponseSchema, paginatedCarsSchema } from "./schemas";
import type {
  Car,
  CarFilters,
  CarFiltersParams,
  CarSort,
  CarsListParams,
  CarsListResponse,
} from "./types";

const CARS_PATH = "/api/cars";
const CAR_FILTERS_PATH = "/api/car-filters";

function parseOrThrow<T>(schema: { parse: (input: unknown) => T }, data: unknown, resource: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid API response";
    throw new Error(`Failed to parse ${resource}: ${message}`);
  }
}

/** GET /api/cars — paginated listing with optional filters. */
export async function getCars(params?: CarsListParams, signal?: AbortSignal): Promise<CarsListResponse> {
  const apiParams = params
    ? {
        ...params,
        sort: params.sort ? mapSortToApi(params.sort as CarSort) : undefined,
        // Laravel's `boolean` rule accepts 1/0 but rejects the strings
        // "true"/"false", so send a numeric flag the validator will accept.
        is_featured:
          params.is_featured === undefined ? undefined : params.is_featured ? 1 : 0,
      }
    : params;

  const raw = await apiGet<unknown>({
    path: CARS_PATH,
    params: apiParams as Record<string, string | number | boolean | null | undefined>,
    signal,
  });

  const parsed = parseOrThrow(paginatedCarsSchema, raw, "cars list");

  return normalizeCarsList({
    ...parsed,
    data: parsed.data ?? [],
  });
}

/** GET /api/cars/{slug} — single car by slug. */
export async function getCarBySlug(slug: string, signal?: AbortSignal): Promise<Car> {
  const trimmed = slug.trim();
  if (!trimmed) {
    throw new Error("Car slug is required");
  }

  const raw = await apiGet<unknown>({
    path: `${CARS_PATH}/${encodeURIComponent(trimmed)}`,
    signal,
  });

  const car = parseOrThrow(carResponseSchema, raw, `car "${trimmed}"`);
  return normalizeCar(car);
}

/** GET /api/car-filters — filter metadata for the listing UI. */
export async function getCarFilters(
  params?: CarFiltersParams,
  signal?: AbortSignal,
): Promise<CarFilters> {
  const raw = await apiGet<unknown>({
    path: CAR_FILTERS_PATH,
    params: params as Record<string, string | number | boolean | null | undefined>,
    signal,
  });

  const payload =
    raw && typeof raw === "object" && "data" in (raw as Record<string, unknown>)
      ? (raw as { data: unknown }).data
      : raw;

  return normalizeCarFilters(payload, params?.brand);
}
