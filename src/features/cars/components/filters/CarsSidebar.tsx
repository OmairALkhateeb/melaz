import { SlidersHorizontal } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import type { CarFilters, CarsSearchParams } from "@/lib/api/types";
import { countActiveFilters } from "@/features/cars/filter-search";
import { FilterForm } from "./FilterForm";

type CarsSidebarProps = {
  search: CarsSearchParams;
  filterMeta?: CarFilters;
  isMetaLoading?: boolean;
  /** Live-applied on each change (debounced for range inputs). */
  onChange: (patch: Partial<CarsSearchParams>) => void;
  onReset: () => void;
};

export function CarsSidebar({
  search,
  filterMeta,
  isMetaLoading,
  onChange,
  onReset,
}: CarsSidebarProps) {
  const { tr } = useTr();
  const activeCount = countActiveFilters(search);

  return (
    <div className="glass rounded-2xl p-5 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain">
      <div className="flex items-center justify-between gap-2 mb-5">
        <h2 className="text-base font-bold text-foreground inline-flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary-glow" aria-hidden />
          {tr(t.cars.filtersTitle)}
          {activeCount > 0 && (
            <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-rose-400 transition-colors"
          >
            {tr(t.cars.clearAll)}
          </button>
        )}
      </div>

      <FilterForm
        values={search}
        onChange={onChange}
        filterMeta={filterMeta}
        isMetaLoading={isMetaLoading}
        rangeDebounceMs={500}
      />
    </div>
  );
}
