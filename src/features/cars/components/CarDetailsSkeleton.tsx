import { Skeleton } from "@/components/ui/skeleton";

export function CarDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 sm:space-y-8" aria-busy="true" aria-label="Loading car details">
      <Skeleton className="h-5 w-36 bg-primary/10" />
      <div className="grid lg:grid-cols-2 gap-5 sm:gap-8 xl:gap-12">
        <Skeleton className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full rounded-xl sm:rounded-2xl bg-primary/15" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-20 rounded-full bg-primary/10" />
          <Skeleton className="h-7 w-3/4 bg-primary/15" />
          <Skeleton className="h-5 w-1/2 bg-primary/10" />
          <Skeleton className="h-9 w-40 bg-primary/15" />
          <Skeleton className="h-12 w-full rounded-full bg-primary/15" />
        </div>
      </div>
      <Skeleton className="h-48 w-full rounded-2xl bg-primary/10" />
      <Skeleton className="h-32 w-full rounded-2xl bg-primary/10" />
    </div>
  );
}
