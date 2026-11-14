import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sharp from "sharp";
import { imageVariant } from "./src/lib/images.js";
import { EVENT_THUMB_WIDTH, markdownImages } from "./src/lib/markdownImages.js";
import { getSiteRoute } from "./src/lib/seo.js";

const eventMedia = () => {
  let publicDir;
  return {
    name: "event-media",
    enforce: "pre",
    configResolved(config) {
      publicDir = config.publicDir;
    },
    async load(id) {
      if (!id.endsWith(".md?media")) return null;
      const pictures = [];
      for (const picture of markdownImages(readFileSync(id.slice(0, -"?media".length), "utf8"))) {
        const file = resolve(publicDir, `.${picture.src}`);
        if (picture.src.startsWith("/") && existsSync(file)) {
          const { width, height, orientation = 1 } = await sharp(file).metadata();
          [picture.width, picture.height] = orientation >= 5 ? [height, width] : [width, height];
          const thumb = imageVariant(picture.src, EVENT_THUMB_WIDTH, "webp");
          if (existsSync(resolve(publicDir, `.${thumb}`))) picture.thumb = thumb;
        }
        pictures.push(picture);
      }
      return `export default ${JSON.stringify(pictures)};`;
    },
  };
};

export default defineConfig({
  plugins: [
    eventMedia(),
    react(),
    tailwindcss(),
    {
      name: "static-preview-routing",
      configurePreviewServer(server) {
        const directory = resolve(server.config.build.outDir);
        server.middlewares.use((request, response, next) => {
          if (!["GET", "HEAD"].includes(request.method)) return next();
          const url = new URL(request.url, "http://localhost");
          const route = getSiteRoute(url.pathname.replace(/\.html$/, ""));
          if (route?.redirect || (route && route.path !== url.pathname)) {
            response.writeHead(308, { Location: route.redirect || `${route.path}${url.search}` });
            response.end();
            return;
          }
          let pathname;
          try {
            pathname = decodeURI(url.pathname);
          } catch (error) {
            if (!(error instanceof URIError)) throw error;
            response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
            response.end(request.method === "HEAD" ? undefined : "Invalid URL encoding.");
            return;
          }
          const file = resolve(directory, `.${pathname}`);
          if (
            route ||
            (file.startsWith(`${directory}${sep}`) && existsSync(file) && statSync(file).isFile())
          )
            return next();
          response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          response.end(
            request.method === "HEAD" ? undefined : readFileSync(resolve(directory, "404.html"))
          );
        });
      },
    },
  ],
});
