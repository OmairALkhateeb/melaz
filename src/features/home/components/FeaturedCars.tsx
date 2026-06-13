import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { useFeaturedCars } from "@/lib/api/queries";
import { CarCarousel } from "./CarCarousel";

export function FeaturedCars() {
  const { tr } = useTr();
  const { data, isLoading } = useFeaturedCars(8);

  return (
    <CarCarousel
      id="featured"
      title={tr(t.home.featured.title)}
      subtitle={tr(t.home.featured.subtitle)}
      cars={data?.data ?? []}
      isLoading={isLoading}
      viewAllLabel={tr(t.home.featured.viewAll)}
    />
  );
}
