import { expect, test } from "@playwright/test";
import news from "../src/data/news.json" with { type: "json" };
import events from "../src/data/events.json" with { type: "json" };
import courses from "../src/data/courses.json" with { type: "json" };

test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

const timelines = [
  { title: "News", path: "/community/news", data: news },
  { title: "Events", path: "/community/events", data: events },
];

for (const { title, path, data } of timelines) {
  test(`${title} shares publication styling while preserving the timeline, filters and details`, async ({
    page,
  }) => {
    const items = data.flatMap((year) => year.months.flatMap((month) => month.items));
    const firstYear = data[0];
    const firstMonth = firstYear.months[0];
    const firstItem = firstMonth.items[0];
    await page.goto(path);
    await expect(page.getByRole("heading", { name: title, exact: true })).toHaveCSS(
      "font-family",
      '"Homepage Neue Montreal", sans-serif'
    );
    await expect(page.locator(".neue-interior-layout")).toHaveCSS(
      "background-color",
      "rgb(26, 26, 26)"
    );
    await expect(page.locator(".entry-row")).toHaveCount(items.length);
    const ticks = page.locator(".section-ticks");
    await expect(ticks).toBeVisible();
    await ticks.getByRole("button", { name: firstYear.year, exact: true }).click();
    await expect(ticks.getByRole("button", { name: firstYear.year, exact: true })).toHaveAttribute(
      "aria-current",
      "true"
    );
    await ticks.getByRole("button", { name: firstMonth.month, exact: true }).click();
    await expect
      .poll(() =>
        page
          .getByRole("heading", { name: firstMonth.month, exact: true })
          .first()
          .evaluate((el) => Math.round(el.getBoundingClientRect().top))
      )
      .toBe(128);
    await expect(ticks).toHaveCSS("opacity", "1");

    const matching = items.filter((item) => item.category === firstItem.category);
    const filter = page.getByRole("button", {
      name: `${firstItem.category} ${matching.length}`,
      exact: true,
    });
    await filter.click();
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expect(filter).toHaveCSS("color", "rgb(26, 26, 26)");
    await expect(filter).toHaveCSS("cursor", "pointer");
    await expect(page.locator(".entry-row")).toHaveCount(matching.length);
    await expect(page.locator(".entry-row-title")).toHaveText(matching.map((item) => item.title));
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator(".entry-row")).toHaveCount(items.length);

    await page.locator(`main a[href="${path}/${firstItem.slug}"]`).click();
    await expect(page).toHaveURL(`${path}/${firstItem.slug}`);
    await expect(page.locator("h1")).toHaveText(firstItem.title);
    await expect(page.locator(".community-detail .prose")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Researchers", exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.getByRole("link", { name: `Back to ${title}`, exact: true }).click();
    await expect(page).toHaveURL(path);
  });
}

test("Courses uses collection rows and institution filters without a sidebar", async ({ page }) => {
  await page.goto("/community/courses");
  await expect(page.locator(".courses-index")).toBeVisible();
  await expect(page.locator(".section-ticks")).toHaveCount(0);
  await expect(page.locator(".entry-row")).toHaveCount(courses.length);
  await expect(page.locator(".collection-group-title")).toHaveText(["McGill", "Sherbrooke"]);
  const mcgill = courses.filter((course) => course.institution === "McGill");
  await page.getByRole("button", { name: `McGill ${mcgill.length}`, exact: true }).click();
  await expect(page.locator(".entry-row")).toHaveCount(mcgill.length);
  await expect(page.locator(".entry-row").first()).toContainText(mcgill[0].sessions.join(" · "));
  await page.locator(".entry-row").first().click();
  await expect(page.locator(".community-detail h1")).toHaveText(mcgill[0].title);
  await expect(page.locator(".community-detail .prose")).toBeVisible();
  await expect(page.locator(".section-ticks")).toHaveCount(0);
  await page.getByRole("link", { name: "Back to Courses", exact: true }).click();
  await expect(page.locator(".entry-row")).toHaveCount(courses.length);
});

test("community collections and their details fit narrow screens", async ({ page }) => {
  const routes = [
    "/community/news",
    `/community/news/${news[0].months[0].items[0].slug}`,
    "/community/events",
    `/community/events/${events[0].months[0].items[0].slug}`,
    "/community/courses",
    `/community/courses/${courses[0].slug}`,
  ];
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of routes) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".neue-interior-layout")).toHaveCount(1);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
        .toBeLessThanOrEqual(1);
      await expect(page.locator("footer.neue-footer")).toHaveCount(1);
      const more = page.getByRole("button", { name: "More", exact: true });
      if (await more.count()) {
        await more.click();
        await expect(page.getByRole("group", { name: "More filters", exact: true })).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
        ).toBeLessThanOrEqual(1);
        const bounds = await page.getByRole("group", { name: "More filters" }).boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(16);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width - 16);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("group", { name: "More filters" })).toHaveCount(0);
      }
    }
  }
});
