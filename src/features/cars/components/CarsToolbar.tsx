import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { CAR_SORT_VALUES, DEFAULT_CAR_SORT, type CarSort } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type CarsToolbarProps = {
  total?: number;
  sort: CarSort;
  onSortChange: (sort: CarSort) => void;
  onOpenFilters: () => void;
  activeCount: number;
};

export function CarsToolbar({
  total,
  sort,
  onSortChange,
  onOpenFilters,
  activeCount,
}: CarsToolbarProps) {
  const { lang, tr } = useTr();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Mobile filters trigger */}
        <button
          type="button"
          onClick={onOpenFilters}
          aria-haspopup="dialog"
          className={cn(
            "lg:hidden inline-flex items-center gap-2 rounded-full glass border h-10 px-4 text-sm font-medium transition-colors",
            activeCount > 0
              ? "border-primary/50 text-foreground"
              : "border-border text-muted-foreground",
          )}
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden />
          {tr(t.cars.filtersTitle)}
          {activeCount > 0 && (
            <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
              {activeCount}
            </span>
          )}
        </button>

        {total != null && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="text-foreground font-semibold">{total}</span> {tr(t.cars.resultsCount)}
          </p>
        )}
      </div>

      {/* Sort */}
      <label className="inline-flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-primary-glow" aria-hidden />
        <span className="sr-only">{tr(t.cars.filters.sort)}</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as CarSort)}
          aria-label={tr(t.cars.filters.sort)}
          className="h-10 rounded-full bg-background/60 border border-border ps-3 pe-8 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary cursor-pointer appearance-none"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {CAR_SORT_VALUES.map((value) => (
            <option key={value} value={value}>
              {tr(t.cars.filters.sortOptions[value])}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export { DEFAULT_CAR_SORT };
