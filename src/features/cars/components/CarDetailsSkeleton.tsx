import { Skeleton } from "@/components/ui/skeleton";

export function CarDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-label="Loading car details">
      <Skeleton className="h-5 w-36 bg-primary/10" />
      <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
        <Skeleton className="aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl bg-primary/15" />
        <div className="space-y-5">
          <Skeleton className="h-8 w-3/4 bg-primary/15" />
          <Skeleton className="h-6 w-1/2 bg-primary/10" />
          <Skeleton className="h-10 w-40 bg-primary/15" />
          <Skeleton className="h-12 w-full sm:w-64 rounded-full bg-primary/15" />
        </div>
      </div>
      <Skeleton className="h-48 w-full rounded-2xl bg-primary/10" />
      <Skeleton className="h-32 w-full rounded-2xl bg-primary/10" />
    </div>
  );
}
