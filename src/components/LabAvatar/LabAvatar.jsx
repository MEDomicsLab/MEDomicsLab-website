import homeData from "../../data/home.json";
import { imageSrcSet, imageVariant } from "../../lib/images";
import { cn } from "../../lib/utils";

const LOGO = homeData.brand.logoUrl;

export default function LabAvatar({ size, className }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#262626]",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={imageVariant(LOGO, 80, "webp")}
        srcSet={imageSrcSet(LOGO, [80, 128], "webp")}
        sizes={`${size}px`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="h-[78%] w-[78%] object-contain"
      />
    </span>
  );
}
