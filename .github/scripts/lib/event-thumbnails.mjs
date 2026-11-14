import sharp from "sharp";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { imageVariant } from "../../../src/lib/images.js";
import { EVENT_THUMB_WIDTH, markdownImages } from "../../../src/lib/markdownImages.js";

const RASTER = /\.(png|jpe?g|webp|gif)$/i;

export async function writeEventThumbnails(root, markdown) {
  const written = [];
  for (const { src } of markdownImages(markdown)) {
    const source = join(root, "public", src);
    if (!src.startsWith("/") || !RASTER.test(src) || !existsSync(source)) continue;
    const target = join(root, "public", imageVariant(src, EVENT_THUMB_WIDTH, "webp"));
    if (written.includes(target)) continue;
    await sharp(source)
      .rotate()
      .resize({ width: EVENT_THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(target);
    written.push(target);
  }
  return written;
}
