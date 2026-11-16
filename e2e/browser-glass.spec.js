import { test, expect } from "@playwright/test";
import { isChromiumEngine } from "../src/lib/glassRenderer.js";

test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

test("only Chromium engine user agents select Vaso", () => {
  const agents = [
    ["Mozilla/5.0 AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36", true],
    ["Mozilla/5.0 AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0", true],
    ["Mozilla/5.0 HeadlessChrome/145.0.0.0 Safari/537.36", true],
    ["Mozilla/5.0 Gecko/20100101 Firefox/148.0", false],
    ["Mozilla/5.0 AppleWebKit/605.1.15 Version/26.4 Safari/605.1.15", false],
    ["Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 CriOS/145.0.0.0 Mobile Safari/604.1", false],
    ["Mozilla/5.0 (iPad) AppleWebKit/605.1.15 FxiOS/148.0 Mobile Safari/605.1.15", false],
    ["Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Chrome/145.0.0.0 Safari/605.1.15", false],
    ["", false],
  ];
  for (const [agent, expected] of agents) expect(isChromiumEngine(agent)).toBe(expected);
});

test("desktop glass uses the intended renderer and stays centred across routes", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of ["/", "/research"]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    if (path === "/") {
      await expect(page.locator(".neue-home")).toHaveAttribute("data-hero-intro", "complete", {
        timeout: 8000,
      });
    }
    const nav = page.locator(".liquid-nav-anchor");
    await expect(nav).toBeVisible();
    await expect.poll(async () => (await nav.boundingBox()).width).toBeGreaterThan(400);
    const bounds = await nav.boundingBox();
    expect(bounds.x + bounds.width / 2).toBeCloseTo(720, 0);
    for (const selector of [
      ".liquid-nav-anchor",
      ".liquid-github-anchor",
      ".liquid-ecosystem-anchor",
    ]) {
      const surface = page.locator(selector);
      await expect(surface).toBeVisible();
      const rect = await surface.boundingBox();
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(1441);
    }
    if (browserName === "chromium") {
      await expect(nav).toHaveAttribute("data-vaso-root", "");
      await expect(page.locator(".glass-frame")).toHaveCount(0);
    } else {
      await expect(page.locator("[data-vaso-root]")).toHaveCount(0);
      await expect(nav.locator(".glass__warp")).toHaveCount(1);
    }
    await nav.getByRole("link", { name: "Team", exact: true }).focus();
    await expect(nav.locator(".nav-hover-lens__glass")).toBeVisible();
    await nav.getByRole("link", { name: "Team", exact: true }).click();
    await expect(page).toHaveURL(/\/team$/);
  }
  expect(errors).toEqual([]);
});

test("Community retains its geometry and keyboard controls", async ({ page, browserName }) => {
  await page.goto("/research");
  const trigger = page.getByRole("button", { name: "Community", exact: true });
  await trigger.press("ArrowDown");
  const menu = page.getByRole("menu", { name: "Community", exact: true });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem").first()).toBeFocused();
  const nav = await page.locator(".liquid-nav-anchor").boundingBox();
  const panel = await page.locator(".community-glass").boundingBox();
  expect(panel.y).toBeGreaterThanOrEqual(nav.y + nav.height + 8);
  expect(panel.x + panel.width).toBeLessThanOrEqual(1440);
  if (browserName !== "chromium") await expect(page.locator("[data-vaso-root]")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.press("ArrowDown");
  await menu.getByRole("menuitem", { name: "News", exact: true }).click();
  await expect(page).toHaveURL(/\/community\/news$/);
  await expect(menu).toHaveCount(0);
});

test("ecosystem statistics use the selected renderer without moving the stain", async ({
  page,
  browserName,
}) => {
  await page.route("https://api.github.com/**", (route) => route.abort());
  await page.goto("/");
  await page
    .locator("#ecosystem")
    .evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(200);
  await page
    .getByRole("link", { name: "MEDomics, website", exact: true })
    .evaluate((el) => el.focus({ preventScroll: true }));
  await expect(page.locator(".neue-ecosystem")).toHaveClass(/is-open/);
  await expect(page.locator(".neue-stat-counts")).toBeVisible();
  const surface = page.locator(".neue-ecosystem-stain-glass");
  const rect = await surface.boundingBox();
  expect(rect.width).toBeGreaterThan(300);
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.x + rect.width).toBeLessThanOrEqual(1440);
  if (browserName === "chromium") await expect(surface).toHaveAttribute("data-vaso-root", "");
  else {
    await expect(surface.locator(".glass__warp")).toHaveCount(1);
    await expect(page.locator("[data-vaso-root]")).toHaveCount(0);
  }
});

test("phones keep the link bars hidden and the mobile menu usable", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".liquid-nav-anchor")).toBeHidden();
  for (const selector of [".liquid-github-anchor", ".liquid-ecosystem-anchor"]) {
    await expect(page.locator(selector)).toBeHidden();
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Main navigation" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/\/research$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  if (browserName !== "chromium") await expect(page.locator("[data-vaso-root]")).toHaveCount(0);
});
