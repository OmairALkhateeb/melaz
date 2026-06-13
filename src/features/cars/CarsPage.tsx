import { useMemo, useCallback, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { SiteShell, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import {
  useCarsList,
  useCarFilters,
  getApiErrorMessage,
  isEmptyPaginated,
  type CarsSearchParams,
} from "@/lib/api";
import { DEFAULT_CAR_SORT, type CarSort } from "@/lib/api/types";
import { CARS_PER_PAGE } from "@/features/cars/utils";
import {
  carsSearchToListParams,
  countActiveFilters,
  hasActiveFilters,
} from "@/features/cars/filter-search";
import { useCarsSearchNavigation } from "@/features/cars/hooks/useCarsSearchNavigation";
import { CarsGrid } from "./components/CarsGrid";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { CarsPagination } from "./components/CarsPagination";
import { CarsToolbar } from "./components/CarsToolbar";
import { ActiveFilterChips } from "./components/ActiveFilterChips";
import { CarsSidebar } from "./components/filters/CarsSidebar";
import { FiltersModal } from "./components/filters/FiltersModal";
import { cn } from "@/lib/utils";

type CarsPageProps = {
  search: CarsSearchParams;
};

export function CarsPage({ search }: CarsPageProps) {
  const { lang, tr } = useTr();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { applySearch, replaceSearch, resetFilters } = useCarsSearchNavigation();

  const listParams = useMemo(() => carsSearchToListParams(search, CARS_PER_PAGE), [search]);

  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } =
    useCarsList(listParams);

  // Shared filter metadata for the desktop sidebar and the active-filter chips.
  const filterParams = useMemo(
    () => (search.brand ? { brand: search.brand } : undefined),
    [search.brand],
  );
  const { data: filterMeta, isLoading: isMetaLoading } = useCarFilters(filterParams);

  const handleApplyFilters = useCallback(
    (next: CarsSearchParams) => replaceSearch(next),
    [replaceSearch],
  );

  const meta = data?.meta;
  const hasCars = data && !isEmptyPaginated(data);
  const isInitialLoading = isLoading && !data;
  const isRefetching = isFetching && !isInitialLoading;
  const showEmpty = !isInitialLoading && !isError && !hasCars;
  const filtersActive = hasActiveFilters(search);
  const activeFilterCount = countActiveFilters(search);
  const currentSort: CarSort = search.sort ?? DEFAULT_CAR_SORT;

  return (
    <SiteShell>
      <section className="relative pt-32 pb-16 lg:pt-40" aria-labelledby="cars-page-title">
        <div className="container mx-auto px-4 sm:px-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-glow transition-colors mb-6"
          >
            <ArrowLeft className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
            {tr(t.cars.backHome)}
          </Link>

          <Reveal>
            <h1 id="cars-page-title" className="text-3xl md:text-4xl font-bold text-gradient">
              {tr(t.cars.title)}
            </h1>
            <p className="mt-2 text-muted-foreground">{tr(t.cars.subtitle)}</p>
          </Reveal>

          <div className="mt-8 grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <CarsSidebar
                search={search}
                filterMeta={filterMeta}
                isMetaLoading={isMetaLoading}
                onChange={applySearch}
                onReset={resetFilters}
              />
            </aside>

            {/* Results column */}
            <div className="min-w-0">
              <CarsToolbar
                total={meta?.total}
                sort={currentSort}
                onSortChange={(sort) => applySearch({ sort })}
                onOpenFilters={() => setFiltersOpen(true)}
                activeCount={activeFilterCount}
              />

              <div className="mt-4">
                <ActiveFilterChips
                  search={search}
                  filterMeta={filterMeta}
                  onRemove={applySearch}
                  onClearAll={resetFilters}
                />
              </div>

              <div
                className={cn(
                  "mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground transition-opacity",
                  isRefetching ? "opacity-100" : "opacity-0 pointer-events-none h-0",
                )}
                aria-live="polite"
                aria-busy={isRefetching}
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-glow" aria-hidden />
                {lang === "ar" ? "جاري التحديث..." : "Updating..."}
              </div>

              <div className="relative mt-2" aria-busy={isRefetching}>
                {isInitialLoading ? (
                  <LoadingSkeleton count={CARS_PER_PAGE} />
                ) : isError ? (
                  <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
                ) : showEmpty ? (
                  <EmptyState onClearFilters={filtersActive ? resetFilters : undefined} />
                ) : (
                  <>
                    <div
                      className={cn(
                        "transition-opacity duration-200",
                        isRefetching && "opacity-70",
                      )}
                    >
                      <CarsGrid cars={data!.data} />
                    </div>

                    {meta && meta.last_page > 1 && (
                      <CarsPagination
                        search={search}
                        currentPage={meta.current_page}
                        lastPage={meta.last_page}
                        isFetching={isRefetching}
                      />
                    )}

                    {isPlaceholderData && isRefetching && (
                      <span className="sr-only">
                        {lang === "ar" ? "جاري تحميل نتائج جديدة" : "Loading new results"}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile filters (bottom sheet style modal) */}
        <FiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          search={search}
          onApply={handleApplyFilters}
          onReset={resetFilters}
        />
      </section>
    </SiteShell>
  );
}
