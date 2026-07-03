import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import type { Car } from "@/lib/api/types";
import { getCarStatusLabel, getStatusKey } from "@/features/cars/utils";
import { cn } from "@/lib/utils";

type CarStatusBadgeProps = {
  car: Pick<Car, "status" | "status_label">;
  className?: string;
};

export function CarStatusBadge({ car, className }: CarStatusBadgeProps) {
  const { lang } = useTr();
  const key = getStatusKey(car.status);
  const label = getCarStatusLabel(car, lang, t.cars.status);

  if (!label) return null;

  const tone =
    key === "available"
      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
      : key === "sold"
        ? "bg-muted/60 border-border text-muted-foreground"
        : key === "reserved"
          ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
          : "bg-primary/20 border-primary/40 text-primary-glow";

  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-sm",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
