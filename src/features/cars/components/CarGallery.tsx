import { useCallback, useEffect, useState } from "react";
import { Car as CarIcon } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { GalleryImage } from "@/features/cars/utils";
import { CarImage } from "@/features/cars/components/CarImage";
import { cn } from "@/lib/utils";

/** Main slide — wider on desktop; 4:3 on phones keeps the car fully visible. */
const MAIN_SLIDE =
  "relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-[var(--gradient-card)]";

/** Show the whole car in the hero; thumbnails may crop slightly. */
const MAIN_IMAGE = "object-contain object-center bg-black/20";

type CarGalleryProps = {
  images: GalleryImage[];
};

export function CarGallery({ images }: CarGalleryProps) {
  const { lang, tr } = useTr();
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  if (!images.length) {
    return (
      <div
        className={cn(MAIN_SLIDE, "rounded-2xl overflow-hidden glass")}
        role="img"
        aria-label={tr(t.cars.noImage)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.45_0.20_295/0.35),transparent_70%)]">
          <CarIcon
            className="absolute inset-0 m-auto w-20 h-20 text-primary-glow/60"
            strokeWidth={1.2}
            aria-hidden
          />
          <span className="absolute bottom-4 inset-x-0 text-center text-sm text-muted-foreground">
            {tr(t.cars.noImage)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-3 sm:space-y-4"
      role="region"
      aria-roledescription="carousel"
      aria-label={images[0]?.alt}
    >
      <div className="relative glass rounded-xl sm:rounded-2xl overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{ loop: images.length > 1, align: "start" }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {images.map((image, index) => (
              <CarouselItem key={`${image.url}-${index}`} className="pl-0 basis-full">
                <div className={MAIN_SLIDE}>
                  <CarImage
                    src={image.url}
                    alt={image.alt}
                    priority={index === 0}
                    fallbackLabel={tr(t.cars.noImage)}
                    className={MAIN_IMAGE}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious
                aria-label={tr(t.cars.detail.galleryPrev)}
                className={cn(
                  "hidden sm:flex left-3 top-1/2 -translate-y-1/2 glass border-border/80 hover:border-primary h-9 w-9",
                  lang === "ar" && "left-auto right-3 rotate-180",
                )}
              />
              <CarouselNext
                aria-label={tr(t.cars.detail.galleryNext)}
                className={cn(
                  "hidden sm:flex right-3 top-1/2 -translate-y-1/2 glass border-border/80 hover:border-primary h-9 w-9",
                  lang === "ar" && "right-auto left-3 rotate-180",
                )}
              />
            </>
          )}
        </Carousel>

        {images.length > 1 && (
          <div
            className="absolute bottom-2.5 end-2.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs glass border border-border/60"
            aria-live="polite"
          >
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory"
          role="tablist"
        >
          {images.map((image, index) => (
            <button
              key={`thumb-${image.url}-${index}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => api?.scrollTo(index)}
              aria-label={image.alt}
              className={cn(
                "relative shrink-0 snap-start rounded-lg overflow-hidden border-2 transition-all",
                "w-[4.75rem] h-[3.5rem] sm:w-24 sm:h-[4.5rem]",
                activeIndex === index
                  ? "border-primary glow-soft opacity-100"
                  : "border-border/50 opacity-75 hover:opacity-100",
              )}
            >
              <CarImage src={image.url} alt="" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
