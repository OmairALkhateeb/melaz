import type { Car } from "@/lib/api/types";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { formatCarPrice, formatMileage, getCarCity, getCarField, getCarStatusLabel } from "@/features/cars/utils";

type CarSpecsProps = {
  car: Car;
  price: string;
};

type SpecItem = {
  label: string;
  value: string;
};

export function CarSpecs({ car, price }: CarSpecsProps) {
  const { lang, tr } = useTr();

  const mileage = formatMileage(car.mileage, lang, tr(t.cars.mileageUnit));
  const city = getCarCity(car);
  const statusLabel = getCarStatusLabel(car, lang, t.cars.status);

  const items: SpecItem[] = [
    { label: tr(t.cars.labels.brand), value: getCarField(car, "brand") ?? "" },
    { label: tr(t.cars.labels.model), value: getCarField(car, "model") ?? "" },
    { label: tr(t.cars.labels.trim), value: getCarField(car, "trim", ["trim", "variant"]) ?? "" },
    { label: tr(t.cars.labels.year), value: car.year != null ? String(car.year) : "" },
    { label: tr(t.cars.labels.price), value: price },
    { label: tr(t.cars.labels.color), value: getCarField(car, "color") ?? "" },
    { label: tr(t.cars.labels.origin), value: getCarField(car, "origin") ?? "" },
    {
      label: tr(t.cars.labels.transmission),
      value: getCarField(car, "transmission", ["transmission", "gearbox"]) ?? "",
    },
    {
      label: tr(t.cars.labels.fuelType),
      value: getCarField(car, "fuel_type", ["fuel_type", "fuel"]) ?? "",
    },
    {
      label: tr(t.cars.labels.engineSize),
      value: getCarField(car, "engine_size", ["engine_size", "engine", "engine_capacity"]) ?? "",
    },
    {
      label: tr(t.cars.labels.drivetrain),
      value: getCarField(car, "drivetrain", ["drivetrain", "drive_type"]) ?? "",
    },
    {
      label: tr(t.cars.labels.condition),
      value: getCarField(car, "condition", ["condition", "car_condition"]) ?? "",
    },
    { label: tr(t.cars.filters.status), value: statusLabel ?? "" },
    { label: tr(t.cars.labels.city), value: city ?? "" },
    { label: tr(t.cars.labels.mileage), value: mileage ?? "" },
  ].filter((item) => item.value.trim().length > 0);

  if (!items.length) return null;

  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-bold text-foreground">{tr(t.cars.detail.specifications)}</h2>
      <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground break-words">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function CarSpecsSummary({ car, price }: CarSpecsProps) {
  const { lang, tr } = useTr();
  const mileage = formatMileage(car.mileage, lang, tr(t.cars.mileageUnit));
  const city = getCarCity(car);

  const highlights = [
    car.year != null ? String(car.year) : null,
    getCarField(car, "transmission"),
    getCarField(car, "fuel_type", ["fuel_type", "fuel"]),
    city,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-3">
      <p className="text-xl sm:text-3xl font-bold text-gradient">{price}</p>
      {highlights.length > 0 && (
        <p className="text-sm text-muted-foreground">{highlights.join(" · ")}</p>
      )}
      {mileage && (
        <p className="text-xs text-muted-foreground/70">
          {tr(t.cars.labels.mileage)}: {mileage}
        </p>
      )}
    </div>
  );
}

export function formatDetailPrice(car: Car, lang: "ar" | "en", onRequestLabel: string): string {
  return formatCarPrice(car.price, car.currency, lang, onRequestLabel);
}
