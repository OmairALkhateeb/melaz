import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

type FilterSearchInputProps = {
  id?: string;
  value?: string;
  placeholder: string;
  onDebouncedChange: (value: string | undefined) => void;
  debounceMs?: number;
  className?: string;
};

export function FilterSearchInput({
  id,
  value = "",
  placeholder,
  onDebouncedChange,
  debounceMs = 500,
  className,
}: FilterSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, debounceMs);
  const onChangeRef = useRef(onDebouncedChange);

  useEffect(() => {
    onChangeRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const normalized = debouncedValue.trim() || undefined;
    const applied = value?.trim() || undefined;
    if (normalized === applied) return;
    onChangeRef.current(normalized);
  }, [debouncedValue, value]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <Input
        id={id}
        type="search"
        value={localValue}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        onChange={(e) => setLocalValue(e.target.value)}
        className="glass border-border/80 h-10 ps-9"
      />
    </div>
  );
}
