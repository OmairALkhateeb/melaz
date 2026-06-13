import type { CarFilterOption, CarFilterRange, CarFilters, LocalizedString } from "./types";

function normalizeOptionArray(value: unknown): CarFilterOption[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;

  const options: CarFilterOption[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (trimmed) options.push({ value: trimmed, label: trimmed });
      continue;
    }

    if (item && typeof item === "object" && "value" in item) {
      const record = item as { value: unknown; label?: LocalizedString; count?: number };
      const optionValue = String(record.value).trim();
      if (!optionValue) continue;
      options.push({
        value: optionValue,
        label: record.label,
        count: record.count,
      });
    }
  }

  return options.length ? options : undefined;
}

function normalizeRange(value: unknown): CarFilterRange | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as { min?: unknown; max?: unknown };
  const min = Number(record.min);
  const max = Number(record.max);
  if (Number.isNaN(min) || Number.isNaN(max)) return undefined;
  return { min, max };
}

function normalizeModels(
  modelsByBrand: unknown,
  brand?: string,
): CarFilterOption[] | undefined {
  if (!brand?.trim() || !modelsByBrand || typeof modelsByBrand !== "object") {
    return undefined;
  }

  const models = (modelsByBrand as Record<string, unknown>)[brand.trim()];
  return normalizeOptionArray(models);
}

/**
 * Maps Laravel /api/car-filters payload to the frontend CarFilters shape.
 */
export function normalizeCarFilters(raw: unknown, brand?: string): CarFilters {
  const data =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    brands: normalizeOptionArray(data.brands),
    models: normalizeModels(data.models_by_brand, brand) ?? normalizeOptionArray(data.models),
    body_types: normalizeOptionArray(data.body_types),
    colors: normalizeOptionArray(data.colors),
    origins: normalizeOptionArray(data.origins),
    transmissions: normalizeOptionArray(data.transmissions),
    fuel_types: normalizeOptionArray(data.fuel_types),
    conditions: normalizeOptionArray(data.conditions),
    cities: normalizeOptionArray(data.cities),
    years: normalizeRange(data.years ?? data.year_range),
    prices: normalizeRange(data.prices ?? data.price_range),
    mileage: normalizeRange(data.mileage ?? data.mileage_range),
  };
}
