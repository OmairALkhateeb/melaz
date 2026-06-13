import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterActionsProps = {
  onApply: () => void;
  onReset: () => void;
  className?: string;
};

export function FilterActions({ onApply, onReset, className }: FilterActionsProps) {
  const { tr } = useTr();

  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3",
        className,
      )}
    >
      <Button type="button" variant="ghost" onClick={onReset} className="rounded-full h-11">
        {tr(t.cars.filters.reset)}
      </Button>
      <Button
        type="button"
        onClick={onApply}
        className="rounded-full h-11 bg-[var(--gradient-purple)] hover:opacity-90 glow-soft border-0"
      >
        {tr(t.cars.filters.applyFilters)}
      </Button>
    </div>
  );
}
