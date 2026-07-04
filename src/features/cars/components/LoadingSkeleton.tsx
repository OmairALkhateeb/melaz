import { Skeleton } from "@/components/ui/skeleton";
import { CAR_CARD_SHELL } from "@/features/cars/components/CarCard";

type LoadingSkeletonProps = {
  count?: number;
};

export function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <div
      className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7"
      aria-busy="true"
      aria-label="Loading cars"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cnShell()}>
          <Skeleton className="h-full w-full rounded-none bg-primary/15" />
          <div className="p-3.5 flex flex-col justify-between gap-2 border-t border-border/40">
            <div className="space-y-2">
              <Skeleton className="h-4 w-4/5 bg-primary/15" />
              <Skeleton className="h-6 w-2/5 bg-primary/15" />
              <Skeleton className="h-3 w-3/5 bg-primary/10" />
            </div>
            <div className="flex gap-1.5">
              <Skeleton className="h-8 flex-1 rounded-full bg-primary/15" />
              <Skeleton className="h-8 w-20 rounded-full bg-primary/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function cnShell() {
  return `glass rounded-2xl overflow-hidden h-full ${CAR_CARD_SHELL}`;
}
