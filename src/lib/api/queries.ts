import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { getCarBySlug, getCarFilters, getCars } from "./cars";
import { carQueryKeys } from "./query-keys";
import { stableCarsListParams } from "./stable-params";
import type { Car, CarFiltersParams, CarsListParams, CarsListResponse } from "./types";

const STALE_TIME_LIST_MS = 1000 * 60 * 2;
const STALE_TIME_DETAIL_MS = 1000 * 60 * 5;
const STALE_TIME_FILTERS_MS = 1000 * 60 * 10;
const GC_TIME_MS = 1000 * 60 * 15;

export function carsListQueryOptions(params?: CarsListParams) {
  const stable = stableCarsListParams(params);

  return queryOptions({
    queryKey: carQueryKeys.list(stable),
    queryFn: ({ signal }) => getCars(stable, signal),
    staleTime: STALE_TIME_LIST_MS,
    gcTime: GC_TIME_MS,
    placeholderData: keepPreviousData,
  });
}

export function carDetailQueryOptions(slug: string) {
  return queryOptions({
    queryKey: carQueryKeys.detail(slug),
    queryFn: ({ signal }) => getCarBySlug(slug, signal),
    staleTime: STALE_TIME_DETAIL_MS,
    gcTime: GC_TIME_MS,
    enabled: Boolean(slug?.trim()),
  });
}

export function carFiltersQueryOptions(params?: CarFiltersParams) {
  return queryOptions({
    queryKey: carQueryKeys.filters(params),
    queryFn: ({ signal }) => getCarFilters(params, signal),
    staleTime: STALE_TIME_FILTERS_MS,
    gcTime: GC_TIME_MS,
  });
}

/** Paginated cars listing — keeps previous page visible while refetching.
 * Pass initialData from the route loader so SSR and the first client render match. */
export function useCarsList(params?: CarsListParams, options?: { initialData?: CarsListResponse }) {
  return useQuery({
    ...carsListQueryOptions(params),
    initialData: options?.initialData,
    initialDataUpdatedAt: options?.initialData ? Date.now() : undefined,
  });
}

/** Single car by slug. Pass initialData from route loader to avoid loading flash. */
export function useCar(slug: string, options?: { initialData?: Car; enabled?: boolean }) {
  return useQuery({
    ...carDetailQueryOptions(slug),
    initialData: options?.initialData,
    initialDataUpdatedAt: options?.initialData ? Date.now() : undefined,
    enabled: (options?.enabled ?? true) && Boolean(slug?.trim()),
  });
}

/** Filter metadata for the listing page. Pass brand to refresh dependent model options. */
export function useCarFilters(params?: CarFiltersParams, options?: { enabled?: boolean }) {
  return useQuery({
    ...carFiltersQueryOptions(params),
    enabled: options?.enabled ?? true,
  });
}

/** Featured cars for the homepage carousel (is_featured + newest first). */
export function featuredCarsQueryOptions(limit = 8) {
  const params = stableCarsListParams({ is_featured: true, sort: "newest", per_page: limit });

  return queryOptions({
    queryKey: [...carQueryKeys.list(params), "featured"] as const,
    queryFn: ({ signal }) => getCars(params, signal),
    staleTime: STALE_TIME_LIST_MS,
    gcTime: GC_TIME_MS,
  });
}

export function useFeaturedCars(limit = 8) {
  return useQuery(featuredCarsQueryOptions(limit));
}

/** Latest published cars for the homepage "new arrivals" row. */
export function latestCarsQueryOptions(limit = 8) {
  const params = stableCarsListParams({ sort: "newest", per_page: limit });

  return queryOptions({
    queryKey: [...carQueryKeys.list(params), "latest"] as const,
    queryFn: ({ signal }) => getCars(params, signal),
    staleTime: STALE_TIME_LIST_MS,
    gcTime: GC_TIME_MS,
  });
}

export function useLatestCars(limit = 8) {
  return useQuery(latestCarsQueryOptions(limit));
}

/** Related cars query — only when brand is known. */
export function relatedCarsQueryOptions(brand: string, excludeSlug: string) {
  const params = stableCarsListParams({ brand, per_page: 4 });

  return queryOptions({
    queryKey: [...carQueryKeys.list(params), "related", excludeSlug] as const,
    queryFn: ({ signal }) => getCars(params, signal),
    staleTime: STALE_TIME_LIST_MS,
    gcTime: GC_TIME_MS,
    enabled: Boolean(brand.trim()),
  });
}

export function useRelatedCars(brand: string | null | undefined, excludeSlug: string) {
  return useQuery(relatedCarsQueryOptions(brand ?? "", excludeSlug));
}
