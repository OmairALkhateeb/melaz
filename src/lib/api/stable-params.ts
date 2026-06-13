import type { CarFiltersParams, CarsListParams } from "./types";

/** Stable, sorted params object for React Query cache keys. */
export function stableQueryParams<T extends Record<string, unknown>>(params?: T): T {
  if (!params) return {} as T;

  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  entries.sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(entries) as T;
}

export function stableCarsListParams(params?: CarsListParams): CarsListParams {
  return stableQueryParams((params ?? {}) as Record<string, unknown>) as CarsListParams;
}

export function stableCarFiltersParams(params?: CarFiltersParams): CarFiltersParams {
  return stableQueryParams((params ?? {}) as Record<string, unknown>) as CarFiltersParams;
}
