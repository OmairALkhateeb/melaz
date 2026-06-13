import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

type FilterRangeInputsProps = {
  minId?: string;
  maxId?: string;
  minValue?: number;
  maxValue?: number;
  minPlaceholder: string;
  maxPlaceholder: string;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  className?: string;
  /** Debounce URL/API updates while typing (desktop filters). */
  debounceMs?: number;
};

function parseOptionalNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function numberToInput(value: number | undefined): string {
  return value == null ? "" : String(value);
}

export function FilterRangeInputs({
  minId,
  maxId,
  minValue,
  maxValue,
  minPlaceholder,
  maxPlaceholder,
  onMinChange,
  onMaxChange,
  className,
  debounceMs,
}: FilterRangeInputsProps) {
  const [localMin, setLocalMin] = useState(numberToInput(minValue));
  const [localMax, setLocalMax] = useState(numberToInput(maxValue));
  const debouncedMin = useDebounce(localMin, debounceMs ?? 0);
  const debouncedMax = useDebounce(localMax, debounceMs ?? 0);
  const onMinRef = useRef(onMinChange);
  const onMaxRef = useRef(onMaxChange);

  useEffect(() => {
    onMinRef.current = onMinChange;
    onMaxRef.current = onMaxChange;
  }, [onMinChange, onMaxChange]);

  useEffect(() => {
    setLocalMin(numberToInput(minValue));
  }, [minValue]);

  useEffect(() => {
    setLocalMax(numberToInput(maxValue));
  }, [maxValue]);

  useEffect(() => {
    if (!debounceMs) return;
    const parsed = parseOptionalNumber(debouncedMin);
    if (parsed === minValue) return;
    onMinRef.current(parsed);
  }, [debouncedMin, debounceMs, minValue]);

  useEffect(() => {
    if (!debounceMs) return;
    const parsed = parseOptionalNumber(debouncedMax);
    if (parsed === maxValue) return;
    onMaxRef.current(parsed);
  }, [debouncedMax, debounceMs, maxValue]);

  const handleMinChange = (raw: string) => {
    setLocalMin(raw);
    if (!debounceMs) onMinChange(parseOptionalNumber(raw));
  };

  const handleMaxChange = (raw: string) => {
    setLocalMax(raw);
    if (!debounceMs) onMaxChange(parseOptionalNumber(raw));
  };

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <Input
        id={minId}
        type="number"
        inputMode="numeric"
        min={0}
        value={localMin}
        placeholder={minPlaceholder}
        aria-label={minPlaceholder}
        autoComplete="off"
        onChange={(e) => handleMinChange(e.target.value)}
        className="glass border-border/80 h-10"
      />
      <Input
        id={maxId}
        type="number"
        inputMode="numeric"
        min={0}
        value={localMax}
        placeholder={maxPlaceholder}
        aria-label={maxPlaceholder}
        autoComplete="off"
        onChange={(e) => handleMaxChange(e.target.value)}
        className="glass border-border/80 h-10"
      />
    </div>
  );
}
