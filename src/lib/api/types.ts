import type { Lang } from "@/lib/i18n";

/** A plain string or bilingual object from the Laravel API. */
export type LocalizedString = string | { ar?: string; en?: string };

export interface CarImage {
  id?: number;
  url: string;
  alt?: string | null;
  is_primary?: boolean;
  sort_order?: number;
}

export interface Car {
  id: number;
  slug: string;
  title: LocalizedString;
  brand?: string | null;
  model?: string | null;
  trim?: string | null;
  year?: number | null;
  price?: number | null;
  currency?: string | null;
  mileage?: number | null;
  fuel_type?: string | null;
  transmission?: string | null;
  body_type?: string | null;
  color?: string | null;
  origin?: string | null;
  city?: string | null;
  engine_size?: string | null;
  drivetrain?: string | null;
  condition?: string | null;
  whatsapp_number?: string | null;
  location?: string | null;
  status?: string | null;
  status_label?: string | null;
  is_featured?: boolean | null;
  featured_image?: string | null;
  images?: CarImage[];
  description?: LocalizedString | null;
  specs?: Record<string, string | number | boolean | null> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CarFilterOption {
  value: string;
  label?: LocalizedString;
  count?: number;
}

export interface CarFilterRange {
  min: number;
  max: number;
}

export interface CarFilters {
  brands?: CarFilterOption[];
  models?: CarFilterOption[];
  fuel_types?: CarFilterOption[];
  transmissions?: CarFilterOption[];
  body_types?: CarFilterOption[];
  colors?: CarFilterOption[];
  origins?: CarFilterOption[];
  cities?: CarFilterOption[];
  conditions?: CarFilterOption[];
  years?: CarFilterRange;
  prices?: CarFilterRange;
  mileage?: CarFilterRange;
}

export const CAR_SORT_VALUES = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "mileage_asc",
  "mileage_desc",
  "year_desc",
  "year_asc",
] as const;

export type CarSort = (typeof CAR_SORT_VALUES)[number];

export const CAR_STATUS_VALUES = ["available", "sold"] as const;
export type CarStatus = (typeof CAR_STATUS_VALUES)[number];

export const DEFAULT_CAR_SORT: CarSort = "newest";

/** URL search params for /cars — shareable filter state */
export interface CarsSearchParams {
  page?: number;
  search?: string;
  brand?: string;
  model?: string;
  body_type?: string;
  color?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  origin?: string;
  mileage_min?: number;
  mileage_max?: number;
  transmission?: string;
  fuel_type?: string;
  condition?: string;
  city?: string;
  sort?: CarSort;
  status?: CarStatus;
}

/** Query params accepted by GET /api/cars */
export interface CarsListParams {
  page?: number;
  per_page?: number;
  sort?: string;
  search?: string;
  brand?: string;
  model?: string;
  body_type?: string;
  color?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  origin?: string;
  mileage_min?: number;
  mileage_max?: number;
  transmission?: string;
  fuel_type?: string;
  condition?: string;
  city?: string;
  is_featured?: boolean;
  status?: CarStatus;
}

export interface CarFiltersParams {
  brand?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface PaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links?: PaginationLinks;
}

export type CarsListResponse = PaginatedResponse<Car>;

/** Resolved view-model helpers */
export function resolveLocalized(
  value: LocalizedString | null | undefined,
  lang: Lang,
  fallback = "",
): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  return value[lang] ?? value.en ?? value.ar ?? fallback;
}

export function isEmptyPaginated<T>(response: PaginatedResponse<T> | undefined | null): boolean {
  return !response?.data?.length;
}
