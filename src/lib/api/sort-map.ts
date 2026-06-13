import { DEFAULT_CAR_SORT, type CarSort } from "./types";

/** Frontend URL sort values → Laravel API sort query values. */
const SORT_TO_API: Record<CarSort, string> = {
  newest: "newest",
  oldest: "oldest",
  price_asc: "price_low",
  price_desc: "price_high",
  mileage_asc: "mileage_low",
  mileage_desc: "mileage_high",
  year_desc: "year_new",
  year_asc: "year_old",
};

export function mapSortToApi(sort?: CarSort): string {
  if (!sort) return SORT_TO_API[DEFAULT_CAR_SORT];
  return SORT_TO_API[sort] ?? SORT_TO_API[DEFAULT_CAR_SORT];
}
