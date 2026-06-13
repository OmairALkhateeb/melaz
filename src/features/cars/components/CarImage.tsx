import { memo } from "react";
import { cn } from "@/lib/utils";

type CarImageProps = {
  src: string;
  alt: string;
  /** First visible image — eager load + high fetch priority */
  priority?: boolean;
  className?: string;
  onError?: () => void;
};

export const CarImage = memo(function CarImage({
  src,
  alt,
  priority = false,
  className,
  onError,
}: CarImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={onError}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
});
