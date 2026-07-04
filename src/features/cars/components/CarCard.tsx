import { memo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car as CarIcon,
  Heart,
  Star,
} from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import type { Car } from "@/lib/api/types";
import { buildCarPageUrl } from "@/lib/whatsapp";
import {
  formatCarPrice,
  formatMileage,
  getCarDetailSlug,
  getCarPrimaryImage,
  getCarTitle,
  isCarSold,
} from "@/features/cars/utils";
import { useFavorite } from "@/features/cars/hooks/useFavorites";
import { WhatsAppButton } from "@/features/cars/components/WhatsAppButton";
import { CarImage } from "@/features/cars/components/CarImage";
import { CarStatusBadge } from "@/features/cars/components/CarStatusBadge";
import { cn } from "@/lib/utils";

/** Shared 3/4 image + 1/4 info card proportions across listing, carousel, and skeletons. */
export const CAR_CARD_SHELL =
  "grid grid-rows-[3fr_1fr] min-h-[22rem] sm:min-h-[26rem] lg:min-h-[28rem]";

type CarCardProps = {
  car: Car;
  index?: number;
};

function FeaturedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[oklch(0.85_0.085_88/0.4)] bg-[oklch(0.85_0.085_88/0.12)] text-gold backdrop-blur-sm">
      <Star className="w-3 h-3 fill-current" aria-hidden />
      {label}
    </span>
  );
}

function CarCardImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.30_0.08_295/0.35),transparent_70%)]">
      <CarIcon
        className="absolute inset-0 m-auto w-24 h-24 text-primary-glow/60 group-hover:scale-110 transition-transform duration-500"
        strokeWidth={1.2}
        aria-hidden
      />
      <span className="absolute bottom-3 inset-x-0 text-center text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export const CarCard = memo(function CarCard({ car, index = 0 }: CarCardProps) {
  const { lang, tr } = useTr();
  const [imageFailed, setImageFailed] = useState(false);
  const title = getCarTitle(car, lang);
  const imageUrl = getCarPrimaryImage(car);
  const price = formatCarPrice(car.price, car.currency, lang, tr(t.cars.priceOnRequest));
  const mileage = formatMileage(car.mileage, lang, tr(t.cars.mileageUnit));
  const carPageUrl = buildCarPageUrl(car.slug);
  const detailSlug = getCarDetailSlug(car);
  const { isFavorite, toggleFavorite } = useFavorite(detailSlug);
  const isNew = (car.condition ?? "").toLowerCase() === "new";
  const sold = isCarSold(car);

  const metaLine = [
    car.year != null ? String(car.year) : null,
    mileage,
  ]
    .filter(Boolean)
    .join(" · ");

  if (!detailSlug) return null;

  return (
    <Reveal delay={index * 70}>
      <article
        className={cn(
          "group relative glass rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-500 h-full",
          CAR_CARD_SHELL,
          sold && "opacity-95",
        )}
      >
        {/* Image — 3/4 of card height */}
        <div className="relative min-h-0 overflow-hidden bg-[var(--gradient-card)]">
          <Link
            to="/cars/$slug"
            params={{ slug: detailSlug }}
            className="absolute inset-0 block"
            aria-label={title}
          >
            {imageUrl && !imageFailed ? (
              <CarImage
                src={imageUrl}
                alt={title}
                priority={index === 0}
                fallbackLabel={tr(t.cars.noImage)}
                onError={() => setImageFailed(true)}
                className={cn(sold && "grayscale-[0.35]")}
              />
            ) : (
              <CarCardImagePlaceholder label={tr(t.cars.noImage)} />
            )}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </Link>

          <div className="absolute top-3 start-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
            {car.is_featured ? <FeaturedBadge label={tr(t.cars.badges.featured)} /> : null}
            <CarStatusBadge car={car} />
            {isNew && !car.is_featured ? (
              <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-primary/40 bg-primary/20 text-primary-glow backdrop-blur-sm">
                {tr(t.cars.badges.new)}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={toggleFavorite}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? tr(t.cars.favorite.remove) : tr(t.cars.favorite.add)}
            className={cn(
              "absolute top-3 end-3 z-10 w-9 h-9 inline-flex items-center justify-center rounded-full border backdrop-blur-sm transition-all",
              isFavorite
                ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                : "bg-background/40 border-border text-muted-foreground hover:text-rose-400 hover:border-rose-500/40",
            )}
          >
            <Heart
              className={cn("w-4 h-4 transition-transform", isFavorite && "fill-current scale-110")}
              aria-hidden
            />
          </button>
        </div>

        {/* Info — 1/4 of card height */}
        <div className="p-3 sm:p-3.5 flex flex-col justify-between gap-2 min-h-0 border-t border-border/40">
          <div className="min-w-0 space-y-1">
            <Link to="/cars/$slug" params={{ slug: detailSlug }} className="group/title block">
              <h3 className="text-sm sm:text-base font-bold text-foreground leading-tight group-hover/title:text-primary-glow transition-colors line-clamp-1">
                {title}
              </h3>
            </Link>

            <p className="text-lg sm:text-xl font-bold text-gold leading-none">{price}</p>

            {metaLine ? (
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{metaLine}</p>
            ) : null}
          </div>

          <div className="flex gap-1.5 shrink-0">
            <Link
              to="/cars/$slug"
              params={{ slug: detailSlug }}
              className="group/btn flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-white btn-browse min-w-0"
            >
              <span className="truncate">{tr(t.cars.viewDetails)}</span>
              <ArrowRight
                className={cn(
                  "w-3.5 h-3.5 shrink-0 transition-transform group-hover/btn:translate-x-1",
                  lang === "ar" &&
                    "rotate-180 group-hover/btn:-translate-x-1 group-hover/btn:translate-x-0",
                )}
                aria-hidden
              />
            </Link>
            <WhatsAppButton
              carTitle={title}
              carUrl={carPageUrl}
              whatsappNumber={car.whatsapp_number}
              variant="outline"
              className="px-3 py-2 text-xs flex-none shrink-0"
            />
          </div>
        </div>
      </article>
    </Reveal>
  );
});
