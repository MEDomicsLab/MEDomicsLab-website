import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import { imageSrcSet } from "../../lib/images";

export default function SkeletonImage({
  src,
  alt,
  className,
  imgClassName,
  skeletonClassName,
  loading = "lazy",
  decoding = "async",
  sizes,
  variantSizes,
  fallbackSrc,
  fill = false,
  fetchPriority,
  formats = ["avif", "webp"],
}) {
  const [isLoaded, setIsLoaded] = useState(import.meta.env.SSR);
  const resolvedVariants = useMemo(
    () => (variantSizes?.length ? variantSizes : null),
    [variantSizes]
  );
  const resolvedFormats = useMemo(
    () => (Array.isArray(formats) ? formats.filter(Boolean) : []),
    [formats]
  );

  if (!src) return null;

  const image = (
    <img
      src={fallbackSrc ?? src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      sizes={sizes}
      fetchPriority={fetchPriority}
      onLoad={() => setIsLoaded(true)}
      onError={() => setIsLoaded(true)}
      className={cn(
        "transition-opacity duration-500",
        fill ? "w-full h-full object-cover" : "w-full h-auto",
        isLoaded ? "opacity-100" : "opacity-0",
        imgClassName
      )}
    />
  );

  return (
    <div className={cn("relative overflow-hidden", fill && "w-full h-full", className)}>
      {!isLoaded && <Skeleton className={cn("absolute inset-0", skeletonClassName)} />}
      {resolvedVariants && resolvedFormats.length ? (
        <picture>
          {resolvedFormats.includes("avif") && (
            <source
              type="image/avif"
              srcSet={imageSrcSet(src, resolvedVariants, "avif")}
              sizes={sizes}
            />
          )}
          {resolvedFormats.includes("webp") && (
            <source
              type="image/webp"
              srcSet={imageSrcSet(src, resolvedVariants, "webp")}
              sizes={sizes}
            />
          )}
          {image}
        </picture>
      ) : (
        image
      )}
    </div>
  );
}
