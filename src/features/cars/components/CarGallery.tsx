import { useCallback, useEffect, useState } from "react";
import { Car as CarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import type { GalleryImage } from "@/features/cars/utils";
import { cn } from "@/lib/utils";

/**
 * Detail gallery frame — capped on phones so the hero does not dominate the viewport.
 */
export const DETAIL_GALLERY_FRAME = cn(
  "relative w-full max-w-full overflow-hidden bg-[var(--gradient-card)]",
  "h-[clamp(11rem,48vw,13.5rem)]",
  "sm:h-[clamp(12.5rem,42vw,16rem)]",
  "md:h-[clamp(14rem,36vw,18rem)]",
  "lg:aspect-[4/3] lg:h-auto lg:max-h-[22rem] xl:max-h-[24rem]",
);

type CarGalleryProps = {
  images: GalleryImage[];
};

function GalleryHero({
  image,
  failed,
  onError,
  noImageLabel,
}: {
  image: GalleryImage;
  failed: boolean;
  onError: () => void;
  noImageLabel: string;
}) {
  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,oklch(0.30_0.08_295/0.35),transparent_70%)]">
        <CarIcon className="w-16 h-16 text-primary-glow/60" strokeWidth={1.2} aria-hidden />
        <span className="absolute bottom-3 inset-x-0 text-center text-xs text-muted-foreground">
          {noImageLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={image.url}
      alt={image.alt}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      referrerPolicy="no-referrer"
      onError={onError}
      className="absolute inset-0 h-full w-full object-contain object-center"
    />
  );
}

function GalleryThumb({
  image,
  selected,
  onSelect,
}: {
  image: GalleryImage;
  selected: boolean;
  onSelect: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      aria-label={image.alt}
      className={cn(
        "relative shrink-0 snap-start rounded-md overflow-hidden border-2 transition-all",
        "w-[3.75rem] h-[2.75rem] sm:w-20 sm:h-[3.75rem]",
        selected ? "border-primary glow-soft opacity-100" : "border-border/50 opacity-75 hover:opacity-100",
      )}
    >
      {!failed ? (
        <img
          src={image.url}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <CarIcon className="w-5 h-5 text-muted-foreground" aria-hidden />
        </div>
      )}
    </button>
  );
}

export function CarGallery({ images }: CarGalleryProps) {
  const { lang, tr } = useTr();
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroFailed, setHeroFailed] = useState(false);

  const count = images.length;
  const safeIndex = count > 0 ? ((activeIndex % count) + count) % count : 0;
  const current = images[safeIndex];

  useEffect(() => {
    setHeroFailed(false);
  }, [safeIndex, current?.url]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  if (!count || !current) {
    return (
      <div
        className={cn(DETAIL_GALLERY_FRAME, "rounded-xl sm:rounded-2xl glass")}
        role="img"
        aria-label={tr(t.cars.noImage)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.45_0.20_295/0.35),transparent_70%)]">
          <CarIcon
            className="absolute inset-0 m-auto w-16 h-16 text-primary-glow/60"
            strokeWidth={1.2}
            aria-hidden
          />
          <span className="absolute bottom-3 inset-x-0 text-center text-xs text-muted-foreground">
            {tr(t.cars.noImage)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-2.5 sm:space-y-3" role="region" aria-label={current.alt}>
      <div className={cn(DETAIL_GALLERY_FRAME, "glass rounded-xl sm:rounded-2xl")}>
        <GalleryHero
          key={current.url}
          image={current}
          failed={heroFailed}
          onError={() => setHeroFailed(true)}
          noImageLabel={tr(t.cars.noImage)}
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={tr(t.cars.detail.galleryPrev)}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-10 h-8 w-8 inline-flex items-center justify-center rounded-full glass border border-border/80 hover:border-primary",
                lang === "ar" ? "right-2" : "left-2",
              )}
            >
              <ChevronLeft className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={tr(t.cars.detail.galleryNext)}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-10 h-8 w-8 inline-flex items-center justify-center rounded-full glass border border-border/80 hover:border-primary",
                lang === "ar" ? "left-2" : "right-2",
              )}
            >
              <ChevronRight className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
            </button>
            <div className="absolute bottom-2 end-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs glass border border-border/60">
              {safeIndex + 1} / {count}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-0.5 snap-x snap-mandatory min-w-0" role="tablist">
          {images.map((image, index) => (
            <GalleryThumb
              key={`thumb-${image.url}-${index}`}
              image={image}
              selected={safeIndex === index}
              onSelect={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
