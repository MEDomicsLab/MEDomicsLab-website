import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

const buildVariant = (src, size, format) => {
  if (!src) return src;
  const dotIndex = src.lastIndexOf(".");
  if (dotIndex === -1) return src;
  const base = src.slice(0, dotIndex);
  return `${base}-${size}.${format}`;
};

const AVATAR_VARIANT_SIZES = [80, 128, 160, 256];

const buildSrcSet = (src, sizes, format) =>
  sizes.map((size) => `${buildVariant(src, size, format)} ${size}w`).join(", ");

export default function AvatarImage({ src, alt, size, className, imgClassName, loading = "lazy" }) {
  const [isLoaded, setIsLoaded] = useState(false);
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
          srcSet={buildSrcSet(src, pixelSizes, "avif")}
          sizes={sizesAttribute}
        />
        <source
          type="image/webp"
          srcSet={buildSrcSet(src, pixelSizes, "webp")}
          sizes={sizesAttribute}
        />
        <img
          src={buildVariant(src, fallbackSize, "webp")}
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
