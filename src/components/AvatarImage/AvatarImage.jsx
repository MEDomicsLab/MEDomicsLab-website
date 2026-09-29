import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import { imageSrcSet, imageVariant } from "../../lib/images";

const AVATAR_VARIANT_SIZES = [80, 128, 160, 256];

export default function AvatarImage({ src, alt, size, className, imgClassName, loading = "lazy" }) {
  const [isLoaded, setIsLoaded] = useState(import.meta.env.SSR);
  const pixelSizes = useMemo(
    () => AVATAR_VARIANT_SIZES.filter((variantSize) => variantSize >= size),
    [size]
  );
  const sizesAttribute = `${size}px`;
  const fallbackSize = pixelSizes[0] ?? AVATAR_VARIANT_SIZES.at(-1);

  if (!src) return null;

  return (
    <div
      className={cn("relative overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      {!isLoaded && <Skeleton className="absolute inset-0 rounded-full" />}
      <picture>
        <source
          type="image/avif"
          srcSet={imageSrcSet(src, pixelSizes, "avif")}
          sizes={sizesAttribute}
        />
        <source
          type="image/webp"
          srcSet={imageSrcSet(src, pixelSizes, "webp")}
          sizes={sizesAttribute}
        />
        <img
          src={imageVariant(src, fallbackSize, "webp")}
          sizes={sizesAttribute}
          alt={alt}
          width={size}
          height={size}
          loading={loading}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      </picture>
    </div>
  );
}
