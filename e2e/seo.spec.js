import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { indexableRoutes, siteUrl, getPageMetadata, getSiteRoute } from "../src/lib/seo.js";
import seo from "../src/data/seo.json" with { type: "json" };
import layout from "../src/data/layout.json" with { type: "json" };

async function parseHtml(page, html) {
  return page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, "text/html");
    return {
      titles: [...doc.querySelectorAll("title")].map((node) => node.textContent),
      descriptions: [...doc.querySelectorAll('meta[name="description"]')].map(
        (node) => node.content
      ),
      canonicals: [...doc.querySelectorAll('link[rel="canonical"]')].map((node) =>
        node.getAttribute("href")
      ),
      robots: doc.querySelector('meta[name="robots"]')?.content,
      image: doc.querySelector('meta[property="og:image"]')?.content,
      schema: [...doc.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
        JSON.parse(node.textContent)
      ),
      headings: [...doc.querySelectorAll("#root h1")].map((node) => node.textContent),
      article: doc.querySelector(".prose")?.textContent,
      root: doc.querySelector("#root")?.textContent,
      pageData: JSON.parse(doc.querySelector("#page-data")?.textContent ?? "{}"),
      refresh: doc.querySelector('meta[http-equiv="refresh"]')?.content,
    };
  }, html);
}

test("every indexable URL ships unique metadata and its content without running JavaScript", async ({
  request,
  page,
}) => {
  test.slow();
  const titles = new Set();
  const descriptions = new Set();
  const images = new Set();
  for (const route of indexableRoutes) {
    const response = await request.get(route.path);
    expect(response.status(), route.path).toBe(200);
    const html = await response.text();
    expect(html, route.path).not.toContain("<!--app-");
    const data = await parseHtml(page, html);
    const canonical = new URL(route.path, siteUrl).href;
    expect(data.titles, route.path).toHaveLength(1);
    expect(data.titles[0], route.path).toContain(
      route.record?.title || route.record?.name || route.title
    );
    expect(data.titles[0], route.path).toMatch(/ \| MEDomicsLab$/);
    expect(titles.has(data.titles[0]), `duplicate title: ${route.path}`).toBe(false);
    titles.add(data.titles[0]);
    expect(data.descriptions, route.path).toHaveLength(1);
    expect(data.descriptions[0].length, route.path).toBeGreaterThan(20);
    expect(descriptions.has(data.descriptions[0]), `duplicate description: ${route.path}`).toBe(
      false
    );
    descriptions.add(data.descriptions[0]);
    expect(data.canonicals, route.path).toEqual([canonical]);
    expect(data.robots, route.path).toBe("index, follow");
    expect(data.headings.length, route.path).toBeGreaterThan(0);
    expect(data.headings, route.path).not.toContain("Page not found");
    if (route.record) {
      const heading = (route.record.title || route.record.name).toLowerCase();
      expect(
        data.headings.some((text) => text.trim().toLowerCase() === heading),
        route.path
      ).toBe(true);
    }
    expect(data.root.length, route.path).toBeGreaterThan(100);
    expect(data.schema, route.path).toHaveLength(1);
    expect(data.schema[0].url, route.path).toBe(canonical);
    expect(data.schema[0]["@context"]).toBe("https://schema.org");
    const portrait =
      route.type === "ProfilePage"
        ? route.record.image?.replace(/\.[^.]+$/, "-256.webp")
        : route.record?.image;
    const expectedImage = new URL(route.record?.coverImage?.url || portrait || seo.image, siteUrl)
      .href;
    expect(data.image, route.path).toBe(expectedImage);
    images.add(new URL(data.image).pathname);
    if (route.record?.markdown) {
      expect(data.article?.trim().length, `article missing: ${route.path}`).toBeGreaterThan(0);
      expect(Object.keys(data.pageData)).toEqual([route.record.markdown]);
    }
    if (route.type === "Event" && route.record.date) {
      expect(data.schema[0].startDate).toBe(route.record.date);
    }
    if (route.type === "Course") {
      expect(data.schema[0].provider.name).toBe(route.record.institution);
    }
    if (route.path === "/") {
      expect(data.schema[0].sameAs).toEqual(layout.footer.social.links.map((link) => link.href));
    }
  }
  for (const image of images) {
    const response = await request.head(image);
    expect(response.status(), image).toBe(200);
    expect(response.headers()["content-type"], image).toMatch(/^image\//);
  }
});

test("sitemap and robots advertise exactly the canonical, indexable routes", async ({
  request,
  page,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  const sitemap = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, "application/xml");
    return {
      error: doc.querySelector("parsererror")?.textContent,
      urls: [...doc.querySelectorAll("loc")].map((node) => node.textContent),
    };
  }, xml);
  expect(sitemap.error).toBeUndefined();
  expect(sitemap.urls.sort()).toEqual(
    indexableRoutes.map(({ path }) => new URL(path, siteUrl).href).sort()
  );
  expect(new Set(sitemap.urls).size).toBe(sitemap.urls.length);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
  expect(await robots.text()).toContain("Allow: /");
});

for (const path of [
  "/not-a-real-page",
  "/team/not-a-member",
  "/research/extra/medomics-platform",
]) {
  test(`unknown route is a non-indexable 404: ${path}`, async ({ request, page }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    const data = await parseHtml(page, await response.text());
    expect(data.titles).toEqual(["Page not found | MEDomicsLab"]);
    expect(data.robots).toBe("noindex, follow");
    expect(data.canonicals).toEqual([]);
    expect(data.schema).toEqual([]);
    expect(getPageMetadata(path).indexable).toBe(false);
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
}

test("trailing slashes and tracking parameters do not create another canonical URL", async ({
  page,
}) => {
  await page.goto("/research/?utm_source=seo-check#projects");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}/research`
  );
  expect(getPageMetadata("/research/").canonicalUrl).toBe(`${siteUrl}/research`);
});

test("preview rejects malformed URL encoding without a server error", async ({ request }) => {
  const response = await request.get("/invalid%ZZ");
  expect(response.status()).toBe(400);
  expect(await response.text()).toBe("Invalid URL encoding.");
});

test("event content is available only at its current location, without publication aliases", async ({
  page,
  request,
}) => {
  const events = indexableRoutes.filter(
    (route) =>
      route.type === "Event" &&
      !indexableRoutes.some((other) => other.path === `/publications/${route.record.slug}`)
  );
  expect(events.length).toBeGreaterThan(0);
  for (const route of events) {
    const oldPath = `/publications/${route.record.slug}`;
    expect(getSiteRoute(oldPath), oldPath).toBeNull();
    await expect(readFile(`dist${oldPath}.html`, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
    const response = await request.get(oldPath, { maxRedirects: 0 });
    expect(response.status(), oldPath).toBe(404);
    expect(response.headers().location, oldPath).toBeUndefined();
    const data = await parseHtml(page, await response.text());
    expect(data.refresh).toBeUndefined();
    expect(data.canonicals).toEqual([]);
    expect(data.robots).toBe("noindex, follow");
    expect(getPageMetadata(oldPath).indexable).toBe(false);
    const current = await request.get(route.path, { maxRedirects: 0 });
    expect(current.status(), route.path).toBe(200);
  }

  const oldPath = `/publications/${events[0].record.slug}`;
  await page.goto(oldPath);
  await expect(
    page.getByRole("heading", { name: "Publication Not Found", exact: true })
  ).toBeVisible();
  await expect(page).toHaveURL(new URL(oldPath, page.url()).href);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await page.goto(events[0].path);
  await expect(
    page.getByRole("heading", { name: events[0].record.title, exact: true })
  ).toBeVisible();
});

const sample = indexableRoutes.filter((route) => !route.record);
for (const type of new Set(indexableRoutes.map((route) => route.type).filter(Boolean))) {
  sample.push(indexableRoutes.find((route) => route.type === type));
}
for (const route of sample) {
  test(`rendered metadata agrees with the initial HTML: ${route.path}`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route.path);
    await page.evaluate(() => document.fonts.ready);
    const meta = getPageMetadata(route.path);
    await expect(page).toHaveTitle(meta.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", meta.canonicalUrl);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      meta.description
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", meta.image);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
    expect(
      JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())
    ).toEqual(meta.schema);
    expect(errors).toEqual([]);
  });
}

test("client navigation updates metadata rather than retaining the previous page", async ({
  page,
}) => {
  await page.goto("/team/martin-vallieres");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Research" })
    .click();
  await expect(page).toHaveTitle("Research | MEDomicsLab");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}/research`
  );
  await page.goBack();
  await expect(page).toHaveTitle("Martin Vallières | MEDomicsLab");
});

test.describe("JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });
  for (const path of [
    "/",
    "/research/medomics-platform",
    "/team/martin-vallieres",
    "/community/news",
  ]) {
    test(`content remains readable: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("body")).toHaveCSS("background-color", "rgb(26, 26, 26)");
      if (path === "/research/medomics-platform")
        await expect(page.locator(".prose")).toBeVisible();
    });
  }
});
