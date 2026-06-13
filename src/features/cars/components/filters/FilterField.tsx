import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FilterFieldProps = {
  label: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

export function FilterField({ label, htmlFor, className, children }: FilterFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
