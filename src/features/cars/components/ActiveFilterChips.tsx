import { X } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import type { CarFilterOption, CarFilters, CarStatus, CarsSearchParams } from "@/lib/api/types";
import { resolveLocalized } from "@/lib/api/types";
import { countActiveFilters } from "@/features/cars/filter-search";
import type { Lang } from "@/lib/i18n";

type Bilingual = { ar: string; en: string };

type Props = {
  search: CarsSearchParams;
  filterMeta?: CarFilters;
  onRemove: (patch: Partial<CarsSearchParams>) => void;
  onClearAll: () => void;
};

const SELECT_FILTERS: Array<{
  key: keyof CarsSearchParams;
  metaKey: keyof CarFilters;
  label: Bilingual;
}> = [
  { key: "brand", metaKey: "brands", label: t.cars.labels.brand },
  { key: "model", metaKey: "models", label: t.cars.labels.model },
  { key: "body_type", metaKey: "body_types", label: t.cars.filters.bodyType },
  { key: "color", metaKey: "colors", label: t.cars.labels.color },
  { key: "origin", metaKey: "origins", label: t.cars.labels.origin },
  { key: "transmission", metaKey: "transmissions", label: t.cars.filters.transmission },
  { key: "fuel_type", metaKey: "fuel_types", label: t.cars.filters.fuelType },
  { key: "condition", metaKey: "conditions", label: t.cars.filters.condition },
  { key: "city", metaKey: "cities", label: t.cars.labels.city },
];

function resolveOptionLabel(
  options: CarFilterOption[] | undefined,
  value: string,
  lang: Lang,
): string {
  const match = options?.find((o) => o.value === value);
  return resolveLocalized(match?.label, lang) || value;
}

function Chip({
  text,
  onRemove,
  ariaLabel,
}: {
  text: string;
  onRemove: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={ariaLabel}
      className="group inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 ps-3 pe-2 py-1.5 text-xs text-foreground hover:border-primary hover:bg-primary/25 transition-colors"
    >
      <span className="font-medium">{text}</span>
      <X
        className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors"
        aria-hidden
      />
    </button>
  );
}

export function ActiveFilterChips({ search, filterMeta, onRemove, onClearAll }: Props) {
  const { lang, tr } = useTr();

  if (countActiveFilters(search) === 0) return null;

  const num = (n: number) => new Intl.NumberFormat(lang === "ar" ? "ar-SY" : "en-US").format(n);

  const chips: Array<{ id: string; text: string; clear: Partial<CarsSearchParams> }> = [];

  for (const { key, metaKey, label } of SELECT_FILTERS) {
    const value = search[key];
    if (value === undefined || value === null || value === "") continue;
    const options = filterMeta?.[metaKey] as CarFilterOption[] | undefined;
    const display = resolveOptionLabel(options, String(value), lang);
    chips.push({ id: key, text: `${tr(label)}: ${display}`, clear: { [key]: undefined } });
  }

  if (search.status) {
    chips.push({
      id: "status",
      text: `${tr(t.cars.filters.status)}: ${tr(t.cars.status[search.status as CarStatus])}`,
      clear: { status: undefined },
    });
  }

  const ranges: Array<{
    id: string;
    label: Bilingual;
    min?: number;
    max?: number;
    format: (n: number) => string;
    clear: Partial<CarsSearchParams>;
  }> = [
    {
      id: "year",
      label: t.cars.labels.year,
      min: search.year_min,
      max: search.year_max,
      format: (n) => String(n),
      clear: { year_min: undefined, year_max: undefined },
    },
    {
      id: "price",
      label: t.cars.labels.price,
      min: search.price_min,
      max: search.price_max,
      format: num,
      clear: { price_min: undefined, price_max: undefined },
    },
    {
      id: "mileage",
      label: t.cars.labels.mileage,
      min: search.mileage_min,
      max: search.mileage_max,
      format: num,
      clear: { mileage_min: undefined, mileage_max: undefined },
    },
  ];

  for (const r of ranges) {
    if (r.min == null && r.max == null) continue;
    const from = r.min != null ? r.format(r.min) : "…";
    const to = r.max != null ? r.format(r.max) : "…";
    chips.push({ id: r.id, text: `${tr(r.label)}: ${from} – ${to}`, clear: r.clear });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          text={chip.text}
          ariaLabel={`${tr(t.cars.clearAll)}: ${chip.text}`}
          onRemove={() => onRemove(chip.clear)}
        />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-rose-400 transition-colors"
      >
        {tr(t.cars.clearAll)}
      </button>
    </div>
  );
}
