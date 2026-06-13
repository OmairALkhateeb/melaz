import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { useLatestCars } from "@/lib/api/queries";
import { CarCarousel } from "./CarCarousel";

export function NewArrivals() {
  const { tr } = useTr();
  const { data, isLoading } = useLatestCars(8);

  return (
    <CarCarousel
      id="latest"
      title={tr(t.home.latest.title)}
      subtitle={tr(t.home.latest.subtitle)}
      cars={data?.data ?? []}
      isLoading={isLoading}
      viewAllLabel={tr(t.home.latest.viewAll)}
    />
  );
}
