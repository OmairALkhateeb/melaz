import { Skeleton } from "@/components/ui/skeleton";
import { DETAIL_GALLERY_FRAME } from "@/features/cars/components/CarGallery";
import { cn } from "@/lib/utils";

export function CarDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-5 sm:space-y-7 min-w-0" aria-busy="true" aria-label="Loading car details">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8">
        <Skeleton className={cn("order-1 w-full rounded-xl sm:rounded-2xl bg-primary/15", DETAIL_GALLERY_FRAME)} />
        <div className="order-2 space-y-3">
          <Skeleton className="h-6 w-20 rounded-full bg-primary/10" />
          <Skeleton className="h-7 w-4/5 bg-primary/15" />
          <Skeleton className="h-4 w-3/5 bg-primary/10" />
          <Skeleton className="h-8 w-36 bg-primary/15" />
          <Skeleton className="h-11 w-full sm:w-56 rounded-full bg-primary/15" />
        </div>
      </div>
      <Skeleton className="h-44 w-full rounded-xl sm:rounded-2xl bg-primary/10" />
      <Skeleton className="h-28 w-full rounded-xl sm:rounded-2xl bg-primary/10" />
    </div>
  );
}
