import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Car as CarIcon } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { SectionHeader, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { useCarFilters } from "@/lib/api/queries";
import { mapFilterOptions } from "@/features/cars/components/filters/filter-options";
import { bodyTypePhotoSrc } from "@/features/cars/body-type-photos";

export function BrowseByBodyType() {
  const { lang, tr } = useTr();
  const { data: filters, isLoading } = useCarFilters();

  const bodyTypes = useMemo(
    () => mapFilterOptions(filters?.body_types, lang),
    [filters?.body_types, lang],
  );

  if (!isLoading && bodyTypes.length === 0) return null;

  return (
    <section className="relative py-20 scroll-mt-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="container mx-auto px-5 relative">
        <Reveal>
          <SectionHeader
            title={tr(t.home.bodyTypes.title)}
            subtitle={tr(t.home.bodyTypes.subtitle)}
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl glass animate-pulse" />
              ))
            : bodyTypes.map((b, i) => {
                const photo = bodyTypePhotoSrc(b.value);
                return (
                  <Reveal key={b.value} delay={Math.min(i, 8) * 60}>
                    <Link
                      to="/cars"
                      search={{ body_type: b.value }}
                      aria-label={b.label}
                      className="group relative block aspect-[4/3] rounded-2xl overflow-hidden glass hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-500"
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt={b.label}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,oklch(0.28_0.08_290/0.5),transparent_70%)]">
                          <CarIcon
                            className="w-12 h-12 text-primary-glow/70"
                            strokeWidth={1.2}
                            aria-hidden
                          />
                        </div>
                      )}

                      {/* Dark gradient ties the photo to the theme + keeps the label legible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-2xl" />

                      <span className="absolute inset-x-0 bottom-0 px-4 py-3.5 text-center text-base font-bold text-white drop-shadow">
                        {b.label}
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
        </div>
      </div>
    </section>
  );
}
