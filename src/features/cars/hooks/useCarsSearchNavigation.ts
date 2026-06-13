import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { CarsSearchParams } from "@/lib/api/types";
import { cleanCarsSearch } from "@/features/cars/filter-search";

export function useCarsSearchNavigation() {
  const navigate = useNavigate({ from: "/cars/" });

  const applySearch = useCallback(
    (patch: Partial<CarsSearchParams>, options?: { resetPage?: boolean }) => {
      const resetPage = options?.resetPage ?? true;
      navigate({
        search: (prev: CarsSearchParams) =>
          cleanCarsSearch({
            ...prev,
            ...patch,
            ...(resetPage ? { page: undefined } : {}),
          }),
      });
    },
    [navigate],
  );

  const replaceSearch = useCallback(
    (next: CarsSearchParams) => {
      navigate({
        search: cleanCarsSearch({ ...next, page: undefined }),
      });
    },
    [navigate],
  );

  const resetFilters = useCallback(() => {
    navigate({ search: cleanCarsSearch({}) });
  }, [navigate]);

  const setPage = useCallback(
    (page: number) => {
      navigate({
        search: (prev: CarsSearchParams) =>
          cleanCarsSearch({ ...prev, page: page <= 1 ? undefined : page }),
      });
    },
    [navigate],
  );

  return { applySearch, replaceSearch, resetFilters, setPage };
}
