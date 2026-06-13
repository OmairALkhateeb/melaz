import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Car, CarsSearchParams } from "@/lib/api/types";
import { useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { CarCard } from "@/features/cars/components/CarCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type CarCarouselProps = {
  id?: string;
  title: string;
  subtitle: string;
  cars: Car[];
  isLoading?: boolean;
  viewAllLabel: string;
  /** Optional search params for the "view all" link target. */
  viewAllSearch?: CarsSearchParams;
};

function CardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden h-full">
      <div className="aspect-[16/10] bg-muted/30 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-muted/30 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-muted/30 rounded animate-pulse" />
        <div className="h-16 bg-muted/20 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function CarCarousel({
  id,
  title,
  subtitle,
  cars,
  isLoading,
  viewAllLabel,
  viewAllSearch,
}: CarCarouselProps) {
  const { lang } = useTr();

  if (!isLoading && cars.length === 0) return null;

  const basis = "basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4";

  return (
    <section id={id} className="relative py-16 scroll-mt-24">
      <div className="container mx-auto px-5">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gradient">{title}</h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">{subtitle}</p>
            </div>
            <Link
              to="/cars"
              search={viewAllSearch ?? {}}
              className="hidden sm:inline-flex items-center gap-2 text-sm text-primary-glow hover:text-primary transition-colors shrink-0"
            >
              {viewAllLabel}
              <ArrowRight className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
            </Link>
          </div>
        </Reveal>

        <Carousel
          opts={{ align: "start", direction: lang === "ar" ? "rtl" : "ltr" }}
          className="w-full"
        >
          <CarouselContent>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CarouselItem key={i} className={basis}>
                    <CardSkeleton />
                  </CarouselItem>
                ))
              : cars.map((car, i) => (
                  <CarouselItem key={car.id} className={basis}>
                    <div className="h-full">
                      <CarCard car={car} index={Math.min(i, 4)} />
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/cars"
            search={viewAllSearch ?? {}}
            className="inline-flex items-center gap-2 text-sm text-primary-glow hover:text-primary transition-colors"
          >
            {viewAllLabel}
            <ArrowRight className={cn("w-4 h-4", lang === "ar" && "rotate-180")} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
