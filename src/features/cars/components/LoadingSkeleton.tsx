import { Skeleton } from "@/components/ui/skeleton";

type LoadingSkeletonProps = {
  count?: number;
};

export function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Loading cars"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <Skeleton className="aspect-[16/10] w-full rounded-none bg-primary/15" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4 bg-primary/15" />
            <Skeleton className="h-4 w-full bg-primary/10" />
            <Skeleton className="h-4 w-5/6 bg-primary/10" />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Skeleton className="h-3.5 w-full bg-primary/10" />
              <Skeleton className="h-3.5 w-full bg-primary/10" />
              <Skeleton className="h-3.5 w-full bg-primary/10" />
              <Skeleton className="h-3.5 w-full bg-primary/10" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 flex-1 rounded-full bg-primary/15" />
              <Skeleton className="h-10 flex-1 rounded-full bg-primary/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
