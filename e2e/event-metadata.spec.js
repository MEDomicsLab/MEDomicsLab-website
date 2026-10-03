import { expect, test } from "@playwright/test";
import events from "../src/data/events.json" with { type: "json" };
import news from "../src/data/news.json" with { type: "json" };

test.use({ timezoneId: "America/Toronto", reducedMotion: "reduce" });

test("every event displays its available logistics in the sidebar", async ({ page }) => {
  for (const year of events) {
    for (const month of year.months) {
      for (const item of month.items) {
        await page.goto(`/community/events/${item.slug}`);
        const details = page.getByRole("region", { name: "Event details" });
        await expect(details).toBeVisible();
        await expect(details).toContainText(item.kind || item.category);
        if (item.date) {
          await expect(details.locator("time").first()).toHaveAttribute("datetime", item.date);
          await expect(details.locator("time").first()).toHaveText(
            new Intl.DateTimeFormat("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${item.date}T00:00:00Z`))
          );
        } else {
          await expect(details.locator("time")).toHaveCount(0);
        }
        if (item.venue) await expect(details).toContainText(item.venue);
        await expect(details.locator("dt")).toHaveText([
          ...(item.date ? ["Date"] : []),
          "Type",
          ...(item.venue ? ["Venue"] : []),
        ]);
        await expect(details.getByRole("link")).toHaveCount(0);
        await expect(
          page.locator(".prose").getByRole("heading", { name: "Date", exact: true })
        ).toHaveCount(0);
      }
    }
  }
});

test("event metadata fits narrow screens and omits dates without an exact day", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/community/events/annual-symposium-2024");
  const details = page.getByRole("region", { name: "Event details" });
  await expect(details.locator("dt")).toHaveText(["Type", "Venue"]);
  await expect(details.locator("time")).toHaveCount(0);
  await expect(details).toContainText("McGill University (hybrid attendance)");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
});

test("news about an event can display date, type, and venue", async ({ page }) => {
  await page.goto("/community/news/2026-09-29-mila-digital-health");
  const details = page.getByRole("region", { name: "Event details" });
  await expect(details.locator("dt")).toHaveText(["Date", "Type", "Venue"]);
  await expect(details.locator("dd")).toHaveText([
    "September 29, 2026",
    "Community of practice",
    "Mila, Montréal",
  ]);
  await expect(details.getByRole("link")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Back to News", exact: true })).toBeVisible();
  await page.goto("/community/news/2026-09-22-mariem-msc");
  await expect(details.locator("dt")).toHaveText(["Date", "Type", "Venue"]);
  await expect(details.locator("dd")).toHaveText([
    "August 27, 2026",
    "Thesis defense (MSc)",
    "Université de Sherbrooke, room D4-2011 (hybrid via Teams)",
  ]);
  await page.goto("/community/news/2024-08-20-mall-msc");
  await expect(page.getByRole("region", { name: "News details" })).toContainText("August 20, 2024");
});

test("news shows sourced dates and omits unknown dates", async ({ page }) => {
  for (const item of news.flatMap((year) => year.months.flatMap((month) => month.items))) {
    await page.goto(`/community/news/${item.slug}`);
    const metadata = item.event || item;
    const details = page.getByRole("region", {
      name: item.event ? "Event details" : "News details",
    });
    if (metadata.date) {
      await expect(details.locator("time").first()).toHaveAttribute("datetime", metadata.date);
      await expect(details.getByRole("link")).toHaveCount(0);
    } else {
      await expect(details).toHaveCount(0);
    }
  }
});
