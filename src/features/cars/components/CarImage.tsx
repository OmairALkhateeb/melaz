import { memo, useState } from "react";
import { Car as CarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CarImageProps = {
  src: string;
  alt: string;
  /** First visible image — eager load + high fetch priority */
  priority?: boolean;
  className?: string;
  onError?: () => void;
  /** Shown when the image fails to load */
  fallbackLabel?: string;
};

export const CarImage = memo(function CarImage({
  src,
  alt,
  priority = false,
  className,
  onError,
  fallbackLabel,
}: CarImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,oklch(0.30_0.08_295/0.35),transparent_70%)]",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <CarIcon className="w-16 h-16 text-primary-glow/60" strokeWidth={1.2} aria-hidden />
        {fallbackLabel ? (
          <span className="absolute bottom-3 inset-x-0 text-center text-xs text-muted-foreground">
            {fallbackLabel}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      referrerPolicy="no-referrer"
      onError={() => {
        setFailed(true);
        onError?.();
      }}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
});

type StaticImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
};

/** Static public-folder image with built-in error fallback. */
export const StaticImage = memo(function StaticImage({
  src,
  alt,
  className,
  fallback,
}: StaticImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
});
