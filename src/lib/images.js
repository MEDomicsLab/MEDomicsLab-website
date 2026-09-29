export const imageVariant = (src, size, format) => {
  if (!src) return src;
  const dotIndex = src.lastIndexOf(".");
  if (dotIndex === -1) return src;
  return `${src.slice(0, dotIndex)}-${size}.${format}`;
};

export const imageSrcSet = (src, sizes, format) =>
  sizes.map((size) => `${imageVariant(src, size, format)} ${size}w`).join(", ");
