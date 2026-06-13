import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  id?: string;
  value?: string;
  placeholder: string;
  options: FilterSelectOption[];
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
};

export function FilterSelect({
  id,
  value,
  placeholder,
  options,
  onChange,
  disabled,
  className,
}: FilterSelectProps) {
  return (
    <Select
      value={value && value.length > 0 ? value : "__all__"}
      onValueChange={(next) => onChange(next === "__all__" ? undefined : next)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn("glass border-border/80 h-10", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="glass border-border/80">
        <SelectItem value="__all__">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
