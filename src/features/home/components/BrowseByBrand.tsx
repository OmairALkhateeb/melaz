import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { SectionHeader, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { useCarFilters } from "@/lib/api/queries";
import { mapFilterOptions } from "@/features/cars/components/filters/filter-options";
import { brandLogoSrc } from "@/features/cars/brand-logos";
import { StaticImage } from "@/features/cars/components/CarImage";
import { cn } from "@/lib/utils";

export function BrowseByBrand() {
  const { lang, tr } = useTr();
  const { data: filters, isLoading } = useCarFilters();

  const brands = useMemo(
    () => mapFilterOptions(filters?.brands, lang).slice(0, 12),
    [filters?.brands, lang],
  );

  if (!isLoading && brands.length === 0) return null;

  return (
    <section className="relative py-20 scroll-mt-24">
      <div className="container mx-auto px-5">
        <Reveal>
          <SectionHeader title={tr(t.home.brands.title)} subtitle={tr(t.home.brands.subtitle)} />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl glass animate-pulse" />
              ))
            : brands.map((b, i) => {
                const logo = brandLogoSrc(b.value);
                return (
                  <Reveal key={b.value} delay={Math.min(i, 8) * 50}>
                    <Link
                      to="/cars"
                      search={{ brand: b.value }}
                      aria-label={b.label}
                      className={cn(
                        "group relative bg-white rounded-2xl h-28 flex flex-col items-center justify-center gap-1.5 p-3",
                        "shadow-md hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] transition-all duration-300",
                      )}
                    >
                      <span className="text-[11px] sm:text-xs font-bold text-neutral-800 text-center line-clamp-2 leading-tight px-1">
                        {b.label}
                      </span>
                      {logo ? (
                        <StaticImage
                          src={logo}
                          alt={`${b.label} logo`}
                          className="max-h-9 max-w-[70%] object-contain transition-transform duration-300 group-hover:scale-105"
                          fallback={
                            <span className="text-[10px] font-semibold text-neutral-500 text-center">
                              {b.label}
                            </span>
                          }
                        />
                      ) : (
                        <span className="text-[10px] font-semibold text-neutral-500 text-center">
                          {b.label}
                        </span>
                      )}
                    </Link>
                  </Reveal>
                );
              })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-sm text-primary-glow hover:text-primary transition-colors"
          >
            {tr(t.home.brands.viewAll)}
            <ArrowRight className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
