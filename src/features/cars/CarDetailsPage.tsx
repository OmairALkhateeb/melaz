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
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-44">
        <div className="container mx-auto px-4 sm:px-5">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-glow transition-colors mb-4 sm:mb-6"
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
    <article itemScope itemType="https://schema.org/Car">
      <meta itemProp="name" content={title} />
      {car.price != null && <meta itemProp="price" content={String(car.price)} />}

      <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 xl:gap-12 items-start">
        <Reveal>
          <CarGallery images={images} />
        </Reveal>

        <div className="space-y-4 sm:space-y-6">
          <Reveal delay={80}>
            <header className="space-y-2.5">
              <CarStatusBadge car={car} className="text-xs normal-case tracking-normal" />
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gradient leading-tight">
                {title}
              </h1>
              {subtitle ? (
                <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
              ) : null}
            </header>
          </Reveal>

          <Reveal delay={120}>
            <CarSpecsSummary car={car} price={price} />
          </Reveal>

          <Reveal delay={160}>
            <WhatsAppButton
              carTitle={title}
              carUrl={carPageUrl}
              whatsappNumber={car.whatsapp_number}
              size="lg"
            />
          </Reveal>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
        <Reveal delay={100}>
          <CarSpecs car={car} price={price} />
        </Reveal>

        <Reveal delay={140}>
          <section className="glass rounded-2xl p-5 sm:p-6" aria-labelledby="car-description">
            <h2 id="car-description" className="text-lg font-bold text-foreground">
              {tr(t.cars.detail.description)}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {description ?? tr(t.cars.detail.noDescription)}
            </p>
          </section>
        </Reveal>

        <Reveal delay={180}>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <WhatsAppButton
              carTitle={title}
              carUrl={carPageUrl}
              whatsappNumber={car.whatsapp_number}
            />
            <Link
              to="/cars"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium glass hover:border-primary transition-all"
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
