import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import theme from "../src/data/theme.json" with { type: "json" };
import { indexableRoutes, redirects, siteUrl } from "../src/lib/seo.js";

process.env.NODE_ENV = "production";
await build();
const cacheDir = resolve("node_modules/.cache");
await mkdir(cacheDir, { recursive: true });
const serverDir = await mkdtemp(resolve(cacheDir, "medomics-prerender-"));
try {
  await build({
    build: {
      ssr: "src/prerender.jsx",
      copyPublicDir: false,
      outDir: serverDir,
      rollupOptions: { output: { entryFileNames: "prerender.mjs" } },
    },
  });
  const { render } = await import(pathToFileURL(resolve(serverDir, "prerender.mjs")));
  const template = await readFile("dist/index.html", "utf8");
  for (const marker of ["<!--app-head-->", "<!--app-html-->", "<!--page-data-->"]) {
    if (!template.includes(marker)) throw new Error(`Missing prerender template marker: ${marker}`);
  }
  const variables = Object.entries(theme.cssVars)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
  for (const path of [
    ...indexableRoutes.map((route) => route.path),
    ...redirects.map((route) => route.path),
    "/404",
  ]) {
    const { html, head, markdown } = await render(path);
    const data = JSON.stringify(markdown).replace(/</g, "\\u003c");
    const page = template
      .replace("<!--app-head-->", () => `${head}\n<style>:root{${variables}}</style>`)
      .replace("<!--app-html-->", () => html)
      .replace(
        "<!--page-data-->",
        () => `<script id="page-data" type="application/json">${data}</script>`
      );
    const file = resolve("dist", path === "/" ? "index.html" : `${path.slice(1)}.html`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page);
  }
  const urls = indexableRoutes.map(
    ({ path }) => `  <url><loc>${new URL(path, siteUrl).href.replace(/&/g, "&amp;")}</loc></url>`
  );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`
  );
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  );
  console.log(
    `Prerendered ${indexableRoutes.length} public pages, ${redirects.length} redirects, and the 404 page.`
  );
} finally {
  await rm(serverDir, { recursive: true, force: true });
}
