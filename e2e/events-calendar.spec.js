import { expect, test } from "@playwright/test";
import events from "../src/data/events.json" with { type: "json" };

test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const items = events.flatMap((year) =>
  year.months.flatMap((month) =>
    month.items.map((item) => ({
      ...item,
      month: `${year.year}-${String(MONTHS.indexOf(month.month) + 1).padStart(2, "0")}`,
      year: year.year,
    }))
  )
);
const count = (keys) => new Set(keys).size;
const latest = items[0];
const card = (page, slug) => page.locator(`main a[href="/community/events/${slug}"]`);

test("events form a calendar of days, months and years", async ({ page }) => {
  await page.goto("/community/events");
  await expect(page.getByRole("heading", { level: 1, name: "Events" })).toBeAttached();
  await expect(page.locator(".evcal-card")).toHaveCount(items.length);
  await expect(card(page, latest.slug)).toBeInViewport();
  await expect(page.getByRole("scrollbar")).toHaveAttribute("aria-valuenow", "100");
  await expect(page.getByRole("button", { name: "Zoom in" })).toBeDisabled();

  const columns = page.locator("[data-column]");
  await expect(columns).toHaveCount(count(items.map((item) => item.date ?? item.month)));
  await expect(columns.last().locator("time").first()).toHaveAttribute("datetime", latest.date);

  await page.getByRole("button", { name: "Zoom out to months" }).click();
  await expect(columns).toHaveCount(count(items.map((item) => item.month)));
  await expect(columns.last()).toContainText(MONTHS[Number(latest.date.slice(5, 7)) - 1]);

  await page.getByRole("button", { name: "Zoom out to years" }).click();
  await expect(columns).toHaveCount(count(items.map((item) => item.year)));
  await expect(page.locator(".evcal-card")).toHaveCount(items.length);
  await expect(page.getByRole("button", { name: "Zoom out" })).toBeDisabled();
  await expect(page.getByText("Showing years")).toBeAttached();

  await page.getByRole("button", { name: "Zoom in to months" }).click();
  await page.getByRole("button", { name: "Zoom in to days" }).click();
  await expect(columns).toHaveCount(count(items.map((item) => item.date ?? item.month)));
});

test("cards show who took part as avatars, never by name", async ({ page }) => {
  const event = items.find((item) => item.contributors.length > 3);
  await page.goto("/community/events");
  const target = card(page, event.slug);
  await target.scrollIntoViewIfNeeded();
  await expect(target.locator(".evcal-bubble")).toHaveCount(event.contributors.length);
  await expect(target.locator(".evcal-card-people")).toBeVisible();
  const people = items
    .flatMap((item) => item.contributors)
    .filter((name) => name !== "MEDomicsLab");
  for (const name of new Set(people)) {
    await expect(page.locator(".evcal-timeline")).not.toContainText(name);
  }
  await expect(page.locator(".evcal-dock img")).toHaveCount(0);
});

test("the type filter beside the bar shows only the chosen kinds of event", async ({ page }) => {
  await page.goto("/community/events");
  const button = page.getByRole("button", { name: "Filter events by type" });
  await button.click();
  const menu = page.getByRole("group", { name: "Event types" });
  await expect(menu).toBeVisible();
  const theses = items.filter((item) => item.category === "Thesis Defenses");
  await menu.getByRole("button", { name: "Thesis Defenses" }).click();
  await expect(page.locator(".evcal-card")).toHaveCount(theses.length);
  await expect(menu.getByRole("button", { name: "Thesis Defenses" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await button.click();
  await page.getByRole("button", { name: "All events" }).click();
  await expect(page.locator(".evcal-card")).toHaveCount(items.length);
});

test("the bar leaves over the footer and returns over the calendar", async ({ page }) => {
  await page.goto("/community/events");
  const dock = page.locator(".evcal-dock");
  await expect(dock).not.toHaveAttribute("data-away");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(dock).toHaveAttribute("data-away", "true");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(dock).not.toHaveAttribute("data-away");
});

test("cards keep amie's four rows and show their event's pictures", async ({ page }) => {
  await page.goto("/community/events");
  const album = card(page, "2022-08-05-mini-putt");
  await album.scrollIntoViewIfNeeded();
  await expect(album).toHaveAttribute("data-span", "2");
  await expect(album.locator(".evcal-print img")).toHaveCount(3);
  await expect(album.locator(".evcal-print img").first()).toHaveAttribute(
    "src",
    "/images/albums/2022-08-05-mini-putt/mini-putt-1-640.webp"
  );
  const banner = card(
    page,
    "medfl-a-collaborative-framework-for-federated-learning-in-medicine-2025"
  );
  await expect(banner).toHaveAttribute("data-span", "1");
  await expect(banner.locator(".evcal-card-banner")).toHaveAttribute(
    "src",
    "/images/albums/2025-tcairem-SAHBI-presentation/tcairem-640.webp"
  );
  const heights = () =>
    page
      .locator('.evcal-card[data-span="1"]')
      .evaluateAll((cards) => [...new Set(cards.map((c) => Math.round(c.offsetHeight)))]);
  const [height] = await heights();
  expect(await heights()).toEqual([height]);
  await page.getByRole("button", { name: "Zoom out to months" }).click();
  await page.getByRole("button", { name: "Zoom out to years" }).click();
  await expect(page.locator("[data-column]")).toHaveCount(count(items.map((item) => item.year)));
  expect(await heights()).toEqual([height]);
});

test("an event opens in a dialog and closes back onto the calendar", async ({ page }) => {
  await page.goto("/community/events");
  await card(page, latest.slug).click();
  await expect(page).toHaveURL(`/community/events/${latest.slug}`);
  const dialog = page.getByRole("dialog", { name: latest.title });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 1, name: latest.title })).toBeVisible();
  await expect(dialog.getByRole("region", { name: "Event details" })).toContainText(latest.venue);
  await expect(dialog.getByRole("heading", { name: "Researchers", exact: true })).toBeVisible();
  await expect(dialog.locator(".prose")).toBeVisible();
  await expect(page.locator(".evcal")).toHaveCSS("background-color", "rgb(26, 26, 26)");
  await expect(page).toHaveTitle(new RegExp(`^${latest.title.slice(0, 20)}`));

  await page.keyboard.press("Escape");
  await expect(page).toHaveURL("/community/events");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(card(page, latest.slug)).toBeFocused();
  await expect(card(page, latest.slug)).toHaveAttribute("data-seen", "true");
});

test("a shared event link opens its dialog, and the arrows step through events", async ({
  page,
}) => {
  const previous = items[1];
  await page.goto(`/community/events/${latest.slug}`);
  const dialog = page.getByRole("dialog", { name: latest.title });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Next event" })).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(`/community/events/${previous.slug}`);
  await expect(page.getByRole("dialog", { name: previous.title })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page).toHaveURL("/community/events");
  await expect(card(page, previous.slug)).toBeInViewport();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test("the calendar sits below the navbar and keeps its zoom and type filter", async ({
    page,
  }) => {
    await page.goto("/community/events");
    const navbar = await page.locator(".mobile-nav-bar").boundingBox();
    const heading = await page.locator(".evcal-date-inner").first().boundingBox();
    expect(heading.y).toBeGreaterThanOrEqual(navbar.y + navbar.height);
    await expect(page.locator(".evcal-dock")).not.toHaveAttribute("data-away");
    const handle = await page.locator(".evcal-bar-handle").boundingBox();
    expect(handle.width).toBeGreaterThanOrEqual(80);
    await page.getByRole("button", { name: "Zoom out to months" }).click();
    await page.getByRole("button", { name: "Zoom out to years" }).click();
    await expect(page.locator("[data-column]")).toHaveCount(count(items.map((item) => item.year)));
    await page.getByRole("button", { name: "Filter events by type" }).click();
    const menu = page.getByRole("group", { name: "Event types" });
    await expect(menu).toBeInViewport({ ratio: 1 });
    await menu.getByRole("button", { name: "Lab Life" }).click();
    await expect(page.locator(".evcal-card")).toHaveCount(
      items.filter((item) => item.category === "Lab Life").length
    );
  });
});
