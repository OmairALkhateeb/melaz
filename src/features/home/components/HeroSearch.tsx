import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { useCarFilters } from "@/lib/api/queries";
import { mapFilterOptions } from "@/features/cars/components/filters/filter-options";
import { cleanCarsSearch } from "@/features/cars/filter-search";
import type { CarsSearchParams } from "@/lib/api/types";

const PRICE_STEPS = [5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000];

const selectClass =
  "w-full h-11 rounded-xl bg-background/60 border border-border px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary appearance-none cursor-pointer";

export function HeroSearch() {
  const { lang, tr } = useTr();
  const navigate = useNavigate();
  const { data: filters } = useCarFilters();

  const [brand, setBrand] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const brandOptions = useMemo(
    () => mapFilterOptions(filters?.brands, lang),
    [filters?.brands, lang],
  );

  const priceSteps = useMemo(() => {
    const max = filters?.prices?.max;
    if (!max) return PRICE_STEPS;
    return PRICE_STEPS.filter((p) => p <= max);
  }, [filters?.prices?.max]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(lang === "ar" ? "ar-SY" : "en-US").format(value);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: CarsSearchParams = cleanCarsSearch({
      brand: brand || undefined,
      price_max: priceMax ? Number(priceMax) : undefined,
    });
    navigate({ to: "/cars", search: next });
  };

  return (
    <form
      onSubmit={submit}
      className="glass rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl max-w-2xl mx-auto"
      role="search"
    >
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className={selectClass}
          aria-label={tr(t.home.search.brand)}
        >
          <option value="">{tr(t.home.search.anyBrand)}</option>
          {brandOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className={selectClass}
          aria-label={tr(t.home.search.priceMax)}
        >
          <option value="">{tr(t.home.search.anyPrice)}</option>
          {priceSteps.map((p) => (
            <option key={p} value={p}>
              {formatPrice(p)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="shrink-0 inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl text-sm font-semibold text-white btn-browse sm:min-w-[7rem]"
        >
          <Search className="w-4 h-4" />
          {tr(t.home.search.submit)}
        </button>
      </div>

      <div className="mt-2.5 text-center">
        <button
          type="button"
          onClick={() => navigate({ to: "/cars" })}
          className="text-xs text-muted-foreground hover:text-primary-glow transition-colors"
        >
          {lang === "ar" ? `← ${tr(t.home.search.advanced)}` : `${tr(t.home.search.advanced)} →`}
        </button>
      </div>
    </form>
  );
}
