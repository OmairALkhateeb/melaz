import { useCallback, useMemo } from "react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import type { CarFilters, CarSort, CarsSearchParams, CarStatus } from "@/lib/api/types";
import { CAR_SORT_VALUES, CAR_STATUS_VALUES, DEFAULT_CAR_SORT } from "@/lib/api/types";
import { FilterField } from "./FilterField";
import { FilterSelect } from "./FilterSelect";
import { FilterRangeInputs } from "./FilterRangeInputs";
import { buildFilterSelectOptions } from "./filter-options";

type FilterFormProps = {
  values: CarsSearchParams;
  onChange: (patch: Partial<CarsSearchParams>) => void;
  filterMeta?: CarFilters;
  isMetaLoading?: boolean;
  /** Debounce range inputs (price/year/mileage) — use for live desktop sidebar. */
  rangeDebounceMs?: number;
};

export function FilterForm({
  values,
  onChange,
  filterMeta,
  isMetaLoading,
  rangeDebounceMs,
}: FilterFormProps) {
  const { lang, tr } = useTr();

  const sortOptions = useMemo(
    () =>
      CAR_SORT_VALUES.map((value) => ({
        value,
        label: tr(t.cars.filters.sortOptions[value as CarSort]),
      })),
    [tr],
  );

  const statusOptions = useMemo(
    () =>
      CAR_STATUS_VALUES.map((value) => ({
        value,
        label: tr(t.cars.status[value as CarStatus]),
      })),
    [tr],
  );

  const brandOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "brands", lang),
    [filterMeta, lang],
  );
  const modelOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "models", lang),
    [filterMeta, lang],
  );
  const bodyTypeOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "body_types", lang),
    [filterMeta, lang],
  );
  const colorOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "colors", lang),
    [filterMeta, lang],
  );
  const originOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "origins", lang),
    [filterMeta, lang],
  );
  const transmissionOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "transmissions", lang),
    [filterMeta, lang],
  );
  const fuelTypeOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "fuel_types", lang),
    [filterMeta, lang],
  );
  const conditionOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "conditions", lang),
    [filterMeta, lang],
  );
  const cityOptions = useMemo(
    () => buildFilterSelectOptions(filterMeta, "cities", lang),
    [filterMeta, lang],
  );

  const handleBrandChange = useCallback(
    (brand: string | undefined) => {
      onChange({ brand, model: undefined });
    },
    [onChange],
  );

  return (
    <div className="space-y-5">
      <FilterField label={tr(t.cars.filters.sort)} htmlFor="car-sort">
        <FilterSelect
          id="car-sort"
          value={values.sort ?? DEFAULT_CAR_SORT}
          placeholder={tr(t.cars.filters.all)}
          options={sortOptions}
          onChange={(sort) =>
            onChange({
              sort: !sort || sort === DEFAULT_CAR_SORT ? undefined : (sort as CarSort),
            })
          }
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.filters.status)} htmlFor="car-status">
        <FilterSelect
          id="car-status"
          value={values.status}
          placeholder={tr(t.cars.filters.allStatuses)}
          options={statusOptions}
          onChange={(status) => onChange({ status: status as CarStatus | undefined })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.brand)} htmlFor="car-brand">
        <FilterSelect
          id="car-brand"
          value={values.brand}
          placeholder={tr(t.cars.filters.allBrands)}
          options={brandOptions}
          onChange={handleBrandChange}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.model)} htmlFor="car-model">
        <FilterSelect
          id="car-model"
          value={values.model}
          placeholder={tr(t.cars.filters.allModels)}
          options={modelOptions}
          onChange={(model) => onChange({ model })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.filters.bodyType)} htmlFor="car-body-type">
        <FilterSelect
          id="car-body-type"
          value={values.body_type}
          placeholder={tr(t.cars.filters.allBodyTypes)}
          options={bodyTypeOptions}
          onChange={(body_type) => onChange({ body_type })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.color)} htmlFor="car-color">
        <FilterSelect
          id="car-color"
          value={values.color}
          placeholder={tr(t.cars.filters.allColors)}
          options={colorOptions}
          onChange={(color) => onChange({ color })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.year)}>
        <FilterRangeInputs
          minId="car-year-min"
          maxId="car-year-max"
          minValue={values.year_min}
          maxValue={values.year_max}
          minPlaceholder={String(filterMeta?.years?.min ?? tr(t.cars.filters.min))}
          maxPlaceholder={String(filterMeta?.years?.max ?? tr(t.cars.filters.max))}
          onMinChange={(year_min) => onChange({ year_min })}
          onMaxChange={(year_max) => onChange({ year_max })}
          debounceMs={rangeDebounceMs}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.price)}>
        <FilterRangeInputs
          minId="car-price-min"
          maxId="car-price-max"
          minValue={values.price_min}
          maxValue={values.price_max}
          minPlaceholder={String(filterMeta?.prices?.min ?? tr(t.cars.filters.min))}
          maxPlaceholder={String(filterMeta?.prices?.max ?? tr(t.cars.filters.max))}
          onMinChange={(price_min) => onChange({ price_min })}
          onMaxChange={(price_max) => onChange({ price_max })}
          debounceMs={rangeDebounceMs}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.origin)} htmlFor="car-origin">
        <FilterSelect
          id="car-origin"
          value={values.origin}
          placeholder={tr(t.cars.filters.allOrigins)}
          options={originOptions}
          onChange={(origin) => onChange({ origin })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.mileage)}>
        <FilterRangeInputs
          minId="car-mileage-min"
          maxId="car-mileage-max"
          minValue={values.mileage_min}
          maxValue={values.mileage_max}
          minPlaceholder={String(filterMeta?.mileage?.min ?? tr(t.cars.filters.min))}
          maxPlaceholder={String(filterMeta?.mileage?.max ?? tr(t.cars.filters.max))}
          onMinChange={(mileage_min) => onChange({ mileage_min })}
          onMaxChange={(mileage_max) => onChange({ mileage_max })}
          debounceMs={rangeDebounceMs}
        />
      </FilterField>

      <FilterField label={tr(t.cars.filters.transmission)} htmlFor="car-transmission">
        <FilterSelect
          id="car-transmission"
          value={values.transmission}
          placeholder={tr(t.cars.filters.allTransmissions)}
          options={transmissionOptions}
          onChange={(transmission) => onChange({ transmission })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.filters.fuelType)} htmlFor="car-fuel-type">
        <FilterSelect
          id="car-fuel-type"
          value={values.fuel_type}
          placeholder={tr(t.cars.filters.allFuelTypes)}
          options={fuelTypeOptions}
          onChange={(fuel_type) => onChange({ fuel_type })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.filters.condition)} htmlFor="car-condition">
        <FilterSelect
          id="car-condition"
          value={values.condition}
          placeholder={tr(t.cars.filters.allConditions)}
          options={conditionOptions}
          onChange={(condition) => onChange({ condition })}
          disabled={isMetaLoading}
        />
      </FilterField>

      <FilterField label={tr(t.cars.labels.city)} htmlFor="car-city">
        <FilterSelect
          id="car-city"
          value={values.city}
          placeholder={tr(t.cars.filters.allCities)}
          options={cityOptions}
          onChange={(city) => onChange({ city })}
          disabled={isMetaLoading}
        />
      </FilterField>
    </div>
  );
}
