import { memo, useMemo } from "react";
import type { Car } from "@/lib/api/types";
import { useRelatedCars } from "@/lib/api/queries";
import { translations as t } from "@/lib/i18n";
import { SectionHeader, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { CarsGrid } from "./CarsGrid";

type RelatedCarsProps = {
  car: Car;
};

export const RelatedCars = memo(function RelatedCars({ car }: RelatedCarsProps) {
  const { tr } = useTr();

  const { data, isLoading } = useRelatedCars(car.brand, car.slug);

  const related = useMemo(
    () => data?.data.filter((item) => item.slug !== car.slug).slice(0, 3) ?? [],
    [data?.data, car.slug],
  );

  if (!car.brand || isLoading || related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border" aria-labelledby="related-cars-title">
      <Reveal>
        <SectionHeader
          title={tr(t.cars.detail.relatedTitle)}
          subtitle={tr(t.cars.detail.relatedSubtitle)}
          titleId="related-cars-title"
        />
      </Reveal>
      <div className="mt-10">
        <CarsGrid cars={related} />
      </div>
    </section>
  );
});
