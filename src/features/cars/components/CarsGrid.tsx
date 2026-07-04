import { memo } from "react";
import type { Car } from "@/lib/api/types";
import { CarCard, CAR_CARD_SHELL } from "./CarCard";

type CarsGridProps = {
  cars: Car[];
};

export const CarsGrid = memo(function CarsGrid({ cars }: CarsGridProps) {
  return (
    <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7 list-none p-0 m-0">
      {cars.map((car, index) => (
        <li key={car.id} className="min-w-0 h-full">
          <CarCard car={car} index={Math.min(index, 5)} />
        </li>
      ))}
    </ul>
  );
});
