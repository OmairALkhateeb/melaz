import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { useCarFilters } from "@/lib/api";
import type { CarsSearchParams } from "@/lib/api/types";
import { countActiveFilters } from "@/features/cars/filter-search";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilterForm } from "./FilterForm";
import { FilterActions } from "./FilterActions";
import { cn } from "@/lib/utils";

type FiltersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: CarsSearchParams;
  onApply: (next: CarsSearchParams) => void;
  onReset: () => void;
};

export function FiltersModal({ open, onOpenChange, search, onApply, onReset }: FiltersModalProps) {
  const { tr } = useTr();
  const [draft, setDraft] = useState<CarsSearchParams>(search);

  useEffect(() => {
    if (open) setDraft(search);
  }, [open, search]);

  const filterParams = useMemo(
    () => (draft.brand ? { brand: draft.brand } : undefined),
    [draft.brand],
  );

  const { data: filterMeta, isLoading: isMetaLoading } = useCarFilters(filterParams, {
    enabled: open,
  });

  const handleDraftChange = useCallback((patch: Partial<CarsSearchParams>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleApply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  const handleReset = () => {
    onReset();
    setDraft({});
    onOpenChange(false);
  };

  const activeCount = countActiveFilters(draft);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex w-[calc(100%-1.5rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0",
          "max-h-[min(90dvh,760px)] sm:max-h-[min(85vh,760px)]",
          "glass border-border/80 shadow-2xl sm:rounded-2xl",
        )}
        aria-describedby="filters-modal-description"
      >
        <DialogHeader className="shrink-0 space-y-1 border-b border-border/60 px-5 py-4 pe-12 text-start sm:px-6 sm:py-5">
          <DialogTitle className="text-lg font-bold text-foreground sm:text-xl">
            {tr(t.cars.filters.title)}
          </DialogTitle>
          <DialogDescription id="filters-modal-description" className="text-sm">
            {tr(t.cars.filters.modalDesc)}
          </DialogDescription>
          {activeCount > 0 && (
            <p className="pt-1 text-xs text-muted-foreground">
              {activeCount} {tr(t.cars.filters.active)}
            </p>
          )}
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {isMetaLoading && !filterMeta ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary-glow" aria-hidden />
              {tr(t.cars.filters.loading)}
            </div>
          ) : (
            <FilterForm
              values={draft}
              onChange={handleDraftChange}
              filterMeta={filterMeta}
              isMetaLoading={isMetaLoading}
            />
          )}
        </div>

        <div className="shrink-0 border-t border-border/60 bg-background/60 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
          <FilterActions onApply={handleApply} onReset={handleReset} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
