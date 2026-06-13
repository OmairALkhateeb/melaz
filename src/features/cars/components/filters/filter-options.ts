import type { Lang } from "@/lib/i18n";
import type { CarFilterOption, CarFilters } from "@/lib/api/types";
import { resolveLocalized } from "@/lib/api/types";
import type { FilterSelectOption } from "./FilterSelect";

export function mapFilterOptions(
  options: CarFilterOption[] | undefined,
  lang: Lang,
): FilterSelectOption[] {
  if (!options?.length) return [];

  return options.map((option) => ({
    value: option.value,
    label: resolveLocalized(option.label, lang) || option.value,
  }));
}

/** Builds select options from API metadata with localized labels. */
export function buildFilterSelectOptions(
  filterMeta: CarFilters | undefined,
  key: keyof CarFilters,
  lang: Lang,
): FilterSelectOption[] {
  const raw = filterMeta?.[key];
  if (!Array.isArray(raw)) return [];
  return mapFilterOptions(raw as CarFilterOption[], lang);
}
