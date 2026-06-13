import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import type { CarsSearchParams } from "@/lib/api/types";
import { cleanCarsSearch } from "@/features/cars/filter-search";
import { cn } from "@/lib/utils";

type CarsPaginationProps = {
  search: CarsSearchParams;
  currentPage: number;
  lastPage: number;
  isFetching?: boolean;
};

export function CarsPagination({ search, currentPage, lastPage, isFetching }: CarsPaginationProps) {
  const { lang, tr } = useTr();
  const pages = buildPageNumbers(currentPage, lastPage);
  const baseSearch = cleanCarsSearch(search);

  return (
    <nav
      className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
      aria-label="Pagination"
    >
      <PaginationLink
        search={baseSearch}
        page={currentPage - 1}
        disabled={currentPage <= 1 || isFetching}
        aria-label={tr(t.cars.pagination.prev)}
        className="rounded-full px-4 py-2 glass text-sm"
      >
        <ChevronLeft className={cn("w-4 h-4", lang === "ar" && "rotate-180")} />
        <span>{tr(t.cars.pagination.prev)}</span>
      </PaginationLink>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <PaginationLink
              key={p}
              search={baseSearch}
              page={p}
              disabled={isFetching}
              aria-current={p === currentPage ? "page" : undefined}
              className={cn(
                "min-w-9 h-9 inline-flex items-center justify-center rounded-full text-sm transition-all",
                p === currentPage
                  ? "bg-[var(--gradient-purple)] text-primary-foreground glow-soft font-semibold"
                  : "glass hover:border-primary text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </PaginationLink>
          ),
        )}
      </div>

      <PaginationLink
        search={baseSearch}
        page={currentPage + 1}
        disabled={currentPage >= lastPage || isFetching}
        aria-label={tr(t.cars.pagination.next)}
        className="rounded-full px-4 py-2 glass text-sm"
      >
        <span>{tr(t.cars.pagination.next)}</span>
        <ChevronRight className={cn("w-4 h-4", lang === "ar" && "rotate-180")} />
      </PaginationLink>
    </nav>
  );
}

type PaginationLinkProps = {
  search: CarsSearchParams;
  page: number;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page";
};

function PaginationLink({
  search,
  page,
  disabled,
  className,
  children,
  ...a11y
}: PaginationLinkProps) {
  if (disabled) {
    return (
      <span
        className={cn("inline-flex items-center gap-1.5 opacity-40 pointer-events-none", className)}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to="/cars"
      search={cleanCarsSearch({ ...search, page: page <= 1 ? undefined : page })}
      className={cn(
        "inline-flex items-center gap-1.5 hover:border-primary transition-all",
        className,
      )}
      {...a11y}
    >
      {children}
    </Link>
  );
}

function buildPageNumbers(current: number, last: number): Array<number | "ellipsis"> {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const pages: Array<number | "ellipsis"> = [1];
  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < last - 2) pages.push("ellipsis");
  pages.push(last);
  return pages;
}
