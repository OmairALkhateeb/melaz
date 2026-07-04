import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { SiteShell, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { useCar, isApiError, getApiErrorMessage } from "@/lib/api";
import type { Car } from "@/lib/api/types";
import { getCarGalleryImages, getCarDescription, getCarTitle } from "@/features/cars/utils";
import { buildCarPageUrl } from "@/lib/whatsapp";
import { CarGallery } from "./components/CarGallery";
import { CarSpecs, CarSpecsSummary, formatDetailPrice } from "./components/CarSpecs";
import { CarStatusBadge } from "./components/CarStatusBadge";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { CarDetailsSkeleton } from "./components/CarDetailsSkeleton";
import { CarNotFoundState } from "./components/CarNotFoundState";
import { ErrorState } from "./components/ErrorState";
import { RelatedCars } from "./components/RelatedCars";
import { cn } from "@/lib/utils";

type CarDetailsPageProps = {
  slug: string;
  /** From route loader — Car when found, null when 404, undefined when unavailable. */
  initialCar?: Car | null;
};

export function CarDetailsPage({ slug, initialCar }: CarDetailsPageProps) {
  const { lang, tr } = useTr();
  const isLoaderNotFound = initialCar === null;

  const {
    data: car,
    isLoading,
    isError,
    error,
    refetch,
  } = useCar(slug, {
    initialData: initialCar ?? undefined,
    enabled: !isLoaderNotFound,
  });

  const isNotFound = isLoaderNotFound || (isError && isApiError(error) && error.status === 404);
  const isInitialLoading = isLoading && !car && initialCar === undefined;

  return (
    <SiteShell>
      <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14 lg:pt-40 overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-5 max-w-6xl">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-glow transition-colors mb-3 sm:mb-5"
          >
            <ArrowLeft className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
            {tr(t.cars.detail.backToCars)}
          </Link>

          {isInitialLoading ? (
            <CarDetailsSkeleton />
          ) : isNotFound ? (
            <CarNotFoundState />
          ) : isError || !car ? (
            <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
          ) : (
            <CarDetailsContent car={car} />
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function CarDetailsContent({ car }: { car: Car }) {
  const { lang, tr } = useTr();
  const title = getCarTitle(car, lang);
  const price = formatDetailPrice(car, lang, tr(t.cars.priceOnRequest));
  const images = getCarGalleryImages(car, lang);
  const description = getCarDescription(car, lang);
  const carPageUrl = buildCarPageUrl(car.slug);

  const subtitle = [car.brand, car.model, car.trim, car.year?.toString()]
    .filter(Boolean)
    .join(" · ");

  return (
    <article itemScope itemType="https://schema.org/Car" className="min-w-0">
      <meta itemProp="name" content={title} />
      {car.price != null && <meta itemProp="price" content={String(car.price)} />}

      {/* Gallery first on mobile · Desktop: gallery left, info right */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-10 lg:items-start">
        <Reveal className="order-1 min-w-0 lg:sticky lg:top-28">
          <CarGallery images={images} />
        </Reveal>

        <Reveal delay={80} className="order-2 min-w-0 space-y-3 sm:space-y-4">
          <header className="space-y-2">
            <CarStatusBadge car={car} className="text-xs normal-case tracking-normal" />
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gradient leading-snug break-words">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-xs sm:text-sm text-muted-foreground break-words">{subtitle}</p>
            ) : null}
          </header>

          <CarSpecsSummary car={car} price={price} />

          <WhatsAppButton
            carTitle={title}
            carUrl={carPageUrl}
            whatsappNumber={car.whatsapp_number}
            size="lg"
            className="w-full sm:w-auto"
          />
        </Reveal>
      </div>

      <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-7 min-w-0">
        <Reveal delay={100}>
          <CarSpecs car={car} price={price} />
        </Reveal>

        <Reveal delay={140}>
          <section className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6" aria-labelledby="car-description">
            <h2 id="car-description" className="text-base sm:text-lg font-bold text-foreground">
              {tr(t.cars.detail.description)}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
              {description ?? tr(t.cars.detail.noDescription)}
            </p>
          </section>
        </Reveal>

        <Reveal delay={180}>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center">
            <WhatsAppButton
              carTitle={title}
              carUrl={carPageUrl}
              whatsappNumber={car.whatsapp_number}
              className="w-full sm:w-auto"
            />
            <Link
              to="/cars"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium glass hover:border-primary transition-all w-full sm:w-auto"
            >
              <ArrowLeft className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
              {tr(t.cars.detail.backToCars)}
            </Link>
          </div>
        </Reveal>
      </div>

      <RelatedCars car={car} />
    </article>
  );
}
