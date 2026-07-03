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
  getCarCity,
  getCarDetailSlug,
  getCarPrimaryImage,
  getCarTitle,
  getStatusKey,
} from "@/features/cars/utils";
import { useFavorite } from "@/features/cars/hooks/useFavorites";
import { WhatsAppButton } from "@/features/cars/components/WhatsAppButton";
import { CarImage } from "@/features/cars/components/CarImage";
import { cn } from "@/lib/utils";

type CarCardProps = {
  car: Car;
  index?: number;
};

function StatusBadge({ status, lang }: { status: string; lang: "ar" | "en" }) {
  const key = getStatusKey(status);
  const labels = t.cars.status;
  const label = key && key in labels ? labels[key as keyof typeof labels][lang] : status;

  const tone =
    key === "available"
      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
      : key === "sold"
        ? "bg-muted/60 border-border text-muted-foreground"
        : key === "reserved"
          ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
          : "bg-primary/20 border-primary/40 text-primary-glow";

  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-sm",
        tone,
      )}
    >
      {label}
    </span>
  );
}

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
        className="absolute inset-0 m-auto w-20 h-20 text-primary-glow/60 group-hover:scale-110 transition-transform duration-500"
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
  const city = getCarCity(car);
  const price = formatCarPrice(car.price, car.currency, lang, tr(t.cars.priceOnRequest));
  const mileage = formatMileage(car.mileage, lang, tr(t.cars.mileageUnit));
  const carPageUrl = buildCarPageUrl(car.slug);
  const detailSlug = getCarDetailSlug(car);
  const { isFavorite, toggleFavorite } = useFavorite(detailSlug);
  const isNew = (car.condition ?? "").toLowerCase() === "new";

  if (!detailSlug) return null;

  return (
    <Reveal delay={index * 70}>
      <article className="group relative glass rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] transition-all duration-500 h-full flex flex-col">
        <Link
          to="/cars/$slug"
          params={{ slug: detailSlug }}
          className="relative aspect-[16/10] overflow-hidden bg-[var(--gradient-card)] block"
          aria-label={title}
        >
          {imageUrl && !imageFailed ? (
            <CarImage
              src={imageUrl}
              alt={title}
              priority={index === 0}
              fallbackLabel={tr(t.cars.noImage)}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <CarCardImagePlaceholder label={tr(t.cars.noImage)} />
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </Link>

        {/* Badges — top start */}
        <div className="absolute top-3 start-3 z-10 flex flex-col items-start gap-1.5">
          {car.is_featured ? <FeaturedBadge label={tr(t.cars.badges.featured)} /> : null}
          {car.status ? <StatusBadge status={car.status} lang={lang} /> : null}
          {isNew && !car.is_featured ? (
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-primary/40 bg-primary/20 text-primary-glow backdrop-blur-sm">
              {tr(t.cars.badges.new)}
            </span>
          ) : null}
        </div>

        {/* Favorite — top end */}
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

        <div className="p-5 flex flex-col flex-1">
          <Link to="/cars/$slug" params={{ slug: detailSlug }} className="group/title">
            <h3 className="text-base font-bold text-foreground leading-snug group-hover/title:text-primary-glow transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="mt-2 text-xl sm:text-2xl font-bold text-gold">{price}</p>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            {car.year != null && <span>{String(car.year)}</span>}
            {car.color && (
              <>
                <span aria-hidden>·</span>
                <span>{car.color}</span>
              </>
            )}
            {city && (
              <>
                <span aria-hidden>·</span>
                <span>{city}</span>
              </>
            )}
            {car.origin && (
              <>
                <span aria-hidden>·</span>
                <span>{car.origin}</span>
              </>
            )}
          </div>

          {mileage && (
            <p className="mt-1.5 text-[11px] text-muted-foreground/70">
              {tr(t.cars.labels.mileage)}: {mileage}
            </p>
          )}

          <div className="mt-auto pt-5 flex flex-col sm:flex-row gap-2">
            <Link
              to="/cars/$slug"
              params={{ slug: detailSlug }}
              className="group/btn flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white btn-browse"
            >
              {tr(t.cars.viewDetails)}
              <ArrowRight
                className={cn(
                  "w-4 h-4 transition-transform group-hover/btn:translate-x-1",
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
            />
          </div>
        </div>
      </article>
    </Reveal>
  );
});
