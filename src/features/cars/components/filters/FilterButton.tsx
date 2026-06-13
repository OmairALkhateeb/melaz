import { SlidersHorizontal } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterButtonProps = {
  activeCount: number;
  onClick: () => void;
  className?: string;
};

export function FilterButton({ activeCount, onClick, className }: FilterButtonProps) {
  const { tr } = useTr();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      aria-haspopup="dialog"
      className={cn(
        "rounded-full glass border-border/80 h-10 px-4 gap-2",
        activeCount > 0 && "border-primary/50",
        className,
      )}
    >
      <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden />
      <span>{tr(t.cars.filters.title)}</span>
      {activeCount > 0 && (
        <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
          {activeCount}
        </span>
      )}
    </Button>
  );
}
