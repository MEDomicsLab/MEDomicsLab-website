import { readFile, readdir } from "node:fs/promises";
import { writeEventThumbnails } from "../.github/scripts/lib/event-thumbnails.mjs";

const directory = "src/content/community/events";
let count = 0;
for (const file of await readdir(directory)) {
  if (!file.endsWith(".md")) continue;
  const written = await writeEventThumbnails(".", await readFile(`${directory}/${file}`, "utf8"));
  count += written.length;
}
console.log(`Generated calendar thumbnails for ${count} event pictures.`);
