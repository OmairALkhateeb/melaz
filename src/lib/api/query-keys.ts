import type { CarFiltersParams, CarsListParams } from "./types";
import { stableCarFiltersParams, stableCarsListParams } from "./stable-params";

export const carQueryKeys = {
  all: ["cars"] as const,
  lists: () => [...carQueryKeys.all, "list"] as const,
  list: (params?: CarsListParams) =>
    [...carQueryKeys.lists(), stableCarsListParams(params)] as const,
  details: () => [...carQueryKeys.all, "detail"] as const,
  detail: (slug: string) => [...carQueryKeys.details(), slug] as const,
  filters: (params?: CarFiltersParams) =>
    [...carQueryKeys.all, "filters", stableCarFiltersParams(params)] as const,
};
