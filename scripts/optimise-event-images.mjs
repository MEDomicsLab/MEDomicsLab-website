import sharp from "sharp";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { imageVariant } from "../src/lib/images.js";
import { EVENT_THUMB_WIDTH, markdownImages } from "../src/lib/markdownImages.js";

const directory = "src/content/community/events";
const sources = new Set();
for (const file of await readdir(directory)) {
  if (!file.endsWith(".md")) continue;
  for (const { src } of markdownImages(await readFile(`${directory}/${file}`, "utf8"))) {
    if (src.startsWith("/") && existsSync(`public${src}`)) sources.add(src);
  }
}
for (const src of sources) {
  await sharp(`public${src}`)
    .rotate()
    .resize({ width: EVENT_THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`public${imageVariant(src, EVENT_THUMB_WIDTH, "webp")}`);
}
console.log(`Generated calendar thumbnails for ${sources.size} event pictures.`);
