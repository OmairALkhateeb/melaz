import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { useCarFilters } from "@/lib/api/queries";
import { mapFilterOptions } from "@/features/cars/components/filters/filter-options";
import { cleanCarsSearch } from "@/features/cars/filter-search";
import type { CarsSearchParams } from "@/lib/api/types";

const PRICE_STEPS = [5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000];

function HeroField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-start">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground px-1">
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "w-full h-11 rounded-xl bg-background/60 border border-border px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary appearance-none cursor-pointer";

export function HeroSearch() {
  const { lang, tr } = useTr();
  const navigate = useNavigate();
  const { data: filters } = useCarFilters();

  const [brand, setBrand] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const brandOptions = useMemo(
    () => mapFilterOptions(filters?.brands, lang),
    [filters?.brands, lang],
  );

  const years = useMemo(() => {
    const range = filters?.years;
    const max = range?.max ?? new Date().getFullYear();
    const min = range?.min ?? max - 25;
    const list: number[] = [];
    for (let y = max; y >= min; y--) list.push(y);
    return list;
  }, [filters?.years]);

  const priceSteps = useMemo(() => {
    const max = filters?.prices?.max;
    if (!max) return PRICE_STEPS;
    return PRICE_STEPS.filter((p) => p <= max);
  }, [filters?.prices?.max]);

  // Min options stay below the chosen max; max options stay above the chosen min.
  const minOptions = useMemo(
    () => (priceMax ? priceSteps.filter((p) => p < Number(priceMax)) : priceSteps),
    [priceSteps, priceMax],
  );
  const maxOptions = useMemo(
    () => (priceMin ? priceSteps.filter((p) => p > Number(priceMin)) : priceSteps),
    [priceSteps, priceMin],
  );

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(lang === "ar" ? "ar-SY" : "en-US").format(value);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: CarsSearchParams = cleanCarsSearch({
      brand: brand || undefined,
      year_min: yearMin ? Number(yearMin) : undefined,
      price_min: priceMin ? Number(priceMin) : undefined,
      price_max: priceMax ? Number(priceMax) : undefined,
    });
    navigate({ to: "/cars", search: next });
  };

  return (
    <form
      onSubmit={submit}
      className="glass rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-xl"
      role="search"
    >
      <div className="grid grid-cols-2 md:grid-cols-12 gap-3">
        <div className="col-span-2 md:col-span-3">
          <HeroField label={tr(t.home.search.brand)}>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={selectClass}
            >
              <option value="">{tr(t.home.search.anyBrand)}</option>
              {brandOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </HeroField>
        </div>

        <div className="col-span-2 md:col-span-3">
          <HeroField label={tr(t.home.search.year)}>
            <select
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
              className={selectClass}
            >
              <option value="">{tr(t.home.search.anyYear)}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </HeroField>
        </div>

        <div className="md:col-span-3">
          <HeroField label={tr(t.home.search.priceMin)}>
            <select
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className={selectClass}
            >
              <option value="">{tr(t.home.search.anyPrice)}</option>
              {minOptions.map((p) => (
                <option key={p} value={p}>
                  {formatPrice(p)}
                </option>
              ))}
            </select>
          </HeroField>
        </div>

        <div className="md:col-span-3">
          <HeroField label={tr(t.home.search.priceMax)}>
            <select
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className={selectClass}
            >
              <option value="">{tr(t.home.search.anyPrice)}</option>
              {maxOptions.map((p) => (
                <option key={p} value={p}>
                  {formatPrice(p)}
                </option>
              ))}
            </select>
          </HeroField>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="submit"
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white btn-browse"
        >
          <Search className="w-4 h-4" />
          {tr(t.home.search.submit)}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/cars" })}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium glass hover:border-primary transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-primary-glow" />
          {tr(t.home.search.advanced)}
        </button>
      </div>
    </form>
  );
}
