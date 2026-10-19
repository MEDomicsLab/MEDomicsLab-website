import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { imageVariant } from "../src/lib/images.js";
import home from "../src/data/home.json" with { type: "json" };
import team from "../src/data/team.json" with { type: "json" };

const jobs = new Map();
const add = (src, sizes) => jobs.set(src, sizes);
add("/images/homepage.jpg", [640, 1280]);
add(home.brand.lightLogoUrl, [160, 320]);
add(home.brand.logoUrl, [80, 128]);
add("/images/homepage-neue/MEDomics-white.png", [80, 160]);
const pi = team.find((group) => group.year === "Lab Principal Investigator").members[0];
for (const appointment of pi.appointments) {
  if (!appointment.logo.endsWith(".svg")) add(appointment.logo, [128, 256]);
}
for (const folder of ["ecosystem", "next"]) {
  for (const file of await readdir(`public/images/homepage-neue/${folder}`)) {
    if (!file.endsWith(".webp") || /-\d+\.webp$/.test(file)) continue;
    add(
      `/images/homepage-neue/${folder}/${file}`,
      folder === "ecosystem" ? [360, 720] : [480, 880]
    );
  }
}
for (const [src, sizes] of jobs) {
  for (const width of sizes) {
    await sharp(`public${src}`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`public${imageVariant(src, width, "webp")}`);
  }
}
console.log(`Generated responsive WebP variants for ${jobs.size} homepage images.`);
